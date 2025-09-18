import type { Drug, PagingParams, PagingResult } from '@/types'

import curl from '../curl'

// 列表
export const reqDrugList = (data: PagingParams<{ name?: string }>) =>
  curl<PagingResult<Drug>>(`web/tools/medical/drugs`, data)

// 详情
export const reqDrugInfo = (data: Pick<Drug, 'id'>) => curl(`web/tools/medical/drugs/{id}`, data)

// 新增
export const doDrugCreate = (data: Partial<Drug>) =>
  curl(`web/tools/medical/drugs`, data, { method: 'POST' })

// 修改
export const doDrugUpdate = (data: Partial<Drug>) =>
  curl(`web/tools/medical/drugs`, data, { method: 'PUT' })

// 删除
export const doDrugDelete = (data: Pick<Drug, 'id'>) =>
  curl(`web/tools/medical/drugs/{id}`, data, { method: 'DELETE' })
