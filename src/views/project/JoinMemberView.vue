<template>
  <ProTable :request="handleRequest" :query-metadata="queryMetadata" ref="proTableInstance">
    <template #actions>
      <ProActionButton
        :pd="PD.project.medicalComputation.export"
        type="primary"
        :loading="loading"
        plain
        @click="handleDownload(true)"
      >
        导出全部
      </ProActionButton>
      <ProActionButton
        :pd="PD.project.medicalComputation.export"
        type="primary"
        :loading="loading"
        :disabled="!selected.length"
        plain
        @click="handleDownload(false)"
      >
        导出
      </ProActionButton>
    </template>

    <ElTableColumn type="expand">
      <template #default="scope">
        <ElRow :gutter="20">
          <ElCol :span="12">
            <span>联系人1及与患者关系</span>
            <span>{{ scope.row.emergencyContact || '-' }}</span>
          </ElCol>
          <ElCol :span="12">
            <span>联系人1联系方式</span>
            <span>{{ scope.row.emergencyContactPhone || '-' }}</span>
          </ElCol>
          <ElCol :span="12">
            <span>联系人2及与患者关系</span>
            <span>{{ scope.row.emergencyContactBak || '-' }}</span>
          </ElCol>
          <ElCol :span="12">
            <span>联系人2联系方式</span>
            <span>{{ scope.row.emergencyContactPhoneBak || '-' }}</span>
          </ElCol>
          <ElCol :span="12">
            <span>身份证照</span>
            <template v-if="scope.row.idNumberPhotoPathList?.length">
              <ElImage
                v-for="(item, index) in scope.row.idNumberPhotoPathList"
                :key="index"
                class="c-img-preview-inline"
                :src="item"
                :initial-index="index"
                :preview-src-list="scope.row.idNumberPhotoPathList"
                fit="cover"
                preview-teleported
              />
            </template>
          </ElCol>
          <ElCol :span="12">
            <span>监护人照片</span>
            <template v-if="scope.row.guardianPathList?.length">
              <ElImage
                v-for="(item, index) in scope.row.guardianPathList"
                :key="index"
                class="c-img-preview-inline"
                :src="item"
                :initial-index="index"
                :preview-src-list="scope.row.guardianPathList"
                fit="cover"
                preview-teleported
              />
            </template>
          </ElCol>
          <ElCol :span="12">
            <span>诊断证明</span>
            <template v-if="scope.row.diagnosisCertificatePathList?.length">
              <ElImage
                v-for="(item, index) in scope.row.diagnosisCertificatePathList"
                :key="index"
                class="c-img-preview-inline"
                :src="item"
                :initial-index="index"
                :preview-src-list="scope.row.diagnosisCertificatePathList"
                fit="cover"
                preview-teleported
              />
            </template>
          </ElCol>
          <ElCol :span="12">
            <span>经济情况证明</span>
            <template v-if="scope.row.economicSituationPathList?.length">
              <ElImage
                v-for="(item, index) in scope.row.economicSituationPathList"
                :key="index"
                class="c-img-preview-inline"
                :src="item"
                :initial-index="index"
                :preview-src-list="scope.row.economicSituationPathList"
                fit="cover"
                preview-teleported
              />
            </template>
          </ElCol>
          <ElCol :span="12">
            <span>项目知情同意书</span>
            <template v-if="scope.row.informedConsentFormPathList?.length">
              <ElImage
                v-for="(item, index) in scope.row.informedConsentFormPathList"
                :key="index"
                class="c-img-preview-inline"
                :src="item"
                :initial-index="index"
                :preview-src-list="scope.row.informedConsentFormPathList"
                fit="cover"
                preview-teleported
              />
            </template>
          </ElCol>
        </ElRow>
      </template>
    </ElTableColumn>

    <ElTableColumn type="selection" width="55" />

    <ElTableColumn label="申请人基本信息" min-width="120">
      <template #default="scope">
        <ul>
          <li>{{ scope.row.projectName }}</li>
          <li>患者姓名：{{ scope.row.name || '-' }}</li>
          <li>联系方式：{{ scope.row.contactPhone || '-' }}</li>
          <li>性别：{{ scope.row.sexName || '-' }}</li>
          <li>身份证号：{{ scope.row.idNumber || '-' }}</li>
          <li>籍贯：{{ scope.row.nativePlace || '-' }}</li>
        </ul>
      </template>
    </ElTableColumn>

    <ElTableColumn label="申请人其他信息" min-width="120">
      <template #default="scope">
        <ul>
          <li>疾病：{{ scope.row.diseaseName || '-' }}</li>
          <li>出生日期：{{ scope.row.birthDt || '-' }}</li>
          <li>婚姻状况：{{ scope.row.maritalStatusName || '-' }}</li>
          <li>微信号：{{ scope.row.wechatId || '-' }}</li>
          <li>
            省市区：{{ scope.row.provinceName || '-' }} / {{ scope.row.cityName || '-' }} /
            {{ scope.row.areaIdName || '-' }}
          </li>
          <li>现居住地址：{{ scope.row.address || '-' }}</li>
        </ul>
      </template>
    </ElTableColumn>

    <ElTableColumn label="审核" width="220">
      <template #default="scope">
        <ul>
          <li>审核状态：{{ scope.row.statusName || '-' }}</li>
          <li>审核时间：{{ scope.row.checkDt || '-' }}</li>
          <li>审核备注：{{ scope.row.remark || '-' }}</li>
        </ul>
      </template>
    </ElTableColumn>

    <DateTableColumn>
      <template #default="scope">
        <li>创建人：{{ scope.row.createByName || '-' }}</li>
      </template>
    </DateTableColumn>

    <ProTableActionsColumn width="120">
      <template #default="scope">
        <ProTableActionButton
          :pd="PD.project.medicalComputation.check"
          link
          type="warning"
          @click="handleCheck(scope.row)"
        >
          审核
        </ProTableActionButton>
        <ProTableActionButton
          :pd="PD.project.medicalComputation.delete"
          link
          type="danger"
          @click="handleDelete(scope.row)"
        >
          删除
        </ProTableActionButton>
        <ProTableActionButton
          :pd="PD.system.integral.list"
          type="primary"
          @click="handleIntegralTable(scope.row)"
        >
          积分管理
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
    doJoinMemberCheck,
    doJoinMemberDelete,
    doProjectJoinMemberDownload,
    reqDictionaryListType,
    reqJoinMemberList,
  } from '@/api'
  import { useProDialogForm, useProTable } from '@/components'
  import { multipleSelectionKey } from '@/components/ProTableList/selection'
  import { PD } from '@/stores'
  import type { JoinMember } from '@/types'
  import { getKeywordFields } from '@/utils'

  import { useIntegralTable } from './useIntegralTable'

  const props = defineProps({
    modelValue: {
      type: String,
      default: '',
    },
  })

  // 列表
  let queryParams = {}
  const [queryMetadata, proTableInstance, handleRequest] = useProTable(
    {
      ...getKeywordFields(),
      status: {
        is: 'form-select',
        value: '',
        label: '审核状态',
      },
    },
    async ([currentPage, pageSize], query) => {
      if (props.modelValue) {
        query.projectId = props.modelValue
      }
      const { dataList, total } = await reqJoinMemberList({ currentPage, pageSize, ...query })
      queryParams = query
      return [dataList, total]
    },
  )

  const { data: mapOptions } = useAsyncTask(
    async () => {
      const [status] = await Promise.all([
        reqDictionaryListType({ type: DictionaryType.DIC_PROJECT_MEMBER_STATUS }),
      ])
      queryMetadata.status.options = status
      return { status }
    },
    {
      throwError: true,
      immediate: true,
      initialValue: { status: [] },
    },
  )

  // 审核
  const [proDialogFormInstance, handleCheck] = useProDialogForm<JoinMember>(
    () => ({
      name: {
        label: '患者姓名',
        value: '',
        is: 'form-input',
        props: {
          disabled: true,
        },
      },
      sexName: {
        label: '性别',
        value: '',
        is: 'form-input',
        props: {
          disabled: true,
        },
      },
      birthDt: {
        label: '出生日期',
        value: '',
        is: 'form-input',
        props: {
          disabled: true,
        },
      },
      idNumber: {
        label: '身份证号',
        value: '',
        is: 'form-input',
        props: {
          disabled: true,
        },
      },
      idNumberPhotoPathList: {
        label: '身份证号照片',
        value: '',
        is: 'form-image-upload',
        width: '100%',
        props: {
          disabled: true,
        },
      },
      nativePlace: {
        label: '籍贯',
        value: '',
        is: 'form-input',
        props: {
          disabled: true,
        },
      },
      maritalStatusName: {
        label: '婚姻状况',
        value: '',
        is: 'form-input',
        props: {
          disabled: true,
        },
      },
      address: {
        label: '现居住地址',
        value: '',
        is: 'form-input',
        props: {
          disabled: true,
        },
      },
      contactPhone: {
        label: '联系方式',
        value: '',
        is: 'form-input',
        props: {
          disabled: true,
        },
      },
      wechatId: {
        label: '微信号',
        value: '',
        is: 'form-input',
        props: {
          disabled: true,
        },
      },
      emergencyContact: {
        label: '联系人1',
        value: '',
        is: 'form-input',
        props: {
          disabled: true,
        },
      },
      emergencyContactPhone: {
        label: '联系人1联系方式',
        value: '',
        is: 'form-input',
        props: {
          disabled: true,
        },
      },
      emergencyContactBak: {
        label: '联系人2',
        value: '',
        is: 'form-input',
        props: {
          disabled: true,
        },
      },
      emergencyContactPhoneBak: {
        label: '联系人2联系方式',
        value: '',
        is: 'form-input',
        props: {
          disabled: true,
        },
      },
      diseaseName: {
        label: '疾病',
        value: '',
        is: 'form-input',
        props: {
          disabled: true,
        },
      },
      guardianPathList: {
        label: '监护人照片',
        value: '',
        is: 'form-image-upload',
        width: '100%',
        props: {
          disabled: true,
        },
      },
      diagnosisCertificatePathList: {
        label: '诊断证明',
        value: '',
        is: 'form-image-upload',
        width: '100%',
        props: {
          disabled: true,
        },
      },
      economicSituationPathList: {
        label: '经济情况证明',
        value: '',
        is: 'form-image-upload',
        width: '100%',
        props: {
          disabled: true,
        },
      },
      informedConsentFormPathList: {
        label: '项目知情同意书',
        value: '',
        is: 'form-image-upload',
        width: '100%',
        props: {
          disabled: true,
        },
      },
      status: {
        label: '审核状态',
        value: '',
        is: 'form-select',
        rules: [{ required: true, message: '请选择状态' }],
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
      if (!item) {
        return
      }

      metadata.status.options = mapOptions.value.status

      const { id } = item

      await instance.value.show({
        title: '审核',
        metadata,
        request: ({ remark, status }) => doJoinMemberCheck({ id, remark, status }),
      })
      proTableInstance.value.reload()
      ElMessage.success('操作成功')
    },
  )

  // 删除
  const handleDelete = async (item: JoinMember) => {
    await ElMessageBox.confirm(`确认删除该数据？`)
    const { id } = item
    await doJoinMemberDelete({ id })
    proTableInstance.value.reload()
    ElMessage.success('操作成功')
  }

  const selected = ref<any[]>([])
  provide(multipleSelectionKey, selected)
  const { loading, trigger: handleDownload } = useAsyncTask(
    async (selectAll: boolean) => {
      const params: any = { selectAll, ...queryParams }
      if (!selectAll) {
        params.ids = selected.value.map((item) => item.id)
      }

      await doProjectJoinMemberDownload(params)
      ElMessage.success('导出成功')
    },
    {
      throwError: true,
    },
  )

  // 积分管理
  const [, handleIntegralTable] = useIntegralTable({
    instance: proDialogFormInstance,
  })
</script>
