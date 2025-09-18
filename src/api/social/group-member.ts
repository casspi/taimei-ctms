import type { GroupMember, PagingParams, PagingResult } from '@/types'

import curl from '../curl'

// 列表
export const reqGroupMemberList = (data: PagingParams<{ name?: string }>) =>
  curl<PagingResult<GroupMember>>(`web/socialGroupMember`, data)

// 详情
export const reqGroupMemberInfo = (data: Pick<GroupMember, 'id'>) =>
  curl(`web/socialGroupMember/{id}`, data)

// 新增
export const doGroupMemberCreate = (data: Partial<GroupMember>) =>
  curl(`web/socialGroupMember`, data, { method: 'POST' })

// 修改
export const doGroupMemberUpdate = (data: Partial<GroupMember>) =>
  curl(`web/socialGroupMember`, data, { method: 'PUT' })

// 删除
export const doGroupMemberDelete = (data: Pick<GroupMember, 'id'>) =>
  curl(`web/socialGroupMember/{id}`, data, { method: 'DELETE' })
