// 过滤操作类型
export const filterType = (type: string, row: any): string => {
    let endText = ''
    switch (type) {
        case '1':
            if (row.phase === '1') {
                if (row.type === '1') {
                    endText = '培育项目'
                }
                if (row.type === '2') {
                    endText = '结束终止'
                }
                if (row.type === '3') {
                    endText = '结束转立项'
                }
                if (row.type === '4') {
                    endText = '里程碑'
                }
                if (row.type === '5') {
                    endText = '项目状态变更中'
                }
                if (row.type === '6') {
                    endText = '培育负责人变更'
                }
                if (row.type === '7') {
                    endText = '实施项目'
                }
                if (row.type === '8') {
                    endText = '实施变更审批'
                }
                if (row.type === '9') {
                    endText = '售后项目'
                }
                if (row.type === '10') {
                    endText = ' 售后结束审批'
                }
            }
            if (row.phase === '2') {
                if (row.type === '1') {
                    endText = '培育项目'
                }
                if (row.type === '2') {
                    endText = '结束终止'
                }
                if (row.type === '3') {
                    endText = '结束转立项'
                }
                if (row.type === '4') {
                    endText = '里程碑'
                }
                if (row.type === '5') {
                    endText = '项目状态变更'
                }
                if (row.type === '6') {
                    endText = '立项负责人变更'
                }
                if (row.type === '7') {
                    endText = '实施审批'
                }
                if (row.type === '8') {
                    endText = '实施变更审批'
                }
                if (row.type === '9') {
                    endText = '售后项目'
                }
                if (row.type === '10') {
                    endText = ' 售后结束审批'
                }
                if (row.type === '13') {
                    endText = '里程碑变更'
                }
                if (row.type === '-1') {
                    endText = '里程碑1'
                }
                if (row.type === '-2') {
                    endText = '里程碑2'
                }
                if (row.type === '-3') {
                    endText = '里程碑3'
                }
            }
            if (row.phase === '3') {
                if (row.type === '1') {
                    endText = '培育项目'
                }
                if (row.type === '2') {
                    endText = '结束终止'
                }
                if (row.type === '3') {
                    endText = '结束转立项'
                }
                if (row.type === '4') {
                    endText = '里程碑'
                }
                if (row.type === '5') {
                    endText = '项目状态变更'
                }
                if (row.type === '6') {
                    endText = '实施负责人变更'
                }
                if (row.type === '7') {
                    endText = '实施审批'
                }
                if (row.type === '8') {
                    endText = '实施变更审批'
                }
                if (row.type === '9') {
                    endText = '售后项目'
                }
                if (row.type === '10') {
                    endText = ' 售后结束审批'
                }
                if (row.type === '-1') {
                    endText = '里程碑1'
                }
                if (row.type === '-2') {
                    endText = '里程碑2'
                }
                if (row.type === '-3') {
                    endText = '里程碑3'
                }
            }
            if (row.phase === '4') {
                if (row.type === '1') {
                    endText = '培育项目'
                }
                if (row.type === '2') {
                    endText = '结束终止'
                }
                if (row.type === '3') {
                    endText = '结束转立项'
                }
                if (row.type === '4') {
                    endText = '里程碑'
                }
                if (row.type === '5') {
                    endText = '项目状态变更'
                }
                if (row.type === '6') {
                    endText = '售后负责人变更'
                }
                if (row.type === '7') {
                    endText = '实施审批'
                }
                if (row.type === '8') {
                    endText = '实施变更审批'
                }
                if (row.type === '9') {
                    endText = '售后项目'
                }
                if (row.type === '10') {
                    endText = ' 售后结束审批'
                }
                if (row.type === '-1') {
                    endText = '里程碑1'
                }
                if (row.type === '-2') {
                    endText = '里程碑2'
                }
                if (row.type === '-3') {
                    endText = '里程碑3'
                }
            }
            return endText + '申请'
        case '2':
            if (row.phase === '1') {
                if (row.type === '1') {
                    endText = '培育项目'
                }
                if (row.type === '2') {
                    endText = '结束终止'
                }
                if (row.type === '3') {
                    endText = '结束转立项'
                }
                if (row.type === '4') {
                    endText = '里程碑'
                }
                if (row.type === '5') {
                    endText = '项目状态变更'
                }
                if (row.type === '6') {
                    endText = '培育负责人变更'
                }
                if (row.type === '7') {
                    endText = '实施项目'
                }
                if (row.type === '8') {
                    endText = '实施变更审批'
                }
                if (row.type === '9') {
                    endText = '售后项目'
                }
                if (row.type === '10') {
                    endText = '售后结束审批'
                }
                if (row.type === '-1') {
                    endText = '里程碑1'
                }
                if (row.type === '-2') {
                    endText = '里程碑2'
                }
                if (row.type === '-3') {
                    endText = '里程碑3'
                }
            }
            if (row.phase === '2') {
                if (row.type === '1') {
                    endText = '培育项目'
                }
                if (row.type === '2') {
                    endText = '结束终止'
                }
                if (row.type === '3') {
                    endText = '结束转立项'
                }
                if (row.type === '4') {
                    endText = '里程碑'
                }
                if (row.type === '5') {
                    endText = '项目状态变更'
                }
                if (row.type === '6') {
                    endText = '立项负责人变更'
                }
                if (row.type === '7') {
                    endText = '实施项目'
                }
                if (row.type === '13') {
                    endText = '里程碑变更'
                }
                if (row.type === '-1') {
                    endText = '里程碑1'
                }
                if (row.type === '-2') {
                    endText = '里程碑2'
                }
                if (row.type === '-3') {
                    endText = '里程碑3'
                }
            }
            if (row.phase === '3') {
                if (row.type === '1') {
                    endText = '培育项目'
                }
                if (row.type === '2') {
                    endText = '结束终止'
                }
                if (row.type === '3') {
                    endText = '结束转立项'
                }
                if (row.type === '4') {
                    endText = '里程碑'
                }
                if (row.type === '5') {
                    endText = '项目状态变更'
                }
                if (row.type === '6') {
                    endText = '实施负责人变更'
                }
                if (row.type === '7') {
                    endText = '实施项目'
                }
                if (row.type === '8') {
                    endText = '实施变更审批'
                }
                if (row.type === '9') {
                    endText = '售后项目'
                }
                if (row.type === '10') {
                    endText = '售后结束审批'
                }
                if (row.type === '-1') {
                    endText = '里程碑1'
                }
                if (row.type === '-2') {
                    endText = '里程碑2'
                }
                if (row.type === '-3') {
                    endText = '里程碑3'
                }
            }
            if (row.phase === '4') {
                if (row.type === '1') {
                    endText = '培育项目'
                }
                if (row.type === '2') {
                    endText = '结束终止'
                }
                if (row.type === '3') {
                    endText = '结束转立项'
                }
                if (row.type === '4') {
                    endText = '里程碑'
                }
                if (row.type === '5') {
                    endText = '项目状态变更'
                }
                if (row.type === '6') {
                    endText = '售后负责人变更'
                }
                if (row.type === '7') {
                    endText = '实施项目'
                }
                if (row.type === '8') {
                    endText = '实施变更审批'
                }
                if (row.type === '9') {
                    endText = '售后项目'
                }
                if (row.type === '10') {
                    endText = '售后结束审批'
                }
                if (row.type === '-1') {
                    endText = '里程碑1'
                }
                if (row.type === '-2') {
                    endText = '里程碑2'
                }
                if (row.type === '-3') {
                    endText = '里程碑3'
                }
            }
            return endText + '审批'
        case '3':
            if (row.phase === '3') {
                if (row.type === '1') {
                    endText = '培育项目'
                }
                if (row.type === '2') {
                    endText = '结束终止'
                }
                if (row.type === '3') {
                    endText = '结束转立项'
                }
                if (row.type === '4') {
                    endText = '里程碑'
                }
                if (row.type === '5') {
                    endText = '项目状态变更'
                }
                if (row.type === '6') {
                    endText = '实施负责人变更'
                }
                if (row.type === '7') {
                    endText = '实施项目'
                }
                if (row.type === '8') {
                    endText = '实施变更审批'
                }
                if (row.type === '9') {
                    endText = '售后项目'
                }
                if (row.type === '10') {
                    endText = '售后结束审批'
                }
                if (row.type === '-1') {
                    endText = '里程碑1'
                }
                if (row.type === '-2') {
                    endText = '里程碑2'
                }
                if (row.type === '-3') {
                    endText = '里程碑3'
                }
            }
            return endText + '材料补充'
        default:
            return '--'
    }
}