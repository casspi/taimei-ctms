import type { PagingParams, PagingResult, ProjectSubsidy } from '@/types'

import curl from '../curl'
import download from '../curl/download'

// 列表
export const reqProjectSubsidyList = (data: PagingParams<{ name?: string }>) =>
  curl<PagingResult<ProjectSubsidy>>(`web/v2/project/member/subsidy`, data)

// 详情
export const reqProjectSubsidyInfo = (data: Pick<ProjectSubsidy, 'id'>) =>
  curl(`web/v2/project/member/subsidy/{id}`, data)

// 审核-项目补助
export const doProjectSubsidyCheck = (
  data: Pick<ProjectSubsidy, 'id' | 'checkRemark' | 'status'>,
) => curl(`web/v2/project/member/subsidy/check`, data, { method: 'PUT' })

// 删除
export const doProjectSubsidyDelete = (data: Pick<ProjectSubsidy, 'id'>) =>
  curl(`web/v2/project/member/subsidy/{id}`, data, { method: 'DELETE' })

// 支付状态
export const doProjectSubsidyPay = (
  data: Pick<ProjectSubsidy, 'id' | 'payRemark' | 'payStatus' | 'payProofPathList' | 'payDt'>,
) => curl(`web/v2/project/member/subsidy/pay`, data, { method: 'PUT' })

// 导出
export const doProjectSubsidyDownload = (data: {
  selectAll: boolean
  projectId?: string
  ids?: string[]
  keyword?: string
  payStatus?: string
  status?: string
}) => {
  return download(
    `web/v2/project/member/subsidy/download`,
    { fileName: '项目补助', ...data },
    {
      paramsSerializer: {
        indexes: null,
      },
    },
  )
}
