<template>
  <ProTable :request="handleRequest" :query-metadata="queryMetadata" ref="proTableInstance">
    <template #actions>
      <ProActionButton
        :pd="PD.science.diseaseBusiness.added"
        type="primary"
        plain
        icon="Plus"
        @click="handleAddedOrUpdate()"
      >
        新增
      </ProActionButton>
    </template>

    <ElTableColumn prop="srcTitle" label="被关联业务" />
    <ElTableColumn prop="srcTypeName" label="被关联类型" />
    <ElTableColumn prop="dstTitle" label="关联业务" />
    <ElTableColumn prop="dstTypeName" label="关联类型" />

    <DateTableColumn />

    <ProTableActionsColumn :pds="[PD.science.diseaseBusiness.delete]" width="120">
      <template #default="scope">
        <ProTableActionButton
          :pd="PD.science.diseaseBusiness.delete"
          link
          type="danger"
          @click="handleDelete(scope.row)"
        >
          删除
        </ProTableActionButton>
      </template>
    </ProTableActionsColumn>
  </ProTable>

  <ProDialogForm ref="proDialogFormInstance" @change-field="handleChangeField" />
</template>

<script setup lang="ts">
  import { useAsyncTask } from '@daysnap/vue-use'

  import {
    DictionaryType,
    doDiseaseBusinessCreate,
    doDiseaseBusinessDelete,
    reqActivityConfigList,
    reqAdvertisementList,
    reqClinicalTrialList,
    reqDictionaryListType,
    reqDiseaseBusinessList,
    reqDiseaseList,
    reqDiseaseOrganizationList,
    reqDoctorList,
    reqInsuranceCatalogueList,
    reqInsurancePolicyList,
    reqMedicalGuidelineList,
    reqPopularMedicineList,
    reqPopularScienceList,
    reqProjectList,
  } from '@/api'
  import { useProDialogForm, useProTable } from '@/components'
  import { PD } from '@/stores'
  import type { Dict, DiseaseBusiness } from '@/types'
  import { withPagingParams } from '@/utils'

  // 罕见病与业务的关系联系
  const DISEASE_BUSINESS_TYPE = [
    {
      value: '1',
      label: '医生',
      options: [],
      request: async (item: any) => {
        if (!item.options.length) {
          const data = await withPagingParams(reqDoctorList)()
          item.options = data.map(({ name: label, loginId: value }) => ({ label, value }))
        }
        return item.options
      },
    },
    {
      value: '5',
      label: '资讯-广告',
      options: [],
      request: async (item: any) => {
        if (!item.options.length) {
          const data = await withPagingParams(reqAdvertisementList)()
          item.options = data.map(({ title: label, id: value }) => ({ label, value }))
        }
        return item.options
      },
    },
    {
      value: '6',
      label: '资讯-科普',
      options: [],
      request: async (item: any) => {
        if (!item.options.length) {
          const data = await withPagingParams(reqPopularScienceList)()
          item.options = data.map(({ title: label, id: value }) => ({ label, value }))
        }
        return item.options
      },
    },
    {
      value: '7',
      label: '资讯-新药临床',
      options: [],
      request: async (item: any) => {
        if (!item.options.length) {
          const data = await withPagingParams(reqClinicalTrialList)()
          item.options = data.map(({ projectName: label, projectId: value }) => ({ label, value }))
        }
        return item.options
      },
    },
    {
      value: '8',
      label: '资讯-前沿治疗',
      options: [],
      request: async (item: any) => {
        if (!item.options.length) {
          const data = await withPagingParams(reqPopularMedicineList)()
          item.options = data.map(({ title: label, id: value }) => ({ label, value }))
        }
        return item.options
      },
    },
    {
      value: '9',
      label: '活动',
      options: [],
      request: async (item: any) => {
        if (!item.options.length) {
          const data = await withPagingParams(reqActivityConfigList)()
          item.options = data.map(({ title: label, id: value }) => ({ label, value }))
        }
        return item.options
      },
    },
    {
      value: '10',
      label: '工具-罕见药典',
      options: [],
      request: async (item: any) => {
        if (!item.options.length) {
          const data = await withPagingParams(reqMedicalGuidelineList)()
          item.options = data.map(({ medicineName: label, id: value }) => ({ label, value }))
        }
        return item.options
      },
    },
    {
      value: '11',
      label: '工具-医保政策',
      options: [],
      request: async (item: any) => {
        if (!item.options.length) {
          const data = await withPagingParams(reqInsurancePolicyList)()
          item.options = data.map(({ name: label, id: value }) => ({ label, value }))
        }
        return item.options
      },
    },
    {
      value: '14',
      label: '工具-医保目录',
      options: [],
      request: async (item: any) => {
        if (!item.options.length) {
          const data = await withPagingParams(reqInsuranceCatalogueList)()
          item.options = data.map(({ medicineName: label, id: value }) => ({ label, value }))
        }
        return item.options
      },
    },
    {
      value: '13',
      label: '罕见病组织',
      options: [],
      request: async (item: any) => {
        if (!item.options.length) {
          const data = await withPagingParams(reqDiseaseOrganizationList)()
          item.options = data.map(({ name: label, id: value }) => ({ label, value }))
        }
        return item.options
      },
    },
    {
      value: '15',
      label: '项目',
      options: [],
      request: async (item: any) => {
        if (!item.options.length) {
          const data = await withPagingParams(reqProjectList)()
          item.options = data.map(({ projectName: label, projectId: value }) => ({ label, value }))
        }
        return item.options
      },
    },
    {
      value: '16',
      label: '罕见病',
      options: [],
      request: async (item: any) => {
        if (!item.options.length) {
          const data = await withPagingParams(reqDiseaseList)()
          item.options = data.map(({ nameCn: label, id: value }) => ({ label, value }))
        }
        return item.options
      },
    },
  ]

  // 列表
  const [queryMetadata, proTableInstance, handleRequest] = useProTable(
    {
      srcTitle: {
        is: 'form-input',
        value: '',
        label: '被关联业务',
      },
      dstTitle: {
        is: 'form-input',
        value: '',
        label: '关联业务',
      },
    },
    async ([currentPage, pageSize], query) => {
      const { dataList, total } = await reqDiseaseBusinessList({ currentPage, pageSize, ...query })
      return [dataList, total]
    },
  )

  useAsyncTask(
    async () => {
      const [status] = await Promise.all([
        reqDictionaryListType({ type: DictionaryType.DIC_DISABLED }), // 状态
        reqDictionaryListType({ type: DictionaryType.DIC_BIZ_TYPE }), // 关联类型
      ])
      return { status }
    },
    {
      immediate: false,
      throwError: true,
      initialValue: {
        status: [],
      },
    },
  )

  // 编辑 or 新增
  const [proDialogFormInstance, handleAddedOrUpdate, metadata] = useProDialogForm<DiseaseBusiness>(
    () => ({
      srcType: {
        label: '被关联业务类型',
        value: '',
        is: 'form-select',
        options: [...DISEASE_BUSINESS_TYPE],
        rules: [{ required: true }],
      },
      src: {
        label: '',
        value: '',
        is: 'form-select',
        hidden: (_, __, m) => !m.srcType.value,
        get: (v, f) => {
          const item = f.options.find((item: any) => item.value === v)
          return { srcId: v, srcTitle: item.label }
        },
        rules: [{ required: true }],
      },
      dstType: {
        label: '关联业务类型',
        value: '',
        is: 'form-select',
        options: [...DISEASE_BUSINESS_TYPE],
        get: () => ({}), // 不需要这个类型
        rules: [{ required: true }],
      },
      dstVOList: {
        label: '',
        value: [],
        is: 'form-select',
        options: [],
        hidden: (_, __, m) => !m.dstType.value,
        get: (v: string[], f, m) => {
          const dstType = m.dstType.value
          const dstVOList = (f.options as Dict[])
            .filter((item: any) => v.includes(item.value))
            .map(({ label: dstTitle, value: dstId }) => {
              return { dstTitle, dstId, dstType }
            })

          const isHaveOwn = dstVOList.find(
            (item) => item.dstId === m.src.value && item.dstType === m.srcType.value,
          )

          if (isHaveOwn) {
            throw '不能关联本身业务'
          }

          return { dstVOList }
        },
        props: {
          collapseTags: true,
          multiple: true,
        },
        rules: [{ required: true }],
      },
    }),
    async (metadata, instance) => {
      renderTypeField().toast()

      await instance.value.show({
        title: '新增',
        metadata,
        request: (params) => doDiseaseBusinessCreate(params),
      })
      proTableInstance.value.reload()
      ElMessage.success('操作成功')
    },
  )

  const renderTypeField = async () => {
    if (!metadata.value) return
    const srcType = metadata.value.srcType.value
    if (srcType) {
      const item = DISEASE_BUSINESS_TYPE.find((item) => item.value === srcType)!
      metadata.value.src.label = item.label
      metadata.value.src.options = []
      metadata.value.src.options = (await item!.request?.(item)) ?? []
    }
    const dstType = metadata.value.dstType.value
    if (dstType) {
      const item = DISEASE_BUSINESS_TYPE.find((item) => item.value === dstType)!
      metadata.value.dstVOList.label = item.label
      metadata.value.dstVOList.options = []
      metadata.value.dstVOList.options = (await item!.request?.(item)) ?? []
    }
  }

  const handleChangeField = async (event: any) => {
    if (!metadata.value) return
    if (event.key === 'srcType') {
      metadata.value.src.value = ''
      await renderTypeField()
    } else if (event.key === 'dstType') {
      metadata.value.dstVOList.value = []
      await renderTypeField()
    }
  }

  // 删除
  const handleDelete = async (item: DiseaseBusiness) => {
    await ElMessageBox.confirm(`确认删除该数据？`)
    const { id } = item
    await doDiseaseBusinessDelete({ id })
    proTableInstance.value.reload()
    ElMessage.success('操作成功')
  }
</script>
