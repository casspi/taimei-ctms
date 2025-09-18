export interface ActivityConfig {
  activateConfigAwardVOList: ActivateConfigAwardVOList[]
  createBy: string
  createDt: string
  id: string
  logoFilePath: string
  maxNums: number
  minNums: number
  modifyBy: string
  modifyDt: string
  planEndDt: string
  planStartDt: string
  remark: string
  title: string
}

interface ActivateConfigAwardVOList {
  activityId: string
  createBy: string
  createDt: string
  id: string
  integral: number
  level: string
  modifyBy: string
  modifyDt: string
  peopleNums: number
  type: string
}
