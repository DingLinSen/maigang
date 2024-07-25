export type MenuData = {
  createBy: string
  createTime: string
  updateBy: string
  updateTime: string
  remark: string
  menuId: string
  menuName: string
  parentName: string
  parentId: number
  orderNum: number | null
  path: string
  component: string
  query: string
  isFrame: string
  isCache: string
  menuType: string
  visible: string
  status: string
  perms: string
  icon: string | null
  parentIds: number[]
  children: MenuData[]
}

export type MenuTreeData = {
  id: string
  label: string
  children: MenuTreeData[]
}

export type MenuRoleTreeData = {
  checkedKeys: number[]
  menus: MenuTreeData[]
}
