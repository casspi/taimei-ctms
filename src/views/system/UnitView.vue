<template>
  <div class="c-flex" v-loading="listLoading">
    <div class="c-sidebar">
      <ElTree
        ref="elTreeInstance"
        :data="units"
        :expand-on-click-node="false"
        default-expand-all
        highlight-current
        node-key="value"
        @node-click="handleNodeClick"
      />
    </div>
    <div class="c-display-inner">
      <div class="c-display-actions">
        <h2>单位管理</h2>

        <ProActionButton
          :pd="PD.system.unit.added"
          type="primary"
          plain
          icon="Plus"
          @click="handleAddedOrUpdate()"
        >
          新增
        </ProActionButton>
        <ProActionButton
          :pd="PD.system.unit.edit"
          icon="Edit"
          plain
          type="info"
          :disabled="!selected"
          @click="handleAddedOrUpdate(selected!)"
        >
          编辑
        </ProActionButton>
        <ProActionButton
          :pd="PD.system.unit.delete"
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
          label="单位名称"
          label-class-name="c-label-width"
          class-name="c-content-width"
        >
          {{ computedUnitInfo?.name ?? '-' }}
        </ElDescriptionsItem>
        <ElDescriptionsItem
          label="领导"
          label-class-name="c-label-width"
          class-name="c-content-width"
        >
          {{ computedUnitInfo?.masterUserLabels ?? '-' }}
        </ElDescriptionsItem>
        <ElDescriptionsItem
          label="人员"
          label-class-name="c-label-width"
          class-name="c-content-width"
        >
          {{ computedUnitInfo?.userLabels ?? '-' }}
        </ElDescriptionsItem>
        <ElDescriptionsItem
          label="描述"
          label-class-name="c-label-width"
          class-name="c-content-width"
        >
          {{ computedUnitInfo?.description ?? '-' }}
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
    doUnitCreate,
    doUnitDelete,
    doUnitUpdate,
    reqDictInfo,
    reqUnitInfo,
    reqUnitList,
  } from '@/api'
  import { type ProDialogFormMetadata, useProDialogForm } from '@/components'
  import { PD } from '@/stores'
  import type { Dict } from '@/types'

  const elTreeInstance = ref<InstanceType<typeof ElTree>>() // tree instance
  const selected = ref<Dict>() // 选中的单位
  // 用户字典
  const { data: users } = useAsyncTask(() => reqDictInfo(DictType.DIC_USER), {
    throwError: true,
    immediate: true,
  })

  // 获取所有单位列表
  const {
    data: units,
    trigger: handleReqUnitList,
    loading: listLoading,
  } = useAsyncTask(
    async () => {
      const units = await reqUnitList()
      if (!selected.value) {
        selected.value = units[0]
      }
      handleReqUnitInfo()
      // fix el-tree current-node-key bug
      setTimeout(() => {
        nextTick(() => elTreeInstance.value?.setCurrentKey(selected.value?.value))
      }, 0)
      return units
    },
    {
      immediate: true,
      throwError: true,
    },
  )

  // 获取详情
  const {
    data: unitInfo,
    trigger: handleReqUnitInfo,
    loading: infoLoading,
  } = useAsyncTask(
    async () => (selected.value ? reqUnitInfo({ id: selected.value.value }) : void 0),
    { throwError: true },
  )
  const computedUnitInfo = computed(() => {
    if (!unitInfo.value) {
      return null
    }
    const { masterUserIds, userIds } = unitInfo.value
    const masterUserLabels = users.value
      ?.filter((item) => masterUserIds?.includes(item.value))
      .map((item) => item.label)
    const userLabels = users.value
      ?.filter((item) => userIds?.includes(item.value))
      .map((item) => item.label)
    return {
      ...unitInfo.value,
      masterUserLabels: masterUserLabels?.length ? masterUserLabels.join('、') : '-',
      userLabels: userLabels?.length ? userLabels.join('、') : '-',
    }
  })

  // 选择
  const handleNodeClick = (item: Dict) => {
    selected.value = item
    nextTick(() => elTreeInstance.value?.setCurrentKey(item.value))
    handleReqUnitInfo()
  }

  // 编辑 or 新增
  const [proDialogFormInstance, handleAddedOrUpdate] = useProDialogForm<Dict>(
    () => {
      const metadata: ProDialogFormMetadata = {
        name: {
          label: '名称',
          value: '',
          is: 'form-input',
          rules: [{ required: true }],
        },
        parentId: {
          label: '上级单位',
          value: '',
          is: 'form-tree-select',
          options: [],
          props: {
            checkStrictly: true,
          },
        },
        masterUserIds: {
          label: '领导',
          value: [],
          is: 'form-select',
          options: [],
          props: {
            multiple: true,
            collapseTags: true,
          },
          rules: [
            {
              validator: (_, v) => {
                const userIds = metadata.userIds.value || []
                return !userIds.find((id: string) => v.includes(id))
              },
              message: '领导和人员不能重复',
            },
          ],
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
          rules: [
            {
              validator: (_, v) => {
                const masterUserIds = metadata.masterUserIds.value || []
                return !masterUserIds.find((id: string) => v.includes(id))
              },
              message: '领导和人员不能重复',
            },
          ],
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
      }
      return metadata
    },
    async (metadata, instance, item) => {
      // 选项数据
      metadata.parentId.options = units.value
      metadata.masterUserIds.options = users.value
      metadata.userIds.options = users.value

      if (item) {
        banana.assignment(unitInfo.value ?? {}, metadata as any)
      }

      // 弹窗
      await instance.value.show({
        title: item ? '编辑' : '新增',
        metadata,
        request: async (params) => {
          if (item) {
            return doUnitUpdate({ id: item.value, ...params })
          }
          const res = await doUnitCreate(params)
          selected.value = { label: res.name, value: res.id }
        },
      })
      handleReqUnitList()
      ElMessage.success('操作成功')
    },
  )

  // 删除
  const handleDelete = async () => {
    if (!selected.value) return
    await ElMessageBox.confirm(`确认删除该数据？`)
    await doUnitDelete({ id: selected.value.value })
    selected.value = void 0
    handleReqUnitList()
    ElMessage.success('操作成功')
  }
</script>
