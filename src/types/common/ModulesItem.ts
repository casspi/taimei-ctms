export interface ModulesItem {
  id: string
  name: string
  menus: Menu[]
  className: string
  status: number
  sequence: number
  attributes: Attributes
  appId: string
}

interface Menu {
  id: string
  name: string
  items: Item[]
  className: string
  status: number
  sequence: number
  attributes: Attributes
}

interface Attributes {
  iconColor: string
}

interface Item {
  id: string
  name: string
  pluginId: string
  url: string
  status: number
  sequence: number
  customize: boolean
}
