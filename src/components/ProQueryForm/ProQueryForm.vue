<template>
  <div class="pro-query-form">
    <ElForm :model="formInline" label-position="right">
      <ElSpace span="16">
        <!-- <ElCol v-for="(item, key) in computedFields" :key="key" :span="item.span ?? 8"> -->
        <ElFormItem v-for="(item, key) in computedFields" :key="key" :label="item.label">
          <ElInput
            v-if="item.is === 'form-input'"
            v-model="item.value"
            placeholder="请填写"
            clearable
            v-bind="item.props"
          />
          <ElSelect
            v-else-if="item.is === 'form-select'"
            v-model="item.value"
            placeholder="请选择"
            clearable
            filterable
            style="width: 200px"
            v-bind="item.props"
          >
            <ElOption
              v-for="(option, index) in item.options"
              v-bind="option.props"
              :key="index"
              :label="option[item.labelKey || 'label'] || option"
              :value="option[item.valueKey || 'value'] ?? option"
            />
          </ElSelect>
          <ElRadioGroup v-else-if="item.is === 'form-radio'" v-model="item.value">
            <ElRadio
              v-for="(option, index) in item.options"
              v-bind="option.props"
              :key="index"
              :value="option[item.valueKey || 'value'] ?? option"
            >
              {{ option[item.labelKey || 'label'] || option }}
            </ElRadio>
          </ElRadioGroup>
          <ElCheckboxGroup
            v-else-if="item.is === 'form-checkbox'"
            v-model="item.value"
            v-bind="item.props"
          >
            <ElCheckbox
              v-for="(option, index) in item.options"
              v-bind="option.props"
              :key="index"
              :value="option[item.valueKey || 'value'] ?? option"
            >
              {{ option[item.labelKey || 'label'] || option }}
            </ElCheckbox>
          </ElCheckboxGroup>
          <ElDatePicker
            v-else-if="item.is === 'form-date-picker'"
            v-model="item.value"
            type="date"
            placeholder="请选择"
            clearable
            :value-format="datePickerValueFormat[item.props?.type ?? 'date']"
            start-placeholder="请选择"
            end-placeholder="请选择"
            v-bind="item.props"
          />
          <ElTreeSelect
            v-else-if="item.is === 'form-tree-select'"
            v-model="item.value"
            clearable
            v-bind="item.props"
            :data="item.options"
          />
          <ElCascader
            v-else-if="item.is === 'form-cascader'"
            v-model="item.value"
            clearable
            v-bind="item.props"
            :validate-event="false"
          />
          <Component
            v-else-if="item.is"
            v-model="item.value"
            v-bind="{ ...item, ...item.props }"
            :hidden="false"
            :is="item.is"
          />
        </ElFormItem>
        <!-- </ElCol> -->

        <!-- <ElCol :span="8" class="pro-query-form-actions"> -->
        <ElFormItem class="pro-query-form-actions">
          <ElButton type="primary" :loading="loading" @click="handleQuery"> 查询 </ElButton>
          <ElButton @click="handleReset">重置</ElButton>
          <ElButton
            v-if="Object.keys(computedMoreFields).length > 0"
            type="primary"
            link
            @click="showMore = !showMore"
          >
            <template v-if="showMore">
              收起 <ElIcon> <ArrowUp /></ElIcon>
            </template>
            <template v-else>
              展开 <ElIcon> <ArrowDown /></ElIcon>
            </template>
          </ElButton>
        </ElFormItem>
        <!-- </ElCol> -->
      </ElSpace>
      <ElSpace
        span="18"
        class="more-fields"
        v-if="showMore && Object.keys(computedMoreFields).length > 0"
      >
        <ElFormItem
          v-for="(item, key) in computedMoreFields"
          :key="key"
          :label="item.label"
          :label-position="item.labelPosition || 'right'"
        >
          <ElInput
            v-if="item.is === 'form-input'"
            v-model="item.value"
            placeholder="请填写"
            clearable
            v-bind="item.props"
          />
          <ElSelect
            v-else-if="item.is === 'form-select'"
            v-model="item.value"
            placeholder="请选择"
            clearable
            filterable
            style="width: 200px"
            v-bind="item.props"
          >
            <ElOption
              v-for="(option, index) in item.options"
              v-bind="option.props"
              :key="index"
              :label="option[item.labelKey || 'label'] || option"
              :value="option[item.valueKey || 'value'] ?? option"
            />
          </ElSelect>
          <ElRadioGroup v-else-if="item.is === 'form-radio'" v-model="item.value">
            <ElRadio
              v-for="(option, index) in item.options"
              v-bind="option.props"
              :key="index"
              :value="option[item.valueKey || 'value'] ?? option"
            >
              {{ option[item.labelKey || 'label'] || option }}
            </ElRadio>
          </ElRadioGroup>
          <ElCheckboxGroup
            v-else-if="item.is === 'form-checkbox'"
            v-model="item.value"
            v-bind="item.props"
          >
            <ElCheckbox
              v-for="(option, index) in item.options"
              v-bind="option.props"
              :key="index"
              :value="option[item.valueKey || 'value'] ?? option"
            >
              {{ option[item.labelKey || 'label'] || option }}
            </ElCheckbox>
          </ElCheckboxGroup>
          <ElDatePicker
            v-else-if="item.is === 'form-date-picker'"
            v-model="item.value"
            type="date"
            placeholder="请选择"
            clearable
            :value-format="datePickerValueFormat[item.props?.type ?? 'date']"
            start-placeholder="请选择"
            end-placeholder="请选择"
            v-bind="item.props"
          />
          <ElTreeSelect
            v-else-if="item.is === 'form-tree-select'"
            v-model="item.value"
            clearable
            v-bind="item.props"
            :data="item.options"
          />
          <ElCascader
            v-else-if="item.is === 'form-cascader'"
            v-model="item.value"
            clearable
            v-bind="item.props"
            :validate-event="false"
          />
          <Component
            v-else-if="item.is"
            v-model="item.value"
            v-bind="{ ...item, ...item.props }"
            :hidden="false"
            :is="item.is"
          />
        </ElFormItem>
      </ElSpace>
    </ElForm>
  </div>
</template>

<script setup lang="ts">
  import { banana } from '@daysnap/banana'
  import { filterEmptyValue, isArray, isObject, isUndefined } from '@daysnap/utils'

  import { proQueryFormProps } from './types'

  const formInline = reactive({
    user: '',
    region: '',
    date: '',
  })

  const emits = defineEmits(['query', 'reset'])
  const props = defineProps(proQueryFormProps)

  const computedFields = computed(() => {
    const { metadata, moreIndex } = props
    const fields = { ...metadata }

    if (moreIndex > 0) {
      // 按索引分割，小于moreIndex的字段显示在默认区域
      const keys = Object.keys(fields)
      const result: Record<string, any> = {}

      for (let i = 0; i < keys.length; i++) {
        if (i < moreIndex) {
          result[keys[i]] = fields[keys[i]]
        }
      }

      return result
    } else {
      return fields
    }
  })
  const computedMoreFields = computed(() => {
    const { metadata, moreIndex } = props
    const fields = { ...metadata }

    if (moreIndex > 0) {
      // 按索引分割，大于等于moreIndex的字段显示在更多筛选区域
      const keys = Object.keys(fields)
      const result: Record<string, any> = {}

      for (let i = 0; i < keys.length; i++) {
        if (i >= moreIndex) {
          result[keys[i]] = fields[keys[i]]
        }
      }

      return result
    } else {
      return {}
    }
  })

  const showMore = ref(false)

  // 查询
  const handleQuery = () => {
    const value = filterEmptyValue(banana.extract(computedFields.value), true)
    const moreValue = filterEmptyValue(banana.extract(computedMoreFields.value), true)
    emits('query', { ...value, ...moreValue })
  }

  // YYYY-MM-DD HH:mm:ss
  const datePickerValueFormat: Record<string, string> = {
    date: 'YYYY-MM-DD',
    daterange: 'YYYY-MM-DD',
    datetimerange: 'YYYY-MM-DD HH:mm:ss',
  }

  // 重置
  const handleReset = () => {
    const { metadata } = props
    Object.keys(metadata).forEach((key) => {
      const filed = metadata[key]
      let { value, defaultValue } = filed
      if (!isUndefined(defaultValue)) {
        value = defaultValue
      } else if (isArray(value)) {
        value = []
      } else if (isObject(value)) {
        value = {}
      } else {
        value = ''
      }
      filed.value = value
    })
    emits('reset')
    handleQuery()
  }
</script>

<style lang="scss" scoped>
  @use '@/assets/scss/define.scss' as *;
  .pro-query-form {
    @extend %df;
    @extend %pr;
    background-color: #fff;
    // max-width: 1000px;
    flex: 1;
    min-width: 800px;
    :deep {
      .el-date-editor {
        --el-date-editor-width: 100%;
      }
      .el-space {
        align-items: flex-start !important;
      }
      .el-form {
        @extend %db;
        @extend %w100;
      }
      .el-form-item__label {
        @extend %df;
        @extend %aic;
        @extend %tar;
        line-height: 1.1;
      }
      .el-form-item {
        margin-bottom: 0;
      }
      .el-col {
        margin-top: j(16);
        &:nth-child(1),
        &:nth-child(2),
        &:nth-child(3) {
          margin-top: 0;
        }
      }
      .el-cascader {
        @extend %w100;
      }
    }
    .more-fields {
      margin-top: 16px;
    }
  }

  .pro-query-form-actions {
    margin-left: auto;
    // @extend %df;
    // @extend %fdc;
    // @extend %aic;
    // margin-left: j(16);
    // :deep {
    //   .el-button + .el-button {
    //     margin-left: 0;
    //     margin-top: j(10);
    //   }
    // }
  }
</style>
