/**
 * planyear - 计划-年计划表 - 列表 columns 配置
 * @param _this
 * @returns {*}
 * @author yxm
 * @date 2022-04-07
 */
module.exports = function(_this) {
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
    userName: {
      title: '参训人员',
      minWidth: 120,
      key: 'userName',
      align: 'center',
      render: (h, params) => {
        let value = params.row.userName
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
    taskTimeStart: {
      title: '训练时间',
      minWidth: 210,
      key: 'taskTimeStart',
      align: 'center',
      render: (h, params) => {
        let value = params.row.taskTimeStart
          ? _this.$moment(params.row.taskTimeStart).format('YYYY-MM-DD')
          : ''
        let valueEnd = params.row.taskTimeEnd
          ? _this.$moment(params.row.taskTimeEnd).format('YYYY-MM-DD')
          : ''
        if (typeof value === 'undefined' || value === null || value === '') {
          value = '--'
        } else {
          if (
            typeof valueEnd === 'undefined' ||
            valueEnd === null ||
            valueEnd === ''
          ) {
            value = value
          } else {
            value = value + '~' + valueEnd
          }
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
    recordSubjectDOS: {
      title: '课目名称',
      minWidth: 180,
      key: 'recordSubjectDOS',
      align: 'center',
      render: (h, params) => {
        let value = '--'
        var subjectArray = []
        if (params.row.recordSubjectDOS && params.row.recordSubjectDOS.length > 0) {
          params.row.recordSubjectDOS.forEach(item => {
            subjectArray.push(item.subjectName)
          })
        }
        if (subjectArray.length > 0) {
          value = subjectArray.join('，')
        }

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
    trainTime: {
      title: '训练时长(理论知识)',
      minWidth: 160,
      key: 'trainTime',
      align: 'center',
      render: (h, params) => {
        let value = params.row.trainTime 
        if (typeof value === 'undefined' || value === null || value === '') {
          value = '--'
        } else {
          let totalTimeBr = value / 3600
          value = String(Math.round(totalTimeBr * 10) / 10)
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
    trainFrequency: {
      title: '训练次数(专业技术)',
      minWidth: 160,
      key: 'trainFrequency',
      align: 'center',
      render: (h, params) => {
        let value = params.row.trainFrequency
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
    effect: {
      title: '训练效果',
      minWidth: 100,
      key: 'effect',
      align: 'center',
      render: (h, params) => {
        let value = params.row.effect
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
    score: {
      title: '考核成绩',
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
    taskId: {
      title: '数据来源',
      minWidth: 120,
      key: 'taskId',
      align: 'center',
      render: (h, params) => {
        let value = params.row.taskId
        if (typeof value === 'undefined' || value === null || value === '') {
          value = '手动填写'
        } else {
          value = '自动生成'
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
      minWidth: 160,
      key: 'option',
      align: 'center',
      fixed: 'right',
      render: (h, params) => {
        let dateEnd = params.row.taskTimeEnd
          ? _this.$moment(params.row.taskTimeEnd).format('YYYY-MM')
          : ''
        let newDate = _this.$moment(new Date()).format('YYYY-MM')
        let renderData = []
        if (_this.canEdit && !params.row.taskId && newDate === dateEnd) {
          renderData.push(
            h(
              'span', // 编辑
              {
                class: 'c-success',
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
        if (_this.canDelete && !params.row.taskId && newDate === dateEnd) {
          renderData.push(
            h(
              'span', // 删除
              {
                class: 'c-error',
                props: {
                  type: 'error'
                },
                style: {
                  cursor: 'pointer',
                  marginRight: '10px',
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
        if (_this.canFindByID) {
          renderData.push(
            h(
              'span',
              {
                // 详情、查看
                class: 'c-success',
                props: {
                  type: 'primary'
                },
                style: {
                  cursor: 'pointer',
                  marginRight: '10px',
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
        return renderData
      }
    }
  }
}
