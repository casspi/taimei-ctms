<template>
  <ProTable :request="handleRequest" :query-metadata="queryMetadata" ref="proTableInstance">
    <template #actions>
      <ProActionButton
        :pd="PD.info.clinicalTrial.added"
        type="primary"
        plain
        icon="Plus"
        @click="handleAddedOrUpdate()"
      >
        新增
      </ProActionButton>
    </template>

    <ElTableColumn type="expand">
      <template #default="scope">
        <ElRow :gutter="20">
          <ElCol :span="12">
            <span>企业</span>
            <span>{{ scope.row.enterpriseName }}</span>
          </ElCol>
          <ElCol :span="12">
            <span>方案号</span>
            <span>{{ scope.row.situationNo }}</span>
          </ElCol>
          <ElCol :span="12">
            <span>NMPA批件号</span>
            <span>{{ scope.row.npmaNo }}</span>
          </ElCol>
          <ElCol :span="12">
            <span>备注</span>
            <span>{{ scope.row.remark }}</span>
          </ElCol>
          <ElCol :span="12">
            <span>患者报名材料</span>
            <span>{{ scope.row.projectEnrollMaterial }}</span>
          </ElCol>
          <ElCol :span="12">
            <span>患者用药标准</span>
            <span>{{ scope.row.projectMedicineStandard }}</span>
          </ElCol>
          <ElCol :span="12">
            <span>试验药组</span>
            <span>{{ scope.row.projectTrialMedicine }}</span>
          </ElCol>
          <ElCol :span="12">
            <span>对照药组</span>
            <span>{{ scope.row.projectContrastMedicine }}</span>
          </ElCol>
          <ElCol :span="12">
            <span>药物介绍</span>
            <span>{{ scope.row.projectMedicineInfo }}</span>
          </ElCol>
          <ElCol :span="12">
            <span>用药介绍</span>
            <span>{{ scope.row.projectMedicineUse }}</span>
          </ElCol>
          <ElCol :span="12">
            <span>简单入排</span>
            <span>{{ scope.row.projectAccessSimple }}</span>
          </ElCol>
          <ElCol :span="12">
            <span>完整入选标准</span>
            <span>{{ scope.row.projectAccessComplete }}</span>
          </ElCol>
          <ElCol :span="12">
            <span>完整排除标准</span>
            <span>{{ scope.row.projectExclusionComplete }}</span>
          </ElCol>
        </ElRow>
      </template>
    </ElTableColumn>

    <ElTableColumn label="基本信息" min-width="120">
      <template #default="scope">
        <ul>
          <li>药物名称：{{ scope.row.projectName || '-' }}</li>
          <li>编号：{{ scope.row.projectNo || '-' }}</li>
          <li>药物分期：{{ scope.row.projectTrialPeriodName || '-' }}</li>
        </ul>
      </template>
    </ElTableColumn>

    <ElTableColumn label="计划信息" min-width="220">
      <template #default="scope">
        <ul>
          <li>计划人数：{{ scope.row.planNum || '-' }}</li>
          <li>计划时间：{{ scope.row.planStartDt }} ~ {{ scope.row.planEndDt }}</li>
          <li>实际时间：{{ scope.row.actualStartDt }} ~ {{ scope.row.actualEndDt }}</li>
        </ul>
      </template>
    </ElTableColumn>

    <ElTableColumn prop="projectStatusName" label="状态" />

    <DateTableColumn />

    <ProTableActionsColumn
      :pds="[PD.info.clinicalTrial.edit, PD.info.clinicalTrial.delete]"
      width="120"
    >
      <template #default="scope">
        <ProTableActionButton
          :pd="PD.info.clinicalTrial.edit"
          link
          type="primary"
          @click="handleAddedOrUpdate(scope.row)"
        >
          编辑
        </ProTableActionButton>
        <ProTableActionButton
          :pd="PD.info.clinicalTrial.delete"
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
    doClinicalTrialCreate,
    doClinicalTrialDelete,
    doClinicalTrialUpdate,
    reqClinicalTrialList,
    reqDictionaryListType,
    reqEnterpriseList,
  } from '@/api'
  import { useProDialogForm, useProTable } from '@/components'
  import { PD } from '@/stores'
  import type { ClinicalTrial } from '@/types'
  import { getKeywordFields, getProvinceAndCityFields, withPagingParams } from '@/utils'

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
      const { dataList, total } = await reqClinicalTrialList({ currentPage, pageSize, ...query })
      return [dataList, total]
    },
  )

  const { data: mapOptions } = useAsyncTask(
    async () => {
      const [status, periods, enterprises] = await Promise.all([
        reqDictionaryListType({
          type: DictionaryType.DIC_PROJECT_STATUS,
        }),
        reqDictionaryListType({
          type: DictionaryType.DIC_PROJECT_PERIOD,
        }),
        withPagingParams(reqEnterpriseList)(),
      ])
      queryMetadata.projectStatus.options = status
      return { status, periods, enterprises }
    },
    {
      immediate: true,
      throwError: true,
      initialValue: { status: [], periods: [], enterprises: [] },
    },
  )

  // 编辑 or 新增
  const [proDialogFormInstance, handleAddedOrUpdate] = useProDialogForm<ClinicalTrial>(
    () => ({
      projectName: {
        label: '药物名称',
        value: '',
        is: 'form-input',
        rules: [{ required: true }],
      },
      projectNo: {
        label: '药物编号',
        value: '',
        is: 'form-input',
        rules: [{ required: true }],
      },
      projectTrialPeriod: {
        label: '药物分期',
        value: '',
        is: 'form-select',
        rules: [{ required: true }],
      },
      enterpriseId: {
        label: '企业',
        value: '',
        is: 'form-select',
        labelKey: 'name',
        valueKey: 'id',
      },
      planNum: {
        label: '计划人数',
        value: '',
        is: 'form-input',
      },
      projectStatus: {
        label: '药物状态',
        value: '',
        is: 'form-select',
        rules: [{ required: true }],
      },
      planTime: {
        label: '计划时间',
        value: [],
        is: 'form-date-picker',
        width: '100%',
        get: (v) => {
          const [planStartDt, planEndDt] = v
          return { planStartDt, planEndDt }
        },
        set: (d, f) => {
          const { planStartDt, planEndDt } = d
          if (planStartDt && planEndDt) {
            f.value = [planStartDt, planEndDt]
          }
        },
        props: {
          type: 'datetimerange',
        },
      },
      actualTime: {
        label: '实际时间',
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
      },
      situationNo: {
        label: '方案号',
        value: '',
        is: 'form-input',
        rules: [{ required: true }],
      },
      npmaNo: {
        label: 'NMPA批件号',
        value: '',
        is: 'form-input',
        rules: [{ required: true }],
      },
      remark: {
        label: '备注',
        value: '',
        is: 'form-input',
        width: '100%',
        props: {
          type: 'textarea',
        },
      },
      projectEnrollMaterial: {
        label: '患者报名材料',
        value: '',
        is: 'form-input',
        width: '100%',
        props: {
          type: 'textarea',
        },
      },
      projectMedicineStandard: {
        label: '患者用药标准',
        value: '',
        is: 'form-input',
        width: '100%',
        props: {
          type: 'textarea',
        },
        rules: [{ required: true }],
      },
      projectTrialMedicine: {
        label: '试验药组',
        value: '',
        is: 'form-input',
      },
      projectContrastMedicine: {
        label: '对照药组',
        value: '',
        is: 'form-input',
      },
      projectMedicineInfo: {
        label: '药物介绍',
        value: '',
        is: 'form-input',
        width: '100%',
        props: {
          type: 'textarea',
        },
      },
      projectMedicineUse: {
        label: '用药介绍',
        value: '',
        is: 'form-input',
        width: '100%',
        props: {
          type: 'textarea',
        },
      },
      projectAccessSimple: {
        label: '简单入排',
        value: '',
        is: 'form-input',
        width: '100%',
        props: {
          type: 'textarea',
        },
      },
      projectAccessComplete: {
        label: '完整入选标准',
        value: '',
        is: 'form-input',
        width: '100%',
        props: {
          type: 'textarea',
        },
      },
      projectExclusionComplete: {
        label: '完整排除标准',
        value: '',
        is: 'form-input',
        width: '100%',
        props: {
          type: 'textarea',
        },
      },
    }),
    async (metadata, instance, item) => {
      metadata.projectStatus.options = mapOptions.value.status
      metadata.projectTrialPeriod.options = mapOptions.value.periods
      metadata.enterpriseId.options = mapOptions.value.enterprises

      await instance.value.show({
        title: item ? '编辑' : '新增',
        metadata,
        request: (params) =>
          item
            ? doClinicalTrialUpdate({ projectId: item.projectId, ...params })
            : doClinicalTrialCreate(params),
      })
      proTableInstance.value.reload()
      ElMessage.success('操作成功')
    },
  )

  // 删除
  const handleDelete = async (item: ClinicalTrial) => {
    await ElMessageBox.confirm(`确认删除该数据？`)
    const { projectId } = item
    await doClinicalTrialDelete({ projectId })
    proTableInstance.value.reload()
    ElMessage.success('操作成功')
  }
</script>
