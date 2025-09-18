import type { RouteRecordRaw } from 'vue-router'

import common from './modules/common'

export const routes = [...common]

// 本地测试用这个
export const routes1 = ((s) =>
  Object.values(s).reduce<RouteRecordRaw[]>(
    (res, item: any) =>
      [...res, ...(item.default || [])].sort((a, b) => (a.sort ?? 0) - (b.sort ?? 0)),
    [],
  ))(import.meta.glob('./modules/*.ts', { eager: true }))
