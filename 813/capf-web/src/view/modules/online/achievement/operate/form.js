/**
 * 验证 examinepoint - 网上考核-成绩管理 - 类对象
 * @param
 * @returns {}
 * @author yxm
 * @date 2022-04-07
 */
module.exports = () => {
  return {
        id: null, // 主键id
        examineDate: null, // 考核日期
        examineName: null, // 考核名称
        examineType: null, // 考核类型 1结业考核初考 2结业考核补考 3季度考核 4抽考 
        paperName: null, // 试卷名称
        subjectName: null, // 课目名称
        questionNum: null, // 题目数量
        paperPoint: null, // 分值
        answerNum: null, // 答题人数
        standardRate: null, // 合格率
        createTime: null, // 创建时间
        assessmentId: null, // 考核管理的id 备用
        groupId: null // 单位id,非考试单位，同步使用
      }
}
