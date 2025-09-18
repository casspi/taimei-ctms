<template>
  <div class="c-flex">
    <div class="c-sidebar">
      <ElTreeSelect
        :model-value="unit?.value"
        :data="units"
        style="margin-bottom: 12px"
        check-strictly
        @node-click="handleUnitChange"
      />
      <ElTree
        ref="elTreeInstance"
        :props="{ label: 'text' }"
        :data="departments"
        :expand-on-click-node="false"
        default-expand-all
        highlight-current
        node-key="value"
        @node-click="handleNodeClick"
      />
    </div>

    <div class="c-display-inner">
      <div class="c-display-actions">
        <h2>部门管理</h2>
        <ProActionButton
          :pd="PD.system.department.added"
          icon="Plus"
          plain
          type="primary"
          :disabled="!unit"
          @click="handleAddedOrUpdate()"
        >
          新增
        </ProActionButton>
        <ProActionButton
          :pd="PD.system.department.edit"
          icon="Edit"
          plain
          type="info"
          :disabled="!selected"
          @click="handleAddedOrUpdate(selected!)"
        >
          编辑
        </ProActionButton>
        <ProActionButton
          :pd="PD.system.department.delete"
          icon="Delete"
          plain
          type="danger"
          :disabled="!selected"
          @click="handleDelete"
        >
          删除
        </ProActionButton>
      </div>
      <ElDescriptions v-loading="infoLoading" class="c-display-content" :column="2" border>
        <ElDescriptionsItem
          label="部门名称"
          label-class-name="c-label-width"
          class-name="c-content-width"
        >
          {{ computedDepartmentInfo?.name ?? '-' }}
        </ElDescriptionsItem>
        <ElDescriptionsItem
          label="所属单位"
          label-class-name="c-label-width"
          class-name="c-content-width"
        >
          {{ computedDepartmentInfo ? unit?.label : '-' }}
        </ElDescriptionsItem>
        <ElDescriptionsItem
          label="负责人"
          label-class-name="c-label-width"
          class-name="c-content-width"
        >
          {{ computedDepartmentInfo?.masterUserLabels ?? '-' }}
        </ElDescriptionsItem>
        <ElDescriptionsItem
          label="人员"
          label-class-name="c-label-width"
          class-name="c-content-width"
        >
          {{ computedDepartmentInfo?.userLabels ?? '-' }}
        </ElDescriptionsItem>
        <ElDescriptionsItem
          label="描述"
          label-class-name="c-label-width"
          class-name="c-content-width"
        >
          {{ computedDepartmentInfo?.description ?? '-' }}
        </ElDescriptionsItem>
      </ElDescriptions>
    </div>
  </div>

  <ProDialogForm ref="proDialogFormInstance" />
</template>

<script setup lang="ts">
  import banana from '@daysnap/banana'
  import { useAsyncTask } from '@daysnap/vue-use'
  import type { ElTree } from 'element-plus'

  import {
    DictType,
    doDepartmentCreate,
    doDepartmentDelete,
    doDepartmentUpdate,
    reqDepartmentInfo,
    reqDepartmentList,
    reqDictInfo,
    reqUnitList,
  } from '@/api'
  import { useProDialogForm } from '@/components'
  import { PD } from '@/stores'
  import type { Dict, TreeItem } from '@/types'

  // 用户字典
  const elTreeInstance = ref<InstanceType<typeof ElTree>>() // tree instance
  const { data: users } = useAsyncTask(() => reqDictInfo(DictType.DIC_USER), {
    throwError: true,
    immediate: true,
    initialValue: [],
  })

  // 单位
  const unit = ref<Dict>()
  const { data: units } = useAsyncTask(() => reqUnitList(), { immediate: true, throwError: true })
  const handleUnitChange = (item: Dict) => {
    unit.value = item
    selected.value = void 0
    handleReqDepartments()
    handleDepartmentInfo()
  }

  // 部门
  const selected = ref<TreeItem>()
  const { data: departments, trigger: handleReqDepartments } = useAsyncTask(
    async () => {
      let list: TreeItem[] = []
      if (unit.value) {
        list = await reqDepartmentList({ unitId: unit.value.value })
      }
      if (!selected.value) {
        selected.value = list[0]
      }
      handleDepartmentInfo()
      // fix el-tree current-node-key bug
      setTimeout(() => {
        nextTick(() => elTreeInstance.value?.setCurrentKey(selected.value?.value))
      }, 0)
      return list
    },
    {
      throwError: true,
    },
  )
  const handleNodeClick = async (item: TreeItem) => {
    selected.value = item
    nextTick(() => elTreeInstance.value?.setCurrentKey(item.value))
    handleDepartmentInfo()
  }

  // 详情
  const {
    data: departmentInfo,
    trigger: handleDepartmentInfo,
    loading: infoLoading,
  } = useAsyncTask(
    async () => (selected.value ? reqDepartmentInfo({ id: selected.value.value }) : void 0),
    {
      throwError: true,
    },
  )
  const computedDepartmentInfo = computed(() => {
    if (!departmentInfo.value) {
      return null
    }
    const { parentId, masterUserIds, userIds } = departmentInfo.value
    const masterUserLabels = users.value
      ?.filter((item) => masterUserIds?.includes(item.value))
      .map((item) => item.label)
    const userLabels = users.value
      ?.filter((item) => userIds?.includes(item.value))
      .map((item) => item.label)
    return {
      ...departmentInfo.value,
      parentLabel: units.value?.find((item) => item.value === parentId)?.label ?? '-',
      masterUserLabels: masterUserLabels.length ? masterUserLabels.join('、') : '-',
      userLabels: userLabels.length ? userLabels.join('、') : '-',
    }
  })

  // 编辑 or 新增
  const [proDialogFormInstance, handleAddedOrUpdate] = useProDialogForm<TreeItem>(
    () => ({
      name: {
        label: '名称',
        value: '',
        is: 'form-input',
        rules: [{ required: true }],
      },
      unitId: {
        label: '所属单位',
        value: '',
        is: 'form-tree-select',
        options: [],
        props: {
          disabled: true,
          checkStrictly: true,
        },
        rules: [{ required: true }],
      },
      parentId: {
        label: '上级部门',
        value: '',
        is: 'form-tree-select',
        options: [],
        props: {
          props: { label: 'text' },
          checkStrictly: true,
        },
      },
      masterUserIds: {
        label: '负责人',
        value: [],
        is: 'form-select',
        options: [],
        props: {
          multiple: true,
          collapseTags: true,
        },
      },
      userIds: {
        label: '人员',
        value: [],
        is: 'form-select',
        options: [],
        props: {
          multiple: true,
          collapseTags: true,
        },
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
      // 选项数据
      metadata.unitId.options = units.value
      metadata.unitId.value = unit.value?.value
      metadata.parentId.options = departments.value
      metadata.masterUserIds.options = users.value
      metadata.userIds.options = users.value

      if (item) {
        banana.assignment(departmentInfo.value ?? {}, metadata as any)
      }

      // 弹窗
      await instance.value.show({
        title: item ? '编辑' : '新增',
        metadata,
        request: async (params) => {
          if (item) {
            return doDepartmentUpdate({ id: item.value, ...params })
          }
          const res = await doDepartmentCreate(params)
          selected.value = { value: res.id, text: res.name } as any
        },
      })
      handleReqDepartments()
      handleDepartmentInfo()
      ElMessage.success('操作成功')
    },
  )

  // 删除
  const handleDelete = async () => {
    if (!selected.value) return
    await ElMessageBox.confirm(`确认删除该数据？`)
    await doDepartmentDelete({ id: selected.value.value })
    selected.value = void 0
    handleReqDepartments()
    handleDepartmentInfo()
    ElMessage.success('操作成功')
  }
</script>
