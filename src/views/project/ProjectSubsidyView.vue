<template>
  <ProTable :request="handleRequest" :query-metadata="queryMetadata" ref="proTableInstance">
    <template #actions>
      <ProActionButton
        :pd="PD.project.subsidy.export"
        type="primary"
        :loading="loading"
        plain
        @click="handleDownload(true)"
      >
        导出全部
      </ProActionButton>
      <ProActionButton
        :pd="PD.project.subsidy.export"
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
            <span>银行卡开户行信息截图</span>
            <template v-if="scope.row.bankAddressPathList?.length">
              <ElImage
                v-for="(item, index) in scope.row.bankAddressPathList"
                :key="index"
                class="c-img-preview-inline"
                :src="item"
                :initial-index="index"
                :preview-src-list="scope.row.bankAddressPathList"
                fit="cover"
                preview-teleported
              />
            </template>
          </ElCol>
          <ElCol :span="12">
            <span>银行卡照片</span>
            <template v-if="scope.row.bankCardIdPathList?.length">
              <ElImage
                v-for="(item, index) in scope.row.bankCardIdPathList"
                :key="index"
                class="c-img-preview-inline"
                :src="item"
                :initial-index="index"
                :preview-src-list="scope.row.bankCardIdPathList"
                fit="cover"
                preview-teleported
              />
            </template>
          </ElCol>
          <ElCol :span="12">
            <span>购药发票</span>
            <template v-if="scope.row.purchaseInvoicePathList?.length">
              <ElImage
                v-for="(item, index) in scope.row.purchaseInvoicePathList"
                :key="index"
                class="c-img-preview-inline"
                :src="item"
                :initial-index="index"
                :preview-src-list="scope.row.purchaseInvoicePathList"
                fit="cover"
                preview-teleported
              />
            </template>
          </ElCol>
          <ElCol :span="12">
            <span>患者购药医保结算单</span>
            <template v-if="scope.row.medicalInsurancePathList?.length">
              <ElImage
                v-for="(item, index) in scope.row.medicalInsurancePathList"
                :key="index"
                class="c-img-preview-inline"
                :src="item"
                :initial-index="index"
                :preview-src-list="scope.row.medicalInsurancePathList"
                fit="cover"
                preview-teleported
              />
            </template>
          </ElCol>
          <ElCol :span="12">
            <span>处方</span>
            <template v-if="scope.row.prescriptionPathList?.length">
              <ElImage
                v-for="(item, index) in scope.row.prescriptionPathList"
                :key="index"
                class="c-img-preview-inline"
                :src="item"
                :initial-index="index"
                :preview-src-list="scope.row.prescriptionPathList"
                fit="cover"
                preview-teleported
              />
            </template>
          </ElCol>
          <ElCol :span="12">
            <span>支付凭证</span>
            <template v-if="scope.row.payProofPathList?.length">
              <ElImage
                v-for="(item, index) in scope.row.payProofPathList"
                :key="index"
                class="c-img-preview-inline"
                :src="item"
                :initial-index="index"
                :preview-src-list="scope.row.payProofPathList"
                fit="cover"
                preview-teleported
              />
            </template>
          </ElCol>
        </ElRow>
      </template>
    </ElTableColumn>

    <ElTableColumn type="selection" width="55" />

    <ElTableColumn label="申请人信息" min-width="120">
      <template #default="scope">
        <ul>
          <li>{{ scope.row.projectName }}</li>
          <li>姓名：{{ scope.row.name || '-' }}</li>
          <li>联系方式：{{ scope.row.contactPhone || '-' }}</li>
        </ul>
      </template>
    </ElTableColumn>

    <ElTableColumn label="银行信息" min-width="120">
      <template #default="scope">
        <ul>
          <li>银行开户行：{{ scope.row.bankAddress || '-' }}</li>
          <li>银行账号：{{ scope.row.bankCardId || '-' }}</li>
        </ul>
      </template>
    </ElTableColumn>

    <ElTableColumn label="支付" width="220">
      <template #default="scope">
        <ul>
          <li>支付状态：{{ scope.row.payStatusName || '-' }}</li>
          <li>支付日期：{{ formatDate(scope.row.payDt, 'yyyy-MM-dd') || '-' }}</li>
          <li>支付人：{{ scope.row.payBy || '-' }}</li>
          <li>支付备注：{{ scope.row.payRemark || '-' }}</li>
        </ul>
      </template>
    </ElTableColumn>

    <ElTableColumn label="审核" width="220">
      <template #default="scope">
        <ul>
          <li>审核状态：{{ scope.row.statusName || '-' }}</li>
          <li>审核时间：{{ scope.row.checkDt || '-' }}</li>
          <li>审核备注：{{ scope.row.checkRemark || '-' }}</li>
          <li>审核人：{{ scope.row.checkBy || '-' }}</li>
        </ul>
      </template>
    </ElTableColumn>

    <DateTableColumn>
      <template #default="scope">
        <li>创建人：{{ scope.row.createByName || '-' }}</li>
      </template>
    </DateTableColumn>

    <ProTableActionsColumn
      width="130"
      :pds="[PD.project.subsidy.delete, PD.project.subsidy.check, PD.project.subsidy.pay]"
    >
      <template #default="scope">
        <ProTableActionButton
          :pd="PD.project.subsidy.check"
          type="warning"
          @click="handleCheck(scope.row)"
        >
          审核
        </ProTableActionButton>
        <ProTableActionButton
          :pd="PD.project.subsidy.delete"
          link
          type="danger"
          @click="handleDelete(scope.row)"
        >
          删除
        </ProTableActionButton>
        <ProTableActionButton
          :pd="PD.project.subsidy.pay"
          type="primary"
          @click="handlePayStatusUpdate(scope.row)"
        >
          支付凭证
        </ProTableActionButton>
      </template>
    </ProTableActionsColumn>
  </ProTable>

  <ProDialogForm ref="proDialogFormInstance" />
</template>

<script setup lang="ts">
  import { formatDate } from '@daysnap/utils'
  import { useAsyncTask } from '@daysnap/vue-use'

  import {
    DictionaryType,
    doProjectSubsidyCheck,
    doProjectSubsidyDelete,
    doProjectSubsidyDownload,
    doProjectSubsidyPay,
    reqDictionaryListType,
    reqProjectSubsidyInfo,
    reqProjectSubsidyList,
  } from '@/api'
  import { useProDialogForm, useProTable } from '@/components'
  import { multipleSelectionKey } from '@/components/ProTableList/selection'
  import { PD } from '@/stores'
  import type { ProjectSubsidy } from '@/types'
  import { getKeywordFields } from '@/utils'

  import DiseasePrescribeDetail from './components/DiseasePrescribeDetail.vue'

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
      payStatus: {
        is: 'form-select',
        value: '',
        label: '支付状态',
      },
    },
    async ([currentPage, pageSize], query) => {
      if (props.modelValue) {
        query.projectId = props.modelValue
      }
      const { dataList, total } = await reqProjectSubsidyList({
        currentPage,
        pageSize,
        ...query,
      })

      queryParams = query

      return [dataList, total]
    },
  )

  const { data: mapOptions } = useAsyncTask(
    async () => {
      const [statusList, payStatusList] = await Promise.all([
        reqDictionaryListType({ type: DictionaryType.DIC_PROJECT_SUBSIDY_STATUS }),
        reqDictionaryListType({ type: DictionaryType.DIC_PROJECT_PAY_STATUS }),
      ])

      queryMetadata.status.options = statusList
      queryMetadata.payStatus.options = payStatusList

      return { statusList, payStatusList }
    },
    {
      immediate: true,
      throwError: true,
      initialValue: { statusList: [], payStatusList: [] },
    },
  )

  // 审核
  const [proDialogFormInstance, handleCheck] = useProDialogForm<ProjectSubsidy>(
    () => ({
      name: {
        label: '姓名',
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
      bankAddress: {
        label: '银行开户行',
        value: '',
        is: 'form-input',
        props: {
          disabled: true,
        },
      },
      bankCardId: {
        label: '银行账号',
        value: '',
        is: 'form-input',
        props: {
          disabled: true,
        },
      },
      bankAddressPathList: {
        label: '银行卡开户行信息截图',
        value: '',
        is: 'form-image-upload',
        width: '100%',
        props: {
          disabled: true,
        },
      },
      bankCardIdPathList: {
        label: '银行卡照片',
        value: '',
        is: 'form-image-upload',
        width: '100%',
        props: {
          disabled: true,
        },
      },
      purchaseInvoicePathList: {
        label: '购药发票',
        value: '',
        is: 'form-image-upload',
        width: '100%',
        props: {
          disabled: true,
        },
      },
      medicalInsurancePathList: {
        label: '患者购药医保结算单',
        value: '',
        is: 'form-image-upload',
        width: '100%',
        props: {
          disabled: true,
        },
      },
      prescriptionPathList: {
        label: '处方',
        value: '',
        is: 'form-image-upload',
        width: '100%',
        props: {
          disabled: true,
        },
      },
      prescribeHistoryVOList: {
        label: '开药记录',
        value: [],
        is: markRaw(DiseasePrescribeDetail),
        width: '100%',
      },
      status: {
        label: '审核状态',
        value: '',
        is: 'form-select',
        rules: [{ required: true, message: '请选择状态' }],
      },
      checkRemark: {
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

      const { id } = item
      metadata.status.options = mapOptions.value.statusList
      const { prescribeHistoryVOList } = await reqProjectSubsidyInfo({ id })
      metadata.prescribeHistoryVOList.value = prescribeHistoryVOList || []

      await instance.value.show({
        title: '审核',
        metadata,
        request: ({ checkRemark, status }) => doProjectSubsidyCheck({ id, checkRemark, status }),
      })
      proTableInstance.value.reload()
      ElMessage.success('操作成功')
    },
  )

  // 支付凭证
  const [, handlePayStatusUpdate] = useProDialogForm<ProjectSubsidy>(
    () => ({
      name: {
        label: '姓名',
        value: '',
        is: 'form-input',
        props: {
          disabled: true,
        },
      },
      payStatus: {
        label: '支付状态',
        value: '',
        is: 'form-select',
        options: [],
        rules: [{ required: true, message: '请选择状态' }],
      },
      payDt: {
        label: '支付日期',
        value: '',
        is: 'form-date-picker',
      },
      payProofPathList: {
        label: '支付凭证',
        value: [],
        is: 'form-image-upload',
        width: '100%',
        props: {
          max: 9,
        },
      },
      payRemark: {
        label: '备注',
        value: '',
        is: 'form-input',
        width: '100%',
        props: {
          type: 'textarea',
        },
      },
    }),
    async (metadata, _, item) => {
      if (!item) {
        return
      }

      metadata.payStatus.options = mapOptions.value.payStatusList
      const { id } = item

      await proDialogFormInstance.value.show({
        title: '支付凭证',
        metadata,
        request: ({ payRemark, payStatus, payProofPathList = [], payDt = '' }) =>
          doProjectSubsidyPay({ id, payRemark, payStatus, payProofPathList, payDt }),
      })
      proTableInstance.value.reload()
      ElMessage.success('操作成功')
    },
  )

  // 删除
  const handleDelete = async (item: ProjectSubsidy) => {
    await ElMessageBox.confirm(`确认删除该数据？`)
    const { id } = item
    await doProjectSubsidyDelete({ id })
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

      await doProjectSubsidyDownload(params)
      ElMessage.success('导出成功')
    },
    {
      throwError: true,
    },
  )
</script>
