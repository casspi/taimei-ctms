import type { MedicalComputation, PagingParams, PagingResult } from '@/types'

import curl from '../curl'

// 列表
export const reqMedicalComputationList = (data: PagingParams<{ name?: string }>) =>
  curl<PagingResult<MedicalComputation>>(`web/toolsMedicalComputation`, data)

// 详情
export const reqMedicalComputationInfo = (data: Pick<MedicalComputation, 'id'>) =>
  curl(`web/toolsMedicalComputation/{id}`, data)

// 新增
export const doMedicalComputationCreate = (data: Partial<MedicalComputation>) =>
  curl(`web/toolsMedicalComputation`, data, { method: 'POST' })

// 修改
export const doMedicalComputationUpdate = (data: Partial<MedicalComputation>) =>
  curl(`web/toolsMedicalComputation`, data, { method: 'PUT' })

// 删除
export const doMedicalComputationDelete = (data: Pick<MedicalComputation, 'id'>) =>
  curl(`web/toolsMedicalComputation/{id}`, data, { method: 'DELETE' })
