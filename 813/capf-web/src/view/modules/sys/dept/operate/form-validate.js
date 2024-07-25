/**
  * @description  验证 Dept - 部门 - FORM 表单对象
  * @param _this
  * @returns {*}
  * @author yxm
  * @date 2021-10-19
  */
import { validateChinese } from '@/utils/regexValidation'
module.exports = function(_this) {
  return {
    deptName: [
      { required: true, message: '请输入部门名称', transform: value => value ? value.trim() : '', trigger: 'blur' },
      {
        validator: (rule, value, callback) =>
          validateChinese(rule, value, callback, '请输入汉字'),
        trigger: 'blur'
      }
    ]
  }
}
