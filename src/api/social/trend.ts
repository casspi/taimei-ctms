import type { PagingParams, PagingResult, ReportItem, Trend } from '@/types'

import curl from '../curl'

// 列表
export const reqTrendList = (data: PagingParams<{ name?: string }>) =>
  curl<PagingResult<Trend>>(`web/socialTrend`, data)

// 详情
export const reqTrendInfo = (data: Pick<Trend, 'id'>) => curl(`web/socialTrend/{id}`, data)

// 新增
export const doTrendCreate = (data: Partial<Trend>) =>
  curl(`web/socialTrend`, data, { method: 'POST' })

// 修改
export const doTrendUpdate = (data: Partial<Trend>) =>
  curl(`web/socialTrend`, data, { method: 'PUT' })

// 删除
export const doTrendDelete = (data: Pick<Trend, 'id'>) =>
  curl(`web/socialTrend/{id}`, data, { method: 'DELETE' })

// 审核
export const doTrendCheck = (data: Pick<Trend, 'id' | 'remark' | 'status'>) =>
  curl(`web/socialTrend/check`, data, { method: 'PUT' })

// 举报列表
export const reqTrendReportList = (data: PagingParams) =>
  curl<PagingResult<ReportItem>>(`web/social/trends/report`, data)

// 举报修改-即审核
export const doTrendReportCheck = (data: Partial<ReportItem>) =>
  curl(`web/social/trends/report`, data, { method: 'PUT' })
