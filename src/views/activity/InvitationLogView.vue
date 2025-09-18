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

    <ElTableColumn prop="shareCode" label="邀请码" />
    <ElTableColumn prop="status" label="状态" />

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
    doInvitationLogCreate,
    doInvitationLogDelete,
    doInvitationLogUpdate,
    reqInvitationLogList,
  } from '@/api'
  import { useProDialogForm, useProTable } from '@/components'
  import type { InvitationLog } from '@/types'

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
      const { dataList, total } = await reqInvitationLogList({ currentPage, pageSize, ...query })
      return [dataList, total]
    },
  )

  // 编辑 or 新增
  const [proDialogFormInstance, handleAddedOrUpdate] = useProDialogForm<InvitationLog>(
    () => ({
      JSON: {
        label: 'JSON内容',
        value: JSON.stringify(
          {
            createBy: 'string',
            createDt: '2023-11-02T10:36:47.911Z',
            id: 'string',
            modifyBy: 'string',
            modifyDt: '2023-11-02T10:36:47.911Z',
            shareCode: 'string',
            sharedLoginId: 'string',
            status: '1',
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
            ? doInvitationLogUpdate({ id: item.id, ...JSON.parse(params.JSON) })
            : doInvitationLogCreate(JSON.parse(params.JSON)),
      })
      proTableInstance.value.reload()
      ElMessage.success('操作成功')
    },
  )

  // 删除
  const handleDelete = async (item: InvitationLog) => {
    await ElMessageBox.confirm(`确认删除该数据？`)
    const { id } = item
    await doInvitationLogDelete({ id })
    proTableInstance.value.reload()
    ElMessage.success('操作成功')
  }
</script>
