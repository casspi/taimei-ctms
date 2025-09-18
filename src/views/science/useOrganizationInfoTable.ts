import { createProDialogForm } from '@/components'
import type { DiseaseOrganization } from '@/types'

import DiseaseOrganizationInfoView from './DiseaseOrganizationInfoView.vue'

export const useOrganizationInfoTable = createProDialogForm<DiseaseOrganization>(
  () => ({
    id: {
      is: markRaw(DiseaseOrganizationInfoView),
      value: '',
      width: '100%',
    },
  }),
  async (metadata, instance) => {
    instance.value.show({
      style: 'min-width: 1200px',
      title: '公告管理',
      metadata,
      showCancelButton: false,
      showConfirmButton: false,
    })
  },
)
