<template>
  <div v-if="visible" class="pro-table-action-button">
    <ProActionButton v-bind="props" link @click="$emit('click')">
      <slot> </slot>
    </ProActionButton>
  </div>
</template>

<script setup lang="ts">
  import { isObject } from '@daysnap/utils'

  import { usePermissionStore } from '@/stores'

  import { proActionButtonProps } from '../ProActionButton'

  defineEmits(['click'])

  const props = defineProps(proActionButtonProps)

  const { has } = usePermissionStore()

  const visible = computed(() => {
    const { pd } = props
    if (pd) {
      return has(isObject(pd) ? pd.value : pd)
    }
    return true
  })
</script>

<style lang="scss" scoped>
  @use '@/assets/scss/define.scss' as *;
  .pro-table-action-button {
    @extend %dib;
    :deep {
      .el-button {
        text-align: left;
        line-height: 1.3;
        white-space: normal;
      }
    }
  }
</style>
