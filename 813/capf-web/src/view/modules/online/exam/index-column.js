/**
 * examinepoint - 网上考核-成绩管理 - 列表 columns 配置
 * @param _this
 * @returns {*}
 * @author yxm
 * @date 2022-04-07
 */
const Da = require('element-ui/src/locale/lang/da')
const moment = require('moment')
module.exports = function (_this) {
  return {
    handle: {
      type: 'selection',
      width: 40, // 复选框
      className: 'pad-lft-no',
      align: 'center',
      fixed: 'left',
      key: 'handle'
    },
    id: {
      type: 'index',
      width: 60, // 序号
      className: 'pad-lft-no',
      align: 'center',
      title: '序号',
      fixed: 'left',
      key: 'id'
    },
    examinationName: {
      title: '考试名称',
      minWidth: 200,
      key: 'examinationName',
      align: 'center',
      render: (h, params) => {
        let value = params.row.examinationName
        if (typeof value === 'undefined' || value === null || value === '') {
          value = '--'
        }
        return h('div', [
          h(
            'span',
            {
              style: {
                display: 'inline-block',
                width: '100%'
              },
              domProps: {
                title: value
              }
            },
            value
          )
        ])
      }
    },
    type: {
      title: '考试类型',
      minWidth: 140,
      key: 'type',
      align: 'center',
      render: (h, params) => {
        let value = params.row.type
        if (typeof value === 'undefined' || value === null || value === '') {
          value = '--'
        } else {
          value =
            value === '1'
              ? '结业考核初考'
              : value === '2'
                ? '结业考核补考'
                : value === '3'
                  ? '季度考核'
                  : value === '4'
                    ? '抽考'
                    : '--'
        }
        return h('div', [
          h(
            'span',
            {
              // class: 'c-primary',
              style: {
                display: 'inline-block',
                width: '100%'
                // whiteSpace: 'normal',
                // textDecoration: 'underline'
              },
              domProps: {
                title: value
              }
            },
            value
          )
        ])
      }
    },
    examinationTime: {
      title: '考试时间',
      minWidth: 300,
      key: 'startTime',
      align: 'center',
      render: (h, params) => {
        let value = params.row.startTime
        let endTime = params.row.endTime
        if (typeof value === 'undefined' || value === null || value === '') {
          value = '--'
        } else {
          value = _this.$moment(value).format('YYYY-MM-DD HH:mm:ss')
        }
        if (typeof endTime === 'undefined' || endTime === null || endTime === '') {
          endTime = '--'
        } else {
          endTime = _this.$moment(endTime).format('YYYY-MM-DD HH:mm:ss')
        }
        return h('div', [
          h(
            'span',
            {
              style: {
                display: 'inline-block',
                width: '100%'
              },
              domProps: {
                title: value + '~' + endTime
              }
            },
            value + '~' + endTime
          )
        ])
      }
    },
    totalScore: {
      title: '试卷总分',
      minWidth: 120,
      key: 'score',
      align: 'center',
      render: (h, params) => {
        let value = params.row.score
        if (typeof value === 'undefined' || value === null || value === '') {
          value = '--'
        }
        return h('div', [
          h(
            'span',
            {
              style: {
                display: 'inline-block',
                width: '100%'
              },
              domProps: {
                title: value
              }
            },
            value
          )
        ])
      }
    },
    passingMark: {
      title: '及格线',
      minWidth: 120,
      key: 'passScore',
      align: 'center',
      render: (h, params) => {
        let value = params.row.passScore
        if (typeof value === 'undefined' || value === null || value === '') {
          value = '--'
        }
        return h('div', [
          h(
            'span',
            {
              style: {
                display: 'inline-block',
                width: '100%'
              },
              domProps: {
                title: value
              }
            },
            value
          )
        ])
      }
    },
    testDuration: {
      title: '考试时长(分钟)',
      minWidth: 120,
      key: 'testDuration',
      align: 'center',
      render: (h, params) => {
        let value = params.row.testDuration
        if (typeof value === 'undefined' || value === null || value === '') {
          value = '--'
        }
        return h('div', [
          h(
            'span',
            {
              style: {
                display: 'inline-block',
                width: '100%'
              },
              domProps: {
                title: value
              }
            },
            value
          )
        ])
      }
    },
    option: {
      title: '操作区域',
      minWidth: 100,
      key: 'option',
      align: 'center',
      fixed: 'right',
      render: (h, params) => {
        let renderData = []
        let now = moment(new Date()).format('YYYY-MM-DD HH:mm:ss')
        if (params.row.assStatus == 0 && (now > params.row.startTime) && (now < params.row.endTime)) {
          renderData.push(
            h('span', { // 详情、查看
              class: 'c-primary',
              props: {
                type: 'primary'
              },
              style: {
                cursor: 'pointer',
                fontSize: '15px'
              },
              on: {
                click: () => {
                  // localStorage.setItem('assId', params.row.assessmentId)
                  _this.$router.push({
                    path: '/test',
                    query: {
                      testStepFlag: params.row.isAuth,
                      assId: params.row.assessmentId,
                      testDuration: params.row.testDuration,
                      passScore: params.row.passScore
                    }
                  })
                }
              }
            }, '去考试')
          )
        }
        if (params.row.assStatus == 1 || (now > params.row.endTime)) {
          renderData.push(
            h('span', { // 详情、查看
              class: 'c-primary',
              props: {
                type: 'primary'
              },
              style: {
                cursor: 'pointer',
                fontSize: '15px'
              }
              // on: {
              //   click: () => {
              //     _this.$router.push({
              //       name: 'test',
              //       params: {
              //         testStepFlag: true,
              //         assId: params.row.assessmentId,
              //         testDuration: params.row.testDuration,
              //         passScore: params.row.passScore
              //       }
              //     })
              //   }
              // }
            }, '已完结')
          )
        }
        if (params.row.assStatus == 0 && now < params.row.startTime) {
          renderData.push(
            h('span', { // 详情、查看
              class: 'c-primary',
              props: {
                type: 'primary'
              },
              style: {
                cursor: 'pointer',
                fontSize: '15px'
              }
              // on: {
              //   click: () => {
              //     _this.$router.push({
              //       name: 'test',
              //       params: {
              //         testStepFlag: true,
              //         assId: params.row.assessmentId,
              //         testDuration: params.row.testDuration,
              //         passScore: params.row.passScore
              //       }
              //     })
              //   }
              // }
            }, '未开始')
          )
        }

        return renderData
      }
    }
  }
}
