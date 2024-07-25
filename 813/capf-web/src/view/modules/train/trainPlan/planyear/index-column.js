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
    // type: {
    //   title: '计划类型 1 年计划',
    //   minWidth: 100,
    //   key: 'type',
    //   align: 'center',
    //   render: (h, params) => {
    //     let value = params.row.type
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
    //           title: params.row.type
    //         }
    //       }, value)
    //     ])
    //   }
    // },
    name: {
      title: '计划名称',
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
    timeLimit: {
      title: '计划期限',
      minWidth: 60,
      key: 'timeLimit',
      align: 'center',
      render: (h, params) => {
        let value = params.row.timeLimit
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
              title: params.row.timeLimit
            }
          }, value)
        ])
      }
    },
    status: {
      title: '状态',
      minWidth: 60,
      key: 'status',
      align: 'center',
      render: (h, params) => {
        let value = params.row.status === '1' ? '待发布' : params.row.status === '2' ? '待审核' : params.row.status === '3' ? '已审核' : params.row.status === '4' ? '已完成' : params.row.status === '5' ? '已驳回' : '--'
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
    // deptId: {
    //   title: '计划单位id',
    //   minWidth: 100,
    //   key: 'deptId',
    //   align: 'center',
    //   render: (h, params) => {
    //     let value = params.row.deptId
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
    //           title: params.row.deptId
    //         }
    //       }, value)
    //     ])
    //   }
    // },
    personType: {
      title: '人员类型',
      minWidth: 60,
      key: 'personType',
      align: 'center',
      render: (h, params) => {
        let value = params.row.personType === '1' ? '类型1' : params.row.personType === '2' ? '类型2' : '类型3'
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
    TrainingContent: {
      title: '计划内容',
      minWidth: 180,
      key: 'deptId',
      align: 'center',
      render: (h, params) => {
        // 循环取出subjectName进行拼接
        let value = ''
        var subjectArray = []
        if (params.row.planSubjectDOS && params.row.planSubjectDOS.length > 0) {
          params.row.planSubjectDOS.forEach(item => {
            subjectArray.push(item.subjectName)
          })
        }
        if(subjectArray.length > 0) {
          value = subjectArray.join('，')
        }
        // let value1 = params.row.subjectId
        let value2 = params.row.totalTime
        // 将value2转换成小时
        let totalTimeH = ''
        if (value2 > 3600) {
          let totalTimeM = value2 / 3600
          totalTimeH = Math.round(totalTimeM * 10) / 10 + '小时'
        } else {
          let totalTimeM = value2 / 60
          totalTimeH = Math.round(totalTimeM * 10) / 10 + '分钟'
        }
        let value3 = params.row.target
        if (typeof (value) === 'undefined' || value === null || value === '') {
          value = '--'
        }
        if (typeof (value2) === 'undefined' || value2 === null || value2 === '') {
          value2 = '--'
        }
        if (typeof (value3) === 'undefined' || value3 === null || value3 === '') {
          value3 = '--'
        }
        return h('div', [
          h('span', {
            style: {
              display: 'inline-block',
              textAlign: 'left',
              width: '100%'
            },
            domProps: {
              title: value
            }
          }, '课目：' + value),
          h('span', {
            style: {
              display: 'inline-block',
              textAlign: 'left',
              width: '100%'
            },
            domProps: {
              title: totalTimeH
            }
          }, '时长：' + totalTimeH),
          h('span', {
            style: {
              display: 'inline-block',
              textAlign: 'left',
              width: '100%'
            },
            domProps: {
              title: params.row.target
            }
          }, '目标：' + value3)
        ])
      }
    },
    // target: {
    //   title: '目标',
    //   minWidth: 100,
    //   key: 'target',
    //   align: 'center',
    //   render: (h, params) => {
    //     let value = params.row.target
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
    //           title: params.row.target
    //         }
    //       }, value)
    //     ])
    //   }
    // },
    createByName: {
      title: '创建人',
      minWidth: 80,
      key: 'createByName',
      align: 'center',
      render: (h, params) => {
        let value = params.row.createByName
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
              title: params.row.createByName
            }
          }, value)
        ])
      }
    },
    createTime: {
      title: '创建时间',
      minWidth: 150,
      key: 'createTime',
      align: 'center',
      render: (h, params) => {
        let value = params.row.createTime
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
              title: params.row.createTime
            }
          }, value)
        ])
      }
    },
    reason: {
      title: '备注',
      minWidth: 150,
      key: 'reason',
      align: 'center',
      render: (h, params) => {
        let value = params.row.reason
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
              title: params.row.reason
            }
          }, value)
        ])
      }
    },
    // updateBy: {
    //   title: '修改人',
    //   minWidth: 100,
    //   key: 'updateBy',
    //   align: 'center',
    //   render: (h, params) => {
    //     let value = params.row.updateBy
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
    //           title: params.row.updateBy
    //         }
    //       }, value)
    //     ])
    //   }
    // },
    // updateTime: {
    //   title: '修改时间',
    //   minWidth: 100,
    //   key: 'updateTime',
    //   align: 'center',
    //   render: (h, params) => {
    //     let value = params.row.updateTime
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
    //           title: params.row.updateTime
    //         }
    //       }, value)
    //     ])
    //   }
    // },
    // delFlag: {
    //   title: '删除标志  (0表示存在 2表示删除)',
    //   minWidth: 100,
    //   key: 'delFlag',
    //   align: 'center',
    //   render: (h, params) => {
    //     let value = params.row.delFlag
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
    //           title: params.row.delFlag
    //         }
    //       }, value)
    //     ])
    //   }
    // },
    option: {
      title: '操作区域',
      minWidth: 170,
      key: 'option',
      align: 'center',
      fixed: 'right',
      render: (h, params) => {
        var user = _this.$cookie.get(
          _this.CONST_VALUE.LOGIN_USER_INFO
        )
        var listSub = JSON.parse(user)
        let renderData = []
        if (_this.canEdit && (params.row.status === '1' || params.row.status === '5') && params.row.createBy == listSub.userId) {
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

        if ((params.row.status === '1' || params.row.status === '5') && params.row.createBy === listSub.userId) {
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

        if(_this.canFindByID) {
          renderData.push(
            h('span', { // 详情、查看
              class: 'c-success',
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
                  _this.turnToDetails()
                }
              }
            }, '详情')
          )
        }

        if(_this.canPublish && (params.row.status === '1' || params.row.status === '5') && params.row.createBy == listSub.userId) {
          renderData.push(
            h('span', { // 发布
              class: 'c-success',
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
                  _this.handlePublish()
                }
              }
            }, '发布')
          )
        }

        if(_this.canBack && params.row.status === '2' && params.row.createBy == listSub.userId) {
          renderData.push(
            h('span', { // 撤销
              class: 'c-error',
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
                  _this.handleBack()
                }
              }
            }, '撤回')
          )
        }

        if(_this.canExamine && params.row.status === '2' && params.row.isAuditable === 0) {
          renderData.push(
            h('span', { // 审核
              class: 'c-success',
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
                  _this.handleExamine()
                }
              }
            }, '审核')
          )
        }

        if(_this.canRevoke && params.row.status === '3' && params.row.isAuditable === 0) {
          renderData.push(
            h('span', { // 撤销审核
              class: 'c-error',
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
                  _this.handleRevoke()
                }
              }
            }, '撤销')
          )
        }
        return renderData
      }
    }
  }
}
