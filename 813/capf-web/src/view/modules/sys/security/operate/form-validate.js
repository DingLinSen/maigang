/**
 * 验证 safe - 安全设置 - FORM 表单对象
 * @param _this
 * @returns {{}}
 * @author yxm
 * @date 2022-04-07
 */
import { antPositiveZeroFloat } from '@/utils/validate'
module.exports = function(_this) {
  return {
    name: [
      { required: true, message: '请输入决策名称', transform: value => value ? value.trim() : '', trigger: 'blur' }
    ],
    describe: [
      { required: true, message: '请输入描述', transform: value => value ? value.trim() : '', trigger: 'blur' }
    ],
    status: [
      { required: true, message: '请输入状态 0 启动 1不启动', transform: value => value ? value.trim() : '', trigger: 'blur' }
    ],
    createBy: [
      { required: true, message: '请输入创建人ID', transform: value => value ? value.trim() : '', trigger: 'blur' }
    ],
    createTime: [
      { required: true, message: '请输入创建时间', transform: value => value ? value.trim() : '', trigger: 'blur' }
    ],
    updateBy: [
      { required: true, message: '请输入修改人ID', transform: value => value ? value.trim() : '', trigger: 'blur' }
    ],
    updateTime: [
      { required: true, message: '请输入修改时间', transform: value => value ? value.trim() : '', trigger: 'blur' }
    ]
  }
}
