/**
  * @description  系统日志 -  列表 columns 配置
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
    createBy: {
      title: '用户名',
      minWidth: 100,
      align: 'center',
      key: 'createBy',
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
    operationModule: {
      title: '操作模块',
      minWidth: 100,
      align: 'center',
      key: 'operationModule',
      render: (h, params) => {
        let value = params.row.operationModule
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
              title: params.row.operationModule
            }
          }, value)
        ])
      }
    },
    operationDescribe: {
      title: '操作描述',
      minWidth: 100,
      align: 'center',
      key: 'operationDescribe',
      render: (h, params) => {
        let value = params.row.operationDescribe
        // if (typeof value === 'undefined' || value === undefined || value === null || value === '') {
        //   value = '--'
        // }
        // return h('span', value + ' ')
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
              title: params.row.operationDescribe
            }
          }, value)
        ])
      }
    },
    methodDescribe: {
      title: '操作类型',
      minWidth: 100,
      align: 'center',
      key: 'methodDescribe',
      render: (h, params) => {
        let value = params.row.methodDescribe
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
              title: params.row.methodDescribe
            }
          }, value)
        ])
      }
    },
    params: {
      title: '请求参数',
      minWidth: 100,
      align: 'center',
      key: 'params',
      render: (h, params) => {
        let value = params.row.params
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
              title: params.row.params
            }
          }, value)
        ])
      }
    },
    ip: {
      title: 'IP地址',
      minWidth: 100,
      align: 'center',
      key: 'ip',
      render: (h, params) => {
        let value = params.row.ip
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
              title: params.row.ip
            }
          }, value)
        ])
      }
    },
    createTime: {
      title: '操作时间',
      minWidth: 150,
      align: 'center',
      key: 'createTime',
      render: (h, params) => {
        let value = params.row.createTime
        if (typeof value === 'undefined' || value === undefined || value === null || value === '') {
          value = '--'
        }
        return h('span', value + ' ')
      }
    }
    // option: {
    //   title: '操作区域',
    //   minWidth: 160,
    //   key: 'option',
    //   align: 'center',
    //   fixed: 'right',
    //   render: (h, params) => {
    //     let renderData = []

    //     renderData.push(
    //       h(
    //         'Button',
    //         {
    //           // 查看
    //           props: {
    //             type: 'primary'
    //           },
    //           style: {
    //             cursor: 'pointer'
    //           },
    //           on: {
    //             click: () => {
    //               _this.chooseListData = []
    //               _this.chooseListData.push(params.row)

    //               const objData = _this.$refs.tables.$refs.tablesMain.objData
    //               const objDataArray = Object.getOwnPropertyNames(objData)

    //               objDataArray.forEach(item => {
    //                 objData[item]._isChecked = false
    //               })
    //               objData[params.index]._isChecked = true
    //               _this.turnToDetails()
    //             }
    //           }
    //         },
    //         '查看'
    //       )
    //     )

    //     return renderData
    //   }
    // }
  }
}
