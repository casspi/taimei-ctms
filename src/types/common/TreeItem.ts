export interface TreeItem {
  value: string
  text: string
  state: string
  children: TreeItem[]
  attributes: {
    departmentId: string
    unitId: string
  }
}
