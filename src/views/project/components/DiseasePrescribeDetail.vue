<template>
  <ProTableList :has-pagination="false" :has-refresh="false" :data="modelValue">
    <ElTableColumn type="expand">
      <template #default="scope">
        <ElRow :gutter="20">
          <ElCol :span="12">
            <span>追溯码</span>
            <span v-html="format(scope.row.drugTraceabilityCode)"></span>
          </ElCol>
          <ElCol :span="12">
            <span>发票照</span>
            <template v-if="scope.row.invoiceImagePathList?.length">
              <ElImage
                v-for="(item, index) in scope.row.invoiceImagePathList"
                :key="index"
                class="c-img-preview-inline"
                :src="item"
                :initial-index="index"
                :preview-src-list="scope.row.invoiceImagePathList"
                fit="cover"
                preview-teleported
              />
            </template>
          </ElCol>
        </ElRow>
      </template>
    </ElTableColumn>

    <ElTableColumn label="基本信息" min-width="340">
      <template #default="scope">
        <ul>
          <li>患者姓名：{{ scope.row.createByName || '-' }}</li>
          <li>医院名称：{{ scope.row.hospitalName || '-' }}</li>
          <li>主诊医生：{{ scope.row.doctorName || '-' }}</li>
          <li>开药日期：{{ scope.row.prescribeDt || '-' }}</li>
          <li>发票金额：{{ scope.row.invoiceMoney || '-' }}</li>
        </ul>
      </template>
    </ElTableColumn>

    <DateTableColumn>
      <template #default="scope">
        <ul>
          <li>是否同意其他平台使用：{{ scope.row.hasPublicName || '-' }}</li>
          <li>备注：{{ scope.row.remark || '-' }}</li>
        </ul>
      </template>
    </DateTableColumn>
  </ProTableList>
</template>

<script lang="ts" setup>
  defineProps({
    modelValue: {
      type: Array,
      required: true,
    },
  })

  const format = (val: string) => {
    if (!val) {
      return ''
    }
    return val.split(';').join(`<br/>`)
  }
</script>
