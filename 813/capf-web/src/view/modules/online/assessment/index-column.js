/**
 * videomanagement - 考核管理表 - 列表 columns 配置
 * @param _this
 * @returns {*}
 * @author yxm
 * @date 2022-04-07
 */
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
    examinationTime: {
      title: '考试时间',
      minWidth: 300,
      key: 'startTime',
      align: 'center',
      render: (h, params) => {
        let startTime = params.row.startTime
        let endTime = params.row.endTime

        if (typeof startTime === 'undefined' || startTime === null || startTime === '') {
          startTime = '--'
        } else {
          // if(_this.$moment(startTime).format('HH:mm:ss') == '00:00:00') {
          startTime = _this.$moment(startTime).format('YYYY-MM-DD HH:mm:ss')
          // }
        }
        if (typeof endTime === 'undefined' || endTime === null || endTime === '') {
          endTime = '--'
        } else {
          // if(_this.$moment(endTime).format('HH:mm:ss') == '23:59:59') {
          endTime = _this.$moment(endTime).format('YYYY-MM-DD HH:mm:ss')
          // }
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
                title: startTime + '~' + endTime
              }
            },
            startTime + '~' + endTime
          )
        ])
      }
    },
    totalScore: {
      title: '考试总分',
      minWidth: 100,
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
      minWidth: 100,
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
    status: {
      title: '状态',
      minWidth: 100,
      key: 'status',
      align: 'center',
      render: (h, params) => {
        let startTime = params.row.startTime
        let endTime = params.row.endTime
        let value = moment(new Date()).format('YYYY-MM-DD HH:mm:ss')
        // eslint-disable-next-line valid-typeof
        if (typeof value === 'status' || value === null || value === '') {
          value = '--'
        } else {
          value =
            value < startTime
              ? '未开始'
              : (value > startTime) && (value < endTime)
                ? '已开始'
                : value > endTime
                  ? '已完结'
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
    option: {
      title: '操作区域',
      minWidth: 170,
      key: 'option',
      align: 'center',
      fixed: 'right',
      render: (h, params) => {
        let renderData = []
        let startDate0 = new Date(params.row.startTime).valueOf() - 5 * 60 * 1000
        let endDate0 = new Date(params.row.endTime).valueOf()
        if (_this.canEdit && (endDate0 > Date.now() || startDate0 > Date.now())) {
          renderData.push(
            h(
              'span', // 编辑
              {
                class: 'c-primary',
                props: {
                  type: 'warning',
                  size: 'small'
                },
                style: {
                  cursor: 'pointer',
                  marginRight: '10px',
                  fontSize: '15px'
                },
                on: {
                  click: () => {
                    var startDate = new Date(params.row.startTime).valueOf() - 5 * 60 * 1000
                    var endDate = new Date(params.row.endTime).valueOf()
                    if (endDate < Date.now()) {
                      _this.$Message.error('考试已经结束，无法修改信息！')
                      return
                    }
                    if (startDate < Date.now()) {
                      _this.$Message.error('考试即将或已经开始，无法修改信息！')
                      return
                    }
                    _this.chooseListData = []
                    _this.chooseListData.push(params.row)

                    const objData = _this.$refs.tables.$refs.tablesMain.objData
                    const objDataArray = Object.getOwnPropertyNames(objData)

                    objDataArray.forEach(item => {
                      objData[item]._isChecked = false
                    })
                    objData[params.index]._isChecked = true
                    _this.updateDrawerChange()
                  }
                }
              },
              '编辑'
            )
          )
        }
        if (_this.canFindByID) {
          renderData.push(
            h(
              'span',
              {
                // 详情、查看
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
                    _this.chooseListData = []
                    _this.chooseListData.push(params.row)

                    const objData = _this.$refs.tables.$refs.tablesMain.objData
                    const objDataArray = Object.getOwnPropertyNames(objData)

                    objDataArray.forEach(item => {
                      objData[item]._isChecked = false
                    })
                    objData[params.index]._isChecked = true
                    _this.turnToDetails()
                  }
                }
              },
              '详情'
            )
          )
        }
        if (startDate0 > Date.now()) {
          renderData.push(
            h(
              'span', // 删除
              {
                class: 'c-error',
                props: {
                  type: 'error',
                  size: 'small'
                },
                style: {
                  cursor: 'pointer',
                  marginLeft: '10px',
                  fontSize: '15px'
                },
                on: {
                  click: () => {
                    _this.chooseListData = []
                    _this.chooseListData.push(params.row)

                    const objData = _this.$refs.tables.$refs.tablesMain.objData
                    const objDataArray = Object.getOwnPropertyNames(objData)

                    objDataArray.forEach(item => {
                      objData[item]._isChecked = false
                    })
                    objData[params.index]._isChecked = true
                    _this.btnDeleteBallast()
                  }
                }
              },
              '删除'
            )
          )
        }
        return renderData
      }
    }
  }
}
