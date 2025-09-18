export interface Userinfo {
  loginId: string
  userId: string
  sessionId: string
  id: string
  functions: string[]
  roleId: string
  name: string
  sex: string
  unitIds: string[]
  departmentIds: string[]
  roleIds: string[]
  roleEnNames: null[]
  roleNames: string[]
  pageSize: number
  loginTimes: number
  loginTime: string
  prevLoginTime: string
  loginIp: string
  image: string
  appType: string
  properties: Properties
}

interface Properties {
  createUserId: string
  unitNames: string[]
  modifyUserId: string
  loginTimes: number
  loginTime: string
  modifyTime: string
  createTime: string
  loginIp: number
  status: number
}
