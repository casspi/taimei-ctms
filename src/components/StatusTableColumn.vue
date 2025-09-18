<template>
  <ElTableColumn prop="status" label="状态">
    <template #default="scope">
      <ElTag :type="scope.row.status === '1' ? 'success' : 'info'">
        {{ scope.row.statusName || scope.row.status }}
      </ElTag>
    </template>
  </ElTableColumn>
</template>

<script setup lang="ts"></script>
