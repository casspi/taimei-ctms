<template>
  <ProTable :request="handleRequest" :query-metadata="queryMetadata" ref="proTableInstance">
    <template #actions>
      <ElButton type="primary" plain icon="Plus" @click="handleAddedOrUpdate()">新增</ElButton>
    </template>

    <ElTableColumn type="expand">
      <template #default="scope">
        <ElRow :gutter="20">
          <ElCol :span="12">
            <span>活动Id</span>
            <span>{{ scope.row.activityId }}</span>
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

    <ElTableColumn prop="type" label="类型" />
    <ElTableColumn prop="shareCode" label="邀请码" />

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
  import {
    doInvitationCreate,
    doInvitationDelete,
    doInvitationUpdate,
    reqInvitationList,
  } from '@/api'
  import { useProDialogForm, useProTable } from '@/components'
  import type { Invitation } from '@/types'

  // 列表
  const [queryMetadata, proTableInstance, handleRequest] = useProTable(
    {
      name: {
        is: 'form-input',
        value: '',
        label: '名称',
      },
    },
    async ([currentPage, pageSize], query) => {
      const { dataList, total } = await reqInvitationList({ currentPage, pageSize, ...query })
      return [dataList, total]
    },
  )

  // 编辑 or 新增
  const [proDialogFormInstance, handleAddedOrUpdate] = useProDialogForm<Invitation>(
    () => ({
      JSON: {
        label: 'JSON内容',
        value: JSON.stringify(
          {
            activityId: 'string',
            createBy: 'string',
            createDt: '2023-11-02T10:36:13.450Z',
            id: 'string',
            modifyBy: 'string',
            modifyDt: '2023-11-02T10:36:13.450Z',
            shareCode: 'string',
          },
          null,
          2,
        ),
        is: 'form-input',
        width: '100%',
        props: {
          rows: 15,
          type: 'textarea',
        },
      },
    }),
    async (metadata, instance, item) => {
      await instance.value.show({
        title: item ? '编辑' : '新增',
        metadata,
        request: (params) =>
          item
            ? doInvitationUpdate({ id: item.id, ...JSON.parse(params.JSON) })
            : doInvitationCreate(JSON.parse(params.JSON)),
      })
      proTableInstance.value.reload()
      ElMessage.success('操作成功')
    },
  )

  // 删除
  const handleDelete = async (item: Invitation) => {
    await ElMessageBox.confirm(`确认删除该数据？`)
    const { id } = item
    await doInvitationDelete({ id })
    proTableInstance.value.reload()
    ElMessage.success('操作成功')
  }
</script>
