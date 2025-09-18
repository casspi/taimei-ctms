<template>
  <ProTable :request="handleRequest" :query-metadata="queryMetadata" ref="proTableInstance">
    <template #actions>
      <ProActionButton
        :pd="PD.personnel.doctor.added"
        type="primary"
        plain
        icon="Plus"
        @click="handleAddedOrUpdate()"
      >
        新增
      </ProActionButton>
    </template>

    <ElTableColumn label="医生信息" min-width="120">
      <template #default="scope">
        <ul>
          <li>姓名：{{ scope.row.name || '-' }}</li>
          <li>手机号：{{ scope.row.phone || '-' }}</li>
          <li>证书编号：{{ scope.row.certificateNo || '-' }}</li>
          <li>发证机关：{{ scope.row.issueAuthority || '-' }}</li>
          <li>发证日期：{{ scope.row.issueDt || '-' }}</li>
          <li>类型：{{ scope.row.type === '1' ? '站内' : '站外' }}</li>
        </ul>
      </template>
    </ElTableColumn>

    <ElTableColumn label="职位信息" min-width="120">
      <template #default="scope">
        <ul>
          <li>医院：{{ scope.row.hospitalName || '-' }}</li>
          <li>科室/部门：{{ scope.row.department || '-' }}</li>
          <li>职称：{{ scope.row.jobTitleName || '-' }}</li>
          <li>职位描述：{{ scope.row.job || '-' }}</li>
          <li>工作安排：{{ scope.row.jobPlan || '-' }}</li>
          <li>备注：{{ scope.row.remark || '-' }}</li>
        </ul>
      </template>
    </ElTableColumn>

    <ElTableColumn label="审核" width="220">
      <template #default="scope">
        <ul>
          <li>状态： {{ scope.row.statusName || scope.row.status }}</li>
          <li>审核人：{{ scope.row.checkByName || '-' }}</li>
          <li>审核时间：{{ scope.row.checkDt || '-' }}</li>
          <li>审核意见：{{ scope.row.checkRemark || '-' }}</li>
        </ul>
      </template>
    </ElTableColumn>

    <DateTableColumn />

    <ProTableActionsColumn
      :pds="[PD.personnel.doctor.edit, PD.personnel.doctor.delete]"
      width="150"
    >
      <template #default="scope">
        <ProTableActionButton
          :pd="PD.personnel.doctor.edit"
          link
          type="primary"
          @click="handleAddedOrUpdate(scope.row)"
        >
          编辑
        </ProTableActionButton>
        <ProTableActionButton
          :pd="PD.personnel.doctor.delete"
          link
          type="danger"
          @click="handleDelete(scope.row)"
        >
          删除
        </ProTableActionButton>
        <ProTableActionButton
          :pd="PD.personnel.doctor.check"
          link
          type="warning"
          @click="handleExamine(scope.row)"
        >
          审核
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
    doDoctorCheck,
    doDoctorCreate,
    doDoctorDelete,
    doDoctorUpdate,
    reqDictionaryListType,
    reqDoctorList,
    reqUserByRoleType,
    RoleType,
  } from '@/api'
  import { useProDialogForm, useProTable } from '@/components'
  import { PD } from '@/stores'
  import type { Doctor } from '@/types'
  import { getKeywordFields } from '@/utils'

  // 列表
  const [queryMetadata, proTableInstance, handleRequest] = useProTable(
    {
      ...getKeywordFields(),
      name: {
        is: 'form-input',
        value: '',
        label: '医生姓名',
      },
      status: {
        is: 'form-select',
        value: '',
        label: '审核状态',
        options: [],
      },
    },
    async ([currentPage, pageSize], query) => {
      const { dataList, total } = await reqDoctorList({ currentPage, pageSize, ...query })
      return [dataList, total]
    },
  )

  const { data: mapOptions } = useAsyncTask(
    async () => {
      const [hospitals, jobs, users, status] = await Promise.all([
        reqDictionaryListType({ type: DictionaryType.DIC_HOSPITAL }),
        reqDictionaryListType({ type: DictionaryType.DIC_DOCTOR_JOB }),
        reqUserByRoleType({ roleId: RoleType.DOCTOR }),
        reqDictionaryListType({ type: DictionaryType.DIC_DOCTOR_STATUS }),
      ])
      queryMetadata.status.options = status
      return { hospitals, users, jobs, status }
    },
    {
      immediate: true,
      throwError: true,
      initialValue: { hospitals: [], users: [], jobs: [], status: [] },
    },
  )

  // 编辑 or 新增
  const [proDialogFormInstance, handleAddedOrUpdate] = useProDialogForm<Doctor>(
    () => ({
      loginId: {
        label: '用户',
        value: '',
        is: 'form-select',
        options: [],
        rules: [{ required: true }],
      },
      certificateNo: {
        label: '证书编号',
        value: '',
        is: 'form-input',
        rules: [{ required: true }],
      },
      issueAuthority: {
        label: '发证机关',
        value: '',
        is: 'form-input',
        rules: [{ required: true }],
      },
      issueDt: {
        label: '发证日期',
        value: '',
        is: 'form-date-picker',
        rules: [{ required: true }],
      },
      hospitalId: {
        label: '所属医院',
        value: '',
        is: 'form-select',
        options: [],
        rules: [{ required: true }],
      },
      department: {
        label: '科室/部门',
        value: '',
        is: 'form-input',
      },
      jobTitle: {
        label: '职称',
        value: '',
        is: 'form-select',
        options: [],
      },
      status: {
        label: '状态',
        value: '',
        is: 'form-radio',
        rules: [{ required: true }],
      },
      job: {
        label: '职位描述',
        value: '',
        is: 'form-input',
        width: '100%',
        props: {
          type: 'textarea',
        },
      },
      jobPlan: {
        label: '工作安排',
        value: '',
        is: 'form-input',
        width: '100%',
        props: {
          type: 'textarea',
        },
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
    }),
    async (metadata, instance, item) => {
      metadata.hospitalId.options = mapOptions.value.hospitals
      metadata.loginId.options = mapOptions.value.users
      metadata.jobTitle.options = mapOptions.value.jobs
      metadata.status.options = mapOptions.value.status

      await instance.value.show({
        title: item ? '编辑' : '新增',
        metadata,
        request: (params) =>
          item
            ? doDoctorUpdate({ loginId: item.loginId, type: '1', ...params })
            : doDoctorCreate(params),
      })
      proTableInstance.value.reload()
      ElMessage.success('操作成功')
    },
  )

  // 审核
  const [, handleExamine] = useProDialogForm<Doctor>(
    () => ({
      loginId: {
        label: '用户',
        value: '',
        is: 'form-select',
        options: [],
        props: {
          disabled: true,
        },
      },
      certificateNo: {
        label: '证书编号',
        value: '',
        is: 'form-input',
        props: {
          disabled: true,
        },
      },
      issueAuthority: {
        label: '发证机关',
        value: '',
        is: 'form-input',
        props: {
          disabled: true,
        },
      },
      issueDt: {
        label: '发证日期',
        value: '',
        is: 'form-date-picker',
        props: {
          disabled: true,
        },
      },
      hospitalId: {
        label: '所属医院',
        value: '',
        is: 'form-select',
        options: [],
        props: {
          disabled: true,
        },
      },
      department: {
        label: '科室/部门',
        value: '',
        is: 'form-input',
        props: {
          disabled: true,
        },
      },
      jobTitle: {
        label: '职称',
        value: '',
        is: 'form-select',
        options: [],
        props: {
          disabled: true,
        },
      },
      job: {
        label: '职位描述',
        value: '',
        is: 'form-input',
        width: '100%',
        props: {
          disabled: true,
          type: 'textarea',
        },
      },
      jobPlan: {
        label: '工作安排',
        value: '',
        is: 'form-input',
        width: '100%',
        props: {
          disabled: true,
          type: 'textarea',
        },
      },
      status: {
        label: '状态',
        value: '',
        is: 'form-radio',
        rules: [{ required: true }],
      },
      checkRemark: {
        label: '审核意见',
        value: '',
        is: 'form-input',
        width: '100%',
        props: {
          type: 'textarea',
        },
      },
    }),
    async (metadata, _, item) => {
      if (!item) return

      metadata.status.options = mapOptions.value.status

      await proDialogFormInstance.value.show({
        title: '审核',
        metadata,
        request: (params) => doDoctorCheck({ loginId: item!.loginId, ...params }),
      })
      proTableInstance.value.reload()
      ElMessage.success('操作成功')
    },
  )

  // 删除
  const handleDelete = async (item: Doctor) => {
    await ElMessageBox.confirm(`确认删除该数据？`)
    const { loginId } = item
    await doDoctorDelete({ loginId })
    proTableInstance.value.reload()
    ElMessage.success('操作成功')
  }
</script>
