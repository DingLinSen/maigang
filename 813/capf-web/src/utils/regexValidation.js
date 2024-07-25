/** ----------------------------------------- 常规字符输入 --------------------------------------- */
// 专门为2020-08-03修改查询条件和表单数据一致色值
/**
 * @description 根据仅支持汉字字母数字
 * @param {*} message 自定义提示信息。参数可不传递
 */
export function validateNormalBySearch(rule, value, callback, message) {
  const reg = /^[A-Za-z0-9\u4e00-\u9fa5]+$/gi
  const errors = []
  if (!reg.test(value)) {
    errors.push(new Error(message || '请不要输入特殊字符'))
  }
  callback(errors)
}
/**
 * @description 根据仅支持汉字中字母字符数字
 * @param {*} message 自定义提示信息。参数可不传递
 */
export function validateNormal(rule, value, callback, message) {
  const reg = /^[A-Za-z0-9\u4e00-\u9fa5]+$/gi
  const errors = []
  if (!reg.test(value)) {
    errors.push(new Error(message || '请输入汉字或字母或数字'))
  }
  callback(errors)
}
/**
 * @description 根据仅支持汉字
 * @param {*} message 自定义提示信息。参数可不传递
 */
export function validateChinese(rule, value, callback, message) {
  const reg = /^[\u4E00-\u9FFF]+$/gi
  const errors = []
  if (value && !reg.test(value)) {
    errors.push(new Error(message || '请输入汉字'))
  }
  callback(errors)
}

/**
 * @description 根据仅支持字母
 * @param {*} message 自定义提示信息。参数可不传递
 */
export function validateEnglish(rule, value, callback, message) {
  const reg = /^[a-zA-Z]+$/gi
  const errors = []
  if (!reg.test(value) && value) {
    errors.push(new Error(message || '请输入字母'))
  }
  callback(errors)
}

/**
 * @description 根据仅支持字母、汉字
 * @param {*} message 自定义提示信息。参数可不传递
 */
export function validateChineseAndEnglish(rule, value, callback, message) {
  const reg = /^[A-Za-z\u4e00-\u9fa5]+$/gi
  const errors = []
  if (!reg.test(value) && (value || value === 0)) {
    errors.push(new Error(message || '请输入汉字或字母'))
  }
  callback(errors)
}

/**
 * @description 根据仅支持字母、数字
 * @param {*} message 自定义提示信息。参数可不传递
 */
export function validateEnglishAndNumber(rule, value, callback, message) {
  const reg = /^[A-Za-z0-9]+$/gi
  const errors = []
  if (!reg.test(value) && (value || value === 0)) {
    errors.push(new Error(message || '请输入字母或数字'))
  }
  callback(errors)
}

/**
 * @description 检验非全部空格
 * @param {*} message 自定义提示信息。参数可不传递
 */
export function validateNoBlankSpace(rule, value, callback, message) {
  const errors = []
  if (value && value.length > 0 && String(value).trim() === '') {
    errors.push(new Error(message || '请不要只输入空格'))
  }
  callback(errors)
}

/**
 * @description m-n位正数
 * @param {*} message: string 自定义提示信息。参数可不传递
 */
export function validateEnglishAndNumberMN(rule, value, callback, begin, end, message) {
  if(begin && end) {
    const reg = new RegExp(`^[0-9A-Za-z]{${begin},${end}}$`)
    const errors = []
    if (!reg.test(value) && value) {
      errors.push(new Error(message || ((begin && end) ? `请输入${begin} ~ ${end}位字符` : '请输入正确的字符')))
    }
    callback(errors)
  }
}
/** ----------------------------------------- 数字 --------------------------------------- */
/**
 * @description 数字
 *              /^(([1-9])|([1-9]\d)|100)$/ 验证输入1-100
 *              /^(([1-9])|(1\d)|(2[0-4]))$/ 验证输入1-24
 * @param {*} message: string 自定义提示信息。参数可不传递
 */
export function validateNumber(rule, value, callback, message) {
  const reg = /^[A-Za-z0-9]+$/gi
  const errors = []
  if (!reg.test(value) && value) {
    errors.push(new Error(message || '请输入数字类型'))
  }
  callback(errors)
}

/**
 * @description 正整数 - 非零正整数
 * @param {*} message: string 自定义提示信息。参数可不传递
 */

export function validatePositiveInteger(rule, value, callback, message) {
  const reg = /^[1-9]\d*$/
  const errors = []
  if (!reg.test(value) && value) {
    errors.push(new Error(message || '请输入正整数，如：99'))
  }
  callback(errors)
}

/**
 * @description n位的正数(固定位数)
 * @param {*} message: string 自定义提示信息。参数可不传递
 * @param {*} count: number 位数
 */
export function validateNumberN(rule, value, callback, count, message) {
  const errors = []
  const reg = count ? new RegExp(`^\\d{${count}}$`) : ''
  if (!reg.test(value)) {
    errors.push(new Error(message || (count ? `请输入${count}位的正数` : '请输入正整数')))
  }
  callback(errors)
}

/**
 * @description n位以上正数
 * @param {*} message: string 自定义提示信息。参数可不传递
 */
export function validateNumberNStart(rule, value, callback, count, message) {
  const reg = count ? new RegExp(`^\\d{${count},}$`) : ''
  const errors = []
  if (!reg.test(value) && value) {
    errors.push(new Error(message || (count ? `请输入${count}位以上的正数` : '请输入正整数')))
  }
  callback(errors)
}

/**
 * @description m-n位正数
 * @param {*} message: string 自定义提示信息。参数可不传递
 */
export function validateNumberMN(rule, value, callback, begin, end, message) {
  if(begin && end) {
    const reg = new RegExp(`^\\d{${begin},${end}}$`)
    const errors = []
    if (!reg.test(value) && value) {
      errors.push(new Error(message || ((begin && end) ? `请输入${begin} ~ ${end}位的正整数` : '请输入正整数')))
    }
    callback(errors)
  }
}
/** ------------------------- 小数 ------------------------- */

/**
 * @description m-n位小数
 *              {0,3} 小数点前4位整数 {1,2} 小数点后1-2位 {3} 小数点后3位
 * @param {*} message: string 自定义提示信息。参数可不传递
 */
export function validateDecimalMN(rule, value, callback, message) {
  // const reg = /^(([0-9]\d{0,2}|0)+([.]{1}(([0-9]+){0,2}))?)$/
  //  ([^0][0-9]{0,2}|0)$/
  // ^(([1-9])|(1\d)|(2[0-4]))$/
  // ^(([1-9])|([1-9]\d)|100)$/
  const reg = /^(([^0][0-9]{0,2}|0)\.([0-9]{1,2})$)|^(([0-9])|([0-9]\d)|100)$/
  const errors = []
  if (!reg.test(value) && value) {
    errors.push(new Error(message || '请输入小数'))
  }
  callback(errors)
}

/**
 * @description 验证小数点后最多两位
 * @param {*} message: string 自定义提示信息。参数可不传递
 */
export function validateDecimalPoint(rule, value, callback, message) {
  const reg = /^(([1-9]+)|([0-9]+\.[0-9]{1,2}))$/
  const errors = []
  if (!reg.test(value) && value) {
    errors.push(new Error(message || '请输入纯数字,小数点后最多2位,不能为负数'))
  }
  callback(errors)
}

/**
 * @description 验证小数点后最多一位
 * @param {*} message: string 自定义提示信息。参数可不传递
 */
export function validateDecimalSubPoint(rule, value, callback, message) {
  const reg = /^(([1-9]+)|([0-9]+\.[0-9]{1,1}))$/
  const errors = []
  if (!reg.test(value) && value) {
    errors.push(new Error(message || '请输入纯数字,小数点后最多1位,不能为负数'))
  }
  callback(errors)
}

/**
 * @description m~n位小数正实数
 * @param {*} message: string 自定义提示信息。参数可不传递
 */
export function validatePositiveDecimalDotMN(rule, value, callback, begin, end, dotbegin, dotend, message
) {
  const reg = new RegExp(`^[0-9]{${begin},${end}}(\\.[0-9]{${dotbegin},${dotend}})?$`)
  const errors = []
  if (!reg.test(value) && value) {
    errors.push(new Error(message || '请输入正实数，如：99'))
  }
  callback(errors)
}

/**
 * @description m~n位小数实数
 * @param {*} message: string 自定义提示信息。参数可不传递
 */
export function validateDecimalDotMN(rule, value, callback, begin, end, dotbegin, dotend,
  message
) {
  const reg = new RegExp(`^-?[0-9]{${begin},${end}}(\\.[0-9]{${dotbegin},${dotend}})?$`)
  const errors = []
  if (!reg.test(value) && value) {
    errors.push(new Error(message || ((begin && end) || (begin === 0 || end === 0)) ? `请输入${begin} ~ ${end}范围内小数点后${dotbegin} ~ ${dotend}的数` : '请输入正整数'))
  }
  callback(errors)
}

/**
 * @description m~n位小数实数
 * @param {*} message: string 自定义提示信息。参数可不传递
 */
export function validateDecimalDotMNTwo(rule, value, callback, begin, end, dotend,
  message
) {
  const reg = new RegExp(`^-?[0-9]{${begin},${end}}(\\.[0-9]{0,${dotend}})?$`)
  const errors = []
  if (!reg.test(value) && value) {
    errors.push(new Error(message || ((begin && end) || (begin === 0 || end === 0)) ? `请输入${begin} ~ ${end}范围${dotend}为位小数的数` : '请输入小数'))
  }
  callback(errors)
}

// 以下还未验证

/** ------------------------- 浮点数 ------------------------- */
/**
 * @description 浮点数
 * @param {*} message: string 自定义提示信息。参数可不传递
 */
export function validateFloat(rule, value, callback, message) {
  const reg = /^((-?\d+)(\.\d+)?)$/
  const errors = []
  if (!reg.test(value) && value) {
    errors.push(new Error(message || '请输入正整数，如：99'))
  }
  callback(errors)
}

/**
 * @description 正浮点数
 * @param {*} message: string 自定义提示信息。参数可不传递
 */
export function validatePositiveFloat(rule, value, callback, message) {
  const reg = /^(([0-9]+\.[0-9]*[1-9][0-9]*)|([0-9]*[1-9][0-9]*\.[0-9]+)|([0-9]*[1-9][0-9]*))$/
  const errors = []
  if (!reg.test(value) && value) {
    errors.push(new Error(message || '请输入正整数，如：99'))
  }
  callback(errors)
}

/**
 * @description 负浮点数
 * @param {*} message: string 自定义提示信息。参数可不传递
 */
export function validateNegativeFloat(rule, value, callback, message) {
  const reg = /^(-(([0-9]+\.[0-9]*[1-9][0-9]*)|([0-9]*[1-9][0-9]*\.[0-9]+)|([0-9]*[1-9][0-9]*)))$/
  const errors = []
  if (!reg.test(value) && value) {
    errors.push(new Error(message || '请输入正整数，如：99'))
  }
  callback(errors)
}

/**
 * @description 正浮点数 - 非负浮点数(正浮+0)
 * @param {*} message: string 自定义提示信息。参数可不传递
 */
export function validatePositiveZeroFloat(rule, value, callback, message) {
  const reg = /^\d+(\.\d+)?$/
  const errors = []
  if (!reg.test(value) && value) {
    errors.push(new Error(message || '请输入正整数，如：99'))
  }
  callback(errors)
}

/**
 * @description 负浮点数 - 非正浮点数(负浮+0)
 * @param {*} message: string 自定义提示信息。参数可不传递
 */
export function validateNegativeZeroFloat(rule, value, callback, message) {
  const reg = /^((-\d+(\.\d+)?)|(0+(\.0+)?))$/
  const errors = []
  if (!reg.test(value) && value) {
    errors.push(new Error(message || '请输入正整数，如：99'))
  }
  callback(errors)
}
// -------------------------------------------------------号码类---------------------------------------
/**
 * @description 手机号 -
 * @param {*} message: string 自定义提示信息。参数可不传递
 */
export function validateMobilePhone(rule, value, callback, message) {
  const reg = 11 && /^((13|14|15|16|17|18|19)[0-9]{1}\d{8})$/
  const errors = []
  if (!reg.test(value) && value) {
    errors.push(new Error(message || '请输入正确的手机号'))
  }
  callback(errors)
}

/**
 * @description 国内电话号码
 *              0511 - 440 5222 || 021 - 8788 8822 -
 * @param {*} message: string 自定义提示信息。参数可不传递
 */
export function validateTelPhone(rule, value, callback, message) {
  const reg = /^[0][1-9]{2,3}-[0-9]{5,10}$/
  const errors = []
  if (!reg.test(value) && value) {
    errors.push(new Error(message || '请输入正确的电话号码'))
  }
  callback(errors)
}

/**
 * @description 国内电话号码和手机号
 *              0511 - 440 5222 || 021 - 8788 8822 -
 * @param {*} message: string 自定义提示信息。参数可不传递
 */
export function validatePhone(rule, value, callback, message) {
  const reg = /^((0\d{2,3}-?\d{7,8})|(1[3465789]\d{9}))$/
  const errors = []
  if (!reg.test(value) && value) {
    errors.push(new Error(message || '请输入正确的电话号码'))
  }
  callback(errors)
}
/**
 * @description 电子邮箱格式(以字母数字开头，中间可以是多个数字字母和-；然后是@符号，后面是字母数字；然后是.符号加2-4个字母结尾)
 * @param {*} message: string 自定义提示信息。参数可不传递
 */
export function validateEmail(rule, value, callback, message) {
  // eslint-disable-next-line no-useless-escape
  const reg = /^([a-zA-Z]|[0-9])(\w|\-)+@[a-zA-Z0-9]+\.([a-zA-Z]{2,4})$/
  const errors = []
  if (!reg.test(value) && value) {
    errors.push(new Error(message || '请输入正确的邮箱'))
  }
  callback(errors)
}
