import { reactive } from 'vue'
// 项目状态
const projectStatus = reactive<any>([
  {
    label: '立项转实施审批中',
    value: '1'
  },
  {
    label: '实施中',
    value: '2'
  },
  {
    label: '已验收',
    value: '3'
  },
  {
    label: '结束转售后',
    value: '4'
  },
  {
    label: '项目变更审批中',
    value: '5'
  },
  {
    label: '结束转售后',
    value: '6'
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

// 项目类型A 1常规项目、2灯塔项目、3流水项目、4补助项目
const projectTypeA = reactive<any>([
  {
    label: '常规项目',
    value: '1'
  },
  {
    label: '灯塔项目',
    value: '2'
  },
  {
    label: '流水项目',
    value: '3'
  },
  {
    label: '补助项目',
    value: '4'
  }
])

//项目类型C 1自有产品销售、2合作产品销售、3软件开发、4运行维护、5咨询设计、6技术服务、7系统集成
const projectTypeC = reactive<any>([
  {
    label: '自有产品销售',
    value: '1'
  },
  {
    label: '合作产品销售',
    value: '2'
  },
  {
    label: '软件开发',
    value: '3'
  },
  {
    label: '运行维护',
    value: '4'
  },
  {
    label: '咨询设计',
    value: '5'
  },
  {
    label: '技术服务',
    value: '6'
  },
  {
    label: '系统集成',
    value: '7'
  }
])

export { projectStatus, projectType, projectTypeA, projectTypeC }
