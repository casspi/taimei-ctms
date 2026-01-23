import banana from '@daysnap/banana'
import { type Ref, ref } from 'vue'

import { type ProSchemaFormMetadata } from '../ProSchemaForm'
import type { ProDrawerInstance } from '.'

export interface UseProDrawerOptions<T = any> {
  instanceRef?: Ref<ProDrawerInstance>
  onGenerate?: (schema: ProSchemaFormMetadata, event?: T, ...args: any[]) => void
  onSuccess?: (schema: ProSchemaFormMetadata, event?: T, ...args: any[]) => void
}

export function useProDrawer<T = any>(
  generator: () => ProSchemaFormMetadata | Promise<ProSchemaFormMetadata>,
  task: (
    schema: ProSchemaFormMetadata,
    instanceRef: Ref<ProDrawerInstance>,
    event?: T,
    ...args: any[]
  ) => Promise<any>,
  options: UseProDrawerOptions<T> = {},
) {
  const { onGenerate, onSuccess, instanceRef } = options

  const proDrawerFormRef = instanceRef ?? (ref() as Ref<ProDrawerInstance>)

  const schema = ref() as Ref<ProSchemaFormMetadata>
  const trigger = async (event?: T, ...args: any[]) => {
    schema.value = await generator()
    if (event) {
      banana.assignment(event, schema.value as any)
    }

    onGenerate?.(schema.value, event, ...args)

    await task(schema.value, proDrawerFormRef, event, ...args)

    onSuccess?.(schema.value, event, ...args)
  }

  return [proDrawerFormRef, trigger, schema] as const
}

export function createProDrawer<T = any>(
  generator: () => ProSchemaFormMetadata,
  task: (
    schema: ProSchemaFormMetadata,
    instanceRef: Ref<ProDrawerInstance>,
    event?: T,
    ...args: any[]
  ) => Promise<any>,
  opt?: UseProDrawerOptions<T>,
) {
  return function (options?: UseProDrawerOptions<T>) {
    return useProDrawer<T>(generator, task, {
      ...opt,
      ...options,
      onGenerate: (...args) => {
        opt?.onGenerate?.(...args)
        options?.onGenerate?.(...args)
      },
    })
  }
}
