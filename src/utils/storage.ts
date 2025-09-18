import { getLocal } from '@daysnap/utils'

import { createNamespace } from './createNamespace'

export const accountInfoStorage = getLocal().generate<{
  userId?: string
  password?: string
  isRemember?: boolean
}>(createNamespace(`ACCOUNT_INFO`))
