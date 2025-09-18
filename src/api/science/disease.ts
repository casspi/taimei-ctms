import type { Disease, PagingParams, PagingResult } from '@/types'

import curl from '../curl'

// 列表
export const reqDiseaseList = (data: PagingParams<{ name?: string }>) =>
  curl<PagingResult<Disease>>(`web/rareDisease`, data)

// 详情
export const reqDiseaseInfo = (data: Pick<Disease, 'id'>) => curl(`web/rareDisease/{id}`, data)

// 新增
export const doDiseaseCreate = (data: Partial<Disease>) =>
  curl(`web/rareDisease`, data, { method: 'POST' })

// 修改
export const doDiseaseUpdate = (data: Partial<Disease>) =>
  curl(`web/rareDisease`, data, { method: 'PUT' })

// 删除
export const doDiseaseDelete = (data: Pick<Disease, 'id'>) =>
  curl(`web/rareDisease/{id}`, data, { method: 'DELETE' })
