/**
 * subjectlearn - 课目学习主表 - 列表 columns 配置
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
      title: '部门名称',
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
    taskName: {
      title: '任务名称',
      minWidth: 150,
      key: 'taskName',
      align: 'center',
      render: (h, params) => {
        let value = params.row.taskName
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
              title: params.row.taskName
            }
          }, value)
        ])
      }
    },
    // name: {
    //   title: '课目名称',
    //   minWidth: 150,
    //   key: 'name',
    //   align: 'center',
    //   render: (h, params) => {
    //     let value = params.row.name
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
    //           title: params.row.name
    //         }
    //       }, value)
    //     ])
    //   }
    // },
    startDate: {
      title: '计划期限',
      minWidth: 200,
      key: 'startDate',
      align: 'center',
      render: (h, params) => {
        let value = params.row.startDate
        let endDate = params.row.endDate
        if ((typeof (value) === 'undefined' || value === null || value === '') && (typeof (endDate) === 'undefined' || endDate === null || endDate === '')) {
          value = '--'
        }else{
          value = params.row.startDate + ' ~ ' + params.row.endDate
        }
        return h('div', [
          h('span', {
            style: {
              display: 'inline-block',
              width: '100%'
            },
            domProps: {
              title: params.row.startDate + ' ~ ' + params.row.endDate
            }
          }, value)
        ])
      }
    },
    totalProgress: {
      title: '进度',
      minWidth: 100,
      key: 'totalProgress',
      align: 'center',
      render: (h, params) => {
        let value = params.row.totalProgress.toFixed(2)
        if (typeof (value) === 'undefined' || value === null || value === '') {
          value = '--'
        }
        return h('div', [
          h('span', {
            class: 'c-primary',
            style: {
              display: 'inline-block',
              fontWeight: '600',
              width: '100%'
            }
          }, value + ' %')
        ])
      }
    },
    option: {
      title: '操作区域',
      width: 150,
      key: 'option',
      align: 'center',
      fixed: 'right',
      render: (h, params) => {
        let renderData = []
        if(_this.canFindByID) {
          renderData.push(
            h('span', { // 详情、查看
              class: 'c-primary',
              props: {
                type: 'primary'
              },
              style: {
                cursor: 'pointer',
                fontSize: '15px',
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
                  _this.openDrawer(2)
                }
              }
            }, '查看')
          )
        }
        // if(_this.canLearn) {
        //   renderData.push(
        //     h('span', {
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
        //           _this.openDrawer(3)
        //         }
        //       }
        //     }, '学习')
        //   )
        // }

        return renderData
      }
    }
  }
}
