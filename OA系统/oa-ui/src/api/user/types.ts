// 用户管理 -- type
export type UserData = {
  user: {
    userId: undefined | number
    createBy: string // 创建人
    eeno: string | null
    createTime: string // 创建时间
    email: null // 邮箱
    mailbox: null
    updateBy: string // 修改人
    updateTime: string // 修改时间
    deptName: string // 部门名称
    deptId: number | null // 部门id
    remark: string // 备注
    roles: number[] | string[] //
    roleIds: number[] | string[] //
    postIds: number[] | string[] //
    roleId: number | string // 角色id
    roleName: string // 角色名称
    roleKey: string
    roleSort: number | null
    dataScope: string
    phonenumber: null // 手机号码
    menuCheckStrictly: boolean
    deptCheckStrictly: boolean
    status: string // 状态
    sex: string // 性别
    password: string | number // 性别
    delFlag: string
    flag: boolean
    menuIds: number[]
    deptIds: number[]
    permissions: string
    admin: boolean
  }
  userId: undefined | number | string | null
  createBy: string // 创建人
  createTime: string // 创建时间
  email: string | null// 邮箱
  mailbox: null
  updateBy: string // 修改人
  updateTime: string // 修改时间
  deptName: string // 部门名称
  deptId: number | null // 部门id
  remark: string // 备注
  roles: number[] | string[] //
  roleIds: number[] | string[] //
  postIds: number[] | string[] //
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
  password: string | number // 性别
  delFlag: string
  flag: boolean
  menuIds: number[]
  deptIds: number[]
  permissions: string
  userName: string // 用户名
  admin: boolean
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
