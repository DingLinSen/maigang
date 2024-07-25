import { reactive } from 'vue'
// 项目状态
const projectStatus = reactive<any>([
  {
    label: '培育转立项审批中',
    value: '1'
  },
  {
    label: '进展中',
    value: '2'
  },
  {
    label: '立项暂停',
    value: '3'
  },
  {
    label: '结束转实施',
    value: '4'
  },
  {
    label: '结束终止',
    value: '5'
  },
  {
    label: '状态变更审批中',
    value: '6'
  },
  {
    label: '里程碑节点审批中',
    value: '7'
  },
  {
    label: '结束转实施',
    value: '8'
  },
  // {
  //   label: '立项转实施审批中',
  //   value: '8'
  // },
  {
    label: '负责人变更审批中',
    value: '9'
  },
  {
    label: '里程碑变更审批中',
    value: '10'
  }
])
// 项目类型
const projectType = reactive<any>([
  {
    label: '农业农村',
    value: '0'
  },
  {
    label: '铁路交通',
    value: '1'
  },
  {
    label: '军工',
    value: '2'
  },
  {
    label: '其他',
    value: '3'
  }
])

export { projectStatus, projectType }
