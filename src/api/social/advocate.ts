import type { Advocate, PagingParams, PagingResult, ReportItem } from '@/types'

import curl from '../curl'

// 列表
export const reqAdvocateList = (data: PagingParams<{ name?: string }>) =>
  curl<PagingResult<Advocate>>(`web/socialAdvocate`, data)

// 详情
export const reqAdvocateInfo = (data: Pick<Advocate, 'id'>) => curl(`web/socialAdvocate/{id}`, data)

// 新增
export const doAdvocateCreate = (data: Partial<Advocate>) =>
  curl(`web/socialAdvocate`, data, { method: 'POST' })

// 修改
export const doAdvocateUpdate = (data: Partial<Advocate>) =>
  curl(`web/socialAdvocate`, data, { method: 'PUT' })

// 删除
export const doAdvocateDelete = (data: Pick<Advocate, 'id'>) =>
  curl(`web/socialAdvocate/{id}`, data, { method: 'DELETE' })

// 审核
export const doAdvocateCheck = (data: Pick<Advocate, 'id' | 'remark' | 'status'>) =>
  curl(`web/socialAdvocate/check`, data, { method: 'PUT' })

// 举报列表
export const reqAdvocateReportList = (data: PagingParams) =>
  curl<PagingResult<ReportItem>>(`web/social/advocate/report`, data)

// 举报修改-即审核
export const doAdvocateReportCheck = (data: Partial<ReportItem>) =>
  curl(`web/social/advocate/report`, data, { method: 'PUT' })
