import type { Institution, PagingParams, PagingResult } from '@/types'

import curl from '../curl'

// 列表
export const reqInstitutionList = (data: PagingParams<{ name?: string }>) =>
  curl<PagingResult<Institution>>(`web/businessInstitutionInfo`, data)

// 详情
export const reqInstitutionInfo = (data: Pick<Institution, 'id'>) =>
  curl(`web/businessInstitutionInfo/{id}`, data)

// 新增
export const doInstitutionCreate = (data: Partial<Institution>) =>
  curl(`web/businessInstitutionInfo`, data, { method: 'POST' })

// 修改
export const doInstitutionUpdate = (data: Partial<Institution>) =>
  curl(`web/businessInstitutionInfo`, data, { method: 'PUT' })

// 删除
export const doInstitutionDelete = (data: Pick<Institution, 'id'>) =>
  curl(`web/businessInstitutionInfo/{id}`, data, { method: 'DELETE' })
