import type { ActivityJoinMember, PagingParams, PagingResult } from '@/types'

import curl from '../curl'
import download from '../curl/download'

// 列表
export const reqActivityJoinMemberList = (data: PagingParams<{ name?: string }>) =>
  curl<PagingResult<ActivityJoinMember>>(`web/activityJoinMember`, data)

// 详情
export const reqActivityJoinMemberInfo = (data: Pick<ActivityJoinMember, 'id'>) =>
  curl(`web/activityJoinMember/{id}`, data)

// 新增
export const doActivityJoinMemberCreate = (data: Partial<ActivityJoinMember>) =>
  curl(`web/activityJoinMember`, data, { method: 'POST' })

// 修改
export const doActivityJoinMemberUpdate = (data: Partial<ActivityJoinMember>) =>
  curl(`web/activityJoinMember`, data, { method: 'PUT' })

// 删除
export const doActivityJoinMemberDelete = (data: Pick<ActivityJoinMember, 'id'>) =>
  curl(`web/activityJoinMember/{id}`, data, { method: 'DELETE' })

// 导出
export const doActivityJoinMemberDownload = (data: {
  selectAll: boolean
  activityId: string
  ids?: string[]
  keyword?: string
  status?: string
}) => {
  return download(
    `web/activityJoinMember/download`,
    { fileName: '活动加入者', ...data },
    {
      paramsSerializer: {
        indexes: null,
      },
    },
  )
}
