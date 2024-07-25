// 培育项目类型
export type CultivateData = {
  id: number | string // id
  pyzxm: number | null // 培育总项目
  pyspz: number | null // 培育审批中
  jszz: number | null // 结束终止
  jzz: number | null // 进展中
  address: string // 地址
  delFlag: string // 0 可用 1 删除
  itemNumber: string // 项目编号
  lat: string //  纬度
  llng: string // 经度
  pmAuditList: pmAudit[] // 审批记录
  pmProgressList: pmProgressList[] // 进展/变更/指示 类型 1 进展 2 变更 3 指示
  phase: string // 阶段  1培育 2立项 3 实施 4 售后
  workflowInstanceId: string | null // 流程id
  projectTitle: string // 项目名称
  projectType: string // 项目类型(0农业农村、1铁路交通、2军工、3其它)
  province: string // 省份
  year: string // 年份
  ownerName: string // 用户名称
  planContent: string // 项目内容
  estimatedAmount: number | undefined // 预计金额
  principalPersonLeaderName: string // 主要负责人
  principalPersonName: string // 主要负责人
  principalPerson: (string | number)[] | string | number
  fileList: string // 上传文件列表
  filePath: string // 上传文件列表
  createBy: string
  createByName: string // 申请人
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
  flag: boolean
  menuIds: number[]
  deptIds: number[]
  permissions: string
  admin: boolean
}
// 数据统计
export type cultivateCount = {
  pyzxm: number | null // 培育总项目
  pyspz: number | null // 培育审批中
  jszz: number | null // 结束终止
  jzz: number | null // 进展中
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

export type pmAudit = {
  createByName: string // 申请人
  auditDate: string // 审批日期
  auditId: number | string // 申请审批id
  bidResultUrl: string // 投标分析结果地址
  bidUrl: string // 投标文件地址
  content: string // 审批内容
  flag: string // 	记录类型(1申请 2审核 3 确认)
  phase: string // 	阶段 1培育 2立项 3实施 4售后
  reason: string // 驳回理由
  status: string // 是否同意 1 同意 2 驳回
  type: string // 	审批类型(1 培育审批 2 项目终止审批 3 立项审批 4 里程碑审批 5 项目状态变更审批 6 负责人变更审批 7 实施审批)
}

// 项目进展
export type pmProgressList = {
  content: string // 项目进展/指示
  filePath: string // 文件地址
  phase: string // 阶段 1培育 2立项 3实施 4售后
  progressDate: string // 进展日期
  type: string // 	类型 1 进展 2 变更 3 指示
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
