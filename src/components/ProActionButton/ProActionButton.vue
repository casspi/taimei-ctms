<template>
  <ElButton v-if="visible" v-bind="props" @click="handleClick">
    <slot> </slot>
  </ElButton>
</template>

<script setup lang="ts">
  import { isObject } from '@daysnap/utils'

  import { usePermissionStore } from '@/stores'
  import { open } from '@/utils'

  import { proActionButtonProps } from './types'

  const emits = defineEmits(['click'])
  const props = defineProps(proActionButtonProps)
  const { has } = usePermissionStore()

  const visible = computed(() => {
    const { pd } = props
    if (pd) {
      return has(isObject(pd) ? pd.value : pd)
    }
    return true
  })

  const handleClick = () => {
    emits('click')
    if (props.to) {
      open(props)
    }
  }
</script>
