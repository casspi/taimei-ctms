<template>
  <div class="ctms-wrap">
    <div class="c-header-section">
      <SidebarLogo class="logo-box" title="Clinical Trial Management System" />
      <ElMenu
        :default-active="activeIndex"
        class="ctms-menu"
        mode="horizontal"
        @select="handleSelect"
      >
        <ElMenuItem index="1" to="/ctms">
          <RouterLink to="/ctms">首页</RouterLink>
        </ElMenuItem>
        <ElMenuItem index="2">
          <RouterLink to="/ctms/dashboard">我的企业报表</RouterLink>
        </ElMenuItem>
        <ElMenuItem index="3">
          <RouterLink to="/ctms/dashboard">我的数据报表</RouterLink>
        </ElMenuItem>
        <ElMenuItem index="4">
          <RouterLink to="/ctms/dashboard">Dashboard</RouterLink>
        </ElMenuItem>
        <ElMenuItem index="5">
          <RouterLink to="/ctms/dashboard">CRA排行榜</RouterLink>
        </ElMenuItem>
        <ElMenuItem index="6">
          <RouterLink to="/ctms/dashboard">中心库</RouterLink>
        </ElMenuItem>
        <ElMenuItem index="7">
          <RouterLink to="/ctms/dashboard">论坛</RouterLink>
        </ElMenuItem>
      </ElMenu>
      <UserBox />
    </div>
    <div class="layout-content">
      <RouterView />
    </div>
  </div>
</template>

<script setup lang="ts">
  import UserBox from '@/layout/components/navbar/UserBox.vue'
  import SidebarLogo from '@/layout/components/sidebar/SidebarLogo.vue'
  const activeIndex = ref('1')
  const handleSelect = (index: string) => {
    // activeIndex.value = index
    ElMessage.info('敬请期待！')
  }
</script>

<style lang="scss" scoped>
  @use '@/assets/scss/define.scss' as *;
  @use '@/layout/styles/index.scss' as *;

  .ctms-warp {
    min-height: 100vh;
  }
  .ctms-menu {
    flex: 1;
    margin-left: 20px;
  }
  .layout-content {
    @extend %bsb;
    padding: 16px;
    padding-top: calc($navbar-height + 37px + 16px);
    background-color: #fff;
  }
</style>
