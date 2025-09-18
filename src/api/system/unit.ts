import type { Dict, Unit } from '@/types'

import { DictType, reqDictInfo } from '../common'
import curl from '../curl'

// 列表
export const reqUnitList = () => reqDictInfo<Dict>(DictType.DIC_UNIT)

// 详情
export const reqUnitInfo = (data: Pick<Unit, 'id'>) =>
  curl<Unit>(`auth/unit/detailPage`, data, { method: 'POST', isStringify: true })

// 新增
export const doUnitCreate = (data: Partial<Unit>) =>
  curl<Unit>('auth/unit', data, { method: 'POST', isStringify: true })

// 修改
export const doUnitUpdate = (data: Partial<Unit>) =>
  curl<Unit>('auth/unit', { ...data, _method: 'PUT' }, { method: 'POST', isStringify: true })

// 删除
export const doUnitDelete = (data: Pick<Unit, 'id'>) =>
  curl('auth/unit', { ...data, _method: 'DELETE' }, { method: 'POST', isStringify: true })
