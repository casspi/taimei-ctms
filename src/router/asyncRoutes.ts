import { RouterView } from 'vue-router'

import {
  //reqMenuList,
  reqMenuListByRoleId,
} from '@/api'
import { LayoutView } from '@/layout'
import { usePermissionStore, useUserinfoStore } from '@/stores'
import type { Menu } from '@/types'

import { router } from './router'

const modules = import.meta.glob('@/views/**/*.vue')

export let isLoadAsyncRoutesFlag = false

export const resetLoadAsyncFlag = () => (isLoadAsyncRoutesFlag = false)

export const loadAsyncRoutes = async () => {
  const { userinfo } = useUserinfoStore()
  const { roleId } = userinfo ?? {}
  if (!roleId) return

  // const menus1 = await reqMenuList()
  const menus = await reqMenuListByRoleId({ roleId })

  // 权限
  const { updatePermissions } = usePermissionStore()
  updatePermissions(menus)

  const loop = (data: Menu[]) => {
    return data
      .filter((item) => item.functionType === '1' && !item.hidden)
      .map((item) => {
        // eslint-disable-next-line prefer-const
        let { path, icon, title, parentId, component: componentPath, image } = item
        let children: any
        if (item.children?.length) {
          children = loop(item.children)
        }

        let component: any
        if (parentId) {
          // 非一级菜单
          if (children?.length) {
            // 有子菜单
            component = RouterView
            path = children[0].path
          } else {
            // 无子菜单
            component = modules[`/src${componentPath}`]
          }
        } else {
          // 一级菜单
          if (children?.length) {
            // 有子菜单
            component = LayoutView
            path = children[0].path
          } else {
            component = modules[`/src${componentPath}`]
          }
        }

        if (parentId && !modules[`/src${componentPath}`]) {
          console.log('component => ', componentPath)
        }

        return {
          path,
          component,
          meta: { title, icon, image },
          children,
        }
      })
      .filter((item) => !!item.component)
  }

  const routes = loop(menus)
  routes.forEach((item) => router.addRoute(item))
  router.options.routes = [...router.options.routes, ...routes]

  isLoadAsyncRoutesFlag = true
}
