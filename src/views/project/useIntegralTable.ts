import { createProDialogForm } from '@/components'
import type { User } from '@/types'

import IntegralView from '../system/IntegralView.vue'

export const useIntegralTable = createProDialogForm<User>(
  () => ({
    createBy: {
      is: markRaw(IntegralView),
      value: '',
      width: '100%',
    },
  }),
  async (metadata, instance) => {
    instance.value.show({
      style: 'min-width: 1200px',
      title: '积分管理',
      metadata,
      showCancelButton: false,
      showConfirmButton: false,
    })
  },
)
