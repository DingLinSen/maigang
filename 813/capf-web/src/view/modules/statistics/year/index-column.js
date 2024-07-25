/**
 * planyear - 计划-年计划表 - 列表 columns 配置
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
    deptName: {
      title: '单位名称',
      minWidth: 140,
      key: 'deptName',
      align: 'center',
      render: (h, params) => {
        let value = params.row.deptName
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
                title: params.row.deptName
              }
            },
            value
          )
        ])
      }
    },
    userName: {
      title: '参训人员',
      minWidth: 100,
      key: 'userName',
      align: 'center',
      render: (h, params) => {
        let value = params.row.userName
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
                title: value
              }
            },
            value
          )
        ])
      }
    },
    trainTime: {
      title: '训练时间',
      minWidth: 120,
      key: 'trainTime',
      align: 'center',
      render: (h, params) => {
        let value = params.row.trainTime
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
                title: value
              }
            },
            value
          )
        ])
      }
    },
    taskSubjectDOS: {
      title: '课目名称',
      minWidth: 180,
      key: 'taskSubjectDOS',
      align: 'center',
      render: (h, params) => {
        let value = '--'
        var subjectArray = []
        if (params.row.taskSubjectDOS && params.row.taskSubjectDOS.length > 0) {
          params.row.taskSubjectDOS.forEach(item => {
            subjectType = item.type ? String(item.type) : '1'
            subjectArray.push(item.subjectName)
          })
        }
        if (subjectArray.length > 0) {
          value = subjectArray.join('，')
        }
        
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
                title: value
              }
            },
            value
          )
        ])
      }
    },
    standardRate: {
      title: '完成率',
      minWidth: 160,
      key: 'status',
      align: 'center',
      render: (h, params) => {
        return h(
          'Progress',
          {
            props: {
              type: 'Progress',
              size: 'small',
              percent: parseFloat(
                params.row.standardRate == null ? 0 : params.row.standardRate
              )
            }
          },
          params.row.standardRate == null ? '0%' : params.row.standardRate + '%'
        )
      }
    },
    trainTimeTol: {
      title: '训练时长(小时)',
      minWidth: 160,
      key: 'status',
      align: 'center',
      render: (h, params) => {
        let value = params.row.status
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
                title: value
              }
            },
            value
          )
        ])
      }
    },
    trainFrequency: {
      title: '训练次数(次)',
      minWidth: 160,
      key: 'trainFrequency',
      align: 'center',
      render: (h, params) => {
        let value = params.row.trainFrequency
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
                title: value
              }
            },
            value
          )
        ])
      }
    },
    TrainingContent: {
      title: '考核成绩',
      minWidth: 100,
      key: 'deptId',
      align: 'center',
      render: (h, params) => {
        let value = params.row.status
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
                title: value
              }
            },
            value
          )
        ])
      }
    },
    // option: {
    //   title: '操作区域',
    //   minWidth: 120,
    //   key: 'option',
    //   align: 'center',
    //   fixed: 'right',
    //   render: (h, params) => {
    //     let renderData = []
    //     if (_this.canEdit) {
    //       renderData.push(
    //         h(
    //           'span', // 编辑
    //           {
    //             class: 'c-success',
    //             props: {
    //               type: 'warning',
    //               size: 'small'
    //             },
    //             style: {
    //               cursor: 'pointer',
    //               marginRight: '10px',
    //               fontSize: '15px',
    //             },
    //             on: {
    //               click: () => {
    //                 _this.chooseListData = []
    //                 _this.chooseListData.push(params.row)

    //                 const objData = _this.$refs.tables.$refs.tablesMain.objData
    //                 const objDataArray = Object.getOwnPropertyNames(objData)

    //                 objDataArray.forEach(item => {
    //                   objData[item]._isChecked = false
    //                 })
    //                 objData[params.index]._isChecked = true
    //                 _this.updateDrawerChange()
    //               }
    //             }
    //           },
    //           '编辑'
    //         )
    //       )
    //     }
    //     if (_this.canFindByID) {
    //       renderData.push(
    //         h(
    //           'span',
    //           {
    //             // 详情、查看
    //             class: 'c-success',
    //             props: {
    //               type: 'primary'
    //             },
    //             style: {
    //               cursor: 'pointer',
    //               marginRight: '10px',
    //               fontSize: '15px',
    //             },
    //             on: {
    //               click: () => {
    //                 _this.chooseListData = []
    //                 _this.chooseListData.push(params.row)

    //                 const objData = _this.$refs.tables.$refs.tablesMain.objData
    //                 const objDataArray = Object.getOwnPropertyNames(objData)

    //                 objDataArray.forEach(item => {
    //                   objData[item]._isChecked = false
    //                 })
    //                 objData[params.index]._isChecked = true
    //                 _this.turnToDetails()
    //               }
    //             }
    //           },
    //           '详情'
    //         )
    //       )
    //     }
    //     return renderData
    //   }
    // }
  }
}
