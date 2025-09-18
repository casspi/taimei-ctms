<template>
  <ProTable :request="handleRequest" :query-metadata="queryMetadata" ref="proTableInstance">
    <template #actions>
      <ProActionButton
        :pd="PD.science.diseaseOrganization.added"
        type="primary"
        plain
        icon="Plus"
        @click="handleAddedOrUpdate()"
      >
        新增
      </ProActionButton>
    </template>

    <ElTableColumn prop="name" label="名称" min-width="120" />

    <ElTableColumn label="负责人" min-width="120">
      <template #default="scope">
        <ul>
          <li>姓名：{{ scope.row.sponsorName || '-' }}</li>
          <li>联系电话：{{ scope.row.phone || '-' }}</li>
        </ul>
      </template>
    </ElTableColumn>

    <DistrictTableColumn />

    <StatusTableColumn />

    <DateTableColumn />

    <ProTableActionsColumn
      :pds="[
        PD.science.diseaseOrganization.edit,
        PD.science.diseaseOrganization.delete,
        PD.science.diseaseOrganizationInfo.list,
      ]"
      width="120"
    >
      <template #default="scope">
        <ProTableActionButton
          :pd="PD.science.diseaseOrganization.edit"
          type="primary"
          @click="handleAddedOrUpdate(scope.row)"
        >
          编辑
        </ProTableActionButton>
        <ProTableActionButton
          :pd="PD.science.diseaseOrganizationInfo.list"
          type="primary"
          @click="handleInfo(scope.row)"
        >
          公告管理
        </ProTableActionButton>
        <ProTableActionButton
          :pd="PD.science.diseaseOrganization.delete"
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
    doDiseaseOrganizationCreate,
    doDiseaseOrganizationDelete,
    doDiseaseOrganizationUpdate,
    reqDictionaryListType,
    reqDiseaseOrganizationList,
    reqUserListByRoleId,
    UserRole,
  } from '@/api'
  import { useProDialogForm, useProTable } from '@/components'
  import { PD } from '@/stores'
  import type { DiseaseOrganization } from '@/types'
  import { getKeywordFields, getProvinceAndCityFields } from '@/utils'

  import { useOrganizationInfoTable } from './useOrganizationInfoTable'

  // 列表
  const [queryMetadata, proTableInstance, handleRequest] = useProTable(
    {
      ...getKeywordFields(),
      name: {
        is: 'form-input',
        value: '',
        label: '组织名称',
      },
      provinceAndCity: getProvinceAndCityFields({ query: true }),
    },
    async ([currentPage, pageSize], query) => {
      const { dataList, total } = await reqDiseaseOrganizationList({
        currentPage,
        pageSize,
        ...query,
      })
      return [dataList, total]
    },
  )

  const { data: mapOptions } = useAsyncTask(
    async () => {
      const [status, userList] = await Promise.all([
        reqDictionaryListType({ type: DictionaryType.DIC_DISABLED }),
        reqUserListByRoleId(UserRole.ORGANIZATION_MANAGER),
      ])
      return { status, userList }
    },
    {
      immediate: true,
      throwError: true,
      initialValue: { status: [], userList: [] },
    },
  )

  // 编辑 or 新增
  const [proDialogFormInstance, handleAddedOrUpdate] = useProDialogForm<DiseaseOrganization>(
    () => ({
      name: {
        label: '名称',
        value: '',
        is: 'form-input',
        rules: [{ required: true, message: '请填写组织名称' }],
      },
      sponsorId: {
        label: '负责人',
        value: '',
        is: 'form-select',
        options: [],
      },
      phone: {
        label: '联系电话',
        value: '',
        is: 'form-input',
      },
      provinceAndCity: getProvinceAndCityFields(),
      status: {
        label: '状态',
        value: '',
        is: 'form-radio',
        rules: [{ required: true, message: '请选择状态' }],
      },
    }),
    async (metadata, instance, item) => {
      metadata.status.options = mapOptions.value.status
      metadata.sponsorId.options = mapOptions.value.userList

      await instance.value.show({
        title: item ? '编辑' : '新增',
        metadata,
        request: (params) =>
          item
            ? doDiseaseOrganizationUpdate({ id: item.id, ...params })
            : doDiseaseOrganizationCreate(params),
      })
      proTableInstance.value.reload()
      ElMessage.success('操作成功')
    },
  )

  // 删除
  const handleDelete = async (item: DiseaseOrganization) => {
    await ElMessageBox.confirm(`确认删除该数据？`)
    const { id } = item
    await doDiseaseOrganizationDelete({ id })
    proTableInstance.value.reload()
    ElMessage.success('操作成功')
  }

  // 公告管理
  const [, handleInfo] = useOrganizationInfoTable({
    instance: proDialogFormInstance,
  })
</script>
