<template>
  <div class="2xl:px-[1.56vw] px-[14px] pt-[6px] w-full overflow-hidden" style="height: 300px">
    <el-skeleton
      :loading="loading"
      animated
      v-if="salesVolume.length && props.salesVolume.filter((v) => v.type != 4).length"
    >
      <Echart :options="barOptions" :height="294" /> </el-skeleton
    ><NoData v-else
  /></div>
</template>

<script setup lang="ts">
import { Echart } from '@/components/Echart'
import NoData from '@/views/Components/NoData.vue'
import { useAppStore } from '@/store/modules/app'
import { ref, watch } from 'vue'

const _h = ref(0)
const appStore = useAppStore()
const loading = ref(false)
const barOptions = ref()
const props = defineProps({
  salesVolume: {
    type: Array,
    default: []
  }
})

const echartsInit = () => {
  // barOptions.value = {
  //   xAxis: {
  //     type: 'category',
  //     data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
  //   },
  //   yAxis: {
  //     type: 'value'
  //   },
  //   series: [
  //     {
  //       data: [120, 200, 150, 80, 70, 110, 130],
  //       type: 'bar',
  //       showBackground: true,
  //       backgroundStyle: {
  //         color: 'rgba(180, 180, 180, 0.2)'
  //       }
  //     }
  //   ]
  // }
  if (props.salesVolume.length) {
    barOptions.value = {
      tooltip: {
        trigger: 'axis',

        // confine: true
        formatter(params) {
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
        // formatter: function (params, ticket, callback) {
        // var res = `{b}<br />{cir1} {a0}: {c0}<br />{cir2} {a1}: {c1}`
        // formatter: '{a} <br/>{b} : {c} ({d}%)'
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
        bottom: '20%',
        containLabel: true
      },
      xAxis: {
        type: 'category',
        axisLabel: {
          color: '#222222',
          interval: 0,
          fontSize: '0.9rem',
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
        data: props.salesVolume
          .filter((v) => v.type != 4)
          .map((v) =>
            v.type == 0
              ? '农业'
              : v.type == 1
              ? '铁路'
              : v.type == 2
              ? '军工'
              : v.type == 4
              ? '自研'
              : '其他'
          )
      },
      yAxis: {
        type: 'value',
        name: '单位：万元',
        nameGap: 20,
        nameLocation: 'end',
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
          name: '预计销售额',
          data: props.salesVolume
            .filter((v) => v.type != 4)
            .map((v) => (Math.round(v.estimatedAmount * 100) / 100).toFixed(2)),
          type: 'bar',
          itemStyle: {
            color: '#37C18B'
          },
          barWidth: '10'
        },
        {
          name: '实际销售额',
          data: props.salesVolume
            .filter((v) => v.type != 4)
            .map((v) => (Math.round(v.contractMoney * 100) / 100).toFixed(2)),
          type: 'bar',
          itemStyle: {
            color: '#CDF2E4'
          },
          barWidth: '10'
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
