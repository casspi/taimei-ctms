import type { Invitation, PagingParams, PagingResult } from '@/types'

import curl from '../curl'

// 列表
export const reqInvitationList = (data: PagingParams<{ name?: string }>) =>
  curl<PagingResult<Invitation>>(`web/activityInvitation`, data)

// 详情
export const reqInvitationInfo = (data: Pick<Invitation, 'id'>) =>
  curl(`web/activityInvitation/{id}`, data)

// 新增
export const doInvitationCreate = (data: Partial<Invitation>) =>
  curl(`web/activityInvitation`, data, { method: 'POST' })

// 修改
export const doInvitationUpdate = (data: Partial<Invitation>) =>
  curl(`web/activityInvitation`, data, { method: 'PUT' })

// 删除
export const doInvitationDelete = (data: Pick<Invitation, 'id'>) =>
  curl(`web/activityInvitation/{id}`, data, { method: 'DELETE' })
