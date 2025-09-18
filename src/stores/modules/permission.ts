import { isObject } from '@daysnap/utils'
import { useState } from '@daysnap/vue-use'
import { defineStore } from 'pinia'

import type { Menu } from '@/types'
import { __DEV__, createNamespace } from '@/utils'

import { withToRefs } from '../withToRefs'

// 权限定义
// PermissionDefinition
export const PD = {
  activity: {
    config: {
      list: { label: '活动配置-列表', value: 'activity_config' },
      added: { label: '活动配置-新增', value: 'post_activity_config' },
      edit: { label: '活动配置-编辑', value: 'put_activity_config' },
      delete: { label: '活动配置-删除', value: 'delete_activity_config' },
    },
    joinMember: {
      list: { label: '活动加入者-列表', value: 'activity_join_member' },
      export: { label: '活动加入者-导出', value: 'download_activity_join_member' },
      delete: { label: '活动加入者-删除', value: 'delete_activity_join_member' },
    },
  },

  system: {
    patient: {
      list: { label: '患者管理-列表', value: 'auth_role_user_patient' },
    },
    diseaseHospital: {
      list: { label: '患者住院记录-列表', value: 'person_disease_hospital_history' },
      export: { label: '患者住院记录-导出', value: 'download_person_disease_hospital_history' },
    },
    diseasePrescribe: {
      list: { label: '患者开药记录-列表', value: 'person_disease_prescribe_history' },
      export: { label: '患者开药记录-导出', value: 'download_person_disease_prescribe_history' },
    },
    diseaseTreatment: {
      list: { label: '患者治疗记录-列表', value: 'person_disease_treatment_history' },
      export: { label: '患者治疗记录-导出', value: 'download_person_disease_treatment_history' },
    },
    integral: {
      list: { label: '积分管理-列表', value: 'activity_reward' },
      added: { label: '积分管理-新增', value: 'post_activity_reward' },
      delete: { label: '积分管理-删除', value: 'delete_activity_reward' },
    },
    user: {
      list: { label: '用户管理-列表', value: 'AUTH_USER' },
      added: { label: '用户管理-新增', value: 'AUTH_USER_C' },
      edit: { label: '用户管理-修改', value: 'AUTH_USER_M' },
      delete: { label: '用户管理-删除', value: 'AUTH_USER_D' },
      enable: { label: '用户管理-启用', value: 'POST_AUTH_USER_BATCH_ENABLE' },
      disable: { label: '用户管理-停用', value: 'POST_AUTH_USER_BATCH_DISABLE' },
    },
    menu: {
      list: { label: '菜单管理-列表', value: 'menu' },
      added: { label: '菜单管理-新增', value: 'post_menu' },
      edit: { label: '菜单管理-修改', value: 'put_menu' },
      delete: { label: '菜单管理-删除', value: 'delete_menu' },
    },
    unit: {
      list: { label: '单位管理-列表', value: 'AUTH_UNIT' },
      added: { label: '单位管理-新增', value: 'AUTH_UNIT_C' },
      edit: { label: '单位管理-修改', value: 'AUTH_UNIT_M' },
      delete: { label: '单位管理-删除', value: 'AUTH_UNIT_D' },
    },
    department: {
      list: { label: '部门管理-列表', value: 'AUTH_DEPARTMENT' },
      added: { label: '部门管理-新增', value: 'AUTH_DEPARTMENT_C' },
      edit: { label: '部门管理-修改', value: 'AUTH_DEPARTMENT_M' },
      delete: { label: '部门管理-删除', value: 'AUTH_DEPARTMENT_D' },
    },
    role: {
      list: { label: '角色管理-列表', value: 'AUTH_ROLE' },
      added: { label: '角色管理-新增', value: 'AUTH_ROLE_C' },
      edit: { label: '角色管理-修改', value: 'AUTH_ROLE_M' },
      delete: { label: '角色管理-删除', value: 'AUTH_ROLE_D' },
      authQuery: { label: '角色管理-查询授权', value: 'role_menu' },
      auth: { label: '角色管理-授权', value: 'post_role_menu' },
    },
  },

  personnel: {
    doctor: {
      list: { label: '医生管理-列表', value: 'business_doctor_info' },
      added: { label: '医生管理-新增', value: 'post_business_doctor_info' },
      edit: { label: '医生管理-修改', value: 'put_business_doctor_info' },
      delete: { label: '医生管理-删除', value: 'delete_business_doctor_info' },
      check: { label: '医生管理-审核', value: 'check_business_doctor_info' },
    },
    enterprise: {
      list: { label: '企业管理-列表', value: 'business_enterprise_info' },
      added: { label: '企业管理-新增', value: 'post_business_enterprise_info' },
      edit: { label: '企业管理-修改', value: 'put_business_enterprise_info' },
      delete: { label: '企业管理-删除', value: 'delete_business_enterprise_info' },
    },
    hospital: {
      list: { label: '医院管理-列表', value: 'business_hospital_info' },
      added: { label: '医院管理-新增', value: 'post_business_hospital_info' },
      edit: { label: '医院管理-修改', value: 'put_business_hospital_info' },
      delete: { label: '医院管理-删除', value: 'delete_business_hospital_info' },
    },
    institution: {
      list: { label: '机构管理-列表', value: 'business_institution_info' },
      added: { label: '机构管理-新增', value: 'post_business_institution_info' },
      edit: { label: '机构管理-修改', value: 'put_business_institution_info' },
      delete: { label: '机构管理-删除', value: 'delete_business_institution_info' },
    },
    volunteer: {
      list: { label: '志愿者管理-列表', value: 'business_volunteer_info' },
      added: { label: '志愿者管理-新增', value: 'post_business_volunteer_info' },
      edit: { label: '志愿者管理-修改', value: 'put_business_volunteer_info' },
      delete: { label: '志愿者管理-删除', value: 'delete_business_volunteer_info' },
    },
  },

  science: {
    disease: {
      list: { label: '罕见病列表-列表', value: 'rare_disease' },
      added: { label: '罕见病列表-新增', value: 'post_rare_disease' },
      edit: { label: '罕见病列表-修改', value: 'put_rare_disease' },
      delete: { label: '罕见病列表-删除', value: 'delete_rare_disease' },
    },
    diseaseBusiness: {
      list: { label: '罕见病关联-列表', value: 'rare_disease_business' },
      added: { label: '罕见病关联-新增', value: 'post_rare_disease_business' },
      delete: { label: '罕见病关联-删除', value: 'delete_rare_disease_business' },
    },
    diseaseOrganization: {
      list: { label: '罕见病组织-列表', value: 'tools_disease_organization' },
      added: { label: '罕见病组织-新增', value: 'post_tools_disease_organization' },
      edit: { label: '罕见病组织-修改', value: 'put_tools_disease_organization' },
      delete: { label: '罕见病组织-删除', value: 'delete_tools_disease_organization' },
      organizationAll: { label: '罕见病组织-数据权限', value: 'tools_disease_organization_all' },
    },
    diseaseOrganizationInfo: {
      list: { label: '罕见病组织公告-列表', value: 'tools_disease_organization_info' },
      added: { label: '罕见病组织公告-新增', value: 'post_tools_disease_organization_info' },
      edit: { label: '罕见病组织公告-修改', value: 'put_tools_disease_organization_info' },
      delete: { label: '罕见病组织公告-删除', value: 'delete_tools_disease_organization_info' },
    },
    diseaseOrganizationMember: {
      list: { label: '罕见病组织加入者-列表', value: 'tools_disease_organization_join_member' },
      check: {
        label: '罕见病组织加入者-审核',
        value: 'check_tools_disease_organization_join_member',
      },
      export: {
        label: '罕见病组织加入者-导出',
        value: 'download_tools_disease_organization_join_member',
      },
    },
    medicalGuideline: {
      list: { label: '罕见药典-列表', value: 'tools_medical_guidelines' },
      added: { label: '罕见药典-新增', value: 'post_tools_medical_guidelines' },
      edit: { label: '罕见药典-修改', value: 'put_tools_medical_guidelines' },
      delete: { label: '罕见药典-删除', value: 'delete_tools_medical_guidelines' },
    },
    drug: {
      list: { label: '罕见药品-列表', value: 'tools_medical_drug' },
      added: { label: '罕见药品-新增', value: 'post_tools_medical_drug' },
      edit: { label: '罕见药品-修改', value: 'put_tools_medical_drug' },
      delete: { label: '罕见药品-删除', value: 'delete_tools_medical_drug' },
    },
  },

  social: {
    advocate: {
      list: { label: '倡导管理-列表', value: 'social_advocate' },
      check: { label: '倡导管理-审核', value: 'check_social_advocate' },
      delete: { label: '倡导管理-删除', value: 'delete_social_advocate' },
    },
    advocateReport: {
      list: { label: '倡导举报管理-列表', value: 'social_advocate_report' },
      check: { label: '倡导举报管理-审核', value: 'check_social_advocate_report' },
    },
    help: {
      list: { label: '求助管理-列表', value: 'social_help' },
      check: { label: '求助管理-审核', value: 'check_social_help' },
      delete: { label: '求助管理-删除', value: 'delete_social_help' },
    },
    helpReport: {
      list: { label: '求助举报管理-列表', value: 'social_help_report' },
      check: { label: '求助举报管理-审核', value: 'check_social_help_report' },
    },
    trend: {
      list: { label: '动态管理-列表', value: 'social_trend' },
      check: { label: '动态管理-审核', value: 'check_social_trend' },
      delete: { label: '动态管理-删除', value: 'delete_social_trend' },
    },
    trendReport: {
      list: { label: '动态举报管理-列表', value: 'social_trends_report' },
      check: { label: '动态举报管理-审核', value: 'check_social_trends_report' },
    },
  },

  info: {
    popularMedicine: {
      list: { label: '前沿治疗-列表', value: 'info_popular_medicine' },
      added: { label: '前沿治疗-新增', value: 'post_info_popular_medicine' },
      edit: { label: '前沿治疗-修改', value: 'put_info_popular_medicine' },
      delete: { label: '前沿治疗-删除', value: 'delete_info_popular_medicine' },
    },
    advertisement: {
      list: { label: '广告管理-列表', value: 'info_advertisement' },
      added: { label: '广告管理-新增', value: 'post_info_advertisement' },
      edit: { label: '广告管理-修改', value: 'put_info_advertisement' },
      delete: { label: '广告管理-删除', value: 'delete_info_advertisement' },
    },
    clinicalTrial: {
      list: { label: '新药临床-列表', value: 'info_clinical_trial' },
      added: { label: '新药临床-新增', value: 'post_info_clinical_trial' },
      edit: { label: '新药临床-修改', value: 'put_info_clinical_trial' },
      delete: { label: '新药临床-删除', value: 'delete_info_clinical_trial' },
    },
    clinicalCenter: {
      list: { label: '新药临床中心-列表', value: 'info_clinical_center' },
      added: { label: '新药临床中心-新增', value: 'post_info_clinical_center' },
      edit: { label: '新药临床中心-修改', value: 'put_info_clinical_center' },
      delete: { label: '新药临床中心-删除', value: 'delete_info_clinical_center' },
    },
    popularScience: {
      list: { label: '疾病科普-列表', value: 'info_popular_science' },
      added: { label: '疾病科普-新增', value: 'post_info_popular_science' },
      edit: { label: '疾病科普-修改', value: 'put_info_popular_science' },
      delete: { label: '疾病科普-删除', value: 'delete_info_popular_science' },
    },
  },

  tools: {
    insurancePolicy: {
      list: { label: '医保政策管理-列表', value: 'tools_insurance_policy' },
      added: { label: '医保政策管理-新增', value: 'post_tools_insurance_policy' },
      edit: { label: '医保政策管理-修改', value: 'put_tools_insurance_policy' },
      delete: { label: '医保政策管理-删除', value: 'delete_tools_insurance_policy' },
    },
    insuranceCatalogue: {
      list: { label: '医保药物目录管理-列表', value: 'tools_insure_catalogue' },
      added: { label: '医保药物目录管理-新增', value: 'post_tools_insure_catalogue' },
      edit: { label: '医保药物目录管理-修改', value: 'put_tools_insure_catalogue' },
      delete: { label: '医保药物目录管理-删除', value: 'delete_tools_insure_catalogue' },
    },
    medicalComputation: {
      list: { label: '计算工具管理-列表', value: 'tools_medical_computation' },
      added: { label: '计算工具管理-新增', value: 'post_tools_medical_computation' },
      edit: { label: '计算工具管理-修改', value: 'put_tools_medical_computation' },
      delete: { label: '计算工具管理-删除', value: 'delete_tools_medical_computation' },
    },
  },

  project: {
    list: {
      list: { label: '项目列表-列表', value: 'project' },
      added: { label: '项目列表-新增', value: 'post_project' },
      edit: { label: '项目列表-修改', value: 'put_project' },
      delete: { label: '项目列表-删除', value: 'delete_project' },
    },
    medicalComputation: {
      list: { label: '项目加入者-列表', value: 'project_join_member' },
      check: { label: '项目加入者-审核', value: 'check_project_join_member' },
      delete: { label: '项目加入者-删除', value: 'delete_project_join_member' },
      export: { label: '项目加入者-导出', value: 'download_project_join_member' },
    },
    fileTemplate: {
      list: { label: '项目列表-文件模板列表', value: 'project_file_template' },
      added: { label: '项目列表-文件模板新增', value: 'post_project_file_template' },
      edit: { label: '项目列表-文件模板修改', value: 'put_project_file_template' },
      delete: { label: '项目列表-文件模板删除', value: 'delete_project_file_template' },
    },
    subsidy: {
      list: { label: '项目列表-补助列表', value: 'project_member_subsidy' },
      delete: { label: '项目列表-补助删除', value: 'delete_project_member_subsidy' },
      check: { label: '项目列表-补助审核', value: 'check_project_member_subsidy' },
      pay: { label: '项目列表-支付凭证修改', value: 'pay_project_member_subsidy' },
      export: { label: '项目列表-支付凭证导出', value: 'download_project_member_subsidy' },
    },
  },

  mall: {
    goods: {
      list: { label: '积分商品-列表', value: 'shop_good' },
      added: { label: '积分商品-新增', value: 'post_shop_good' },
      edit: { label: '积分商品-修改', value: 'put_shop_good' },
      delete: { label: '积分商品-删除', value: 'delete_shop_good' },
    },
    order: {
      list: { label: '积分订单-列表', value: 'shop_order' },
      edit: { label: '积分订单-管理', value: 'put_shop_order' },
      delete: { label: '积分订单-删除', value: 'delete_shop_order' },
      export: { label: '积分订单-导出', value: 'download_shop_order' },
    },
  },
}

// 生成选项
export const codeOptions = (() => {
  const res: { label: string; value: string }[] = []
  const loop = (data: Record<string, any>) => {
    Object.values(data).forEach((item) => {
      if (item.label && item.value) {
        res.push(item)
      } else if (isObject(item)) {
        loop(item)
      }
    })
  }

  loop(PD)
  return res
})()

// 用于判断权限相关问题
// 指令使用起来会有不完美的情况，权限指令加在自定义组件上，
// 虽然组件不会在页面上显示，但是组件的实例还是初始化执行了
// 这样会造成组件内部逻辑代码的执行，可能会调取接口之类的
export const usePermissionStore = withToRefs(
  defineStore(
    createNamespace('PERMISSION_INFO'),
    () => {
      const [permissions, setPermissions] = useState<string[]>([])

      const updatePermissions = async (menus: Menu[]) => {
        const permissions: string[] = []
        const loop = (data: Menu[]) => {
          data.forEach((item) => {
            if (item.functionType === '2') {
              permissions.push(item.code)
            }
            if (item.children) {
              loop(item.children)
            }
          })
        }
        loop(menus)
        setPermissions(permissions)
      }

      const has = (key: string) => {
        // 开发环境下，默认权限全部打开，方便调试代码
        if (__DEV__) {
          return true
        }
        return permissions.value.includes(key)
      }

      const or = (keys: string[]) => {
        return keys.find((key) => has(key))
      }

      return { permissions, setPermissions, updatePermissions, has, or }
    },
    {
      persist: false,
    },
  ),
)
