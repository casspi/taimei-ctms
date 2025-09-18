import { formatPathParams } from '@daysnap/utils'
import axios, { type AxiosRequestConfig } from 'axios'
import qs from 'qs'

import { useUserinfoStore } from '@/stores'

import { log } from './log'

export const baseURL = window.location.hostname.includes('gyzj.gongyujjh.org.cn')
  ? 'https://gyzj.gongyujjh.org.cn/rare-disease-platform-web/'
  : 'https://gyzj.gongyujjh.org.cn/rare-disease-platform-web-v2/'

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
  (response) => {
    // 对响应数据做点什么
    const { data: respData, config } = response
    log(config, '请求返回 => ', respData)
    if (!respData) {
      return Promise.reject(`网络繁忙，请稍后再试(1)`)
    }
    // eslint-disable-next-line prefer-const
    let { status, message, data } = respData
    // 二进制数据则直接返回
    if (
      response.request.responseType === 'blob' ||
      response.request.responseType === 'arraybuffer'
    ) {
      if (respData.type === 'application/json') return Promise.reject('下载失败！')
      return respData
    }

    if ([2].includes(status)) {
      const { logout } = useUserinfoStore()
      if (!config.url?.includes('logout')) {
        logout()
      }
      return Promise.reject(`登录已失效，请重新登录`)
    }
    if (status !== 0 && status !== 5) {
      // 处理 err 在 data 的情况
      if (!message) {
        const errors: any[] = data?.errors
        if (errors && errors.length) {
          message = errors.map((item) => item.description).join(' ')
        }
      }
      return Promise.reject(message || `网络繁忙，请稍后再试(2)`)
    }

    return data
  },
  (error) => {
    log(error.config, '请求错误 => ', error)

    if (error && error.response) {
      const { status, data: respData } = error.response
      error = status ? `网络繁忙，请稍后再试[${status}]` : `网络繁忙，请稍后再试(3)`
      if (respData && respData.message) {
        error = respData.message
      }
    } else if (error && error.message) {
      error = error.message
    } else {
      error = `网络繁忙，请稍后再试(4)`
    }
    return Promise.reject(error)
  },
)

const curl = <T = any>(
  url: string,
  data: Record<string, any> = {},
  options?: Omit<AxiosRequestConfig, 'params' | 'data' | 'url'> & { isStringify?: boolean },
): Promise<T> => {
  const { method, headers = {} } = (options = Object.assign(
    {
      url,
      method: 'get',
      isStringify: false,
    },
    options,
  ))

  const { userinfo } = useUserinfoStore()
  const { sessionId } = userinfo || {}
  if (sessionId) {
    options.headers = Object.assign(headers, { __gsessionId: sessionId, Authorization: sessionId })
  }

  // 转换 url path params
  if (!(data instanceof FormData)) {
    ;({ path: url, rest: data } = formatPathParams(url, data))

    // content-type application/x-www-form-urlencoded
    // body 传参需要序列化下
    // 兼容老接口
    if (method !== 'get' && options.isStringify) {
      data = qs.stringify(data, { arrayFormat: 'repeat' }) as any
    }
  }

  return instance({
    ...options,
    url,
    [method.toLocaleLowerCase() === 'get' ? 'params' : 'data']: data,
  })
}

export default curl
