import type { MedicalGuideline, PagingParams, PagingResult } from '@/types'

import curl from '../curl'

// 列表
export const reqMedicalGuidelineList = (data: PagingParams<{ name?: string }>) =>
  curl<PagingResult<MedicalGuideline>>(`web/toolsMedicalGuideline`, data)

// 详情
export const reqMedicalGuidelineInfo = (data: Pick<MedicalGuideline, 'id'>) =>
  curl(`web/toolsMedicalGuideline/{id}`, data)

// 新增
export const doMedicalGuidelineCreate = (data: Partial<MedicalGuideline>) =>
  curl(`web/toolsMedicalGuideline`, data, { method: 'POST' })

// 修改
export const doMedicalGuidelineUpdate = (data: Partial<MedicalGuideline>) =>
  curl(`web/toolsMedicalGuideline`, data, { method: 'PUT' })

// 删除
export const doMedicalGuidelineDelete = (data: Pick<MedicalGuideline, 'id'>) =>
  curl(`web/toolsMedicalGuideline/{id}`, data, { method: 'DELETE' })
