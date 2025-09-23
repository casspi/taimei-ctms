export interface Userinfo {
  username?: string
  token?: string

  permissions: string[]
  roles: string[]
  isDefaultModifyPwd: boolean
  isPasswordExpired: boolean
  user: User
}

interface User {
  createBy: string
  createTime: string
  updateBy: null | string
  updateTime: null | string
  remark: string
  userId: number
  deptId: number
  userName: string
  nickName: string
  email: string
  phonenumber: string
  sex: string
  avatar: string
  password: string
  status: string
  delFlag: string
  loginIp: string
  loginDate: string
  pwdUpdateDate: string
  dept: Dept
  roles: Role[]
  roleIds: null | string
  postIds: null | string
  roleId: null | number
  admin: boolean
}

interface Role {
  createBy: null | string
  createTime: null | string
  updateBy: null | string
  updateTime: null | string
  remark: null | string
  roleId: number
  roleName: string
  roleKey: string
  roleSort: number
  dataScope: string
  menuCheckStrictly: boolean
  deptCheckStrictly: boolean
  status: string
  delFlag: null
  flag: boolean
  menuIds: null
  deptIds: null
  permissions: null
  admin: boolean
}

interface Dept {
  createBy: null
  createTime: null
  updateBy: null
  updateTime: null
  remark: null
  deptId: number
  parentId: number
  ancestors: string
  deptName: string
  orderNum: number
  leader: string
  phone: null
  email: null
  status: string
  delFlag: null
  parentName: null
  children: any[]
}
