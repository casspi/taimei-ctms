import type { Menu } from '@/types'

import curl from '../curl'

// 列表
export const reqMenuList = (data?: { name?: string; parentId?: string }) =>
  curl(`menu`, data).then<Menu[]>((res) => {
    return JSON.parse(JSON.stringify(res || []).replaceAll('"childList":', '"children":'))
  })

// 详情
export const reqMenuInfo = (data: Pick<Menu, 'id'>) => curl(`menu/{id}`, data)

// 新增
export const doMenuCreate = (data: Partial<Menu>) =>
  curl(
    'menu',
    {
      ...data,
      type: 1,
    },
    { method: 'POST' },
  )

// 修改
export const doMenuUpdate = (data: Partial<Menu>) => curl('menu', data, { method: 'PUT' })

// 删除
export const doMenuDelete = (data: Pick<Menu, 'id'>) =>
  curl(`menu/{id}`, data, { method: 'DELETE' })

// 根据角色查询路由菜单
export const reqMenuListByRoleId = (data: { roleId: string }) =>
  curl(`role/menu/all/{roleId}`, data).then<Menu[]>((res) => {
    return JSON.parse(JSON.stringify(res || []).replaceAll('"childList":', '"children":'))
  })
