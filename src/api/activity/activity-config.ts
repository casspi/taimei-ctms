import type { ActivityConfig, PagingParams, PagingResult } from '@/types'

import curl from '../curl'

// 列表
export const reqActivityConfigList = (data: PagingParams<{ name?: string }>) =>
  curl<PagingResult<ActivityConfig>>(`web/activityConfig`, data)

// 详情
export const reqActivityConfigInfo = (data: Pick<ActivityConfig, 'id'>) =>
  curl(`web/activityConfig/{id}`, data)

// 新增
export const doActivityConfigCreate = (data: Partial<ActivityConfig>) =>
  curl(`web/activityConfig`, data, { method: 'POST' })

// 修改
export const doActivityConfigUpdate = (data: Partial<ActivityConfig>) =>
  curl(`web/activityConfig`, data, { method: 'PUT' })

// 删除
export const doActivityConfigDelete = (data: Pick<ActivityConfig, 'id'>) =>
  curl(`web/activityConfig/{id}`, data, { method: 'DELETE' })
