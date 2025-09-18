<template>
  <ProTable :request="handleRequest" :query-metadata="queryMetadata" ref="proTableInstance">
    <template #actions>
      <ElButton type="primary" plain icon="Plus" @click="handleAddedOrUpdate()">新增</ElButton>
    </template>

    <ElTableColumn type="expand">
      <template #default="scope">
        <ElRow :gutter="20">
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

    <ElTableColumn prop="typeName" label="类型" />
    <ElTableColumn prop="levelName" label="等级" />
    <ElTableColumn prop="integral" label="积分数" />
    <ElTableColumn prop="peopleNums" label="人数" />

    <ElTableColumn fixed="right" label="操作" width="120">
      <template #default="scope">
        <ElButton link type="primary" @click="handleAddedOrUpdate(scope.row)">编辑</ElButton>
        <ElButton link type="danger" @click="handleDelete(scope.row)">删除</ElButton>
      </template>
    </ElTableColumn>
  </ProTable>

  <ProDialogForm ref="proDialogFormInstance" />
</template>

<script setup lang="ts">
  import { useAsyncTask } from '@daysnap/vue-use'

  import {
    DictionaryType,
    doConfigAwardCreate,
    doConfigAwardDelete,
    doConfigAwardUpdate,
    reqConfigAwardList,
    reqDictionaryListType,
  } from '@/api'
  import { useProDialogForm, useProTable } from '@/components'
  import type { ConfigAward } from '@/types'

  // 列表
  const [queryMetadata, proTableInstance, handleRequest] = useProTable(
    {
      type: {
        is: 'form-select',
        value: '',
        label: '类型',
      },
    },
    async ([currentPage, pageSize], query) => {
      const { dataList, total } = await reqConfigAwardList({ currentPage, pageSize, ...query })
      return [dataList, total]
    },
  )

  // 字典类型
  const { data: mapOptions } = useAsyncTask(
    async () => {
      const [types, levels] = await Promise.all([
        reqDictionaryListType({ type: DictionaryType.DIC_ACTIVATE_TYPE }),
        reqDictionaryListType({ type: DictionaryType.DIC_ACTIVATE_LEVEL }),
      ])
      queryMetadata.type.options = types
      return { types, levels }
    },
    {
      throwError: true,
      immediate: true,
      initialValue: { types: [], levels: [] },
    },
  )

  // 编辑 or 新增
  const [proDialogFormInstance, handleAddedOrUpdate] = useProDialogForm<ConfigAward>(
    () => ({
      type: {
        label: '类型',
        value: '',
        is: 'form-select',
        options: [],
        rules: [{ required: true }],
      },
      level: {
        label: '等级',
        value: '',
        is: 'form-select',
        options: [],
        rules: [{ required: true }],
      },
      integral: {
        label: '积分数',
        value: null,
        is: 'form-input-number',
        props: {
          min: 0,
        },
      },
      peopleNums: {
        label: '人数',
        value: null,
        is: 'form-input-number',
        props: {
          min: 0,
        },
      },
    }),
    async (metadata, instance, item) => {
      metadata.type.options = mapOptions.value.types
      metadata.level.options = mapOptions.value.levels

      await instance.value.show({
        title: item ? '编辑' : '新增',
        metadata,
        request: (params) =>
          item ? doConfigAwardUpdate({ id: item.id, ...params }) : doConfigAwardCreate(params),
      })
      proTableInstance.value.reload()
      ElMessage.success('操作成功')
    },
  )

  // 删除
  const handleDelete = async (item: ConfigAward) => {
    await ElMessageBox.confirm(`确认删除该数据？`)
    const { id } = item
    await doConfigAwardDelete({ id })
    proTableInstance.value.reload()
    ElMessage.success('操作成功')
  }
</script>
