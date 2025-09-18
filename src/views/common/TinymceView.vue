<template>
  <div>
    <ProTinymce v-model="content" />

    <p @click="content = '重新开始'">{{ content }}</p>
  </div>
</template>

<script setup lang="ts">
  const content = ref('12')
</script>

<style lang="scss" scoped>
  @use '@/assets/scss/define.scss' as *;
</style>
