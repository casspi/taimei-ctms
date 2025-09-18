import type { RouteRecordRaw } from 'vue-router'

import { LayoutView } from '@/layout'

export default [
  {
    path: '/project',
    component: LayoutView,
    meta: { title: '项目管理', icon: 'Memo' },
    sort: 2,
    children: [
      {
        path: '/project/list',
        component: () => import('@/views/project/ListView.vue'),
        meta: { title: '项目列表' },
      },
      {
        path: '/project/join-member',
        component: () => import('@/views/project/JoinMemberView.vue'),
        meta: { title: '加入者列表' },
      },
    ],
  },
] as RouteRecordRaw[]
