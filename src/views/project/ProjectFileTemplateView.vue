<template>
  <ProTable :request="handleRequest" :query-metadata="queryMetadata" ref="proTableInstance">
    <template #actions>
      <ProActionButton
        v-if="modelValue"
        :pd="PD.project.fileTemplate.added"
        type="primary"
        plain
        icon="Plus"
        @click="handleAddedOrUpdate()"
      >
        新增
      </ProActionButton>
    </template>

    <ElTableColumn label="名称" min-width="120" prop="name" />

    <ElTableColumn label="表单项" min-width="120" prop="itemOptionName" />

    <ElTableColumn label="文件链接" min-width="120">
      <template #default="scope">
        <a :href="scope.row.filePath" target="_blank">{{ scope.row.filePath }}</a>
      </template>
    </ElTableColumn>

    <StatusTableColumn />

    <DateTableColumn />

    <ProTableActionsColumn
      :pds="[PD.project.fileTemplate.delete, PD.project.fileTemplate.edit]"
      width="120"
    >
      <template #default="scope">
        <ProTableActionButton
          :pd="PD.project.fileTemplate.edit"
          type="primary"
          @click="handleAddedOrUpdate(scope.row)"
        >
          编辑
        </ProTableActionButton>
        <ProTableActionButton
          :pd="PD.project.fileTemplate.delete"
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
    doProjectFileTemplateCreate,
    doProjectFileTemplateDelete,
    doProjectFileTemplateUpdate,
    reqDictionaryListType,
    reqProjectFileTemplateList,
  } from '@/api'
  import { useProDialogForm, useProTable } from '@/components'
  import { PD } from '@/stores'
  import type { ProjectFileTemplate } from '@/types'
  import { getKeywordFields } from '@/utils'

  const props = defineProps({
    modelValue: {
      type: String,
      default: '',
    },
  })

  // 列表
  const [queryMetadata, proTableInstance, handleRequest] = useProTable(
    {
      ...getKeywordFields(),
    },
    async ([currentPage, pageSize], query) => {
      if (props.modelValue) {
        query.projectId = props.modelValue
      }
      const { dataList, total } = await reqProjectFileTemplateList({
        currentPage,
        pageSize,
        ...query,
      })
      return [dataList, total]
    },
  )

  const { data: mapOptions } = useAsyncTask(
    async () => {
      const [statusList, itemOptionList] = await Promise.all([
        reqDictionaryListType({ type: DictionaryType.DIC_DISABLED }),
        reqDictionaryListType({ type: DictionaryType.DIC_PROJECT_FILE_ITEM }),
      ])
      return { statusList, itemOptionList }
    },
    {
      immediate: true,
      throwError: true,
      initialValue: { statusList: [], itemOptionList: [] },
    },
  )

  // 编辑 or 新增
  const [proDialogFormInstance, handleAddedOrUpdate] = useProDialogForm<ProjectFileTemplate>(
    () => ({
      name: {
        label: '名称',
        value: '',
        is: 'form-input',
        rules: [{ required: true }],
      },
      itemOption: {
        label: '表单项',
        value: '',
        is: 'form-select',
        options: [],
        rules: [{ required: true }],
      },
      status: {
        label: '状态',
        value: '',
        is: 'form-radio',
        rules: [{ required: true }],
      },
      filePath: {
        label: '文件',
        value: '',
        is: 'form-file-upload',
        rules: [{ required: true }],
        props: {
          accept: '.doc,.docx,.pdf',
        },
      },
    }),
    async (metadata, instance, item) => {
      const { modelValue: projectId } = props
      metadata.itemOption.options = mapOptions.value.itemOptionList
      metadata.status.options = mapOptions.value.statusList
      await instance.value.show({
        title: item ? '编辑' : '新增',
        metadata,
        request: (params) =>
          item
            ? doProjectFileTemplateUpdate({ ...item, projectId, ...params })
            : doProjectFileTemplateCreate({ projectId, ...params }),
      })
      proTableInstance.value.reload()
      ElMessage.success('操作成功')
    },
  )

  // 删除
  const handleDelete = async (item: ProjectFileTemplate) => {
    await ElMessageBox.confirm(`确认删除该数据？`)
    const { id } = item
    await doProjectFileTemplateDelete({ id })
    proTableInstance.value.reload()
    ElMessage.success('操作成功')
  }
</script>
