/**
 * 验证 otherexamine - 网上考核-其他考核 - FORM 表单对象
 * @param _this
 * @returns {{}}
 * @author yxm
 * @date 2022-04-07
 */
import { antPositiveZeroFloat } from '@/utils/validate'
import {
  validateNoBlankSpace
} from '@/utils/regexValidation'
module.exports = function(_this) {
  return {
    name: [
      { required: true, message: '请输入考核名称', trigger: 'blur' }
    ],
    deptIds: [
      { required: true, message: '请选择考核部门', trigger: 'change', type: 'array' }
    ],
    examineType: [
      { required: true, message: '请选择考核类型', trigger: 'change' }
    ],
    deptName: [
      { required: true, message: '请输入考核名称', trigger: 'blur' }
    ],
    subjectId: [
      {
        required: true,
        message: '请选择课目名称',
        trigger: 'change'
      }
    ],
    examineStartDate: [
      { required: true, message: '请选择考核时间', trigger: 'change', type: 'date' }
    ],
    type: [
      { required: true, message: '请选择课目类型', trigger: 'change' }
    ],
    // examineEndDate: [
    //   { required: true, message: '请输入考核时间-结束时间', trigger: 'blur' }
    // ],
    remark: [
      { required: true, message: '请输入备注', trigger: 'blur' },
      {
        validator: (rule, value, callback) =>
          validateNoBlankSpace(rule, value, callback, '请不要只输入空格'),
        trigger: 'blur'
      }
    ],
    fillList: [
      { required: true, message: '请选择文档', trigger: 'change', type: 'array' }
    ]
    // fileName: [
    //   { required: true, message: '请输入文档名称', trigger: 'blur' }
    // ],
    // filePath: [
    //   { required: true, message: '请上传文档', trigger: 'blur' }
    // ],
    // createTime: [
    //   { required: true, message: '请输入创建时间', trigger: 'blur' }
    // ],
    // createBy: [
    //   { required: true, message: '请输入创建人id', trigger: 'blur' }
    // ],
    // updateTime: [
    //   { required: true, message: '请输入修改时间', trigger: 'blur' }
    // ],
    // updateBy: [
    //   { required: true, message: '请输入修改人id', trigger: 'blur' }
    // ],
    // status: [
    //   { required: true, message: '请输入状态 0正常 1删除', trigger: 'blur' }
    // ]
  }
}
