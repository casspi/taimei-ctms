<template>
  <ProTable :request="handleRequest" :query-metadata="queryMetadata" ref="proTableInstance">
    <template #actions>
      <ProActionButton
        :pd="PD.science.medicalGuideline.added"
        type="primary"
        plain
        icon="Plus"
        @click="handleAddedOrUpdate()"
      >
        新增
      </ProActionButton>
    </template>

    <ElTableColumn prop="medicineName" label="药品通用名" />

    <ElTableColumn prop="medicineRemark" label="使用说明" />

    <StatusTableColumn />

    <DateTableColumn />

    <ProTableActionsColumn
      :pds="[PD.science.medicalGuideline.edit, PD.science.medicalGuideline.delete]"
      width="120"
    >
      <template #default="scope">
        <ProTableActionButton
          :pd="PD.science.medicalGuideline.edit"
          link
          type="primary"
          @click="handleAddedOrUpdate(scope.row)"
        >
          编辑
        </ProTableActionButton>
        <ProTableActionButton
          :pd="PD.science.medicalGuideline.delete"
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
    doMedicalGuidelineCreate,
    doMedicalGuidelineDelete,
    doMedicalGuidelineUpdate,
    reqDictionaryListType,
    reqMedicalGuidelineList,
  } from '@/api'
  import { useProDialogForm, useProTable } from '@/components'
  import { PD } from '@/stores'
  import type { MedicalGuideline } from '@/types'
  import { getKeywordFields } from '@/utils'

  // 列表
  const [queryMetadata, proTableInstance, handleRequest] = useProTable(
    {
      ...getKeywordFields(),
      medicineName: {
        is: 'form-input',
        value: '',
        label: '药品通用名',
      },
    },
    async ([currentPage, pageSize], query) => {
      const { dataList, total } = await reqMedicalGuidelineList({ currentPage, pageSize, ...query })
      return [dataList, total]
    },
  )

  const { data: mapOptions } = useAsyncTask(
    async () => {
      const [status] = await Promise.all([
        reqDictionaryListType({ type: DictionaryType.DIC_DISABLED }),
      ])
      return { status }
    },
    {
      immediate: true,
      throwError: true,
      initialValue: { status: [] },
    },
  )

  // 编辑 or 新增
  const [proDialogFormInstance, handleAddedOrUpdate] = useProDialogForm<MedicalGuideline>(
    () => ({
      medicineName: {
        label: '药品通用名',
        value: '',
        is: 'form-input',
        rules: [{ required: true }],
      },
      status: {
        label: '状态',
        value: '',
        is: 'form-radio',
        rules: [{ required: true }],
      },
      medicineRemark: {
        label: '使用说明',
        value: '',
        is: 'form-input',
        width: '100%',
        props: {
          type: 'textarea',
        },
        rules: [{ required: true }],
      },
    }),
    async (metadata, instance, item) => {
      metadata.status.options = mapOptions.value.status

      await instance.value.show({
        title: item ? '编辑' : '新增',
        metadata,
        request: (params) =>
          item
            ? doMedicalGuidelineUpdate({ id: item.id, ...params })
            : doMedicalGuidelineCreate(params),
      })
      proTableInstance.value.reload()
      ElMessage.success('操作成功')
    },
  )

  // 删除
  const handleDelete = async (item: MedicalGuideline) => {
    await ElMessageBox.confirm(`确认删除该数据？`)
    const { id } = item
    await doMedicalGuidelineDelete({ id })
    proTableInstance.value.reload()
    ElMessage.success('操作成功')
  }
</script>
