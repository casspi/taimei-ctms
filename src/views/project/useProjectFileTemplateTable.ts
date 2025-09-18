import { createProDialogForm } from '@/components'
import type { Project } from '@/types'

import ProjectFileTemplateView from './ProjectFileTemplateView.vue'

export const useProjectFileTemplateTable = createProDialogForm<Project>(
  () => ({
    projectId: {
      is: markRaw(ProjectFileTemplateView),
      value: '',
      width: '100%',
    },
  }),
  async (metadata, instance) => {
    instance.value.show({
      style: 'min-width: 1200px',
      title: '文件管理',
      metadata,
      showCancelButton: false,
      showConfirmButton: false,
    })
  },
)
