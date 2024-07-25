/**
 * 验证 subjectmanagement - 课目管理表 - FORM 表单对象
 * @param _this
 * @returns {{}}
 * @author yxm
 * @date 2022-04-07
 */
import { antPositiveZeroFloat } from '@/utils/validate'
module.exports = function(_this) {
  return {
    name: [
      {
        required: true,
        message: '请输入课目名称',
        transform: value => (value ? value.trim() : ''),
        trigger: 'blur'
      }
    ],
    type: [
      { required: true, message: '请选择课目类型', trigger: 'change' },
      { required: true, message: '请选择课目类型', trigger: 'blur' }
    ],
    introduction: [
      {
        required: false,
        message: '请输入课目简介',
        transform: value => (value ? value.trim() : ''),
        trigger: 'blur'
      }
    ]
  }
}
