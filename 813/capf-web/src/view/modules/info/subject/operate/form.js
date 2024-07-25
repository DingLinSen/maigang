/**
 * 验证 subjectmanagement - 课目管理表 - 类对象
 * @param
 * @returns {}
 * @author yxm
 * @date 2022-04-07
 */
module.exports = () => {
  return {
    id: null, // $column.comments
    name: null, // 课目名称
    type: null, // 课目类型 1理论知识  2 专业操作
    introduction: null, // 课目简介
    createBy: null, // 发布人(创建人)
    createTime: null, // 创建时间
    updateBy: null, // 修改人
    updateTime: null, // 修改时间
    deptId: null, // 部门编号
    delFlag: null, // 删除标志  (0表示存在 2表示删除)
    subjectChapterDOS: [],
    count: null
  }
}
