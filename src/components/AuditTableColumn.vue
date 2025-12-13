<template>
  <ElTableColumn v-bind="$attrs">
    <template #default="scope">
      <div
        class="c-status-column"
        :class="`c-status-column--${dicMap[scope.row[auditCode]]?.iconType}`"
      >
        <slot :row="scope.row">
          <div class="inner">
            <i class="i-dot"></i>
            <span>{{ scope.row[auditKey] }}</span>
          </div>
          <ResonPopover v-if="scope.row[auditCode] === 3" :row="scope.row" />
        </slot>
      </div>
    </template>
  </ElTableColumn>
</template>

<script setup lang="ts">
  import { ReportAuditTypeValueMap } from '@/utils/constants'
  import ResonPopover from '@/views/site/components/ResonPopover.vue'
  defineProps({
    auditKey: {
      type: String,
      default: 'report_audit',
    },
    auditCode: {
      type: String,
      default: 'report_audit_code',
    },
    dicMap: {
      type: Array as PropType<typeof ReportAuditTypeValueMap>,
      default: () => ReportAuditTypeValueMap,
    },
  })
</script>

<style lang="scss" scoped>
  .c-status-column {
    display: column;
    .inner {
      display: flex;
      align-items: center;
    }

    &--primary {
      i {
        background: #108ee9;
      }
    }
    &--success {
      i {
        background: var(--el-color-success);
      }
    }
    &--info {
      i {
        background: var(--el-color-info-light-3);
      }
    }
    &--warning {
      i {
        background: var(--el-color-warning);
      }
    }
    .i-dot {
      margin-right: 4px;
      display: inline-block;
      width: 6px;
      height: 6px;
      border-radius: 50%;
    }
  }
</style>
