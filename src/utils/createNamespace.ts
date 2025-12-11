import { NAME } from './constants/common'

export const createNamespace = (id: string) => {
  return `${NAME}:${id}`
}
