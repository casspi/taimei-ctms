<template>
  <ProTable :request="handleRequest" :query-metadata="queryMetadata" ref="proTableInstance">
    <ElTableColumn type="expand">
      <template #default="scope">
        <ElRow :gutter="20">
          <ElCol :span="12">
            <span>内容</span>
            <span>{{ scope.row.content }}</span>
          </ElCol>
          <ElCol :span="12">
            <span>图片</span>
            <template v-if="scope.row.imageList?.length">
              <ElImage
                v-for="(item, index) in scope.row.imageList"
                :key="index"
                class="c-img-preview-inline"
                :src="item"
                :initial-index="index"
                :preview-src-list="scope.row.imageList"
                fit="cover"
                preview-teleported
              />
            </template>
          </ElCol>
        </ElRow>
      </template>
    </ElTableColumn>

    <ElTableColumn label="举报信息" min-width="220">
      <template #default="scope">
        <ul>
          <li>举报人：{{ scope.row.createByName || '-' }}</li>
          <li>举报类型：{{ scope.row.typeName || '-' }}</li>
        </ul>
      </template>
    </ElTableColumn>

    <ElTableColumn prop="status" label="审核状态">
      <template #default="scope">
        <ElTag v-if="scope.row.status" :type="statusTypes[scope.row.status]">
          {{ scope.row.statusName }}
        </ElTag>
      </template>
    </ElTableColumn>

    <ElTableColumn label="审核" width="220">
      <template #default="scope">
        <ul>
          <li>审核人：{{ scope.row.checkByName || '-' }}</li>
          <li>审核时间：{{ scope.row.checkDt || '-' }}</li>
          <li>备注：{{ scope.row.remark || '-' }}</li>
        </ul>
      </template>
    </ElTableColumn>

    <DateTableColumn />

    <ProTableActionsColumn :pds="[PD.social.trendReport.check]" width="120">
      <template #default="scope">
        <ProTableActionButton
          :pd="PD.social.trendReport.check"
          link
          type="warning"
          @click="handleExamine(scope.row)"
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
    doTrendReportCheck,
    reqDictionaryListType,
    reqTrendReportList,
  } from '@/api'
  import { useProDialogForm, useProTable } from '@/components'
  import { PD } from '@/stores'
  import type { ReportItem } from '@/types'
  import { getKeywordFields } from '@/utils'

  import { useSocialStatusTypes } from './useSocialStatusTypes'

  const statusTypes = useSocialStatusTypes()

  // 列表
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
      const { dataList, total } = await reqTrendReportList({ currentPage, pageSize, ...query })
      return [dataList, total]
    },
  )

  // 字典
  const { data: mapOptions } = useAsyncTask(
    async () => {
      const [status] = await Promise.all([
        reqDictionaryListType({ type: DictionaryType.DIC_REPORT_STATUS }),
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
  const [proDialogFormInstance, handleExamine] = useProDialogForm<ReportItem>(
    () => ({
      createByName: {
        label: '举报人',
        value: '',
        is: 'form-input',
        props: {
          disabled: true,
        },
      },
      createDt: {
        label: '发布时间',
        value: '',
        is: 'form-input',
        props: {
          disabled: true,
        },
      },
      imageList: {
        label: '病友圈图片',
        value: '',
        is: 'form-image-upload',
        width: '100%',
        props: {
          disabled: true,
        },
      },
      content: {
        label: '病友圈内容',
        value: '',
        is: 'form-input',
        width: '100%',
        props: {
          type: 'textarea',
          disabled: true,
        },
      },
      status: {
        label: '状态',
        value: '',
        width: '100%',
        is: 'form-radio',
        rules: [{ required: true }],
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
        request: (params) => doTrendReportCheck({ id: item!.id, ...params }),
      })
      proTableInstance.value.reload()
      ElMessage.success('操作成功')
    },
  )
</script>
