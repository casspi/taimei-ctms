<template>
  <div class="mock-wrap">
    <dl>
      <dt>罕见百科</dt>
      <dd>
        <ElInput v-model="diseaseId" clearable placeholder="请输入" />
        <ElButton type="primary" @click="handleDiseaseMock">MOCK</ElButton>
      </dd>
    </dl>
    <dl>
      <dt>罕见药典</dt>
      <dd>
        <ElButton type="primary" @click="handleMedicalGuideLineMock">MOCK</ElButton>
      </dd>
    </dl>
  </div>
</template>

<script setup lang="ts">
  import { useDiseaseDevtools } from './useDiseaseDevtools'
  import { useMedicalGuideLineDevtools } from './useMedicalGuideLineDevtools'

  const [diseaseId, handleDiseaseMock] = useDiseaseDevtools()

  const handleMedicalGuideLineMock = useMedicalGuideLineDevtools()
</script>

<style lang="scss" scoped>
  @use '@/assets/scss/define.scss' as *;
  .mock-wrap {
    dl {
      padding: 16px 0;
    }
    dt {
      font-size: 16px;
      margin-bottom: 10px;
    }
    dd {
      display: flex;
      max-width: 300px;
      gap: 10px;
    }
  }
</style>
