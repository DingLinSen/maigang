/**
 * 验证 systerminal - 系统管理-终端管理 - 类对象
 * @param
 * @returns {}
 * @author yxm
 * @date 2022-04-07
 */
module.exports = () => {
  return {
    id: null, // 主键
    ipAddress: null, // ip地址
    codeNumber: null, // 设备编号
    macAddress: null, // 硬件地址
    deptId: null, // 部门id
    dept: [], // 部门
    examinationId: '',
    location: null, // 所属位置
    operatingSystem: null // 操作系统
  }
}
