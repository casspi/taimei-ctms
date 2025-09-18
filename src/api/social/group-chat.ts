import type { GroupChat, PagingParams, PagingResult } from '@/types'

import curl from '../curl'

// 列表
export const reqGroupChatList = (data: PagingParams<{ name?: string }>) =>
  curl<PagingResult<GroupChat>>(`web/socialGroupChat`, data)

// 详情
export const reqGroupChatInfo = (data: Pick<GroupChat, 'id'>) =>
  curl(`web/socialGroupChat/{id}`, data)

// 新增
export const doGroupChatCreate = (data: Partial<GroupChat>) =>
  curl(`web/socialGroupChat`, data, { method: 'POST' })

// 修改
export const doGroupChatUpdate = (data: Partial<GroupChat>) =>
  curl(`web/socialGroupChat`, data, { method: 'PUT' })

// 删除
export const doGroupChatDelete = (data: Pick<GroupChat, 'id'>) =>
  curl(`web/socialGroupChat/{id}`, data, { method: 'DELETE' })

// 审核
export const doGroupChatCheck = (data: Pick<GroupChat, 'id' | 'remark' | 'status'>) =>
  curl(`web/socialGroupChat/check`, data, { method: 'PUT' })
