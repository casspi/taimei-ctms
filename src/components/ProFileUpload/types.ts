import type { ExtractPropTypes, InputHTMLAttributes, PropType } from 'vue'

export const proFileUploadProps = {
  modelValue: {
    type: [String, Array] as PropType<string | string[]>,
    default: '',
  },
  type: {
    type: String as PropType<'video' | 'file'>,
    default: 'file',
  },
  accept: {
    type: String as PropType<InputHTMLAttributes['accept']>,
    default: '',
  },
  max: {
    type: Number,
    default: 1,
  },
  disabled: {
    type: Boolean,
    default: false,
  },
}

export type ProFileUploadProps = ExtractPropTypes<typeof proFileUploadProps>
