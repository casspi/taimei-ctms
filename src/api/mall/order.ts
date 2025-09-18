import type { MallOrder, PagingParams, PagingResult } from '@/types'

import curl from '../curl'
import download from '../curl/download'

// 列表
export const reqMallOrderList = (data: PagingParams<{ name?: string }>) =>
  curl<PagingResult<MallOrder>>(`web/v2/shop/order`, data)

// 修改
export const doMallOrderUpdate = (data: Partial<MallOrder>) =>
  curl(`web/v2/shop/order`, data, { method: 'PUT' })

// 删除
export const doMallOrderDelete = (data: Pick<MallOrder, 'id'>) =>
  curl(`web/v2/shop/order/{id}`, data, { method: 'DELETE' })

// 导出
export const doMallOrderDownload = (data: {
  selectAll: boolean
  ids?: string[]
  keyword?: string
}) => {
  return download(
    `web/v2/shop/order/download`,
    { fileName: '积分商城订单', ...data },
    {
      paramsSerializer: {
        indexes: null,
      },
    },
  )
}
