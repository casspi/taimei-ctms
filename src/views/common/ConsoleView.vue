<template>
  <div class="console-wrap">
    <div class="c-header-section">
      <PlatformLogo />
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
  import PlatformLogo from '@/layout/components/PlatformLogo.vue'

  const router = useRouter()
  console.log(' router.options.routes', router.options.routes)
  const menus = computed(() => router.options.routes.filter((item) => item.meta?.isConsole))
</script>

<style lang="scss" scoped>
  @use '@/assets/scss/define.scss' as *;
  .console-wrap {
    @extend %w100;
    min-height: 100vh;
    background: #f2f2f2;

    // background: url('@/assets/img/bg-console.webp') center no-repeat;
    background-size: cover;
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
    padding: 16px;
    max-height: 200px;
    background: #ffffff;
    box-shadow: 0px 2px 7px -3px rgba(0, 0, 0, 0.2);
  }
  .menu-item {
    @extend %df;
    @extend %aic;
    @extend %bsb;
    margin-top: 32px;
    width: 20%;
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
