import type { Advertisement, PagingParams, PagingResult } from '@/types'

import curl from '../curl'

// 列表
export const reqAdvertisementList = (data: PagingParams<{ name?: string }>) =>
  curl<PagingResult<Advertisement>>(`web/infoAdvertisement`, data)

// 详情
export const reqAdvertisementInfo = (data: Pick<Advertisement, 'id'>) =>
  curl(`web/infoAdvertisement/{id}`, data)

// 新增
export const doAdvertisementCreate = (data: Partial<Advertisement>) =>
  curl(`web/infoAdvertisement`, data, { method: 'POST' })

// 修改
export const doAdvertisementUpdate = (data: Partial<Advertisement>) =>
  curl(`web/infoAdvertisement`, data, { method: 'PUT' })

// 删除
export const doAdvertisementDelete = (data: Pick<Advertisement, 'id'>) =>
  curl(`web/infoAdvertisement/{id}`, data, { method: 'DELETE' })
