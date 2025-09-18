<template>
  <ProTable :request="handleRequest" :query-metadata="queryMetadata" ref="proTableInstance">
    <template #actions>
      <ProActionButton
        v-if="modelValue"
        :pd="PD.system.integral.added"
        type="primary"
        plain
        icon="Plus"
        @click="handleAddedOrUpdate()"
      >
        新增
      </ProActionButton>
    </template>

    <ElTableColumn label="用户信息" min-width="120" prop="createByName" />

    <ElTableColumn label="积分信息" min-width="120">
      <template #default="scope">
        <ul>
          <li>
            积分数：<el-link v-if="scope.row.type === '1'" type="success">
              +{{ scope.row.activityReward || '0' }}
            </el-link>
            <el-link v-if="scope.row.type === '0'" type="danger">
              -{{ scope.row.activityReward || '0' }}
            </el-link>
          </li>
          <li>类型：{{ scope.row.typeName || '-' }}</li>
        </ul>
      </template>
    </ElTableColumn>

    <ElTableColumn label="其他" min-width="120">
      <template #default="scope">
        <ul>
          <li>积分类型：{{ scope.row.activityTypeName || '-' }}</li>
          <li>内容：{{ scope.row.content || '-' }}</li>
        </ul>
      </template>
    </ElTableColumn>

    <DateTableColumn />

    <ProTableActionsColumn :pds="[PD.system.integral.delete]" width="120">
      <template #default="scope">
        <ProTableActionButton
          :pd="PD.system.integral.delete"
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
    doIntegralCreate,
    doIntegralDelete,
    doIntegralUpdate,
    reqActivityConfigList,
    reqDictionaryListType,
    reqIntegralList,
  } from '@/api'
  import { useProDialogForm, useProTable } from '@/components'
  import { PD } from '@/stores'
  import type { Integral } from '@/types'
  import { getKeywordFields, withPagingParams } from '@/utils'

  const props = defineProps({
    modelValue: {
      type: String,
      default: '',
    },
  })

  // 列表
  const [queryMetadata, proTableInstance, handleRequest] = useProTable(
    {
      ...getKeywordFields(),
      activityType: {
        label: '积分类型',
        value: '',
        is: 'form-select',
        options: [],
      },
    },
    async ([currentPage, pageSize], query) => {
      if (props.modelValue) {
        query.createBy = props.modelValue
      }
      const { dataList, total } = await reqIntegralList({ currentPage, pageSize, ...query })
      return [dataList, total]
    },
  )

  const { data: mapOptions } = useAsyncTask(
    async () => {
      const [activityList, activityTypeList] = await Promise.all([
        withPagingParams(reqActivityConfigList)(),
        reqDictionaryListType({ type: DictionaryType.DIC_REWARDS_TYPE }),
      ])
      queryMetadata.activityType.options = activityTypeList
      return { activityList, activityTypeList }
    },
    {
      immediate: true,
      throwError: true,
      initialValue: { activityList: [], activityTypeList: [] },
    },
  )

  // 编辑 or 新增
  const [proDialogFormInstance, handleAddedOrUpdate] = useProDialogForm<Integral>(
    () => ({
      activityReward: {
        label: '积分数',
        value: 0,
        is: 'form-input-number',
        props: {
          min: 0,
        },
        rules: [{ required: true }],
      },
      type: {
        label: '类型',
        value: '',
        is: 'form-radio',
        rules: [{ required: true }],
        options: [
          { label: '消耗', value: '0' },
          { label: '增加', value: '1' },
        ],
      },
      activityType: {
        label: '积分类型',
        value: '14', // 默认系统分配
        is: 'form-select',
        options: [],
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
      },
    }),
    async (metadata, instance, item) => {
      const { modelValue: createBy } = props
      metadata.activityType.options = mapOptions.value.activityTypeList
      await instance.value.show({
        title: item ? '编辑' : '新增',
        metadata,
        request: (params) =>
          item
            ? doIntegralUpdate({ ...item, createBy, ...params })
            : doIntegralCreate({ createBy, ...params }),
      })
      proTableInstance.value.reload()
      ElMessage.success('操作成功')
    },
  )

  // 删除
  const handleDelete = async (item: Integral) => {
    await ElMessageBox.confirm(`确认删除该数据？`)
    const { id } = item
    await doIntegralDelete({ id })
    proTableInstance.value.reload()
    ElMessage.success('操作成功')
  }
</script>
