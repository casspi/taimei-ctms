import { type RouteRecordRaw, RouterView } from 'vue-router'

import { LayoutView } from '@/layout'

export default [
  {
    path: '/project',
    component: LayoutView,
    meta: { title: '项目' },
    sort: 2,
    redirect: '/project/process/dashboard',
    children: [
      {
        path: '/project/process',
        component: RouterView,
        meta: { title: '项目进展', icon: 'Memo' },
        children: [
          {
            path: '/project/process/dashboard',
            component: () => import('@/views/project/process/DashboardView.vue'),
            meta: { title: '项目一览' },
          },
          {
            path: '/project/process/statistical-report',
            component: () => import('@/views/project/process/StatisticalReportView.vue'),
            meta: { title: '数据报表' },
          },
        ],
      },
    ],
  },
] as RouteRecordRaw[]
