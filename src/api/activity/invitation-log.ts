import type { InvitationLog, PagingParams, PagingResult } from '@/types'

import curl from '../curl'

// 列表
export const reqInvitationLogList = (data: PagingParams<{ name?: string }>) =>
  curl<PagingResult<InvitationLog>>(`web/activityInvitationLog`, data)

// 详情
export const reqInvitationLogInfo = (data: Pick<InvitationLog, 'id'>) =>
  curl(`web/activityInvitationLog/{id}`, data)

// 新增
export const doInvitationLogCreate = (data: Partial<InvitationLog>) =>
  curl(`web/activityInvitationLog`, data, { method: 'POST' })

// 修改
export const doInvitationLogUpdate = (data: Partial<InvitationLog>) =>
  curl(`web/activityInvitationLog`, data, { method: 'PUT' })

// 删除
export const doInvitationLogDelete = (data: Pick<InvitationLog, 'id'>) =>
  curl(`web/activityInvitationLog/{id}`, data, { method: 'DELETE' })
