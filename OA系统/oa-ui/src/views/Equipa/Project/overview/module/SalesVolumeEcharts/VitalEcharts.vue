<template>
  <div class="2xl:px-[1.56vw] px-[14px] pt-[6px]w-full overflow-hidden" style="height: 300px">
    <el-skeleton :loading="loading" animated v-if="typeProportion.length">
      <Echart :options="barOptions" :height="294" /> </el-skeleton
    ><NoData v-else
  /></div>
</template>

<script setup lang="ts">
import { ContentBox } from '@/views/Equipa/Project/overview/components'
import { EChartsOption } from 'echarts'
import NoData from '@/views/Components/NoData.vue'
import { Echart } from '@/components/Echart'
import { useAppStore } from '@/store/modules/app'
import { ref, inject, unref, onMounted, watch } from 'vue'

const _h = ref(0)
const appStore = useAppStore()
const loading = ref(false)

const props = defineProps({
  typeProportion: {
    type: Array,
    default: []
  }
})

const barOptions = ref()
const echartsInit = () => {
  if (props.typeProportion.length) {
    let tl = []
    let ky = []
    let qt = []
    let jg = []
    let ny = []
    props.typeProportion.forEach((v) => {
      tl.push(Number(v['tl']))
      ky.push(Number(v['ky']))
      qt.push(Number(v['qt']))
      jg.push(Number(v['jg']))
      ny.push(Number(v['ny']))
    })
    if (props.typeProportion.length == 1) {
      barOptions.value = {
        tooltip: {
          trigger: 'axis',
          formatter(params) {
            console.log('params=>', params)

            var relVal = params[0].name
            for (var i = 0, l = params.length; i < l; i++) {
              relVal +=
                '<br/>' +
                params[i].marker +
                params[i].seriesName +
                ' : ' +
                Number(params[i].value).toFixed(2) +
                '万元'
            }
            return '<div style="font-size:0.9rem">' + relVal + '</div>'
          }
        },
        legend: {
          show: true,
          // x: 'right',
          right: document.body.clientWidth < 1500 ? '0' : '5%',
          top: '7%',
          itemHeight: 10,
          itemWidth: 10,
          icon: 'rect',
          orient: 'horizontal',
          textStyle: {
            color: 'rgba(85,85,85,1)'
          }
        },
        grid: {
          left: document.body.clientWidth < 1500 ? '20%' : '13%',
          top: '20%',
          right: '0',
          bottom: '20%'
        },
        xAxis: {
          type: 'category',
          axisLabel: {
            color: '#222222',
            interval: 0,
            fontStyle: 12,
            overflow: 'truncate',
            ellipsis: '...'
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
              color: 'rgba(34,34,34,1)'
            }
          },
          data: props.typeProportion.map((v) => v.year)
        },
        yAxis: {
          type: 'value',
          name: '单位：个数',
          nameGap: 20,
          nameTextStyle: {
            color: '#666666',
            fontWeight: 400,
            fontSize: 14,
            align: 'right'
          },
          axisLabel: {
            color: '#666666',
            fontSize: 14,
            interval: 0
          },
          axisTick: {
            show: false
          },
          splitLine: {
            show: true,
            lineStyle: {
              type: 'dashed',
              color: '#ddd'
            }
          },
          axisLine: {
            show: true
          }
        },
        series: [
          {
            name: '农业',
            data: ny,
            type: 'bar',
            itemStyle: {
              color: '#00A8FF'
            },
            barWidth: '10'
          },
          {
            name: '铁路',
            data: tl,
            type: 'bar',
            itemStyle: {
              color: '#37C18B'
            },
            barWidth: '10'
          },
          {
            name: '自研',
            data: ky,
            type: 'bar',
            itemStyle: {
              color: '#4AB7E2'
            },
            barWidth: '10'
          },
          {
            name: '军工',
            data: jg,
            type: 'bar',
            itemStyle: {
              color: '#F7C122'
            },
            barWidth: '10'
          },
          {
            name: '其他',
            data: qt,
            type: 'bar',
            itemStyle: {
              color: '#657798'
            },
            barWidth: '10'
          }
        ]
      }
    }
    if (props.typeProportion.length > 1) {
      barOptions.value = {
        tooltip: {
          trigger: 'axis',
          formatter(params) {
            console.log('params=>', params)

            var relVal = params[0].name
            for (var i = 0, l = params.length; i < l; i++) {
              relVal +=
                '<br/>' +
                params[i].marker +
                params[i].seriesName +
                '&ensp;&ensp;&ensp;&ensp;' +
                params[i].value
            }
            return '<div style="font-size:0.9rem">' + relVal + '</div>'
          }
        },
        xAxis: {
          type: 'category',
          data: props.typeProportion.map((v) => v.year),
          axisLabel: {
            color: '#222222',
            interval: 0,
            fontSize: '0.9rem',
            overflow: 'truncate',
            ellipsis: '...'
          }
        },
        legend: {
          show: true,
          // x: 'right',
          right: document.body.clientWidth < 1500 ? '0' : '5%',
          top: '7%',
          itemHeight: 10,
          itemWidth: 10,
          icon: 'rect',
          orient: 'horizontal',
          textStyle: {
            color: 'rgba(85,85,85,1)',
            fontSize: '0.9rem'
          }
        },
        grid: {
          left: document.body.clientWidth < 1500 ? '20%' : '13%',
          top: '20%',
          right: '0',
          bottom: '20%'
        },
        yAxis: {
          type: 'value',
          name: '单位：个数',
          nameGap: 20,
          nameTextStyle: {
            color: '#666666',
            fontWeight: 400,
            fontSize: '0.9rem',
            align: 'right'
          },
          axisLabel: {
            color: '#666666',
            fontSize: '0.9rem',
            interval: 0
          },
          axisTick: {
            show: false
          },
          splitLine: {
            show: true,
            lineStyle: {
              type: 'dashed',
              color: '#ddd'
            }
          },
          axisLine: {
            show: true
          }
        },
        series: [
          {
            name: '农业',
            data: ny,
            type: 'line',
            itemStyle: {
              color: '#00A8FF'
            },
            barWidth: '10'
          },
          {
            name: '铁路',
            data: tl,
            type: 'line',
            itemStyle: {
              color: '#37C18B'
            },
            barWidth: '10'
          },
          {
            name: '自研',
            data: ky,
            type: 'line',
            itemStyle: {
              color: '#4AB7E2'
            },
            barWidth: '10'
          },
          {
            name: '军工',
            data: jg,
            type: 'line',
            itemStyle: {
              color: '#F7C122'
            },
            barWidth: '10'
          },
          {
            name: '其他',
            data: qt,
            type: 'line',
            itemStyle: {
              color: '#657798'
            },
            barWidth: '10'
          }
        ]
      }
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
