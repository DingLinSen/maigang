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
    type: {
      title: '课目类型',
      minWidth: 140,
      key: 'type',
      align: 'center',
      render: (h, params) => {
        let value = params.row.type
        if (typeof value === 'undefined' || value === null || value === '') {
          value = '--'
        } else {
          value = value === 1 ? '理论知识' : value === 2 ? '专业操作' : '--'
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
    name: {
      title: '课目名称',
      minWidth: 300,
      key: 'name',
      align: 'center',
      render: (h, params) => {
        let value = params.row.name
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
    numberPeople: {
      title: '人数',
      minWidth: 180,
      key: 'numberPeople',
      align: 'center',
      render: (h, params) => {
        let value = params.row.numberPeople
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
      title: '训练时长(小时)',
      minWidth: 180,
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
    trainResult: {
      title: '训练成绩',
      minWidth: 180,
      key: 'trainResult',
      align: 'center',
      render: (h, params) => {
        let value = params.row.trainResult
        if (typeof value === 'undefined' || value === null || value === '') {
          value = '--'
        } else {
          value = '合格：' + value.toFixed(0) + '%'
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
    achievements: {
      title: '成果',
      minWidth: 160,
      key: 'achievements;',
      align: 'center',
      render: (h, params) => {
        // 循环取出subjectName进行拼接
        let value = ''
        let value2 = ''
        let value3 = ''
        var achievements = params.row.achievements
        if (achievements && achievements.length > 0) {
          achievements.forEach(item => {
            if (item.type === 1) {
              value = String(item.value)
            } else if (item.type === 2) {
              value2 = String(item.value)
            } else if (item.type === 3) {
              value3 = String(item.value)
            }
          })
        }
        if (typeof value === 'undefined' || value === null || value === '') {
          value = '--'
        } else {
          value = value + '%'
        }
        if (typeof value2 === 'undefined' || value2 === null || value2 === '') {
          value2 = '--'
        } else {
          value2 = value2 + '%'
        }
        if (typeof value3 === 'undefined' || value3 === null || value3 === '') {
          value3 = '--'
        } else {
          value3 = value3 + '%'
        }
        return h(
          'div',
          {
            style: {
              marginTop: '5px',
              marginBottom: '5px'
            }
          },
          [
            h(
              'span',
              {
                style: {
                  display: 'inline-block',
                  textAlign: 'left',
                  width: '100%'
                },
                domProps: {
                  title: '优：' + value
                }
              },
              '优：' + value
            ),
            h(
              'span',
              {
                style: {
                  display: 'inline-block',
                  textAlign: 'left',
                  width: '100%'
                },
                domProps: {
                  title: '良：' + value2
                }
              },
              '良：' + value2
            ),
            h(
              'span',
              {
                style: {
                  display: 'inline-block',
                  textAlign: 'left',
                  width: '100%'
                },
                domProps: {
                  title: '差：' + value3
                }
              },
              '差：' + value3
            )
          ]
        )
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
