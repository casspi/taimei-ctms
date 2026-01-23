<template>
  <ElDrawer
    v-model="visible"
    class="pro-drawer"
    :class="[id]"
    ref="containerRef"
    :title="computedProps.title"
    destroy-on-close
    append-to-body
    :close-on-click-modal="false"
    :style="computedProps.style"
    @close="hide()"
  >
    <ProSchemaForm
      v-bind="schemaFormProps"
      ref="proSchemaFormRef"
      @change-field="$emit('change-field', $event)"
    >
      <slot></slot>
    </ProSchemaForm>
    <template v-if="computedProps.showCancelButton || computedProps.showConfirmButton" #footer>
      <ElDivider />
      <span class="dialog-footer">
        <ElButton v-if="computedProps.showCancelButton" @click="hide('cancel')">
          {{ computedProps.cancelButtonText }}
        </ElButton>
        <ElButton
          v-if="computedProps.showConfirmButton"
          type="primary"
          @click="handleSubmit"
          :loading="loading"
        >
          {{ computedProps.confirmButtonText }}
        </ElButton>
      </span>
    </template>
  </ElDrawer>
</template>

<script setup lang="ts">
  import { getRandom, pick } from '@daysnap/utils'
  import { useAsyncTask, useVisible } from '@daysnap/vue-use'
  import { computed, nextTick, type Ref, ref, watch } from 'vue'

  import { ProSchemaForm, type ProSchemaFormInstance, proSchemaFormProps } from '../ProSchemaForm'
  import { type ProDrawerProps, proDrawerProps } from './types'

  defineEmits(['change-field'])

  const dynamicProps = ref<Partial<ProDrawerProps>>()
  const props = defineProps(proDrawerProps)

  const computedProps = computed<ProDrawerProps>(() => Object.assign({}, props, dynamicProps.value))

  const schemaFormProps = computed(() => {
    return pick(computedProps.value, Object.keys(proSchemaFormProps) as any)
  })

  const { show, hide, confirm, visible } = useVisible<Partial<ProDrawerProps>, any>({
    showCallback: (options) => {
      dynamicProps.value = options
    },
  })

  const id = `id_${getRandom(10)}`
  watch(visible, (v) => {
    if (v) {
      nextTick(() => {
        const els = document.querySelectorAll(`.${id}`)
        if (els.length) {
          els.forEach((el) => (el.parentElement!.scrollTop = 0))
        }
      })
    }
  })

  const proSchemaFormRef = ref() as Ref<ProSchemaFormInstance>
  const { loading, trigger: handleSubmit } = useAsyncTask(
    async () => {
      // @ts-ignore
      await proSchemaFormRef.value.validate().throw()
      const data = await proSchemaFormRef.value.extractValues()
      const result = await computedProps.value.request?.(data, props.schema!)
      confirm(result)
    },
    {
      throwError: true,
    },
  )

  const getProSchemaFormInstance = () => {
    return proSchemaFormRef.value
  }

  defineExpose({
    getProSchemaFormInstance,
    show,
    hide,
  })
</script>
