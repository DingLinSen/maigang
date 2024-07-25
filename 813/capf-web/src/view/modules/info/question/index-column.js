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
      width: 60, // 序号
      className: 'pad-lft-no',
      align: 'center',
      title: '序号',
      fixed: 'left',
      key: 'id'
    },
    title: {
      title: '题目',
      minWidth: 250,
      key: 'title',
      align: 'center',
      render: (h, params) => {
        let value = params.row.title
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
                title: params.row.title
              }
            },
            value
          )
        ])
      }
    },
    answerType: {
      title: '题目类型',
      minWidth: 100,
      key: 'answerType',
      align: 'center',
      render: (h, params) => {
        let value = params.row.answerType
        if (typeof value === 'undefined' || value === null || value === '') {
          value = '--'
        } else {
          value =
            value === 1
              ? '单选'
              : value === 2
              ? '多选'
              : value === 3
              ? '判断'
              : value === 4
              ? '填空'
              : value === 5
              ? '简答'
              : '--'
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
      minWidth: 120,
      key: 'subjectType',
      align: 'center',
      render: (h, params) => {
        let value = params.row.subjectType
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
    answerDifficulty: {
      title: '题目难度',
      minWidth: 100,
      key: 'answerDifficulty',
      align: 'center',
      render: (h, params) => {
        let value = params.row.answerDifficulty
        let valueStr = '--'
        if (typeof value === 'undefined' || value === null || value === '') {
          value = '--'
        } else{
          valueStr = value === 1 ? '低' : value === 2 ? '中' : value === 3 ? '高' : '--'
        }
        return h('div', {
          style: {
            display: 'block'
          },
        }, [
          h(
            'span',
            {
              style: {
                display: 'inline-block',
                height: '8px',
                width: '8px',
                borderRadius: '50%',
                marginRight: '5px',
                background: value === 1 ? 'green' : value === 2 ? 'orange' : value === 3 ? 'red' : '#FFFFFF'
              },
            },
            ''
          ),
          valueStr
        ])
      }
    },
    titleOptionDOS: {
      title: '正确答案',
      minWidth: 200,
      key: 'titleOptionDOS',
      align: 'center',
      render: (h, params) => {
        let answerArray = []
        let answerType = params.row.answerType
        let value = params.row.titleOptionDOS
        if (typeof value === 'undefined' || value === null || value === [] || value === '') {
          value = '--'
        } else {
          value.forEach(item => {
            if(item.isCorrect === 1 && (answerType === 1 || answerType === 2)){
              answerArray.push(String.fromCharCode(64 + item.sort))
            } else if(item.isCorrect === 1 && (answerType === 3 || answerType === 4)){
              answerArray.push(item.content)
            } else if(answerType === 5){
              answerArray.push(item.content)
            }
          })
        }
        // console.log(answerArray)
        value = answerArray.length > 0 ? answerArray.join('，') : '--'
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
    source: {
      title: '题目来源',
      minWidth: 200,
      key: 'source',
      align: 'center',
      render: (h, params) => {
        let value = params.row.source
        if (typeof value === 'undefined' || value === null || value === '') {
          value = '--'
        }
        return h('div', [
          h(
            'span',
            {
              class: 'c-primary',
              style: {
                display: 'inline-block',
                width: '100%',
                // whiteSpace: 'normal',
                textDecoration: 'underline'
              },
              domProps: {
                title: params.row.source
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
