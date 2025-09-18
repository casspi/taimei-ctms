<template>
  <div class="layout-navbar">
    <Hamburger />

    <BreadCrumb class="layout-breadcrumb" />

    <ScreenFull />

    <UserBox />
  </div>
</template>

<script setup lang="ts">
  import BreadCrumb from './Breadcrumb.vue'
  import Hamburger from './Hamburger.vue'
  import ScreenFull from './ScreenFull.vue'
  import UserBox from './UserBox.vue'
</script>

<style lang="scss" scoped>
  @use '@/layout/styles/define.scss' as *;
  .layout-navbar {
    @extend %df;
    @extend %aic;
    height: $navbar-height;
  }
  .layout-breadcrumb {
    margin-right: auto;
  }
</style>
