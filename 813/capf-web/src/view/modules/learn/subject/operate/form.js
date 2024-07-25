/**
 * 验证 subjectlearn - 课目学习主表 - 类对象
 * @param
 * @returns {}
 * @author yxm
 * @date 2022-04-07
 */
module.exports = () => {
  return {
        id: null, // 主键id
        subjectId: null, // 课目id
        userId: null, // 用户id
        startDate: null, // 开始日期期限
        endDate: null, // 结束日期期限
        createTime: null, // 创建时间
        updateTime: null, // 修改时间
        createBy: null, // 创建人id
        updateBy: null, // 修改人id
        totalProgress: null // 课目学习总进度值
      }
}
