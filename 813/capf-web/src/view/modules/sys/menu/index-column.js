/**
 * @description Weld - 焊缝管理 - 列表 columns 配置
 * @param _this
 * @returns {*}
 * @author yxm
 * @date 2021-10-19
 */
module.exports = function(_this) {
  return {
    name: {
      title: '名称',
      minWidth: 150,
      tree: true,
      key: 'name',
      align: 'left',
      render: (h, params) => {
        let value = params.row.name
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
              title: params.row.name
            }
          },
          value
        )
      }
    },
    orderNum: {
      title: '排序',
      minWidth: 100,
      key: 'orderNum',
      align: 'center',
      render: (h, params) => {
        let value = params.row.orderNum
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
                title: params.row.orderNum
              }
            },
            value
          )
        ])
      }
    },
    url: {
      title: '路径',
      minWidth: 100,
      key: 'url',
      align: 'center',
      render: (h, params) => {
        let value = params.row.url
        if (
          typeof value === 'undefined' ||
          value === undefined ||
          value === null ||
          value === '' || !value
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
                title: params.row.url
              }
            },
            value
          )
        ])
      }
    },
    perms: {
      title: '权限',
      minWidth: 100,
      key: 'perms',
      align: 'center',
      render: (h, params) => {
        let value = params.row.perms
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
                title: params.row.perms
              }
            },
            value
          )
        ])
      }
    },
    createTime: {
      title: '创建时间',
      minWidth: 170,
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

        if(_this.canSave && params.row.type < 2) {
          renderData.push(
            h(
              'span',
              {
                // 新增
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

                    const objData = _this.$refs.tables.$refs.tablesMain.objData
                    const objDataArray = Object.getOwnPropertyNames(objData)

                    objDataArray.forEach(item => {
                      objData[item]._isChecked = false
                    })
                    objData[params.index]._isChecked = true
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
