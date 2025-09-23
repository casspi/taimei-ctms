import { useState } from '@daysnap/vue-use'
import { defineStore } from 'pinia'

import { doAdminUserLogout, getUserInfo } from '@/api'
import defAva from '@/assets/images/profile.jpg'
import { resetRouter, router } from '@/router'
import type { Userinfo } from '@/types'
import { createNamespace } from '@/utils'

import { withOut } from '../withOut'

export const useUserinfoStore = withOut(
  defineStore(
    createNamespace('USER_INFO'),
    () => {
      const [userinfo, setUserinfo] = useState<Partial<Userinfo>>()

      const logout = () => {
        doAdminUserLogout()
        setUserinfo(void 0)
        resetRouter()
        router.replace('/login')
      }
      const updateUserInfoFromService = async () => {
        const { token, username } = userinfo.value || {}
        const resUserinfo = await getUserInfo()
        setUserinfo({ token, username, ...resUserinfo })
      }

      return { userinfo, setUserinfo, updateUserInfoFromService, logout }
    },
    {
      persist: true,
    },
  ),
)
