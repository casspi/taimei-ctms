import { pascalCase } from '@daysnap/utils'
import type { RouteRecordRaw } from 'vue-router'

import { doMenuCreate, doMenuDelete, reqMenuList } from '@/api'
import { codeOptions } from '@/stores'
import type { Menu } from '@/types'

export async function deleteMenuFunctions() {
  const menus = await reqMenuList()
  const permissions: string[] = []
  const loop = (data: Menu[]) => {
    data.forEach((item) => {
      if (item.functionType === '2') {
        permissions.push(item.id)
      }
      if (item.children) {
        loop(item.children)
      }
    })
  }
  loop(menus)
  await Promise.all(permissions.map(async (id) => doMenuDelete({ id })))
}

export async function createMenuFunctions() {
  const data = await reqMenuList()
  const menus = data.map((item) => item.children || []).flat()
  const tasks = codeOptions.slice(1).map(async (item, index) => {
    const { value, label } = item
    const [title] = label.split('-')
    const menu = menus.find((item) => item.title == title)
    if (menu) {
      const options = {
        title: label,
        parentId: menu.id,
        functionType: '2',
        index,
        code: value,
      }
      await doMenuCreate(options)
      console.log('options => ', options)
    } else {
      console.error(`没有找到${label}`)
    }
  })
  await Promise.all(tasks)
}

export async function createMenus() {
  const source = import.meta.glob<any>('@/router/modules/*.ts', { eager: true })
  const modules: RouteRecordRaw[] = []

  Object.entries(source).forEach(([key, value]) => {
    if (!key.includes('common')) {
      modules.push(...(value.default || []))
    }
  })

  modules.sort((a, b) => (a.sort ?? 0) - (b.sort ?? 0))

  async function createGroupMenu(route: RouteRecordRaw, index: number) {
    const { title, icon } = route.meta || {}
    const data = await reqMenuList()
    const menu = data.find((item) => item.title == title)
    if (!menu) {
      // 创建
      await doMenuCreate({
        title,
        icon,
        parentId: '',
        functionType: '1',
        index,
        image:
          'https://gyzj.gongyujjh.org.cn/home/upload/ff8080818d3f115f018d4efe3c4201ca/icon-science.png',
        path: '',
        hidden: false,
      })
      return createGroupMenu(route, index)
    }
    const { id: parentId } = menu

    if (route.children) {
      const tasks = route.children.map((item, index) => {
        const { path, meta } = item
        const { title } = meta || {}
        const [filename, ...rest] = path.split('/').filter(Boolean).reverse()

        const options = {
          parentId,
          path,
          title,
          functionType: '1',
          index,
          hidden: false,
          component: `/views/${rest.reverse().join('/')}/${pascalCase(filename)}View.vue`,
        }

        return doMenuCreate(options)
      })
      await Promise.all(tasks)
    }
  }

  await Promise.all(modules.map((route, index) => createGroupMenu(route, index)))

  ElMessage.success('操作成功')
}

export async function deleteMenus() {
  const data = await reqMenuList()

  async function removeGroupMenus(menu: Menu) {
    const { id, children } = menu

    if (children?.length) {
      await Promise.all(children.map((item) => doMenuDelete({ id: item.id })))
    }

    await doMenuDelete({ id })
  }

  await Promise.all(data.map((item) => removeGroupMenus(item)))

  ElMessage.success('操作成功')
}
