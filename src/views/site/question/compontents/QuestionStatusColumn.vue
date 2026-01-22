<template>
  <ElTableColumn v-bind="$attrs">
    <template #default="scope">
      <div class="c-status-column" :class="`c-status-column--${dicMap[1]?.iconType}`">
        <slot :row="scope.row">
          <div class="inner">
            <i class="i-dot"></i>
            <ElPopover width="220">
              <template #reference>
                <span>未解决</span>
              </template>
              <template #default>
                <ul class="step-warp">
                  <li class="step-item start-step active">
                    <i class="i-dot"></i>
                    <span>未解决</span>
                    <time datetime="">2023-08-01</time>
                  </li>
                  <li class="step-item end-step">
                    <i class="i-dot"></i>
                    <span>已解决</span>
                    <time datetime="">2023-08-01</time>
                  </li>
                </ul>
              </template>
            </ElPopover>
          </div>
        </slot>
      </div>
    </template>
  </ElTableColumn>
</template>
<script setup lang="ts">
  const dicMap = {
    1: {
      iconType: 'primary',
    },
    2: {
      iconType: 'success',
    },
    3: {
      iconType: 'info',
    },
    4: {
      iconType: 'warning',
    },
  }
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

  .step-warp {
    display: flex;
    overflow: hidden;
    .step-item {
      display: flex;
      align-items: center;
      flex-direction: column;
      .i-dot {
        margin-bottom: 4px;
        display: inline-block;
        width: 6px;
        height: 6px;
        border-radius: 50%;
        border: 2px transparent solid;
        position: relative;
      }
      span {
        display: block;
        font-size: 14px;
      }
      time {
        font-size: 12px;
        color: #666;
      }
      &:not(:last-child) {
        margin-right: 40px;
      }

      &.start-step {
        .i-dot {
          background: var(--el-color-danger);
          &::after {
            z-index: -1;
            content: '';
            position: absolute;
            left: calc(100% + 5px);
            top: 50%;
            transform: translateY(-50%);
            display: block;
            width: 95px;
            border-bottom: 3px #e5e5e5 solid;
          }
        }
      }
      &.end-step {
        .i-dot {
          background: var(--el-color-primary);
        }
      }
      &.active {
        span {
          font-weight: bold;
        }
      }
    }
  }
</style>
