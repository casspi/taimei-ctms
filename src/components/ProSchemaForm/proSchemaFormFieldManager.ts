import { isFunction } from '@daysnap/utils'
import {
  ElCascader,
  ElCheckboxGroup,
  ElDatePicker,
  ElDivider,
  ElInput,
  ElInputNumber,
  ElRadioGroup,
  ElSelect,
  ElTreeSelect,
} from 'element-plus'

import { ProFileUpload } from '../ProFileUpload'
import { ProImageUpload } from '../ProImageUpload'
import { ProTags } from '../ProTags'
import { ProTree } from '../ProTree'

type Constructor = abstract new (...args: any) => any

export type InstanceTypeProps<T extends Constructor> = InstanceType<T>['$props']

export type ProSchemaFormFieldOptions<T extends Constructor = any> =
  | {
      is: T
      props: InstanceTypeProps<T>
    }
  | { is: string; props: Record<string, any> }

let proSchemaFormFieldMapping: Record<string, ProSchemaFormFieldOptions> =
  (window as any).__camomilejs_obj__proSchemaFormFieldMapping ||
  ((window as any).__camomilejs_obj__proSchemaFormFieldMapping = {})

function set(name: string, props?: Record<string, any>): void
function set<T extends Constructor>(name: string, is: T, props?: InstanceTypeProps<T>): void
function set<T extends Constructor>(name: string, is?: any, props?: InstanceTypeProps<T>) {
  if (isFunction(is.setup)) {
    proSchemaFormFieldMapping[name] = { is, props: props ?? {} }
  } else {
    proSchemaFormFieldMapping[name] = { is: name, props: is ?? {} }
  }
}
function get(name: string): ProSchemaFormFieldOptions {
  return proSchemaFormFieldMapping[name]
}

function del(name: string) {
  delete proSchemaFormFieldMapping[name]
}

function clear() {
  ;(window as any).__camomilejs_obj__proSchemaFormFieldMapping = proSchemaFormFieldMapping = {}
}

export const proSchemaFormFieldManager = {
  set,
  get,
  del,
  clear,
}

// 注册
proSchemaFormFieldManager.set('ElInput', ElInput, {
  clearable: true,
  showWordLimit: true,
  autosize: { minRows: 2 },
})
proSchemaFormFieldManager.set('ElSelect', ElSelect, {
  clearable: true,
  filterable: true,
})
proSchemaFormFieldManager.set('ElRadioGroup', ElRadioGroup, {})
proSchemaFormFieldManager.set('ElCheckboxGroup', ElCheckboxGroup, {})
proSchemaFormFieldManager.set('ElDatePicker', ElDatePicker, {
  type: 'date',
  clearable: true,
})
proSchemaFormFieldManager.set('ElInputNumber', ElInputNumber, {})
proSchemaFormFieldManager.set('ElTreeSelect', ElTreeSelect, {})
proSchemaFormFieldManager.set('ElCascader', ElCascader, {
  clearable: true,
  validateEvent: false,
})
proSchemaFormFieldManager.set('ElDivider', ElDivider, {
  contentPosition: 'center',
})
proSchemaFormFieldManager.set('ProTree', ProTree, {})
proSchemaFormFieldManager.set('ProImageUpload', ProImageUpload, {})
proSchemaFormFieldManager.set('ProFileUpload', ProFileUpload, {})
proSchemaFormFieldManager.set('ProTags', ProTags, {})
