import curl from '../curl'

// 删除
export const doFileDelete = (data: { filePath: string }) =>
  curl(`common/upload/delete`, data, { method: 'DELETE' })

// 下载
export const doFileDownload = (data: { filePath: string }) => curl(`common/upload/download`, data)

// 上传
export const doFileUpload = (data: { file: File }) => {
  const fd = new FormData()
  Object.entries(data).forEach(([key, item]) => {
    fd.append(key, item as any)
  })
  return curl(`common/upload/upload`, fd, { method: 'POST' })
}
