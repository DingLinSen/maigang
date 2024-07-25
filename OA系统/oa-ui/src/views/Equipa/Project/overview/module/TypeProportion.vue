<template>
  <ContentBox class="overflow-hidden" :shadow="true">
    <template #header>
      <div class="title">项目类型占比 </div>
    </template>
    <template #content>
      <div class="pt-[6px] w-full overflow-hidden" style="height: 300px">
        <el-skeleton v-if="typeProportion.length" :loading="loading" animated>
          <Echart
            ref="echartRef"
            :options="pieOptions"
            :height="294"
            @legend-changed="legendChanged"
          />
        </el-skeleton>
        <NoData v-else />
      </div>
    </template>
  </ContentBox>
</template>

<script setup lang="ts">
import { ContentBox } from '@/views/Equipa/Project/overview/components'
import { Echart } from '@/components/Echart'
import NoData from '@/views/Components/NoData.vue'
import { useAppStore } from '@/store/modules/app'
import { ref, watch } from 'vue'

const _h = ref(0)
const appStore = useAppStore()
const loading = ref(false)

const props = defineProps({
  typeProportion: {
    type: Array,
    default: []
  }
})

const data = ref([])
const pieOptions = ref()

const echartsInit = () => {
  if (props.typeProportion.length) {
    let tl = 0
    let ky = 0
    let qt = 0
    let jg = 0
    let ny = 0
    let allcount = 0
    props.typeProportion.forEach((v) => {
      tl += Number(v['tl'])
      ky += Number(v['ky'])
      qt += Number(v['qt'])
      jg += Number(v['jg'])
      ny += Number(v['ny'])
    })

    allcount = tl + ky + qt + jg + ny

    data.value = [
      {
        name: '铁路',
        value: tl
      },
      {
        name: '自研',
        value: ky
      },
      {
        name: '其他',
        value: qt
      },
      {
        name: '军工',
        value: jg
      },
      {
        name: '农业',
        value: ny
      }
    ]
    pieOptions.value = {
      title: {
        text: '项目总数',
        subtext: String(allcount),
        x: 'center',
        y: document.body.clientWidth < 1500 ? '40%' : '38%',
        textStyle: {
          fontSize: '1rem',
          fontWeight: 'normal',
          color: '#333'
        },
        subtextStyle: {
          color: '#1F2D3D',
          fontSize: '1.5rem'
        }
      },
      tooltip: {
        trigger: 'item',
        formatter:
          '<p style="font-size:0.9rem">{a}</p> <br/><p style="font-size:0.9rem">{b} : {c} ({d}%)</p>'
      },
      // legend: {
      //   orient: 'vertical',
      //   left: '5%',
      //   icon: 'circle',
      //   top: '25%',
      //   data: overviewData.value.warnPercentList
      //     ?.filter((it) => {
      //       return Number(it.alarmType) === 20 || Number(it.alarmType) === 8
      //     })
      //     .map((v) => {
      //       return getElTagLabel(v.alarmType)
      //     })
      // },
      legend: {
        show: true,
        x: 'center',
        right: document.body.clientWidth < 1500 ? '0' : '5%',
        top: '0%',
        itemHeight: 10,
        itemWidth: 10,
        icon: 'rect',
        orient: 'horizontal',
        textStyle: {
          color: 'rgba(85,85,85,1)',
          fontSize: '0.9rem'
        }
      },
      series: [
        {
          name: '项目类型占比',
          type: 'pie',
          radius: document.body.clientWidth < 1500 ? ['30%', '45%'] : ['40%', '60%'],
          center: document.body.clientWidth < 1500 ? ['50%', '47%'] : ['50%', '47%'],

          // itemStyle: {
          //   borderColor: '#fff',
          //   borderWidth: 2
          // },
          itemStyle: {
            // color:'#7FBF86'
            borderColor: '#fff',
            borderWidth: 2,
            color: function (params) {
              if (params.name === '农业') {
                return '#00A8FF'
              }
              if (params.name === '铁路') {
                return '#37C18B'
              }
              if (params.name === '军工') {
                return '#F7C122'
              }
              if (params.name === '其他') {
                return '#657798'
              }
              if (params.name === '自研') {
                return '#4AB7E2'
              }
            }
          },
          label: {
            // formatter: '{val|{b}}\n{num|{d}%}',
            formatter: function (params, ticket, callback) {
              return (
                '{name|' + params.name + '}' + '\n' + '{' + 'color' + '|' + params.percent + '%}'
              )
            },
            textStyle: {
              padding: [1, 3],
              color: 'rgba(102,102,102,1)',
              rich: {
                name: {
                  fontSize: '0.9rem',
                  padding: [4, 0],
                  color: 'rgba(102,102,102,1)'
                },
                color: {
                  fontSize: '0.9rem',
                  fontWeight: 'bold'
                }
              }
            }
            // rich: {
            //   val: {
            //     color: 'rgba(102,102,102,1)',
            //     fontSize: 15,
            //     lineHeight: 0,
            //     padding: [0, 2, 0, 5]
            //   },
            //   num: {
            //     color: 'rgba(102,102,102,1)',
            //     fontSize: 12,
            //     lineHeight: 0,
            //     align: 'right',
            //     padding: [30, 0, 0, 0]
            //   }
            // }
          },
          data: data.value
        }
      ]
    }
  }
}

//监听图例开关
const legendChanged = (params: any) => {
  if (params) {
    let tl = 0
    let ky = 0
    let qt = 0
    let jg = 0
    let ny = 0
    let allcount = 0
    props.typeProportion.forEach((v) => {
      tl += Number(v['tl'])
      ky += Number(v['ky'])
      qt += Number(v['qt'])
      jg += Number(v['jg'])
      ny += Number(v['ny'])
    })
    Object.keys(params).forEach((key) => {
      if (params[key]) {
        if (key == '农业') {
          allcount = allcount + ny
        } else if (key == '铁路') {
          allcount = allcount + tl
        } else if (key == '自研') {
          allcount = allcount + ky
        } else if (key == '其他') {
          allcount = allcount + qt
        } else if (key == '军工') {
          allcount = allcount + jg
        }
      }
    })
    //修改标题
    pieOptions.value.title.subtext = String(allcount)
  }
}
watch(
  props,
  (newValue: any) => {
    echartsInit()
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
