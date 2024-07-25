/**
 * 验证 systerminal - 系统管理-终端管理 - FORM 表单对象
 * @param _this
 * @returns {{}}
 * @author yxm
 * @date 2022-04-07
 */
module.exports = function(_this) {
  return {
    ipAddress: [
      { required: true, message: '请输入ip地址', transform: value => value ? value.trim() : '', trigger: 'blur' }
    ],
    codeNumber: [
      { required: true, message: '请输入设备编号', transform: value => value ? value.trim() : '', trigger: 'blur' }
    ],
    macAddress: [
      { required: true, message: '请输入硬件地址', transform: value => value ? value.trim() : '', trigger: 'blur' }
    ],
    // 用户角色
    dept: [
      {
        required: true,
        trigger: 'change',
        validator: (rule, value, callback) => {
          const dept = _this.formData.dept
          if(dept.length === 0) {
            callback(new Error('请选择所属单位'))
          }
          callback()
        }
      }
    ],

    examinationId: [
      { required: true, message: '请选择所属考场', trigger: 'change' }
    ],
    location: [
      { message: '请输入所属位置', transform: value => value ? value.trim() : '', trigger: 'blur' }
    ],
    operatingSystem: [
      { required: true, message: '请输入操作系统', transform: value => value ? value.trim() : '', trigger: 'blur' }
    ]
  }
}
