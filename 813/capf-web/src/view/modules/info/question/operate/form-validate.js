/**
 * 验证 videomanagement - 视频管理表 - FORM 表单对象
 * @param _this
 * @returns {{}}
 * @author yxm
 * @date 2022-04-07
 */
import { antPositiveZeroFloat } from '@/utils/validate'
module.exports = function(_this) {
  return {
    title: [
      {
        required: true,
        message: '请输入题目',
        transform: value => (value ? value.trim() : ''),
        trigger: 'blur'
      }
    ],
    subjectType: [
      { required: true, message: '请选择课目类型', trigger: 'change' },
      { required: true, message: '请选择课目类型', trigger: 'blur' }
    ],
    source: [
      {
        required: true,
        message: '请输入题目来源',
        transform: value => (value ? value.trim() : ''),
        trigger: 'blur'
      }
    ],
    answerType: [
      { required: true, message: '请选择题目类型', trigger: 'change' },
      { required: true, message: '请选择题目类型', trigger: 'blur' }
    ],
    answerDifficulty: [
      { required: true, message: '请选择题目难度', trigger: 'change' },
      { required: true, message: '请选择题目难度', trigger: 'blur' }
    ],
    answerText: [
      {
        required: true,
        message: '请输入参考答案关键词',
        transform: value => (value ? value.trim() : ''),
        trigger: 'blur'
      }
    ],
    answerArray: [
      {
        required: true,
        message: '请添加题目选项',
        trigger: 'change',
        type: 'array'
      }
    ],
    introduction: [
      {
        required: true,
        message: '请输入资料简介',
        transform: value => (value ? value.trim() : ''),
        trigger: 'blur'
      }
    ],
    createBy: [
      {
        required: true,
        message: '请输入发布人(创建人)',
        transform: value => (value ? value.trim() : ''),
        trigger: 'blur'
      }
    ],
    createTime: [
      {
        required: true,
        message: '请输入创建时间',
        transform: value => (value ? value.trim() : ''),
        trigger: 'blur'
      }
    ],
    updateBy: [
      {
        required: true,
        message: '请输入修改人',
        transform: value => (value ? value.trim() : ''),
        trigger: 'blur'
      }
    ],
    updateTime: [
      {
        required: true,
        message: '请输入修改时间',
        transform: value => (value ? value.trim() : ''),
        trigger: 'blur'
      }
    ],
    filePath: [
      {
        required: true,
        message: '请输入文件路径',
        transform: value => (value ? value.trim() : ''),
        trigger: 'blur'
      }
    ],
    fileName: [
      {
        required: true,
        message: '请输入文件名',
        transform: value => (value ? value.trim() : ''),
        trigger: 'blur'
      }
    ],
    deptId: [
      {
        required: true,
        message: '请输入部门编号',
        transform: value => (value ? value.trim() : ''),
        trigger: 'blur'
      }
    ],
    delFlag: [
      {
        required: true,
        message: '请输入删除标志  (0表示存在 2表示删除)',
        transform: value => (value ? value.trim() : ''),
        trigger: 'blur'
      }
    ],
    chapterId: [
      {
        required: true,
        message: '请输入章节id',
        transform: value => (value ? value.trim() : ''),
        trigger: 'blur'
      }
    ]
  }
}
