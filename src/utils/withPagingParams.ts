import type { PagingParams, PagingResult } from '@/types'

export function withPagingParams<T extends (options: PagingParams) => Promise<PagingResult>>(
  fn: T,
) {
  return async (data?: Omit<Parameters<T>[0], 'currentPage' | 'pageSize'>) =>
    fn({
      ...data,
      currentPage: 1,
      pageSize: 99999,
    }).then<Awaited<ReturnType<T>>['dataList']>((res) => res.dataList)
}
