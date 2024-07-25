<template>
  <div :isShowtitle="false" class="top_search w-[28.28vw] statistics-left-top">
    <div class="header h-[51px] leading-[51px] pl-[20px]">
      <div class="title">热搜</div>
    </div>
    <div
      v-if="hotSearchList.length"
      class="px-[1.56vw] pt-[6px] h-[21.93em] w-full overflow-hidden"
    >
      <Echart :height="256" :options="lineOptions" />
    </div>
    <NoData v-else />
  </div>
</template>

<script lang="ts" setup>
import { nextTick, ref, watch } from 'vue'
import { EChartsOption } from 'echarts'
import { Echart } from '@/components/Echart'
import { ScatterChart } from 'echarts/charts'
import { getDataStartListApi } from '@/api/school/statistics'
import NoData from '@/views/Components/NoData.vue'

const props = defineProps({
  hotSearchList: {
    type: Array,
    default: []
  }
})

const offsetData = [
  [60, 40],
  [25, 85],
  [80, 83],
  [15, 43],
  [7, 68],
  [50, 10],
  [90, 27],
  [58, 58]
]
const color = ['#FFFFFF', '#FFFFFF', '#FFFFFF', '#FFFFFF', '#FFFFFF', '#FFFFFF']
const itemStyle = {
  opacity: 1
}
console.log(props.hotSearchList)

let seriesDatas = []
let lineOptions = ref()
const init = () => {
  seriesDatas = props.hotSearchList.map((item, i) => {
    return {
      name: item.content,
      value: offsetData[i],
      label: {
        color: color[i],
        fontSize: i % 2 === 0 ? '14' : '18',
        backgroundColor: {
          type: 'linear',
          x: 0,
          y: 1,
          x2: 1,
          y2: 1,
          colorStops: [
            {
              offset: 0,
              color: 'rgba(111,187,252, 1)' // 起点颜色和透明度
            },
            {
              offset: 1,
              color: 'rgba(0,160,233, 1)' // 终点颜色和透明度
            }
          ]
        },
        padding: [6, 10],
        borderRadius: 4
      },
      itemStyle: {
        ...itemStyle
      }
    }
  })
  lineOptions.value = {
    grid: {
      show: false,
      top: 10,
      bottom: 10
    },
    xAxis: {
      type: 'value',
      show: false,
      min: 0,
      max: 100,
      nameLocation: 'middle',
      nameGap: 5
    },
    yAxis: {
      min: 0,
      show: false,
      max: 100,
      nameLocation: 'middle',
      nameGap: 0
    },
    series: [
      {
        type: 'scatter',
        symbol: 'circle',
        label: {
          show: true,
          formatter: '{b}',
          textStyle: {
            fontSize: 12
          }
        },
        data: seriesDatas
      }
    ]
  }
}
watch(
  props,
  (newValue: any) => {
    init()
  },
  { immediate: true }
)
</script>

<style lang="less" scoped>
.top_search {
  width: 100%;
  box-shadow: 0px 3px 4px 0px rgba(31, 31, 31, 0.2);
  background-color: #ffffff;
  border-radius: 2px;
}

.header {
  width: 100%;
  border-bottom: 1px solid #eef0f2;
}

.title {
  font-size: 16px;
}
</style>
