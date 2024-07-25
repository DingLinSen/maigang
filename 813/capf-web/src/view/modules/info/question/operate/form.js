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
        title: null, // 题目
        answerType: null, // 题目类型 1 单选 2 多选 3 判断 4 填空 5 简答 6论述
        answerDifficulty: null, // 题目难度 1 低 2 中 3 高
        titleFileName: null, // 题目文件名
        source: null, // 题目来源
        pictureName: null, // 图片名称
        picturePath: null, // 图片地址
        videoName: null, // 视频名
        videoPath: null, // 视频地址
        createBy: null, // 发布人(创建人)
        createTime: null, // 创建时间
        updateBy: null, // 修改人
        updateTime: null, // 修改时间
        deptId: null, // 部门编号
        delFlag: null, // 删除标志  (0表示存在 2表示删除)
        subjectType: null, // 题目类型 1理论知识 2 专业操作
        answerArray: [],
        titleOptionDOS: [],
        answerText: null
  }
}
