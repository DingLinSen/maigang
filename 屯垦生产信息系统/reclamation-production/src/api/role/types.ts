export type RoleData = {
  createBy: string
  createTime: string
  updateBy: string
  updateTime: string
  remark: string
  roleId: string
  roleName: string
  roleKey: string
  roleSort: number | null
  dataScope: string
  menuCheckStrictly: boolean
  deptCheckStrictly: boolean
  status: string
  delFlag: string
  flag: boolean
  menuIds: any
  deptIds: number[]
  permissions: string
  admin: boolean
}

export type DeptTreeData = {
  id: string
  label: string
  children: DeptTreeData[]
}

export type DeptRoleTreeData = {
  checkedKeys: number[]
  menus: DeptTreeData[]
}

export type AuthUserData = {
  admin: boolean
  avatar: string
  createBy: string
  createTime: string
  delFlag: string
  dept: []
  deptId: string
  email: string
  ldapUserId: string
  loginDate: string
  loginIp: string
  nickName: string
  password: string
  phonenumber: string
  postIds: string
  remark: string
  roleId: string
  roleIds: string
  roles: []
  sex: string
  status: string
  updateBy: string
  updateTime: string
  userId: string
  userName: string
}
