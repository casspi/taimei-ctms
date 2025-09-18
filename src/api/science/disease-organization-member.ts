import type { DiseaseOrganizationMember, PagingParams, PagingResult } from '@/types'

import curl from '../curl'
import download from '../curl/download'

// 列表
export const reqDiseaseOrganizationJoinMemberList = (data: PagingParams<{ name?: string }>) =>
  curl<PagingResult<DiseaseOrganizationMember>>(`web/toolsDiseaseOrganizationJoinMembers`, data)

// 审核
export const doDiseaseOrganizationJoinMemberCheck = (
  data: Pick<DiseaseOrganizationMember, 'id' | 'status' | 'remark'>,
) => curl(`web/toolsDiseaseOrganizationJoinMembers/check`, data, { method: 'POST' })

// 导出
export const doDiseaseOrganizationJoinMemberDownload = (data: {
  selectAll: boolean
  ids?: string[]
  keyword?: string
  status?: string
}) => {
  return download(
    `web/toolsDiseaseOrganizationJoinMembers/download`,
    { fileName: '罕见病组织加入者', ...data },
    {
      paramsSerializer: {
        indexes: null,
      },
    },
  )
}
