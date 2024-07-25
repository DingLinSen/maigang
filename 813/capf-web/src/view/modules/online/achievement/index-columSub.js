/**
 * examinepoint - 网上考核-成绩管理 - 列表 columns 配置
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
    examineDate: {
      title: '考核日期',
      minWidth: 100,
      key: 'examineDate',
      align: 'center',
      render: (h, params) => {
        let value = params.row.examineDate
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
              title: params.row.examineDate
            }
          }, value)
        ])
      }
    },
    examineName: {
      title: '考核名称',
      minWidth: 100,
      key: 'examineName',
      align: 'center',
      render: (h, params) => {
        let value = params.row.examineName
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
              title: params.row.examineName
            }
          }, value)
        ])
      }
    },
    examineType: {
      title: '考核类型',
      minWidth: 100,
      key: 'examineType',
      align: 'center',
      render: (h, params) => {
        let value = params.row.examineType === '1' ? '结业考核初考' : params.row.examineType === '2' ? '结业考核补考' : params.row.examineType === '3' ? '季度考核' : params.row.examineType === '4' ? '抽考' : '--'
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
              title: params.row.examineType
            }
          }, value)
        ])
      }
    },
    paperName: {
      title: '试卷名称',
      minWidth: 100,
      key: 'paperName',
      align: 'center',
      render: (h, params) => {
        let value = params.row.paperName
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
              title: params.row.paperName
            }
          }, value)
        ])
      }
    },
    subjectName: {
      title: '课目名称',
      minWidth: 150,
      key: 'subjectName',
      align: 'center',
      render: (h, params) => {
        let value = params.row.subjectName
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
              title: params.row.subjectName
            }
          }, value)
        ])
      }
    },
    questionNum: {
      title: '题目数量',
      minWidth: 60,
      key: 'questionNum',
      align: 'center',
      render: (h, params) => {
        let value = params.row.questionNum
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
              title: params.row.questionNum
            }
          }, value)
        ])
      }
    },
    paperPoint: {
      title: '分值',
      minWidth: 60,
      key: 'paperPoint',
      align: 'center',
      render: (h, params) => {
        let value = params.row.paperPoint
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
              title: params.row.paperPoint
            }
          }, value)
        ])
      }
    },
    point: {
      title: '得分',
      minWidth: 60,
      key: 'point',
      align: 'center',
      render: (h, params) => {
        let value = params.row.point
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
              title: params.row.point
            }
          }, value)
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
        // if (_this.canEdit) {
        //   renderData.push(
        //     h(
        //       'span', // 编辑
        //       {
        //         class: 'c-warning',
        //         props: {
        //           type: 'warning',
        //           size: 'small'
        //         },
        //         style: {
        //           cursor: 'pointer',
        //           marginRight: '10px',
        //           fontSize: '15px'
        //         },
        //         on: {
        //           click: () => {
        //             _this.chooseListData = []
        //             _this.chooseListData.push(params.row)

        //             const objData = _this.$refs.tables.$refs.tablesMain.objData
        //             const objDataArray = Object.getOwnPropertyNames(objData)

        //             objDataArray.forEach(item => {
        //               objData[item]._isChecked = false
        //             })
        //             objData[params.index]._isChecked = true
        //             _this.updateDrawerChange()
        //           }
        //         }
        //       }, '编辑'
        //     )
        //   )
        // }

        // if (_this.canDelete) {
        //   renderData.push(
        //     h(
        //       'span', // 删除
        //       {
        //         class: 'c-error',
        //         props: {
        //           type: 'error',
        //           size: 'small'
        //         },
        //         style: {
        //           cursor: 'pointer',
        //           marginRight: '10px',
        //           fontSize: '15px'
        //         },
        //         on: {
        //           click: () => {
        //             _this.chooseListData = []
        //             _this.chooseListData.push(params.row)

        //             const objData = _this.$refs.tables.$refs.tablesMain.objData
        //             const objDataArray = Object.getOwnPropertyNames(objData)

        //             objDataArray.forEach(item => {
        //               objData[item]._isChecked = false
        //             })
        //             objData[params.index]._isChecked = true
        //             _this.btnDeleteBallast()
        //           }
        //         }
        //       }, '删除'
        //     )
        //   )
        // }

        if(_this.canFindByID) {
          renderData.push(
            h('span', { // 详情、查看
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
                  _this.generatePlanSucess()
                }
              }
            }, '查看')
          )
        }

        return renderData
      }
    }
  }
}
