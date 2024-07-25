/**
  * @description Role - 角色 - 列表 columns 配置
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
      className: 'pad-lft-no c-D54B52',
      align: 'center',
      title: '序号',
      fixed: 'left',
      key: 'id'
    },
    roleName: {
      title: '角色名称',
      minWidth: 100,
      key: 'roleName',
      align: 'center',
      render: (h, params) => {
        let value = params.row.roleName
        if (typeof value === 'undefined' || value === undefined || value === null || value === '') {
          value = '--'
        }
        return h('span', value + ' ')
      }
    },
    // status: {
    //   title: '状态',
    //   align: 'center',
    //   minWidth: 100,
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
    //           color: value === 1 ? 'error' : 'primary'
    //         },
    //         on: {
    //           click: () => {}
    //         }
    //       },
    //       value === 1 ? '禁用' : '启用'
    //     )
    //   }
    // },
    // orderNum: {
    //   title: '排序',
    //   minWidth: 100,
    //   key: 'orderNum',
    //   align: 'center',
    //   render: (h, params) => {
    //     let value = params.row.orderNum
    //     if (typeof value === 'undefined' || value === undefined || value === null || value === '') {
    //       value = '--'
    //     }
    //     return h('span', value + ' ')
    //   }
    // },
    roleDesc: {
      title: '角色描述',
      minWidth: 200,
      key: 'roleDesc',
      align: 'center',
      render: (h, params) => {
        let value = params.row.roleDesc
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
              title: params.row.roleDesc
            }
          }, value)
        ])
      }
    },
    createBy: {
      title: '创建人',
      minWidth: 120,
      key: 'createBy',
      align: 'center',
      render: (h, params) => {
        let value = params.row.createBy
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
              title: params.row.createBy
            }
          }, value)
        ])
      }
    },
    createTime: {
      title: '创建时间',
      minWidth: 160,
      key: 'createTime',
      align: 'center',
      render: (h, params) => {
        let value = params.row.createTime
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
              title: params.row.createTime
            }
          }, value)
        ])
      }
    },
    option: {
      title: '操作区域',
      width: 200,
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
              },
              '删除'
            )
          )
        }

        if(_this.canFindByID) {
          renderData.push(
            h('span', { // 详情
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
