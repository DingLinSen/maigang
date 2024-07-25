// 售后项目类型AfterSalesData
export type AfterSalesData = {
    acceptDate: string | null //验收时间
    afterSaleDate: string | null //售后期限
    afterSaleDeadline: string | null //售后截止日期
    afterSalePerson: string | null //售后负责人
    afterSalePersonName: string | null //售后负责人
    afterSalePlan: string | null //售后服务计划
    afterSalePurpose: string | null //售后服务目的
    afterSaleRequire: string | null //售后服务要求
    afterSaleType: string | null //售后服务类型 1本部门 2 研发中心	
    audit: boolean //
    auditSort: string | null //转售后审批流程序号 0 未审批 1销售经理上级已审批 2销售经理上级驳回 3 总经理已审批 4总经理驳回
    beginTime: string | null //
    createBy: number | string
    createTime: string | null
    endTime: string | null
    finalDate: string | null //	尾款时间
    finalMoney: string | null //	尾款金额
    id: number | string | null
    itemNumber: string | null
    leaders: string | null
    ownerName: string | null//	用户名称
    params: object | null
    paymentDate: string | null//回款时间
    paymentFilePath: string | null
    paymentMoney: string | null//回款金额
    paymentRate: string | null//已回款比例
    phase: string | null
    pid: number | string | null
    pmAuditList: any[]
    pmProgressList: any[]
    pollingDate: string | null//巡检开始时间
    pollingDateType: string | null//巡检时间 1 每周 2 每月 3 每季度 4 每年
    projectAffiliation: string | null//项目属性1直签、2转签
    projectTitle: string | null
    projectType: string | null
    remark: string | null
    salesManager: number | string | null //销售经理
    salesManagerLeader: number | string | null //销售经理
    salesManagerLeaderName: string | null //销售经理
    salesManagerName: string | null //销售经理
    status: string | null//1实施转售后审批中，2售后中，3项目结束，4项目结束审批中
    updateBy: string | null //
    updateTime: string | null //
    year: string | null
}

// 数据统计
export type AfterSalestCount = {
    shzxm: number | null // 售后总项目
    shz: number | null // 售后中
    xmjs: number | null // 项目结束
  }

//审核
export type AfterSalesAudit = {
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
    flag:string | null//记录类型(1申请 2审核 3 确认)
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
    type:string | null//审批类型(1 培育审批 2 项目终止审批 3 立项审批 4 里程碑审批 5 项目状态变更审批 6 负责人变更审批 7 实施审批 8 实施变更审批 9 售后审批 10 售后结束审批)	
    remark: string | null
    updateBy: string | null //
    updateTime: string | null //
  }