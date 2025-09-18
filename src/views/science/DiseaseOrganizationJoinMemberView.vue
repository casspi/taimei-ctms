<template>
  <ProTable :request="handleRequest" :query-metadata="queryMetadata" ref="proTableInstance">
    <template #actions>
      <ProActionButton
        :pd="PD.science.diseaseOrganizationMember.export"
        type="primary"
        :loading="loading"
        plain
        @click="handleDownload(true)"
      >
        导出全部
      </ProActionButton>
      <ProActionButton
        :pd="PD.science.diseaseOrganizationMember.export"
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

    <ElTableColumn prop="organizationName" label="组织" min-width="120" />

    <ElTableColumn label="申请人" min-width="120">
      <template #default="scope">
        <ul>
          <li>姓名：{{ scope.row.name || '-' }}</li>
          <li>电话：{{ scope.row.mobile || '-' }}</li>
        </ul>
      </template>
    </ElTableColumn>

    <ElTableColumn label="审核" width="220">
      <template #default="scope">
        <ul>
          <li>审核状态：{{ scope.row.statusName || '-' }}</li>
          <li>审核时间：{{ scope.row.checkDt || '-' }}</li>
          <li>审核备注：{{ scope.row.remark || '-' }}</li>
        </ul>
      </template>
    </ElTableColumn>

    <DateTableColumn />

    <ProTableActionsColumn :pds="[PD.science.diseaseOrganizationMember.check]" width="120">
      <template #default="scope">
        <ProTableActionButton
          :pd="PD.science.diseaseOrganizationMember.check"
          link
          type="warning"
          @click="handleCheck(scope.row)"
        >
          审核
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
    doDiseaseOrganizationJoinMemberCheck,
    doDiseaseOrganizationJoinMemberDownload,
    reqDictionaryListType,
    reqDiseaseOrganizationJoinMemberList,
  } from '@/api'
  import { useProDialogForm, useProTable } from '@/components'
  import { multipleSelectionKey } from '@/components/ProTableList/selection'
  import { PD } from '@/stores'
  import type { DiseaseOrganizationMember } from '@/types'
  import { getKeywordFields } from '@/utils'

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
      status: {
        is: 'form-select',
        value: '',
        label: '审核状态',
      },
    },
    async ([currentPage, pageSize], query) => {
      if (props.modelValue) {
        query.projectId = props.modelValue
      }
      const { dataList, total } = await reqDiseaseOrganizationJoinMemberList({
        currentPage,
        pageSize,
        ...query,
      })

      queryParams = query

      return [dataList, total]
    },
  )

  const { data: mapOptions } = useAsyncTask(
    async () => {
      const [status] = await Promise.all([
        reqDictionaryListType({ type: DictionaryType.DIC_PROJECT_MEMBER_STATUS }),
      ])
      queryMetadata.status.options = status
      return { status }
    },
    {
      throwError: true,
      immediate: true,
      initialValue: { status: [] },
    },
  )

  // 审核
  const [proDialogFormInstance, handleCheck] = useProDialogForm<DiseaseOrganizationMember>(
    () => ({
      name: {
        label: '姓名',
        value: '',
        is: 'form-input',
        props: {
          disabled: true,
        },
      },
      mobile: {
        label: '电话',
        value: '',
        is: 'form-input',
        props: {
          disabled: true,
        },
      },
      status: {
        label: '状态',
        value: '',
        is: 'form-select',
        rules: [{ required: true, message: '请选择状态' }],
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

      await instance.value.show({
        title: '审核',
        metadata,
        request: (params) => doDiseaseOrganizationJoinMemberCheck({ id: item!.id, ...params }),
      })
      proTableInstance.value.reload()
      ElMessage.success('操作成功')
    },
  )

  const selected = ref<any[]>([])
  provide(multipleSelectionKey, selected)
  const { loading, trigger: handleDownload } = useAsyncTask(
    async (selectAll: boolean) => {
      const params: any = { selectAll, ...queryParams }
      if (!selectAll) {
        params.ids = selected.value.map((item) => item.id)
      }

      await doDiseaseOrganizationJoinMemberDownload(params)
      ElMessage.success('导出成功')
    },
    {
      throwError: true,
    },
  )
</script>
