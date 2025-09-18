import type { MallGoods, PagingParams, PagingResult } from '@/types'

import curl from '../curl'

// 列表
export const reqMallGoodsList = (data: PagingParams) =>
  curl<PagingResult<MallGoods>>(`web/v2/shop/good`, data)

// 详情
export const reqMallGoodsInfo = (data: Pick<MallGoods, 'id'>) => curl(`web/v2/shop/good/{id}`, data)

// 新增
export const doMallGoodsCreate = (data: Partial<MallGoods>) =>
  curl(`web/v2/shop/good`, data, { method: 'POST' })

// 修改
export const doMallGoodsUpdate = (data: Partial<MallGoods>) =>
  curl(`web/v2/shop/good`, data, { method: 'PUT' })

// 删除
export const doMallGoodsDelete = (data: Pick<MallGoods, 'id'>) =>
  curl(`web/v2/shop/good/{id}`, data, { method: 'DELETE' })
