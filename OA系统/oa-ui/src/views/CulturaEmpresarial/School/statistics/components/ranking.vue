<template>
  <div :isShowtitle="false" class="ranking w-[28.28vw] mt-[14px] statistics-left-ranking">
    <div class="header h-[51px] leading-[51px] pl-[20px]">
      <div class="title">排行TOP5</div>
    </div>
    <div class="px-[1.56vw] pt-[6px] h-[26.64em] w-full overflow-hidden">
      <el-skeleton v-if="topFiveList.length" :loading="loading" animated>
        <Echart :height="294" :options="lineOptions" />
      </el-skeleton>
      <NoData v-else />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ContentBox } from '@/views/Equipa/Project/overview/components'
import NoData from '@/views/Components/NoData.vue'
import { EChartsOption } from 'echarts'
import { Echart } from '@/components/Echart'
import { useAppStore } from '@/store/modules/app'
import { ref, inject, unref, onMounted, watch } from 'vue'

const props = defineProps({
  topFiveList: {
    type: Array,
    default: []
  }
})

const _h = ref(0)
const appStore = useAppStore()
const loading = ref(false)
const lineOptions = ref()

const echartsInit = () => {
  if (props.topFiveList.length) {
    lineOptions.value = {
      tooltip: {
        trigger: 'axis',
        formatter: function (params, ticket, callback) {
          return (
            '<p style="max-width:350px;white-space: pre-wrap;">' +
            params[0].name +
            '</p>' +
            '<p>' +
            params[0].value +
            '次</p>'
          )
        }
      },
      grid: {
        left: '0',
        right: '0',
        bottom: '4%',
        top: '8%'
      },
      xAxis: {
        splitLine: {
          show: false
        },
        axisLine: {
          show: false
        },
        axisLabel: {
          show: false
        },
        axisTick: {
          show: false
        },
        max: function (value) {
          return value.max + value.max * 0.1
        }
      },
      yAxis: [
        {
          type: 'category',
          inverse: true,
          axisLabel: {
            padding: [8, 0, 12, 8],
            align: 'left',
            interval: 0,
            width: '300',
            overflow: 'truncate',
            verticalAlign: 'bottom',
            // textStyle: {
            //   color: '#222',
            //   fontSize: '15',
            //   fontFamily: 'PingFang SC'
            // },
            // formatter: '{value}{index}',
            formatter: function (val, a) {
              let text = ''
              if (a === 0) {
                text = '{ind1|' + '01' + '}'
              } else if (a === 1) {
                text = '{ind2|' + '02' + '}'
              } else if (a === 2) {
                text = '{ind3|' + '03' + '}'
              } else {
                text = '{ind4|' + (a + 1 < 10 ? '0' + (a + 1) : a + 1) + '}'
              }
              return text + '{va|' + val + '}'
            },
            rich: {
              ind1: {
                color: '#E80A17',
                fontSize: 12,
                align: 'left',
                backgroundColor: 'rgba(232,10,23, .1)',
                padding: [2, 6, 0, 6]
              },
              ind2: {
                color: '#D91D01',
                fontSize: 12,
                align: 'left',
                backgroundColor: 'rgba(217,29,1, .1)',
                padding: [2, 6, 0, 6]
              },
              ind3: {
                color: '#F47E00',
                fontSize: 12,
                backgroundColor: 'rgba(244,126,0, .1)',
                padding: [2, 6, 0, 6],
                align: 'left'
              },
              ind4: {
                color: '#333',
                fontSize: 12,
                backgroundColor: 'rgba(51,51,51, .1)',
                padding: [2, 6, 0, 6],
                align: 'left'
              },
              va: {
                color: '#222',
                fontSize: '13',
                padding: [4, 0, 0, 6],
                fontFamily: 'PingFang SC',
                align: 'left'
              }
            }
          },
          axisTick: {
            show: false
          },
          splitLine: {
            show: false
          },
          axisLine: {
            show: false,
            lineStyle: {
              color: 'rgba(129,235,245,.2)'
            }
          },
          data: props.topFiveList.sort((a, b) => b.viewCount - a.viewCount).map((v) => v?.name)
        },
        {
          type: 'category',
          inverse: true,
          axisTick: 'none',
          axisLine: 'none',
          show: true,
          axisLabel: {
            padding: [0, 10, 15, 0],
            verticalAlign: 'bottom',
            align: 'right',
            textStyle: {
              color: '#333333',
              fontSize: 13,
              fontFamily: 'PingFang SC'
            },
            formatter: (params) => {
              return `${params}次`
            }
          },
          data: props.topFiveList
            .sort((a, b) => b.viewCount - a.viewCount)
            .map((v) => Number(v?.viewCount))
        }
      ],
      series: [
        {
          // 内
          type: 'bar',
          barWidth: 10,
          barCateGoryGap: 10,
          showBackground: true,
          itemStyle: {
            normal: {
              barBorderRadius: 2,
              color: '#00A8FF'
            }
          },
          label: {
            show: false
          },
          data: props.topFiveList
            .sort((a, b) => b.viewCount - a.viewCount)
            .map((v) => Number(v?.viewCount)),
          z: 2,
          animationEasing: 'elasticOut'
        }
      ]
    }
  }
}

watch(
  props,
  (newValue: any) => {
    echartsInit()
  },
  { immediate: true }
)

watch(
  () => appStore.getDocumentClientHeight,
  (newValue: any) => {
    _h.value = (newValue / 1060) * 306
  },
  { immediate: true }
)
</script>

<style lang="less" scoped>
.ranking {
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
