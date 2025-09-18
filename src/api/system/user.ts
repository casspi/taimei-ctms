import type { PagingParams, PagingResult, TreeItem, User } from '@/types'

import curl from '../curl'

// 单位
export const reqUserUnitTree = () =>
  curl<TreeItem[]>(`auth/unit/userUnitTree`, {}, { method: 'POST' })

// 部门
export const reqUserDepartmentTree = (data: { unitId: string }) =>
  curl<TreeItem[]>(`auth/user/departmentTree`, data)

// 列表
export const reqUserList = (
  data: PagingParams<
    Partial<{ departmentId: string; unitId: string; name: string; status: string }>
  >,
) => curl<PagingResult<User>>(`auth/user/executeQuery`, data)

// 详情
export const reqUserInfo = (data: { id: string }) =>
  curl(`auth/user/updatePage`, data, { method: 'POST', isStringify: true })

// 新增
export const doUserCreate = (data: Partial<User>) =>
  curl<User>('auth/user', data, { method: 'POST', isStringify: true })

// 修改
export const doUserUpdate = (data: Partial<User>) =>
  curl<User>('auth/user', { ...data, _method: 'PUT' }, { method: 'POST', isStringify: true })

// 删除
export const doUserDelete = (data: Pick<User, 'id'>) =>
  curl('auth/user', { ...data, _method: 'DELETE' }, { method: 'POST', isStringify: true })

// 用户批量启用
export const doUserEnable = (
  data: Partial<{
    keyword: string
    name: string
    departmentId: string
    unitId: string
    selectAll: boolean
    status: string
    ids: string[]
  }>,
) => curl(`web/auth/user/batch/enable`, data, { method: 'PUT' })

// 用户批量停用
export const doUserDisable = (
  data: Partial<{
    keyword: string
    name: string
    departmentId: string
    unitId: string
    selectAll: boolean
    status: string
    ids: string[]
  }>,
) => curl(`web/auth/user/batch/disable`, data, { method: 'PUT' })
