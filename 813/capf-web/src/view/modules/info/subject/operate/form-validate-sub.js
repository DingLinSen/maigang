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
    chapterTitle: [
      {
        required: true,
        message: '请输入章节',
        transform: value => (value ? value.trim() : ''),
        trigger: 'blur'
      }
    ],
    chapter: [
      {
        required: true,
        message: '请输入章节名称',
        transform: value => (value ? value.trim() : ''),
        trigger: 'blur'
      }
    ]
  }
}
