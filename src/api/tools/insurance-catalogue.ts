import type { InsuranceCatalogue, PagingParams, PagingResult } from '@/types'

import curl from '../curl'

// 列表
export const reqInsuranceCatalogueList = (data: PagingParams<{ medicineName?: string }>) =>
  curl<PagingResult<InsuranceCatalogue>>(`web/toolsInsureCatalogue`, data)

// 详情
export const reqInsuranceCatalogueInfo = (data: Pick<InsuranceCatalogue, 'id'>) =>
  curl(`web/toolsInsureCatalogue/{id}`, data)

// 新增
export const doInsuranceCatalogueCreate = (data: Partial<InsuranceCatalogue>) =>
  curl(`web/toolsInsureCatalogue`, data, { method: 'POST' })

// 修改
export const doInsuranceCatalogueUpdate = (data: Partial<InsuranceCatalogue>) =>
  curl(`web/toolsInsureCatalogue`, data, { method: 'PUT' })

// 删除
export const doInsuranceCatalogueDelete = (data: Pick<InsuranceCatalogue, 'id'>) =>
  curl(`web/toolsInsureCatalogue/{id}`, data, { method: 'DELETE' })
