/**
 * 验证 videomanagement - 考核管理表 - FORM 表单对象
 * @param _this
 * @returns {{}}
 * @author yxm
 * @date 2022-04-07
 */
// import {antPositiveZeroFloat} from '@/utils/validate'
import {antInteger} from '../../../../../utils/validate'

module.exports = function (_this) {
  return {
    examinationName: [{
      required: true,
      message: '请输入考试名称',
      trigger: 'blur'
    }],
    paperId: [
      {
        required: true,
        message: '请选择试卷名称',
        trigger: 'change'
      }
    ],
    type: [
      {
        required: true,
        message: '请选择考试类型',
        trigger: 'change'
      }
    ],
    passScore: [{
      required: true,
      message: '请输入及格分',
      trigger: 'blur',
      type: 'any'
    },
    {
      validator: (rule, value, callback) =>
        antInteger(rule, value, callback, ''),
      trigger: 'change'
    },
    {
      trigger: 'change',
      validator: (rule, value, callback) => {
        if (value && value != '') {
          if (
            value > _this.formData.score
          ) {
            callback(new Error('及格分不能大于总分数!'))
          } else {
            callback()
          }
        } else {
          callback()
        }
      }
    }],
    testDuration: [{
      required: true,
      message: '请输入考试时长',
      trigger: 'blur',
      type: 'any'
    },
    {
      validator: (rule, value, callback) =>
        antInteger(rule, value, callback, ''),
      trigger: 'blur'
    },
    {
      validator: (rule, value, callback) => {
        if (value.length > 3) {
          callback(new Error('考试时长不能大于三位数！'))
        } else {
          callback()
        }
      },
      trigger: 'change'
    }
    ],
    examDate: [{
      required: true,
      message: '请选择考试日期',
      trigger: 'change',
      type: 'array'
    }],
    examinationTime: [{
      required: true,
      message: '请选择考试时间',
      trigger: 'change',
      type: 'array'
    }],
    taskUserArray: [
      {
        required: true,
        message: '请选择考生',
        trigger: 'change',
        type: 'array'
      }
    ]
  }
}
