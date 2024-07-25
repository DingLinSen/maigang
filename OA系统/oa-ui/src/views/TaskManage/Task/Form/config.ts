import { reactive } from 'vue'
// 任务状态
const taskStatus = reactive<any>([
  {
    label: '未完成',
    value: '0'
  },
  {
    label: '已完成',
    value: '1'
  },
  {
    label: '待接受',
    value: '3'
  },
  {
    label: '已拒绝',
    value: '4'
  },
  {
    label: '已驳回',
    value: '5'
  },
  {
    label: '已归档',
    value: '6'
  }
])
// 延误状态
const delayStatus = reactive<any>([
  {
    label: '正常',
    value: '0'
  },
  {
    label: '延误',
    value: '1'
  }
])
export { taskStatus, delayStatus }
