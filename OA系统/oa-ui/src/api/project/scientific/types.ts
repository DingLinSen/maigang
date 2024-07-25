// 科研项目类型ScientificData
export type ScientificData = {
  achievement: string | null //研究成果及形式
  approvalReason: string | null //立项目的
  audit: boolean //是否可以审核
  auditSort: string | null //转售后审批流程序号 1 待审批 2 上级负责人审批 3上级负责人驳回 4总经理审批 5总经理驳回
  beginTime: string | null //
  createBy: number | string
  createTime: string | null
  delFlag: string | null // 0 可用 1 删除
  economicBenefits: string | null // 预计经济效益
  edit: boolean //是否可以编辑
  endTime: string | null
  id: number | string | null
  pid: number | string | null
  innovatePoint: string | null // 创新点
  itemNumber: string | null //	项目编号
  leaders: string | null
  params: object | null
  participants: string | null//项目主要参与人
  pmAuditList: any[]
  pmProgressList: any[]
  principalPerson: string | null//	负责人
  principalPersonLeader: string | null//
  principalPersonLeaderName: string | null//
  principalPersonName: string | null//
  projectPlan: string | null//项目方案
  projectTitle: string | null//项目名
  remark: string | null
  status: string | null//项目状态 1 审批中 2进展中 3状态变更审批中 4负责人变更审批中 5结题审批中 6已结题 7已终止 8已暂停
  timeAndPhase: string | null //项目起止时间及阶段划分
  type: string | null //项目类别 1新产品研发项目 2技术攻关项目 3 技改项目
  updateBy: string | null //
  updateTime: string | null //
  year: string | null
}

// 数据统计
export type ScientifictCount = {
  zxm: number | null // 总项目
  jzz: number | null // 进展中
  jszz: number | null // 结束终止
  yzt: number | null // 已暂停
}

//审核
export type ScientificAudit = {
  acceptDate: string | null //验收日期
  acceptFilePath: string | null //验收材料url
  acceptFileReason: string | null//验收材料原因
  acceptReportFilePath: string | null//验收报告url
  acceptReportFileReason: string | null//验收报告原因
  auditDate: string | null//审批日期
  auditId: number | string | null // 申请审批id
  bidReason: string | null//投标文件原因
  bidResultReason: string | null//投标结果文件原因
  bidUrl: string | null//投标文件地址
  bidResultUrl: string | null//投标分析结果地址
  changeApplyFlag: string | null//项目变更申请标志 0暂停，1终止，2重启
  content: string | null//审批内容
  createBy: number | string
  createByName: string | null
  createTime: string | null
  endDate: string | null //项目结束日期
  endTime: string | null
  flag: string | null//记录类型(1申请 2审核 3 确认)
  id: number | string // id
  params: object | null
  paymentFilePath: string | null//回款记录url
  paymentFileReason: string | null//回款记录原因
  phase: string | null//阶段 1培育 2立项 3实施 4售后
  photoFilePath: string | null//实施照片url
  photoFileReason: string | null//实施照片原因
  pid: number | string
  predictAcceptDate: string | null//预计验收日期
  predictPaymentDate: string | null//预计回款日期
  projectContent: string | null//项目内容及实施计划
  projectTeam: string | null//项目组其它人员及职责
  reason: string | null//驳回理由
  saleContractUrl: string | null//销售合同地址
  salesContractReason: string | null//销售合同原因
  status: string | null//是否同意 1 同意 2 驳回
  type: string | null//审批类型(1 培育审批 2 项目终止审批 3 立项审批 4 里程碑审批 5 项目状态变更审批 6 负责人变更审批 7 实施审批 8 实施变更审批 9 售后审批 10 售后结束审批)	
  remark: string | null
  updateBy: string | null //
  updateTime: string | null //
}