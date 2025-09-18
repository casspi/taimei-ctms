import type { Dict } from '@/types'

import curl from '../curl'

export enum DictType {
  DIC_UNIT = 'DIC_UNIT', // 单位
  DIC_USER = 'DIC_USER', // 用户
  DIC_DEPARTMENT = 'DIC_DEPARTMENT', // 部门
  DIC_UNIT_DEPARTMENT = 'DIC_UNIT_DEPARTMENT', // 单位-部门
  DIC_SEX = 'DIC_SEX', // 性别
  DIC_REGISTER_ALERT_TYPE = 'DIC_REGISTER_ALERT_TYPE', // 提醒方式

  DIC_LOGIN_USER = 'DIC_LOGIN_USER', // 组织负责人
}

export const reqDictInfo = <T = Dict>(type: DictType) =>
  curl<T[]>(`dictionary/tree/${type}`, {}, { method: 'POST' })

export enum UserRole {
  DOCTOR = 'DOCTOR',
  VOLUNTEER = 'VOLUNTEER',
  ORGANIZATION_MANAGER = 'ORGANIZATION_MANAGER',
}

export const reqUserListByRoleId = (roleId: UserRole) =>
  curl(`/common/user/${roleId}`, { roleId }, { method: 'GET' })
