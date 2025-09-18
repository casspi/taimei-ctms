<template>
  <ProTable :request="handleRequest" :query-metadata="queryMetadata" ref="proTableInstance">
    <template #actions>
      <ProActionButton
        :pd="PD.info.advertisement.added"
        type="primary"
        plain
        icon="Plus"
        @click="handleAddedOrUpdate()"
      >
        新增
      </ProActionButton>
    </template>

    <ElTableColumn label="标题" min-width="280">
      <template #default="scope">
        <div class="c-row is-aic">
          <ElImage
            v-if="scope.row.coverUrl"
            class="c-img-preview"
            :src="scope.row.coverUrl"
            :preview-src-list="[scope.row.coverUrl]"
            fit="cover"
            preview-teleported
          />
          <p>{{ scope.row.title }}</p>
        </div>
      </template>
    </ElTableColumn>

    <ElTableColumn label="其他" min-width="120">
      <template #default="scope">
        <ul>
          <li>类型：{{ scope.row.typeName || '-' }}</li>
          <li>位置：{{ scope.row.mountLocationName || '-' }}</li>
          <li>提供方：{{ scope.row.provider || '-' }}</li>
        </ul>
      </template>
    </ElTableColumn>

    <StatusTableColumn />

    <DateTableColumn />

    <ProTableActionsColumn width="120">
      <template #default="scope">
        <ProTableActionButton
          :pd="PD.info.advertisement.edit"
          link
          type="primary"
          @click="handleAddedOrUpdate(scope.row)"
        >
          编辑
        </ProTableActionButton>
        <ProTableActionButton link type="success" @click="handleH5Preview(scope.row)">
          预览
        </ProTableActionButton>
        <ProTableActionButton
          :pd="PD.info.advertisement.delete"
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
    doAdvertisementCreate,
    doAdvertisementDelete,
    doAdvertisementUpdate,
    reqAdvertisementList,
    reqDictionaryListType,
  } from '@/api'
  import { useProDialogForm, useProTable } from '@/components'
  import { PD } from '@/stores'
  import type { Advertisement } from '@/types'
  import { getKeywordFields } from '@/utils'

  import { useH5Preview } from './useH5Preview'

  // 预览
  const [proH5PreviewInstance, handleH5Preview] = useH5Preview('advertisement')

  // 列表
  const [queryMetadata, proTableInstance, handleRequest] = useProTable(
    {
      ...getKeywordFields(),
      title: {
        is: 'form-input',
        value: '',
        label: '标题',
      },
    },
    async ([currentPage, pageSize], query) => {
      const { dataList, total } = await reqAdvertisementList({ currentPage, pageSize, ...query })
      return [dataList, total]
    },
  )

  const { data: mapOptions } = useAsyncTask(
    async () => {
      const [status, types, mountLocations] = await Promise.all([
        reqDictionaryListType({ type: DictionaryType.DIC_DISABLED }),
        reqDictionaryListType({ type: DictionaryType.DIC_INFO_URL_TYPE }),
        reqDictionaryListType({ type: DictionaryType.DIC_MOUNT_LOCATION }),
      ])
      return { status, types, mountLocations }
    },
    {
      immediate: true,
      throwError: true,
      initialValue: { status: [], types: [], mountLocations: [] },
    },
  )

  // 编辑 or 新增
  const [proDialogFormInstance, handleAddedOrUpdate] = useProDialogForm<Advertisement>(
    () => ({
      title: {
        label: '广告标题',
        value: '',
        is: 'form-input',
        rules: [{ required: true }],
      },
      coverUrl: {
        label: '封面图（200 * 136）',
        value: '',
        is: 'form-image-upload',
        rules: [{ required: true }],
      },
      mountLocation: {
        label: '位置',
        value: '',
        is: 'form-select',
        options: [],
        rules: [{ required: true }],
      },
      provider: {
        label: '提供方',
        value: '',
        is: 'form-input',
        rules: [{ required: true }],
      },
      type: {
        label: '类型',
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
      url: {
        label: '链接',
        value: '',
        is: 'form-input',
        hidden: (_, __, m) => !['1', '2'].includes(m.type.value),
        rules: [{ required: true }],
      },
      content: {
        label: '内容',
        value: '',
        is: 'form-tinymce',
        hidden: (_, __, m) => !['3'].includes(m.type.value),
        rules: [{ required: true }],
      },
    }),
    async (metadata, instance, item) => {
      metadata.status.options = mapOptions.value.status
      metadata.type.options = mapOptions.value.types
      metadata.mountLocation.options = mapOptions.value.mountLocations

      await instance.value.show({
        title: item ? '编辑' : '新增',
        metadata,
        request: (params) =>
          item ? doAdvertisementUpdate({ id: item.id, ...params }) : doAdvertisementCreate(params),
      })
      proTableInstance.value.reload()
      ElMessage.success('操作成功')
    },
  )

  // 删除
  const handleDelete = async (item: Advertisement) => {
    await ElMessageBox.confirm(`确认删除该数据？`)
    const { id } = item
    await doAdvertisementDelete({ id })
    proTableInstance.value.reload()
    ElMessage.success('操作成功')
  }
</script>
