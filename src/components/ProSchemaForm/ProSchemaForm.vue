<template>
  <ElForm
    v-bind="formRestProps"
    class="pro-schema-form"
    ref="formInstance"
    :model="model"
    :rules="rules"
  >
    <ElRow :gutter="gutter">
      <ElCol v-for="(item, key) in metadata" :key="key" v-bind="{ ...colProps, ...item.colProps }">
        <ElFormItem :label="item.label" :prop="key">
          <Component
            v-if="item.is === 'ElCascader'"
            v-model="item.value"
            v-bind="mapping?.[key]?.props"
            :is="mapping?.[key]?.is"
            ref="components"
            @change="handleChange(key, $event)"
            @input="handleInput(key, $event)"
          />
          <Component
            v-else-if="item.is"
            v-model="item.value"
            v-bind="mapping?.[key]?.props"
            :is="mapping?.[key]?.is"
            ref="components"
            @change="handleChange(key, $event)"
            @input="handleInput(key, $event)"
          >
            <template v-for="(slot, key) in item.slots" #[slot] :key="slot">
              <slot :name="key" :item="item" />
            </template>
            <template v-if="item.is === 'ElSelect'">
              <ElOption
                v-for="(option, index) in item.options"
                v-bind="option.props"
                :key="index"
                :label="option[item.labelKey || 'label'] || option"
                :value="option[item.valueKey || 'value'] ?? option"
              />
            </template>
            <template v-else-if="item.is === 'ElRadioGroup'">
              <ElRadio
                v-for="(option, index) in item.options"
                v-bind="option.props"
                :key="index"
                :value="option[item.valueKey || 'value'] ?? option"
              >
                {{ option[item.labelKey || 'label'] || option }}
              </ElRadio>
            </template>
            <template v-else-if="item.is === 'ElCheckboxGroup'">
              <ElCheckbox
                v-for="(option, index) in item.options"
                v-bind="option.props"
                :key="index"
                :value="option[item.valueKey || 'value'] ?? option"
              >
                {{ option[item.labelKey || 'label'] || option }}
              </ElCheckbox>
            </template>
          </Component>
        </ElFormItem>
      </ElCol>
      <slot></slot>
    </ElRow>
  </ElForm>
</template>

<script setup lang="ts">
  import { LOCALE } from '@camomile.js/components'
  import banana from '@daysnap/banana'
  import { isFunction, isString, pick } from '@daysnap/utils'
  import { type FormInstance, formProps } from 'element-plus'
  import { computed, inject, ref, useTemplateRef } from 'vue'

  import { proSchemaFormFieldManager } from './proSchemaFormFieldManager'
  import { type ProSchemaFormMetadata, proSchemaFormProps } from './types'

  const emits = defineEmits(['change-field', 'input-field'])

  const locale = inject('locale', LOCALE)

  const props = defineProps(proSchemaFormProps)

  const handleChange = async (key: string, value: any) => {
    emits('change-field', { key, value })
    await props.schema[key]?.onChange?.(value, props.schema[key], props.schema)
  }

  const handleInput = async (key: string, value: any) => {
    emits('input-field', { key, value })
    await props.schema[key]?.onInput?.(value, props.schema[key], props.schema)
  }

  const formRestProps = computed(() => {
    return pick(props, Object.keys(formProps) as any)
  })

  // 规则
  const rules = ref<Record<string, any>>({})
  const model = ref<Record<string, any>>({})

  // 元数据
  const metadata = computed(() => {
    const { schema } = props

    const rawRules: Record<string, any> = {}
    const rawModel: Record<string, any> = {}
    const metadata: ProSchemaFormMetadata = {}

    Object.entries(schema).forEach(([key, item]) => {
      let { hidden, value, rules, is } = item

      if (isFunction(hidden)) {
        hidden = hidden(value, item, schema)
      }
      if (!is) {
        hidden = true
      }
      if (!hidden) {
        rawModel[key] = value
        metadata[key] = item
      }

      if (isFunction(rules)) {
        rules = rules(value, item, schema)
      }
      rawRules[key] = rules
    })

    Object.assign(model.value, rawModel)
    Object.assign(rules.value, rawRules)
    return metadata
  })

  // YYYY-MM-DD HH:mm:ss
  const datePickerValueFormat: Record<string, string> = {
    date: 'YYYY-MM-DD',
    daterange: 'YYYY-MM-DD',
    datetimerange: 'YYYY-MM-DD HH:mm:ss',
    datetime: 'YYYY-MM-DD HH:mm:ss',
  }

  const mapping = computed(() => {
    return Object.entries(metadata.value).reduce<Record<string, any>>((res, [key, item]) => {
      let { props = {}, is } = item
      if (isString(is)) {
        const data = proSchemaFormFieldManager.get(is)
        if (data) {
          let loc: Record<string, any> = {}
          if (isString(is)) {
            loc = (locale.schemaForm as any)[is]
          }

          if (is === 'ElDatePicker') {
            props.valueFormat = datePickerValueFormat[props?.type ?? 'date']
          }
          is = data.is
          props = Object.assign({}, data.props, loc, props)

          if (props.disabled) {
            props.placeholder = '-'
            if (is === 'ElDatePicker') {
              props.startPlaceholder = '-'
              props.endPlaceholder = '-'
            }
          }
        }
      }
      res[key] = { is, props }
      return res
    }, {})
  })

  // 校验
  const componentRefs = useTemplateRef<any[]>('components')
  const formRef = useTemplateRef<FormInstance>('formInstance')
  const validate = async () => {
    const instances = componentRefs.value?.filter((item) => isFunction(item.validate)) ?? []
    await Promise.all([formRef.value, ...instances].map((item) => item?.validate()))
  }
  const resetFields = () => {
    formRef.value?.resetFields()
  }
  const validateField = async (key: string) => {
    return formRef.value?.validateField(key)
  }
  const extractValues = async () => {
    // 获取值 这里返回异步函数 为以后可能会做校验做准备
    const instances = componentRefs.value?.filter((item) => isFunction(item.extractValues)) ?? []
    const results = await Promise.all<Record<string, any>[]>(
      instances.map((item) => item.extractValues()),
    )
    results.push(banana.extract(props.schema as any))
    return results.filter(Boolean).reduce<Record<string, any>>((res, item) => {
      return { ...res, ...item }
    }, {})
  }

  defineExpose({
    validate,
    resetFields,
    extractValues,
    validateField,
  })
</script>
