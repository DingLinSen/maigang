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
    createBy: null,
    createTime: null,
    delFlag: null,
    deptId: null,
    judgeNumber: 0,
    multipleNumber: 0,
    packNumber: 0,
    paperName: null,
    paperNo: null,
    paperSubjectDOS: [],
    subjectId: [],
    paperTime: null,
    paperType: null,
    score: null,
    singleNumber: 0,
    sketchNumber: 0,
    sources: [],
    subjectNumber: 0,
    subjectType: null,
    updateBy: null,
    updateTime: null,
    questionSelectType: null,
    fillList: [],
    paperTitleDOS: []
  }
}
