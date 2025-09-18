import type { CaptchaInfo, ModulesItem, Userinfo } from '@/types'

import curl from '../curl'

// 获取验证码
export const reqCaptchaInfo = () => curl<CaptchaInfo>('loginAuth/getImage')

// 校验验证码
export const doCaptchaCheck = ({ code, sessionId }: { code: string; sessionId: string }) =>
  curl(
    'loginAuth/validImage',
    { code },
    {
      method: 'POST',
      headers: {
        __gsessionId: sessionId,
        Authorization: sessionId,
      },
      isStringify: true,
    },
  )

// 用户登录
export const doAdminUserLogin = (data: { userId: string; password: string }) =>
  curl('login', { ...data, autoLogin: 'N' }, { method: 'POST', isStringify: true }).then<Userinfo>(
    (res) => Object.assign({ sessionId: res.__gsessionId }, res.loginInfo),
  )

// 用户登出
export const doAdminUserLogout = () => curl('logout')

// 获取用户信息
export const reqAdminUserInfo = (data: { userId: string }) =>
  curl<Userinfo>('main/loginInfo', data, { method: 'POST' })

// 获取所有模块
export const reqModulesList = () => curl<ModulesItem[]>('main/modules', {}, { method: 'POST' })

// 用户修改密码
export const doAdminUserPasswordChange = (data: {
  oldPassword: string
  password: string
  confirmPassword: string
}) => curl(`system/password`, data, { method: 'POST', isStringify: true })
