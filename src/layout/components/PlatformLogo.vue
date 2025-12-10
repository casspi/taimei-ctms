<template>
  <div class="platform-logo">
    <RouterLink to="/">
      <img src="@/assets/img/logo.png" alt="" />
      <b>|</b>
      <span class="sys-name">我的工作台 </span>
    </RouterLink>
  </div>
</template>

<script setup lang="ts"></script>

<style lang="scss" scoped>
  @use '@/assets/scss/define.scss' as *;
  .platform-logo {
    box-sizing: border-box;
    padding: 4px 15px;
    height: 100%;
    display: flex;
    align-items: center;
    a {
      display: flex;
      color: #fff;
      font-size: 16px;
      b {
        margin: 0 10px;
      }
      img {
        width: 46px;
        height: 25px;
      }
    }
  }
</style>
