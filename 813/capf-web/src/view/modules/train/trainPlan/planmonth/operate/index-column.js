/**
 * planmonth - ${comments} - 列表 columns 配置
 * @param _this
 * @returns {*}
 * @author yxm
 * @date 2022-04-07
 */
module.exports = function(_this) {
  return {
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
      minWidth: 100,
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
    personType: {
      title: '人员类型',
      minWidth: 100,
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
              title: params.row.personType
            }
          }, value)
        ])
      }
    },
    target: {
      title: '计划内容',
      minWidth: 100,
      key: 'target',
      align: 'center',
      render: (h, params) => {
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
    }

  }
}
