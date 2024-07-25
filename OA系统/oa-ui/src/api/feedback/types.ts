//申请信息
export type FeedbackBean = {
  createUser: string | number | null
  createTime: string | null
  createUserName: string | null
  editUser: string | number | null
  editTime: string | null
  id: number | string | null
  title: object | null
  remark: string | null
  status: string | null // 状态 0 未审核 1待评估 2已驳回 3已通过
  type: string | null
  auditList: FeedbackAuditBean[]
  auditor: string | number | null//审核人
  auditorName: string | null // 审核人名
  auditTime: string | null // 审核时间
  authFlag: string | null // 审核标识 0有审核权限
  content: string | null // 内容
  filePaths: string | null // 文件
}


export type FeedbackAuditBean = {
  feedbackId: number | string | null //反馈意见id
  id: number | string | null
  createBy: number | string | null //创建人
  createByName: string | null //创建人
  createTime: string | null //创建时间
  feedbackStep: string | null //审核步骤
  remark: string | null // 	备注
  roleName: string | null // 审批角色名(发布为申请人)
  updateBy: number | string | null // 修改人
  updateTime: string | null //修改时间
}