<template>
  <ElTableColumn v-if="visible" v-bind="attrs" fixed="right" label="操作" width="200px">
    <template #default="scope">
      <div class="pro-table-actions" ref="divRef">
        <slot :row="scope.row"> </slot>
      </div>
    </template>
  </ElTableColumn>
</template>

<script setup lang="ts">
  import type { Loose } from '@daysnap/types'
  import { isObject } from '@daysnap/utils'

  import { usePermissionStore } from '@/stores'

  const attrs = useAttrs()
  const props = defineProps({
    pds: {
      type: Array as PropType<(string | Loose<{ value: string }>)[]>,
      default: () => [],
    },
  })

  const { or } = usePermissionStore()
  const visible = computed(() => {
    if (!props.pds.length) {
      return true
    }
    return or(props.pds.map((pd) => (isObject(pd) ? pd.value : pd)))
  })
</script>

<style lang="scss" scoped>
  @use '@/assets/scss/define.scss' as *;
  .pro-table-actions {
    :deep {
      .el-button {
        line-height: 1.6;
      }
      .el-button + .el-button {
        margin-left: 0;
      }
      .pro-table-action-button {
        min-width: 50%;
      }
    }
  }
</style>
