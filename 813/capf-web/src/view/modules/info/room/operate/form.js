/**
 * 验证 sysexaminationroom - ${comments} - 类对象
 * @param
 * @returns {}
 * @author yxm
 * @date 2022-04-07
 */
module.exports = () => {
  return {
    id: null, // 主键
    name: null, // 考场名称
    location: null, // 考场地点
    status: null, // 状态 0正常 1删除
    deptId: null, // 所属单位
    dept: [], // 部门
    deptName: ''
  }
}
