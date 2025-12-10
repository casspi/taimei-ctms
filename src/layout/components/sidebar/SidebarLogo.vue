<template>
  <div class="layout-sidebar-logo">
    <Transition name="layout-sidebar-logo-fade">
      <RouterLink class="is-collapse" to="/" key="collapse" v-if="collapse">
        <span class="name">{{ metadata.short_title }}</span>
      </RouterLink>
      <RouterLink class="is-expand" key="expand" v-else to="/">
        <span class="name">{{ metadata.title }}</span>
        <span class="sys-name">{{ metadata.subtitle }} </span>
        <span class="version">{{ metadata.version }}</span>
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
    title: {
      type: String,
      default: '我的工作台',
    },
  })
</script>
<style lang="scss" scoped>
  @use '@/layout/styles/define.scss' as *;
  .layout-sidebar-logo {
    @extend %pr;
    @extend %oh;
    height: var(--ds-logo-height);
    background-color: var(--ds-slidebar-logo-bg-color);
    box-sizing: border-box;
    a {
      @extend %df;
      @extend %jcc;
      @extend %pr;
      @extend %w100;
      @extend %h100;
      @extend %bsb;
      justify-content: flex-start;
      padding: 10px 0 10px 15px;
      flex-direction: column;
      font-size: 12px;
      color: #f1f1f1;
      color: var(--ds-slidebar-logo-text-color);
      white-space: pre-wrap;
      :nth-child(1) {
        font-size: 18px;
        line-height: 1.5;
        font-weight: 600;
      }
      :nth-child(3) {
        font-size: 10px;
        padding-top: 5px;
        color: #758796;
      }

      // &.is-collapse {
      //   // span {
      //   //   @extend %pa;
      //   //   @extend %oh;
      //   //   font-size: 0;
      //   //   width: 0;
      //   //   height: 0;
      //   //   // text-indent: 200px;
      //   //   opacity: 0;
      //   // }
      // }
      // &.is-expand {
      //   span {
      //     margin-left: 10px;
      //   }
      // }
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
