<template>
  <ProTable :request="handleRequest" :query-metadata="queryMetadata" ref="proTableInstance">
    <template #actions>
      <ProActionButton
        :pd="PD.personnel.hospital.added"
        type="primary"
        plain
        icon="Plus"
        @click="handleAddedOrUpdate()"
      >
        新增
      </ProActionButton>
    </template>

    <ElTableColumn label="名称" min-width="200">
      <template #default="scope">
        <div class="c-row is-aic">
          <ElImage
            v-if="scope.row.logoFilePath"
            class="c-img-preview"
            :src="scope.row.logoFilePath"
            :preview-src-list="[scope.row.logoFilePath]"
            fit="cover"
            preview-teleported
          />
          <p>{{ scope.row.name }}</p>
        </div>
      </template>
    </ElTableColumn>

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
      :pds="[PD.personnel.hospital.edit, PD.personnel.hospital.delete]"
      width="120"
    >
      <template #default="scope">
        <ProTableActionButton
          :pd="PD.personnel.hospital.edit"
          link
          type="primary"
          @click="handleAddedOrUpdate(scope.row)"
        >
          编辑
        </ProTableActionButton>
        <ProTableActionButton
          :pd="PD.personnel.hospital.delete"
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
    doHospitalCreate,
    doHospitalDelete,
    doHospitalUpdate,
    reqDictionaryListType,
    reqHospitalList,
  } from '@/api'
  import { useProDialogForm, useProTable } from '@/components'
  import { PD } from '@/stores'
  import type { Hospital } from '@/types'
  import { getKeywordFields, getProvinceAndCityFields } from '@/utils'

  // 列表
  const [queryMetadata, proTableInstance, handleRequest] = useProTable(
    {
      ...getKeywordFields(),
      name: {
        is: 'form-input',
        value: '',
        label: '医院名称',
      },
      provinceAndCity: getProvinceAndCityFields({ query: true }),
    },
    async ([currentPage, pageSize], query) => {
      const { dataList, total } = await reqHospitalList({ currentPage, pageSize, ...query })
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
  const [proDialogFormInstance, handleAddedOrUpdate] = useProDialogForm<Hospital>(
    () => ({
      name: {
        label: '医院名称',
        value: '',
        is: 'form-input',
        rules: [{ required: true }],
      },
      nameFullName: {
        label: '医院全称',
        value: '',
        is: 'form-input',
        rules: [{ required: true }],
      },
      logoFilePath: {
        label: 'LOGO',
        value: '',
        is: 'form-image-upload',
        width: '100%',
      },
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
      provinceAndCity: getProvinceAndCityFields(),
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

      await instance.value.show({
        title: item ? '编辑' : '新增',
        metadata,
        request: (params) =>
          item ? doHospitalUpdate({ id: item.id, ...params }) : doHospitalCreate(params),
      })
      proTableInstance.value.reload()
      ElMessage.success('操作成功')
    },
  )

  // 删除
  const handleDelete = async (item: Hospital) => {
    await ElMessageBox.confirm(`确认删除该数据？`)
    const { id } = item
    await doHospitalDelete({ id })
    proTableInstance.value.reload()
    ElMessage.success('操作成功')
  }
</script>
