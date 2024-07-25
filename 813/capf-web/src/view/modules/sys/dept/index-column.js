/**
 * @description Weld - 焊缝管理 - 列表 columns 配置
 * @param _this
 * @returns {*}
 * @author yxm
 * @date 2021-10-19
 */
module.exports = function(_this) {
  return {
    deptName: {
      title: '部门名称',
      minWidth: 396,
      tree: true,
      key: 'deptName',
      align: 'left',
      render: (h, params) => {
        let value = params.row.deptName
        let level = params.row._level
        let children = params.row.children
        if (
          typeof value === 'undefined' ||
          value === undefined ||
          value === null ||
          value === ''
        ) {
          value = '--'
        }

        return h(
          'span',
          {
            style: {
              marginLeft:
                level === 1 && (!children || children.length === 0)
                  ? '19px'
                  : '0px',
              width: '100%'
            },
            domProps: {
              title: params.row.deptName
            }
          },
          value
        )
      }
    },
    parentName: {
      title: '上级部门',
      minWidth: 120,
      key: 'parentName',
      align: 'center',
      render: (h, params) => {
        let value = params.row.parentName
        if (
          typeof value === 'undefined' ||
          value === undefined ||
          value === null ||
          value === '' || !value
        ) {
          value = '--'
        }
        // else if(params.row.parentId === '0') {
        //   value = '/'
        // }
        return h('div', [
          h(
            'span',
            {
              style: {
                display: 'inline-block',
                width: '100%'
              },
              domProps: {
                title: params.row.parentName
              }
            },
            value
          )
        ])
      }
    },
    // orderNum: {
    //   title: '层级',
    //   minWidth: 100,
    //   key: 'orderNum',
    //   align: 'center',
    //   render: (h, params) => {
    //     let value = params.row.orderNum
    //     if (
    //       typeof value === 'undefined' ||
    //       value === undefined ||
    //       value === null ||
    //       value === '' || !value
    //     ) {
    //       value = '--'
    //     }
    //     return h('div', [
    //       h(
    //         'span',
    //         {
    //           style: {
    //             display: 'inline-block',
    //             width: '100%'
    //           },
    //           domProps: {
    //             title: params.row.orderNum
    //           }
    //         },
    //         value
    //       )
    //     ])
    //   }
    // },
    createByName: {
      title: '创建人',
      minWidth: 120,
      key: 'createByName',
      align: 'center',
      render: (h, params) => {
        let value = params.row.createByName
        if (
          typeof value === 'undefined' ||
          value === undefined ||
          value === null ||
          value === ''
        ) {
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
                title: params.row.createByName
              }
            },
            value
          )
        ])
      }
    },
    createTime: {
      title: '创建时间',
      minWidth: 100,
      key: 'createTime',
      align: 'center',
      render: (h, params) => {
        let value = params.row.createTime
        if (
          typeof value === 'undefined' ||
          value === undefined ||
          value === null ||
          value === ''
        ) {
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
                title: params.row.createTime
              }
            },
            value
          )
        ])
      }
    },
    updateTime: {
      title: '最后更新时间',
      minWidth: 150,
      key: 'updateTime',
      align: 'center',
      render: (h, params) => {
        let value = params.row.updateTime
        if (
          typeof value === 'undefined' ||
          value === undefined ||
          value === null ||
          value === ''
        ) {
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
                title: params.row.updateTime
              }
            },
            value
          )
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

                    // const objData = _this.$refs.tables.$refs.tablesMain.objData
                    // const objDataArray = Object.getOwnPropertyNames(objData)
                    // objDataArray.forEach(item => {
                    //   objData[item]._isChecked = false
                    // })
                    // objData[params.index]._isChecked = true
                    _this.rowEditClick()
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
                props: {
                  type: 'error',
                  size: 'small'
                },
                class: 'c-error',
                style: {

                  cursor: 'pointer',
                  marginRight: '10px',
                  fontSize: '15px'
                },
                on: {
                  click: () => {
                    _this.chooseListData = []
                    _this.chooseListData.push(params.row)

                    // const objData = _this.$refs.tables.$refs.tablesMain.objData
                    // const objDataArray = Object.getOwnPropertyNames(objData)

                    // objDataArray.forEach(item => {
                    //   objData[item]._isChecked = false
                    // })
                    // objData[params.index]._isChecked = true
                    _this.btnDeleteBallast()
                  }
                }
              },
              '删除'
            )
          )
        }
        if (_this.canSave && params.row.orderNum < 3) {
          renderData.push(
            h(
              'span',
              {
                // 详情
                class: 'c-primary',
                props: {
                  type: 'primary',
                  size: 'small'
                },
                style: {
                  cursor: 'pointer',
                  fontSize: '15px'
                },
                on: {
                  click: () => {
                    _this.chooseListData = []
                    _this.chooseListData.push(params.row)

                    // const objData = _this.$refs.tables.$refs.tablesMain.objData
                    // const objDataArray = Object.getOwnPropertyNames(objData)

                    // objDataArray.forEach(item => {
                    //   objData[item]._isChecked = false
                    // })
                    // objData[params.index]._isChecked = true
                    _this.rowAddClick()
                  }
                }
              },
              '新增'
            )
          )
        }
        return renderData
      }
    }
  }
}
