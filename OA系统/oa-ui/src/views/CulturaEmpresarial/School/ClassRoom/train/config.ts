import { reactive } from 'vue'

const courseShelfType = reactive<any>([
  {
    label: '上架',
    value: '0'
  },
  {
    label: '下架',
    value: '1'
  },
  // {
  //   label: '删除',
  //   value: '-1'
  // }
])

const yesOrNo = reactive<any>([
  {
    label: '是',
    value: '1'
  },
  {
    label: '否',
    value: '0'
  }
])

const courseType = reactive<any>([
  {
    label: '内训',
    value: '0'
  },
  {
    label: '外训',
    value: '1'
  },
  // {
  //   label: '其他',
  //   value: '3'
  // }
])

const courseSecondType = reactive<any>([
  {
    label: '管理类',
    value: '0'
  },
  {
    label: '技能类',
    value: '1'
  },
  {
    label: '其他',
    value: '2'
  }
])

export { courseShelfType, courseType, courseSecondType, yesOrNo }
