import type { Dictionary } from '@/types'

import curl from '../curl'

// 根据角色类型筛选出用户列表信息
export enum RoleType {
  DOCTOR = 'DOCTOR', // 医生
  VOLUNTEER = 'VOLUNTEER', // 志愿者
}

export const reqUserByRoleType = (data: { roleId: RoleType }) =>
  curl<Dictionary[]>('common/user/{roleId}', data)
