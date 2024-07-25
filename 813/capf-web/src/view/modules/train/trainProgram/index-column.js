/**
 *
 * @param _this
 * @returns {*}
 */
module.exports = function(_this) {
  return {
    outlineName: {
      title: '文件名',
      minWidth: 800,
      key: 'outlineName',
      align: 'left',
      render: (h, params) => {
        let value = params.row.outlineName
        if (typeof value === 'undefined' || value === null || value === '') {
          value = '--'
        }
        return h('div', [
          h(
            'span',
            {
              class: 'c-info',
              style: {
                display: 'inline-block',
                width: '100%',
                cursor: 'pointer'
              },
              domProps: {
                title: params.row.outlineName
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
                  _this.aaa(params.row)
                }
              }
            },
            value
          )
        ])
      }
    },
    // 描述
    createTime: {
      title: '创建时间',
      minWidth: 200,
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
      minWidth: 120,
      key: 'option',
      align: 'center',
      fixed: 'right',
      render: (h, params) => {
        let renderData = []
        if (_this.download) {
          renderData.push(
            h(
              'span',
              {
                class: 'c-success',
                props: {
                  // type: 'primary',
                  size: 'small'
                },
                style: {
                  cursor: 'pointer',
                  marginRight: '10px'
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
                    _this.downloadFile(params.row)
                  }
                }
              }, '下载'
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
                  // type: 'error'
                },
                style: {
                  cursor: 'pointer',
                  marginRight: '10px'
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

          return renderData
        }
      }
    }
  }
}
