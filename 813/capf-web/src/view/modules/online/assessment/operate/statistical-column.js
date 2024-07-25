/**
 * subjectlearn - 课目学习主表 - 列表 columns 配置
 * @param _this
 * @returns {*}
 * @author yxm
 * @date 2022-04-07
 */
module.exports = function(_this) {
  return {
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
      title: '考核时间',
      minWidth: 200,
      key: 'examineDate',
      align: 'center',
      render: (h, params) => {
        let value = params.row.examineDate
        if ((typeof (value) === 'undefined' || value === null || value === '')) {
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
      title: '考核课目',
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
    examineType: {
      title: '考核类型',
      minWidth: 100,
      key: 'examineType',
      align: 'center',
      render: (h, params) => {
        // 1结业考核初考 2结业考核补考 3季度考核 4抽考
        let value = params.row.examineType
        if (typeof (value) === 'undefined' || value === null || value === '') {
          value = '--'
        }else{
          value = value === 1 ? '结业考核初考' : (value === 2 ? '结业考核补考' : (value === 3 ? '季度考核' : (value === 4 ? '' : ('抽考'))))
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
    paperName: {
      title: '所用试卷',
      minWidth: 100,
      key: 'dataName',
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
              title: value
            }
          }, value)
        ])
      }
    },
    standardRate: {
      title: '合格率',
      minWidth: 100,
      key: 'dataName',
      align: 'center',
      render: (h, params) => {
        let value = Math.round(params.row.standardRate)
        if (typeof (value) === 'undefined' || value === null || value === '') {
          value = '--'
        }
        return h('div', [
          h('span', {
            style: {
              display: 'inline-block',
              width: '100%',
              color: value >= 60 ? '#26A386' : '#F53D3D'
            },
            domProps: {
              title: value + '%'
            }
          }, value + '%')
        ])
      }
    },
    option: {
      title: '操作区域',
      minWidth: 160,
      key: 'option',
      align: 'center',
      fixed: 'right',
      render: (h, params) => {
        let renderData = []
        if(_this.canFindByID) {
          renderData.push(
            h('span', { // 详情
              props: {
                type: 'primary'
              },
              class: 'c-primary',
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
                  _this.openUserModel()
                }
              }
            }, '查看人员信息')
          )
        }
        return renderData
      }
    }
  }
}
