<template>
  <div class="pro-table-list">
    <div
      class="pro-table-content"
      :style="{ height: height }"
      v-loading="loading"
      element-loading-text="加载中"
    >
      <slot name="table" :data="data">
        <ElTable
          width="100%"
          table-layout="fixed"
          :data="data"
          height="100%"
          @selection-change="handleSelectionChange"
          v-bind="$attrs"
        >
          <template #empty>
            <ElEmpty description="暂无数据" :image-size="68" />
          </template>
          <slot></slot>
        </ElTable>
      </slot>
    </div>
    <ElPagination
      v-if="hasPagination"
      class="pro-table-pagination"
      layout="total, prev, pager, next, sizes, jumper"
      background
      small
      :current-page="pageIndex"
      :page-size="pageSize"
      :total="total"
      :page-sizes="[10, 20, 30, 40]"
      @update:current-page="$emit('request', { pageIndex: $event })"
      @update:page-size="$emit('request', { pageSize: $event, pageIndex: 1 })"
    />
  </div>
</template>
<script setup lang="ts">
  import { multipleSelectionKey } from './selection'

  defineEmits(['request'])

  defineProps({
    height: [String, Number],
    hasPagination: {
      type: Boolean,
      default: true,
    },
    total: {
      type: Number,
    },
    data: {
      type: Array,
    },
    pageSize: {
      type: Number,
      default: 10,
    },
    pageIndex: {
      type: Number,
      default: 1,
    },
    loading: {
      type: Boolean,
      default: false,
    },
  })

  const selected = inject(multipleSelectionKey, null) as Ref<any[]>
  const handleSelectionChange = (val: any[]) => {
    selected.value = val
  }
</script>
<style lang="scss" scoped>
  @use '@/assets/scss/define.scss' as *;
  .pro-table-list {
    @extend %pr;
    @extend %w100;
    z-index: 1;
    background-color: #fff;
    padding: 16px 0;
    :deep {
      .el-table {
        width: 100%;
        --el-table-bg-color: transparent;
        font-size: 12px;
      }
      .el-table__header {
        --el-table-header-bg-color: #f2f3f5;
        --el-table-header-text-color: #1d2129;
      }
      .el-table__body-wrapper {
        font-size: j(12);
        .el-table__cell {
          padding: j(10) 0;
        }
        .cell {
          // line-height: 1.4;
          .el-link {
            font-size: 12px;
          }
        }
        ul {
          li {
            word-break: break-all;
            margin-top: j(4);
            &:first-child {
              margin-top: 0;
            }
          }
        }
      }
    }
  }

  .pro-table-content {
    padding: 0 16px;
  }
  .pro-table-pagination {
    @extend %jce;
    margin-top: 24px;
    padding: 0 16px;
  }
</style>
