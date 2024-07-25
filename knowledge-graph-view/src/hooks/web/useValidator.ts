import { useI18n } from '@/hooks/web/useI18n'

const { t } = useI18n()

type Callback = (error?: string | Error | undefined) => void

interface LengthRange {
  min: number
  max: number
  message: string
}

export const useValidator = () => {
  // 必填
  const required = (message?: string) => {
    return {
      required: true,
      message: message || t('common.required')
    }
  }
  const requiredChoose = (message?: string) => {
    return {
      required: true,
      message: message || t('common.requiredChoose')
    }
  }
  // 不为空
  const notEmpty = (message?: string) => {
    return {
      trigger: 'blur'
    }
  }
  // 金额校验
  const amountNum = (val: any, callback: Callback, message: string) => {
    if (/^(([1-9]\d{1,5})|\d)(\.\d{1,2}){0,1}$/.test(val)) {
      callback()
    } else {
      callback(new Error(message))
    }
  }
  // 校验字体开头空格
  const validateSpaceFirst = (val: any, callback: Callback, message: string) => {
    if (/^\S+/.test(val)) {
      callback()
    } else {
      callback(new Error(message))
    }
  }
  // 校验字体结尾空格
  const validateSpaceLast = (val: any, callback: Callback, message: string) => {
    if (/\S+$/.test(val)) {
      callback()
    } else {
      callback(new Error(message))
    }
  }
  // 校验字体内容空格
  const validateSpace = (val: any, callback: Callback, message: string) => {
    if (/^\S*$/.test(val)) {
      callback()
    } else {
      callback(new Error(message))
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

  // 非纯数字
  const validateNotNum = (val: any, callback: Callback, message: string) => {
    if (isNaN(val)) {
      callback()
    } else {
      callback(new Error(message))
    }
  }

  // 不支持纯数字
  const validateNoNum = (val: any, callback: Callback, message: string) => {
    if (/^[0-9]*$/.test(val)) {
      callback(new Error(message))
    } else {
      callback()
    }
  }

  // 仅支持数字
  const validateNumSearch = (val: any, callback: Callback, message: string) => {
    if ((/^[z0-9]+$/gi.test(val) && val > 0) || !val) {
      callback()
    } else {
      callback(new Error(message))
    }
  }

  // 仅支持数字(包括零)
  const validateNumZero = (val: any, callback: Callback, message: string) => {
    if (/^[z0-9]+$/gi.test(val) || !val) {
      callback()
    } else {
      callback(new Error(message))
    }
  }

  // 仅支持正整数
  const validateIntegerSearch = (val: any, callback: Callback, message: string) => {
    if ((/^[1-9]\d*$/.test(val) && val > 0) || !val) {
      callback()
    } else {
      callback(new Error(message))
    }
  }

  // 仅支持整数和小数
  const validateNumToFixedSearch = (val: any, callback: Callback, message: string) => {
    if ((/^[0-9]+([.]{1}[0-9]+){0,1}$/gi.test(val) && val > 0) || !val) {
      callback()
    } else {
      callback(new Error(message))
    }
  }

  // 根据仅支持汉字
  const validateTextSearch = (val: any, callback: Callback, message: string) => {
    if (/^[\u4e00-\u9fa5]+$/gi.test(val)) {
      callback()
    } else {
      callback(new Error(message))
    }
  }

  const lengthRange = (val: any, callback: Callback, options: LengthRange) => {
    const { min, max, message } = options
    if (val.length < min || val.length > max) {
      callback(new Error(message))
    } else {
      callback()
    }
  }

  const notSpace = (val: any, callback: Callback, message: string) => {
    // 用户名不能有空格
    if (val && val.length > 0 && val.indexOf(' ') !== -1 && String(val).trim() === '') {
      callback(new Error(message))
    } else {
      callback()
    }
  }

  const notSpecialCharacters = (val: any, callback: Callback, message: string) => {
    // 密码不能是特殊字符
    if (/[`~!@#$%^&*()_+<>?:"{},.\/;'[\]]/gi.test(val)) {
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
  const validateUserName = (val: any, callback: Callback, message: string) => {
    if (/^[a-zA-Z0-9_-]{3,16}$/.test(val)) {
      callback()
    } else {
      callback(new Error(message))
    }
  }
  // 密码必须由数字、字母、特殊字符组合,请输入6-16位
  const validatePassword = (val: any, callback: Callback, message: string) => {
    if (/(?=.*\d)(?=.*[a-zA-Z])(?=.*[^a-zA-Z0-9]).{6,16}/.test(val)) {
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
  // 国内手机号
  //  *              0511 - 440 5222 || 021 - 8788 8822 -
  const validateIPhone = (val: any, callback: Callback, message: string) => {
    if (/^((1[3465789]\d{9}))$/.test(val)) {
      callback()
    } else {
      callback(new Error(message))
    }
  }
  // 身份证号
  const validateIDcard = (val: any, callback: Callback, message: string) => {
    if (/(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/.test(val)) {
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
  // 国内电话号码和手机号
  //  * 88888888   010-88888888   86-010-8888888
  const validatePhoneNumber = (val: any, callback: Callback, message: string) => {
    if (/^((0\d{2,3}-?\d{7,8})|(1[3465789]\d{9})|(\d{1,4}-)?(\d{1,4}-)?\d{7,8})$/.test(val)) {
      callback()
    } else {
      callback(new Error(message))
    }
  }

  return {
    required,
    requiredChoose,
    validatePhoneNumber,
    validateSpace,
    validateSpaceFirst,
    validateSpaceLast,
    lengthRange,
    notSpace,
    notSpecialCharacters,
    isEqual,
    validatePassword,
    validateUserName,
    validateEnglishAndNumber,
    validateEmail,
    validatePhone,
    validateIPhone,
    validateNormalBySearch,
    validateIDcard,
    validateNumSearch,
    validateTextSearch,
    validateNumToFixedSearch,
    validateNotNum,
    amountNum,
    validateIntegerSearch,
    validateNumZero,
    validateNoNum
  }
}
