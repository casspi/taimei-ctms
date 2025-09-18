import type { Integral, PagingParams, PagingResult } from '@/types'

import curl from '../curl'

// 列表
export const reqIntegralList = (data: PagingParams<{ name?: string }>) =>
  curl<PagingResult<Integral>>(`web/activityReward`, data)

// 详情
export const reqIntegralInfo = (data: Pick<Integral, 'id'>) => curl(`web/activityReward/{id}`, data)

// 新增
export const doIntegralCreate = (data: Partial<Integral>) =>
  curl(`web/activityReward`, data, { method: 'POST' })

// 修改
export const doIntegralUpdate = (data: Partial<Integral>) =>
  curl(`web/activityReward`, data, { method: 'PUT' })

// 删除
export const doIntegralDelete = (data: Pick<Integral, 'id'>) =>
  curl(`web/activityReward/{id}`, data, { method: 'DELETE' })
