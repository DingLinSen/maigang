/**
 * manuscriptlibrary - 稿库管理表 - 列表 columns 配置
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
    content: {
      title: '稿件内容',
      minWidth: 400,
      key: 'content',
      align: 'center',
      render: (h, params) => {
        let value = params.row.content
        if (typeof value === 'undefined' || value === null || value === '') {
          value = '--'
        }
        return h('div', [
          h(
            'span',
            {
              class: 'text3line',
              style: {
                display: '-webkit-box',
                width: '100%',
                whiteSpace: 'normal',
                wordWrap: 'break-word'
              },
              domProps: {
                title: value
              }
            },
            value
          )
        ])
      }
    },
    type: {
      title: '类型',
      minWidth: 100,
      key: 'type',
      align: 'center',
      render: (h, params) => {
        let value = params.row.type
        if (typeof value === 'undefined' || value === null || value === '') {
          value = '--'
        } else {
          value = value === 1 ? '文本' : value === 2 ? '密电码' : '--'
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
                title: value
              }
            },
            value
          )
        ])
      }
    },
    length: {
      title: '长度',
      minWidth: 100,
      key: 'length',
      align: 'center',
      render: (h, params) => {
        let value = params.row.length
        if (typeof value === 'undefined' || value === null || value === '') {
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
                title: params.row.length
              }
            },
            value
          )
        ])
      }
    },
    // codeLength: {
    //   title: '码长',
    //   minWidth: 120,
    //   key: 'codeLength',
    //   align: 'center',
    //   render: (h, params) => {
    //     let value = params.row.codeLength
    //     if (typeof value === 'undefined' || value === null || value === '') {
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
    //             title: params.row.codeLength
    //           }
    //         },
    //         value
    //       )
    //     ])
    //   }
    // },
    difficulty: {
      title: '难度',
      minWidth: 80,
      key: 'difficulty',
      align: 'center',
      render: (h, params) => {
        let value = params.row.difficulty
        if (typeof value === 'undefined' || value === null || value === '') {
          value = '--'
        } else {
          value =
            value === 1 ? '低' : value === 2 ? '中' : value === 3 ? '高' : '--'
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
                title: value
              }
            },
            value
          )
        ])
      }
    },
    createTime: {
      title: '创建时间',
      minWidth: 180,
      key: 'createTime',
      align: 'center',
      render: (h, params) => {
        let value = params.row.createTime
        if (typeof value === 'undefined' || value === null || value === '') {
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
      minWidth: 100,
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
        if (_this.canDownload) {
          renderData.push(
            h(
              'span', // 删除
              {
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
                    _this.downLoadFile()
                  }
                }
              },
              '下载'
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

        if (_this.canFindByID) {
          renderData.push(
            h(
              'span',
              {
                // 详情、查看
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
              },
              '详情'
            )
          )
        }

        return renderData
      }
    }
  }
}
