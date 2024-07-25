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
      minWidth: 140,
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
    taskTime: {
      title: '训练时间',
      minWidth: 120,
      key: 'taskTime',
      align: 'center',
      render: (h, params) => {
        let value = params.row.taskTime
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
    recordSubjectDOS: {
      title: '课目名称',
      minWidth: 180,
      key: 'recordSubjectDOS',
      align: 'center',
      render: (h, params) => {
        let value = '--'
        var subjectArray = []
        if (
          params.row.recordSubjectDOS &&
          params.row.recordSubjectDOS.length > 0
        ) {
          params.row.recordSubjectDOS.forEach(item => {
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
    trainTime: {
      title: '训练时长(理论知识)',
      minWidth: 160,
      key: 'trainTime',
      align: 'center',
      render: (h, params) => {
        let value = params.row.trainTime
        let totalTimeBr = value / 3600
        value = String(Math.round(totalTimeBr * 10) / 10)
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
      title: '训练次数(专业技术)',
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
    examineFrequency: {
      title: '考核次数',
      minWidth: 100,
      key: 'examineFrequency',
      align: 'center',
      render: (h, params) => {
        let value = params.row.examineFrequency
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
    // standardRate: {
    //   title: '合格率',
    //   minWidth: 160,
    //   key: 'status',
    //   align: 'center',
    //   render: (h, params) => {
    //     return h(
    //       'Progress',
    //       {
    //         props: {
    //           type: 'Progress',
    //           size: 'small',
    //           percent: parseFloat(
    //             params.row.standardRate == null ? 0 : params.row.standardRate
    //           )
    //         }
    //       },
    //       params.row.standardRate == null ? '0%' : params.row.standardRate + '%'
    //     )
    //   }
    // },
    effect: {
      title: '训练效果',
      minWidth: 140,
      key: 'effect',
      align: 'center',
      render: (h, params) => {
        let value = params.row.effect
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
    }
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
