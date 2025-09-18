import { createProDialogForm } from '@/components'
import type { Project } from '@/types'

import DiseasePrescribe from './DiseasePrescribe.vue'

export const useDiseasePrescribeTable = createProDialogForm<Project>(
  () => ({
    loginId: {
      is: markRaw(DiseasePrescribe),
      value: '',
      width: '100%',
    },
  }),
  async (metadata, instance) => {
    instance.value.show({
      style: 'min-width: 1200px',
      title: '开药记录管理',
      metadata,
      showCancelButton: false,
      showConfirmButton: false,
    })
  },
)
