<template>
  <div class="layout-sidebar-logo">
    <Transition name="layout-sidebar-logo-fade">
      <RouterLink class="is-collapse" to="/" key="collapse" v-if="collapse">
        <img src="@/assets/img/logo.png" alt="logo" />
        <span>{{ metadata.title }}-我的工作台</span>
      </RouterLink>
      <RouterLink class="is-expand" key="expand" v-else to="/">
        <img src="@/assets/img/logo.png" alt="logo" />
        <span>{{ metadata.title }}-我的工作台</span>
      </RouterLink>
    </Transition>
  </div>
</template>
<script setup lang="ts">
  import { metadata } from '@/metadata'
  defineProps({
    collapse: {
      type: Boolean,
      default: false,
    },
  })
</script>
<style lang="scss" scoped>
  @use '@/layout/styles/define.scss' as *;
  .layout-sidebar-logo {
    @extend %pr;
    @extend %oh;
    height: $navbar-height;
    background-color: var(--ds-slidebar-logo-bg-color);
    img {
      width: 58px;
      height: 31px;
    }
    a {
      @extend %df;
      @extend %aic;
      @extend %jcc;
      @extend %h100;
      @extend %pr;
      @extend %w100;
      @extend %wsn;
      font-size: 14px;
      font-weight: 600;
      color: var(--ds-slidebar-logo-text-color);
      &.is-collapse {
        span {
          @extend %pa;
          @extend %oh;
          font-size: 0;
          width: 0;
          height: 0;
          text-indent: 200px;
          opacity: 0;
        }
      }
      &.is-expand {
        span {
          margin-left: 10px;
        }
      }
    }
  }
  .layout-sidebar-logo-fade-enter-active {
    transition: opacity 0.3s;
  }
  .layout-sidebar-logo-fade-enter-from,
  .layout-sidebar-logo-fade-leave-to {
    opacity: 0;
  }
</style>
