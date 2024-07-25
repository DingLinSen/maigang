/**
 * 验证 planyear - 计划-年计划表 - FORM 表单对象
 * @param _this
 * @returns {{}}
 * @author yxm
 * @date 2022-04-07
 */
import { antPositiveZeroFloat, antPositiveInteger1To100 } from '@/utils/validate'
module.exports = function(_this) {
  return {
    type: [{ required: true, message: '请选择任务类型', trigger: 'change' }],
    taskName: [{ required: true, message: '请输入任务名称', trigger: 'blur' }],
    dateArray: [
      {
        required: true,
        message: '请选择任务期限',
        trigger: 'change',
        type: 'array',
        fields: {
          //tpye类型试情况而定,所以如果返回的是date就改成date
          0: { type: 'date', required: true, message: '请选择任务期限' },
          1: { type: 'date', required: true, message: '请选择任务期限' }
        }
      }
    ],
    deptIds: [
      {
        required: true,
        message: '请选择任务单位',
        min: 1,
        trigger: 'change',
        type: 'array'
      }
    ],
    subjectType: [
      {
        required: true,
        message: '请选择课目类型',
        trigger: 'change'
      }
    ],
    subjectIdTemp: [
      {
        required: true,
        message: '请选择培训课目',
        trigger: 'change'
      }
    ],
    chapter: [
      {
        required: true,
        message: '请选择培训章节',
        trigger: 'change',
        type: 'array'
      }
    ],
    taskUserArray: [
      {
        required: true,
        message: '请选择参与人员',
        trigger: 'change',
        type: 'array'
      }
    ],
    target: [{ required: true, message: '请输入目标', trigger: 'blur' }],
    trainFrequency: [
      { required: true, message: '请输入训练次数', trigger: 'blur' },
      {
        validator: (rule, value, callback) =>
        antPositiveInteger1To100(rule, value, callback, ''),
        trigger: 'blur'
      }
    ],
    assessment: [
      { required: true, message: '请选择是否考核', trigger: 'change' }
    ],
    assessmentId: [
      { required: true, message: '请选择考核名称', trigger: 'change' }
    ],
    subjectId: [
      {
        required: true,
        message: '请选择培训课目',
        trigger: 'change',
        type: 'array'
      }
    ]
  }
}
