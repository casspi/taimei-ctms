import { isPhone } from '@daysnap/utils'
import type { FormItemRule } from 'element-plus'

export const phoneRule: FormItemRule = {
  validator: (_, v) => (v ? isPhone(v) : true),
  message: '输入有误',
}
