import { reactive, unref } from 'vue'
// 培育项目状态
const cultivateStatus = reactive<any>([
    {
        label: '培育审批中',
        value: '0'
    },
    {
        label: '进展中',
        value: '1'
    },
    {
        label: '结束转立项',
        value: '2'
    },
    // {
    //   label: '结束转立项',
    //   value: '3'
    // },
    {
        label: '结束终止审批中',
        value: '4'
    },
    {
        label: '结束终止',
        value: '5'
    },
    {
        label: '负责人变更审批中',
        value: '6'
    }
])

//立项项目状态
const approvalStatus = reactive<any>([
    {
        label: '培育转立项审批中',
        value: '1'
    },
    {
        label: '进展中',
        value: '2'
    },
    {
        label: '立项暂停',
        value: '3'
    },
    {
        label: '结束转实施',
        value: '4'
    },
    {
        label: '结束终止',
        value: '5'
    },
    {
        label: '状态变更审批中',
        value: '6'
    },
    {
        label: '里程碑节点审批中',
        value: '7'
    },
    {
        label: '结束转实施',
        value: '8'
    },
    {
        label: '负责人变更审批中',
        value: '9'
    },
    {
        label: '里程碑变更审批中',
        value: '10'
    }
])

//实施项目状态
const implementStatus = reactive<any>([
    {
        label: '立项转实施审批中',
        value: '1'
    },
    {
        label: '实施中',
        value: '2'
    },
    {
        label: '已验收',
        value: '3'
    },
    {
        label: '结束转售后',
        value: '4'
    },
    {
        label: '项目变更审批中',
        value: '5'
    },
    {
        label: '结束转售后',
        value: '6'
    }
])

//售后项目状态
const afterSalesStatus = reactive<any>([
    {
        label: '实施转售后审批中',
        value: '1'
    },
    {
        label: '售后中',
        value: '2'
    },
    {
        label: '项目结束',
        value: '3'
    },
    {
        label: '项目结束审批中',
        value: '4'
    },
    {
        label: '销售经理变更审批中',
        value: '5'
    },
    {
        label: '售后结束',
        value: '6'
    }
])

//科研项目状态
const scientificStatus = reactive<any>([
    {
        label: '自研审批中',
        value: '1'
    },
    {
        label: '进展中',
        value: '2'
    },
    {
        label: '状态变更审批中',
        value: '3'
    },
    {
        label: '负责人变更审批中',
        value: '4'
    },
    {
        label: '结题审批中',
        value: '5'
    },
    {
        label: '已结题',
        value: '6'
    },
    {
        label: '已终止',
        value: '7'
    },
    {
        label: '已暂停',
        value: '8'
    }
])

//获取项目状态
const getProjectStatusLabel = (phase: string, status: string) => {
    let statusLabel = ''
    if (phase == '1') {
        if (status == '3') {
            statusLabel = '结束转立项'
        } else {
            unref(cultivateStatus).map((item: any) => {
                if (status === item.value) {
                    statusLabel = item.label
                }
            })
        }
    } else if (phase == '2') {
        unref(approvalStatus).map((item: any) => {
            if (status === item.value) {
                statusLabel = item.label
            }
        })
    } else if (phase == '3') {
        unref(implementStatus).map((item: any) => {
            if (status === item.value) {
                statusLabel = item.label
            }
        })
    } else if (phase == '4') {
        unref(afterSalesStatus).map((item: any) => {
            if (status === item.value) {
                statusLabel = item.label
            }
        })
    } else if (phase == '5') {
        unref(scientificStatus).map((item: any) => {
            if (status === item.value) {
                statusLabel = item.label
            }
        })
    }
    return statusLabel
}

// 项目类型
const projectType = reactive<any>([
    {
        label: '农业农村',
        value: '0'
    },
    {
        label: '铁路交通',
        value: '1'
    },
    {
        label: '军工',
        value: '2'
    },
    {
        label: '其他',
        value: '3'
    }
])
//获取项目类型
const getProjectTypeLabel = (type: string) => {
    let statusLabel = '--'
    unref(projectType).map((item: any) => {
        if (type === item.value) {
            statusLabel = item.label
        }
    })
    return statusLabel
}

// 项目类型A 1常规项目、2灯塔项目、3流水项目、4补助项目
const projectTypeA = reactive<any>([
    {
        label: '常规项目',
        value: '1'
    },
    {
        label: '灯塔项目',
        value: '2'
    },
    {
        label: '流水项目',
        value: '3'
    },
    {
        label: '补助项目',
        value: '4'
    }
])

// 项目类型B
const projectTypeB = reactive<any>([
    {
        label: '农业农村',
        value: '1'
    },
    {
        label: '铁路交通',
        value: '2'
    },
    {
        label: '军工',
        value: '3'
    },
    {
        label: '其他',
        value: '4'
    }
])

//项目类型C 1自有产品销售、2合作产品销售、3软件开发、4运行维护、5咨询设计、6技术服务、7系统集成
const projectTypeC = reactive<any>([
    {
        label: '自有产品销售',
        value: '1'
    },
    {
        label: '合作产品销售',
        value: '2'
    },
    {
        label: '软件开发',
        value: '3'
    },
    {
        label: '运行维护',
        value: '4'
    },
    {
        label: '咨询设计',
        value: '5'
    },
    {
        label: '技术服务',
        value: '6'
    },
    {
        label: '系统集成',
        value: '7'
    }
])

const purchaseMethod = reactive<any>([
    {
        label: '公开招标',
        value: '1'
    },
    {
        label: '竞争性谈判',
        value: '2'
    },
    {
        label: '竞争性磋商',
        value: '3'
    },
    {
        label: '单一来源',
        value: '4'
    },
    {
        label: '协商签订',
        value: '5'
    }
])

const predictSignedOdds = reactive<any>([
    {
        label: '>90%',
        value: '1'
    },
    {
        label: '70-90%',
        value: '2'
    },
    {
        label: '50-70%',
        value: '3'
    },
    {
        label: '<50%',
        value: '4'
    }
])
const projectPhasesCondition = reactive<any>([
    {
        label: '预算资金已到位',
        value: '1'
    },
    {
        label: '已有预算,资金未到位',
        value: '2'
    },
    {
        label: '已确定,预算未定',
        value: '3'
    },
    {
        label: '前期需求调研',
        value: '4'
    }
])

//转签用户类型A 
const turnUserTypeA = reactive<any>([
    {
        label: '国家级',
        value: '1'
    }, {
        label: '省厅级',
        value: '2'
    }, {
        label: '市局级',
        value: '3'
    }, {
        label: '区县级',
        value: '4'
    }, {
        label: '村镇级',
        value: '5'
    }
])
//转签用户类型B
const turnUserTypeB = reactive<any>([
    {
        label: '国资',
        value: '1'
    }, {
        label: '上市',
        value: '2'
    }, {
        label: '民营',
        value: '3'
    }, {
        label: '外资',
        value: '4'
    }, {
        label: '高校或科研单位',
        value: '5'
    }, {
        label: '军工单位',
        value: '6'
    }
])

//项目来源
const projectSource = reactive<any>([
    {
        label: '自主挖掘',
        value: '1'
    }, {
        label: '合作介绍',
        value: '2'
    }, {
        label: '公司安排',
        value: '3'
    }
])

//获取项目类型
const getProjectSourceLabel = (type: string) => {
    let statusLabel = '--'
    unref(projectSource).map((item: any) => {
        if (type === item.value) {
            statusLabel = item.label
        }
    })
    return statusLabel
}

//项目来源
const projectAffiliation = reactive<any>([
    {
        label: '直签',
        value: '1'
    }, {
        label: '转签',
        value: '2'
    }
])

//巡检周期
const pollingDateType = reactive<any>([
    {
        label: '一周',
        value: '1'
    }, {
        label: '一月',
        value: '2'
    }, {
        label: '一季度',
        value: '3'
    }, {
        label: '一年',
        value: '4'
    }
])
export {
    cultivateStatus, implementStatus, approvalStatus, afterSalesStatus, scientificStatus, projectType, projectTypeA, projectTypeB, projectTypeC,
    purchaseMethod, predictSignedOdds, projectPhasesCondition, turnUserTypeA, turnUserTypeB, projectSource, projectAffiliation, pollingDateType,
    getProjectStatusLabel, getProjectTypeLabel, getProjectSourceLabel
}



