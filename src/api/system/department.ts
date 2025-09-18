import type { Department, TreeItem } from '@/types'

import curl from '../curl'

// 列表
export const reqDepartmentList = (data: { unitId: string }) =>
  curl<TreeItem[]>(`auth/department/departmentTree`, data).then((res) => res ?? [])

// 详情
export const reqDepartmentInfo = (data: Pick<Department, 'id'>) =>
  curl<Department>(`auth/department/detailPage`, data, { method: 'POST', isStringify: true })

// 新增
export const doDepartmentCreate = (data: Partial<Department>) =>
  curl<Department>('auth/department', data, { method: 'POST', isStringify: true })

// 修改
export const doDepartmentUpdate = (data: Partial<Department>) =>
  curl('auth/department', { ...data, _method: 'PUT' }, { method: 'POST', isStringify: true })

// 删除
export const doDepartmentDelete = (data: Pick<Department, 'id'>) =>
  curl('auth/department', { ...data, _method: 'DELETE' }, { method: 'POST', isStringify: true })
