/**
 * 验证 titleoption - 题库题目选项表 - 类对象
 * @param
 * @returns {}
 * @author yxm
 * @date 2022-04-07
 */
module.exports = () => {
  return {
    id: null, // $column.comments
    titleId: null, // 题目id
    sort: null, // 排序
    sortFlag: null,
    content: null, // 内容
    isCorrect: null, // 是否正确 1 正确的 2 错误的
    seleted: false,
    createBy: null, // 创建人
    createTime: null, // 创建时间
    updateBy: null, // 修改人
    updateTime: null // 修改时间
  }
}
