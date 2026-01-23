import Component from './ProDrawer.vue'

export * from './types'
export * from './useProDrawer'

export const ProDrawer = Component
export default ProDrawer

export type ProDrawerInstance = InstanceType<typeof ProDrawer>
