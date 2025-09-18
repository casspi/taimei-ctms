import { createProDialogForm } from '@/components'
import type { Project } from '@/types'

import ProjectSubsidyView from './ProjectSubsidyView.vue'

export const useProjectSubsidyTable = createProDialogForm<Project>(
  () => ({
    projectId: {
      is: markRaw(ProjectSubsidyView),
      value: '',
      width: '100%',
    },
  }),
  async (metadata, instance) => {
    instance.value.show({
      style: 'min-width: 1200px',
      title: '补助管理',
      metadata,
      showCancelButton: false,
      showConfirmButton: false,
    })
  },
)
