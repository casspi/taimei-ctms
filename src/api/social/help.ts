import type { Help, PagingParams, PagingResult, ReportItem } from '@/types'

import curl from '../curl'

// 列表
export const reqHelpList = (data: PagingParams<{ name?: string }>) =>
  curl<PagingResult<Help>>(`web/socialHelp`, data)

// 详情
export const reqHelpInfo = (data: Pick<Help, 'id'>) => curl(`web/socialHelp/{id}`, data)

// 新增
export const doHelpCreate = (data: Partial<Help>) =>
  curl(`web/socialHelp`, data, { method: 'POST' })

// 修改
export const doHelpUpdate = (data: Partial<Help>) => curl(`web/socialHelp`, data, { method: 'PUT' })

// 删除
export const doHelpDelete = (data: Pick<Help, 'id'>) =>
  curl(`web/socialHelp/{id}`, data, { method: 'DELETE' })

// 审核
export const doHelpCheck = (data: Pick<Help, 'id' | 'remark' | 'status'>) =>
  curl(`web/socialHelp/check`, data, { method: 'PUT' })

// 举报列表
export const reqHelpReportList = (data: PagingParams) =>
  curl<PagingResult<ReportItem>>(`web/social/help/report`, data)

// 举报修改-即审核
export const doHelpReportCheck = (data: Partial<ReportItem>) =>
  curl(`web/social/help/report`, data, { method: 'PUT' })
