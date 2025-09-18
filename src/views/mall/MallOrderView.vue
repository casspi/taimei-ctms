<template>
  <ProTable :request="handleRequest" :query-metadata="queryMetadata" ref="proTableInstance">
    <template #actions>
      <ProActionButton
        :pd="PD.mall.order.export"
        type="primary"
        :loading="loading"
        plain
        @click="handleDownload(true)"
      >
        导出全部
      </ProActionButton>
      <ProActionButton
        :pd="PD.mall.order.export"
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

    <ElTableColumn label="商品名称" prop="name" min-width="120"> </ElTableColumn>

    <ElTableColumn label="收货信息" min-width="120">
      <template #default="scope">
        <ul>
          <li>收件人：{{ scope.row.orderBy || '-' }}</li>
          <li>收件手机号：{{ scope.row.orderPhone || '-' }}</li>
          <li>
            收货地址：{{ scope.row.provinceName || '-' }} / {{ scope.row.cityName || '-' }} /
            {{ scope.row.areaName || '-' }}
          </li>
          <li>详细地址：{{ scope.row.address || '-' }}</li>
        </ul>
      </template>
    </ElTableColumn>

    <ElTableColumn label="审核信息" min-width="120">
      <template #default="scope">
        <ul>
          <li>状态：{{ scope.row.statusName || '-' }}</li>
          <li>物流公司：{{ scope.row.logisticsTypeName || '-' }}</li>
          <li>物流单号：{{ scope.row.logisticsId || '-' }}</li>
        </ul>
      </template>
    </ElTableColumn>

    <DateTableColumn>
      <template #default="scope">
        <li>下单：{{ scope.row.orderDt || '-' }}</li>
      </template>
    </DateTableColumn>

    <ProTableActionsColumn :pds="[PD.mall.order.edit]" width="120">
      <template #default="scope">
        <ProTableActionButton
          v-if="scope.row.status !== '9'"
          :pd="PD.mall.order.edit"
          link
          type="primary"
          @click="handleAddedOrUpdate(scope.row)"
        >
          管理
        </ProTableActionButton>
        <!-- <ProTableActionButton
          :pd="PD.mall.order.delete"
          link
          type="danger"
          @click="handleDelete(scope.row)"
        >
          删除
        </ProTableActionButton> -->
      </template>
    </ProTableActionsColumn>
  </ProTable>

  <ProDialogForm ref="proDialogFormInstance" />
</template>

<script setup lang="ts">
  import { useAsyncTask } from '@daysnap/vue-use'

  import {
    DictionaryType,
    doMallOrderDelete,
    doMallOrderDownload,
    doMallOrderUpdate,
    reqDictionaryListType,
    reqMallOrderList,
  } from '@/api'
  import { useProDialogForm, useProTable } from '@/components'
  import { multipleSelectionKey } from '@/components/ProTableList/selection'
  import { PD } from '@/stores'
  import type { MallOrder } from '@/types'
  import { getKeywordFields } from '@/utils'

  // 列表
  let queryParams = {}
  const [queryMetadata, proTableInstance, handleRequest] = useProTable(
    {
      ...getKeywordFields(),
    },
    async ([currentPage, pageSize], query) => {
      const { dataList, total } = await reqMallOrderList({ currentPage, pageSize, ...query })

      queryParams = query

      return [dataList, total]
    },
  )

  const { data: mapOptions } = useAsyncTask(
    async () => {
      const [status] = await Promise.all([
        reqDictionaryListType({ type: DictionaryType.DIC_ORDER_STATUS }),
      ])
      return { status }
    },
    {
      immediate: true,
      throwError: true,
      initialValue: { status: [] },
    },
  )

  // 编辑
  const [proDialogFormInstance, handleAddedOrUpdate] = useProDialogForm<MallOrder>(
    () => ({
      name: {
        label: '商品名称',
        value: '',
        is: 'form-input',
        props: {
          disabled: true,
        },
      },
      orderBy: {
        label: '收件人',
        value: '',
        is: 'form-input',
        props: {
          disabled: true,
        },
      },
      orderPhone: {
        label: '收件手机号',
        value: '',
        is: 'form-input',
        props: {
          disabled: true,
        },
      },
      location: {
        label: '省/市/区',
        value: '',
        is: 'form-input',
        props: {
          disabled: true,
        },
      },
      address: {
        label: '详细地址',
        value: '',
        is: 'form-input',
        width: '100%',
        props: {
          disabled: true,
          type: 'textarea',
        },
      },
      status: {
        label: '状态',
        value: '',
        is: 'form-radio',
        rules: [{ required: true }],
      },
      logisticsTypeName: {
        label: '物流公司',
        value: '',
        is: 'form-input',
        hidden: (_, __, m) => !['1', '2'].includes(m.status.value),
        rules: [{ required: true }],
      },
      logisticsId: {
        label: '物流单号',
        value: '',
        is: 'form-input',
        hidden: (_, __, m) => !['1', '2'].includes(m.status.value),
        rules: [{ required: true }],
      },
      cancelReason: {
        label: '审核备注',
        value: '',
        is: 'form-input',
        width: '100%',
        hidden: (_, __, m) => !['9'].includes(m.status.value),
        props: {
          type: 'textarea',
        },
      },
    }),
    async (metadata, instance, item) => {
      if (!item) {
        return
      }
      metadata.status.options = mapOptions.value.status

      await instance.value.show({
        title: '发货',
        metadata,
        request: (params) =>
          doMallOrderUpdate({
            id: item.id,
            logisticsTypeName: '',
            logisticsId: '',
            cancelReason: '',
            ...params,
          }),
      })
      proTableInstance.value.reload()
      ElMessage.success('操作成功')
    },
  )

  // 删除
  const handleDelete = async (item: MallOrder) => {
    await ElMessageBox.confirm(`确认删除该数据？`)
    const { id } = item
    await doMallOrderDelete({ id })
    proTableInstance.value.reload()
    ElMessage.success('操作成功')
  }

  const selected = ref<any[]>([])
  provide(multipleSelectionKey, selected)
  const { loading, trigger: handleDownload } = useAsyncTask(
    async (selectAll: boolean) => {
      const params: any = { selectAll, ...queryParams }
      if (!selectAll) {
        params.ids = selected.value.map((item) => item.id)
      }

      await doMallOrderDownload(params)
      ElMessage.success('导出成功')
    },
    {
      throwError: true,
    },
  )
</script>
