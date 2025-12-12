import { ato } from '@daysnap/utils'

export enum ReportAudit {
  REVOKE = -1,

  IN_APPROVAL = -2,

  NOT_SUBMITTED = -4,

  PASS = 1,

  POST_WITHDRAWAL = -3,
}

export const ReportAuditType = [
  {
    label: '通过',
    value: ReportAudit.PASS as number,
    iconType: 'success',
  },
  {
    label: '撤销',
    value: ReportAudit.REVOKE as number,
    iconType: 'warning',
  },
  {
    label: '未提交',
    value: ReportAudit.NOT_SUBMITTED as number,
    iconType: 'info',
  },
  {
    label: '审批中',
    value: ReportAudit.IN_APPROVAL as number,
    iconType: 'success',
  },
  {
    label: '通过后撤回',
    value: ReportAudit.POST_WITHDRAWAL as number,
    iconType: 'warning',
  },
]

export const ReportAuditTypeValueMap = ato(ReportAuditType, 'value')
