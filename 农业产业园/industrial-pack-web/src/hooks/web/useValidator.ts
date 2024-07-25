import { useI18n } from '@/hooks/web/useI18n'

const { t } = useI18n()

type Callback = (error?: string | Error | undefined) => void

interface LengthRange {
  min: number
  max: number
  message: string
}

export const useValidator = () => {
  const required = (message?: string) => {
    return {
      required: true,
      transform: (value) => {
        // if (typeof value === 'string') {
        //   return value ? value.trim() : ''
        // }
        // return value
        return value ? value.trim() : ''
      },
      message: message || t('common.required')
    }
  }
  // 根据仅支持汉字字母数字
  const validateNormalBySearch = (val: any, callback: Callback, message: string) => {
    if (/^[A-Za-z0-9\u4e00-\u9fa5]+$/gi.test(val)) {
      callback()
    } else {
      callback(new Error(message))
    }
  }
  // 富文本校验
  const validateEditor = (val: any, callback: Callback, message: string) => {
    if (/<p>(&nbsp;|&nbsp;\s+)+<\/p>|<p>(<br\/>)+<\/p>/g.test(val)) {
      callback()
    } else {
      callback(new Error(message))
    }
  }
  // 长度范围
  const lengthRange = (val: any, callback: Callback, options: LengthRange) => {
    const { min, max, message } = options
    if (val.length < min || val.length > max) {
      callback(new Error(message))
    } else {
      callback()
    }
  }
  // 不能有空格
  const notSpace = (val: any, callback: Callback, message: string) => {
    if (val && val.length > 0 && val.indexOf(' ') !== -1) {
      callback(new Error(message))
    } else {
      callback()
    }
  }
  // 不能输入纯有空格
  const notAllSpace = (val: any, callback: Callback, message: string) => {
    if (val && val.length > 0 && val.indexOf(' ') !== -1 && String(val).trim() === '') {
      callback(new Error(message))
    } else {
      callback()
    }
  }
  // 不能是特殊字符
  const notSpecialCharacters = (val: any, callback: Callback, message: string) => {
    // 密码不能是特殊字符
    if (/[`~!@#$%^&*()_+<>?:"{},.\/;'[\]]/gi.test(val)) {
      callback(new Error(message))
    } else {
      callback()
    }
  }

  // 只能输入1-4的数字
  const validateNumberOneToFour = (val: any, callback: Callback, message: string) => {
    // 密码不能是特殊字符
    if (/^[1-4]$/.test(val)) {
      callback(new Error(message))
    } else {
      callback()
    }
  }

  // 两个字符串是否想等
  const isEqual = (val1: string, val2: string, callback: Callback, message: string) => {
    if (val1 === val2) {
      callback()
    } else {
      callback(new Error(message))
    }
  }

  // 以英⽂字母开头，只能包含英⽂字母、数字、下划线
  const validateEnglishAndNumber = (val: any, callback: Callback, message: string) => {
    if (/^[a-z][a-z0-9_]*$/.test(val)) {
      callback()
    } else {
      callback(new Error(message))
    }
  }
  // 以英⽂字母开头，只能包含英⽂字母、数字、下划线、短杠
  const validateEngNumber = (val: any, callback: Callback, message: string) => {
    if (/^[A-Za-z0-9_-]+$/.test(val)) {
      callback()
    } else {
      callback(new Error(message))
    }
  }
  // 密码必须由数字、字母组合,请输入6-16位
  const validatePassword = (val: any, callback: Callback, message: string) => {
    if (/^(?=.*\d)(?=.*[A-z])[\da-zA-Z]{6,16}$/.test(val)) {
      callback()
    } else {
      callback(new Error(message))
    }
  }

  // ========================号码类 ======================

  // 电子邮箱格式(以字母数字开头，中间可以是多个数字字母和-；然后是@符号，后面是字母数字；然后是.符号加2-4个字母结尾)
  const validateEmail = (val: any, callback: Callback, message: string) => {
    if (/^([a-zA-Z]|[0-9])(\w|\-)+@[a-zA-Z0-9]+\.([a-zA-Z]{2,4})$/.test(val)) {
      callback()
    } else {
      callback(new Error(message))
    }
  }
  // 国内电话号码和手机号
  //  *              0511 - 440 5222 || 021 - 8788 8822 -
  const validatePhone = (val: any, callback: Callback, message: string) => {
    if (/^((0\d{2,3}-?\d{7,8})|(1[3465789]\d{9}))$/.test(val)) {
      callback()
    } else {
      callback(new Error(message))
    }
  }
  // ========================数字类 ======================
  /**
   * @description 数字
   * @param {*} message 自定义提示信息。参数可不传递
   */
  const validateNumber = (value, callback, message) => {
    const reg = /^\d+(\.\d+)?$/
    if (value && !reg.test(value)) {
      callback(new Error(message || '请输入数字类型'))
    } else {
      callback()
    }
  }
  /**
   * @description 正整数 - 非零正整数
   * @param {*} message: string 自定义提示信息。参数可不传递
   */

  const validatePositiveInteger = (val: any, callback: Callback, message: string) => {
    const reg = /^[1-9]\d*$/
    if (!reg.test(val) && val) {
      callback(new Error(message || '请输入正整数，如：99'))
    } else {
      callback()
    }
  }

  /**
   * @description n位的正数(固定位数)
   * @param {*} message: string 自定义提示信息。参数可不传递
   * @param {*} count: number 位数
   */
  const validateNumberN = (value, callback, count, message) => {
    const reg = count ? new RegExp(`^\\d{${count}}$`) : new RegExp(`^\\d{10}$`)
    if (!reg.test(value)) {
      callback(new Error(message || (count ? `请输入${count}位的正数` : '请输入正整数')))
    } else {
      callback()
    }
  }

  /**
   * @description m-n位正数
   * @param {*} message: string 自定义提示信息。参数可不传递
   */
  const validateNumberMN = (value, callback, begin, end, message) => {
    if (begin && end) {
      const reg = new RegExp(`^\\d{${begin},${end}}$`)
      if (!reg.test(value) && value) {
        callback(
          new Error(
            message || (begin && end ? `请输入${begin} ~ ${end}位的正整数` : '请输入正整数')
          )
        )
      } else {
        callback()
      }
    }
  }

  /**
   * @description 整数m位,小数点后n位
   * @param {*} message: string 自定义提示信息。参数可不传递
   */
  const validateFloatMN = (value, callback, m, n, message) => {
    const reg = new RegExp(`^-?\\d{1,${m}}(\\.\\d{1,${n}})?$`)
    if (!reg.test(value) && value) {
      callback(new Error(message || `整数${m}位,小数点后${n}位`))
    } else {
      callback()
    }
  }
  /**
   * @description 整数m位,小数点后n位的正数
   * @param {*} message: string 自定义提示信息。参数可不传递
   */
  const validateFloatNumberMN = (value, callback, m, n, message) => {
    const reg = new RegExp(`^\\d{1,${m}}(\\.\\d{1,${n}})?$`)
    if (!reg.test(value) && value) {
      callback(new Error(message || `整数${m}位,小数点后${n}位`))
    } else {
      callback()
    }
  }

  /**
   * @description N位以内正整数 - 非零正整数
   * @param {*} message: string 自定义提示信息。参数可不传递
   */
  const validatePositiveIntegerN = (value, callback, n, message) => {
    const reg = new RegExp(`^[1-9]\\d{0,${n - 1}}$`)
    if (!reg.test(value) && value) {
      callback(new Error(message || `请输入${n}位以内正整数`))
    } else {
      callback()
    }
  }
  /**
   * @description n位以内非负整数，包括0
   * @param {*} message: string 自定义提示信息。参数可不传递
   */
  const validateNumberIntN = (value, callback, n, message) => {
    const reg = new RegExp(`^[+]?\\d{1,${n}}$`)
    if (!reg.test(value) && value) {
      callback(new Error(message || `请输入${n}位以内非负整数`))
    } else {
      callback()
    }
  }
  /**
   * @description n位以内整数，正整数、负整数，包括0
   * @param {*} message: string 自定义提示信息。参数可不传递
   */
  const validateIntNumberN = (value, callback, n, message) => {
    const reg = new RegExp(`^-?\\d{1,${n}}$`)
    if (!reg.test(value) && value) {
      callback(new Error(message || `请输入${n}位以内整数`))
    } else {
      callback()
    }
  }

  /**
   * @description 验证小数点后最多两位
   * @param {*} message: string 自定义提示信息。参数可不传递
   */
  const validateDecimalPoint2 = (value, callback, message) => {
    const reg = /^0\.\d\d$/
    if (!reg.test(value) && value) {
      callback(new Error(message || '请输入纯数字,小数点后最多2位,不能为负数'))
    } else {
      callback()
    }
  }
  /**
   * @description 验证小数点后最多N位
   * @param {*} message: string 自定义提示信息。参数可不传递
   */
  const validateDecimalPointN = (value, callback, n, message) => {
    // const reg = new RegExp(`^([^0][0-9]+|0)(\\.([0-9]{1,${n}}))?$`)
    const reg = new RegExp(`^-?\\d+(\\.\\d{1,${n}})?$`)
    if (!reg.test(value) && value) {
      callback(new Error(message || `小数点后${n}位`))
    } else {
      callback()
    }
  }
  /**
   * @description 验证时间格式 12:00
   * @param {*} message: string 自定义提示信息。参数可不传递
   */
  const validateTime = (value1, value2, callback, message) => {
    const reg = /^(20|21|22|23|[0-1]\d):[0-5]\d$/
    if (value1 && !value2 && !reg.test(value1)) {
      callback(new Error(message || '请输入正确时间格式hh:mm'))
    } else if (!value1 && value2 && !reg.test(value2)) {
      callback(new Error(message || '请输入正确时间格式hh:mm'))
    } else if (value1 && value2 && (!reg.test(value1) || !reg.test(value2))) {
      callback(new Error(message || '请输入正确时间格式hh:mm'))
    } else {
      callback()
    }
  }

  /**
   * @description 验证时间格式 12:00-14:00(120分钟)
   * @param {*} message: string 自定义提示信息。参数可不传递
   */
  const validateTimeLength = (value, callback, message) => {
    const reg =
      /^((20|21|22|23|[0-1]\d):[0-5]\d-(20|21|22|23|[0-1]\d):[0-5]\d)(\((\d+(\.\d+)?)分钟\))$/
    const reg1 =
      /^((20|21|22|23|[0-1]\d):[0-5]\d-(20|21|22|23|[0-1]\d):[0-5]\d)(\s+\((\d+(\.\d+)?)分钟\))$/
    let flag = false
    if (value && !reg.test(value) && !reg1.test(value)) {
      flag = false
      callback(new Error(message || '请输入正确时间格式,例：12:00-14:00 (120分钟)'))
    } else {
      flag = true
      callback()
    }
    return flag
  }

  return {
    required,
    lengthRange,
    notSpace,
    notAllSpace,
    notSpecialCharacters,
    isEqual,
    validatePassword,
    validateEnglishAndNumber,
    validateEmail,
    validatePhone,
    validateNormalBySearch,
    validateEngNumber,
    validatePositiveInteger,
    validateNumber,
    validateNumberN,
    validateNumberMN,
    validateFloatNumberMN,
    validateFloatMN,
    validatePositiveIntegerN,
    validateNumberIntN,
    validateIntNumberN,
    validateDecimalPoint2,
    validateDecimalPointN,
    validateTime,
    validateTimeLength,
    validateNumberOneToFour,
    validateEditor
  }
}
