import type { PagingParams, PagingResult, Volunteer } from '@/types'

import curl from '../curl'

// 列表
export const reqVolunteerList = (data: PagingParams<{ name?: string }>) =>
  curl<PagingResult<Volunteer>>(`web/businessVolunteerInfo`, data)

// 详情
export const reqVolunteerInfo = (data: Pick<Volunteer, 'loginId'>) =>
  curl(`web/businessVolunteerInfo/{loginId}`, data)

// 新增
export const doVolunteerCreate = (data: Partial<Volunteer>) =>
  curl(`web/businessVolunteerInfo`, data, { method: 'POST' })

// 修改
export const doVolunteerUpdate = (data: Partial<Volunteer>) =>
  curl(`web/businessVolunteerInfo`, data, { method: 'PUT' })

// 删除
export const doVolunteerDelete = (data: Pick<Volunteer, 'loginId'>) =>
  curl(`web/businessVolunteerInfo/{loginId}`, data, { method: 'DELETE' })
