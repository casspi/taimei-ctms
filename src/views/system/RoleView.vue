<template>
  <ProTable :request="handleRequest" ref="proTableInstance">
    <template #actions>
      <ProActionButton
        :pd="PD.system.role.added"
        type="primary"
        plain
        icon="Plus"
        @click="handleAddedOrUpdate()"
      >
        新增
      </ProActionButton>
    </template>

    <ElTableColumn prop="name" label="名称" />

    <ElTableColumn prop="enName" label="英文名称" />

    <ElTableColumn prop="description" label="备注" />

    <ElTableColumn label="时间" width="200px">
      <template #default="scope">
        <ul>
          <li>创建：{{ scope.row.createTime || '-' }}</li>
          <li>更新：{{ scope.row.modifyTime || '-' }}</li>
        </ul>
      </template>
    </ElTableColumn>

    <ProTableActionsColumn
      :pds="[PD.system.role.edit, PD.system.role.delete, PD.system.role.auth]"
      width="120"
    >
      <template #default="scope">
        <ProTableActionButton
          :pd="PD.system.role.edit"
          link
          type="primary"
          @click="handleAddedOrUpdate(scope.row)"
        >
          编辑
        </ProTableActionButton>
        <ProTableActionButton
          :pd="PD.system.role.auth"
          link
          type="warning"
          @click="handleAuth(scope.row)"
        >
          授权
        </ProTableActionButton>
        <ProTableActionButton
          :pd="PD.system.role.delete"
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
    doRoleAuthMenus,
    doRoleCreate,
    doRoleDelete,
    doRoleUpdate,
    reqMenuList,
    reqRoleAuthMenus,
    reqRoleList,
  } from '@/api'
  import { useProDialogForm, useProTable } from '@/components'
  import { PD } from '@/stores'
  import type { Role } from '@/types'

  // 列表
  const [proTableInstance, handleRequest] = useProTable(async ([currentPage, pageSize], query) => {
    const { dataList, total } = await reqRoleList({ currentPage, pageSize, ...query })
    return [dataList, total]
  })

  const { data: mapOptions } = useAsyncTask(
    async () => {
      const [menus] = await Promise.all([reqMenuList()])
      return { menus }
    },
    {
      immediate: true,
      throwError: true,
      initialValue: { menus: [] },
    },
  )

  // 编辑 or 新增
  const [proDialogFormInstance, handleAddedOrUpdate] = useProDialogForm<Role>(
    () => ({
      name: {
        label: '名称',
        value: '',
        is: 'form-input',
        rules: [{ required: true }],
      },
      enName: {
        label: '英文名称',
        value: '',
        is: 'form-input',
      },
      description: {
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
      await instance.value.show({
        title: item ? '编辑' : '新增',
        metadata,
        request: (params) =>
          item ? doRoleUpdate({ id: item.id, ...params }) : doRoleCreate(params),
      })
      proTableInstance.value.reload()
      ElMessage.success('操作成功')
    },
  )

  // 授权
  const [, handleAuth] = useProDialogForm<Role>(
    () => ({
      functionList: {
        label: '菜单权限',
        value: [],
        is: 'form-tree',
        props: {
          nodeKey: 'id',
          expandOnClickNode: false,
          highlightCurrent: true,
          showCheckbox: true,
          checkOnClickNode: true,
          defaultExpandAll: true,
          checkStrictly: false,
          props: { label: 'title', value: 'id' },
          placeholder: '请选择菜单权限',
        },
      },
    }),
    async (metadata, _, item) => {
      if (!item) return
      const { id: roleId } = item
      metadata.functionList.value = await reqRoleAuthMenus({ roleId })
      metadata.functionList.options = mapOptions.value.menus

      await proDialogFormInstance.value.show({
        title: '菜单授权',
        metadata,
        request: (params) => doRoleAuthMenus({ ...params, roleId }),
      })
      ElMessage.success('操作成功')
    },
  )

  // 删除
  const handleDelete = async (item: Role) => {
    await ElMessageBox.confirm(`确认删除该数据？`)

    const { id } = item
    await doRoleDelete({ id })
    proTableInstance.value.reload()
    ElMessage.success('操作成功')
  }
</script>
