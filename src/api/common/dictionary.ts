import type { Dictionary } from '@/types'

import curl from '../curl'

export enum DictionaryType {
  DIC_HOSPITAL = 'DIC_HOSPITAL', // 医院
  DIC_INSTITUTION_TYPE = 'DIC_INSTITUTION_TYPE', // 机构类型

  DIC_DISABLED = 'DIC_DISABLED', // 状态 0:禁用 1：启用
  DIC_DOCTOR_JOB = 'DIC_DOCTOR_JOB', // 医生职称
  DIC_INFO_URL_TYPE = 'DIC_INFO_URL_TYPE', // 资讯链接类型 1 外链 2 内链 3 富文本
  DIC_MOUNT_LOCATION = 'DIC_MOUNT_LOCATION', // 广告位置
  DIC_BIZ_TYPE = 'DIC_BIZ_TYPE', // 罕见病关联字典
  DIC_INSURE_CATALOGUES_TYPE = 'DIC_INSURE_CATALOGUES_TYPE', // 医保类型 字典
  DIC_PROJECT_TYPE = 'DIC_PROJECT_TYPE', // 项目类型
  DIC_PROJECT_STATUS = 'DIC_PROJECT_STATUS', // 项目状态
  DIC_PROJECT_PERIOD = 'DIC_PROJECT_PERIOD', // 项目试验分期(字典：DIC_PROJECT_PERIOD 0:I期 1：II期 2：III期 3:其他)
  DIC_PROJECT_MEMBER_STATUS = 'DIC_PROJECT_MEMBER_STATUS', // 项目加入者 状态信息
  DIC_SOCIAL_STATUS = 'DIC_SOCIAL_STATUS', // 审核状态字段 0:草稿 1:待审核 2：已通过 3：已驳回
  DIC_REPORT_STATUS = 'DIC_REPORT_STATUS', // 举报审核状态
  DIC_GROUP_MEMBER_STATUS = 'DIC_GROUP_MEMBER_STATUS', // 审核群组成员 0:离线 1:在线 2：已禁言

  DIC_ACTIVATE_TYPE = 'DIC_ACTIVATE_TYPE', // 活动类型 0 签到  1 积分  2 抽奖  3 志愿者 9 其他
  DIC_ACTIVATE_LEVEL = 'DIC_ACTIVATE_LEVEL', // 活动奖励等级

  DIC_MEDICAL_TOOL = 'DIC_MEDICAL_TOOL', // 用药工具类型
  DIC_COMPUTATION_TYPE = 'DIC_MEDICAL_TOOL', // 用药工具元素类型

  DIC_REWARDS_TYPE = 'DIC_REWARDS_TYPE', // 积分类型

  DIC_DOCTOR_STATUS = 'DIC_DOCTOR_STATUS', // 医生状态
  DIC_PROJECT_FILE_ITEM = 'DIC_PROJECT_FILE_ITEM', // 项目文件模板类型
  DIC_PROJECT_SUBSIDY_STATUS = 'DIC_PROJECT_SUBSIDY_STATUS', // 补助审核状态
  DIC_PROJECT_PAY_STATUS = 'DIC_PROJECT_PAY_STATUS', // 补助支付状态
  DIC_GOOD_STATUS = 'DIC_GOOD_STATUS', // 商品状态 1:上架,0:下架
  DIC_ORDER_STATUS = 'DIC_ORDER_STATUS', // 订单状态 1:上架,0:下架
}

// 根据字典类型和代码获得相应的字典的下级代码集（不包含下级）的JSON结构
export const reqDictionaryListType = (data: { type: string }) =>
  curl<Dictionary[]>(`common/dictionary/list/{type}`, data)

// 根据字典类型和代码获得相应的字典的下级代码集（不包括下级）的JSON结构
export const reqDictionaryListTypeCode = (data: { type: string; code: string }) =>
  curl(`common/dictionary/list/{type}/{code}`, data)

// 根据字典类型获得相应的字典代码集（包括下级）的JSON结构
export const reqDictionaryTreeType = (data: { type: string }) =>
  curl(`common/dictionary/tree/{type}`, data)

// 根据字典类型和代码获得相应的字典的下级代码集（包括下级）的JSON结构
export const reqDictionaryTreeTypeCode = (data: { type: string; code: string }) =>
  curl(`common/dictionary/tree/{type}/{code}`, data)
