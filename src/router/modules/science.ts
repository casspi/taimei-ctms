import type { RouteRecordRaw } from 'vue-router'

import { LayoutView } from '@/layout'

export default [
  {
    path: '/science',
    component: LayoutView,
    redirect: '/science/disease',
    meta: { title: '科普管理', icon: 'Notebook' },
    sort: 1,
    children: [
      {
        path: '/science/disease',
        component: () => import('@/views/science/DiseaseView.vue'),
        meta: { title: '罕见病列表' },
      },
      {
        path: '/science/disease-business',
        component: () => import('@/views/science/DiseaseBusinessView.vue'),
        meta: { title: '罕见病关联' },
      },
      {
        path: '/science/disease-organization',
        component: () => import('@/views/science/DiseaseOrganizationView.vue'),
        meta: { title: '罕见病组织' },
      },
      {
        path: '/science/disease-organization-member',
        component: () => import('@/views/science/DiseaseOrganizationJoinMemberView.vue'),
        meta: { title: '罕见病组织加入者列表' },
      },
      {
        path: '/science/medical-guideline',
        component: () => import('@/views/science/MedicalGuidelineView.vue'),
        meta: { title: '罕见药典' },
      },
      {
        path: '/science/drug',
        component: () => import('@/views/science/DrugView.vue'),
        meta: { title: '罕见药品' },
      },
    ],
  },
] as RouteRecordRaw[]
