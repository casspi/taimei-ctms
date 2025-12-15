<template>
  <div class="layout-sitetree">
    <ElLink underline="hover">中山康方生物医药有限公司</ElLink> <span>/</span>
    <ElLink underline="never"> TM01 CTMS测试项目 </ElLink> <span>/</span>
    <ElLink underline="never">中国 </ElLink> <span>/</span>
    <ElLink underline="never">01 测试中心1医院</ElLink>
  </div>
</template>

<script setup lang="ts"></script>

<style lang="scss" scoped>
  @use '@/assets/scss/define.scss' as *;
  .layout-sitetree {
    background: #fff;
    height: 50px;
    box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);
    padding: 0 10px;
    display: flex;
    align-items: center;
    font-size: 12px;
    span {
      margin: 0 8px;
    }
    :deep() {
      .el-link {
        font-size: 12px;
      }
    }
  }
</style>
