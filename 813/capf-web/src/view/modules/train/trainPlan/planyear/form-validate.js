/**
 * 验证 tspecialindustryvalue - 特色产业-质量品牌 - FORM 表单对象
 * @param _this
 * @returns {{}}
 */
module.exports = function(_this) {
  return {
    reason: [
      {
        required: true,
        message: '驳回原因不能为空！',
        transform: value => (value ? value.trim() : ''),
        trigger: 'blur'
      }
    ]
  }
}
