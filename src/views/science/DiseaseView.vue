<template>
  <ProTable :request="handleRequest" :query-metadata="queryMetadata" ref="proTableInstance">
    <template #actions>
      <ProActionButton
        :pd="PD.science.disease.added"
        type="primary"
        plain
        icon="Plus"
        @click="handleAddedOrUpdate()"
      >
        新增
      </ProActionButton>
    </template>

    <ElTableColumn label="名称" min-width="200">
      <template #default="scope">
        <div class="c-row is-aic">
          <ElImage
            v-if="scope.row.icon"
            class="c-img-preview"
            :src="scope.row.icon"
            :preview-src-list="[scope.row.icon]"
            fit="cover"
            preview-teleported
          />
          <ul>
            <li>名称：{{ scope.row.nameCn || '-' }}</li>
            <li>英文名称：{{ scope.row.nameEn || '-' }}</li>
            <li>作者：{{ scope.row.author || '-' }}</li>
          </ul>
        </div>
      </template>
    </ElTableColumn>

    <ElTableColumn label="其他" min-width="120">
      <template #default="scope">
        <ul>
          <li>位置：{{ scope.row.mountLocationName || '-' }}</li>
          <li>上线时间：{{ scope.row.onlineTime || '-' }}</li>
        </ul>
      </template>
    </ElTableColumn>

    <DateTableColumn />

    <ProTableActionsColumn width="120">
      <template #default="scope">
        <ProTableActionButton
          :pd="PD.science.disease.edit"
          link
          type="primary"
          @click="handleAddedOrUpdate(scope.row)"
        >
          编辑
        </ProTableActionButton>
        <ProTableActionButton
          link
          type="success"
          @click="handleH5Preview(`disease/${scope.row.id}`)"
        >
          预览
        </ProTableActionButton>
        <ProTableActionButton
          :pd="PD.science.disease.delete"
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

  <ProH5Preview ref="proH5PreviewInstance" />
</template>

<script setup lang="ts">
  import { useAsyncTask } from '@daysnap/vue-use'

  import {
    DictionaryType,
    doDiseaseCreate,
    doDiseaseDelete,
    doDiseaseUpdate,
    reqDictionaryListType,
    reqDiseaseList,
  } from '@/api'
  import { useProDialogForm, useProH5Preview, useProTable } from '@/components'
  import { PD } from '@/stores'
  import type { Disease } from '@/types'
  import { getKeywordFields } from '@/utils'

  // 预览
  const [proH5PreviewInstance, handleH5Preview] = useProH5Preview()

  // 列表
  const [queryMetadata, proTableInstance, handleRequest] = useProTable(
    {
      ...getKeywordFields(),
      nameCn: {
        is: 'form-input',
        value: '',
        label: '罕见病名称',
      },
      mountLocation: {
        is: 'form-select',
        value: '',
        label: '位置',
      },
    },
    async ([currentPage, pageSize], query) => {
      const { dataList, total } = await reqDiseaseList({ currentPage, pageSize, ...query })
      return [dataList, total]
    },
  )

  // 选项
  const { data: mapOptions } = useAsyncTask(
    async () => {
      const [mountLocations] = await Promise.all([
        reqDictionaryListType({ type: DictionaryType.DIC_MOUNT_LOCATION }),
      ])
      queryMetadata.mountLocation.options = mountLocations
      return { mountLocations }
    },
    {
      immediate: true,
      throwError: true,
      initialValue: { mountLocations: [] },
    },
  )

  // 编辑 or 新增
  const [proDialogFormInstance, handleAddedOrUpdate] = useProDialogForm<Disease>(
    () => ({
      nameCn: {
        label: '疾病名称',
        value: '',
        is: 'form-input',
        rules: [{ required: true }],
      },
      nameEn: {
        label: '英文名称',
        value: '',
        is: 'form-input',
        rules: [{ required: true }],
      },
      icon: {
        label: 'Icon图（92 * 92）',
        value: '',
        is: 'form-image-upload',
        width: '48%',
      },
      banner: {
        label: '详情Banner（686 * 280）',
        value: '',
        is: 'form-image-upload',
        width: '48%',
      },
      mountLocation: {
        label: '位置',
        value: '',
        is: 'form-select',
        options: [],
        rules: [{ required: true }],
      },
      onlineTime: {
        label: '上线时间',
        value: '',
        is: 'form-date-picker',
        rules: [{ required: true }],
      },
      author: {
        label: '作者',
        value: '',
        is: 'form-input',
      },
      index: {
        label: '排序',
        value: 1,
        is: 'form-input-number',
        set: (s, f) => (f.value = +s.index || 1),
        rules: [{ required: true }],
      },
      summary: {
        label: '概述',
        value: '',
        is: 'form-tinymce',
        rules: [{ required: true }],
      },
      etiology: {
        label: '病因与流行病学',
        value: '',
        is: 'form-tinymce',
        rules: [{ required: true }],
      },
      clinicalFeature: {
        label: '临床表现',
        value: '',
        is: 'form-tinymce',
        rules: [{ required: true }],
      },
      auxiliaryExamination: {
        label: '辅助检查',
        value: '',
        is: 'form-tinymce',
        rules: [{ required: true }],
      },
      differentialDiagnosis: {
        label: '鉴别诊断',
        value: '',
        is: 'form-tinymce',
        rules: [{ required: true }],
      },
      treatment: {
        label: '治疗',
        value: '',
        is: 'form-tinymce',
        rules: [{ required: true }],
      },
      complicationDetection: {
        label: '并发症检测',
        value: '',
        is: 'form-tinymce',
        rules: [{ required: true }],
      },
      diagnosticProcess: {
        label: '诊断流程',
        value: '',
        is: 'form-tinymce',
        rules: [{ required: true }],
      },
      diagnosticProcessFilePath: {
        label: '诊断流程文件',
        value: '',
        is: 'form-file-upload',
      },
      filePath: {
        label: '附件',
        value: '',
        is: 'form-file-upload',
      },
      referDoc: {
        label: '参考文献',
        value: '',
        is: 'form-tinymce',
        rules: [{ required: true }],
      },
    }),
    async (metadata, instance, item) => {
      metadata.mountLocation.options = mapOptions.value.mountLocations

      await instance.value.show({
        title: item ? '编辑' : '新增',
        metadata,
        request: (params) =>
          item ? doDiseaseUpdate({ id: item.id, ...params }) : doDiseaseCreate(params),
      })
      proTableInstance.value.reload()
      ElMessage.success('操作成功')
    },
  )

  // 删除
  const handleDelete = async (item: Disease) => {
    await ElMessageBox.confirm(`确认删除该数据？`)
    const { id } = item
    await doDiseaseDelete({ id })
    proTableInstance.value.reload()
    ElMessage.success('操作成功')
  }
</script>
