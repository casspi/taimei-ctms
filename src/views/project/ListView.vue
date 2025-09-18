<template>
  <ProTable :request="handleRequest" :query-metadata="queryMetadata" ref="proTableInstance">
    <template #actions>
      <ProActionButton
        :pd="PD.project.list.added"
        type="primary"
        plain
        icon="Plus"
        @click="handleAddedOrUpdate()"
      >
        新增
      </ProActionButton>
    </template>

    <ElTableColumn label="项目" min-width="200">
      <template #default="scope">
        <ul>
          <li>{{ scope.row.projectName || '-' }}</li>
          <li>编号：{{ scope.row.projectNo || '-' }}</li>
          <li>类型：{{ scope.row.projectTypeName || '-' }}</li>
          <li>开始时间：{{ scope.row.actualStartDt || '-' }}</li>
          <li>结束时间：{{ scope.row.actualEndDt || '-' }}</li>
        </ul>
      </template>
    </ElTableColumn>

    <ElTableColumn label="负责人" min-width="200">
      <template #default="scope">
        <ul>
          <li>姓名：{{ scope.row.projectOwnerName || '-' }}</li>
          <li>电话：{{ scope.row.contactPhone || '-' }}</li>
          <li>备注：{{ scope.row.remark || '-' }}</li>
        </ul>
      </template>
    </ElTableColumn>

    <DistrictTableColumn />

    <ElTableColumn prop="projectStatusName" label="状态">
      <template #default="scope">
        <ElTag :type="statusTypes[scope.row.projectStatus]">
          {{ scope.row.projectStatusName }}
        </ElTag>
      </template>
    </ElTableColumn>

    <DateTableColumn />

    <ProTableActionsColumn>
      <template #default="scope">
        <ProTableActionButton
          :pd="PD.project.fileTemplate.list"
          type="primary"
          @click="handleProjectFileTemplateTable(scope.row)"
        >
          文件管理
        </ProTableActionButton>
        <ProTableActionButton
          :pd="PD.project.medicalComputation.list"
          type="primary"
          @click="handleJoinMemberTable(scope.row)"
        >
          申请管理
        </ProTableActionButton>
        <ProTableActionButton
          :pd="PD.project.subsidy.list"
          type="primary"
          @click="handleProjectSubsidyTable(scope.row)"
        >
          补助管理
        </ProTableActionButton>
        <ProTableActionButton
          :pd="PD.project.list.edit"
          type="primary"
          @click="handleAddedOrUpdate(scope.row)"
        >
          编辑
        </ProTableActionButton>
        <ProTableActionButton
          type="success"
          @click="handleH5Preview(`project/${scope.row.projectId}`)"
        >
          预览
        </ProTableActionButton>
        <ProTableActionButton
          :pd="PD.project.list.delete"
          type="danger"
          @click="handleDelete(scope.row)"
        >
          删除
        </ProTableActionButton>
      </template>
    </ProTableActionsColumn>
  </ProTable>

  <ProDialogForm ref="proDialogFormInstance" />

  <ProH5Preview ref="proH5PreviewInstance" />
</template>

<script setup lang="ts">
  import { useAsyncTask } from '@daysnap/vue-use'

  import {
    DictionaryType,
    doProjectCreate,
    doProjectDelete,
    doProjectUpdate,
    reqDictionaryListType,
    reqProjectList,
  } from '@/api'
  import { useProDialogForm, useProH5Preview, useProTable } from '@/components'
  import { PD } from '@/stores'
  import type { Project } from '@/types'
  import { getKeywordFields, getProvinceAndCityFields } from '@/utils'

  import { useJoinMemberTable } from './useJoinMemberTable'
  import { useProjectFileTemplateTable } from './useProjectFileTemplateTable'
  import { useProjectSubsidyTable } from './useProjectSubsidyTable'

  const statusTypes = ['info', 'warning', 'success', 'danger'] as const

  // 预览
  const [proH5PreviewInstance, handleH5Preview] = useProH5Preview()

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
      const { dataList, total } = await reqProjectList({ currentPage, pageSize, ...query })
      return [dataList, total]
    },
  )

  const { data: mapOptions } = useAsyncTask(
    async () => {
      const [types, status] = await Promise.all([
        reqDictionaryListType({
          type: DictionaryType.DIC_PROJECT_TYPE,
        }),
        reqDictionaryListType({
          type: DictionaryType.DIC_PROJECT_STATUS,
        }),
      ])
      queryMetadata.projectStatus.options = status
      return { types, status }
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

      await instance.value.show({
        title: item ? '编辑' : '新增',
        metadata,
        request: (params) =>
          item
            ? doProjectUpdate({ projectId: item.projectId, ...params })
            : doProjectCreate(params),
      })
      proTableInstance.value.reload()
      ElMessage.success('操作成功')
    },
  )

  // 申请者管理
  const [, handleJoinMemberTable] = useJoinMemberTable({
    instance: proDialogFormInstance,
  })

  // 项目文件模板管理
  const [, handleProjectFileTemplateTable] = useProjectFileTemplateTable({
    instance: proDialogFormInstance,
  })

  // 项目补助管理
  const [, handleProjectSubsidyTable] = useProjectSubsidyTable({
    instance: proDialogFormInstance,
  })

  // 删除
  const handleDelete = async (item: Project) => {
    await ElMessageBox.confirm(`确认删除该数据？`)
    const { projectId } = item
    await doProjectDelete({ projectId })
    proTableInstance.value.reload()
    ElMessage.success('操作成功')
  }
</script>
