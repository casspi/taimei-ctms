import { formatPathParams } from '@daysnap/utils'
import axios, { type AxiosRequestConfig } from 'axios'
import qs from 'qs'

import { useUserinfoStore } from '@/stores'
import { errorCode } from '@/utils'

import { log } from './log'

export const baseURL = 'https://vue.ruoyi.vip/prod-api/'

const instance = axios.create({
  baseURL,
  timeout: 60 * 1000,
  responseType: 'json',
  headers: {
    // 'x-array-format': 'repeat',
  },
})

instance.interceptors.request.use(
  (config) => {
    // 在发送请求之前做些什么
    const { data, params } = config
    log(config, `请求参数 =>`, data || params)
    return config
  },
  (error) => {
    // 对请求错误做些什么
    return Promise.reject(error)
  },
)

// 添加响应拦截器
instance.interceptors.response.use(
  (res) => {
    const { data: respData, config } = res
    log(config, '请求返回 => ', respData)
    if (!respData) {
      return Promise.reject(`网络繁忙，请稍后再试(1)`)
    }
    // 未设置状态码则默认成功状态
    const code = respData.code || 200
    // 获取错误信息
    const msg = errorCode[code as keyof typeof errorCode] || res.data.msg || errorCode['default']
    // 二进制数据则直接返回
    if (res.request.responseType === 'blob' || res.request.responseType === 'arraybuffer') {
      return res.data
    }
    if (code === 401) {
      const { logout } = useUserinfoStore()
      if (!config.url?.includes('logout')) {
        logout()
      }
      return Promise.reject(`登录已失效，请重新登录`)
    } else if (code === 500) {
      return Promise.reject(new Error(msg))
    } else if (code === 601) {
      return Promise.reject(new Error(msg))
    } else if (code !== 200) {
      return Promise.reject(`网络繁忙，请稍后再试(2)`)
      // return Promise.reject('error')
    } else {
      return Promise.resolve(respData)
    }
  },
  (error) => {
    log(error.config, '请求错误 => ', error)
    // eslint-disable-next-line prefer-const
    let { message, response } = error
    if (response) {
      const { code, data: respData } = response
      message = code ? `网络繁忙，请稍后再试[${code}]` : `网络繁忙，请稍后再试(3)`
      if (respData && respData.message) {
        message = respData.message
      }
    } else if (message == 'Network Error') {
      message = '后端接口连接异常'
    } else if (message.includes('timeout')) {
      message = '系统接口请求超时'
    } else if (message.includes('Request failed with status code')) {
      message = '系统接口' + message.substr(message.length - 3) + '异常'
    } else {
      message = `网络繁忙，请稍后再试(4)`
    }
    return Promise.reject(message)
  },
)

const curl = <T = any>(
  url: string,
  data: Record<string, any> = {},
  options?: Omit<AxiosRequestConfig, 'params' | 'data' | 'url'> & {
    isStringify?: boolean
    isToken?: boolean
  },
): Promise<{ code: number; msg: string } & T> => {
  const {
    method,
    headers = {},
    isToken,
  } = (options = Object.assign(
    {
      url,
      method: 'get',
      isStringify: false,
      isToken: true,
    },
    options,
  ))

  const { userinfo } = useUserinfoStore()
  const { token } = userinfo || {}
  if (isToken && token) {
    options.headers = Object.assign(headers, { Authorization: 'Bearer ' + token })
  }

  // 转换 url path params
  if (!(data instanceof FormData)) {
    ;({ path: url, rest: data } = formatPathParams(url, data))

    // content-type application/x-www-form-urlencoded
    // body 传参需要序列化下
    // 兼容老接口
    // if (method !== 'get' && options.isStringify) {
    //   data = qs.stringify(data, { arrayFormat: 'repeat' }) as any
    // }
  }

  return instance({
    ...options,
    url,
    [method.toLocaleLowerCase() === 'get' ? 'params' : 'data']: data,
  })
}

export default curl
