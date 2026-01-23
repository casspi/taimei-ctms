import type { ExtractPropTypes, PropType } from 'vue'

import { type ProSchemaFormMetadata, proSchemaFormProps } from '../ProSchemaForm'

export interface ProDrawerRequest {
  (data: any, schema: ProSchemaFormMetadata): Promise<any>
}

export const proDrawerProps = {
  ...proSchemaFormProps,
  title: String,
  style: {
    type: Object as PropType<Partial<CSSStyleDeclaration>>,
    default: () => ({}),
  },
  schema: {
    type: Object as PropType<ProSchemaFormMetadata>,
    default: () => ({}),
  },
  request: {
    type: Function as PropType<ProDrawerRequest>,
  },
  labelPosition: {
    type: String as PropType<'left' | 'right' | 'top'>,
    default: 'right',
  },
  labelWidth: {
    type: String,
    default: '120px',
  },
  showCancelButton: {
    type: Boolean,
    default: true,
  },
  showConfirmButton: {
    type: Boolean,
    default: true,
  },
  cancelButtonText: {
    type: String,
    default: '取消',
  },
  confirmButtonText: {
    type: String,
    default: '确认',
  },
}

export type ProDrawerProps = ExtractPropTypes<typeof proDrawerProps>
