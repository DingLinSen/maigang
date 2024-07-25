/**
  * @description 验证 User - 用户 - 类对象
  * @author yxm
  * @date 2021-10-19
  */
module.exports = () => {
  return {
    id: null,
    username: null, // 用户名
    mobile: null, // 手机
    userId: null, // id
    roleId: '', // 角色id
    roleIdList: '',
    name: null, // 姓名
    dept: [], // 部门
    deptId: null,
    fingerprintOne: null, // 指纹信息1
    fingerprintTwo: null, // 指纹信息2
    faceId: null, // 人脸信息
    remark: null, // 备注
    password: '', // 初始密码
    newpassword: null,
    status: '0' // 状态,1停用,0启用
  }
}
