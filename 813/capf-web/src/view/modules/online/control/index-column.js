/**
  * @description control - 考核控制- 列表 columns 配置
  * @param _this
  * @returns {*}
  * @author yxm
  * @date 2021-10-19
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
    examinationName: {
      title: '考核名称',
      minWidth: 120,
      key: 'examinationName',
      align: 'center',
      render: (h, params) => {
        let value = params.row.examinationName
        if (typeof value === 'undefined' || value === undefined || value === null || value === '') {
          value = '--'
        }
        return h('div', [
          h('span', {
            style: {
              display: 'inline-block',
              width: '100%'
            },
            domProps: {
              title: params.row.examinationName
            }
          }, value)
        ])
      }
    },
    startTime: {
      title: '考核开始时间',
      minWidth: 150,
      key: 'startTime',
      align: 'center',
      render: (h, params) => {
        let value = params.row.startTime
        if (typeof value === 'undefined' || value === undefined || value === null || value === '') {
          value = '--'
        }
        return h('div', [
          h('span', {
            style: {
              display: 'inline-block',
              width: '100%'
            },
            domProps: {
              title: params.row.startTime
            }
          }, value)
        ])
      }
    },
    endTime: {
      title: '考核结束时间',
      minWidth: 150,
      key: 'endTime',
      align: 'center',
      render: (h, params) => {
        let value = params.row.endTime
        if (typeof value === 'undefined' || value === undefined || value === null || value === '') {
          value = '--'
        }
        return h('div', [
          h('span', {
            style: {
              display: 'inline-block',
              width: '100%'
            },
            domProps: {
              title: params.row.endTime
            }
          }, value)
        ])
      }
    },
    examinationDeptName: {
      title: '考核单位',
      minWidth: 120,
      key: 'examinationDeptName',
      align: 'center',
      render: (h, params) => {
        let value = params.row.examinationDeptName
        if (typeof value === 'undefined' || value === undefined || value === null || value === '') {
          value = '--'
        }
        return h('div', [
          h('span', {
            style: {
              display: 'inline-block',
              width: '100%'
            },
            domProps: {
              title: params.row.examinationDeptName
            }
          }, value)
        ])
      }
    },
    examinationRoomName: {
      title: '考场名称',
      minWidth: 120,
      key: 'examinationRoomName',
      align: 'center',
      render: (h, params) => {
        let value = params.row.examinationRoomName
        if (typeof value === 'undefined' || value === undefined || value === null || value === '') {
          value = '--'
        }
        return h('div', [
          h('span', {
            style: {
              display: 'inline-block',
              width: '100%'
            },
            domProps: {
              title: params.row.examinationRoomName
            }
          }, value)
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
        let nowDate = (new Date()).getTime()
        let endTime = new Date(params.row.endTime).getTime()
        if(_this.canFindByID && nowDate < endTime) {
          renderData.push(
            h('span', { // 详情
              props: {
                type: 'primary'
              },
              class: 'c-primary',
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
                  if(nowDate < endTime) {
                    _this.turnToDetails()
                  }else{
                    _this.$Message.error('考核时间已过')
                  }
                }
              }
            }, '考核控制')
          )
        }
        if(nowDate > endTime && _this.canFindByID) {
          renderData.push(
            h('span', { // 详情
              props: {
                type: 'primary'
              },
              class: 'c-primary',
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
                  _this.statistical()
                }
              }
            }, '考核统计')
          )
        }
        return renderData
      }
    }
  }
}
