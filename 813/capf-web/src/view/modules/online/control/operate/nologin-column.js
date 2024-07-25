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
    deptName: {
      title: '单位',
      minWidth: 200,
      key: 'deptName',
      align: 'center',
      render: (h, params) => {
        let value = params.row.deptName
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
    userName: {
      title: '姓名',
      minWidth: 150,
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
    }
  }
}
