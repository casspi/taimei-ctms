import { omit } from '@daysnap/utils'

import type { CaptchaInfo, ModulesItem, Userinfo } from '@/types'

import curl from '../curl'
// 获取验证码
export const reqCaptchaInfo = () => curl<CaptchaInfo>('https://vue.ruoyi.vip/prod-api/captchaImage')

// 用户登录
export const doAdminUserLogin = (data: {
  username: string
  password: string
  code: string
  uuid: string
}) => curl('https://vue.ruoyi.vip/prod-api/login', { ...data }, { method: 'POST', isToken: false })

// 用户登出
export const doAdminUserLogout = () =>
  curl('https://vue.ruoyi.vip/prod-api/logout', {}, { isToken: false })

// 获取用户信息
export const getUserInfo = () =>
  curl<Userinfo>('https://vue.ruoyi.vip/prod-api/getInfo').then((res) => omit(res, ['code', 'msg']))

// 获取路由
export const reqRouters = () => curl<any[]>('https://vue.ruoyi.vip/prod-api/getRouters')

// 用户修改密码
export const doAdminUserPasswordChange = (data: {
  oldPassword: string
  password: string
  confirmPassword: string
}) => curl(`system/password`, data, { method: 'POST', isStringify: true })
