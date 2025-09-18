<template>
  <ProTable :request="handleRequest" :query-metadata="queryMetadata" ref="proTableInstance">
    <template #actions>
      <ProActionButton
        :pd="PD.personnel.volunteer.added"
        type="primary"
        plain
        icon="Plus"
        @click="handleAddedOrUpdate()"
      >
        新增
      </ProActionButton>
    </template>

    <ElTableColumn label="志愿者信息" min-width="120">
      <template #default="scope">
        <ul>
          <li>姓名：{{ scope.row.name || '-' }}</li>
          <li>手机号：{{ scope.row.phone || '-' }}</li>
        </ul>
      </template>
    </ElTableColumn>

    <ElTableColumn label="其他" min-width="120">
      <template #default="scope">
        <ul>
          <li>职业：{{ scope.row.job || '-' }}</li>
          <li>备注：{{ scope.row.remark || '-' }}</li>
        </ul>
      </template>
    </ElTableColumn>

    <DistrictTableColumn />

    <StatusTableColumn />

    <DateTableColumn />

    <ProTableActionsColumn
      :pds="[PD.personnel.volunteer.edit, PD.personnel.volunteer.delete]"
      width="120"
    >
      <template #default="scope">
        <ProTableActionButton
          :pd="PD.personnel.volunteer.edit"
          link
          type="primary"
          @click="handleAddedOrUpdate(scope.row)"
        >
          编辑
        </ProTableActionButton>
        <ProTableActionButton
          :pd="PD.personnel.volunteer.delete"
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
    doVolunteerCreate,
    doVolunteerDelete,
    doVolunteerUpdate,
    reqDictionaryListType,
    reqUserByRoleType,
    reqVolunteerList,
    RoleType,
  } from '@/api'
  import { useProDialogForm, useProTable } from '@/components'
  import { PD } from '@/stores'
  import type { Volunteer } from '@/types'
  import { getKeywordFields, getProvinceAndCityFields } from '@/utils'

  // 列表
  const [queryMetadata, proTableInstance, handleRequest] = useProTable(
    {
      ...getKeywordFields(),
      name: {
        is: 'form-input',
        value: '',
        label: '志愿者姓名',
      },
      provinceAndCity: getProvinceAndCityFields({ query: true }),
    },
    async ([currentPage, pageSize], query) => {
      const { dataList, total } = await reqVolunteerList({ currentPage, pageSize, ...query })
      return [dataList, total]
    },
  )

  const { data: mapOptions } = useAsyncTask(
    async () => {
      const [users, status] = await Promise.all([
        reqUserByRoleType({ roleId: RoleType.DOCTOR }),
        reqDictionaryListType({ type: DictionaryType.DIC_DISABLED }),
      ])
      return { users, status }
    },
    {
      immediate: true,
      throwError: true,
      initialValue: { users: [], status: [] },
    },
  )

  // 编辑 or 新增
  const [proDialogFormInstance, handleAddedOrUpdate] = useProDialogForm<Volunteer>(
    () => ({
      loginId: {
        label: '用户',
        value: '',
        is: 'form-select',
        options: [],
        rules: [{ required: true }],
      },
      job: {
        label: '职业',
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
      metadata.loginId.options = mapOptions.value.users
      metadata.status.options = mapOptions.value.status

      await instance.value.show({
        title: item ? '编辑' : '新增',
        metadata,
        request: (params) =>
          item
            ? doVolunteerUpdate({ loginId: item.loginId, ...params })
            : doVolunteerCreate(params),
      })
      proTableInstance.value.reload()
      ElMessage.success('操作成功')
    },
  )

  // 删除
  const handleDelete = async (item: Volunteer) => {
    await ElMessageBox.confirm(`确认删除该数据？`)
    const { loginId } = item
    await doVolunteerDelete({ loginId })
    proTableInstance.value.reload()
    ElMessage.success('操作成功')
  }
</script>
