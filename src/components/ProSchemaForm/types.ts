import type { Arrayable } from '@daysnap/types'
import { omit } from '@daysnap/utils'
import { type ColProps, type FormItemRule, formProps } from 'element-plus'
import type { ExtractPropTypes, PropType, Raw } from 'vue'

type IS =
  | 'ElInput'
  | 'ElSelect'
  | 'ElRadioGroup'
  | 'ElCheckboxGroup'
  | 'ElDatePicker'
  | 'ElInputNumber'
  | 'ElTreeSelect'
  | 'ProTree'
  | 'ElCascader'
  | 'ProImageUpload'
  | 'ProFileUpload'
  | 'ProTags'
  | 'ElDivider'
  | `X${string}`

export interface ProSchemaFormField {
  is?: IS | Raw<object>
  label?: string
  value?: any
  defaultValue?: any
  colProps?: Partial<ColProps>
  get?: (...args: any[]) => any
  set?: (...args: any[]) => any
  hidden?:
    | boolean
    | ((value: any, field: ProSchemaFormField, metadata: ProSchemaFormMetadata) => boolean)
  props?: Record<string, any>
  options?: any
  labelKey?: string
  valueKey?: string
  onChange?: (value: any, field: ProSchemaFormField, metadata: ProSchemaFormMetadata) => any
  onInput?: (value: any, field: ProSchemaFormField, metadata: ProSchemaFormMetadata) => any
  rules?:
    | Arrayable<FormItemRule>
    | ((
        value: any,
        field: ProSchemaFormField,
        metadata: ProSchemaFormMetadata,
      ) => Arrayable<FormItemRule>)
  [prop: string]: any
}

export type ProSchemaFormMetadata = Record<string, ProSchemaFormField>

export const proSchemaFormProps = {
  ...omit(formProps, ['model', 'rules']),
  validateOnRuleChange: {
    type: Boolean,
    default: false,
  },
  gutter: {
    type: Number,
    default: 16,
  },
  colProps: {
    type: Object as PropType<Partial<ColProps>>,
    default: () => ({}),
  },
  schema: {
    type: Object as PropType<ProSchemaFormMetadata>,
    default: () => ({}),
  },
}

export type ProSchemaFormProps = ExtractPropTypes<typeof proSchemaFormProps>
