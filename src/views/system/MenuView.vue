<template>
  <ProTable
    :request="handleRequest"
    :query-metadata="queryMetadata"
    ref="proTableInstance"
    :has-pagination="false"
  >
    <template #actions>
      <ProActionButton
        :pd="PD.system.menu.added"
        type="primary"
        plain
        icon="Plus"
        @click="handleAddedOrUpdate()"
      >
        新增
      </ProActionButton>
      <template v-if="__DEV__">
        <ElButton type="warning" plain icon="Plus" @click="createMenuFunctions()">
          生成权限菜单
        </ElButton>
        <ElButton type="warning" plain icon="Delete" @click="deleteMenuFunctions()">
          删除权限菜单
        </ElButton>
        <ElButton type="warning" plain icon="Plus" @click="createMenus()"> 批量生成 </ElButton>
        <ElButton type="danger" plain icon="Delete" @click="deleteMenus()"> 批量删除 </ElButton>
      </template>
    </template>

    <template #table="scope">
      <ElTable
        ref="elTableInstance"
        width="100%"
        stripe
        table-layout="fixed"
        :data="scope.data"
        default-expand-all
        row-key="id"
        :tree-props="{ children: 'children', hasChildren: '' }"
      >
        <ElTableColumn prop="title" label="标题" />
        <ElTableColumn prop="functionType" label="类型" width="100">
          <template #default="scope">
            {{ mapFunctionTypeValueLabel[scope.row.functionType] }}
          </template>
        </ElTableColumn>
        <ElTableColumn prop="functionType" label="路径/编码">
          <template #default="scope">
            {{ scope.row.functionType === '1' ? scope.row.path : scope.row.code }}
          </template>
        </ElTableColumn>
        <ElTableColumn prop="createDt" label="创建时间" />

        <ProTableActionsColumn :pds="[PD.system.menu.edit, PD.system.menu.delete]" width="120">
          <template #default="scope">
            <ProTableActionButton
              :pd="PD.system.menu.edit"
              link
              type="primary"
              @click="handleAddedOrUpdate(scope.row)"
            >
              编辑
            </ProTableActionButton>
            <ProTableActionButton
              :pd="PD.system.menu.delete"
              link
              type="danger"
              @click="handleDelete(scope.row)"
            >
              删除
            </ProTableActionButton>
          </template>
        </ProTableActionsColumn>
      </ElTable>
    </template>
  </ProTable>

  <ProDialogForm ref="proDialogFormInstance" />
</template>

<script setup lang="ts">
  import { ato, cloneSimple } from '@daysnap/utils'

  import { doMenuCreate, doMenuDelete, doMenuUpdate, reqMenuList } from '@/api'
  import { useProDialogForm, useProTable } from '@/components'
  import { PD } from '@/stores'
  import { codeOptions } from '@/stores'
  import type { Menu } from '@/types'
  import { __DEV__ } from '@/utils'

  import {
    createMenuFunctions,
    createMenus,
    deleteMenuFunctions,
    deleteMenus,
  } from './menu-devtools'

  const FUNCTION_TYPE = [
    { label: '页面', value: '1' },
    { label: '按钮', value: '2' },
  ]
  const mapFunctionTypeValueLabel = ato(FUNCTION_TYPE, 'value', 'label')

  let menus: Partial<Menu>[] = [{ id: '', title: '根菜单' }]
  // 列表
  const [queryMetadata, proTableInstance, handleRequest] = useProTable(
    {
      title: {
        is: 'form-input',
        value: '',
        label: '名称',
      },
    },
    async (_, query) => {
      const data = await reqMenuList(query)
      const loop = (list: Menu[]) => {
        return list.filter((item) => {
          if (item.children) {
            item.children = loop(item.children)
          }
          return item.functionType === '1'
        })
      }
      menus[0].children = loop(cloneSimple(data))
      return [data, data.length]
    },
  )

  // 编辑 or 新增
  const [proDialogFormInstance, handleAddedOrUpdate] = useProDialogForm<Menu>(
    () => ({
      title: {
        label: '标题',
        value: '',
        is: 'form-input',
        // hidden: (_, __, m) => !['1'].includes(m.functionType.value),
        rules: [{ required: true }],
      },
      parentId: {
        label: '父级菜单',
        value: '',
        is: 'form-tree-select',
        props: {
          placeholder: '不选择，默认挂在到根菜单下',
          defaultExpandAll: true,
          checkStrictly: true,
          props: { label: 'title', value: 'id' },
        },
      },
      functionType: {
        label: '类型',
        value: '',
        is: 'form-radio',
        options: [...FUNCTION_TYPE],
        rules: [{ required: true }],
      },
      index: {
        label: '排序',
        value: 1,
        is: 'form-input-number',
        rules: [{ required: true }],
      },
      image: {
        label: '菜单图片',
        value: '',
        is: 'form-image-upload',
        hidden: (_, __, m) => !['1'].includes(m.functionType.value),
        width: '100%',
      },
      path: {
        label: '路由路径',
        value: '',
        is: 'form-input',
        hidden: (_, __, m) => !['1'].includes(m.functionType.value),
      },
      component: {
        label: '路由组件',
        value: '',
        is: 'form-input',
        hidden: (_, __, m) => !['1'].includes(m.functionType.value),
      },
      icon: {
        label: '菜单icon',
        value: '',
        is: 'form-input',
        hidden: (_, __, m) => !['1'].includes(m.functionType.value),
      },
      hidden: {
        label: '是否隐藏',
        value: false,
        is: 'form-radio',
        options: [
          { label: '是', value: true },
          { label: '否', value: false },
        ],
        hidden: (_, __, m) => !['1'].includes(m.functionType.value),
      },
      code: {
        label: '菜单编码',
        value: '',
        is: 'form-input',
        // get: (v, f) => {
        //   const { label = '' } = f.options.find((item: any) => item.value === v) || {}
        //   return {
        //     code: v,
        //     title: label,
        //   }
        // },
        options: [...codeOptions],
        hidden: (_, __, m) => !['2'].includes(m.functionType.value),
        rules: [{ required: true }],
      },
    }),
    async (metadata, instance, item) => {
      metadata.parentId.options = menus

      await instance.value.show({
        title: item ? '编辑' : '新增',
        metadata,
        request: (params) =>
          item ? doMenuUpdate({ id: item.id, ...params }) : doMenuCreate(params),
      })
      proTableInstance.value.reload()
      ElMessage.success('操作成功')
    },
  )

  // 删除
  const handleDelete = async (item: Menu) => {
    await ElMessageBox.confirm(`确认删除该数据？`)

    const { id } = item
    await doMenuDelete({ id })
    proTableInstance.value.reload()
    ElMessage.success('操作成功')
  }
</script>
