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
    deptName: {
      title: '任务单位',
      minWidth: 140,
      key: 'deptName',
      align: 'center',
      render: (h, params) => {
        let value = params.row.deptName
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
                title: params.row.deptName
              }
            },
            value
          )
        ])
      }
    },
    taskName: {
      title: '任务名称',
      minWidth: 140,
      key: 'taskName',
      align: 'center',
      render: (h, params) => {
        let value = params.row.taskName
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
                title: params.row.taskName
              }
            },
            value
          )
        ])
      }
    },
    taskTimeStart: {
      title: '任务期限',
      minWidth: 210,
      key: 'taskTimeStart',
      align: 'center',
      render: (h, params) => {
        let value = params.row.taskTimeStart
        let valueEnd = params.row.taskTimeEnd
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
    status: {
      title: '状态',
      minWidth: 80,
      key: 'status',
      align: 'center',
      render: (h, params) => {
        let value = params.row.status
        if (typeof value === 'undefined' || value === null || value === '') {
          value = '--'
        } else {
          value =
            value === '1'
              ? '未启动'
              : value === '2'
              ? '进行中'
              : value === '3'
              ? '已关闭'
              : value === '4'
              ? '已结束'
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
    taskUserDOS: {
      title: '参与人员',
      minWidth: 200,
      key: 'taskUserDOS',
      align: 'center',
      render: (h, params) => {
        let value = '--'
        let userArray = []
        if (params.row.taskUserDOS && params.row.taskUserDOS.length > 0) {
          params.row.taskUserDOS.forEach(item => {
            userArray.push(item.userName)
          })
        }
        if (userArray.length > 0) {
          value = userArray.join('，')
        }
        return h('div', [
          h(
            'span',
            {
              class: 'text3line',
              style: {
                display: '-webkit-box',
                width: '100%',
                whiteSpace: 'normal',
                wordWrap: 'break-word'
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
    TrainingContent: {
      title: '任务内容',
      minWidth: 250,
      key: 'deptId',
      align: 'center',
      render: (h, params) => {
        // 循环取出subjectName进行拼接
        let subjectType = ''
        let value = '--'
        var subjectArray = []
        if (params.row.taskSubjectDOS && params.row.taskSubjectDOS.length > 0) {
          params.row.taskSubjectDOS.forEach(item => {
            subjectType = item.type ? String(item.type) : '1'
            subjectArray.push(item.subjectName)
          })
        }
        if (subjectArray.length > 0) {
          value = subjectArray.join('，')
        }
        // let value1 = params.row.subjectId
        let value2 = params.row.totalTime
        // 将value2转换成小时
        let totalTimeH = ''
        if (value2 > 3600) {
          let totalTimeBr = value2 / 3600
          let totalTimeBr2 = Math.round(totalTimeBr * 10) / 10
          totalTimeH = totalTimeBr2 + '小时'
        } else {
          let totalTimeBr = value2 / 60
          let totalTimeBr2 = Math.round(totalTimeBr * 10) / 10
          totalTimeH = totalTimeBr2 + '分钟'
        }
        let value4 = params.row.trainFrequency
        let trainFrequency = '--'
        if(value4){
          trainFrequency = value4 + '次'
        }
        let value3 = params.row.target
        if (typeof value === 'undefined' || value === null || value === '') {
          value = '--'
        }
        if (typeof value2 === 'undefined' || value2 === null || value2 === '') {
          value2 = '--'
        }
        if (typeof value3 === 'undefined' || value3 === null || value3 === '') {
          value3 = '--'
        }
        if (typeof value4 === 'undefined' || value4 === null || value4 === '') {
          value4 = '--'
        }
        return h(
          'div',
          {
            style: {
              marginTop: '5px',
              marginBottom: '5px'
            }
          },
          [
            h(
              'span',
              {
                style: {
                  display: 'inline-block',
                  textAlign: 'left',
                  width: '100%'
                },
                domProps: {
                  title: value
                }
              },
              '课目：' + value
            ),
            h(
              'span',
              {
                style: {
                  display: 'inline-block',
                  textAlign: 'left',
                  width: '100%'
                },
                domProps: {
                  title: subjectType === '1' ? totalTimeH : trainFrequency
                }
              },
              subjectType === '1' ? '时长：' + totalTimeH : '次数：' + trainFrequency
              
            ),
            h(
              'span',
              {
                style: {
                  display: 'inline-block',
                  textAlign: 'left',
                  width: '100%'
                },
                domProps: {
                  title: value3
                }
              },
              '目标：' + value3
            )
          ]
        )
      }
    },
    status0: {
      title: '是否发布',
      minWidth: 100,
      key: 'status',
      align: 'center',
      render: (h, params) => {
        let value = params.row.status
        if (typeof value === 'undefined' || value === null || value === '') {
          value = '--'
        }
        return h(
          'div',
          [
            h(
              'el-switch',
              {
                props: {
                  value: params.row.status === '2',
                  'active-text': '是',
                  'inactive-text': '否',
                  activeColor: '#17B3A3'
                },
                nativeOn: {
                  click: () => {
                    _this.chooseListData = []
                    _this.chooseListData.push(params.row)
                    const objData = _this.$refs.tables.$refs.tablesMain.objData
                    const objDataArray = Object.getOwnPropertyNames(objData)
                    objDataArray.forEach(item => {
                      objData[item]._isChecked = false
                    })
                    objData[params.index]._isChecked = true
                    _this.handleBeforeChange()
                  }
                },
                domProps: {
                  value
                }
              },
              value
            )
          ]
        )
      }
    },
    createByName: {
      title: '创建人',
      minWidth: 140,
      key: 'createByName',
      align: 'center',
      render: (h, params) => {
        let value = params.row.createByName
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
      minWidth: 160,
      key: 'option',
      align: 'center',
      fixed: 'right',
      render: (h, params) => {
        let renderData = []
        if (_this.canEdit && params.row.status === '1') {
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
                  fontSize: '15px',
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

        if (_this.canClose && params.row.status === '2' && params.row.isClose === 0) {
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
                  marginRight: '10px',
                  fontSize: '15px',
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
                    _this.closeTask()
                  }
                }
              },
              '关闭'
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
                  fontSize: '15px',
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
