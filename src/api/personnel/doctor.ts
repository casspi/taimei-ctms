import type { Doctor, PagingParams, PagingResult } from '@/types'

import curl from '../curl'

// 列表
export const reqDoctorList = (data: PagingParams<{ name?: string }>) =>
  curl<PagingResult<Doctor>>(`web/v2/businessDoctorInfo`, data)

// 详情
export const reqDoctorInfo = (data: Pick<Doctor, 'loginId'>) =>
  curl(`web/businessDoctorInfo/{loginId}`, data)

// 新增
export const doDoctorCreate = (data: Partial<Doctor>) =>
  curl(`web/v2/businessDoctorInfo`, data, { method: 'POST' })

// 修改
export const doDoctorUpdate = (data: Partial<Doctor>) =>
  curl(`web/v2/businessDoctorInfo`, data, { method: 'PUT' })

// 删除
export const doDoctorDelete = (data: Pick<Doctor, 'loginId'>) =>
  curl(`web/businessDoctorInfo/{loginId}`, data, { method: 'DELETE' })

// 审核 审核医生(需要传id,status和checkRemark字段)
export const doDoctorCheck = (data: { checkRemark: string; loginId: string; status: string }) =>
  curl(`web/v2/businessDoctorInfo/check`, data, { method: 'POST' })
