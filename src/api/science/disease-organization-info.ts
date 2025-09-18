import type { DiseaseOrganization, PagingParams, PagingResult } from '@/types'

import curl from '../curl'

// 列表
export const reqDiseaseOrganizationInfoList = (data: PagingParams<{ name?: string }>) =>
  curl<PagingResult<DiseaseOrganization>>(
    `/web/toolsDiseaseOrganizationInfo
`,
    data,
  )

// 详情
// export const reqDiseaseOrganizationInfo = (data: Pick<DiseaseOrganization, 'id'>) =>
//   curl(`web/toolsDiseaseOrganization/{id}`, data)

// // 新增
export const doDiseaseOrganizationInfoCreate = (data: Partial<DiseaseOrganization>) =>
  curl(`web/toolsDiseaseOrganizationInfo`, data, { method: 'POST' })

// 修改
export const doDiseaseOrganizationInfoUpdate = (data: Partial<DiseaseOrganization>) =>
  curl(`web/toolsDiseaseOrganizationInfo`, data, { method: 'PUT' })

// 删除
export const doDiseaseOrganizationInfoDelete = (data: Pick<DiseaseOrganization, 'id'>) =>
  curl(`web/toolsDiseaseOrganizationInfo/{id}`, data, { method: 'DELETE' })
