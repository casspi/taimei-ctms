<template>
  <div class="top-logo">
    <RouterLink to="/">
      <span class="name">{{ metadata.title }}</span>
      <span class="sys-name">{{ metadata.subtitle }} </span>
    </RouterLink>
  </div>
</template>

<script setup lang="ts">
  import { metadata } from '@/metadata'
</script>

<style lang="scss" scoped>
  @use '@/assets/scss/define.scss' as *;
  .top-logo {
    box-sizing: border-box;
    padding: 4px 15px;
    height: 100%;
    a {
      display: flex;
      flex-direction: column;
      color: #fff;
      font-size: 14px;
      :nth-child(1) {
        line-height: 26px;
        font-size: 25px;
      }
    }
  }
</style>
