<template>
  <ElPopover ref="refPopover" width="390" trigger="click" placement="left" @show="trigger">
    <template #reference>
      <ElLink type="primary">查看原因</ElLink>
    </template>
    <template #default>
      <div class="conetnt">
        <div class="info-header">
          <h4>通过后被撤回</h4>
          <span class="tips">您可以联系审批员，查询原因。</span>
          <ElIcon size="20" class="c-pointer" @click="refPopover?.hide()"><CloseBold /></ElIcon>
        </div>
        <div class="info-list">
          <h4>审批记录</h4>
          <div class="info-item">
            <ElTimeline v-if="data?.length" style="max-width: 600px">
              <ElTimelineItem
                v-for="(item, index) in data"
                :key="index"
                :color="index === data?.length - 1 ? '#f64e4d' : '#1890ff'"
              >
                <span style="margin-right: auto">{{ item.creator }} 提交</span>
                <span>{{ formatDate(item.createTime, 'yyyy-MM-dd hh:mm:ss') }}</span>
                <p v-if="index === data?.length - 1" class="reson-status" style="color: #f64e4d">
                  通过后撤回
                </p>
              </ElTimelineItem>
            </ElTimeline>
          </div>
          <h4>撤回原因</h4>
          <!-- 最后一个包含原因 -->
          <div class="info-item">
            {{ getApprovalMessage }}
          </div>
        </div>
      </div>
    </template>
  </ElPopover>
</template>

<script setup lang="ts">
  import { formatDate } from '@daysnap/utils'
  import { useAsyncTask } from '@daysnap/vue-use'
  import { ElPopover } from 'element-plus'
  defineProps({
    row: {
      type: Object,
      default: () => {},
    },
  })

  const refPopover = useTemplateRef<typeof ElPopover>('refPopover')

  const { data, trigger } = useAsyncTask(
    async () => {
      const data = [
        {
          id: '8a8dbd64878ed6f901879389ab980d3e',
          updateBy: '8a8181f079f5c7500179f8c134741138',
          updateTime: 1681807487000,
          createTime: 1681807486000,
          projectId: '8a81c08a6b99033a016bc606929b3810',
          taskKeyName: null,
          taskKey: null,
          taskId: '1648246177537363969',
          auditState: 11,
          approved: 1,
          approvalMessage: null,
          fileId: null,
          fname: null,
          assignee: null,
          creator: '魏佳骏',
          archiveStatus: 0,
          sourceFormId: '8a8dbde18697b3fe0186a1b123742087',
          sourceFormTypeId: '8a81c0a5696c9baa01696fd8f358025b',
          startTime: null,
          sourceFormTypeCode: null,
          userId: null,
          accountId: null,
          mobile: null,
          accountName: null,
        },
        {
          id: '8a8d80b48bfbbd20018c0e77703a10d0',
          updateBy: '8a8181f079f5c7500179f8c134741138',
          updateTime: 1701049758000,
          createTime: 1701049758000,
          projectId: '8a81c08a6b99033a016bc606929b3810',
          taskKeyName: null,
          taskKey: '1648246180515319808',
          taskId: '1648246180515319808',
          auditState: 10,
          approved: 1,
          approvalMessage: '1',
          fileId: null,
          fname: null,
          assignee: null,
          creator: '魏佳骏',
          archiveStatus: 0,
          sourceFormId: '8a8dbde18697b3fe0186a1b123742087',
          sourceFormTypeId: '8a81c0a5696c9baa01696fd8f358025b',
          startTime: null,
          sourceFormTypeCode: null,
          userId: null,
          accountId: null,
          mobile: null,
          accountName: null,
        },
        {
          id: '8a8dbf03920575aa01920d10bad20d93',
          updateBy: '8a81c0947dc328ff017e281dac643676',
          updateTime: 1726796053000,
          createTime: 1726796053000,
          projectId: '8a81c08a6b99033a016bc606929b3810',
          taskKeyName: null,
          taskKey: null,
          taskId: null,
          auditState: 15,
          approved: 3,
          approvalMessage: '测试123',
          fileId: null,
          fname: null,
          assignee: null,
          creator: 'yuru.liang',
          archiveStatus: 0,
          sourceFormId: '8a8dbde18697b3fe0186a1b123742087',
          sourceFormTypeId: '8a81c0a5696c9baa01696fd8f358025b',
          startTime: null,
          sourceFormTypeCode: null,
          userId: null,
          accountId: null,
          mobile: null,
          accountName: null,
        },
      ]
      return data
    },
    {
      throwError: true,
    },
  )

  const getApprovalMessage = computed(() => {
    const approvalMessage = data.value?.findLast((item) => item.approvalMessage)?.approvalMessage
    return approvalMessage || ''
  })
</script>

<style lang="scss" scoped>
  @use '@/assets/scss/define.scss' as *;
  :deep {
    .el-link {
      font-size: 12px;
    }
  }
  .conetnt {
    color: rgba(0, 0, 0, 0.65);
    display: flex;
    flex-direction: column;
  }
  .info-header {
    border-bottom: 1px solid #e8e8e8;
    height: 28px;
    display: flex;
    align-items: center;
    h4 {
      color: rgb(0, 0, 0);
      font-size: 18px;
    }
    .tips {
      color: #108ee9;
      margin-left: 40px;
    }
  }
  .info-list {
    margin-top: 10px;
    padding: 0 10px;
    h4 {
      padding: 10px;
    }
  }
  .info-item {
    border-radius: 3px;
    padding: 15px 10px;
    background-color: hsla(0, 0%, 79%, 0.17647059);
    max-height: 100px;
    overflow: hidden;
    overflow-y: scroll;
    white-space: pre-wrap;
  }
  .el-timeline-item__content {
    display: flex;
    align-items: center;
  }
</style>
