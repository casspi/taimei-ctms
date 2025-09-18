<template>
  <ul class="config-award">
    <li v-for="(item, index) in modelValue" :key="index">
      <ElInput v-mode="item.computationId" placeholder="元素id" />
      <ElInput v-mode="item.name" placeholder="元素名称" />
      <ElSelect v-model="item.type" placeholder="选择元素类型">
        <ElOption
          v-for="(option, index) in types"
          v-bind="option.props"
          :key="index"
          :label="option.label"
          :value="option.value"
        />
      </ElSelect>
      <ElInputNumber v-mode="item.maxValue" placeholder="最大值" />
      <ElInputNumber v-mode="item.minValue" placeholder="最小值" />
      <ElInput v-mode="item.name" placeholder="元素说明" />
      <ElButton type="danger" icon="Delete" @click="handleDelField(index)" />
    </li>
    <li>
      <ElButton type="primary" icon="Plus" @click="handleAddField">新增</ElButton>
    </li>
  </ul>
</template>

<script setup lang="ts">
  import type { MedicalComputationItemVOField } from '@/types'

  const emits = defineEmits(['update:modelValue'])
  const props = defineProps({
    modelValue: {
      type: Array as PropType<MedicalComputationItemVOField[]>,
      default: () => [],
    },
    types: {
      type: Array as PropType<any[]>,
      default: () => [],
    },
  })

  const handleAddField = () => {
    const newField = {
      level: '',
      peopleNums: null,
      integral: null,
    }
    const { modelValue } = props
    emits('update:modelValue', [...modelValue, newField])
  }

  const handleDelField = (index: number) => {
    const { modelValue } = props
    const newFields = modelValue.filter((_, i) => i !== index)
    emits('update:modelValue', newFields)
  }
</script>

<style lang="scss">
  @use '@/assets/scss/define.scss' as *;
  .config-award {
    li {
      @extend %df;
      @extend %aic;
      @extend %fww;
      padding: 10px 0;
      border-top: 1px solid #ddd;
      gap: 10px;
      &:first-child {
        border-top: none;
        margin-top: 0;
      }
      > div {
        max-width: 25%;
        min-width: none;
      }
    }
  }
</style>
