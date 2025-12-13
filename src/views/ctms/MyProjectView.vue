<template>
  <div class="project-warp">
    <div class="project-infos-l">
      <div class="project-header">
        <div class="project-infos-title">我的项目</div>
        <div class="action-bar"></div>
      </div>
      <ProTable
        :request="handleRequest"
        :query-metadata="queryMetadata"
        ref="proTableInstance"
        :hasRefresh="false"
      >
        <ElTableColumn label="项目编号" prop="projectCode" width="130" fixed sortable>
        </ElTableColumn>
        <ElTableColumn label="研究编号" prop="programCode" width="140" sortable> </ElTableColumn>
        <ElTableColumn label="研究名称" min-width="270" sortable>
          <template #default="scope">
            <ElLink type="primary" underline="hover" @click="$router.push(`/site/inspect/plan`)">
              {{ scope.row.projectName || '-' }}
            </ElLink>
          </template>
        </ElTableColumn>
        <ElTableColumn
          label="状态"
          width="140"
          :filters="[
            { text: '未开始', value: '未开始' },
            { text: '进行中', value: '进行中' },
            { text: '暂停', value: '暂停' },
            { text: '终止', value: '终止' },
            { text: '已完成', value: '已完成' },
          ]"
          :filter-method="(value: string, row: User, column: TableColumnCtx<User>) => {}"
        >
          <template #default="scope">
            <ElTag>
              {{ scope.row.projectStatusName }}
            </ElTag>
          </template>
        </ElTableColumn>
        <ElTableColumn label="项目分级" prop="projectCode" width="140"> </ElTableColumn>
        <ElTableColumn label="PM" prop="mainPmName" width="140"> </ElTableColumn>
        <ElTableColumn label="组长单位" prop="leadingSite" width="140" show-overflow-tooltip>
        </ElTableColumn>
        <ElTableColumn label="主要研究者" prop="piText" width="140" show-overflow-tooltip>
        </ElTableColumn>
        <ElTableColumn label="项目进度" width="140" align="center">
          <template #default="scope"> {{ scope.row.planCenterNum }}% </template>
        </ElTableColumn>
        <ElTableColumn label="入组进度" width="100" align="center">
          <template #default="scope">
            {{ scope.row.subjectEnroll }}/{{ scope.row.subjectPlanEnroll }}
          </template>
        </ElTableColumn>
        <ElTableColumn label="中心数" prop="siteCount" width="100" align="center"> </ElTableColumn>
        <ElTableColumn label="SAE" prop="saeCount" width="100" align="center"> </ElTableColumn>
        <ElTableColumn label="收藏" width="70" fixed="right" align="center">
          <template #default="scope">
            <ElIcon size="20" @click="scope.row.isCollected = scope.row.isCollected ? 0 : 1">
              <StarFilled style="color: #ec862c" v-if="scope.row.isCollected === 1" />
              <Star v-else />
            </ElIcon>
          </template>
        </ElTableColumn>
        <ElTableColumn label="" width="40" fixed="right">
          <ElIcon size="16">
            <DataAnalysis style="color: var(--el-color-primary)" />
          </ElIcon>
        </ElTableColumn>
      </ProTable>
    </div>
    <div class="project-infos-r">
      <img src="@/assets/img/my-project.png" alt="" srcset="" />
    </div>
  </div>
</template>

<script setup lang="ts">
  import type { TableColumnCtx } from 'element-plus'

  import { useProTable } from '@/components'
  import type { User } from '@/types'
  // 列表
  const [queryMetadata, proTableInstance, handleRequest] = useProTable(
    {},
    async ([currentPage, pageSize], query) => {
      const { rows, total } = {
        rows: [
          {
            id: '8ae580216bbcef08016bc60692a85d5f',
            projectId: '8a81c08a6b99033a016bc606929b3810',
            projectName: 'CTMS测试项目',
            candidate: '中山康方生物医药有限公司',
            candidateId: '4028e4d76f5b0602016f5b07be360c14',
            programCode: 'Akesobio_test',
            projectManager: '',
            projectManagerId: '',
            studyStageId: '30798bd6-e5b2-11e8-a539-00163e02f99a',
            studyStageName: 'II期',
            projectDesc: null,
            cro: '',
            croId: '',
            therapyAreaId: '30feeae1-e5b2-11e8-a539-00163e02f99a',
            therapyAreaName: '肿瘤',
            projectSerialNo: 'PH6129',
            abbreviatedName: null,
            businessModel: null,
            projectCode: 'TM01',
            organIds: null,
            organNames: null,
            mainPmAccountId: null,
            mainPmId: '8a8dba3e9108d6ef01914ab203af7910',
            mainPmName: '杨琳羚',
            projectAssistant: '8a8181f079f5c7500179f8c134741138',
            projectAssistantName: null,
            projectScopeId: 'ad76e4a3b61a11eaa53900163e02f99a',
            projectScopeName: '国际',
            projectTypeId: '8a81c0a56bb80d3f016bb80d3f1b0000',
            projectTypeName: '',
            registerTypeId: '8a81c0a56bb80d3f016bb80d3f1b0008',
            registerTypeName: '',
            researchTitle: 'CCP测试项目',
            researchTypeId: '',
            researchTypeName: '',
            researchProduct: '产品',
            indicationId: null,
            indicationName: '适应症A',
            controlDrug: 'NA',
            treatmentGroupId: '',
            treatmentGroupName: '',
            researchDesign: '双盲随机对照',
            executiveDepartment: '项目1部',
            executiveDepartmentName: null,
            interimAnalysis: '1',
            studyDuration: null,
            firstPlanStartDate: '2019-07-01',
            firstPlanEndDate: '2019-07-06',
            minorJoin: '0',
            projectStatusId: 'doing',
            projectStatusName: '进行中',
            geneticsCheck: '',
            cooperativePartner: '太美',
            planCenterNum: 5,
            planSubjectsNum: 181,
            memoTxt: '',
            pid: '0',
            projectVersion: null,
            tenantId: '91440101MA5AR2UN74',
            tenantName: null,
            therapyMethod: null,
            projectDirector: null,
            isTest: 1,
            siteVisitNum: null,
            subjectInMonth: null,
            trailPeriod: null,
            dataCollectionPeriod: null,
            updateByAccountId: null,
            fromRedis: false,
            fromApp: null,
            projectStatDto: null,
            leadingSite: '01 测试中心1医院,02 测试中心2',
            experimentType: null,
            experimentTypeId: null,
            leadingSiteId: '8a81c08b6b9904c7016bc60c202b0f6b,8a81c08b7ee3b6da017f023560df7140',
            piText: '胡歌,陈换飞,李四,王二',
            siteCount: 9,
            dataManager:
              '1d8542d276f211e9a53900163e02f99a,1a6303eb67d311e9a53900163e02f99a,1af3f14e4ebd11e9a53900163e02f99a',
            medicineDirector:
              '1d8542d276f211e9a53900163e02f99a,1a6303eb67d311e9a53900163e02f99a,0eb39838695211e9a53900163e02f99a',
            statistician: '8a81c08a6be3fbac016be443142201cd,8a8181f078b14a900178e94e0fb057cd',
            dataManagerName: null,
            medicineDirectorName: null,
            statisticianName: null,
            isCollected: 1,
            currentAppId: null,
            currentProjectName: null,
            currentProjectDesc: null,
            currentProjectAbbrevatedName: null,
            projectLevel: null,
            projectLevelName: null,
            isDeleted: 0,
            updateTime: 1741763350345,
            userDefineId: 'projectDetail',
            extMap: null,
            milestoneProcess: 0.05,
            subjectEnroll: 17,
            subjectPlanEnroll: 181,
            saeCount: 19,
            cfda: null,
            dmc: null,
          },
        ],
        total: 1,
      }
      return [rows, total]
    },
  )
</script>

<style lang="scss" scoped>
  @use '@/assets/scss/define.scss' as *;
  .project-warp {
    position: relative;
    height: 100%;
    display: flex;
  }
  .project-infos-l {
    background: #fff;
    padding: 10px 16px;
    box-sizing: border-box;
    flex: 1;
    overflow-x: auto; // 添加这行，允许内容水平滚动
    min-width: 0; //
  }
  .project-header {
    display: flex;
    justify-content: space-between;
  }
  .project-infos-title {
    font-size: 20px;
    font-weight: 700;
    display: flex;
    align-items: center;
    &::before {
      content: '';
      display: inline-block;
      width: 2px;
      height: 20px;
      background: var(--el-color-primary);
      margin-right: 8px;
    }
  }
  .project-infos-r {
    background: #fff;
    width: 300px;
    margin-left: 10px;
    img {
      width: 100%;
      height: 100%;
    }
  }
</style>
