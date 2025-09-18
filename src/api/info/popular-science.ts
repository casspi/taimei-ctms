import type { PagingParams, PagingResult, PopularScience } from '@/types'

import curl from '../curl'

// 列表
export const reqPopularScienceList = (data: PagingParams<{ name?: string }>) =>
  curl<PagingResult<PopularScience>>(`web/infoPopularScience`, data)

// 详情
export const reqPopularScienceInfo = (data: Pick<PopularScience, 'id'>) =>
  curl(`web/infoPopularScience/{id}`, data)

// 新增
export const doPopularScienceCreate = (data: Partial<PopularScience>) =>
  curl(`web/infoPopularScience`, data, { method: 'POST' })

// 修改
export const doPopularScienceUpdate = (data: Partial<PopularScience>) =>
  curl(`web/infoPopularScience`, data, { method: 'PUT' })

// 删除
export const doPopularScienceDelete = (data: Pick<PopularScience, 'id'>) =>
  curl(`web/infoPopularScience/{id}`, data, { method: 'DELETE' })
