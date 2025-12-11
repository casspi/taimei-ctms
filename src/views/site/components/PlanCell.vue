<template>
  <div class="plan-cell">
    <span>{{ data.inspect_type_Name }}</span>
    <span>{{ data.plan_id }}</span>
  </div>
</template>

<script setup lang="ts">
  defineProps({
    data: {
      type: Object as PropType<{
        inspect_type_Name: string
        plan_id: string
      }>,
      default: () => ({}),
    },
  })
</script>

<style lang="scss" scoped>
  @use '@/assets/scss/define.scss' as *;
  .plan-cell {
    display: flex;
    flex-direction: column;
    gap: 5px;
    span:nth-child(2) {
      display: inline-flex;
      padding: 0 5px;
      height: 20px;
      line-height: 20px;
      color: #fff;
      background: #929090;
      border-radius: 2px;
      text-align: center;
      width: fit-content;
    }
  }
</style>
