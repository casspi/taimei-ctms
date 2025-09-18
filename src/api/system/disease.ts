import type { DiseaseHistory, PagingParams, PagingResult } from '@/types'

import curl from '../curl'
import download from '../curl/download'

// 患者住院记录
export const reqDiseaseHospitalHistory = (data: PagingParams) =>
  curl<PagingResult<DiseaseHistory>>(`web/person/disease/hospital/history`, data)

// 下载患者住院记录
export const doDiseaseHospitalHistoryDownload = (data: {
  selectAll: boolean
  loginIdSelectAll?: boolean
  ids?: string[]
  loginIds?: string[]
  keyword?: string
}) => {
  return download(
    `web/person/disease/hospital/history/download`,
    {
      loginIdSelectAll: false,
      fileName: `住院记录.zip`,
      ...data,
    },
    {
      paramsSerializer: {
        indexes: null,
      },
    },
  )
}

// 患者开药记录
export const reqDiseasePrescribeHistory = (data: PagingParams) =>
  curl<PagingResult<DiseaseHistory>>(`/web/person/disease/prescribe/history`, data)

// 下载患者开药记录
export const doDiseasePrescribeHistoryDownload = (data: {
  selectAll: boolean
  loginIdSelectAll?: boolean
  ids?: string[]
  loginIds?: string[]
  keyword?: string
}) => {
  return download(
    `web/person/disease/prescribe/history/download`,
    {
      loginIdSelectAll: false,
      fileName: `开药记录.zip`,
      ...data,
    },
    {
      paramsSerializer: {
        indexes: null,
      },
    },
  )
}

// 患者治疗记录
export const reqDiseaseTreatmentHistory = (data: PagingParams) =>
  curl<PagingResult<DiseaseHistory>>(`web/person/disease/treatment/history`, data)

// 下载患者治疗记录
export const doDiseaseTreatmentHistoryDownload = (data: {
  selectAll: boolean
  loginIdSelectAll?: boolean
  ids?: string[]
  loginIds?: string[]
  keyword?: string
}) => {
  return download(
    `web/person/disease/treatment/history/download`,
    {
      loginIdSelectAll: false,
      fileName: `治疗记录.zip`,
      ...data,
    },
    {
      paramsSerializer: {
        indexes: null,
      },
    },
  )
}
