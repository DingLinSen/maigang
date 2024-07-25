/**
 * 验证 manuscriptlibrary - 稿库管理表 - 类对象
 * @param
 * @returns {}
 * @author yxm
 * @date 2022-04-07
 */
module.exports = () => {
  return {
        id: null, // $column.comments
        content: null, // 稿件内容
        length: null, // 长度
        codeLength: null, // 码长
        difficulty: null, // 难度 1 低 2 中 3 高
        createBy: null, // 发布人(创建人)
        createTime: null, // 创建时间
        updateBy: null, // 修改人
        updateTime: null, // 修改时间
        deptId: null, // 部门编号
        delFlag: null, // 删除标志  (0表示存在 2表示删除)
      }
}
