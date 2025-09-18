<template>
  <ul class="config-award">
    <li v-for="(item, index) in modelValue" :key="index">
      <ElSelect v-model="item.level" placeholder="请选择活动等级">
        <ElOption
          v-for="(option, index) in parseLevels(item.level)"
          v-bind="option.props"
          :key="index"
          :label="option.label"
          :value="option.value"
          :disabled="option.disabled"
        />
      </ElSelect>
      <ElInputNumber v-model="item.peopleNums" :min="0" placeholder="请填写人数" />
      <ElInputNumber v-model="item.integral" :min="0" placeholder="请填写积分数" />
      <ElButton type="danger" icon="Delete" @click="handleDelField(index)">删除</ElButton>
    </li>
    <li v-if="modelValue.length < levels.length">
      <ElButton type="primary" icon="Plus" @click="handleAddField">新增</ElButton>
    </li>
  </ul>
</template>

<script setup lang="ts">
  import type { ConfigAward } from '@/types'

  const emits = defineEmits(['update:modelValue'])
  const props = defineProps({
    modelValue: {
      type: Array as PropType<ConfigAward[]>,
      default: () => [],
    },
    levels: {
      type: Array as PropType<any[]>,
      default: () => [],
    },
  })

  const parseLevels = (level: string) => {
    const { modelValue, levels } = props
    const includes = modelValue.map((item) => item.level)
    return levels.map((item) => {
      return {
        ...item,
        disabled: item.value !== level && includes.includes(item.value),
      }
    })
  }

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
      margin-top: 10px;
      gap: 10px;
      &:first-child {
        margin-top: 0;
      }
    }
  }
</style>
