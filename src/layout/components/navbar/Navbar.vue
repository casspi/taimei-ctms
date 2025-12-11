<template>
  <div class="layout-navbar">
    <Hamburger />

    <TopMenu class="layout-top-menu" />

    <ScreenFull />

    <UserBox />
  </div>
</template>

<script setup lang="ts">
  import Hamburger from './Hamburger.vue'
  import ScreenFull from './ScreenFull.vue'
  import TopMenu from './TopMenu.vue'
  import UserBox from './UserBox.vue'
</script>

<style lang="scss" scoped>
  @use '@/layout/styles/define.scss' as *;
  .layout-navbar {
    @extend %df;
    @extend %aic;
    height: $navbar-height;
    border-bottom: 1px solid #ebeced;
  }
  .layout-top-menu {
    margin-right: auto;
  }
</style>
