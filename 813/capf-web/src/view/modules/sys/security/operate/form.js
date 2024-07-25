/**
 * 验证 safe - 安全设置 - 类对象
 * @param
 * @returns {}
 * @author yxm
 * @date 2022-04-07
 */
module.exports = () => {
  return {
    id: null, // 主键
    name: null, // 决策名称
    describe: null, // 描述
    status: '0' // 状态 0 启动 1不启动
  }
}
