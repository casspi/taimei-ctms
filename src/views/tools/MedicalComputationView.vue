<template>
  <ProTable :request="handleRequest" :query-metadata="queryMetadata" ref="proTableInstance">
    <template #actions>
      <ProActionButton
        :pd="PD.tools.medicalComputation.added"
        type="primary"
        plain
        icon="Plus"
        @click="handleAddedOrUpdate()"
      >
        新增
      </ProActionButton>
    </template>

    <ElTableColumn type="expand">
      <template #default="scope">
        <ElRow :gutter="20">
          <ElCol :span="12">
            <span>配置</span>
            <span>{{ scope.row.parameter }}</span>
          </ElCol>
          <ElCol :span="12">
            <span>公式</span>
            <span>{{ scope.row.formula }}</span>
          </ElCol>
          <ElCol :span="12">
            <span>备注</span>
            <span>{{ scope.row.remark }}</span>
          </ElCol>
          <ElCol :span="12">
            <span>创建时间</span>
            <span>{{ scope.row.createDt }}</span>
          </ElCol>
          <ElCol :span="12">
            <span>更新时间</span>
            <span>{{ scope.row.modifyDt }}</span>
          </ElCol>
        </ElRow>
      </template>
    </ElTableColumn>

    <ElTableColumn prop="name" label="名称" />
    <ElTableColumn prop="referDoc" label="参考文献" />
    <ElTableColumn prop="remark" label="备注" />

    <DateTableColumn />

    <ProTableActionsColumn
      :pds="[PD.tools.medicalComputation.edit, PD.tools.medicalComputation.delete]"
      width="120"
    >
      <template #default="scope">
        <ProTableActionButton
          :pd="PD.tools.medicalComputation.edit"
          link
          type="primary"
          @click="handleAddedOrUpdate(scope.row)"
        >
          编辑
        </ProTableActionButton>
        <ProTableActionButton
          :pd="PD.tools.medicalComputation.delete"
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
    doMedicalComputationCreate,
    doMedicalComputationDelete,
    doMedicalComputationUpdate,
    reqDictionaryListType,
    reqMedicalComputationList,
  } from '@/api'
  import { useProDialogForm, useProTable } from '@/components'
  import { PD } from '@/stores'
  import type { MedicalComputation } from '@/types'

  // 列表
  const [queryMetadata, proTableInstance, handleRequest] = useProTable(
    {
      name: {
        is: 'form-input',
        value: '',
        label: '公式名称',
      },
    },
    async ([currentPage, pageSize], query) => {
      const { dataList, total } = await reqMedicalComputationList({
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
        reqDictionaryListType({ type: DictionaryType.DIC_MEDICAL_TOOL }),
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
  const [proDialogFormInstance, handleAddedOrUpdate] = useProDialogForm<MedicalComputation>(
    () => ({
      name: {
        label: '名称',
        value: '',
        is: 'form-input',
        rules: [{ required: true, message: '请填写名称' }],
      },
      type: {
        label: '类型',
        value: '1',
        is: 'form-select',
        options: [],
        hidden: true,
        rules: [{ required: true, message: '请选择类型' }],
      },
      status: {
        label: '状态',
        value: '',
        is: 'form-radio',
        rules: [{ required: true, message: '请选择状态' }],
      },
      referDoc: {
        label: '参考文献',
        value: '',
        is: 'form-input',
      },
      parameter: {
        label: '配置',
        value: '',
        is: 'form-input',
        width: '100%',
        get: (v) => v,
        set: (s, f) => {
          if (s.parameter) {
            try {
              f.value = s.parameter
            } catch (e) {
              console.error(e)
            }
          }
        },
        props: {
          type: 'textarea',
        },
        rules: [{ required: true, message: '请填写配置' }],
      },
      formula: {
        label: '公式',
        value: '',
        is: 'form-input',
        width: '100%',
        props: {
          type: 'textarea',
        },
        rules: [{ required: true, message: '请填写公式' }],
      },
      remark: {
        label: '备注',
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
            ? doMedicalComputationUpdate({ id: item.id, ...params })
            : doMedicalComputationCreate(params),
      })
      proTableInstance.value.reload()
      ElMessage.success('操作成功')
    },
  )

  // 删除
  const handleDelete = async (item: MedicalComputation) => {
    await ElMessageBox.confirm(`确认删除该数据？`)
    const { id } = item
    await doMedicalComputationDelete({ id })
    proTableInstance.value.reload()
    ElMessage.success('操作成功')
  }
</script>
