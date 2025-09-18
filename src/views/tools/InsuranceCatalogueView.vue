<template>
  <ProTable :request="handleRequest" :query-metadata="queryMetadata" ref="proTableInstance">
    <template #actions>
      <ProActionButton
        :pd="PD.tools.insuranceCatalogue.added"
        type="primary"
        plain
        icon="Plus"
        @click="handleAddedOrUpdate()"
      >
        新增
      </ProActionButton>
    </template>

    <ElTableColumn label="药物信息" min-width="200">
      <template #default="scope">
        <ul>
          <li>药物名称：{{ scope.row.medicineName || '-' }}</li>
          <li>类型：{{ scope.row.typeName || '-' }}</li>
          <li>是否处方药：{{ scope.row.prescription ? '是' : '否' }}</li>
        </ul>
      </template>
    </ElTableColumn>

    <ElTableColumn label="其他" min-width="200">
      <template #default="scope">
        <ul>
          <li>入保日期：{{ scope.row.insuranceDt || '-' }}</li>
          <li>禁忌：{{ scope.row.medicineName || '-' }}</li>
        </ul>
      </template>
    </ElTableColumn>

    <StatusTableColumn />

    <DateTableColumn />

    <ProTableActionsColumn
      :pds="[PD.tools.insuranceCatalogue.edit, PD.tools.insuranceCatalogue.delete]"
      width="120"
    >
      <template #default="scope">
        <ProTableActionButton
          :pd="PD.tools.insuranceCatalogue.edit"
          link
          type="primary"
          @click="handleAddedOrUpdate(scope.row)"
        >
          编辑
        </ProTableActionButton>
        <ProTableActionButton
          :pd="PD.tools.insuranceCatalogue.delete"
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
    doInsuranceCatalogueCreate,
    doInsuranceCatalogueDelete,
    doInsuranceCatalogueUpdate,
    reqDictionaryListType,
    reqInsuranceCatalogueList,
  } from '@/api'
  import { useProDialogForm, useProTable } from '@/components'
  import { PD } from '@/stores'
  import type { InsuranceCatalogue } from '@/types'
  import { getKeywordFields } from '@/utils'

  // 列表
  const [queryMetadata, proTableInstance, handleRequest] = useProTable(
    {
      ...getKeywordFields(),
      medicineName: {
        is: 'form-input',
        value: '',
        label: '药物名称',
      },
    },
    async ([currentPage, pageSize], query) => {
      const { dataList, total } = await reqInsuranceCatalogueList({
        currentPage,
        pageSize,
        ...query,
      })
      return [dataList, total]
    },
  )

  const { data: mapOptions } = useAsyncTask(
    async () => {
      const [types, status] = await Promise.all([
        reqDictionaryListType({ type: DictionaryType.DIC_INSURE_CATALOGUES_TYPE }),
        reqDictionaryListType({ type: DictionaryType.DIC_DISABLED }),
      ])
      return { types, status }
    },
    {
      immediate: true,
      throwError: true,
      initialValue: { types: [], status: [] },
    },
  )

  // 编辑 or 新增
  const [proDialogFormInstance, handleAddedOrUpdate] = useProDialogForm<InsuranceCatalogue>(
    () => ({
      medicineName: {
        label: '药物名称',
        value: '',
        is: 'form-input',
        rules: [{ required: true }],
      },
      type: {
        label: '类型',
        value: '',
        is: 'form-select',
        rules: [{ required: true }],
      },
      insuranceDt: {
        label: '入保日期',
        value: '',
        is: 'form-date-picker',
        rules: [{ required: true }],
      },
      prescription: {
        label: '是否处方药',
        value: '',
        is: 'form-radio',
        options: [
          { label: '是', value: true },
          { label: '否', value: false },
        ],
        rules: [{ required: true }],
      },
      status: {
        label: '状态',
        value: '',
        is: 'form-radio',
        rules: [{ required: true }],
      },
      taboo: {
        label: '禁忌',
        value: '',
        is: 'form-input',
        width: '100%',
        props: {
          type: 'textarea',
        },
      },
    }),
    async (metadata, instance, item) => {
      metadata.type.options = mapOptions.value.types
      metadata.status.options = mapOptions.value.status

      await instance.value.show({
        title: item ? '编辑' : '新增',
        metadata,
        request: (params) =>
          item
            ? doInsuranceCatalogueUpdate({ id: item.id, ...params })
            : doInsuranceCatalogueCreate(params),
      })
      proTableInstance.value.reload()
      ElMessage.success('操作成功')
    },
  )

  // 删除
  const handleDelete = async (item: InsuranceCatalogue) => {
    await ElMessageBox.confirm(`确认删除该数据？`)
    const { id } = item
    await doInsuranceCatalogueDelete({ id })
    proTableInstance.value.reload()
    ElMessage.success('操作成功')
  }
</script>
