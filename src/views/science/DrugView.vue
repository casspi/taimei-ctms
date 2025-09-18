<template>
  <ProTable :request="handleRequest" :query-metadata="queryMetadata" ref="proTableInstance">
    <template #actions>
      <ProActionButton
        :pd="PD.science.drug.added"
        type="primary"
        plain
        icon="Plus"
        @click="handleAddedOrUpdate()"
      >
        新增
      </ProActionButton>
    </template>

    <ElTableColumn prop="drugName" label="药品名称" />

    <ElTableColumn prop="medicineName" label="所属药物" />

    <ElTableColumn prop="manufacturer" label="生产厂商" />

    <StatusTableColumn />

    <DateTableColumn />

    <ProTableActionsColumn width="120">
      <template #default="scope">
        <ProTableActionButton
          :pd="PD.science.drug.edit"
          link
          type="primary"
          @click="handleAddedOrUpdate(scope.row)"
        >
          编辑
        </ProTableActionButton>
        <ProTableActionButton
          link
          type="success"
          @click="handleH5Preview(`medical/drug/${scope.row.id}`)"
        >
          预览
        </ProTableActionButton>
        <ProTableActionButton
          :pd="PD.science.drug.delete"
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

  <ProH5Preview ref="proH5PreviewInstance" />
</template>

<script setup lang="ts">
  import { useAsyncTask } from '@daysnap/vue-use'

  import {
    DictionaryType,
    doDrugCreate,
    doDrugDelete,
    doDrugUpdate,
    reqDictionaryListType,
    reqDrugList,
    reqMedicalGuidelineList,
  } from '@/api'
  import { useProDialogForm, useProH5Preview, useProTable } from '@/components'
  import { PD } from '@/stores'
  import type { Drug } from '@/types'
  import { getKeywordFields, withPagingParams } from '@/utils'

  // 预览
  const [proH5PreviewInstance, handleH5Preview] = useProH5Preview()

  // 列表
  const [queryMetadata, proTableInstance, handleRequest] = useProTable(
    {
      ...getKeywordFields(),
      drugName: {
        is: 'form-input',
        value: '',
        label: '药品名称',
      },
    },
    async ([currentPage, pageSize], query) => {
      const { dataList, total } = await reqDrugList({ currentPage, pageSize, ...query })
      return [dataList, total]
    },
  )

  const { data: mapOptions } = useAsyncTask(
    async () => {
      const [status, medicines] = await Promise.all([
        reqDictionaryListType({ type: DictionaryType.DIC_DISABLED }),
        withPagingParams(reqMedicalGuidelineList)(),
      ])
      return { status, medicines }
    },
    {
      immediate: true,
      throwError: true,
      initialValue: { status: [], medicines: [] },
    },
  )

  // 编辑 or 新增
  const [proDialogFormInstance, handleAddedOrUpdate] = useProDialogForm<Drug>(
    () => ({
      drugName: {
        label: '药品名称',
        value: '',
        is: 'form-input',
        rules: [{ required: true }],
      },
      medicalId: {
        label: '所属药物',
        value: '',
        is: 'form-select',
        labelKey: 'medicineName',
        valueKey: 'id',
        rules: [{ required: true }],
      },
      status: {
        label: '状态',
        value: '',
        is: 'form-radio',
        rules: [{ required: true }],
      },
      manufacturer: {
        label: '生产厂商',
        value: '',
        is: 'form-input',
      },
      indication: {
        label: '适应症',
        value: '',
        is: 'form-tinymce',
      },
      composition: {
        label: '药品成分',
        value: '',
        is: 'form-tinymce',
      },
      specifications: {
        label: '规格',
        value: '',
        is: 'form-tinymce',
      },
      usageAndDosage: {
        label: '用法用量',
        value: '',
        is: 'form-tinymce',
      },
      drugInteractions: {
        label: '药物相互作用',
        value: '',
        is: 'form-tinymce',
      },
      adverseReaction: {
        label: '不良反应',
        value: '',
        is: 'form-tinymce',
      },
      taboo: {
        label: '禁忌',
        value: '',
        is: 'form-tinymce',
      },
      note: {
        label: '注意事项',
        value: '',
        is: 'form-tinymce',
      },
      pharmacologyAndToxicology: {
        label: '药理毒理',
        value: '',
        is: 'form-tinymce',
      },
      character: {
        label: '性状',
        value: '',
        is: 'form-tinymce',
      },
      storage: {
        label: '贮藏',
        value: '',
        is: 'form-tinymce',
      },
      drugPackage: {
        label: '包装',
        value: '',
        is: 'form-tinymce',
      },
      effectiveDate: {
        label: '有效期',
        value: '',
        is: 'form-tinymce',
      },
      approvalNumber: {
        label: '批准文号',
        value: '',
        is: 'form-tinymce',
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
      metadata.status.options = mapOptions.value.status
      metadata.medicalId.options = mapOptions.value.medicines

      await instance.value.show({
        title: item ? '编辑' : '新增',
        metadata,
        request: (params) =>
          item ? doDrugUpdate({ id: item.id, ...params }) : doDrugCreate(params),
      })
      proTableInstance.value.reload()
      ElMessage.success('操作成功')
    },
  )

  // 删除
  const handleDelete = async (item: Drug) => {
    await ElMessageBox.confirm(`确认删除该数据？`)
    const { id } = item
    await doDrugDelete({ id })
    proTableInstance.value.reload()
    ElMessage.success('操作成功')
  }
</script>
