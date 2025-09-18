import type { InsurancePolicy, PagingParams, PagingResult } from '@/types'

import curl from '../curl'

// 列表
export const reqInsurancePolicyList = (data: PagingParams<{ name?: string }>) =>
  curl<PagingResult<InsurancePolicy>>(`web/toolsInsurancePolicy`, data)

// 详情
export const reqInsurancePolicyInfo = (data: Pick<InsurancePolicy, 'id'>) =>
  curl(`web/toolsInsurancePolicy/{id}`, data)

// 新增
export const doInsurancePolicyCreate = (data: Partial<InsurancePolicy>) =>
  curl(`web/toolsInsurancePolicy`, data, { method: 'POST' })

// 修改
export const doInsurancePolicyUpdate = (data: Partial<InsurancePolicy>) =>
  curl(`web/toolsInsurancePolicy`, data, { method: 'PUT' })

// 删除
export const doInsurancePolicyDelete = (data: Pick<InsurancePolicy, 'id'>) =>
  curl(`web/toolsInsurancePolicy/{id}`, data, { method: 'DELETE' })
