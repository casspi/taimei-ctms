<template>
  <ProTable :request="handleRequest" :query-metadata="queryMetadata" ref="proTableInstance">
    <template #actions>
      <ProActionButton
        :pd="PD.system.diseaseHospital.export"
        type="primary"
        :loading="loading"
        plain
        @click="handleDownload({ type: 'hospital', loginIdSelectAll: true })"
      >
        导出全部住院记录
      </ProActionButton>
      <ProActionButton
        :pd="PD.system.diseaseHospital.export"
        type="primary"
        :loading="loading"
        :disabled="!selected.length"
        plain
        @click="handleDownload({ type: 'hospital', loginIdSelectAll: false })"
      >
        导出住院记录
      </ProActionButton>

      <ProActionButton
        :pd="PD.system.diseasePrescribe.export"
        type="primary"
        :loading="loading"
        plain
        @click="handleDownload({ type: 'prescribe', loginIdSelectAll: true })"
      >
        导出全部开药记录
      </ProActionButton>
      <ProActionButton
        :pd="PD.system.diseasePrescribe.export"
        type="primary"
        :loading="loading"
        :disabled="!selected.length"
        plain
        @click="handleDownload({ type: 'prescribe', loginIdSelectAll: false })"
      >
        导出开药记录
      </ProActionButton>

      <ProActionButton
        :pd="PD.system.diseaseTreatment.export"
        type="primary"
        :loading="loading"
        plain
        @click="handleDownload({ type: 'treatment', loginIdSelectAll: true })"
      >
        导出全部治疗记录
      </ProActionButton>
      <ProActionButton
        :pd="PD.system.diseaseTreatment.export"
        type="primary"
        :loading="loading"
        :disabled="!selected.length"
        plain
        @click="handleDownload({ type: 'treatment', loginIdSelectAll: false })"
      >
        导出治疗记录
      </ProActionButton>
    </template>

    <ElTableColumn type="selection" width="55" />

    <ElTableColumn label="患者" min-width="140">
      <template #default="scope">
        <ul>
          <li>姓名：{{ scope.row.name || '-' }}</li>
          <li>手机号：{{ scope.row.mobile || '-' }}</li>
        </ul>
      </template>
    </ElTableColumn>

    <ElTableColumn label="患者信息" min-width="140">
      <template #default="scope">
        <ul>
          <li>年龄：{{ scope.row.age || '-' }}</li>
          <li>性别：{{ scope.row.sexName || '-' }}</li>
          <li>疾病：{{ scope.row.diseaseName || '-' }}</li>
        </ul>
      </template>
    </ElTableColumn>

    <DistrictTableColumn />

    <ProTableActionsColumn
      :pds="[
        PD.system.diseaseHospital.list,
        PD.system.diseasePrescribe.list,
        PD.system.diseaseTreatment.list,
      ]"
      width="130"
    >
      <template #default="scope">
        <ProTableActionButton
          :pd="PD.system.diseaseHospital.list"
          type="primary"
          @click="handleDiseaseHospitalTable(scope.row)"
        >
          住院记录管理
        </ProTableActionButton>
        <ProTableActionButton
          :pd="PD.system.diseasePrescribe.list"
          type="primary"
          @click="handleDiseasePrescribeTable(scope.row)"
        >
          开药记录管理
        </ProTableActionButton>
        <ProTableActionButton
          :pd="PD.system.diseaseTreatment.list"
          type="primary"
          @click="handleDiseaseTreatmentTable(scope.row)"
        >
          治疗记录管理
        </ProTableActionButton>
      </template>
    </ProTableActionsColumn>

    <ProDialogForm ref="proDialogFormInstance" />
  </ProTable>
</template>

<script setup lang="ts">
  import { useAsyncTask } from '@daysnap/vue-use'

  import {
    doDiseaseHospitalHistoryDownload,
    doDiseasePrescribeHistoryDownload,
    doDiseaseTreatmentHistoryDownload,
    reqPatientList,
  } from '@/api'
  import { useProTable } from '@/components'
  import { multipleSelectionKey } from '@/components/ProTableList/selection'
  import { PD } from '@/stores'
  import type { Patient } from '@/types'
  import { getKeywordFields } from '@/utils'

  import { useDiseaseHospitalTable } from './useDiseaseHospitalTable'
  import { useDiseasePrescribeTable } from './useDiseasePrescribeTable'
  import { useDiseaseTreatmentTable } from './useDiseaseTreatmentTable'

  // 列表
  let queryParams = {}
  const [queryMetadata, proTableInstance, handleRequest] = useProTable(
    {
      ...getKeywordFields(),
    },
    async ([currentPage, pageSize], query) => {
      const { dataList, total } = await reqPatientList({
        currentPage,
        pageSize,
        ...query,
      })
      queryParams = query
      return [dataList, total]
    },
  )

  // 住院记录管理
  const [proDialogFormInstance, handleDiseaseHospitalTable] = useDiseaseHospitalTable()

  // 开药记录管理
  const [, handleDiseasePrescribeTable] = useDiseasePrescribeTable({
    instance: proDialogFormInstance,
  })

  // 治疗记录管理
  const [, handleDiseaseTreatmentTable] = useDiseaseTreatmentTable({
    instance: proDialogFormInstance,
  })

  // 导出
  const selected = ref<Patient[]>([])
  provide(multipleSelectionKey, selected)
  const { loading, trigger: handleDownload } = useAsyncTask(
    async (options: {
      loginIdSelectAll: boolean
      type: 'hospital' | 'prescribe' | 'treatment'
    }) => {
      const { loginIdSelectAll, type } = options
      const params: any = { selectAll: true, loginIdSelectAll, ...queryParams }
      if (!loginIdSelectAll) {
        params.loginIds = selected.value.map((item) => item.loginId)
      }
      if (type === 'hospital') {
        await doDiseaseHospitalHistoryDownload(params)
      } else if (type === 'prescribe') {
        await doDiseasePrescribeHistoryDownload(params)
      } else if (type === 'treatment') {
        await doDiseaseTreatmentHistoryDownload(params)
      }
      ElMessage.success('导出成功')
    },
    {
      throwError: true,
    },
  )
</script>
