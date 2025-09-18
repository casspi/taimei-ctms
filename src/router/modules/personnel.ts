import type { RouteRecordRaw } from 'vue-router'

import { LayoutView } from '@/layout'

export default [
  {
    path: '/personnel',
    component: LayoutView,
    redirect: '/personnel/volunteer',
    meta: { title: '企业人事管理', icon: 'Management' },
    sort: 3,
    children: [
      {
        path: '/personnel/enterprise',
        component: () => import('@/views/personnel/EnterpriseView.vue'),
        meta: { title: '企业管理' },
      },
      {
        path: '/personnel/doctor',
        component: () => import('@/views/personnel/DoctorView.vue'),
        meta: { title: '医生管理' },
      },
      {
        path: '/personnel/hospital',
        component: () => import('@/views/personnel/HospitalView.vue'),
        meta: { title: '医院管理' },
      },
      {
        path: '/personnel/volunteer',
        component: () => import('@/views/personnel/VolunteerView.vue'),
        meta: { title: '志愿者管理' },
      },
      {
        path: '/personnel/institution',
        component: () => import('@/views/personnel/InstitutionView.vue'),
        meta: { title: '机构管理' },
      },
    ],
  },
] as RouteRecordRaw[]
