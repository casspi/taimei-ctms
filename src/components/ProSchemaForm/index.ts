import Component from './ProSchemaForm.vue'

export * from './proSchemaFormFieldManager'
export * from './types'
export * from './useProSchemaForm'

export const ProSchemaForm = Component
export default ProSchemaForm

export type ProSchemaFormInstance = InstanceType<typeof ProSchemaForm>
