/**
  * @description  代码生成 -  列表 columns 配置
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
    index: {
      type: 'index',
      width: 60, // 序号
      className: 'pad-lft-no',
      align: 'center',
      title: '序号',
      fixed: 'left',
      key: 'index'
    },
    tableName: {
      title: '表名',
      minWidth: 100,
      key: 'tableName',
      render: (h, params) => {
        return h('span', params.row.tableName)
      }
    },
    engine: {
      title: 'Engine',
      minWidth: 100,
      key: 'engine',
      render: (h, params) => {
        return h('span', params.row.engine)
      }
    },
    tableComment: {
      title: '表备注',
      minWidth: 100,
      key: 'tableComment',
      render: (h, params) => {
        return h('span', params.row.tableComment)
      }
    },
    createTime: {
      title: '创建时间',
      minWidth: 100,
      key: 'createTime',
      render: (h, params) => {
        return h('span', params.row.createTime)
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
        if (_this.canSave) {
          renderData.push(
            h('Button', { // 编辑
              props: {
                type: 'warning',
                shape: 'circle',
                icon: 'md-create'
              },
              style: {
                cursor: 'pointer',
                marginRight: '10px'
              },
              on: {
                click: () => {
                  _this.chooseListData = []
                  _this.chooseListData.push(params)
                  _this.$refs.tables.$refs.tablesMain.objData[params.index]._isChecked = true
                  _this.updateDrawerChange()
                }
              }
            })
          )
        }

        if (_this.canDelete) {
          renderData.push(
            h('Button', { // 删除
              props: {
                type: 'error',
                shape: 'circle',
                icon: 'md-trash'
              },
              style: {
                cursor: 'pointer',
                marginRight: '10px'
              },
              on: {
                click: () => {
                  _this.chooseListData = []
                  _this.chooseListData.push(params)
                  _this.$refs.tables.$refs.tablesMain.objData[params.index]._isChecked = true
                  _this.btnDeleteBallast()
                }
              }
            })
          )
        }

        renderData.push(
          h('Button', { // 查看
            props: {
              type: 'primary',
              shape: 'circle',
              icon: 'md-log-in'
            },
            style: {
              cursor: 'pointer'
            },
            on: {
              click: () => {
                _this.chooseListData = []
                _this.chooseListData.push(params)
                _this.$refs.tables.$refs.tablesMain.objData[params.index]._isChecked = true
                _this.turnToDetails()
              }
            }
          })
        )

        return renderData
      }
    }
  }
}
