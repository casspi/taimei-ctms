<template>
  <ElTableColumn
    v-if="!slots.length"
    class="pro-tree"
    fixed="right"
    label="操作"
    width="120"
    v-bind="attrs"
  >
    <template #default="scope">
      <slot :row="scope.row"></slot>
    </template>
  </ElTableColumn>
</template>

<script setup lang="ts">
  const attrs = useAttrs()
  const slots = useSlots()
</script>
