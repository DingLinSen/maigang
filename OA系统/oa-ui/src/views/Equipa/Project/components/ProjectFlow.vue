<!-- 进度条 -->
<script setup lang="ts">
import { ref, watch } from 'vue'
import { ElTooltip } from 'element-plus'
import { findLastIndex } from '@/utils'

const props = defineProps({
  detailsData: {
    type: Object,
    default: {}
  },
  phase: {
    type: String,
    default: ''
  }
})
const stepsItems = ref<any>([]) // 进度条
// 所有进度条
const allStepsItems = ref([
  {
    id: 1,
    name: '进展/变更',
    isComplete: false,
    isShow: false,
    isNow: false,
    sub: false,
    small: false,
    subInfo: []
  },
  {
    id: 2,
    name: '结束转立项',
    isComplete: false,
    isShow: false,
    isNow: false,
    sub: false,
    small: false,
    subInfo: []
  },
  {
    id: 3,
    name: '进展/变更',
    isComplete: false,
    isNow: false,
    isShow: false,
    subInfo: [],
    sub: false,
    small: false
  },
  {
    id: 4,
    name: '里程碑1',
    isComplete: false,
    isShow: false,
    isNow: false,
    sub: false,
    small: true,
    subInfo: []
  },
  {
    id: 5,
    name: '里程碑2',
    isComplete: false,
    isNow: false,
    isShow: false,
    subInfo: [],
    sub: false,
    small: true
  },
  {
    id: 6,
    name: '里程碑3项目签约',
    isComplete: false,
    isNow: false,
    isShow: false,
    subInfo: [],
    sub: false,
    small: true
  },
  {
    id: 7,
    name: '结束转实施',
    isComplete: false,
    isNow: false,
    isShow: false,
    subInfo: [],
    sub: false,
    small: false
  },
  {
    id: 8,
    name: '进展/变更',
    isComplete: false,
    isNow: false,
    isShow: false,
    subInfo: [],
    sub: false,
    small: false
  },
  {
    id: 9,
    name: '项目验收',
    isComplete: false,
    isNow: false,
    isShow: false,
    subInfo: [],
    sub: false,
    small: false
  },
  {
    id: 10,
    name: '项目已回款转售后',
    isComplete: false,
    isNow: false,
    isShow: false,
    subInfo: [],
    sub: false,
    small: false
  },
  {
    id: 11,
    name: '售后中',
    isComplete: false,
    isNow: false,
    isShow: false,
    subInfo: [],
    sub: false,
    small: false
  },
  {
    id: 12,
    name: '售后结束',
    isComplete: false,
    isNow: false,
    isShow: false,
    subInfo: [],
    sub: false,
    small: false
  },
  {
    id: 13,
    name: '结束',
    isComplete: false,
    isNow: false,
    isShow: false,
    subInfo: [],
    sub: false,
    small: false
  }
])

const isShowStart = ref<boolean>(false)
const startSubInfo = ref<any>([]) // 培育开始审批意见

//组合进展/指示的数据
const getProgressInfoArray = (item: any) => {
  let info: any = []
  info.push({
    title: '时间：',
    content: item.progressDate
  })
  //type  1 进展 2 变更 3 指示 4 负责人变更 5 验收
  info.push({
    title:
      item.type == '1' || item.type == '4'
        ? '负责人：'
        : item.type == '2'
        ? '变更人：'
        : item.type == '3'
        ? '指示人：'
        : item.type == '5'
        ? '验收人：'
        : '',
    content: item.createByName
  })
  info.push({
    title: item.type == '1' || item.type == '4' ? '进展：' : '内容：',
    content: item.content
  })
  return info
}

//组合进展/指示的数据
const getProgressInfo = (item: any) => {
  let infoArray: any = getProgressInfoArray(item)
  let title: any = getProgressTitleByType(item.type)
  let info = { title: title, info: infoArray }
  return info
}

const getProgressTitleByType = (type: string) => {
  return type === '1'
    ? '进展：'
    : type === '2'
    ? '变更：'
    : type === '3'
    ? '指示：'
    : type === '4'
    ? '售后：'
    : type === '5'
    ? '验收：'
    : ''
}

//审批内容
const getAuditContent = (item: any) => {
  let content: any = ''
  //phase 阶段 1培育 2立项 3实施 4售后'
  //type 审批类型 1 培育审批 2 项目终止审批 3 立项审批 4 里程碑审批 5 项目状态变更审批 6 负责人变更审批 7 实施审批 8 实施变更审批 9 售后审批 10 售后结束审批
  //flag 记录类型1申请 2审核 3 确认
  //status区分 0是同意，1是驳回
  //reason '驳回理由'
  if (item.type == '-1') {
    if (item.flag == '1') {
      content = '里程碑1：项目关键人实际对接。'
    }
  } else if (item.type == '-2') {
    if (item.flag == '1') {
      content = '里程碑2：用户已认可项目方案。'
    }
  } else if (item.type == '-3') {
    if (item.flag == '1') {
      content = '里程碑3：招标或签约时间确定。'
    }
  } else if (item.type == '1') {
    if (item.flag == '1') {
      content = '发起培育项目申请。'
    } else if (item.flag == '2') {
      content =
        item.status && item.status !== ''
          ? (item.status == '1' ? '同意了' : item.status == '2' ? '驳回了' : '') +
            '培育项目申请，建议/理由：' +
            (item.reason ? item.reason : '--')
          : '待审批'
    }
  } else if (item.type == '2') {
    if (item.flag == '1') {
      content = item.reason ? '因' + item.reason + '原因，申请结束终止。' : '--'
    } else if (item.flag == '2') {
      content =
        item.status && item.status !== ''
          ? (item.status === '1' ? '同意' : item.status === '2' ? '驳回' : '') +
            '结束终止，建议/理由：' +
            (item.reason ? item.reason : '--')
          : '待审批'
    }
  } else if (item.type == '3') {
    if (item.flag == '1') {
      content = '发起结束转立项申请。'
    } else if (item.flag == '2') {
      content =
        item.status && item.status !== ''
          ? (item.status === '1' ? '同意了' : item.status === '2' ? '驳回了' : '') +
            '结束转立项申请，建议/理由：' +
            (item.reason ? item.reason : '--')
          : '待审批'
    }
  } else if (item.type == '5') {
    if (item.flag == '1') {
      content =
        (item.content ? item.content + '，' : '') +
        '建议/理由：' +
        (item.reason ? item.reason : '--')
    } else {
      content =
        (item.status === '1' ? '同意了' : item.status === '2' ? '驳回了' : '') +
        '项目状态变更申请，' +
        (item.content ? item.content + '，' : '') +
        '建议/理由：' +
        (item.reason ? item.reason : '--')
    }
  } else if (item.type == '6') {
    content = item.content ? item.content : ''
  } else if (item.type == '7') {
    if (item.flag == '1') {
      content = '发起立项转实施申请。'
    } else if (item.flag == '2') {
      content =
        item.status && item.status !== ''
          ? (item.status === '1' ? '同意了' : item.status === '2' ? '驳回了' : '') +
            '立项转实施申请，建议/理由：' +
            (item.reason ? item.reason : '--')
          : '待审批'
    } else if (item.flag == '3') {
      content = '完成了补充'
    }
  } else if (item.type == '8') {
    if (item.flag == '1') {
      content = item.content
    } else if (item.flag == '2') {
      content =
        item.status && item.status !== ''
          ? (item.status === '1' ? '同意了' : item.status === '2' ? '驳回了' : '') +
            '实施变更申请，建议/理由：' +
            (item.reason ? item.reason : '--')
          : '待审批'
    }
  } else if (item.type == '9') {
    if (item.flag == '1') {
      content = '发起已回款转售后申请。'
    } else if (item.flag == '2') {
      content =
        item.status && item.status !== ''
          ? (item.status === '1' ? '同意了' : item.status === '2' ? '驳回了' : '') +
            '已回款转售后申请，建议/理由：' +
            (item.reason ? item.reason : '--')
          : '待审批'
    }
  } else if (item.type == '10') {
    if (item.flag == '1') {
      content = '发起项目结束申请。'
    } else if (item.flag == '2') {
      content =
        item.status && item.status !== ''
          ? (item.status === '1' ? '同意了' : item.status === '2' ? '驳回了' : '') +
            '项目结束申请，建议/理由：' +
            (item.reason ? item.reason : '--')
          : '待审批'
    }
  }
  return content
}

//组合审批的数据
const getAuditInfoArray = (item: any) => {
  let info: any = []
  if (item.type == '-1' || item.type == '-2' || item.type == '-3') {
    info.push({
      title: '名称：',
      content: getAuditContent(item)
    })
  }

  info.push({
    title: '时间：',
    content: item.auditDate || item.auditTime || item.createTime || '--'
  })

  if (item.type == '5') {
    info.push({
      title: '审批人：',
      content: item.createByName
    })
  } else {
    if (item.flag == '1') {
      info.push({
        title: item.type == '2' ? '负责人：' : '申请人：',
        content: item.createByName
      })
    } else if (item.flag == '2') {
      info.push({
        title: '审批人：',
        content: item.createByName
      })
    }
  }

  if (Number(item.type) > -1) {
    info.push({
      title: '内容：',
      content: getAuditContent(item)
    })
  }

  return info
}

//组合审批的数据
const getAuditInfo = (item: any) => {
  let infoArray: any = getAuditInfoArray(item)
  let title: any = getAuditTitleByFlag(item.flag, item.type, item.content)
  item.flag === '1' ? '申请：' : item.flag === '2' ? '审批：' : item.flag === '3' ? '补充：' : ''
  let info = { title: title, info: infoArray }
  return info
}

const getAuditTitleByFlag = (flag: string, type: string, content: any) => {
  let title = flag === '1' ? '申请：' : flag === '2' ? '审批：' : flag === '3' ? '补充：' : ''
  if (
    (type == '-1' && flag == '2') ||
    (type == '-2' && flag == '2') ||
    (type == '-3' && flag == '2')
  ) {
    if (content == '1') {
      title = '审批：'
    } else {
      title = '--'
    }
  } else {
    title = flag === '1' ? '申请：' : flag === '2' ? '审批：' : flag === '3' ? '补充：' : ''
  }
  return title
}
// 监听父级数据变化
watch(
  () => props.detailsData,
  (data: any) => {
    stepsItems.value = []
    if (data) {
      let subInfo: any[] = [] // 培育进展中
      let cultivateSubInfo: any[] = [] // 立项进展中
      startSubInfo.value = [] // 培育开始审批意见
      let cultivateEndSubInfo: any[] = [] // 培育终止终止
      let statusImplementSubInfo: any[] = []
      let toImplementSubInfo: any[] = [] // 结束转立项审批
      let operationSubInfo: any[] = [] // 实施中
      let toOperationSubInfo: any[] = [] // 立项转实施审批
      let operationUpdateSubInfo: any[] = [] // 实施变更审批
      let acceptanceSubInfo: any[] = [] //已验收
      let toSalesSubInfo: any[] = [] //已回款转售后
      let afterSalesSubInfo: any[] = [] //售后中
      let endSalesSubInfo: any[] = [] //售后结束后
      let endProjectSubInfo: any[] = [] //结束售后
      // type '审批类型(1 培育审批 2 项目终止审批 3 立项审批 4 里程碑审批 5 项目状态变更审批 6 负责人变更审批 7 实施审批 8 实施变更审批 9 售后审批 10 售后结束审批
      //  -1 里程碑1 -2 里程碑2 -3 里程碑3)',
      // phase 阶段 1培育 2立项 3实施 4售后',
      // flag 记录类型(1申请 2审核 3 确认
      // status 是否同意 1 同意 2 驳回',
      // reason '驳回理由',
      // change_apply_flag` 项目变更申请标志 0暂停，1终止，2重启',
      // 变更指示灯收据
      if (data.pmProgressList && data.pmProgressList.length > 0) {
        data.pmProgressList.forEach((item: any) => {
          let info: any = getProgressInfo(item)
          // 培育
          if (item.phase === '1') {
            subInfo.push(info)
          }
          //立项
          else if (item.phase === '2') {
            cultivateSubInfo.push(info)
          }
          //实施
          else if (item.phase === '3') {
            if (item.type == '5') {
              //验收
              acceptanceSubInfo.push(info)
            } else {
              operationSubInfo.push(info)
            }
          }
          //售后
          else if (item.phase === '4') {
            if (item.flag && item.flag == '1') {
              //售后结束
              endSalesSubInfo.push(info)
            } else {
              //售后中
              afterSalesSubInfo.push(info)
            }
          }
        })
      }
      let milestoneA: any[] = []
      let milestoneB: any[] = []
      let milestoneC: any[] = []
      if (data.pmAuditList && data.pmAuditList.length > 0) {
        data.pmAuditList.forEach((item: any) => {
          if (item.type == '6') {
            return
          }
          let info: any = getAuditInfo(item)
          // status区分 0是同意，1是驳回
          // flag是 区分 0申请，1审批
          //  phase1 培育审批， 2结束转立项审批，4结束终止审批
          // 培育
          if (item.phase === '1') {
            // 培育终止
            if (item.type === '2') {
              cultivateEndSubInfo.push(info)
            } else if (item.type === '1') {
              startSubInfo.value.push(info)
            }
          }
          //  立项
          else if (item.phase === '2') {
            // 转立项审批中
            if (item.type === '3') {
              toImplementSubInfo.push(info)
            }
            // 项目状态变更审批中
            else if (item.type === '5') {
              statusImplementSubInfo.push(info)
            }
            // 里程碑1
            else if (item.type === '-1' && item.flag === '1') {
              milestoneA.push(info)
            }
            // 里程碑2
            else if (item.type === '-2' && item.flag === '1') {
              milestoneB.push(info)
            }
            // 里程碑3
            else if (item.type === '-3' && item.flag === '1') {
              milestoneC.push(info)
            }
          }
          //实施
          else if (item.phase === '3') {
            //实施审批
            if (item.type === '7') {
              toOperationSubInfo.push(info)
            }
            //实施变更审批
            else if (item.type === '8') {
              operationUpdateSubInfo.push(info)
            }
          }
          //售后
          else if (item.phase === '4') {
            //转售后审批
            if (item.type === '9') {
              toSalesSubInfo.push(info)
            }
            //结束售后
            else if (item.type === '10') {
              endProjectSubInfo.push(info)
            }
          }
        })
      }

      stepsItems.value = JSON.parse(JSON.stringify(allStepsItems.value))

      // 初始化
      stepsItems.value.forEach((v: any) => {
        v.isComplete = false
        v.isNow = false
        v.isShow = false
        v.subInfo = []
        v.sub = false
        v.small = false
      })
      //获取最终阶段
      // let phase = data.phase ? data.phase : ''
      if (props.phase == '1') {
        if (data.status === '1' || data.status === '4') {
          stepsItems.value[0].isNow = true
          stepsItems.value[0].isComplete = true
          stepsItems.value[0].subInfo = subInfo
          stepsItems.value[0].sub = true
          // 结束终止
          if (data.status === '4') {
            stepsItems.value = [
              {
                id: 1,
                name: '进展/变更',
                isComplete: true,
                isShow: false,
                isNow: false,
                sub: false,
                small: false,
                subInfo: subInfo
              },
              {
                id: 2,
                name: '结束终止',
                isComplete: true,
                isShow: false,
                isNow: true,
                sub: false,
                small: false,
                subInfo: cultivateEndSubInfo
              }
            ]
          }
        }
        // 结束转立项审批中
        else if (data.status === '2') {
          stepsItems.value[0].isNow = false
          stepsItems.value[0].isComplete = true
          stepsItems.value[0].subInfo = subInfo
          stepsItems.value[1].isNow = true
          stepsItems.value[1].isComplete = true
          stepsItems.value[1].subInfo = toImplementSubInfo
          stepsItems.value[1].sub = true
        }
        // 结束终止
        else if (data.status === '5') {
          stepsItems.value = [
            {
              id: 1,
              name: '进展/变更',
              isComplete: true,
              isShow: false,
              isNow: false,
              sub: false,
              small: false,
              subInfo: subInfo
            },
            {
              id: 2,
              name: '结束终止',
              isComplete: true,
              isShow: false,
              isNow: false,
              sub: false,
              small: false,
              color: 'rgb(237, 64, 20)',
              subInfo: cultivateEndSubInfo
            }
          ]
        }
        // 结束转立项
        else if (data.status === '3') {
          stepsItems.value = [
            {
              id: 1,
              name: '进展/变更',
              isComplete: true,
              isShow: false,
              isNow: false,
              sub: false,
              small: false,
              subInfo: subInfo
            },
            {
              id: 2,
              name: '结束转立项',
              isComplete: true,
              isShow: false,
              isNow: false,
              sub: false,
              small: false,
              subInfo: toImplementSubInfo
            }
          ]
        }
      } else if (props.phase == '2') {
        if (data.status === '1' || data.status === '4') {
          stepsItems.value[1].isNow = true
          stepsItems.value[0].isComplete = true
          stepsItems.value[1].isComplete = true
          stepsItems.value[0].subInfo = subInfo
          stepsItems.value[1].subInfo = toImplementSubInfo
          stepsItems.value[0].sub = true
          if (data.status === '4') {
            stepsItems.value[6].isNow = true
            stepsItems.value[3].isComplete = true
            stepsItems.value[3].sub = true
            stepsItems.value[4].isComplete = true
            stepsItems.value[4].sub = true
            stepsItems.value[5].isComplete = true
            stepsItems.value[5].sub = true
            stepsItems.value[6].isComplete = true
            stepsItems.value[6].sub = true
            if (toOperationSubInfo) {
              stepsItems.value[6].subInfo = toOperationSubInfo
            }
          }
        }
        if (
          data.status === '2' ||
          data.status === '3' ||
          data.status === '4' ||
          data.status === '5' ||
          data.status === '6' ||
          data.status === '7' ||
          data.status === '8' ||
          data.status === '9' ||
          data.status === '10'
        ) {
          stepsItems.value[0].isNow = false
          stepsItems.value[1].isNow = false
          stepsItems.value[2].isNow = false
          stepsItems.value[0].isComplete = true
          stepsItems.value[1].isComplete = true
          stepsItems.value[2].isComplete = true
          let milestoneSubA = data.milestoneList?.some((item: any) => {
            return item.type >= '1'
          })
          if (milestoneSubA) {
            let milestoneTemp: any = []
            if (milestoneA.length > 0) {
              milestoneTemp.push(milestoneA[milestoneA.length - 1])
            }
            stepsItems.value[4].sub = true
            stepsItems.value[3].subInfo = milestoneTemp
            stepsItems.value[3].isNow = false
            stepsItems.value[3].isComplete = true
          }
          let milestoneSubB = data.milestoneList?.some((item: any) => {
            return item.type >= '2'
          })
          if (milestoneSubB) {
            let milestoneTemp: any = []
            if (milestoneB.length > 0) {
              milestoneTemp.push(milestoneB[milestoneB.length - 1])
            }
            stepsItems.value[4].subInfo = milestoneTemp
            stepsItems.value[4].isNow = false
            stepsItems.value[4].isComplete = true
          }
          let milestoneSubC = data.milestoneList?.some((item: any) => {
            return item.type >= '3'
          })
          if (milestoneSubC) {
            let milestoneTemp: any = []
            if (milestoneC.length > 0) {
              milestoneTemp.push(milestoneC[milestoneC.length - 1])
            }
            stepsItems.value[6].sub = true
            stepsItems.value[5].subInfo = milestoneTemp
            stepsItems.value[5].isNow = false
            stepsItems.value[5].isComplete = true
          }
          // 进展中记录

          stepsItems.value[2].subInfo = cultivateSubInfo
          stepsItems.value[0].subInfo = subInfo
          stepsItems.value[1].subInfo = toImplementSubInfo
          // 暂停
          if (data.status === '3') {
            let a: any = []
            if (data.milestoneList && data.milestoneList.length > 0) {
              let milestoneSubA = data.milestoneList?.some((item: any) => {
                return item.type >= '1'
              })
              let milestoneSubB = data.milestoneList?.some((item: any) => {
                return item.type >= '2'
              })
              let milestoneSubC = data.milestoneList?.some((item: any) => {
                return item.type >= '3'
              })
              if (milestoneSubA) {
                a = []
                stepsItems.value.forEach((v: any, index: any) => {
                  if (index < 4) {
                    a.push(v)
                  }
                })
                a.push({
                  id: Number(a.length),
                  name: '立项暂停',
                  isComplete: true,
                  isShow: false,
                  isNow: false,
                  subInfo: statusImplementSubInfo,
                  sub: false,
                  small: false,
                  color: 'rgba(255, 255, 255, 1)'
                })
              }
              if (milestoneSubB) {
                a = []
                stepsItems.value.forEach((v: any, index: any) => {
                  if (index < 5) {
                    a.push(v)
                  }
                })
                a.push({
                  id: Number(a.length),
                  name: '立项暂停',
                  isComplete: true,
                  isShow: false,
                  isNow: false,
                  subInfo: statusImplementSubInfo,
                  sub: false,
                  small: false,
                  color: 'rgba(255, 255, 255, 1)'
                })
              }
              if (milestoneSubC) {
                a = []
                stepsItems.value.forEach((v: any, index: any) => {
                  if (index < 6) {
                    a.push(v)
                  }
                })
                a.push({
                  id: Number(a.length),
                  name: '立项暂停',
                  isComplete: true,
                  isShow: false,
                  isNow: false,
                  subInfo: statusImplementSubInfo,
                  sub: false,
                  small: false,
                  color: 'rgba(255, 255, 255, 1)'
                })
              }
            } else {
              a = []
              stepsItems.value.forEach((v: any, index: any) => {
                if (index < 3) {
                  a.push(v)
                }
              })
              a.push({
                id: Number(a.length),
                name: '立项暂停',
                isComplete: true,
                isShow: false,
                isNow: false,
                subInfo: statusImplementSubInfo,
                sub: false,
                small: false,
                color: 'rgba(255, 255, 255, 1)'
              })
            }
            stepsItems.value = a
          } else if (data.status === '5') {
            // 结束终止
            let a: any = []
            stepsItems.value.forEach((v: any) => {
              if (v.isComplete) {
                a.push(v)
              }
            })
            let lastIndex = findLastIndex(
              data.pmAuditList,
              (item: any) => item.flag === '1' && item.phase === '2' && item.type === '5'
            )
            let endList: any[] = []
            let auditList = data.pmAuditList.slice(lastIndex, data.pmAuditList.length)
            auditList.forEach((item: any) => {
              // 培育终止
              let info: any[] = []
              if (item.flag === '1') {
                info = [
                  {
                    title: '时间：',
                    content: item.auditDate || '--'
                  },
                  {
                    title: '负责人：',
                    content: item.createByName || '--'
                  },
                  {
                    title: '内容：',
                    content: item.reason ? '因' + item.reason + '原因，申请结束终止。' : '--'
                  }
                ]
              } else if (item.flag === '2') {
                info = [
                  {
                    title: '时间：',
                    content: item.createTime
                  },
                  {
                    title: '审批人：',
                    content: item.createByName
                  },
                  {
                    title: '内容：',
                    content:
                      (item.status === '1' ? '同意' : item.status === '2' ? '驳回' : '') +
                      '结束终止，建议/理由：' +
                      (item.reason ? item.reason : '--')
                  }
                ]
              }
              endList.push({
                title: item.flag === '1' ? '申请：' : item.flag === '2' ? '审批：' : '',
                info: info
              })
            })
            stepsItems.value = a.concat({
              id: Number(a.length),
              name: '结束终止',
              isComplete: true,
              isShow: false,
              isNow: false,
              sub: false,
              small: false,
              subInfo: endList,
              color: 'rgb(255, 255, 255)'
            })
          } else if (data.status === '8') {
            stepsItems.value[6].isNow = true
            stepsItems.value[3].isComplete = true
            stepsItems.value[3].sub = true
            stepsItems.value[4].isComplete = true
            stepsItems.value[4].sub = true
            stepsItems.value[5].isComplete = true
            stepsItems.value[5].sub = true
            stepsItems.value[6].isComplete = true
            stepsItems.value[6].sub = true
            if (toOperationSubInfo) {
              stepsItems.value[6].subInfo = toOperationSubInfo
            }
          }
        }
      } else if (props.phase == '3') {
        stepsItems.value[0].isNow = false
        stepsItems.value[1].isNow = false
        stepsItems.value[2].isNow = false
        stepsItems.value[3].isNow = false
        stepsItems.value[4].isNow = false
        stepsItems.value[5].isNow = false

        stepsItems.value[0].isComplete = true
        stepsItems.value[1].isComplete = true
        stepsItems.value[2].isComplete = true
        stepsItems.value[3].isComplete = true
        stepsItems.value[4].isComplete = true
        stepsItems.value[5].isComplete = true
        stepsItems.value[6].isComplete = true
        // 进展中记录
        stepsItems.value[2].subInfo = cultivateSubInfo
        stepsItems.value[0].subInfo = subInfo
        stepsItems.value[1].subInfo = toImplementSubInfo
        //里程碑1
        if (milestoneA) {
          let milestoneTemp: any = []
          if (milestoneA.length > 0) {
            milestoneTemp.push(milestoneA[milestoneA.length - 1])
          }
          stepsItems.value[3].subInfo = milestoneTemp
          stepsItems.value[3].isNow = false
          stepsItems.value[3].isComplete = true
        }
        //里程碑2
        if (milestoneB) {
          let milestoneTemp: any = []
          if (milestoneB.length > 0) {
            milestoneTemp.push(milestoneB[milestoneB.length - 1])
          }
          stepsItems.value[4].subInfo = milestoneTemp
          stepsItems.value[4].isNow = false
          stepsItems.value[4].isComplete = true
        }
        //里程碑3
        if (milestoneC) {
          let milestoneTemp: any = []
          if (milestoneC.length > 0) {
            milestoneTemp.push(milestoneC[milestoneC.length - 1])
          }
          stepsItems.value[5].subInfo = milestoneTemp
          stepsItems.value[5].isNow = false
          stepsItems.value[5].isComplete = true
        }
        //立项转实施审批中
        if (data.status === '1') {
          stepsItems.value[6].isNow = true
          stepsItems.value[6].isComplete = true
          if (toOperationSubInfo) {
            stepsItems.value[6].subInfo = toOperationSubInfo
          }
        } else if (
          data.status === '2' ||
          data.status === '5' ||
          data.status === '3' ||
          data.status === '4' ||
          data.status === '6'
        ) {
          stepsItems.value[6].isNow = false
          stepsItems.value[7].isComplete = true

          stepsItems.value[7].sub = true
          stepsItems.value[7].isNow = true

          if (toOperationSubInfo) {
            stepsItems.value[6].subInfo = toOperationSubInfo
          }
          if (operationSubInfo || operationUpdateSubInfo) {
            let tempArray: any[] = []
            tempArray = [...operationSubInfo, ...operationUpdateSubInfo]
            stepsItems.value[7].subInfo = tempArray
          }
          //已验收
          if (data.status === '3' || data.accept) {
            stepsItems.value[7].isNow = false
            stepsItems.value[7].isComplete = true
            stepsItems.value[8].isComplete = true
            if (acceptanceSubInfo) {
              stepsItems.value[8].subInfo = acceptanceSubInfo
            }
            stepsItems.value[9].sub = true
          }
          //已回款转售后的
          if (data.status === '6' || data.status === '4') {
            stepsItems.value[7].isNow = false
            stepsItems.value[7].isComplete = true
            stepsItems.value[8].isComplete = true
            if (acceptanceSubInfo) {
              stepsItems.value[8].subInfo = acceptanceSubInfo
            }
            stepsItems.value[9].sub = true
            stepsItems.value[9].isNow = true
          }
        }
        if (toSalesSubInfo) {
          stepsItems.value[9].subInfo = toSalesSubInfo
        }
      } else if (props.phase == '4') {
        stepsItems.value[0].isNow = false
        stepsItems.value[1].isNow = false
        stepsItems.value[2].isNow = false
        stepsItems.value[3].isNow = false
        stepsItems.value[4].isNow = false
        stepsItems.value[5].isNow = false
        stepsItems.value[6].isNow = false
        stepsItems.value[7].isNow = false
        stepsItems.value[0].isComplete = true
        stepsItems.value[1].isComplete = true
        stepsItems.value[2].isComplete = true
        stepsItems.value[3].isComplete = true
        stepsItems.value[4].isComplete = true
        stepsItems.value[5].isComplete = true
        stepsItems.value[6].isComplete = true
        stepsItems.value[7].isComplete = true
        stepsItems.value[8].isComplete = true
        // 进展中记录
        stepsItems.value[2].subInfo = cultivateSubInfo
        stepsItems.value[0].subInfo = subInfo
        stepsItems.value[1].subInfo = toImplementSubInfo
        //里程碑1
        if (milestoneA) {
          let milestoneTemp: any = []
          if (milestoneA.length > 0) {
            milestoneTemp.push(milestoneA[milestoneA.length - 1])
          }
          stepsItems.value[3].subInfo = milestoneTemp
          stepsItems.value[3].isNow = false
          stepsItems.value[3].isComplete = true
        }
        //里程碑2
        if (milestoneB) {
          let milestoneTemp: any = []
          if (milestoneB.length > 0) {
            milestoneTemp.push(milestoneB[milestoneB.length - 1])
          }
          stepsItems.value[4].subInfo = milestoneTemp
          stepsItems.value[4].isNow = false
          stepsItems.value[4].isComplete = true
        }
        //里程碑3
        if (milestoneC) {
          let milestoneTemp: any = []
          if (milestoneC.length > 0) {
            milestoneTemp.push(milestoneC[milestoneC.length - 1])
          }
          stepsItems.value[5].subInfo = milestoneTemp
          stepsItems.value[5].isNow = false
          stepsItems.value[5].isComplete = true
        }
        //立项转实施审批中
        if (toOperationSubInfo) {
          stepsItems.value[6].subInfo = toOperationSubInfo
        }
        //实施中/项目变更审批中
        if (toOperationSubInfo) {
          stepsItems.value[6].subInfo = toOperationSubInfo
        }
        if (operationSubInfo || operationUpdateSubInfo) {
          let tempArray: any[] = []
          tempArray = [...operationSubInfo, ...operationUpdateSubInfo]
          stepsItems.value[7].subInfo = tempArray
        }

        if (acceptanceSubInfo) {
          stepsItems.value[8].subInfo = acceptanceSubInfo
        }

        if (toSalesSubInfo) {
          stepsItems.value[9].subInfo = toSalesSubInfo
        }
        //// 项目状态 1实施转售后审批中，2售后中，3项目结束，4项目结束审批中
        //上一个状态 changeInitStatus
        let preStatus =
          data.pmAuditList[data.pmAuditList.length - 1] &&
          data.pmAuditList[data.pmAuditList.length - 1].changeInitStatus
            ? data.pmAuditList[data.pmAuditList.length - 1].changeInitStatus
            : ''
        if (data.status === '1') {
          stepsItems.value[9].isComplete = true
          stepsItems.value[9].isNow = true
        } else if (data.status === '2' || (data.status === '5' && preStatus == '2')) {
          stepsItems.value[10].sub = true
          stepsItems.value[9].isComplete = true
          stepsItems.value[10].isComplete = true
          stepsItems.value[10].isNow = true
          if (afterSalesSubInfo) {
            stepsItems.value[10].subInfo = afterSalesSubInfo
          }
          if (endProjectSubInfo) {
            stepsItems.value[12].subInfo = endProjectSubInfo
          }
          if (endSalesSubInfo) {
            stepsItems.value[11].subInfo = endSalesSubInfo
          }
        } else if (data.status === '6' || (data.status === '5' && preStatus == '6')) {
          stepsItems.value[9].isComplete = true
          stepsItems.value[10].isComplete = true
          stepsItems.value[11].isComplete = true
          stepsItems.value[11].sub = true
          if (afterSalesSubInfo) {
            stepsItems.value[10].subInfo = afterSalesSubInfo
          }
          if (endProjectSubInfo) {
            stepsItems.value[12].subInfo = endProjectSubInfo
          }
          if (endSalesSubInfo) {
            stepsItems.value[11].subInfo = endSalesSubInfo
          }
        } else if (data.status === '4' || data.status === '3') {
          stepsItems.value[9].isComplete = true
          stepsItems.value[11].sub = true
          stepsItems.value[12].sub = true
          stepsItems.value[11].isComplete = true
          stepsItems.value[10].isComplete = true
          stepsItems.value[12].isComplete = true
          stepsItems.value[12].isNow = true
          if (afterSalesSubInfo) {
            stepsItems.value[10].subInfo = afterSalesSubInfo
          }
          if (endProjectSubInfo) {
            stepsItems.value[12].subInfo = endProjectSubInfo
          }
          if (endSalesSubInfo) {
            stepsItems.value[11].subInfo = endSalesSubInfo
          }
          if (data.status === '3') {
            stepsItems.value[12].isNow = false
          }
        }
      }
    }
  },
  {
    immediate: true
  }
)
// 鼠标移入
const mouseOver = (item?, index?) => {
  // if(!item.isComplete) {
  //   return
  // }
  for (let i = 0; i < stepsItems.value.length; i++) {
    if (stepsItems.value[i].id === item.id) {
      stepsItems.value[i].isShow = true
    } else {
      stepsItems.value[i].isShow = false
    }
  }
}
// 鼠标移出
const mouseLeave = () => {
  for (let i = 0; i < stepsItems.value.length; i++) {
    stepsItems.value[i].isShow = false
  }
}

const mouseOver1 = () => {
  isShowStart.value = true
}
const mouseLeave1 = () => {
  isShowStart.value = false
}
</script>

<template>
  <section class="process-bar pt-1 pr-18">
    <div class="step-wrapper" :style="{ marginBottom: '29px' }">
      <div class="step-wrap">
        <div class="step-info" style="width: 1%">
          <div class="relative" style="background: rgba(0, 0, 0, 0)">
            <span class="name"><b>培育开始</b></span>
            <ElTooltip effect="light">
              <span
                class="circle relative circle-first"
                style="background: #00a0e9"
                @mouseenter="mouseOver1()"
                @mouseleave="mouseLeave1()"
              >
                <img src="@/assets/imgs/done.png" class="text-white circle-check-mark" />
                <!-- <Icon icon="ion:checkmark-sharp" class="text-white circle-check-mark" /> -->
              </span>
              <template #content>
                <div class="content" v-if="startSubInfo.length">
                  <div
                    class="content-info"
                    v-for="(subItem, subIndex) in startSubInfo"
                    :key="subIndex + 111111"
                  >
                    <div class="left">{{ subItem.title }}</div>
                    <div class="right">
                      <p
                        v-for="(it, i) in subItem.info"
                        :key="i + 1000001"
                        class="word-break"
                        style="line-break: anywhere"
                      >
                        <span>{{ it.title }}</span>
                        {{ it.content }}
                      </p>
                    </div>
                  </div>
                </div>
                <template v-else>
                  <div class="content-info">
                    <p class="no-data">暂无数据</p>
                  </div>
                </template>
              </template>
            </ElTooltip>
          </div>
        </div>
        <template v-for="(item, index) in stepsItems" :key="index">
          <div class="step-info" :style="{ width: '17%' }" v-if="index < 6">
            <div class="line" :style="{ background: item.isComplete ? '#00a0e9' : '#D8DBE7' }">
              <div>
                <span class="sub-step" v-if="item.sub"></span>
                <span
                  class="name"
                  :style="{
                    color: item.isComplete
                      ? item.name == '立项暂停'
                        ? '#FF565C'
                        : item.name == '结束终止'
                        ? '#4E5569'
                        : '#222222'
                      : '#777777'
                  }"
                >
                  <b>{{ item.name }}</b></span
                >
                <span class="space-left-class"> </span>
                <ElTooltip effect="light">
                  <span
                    class="circle relative"
                    v-if="!item.isNow"
                    @mouseenter="mouseOver(item, index)"
                    @mouseleave="mouseLeave()"
                    :style="{
                      background: item.isComplete
                        ? item.color
                          ? item.color
                          : '#00a0e9'
                        : item.color
                        ? item.color
                        : '#D8DBE7'
                    }"
                  >
                    <div v-if="item.isComplete" style="background: #ffffff">
                      <img
                        src="@/assets/imgs/suspend.png"
                        class="text-white circle-check-mark"
                        v-if="item.name == '立项暂停'"
                      />
                      <img
                        src="@/assets/imgs/end.png"
                        class="text-white circle-check-mark"
                        v-else-if="item.name == '结束终止'"
                      />
                      <img
                        src="@/assets/imgs/done.png"
                        class="text-white circle-check-mark"
                        v-else
                      />
                    </div>
                    <!-- <Icon
                      icon="carbon:checkmark"
                      class="text-white circle-check-mark"
                      v-if="item.isComplete"
                  /> -->
                  </span>
                  <template #content>
                    <div class="content" v-if="item.subInfo.length">
                      <div
                        class="content-info"
                        v-for="(subItem, subIndex) in item.subInfo"
                        :key="subIndex + 111111"
                      >
                        <div class="left">{{ subItem.title }}</div>
                        <div class="right">
                          <p
                            v-for="(it, i) in subItem.info"
                            :key="i + 1000001"
                            class="word-break"
                            style="line-break: anywhere"
                          >
                            <span>{{ it.title }}</span>
                            {{ it.content }}
                          </p>
                        </div>
                      </div>
                    </div>
                    <template v-else>
                      <div class="content-info">
                        <p class="no-data">暂无数据</p>
                      </div>
                    </template>
                  </template>
                </ElTooltip>
              </div>
              <ElTooltip effect="light">
                <img src="@/assets/imgs/progress.png" class="circle-p" v-if="item.isNow" />
                <!-- <div class="circle-p" v-if="item.isNow">
                  <span class="circle-sub"></span>
                </div> -->
                <template #content>
                  <div class="content" v-if="item.subInfo.length">
                    <div
                      class="content-info"
                      v-for="(subItem, subIndex) in item.subInfo"
                      :key="subIndex + 111111"
                    >
                      <div class="left">{{ subItem.title }}</div>
                      <div class="right">
                        <p
                          v-for="(it, i) in subItem.info"
                          :key="i + 1000001"
                          class="word-break"
                          style="line-break: anywhere"
                        >
                          <span>{{ it.title }}</span>
                          {{ it.content }}
                        </p>
                      </div>
                    </div>
                  </div>
                  <template v-else>
                    <div class="content-info">
                      <p class="no-data">暂无数据</p>
                    </div>
                  </template>
                </template>
              </ElTooltip>
            </div>
          </div>
        </template>
      </div>
      <div class="step-wrap-right">
        <template v-for="(item, index) in stepsItems" :key="index">
          <div class="step-info" v-if="index == 6" style="height: 2vw; margin-top: 1.5vh">
            <div class="line" :style="{ background: item.isComplete ? '#00a0e9' : '#D8DBE7' }">
              <span class="sub-step" v-if="item.sub"></span>
              <span
                class="name"
                :style="{
                  color: item.isComplete
                    ? item.name == '立项暂停'
                      ? '#FF565C'
                      : item.name == '结束终止'
                      ? '#4E5569'
                      : '#222222'
                    : '#777777'
                }"
                ><b>{{ item.name }}</b></span
              >
              <span class="space-right-class"></span>
              <span class="space-bottom-left-class"></span>
              <ElTooltip effect="light">
                <span
                  class="circle relative"
                  v-if="!item.isNow"
                  @mouseenter="mouseOver(item, index)"
                  @mouseleave="mouseLeave(item)"
                  :style="{
                    background: item.isComplete
                      ? item.color
                        ? item.color
                        : '#00a0e9'
                      : item.color
                      ? item.color
                      : '#D8DBE7'
                  }"
                >
                  <div v-if="item.isComplete">
                    <img
                      src="@/assets/imgs/suspend.png"
                      class="text-white circle-check-mark"
                      v-if="item.name == '立项暂停'"
                    />
                    <img
                      src="@/assets/imgs/end.png"
                      class="text-white circle-check-mark"
                      v-else-if="item.name == '结束终止'"
                    />
                    <img src="@/assets/imgs/done.png" class="text-white circle-check-mark" v-else />
                  </div>
                  <!-- <Icon
                    icon="carbon:checkmark"
                    class="text-white circle-check-mark"
                    v-if="item.isComplete"
                /> -->
                </span>
                <!-- <img
                  src="@/assets/imgs/progress.png"
                  class="circle-p"
                  v-if="item.isNow"
                  @mouseenter="mouseOver(item, index)"
                  @mouseleave="mouseLeave(item)"
                /> -->
                <div
                  class="circle-p"
                  v-if="item.isNow"
                  @mouseenter="mouseOver(item, index)"
                  @mouseleave="mouseLeave(item)"
                >
                  <img src="@/assets/imgs/progress.png" />
                </div>

                <template #content>
                  <div class="content" v-if="item.subInfo.length">
                    <div
                      class="content-info"
                      v-for="(subItem, subIndex) in item.subInfo"
                      :key="subIndex + 111111"
                    >
                      <div class="left">{{ subItem.title }}</div>
                      <div class="right">
                        <p v-for="(it, i) in subItem.info" :key="i + 1000001" class="word-break">
                          <span>{{ it.title }}</span>
                          {{ it.content }}
                        </p>
                      </div>
                    </div></div
                  >
                  <template v-else>
                    <div class="content-info">
                      <p class="no-data">暂无数据</p>
                    </div>
                  </template>
                </template>
              </ElTooltip>
            </div>
          </div>
        </template>
      </div>
      <div class="step-wrap-bottom">
        <template v-for="(item, index) in stepsItems" :key="index">
          <div class="step-info" :style="{ width: '16.58%' }" v-if="index > 6">
            <div class="line" :style="{ background: item.isComplete ? '#00a0e9' : '#D8DBE7' }">
              <span class="sub-step" v-if="item.sub"></span>

              <span
                class="name"
                :style="{
                  color: item.isComplete
                    ? item.name == '立项暂停'
                      ? '#FF565C'
                      : item.name == '结束终止'
                      ? '#4E5569'
                      : '#222222'
                    : '#777777'
                }"
              >
                <b>{{ item.name }}</b>
              </span>
              <span class="space-bottom-class"></span>
              <ElTooltip effect="light">
                <span
                  class="circle relative"
                  v-if="!item.isNow"
                  @mouseenter="mouseOver(item, index)"
                  @mouseleave="mouseLeave(item)"
                  :style="{
                    background: item.isComplete
                      ? item.color
                        ? item.color
                        : '#00a0e9'
                      : item.color
                      ? item.color
                      : '#D8DBE7'
                  }"
                >
                  <div v-if="item.isComplete">
                    <img
                      src="@/assets/imgs/suspend.png"
                      class="text-white circle-check-mark"
                      v-if="item.name == '立项暂停'"
                    />
                    <img
                      src="@/assets/imgs/end.png"
                      class="text-white circle-check-mark"
                      v-else-if="item.name == '结束终止'"
                    />
                    <img src="@/assets/imgs/done.png" class="text-white circle-check-mark" v-else />
                  </div>
                  <!-- <Icon
                    icon="carbon:checkmark"
                    class="text-white circle-check-mark"
                    v-if="item.isComplete"
                /> -->
                </span>
                <div
                  class="circle-p"
                  v-if="item.isNow"
                  @mouseenter="mouseOver(item, index)"
                  @mouseleave="mouseLeave(item)"
                >
                  <img src="@/assets/imgs/progress.png" />
                </div>

                <template #content>
                  <div class="content" v-if="item.subInfo.length">
                    <div
                      class="content-info"
                      v-for="(subItem, subIndex) in item.subInfo"
                      :key="subIndex + 111111"
                    >
                      <div class="left">{{ subItem.title }}</div>
                      <div class="right">
                        <p v-for="(it, i) in subItem.info" :key="i + 1000001" class="word-break">
                          <span>{{ it.title }}</span>
                          {{ it.content }}
                        </p>
                      </div>
                    </div></div
                  >
                  <template v-else>
                    <div class="content-info">
                      <p class="no-data">暂无数据</p>
                    </div>
                  </template>
                </template>
              </ElTooltip>
            </div>
          </div>
        </template>
      </div>
    </div>
  </section>
</template>
  
  <style lang="less" scoped>
.circle-first {
  right: -0.3rem !important;
}
.no-data {
  text-align: center;
  padding: 10px 10px;
  width: 100%;
}
.circle-check-mark {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
}
.content {
  background: #ffffff;
  padding: 10px 20px;
  border-radius: 4px;
  // border: 1px solid #00a0e9;
  // box-shadow: 0 2px 4px 0 rgb(0 0 0 / 12%), 0 0 6px 0 rgb(0 0 0 / 4%);
  max-height: 400px;
  overflow: hidden;
  overflow-y: auto;
  z-index: 9999;
  &::before {
  }
  .content-info {
    border-bottom: 1px dashed rgba(217, 221, 231, 0.8);
    width: 250px;
    display: flex;
    margin: 10px 0;
    padding-bottom: 10px;
    .left {
      min-width: 50px;
      font-weight: bold;
    }
    .right {
      text-align: left;
      p {
        padding: 2px 0;
        span {
          display: inline-block;
          min-width: 65px;
        }
      }
    }
    &:last-child {
      border-bottom: none;
      padding-bottom: 0;
    }
  }
}
.content-info {
  border-bottom: 1px dashed rgba(217, 221, 231, 0.8);
  width: 250px;
  display: flex;
  max-height: 400px;
  overflow: hidden;
  overflow-y: auto;
  margin: 10px 0;
  padding-bottom: 10px;
  .left {
    min-width: 50px;
    font-weight: bold;
  }
  .right {
    text-align: left;
    p {
      padding: 2px 0;
      span {
        display: inline-block;
        min-width: 65px;
      }
    }
  }
  &:last-child {
    border-bottom: none;
    padding-bottom: 0;
  }
}
.step-wrapper {
  margin-bottom: 29px !important;
  position: relative;
  // width: 75%;
  margin: 0 3% 0 1%;
  margin-top: 23px;
  text-align: right;
  .step-wrap {
    display: flex;
    align-items: center;
    .sub-step {
      display: inline-block;
      height: 100%;
      width: 50%;
      background: #00a0e9;
      position: absolute;
      top: 0px;
      left: 0;
    }
    .step-info {
      width: 30%;
      .line {
        height: 2px;
        width: 100%;
        background: #e9edf2;
        position: relative;
        background: firebrick;
      }

      .name {
        position: absolute;
        top: 50%;
        transform: translateY(-50%);
        display: block;
        min-width: 200px;
        text-align: left;
        z-index: 999;
        right: -202px;
        font-weight: 300;

        color: #222222;
        b {
          font-size: 15px;
          padding: 0 4px;
          display: inline-block;
          background: #eff1f4;
        }
      }
      .circle {
        display: inline-block;
        background: #d8dbe7;
        height: 22px;
        width: 22px;
        border-radius: 50%;
        position: absolute;
        right: -2px;
        top: 50%;
        transform: translateY(-50%);
        z-index: 999;
        cursor: pointer;
        &:hover {
          // background: #00a0e9;
        }
      }
      .circle-p {
        position: absolute;

        background: #ffffff;
        // border: 2px solid #00a0e9;
        display: inline-block;
        height: 24px;
        width: 24px;
        border-radius: 50%;
        right: -4px;
        top: 50%;
        transform: translateY(-50%);
        cursor: pointer;
        text-align: center;
        line-height: 20px;
        z-index: 999;
        .circle-sub {
          display: inline-block;
          background: #00a0e9;
          height: 12px;
          width: 12px;
          border-radius: 50%;
          position: relative;
          left: 50%;
          top: 50%;
          transform: translate(-80%, -80%);
        }
      }
      .content {
        position: absolute;
        top: 36px;
        right: -140px;
        background: #ffffff;
        padding: 10px 20px;
        border-radius: 4px;
        border: 1px solid #00a0e9;
        box-shadow: 0 2px 4px 0 rgb(0 0 0 / 12%), 0 0 6px 0 rgb(0 0 0 / 4%);
        max-height: 400px;
        overflow: hidden;
        overflow-y: auto;
        z-index: 9999;
        &::before {
        }
        .content-info {
          border-bottom: 1px dashed rgba(217, 221, 231, 0.8);
          width: 250px;
          display: flex;
          margin: 10px 0;
          padding-bottom: 10px;
          .left {
            min-width: 50px;
            font-weight: bold;
          }
          .right {
            text-align: left;
            p {
              padding: 2px 0;
              span {
                display: inline-block;
                min-width: 65px;
              }
            }
          }
          &:last-child {
            border-bottom: none;
            padding-bottom: 0;
          }
        }
      }
      .triangle {
        position: absolute;
        top: 16px;
        right: -4px;
        width: 0;
        height: 0;
        z-index: 10;
        border-right: 14px solid transparent;
        border-left: 14px solid transparent;
        border-bottom: 20px solid #00a0e9;
      }
      .triangle2 {
        position: absolute;
        top: 19px;
        right: -4px;
        width: 0;
        height: 0;
        z-index: 10;
        border-right: 10px solid transparent;
        border-left: 10px solid transparent;
        border-bottom: 20px solid #ffffff;
      }
    }
  }
  // 右侧进度
  .step-wrap-right {
    // width: 30px;
    // position: absolute;
    // right: -5px;
    display: inline-block;
    margin-right: 8px;
    .step-info {
      margin: 0 auto;
      height: 100%;
      height: 8vw;
      .line {
        height: 100%;
        width: 2px;
        background: #999999;
        margin: 0 auto;
        position: relative;
        .sub-step {
          display: inline-block;
          height: 50%;
          width: 100%;
          background: #00a0e9;
          position: absolute;
          top: 0px;
          left: -0.5px;
        }
        .name {
          position: absolute;
          bottom: -8px;
          left: 18px;
          min-width: 100px;
          font-weight: 300;
          color: #222222;
          z-index: 999;
          display: inline-block;
          text-align: left;
          b {
            font-size: 15px;
            padding: 0 4px;
            display: inline-block;
            background: #eff1f4;
          }
          // display: none;
        }
        .circle {
          display: inline-block;
          background: #999999;
          height: 22px;
          width: 22px;
          border-radius: 50%;
          position: absolute;
          right: 50%;
          transform: translateX(50%);
          bottom: -10px;
          z-index: 999;
          cursor: pointer;
          &:hover {
            background: #00a0e9;
          }
        }
        .circle-p {
          position: absolute;
          background: #ffffff;
          // border: 2px solid #00a0e9;
          display: inline-block;
          height: 22px;
          width: 22px;
          border-radius: 50%;
          right: 50%;
          transform: translateX(50%);
          bottom: -10px;
          cursor: pointer;
          text-align: center;
          z-index: 999;
          .circle-sub {
            display: inline-block;
            background: #00a0e9;
            height: 12px;
            width: 12px;
            border-radius: 50%;
            // margin-top: 2px;
          }
        }
        .content {
          position: absolute;
          top: 6px;
          right: 27px;
          background: #ffffff;
          padding: 10px 20px;
          border-radius: 4px;
          border: 1px solid #00a0e9;
          box-shadow: 0 2px 4px 0 rgb(0 0 0 / 12%), 0 0 6px 0 rgb(0 0 0 / 4%);
          max-height: 400px;
          overflow: hidden;
          overflow-y: auto;
          z-index: 9999;
          &::before {
          }
          .content-info {
            border-bottom: 1px dashed rgba(217, 221, 231, 0.8);
            width: 250px;
            display: flex;
            margin: 10px 0;
            padding-bottom: 10px;
            .left {
              min-width: 50px;
              font-weight: bold;
            }
            .right {
              text-align: left;
              p {
                padding: 2px 0;
                span {
                  display: inline-block;
                  min-width: 65px;
                }
              }
            }
            &:last-child {
              border-bottom: none;
              padding-bottom: 0;
            }
          }
        }
        .triangle {
          position: absolute;
          bottom: -5px;
          right: 18px;
          width: 0;
          height: 0;
          z-index: 10;
          border-top: 14px solid transparent;
          border-bottom: 14px solid transparent;
          border-left: 20px solid #00a0e9;
        }
        .triangle2 {
          position: absolute;
          bottom: -5px;
          right: 20px;
          width: 0;
          height: 0;
          z-index: 10;
          border-top: 10px solid transparent;
          border-bottom: 10px solid transparent;
          border-left: 19px solid #ffffff;
        }
      }
    }
  }
  .step-wrap-bottom {
    position: absolute;
    // top: 400px;
    bottom: 5px;
    right: 0;
    width: 100%;
    flex-direction: row-reverse;
    justify-content: flex-end;
    .sub-step {
      display: inline-block;
      height: 100%;
      width: 50%;
      background: #00a0e9;
      position: absolute;
      top: 0px;
      right: 0;
    }
    .step-info {
      width: 16.6%;
      float: right;
      .line {
        height: 2px;
        width: 100%;
        background: #999999;
        position: relative;
      }
      .name {
        position: absolute;
        top: 50%;
        transform: translateY(-50%);
        display: block;
        min-width: 200px;
        text-align: left;
        font-weight: 300;
        color: #222222;
        left: 10px;
        b {
          font-size: 15px;
          padding: 0 4px;
          display: inline-block;
          background: #eff1f4;
        }
      }
      .circle {
        display: inline-block;
        background: #d8dbe7;
        height: 22px;
        width: 22px;
        border-radius: 50%;
        position: absolute;
        left: -12px;
        top: 50%;
        transform: translateY(-50%);
        z-index: 999;
        cursor: pointer;
        &:hover {
          background: #00a0e9;
        }
      }
      .circle-p {
        position: absolute;
        display: flex;
        background: #ffffff;
        // border: 2px solid #00a0e9;
        display: inline-block;
        height: 20px;
        width: 20px;
        border-radius: 50%;
        left: -10px;
        top: 50%;
        transform: translateY(-50%);
        cursor: pointer;
        text-align: center;
        z-index: 999;
        .circle-sub {
          display: inline-block;
          background: #00a0e9;
          height: 12px;
          width: 12px;
          border-radius: 50%;
          // margin-top: 2px;
        }
      }
      .content {
        position: absolute;
        top: 36px;
        left: -110px;
        background: #ffffff;
        padding: 10px 20px;
        border-radius: 4px;
        border: 1px solid #00a0e9;
        box-shadow: 0 2px 4px 0 rgb(0 0 0 / 12%), 0 0 6px 0 rgb(0 0 0 / 4%);
        max-height: 400px;
        overflow: hidden;
        overflow-y: auto;
        z-index: 9999;
        &::before {
        }
        .content-info {
          border-bottom: 1px dashed rgba(217, 221, 231, 0.8);
          width: 250px;
          display: flex;
          margin: 10px 0;
          padding-bottom: 10px;
          .left {
            min-width: 50px;
            font-weight: bold;
          }
          .right {
            text-align: left;
            p {
              padding: 2px 0;
              span {
                display: inline-block;
                min-width: 65px;
              }
            }
          }
          &:last-child {
            border-bottom: none;
            padding-bottom: 0;
          }
        }
      }
      .triangle {
        position: absolute;
        top: 16px;
        left: -19px;
        width: 0;
        height: 0;
        z-index: 10;
        border-right: 14px solid transparent;
        border-left: 14px solid transparent;
        border-bottom: 20px solid #00a0e9;
      }
      .triangle2 {
        position: absolute;
        top: 19px;
        left: -19px;
        width: 0;
        height: 0;
        z-index: 10;
        border-right: 10px solid transparent;
        border-left: 10px solid transparent;
        border-bottom: 20px solid #ffffff;
      }
    }
  }
}
.process-bar-top li {
}
.process-bar-bottom li {
}
.space-left-class {
  display: inline-block;
  background: #eff1f4;
  height: 18px;
  width: 18px;
  position: absolute;
  right: 6px;
  top: 50%;
  transform: translateY(-50%);
  z-index: 999;
}
.space-right-class {
  display: inline-block;
  background: #eff1f4;
  height: 18px;
  width: 18px;
  position: absolute;
  right: 50%;
  transform: translateX(50%);
  bottom: -3px;
  z-index: 999;
}
.space-bottom-class {
  display: inline-block;
  background: #eff1f4;
  height: 18px;
  width: 18px;
  position: absolute;
  z-index: 999;
  left: -15px;
  top: 50%;
  transform: translateY(-50%);
}
.space-bottom-left-class {
  display: inline-block;
  background: #eff1f4;
  height: 18px;
  width: 15px;
  position: absolute;
  z-index: 999;
  right: 50%;
  bottom: -8px;
}
@media screen and (max-width: 1435px) {
  .step-wrapper {
    .step-wrap {
      .step-info {
        .name {
          b {
            font-size: 12px;
          }
        }
      }
    }
    .step-wrap-right {
      .step-info {
        .line {
          .name {
            b {
              font-size: 12px;
            }
          }
        }
      }
    }
    .step-wrap-bottom {
      .step-info {
        .name {
          b {
            font-size: 12px;
          }
        }
      }
    }
  }
}
</style>
  