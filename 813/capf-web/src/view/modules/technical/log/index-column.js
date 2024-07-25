/**
  * @description control - 考核控制- 列表 columns 配置
  * @param _this
  * @returns {*}
  * @author yxm
  * @date 2021-10-19
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
      title: '专业技术',
      minWidth: 100,
      key: 'type',
      align: 'center',
      render: (h, params) => {
        let value = params.row.type
        if (typeof value === 'undefined' || value === undefined || value === null || value === '') {
          value = '--'
        }else{
          value = value === '1' ? '发报技术' : (value === '2' ? '收报技术' : (value === '3' ? '译电技术' : '--'))
        }
        return h('div', [
          h('span', {
            style: {
              display: 'inline-block',
              width: '100%'
            }
          }, value)
        ])
      }
    },
    libraryContent: {
      title: '训练内容',
      minWidth: 200,
      key: 'libraryContent',
      align: 'center',
      render: (h, params) => {
        let value = params.row.libraryContent
        if (typeof value === 'undefined' || value === undefined || value === null || value === '') {
          value = '--'
        }
        return h('div', [
          h('span', {
            style: {
              display: 'inline-block',
              width: '100%'
            },
            domProps: {
              title: params.row.libraryContent
            }
          }, value)
        ])
      }
    },
    resultWrong: {
      title: '错字数',
      minWidth: 100,
      key: 'resultWrong',
      align: 'center',
      render: (h, params) => {
        let value = params.row.resultWrong
        if (typeof value === 'undefined' || value === undefined || value === null || value === '') {
          value = '--'
        }
        return h('div', [
          h('span', {
            style: {
              display: 'inline-block',
              width: '100%'
            },
            domProps: {
              title: params.row.resultWrong + '个'
            }
          }, value + '个')
        ])
      }
    },
    resultSpeed: {
      title: '速度',
      minWidth: 100,
      key: 'resultSpeed',
      align: 'center',
      render: (h, params) => {
        let value = params.row.resultSpeed
        if (typeof value === 'undefined' || value === undefined || value === null || value === '') {
          value = '--'
        }
        return h('div', [
          h('span', {
            style: {
              display: 'inline-block',
              width: '100%'
            },
            domProps: {
              title: params.row.resultSpeed + '字/S'
            }
          }, value + '字/S')
        ])
      }
    },
    resultScore: {
      title: '得分',
      minWidth: 100,
      key: 'resultScore',
      align: 'center',
      render: (h, params) => {
        let value = params.row.resultScore
        if (typeof value === 'undefined' || value === undefined || value === null || value === '') {
          value = '--'
        }else{
          let a = params.row.resultScore * 100
          value = _this.interception(a, 1)
        }
        return h('div', [
          h('span', {
            style: {
              display: 'inline-block',
              width: '100%'
            },
            domProps: {
              title: value + '分'
            }
          }, value + '分')
        ])
      }
    },
    createTime: {
      title: '训练时间',
      minWidth: 150,
      key: 'createTime',
      align: 'center',
      render: (h, params) => {
        let value = params.row.createTime
        if (typeof value === 'undefined' || value === undefined || value === null || value === '') {
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
    }
  }
}
