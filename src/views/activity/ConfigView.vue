<template>
  <ProTable :request="handleRequest" :query-metadata="queryMetadata" ref="proTableInstance">
    <template #actions>
      <ProActionButton
        :pd="PD.activity.config.added"
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
            <span>内容</span>
            <span>{{ scope.row.remark || '-' }}</span>
          </ElCol>
        </ElRow>
      </template>
    </ElTableColumn>

    <ElTableColumn label="活动名称" min-width="200">
      <template #default="scope">
        <div class="c-row is-aic">
          <ElImage
            v-if="scope.row.logoFilePath"
            class="c-img-preview"
            :src="scope.row.logoFilePath"
            :preview-src-list="[scope.row.logoFilePath]"
            fit="cover"
            preview-teleported
          />
          <p>{{ scope.row.title }}</p>
        </div>
      </template>
    </ElTableColumn>

    <ElTableColumn label="活动信息" min-width="200">
      <template #default="scope">
        <ul>
          <li>人数最小值：{{ scope.row.minNums || '-' }}</li>
          <li>人数最大值：{{ scope.row.maxNums || '-' }}</li>
          <li>消耗积分数：{{ scope.row.deductScores || '-' }}</li>
        </ul>
      </template>
    </ElTableColumn>

    <ElTableColumn label="活动时间" width="220">
      <template #default="scope">
        <ul>
          <li>开始时间：{{ scope.row.planStartDt || '-' }}</li>
          <li>结束时间：{{ scope.row.planEndDt || '-' }}</li>
        </ul>
      </template>
    </ElTableColumn>

    <DateTableColumn />

    <ProTableActionsColumn
      :pds="[PD.activity.config.edit, PD.activity.config.delete, PD.activity.joinMember.list]"
      fixed="right"
      label="操作"
      width="160"
    >
      <template #default="scope">
        <ProTableActionButton
          :pd="PD.activity.config.edit"
          link
          type="primary"
          @click="handleAddedOrUpdate(scope.row)"
        >
          编辑
        </ProTableActionButton>
        <ProTableActionButton
          :pd="PD.activity.config.delete"
          link
          type="danger"
          @click="handleDelete(scope.row)"
        >
          删除
        </ProTableActionButton>
        <ProTableActionButton
          :pd="PD.activity.joinMember.list"
          type="primary"
          @click="handleJoinMemberTable(scope.row)"
        >
          查看活动人员
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
    doActivityConfigCreate,
    doActivityConfigDelete,
    doActivityConfigUpdate,
    reqActivityConfigList,
    reqDictionaryListType,
  } from '@/api'
  import { useProDialogForm, useProTable } from '@/components'
  import { PD } from '@/stores'
  import type { ActivityConfig, ConfigAward } from '@/types'
  import { getKeywordFields } from '@/utils'

  import ConfigAwardField from './components/ConfigAwardField.vue'
  import { useJoinMemberTable } from './useJoinMemberTable'

  // 列表
  const [queryMetadata, proTableInstance, handleRequest] = useProTable(
    {
      ...getKeywordFields(),
      title: {
        is: 'form-input',
        value: '',
        label: '活动标题',
      },
    },
    async ([currentPage, pageSize], query) => {
      const { dataList, total } = await reqActivityConfigList({ currentPage, pageSize, ...query })
      return [dataList, total]
    },
  )

  const { data: mapOptions } = useAsyncTask(
    async () => {
      const [types, levels] = await Promise.all([
        reqDictionaryListType({ type: DictionaryType.DIC_ACTIVATE_TYPE }),
        reqDictionaryListType({ type: DictionaryType.DIC_ACTIVATE_LEVEL }),
      ])
      return { types, levels }
    },
    {
      immediate: true,
      throwError: true,
      initialValue: { types: [], levels: [] },
    },
  )

  // 编辑 or 新增
  const [proDialogFormInstance, handleAddedOrUpdate] = useProDialogForm<ActivityConfig>(
    () => ({
      title: {
        label: '活动标题',
        value: '',
        is: 'form-input',
        rules: [{ required: true }],
      },
      type: {
        label: '类型',
        value: '',
        is: 'form-select',
        options: [],
        rules: [{ required: true }],
      },
      logoFilePath: {
        label: '海报',
        value: '',
        is: 'form-image-upload',
        width: '100%',
      },
      minNums: {
        label: '人数最小值',
        value: null,
        is: 'form-input-number',
        props: {
          min: 0,
        },
      },
      maxNums: {
        label: '人数最大值',
        value: null,
        is: 'form-input-number',
        props: {
          min: 0,
        },
      },
      deductScores: {
        label: '消耗积分数',
        value: null,
        is: 'form-input-number',
        props: {
          min: 0,
        },
        hidden: (_, __, m) => m.type.value !== '2',
        rules: [{ required: true }],
      },
      datetime: {
        label: '活动时间',
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
        rules: [{ required: true }],
      },
      remark: {
        label: '内容',
        value: '',
        is: 'form-input',
        width: '100%',
        props: {
          type: 'textarea',
          maxlength: 1000,
        },
        rules: [{ required: true }],
      },
      activateConfigAwardVOList: {
        label: '奖励配置',
        value: [],
        is: markRaw(ConfigAwardField),
        width: '100%',
        set: (d, f) => {
          f.value = d.awardList || []
        },
        props: {
          levels: [],
        },
        hidden: (_, __, m) => m.type.value !== '2',
        rules: [
          { required: true },
          {
            validator: (_, v: ConfigAward[]) => {
              return !v.find((item) => !item.level || !item.peopleNums || !item.integral)
            },
            message: '请把奖励配置填写完整',
          },
        ],
      },
    }),
    async (metadata, instance, item) => {
      metadata.type.options = mapOptions.value.types
      metadata.activateConfigAwardVOList.props!.levels = mapOptions.value.levels

      await instance.value.show({
        title: item ? '编辑' : '新增',
        metadata,
        request: (params) =>
          item
            ? doActivityConfigUpdate({ id: item.id, ...params })
            : doActivityConfigCreate(params),
      })
      proTableInstance.value.reload()
      ElMessage.success('操作成功')
    },
  )

  // 申请者管理
  const [, handleJoinMemberTable] = useJoinMemberTable({
    instance: proDialogFormInstance,
  })

  // 删除
  const handleDelete = async (item: ActivityConfig) => {
    await ElMessageBox.confirm(`确认删除该数据？`)
    const { id } = item
    await doActivityConfigDelete({ id })
    proTableInstance.value.reload()
    ElMessage.success('操作成功')
  }
</script>
