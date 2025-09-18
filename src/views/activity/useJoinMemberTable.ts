import { createProDialogForm } from '@/components'
import type { Project } from '@/types'

import JoinMemberView from './JoinMemberView.vue'

export const useJoinMemberTable = createProDialogForm<Project>(
  () => ({
    id: {
      is: markRaw(JoinMemberView),
      value: '',
      width: '100%',
    },
  }),
  async (metadata, instance) => {
    instance.value.show({
      style: 'min-width: 1200px',
      title: '申请管理',
      metadata,
      showCancelButton: false,
      showConfirmButton: false,
    })
  },
)
