<template>
  <div class="console-wrap">
    <div class="header-section">
      <SidebarLogo class="logo-box" />
      <UserBox />
    </div>
    <div class="console-content">
      <div class="menu-section">
        <RouterLink v-for="(item, index) in menus" :key="index" :to="item.path" class="menu-item">
          <img v-if="item.meta?.image" :src="item.meta?.image" alt="icon" />
          {{ item.meta?.title }}
        </RouterLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import UserBox from '@/layout/components/navbar/UserBox.vue'
  import SidebarLogo from '@/layout/components/sidebar/SidebarLogo.vue'

  const router = useRouter()
  const menus = computed(() => router.options.routes.filter((item) => !item.hidden))
</script>

<style lang="scss" scoped>
  @use '@/assets/scss/define.scss' as *;
  .console-wrap {
    @extend %w100;
    min-height: 100vh;
    background: #f2f2f2;

    // background: url('@/assets/img/bg-console.webp') center no-repeat;
    // background-size: cover;
  }
  .header-section {
    @extend %df;
    @extend %aic;
    @extend %jcs;
    @extend %ps;
    @extend %t0;
    z-index: 1;
    padding: 0 24px;
    height: var(--ds-navbar-height);
    background: linear-gradient(to right, #769aee, #769aee);
  }
  .logo-box {
    background-color: transparent;
  }
  .console-content {
    padding: 24px;
  }
  .menu-section {
    @extend %df;
    @extend %jcs;
    @extend %fww;
    padding: 16px 0;
    max-width: 500px;
  }
  .menu-item {
    @extend %df;
    @extend %aic;
    @extend %bsb;
    margin-top: 32px;
    width: 47%;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    background-color: #fff;
    border-radius: 8px;
    padding: 16px;
    font-size: 18px;
    color: #434343;
    &:nth-child(1),
    &:nth-child(2) {
      margin-top: 0;
    }
    img {
      width: 48px;
      height: 48px;
      margin-right: 16px;
      object-position: center;
      object-fit: cover;
    }
  }
</style>
