<template>
  <ProTable :request="handleRequest" :query-metadata="queryMetadata" ref="proTableInstance">
    <template #actions>
      <ProActionButton
        :pd="PD.tools.insurancePolicy.added"
        type="primary"
        plain
        icon="Plus"
        @click="handleAddedOrUpdate()"
      >
        新增
      </ProActionButton>
    </template>

    <ElTableColumn type="expand">
      <template #default="scope">
        <ElRow :gutter="20">
          <ElCol :span="12">
            <span>内容</span>
            <span>{{ scope.row.content }}</span>
          </ElCol>
        </ElRow>
      </template>
    </ElTableColumn>

    <ElTableColumn prop="name" label="医保政策" min-width="200" />

    <ElTableColumn label="内容" min-width="200">
      <template #default="scope">
        <ul>
          <li>发布日期：{{ scope.row.publishDt || '-' }}</li>
          <li>所属医院：{{ scope.row.hospitalName || '-' }}</li>
        </ul>
      </template>
    </ElTableColumn>

    <DistrictTableColumn />

    <StatusTableColumn />

    <DateTableColumn />

    <ProTableActionsColumn
      :pds="[PD.tools.insurancePolicy.edit, PD.tools.insurancePolicy.delete]"
      width="120"
    >
      <template #default="scope">
        <ProTableActionButton
          :pd="PD.tools.insurancePolicy.edit"
          link
          type="primary"
          @click="handleAddedOrUpdate(scope.row)"
        >
          编辑
        </ProTableActionButton>
        <ProTableActionButton
          :pd="PD.tools.insurancePolicy.delete"
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
    doInsurancePolicyCreate,
    doInsurancePolicyDelete,
    doInsurancePolicyUpdate,
    reqDictionaryListType,
    reqHospitalList,
    reqInsurancePolicyList,
  } from '@/api'
  import { useProDialogForm, useProTable } from '@/components'
  import { PD } from '@/stores'
  import type { InsurancePolicy } from '@/types'
  import { getKeywordFields, getProvinceAndCityFields, withPagingParams } from '@/utils'

  // 列表
  const [queryMetadata, proTableInstance, handleRequest] = useProTable(
    {
      ...getKeywordFields(),
      name: {
        is: 'form-input',
        value: '',
        label: '医保政策名称',
      },
      provinceAndCity: getProvinceAndCityFields({ query: true }),
    },
    async ([currentPage, pageSize], query) => {
      const { dataList, total } = await reqInsurancePolicyList({ currentPage, pageSize, ...query })
      return [dataList, total]
    },
  )

  const { data: mapOptions } = useAsyncTask(
    async () => {
      const [hospitals, status] = await Promise.all([
        withPagingParams(reqHospitalList)(),
        reqDictionaryListType({ type: DictionaryType.DIC_DISABLED }),
      ])
      return { hospitals, status }
    },
    {
      immediate: true,
      throwError: true,
      initialValue: { hospitals: [], status: [] },
    },
  )

  // 编辑 or 新增
  const [proDialogFormInstance, handleAddedOrUpdate] = useProDialogForm<InsurancePolicy>(
    () => ({
      name: {
        label: '医保政策名称',
        value: '',
        is: 'form-input',
        rules: [{ required: true }],
      },
      provinceAndCity: getProvinceAndCityFields(),
      hospitalId: {
        label: '所属医院',
        value: '',
        is: 'form-select',
        labelKey: 'name',
        valueKey: 'id',
        options: [],
      },
      status: {
        label: '状态',
        value: '',
        is: 'form-radio',
        rules: [{ required: true }],
      },
      content: {
        label: '内容',
        value: '',
        is: 'form-input',
        width: '100%',
        props: {
          type: 'textarea',
        },
        rules: [{ required: true }],
      },
    }),
    async (metadata, instance, item) => {
      metadata.hospitalId.options = mapOptions.value.hospitals
      metadata.status.options = mapOptions.value.status

      await instance.value.show({
        title: item ? '编辑' : '新增',
        metadata,
        request: (params) =>
          item
            ? doInsurancePolicyUpdate({ id: item.id, ...params })
            : doInsurancePolicyCreate(params),
      })
      proTableInstance.value.reload()
      ElMessage.success('操作成功')
    },
  )

  // 删除
  const handleDelete = async (item: InsurancePolicy) => {
    await ElMessageBox.confirm(`确认删除该数据？`)
    const { id } = item
    await doInsurancePolicyDelete({ id })
    proTableInstance.value.reload()
    ElMessage.success('操作成功')
  }
</script>
