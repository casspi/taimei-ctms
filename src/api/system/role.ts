import type { Menu, PagingParams, PagingResult, Role } from '@/types'

import curl from '../curl'

// 列表
export const reqRoleList = (data: PagingParams) =>
  curl<PagingResult<Role>>('auth/role/executeQuery', data)

// 详情
export const reqRoleInfo = (data: Pick<Role, 'id'>) =>
  curl<Role>(`auth/role/updatePage`, data, { method: 'POST', isStringify: true })

// 新增
export const doRoleCreate = (data: Partial<Role>) =>
  curl<Role>(`auth/role`, data, {
    isStringify: true,
    method: 'POST',
  })

// 修改
export const doRoleUpdate = (data: Partial<Role>) =>
  curl<Role>('auth/role', { ...data, _method: 'PUT' }, { method: 'POST', isStringify: true })

// 删除
export const doRoleDelete = (data: Pick<Role, 'id'>) =>
  curl('auth/role', { ...data, _method: 'DELETE' }, { method: 'POST', isStringify: true })

// 授权
export const doRoleAuthMenus = (data: { functionList: string[]; roleId: string }) =>
  curl('role/menu', data, { method: 'POST' })

// 查询授权
export const reqRoleAuthMenus = (data: { roleId: string }) => curl('role/menu/{roleId}', data)

// 获取所有菜单以及功能
export const reqRoleAllMenus = () =>
  curl<Menu[]>(`role/menu/all`).then((res) => {
    return JSON.parse(JSON.stringify(res).replaceAll('"childList":', '"children":'))
  })
