import { useAsyncTask } from '@daysnap/vue-use'
import { reactive, type Ref, ref } from 'vue'

import type { ProSchemaFormInstance } from './'
import type { ProSchemaFormMetadata } from './types'

export function useProSchemaForm<T extends (data: any) => Promise<any>>(
  metadata: ProSchemaFormMetadata,
  task?: T,
  options: {
    instanceRef?: Ref<ProSchemaFormInstance | null>
  } = {},
) {
  const { instanceRef } = options
  const schema = reactive(metadata)
  const proSchemaFormRef = instanceRef ?? ref<ProSchemaFormInstance>()

  const { loading, trigger } = useAsyncTask(
    async () => {
      if (!proSchemaFormRef.value) {
        return
      }
      try {
        await proSchemaFormRef.value.validate()
      } catch {
        throw ''
      }
      const data = await proSchemaFormRef.value.extractValues()
      await task?.(data)
    },
    { throwError: true },
  )

  return {
    schema,
    proSchemaFormRef,
    loading,
    trigger,
  }
}
