import type { PagingParams, PagingResult, Reward } from '@/types'

import curl from '../curl'

// 列表
export const reqRewardList = (data: PagingParams<{ name?: string }>) =>
  curl<PagingResult<Reward>>(`web/activityReward`, data)

// 详情
export const reqRewardInfo = (data: Pick<Reward, 'id'>) => curl(`web/activityReward/{id}`, data)

// 新增
export const doRewardCreate = (data: Partial<Reward>) =>
  curl(`web/activityReward`, data, { method: 'POST' })

// 修改
export const doRewardUpdate = (data: Partial<Reward>) =>
  curl(`web/activityReward`, data, { method: 'PUT' })

// 删除
export const doRewardDelete = (data: Pick<Reward, 'id'>) =>
  curl(`web/activityReward/{id}`, data, { method: 'DELETE' })
