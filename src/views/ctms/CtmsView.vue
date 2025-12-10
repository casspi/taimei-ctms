<template>
  <div class="ctms-wrap">
    <div class="c-header-section">
      <TopLogo />
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
          <RouterLink to="/ctms">我的企业报表</RouterLink>
        </ElMenuItem>
        <ElMenuItem index="3">
          <RouterLink to="/ctms">我的数据报表</RouterLink>
        </ElMenuItem>
        <ElMenuItem index="4">
          <RouterLink to="/ctms">Dashboard</RouterLink>
        </ElMenuItem>
        <ElMenuItem index="5">
          <RouterLink to="/ctms">CRA排行榜</RouterLink>
        </ElMenuItem>
        <ElMenuItem index="6">
          <RouterLink to="/ctms">中心库</RouterLink>
        </ElMenuItem>
        <ElMenuItem index="7">
          <RouterLink to="/ctms">论坛</RouterLink>
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
  import TopLogo from '@/layout/components/TopLogo.vue'
  const activeIndex = ref('1')
  const handleSelect = (index: string) => {
    activeIndex.value = index
    // ElMessage.info('敬请期待！')
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
    border-bottom: none;
    background-color: #485c6f;
    height: 100%;
  }
  .layout-content {
    @extend %bsb;
    padding: 10px;
    width: 100%;
    height: calc(100vh - $navbar-height);
  }
  :deep {
    .el-menu--horizontal > .el-menu-item.is-active {
      color: #fff !important;
      border-bottom: 2px solid #ff9800;
    }
    .el-menu-item a {
      color: rgba(243, 244, 246, 0.6);
      font-size: 14px;
      font-weight: 400;
      transition: color 0.3s;
      line-height: 50px;
      display: inline-block;
      border-bottom: 2px solid #485c6f;
    }
    .el-menu-item:hover,
    .el-menu-item.is-active {
      background-color: #485c6f !important;
      a {
        color: #fff !important;
      }
    }
  }
</style>
