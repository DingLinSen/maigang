/**
 * 验证 subjectchapter - 课目-章节表 - 类对象
 * @param
 * @returns {}
 * @author yxm
 * @date 2022-04-07
 */
module.exports = () => {
  return {
    id: null, // $column.comments
    subjectId: null, // 课目id
    chapter: null, // 章节
    chapterTitle: null, // 章节标题
    createBy: null, // 发布人(创建人)
    createTime: null, // 创建时间
    updateBy: null, // 修改人
    updateTime: null, // 修改时间
    sort: null // 排序
  }
}
