<template>
  <ProTable :request="handleRequest" :query-metadata="queryMetadata" ref="proTableInstance">
    <template #actions>
      <ProActionButton
        :pd="PD.info.clinicalCenter.added"
        type="primary"
        plain
        icon="Plus"
        @click="handleAddedOrUpdate()"
      >
        新增
      </ProActionButton>
    </template>

    <ElTableColumn prop="projectName" label="项目" />
    <ElTableColumn prop="hospitalName" label="医院" />

    <StatusTableColumn />

    <DateTableColumn />

    <ProTableActionsColumn
      :pds="[PD.info.clinicalCenter.edit, PD.info.clinicalCenter.delete]"
      width="120"
    >
      <template #default="scope">
        <ProTableActionButton
          :pd="PD.info.clinicalCenter.edit"
          link
          type="primary"
          @click="handleAddedOrUpdate(scope.row)"
        >
          编辑
        </ProTableActionButton>
        <ProTableActionButton
          :pd="PD.info.clinicalCenter.delete"
          link
          type="danger"
          @click="handleDelete(scope.row)"
        >
          删除
        </ProTableActionButton>
      </template>
    </ProTableActionsColumn>
  </ProTable>

  <ProDialogForm ref="proDialogFormInstance" />
</template>

<script setup lang="ts">
  import { useAsyncTask } from '@daysnap/vue-use'

  import {
    DictionaryType,
    doClinicalCenterCreate,
    doClinicalCenterDelete,
    doClinicalCenterUpdate,
    reqClinicalCenterList,
    reqClinicalTrialList,
    reqDictionaryListType,
    reqHospitalList,
  } from '@/api'
  import { useProDialogForm, useProTable } from '@/components'
  import { PD } from '@/stores'
  import type { ClinicalCenter } from '@/types'
  import { getKeywordFields, withPagingParams } from '@/utils'

  // 列表
  const [queryMetadata, proTableInstance, handleRequest] = useProTable(
    {
      ...getKeywordFields(),
      hospitalName: {
        is: 'form-input',
        value: '',
        label: '医院名称',
      },
      projectName: {
        is: 'form-input',
        value: '',
        label: '项目名称',
      },
    },
    async ([currentPage, pageSize], query) => {
      const { dataList, total } = await reqClinicalCenterList({ currentPage, pageSize, ...query })
      return [dataList, total]
    },
  )

  const { data: mapOptions } = useAsyncTask(
    async () => {
      const [hospitals, projects, status] = await Promise.all([
        withPagingParams(reqHospitalList)(),
        withPagingParams(reqClinicalTrialList)(),
        reqDictionaryListType({ type: DictionaryType.DIC_DISABLED }),
      ])
      return { hospitals, projects, status }
    },
    {
      immediate: true,
      throwError: true,
      initialValue: { hospitals: [], projects: [], status: [] },
    },
  )

  // 编辑 or 新增
  const [proDialogFormInstance, handleAddedOrUpdate] = useProDialogForm<ClinicalCenter>(
    () => ({
      hospitalId: {
        label: '医院',
        value: '',
        is: 'form-select',
        labelKey: 'name',
        valueKey: 'id',
        options: [],
        rules: [{ required: true }],
      },
      projectId: {
        label: '项目',
        value: '',
        is: 'form-select',
        labelKey: 'projectName',
        valueKey: 'projectId',
        options: [],
        rules: [{ required: true }],
      },
      status: {
        label: '状态',
        value: '',
        is: 'form-radio',
        rules: [{ required: true }],
      },
    }),
    async (metadata, instance, item) => {
      metadata.hospitalId.options = mapOptions.value.hospitals
      metadata.projectId.options = mapOptions.value.projects
      metadata.status.options = mapOptions.value.status
      await instance.value.show({
        title: item ? '编辑' : '新增',
        metadata,
        request: (params) =>
          item
            ? doClinicalCenterUpdate({ id: item.id, ...params })
            : doClinicalCenterCreate(params),
      })
      proTableInstance.value.reload()
      ElMessage.success('操作成功')
    },
  )

  // 删除
  const handleDelete = async (item: ClinicalCenter) => {
    await ElMessageBox.confirm(`确认删除该数据？`)
    const { id } = item
    await doClinicalCenterDelete({ id })
    proTableInstance.value.reload()
    ElMessage.success('操作成功')
  }
</script>
