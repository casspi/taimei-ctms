import type { PagingParams, PagingResult, Patient } from '@/types'

import curl from '../curl'

// 患者住院记录
export const reqPatientList = (data: PagingParams) =>
  curl<PagingResult<Patient>>(`web/auth/role/user/patient`, data)
