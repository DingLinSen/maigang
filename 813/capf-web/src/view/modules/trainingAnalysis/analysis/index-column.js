
module.exports = function(_this) {
  return {
    // handle: {
    //   type: 'selection',
    //   width: 40, // 复选框
    //   className: 'pad-lft-no',
    //   align: 'center',
    //   fixed: 'left',
    //   key: 'handle'
    // },
    // id: {
    //   type: 'index',
    //   width: 60, // 序号
    //   className: 'pad-lft-no',
    //   align: 'center',
    //   title: '序号',
    //   fixed: 'left',
    //   key: 'id'
    // },
    userName: {
      title: '参训人员',
      minWidth: 180,
      key: 'userName',
      tree: true,
      align: 'left',
      render: (h, params) => {
        let value = params.row.userName
        let level = params.row.level
        let children = params.row.children
        if (typeof (value) === 'undefined' || value === null || value === '') {
          value = level === 1 ? '--' : ''
        }
        return h(
          'span',
          {
            style: {
              marginLeft:
                level === 1 && (!children || children.length === 0)
                  ? '19px'
                  : '0px',
              width: '100%'
            },
            domProps: {
              title: params.row.deptName
            }
          },
          value
        )
      }
    },
    subjectName: {
      title: '参训课目',
      minWidth: 100,
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
              title: value
            }
          }, value)
        ])
      }
    },
    totalRealTime: {
      title: '学习时长',
      minWidth: 100,
      key: 'totalRealTime',
      align: 'center',
      render: (h, params) => {
        let value = String(params.row.totalRealTime)
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
              title: params.row.totalRealTime
            }
          }, value)
        ])
      }
    },
    point: {
      title: '考核情况',
      minWidth: 80,
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
    quality: {
      title: '质量',
      minWidth: 80,
      key: 'quality',
      align: 'center',
      render: (h, params) => {
        let value = params.row.quality
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
              title: params.row.quality
            }
          }, value)
        ])
      }
    },
    yearLearnPercent: {
      title: '年度学习任务(h)',
      minWidth: 100,
      key: 'yearLearnPercent',
      align: 'center',
      render: (h, params) => {
        let value = params.row.yearLearnPercent
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
              title: params.row.yearLearnPercent
            }
          }, value)
        ])
      }
    },
    sort: {
      title: '排名',
      minWidth: 100,
      key: 'sort',
      align: 'center',
      render: (h, params) => {
        let value = params.row.sort
        if (typeof (value) === 'undefined' || value === null || value === '') {
          value = params.row.level === 1 ? '--' : ''
        }
        return h('div', [
          h('span', {
            style: {
              display: 'inline-block',
              width: '100%'
            },
            domProps: {
              title: params.row.sort
            }
          }, value)
        ])
      }
    }

  }
}
