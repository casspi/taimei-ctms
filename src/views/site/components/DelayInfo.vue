<template>
  <ElPopover title="延期情况" width="350" trigger="click" placement="left">
    <template #reference>
      <ElIcon class="c-pointer" size="14" v-if="row.real_lase_case_code === '1'"
        ><Warning
      /></ElIcon>
    </template>
    <template #default>
      <div class="info-conetnt">
        <div class="info-header c-flex-center">
          <span>预期</span>
          <img src="@/assets/img/arrow.png" alt="" />
          <span>实际</span>
        </div>
        <div class="info-time-line">
          <span class="time c-flex-center"
            ><ElIcon><Clock /></ElIcon>{{ formatDate(+row.start_time, 'yyyy-MM-dd HH:mm') }}</span
          >
          <span class="line"></span>
          <span class="hours">{{ row.duration_hour }}h</span>
          <span class="line"></span>
          <span class="time c-flex-center"
            ><ElIcon><Clock /></ElIcon>{{ formatDate(+row.end_time, 'yyyy-MM-dd HH:mm') }}</span
          >
        </div>
      </div>
    </template>
  </ElPopover>
</template>

<script setup lang="ts">
  import { formatDate } from '@daysnap/utils'

  defineProps({
    row: {
      type: Object,
      default: () => {},
    },
  })
</script>

<style lang="scss" scoped>
  @use '@/assets/scss/define.scss' as *;

  .info-conetnt {
    padding: 12px 16px;
    color: rgba(0, 0, 0, 0.65);
    border-top: 1px solid #e8e8e8;
    display: flex;
    flex-direction: column;
  }
  .info-header {
    height: 60px;
    line-height: 60px;
    font-size: 14px;
    align-self: center;
  }
  .info-time-line {
    width: 50%;
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    font-size: 12px;
    .line {
      margin: 5px auto;
      width: 1px;
      height: 20px;
      border-right: 1px dashed rgb(170, 170, 170);
    }
  }
  .hours {
    display: inline-block;
    margin: 0 auto;
    color: #fff;
    min-width: 35px;
    height: 16px;
    line-height: 16px;
    background: #0088f7;
    border-radius: 3px;
  }
</style>
