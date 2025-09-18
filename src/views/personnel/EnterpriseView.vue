<template>
  <ProTable :request="handleRequest" :query-metadata="queryMetadata" ref="proTableInstance">
    <template #actions>
      <ProActionButton
        :pd="PD.personnel.enterprise.added"
        type="primary"
        plain
        icon="Plus"
        @click="handleAddedOrUpdate()"
      >
        新增
      </ProActionButton>
    </template>

    <ElTableColumn prop="name" label="企业" min-width="120" />
    <ElTableColumn label="联系人" min-width="120">
      <template #default="scope">
        <ul>
          <li>姓名：{{ scope.row.contactName || '-' }}</li>
          <li>电话：{{ scope.row.contactPhone || '-' }}</li>
          <li>备注：{{ scope.row.remark || '-' }}</li>
        </ul>
      </template>
    </ElTableColumn>

    <DistrictTableColumn />

    <StatusTableColumn />

    <DateTableColumn />

    <ProTableActionsColumn
      :pds="[PD.personnel.enterprise.edit, PD.personnel.enterprise.delete]"
      width="120"
    >
      <template #default="scope">
        <ProTableActionButton
          :pd="PD.personnel.enterprise.edit"
          link
          type="primary"
          @click="handleAddedOrUpdate(scope.row)"
        >
          编辑
        </ProTableActionButton>
        <ProTableActionButton
          :pd="PD.personnel.enterprise.delete"
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
    doEnterpriseCreate,
    doEnterpriseDelete,
    doEnterpriseUpdate,
    reqDictionaryListType,
    reqEnterpriseList,
  } from '@/api'
  import { useProDialogForm, useProTable } from '@/components'
  import { PD } from '@/stores'
  import type { Enterprise } from '@/types'
  import { getKeywordFields, getProvinceAndCityFields } from '@/utils'

  // 列表
  const [queryMetadata, proTableInstance, handleRequest] = useProTable(
    {
      ...getKeywordFields(),
      name: {
        is: 'form-input',
        value: '',
        label: '企业名称',
      },
      provinceAndCity: getProvinceAndCityFields({ query: true }),
    },
    async ([currentPage, pageSize], query) => {
      const { dataList, total } = await reqEnterpriseList({ currentPage, pageSize, ...query })
      return [dataList, total]
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

  // 编辑 or 新增
  const [proDialogFormInstance, handleAddedOrUpdate] = useProDialogForm<Enterprise>(
    () => ({
      name: {
        label: '企业名称',
        value: '',
        is: 'form-input',
        rules: [{ required: true }],
      },
      provinceAndCity: getProvinceAndCityFields(),
      contactName: {
        label: '联系人',
        value: '',
        is: 'form-input',
      },
      contactPhone: {
        label: '联系电话',
        value: '',
        is: 'form-input',
      },
      status: {
        label: '状态',
        value: '',
        is: 'form-radio',
        rules: [{ required: true }],
      },
      address: {
        label: '详细地址',
        value: '',
        is: 'form-input',
        width: '100%',
        props: {
          type: 'textarea',
        },
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

      console.log('metadata', metadata)

      await instance.value.show({
        title: item ? '编辑' : '新增',
        metadata,
        request: (params) =>
          item ? doEnterpriseUpdate({ id: item.id, ...params }) : doEnterpriseCreate(params),
      })
      proTableInstance.value.reload()
      ElMessage.success('操作成功')
    },
  )

  // 删除
  const handleDelete = async (item: Enterprise) => {
    await ElMessageBox.confirm(`确认删除该数据？`)
    const { id } = item
    await doEnterpriseDelete({ id })
    proTableInstance.value.reload()
    ElMessage.success('操作成功')
  }
</script>
