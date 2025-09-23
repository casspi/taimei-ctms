import type { RouteRecordRaw } from 'vue-router'

import { LayoutView } from '@/layout'

export default [
  {
    path: '/login',
    name: 'LoginView',
    hidden: true,
    component: () => import('@/views/common/LoginView.vue'),
    meta: { title: '登录', requiresAuth: -1 },
  },

  {
    path: '/',
    component: () => import('@/views/common/ConsoleView.vue'),
    hidden: true,
    meta: { title: '控制台', requiresAuth: 1 },
  },

  {
    path: '/tinymce',
    component: () => import('@/views/common/TinymceView.vue'),
    hidden: true,
    meta: { title: '富文本编辑框', requiresAuth: -1 },
  },

  {
    path: '/ctms',
    component: () => import('@/views/ctms/CtmsView.vue'),
    meta: {
      title: 'CTMS',
      requiresAuth: 1,
      image: './assets/img/ccp.png',
      isConsole: true,
    },
    children: [
      {
        path: '',
        component: () => import('@/views/ctms/MyProjectView.vue'),
        meta: { title: '我的项目' },
      },
      {
        path: 'dashboard',
        component: () => import('@/views/ctms/DashboardView.vue'),
        meta: { title: '敬请期待' },
      },
    ],
  },

  {
    path: '/mock',
    component: LayoutView,
    hidden: true,
    children: [
      {
        path: '',
        component: () => import('@/views/common/MockView.vue'),
        hidden: true,
        meta: { title: '数据mock', requiresAuth: -1 },
      },
    ],
  },

  // https://router.vuejs.org/zh/guide/essentials/dynamic-matching.html
  { path: '/:pathMatch(.*)*', name: '404', redirect: '/', hidden: true },
] as RouteRecordRaw[]
