import { downloadFile } from '@daysnap/utils'
import { type AxiosRequestConfig } from 'axios'

import curl from '../curl'

export default async function download(
  url: string,
  data: Record<string, any> = {},
  options?: Omit<AxiosRequestConfig, 'params' | 'data' | 'url'> & { isStringify?: boolean },
) {
  const { fileName, ...oData } = data
  options = Object.assign(
    {
      responseType: 'blob',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    },
    options,
  )
  const res = await curl(url, oData, options)
  if (!(res instanceof Blob)) throw res || '下载失败'
  const blob = new Blob([res], { type: res.type })
  downloadFile(blob, { fileName: fileName || 'download' })
}
