<template>
  <ProTable
    class="c-table-fixed-height"
    :request="handleRequest"
    :query-metadata="queryMetadata"
    ref="proTableInstance"
  >
    <template #actions>
      <ProActionButton type="primary" icon="Plus" @click="handleAddedOrUpdate()">
        新增
      </ProActionButton>
      <ProActionButton plain @click="handleAddedOrUpdate()"> 下载Excel </ProActionButton>
    </template>

    <ElTableColumn label="报告" width="190">
      <template #default="scope">
        <PlanCell :data="scope.row" />
      </template>
    </ElTableColumn>

    <ElTableColumn label="监查员" width="130" prop="inspect_user" />
    <ElTableColumn label="监查次数" width="130" prop="visit_number" />
    <ElTableColumn
      label="监查时长(h)"
      width="150"
      prop="real_duration_hour"
      :formatter="(row) => formatToFixedOneString(row.real_duration_hour)"
    />
    <DateTableColumn
      label="预期监查时间"
      width="190"
      :filters="[
        { text: '开始时间顺序', value: '1' },
        { text: '开始时间倒序', value: '2' },
        { text: '结束时间顺序', value: '3' },
        { text: '结束时间倒序', value: '4' },
      ]"
      :filter-multiple="true"
    />
    <DateTableColumn
      label="实际监查时间"
      :keys="['real_start_time', 'real_end_time']"
      width="190"
      :filters="[
        { text: '开始时间顺序', value: '1' },
        { text: '开始时间倒序', value: '2' },
        { text: '结束时间顺序', value: '3' },
        { text: '结束时间倒序', value: '4' },
      ]"
      :filter-multiple="true"
    />
    <DateTableColumn
      width="250"
      label="执行情况"
      :keys="['report_submit_date', 'report_finalize_date']"
      use-raw
    >
      <template #default="{ row }">
        <li>
          目标提交 {{ row.report_submit_date }}
          <span v-if="row.submit_late_case" class="c-tag-warning">提交延时</span>
        </li>
        <li>
          目标定稿 {{ row.report_finalize_date }}
          <span v-if="row.finalize_late_case" class="c-tag-warning">定稿延时</span>
        </li>
      </template>
    </DateTableColumn>

    <AuditTableColumn label="审批状态" />

    <ProTableActionsColumn>
      <template #default="scope">
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
          v-if="scope.row.buttons.includes('submit_btn')"
          type="primary"
          @click="handleAddedOrUpdate(scope.row)"
        >
          提交
        </ProTableActionButton>
        <ProTableActionButton type="primary" @click="handleAddedOrUpdate(scope.row)">
          痕迹
        </ProTableActionButton>
      </template>
    </ProTableActionsColumn>
  </ProTable>

  <ProDialogForm ref="proDialogFormInstance" />
</template>

<script setup lang="ts">
  import { useAsyncTask } from '@daysnap/vue-use'

  import { reqInspectReportList } from '@/api'
  import { useProDialogForm, useProTable } from '@/components'
  import { PD } from '@/stores'
  import { formatToFixedOneString, getKeywordFields, getProvinceAndCityFields } from '@/utils'

  import PlanCell from '../components/PlanCell.vue'

  const statusTypes = ['info', 'warning', 'success', 'danger'] as const

  // 列表
  const [queryMetadata, proTableInstance, handleRequest] = useProTable(
    {
      ...getKeywordFields(),
      projectName: {
        is: 'form-input',
        value: '',
        label: '项目名称',
      },
      provinceAndCity: getProvinceAndCityFields({ query: true }),
      projectStatus: {
        value: '',
        is: 'form-select',
        label: '项目状态',
      },
    },
    async ([currentPage, pageSize], query) => {
      const { pagination } = await reqInspectReportList()
      return [pagination.rows, pagination.count]
    },
  )

  const { data: mapOptions } = useAsyncTask(
    async () => {
      return { types: [], status: [] }
    },
    {
      immediate: true,
      throwError: true,
      initialValue: { types: [], status: [] },
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
  const handleDelete = async (item: Project) => {
    await ElMessageBox.confirm(`确认删除该数据？`)
    const { projectId } = item
    // await doProjectDelete({ projectId })
    proTableInstance.value.reload()
    ElMessage.success('操作成功')
  }
</script>
