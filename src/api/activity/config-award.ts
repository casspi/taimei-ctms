import type { ConfigAward, PagingParams, PagingResult } from '@/types'

import curl from '../curl'

// 列表
export const reqConfigAwardList = (data: PagingParams<{ name?: string }>) =>
  curl<PagingResult<ConfigAward>>(`web/activateConfigAward`, data)

// 详情
export const reqConfigAwardInfo = (data: Pick<ConfigAward, 'id'>) =>
  curl(`web/activateConfigAward/{id}`, data)

// 新增
export const doConfigAwardCreate = (data: Partial<ConfigAward>) =>
  curl(`web/activateConfigAward`, data, { method: 'POST' })

// 修改
export const doConfigAwardUpdate = (data: Partial<ConfigAward>) =>
  curl(`web/activateConfigAward`, data, { method: 'PUT' })

// 删除
export const doConfigAwardDelete = (data: Pick<ConfigAward, 'id'>) =>
  curl(`web/activateConfigAward/{id}`, data, { method: 'DELETE' })
