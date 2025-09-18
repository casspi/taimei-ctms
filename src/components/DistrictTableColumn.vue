<template>
  <ElTableColumn label="省市">
    <template #default="scope">
      <ul>
        <li>{{ format(scope.row) }}</li>
        <li v-if="scope.row.address">详细地址：{{ scope.row.address }}</li>
      </ul>
    </template>
  </ElTableColumn>
</template>

<script setup lang="ts">
  const format = (data: { provinceName: string; cityName: string }) => {
    const { provinceName, cityName } = data
    return [provinceName, cityName].filter(Boolean).join(' / ')
  }
</script>
