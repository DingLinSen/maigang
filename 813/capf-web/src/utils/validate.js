/**
 * @description 正则表达式校验
 * @author PP
 */
/**
 * @description 邮箱
 * @param {*} string
 */
export function isEmail(string) {
  return /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+((.[a-zA-Z0-9_-]{2,3}){1,2})$/.test(
    string
  )
}

/**
 * @description 手机号码
 * @param {*} string
 */
export function isMobile(string) {
  return /^1[0-9]{10}$/.test(string)
}

/**
 * @description 电话号码
 * @param {*} string
 */
export function isPhone(string) {
  return /^([0-9]{3,4}-)?[0-9]{7,8}$/.test(string)
}

/**
 * @description URL地址
 * @param {*} string
 */
export function isURL(string) {
  return /^http[s]?:\/\/.*/.test(string)
}

/** ------------------------- 常规 ------------------------- */
/**
 * @description 邮箱
 * @param {*} message 自定义提示信息。参数可不传递
 */
export function antEmail(rule, value, callback, message) {
  const reg = /^([a-zA-Z]|[0-9])(\w|\-)+@[a-zA-Z0-9]+\.([a-zA-Z]{2,4})$/
  const errors = []
  if (!reg.test(value)) {
    errors.push(new Error(message || '邮箱格式: x@mgdaas.com\n\r'))
  }
  callback(errors)
}

/**
 * @description 长度控制(自行调整)
 * @param {*} message 自定义提示信息。参数可不传递
 * @param {*} begin 最少长度
 * @param {*} end 最多长度
 */
export function antLengthControl(
  rule,
  value,
  callback,
  begin = 1,
  end = 10,
  message
) {
  const reg = new RegExp(`^.{${begin},${end}}$`)
  const errors = []
  if (!reg.test(value)) {
    errors.push(new Error(message || `字符范围${begin}-${end}个\n\r`))
  }
  callback(errors)
}

/**
 * @description 日期格式 yyyy-mm-dd
 *              hh:mm 格式 09:00 -> /^(?:(?:[0-2][0-3])|(?:[0-1][0-9])):[0-5][0-9]$/
 *              yyyy-mm-dd HH:mm:ss 格式-> /^(?:19|20)[0-9][0-9]-(?:(?:0[1-9])|(?:1[0-2]))-(?:(?:[0-2][1-9])|(?:[1-3][0-1])) (?:(?:[0-2][0-3])|(?:[0-1][0-9])):[0-5][0-9]:[0-5][0-9]$/
 * @param {*} message 自定义提示信息。参数可不传递
 * @param {*} type: 'Date' | 'Time' | 'DateTime' 对应不同正则表达式验证 日期 | 时间 | 日期时间 等
 */
export function antDateStyle(rule, value, callback, type = 'Date', message) {
  let reg = null
  let defaultMsg = null
  switch (type) {
    case 'Date':
      reg = /^\d{4}-\d{1,2}-\d{1,2}$/
      defaultMsg = '日期格式: 2020-01-01'
      break
    case 'Time':
      reg = /^(?:(?:[0-2][0-3])|(?:[0-1][0-9])):[0-5][0-9]$/
      defaultMsg = '时间格式: 09:00'
      break
    case 'DateTime':
      reg = /^(?:19|20)[0-9][0-9]-(?:(?:0[1-9])|(?:1[0-2]))-(?:(?:[0-2][1-9])|(?:[1-3][0-1])) (?:(?:[0-2][0-3])|(?:[0-1][0-9])):[0-5][0-9]:[0-5][0-9]$/
      defaultMsg = '日期时间格式: 2020-01-01 09:00:00'
      break
    default:
      reg = /^\d{4}-\d{1,2}-\d{1,2}$/
      defaultMsg = '日期格式: 2020-01-01'
      break
  }
  const errors = []
  if (!reg.test(value)) {
    errors.push(new Error(message || defaultMsg))
  }
  callback(errors)
}

/** ------------------------- 号码 ------------------------- */
/**
 * @description 国内电话号码
 *              0511 - 440 5222 || 021 - 8788 8822
 * @param {*} message 自定义提示信息。参数可不传递
 */
export function antChinaTelPhone(rule, value, callback, message) {
  const reg = /^(\d{3}-\d{8}|\d{4}-\d{7})$/
  const errors = []
  if (!reg.test(value)) {
    errors.push(new Error(message || '固定电话号码，如：0531-8867685'))
  }
  callback(errors)
}

/**
 * @description 通用电话号码, 不强制开头和结尾。开头3-4位之间，结尾7-8位之间都为合理，放开了范围。
 *              格式如下：XXXX-XXXXXXX，XXXX-XXXXXXXX，XXX-XXXXXXX，XXX-XXXXXXXX，XXXXXXX，XXXXXXXX
 * @param {*} message 自定义提示信息。参数可不传递
 */
export function antTelPhone(rule, value, callback, message) {
  const reg = /^0\d{2,3}-?\d{7,8}$/
  const errors = []
  if (!reg.test(value)) {
    errors.push(new Error(message || '固定电话号码，如：0531-8867685'))
  }
  callback(errors)
}

/**
 * @description 通用通讯号码, 包含通用固话、手机号。粗略限定。
 * @param {*} message 自定义提示信息。参数可不传递
 */
export function antTelNumber(rule, value, callback, message) {
  const telReg = /^0\d{2,3}-?\d{7,8}$/
  const phoneReg = /^1[3|4|5|6|7|8|9]\d{9}$/
  const errors = []

  if (!telReg.test(value) && !phoneReg.test(value)) {
    errors.push(new Error(message || '请输入正确联系方式'))
  }

  callback(errors)
}

/**
 * @description 手机号码
 * @param {*} message 自定义提示信息。参数可不传递
 */
export function antPhoneNumber(rule, value, callback, message) {
  const reg = /^1[3|4|5|6|7|8|9]\d{9}$/
  const errors = []
  if (!reg.test(value)) {
    errors.push(new Error(message || '十一位手机号码:133xxx xxxxx 9'))
  }
  callback(errors)
}

/** ------------------------- 数字 ------------------------- */
/**
 * @description 数字
 *              /^(([1-9])|([1-9]\d)|100)$/ 验证输入1-100
 *              /^(([1-9])|(1\d)|(2[0-4]))$/ 验证输入1-24
 * @param {*} message 自定义提示信息。参数可不传递
 */
export function antNumber(rule, value, callback, message) {
  const reg = /^\d+(\.\d+)?$/
  const errors = []
  if (!reg.test(value)) {
    errors.push(new Error(message || '请输入数字类型'))
  }
  callback(errors)
}

/**
 * @description n位的正数
 * @param {*} message 自定义提示信息。参数可不传递
 * @param {*} count 位数
 */
export function antNumberN(rule, value, callback, count = 3, message) {
  const errors = []
  if (!new RegExp('^\\d{3}$').test(value)) {
    errors.push(new Error(message || `请输入${count}位的正数`))
  }
  callback(errors)
}

/**
 * @description n位以上正数
 * @param {*} message 自定义提示信息。参数可不传递
 */
export function antNumberNStart(rule, value, callback, message) {
  const reg = /^\d{n,}$/
  const errors = []
  if (!reg.test(value)) {
    errors.push(new Error(message || '请输入正整数，如：99'))
  }
  callback(errors)
}

/**
 * @description m-n位正数
 * @param {*} message 自定义提示信息。参数可不传递
 */
export function antNumberMN(rule, value, callback, message) {
  const reg = /^\d{m,n}$/
  const errors = []
  if (!reg.test(value)) {
    errors.push(new Error(message || '请输入正整数，如：99'))
  }
  callback(errors)
}

/** ------------------------- 小数 ------------------------- */
/**
 * @description 小数
 * @param {*} message 自定义提示信息。参数可不传递
 */
export function antDecimal(rule, value, callback, message) {
  const reg = /^(([^0][0-9]+|0)\.([0-9]))$/
  const errors = []
  if (!reg.test(value)) {
    errors.push(new Error(message || '请输入小数，如：0.99'))
  }
  callback(errors)
}

/**
 * @description m-n位小数
 *              {0,3} 小数点前4位整数 {1,2} 小数点后1-2位 {3} 小数点后3位
 * @param {*} message 自定义提示信息。参数可不传递
 */
export function antDecimalMN(rule, value, callback, message) {
  const reg = /^(([^0][0-9]\d{0,3}|0)\.([0-9]{1,2}))$/
  const errors = []
  if (!reg.test(value)) {
    errors.push(new Error(message || '请输入正整数，如：99'))
  }
  callback(errors)
}

/**
 * @description m~n位小数正实数
 * @param {*} message 自定义提示信息。参数可不传递
 */
export function antDecimalNegativeMN(rule, value, callback, message) {
  const reg = /^[0-9]+(.[0-9]{1,3})?$/
  const errors = []
  if (!reg.test(value)) {
    errors.push(new Error(message || '请输入正整数，如：99'))
  }
  callback(errors)
}

/** ------------------------- 浮点数 ------------------------- */
/**
 * @description 浮点数
 * @param {*} message 自定义提示信息。参数可不传递
 */
export function antFloat(rule, value, callback, message) {
  const reg = /^(-?\d+)(\.\d+)?/
  const errors = []
  if (!reg.test(value)) {
    errors.push(new Error(message || '请输入正整数，如：99'))
  }
  callback(errors)
}

/**
 * @description 正浮点数
 * @param {*} message 自定义提示信息。参数可不传递
 */
export function antPositiveFloat(rule, value, callback, message) {
  const reg = /^(([0-9]+\.[0-9]*[1-9][0-9]*)|([0-9]*[1-9][0-9]*\.[0-9]+)|([0-9]*[1-9][0-9]*))$/
  const errors = []
  if (!reg.test(value)) {
    errors.push(new Error(message || '请输入正整数，如：99'))
  }
  callback(errors)
}

/**
 * @description 负浮点数
 * @param {*} message 自定义提示信息。参数可不传递
 */
export function antNegativeFloat(rule, value, callback, message) {
  const reg = /^(-(([0-9]+\.[0-9]*[1-9][0-9]*)|([0-9]*[1-9][0-9]*\.[0-9]+)|([0-9]*[1-9][0-9]*)))$/
  const errors = []
  if (!reg.test(value)) {
    errors.push(new Error(message || '请输入正整数，如：99'))
  }
  callback(errors)
}

/**
 * @description 正浮点数 - 非负浮点数(正浮+0)
 * @param {*} message 自定义提示信息。参数可不传递
 */
export function antPositiveZeroFloat(rule, value, callback, message) {
  const reg = /^\d+(\.\d+)?$/
  const errors = []
  if (!reg.test(value)) {
    errors.push(new Error(message || '请输入0或正整数，如：99'))
  }
  callback(errors)
}

/**
 * @description 负浮点数 - 非正浮点数(负浮+0)
 * @param {*} message 自定义提示信息。参数可不传递
 */
export function antNegativeZeroFloat(rule, value, callback, message) {
  const reg = /^((-\d+(\.\d+)?)|(0+(\.0+)?))$/
  const errors = []
  if (!reg.test(value)) {
    errors.push(new Error(message || '请输入正整数，如：99'))
  }
  callback(errors)
}

/** ------------------------- 整数 ------------------------- */

/**
 * @description 整数
 * @param {*} message 自定义提示信息。参数可不传递
 */
export function antInteger(rule, value, callback, message) {
  const reg = /^[1-9][0-9]*$/
  const errors = []
  if (!reg.test(value)) {
    errors.push(new Error(message || '请输入正整数，如：99'))
  }
  callback(errors)
}

/**
 * @description 正整数 - 非零正整数
 * @param {*} message 自定义提示信息。参数可不传递
 */
export function antPositiveInteger(rule, value, callback, message) {
  const reg = /^[1-9]\d*$/
  const errors = []
  if (!reg.test(value)) {
    errors.push(new Error(message || '请输入正整数，如：99'))
  }
  callback(errors)
}

/**
 * @description 负整数 - 非零负整数
 * @param {*} message 自定义提示信息。参数可不传递
 */
export function antNegativeInteger(rule, value, callback, message) {
  const reg = /^-[1-9]\d*$/
  const errors = []
  if (!reg.test(value)) {
    errors.push(new Error(message || '请输入正整数，如：99'))
  }
  callback(errors)
}

/**
 * @description 正整数 - 非负整数(正整+0)
 * @param {*} message 自定义提示信息。参数可不传递
 */
export function antPositiveZeroInteger(rule, value, callback, message) {
  const reg = /^\d+$/
  const errors = []
  if (!reg.test(value)) {
    errors.push(new Error(message || '请输入正整数，如：99'))
  }
  callback(errors)
}

/**
 * @description 负整数 - 非正整数(负整+0)
 * @param {*} message 自定义提示信息。参数可不传递
 */
export function antNegativeZeroInteger(rule, value, callback, message) {
  const reg = /^-[1-9]\d*|0$/
  const errors = []
  if (!reg.test(value)) {
    errors.push(new Error(message || '请输入正整数，如：99'))
  }
  callback(errors)
}

/** ------------------------- 字符串 ------------------------- */
/**
 * @description 汉字
 * @param {*} message 自定义提示信息。参数可不传递
 */
export function antChinese(rule, value, callback, message) {
  const reg = /^[\u4e00-\u9fa5],{0,}$/
  const errors = []
  if (!reg.test(value)) {
    errors.push(new Error(message || '请输入邮箱格式,如：xxx@mgdaas.com'))
  }
  callback(errors)
}

/**
 * @description 英文
 * @param {*} message 自定义提示信息。参数可不传递
 */
export function antEnglish(rule, value, callback, message) {
  const reg = /^[A-Za-z]+$/
  const errors = []
  if (!reg.test(value)) {
    errors.push(new Error(message || '请输入邮箱格式,如：xxx@mgdaas.com'))
  }
  callback(errors)
}

/**
 * @description 字符包含验证 是否含有 ^%&',;=?$\"
 * @param {*} message 自定义提示信息。参数可不传递
 */
export function antIncludeSign(rule, value, callback, message) {
  const reg = /[^%&',;=?$\x22]/
  const errors = []
  if (!reg.test(value)) {
    errors.push(
      new Error(
        message || '请输入正确的Http或Https开头的网址，如：https://baidu.com'
      )
    )
  }
  callback(errors)
}

/**
 * @description 禁止含有xxx字符 ~ 不可输入
 * @param {*} message 自定义提示信息。参数可不传递
 */
export function antExcludeSomeSign(rule, value, callback, message) {
  const reg = /[^~\x22]$/
  const errors = []
  if (!reg.test(value)) {
    errors.push(
      new Error(
        message || '请输入正确的Http或Https开头的网址，如：https://baidu.com'
      )
    )
  }
  callback(errors)
}

/**
 * @description 可输入xxx字符 只能输入空格
 * @param {*} message 自定义提示信息。参数可不传递
 */
export function antJustInputSomeSign(rule, value, callback, message) {
  const reg = /^[\s]$/
  const errors = []
  if (!reg.test(value)) {
    errors.push(
      new Error(
        message || '请输入正确的Http或Https开头的网址，如：https://baidu.com'
      )
    )
  }
  callback(errors)
}

/**
 * @description 英文和数字组成
 * @param {*} message 自定义提示信息。参数可不传递
 */
export function antJustNumberEN(rule, value, callback, message) {
  const reg = /^[A-Za-z0-9]+$/
  const errors = []
  if (!reg.test(value)) {
    errors.push(
      new Error(
        message || '请输入正确的Http或Https开头的网址，如：https://baidu.com'
      )
    )
  }
  callback(errors)
}

/**
 * @description 大写英文组成
 * @param {*} message 自定义提示信息。参数可不传递
 */
export function antJustBigEN(rule, value, callback, message) {
  const reg = /^[A-Z]+$/
  const errors = []
  if (!reg.test(value)) {
    errors.push(
      new Error(
        message || '请输入正确的Http或Https开头的网址，如：https://baidu.com'
      )
    )
  }
  callback(errors)
}

/**
 * @description 小写英文组成
 * @param {*} message 自定义提示信息。参数可不传递
 */
export function antJustSmallEN(rule, value, callback, message) {
  const reg = /^[a-z]+$/
  const errors = []
  if (!reg.test(value)) {
    errors.push(
      new Error(
        message || '请输入正确的Http或Https开头的网址，如：https://baidu.com'
      )
    )
  }
  callback(errors)
}

/**
 * @description 数字、英文或者下划线组成
 * @param {*} message 自定义提示信息。参数可不传递
 */
export function antJustNumberEnSomeSign(rule, value, callback, message) {
  const reg = /^\w+$/
  const errors = []
  if (!reg.test(value)) {
    errors.push(
      new Error(
        message || '请输入正确的Http或Https开头的网址，如：https://baidu.com'
      )
    )
  }
  callback(errors)
}

/**
 * @description 中文、英文、数字但不包括某些符号
 *              ^[\u4E00-\u9FA5A-Za-z0-9]{2,20}$ {2,20}用于限定长度
 * @param {*} message 自定义提示信息。参数可不传递
 */
export function antAccountExcludeSign(rule, value, callback, message) {
  const reg = /^[\u4E00-\u9FA5A-Za-z0-9]+$/
  const errors = []
  if (!reg.test(value)) {
    errors.push(
      new Error(
        message || '请输入正确的Http或Https开头的网址，如：https://baidu.com'
      )
    )
  }
  callback(errors)
}

/**
 * @description 中文、英文、数字包括下划线
 * @param {*} message 自定义提示信息。参数可不传递
 */
export function antAccountIncludeSign(rule, value, callback, message) {
  const reg = /^[\u4E00-\u9FA5A-Za-z0-9_]+$/
  const errors = []
  if (!reg.test(value)) {
    errors.push(
      new Error(
        message || '请输入正确的Http或Https开头的网址，如：https://baidu.com'
      )
    )
  }
  callback(errors)
}

/** ------------------------- 账号/密码 ------------------------- */
/**
 * @description 通用用户密码/账户
 *              英文字母、数字、下划线组成的6位-20的字串
 * @param {*} message 自定义提示信息。参数可不传递
 */
export function antNormalAccount(rule, value, callback, message) {
  const reg = /^[A-Za-z0-9]\w{6,20}$/
  const errors = []
  if (!reg.test(value)) {
    errors.push(
      new Error(
        message || '请输入正确的Http或Https开头的网址，如：https://baidu.com'
      )
    )
  }
  callback(errors)
}

/**
 * @description 高级密码/账户，主要用于密码
 *              必须包含大小写字母和数字的组合，不能使用特殊字符，长度在8-16之间
 * @param {*} message 自定义提示信息。参数可不传递
 */
export function antHigherAccount(rule, value, callback, message) {
  const reg = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,16}$/
  const errors = []
  if (!reg.test(value)) {
    errors.push(
      new Error(
        message || '请输入正确的Http或Https开头的网址，如：https://baidu.com'
      )
    )
  }
  callback(errors)
}

/** ------------------------- 其他 ------------------------- */
/**
 * @description 通用身份证
 * @param {*} message 自定义提示信息。参数可不传递
 */
export function antNormalIDCard(rule, value, callback, message) {
  const reg = /^(\\d{14}|\\d{17})(\\d|[xX])$/
  const errors = []
  if (!reg.test(value)) {
    errors.push(
      new Error(
        message || '请输入正确的Http或Https开头的网址，如：https://baidu.com'
      )
    )
  }
  callback(errors)
}

/**
 * @description 短身份证号码(数字、字母x结尾)
 * @param {*} message 自定义提示信息。参数可不传递
 */
export function antShortIDCard(rule, value, callback, message) {
  const reg = /^[1-9][0-9]*$/
  const errors = []
  if (!reg.test(value)) {
    errors.push(
      new Error(
        message || '请输入正确的Http或Https开头的网址，如：https://baidu.com'
      )
    )
  }
  callback(errors)
}

/**
 * @description IP地址
 * @param {*} message 自定义提示信息。参数可不传递
 */
export function antIPAddress(rule, value, callback, message) {
  const reg = /^\d+\.\d+\.\d+\.\d+$/
  const errors = []
  if (!reg.test(value)) {
    errors.push(
      new Error(
        message || '请输入正确的Http或Https开头的网址，如：https://baidu.com'
      )
    )
  }
  callback(errors)
}

/**
 * @description 域名
 * @param {*} message 自定义提示信息。参数可不传递
 */
export function antRealmName(rule, value, callback, message) {
  const reg = /^(?=^.{3,255}$)[a-zA-Z0-9][-a-zA-Z0-9]{0,62}(\.[a-zA-Z0-9][-a-zA-Z0-9]{0,62})+$/
  const errors = []
  if (!reg.test(value)) {
    errors.push(
      new Error(
        message || '请输入正确的Http或Https开头的网址，如：https://baidu.com'
      )
    )
  }
  callback(errors)
}

/**
 * @description URL路径 - 网络地址
 *               匹配网址 -> ^(?=^.{3,255}$)(http(s)?:\/\/)?(www\.)?[a-zA-Z0-9][-a-zA-Z0-9]{0,62}(\.[a-zA-Z0-9][-a-zA-Z0-9]{0,62})+(:\d+)*(\/\w+\.\w+)*$
 *               匹配URL -> ^(?=^.{3,255}$)(http(s)?:\/\/)?(www\.)?[a-zA-Z0-9][-a-zA-Z0-9]{0,62}(\.[a-zA-Z0-9][-a-zA-Z0-9]{0,62})+(:\d+)*(\/\w+\.\w+)*([\?&]\w+=\w*)*$
 * @param {*} message 自定义提示信息。参数可不传递
 */
export function antIntelURL(rule, value, callback, message) {
  const reg =
    '^((https|http|ftp|rtsp|mms)?://)' +
    '?(([0-9a-z_!~*\'().&=+$%-]+: )?[0-9a-z_!~*\'().&=+$%-]+@)?' + // ftp的user@
    '(([0-9]{1,3}.){3}[0-9]{1,3}' + // IP形式的URL- 199.194.52.184
    '|' + // 允许IP和DOMAIN（域名）
    '([0-9a-z_!~*\'()-]+.)*' + // 域名- www.
    '([0-9a-z][0-9a-z-]{0,61})?[0-9a-z].' + // 二级域名
    '[a-z]{1,6})' + // first level domain- .com or .museum
    '(:[0-9]{1,4})?' + // 端口- :80
    '((/?)|' + // a slash isn't required if there is no file name
    '(/[0-9a-zA-Z_!~*\'().;?:@&=+$,%#-]+)+/?)$'

  const errors = []
  if (!new RegExp(reg).test(value)) {
    errors.push(
      new Error(
        message || '请输入正确的Http或Https开头的网址，如：https://baidu.com'
      )
    )
  }
  callback(errors)
}

/**
 * @description 车牌号
 *              包含新能源的详细验证 -> ^([京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领A-Z]{1}[a-zA-Z](([DF]((?![IO])[a-zA-Z0-9](?![IO]))[0-9]{4})|([0-9]{5}[DF]))|[京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领A-Z]{1}[A-Z]{1}[A-Z0-9]{4}[A-Z0-9挂学警港澳]{1})$
 *
 *              分步权重验证
 *              var xreg= /^[京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领A-Z]{1}[A-Z]{1}(([0-9]{5}[DF]$)|([DF][A-HJ-NP-Z0-9][0-9]{4}$))/;
 *              var creg= /^[京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领A-Z]{1}[A-Z]{1}[A-HJ-NP-Z0-9]{4}[A-HJ-NP-Z0-9挂学警港澳]{1}$/;
 * @param {*} message 自定义提示信息。参数可不传递
 */
export function antCarCode(rule, value, callback, message) {
  const reg = /^[\u4e00-\u9fa5]{1}[a-zA-Z]{1}[a-zA-Z_0-9]{4}[a-zA-Z_0-9_\u4e00-\u9fa5]$/
  const errors = []
  if (!reg.test(value)) {
    errors.push(new Error(message || '请输入邮箱格式,如：xxx@mgdaas.com'))
  }
  callback(errors)
}

/**
 * @description 邮政编码
 * @param {*} message 自定义提示信息。参数可不传递
 */
export function antZipCode(rule, value, callback, message) {
  const reg = /^[1-9]\d{5}(?!\d)$/
  const errors = []
  if (!reg.test(value)) {
    errors.push(new Error(message || '请输入邮箱格式,如：xxx@mgdaas.com'))
  }
  callback(errors)
}

/**
 * @description 工商税号
 * @param {*} message 自定义提示信息。参数可不传递
 */
export function antIndustryCode(rule, value, callback, message) {
  const reg = /^[0-9]\\\\d{13}([0-9]|X)$/
  const errors = []
  if (!reg.test(value)) {
    errors.push(new Error(message || '请输入邮箱格式,如：xxx@mgdaas.com'))
  }
  callback(errors)
}

/**
 * @description 根据仅支持汉字中字母字符数字
 * @param {*} message 自定义提示信息。参数可不传递
 */
export function supportNormal(rule, value, callback, message) {
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
export function supportChinese(rule, value, callback, message) {
  const reg = /^[\u4E00-\u9FFF]+$/gi
  const errors = []
  if (!reg.test(value) && value) {
    errors.push(new Error(message || '请输入汉字'))
  }
  callback(errors)
}

/**
 * @description 根据仅支持字母
 * @param {*} message 自定义提示信息。参数可不传递
 */
export function supportEnglish(rule, value, callback, message) {
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
export function supportChineseAndEnglish(rule, value, callback, message) {
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
export function supportEnglishAndNumber(rule, value, callback, message) {
  const reg = /^[A-Za-z0-9]+$/gi
  const errors = []
  if (!reg.test(value) && (value || value === 0)) {
    errors.push(new Error(message || '请输入字母或数字'))
  }
  callback(errors)
}

// 专门为2020-08-03修改查询条件和表单数据一致色值
/**
 * @description 根据仅支持汉字字母数字
 * @param {*} message 自定义提示信息。参数可不传递
 */
export function supportNormalBySearch(rule, value, callback, message) {
  const reg = /^[A-Za-z0-9\u4e00-\u9fa5]+$/gi
  const errors = []
  if (!reg.test(value)) {
    errors.push(new Error(message || '请不要输入特殊字符'))
  }
  callback(errors)
}

/**
 * @description 验证小数点后最多一位
 * @param {*} message: string 自定义提示信息。参数可不传递
 */
export function validateDecimalSubPoint(rule, value, callback, message) {
  const reg = /^(([0-9]+)|([0-9]+\.[0-9]{1,1}))$/
  const errors = []
  if (!reg.test(value) && value) {
    errors.push(new Error(message || '请输入纯数字,小数点后最多1位,不能为负数'))
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
    errors.push(new Error(message || '请输入纯数字，如：99，99.9'))
  }
  callback(errors)
}

/**
 * @description 正浮点数
 * @param {*} message: string 自定义提示信息。参数可不传递
 */
export function validatePositiveFloatSub(rule, value, callback, message) {
  const reg = /(^(\d|[1-9]\d)(\.\d{1,1})?$)|(^100$)/
  const errors = []
  if (!reg.test(value) && value) {
    errors.push(new Error(message || '请输入0到100的纯数字，小数点后最多1位，如：99，99.9'))
  }
  callback(errors)
}

/**
 * @description 正浮点数
 * @param {*} message: string 自定义提示信息。参数可不传递
 */
 export function antPositiveInteger0To100(rule, value, callback, message) {
  const reg = /^(?:[1-9]?\d|100)$/
  const errors = []
  if (!reg.test(value) && value) {
    errors.push(new Error(message || '请输入0到100的正整数，如：99'))
  }
  callback(errors)
}

/**
 * @description 正浮点数
 * @param {*} message: string 自定义提示信息。参数可不传递
 */
 export function antPositiveInteger1To100(rule, value, callback, message) {
  const reg = /^([1-9][0-9]{0,1}|100)$/
  const errors = []
  if (!reg.test(value) && value) {
    errors.push(new Error(message || '请输入1到100的正整数，如：99'))
  }
  callback(errors)
}

