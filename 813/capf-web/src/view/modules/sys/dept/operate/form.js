/**
  * @description 验证 Dept - 部门 - 类对象
  * @param _this
  * @returns {*}
  * @author yxm
  * @date 2021-10-19
  */
module.exports = () => {
  return {
    deptId: null,
    deptName: null,
    parentId: null,
    level: null,
    parentName: '',
    orderNum: '1'
  }
}
