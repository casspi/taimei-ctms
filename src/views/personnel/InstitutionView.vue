<template>
  <ProTable :request="handleRequest" :query-metadata="queryMetadata" ref="proTableInstance">
    <template #actions>
      <ProActionButton
        :pd="PD.personnel.institution.added"
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
          <ul>
            <li>{{ scope.row.name || '-' }}</li>
            <li>类型：{{ scope.row.typeName || '-' }}</li>
          </ul>
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
      :pds="[PD.personnel.institution.edit, PD.personnel.institution.delete]"
      width="120"
    >
      <template #default="scope">
        <ProTableActionButton
          :pd="PD.personnel.institution.edit"
          link
          type="primary"
          @click="handleAddedOrUpdate(scope.row)"
        >
          编辑
        </ProTableActionButton>
        <ProTableActionButton
          :pd="PD.personnel.institution.delete"
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
    doInstitutionCreate,
    doInstitutionDelete,
    doInstitutionUpdate,
    reqDictionaryListType,
    reqInstitutionList,
  } from '@/api'
  import { useProDialogForm, useProTable } from '@/components'
  import { PD } from '@/stores'
  import type { Institution } from '@/types'
  import { getKeywordFields, getProvinceAndCityFields } from '@/utils'

  // 列表
  const [queryMetadata, proTableInstance, handleRequest] = useProTable(
    {
      ...getKeywordFields(),
      name: {
        is: 'form-input',
        value: '',
        label: '机构名称',
      },
      provinceAndCity: getProvinceAndCityFields({ query: true }),
    },
    async ([currentPage, pageSize], query) => {
      const { dataList, total } = await reqInstitutionList({ currentPage, pageSize, ...query })
      return [dataList, total]
    },
  )

  // 字典
  const { data: mapOptions } = useAsyncTask(
    async () => {
      const [types, status] = await Promise.all([
        reqDictionaryListType({ type: DictionaryType.DIC_INSTITUTION_TYPE }),
        reqDictionaryListType({ type: DictionaryType.DIC_DISABLED }),
      ])
      return { types, status }
    },
    {
      immediate: true,
      throwError: true,
      initialValue: { types: [], status: [] },
    },
  )

  // 编辑 or 新增
  const [proDialogFormInstance, handleAddedOrUpdate] = useProDialogForm<Institution>(
    () => ({
      name: {
        label: '机构名称',
        value: '',
        is: 'form-input',
        rules: [{ required: true }],
      },
      type: {
        label: '机构类型',
        value: '',
        is: 'form-select',
        options: [],
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
        rules: [{ required: true }],
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
      metadata.type.options = mapOptions.value.types
      metadata.status.options = mapOptions.value.status

      await instance.value.show({
        title: item ? '编辑' : '新增',
        metadata,
        request: (params) =>
          item ? doInstitutionUpdate({ id: item.id, ...params }) : doInstitutionCreate(params),
      })
      proTableInstance.value.reload()
      ElMessage.success('操作成功')
    },
  )

  // 删除
  const handleDelete = async (item: Institution) => {
    await ElMessageBox.confirm(`确认删除该数据？`)
    const { id } = item
    await doInstitutionDelete({ id })
    proTableInstance.value.reload()
    ElMessage.success('操作成功')
  }
</script>
