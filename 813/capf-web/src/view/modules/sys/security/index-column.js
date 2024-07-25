/**
 * safe - 安全设置 - 列表 columns 配置
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
    name: {
      title: '决策名称',
      minWidth: 120,
      key: 'name',
      align: 'center',
      render: (h, params) => {
        let value = params.row.name
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
              title: params.row.name
            }
          }, value)
        ])
      }
    },
    describe: {
      title: '描述',
      minWidth: 150,
      key: 'describe',
      align: 'center',
      render: (h, params) => {
        let value = params.row.describe
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
              title: params.row.describe
            }
          }, value)
        ])
      }
    },
    status: {
      title: '状态',
      minWidth: 100,
      key: 'status',
      align: 'center',
      render: (h, params) => {
        let value = params.row.status
        if (typeof (value) === 'undefined' || value === null || value === '') {
          value = '--'
        }else{
          // 0 启动 1不启动
          value = value === '0' ? '启动' : (value === '1' ? '不启动' : '--')
        }
        return h('div', [
          h('span', {
            style: {
              display: 'inline-block',
              width: '100%'
            },
            domProps: {
              title: params.row.status
            }
          }, value)
        ])
      }
    },
    updateTime: {
      title: '操作时间',
      minWidth: 170,
      key: 'updateTime',
      align: 'center',
      render: (h, params) => {
        let value = params.row.updateTime
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
              title: params.row.updateTime
            }
          }, value)
        ])
      }
    },

    option: {
      title: '是否启动',
      minWidth: 100,
      key: 'option',
      align: 'center',
      fixed: 'right',
      render: (h, params) => {
        let renderData = []
        if (_this.canStatus) {
          if (params.row.id !== '03f25d8f125eb1cd0285823b939731fe') {
          // 0 启动 1不启动
            renderData.push(
              h(
                'i-Switch',
                {
                  style: {
                    cursor: 'pointer',
                    marginRight: '10px',
                    fontSize: '15px'
                  },
                  props: {
                    size: 'large',
                    value: params.row.status === '0'
                  },
                  scopedSlots: {
                    open: () => h('span', '是'),
                    close: () => h('span', '否')
                  },
                  on: {
                    'on-change': (e) => {
                      _this.changeStatus(params.row)
                    }
                  }
                }
              )
            )
          }else{
            renderData.push(
              h('span', {
                style: {
                  display: 'inline-block',
                  width: '100%',
                  color: '#219379 '
                }
              }, '是')
            )
          }
        }

        return renderData
      }
    }
  }
}
