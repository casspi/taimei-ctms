<template>
  <ProTable
    :request="handleRequest"
    :query-metadata="queryMetadata"
    ref="proTableInstance"
    :pageSize="40"
    :more-index="2"
  >
    <template #actions>
      <ProActionButton type="primary" icon="Plus" @click="handleAddedOrUpdate()">
        新增
      </ProActionButton>
      <ProActionButton plain @click="handleAddedOrUpdate()"> 下载Excel </ProActionButton>
    </template>

    <ElTableColumn label="计划" min-width="260">
      <template #default="scope">
        <PlanCell :data="scope.row" />
      </template>
    </ElTableColumn>

    <ElTableColumn label="监查员" min-width="130" prop="inspect_user" />
    <ElTableColumn label="监查次数" min-width="130" prop="visit_number" />
    <ElTableColumn
      label="监查时长(h)"
      min-width="130"
      prop="real_duration_hour"
      :formatter="(row) => formatToFixedOneString(row.real_duration_hour)"
    />
    <DateTableColumn
      label="时间"
      min-width="180"
      :filters="[
        { text: '开始时间顺序', value: '1' },
        { text: '开始时间倒序', value: '2' },
        { text: '结束时间顺序', value: '3' },
        { text: '结束时间倒序', value: '4' },
      ]"
      :filter-multiple="true"
    />
    <ElTableColumn label="监查状态" min-width="130" prop="report_status_name" />

    <ElTableColumn label="执行延期" min-width="130">
      <template #default="scope">
        <span class="c-flex-center">
          {{ scope.row.real_lase_case }}
          <DelayInfo :row="scope.row" />
        </span>
      </template>
    </ElTableColumn>

    <AuditTableColumn
      label="审批状态"
      auditKey="plan_status"
      auditCode="plan_status_code"
      :dicMap="PlanStatusTypeValueMap"
      min-width="150"
    />

    <ProTableActionsColumn>
      <template #default="scope">
        <ProTableActionButton
          v-if="scope.row.buttons.includes('view_btn')"
          type="primary"
          @click="handleAddedOrUpdate(scope.row)"
        >
          查看
        </ProTableActionButton>

        <ProTableActionButton
          v-if="scope.row.buttons.includes('edit_btn')"
          type="primary"
          @click="handleAddedOrUpdate(scope.row)"
        >
          编辑
        </ProTableActionButton>
        <DeleteButton
          v-if="scope.row.buttons.includes('delete_btn')"
          type="primary"
          @delete="handleDelete(scope.row)"
        />
        <ProTableActionButton
          v-if="scope.row.buttons.includes('submit_btn')"
          type="primary"
          @click="handleAddedOrUpdate(scope.row)"
        >
          提交
        </ProTableActionButton>
        <ProTableActionButton
          v-if="scope.row.buttons.includes('viewReport_btn')"
          type="primary"
          @click="handleAddedOrUpdate(scope.row)"
        >
          查看报告
        </ProTableActionButton>
        <ProTableActionButton
          v-if="scope.row.buttons.includes('writeReport_btn')"
          type="primary"
          @click="handleAddedOrUpdate(scope.row)"
        >
          撰写报告
        </ProTableActionButton>
        <ProTableActionButton
          v-if="scope.row.buttons.includes('blankReport_btn')"
          type="primary"
          @click="handleAddedOrUpdate(scope.row)"
        >
          查看空白报告
        </ProTableActionButton>

        <ProTableActionButton
          v-if="scope.row.buttons.includes('export_btn')"
          type="primary"
          @click="handleAddedOrUpdate(scope.row)"
        >
          导出
        </ProTableActionButton>
      </template>
    </ProTableActionsColumn>
  </ProTable>

  <ProDialogForm ref="proDialogFormInstance" />
</template>

<script setup lang="ts">
  import { useAsyncTask } from '@daysnap/vue-use'

  import { reqDictionaryInspectType, reqInspectList } from '@/api'
  import { useProDialogForm, useProTable } from '@/components'
  import DeleteButton from '@/components/DeleteButton.vue'
  import { formatToFixedOneString, getProvinceAndCityFields, PlanStatusType } from '@/utils'
  import { PlanStatusTypeValueMap } from '@/utils/constants'

  import DelayInfo from '../components/DelayInfo.vue'
  import PlanCell from '../components/PlanCell.vue'

  // 列表
  const [queryMetadata, proTableInstance, handleRequest] = useProTable(
    {
      inspectTypeList: {
        is: 'form-select',
        value: '',
        label: '监查类型：',
        labelKey: 'name',
        props: {
          multiple: true,
        },
      },
      states: {
        value: '',
        is: 'form-select',
        label: '审批状态：',
        props: {
          multiple: true,
        },
        options: PlanStatusType,
      },
      startTime: {
        label: '预期开始时间：',
        value: [],
        is: 'form-date-picker',
        width: '100%',
        get: (v) => {
          const [startTimeFirst, startTimeLast] = v
          return { startTimeFirst, startTimeLast }
        },
        set: (d, f) => {
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
        label: '预期结束时间：',
        value: [],
        is: 'form-date-picker',
        width: '100%',
        get: (v) => {
          const [endTimeFirst, endTimeLast] = v
          return { endTimeFirst, endTimeLast }
        },
        set: (d, f) => {
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
    },
    async ([currentPage, pageSize], query) => {
      const { pagination } = await reqInspectList({ currentPage, pageSize, ...query })
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
      projectNo: {
        label: '项目编号',
        value: '',
        is: 'form-input',
        rules: [{ required: true }],
      },
      projectType: {
        label: '项目类型',
        value: '',
        is: 'form-select',
        rules: [{ required: true }],
      },
      projectStatus: {
        label: '项目状态',
        value: '',
        is: 'form-select',
        rules: [{ required: true }],
      },
      actualTime: {
        label: '项目时间',
        value: [],
        is: 'form-date-picker',
        width: '100%',
        get: (v) => {
          const [actualStartDt, actualEndDt] = v
          return { actualStartDt, actualEndDt }
        },
        set: (d, f) => {
          const { actualStartDt, actualEndDt } = d
          if (actualStartDt && actualEndDt) {
            f.value = [actualStartDt, actualEndDt]
          }
        },
        props: {
          type: 'datetimerange',
        },
        rules: [{ required: true }],
      },
      projectOwnerName: {
        label: '项目负责人',
        value: '',
        is: 'form-input',
        rules: [{ required: true }],
      },
      contactPhone: {
        label: '联系方式',
        value: '',
        is: 'form-input',
        rules: [{ required: true }],
      },
      provinceAndCity: getProvinceAndCityFields(),
      projectDescription: {
        label: '项目背景',
        value: '',
        is: 'form-tinymce',
        rules: [{ required: true }],
      },
      context: {
        label: '项目内容',
        value: '',
        is: 'form-tinymce',
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
