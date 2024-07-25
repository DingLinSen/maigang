/**
 * 验证 planyear - 计划-年计划表 - FORM 表单对象
 * @param _this
 * @returns {{}}
 * @author yxm
 * @date 2022-04-07
 */
import { antPositiveZeroFloat } from '@/utils/validate'
module.exports = function(_this) {
  return {
    type: [
      { required: true, message: '请选择计划类型', trigger: 'change' }
    ],
    name: [
      { required: true, message: '请输入计划名称', trigger: 'blur' }
    ],
    timeLimit: [
      { required: true, message: '请选择计划期限', trigger: 'change', type: 'date' }
    ],
    // deptId: [
    //   { required: true, message: '请选择计划单位', trigger: 'change' },
    //   { required: true, message: '请选择计划单位', trigger: 'blur' }
    // ],
    personType: [
      { required: true, message: '请选择人员类型', trigger: 'change' }
    ],
    target: [
      { required: true, message: '请输入目标', trigger: 'blur' }
    ],
    // createBy: [
    //   { required: true, message: '请输入发布人(创建人)', transform: value => value ? value.trim() : '', trigger: 'blur' }
    // ],
    // createTime: [
    //   { required: true, message: '请输入创建时间', transform: value => value ? value.trim() : '', trigger: 'blur' }
    // ],
    // updateBy: [
    //   { required: true, message: '请输入修改人', transform: value => value ? value.trim() : '', trigger: 'blur' }
    // ],
    // updateTime: [
    //   { required: true, message: '请输入修改时间', transform: value => value ? value.trim() : '', trigger: 'blur' }
    // ],
    // delFlag: [
    //   { required: true, message: '请输入删除标志  (0表示存在 2表示删除)', transform: value => value ? value.trim() : '', trigger: 'blur' }
    // ],
    // status: [
    //   { required: true, message: '请输入状态 1 待发布 2 待审核 3 已审核 4 已完成', transform: value => value ? value.trim() : '', trigger: 'blur' }
    // ],
    subjectId: [
      {
        required: true,
        message: '请选择培训课目',
        trigger: 'change',
        type: 'array'
      }
    ],
    reason: [
      {
        required: true,
        message: '驳回原因不能为空！',
        transform: value => (value ? value.trim() : ''),
        trigger: 'blur'
      }
    ]
  }
}
