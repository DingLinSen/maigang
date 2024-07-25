import { reactive } from 'vue'

const meetingroomArray = reactive<any>([
  {
    label: '党建会议室',
    value: '党建会议室'
  },
  {
    label: '培训会议室',
    value: '培训会议室'
  },
  {
    label: '茶歇室',
    value: '茶歇室'
  },
  {
    label: '研讨室1',
    value: '研讨室1'
  },
  {
    label: '研讨室2',
    value: '研讨室2'
  },
])



export { meetingroomArray }
