/**
 * 验证 planyear - 计划-年计划表 - FORM 表单对象
 * @param _this
 * @returns {{}}
 * @author yxm
 * @date 2022-04-07
 */
import { antPositiveZeroFloat, antPositiveInteger,validateDecimalSubPoint,validatePositiveFloat,validatePositiveFloatSub } from '@/utils/validate'
module.exports = function(_this) {
  return {
    dateArray: [
      {
        required: true,
        message: '请选择训练时间',
        trigger: 'change',
        type: 'array',
        fields: {
          //tpye类型试情况而定,所以如果返回的是date就改成date
          0: { type: 'date', required: true, message: '请选择训练时间' },
          1: { type: 'date', required: true, message: '请选择训练时间' }
        }
      }
    ],
    deptName: [
      {
        required: true,
        message: '请选择训练部门',
        trigger: 'change'
      }
    ],
    userIds: [
      {
        required: true,
        message: '请选择参训人员',
        trigger: 'change',
        type: 'array'
      }
    ],
    target: [{ required: true, message: '请输入目标', trigger: 'blur' }],
    trainFrequency: [
      { required: false, message: '请输入训练次数', trigger: 'blur' },
      {
        required: true,
        transform: value => (value ? value.trim() : ''),
        validator: (rule, value, callback) =>{
          // let valueStr = value ? String(value) : ''
          if(value && value !== '0'){
            antPositiveInteger(rule, value, callback, '')
          } else{
            return true
          }
        },
        trigger: 'blur'
      }
    ],
    trainTime: [
      { required: false, message: '请输入训练时长', trigger: 'blur' },
      {
        required: true,
        validator: (rule, value, callback) =>
        validateDecimalSubPoint(rule, value, callback, ''),
        trigger: 'blur'
      }
    ],
    score: [
      { required: false, message: '请输入考核成绩', trigger: 'blur' },
      {
        required: true,
        validator: (rule, value, callback) =>
        validatePositiveFloatSub(rule, value, callback, ''),
        trigger: 'blur'
      }
    ],
    subjectIds: [
      {
        required: true,
        message: '请选择课目名称',
        trigger: 'change',
        type: 'array'
      }
    ]
  }
}
