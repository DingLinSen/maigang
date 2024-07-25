/**
 * 验证 videomanagement - 视频管理表 - FORM 表单对象
 * @param _this
 * @returns {{}}
 * @author yxm
 * @date 2022-04-07
 */
import { antPositiveInteger } from '@/utils/validate'
module.exports = function(_this) {
  return {
    paperName: [
      {
        required: true,
        message: '请输入试卷名称',
        transform: value => (value ? value.trim() : ''),
        trigger: 'blur'
      }
    ],

    paperNo: [
      {
        required: true,
        message: '请输入试卷编号',
        transform: value => (value ? value.trim() : ''),
        trigger: 'blur'
      }
    ],
    paperType: [
      { required: true, message: '请选择试卷类型', trigger: 'change' },
      { required: true, message: '请选择试卷类型', trigger: 'blur' }
    ],
    sources: [
      {
        required: true,
        message: '请选择题库',
        trigger: 'change',
        type: 'array'
      }
    ],
    subjectType: [
      { required: true, message: '请选择课目类型', trigger: 'change' },
      { required: true, message: '请选择课目类型', trigger: 'blur' }
    ],
    subjectId: [
      {
        required: true,
        message: '请选择课目名称',
        trigger: 'change',
        type: 'array'
      }
    ],
    score: [
      {
        required: true,
        message: '请输入试卷分值',
        trigger: 'blur',
        type: 'number'
      }
    ],
    paperTime: [
      {
        required: true,
        message: '请输入答题时间',
        transform: value => (value ? value.trim() : ''),
        trigger: 'blur'
      },
      {
        validator: (rule, value, callback) =>
          antPositiveInteger(rule, value, callback, ''),
        trigger: 'blur'
      }
    ],
    subjectNumber: [
      {
        required: true,
        message: '请选择试卷题目',
        trigger: 'change',
        transform: value =>
          value && String(value) !== '0' ? String(value) : ''
      },
      {
        required: true,
        message: '请选择试卷题目',
        transform: value =>
          value && String(value) !== '0' ? String(value) : '',
        trigger: 'blur'
      }
    ]
  }
}
