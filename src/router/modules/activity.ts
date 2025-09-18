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
      // {
      //   path: '/activity/config-award',
      //   component: () => import('@/views/activity/ConfigAwardView.vue'),
      //   meta: { title: '奖项配置' },
      // },
      // {
      //   path: '/activity/reward',
      //   component: () => import('@/views/activity/RewardView.vue'),
      //   meta: { title: '奖励记录' },
      // },
      // {
      //   path: '/activity/invitation',
      //   component: () => import('@/views/activity/InvitationView.vue'),
      //   meta: { title: '活动邀请' },
      // },
      // {
      //   path: '/activity/invitation-log',
      //   component: () => import('@/views/activity/InvitationLogView.vue'),
      //   meta: { title: '邀请记录' },
      // },
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
