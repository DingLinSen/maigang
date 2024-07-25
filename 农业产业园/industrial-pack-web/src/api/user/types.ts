// 用户管理 -- type
export type UserData = {
  userId: undefined | number | string
  createBy: string // 创建人
  createTime: string // 创建时间
  email: string | null // 邮箱
  mailbox: null
  updateBy: string // 修改人
  updateTime: string // 修改时间
  deptName: string // 部门名称
  deptId: number | null // 部门id
  remark: string // 备注
  posts: number[] | string[] // 岗位
  roles: number[] | string[] // 角色
  roleIds: any //
  postIds: any //
  postId: any
  roleId: number | string // 角色id
  roleName: string // 角色名称
  roleKey: string
  roleSort: number | null
  dataScope: string
  phonenumber: string | null // 手机号码
  menuCheckStrictly: boolean
  deptCheckStrictly: boolean
  status: string // 状态
  sex: string // 性别
  delFlag: string
  flag: boolean
  menuIds: number[]
  deptIds: number[]
  permissions: string
  admin: boolean
  password: string
  user: null
}

export type DeptTreeData = {
  id: string
  label: string
  children: DeptTreeData[]
}

export type DeptUserTreeData = {
  checkedKeys: number[]
  menus: DeptTreeData[]
}
