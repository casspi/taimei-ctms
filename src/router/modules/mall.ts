import type { RouteRecordRaw } from 'vue-router'

import { LayoutView } from '@/layout'

export default [
  {
    path: '/mall',
    component: LayoutView,
    meta: { title: '积分商城', icon: 'Goods' },
    sort: 2,
    children: [
      {
        path: '/mall/goods',
        component: () => import('@/views/mall/MallGoodsView.vue'),
        meta: { title: '商品列表' },
      },
      {
        path: '/mall/order',
        component: () => import('@/views/mall/MallOrderView.vue'),
        meta: { title: '订单列表' },
      },
    ],
  },
] as RouteRecordRaw[]
