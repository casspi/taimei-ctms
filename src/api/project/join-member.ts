import type { JoinMember, PagingParams, PagingResult } from '@/types'

import curl from '../curl'
import download from '../curl/download'

// 列表
export const reqJoinMemberList = (data: PagingParams<{ name?: string }>) =>
  curl<PagingResult<JoinMember>>(`web/v2/projectJoinMember`, data)

// 详情
export const reqJoinMemberInfo = (data: Pick<JoinMember, 'id'>) =>
  curl(`web/v2/projectJoinMember/{id}`, data)

// // 新增
// export const doJoinMemberCreate = (data: Partial<JoinMember>) =>
//   curl(`web/projectJoinMember`, data, { method: 'POST' })

// // 修改
// export const doJoinMemberUpdate = (data: Partial<JoinMember>) =>
//   curl(`web/projectJoinMember`, data, { method: 'PUT' })

// 删除
export const doJoinMemberDelete = (data: Pick<JoinMember, 'id'>) =>
  curl(`web/v2/projectJoinMember/{id}`, data, { method: 'DELETE' })

// 审核
export const doJoinMemberCheck = (data: Pick<JoinMember, 'id' | 'status' | 'remark'>) =>
  curl(`web/v2/projectJoinMember/check`, data, { method: 'POST' })

// 导出
export const doProjectJoinMemberDownload = (data: {
  selectAll: boolean
  projectId?: string
  ids?: string[]
  keyword?: string
  status?: string
}) => {
  return download(
    `web/v2/projectJoinMember/download`,
    { fileName: '项目加入者', ...data },
    {
      paramsSerializer: {
        indexes: null,
      },
    },
  )
}
