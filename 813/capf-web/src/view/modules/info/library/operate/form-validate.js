/**
 * 验证 manuscriptlibrary - 稿库管理表 - FORM 表单对象
 * @param _this
 * @returns {{}}
 * @author yxm
 * @date 2022-04-07
 */
import { antPositiveZeroFloat, supportNormal } from '@/utils/validate'
module.exports = function(_this) {
  return {
    content: [
      {
        required: true,
        message: '请输入稿件内容',
        transform: value => (value ? value.trim() : ''),
        trigger: 'blur'
      }
      // ,
      // {
      //   validator: (rule, value, callback) =>
      //     supportNormal(rule, value, callback, '请不要输入特殊字符'),
      //   trigger: 'blur'
      // }
    ],
    length: [
      {
        required: true,
        message: '请输入长度',
        transform: value => (value ? value.trim() : ''),
        trigger: 'blur'
      },
      {
        validator: (rule, value, callback) =>
          antPositiveZeroFloat(rule, value, callback, ''),
        trigger: 'blur'
      }
    ],
    codeLength: [
      {
        required: true,
        message: '请输入码长',
        transform: value => (value ? value.trim() : ''),
        trigger: 'blur'
      },
      {
        validator: (rule, value, callback) =>
          antPositiveZeroFloat(rule, value, callback, ''),
        trigger: 'blur'
      }
    ],
    difficulty: [
      { required: true, message: '请选择难度', trigger: 'change' },
      { required: true, message: '请选择难度', trigger: 'blur' }
    ]
  }
}
