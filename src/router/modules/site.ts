import type { RouteRecordRaw } from 'vue-router'

import { LayoutRouterView, LayoutView } from '@/layout'

export default [
  {
    path: '/site',
    component: LayoutView,
    meta: { title: '中心' },
    sort: 2,
    redirect: '/site/inspect/plan',
    children: [
      {
        path: '/site/inspect',
        component: () => LayoutRouterView,
        redirect: '/site/inspect/plan',
        meta: { title: '报告撰写', icon: 'Memo' },
        children: [
          {
            path: '/site/inspect/plan',
            component: () => import('@/views/site/inspect/InspectPlanView.vue'),
            meta: { title: '监查计划' },
          },
          {
            path: '/site/inspect/report',
            component: () => import('@/views/site/inspect/InspectReportView.vue'),
            meta: { title: '监查报告' },
          },
        ],
      },
      {
        path: '/site/question',
        component: () => LayoutRouterView,
        redirect: '/site/question/monitor',
        meta: { title: '问题跟踪', icon: 'Memo' },
        children: [
          {
            path: '/site/question/monitor',
            component: () => import('@/views/site/question/MonitorQuestionsView.vue'),
            meta: { title: '监查问题' },
          },
          {
            path: '/site/question/violation',
            component: () => import('@/views/site/question/ProjectViolationView.vue'),
            meta: { title: '方案违背' },
          },
        ],
      },
    ],
  },
] as RouteRecordRaw[]
