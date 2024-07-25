/**
  * @description user - 用户- 列表 columns 配置
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
    userId: {
      type: 'index',
      width: 60, // 序号
      className: 'pad-lft-no',
      align: 'center',
      title: '序号',
      fixed: 'left',
      key: 'userId'
    },
    name: {
      title: '人员名称',
      minWidth: 120,
      key: 'name',
      align: 'center',
      render: (h, params) => {
        let value = params.row.name
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
              title: params.row.name
            }
          }, value)
        ])
      }
    },
    username: {
      title: '用户名',
      minWidth: 120,
      key: 'username',
      align: 'center',
      render: (h, params) => {
        let value = params.row.username
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
              title: params.row.username
            }
          }, value)
        ])
      }
    },
    // password: {
    //   title: '密码',
    //   minWidth: 120,
    //   key: 'password',
    //   align: 'center',
    //   render: (h, params) => {
    //     let value = params.row.password
    //     if (typeof value === 'undefined' || value === undefined || value === null || value === '') {
    //       value = '--'
    //     }
    //     return h('div', [
    //       h('span', {
    //         style: {
    //           display: 'inline-block',
    //           width: '100%'
    //         },
    //         domProps: {
    //           title: params.row.password
    //         }
    //       }, value)
    //     ])
    //   }
    // },
    deptName: {
      title: '单位',
      minWidth: 120,
      key: 'deptName',
      align: 'center',
      render: (h, params) => {
        let value = params.row.deptName
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
              title: params.row.deptName
            }
          }, value)
        ])
      }
    },
    roleName: {
      title: '用户角色',
      minWidth: 120,
      key: 'roleName',
      align: 'center',
      render: (h, params) => {
        let value = params.row.roleName
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
              title: params.row.roleName
            }
          }, value)
        ])
      }
    },
    fingerprintOne: {
      title: '指纹信息1',
      minWidth: 120,
      key: 'fingerprintOne',
      align: 'center',
      render: (h, params) => {
        let value = params.row.fingerprintOne
        if (typeof value === 'undefined' || value === undefined || value === null || value === '') {
          value = '--'
        }else{
          value = '已录入'
        }
        return h('div', [
          h('span', {
            style: {
              display: 'inline-block',
              width: '100%',
              color: value === '已录入' ? '#219379' : ''
            }
          }, value)
        ])
      }
    },
    faceId: {
      title: '人脸信息',
      minWidth: 120,
      key: 'faceId',
      align: 'center',
      render: (h, params) => {
        let value = params.row.faceId
        if (typeof value === 'undefined' || value === undefined || value === null || value === '') {
          value = '--'
        }else{
          value = '已录入'
        }
        return h('div', [
          h('span', {
            style: {
              display: 'inline-block',
              width: '100%',
              color: value === '已录入' ? '#219379' : ''
            }
          }, value)
        ])
      }
    },
    // status: {
    //   title: '状态',
    //   align: 'center',
    //   minWidth: 120,
    //   key: 'status',
    //   render: (h, params) => {
    //     let value = params.row.status
    //     if (typeof value === 'undefined' || value === undefined || value === null || value === '') {
    //       value = '--'
    //     }
    //     return h(
    //       'Tag',
    //       {
    //         props: {
    //           color: value === 2 ? 'error' : 'primary'
    //         },
    //         on: {
    //           click: () => {}
    //         }
    //       },
    //       // 2是禁用 0是启用
    //       value === 2 ? '禁用' : '启用'
    //     )
    //   }
    // },
    updateTime: {
      title: '操作时间',
      minWidth: 180,
      key: 'updateTime',
      align: 'center',
      render: (h, params) => {
        return h('div', [
          h(
            'div',
            params.row.updateTime === undefined || params.row.updateTime === 'undefined' || params.row.updateTime === null || params.row.updateTime === '' ? '--' : params.row.updateTime
          )
        ])
      }
    },
    option: {
      title: '操作区域',
      minWidth: 220,
      key: 'option',
      align: 'left',
      fixed: 'right',
      render: (h, params) => {
        let renderData = []
        // 2是禁用 0是启用
        // let stausName = null
        // let stausColor = null
        // if(params.row.status === 2) {
        //   stausName = '启用'
        //   stausColor = 'primary'
        // }else{
        //   stausName = '禁用'
        //   stausColor = 'error'
        // }
        // if(_this.canEnable) {
        //   renderData.push(
        //     h('Button', { // 状态
        //       props: {
        //         type: stausColor
        //       },
        //       style: {
        //         cursor: 'pointer',
        //         marginRight: '10px'
        //       },
        //       on: {
        //         click: () => {
        //           _this.chooseListData = []
        //           _this.chooseListData.push(params.row)
        //           const objData = _this.$refs.tables.$refs.tablesMain.objData
        //           const objDataArray = Object.getOwnPropertyNames(objData)
        //           objDataArray.forEach(item => {
        //             objData[item]._isChecked = false
        //           })
        //           objData[params.index]._isChecked = true
        //           if(params.row.status === 2) { // 执行启用
        //             _this.handleOpen()
        //           }
        //           if(params.row.status === 0) { // 执行禁用
        //             _this.handleStop()
        //           }
        //         }
        //       }
        //     }, stausName)
        //   )
        // }
        if (_this.canEdit) {
          renderData.push(
            h(
              'span',
              {
                // 编辑
                class: 'c-primary',
                props: {
                  type: 'warning'
                },
                attrs: {
                  title: '编辑'
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

        if (_this.canDelete) {
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
        if (_this.canPassword) {
          renderData.push(
            h('span', { // 修改密码
              props: {
                type: 'warning'
              },
              class: 'c-primary',
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
                  _this.btnChangePassword()
                }
              }
            },
            '修改密码')
          )
        }
        if(_this.canFindByID) {
          renderData.push(
            h('span', { // 详情
              props: {
                type: 'primary'
              },
              class: 'c-primary',
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
