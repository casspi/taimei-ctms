<template>
  <ElPopconfirm title="是否确定删除？" @confirm="$emit('delete')" @cancel="$emit('cancel')">
    <template v-slot:reference>
      <ProTableActionButton type="primary" link> 删除 </ProTableActionButton>
    </template>
  </ElPopconfirm>
</template>

<script setup lang="ts">
  import ProTableActionButton from './ProTableActionsColumn/ProTableActionButton.vue'
</script>

<style lang="scss" scoped>
  @use '@/assets/scss/define.scss' as *;
</style>
