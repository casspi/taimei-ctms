import type { DiseaseBusiness, PagingParams, PagingResult } from '@/types'

import curl from '../curl'

// 列表
export const reqDiseaseBusinessList = (data: PagingParams<Partial<DiseaseBusiness>>) =>
  curl<PagingResult<DiseaseBusiness>>(`web/rareDiseaseBusiness`, data)

// 新增
export const doDiseaseBusinessCreate = (data: Partial<DiseaseBusiness>) =>
  curl(`web/rareDiseaseBusiness`, data, { method: 'POST' })

// 删除
export const doDiseaseBusinessDelete = (data: Pick<DiseaseBusiness, 'id'>) =>
  curl(`web/rareDiseaseBusiness/{id}`, data, { method: 'DELETE' })
