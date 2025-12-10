import type { RouteRecordRaw } from 'vue-router'

import { LayoutView } from '@/layout'

export default [
  {
    path: '/project',
    component: LayoutView,
    meta: { title: '项目', icon: 'Memo' },
    sort: 2,
    children: [
      {
        path: '/project/dashboard',
        component: () => import('@/views/project/ProjectDashboardView.vue'),
        meta: { title: '项目一览' },
      },
    ],
  },
] as RouteRecordRaw[]
