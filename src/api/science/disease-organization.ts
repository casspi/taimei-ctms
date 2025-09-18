import type { DiseaseOrganization, PagingParams, PagingResult } from '@/types'

import curl from '../curl'

// 列表
export const reqDiseaseOrganizationList = (data: PagingParams<{ name?: string }>) =>
  curl<PagingResult<DiseaseOrganization>>(`web/v2/toolsDiseaseOrganization`, data)

// 详情
export const reqDiseaseOrganizationInfo = (data: Pick<DiseaseOrganization, 'id'>) =>
  curl(`web/toolsDiseaseOrganization/{id}`, data)

// 新增
export const doDiseaseOrganizationCreate = (data: Partial<DiseaseOrganization>) =>
  curl(`web/v2/toolsDiseaseOrganization`, data, { method: 'POST' })

// 修改
export const doDiseaseOrganizationUpdate = (data: Partial<DiseaseOrganization>) =>
  curl(`web/v2/toolsDiseaseOrganization`, data, { method: 'PUT' })

// 删除
export const doDiseaseOrganizationDelete = (data: Pick<DiseaseOrganization, 'id'>) =>
  curl(`web/toolsDiseaseOrganization/{id}`, data, { method: 'DELETE' })
