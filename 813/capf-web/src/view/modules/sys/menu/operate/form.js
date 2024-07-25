/**
  * @description  验证 Menu - 菜单管理 - 类对象
  * @author yxm
  * @date 2021-10-19
  */
module.exports = () => {
  return {
    menuId: null, // 主键
    parentId: null, // 父菜单ID，一级菜单为0
    name: null, // 菜单名称
    url: null, // 菜单URL
    type: '', // 类型   0：目录   1：菜单   2：按钮
    icon: '', // 菜单图标
    // orderNum: 1, // 排序
    orderNum: '1', // 排序
    perms: null, // 授权(多个用逗号分隔，如：user:list,user:create)
    status: '0'
  }
}
