import type { CaptchaInfo } from '@/types'

import curl from '../curl'

// 获取验证码
export const reqCaptchaInfo1 = () => curl<CaptchaInfo>('web/captcha')
