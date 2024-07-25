/**
 * @param _this
 * @returns {{}}
 */
import {
  validateNoBlankSpace
} from '@/utils/regexValidation'
module.exports = function(_this) {
  return {
    outlineName: [
      {
        required: true,
        message: '请输入大纲名称',
        trigger: 'blur'
      },
      {
        validator: (rule, value, callback) =>
          validateNoBlankSpace(rule, value, callback, '大纲名称不能为空'),
        trigger: 'blur'
      }
    ],
    fillList: [
      {
        required: true,
        trigger: 'change',
        type: 'array',
        message: '请上传文件'
      }
    ]
  }
}
