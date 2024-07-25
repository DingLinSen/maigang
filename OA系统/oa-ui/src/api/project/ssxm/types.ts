// 培育项目类型ImplementData
export type ImplementData = {
  id: number | string // id
  acceptDate: string | null //申请时间
  auditSort: number | string //转实施审批流程序号 1项目经理已确认，2销售经理已确认，3项目经理上级已确认 ，4销售经理上级已确认， 5项目经理上级已驳回，6销售经理上级已驳回,7 总经理已确认， 8 总经理已驳回
  auditTime: string | null //申请时间
  beginTime: string | null
  bidResultUrl: string | null //投标分析结果地址
  bidUrl: string | null //投标文件地址
  changeSort:number | string //项目变更审批流程号 1项目经理发起 2销售经理发起 3 上级负责人已确认 4 上级负责人驳回 5 总经理已确认 6 总经理驳回
  contractMoney: number | string | null //合同金额
  contractNumber: string | null //项目合同编号
  contractSignDate: string | null //合同签订日期
  contractSignUnit: string | null //合同签订单位
  createBy: number | string
  createTime: string | null
  endTime: string | null
  gmAffirm: string | null //总经理确认
  gmSignature: string | null //总经理_签名
  gmSignatureDate: string | null //总经理_签名日期
  implementDept: number | string | null //实施部门
  itemNumber: string | null
  lastUserUnit: string | null //最终用户名称
  params: object | null
  phase: string | null
  pid: number | string
  pmProgressList: any[]
  pmSignature: string | null //项目经理_签名
  pmSignatureDate: string | null //	项目经理_签名日期
  pmUpprincipalSignature: string | null //项目经理_分管负责人_签名
  pmUpprincipalSignatureDate: string | null //项目经理_分管负责人_签名日期
  predictAcceptDate: string | null //预计验收日期
  predictPaymentDate: string | null //预计回款日期
  projectAffiliation: string | null //项目属性1直签、2转签
  projectContent: string | null //项目内容及实施计划
  projectManager: number | string | null //项目经理
  projectManagerName: string | null //项目经理
  projectTeam: string | null //项目组其它人员及职责
  projectTitle: string | null
  projectType: string | null
  projectTypeCompany: number | string | null //项目类型A1常规项目、2灯塔项目、3流水项目、4补助项目
  projectTypeIndustry: number | string | null //项目类型B1农业农村、2铁路交通、3军工、4其它
  projectTypeSales: number | string | null //项目类型C1自有产品销售、2合作产品销售、3软件开发、4运行维护、5咨询设计、6技术服务、7系统集成
  remark: string | null
  saleContractUrl: string | null //销售合同地址
  salesManager: number | string | null //销售经理
  salesManagerName: string | null //销售经理
  searchValue: string | null
  smSignature: string | null //销售经理_签名
  smSignatureDate: string | null //	销售经理_签名日期
  smUpprincipalSignature: string | null //	销售经理_分管负责人_签名日期
  smUpprincipalSignatureDate: string | null //	销售经理_分管负责人_签名日期
  status: string | null //	状态 1立项转实施审批中，2实施中，3已验收，4已回款转售后, 5项目变更审批中,6已回款转售后审批中
  updateBy: string | null //
  updateTime: string | null //
  upprincipalAffirm: string | null //分管负责人确认
  year: string | null
}

// 数据统计
export type ImplementCount = {
  sszxm: number | null // 实施总项目
  ssz: number | null // 实施中
  yys: number | null // 已验收
  yhkzsh: number | null // 已回款转售后
}

//
export type ImplementAudit = {
  adjustDate: string | null
  adjustItemAccecptDate: string | null
  adjustItemOther: string | null
  adjustItemPaymentDate: string | null
  adjustItemPm: string | null
  adjustItemSm: string | null
  adjustReason: string | null
  auditId: number | string | null
  auditTime: string | null //申请时间
  beginTime: string | null
  createBy: number | string
  createTime: string | null
  endTime: string | null
  gmSignature: string | null //总经理_签名
  gmSignatureDate: string | null //总经理_签名日期
  id: number | string // id
  params: object | null
  pid: number | string
  pmSignature: string | null //项目经理_签名
  pmSignatureDate: string | null //	项目经理_签名日期
  pmUpprincipalSignatureDate: string | null //项目经理_分管负责人_签名日期
  remark: string | null
  smSignature: string | null //销售经理_签名
  smSignatureDate: string | null //	销售经理_签名日期
  smUpprincipalSignature: string | null //	销售经理_分管负责人_签名日期
  smUpprincipalSignatureDate: string | null //	销售经理_分管负责人_签名日期
  updateBy: string | null //
  updateTime: string | null //
}


export type AfterSalesApply = {
  pid: number | string
  id: number | string // id
  projectTitle: string | null
  itemNumber: string | null
  lastUserUnit: string | null //最终用户名称
  auditSort: number | string //转实施审批流程序号 1项目经理已确认，2销售经理已确认，3项目经理上级已确认 ，4销售经理上级已确认， 5项目经理上级已驳回，6销售经理上级已驳回,7 总经理已确认， 8 总经理已驳回
  auditTime: string | null //申请时间
  beginTime: string | null
  acceptDate: string | null, // 验收日期
  paymentDate: string | null, // 回款日期
  paymentMoney: string | null, //回款金额
  finalDate: string | null, //尾款时间
  finalMoney: string | null, //尾款金额
  paymentRate: string | null, //已回款比例
  afterSaleDate: string | null, //售后期限
  afterSaleDeadline: string | null, //售后截止日期
  pollingDate: string | null, //巡检开始时间
  pollingDateType: string | null, //巡检时间 1 每周 2  每月 3  每季度 4 每年
  afterSaleRequire: string | null, //售后服务要求
  afterSalePurpose: string | null, //售后服务目的
  afterSalePlan: string | null, //售后服务计划
  alterSaleType: string | null, //售后服务类型 1本部门 2 研发中心
  updateBy: string | null //
  updateTime: string | null //
  paymentFilePath: string | null //
}