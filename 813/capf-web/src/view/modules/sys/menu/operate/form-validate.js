/**
  * @description  验证 Menu - 菜单管理 - FORM 表单对象
  * @author yxm
  * @date 2021-10-19
  */
import { validatePositiveInteger } from '@/utils/regexValidation'
module.exports = function(_this) {
  return {
    parentId: [
      { required: true, message: '请输入上级目录', trigger: 'blur' }
    ],
    parentName: [
      { required: true, message: '请输入上级目录', trigger: 'blur' }
    ],
    name: [
      { required: true, message: '请输入名称', transform: value => value ? value.trim() : '', trigger: 'blur' }
    ],
    icon: [
      { required: true, message: '请输入图标', trigger: 'blur', transform: value => value ? value.trim() : '' }
    ],
    url: [
      { required: true, message: '请输入URL', transform: value => value ? value.trim() : '', trigger: 'blur' }
    ],
    perms: [
      { required: true, message: '请输入权限', transform: value => value ? value.trim() : '', trigger: 'blur' }
    ],
    type: [
      { required: true, message: '请选择类型', trigger: 'change' },
      { required: true, message: '请选择类型', trigger: 'blur' }
    ],
    orderNum: [
      { required: true, message: '请输入排序', transform: value => value ? value.trim() : '', trigger: 'blur' },
      {
        validator: (rule, value, callback) =>
          validatePositiveInteger(rule, value, callback, '请输入正整数'),
        trigger: 'blur'
      }
    ]
  }
}
