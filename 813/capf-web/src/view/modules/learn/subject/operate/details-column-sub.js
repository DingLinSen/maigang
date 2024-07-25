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
    dataName: {
      title: '资料名称',
      minWidth: 100,
      key: 'dataName',
      align: 'center',
      render: (h, params) => {
        let value = params.row.dataName
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
              title: params.row.dataName
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
    speedProgress: {
      title: '进度',
      minWidth: 100,
      key: 'speedProgress',
      align: 'center',
      render: (h, params) => {
        let value = params.row.speedProgress.toFixed(2)
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
    }
  }
}
