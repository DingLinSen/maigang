/**
 * systerminal - 系统管理-终端管理 - 列表 columns 配置
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
    codeNumber: {
      title: '设备编号',
      minWidth: 100,
      key: 'codeNumber',
      align: 'center',
      render: (h, params) => {
        let value = params.row.codeNumber
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
              title: params.row.codeNumber
            }
          }, value)
        ])
      }
    },
    ipAddress: {
      title: 'ip地址',
      minWidth: 100,
      key: 'ipAddress',
      align: 'center',
      render: (h, params) => {
        let value = params.row.ipAddress
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
              title: params.row.ipAddress
            }
          }, value)
        ])
      }
    },
    macAddress: {
      title: '硬件地址',
      minWidth: 100,
      key: 'macAddress',
      align: 'center',
      render: (h, params) => {
        let value = params.row.macAddress
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
              title: params.row.macAddress
            }
          }, value)
        ])
      }
    },
    operatingSystem: {
      title: '操作系统',
      minWidth: 100,
      key: 'operatingSystem',
      align: 'center',
      render: (h, params) => {
        let value = params.row.operatingSystem
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
              title: params.row.operatingSystem
            }
          }, value)
        ])
      }
    },
    deptName: {
      title: '所属单位',
      minWidth: 100,
      key: 'deptName',
      align: 'center',
      render: (h, params) => {
        let value = params.row.deptName
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
              title: params.row.deptName
            }
          }, value)
        ])
      }
    },
    roomName: {
      title: '考场名称',
      minWidth: 100,
      key: 'roomName',
      align: 'center',
      render: (h, params) => {
        let value = params.row.roomName
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
              title: params.row.roomName
            }
          }, value)
        ])
      }
    },
    location: {
      title: '位置信息',
      minWidth: 100,
      key: 'location',
      align: 'center',
      render: (h, params) => {
        let value = params.row.location
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
              title: params.row.location
            }
          }, value)
        ])
      }
    },
    option: {
      title: '操作区域',
      minWidth: 150,
      key: 'option',
      align: 'center',
      fixed: 'right',
      render: (h, params) => {
        let renderData = []
        if (_this.canEdit) {
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
              }, '编辑'
            )
          )
        }

        if (_this.canDelete) {
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
              }, '删除'
            )
          )
        }

        if(_this.canFindByID) {
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
            }, '详情')
          )
        }

        return renderData
      }
    }
  }
}
