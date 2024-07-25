export type TableData = {
  id: string
  createBy: string
  createTime: string
  updateBy: string
  updateTime: string

  deptId: string
  deptName: string
  parentName: string
  parentId: number
  orderNum: number
  ancestors: string
  delFlag: string
  email: string
  leader: string
  params: string
  phone: string
  remark: string
  searchValue: string
  status: string
  perms: string
  icon: string
  parentIds: number[]
}

export type DeptFormData = {
  deptId: string
  deptName: string
  parentName: string
  parentId: number
  orderNum: number
  ancestors: string
  delFlag: string
  email: string
  leader: string | number | string[] | number[]
  params: string
  phone: string
  remark: string
  searchValue: string
  status: string
  parentIds: number[]
}
