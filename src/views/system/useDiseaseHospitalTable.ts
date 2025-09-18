import { createProDialogForm } from '@/components'
import type { Project } from '@/types'

import DiseaseHospital from './DiseaseHospital.vue'

export const useDiseaseHospitalTable = createProDialogForm<Project>(
  () => ({
    loginId: {
      is: markRaw(DiseaseHospital),
      value: '',
      width: '100%',
    },
  }),
  async (metadata, instance) => {
    instance.value.show({
      style: 'min-width: 1200px',
      title: '住院记录管理',
      metadata,
      showCancelButton: false,
      showConfirmButton: false,
    })
  },
)
