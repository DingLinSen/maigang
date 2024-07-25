/**
 * subjectlearn - 课目学习主表 - 列表 columns 配置
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
    subjectType: {
      title: '课目类型',
      minWidth: 100,
      key: 'subjectType',
      align: 'center',
      render: (h, params) => {
        let value = params.row.subjectType
        if (typeof (value) === 'undefined' || value === null || value === '') {
          value = '--'
        }else{
          value = value === '1' ? '理论知识' : (value === '2' ? '专业操作' : ('--'))
          // 1理论知识 2 专业操作
        }
        return h('div', [
          h('span', {
            style: {
              display: 'inline-block',
              width: '100%'
            },
            domProps: {
              title: value
            }
          }, value)
        ])
      }
    },
    subjectName: {
      title: '课目名称',
      minWidth: 150,
      key: 'subjectName',
      align: 'center',
      render: (h, params) => {
        let value = params.row.subjectName
        if (typeof (value) === 'undefined' || value === null || value === '') {
          value = '--'
        }
        return h('div', [
          h('span', {
            style: {
              display: 'inline-block',
              width: '100%'
            },
            domProps: {
              title: params.row.subjectName
            }
          }, value)
        ])
      }
    },
    taskName: {
      title: '任务名称',
      minWidth: 150,
      key: 'taskName',
      align: 'center',
      render: (h, params) => {
        let value = params.row.taskName
        if (typeof (value) === 'undefined' || value === null || value === '') {
          value = '--'
        }
        return h('div', [
          h('span', {
            style: {
              display: 'inline-block',
              width: '100%'
            },
            domProps: {
              title: params.row.taskName
            }
          }, value)
        ])
      }
    },
    subjectIntroduction: {
      title: '课目简介',
      minWidth: 150,
      key: 'subjectIntroduction',
      align: 'center',
      render: (h, params) => {
        let value = params.row.subjectIntroduction
        if (typeof (value) === 'undefined' || value === null || value === '') {
          value = '--'
        }
        return h('div', [
          h('span', {
            style: {
              display: 'inline-block',
              width: '100%'
            },
            domProps: {
              title: params.row.subjectIntroduction
            }
          }, value)
        ])
      }
    },
    startDate: {
      title: '计划期限',
      minWidth: 200,
      key: 'startDate',
      align: 'center',
      render: (h, params) => {
        let value = params.row.startDate
        let endDate = params.row.endDate
        if ((typeof (value) === 'undefined' || value === null || value === '') && (typeof (endDate) === 'undefined' || endDate === null || endDate === '')) {
          value = '--'
        }else{
          value = params.row.startDate + ' ~ ' + params.row.endDate
        }
        return h('div', [
          h('span', {
            style: {
              display: 'inline-block',
              width: '100%'
            },
            domProps: {
              title: params.row.startDate + ' ~ ' + params.row.endDate
            }
          }, value)
        ])
      }
    },
    totalProgress: {
      title: '进度',
      minWidth: 100,
      key: 'totalProgress',
      align: 'center',
      render: (h, params) => {
        let value = params.row.totalProgress.toFixed(2)
        if (typeof (value) === 'undefined' || value === null || value === '') {
          value = '--'
        }
        return h('div', [
          h('span', {
            class: 'c-primary',
            style: {
              display: 'inline-block',
              fontWeight: '600',
              width: '100%'
            }
          }, value + ' %')
        ])
      }
    },
    option: {
      title: '操作区域',
      width: 150,
      key: 'option',
      align: 'center',
      fixed: 'right',
      render: (h, params) => {
        let renderData = []
        if(_this.canFindByID && params.row.trainType === '0') {
          renderData.push(
            h('span', { // 详情、查看
              class: 'c-primary',
              props: {
                type: 'primary'
              },
              style: {
                cursor: 'pointer',
                fontSize: '15px',
                marginRight: '10px'
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
                  _this.openDrawer(2)
                }
              }
            }, '查看')
          )
        }
        let newDate = (new Date()).getTime()
        let endDate = new Date(params.row.endDate + ' 23:59:59').getTime() //
        if(_this.canLearn && newDate < endDate && params.row.totalProgress < 100) {
          renderData.push(
            h('span', {
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
                  // 1理论知识 2 专业操作
                  // "train_type" IS '类型 0 理论学习 1发报技术 2收报技术 3译电技术 默认0'
                  if(params.row.trainType === '0') {
                    _this.openDrawer(3)
                  }else if(params.row.trainType === '1') {
                    _this.$router.push({
                      name: 'technical-transmit',
                      query: {
                        subjectId: params.row.id
                      }
                    })
                  }else if(params.row.trainType === '2') {
                    _this.$router.push({
                      name: 'technical-at',
                      query: {
                        subjectId: params.row.id
                      }
                    })
                  }else if(params.row.trainType === '3') {
                    _this.$router.push({
                      name: 'technical-coding',
                      query: {
                        subjectId: params.row.id
                      }
                    })
                  }
                }
              }
            }, '学习')
          )
        }

        return renderData
      }
    }
  }
}
