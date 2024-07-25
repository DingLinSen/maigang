/**
 * 验证 subjectlearn - 课目学习主表 - FORM 表单对象
 * @param _this
 * @returns {{}}
 * @author yxm
 * @date 2022-04-07
 */
import { antPositiveZeroFloat } from '@/utils/validate'
module.exports = function(_this) {
  return {
    subjectId: [
      { required: true, message: '请输入课目id', transform: value => value ? value.trim() : '', trigger: 'blur' }
    ],
    userId: [
      { required: true, message: '请输入用户id', transform: value => value ? value.trim() : '', trigger: 'blur' }
    ],
    startDate: [
      { required: true, message: '请输入开始日期期限', transform: value => value ? value.trim() : '', trigger: 'blur' }
    ],
    endDate: [
      { required: true, message: '请输入结束日期期限', transform: value => value ? value.trim() : '', trigger: 'blur' }
    ],
    createTime: [
      { required: true, message: '请输入创建时间', transform: value => value ? value.trim() : '', trigger: 'blur' }
    ],
    updateTime: [
      { required: true, message: '请输入修改时间', transform: value => value ? value.trim() : '', trigger: 'blur' }
    ],
    createBy: [
      { required: true, message: '请输入创建人id', transform: value => value ? value.trim() : '', trigger: 'blur' }
    ],
    updateBy: [
      { required: true, message: '请输入修改人id', transform: value => value ? value.trim() : '', trigger: 'blur' }
    ],
    totalProgress: [
      { required: true, message: '请输入课目学习总进度值', transform: value => value ? value.trim() : '', trigger: 'blur' }
    ]
  }
}
