import { createProDialogForm } from '@/components'
import type { Project } from '@/types'

import DiseaseTreatment from './DiseaseTreatment.vue'

export const useDiseaseTreatmentTable = createProDialogForm<Project>(
  () => ({
    loginId: {
      is: markRaw(DiseaseTreatment),
      value: '',
      width: '100%',
    },
  }),
  async (metadata, instance) => {
    instance.value.show({
      style: 'min-width: 1200px',
      title: '治疗记录管理',
      metadata,
      showCancelButton: false,
      showConfirmButton: false,
    })
  },
)
