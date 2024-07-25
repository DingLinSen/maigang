/**
 * 验证 videomanagement - 视频管理表 - 类对象
 * @param
 * @returns {}
 * @author yxm
 * @date 2022-04-07
 */
module.exports = () => {
  return {
        id: null, // 主键
        title: null, // 资料标题
        type: null, // 课目类型 1 理论学习  2专业操作
        subjectId: null, // 课目名称
        introduction: null, // 资料简介
        createBy: null, // 发布人(创建人)
        createTime: null, // 创建时间
        updateBy: null, // 修改人
        updateTime: null, // 修改时间
        filePath: null, // 文件路径
        fileName: null, // 文件名
        deptId: null, // 部门编号
        delFlag: null, // 删除标志  (0表示存在 2表示删除)
        chapterId: null, // 章节id
        duration: null
      }
}
