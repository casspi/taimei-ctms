import type { ClinicalCenter, PagingParams, PagingResult } from '@/types'

import curl from '../curl'

// 列表
export const reqClinicalCenterList = (data: PagingParams<{ name?: string }>) =>
  curl<PagingResult<ClinicalCenter>>(`web/infoClinicalCenter`, data)

// 详情
export const reqClinicalCenterInfo = (data: Pick<ClinicalCenter, 'id'>) =>
  curl(`web/infoClinicalCenter/{id}`, data)

// 新增
export const doClinicalCenterCreate = (data: Partial<ClinicalCenter>) =>
  curl(`web/infoClinicalCenter`, data, { method: 'POST' })

// 修改
export const doClinicalCenterUpdate = (data: Partial<ClinicalCenter>) =>
  curl(`web/infoClinicalCenter`, data, { method: 'PUT' })

// 删除
export const doClinicalCenterDelete = (data: Pick<ClinicalCenter, 'id'>) =>
  curl(`web/infoClinicalCenter/{id}`, data, { method: 'DELETE' })
