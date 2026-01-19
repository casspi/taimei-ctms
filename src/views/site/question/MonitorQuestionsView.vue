<template>
  <ProTable
    :request="handleRequest"
    :query-metadata="queryMetadata"
    ref="proTableInstance"
    :pageSize="40"
    :more-index="3"
    default-expand-all
    stripe
  >
    <template #actions>
      <ProActionButton type="primary" icon="Plus" @click="handleAddedOrUpdate()">
        新增
      </ProActionButton>
      <ProActionButton plain @click="handleAddedOrUpdate()"> 下载Excel </ProActionButton>
    </template>

    <ElTableColumn type="expand">
      <template #default="scope">
        <span>问题描述：{{ scope.row.description }}</span>
      </template>
    </ElTableColumn>
    <ElTableColumn label="问题编号" min-width="125" prop="number" />

    <ElTableColumn label="开放时长" min-width="130">
      <template #default="scope">
        {{ `${scope.row.openDay}天 ${hour2dayRemainder(scope.row.openTime)}` }}
      </template>
    </ElTableColumn>
    <ElTableColumn label="问题分类" min-width="130" prop="reportQuestionCategoryName" />
    <ElTableColumn label="监查项" min-width="200" prop="reportItemName" />
    <ElTableColumn label="监查类型" min-width="130" prop="reportTypeName" />
    <ElTableColumn label="问题状态" min-width="130" prop="questionProcess" />
    <ElTableColumn label="问题来源" min-width="130" prop="questionSourceName" />
    <ElTableColumn label="创建者" min-width="130">
      <template #default="scope">
        <span>
          {{ scope.row.createName }}
        </span>
        <span>{{ scope.row.createTime }}</span>
      </template>
    </ElTableColumn>

    <ProTableActionsColumn>
      <template #default="scope">
        <ProTableActionButton type="primary" @click="handleAddedOrUpdate(scope.row)">
          编辑
        </ProTableActionButton>
        <ProTableActionButton type="primary" @click="handleAddedOrUpdate(scope.row)">
          查看
        </ProTableActionButton>
      </template>
    </ProTableActionsColumn>
  </ProTable>

  <ProDialogForm ref="proDialogFormInstance" />
</template>

<script setup lang="ts">
  import { useAsyncTask } from '@daysnap/vue-use'

  import { reqDictionaryInspectType, reqQuestionList } from '@/api'
  import { useProDialogForm, useProTable } from '@/components'
  import DeleteButton from '@/components/DeleteButton.vue'
  import {
    formatEndTime,
    formatStartTime,
    formatToFixedOneString,
    hour2dayRemainder,
    PlanStatusType,
  } from '@/utils'
  import { PlanStatusTypeValueMap } from '@/utils/constants'

  import DelayInfo from '../components/DelayInfo.vue'
  import PlanCell from '../components/PlanCell.vue'

  // 列表
  const [queryMetadata, proTableInstance, handleRequest] = useProTable(
    {
      questionCategoryIds: {
        is: 'form-select',
        value: '',
        label: '问题分类：',
        labelKey: 'name',
        props: {
          multiple: true,
        },
      },
      queryState: {
        value: '',
        is: 'form-select',
        label: '状态：',
        props: {
          multiple: true,
        },
        options: PlanStatusType,
      },
      delayType: {
        value: '',
        is: 'form-select',
        label: '是否延期：',
        props: {
          multiple: true,
        },
        labelPosition: 'top',
        options: PlanStatusType,
      },
      questionSourceIds: {
        is: 'form-select',
        value: '',
        label: '问题来源：',
        labelKey: 'name',
        props: {
          multiple: true,
          collapseTags: true,
          collapseTagsTooltip: true,
        },
        labelPosition: 'top',
      },

      inspectTypeList: {
        is: 'form-select',
        value: '',
        label: '监查类型：',
        labelKey: 'name',
        props: {
          multiple: true,
          collapseTags: true,
          collapseTagsTooltip: true,
        },
        labelPosition: 'top',
      },
      startTime: {
        label: '发现时间：',
        value: [],
        is: 'form-date-picker',
        width: '100%',
        labelPosition: 'top',
        get: (v) => {
          const [startTimeFirst, startTimeLast] = v
          console.log('startTimeFirst', startTimeFirst, 'startTimeLast', startTimeLast)
          return {
            startTimeFirst: formatStartTime(startTimeFirst),
            startTimeLast: formatEndTime(startTimeLast),
          }
        },
        set: (d: any, f: any) => {
          const { startTimeFirst, startTimeLast } = d
          if (startTimeFirst && startTimeLast) {
            f.value = [startTimeFirst, startTimeLast]
          }
        },
        props: {
          type: 'daterange',
          defaultTime: new Date(2000, 1, 1, 10, 0, 0),
        },
      },
      endTime: {
        label: '解决时间：',
        value: [],
        is: 'form-date-picker',
        width: '100%',
        labelPosition: 'top',
        get: (v) => {
          const [endTimeFirst, endTimeLast] = v
          return {
            endTimeFirst: formatStartTime(endTimeFirst),
            endTimeLast: formatEndTime(endTimeLast),
          }
        },
        set: (d: any, f: any) => {
          const { endTimeFirst, endTimeLast } = d
          if (endTimeFirst && endTimeLast) {
            f.value = [endTimeFirst, endTimeLast]
          }
        },
        props: {
          type: 'daterange',
          defaultTime: new Date(2000, 1, 1, 10, 0, 0),
        },
      },
      description: {
        is: 'form-input',
        value: '',
        label: '描述：',
        labelPosition: 'top',
        props: {
          placeholder: '请输入描述',
        },
      },
    },
    async ([currentPage, pageSize], query) => {
      console.log('query', query)
      const { page: pagination } = await reqQuestionList({ currentPage, pageSize, ...query })
      return [pagination.rows, pagination.count]
    },
  )

  const { data: mapOptions } = useAsyncTask(
    async () => {
      const [inspectTypes] = await Promise.all([reqDictionaryInspectType()])
      console.log('queryMetadata.inspectTypeList', queryMetadata.inspectTypeList, inspectTypes)
      queryMetadata.inspectTypeList.options = inspectTypes
      return { inspectTypes }
    },
    {
      immediate: true,
      throwError: true,
      initialValue: { inspectTypes: [] },
    },
  )

  // 编辑 or 新增
  const [proDialogFormInstance, handleAddedOrUpdate] = useProDialogForm<Project>(
    () => ({
      projectName: {
        label: '项目名称',
        value: '',
        is: 'form-input',
        rules: [{ required: true }],
      },
    }),
    async (metadata, instance, item) => {
      metadata.projectStatus.options = mapOptions.value.status
      metadata.projectType.options = mapOptions.value.types

      // await instance.value.show({
      //   title: item ? '编辑' : '新增',
      //   metadata,
      //   request: (params) =>
      //     item
      //       ? doProjectUpdate({ projectId: item.projectId, ...params })
      //       : doProjectCreate(params),
      // })
      proTableInstance.value.reload()
      ElMessage.success('操作成功')
    },
  )

  // 删除
  const handleDelete = async (item: any) => {
    const { projectId } = item
    // await doProjectDelete({ projectId })
    proTableInstance.value.reload()
    ElMessage.success('操作成功')
  }
</script>
