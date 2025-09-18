import type { EditorSettings } from 'tinymce/tinymce'
import type { ExtractPropTypes, PropType } from 'vue'

export const proTinymceProps = {
  options: {
    type: Object as PropType<Partial<EditorSettings>>,
    default: () => ({}),
  },
  modelValue: {
    type: String,
    default: '',
  },
  height: {
    type: [Number, String],
    required: false,
    default: 400,
  },
}

export type ProTinymceProps = ExtractPropTypes<typeof proTinymceProps>
