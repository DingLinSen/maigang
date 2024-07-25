/**
  * @description  验证 User - 用户 - FORM 表单对象
  * @param _this
  * @returns {*}
  * @author yxm
  * @date 2021-10-19
  */
import { validateEnglishAndNumber, validateNormalBySearch, validateNoBlankSpace } from '@/utils/regexValidation'
module.exports = function(_this) {
  return {
    username: [
      { required: true, message: '请输入用户名', transform: value => value ? value.trim() : '', trigger: 'blur' },
      {
        validator: (rule, value, callback) =>
          validateEnglishAndNumber(rule, value, callback),
        trigger: 'blur'
      }
    ],
    password: [
      { required: true, message: '请输入密码', transform: value => value, trigger: 'blur' },
      {
        validator: (rule, value, callback) =>
          validateNoBlankSpace(rule, value, callback, '请输入不包含空格的字符'),
        trigger: 'blur'
      },
      {
        trigger: 'blur',
        validator: (rule, value, callback) => {
          var passwordreg = /(?=.*\d)(?=.*[a-zA-Z])(?=.*[^a-zA-Z0-9]).{6,16}/
          if (!passwordreg.test(value)) {
            callback(new Error('密码必须由数字、字母、特殊字符组合,请输入6-16位'))
          }else{
            callback()
          }
        }
      }
      // {
      //   trigger: 'blur',
      //   validator: (rule, value, callback) => {
      //     var passwordreg = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,16}$/
      //     if (!passwordreg.test(value)) {
      //       callback(new Error('请输入6-16位由数字、字母组合'))
      //     }else{
      //       callback()
      //     }
      //   }
      // }
    ],
    newpassword: [
      { required: true, message: '请输入密码', transform: value => value, trigger: 'blur' },
      {
        validator: (rule, value, callback) =>
          validateNoBlankSpace(rule, value, callback, '请输入不包含空格的字符'),
        trigger: 'blur'
      },
      {
        trigger: 'blur',
        validator: (rule, value, callback) => {
          var passwordreg = /(?=.*\d)(?=.*[a-zA-Z])(?=.*[^a-zA-Z0-9]).{6,16}/
          if (!passwordreg.test(value)) {
            callback(new Error('密码必须由数字、字母、特殊字符组合,请输入6-16位'))
          }else{
            callback()
          }
        }
      }
    ],
    name: [
      { required: true, message: '请输入人员姓名', transform: value => value ? value.trim() : '', trigger: 'blur' },
      {
        validator: (rule, value, callback) =>
          validateNormalBySearch(rule, value, callback),
        trigger: 'blur'
      }
    ],
    mobile: [
      // { required: true, message: '请输入联系电话' },
      {
        type: 'string',
        trigger: 'blur',
        validator: (rule, value, callback) => {
          // let phonereg = /^(1[3-9]{1}\d{9})|([0-9]{3,4}-\d{7,8})$/
          var phone = /^1[3456789]\d{9}$/ // 手机电话
          var telphone = /^((0\d{2,3})-)?(\d{7,8})$/ // 座机电话
          if(!value || String(value).trim() === '') {
            callback()
          }if(phone.test(value) === false && telphone.test(value) === false) {
            callback(new Error('请输入正确联系方式'))
          }else {
            callback()
          }
        }
      }
    ],
    roleId: [
      { required: true, message: '请选择用户角色', trigger: 'change' }
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
    // 用户角色
    userRoleList: [
      {
        required: true,
        trigger: 'change',
        validator: (rule, value, callback) => {
          const userRoleList = _this.formData.userRoleList
          if(userRoleList.length === 0) {
            callback(new Error('请选择用户角色'))
          }
          callback()
        }
      }
    ],
    status: [
      { required: true, message: '请选择状态', trigger: 'change' }
    ],
    remark: [
      {
        validator: (rule, value, callback) =>
          validateNoBlankSpace(rule, value, callback, '请输入备注'),
        trigger: 'blur'
      }
    ],
    fingerprintOne: [
      { required: true, message: '请录入指纹信息1', trigger: 'blur' }
    ],
    fingerprintTwo: [
      { required: true, message: '请录入指纹信息2', trigger: 'blur' }
    ],
    faceId: [
      { required: true, message: '请录入人脸信息', trigger: 'blur' }
    ]

  }
}
