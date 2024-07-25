import { reactive } from 'vue'
// 项目类型
const projectType = reactive<any>([
  {
    label: '农业',
    value: '1'
  },
  {
    label: '铁路',
    value: '2'
  },
  {
    label: '军工',
    value: '3'
  },
  {
    label: '其他',
    value: '4'
  }
])

export { projectType }
