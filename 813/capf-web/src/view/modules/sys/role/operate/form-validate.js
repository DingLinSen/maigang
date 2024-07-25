/**
  * @description  验证 Role - 角色 - FORM 表单对象
  * @param _this
  * @returns {*}
  * @author yxm
  * @date 2021-10-19
  */
import { validateNoBlankSpace, validatePositiveInteger, validateChinese } from '@/utils/regexValidation'
module.exports = function(_this) {
  return {
    roleName: [
      { required: true, message: '请输入角色名称', transform: value => value ? value.trim() : '', trigger: 'blur' },
      {
        validator: (rule, value, callback) =>
          validateChinese(rule, value, callback, '请输入汉字'),
        trigger: 'blur'
      }
    ],
    roleDesc: [
      {
        validator: (rule, value, callback) =>
          validateNoBlankSpace(rule, value, callback, '请输入角色描述'),
        trigger: 'blur'
      }
    ],
    orderNum: [
      { required: true, message: '请输入排序', transform: value => value ? value.trim() : '', trigger: 'blur' },
      {
        validator: (rule, value, callback) =>
          validatePositiveInteger(rule, value, callback, '请输入正整数'),
        trigger: 'blur'
      }
    ],
    menuList: [
      {
        required: true,
        trigger: 'blur',
        validator: (rule, value, callback) => {
          const menuList = _this.$refs.tree.getCheckedAndIndeterminateNodes()
          if (menuList.length === 0) {
            callback(new Error('请选择菜单权限'))
          }
          callback()
        }
      }
    ]
  }
}
