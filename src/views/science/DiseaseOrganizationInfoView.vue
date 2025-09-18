<template>
  <ProTable :request="handleRequest" :query-metadata="queryMetadata" ref="proTableInstance">
    <template #actions>
      <ProActionButton
        :pd="PD.science.diseaseOrganizationInfo.added"
        type="primary"
        plain
        icon="Plus"
        @click="handleAddedOrUpdate()"
      >
        新增
      </ProActionButton>
    </template>

    <ElTableColumn label="内容" min-width="200">
      <template #default="scope">
        <ul>
          <li>简要说明：{{ scope.row.content || '-' }}</li>
          <li>
            封面：<ElImage
              v-if="scope.row.coverUrl"
              class="c-img-preview-inline"
              :src="scope.row.coverUrl"
              :preview-src-list="[scope.row.coverUrl]"
              fit="cover"
              preview-teleported
            />
          </li>
        </ul>
      </template>
    </ElTableColumn>
    <ElTableColumn label="发布" min-width="120">
      <template #default="scope">
        <ul>
          <li>发布人：{{ scope.row.publisherName || '-' }}</li>
          <li>时间：{{ scope.row.publishDt || '-' }}</li>
        </ul>
      </template>
    </ElTableColumn>
    <ElTableColumn label="修改" min-width="120">
      <template #default="scope">
        <ul>
          <li>修改人：{{ scope.row.modifyByName || '-' }}</li>
          <li>时间：{{ scope.row.modifyDt || '-' }}</li>
        </ul>
      </template>
    </ElTableColumn>

    <StatusTableColumn />

    <ProTableActionsColumn
      :pds="[PD.science.diseaseOrganizationInfo.edit, PD.science.diseaseOrganizationInfo.delete]"
      width="120"
    >
      <template #default="scope">
        <ProTableActionButton
          :pd="PD.science.diseaseOrganizationInfo.edit"
          link
          type="primary"
          @click="handleAddedOrUpdate(scope.row)"
        >
          编辑
        </ProTableActionButton>
        <ProTableActionButton
          :pd="PD.science.diseaseOrganizationInfo.delete"
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
    doDiseaseOrganizationInfoCreate,
    doDiseaseOrganizationInfoDelete,
    doDiseaseOrganizationInfoUpdate,
    reqDictionaryListType,
    reqDiseaseOrganizationInfoList,
  } from '@/api'
  import { useProDialogForm, useProTable } from '@/components'
  import { PD } from '@/stores'
  import type { DiseaseOrganizationInfo } from '@/types'

  const props = defineProps({
    modelValue: {
      type: String,
      default: '',
    },
  })
  // 列表
  const [queryMetadata, proTableInstance, handleRequest] = useProTable(
    {},
    async ([currentPage, pageSize], query) => {
      if (props.modelValue) {
        query.organizationId = props.modelValue
      }
      const { dataList, total } = await reqDiseaseOrganizationInfoList({
        currentPage,
        pageSize,
        ...query,
      })
      return [dataList, total]
    },
  )
  // 编辑 or 新增
  const [proDialogFormInstance, handleAddedOrUpdate] = useProDialogForm<DiseaseOrganizationInfo>(
    () => ({
      content: {
        label: '简要说明',
        value: '',
        is: 'form-input',
        width: '100%',
        props: {
          type: 'textarea',
          maxlength: 1000,
        },
        rules: [{ required: true, message: '请填写简要说明' }],
      },
      coverUrl: {
        label: '封面',
        value: '',
        is: 'form-image-upload',
        width: '100%',
        rules: [{ required: true, message: '请上传封面' }],
      },
      status: {
        label: '状态',
        value: '',
        is: 'form-radio',
        rules: [{ required: true, message: '请选择状态' }],
      },
    }),
    async (metadata, instance, item) => {
      metadata.status.options = mapOptions.value.status

      await instance.value.show({
        title: item ? '编辑' : '新增',
        metadata,
        request: (params) =>
          item
            ? doDiseaseOrganizationInfoUpdate({ id: item.id, ...params })
            : doDiseaseOrganizationInfoCreate({
                organizationId: props.modelValue,
                ...params,
              }),
      })
      proTableInstance.value.reload()
      ElMessage.success('操作成功')
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

  // 删除
  const handleDelete = async (item: DiseaseOrganizationInfo) => {
    await ElMessageBox.confirm(`确认删除该数据？`)
    const { id } = item
    await doDiseaseOrganizationInfoDelete({ id })
    proTableInstance.value.reload()
    ElMessage.success('操作成功')
  }
</script>

<style lang="scss" scoped>
  @use '@/assets/scss/define.scss' as *;
</style>
