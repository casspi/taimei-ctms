import { ato } from '@daysnap/utils'

// 监查报告审批状态
export enum ReportAudit {
  PASS = 1, // 通过

  POST_WITHDRAWAL = 3, // 通过后撤回

  REVOKE = -1, // 撤销

  IN_APPROVAL = -2, // 审批中

  NOT_SUBMITTED = -4, // 未提交
}

export const ReportAuditType = [
  {
    label: '通过',
    value: ReportAudit.PASS as number,
    iconType: 'success',
  },
  {
    label: '通过后撤回',
    value: ReportAudit.POST_WITHDRAWAL as number,
    iconType: 'warning',
  },
  {
    label: '撤销',
    value: ReportAudit.REVOKE as number,
    iconType: 'warning',
  },
  {
    label: '审批中',
    value: ReportAudit.IN_APPROVAL as number,
    iconType: 'success',
  },
  {
    label: '未提交',
    value: ReportAudit.NOT_SUBMITTED as number,
    iconType: 'info',
  },
]

export const ReportAuditTypeValueMap = ato(ReportAuditType, 'value')

// 监查计划审批状态
export enum PlanStatus {
  PASS = 1, // 通过

  POST_WITHDRAWAL = 3, // 通过后撤回

  REVOKE = -1, // 撤销

  IN_APPROVAL = -2, // 审批中

  NOT_APPLICABLE = -3, // 不适用

  NOT_SUBMITTED = -4, // 未提交
}

export const PlanStatusType = [
  {
    label: '通过',
    value: PlanStatus.PASS as number,
    iconType: 'success',
  },
  {
    label: '通过后撤回',
    value: PlanStatus.POST_WITHDRAWAL as number,
    iconType: 'warning',
  },
  {
    label: '撤销',
    value: PlanStatus.REVOKE as number,
    iconType: 'warning',
  },
  {
    label: '审批中',
    value: PlanStatus.IN_APPROVAL as number,
    iconType: 'success',
  },
  {
    label: '未提交',
    value: PlanStatus.NOT_SUBMITTED as number,
    iconType: 'info',
  },
  {
    label: '不适用',
    value: PlanStatus.NOT_APPLICABLE as number,
    iconType: 'info',
  },
]

export const PlanStatusTypeValueMap = ato(PlanStatusType, 'value')
