<template>
  <ElTableColumn label="时间" width="200px">
    <template #default="scope">
      <ul>
        <li>创建：{{ scope.row.createDt || '-' }}</li>
        <li>更新：{{ scope.row.modifyDt || '-' }}</li>
        <slot :row="scope.row"> </slot>
      </ul>
    </template>
  </ElTableColumn>
</template>

<script setup lang="ts"></script>
