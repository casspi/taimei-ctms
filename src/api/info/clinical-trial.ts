import type { ClinicalTrial, PagingParams, PagingResult } from '@/types'

import curl from '../curl'

// 列表
export const reqClinicalTrialList = (data: PagingParams<{ name?: string }>) =>
  curl<PagingResult<ClinicalTrial>>(`web/infoClinicalTrial`, data)

// 详情
export const reqClinicalTrialInfo = (data: Pick<ClinicalTrial, 'projectId'>) =>
  curl(`web/infoClinicalTrial/{projectId}`, data)

// 新增
export const doClinicalTrialCreate = (data: Partial<ClinicalTrial>) =>
  curl(`web/infoClinicalTrial`, data, { method: 'POST' })

// 修改
export const doClinicalTrialUpdate = (data: Partial<ClinicalTrial>) =>
  curl(`web/infoClinicalTrial`, data, { method: 'PUT' })

// 删除
export const doClinicalTrialDelete = (data: Pick<ClinicalTrial, 'projectId'>) =>
  curl(`web/infoClinicalTrial/{projectId}`, data, { method: 'DELETE' })
