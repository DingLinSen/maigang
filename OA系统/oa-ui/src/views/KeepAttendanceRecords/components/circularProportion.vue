<template>
  <div> <Echart :options="pieOptions" :width="width" :height="height" /> </div>
</template>

<script setup lang="ts">
import { Echart } from '@/components/Echart'
import { ref, watch } from 'vue'

const pieOptions = ref()

const props = defineProps({
  day: {
    type: Number,
    default: 0
  },
  width: {
    type: Number,
    default: 85
  },
  height: {
    type: Number,
    default: 85
  },
  fontSize: {
    type: Number,
    default: 13
  }
})

const echartsInit = () => {
  pieOptions.value = {
    title: {
      show: true,
      text: props.day + '天',
      x: 'center',
      y: 'center', // 通过x,y将标题(进度)定位在圆环中心
      textStyle: {
        fontSize: props.fontSize,
        color: '#00A0E9',
        fontWeight: '400',
        fontFamily: 'DINPro, DINPro-Regular'
      }
    },
    tooltip: {
      trigger: 'item',
      formatter: '{d}%',
      show: false
    },
    legend: {
      orient: 'vertical',
      x: 'left',
      show: false
    },
    series: {
      name: '',
      type: 'pie',
      radius: ['75%', '100%'],
      avoidLabelOverlap: true,
      hoverAnimation: false,
      label: {
        normal: {
          show: false,
          position: 'center'
        },
        emphasis: {
          show: false
        }
      },
      labelLine: {
        normal: {
          show: false
        }
      },
      data: [
        {
          value: props.day,
          name: '',
          itemStyle: {
            color: '#00A0E9'
          }
        },
        {
          value: getCountDays() - props.day,
          name: '',
          itemStyle: {
            color: 'rgba(0,0,0,0.15)'
          }
        }
      ]
    }
  }
}

const getCountDays = () => {
  var curDate = new Date()
  /* 获取当前月份 */
  var curMonth = curDate.getMonth()
  /*  生成实际的月份: 由于curMonth会比实际月份小1, 故需加1 */
  curDate.setMonth(curMonth + 1)
  /* 将日期设置为0, 这里为什么要这样设置, 我不知道原因, 这是从网上学来的 */
  curDate.setDate(0)
  /* 返回当月的天数 */
  return curDate.getDate()
}

watch(
  props,
  (newValue: any) => {
    echartsInit()
  },
  { immediate: true }
)
</script>
