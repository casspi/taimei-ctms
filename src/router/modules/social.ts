import type { RouteRecordRaw } from 'vue-router'

import { LayoutView } from '@/layout'

export default [
  {
    path: '/social',
    component: LayoutView,
    redirect: '/social/trend',
    meta: { title: '审核管理', icon: 'Checked' },
    sort: 5,
    children: [
      {
        path: '/social/advocate',
        component: () => import('@/views/social/AdvocateView.vue'),
        meta: { title: '倡导管理' },
      },
      {
        path: '/social/advocate-report',
        component: () => import('@/views/social/AdvocateReportView.vue'),
        meta: { title: '倡导举报管理' },
      },
      {
        path: '/social/trend',
        component: () => import('@/views/social/TrendView.vue'),
        meta: { title: '动态管理' },
      },
      {
        path: '/social/trend-report',
        component: () => import('@/views/social/TrendReportView.vue'),
        meta: { title: '动态举报管理' },
      },
      {
        path: '/social/help',
        component: () => import('@/views/social/HelpView.vue'),
        meta: { title: '求助管理' },
      },
      {
        path: '/social/help-report',
        component: () => import('@/views/social/HelpReportView.vue'),
        meta: { title: '求助举报管理' },
      },
      // {
      //   path: '/social/group-chat',
      //   component: () => import('@/views/social/GroupChatView.vue'),
      //   meta: { title: '群组管理' },
      // },
      // {
      //   path: '/social/group-member',
      //   component: () => import('@/views/social/GroupMemberView.vue'),
      //   meta: { title: '群组成员管理' },
      // },
    ],
  },
] as RouteRecordRaw[]
