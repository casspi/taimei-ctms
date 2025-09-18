import type { Hospital, PagingParams, PagingResult } from '@/types'

import curl from '../curl'

// 列表
export const reqHospitalList = (data: PagingParams<{ name?: string }>) =>
  curl<PagingResult<Hospital>>(`web/businessHospitalInfo`, data)

// 详情
export const reqHospitalInfo = (data: Pick<Hospital, 'id'>) =>
  curl(`web/businessHospitalInfo/{id}`, data)

// 新增
export const doHospitalCreate = (data: Partial<Hospital>) =>
  curl(`web/businessHospitalInfo`, data, { method: 'POST' })

// 修改
export const doHospitalUpdate = (data: Partial<Hospital>) =>
  curl(`web/businessHospitalInfo`, data, { method: 'PUT' })

// 删除
export const doHospitalDelete = (data: Pick<Hospital, 'id'>) =>
  curl(`web/businessHospitalInfo/{id}`, data, { method: 'DELETE' })
