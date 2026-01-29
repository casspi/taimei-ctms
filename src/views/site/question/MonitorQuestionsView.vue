<template>
  <div class="totals">2222</div>
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
      <ProActionButton type="primary" icon="Plus" @click="handleAdded()"> 新增 </ProActionButton>
      <ProActionButton plain @click="handleDownloadExcel()"> 下载Excel </ProActionButton>
    </template>
    <template #top>
      <ElCheckbox class="view-deleted" v-model="viewDeleted">显示被删除的问题</ElCheckbox>
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
    <QuestionStatusColumn label="问题状态" min-width="130" prop="questionProcess" />
    <ElTableColumn label="问题来源" min-width="130" prop="questionSourceName" />
    <ElTableColumn label="创建者" min-width="150">
      <template #default="scope">
        <ul>
          <li>{{ scope.row.createName }}</li>
          <li>{{ formatDate(scope.row.createTime, 'yyyy-MM-dd hh:mm:ss') }}</li>
        </ul>
      </template>
    </ElTableColumn>

    <ProTableActionsColumn>
      <template #default="scope">
        <ProTableActionButton type="primary" @click="handleUpdate(scope.row)">
          编辑
        </ProTableActionButton>
        <ProTableActionButton type="primary"> 查看 </ProTableActionButton>
      </template>
    </ProTableActionsColumn>
  </ProTable>

  <ProDrawer ref="proDrawerFormRef" />
  <ProDialogForm ref="proDialogFormRef" />
</template>

<script setup lang="ts">
  import { useProDialogForm } from '@camomile.js/components'
  import { formatDate } from '@daysnap/utils'
  import { useAsyncTask } from '@daysnap/vue-use'

  import { reqDictionaryInspectType, reqQuestionList } from '@/api'
  import { useProDrawer, useProTable } from '@/components'
  import { formatEndTime, formatStartTime, hour2dayRemainder, PlanStatusType } from '@/utils'

  import QuestionStatusColumn from './compontents/QuestionStatusColumn.vue'

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
      const { page: pagination } = await reqQuestionList({
        currentPage,
        pageSize,
        viewDeleted: viewDeleted.value,
        ...query,
      })
      return [pagination.rows, pagination.count]
    },
  )

  const viewDeleted = ref(false)
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
  const [proDrawerFormRef, handleAdded] = useProDrawer(
    () => ({
      questionSourceId: {
        label: '问题来源',
        value: '',
        is: 'ElSelect',
        rules: [{ required: true }],
      },
      reportQuestionCategoryId: {
        label: '监查类型',
        value: '',
        is: 'ElSelect',
      },
      r1: {
        label: '监查项',
        value: '',
        is: 'ElSelect',
      },
      r2: {
        label: '问题分类',
        value: '',
        is: 'ElSelect',
        rules: [{ required: true }],
      },
      r3: {
        label: '问题描述',
        value: '',
        is: 'ElInput',
        rules: [{ required: true }],
        props: {
          type: 'textarea',
          autosize: { minRows: 2 },
        },
      },
      r4: {
        label: '受试者',
        value: '',
        is: 'ElSelect',
        rules: [{ required: true }],
      },
      r5: {
        label: '协同责任人',
        value: '',
        is: 'ElInput',
        rules: [{ required: true }],
      },
      r6: {
        label: '发现时间',
        value: '',
        is: 'ElDatePicker',
        rules: [{ required: true }],
      },
      r7: {
        label: '目标解决日期',
        value: '',
        is: 'ElDatePicker',
        props: {
          type: 'datetime',
          disabled: true,
        },
      },
      r8: {
        label: '计划解决日期',
        value: '',
        is: 'ElDatePicker',
        rules: [{ required: true }],
      },
      r9: {
        label: '实际解决日期',
        value: '',
        is: 'ElDatePicker',
      },
    }),
    async (schema, instance, item) => {
      await instance.value.show({
        title: '新增问题',
        schema,
        request: (params) => {
          console.log('params', params)
          return Promise.resolve('1')
        },
      })
      proTableInstance.value.reload()
      ElMessage.success('操作成功')
    },
  )
  // 编辑
  const [proDialogFormRef, handleUpdate] = useProDialogForm(
    () => ({
      projectName: {
        label: '问题来源',
        value: '',
        is: 'ElSelect',
        rules: [{ required: true }],
      },
    }),
    async (schema, instance, item) => {
      await instance.value.show({
        title: '新增问题',
        schema,
        request: (params) => {
          console.log('params', params)
          return Promise.resolve('1')
        },
      })
      proTableInstance.value.reload()
      ElMessage.success('操作成功')
    },
  )
  const handleDownloadExcel = async () => {}
  // 删除
  const handleDelete = async (item: any) => {
    const { projectId } = item
    // await doProjectDelete({ projectId })
    proTableInstance.value.reload()
    ElMessage.success('操作成功')
  }
</script>
<style lang="scss" scoped>
  .totals {
    position: absolute;
    top: -56px;
    right: 0;
    line-height: 40px;
    margin-bottom: 15px;
    width: 40%;
    margin-right: 20px;
  }

  .totals span {
    color: #aeaeae;
  }

  .totals .bold {
    font-size: 16px;
    color: #000;
    padding-left: 10px;
    font-weight: 400;
    padding-right: 10px;
  }

  .totals a {
    color: #000;
  }

  .totals .done {
    color: #108ee9;
  }

  .view-deleted {
    margin-left: auto;
  }
</style>
