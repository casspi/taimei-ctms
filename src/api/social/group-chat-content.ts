import type { GroupChatContent, PagingParams, PagingResult } from '@/types'

import curl from '../curl'

// 列表
export const reqGroupChatContentList = (data: PagingParams<{ name?: string }>) =>
  curl<PagingResult<GroupChatContent>>(`web/socialGroupChatContent`, data)

// 详情
export const reqGroupChatContentInfo = (data: Pick<GroupChatContent, 'id'>) =>
  curl(`web/socialGroupChatContent/{id}`, data)

// 新增
export const doGroupChatContentCreate = (data: Partial<GroupChatContent>) =>
  curl(`web/socialGroupChatContent`, data, { method: 'POST' })

// 修改
export const doGroupChatContentUpdate = (data: Partial<GroupChatContent>) =>
  curl(`web/socialGroupChatContent`, data, { method: 'PUT' })

// 删除
export const doGroupChatContentDelete = (data: Pick<GroupChatContent, 'id'>) =>
  curl(`web/socialGroupChatContent/{id}`, data, { method: 'DELETE' })
