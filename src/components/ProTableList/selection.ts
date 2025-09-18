import { type Ref } from 'vue'

export const multipleSelectionKey = Symbol('multipleSelection') as InjectionKey<Ref<any[]>>
