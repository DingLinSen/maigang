/**
 * 验证 答案选项 - FORM 表单对象
 * @param _this
 * @returns {{}}
 */
module.exports = function(_this) {
  return {
    content: [
      {
        required: true,
        message: '\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0请输入选项内容',
        transform: value => (value ? value.trim() : ''),
        trigger: 'blur'
      }
    ]
  }
}
