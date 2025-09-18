import type { Loose } from '@daysnap/types'
import { buttonProps } from 'element-plus'
import type { RouteLocationRaw } from 'vue-router'

export const proActionButtonProps = {
  ...buttonProps,
  pd: {
    type: [String, Object] as PropType<string | Loose<{ value: string }>>,
    default: '',
  },
  to: {
    type: [String, Object] as PropType<RouteLocationRaw>,
    default: '',
  },
  features: {
    type: String,
    default: '',
  },
}
