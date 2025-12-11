<template>
  <ElScrollbar class="top-menu">
    <ElMenu
      active-text-color="#333"
      mode="horizontal"
      class="top-menu-content"
      :default-active="computedActiveMenu"
      @select="handleSelect"
    >
      <ElMenuItem v-for="(item, index) in routes" :key="index" :to="item.path" :index="item.path">
        <RouterLink :to="item.path">{{ item.meta?.title }}</RouterLink>
      </ElMenuItem>
    </ElMenu>
  </ElScrollbar>
</template>

<script setup lang="ts">
  import { ElScrollbar } from 'element-plus'

  const router = useRouter()
  const routes = computed(() => {
    return router.options.routes.filter((route) => !route.hidden)
  })
  const route = useRoute()

  console.log(route)

  const selectPath = ref('')
  const handleSelect = (path: string) => {
    selectPath.value = path
    nextTick(() => (selectPath.value = ''))
  }

  const computedActiveMenu = computed(() => {
    const { path } = route
    return routes.value.find((item) => path.startsWith(item.path))?.path || path
  })
</script>

<style lang="scss" scoped>
  @use '@/layout/styles/define.scss' as *;

  .top-menu {
    --el-menu-hover-bg-color: #fff;
    flex: 1;
  }
  .top-menu-content {
    // @extend %df;
    // @extend %aic;
    // @extend %h100;
    // @extend %bsb;
    height: 56px;
  }
  .el-menu--horizontal > .el-menu-item.is-active {
    border-bottom: 2px solid #fc8864;
    color: var(--el-menu-active-color) !important;
  }
  .el-menu--horizontal.el-menu {
    border-bottom: none;
  }
</style>
