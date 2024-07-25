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
