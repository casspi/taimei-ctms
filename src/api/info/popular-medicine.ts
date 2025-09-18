import type { PagingParams, PagingResult, PopularMedicine } from '@/types'

import curl from '../curl'

// 列表
export const reqPopularMedicineList = (data: PagingParams<{ name?: string }>) =>
  curl<PagingResult<PopularMedicine>>(`web/infoPopularMedicine`, data)

// 详情
export const reqPopularMedicineInfo = (data: Pick<PopularMedicine, 'id'>) =>
  curl(`web/infoPopularMedicine/{id}`, data)

// 新增
export const doPopularMedicineCreate = (data: Partial<PopularMedicine>) =>
  curl(`web/infoPopularMedicine`, data, { method: 'POST' })

// 修改
export const doPopularMedicineUpdate = (data: Partial<PopularMedicine>) =>
  curl(`web/infoPopularMedicine`, data, { method: 'PUT' })

// 删除
export const doPopularMedicineDelete = (data: Pick<PopularMedicine, 'id'>) =>
  curl(`web/infoPopularMedicine/{id}`, data, { method: 'DELETE' })
