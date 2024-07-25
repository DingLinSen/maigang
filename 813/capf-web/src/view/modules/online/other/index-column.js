/**
 * otherexamine - 网上考核-其他考核 - 列表 columns 配置
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
      title: '考核名称',
      minWidth: 100,
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
    deptName: {
      title: '考核部门',
      minWidth: 100,
      key: 'deptName',
      align: 'center',
      render: (h, params) => {
        let value = params.row.deptName
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
              title: params.row.deptName
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
        let value = params.row.examineType === '1' ? '结业考核初考' : params.row.examineType === '2' ? '结业考核补考' : params.row.examineType === '3' ? '季度考核' : '抽考'
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
              title: value
            }
          }, value)
        ])
      }
    },
    subjectType: {
      title: '课目类型',
      minWidth: 100,
      key: 'subjectType',
      align: 'center',
      render: (h, params) => {
        let value = params.row.subjectType === '1' ? '理论知识' : params.row.subjectType === '2' ? '专业操作' : '--'
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
              title: value
            }
          }, value)
        ])
      }
    },
    subjectName: {
      title: '课目名称',
      minWidth: 100,
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
    nameList: {
      title: '考核人员',
      minWidth: 100,
      key: 'nameList',
      align: 'center',
      render: (h, params) => {
        let value = ''
        let userArray = params.row.nameList
        if (userArray.length > 0) {
          value = userArray.join('，')
        }
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
              title: value
            }
          }, value)
        ])
      }
    },
    examineStartDate: {
      title: '考核时间',
      minWidth: 100,
      key: 'examineStartDate',
      align: 'center',
      render: (h, params) => {
        let value = params.row.examineStartDate
        let value1 = value.substring(0, 10)
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
              title: value1
            }
          }, value1)
        ])
      }
    },
    // remark: {
    //   title: '备注',
    //   minWidth: 100,
    //   key: 'remark',
    //   align: 'center',
    //   render: (h, params) => {
    //     let value = params.row.remark
    //     if (typeof (value) === 'undefined' || value === null || value === '') {
    //       value = '--'
    //     }
    //     return h('div', [
    //       h('span', {
    //         style: {
    //           display: 'inline-block',
    //           width: '100%'
    //         },
    //         domProps: {
    //           title: params.row.remark
    //         }
    //       }, value)
    //     ])
    //   }
    // },
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
                class: 'c-success',
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
              }, '编辑'
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
              }, '删除'
            )
          )
        }

        // if(_this.canFindByID) {
        //   renderData.push(
        //     h('span', { // 详情、查看
        //       class: 'c-primary',
        //       props: {
        //         type: 'primary'
        //       },
        //       style: {
        //         cursor: 'pointer',
        //         fontSize: '15px'
        //       },
        //       on: {
        //         click: () => {
        //           _this.chooseListData = []
        //           _this.chooseListData.push(params.row)

        //           const objData = _this.$refs.tables.$refs.tablesMain.objData
        //           const objDataArray = Object.getOwnPropertyNames(objData)

        //           objDataArray.forEach(item => {
        //             objData[item]._isChecked = false
        //           })
        //           objData[params.index]._isChecked = true
        //           _this.turnToDetails()
        //         }
        //       }
        //     }, '详情')
        //   )
        // }

        return renderData
      }
    }
  }
}
