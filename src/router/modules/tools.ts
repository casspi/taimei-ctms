import type { RouteRecordRaw } from 'vue-router'

import { LayoutView } from '@/layout'

export default [
  {
    path: '/tools',
    component: LayoutView,
    redirect: '/too/guide',
    meta: { title: '工具管理', icon: 'HelpFilled' },
    sort: 7,
    children: [
      {
        path: '/tools/insurance-policy',
        component: () => import('@/views/tools/InsurancePolicyView.vue'),
        meta: { title: '医保政策管理' },
      },
      {
        path: '/tools/insurance-catalogue',
        component: () => import('@/views/tools/InsuranceCatalogueView.vue'),
        meta: { title: '医保药物目录管理' },
      },
      {
        path: '/tools/medical-computation',
        component: () => import('@/views/tools/MedicalComputationView.vue'),
        meta: { title: '计算工具管理' },
      },
    ],
  },
] as RouteRecordRaw[]
