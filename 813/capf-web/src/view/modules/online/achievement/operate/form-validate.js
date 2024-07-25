/**
 * 验证 examinepoint - 网上考核-成绩管理 - FORM 表单对象
 * @param _this
 * @returns {{}}
 * @author yxm
 * @date 2022-04-07
 */
import { antPositiveZeroFloat } from '@/utils/validate'
module.exports = function(_this) {
  return {
    examineDate: [
      { required: true, message: '请输入考核日期', transform: value => value ? value.trim() : '', trigger: 'blur' }
    ],
    examineName: [
      { required: true, message: '请输入考核名称', transform: value => value ? value.trim() : '', trigger: 'blur' }
    ],
    examineType: [
      { required: true, message: '请输入考核类型 1结业考核初考 2结业考核补考 3季度考核 4抽考 ', transform: value => value ? value.trim() : '', trigger: 'blur' }
    ],
    paperName: [
      { required: true, message: '请输入试卷名称', transform: value => value ? value.trim() : '', trigger: 'blur' }
    ],
    subjectName: [
      { required: true, message: '请输入课目名称', transform: value => value ? value.trim() : '', trigger: 'blur' }
    ],
    questionNum: [
      { required: true, message: '请输入题目数量', transform: value => value ? value.trim() : '', trigger: 'blur' }
    ],
    paperPoint: [
      { required: true, message: '请输入分值', transform: value => value ? value.trim() : '', trigger: 'blur' }
    ],
    answerNum: [
      { required: true, message: '请输入答题人数', transform: value => value ? value.trim() : '', trigger: 'blur' }
    ],
    standardRate: [
      { required: true, message: '请输入合格率', transform: value => value ? value.trim() : '', trigger: 'blur' }
    ],
    createTime: [
      { required: true, message: '请输入创建时间', transform: value => value ? value.trim() : '', trigger: 'blur' }
    ],
    assessmentId: [
      { required: true, message: '请输入考核管理的id 备用', transform: value => value ? value.trim() : '', trigger: 'blur' }
    ],
    groupId: [
      { required: true, message: '请输入单位id,非考试单位，同步使用', transform: value => value ? value.trim() : '', trigger: 'blur' }
    ]
  }
}
