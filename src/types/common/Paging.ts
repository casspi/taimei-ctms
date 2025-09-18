export type PagingParams<T = unknown> = {
  currentPage: number
  pageSize: number
  keyword?: string
} & T

export interface PagingResult<T = any> {
  total: number
  dataList: T[]
}
