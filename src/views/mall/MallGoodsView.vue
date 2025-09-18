<template>
  <ProTable :request="handleRequest" :query-metadata="queryMetadata" ref="proTableInstance">
    <template #actions>
      <ProActionButton
        :pd="PD.mall.goods.added"
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
            <span>轮播图</span>
            <template v-if="scope.row.carouselImagePathList?.length">
              <ElImage
                v-for="(item, index) in scope.row.carouselImagePathList"
                :key="index"
                class="c-img-preview-inline"
                :src="item"
                :initial-index="index"
                :preview-src-list="scope.row.carouselImagePathList"
                fit="cover"
                preview-teleported
              />
            </template>
          </ElCol>
          <ElCol :span="12">
            <span>详情图</span>
            <template v-if="scope.row.detailImagePathList?.length">
              <ElImage
                v-for="(item, index) in scope.row.detailImagePathList"
                :key="index"
                class="c-img-preview-inline"
                :src="item"
                :initial-index="index"
                :preview-src-list="scope.row.detailImagePathList"
                fit="cover"
                preview-teleported
              />
            </template>
          </ElCol>
        </ElRow>
      </template>
    </ElTableColumn>

    <ElTableColumn label="名称" min-width="200">
      <template #default="scope">
        <div class="c-row is-aic">
          <ElImage
            v-if="scope.row.coverImagePathList[0]"
            class="c-img-preview"
            :src="scope.row.coverImagePathList[0]"
            :preview-src-list="scope.row.coverImagePathList"
            fit="cover"
            preview-teleported
          />
          <ul>
            <li>{{ scope.row.name || '-' }}</li>
            <li>积分：{{ scope.row.integralSpeed || '-' }}</li>
            <li>状态：{{ scope.row.statusName || '-' }}</li>
          </ul>
        </div>
      </template>
    </ElTableColumn>

    <DateTableColumn />

    <ProTableActionsColumn :pds="[PD.mall.goods.edit, PD.mall.goods.delete]" width="120">
      <template #default="scope">
        <ProTableActionButton
          :pd="PD.mall.goods.edit"
          link
          type="primary"
          @click="handleAddedOrUpdate(scope.row)"
        >
          编辑
        </ProTableActionButton>
        <ProTableActionButton
          :pd="PD.mall.goods.delete"
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
    doMallGoodsCreate,
    doMallGoodsDelete,
    doMallGoodsUpdate,
    reqDictionaryListType,
    reqMallGoodsList,
  } from '@/api'
  import { useProDialogForm, useProTable } from '@/components'
  import { PD } from '@/stores'
  import type { MallGoods } from '@/types'
  import { getKeywordFields } from '@/utils'

  // 列表
  const [queryMetadata, proTableInstance, handleRequest] = useProTable(
    {
      ...getKeywordFields(),
    },
    async ([currentPage, pageSize], query) => {
      const { dataList, total } = await reqMallGoodsList({ currentPage, pageSize, ...query })
      return [dataList, total]
    },
  )

  const { data: mapOptions } = useAsyncTask(
    async () => {
      const [status] = await Promise.all([
        reqDictionaryListType({ type: DictionaryType.DIC_GOOD_STATUS }),
      ])
      return { status }
    },
    {
      immediate: true,
      throwError: true,
      initialValue: { status: [] },
    },
  )

  // 编辑 or 新增
  const [proDialogFormInstance, handleAddedOrUpdate] = useProDialogForm<MallGoods>(
    () => ({
      name: {
        label: '商品名称',
        value: '',
        is: 'form-input',
        rules: [{ required: true }],
      },
      integralSpeed: {
        label: '积分',
        value: '',
        is: 'form-input-number',
        props: {
          min: 0,
        },
        rules: [{ required: true }],
      },
      coverImagePathList: {
        label: '封面图',
        value: [],
        is: 'form-image-upload',
        width: '100%',
        props: {
          max: 1,
        },
        rules: [{ required: true }],
      },
      carouselImagePathList: {
        label: '轮播图',
        value: [],
        is: 'form-image-upload',
        width: '100%',
        props: {
          max: 9,
        },
        rules: [{ required: true }],
      },
      detailImagePathList: {
        label: '详情图',
        value: [],
        is: 'form-image-upload',
        width: '100%',
        props: {
          max: 9,
        },
      },
      status: {
        label: '状态',
        value: '',
        is: 'form-radio',
        rules: [{ required: true }],
      },
      detail: {
        label: '详情',
        value: '',
        is: 'form-tinymce',
        width: '100%',
      },
    }),
    async (metadata, instance, item) => {
      metadata.status.options = mapOptions.value.status

      await instance.value.show({
        title: item ? '编辑' : '新增',
        metadata,
        request: (params) =>
          item ? doMallGoodsUpdate({ id: item.id, ...params }) : doMallGoodsCreate(params),
      })
      proTableInstance.value.reload()
      ElMessage.success('操作成功')
    },
  )

  // 删除
  const handleDelete = async (item: MallGoods) => {
    await ElMessageBox.confirm(`确认删除该数据？`)
    const { id } = item
    await doMallGoodsDelete({ id })
    proTableInstance.value.reload()
    ElMessage.success('操作成功')
  }
</script>
