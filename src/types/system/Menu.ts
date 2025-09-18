export interface Menu {
  code: string
  component: string
  createBy: string
  createDt: string
  functionType: string
  hidden: boolean
  icon: string
  id: string
  image: string
  index: number
  modifyBy: string
  modifyDt: string
  moduleId: string
  name: string
  parentId: string
  path: string
  title: string
  type: string

  children?: Menu[]
}
