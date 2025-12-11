<template>
  <ElTableColumn v-bind="$attrs">
    <template #default="scope">
      <ul class="c-date-column">
        <slot :row="scope.row">
          <li>
            {{ timeLabel[0] }}
            {{ parseDate(scope.row[keys[0]]) }}
          </li>
          <li>
            {{ timeLabel[1] }}
            {{ parseDate(scope.row[keys[1]]) }}
          </li>
        </slot>
      </ul>
    </template>
  </ElTableColumn>
</template>

<script setup lang="ts">
  import { formatDate } from '@daysnap/utils'
  const props = defineProps({
    timeLabel: {
      type: Array as PropType<string[]>,
      default: () => ['开始', '结束'],
    },
    keys: {
      type: Array as PropType<string[]>,
      default: () => ['start_time', 'end_time'],
    },
  })

  const parseDate = (date: number | string) => {
    return date ? formatDate(+date, 'yyyy-MM-dd') : ''
  }
</script>

<style lang="scss" scoped></style>
