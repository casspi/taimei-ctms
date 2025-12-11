<template>
  <ElTableColumn v-bind="$attrs">
    <template #default="scope">
      <div
        class="c-status-column"
        :class="`c-status-column--${ReportAuditTypeValueMap[scope.row[auditCode]]?.iconType}`"
      >
        <slot :row="scope.row">
          <div class="inner">
            <i class="i-dot"></i>
            <span>{{ scope.row[auditKey] }}</span>
          </div>
          <ElPopover
            placement="bottom"
            title="Title"
            :width="200"
            trigger="click"
            content="this is content, this is content, this is content"
          >
            <template #reference>
              <ElLink type="primary">查看原因</ElLink>
            </template>
          </ElPopover>
        </slot>
      </div>
    </template>
  </ElTableColumn>
</template>

<script setup lang="ts">
  import { ReportAuditTypeValueMap } from '@/utils/constants'
  defineProps({
    auditKey: {
      type: String,
      default: 'report_audit',
    },
    auditCode: {
      type: String,
      default: 'report_audit_code',
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
