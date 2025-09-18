import type { Loose } from '@daysnap/types'

import { useProH5Preview } from '@/components'

export function useH5Preview(path: string) {
  const [proH5PreviewInstance, handleH5Preview] = useProH5Preview()

  const trigger = (
    item: Loose<{
      type: string
      id: string
      url: string
    }>,
  ) => {
    // 1 外链 2 内链 3 富文本
    const { type, id, url } = item
    if (type === '1' && url) {
      handleH5Preview(url)
      return
    }
    if (type === '2' && url) {
      handleH5Preview(url)
      return
    }
    if (type === '3') {
      handleH5Preview(`info/${path}/${id}`)
      return
    }
  }

  return [proH5PreviewInstance, trigger] as const
}
