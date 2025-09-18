import type { RouteRecordRaw } from 'vue-router'

import { LayoutView } from '@/layout'

export default [
  {
    path: '/system',
    component: LayoutView,
    redirect: '/system/user',
    meta: { title: '系统管理', icon: 'Setting' },
    sort: 99,
    children: [
      {
        path: '/system/user',
        component: () => import('@/views/system/UserView.vue'),
        meta: { title: '用户管理' },
      },
      {
        path: '/system/user/integral',
        component: () => import('@/views/system/IntegralView.vue'),
        meta: { title: '用户积分管理' },
      },
      {
        path: '/system/menu',
        component: () => import('@/views/system/MenuView.vue'),
        meta: { title: '菜单管理' },
      },
      {
        path: '/system/role',
        component: () => import('@/views/system/RoleView.vue'),
        meta: { title: '角色管理' },
      },
      {
        path: '/system/unit',
        component: () => import('@/views/system/UnitView.vue'),
        meta: { title: '单位管理' },
      },
      {
        path: '/system/department',
        component: () => import('@/views/system/DepartmentView.vue'),
        meta: { title: '部门管理' },
      },
      {
        path: '/system/patient',
        component: () => import('@/views/system/PatientView.vue'),
        meta: { title: '患者管理' },
      },
      {
        path: '/system/disease-hospital',
        component: () => import('@/views/system/DiseaseHospital.vue'),
        meta: { title: '患者住院记录' },
      },
      {
        path: '/system/disease-prescribe',
        component: () => import('@/views/system/DiseasePrescribe.vue'),
        meta: { title: '患者开药记录' },
      },
      {
        path: '/system/disease-treatment',
        component: () => import('@/views/system/DiseaseTreatment.vue'),
        meta: { title: '患者治疗记录' },
      },
    ],
  },
] as RouteRecordRaw[]
