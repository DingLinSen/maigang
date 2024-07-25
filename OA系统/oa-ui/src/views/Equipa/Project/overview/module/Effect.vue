<template>
  <ContentBox class=" " :shadow="true">
    <template #header>
      <div class="title"> 项目实施TOP </div>
    </template>
    <template #content>
      <div class="2xl:px-[1.56vw] px-[14px] pt-[6px] w-full" style="height: 300px">
        <el-skeleton v-if="effect.length" :loading="loading" animated>
          <Echart :options="lineOptions" :height="chartsHeight" />
        </el-skeleton>
        <NoData v-else />
      </div>
    </template>
  </ContentBox>
</template>

<script setup lang="ts">
import { ContentBox } from '@/views/Equipa/Project/overview/components'
import NoData from '@/views/Components/NoData.vue'
import { EChartsOption } from 'echarts'
import { Echart } from '@/components/Echart'
import { useAppStore } from '@/store/modules/app'
import { ref, inject, unref, onMounted, watch } from 'vue'

const props = defineProps({
  effect: {
    type: Array,
    default: []
  }
})
const chartsHeight = ref<number>(60)
const _h = ref(0)
const appStore = useAppStore()
const loading = ref(false)
const lineOptions = ref()

const echartsInit = () => {
  if (props.effect.length) {
    lineOptions.value = {
      tooltip: {
        confine: true,
        trigger: 'axis',
        formatter: function (params, ticket, callback) {
          return (
            '<p style="max-width:200px;white-space: pre-wrap;font-size:0.9rem">' +
            params[0].name +
            '</p>' +
            '<p style="font-size:0.9rem">' +
            params[0].value +
            '万元</p>'
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
            width: '200',
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
                fontSize: '0.9em',
                align: 'left',
                backgroundColor: 'rgba(232,10,23, .1)',
                padding: [2, 6, 0, 6]
              },
              ind2: {
                color: '#D91D01',
                fontSize: '0.9em',
                align: 'left',
                backgroundColor: 'rgba(217,29,1, .1)',
                padding: [2, 6, 0, 6]
              },
              ind3: {
                color: '#F47E00',
                fontSize: '0.9em',
                backgroundColor: 'rgba(244,126,0, .1)',
                padding: [2, 6, 0, 6],
                align: 'left'
              },
              ind4: {
                color: '#333',
                fontSize: '0.9em',
                backgroundColor: 'rgba(51,51,51, .1)',
                padding: [2, 6, 0, 6],
                align: 'left'
              },
              va: {
                color: '#222',
                fontSize: '0.9em',
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
          data: props.effect
            .sort((a, b) => b.contractMoney - a.contractMoney)
            .map((v) => v?.projectTitle)
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
              fontSize: '0.9em',
              fontFamily: 'PingFang SC'
            },
            formatter: (params) => {
              return `${(Math.round(params * 100) / 100).toFixed(2)}万元`
            }
          },
          data: props.effect
            .sort((a, b) => b.contractMoney - a.contractMoney)
            .map((v) => Number(v?.contractMoney))
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
          data: props.effect
            .sort((a, b) => b.contractMoney - a.contractMoney)
            .map((v) => (Math.round(v?.contractMoney * 100) / 100).toFixed(2)),
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
    chartsHeight.value = props.effect.length * 60 > 290 ? 294 : props.effect.length * 60
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
.title {
  font-size: 16px;
  margin: 0 13px;
  padding: 0 5px;
  font-family: Alibaba PuHuiTi M;
  font-weight: 400;
  color: #333333;
}

ul li {
  &:last-child {
    border: 0;
  }
}

@media screen and (max-width: 1536px) {
  .title {
    font-size: 14px !important;
  }
}
</style>
