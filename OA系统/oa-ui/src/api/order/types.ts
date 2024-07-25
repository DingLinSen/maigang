//申请信息
export type WorkOrder = {
  createBy: string | number | null
  createTime: string | null
  createByName: string | null
  updateBy: string | number | null
  updateTime: string | null
  audit: boolean
  auditBy: string | number | null //审核人
  auditByName: string | null
  auditDate: string | null //审核日期
  audits: AuditsItem[] | any[]
  beginTime: string | null
  chapter: Chapter | any
  delFlag: string | null // 0正常 1删除
  deptId: string | number | null
  end: boolean
  endTime: string | null
  flag: number | string | null //申请标志 1暂存 2发布
  goodApply: GoodApply | any
  id: number | string | null
  leave: LeaveApply | any
  lend: boolean
  params: object | null
  remark: string | null
  status: string | null
  type: string | null //1请假申请 2出差申请 3加班申请 4外出申请 5物资外借 6物资申领 7用章申请 8采购申请 9顺延申请
  urgency: number | string | null//紧急程度 1正常、2重要、3紧急
  workorderBuy: WorkOrderBuy | any
  workorderLend: WorkOrderLend | any
  workorderDelay: WorkorderDelay | any
  workorderOvertime: WorkorderOvertime | any
}

//审核信息
export type AuditsItem = {
  beginTime: string | null
  createBy: string | null
  createByName: string | null
  createTime: string | null
  endTime: string | null
  id: number | string | null
  orderExpain: string | null //审核说明
  orderId: number | string | null //工单id
  orderStep: string | null // 	审核步骤
  params: object | null
  remark: string | null
  roleName: string | null //审批角色名(发布为申请人)
  updateBy: string | null
  updateTime: string | null
}

//用章申请
export type Chapter = {
  beginTime: string | null
  chapterDate: string | null // 用章日期
  chapterUse: string | null // 用章事由
  createBy: string | null
  createTime: string | null
  endTime: string | null
  files: any[] //文件路径
  id: number | string | null
  names: any[] //用章名称
  orderId: number | string | null //工单id
  params: object | null
  remark: string | null
  status: string | null //状态(1 未发布 2已发布 3 部门经理已审核 4已驳回 5待领取 6待归还 7已归还)
  updateBy: string | null
  updateTime: string | null
}

//物资领用
export type GoodApply = {
  beginTime: string | null
  applyDate: string | null // 领用日期
  createBy: string | null
  createTime: string | null
  endTime: string | null
  goods: any[]
  id: number | string | null
  orderExpain: string | null // 审核说明
  orderId: number | string | null //工单id
  params: object | null
  remark: string | null
  status: string | null //资料状态 1未发布、2已发布待审核、3归档、4 驳回 5、待领取
  updateBy: string | null
  updateTime: string | null
}
//请假
export type LeaveApply = {
  applyReason: string | null // 申请事由
  applyType: string | null	//申请类型 a请假（字典）b出差申请（字典）c加班申请（1工作日、2休息日、3节假日、4其他）
  auditSuggestion: string | null //审核意见
  beginTime: string | null
  comment: string | null // 备注
  createBy: string | null
  createTime: string | null
  detailedReasons: string | null // 详细事由
  endDate: string | null // 结束时间
  endTime: string | null
  id: number | string | null
  orderId: number | string | null //工单id
  params: object | null
  remark: string | null
  startDate: string | null // 开始时间
  status: string | null //资料状态:1未发布、2已发布 、3归档 、4.驳回 、5 已审核待归档 6 人事驳回补充信息 7上级已审核
  sumDate: string | null //合计小时数
  updateBy: string | null
  updateTime: string | null
  users: any[]
}

//采购
export type WorkOrderBuy = {
  beginTime: string | null
  createBy: string | null
  createTime: string | null
  endTime: string | null
  estimatedAmount: string | null // 预计总金额(元)
  goods: any[]
  id: number | string | null
  orderId: number | string | null //工单id
  params: object | null
  remark: string | null
  status: string | null //状态(1未发布 2已发布 3上级已审核 4财务经理已审核 5驳回 6采购中 7归档)
  updateBy: string | null
  updateTime: string | null
}

//外借
export type WorkOrderLend = {
  beginTime: string | null
  createBy: string | null
  createTime: string | null
  endTime: string | null
  files: any[] //文件路径
  goodUse: string | null//用途
  id: number | string | null
  names: any[]
  orderExpain: string | null // 审核意见
  orderId: number | string | null //工单id
  params: object | null
  planBackDate: string | null//计划归还日期
  planLendDate: string | null//计划借出日期
  realityBackDate: string | null//实际归还日期
  realityLendDate: string | null//实际借出日期
  remark: string | null
  status: string | null //资料状态 1未发布 2已发布 3部门经理已审核 4驳回 5待借出 6 待归还 7已归还
  types: any[]
  updateBy: string | null
  updateTime: string | null
}

export type WorkorderDelay = {
  id: number | string | null
  orderId: number | string | null //工单id
  reason: string | null // 	顺延事由
  status: string | null //状态 1未发布 2已发布 4驳回 5待归档 7归档 8人事驳回	
  sumDate: string | null // 顺延时长
}

export type WorkorderOvertime = {
  id: number | string | null
  orderId: number | string | null //工单id
  endDate: string | null //	结束时间	
  reason: string | null //	加班事由	
  startDate: string | null //	开始时间
  status: string | null //状态 1 未发布 2 已发布 4驳回 5待归档 7归档 8人事驳回
  type: string | null //1工作日 2休息日 3节假日 4其他
  users: any[]
}
