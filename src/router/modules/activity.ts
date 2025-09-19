import type { RouteRecordRaw } from 'vue-router'

import { LayoutView } from '@/layout'

export default [
  {
    path: '/activity',
    component: LayoutView,
    redirect: '/activity/config-award',
    meta: { title: '活动管理', icon: 'Star' },
    sort: 4,
    children: [
      {
        path: '/activity/config',
        component: () => import('@/views/activity/ConfigView.vue'),
        meta: { title: '活动配置' },
      },
      {
        path: '/activity/join-member',
        component: () => import('@/views/activity/JoinMemberView.vue'),
        meta: { title: '加入者列表' },
      },
    ],
  },
] as RouteRecordRaw[]
