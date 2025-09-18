<template>
  <ProTable :request="handleRequest" :query-metadata="queryMetadata" ref="proTableInstance">
    <ElTableColumn type="expand">
      <template #default="scope">
        <ElRow :gutter="20">
          <ElCol :span="12">
            <span>审核人</span>
            <span>{{ scope.row.checkByName }}</span>
          </ElCol>
          <ElCol :span="12">
            <span>原由</span>
            <span>{{ scope.row.reason }}</span>
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

    <ElTableColumn prop="memberName" label="成员名称" />
    <ElTableColumn prop="groupName" label="群组名称" />
    <ElTableColumn prop="status" label="审核状态">
      <template #default="scope">
        <ElTag v-if="scope.row.status" :type="types[scope.row.status]">
          {{ scope.row.statusName }}
        </ElTag>
      </template>
    </ElTableColumn>
    <ElTableColumn prop="checkDt" label="审核时间" />

    <ElTableColumn fixed="right" label="操作" width="120">
      <template #default="scope">
        <ElButton link type="warning" @click="handleExamine(scope.row)">审核</ElButton>
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
    doGroupMemberDelete,
    reqDictionaryListType,
    reqGroupMemberList,
  } from '@/api'
  import { useProDialogForm, useProTable } from '@/components'
  import type { GroupMember } from '@/types'

  const types = ['info', 'success', 'danger'] as const

  // 列表
  const [queryMetadata, proTableInstance, handleRequest] = useProTable(
    {
      name: {
        is: 'form-input',
        value: '',
      },
      status: {
        is: 'form-select',
        value: '',
      },
    },
    async ([currentPage, pageSize], query) => {
      const { dataList, total } = await reqGroupMemberList({ currentPage, pageSize, ...query })
      return [dataList, total]
    },
  )

  // 字典
  const { data: mapOptions } = useAsyncTask(
    async () => {
      const [status] = await Promise.all([
        reqDictionaryListType({ type: DictionaryType.DIC_GROUP_MEMBER_STATUS }),
      ])
      queryMetadata.status.options = status
      return { status }
    },
    {
      immediate: true,
      throwError: true,
      initialValue: { status: [] },
    },
  )

  // 审核
  const [proDialogFormInstance, handleExamine] = useProDialogForm<GroupMember>(
    () => ({
      status: {
        label: '状态',
        value: '',
        width: '100%',
        is: 'form-radio',
        rules: [{ required: true, message: '请选择审核状态' }],
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
      if (!item) return

      metadata.status.options = mapOptions.value.status

      await instance.value.show({
        title: '审核',
        metadata,
        request: async () => {
          throw '审核接口缺少'
        },
      })
      proTableInstance.value.reload()
      ElMessage.success('操作成功')
    },
  )

  // 删除
  const handleDelete = async (item: GroupMember) => {
    await ElMessageBox.confirm(`确认删除该数据？`)
    const { id } = item
    await doGroupMemberDelete({ id })
    proTableInstance.value.reload()
    ElMessage.success('操作成功')
  }
</script>
