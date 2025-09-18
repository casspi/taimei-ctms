import type { Enterprise, PagingParams, PagingResult } from '@/types'

import curl from '../curl'

// 列表
export const reqEnterpriseList = (data: PagingParams<{ name?: string }>) =>
  curl<PagingResult<Enterprise>>(`web/businessEnterpriseInfos`, data)

// 详情
export const reqEnterpriseInfo = (data: Pick<Enterprise, 'id'>) =>
  curl(`web/businessEnterpriseInfos/{id}`, data)

// 新增
export const doEnterpriseCreate = (data: Partial<Enterprise>) =>
  curl(`web/businessEnterpriseInfos`, data, { method: 'POST' })

// 修改
export const doEnterpriseUpdate = (data: Partial<Enterprise>) =>
  curl(`web/businessEnterpriseInfos`, data, { method: 'PUT' })

// 删除
export const doEnterpriseDelete = (data: Pick<Enterprise, 'id'>) =>
  curl(`web/businessEnterpriseInfos/{id}`, data, { method: 'DELETE' })
