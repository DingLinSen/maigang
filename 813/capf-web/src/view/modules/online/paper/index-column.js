/**
 * videomanagement - 视频管理表 - 列表 columns 配置
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
      width: 50, // 序号
      className: 'pad-lft-no',
      align: 'center',
      title: '序号',
      fixed: 'left',
      key: 'id'
    },
    paperNo: {
      title: '试卷编号',
      minWidth: 100,
      key: 'paperNo',
      align: 'center',
      render: (h, params) => {
        let value = params.row.paperNo
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
                title: params.row.paperNo
              }
            },
            value
          )
        ])
      }
    },
    paperName: {
      title: '试卷名称',
      minWidth: 170,
      key: 'paperName',
      align: 'center',
      render: (h, params) => {
        let value = params.row.paperName
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
                title: params.row.paperName
              }
            },
            value
          )
        ])
      }
    },
    paperType: {
      title: '试卷类型',
      minWidth: 110,
      key: 'paperType',
      align: 'center',
      render: (h, params) => {
        let value = params.row.paperType
        if (typeof value === 'undefined' || value === null || value === '') {
          value = '--'
        } else {
          value = value === '1' ? '理论考核' : value === '2' ? '专业考核' : '--'
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
    subjectType: {
      title: '课目类型',
      minWidth: 100,
      key: 'subjectType',
      align: 'center',
      render: (h, params) => {
        let value = params.row.subjectType
        if (typeof value === 'undefined' || value === null || value === '') {
          value = '--'
        } else {
          value = value === '1' ? '理论知识' : value === '2' ? '专业操作' : '--'
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
    paperSubjectDOS: {
      title: '课目名称',
      minWidth: 200,
      key: 'paperSubjectDOS',
      align: 'center',
      render: (h, params) => {
        let value = params.row.paperSubjectDOS
        let value0 = '--'
        if (typeof value === 'undefined' || value === null || value === '') {
          value0 = '--'
        } else if (value.length > 0){
          let array = []
          value.forEach(item =>{
            array.push(item.subjectName)
          })
          value0 = array.join('，')
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
                title: value0
              }
            },
            value0
          )
        ])
      }
    },
    subjectNumber: {
      title: '题目数量',
      minWidth: 100,
      key: 'subjectNumber',
      align: 'center',
      render: (h, params) => {
        let value = params.row.subjectNumber
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
                title: params.row.subjectNumber
              }
            },
            value
          )
        ])
      }
    },
    score: {
      title: '分值',
      minWidth: 80,
      key: 'score',
      align: 'center',
      render: (h, params) => {
        let value = params.row.score
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
                title: params.row.score
              }
            },
            value
          )
        ])
      }
    },
    paperTime: {
      title: '试卷用时(分钟)',
      minWidth: 140,
      key: 'paperTime',
      align: 'center',
      render: (h, params) => {
        let value = params.row.paperTime
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
                title: params.row.paperTime
              }
            },
            value
          )
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

        if (_this.canExport) {
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
                    _this.exportTestPaper()
                  }
                }
              },
              '导出'
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
                    _this.openPaperDetailPage()
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
