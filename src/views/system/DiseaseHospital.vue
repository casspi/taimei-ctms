<template>
  <ProTable :request="handleRequest" ref="proTableInstance">
    <template #actions>
      <ProActionButton
        :pd="PD.system.diseaseHospital.export"
        type="primary"
        :loading="loading"
        plain
        @click="handleDownload(true)"
      >
        导出全部
      </ProActionButton>
      <ProActionButton
        :pd="PD.system.diseaseHospital.export"
        type="primary"
        :loading="loading"
        :disabled="!selected.length"
        plain
        @click="handleDownload(false)"
      >
        导出
      </ProActionButton>
    </template>
    <ElTableColumn type="expand">
      <template #default="scope">
        <ElRow :gutter="20">
          <ElCol :span="12">
            <span>住院病案照</span>
            <template v-if="scope.row.hospitalImagePathList?.length">
              <ElImage
                v-for="(item, index) in scope.row.hospitalImagePathList"
                :key="index"
                class="c-img-preview-inline"
                :src="item"
                :initial-index="index"
                :preview-src-list="scope.row.hospitalImagePathList"
                fit="cover"
                preview-teleported
              />
            </template>
          </ElCol>
          <ElCol :span="12">
            <span>住院小结照</span>
            <template v-if="scope.row.dischargeImagePathList?.length">
              <ElImage
                v-for="(item, index) in scope.row.dischargeImagePathList"
                :key="index"
                class="c-img-preview-inline"
                :src="item"
                :initial-index="index"
                :preview-src-list="scope.row.dischargeImagePathList"
                fit="cover"
                preview-teleported
              />
            </template>
          </ElCol>
          <ElCol :span="12">
            <span>住院发票照</span>
            <template v-if="scope.row.hospitalMoneyImagePathList?.length">
              <ElImage
                v-for="(item, index) in scope.row.hospitalMoneyImagePathList"
                :key="index"
                class="c-img-preview-inline"
                :src="item"
                :initial-index="index"
                :preview-src-list="scope.row.hospitalMoneyImagePathList"
                fit="cover"
                preview-teleported
              />
            </template>
          </ElCol>
          <ElCol :span="12">
            <span>治疗详单照</span>
            <template v-if="scope.row.treatmentImagePathList?.length">
              <ElImage
                v-for="(item, index) in scope.row.treatmentImagePathList"
                :key="index"
                class="c-img-preview-inline"
                :src="item"
                :initial-index="index"
                :preview-src-list="scope.row.treatmentImagePathList"
                fit="cover"
                preview-teleported
              />
            </template>
          </ElCol>
        </ElRow>
      </template>
    </ElTableColumn>

    <ElTableColumn type="selection" width="55" />

    <ElTableColumn prop="createByName" label="患者姓名" min-width="100" />

    <ElTableColumn label="医院信息" min-width="140">
      <template #default="scope">
        <ul>
          <li>医院名称：{{ scope.row.hospitalName || '-' }}</li>
          <li>主诊医生：{{ scope.row.doctorName || '-' }}</li>
        </ul>
      </template>
    </ElTableColumn>

    <ElTableColumn label="住院信息" min-width="220">
      <template #default="scope">
        <ul>
          <li>住院日期：{{ scope.row.hospitalDt || '-' }}</li>
          <li>出院日期：{{ scope.row.dischargeDt || '-' }}</li>
          <li>发票金额：{{ scope.row.hospitalMoney || '-' }}</li>
        </ul>
      </template>
    </ElTableColumn>

    <ElTableColumn label="其他" min-width="200">
      <template #default="scope">
        <ul>
          <li>是否同意其他平台使用：{{ scope.row.hasPublicName || '-' }}</li>
          <li>备注：{{ scope.row.remark || '-' }}</li>
        </ul>
      </template>
    </ElTableColumn>

    <DateTableColumn />
  </ProTable>
</template>

<script setup lang="ts">
  import { useAsyncTask } from '@daysnap/vue-use'

  import { doDiseaseHospitalHistoryDownload, reqDiseaseHospitalHistory } from '@/api'
  import { useProTable } from '@/components'
  import { multipleSelectionKey } from '@/components/ProTableList/selection'
  import { PD } from '@/stores'

  const props = defineProps({
    modelValue: {
      type: String,
      default: '',
    },
  })

  // 列表
  const [, proTableInstance, handleRequest] = useProTable(
    {},
    async ([currentPage, pageSize], query) => {
      if (props.modelValue) {
        query.createBy = props.modelValue
      }
      const { dataList, total } = await reqDiseaseHospitalHistory({
        currentPage,
        pageSize,
        ...query,
      })
      return [dataList, total]
    },
  )

  const selected = ref<any[]>([])
  provide(multipleSelectionKey, selected)
  const { loading, trigger: handleDownload } = useAsyncTask(
    async (selectAll: boolean) => {
      const params: any = { selectAll }
      if (!selectAll) {
        params.ids = selected.value.map((item) => item.id)
      }
      if (props.modelValue) {
        params.loginIds = [props.modelValue]
      }
      await doDiseaseHospitalHistoryDownload(params)
      ElMessage.success('导出成功')
    },
    {
      throwError: true,
    },
  )
</script>
