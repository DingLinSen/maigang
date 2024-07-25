/**
 * 验证 sysexaminationroom - ${comments} - FORM 表单对象
 * @param _this
 * @returns {{}}
 * @author yxm
 * @date 2022-04-07
 */
import { validateNormalBySearch } from '@/utils/regexValidation'
module.exports = function(_this) {
  return {
    name: [
      { required: true, message: '请输入考场名称', transform: value => value ? value.trim() : '', trigger: 'blur' },
      {
        validator: (rule, value, callback) =>
          validateNormalBySearch(rule, value, callback),
        trigger: 'blur'
      }
    ],
    location: [
      { required: true, message: '请输入考场地点', transform: value => value ? value.trim() : '', trigger: 'blur' }
    ],
    status: [
      { required: true, message: '请输入状态 0正常 1删除', transform: value => value ? value.trim() : '', trigger: 'blur' }
    ],
    dept: [
      {
        required: true,
        trigger: 'change',
        validator: (rule, value, callback) => {
          const dept = _this.formData.dept
          if(dept.length === 0) {
            callback(new Error('请选择所属单位'))
          }
          callback()
        }
      }
    ]
  }
}
