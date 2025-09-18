<template>
  <ProTable :request="handleRequest" :query-metadata="queryMetadata" ref="proTableInstance">
    <template v-if="modelValue" #actions>
      <ProActionButton
        :pd="PD.activity.joinMember.export"
        type="primary"
        :loading="loading"
        plain
        @click="handleDownload(true)"
      >
        导出全部
      </ProActionButton>
      <ProActionButton
        :pd="PD.activity.joinMember.export"
        type="primary"
        :loading="loading"
        :disabled="!selected.length"
        plain
        @click="handleDownload(false)"
      >
        导出
      </ProActionButton>
    </template>

    <ElTableColumn type="selection" width="55" />

    <ElTableColumn prop="title" label="活动名称" min-width="120" />

    <ElTableColumn label="申请人" min-width="120">
      <template #default="scope">
        <ul>
          <li>姓名：{{ scope.row.name || '-' }}</li>
          <li>电话：{{ scope.row.contactPhone || '-' }}</li>
        </ul>
      </template>
    </ElTableColumn>

    <ElTableColumn label="申请信息" min-width="120">
      <template #default="scope">
        <ul>
          <li>年龄：{{ scope.row.age || '-' }}</li>
          <li>性别：{{ scope.row.sexName || '-' }}</li>
        </ul>
      </template>
    </ElTableColumn>

    <DistrictTableColumn />

    <DateTableColumn>
      <template #default="scope">
        <li>创建人：{{ scope.row.createByName || '-' }}</li>
      </template>
    </DateTableColumn>

    <ProTableActionsColumn
      :pds="[PD.activity.joinMember.delete, PD.system.integral.list]"
      width="120"
    >
      <template #default="scope">
        <ProTableActionButton
          :pd="PD.activity.joinMember.delete"
          link
          type="danger"
          @click="handleDelete(scope.row)"
        >
          删除
        </ProTableActionButton>
        <ProTableActionButton
          :pd="PD.system.integral.list"
          type="primary"
          @click="handleIntegralTable(scope.row)"
        >
          积分管理
        </ProTableActionButton>
      </template>
    </ProTableActionsColumn>
  </ProTable>

  <ProDialogForm ref="proDialogFormInstance" />
</template>

<script setup lang="ts">
  import { useAsyncTask } from '@daysnap/vue-use'

  import {
    doActivityJoinMemberDelete,
    doActivityJoinMemberDownload,
    reqActivityJoinMemberList,
  } from '@/api'
  import { useProTable } from '@/components'
  import { multipleSelectionKey } from '@/components/ProTableList/selection'
  import { PD } from '@/stores'
  import type { ActivityJoinMember } from '@/types'
  import { getKeywordFields } from '@/utils'

  import { useIntegralTable } from './useIntegralTable'

  const props = defineProps({
    modelValue: {
      type: String,
      default: '',
    },
  })

  // 列表
  let queryParams = {}
  const [queryMetadata, proTableInstance, handleRequest] = useProTable(
    {
      ...getKeywordFields(),
    },
    async ([currentPage, pageSize], query) => {
      if (props.modelValue) {
        query.activityId = props.modelValue
      }
      const { dataList, total } = await reqActivityJoinMemberList({
        currentPage,
        pageSize,
        ...query,
      })
      queryParams = query
      return [dataList, total]
    },
  )

  // 删除
  const handleDelete = async (item: ActivityJoinMember) => {
    await ElMessageBox.confirm(`确认删除该数据？`)
    const { id } = item
    await doActivityJoinMemberDelete({ id })
    proTableInstance.value.reload()
    ElMessage.success('操作成功')
  }

  // 导出
  const selected = ref<any[]>([])
  provide(multipleSelectionKey, selected)
  const { loading, trigger: handleDownload } = useAsyncTask(
    async (selectAll: boolean) => {
      const params: any = { selectAll, ...queryParams }
      if (!selectAll) {
        params.ids = selected.value.map((item) => item.id)
      }
      await doActivityJoinMemberDownload(params)
      ElMessage.success('导出成功')
    },
    {
      throwError: true,
    },
  )
  // 积分管理
  const [proDialogFormInstance, handleIntegralTable] = useIntegralTable()
</script>
