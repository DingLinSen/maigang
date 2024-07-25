/**
  * @description 验证 Role - 角色 - 类对象
  * @param _this
  * @returns {*}
  * @author yxm
  * @date 2021-10-19
  */
module.exports = () => {
  return {
    roleName: null, // 角色名称
    orderNum: '1', // 排序
    roleDesc: null, // 角色描述
    menuIds: [], // 菜单权限
    menuIdList: [],
    status: '0' // 状态,1停用,0启用
  }
}
