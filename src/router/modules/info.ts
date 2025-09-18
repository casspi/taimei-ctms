import type { RouteRecordRaw } from 'vue-router'

import { LayoutView } from '@/layout'

export default [
  {
    path: '/info/popular-medicine',
    component: LayoutView,
    meta: { title: '资讯管理', icon: 'Message' },
    sort: 6,
    children: [
      {
        path: '/info/popular-medicine',
        component: () => import('@/views/info/PopularMedicineView.vue'),
        meta: { title: '前沿治疗' },
      },
      {
        path: '/info/advertisement',
        component: () => import('@/views/info/AdvertisementView.vue'),
        meta: { title: '广告管理' },
      },
      {
        path: '/info/clinical-trial',
        component: () => import('@/views/info/ClinicalTrialView.vue'),
        meta: { title: '新药临床' },
      },
      {
        path: '/info/clinical-center',
        component: () => import('@/views/info/ClinicalCenterView.vue'),
        meta: { title: '新药临床中心' },
      },
      {
        path: '/info/popular-science',
        component: () => import('@/views/info/PopularScienceView.vue'),
        meta: { title: '疾病科普' },
      },
    ],
  },
] as RouteRecordRaw[]
