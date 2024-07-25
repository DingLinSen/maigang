/**
 * planmonth - ${comments} - 列表 columns 配置
 * @param _this
 * @returns {*}
 * @author yxm
 * @date 2022-04-07
 */
module.exports = function(_this) {
  return {
    userName: {
      title: '人员',
      minWidth: 100,
      key: 'userName',
      align: 'center',
      render: (h, params) => {
        let value = params.row.userName
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
              title: params.row.userName
            }
          }, value)
        ])
      }
    },
    deptName: {
      title: '单位',
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
    point: {
      title: '成绩',
      minWidth: 100,
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
    paperName: {
      title: '试卷',
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
    checkStandard: {
      title: '评判',
      minWidth: 100,
      key: 'checkStandard',
      align: 'center',
      render: (h, params) => {
        let value = params.row.checkStandard
        if (typeof (value) === 'undefined' || value === null || value === '') {
          value = '--'
        }
        return h('div', [
          h('span', {
            style: {
              display: 'inline-block',
              width: '100%',
              color:  params.row.checkStandard === '不合格' ? '#FF4747' : '#515a6e'
            },
            domProps: {
              title: params.row.checkStandard
            }
          }, value)
        ])
      }
    }

  }
}
