<template>
  <div class="charts-wrap">
    <div
      ref="barDomFirst"
      :id="barIdFirst"
      :style="{ height: subcontentH + 'px' }"
      v-if="echartsData && echartsData.xData.length > 0"
    ></div>
    <div v-else :style="{ height: subcontentH + 'px' }" class="no-data">
      <div>
        <!-- <img src="@/assets/images/default.png" alt=""> -->
        <p>暂无数据信息</p>
      </div>
    </div>
  </div>
</template>
<script>
import echarts from 'echarts'
export default {
  name: 'barIdFirst',
  props: {
    echartsData: Object,
    index: Number,
    subcontentH: Number
  },
  data() {
    return {
      barDomFirst: null,
      barIdFirst: 'barIdFirst'
    }
  },
  watch: {
    echartsData: {
      handler() {
        this.destroyLine()
        if (this.echartsData && this.echartsData.xData.length > 0) {
          this.drawLine() // 绘制图表
        }
      },
      deep: true
    },
    subcontentH: function () {
      this.destroyLine()
      if (this.echartsData && this.echartsData.xData.length > 0) {
        this.drawLine() // 绘制图表
      }
    }
  },
  computed: {
    documentClientHeight: {
      get() {
        return this.$store.state.common.documentClientHeight
      }
    }
  },
  mounted() {
    if(this.echartsData && this.echartsData.xData.length > 0) {
      this.destroyLine()
      this.drawLine() // 绘制图表
    }
  },
  methods: {
    // 自适应
    resize() {
      this.barDomFirst.resize()
    },
    // 销毁
    destroyLine() {
      if (document.querySelector('#' + this.barIdFirst)) {
        var echartsDom = echarts.init(
          document.querySelector('#' + this.barIdFirst)
        )
        echartsDom.dispose()
      }
    },
    drawLine() {
      var _this = this
      let ydata = _this.echartsData.yData
      let xdata = _this.echartsData.xData
      this.$nextTick(() => {
        let option = {
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              type: 'none'
            },
            formatter: function (params) {
              var relVal = params[0].name
              for (var i = 0, l = params.length; i < l; i++) {
                relVal +=
                  '<br/>' +
                  params[i].marker +
                  params[i].seriesName +
                  ' : ' +
                  params[i].value +
                  '分'
              }
              return relVal
            }
          },
          grid: {
            top: '5%',
            left: '-5%',
            right: '6%',
            bottom: '0%',
            containLabel: true
          },
          xAxis: {
            type: 'value',
            name: '分',
            boundaryGap: [0, 0.01]
          },
          yAxis: {
            type: 'category',
            data: ydata,
            axisLine: {
              show: false
            },
            axisTick: {
              show: false
            },
            axisLabel: {
              margin: 75,
              align: 'left',
              overflow: 'truncate',
              formatter: function (value, index) {
                value = value.length > 3 ? value.substring(0, 3) + '...  ' : value
                // value = value.length > 4 ? value.substring(0, 4) + '\n\xa0\xa0\xa0\xa0\xa0\xa0' + value.substring(4) : value
                let ind = index + 1
                if (ind === ydata.length) {
                  return (
                    '{one|' + (ydata.length - index) + '} {a|' + value + '}'
                  )
                } else if (ind + 1 === ydata.length) {
                  return (
                    '{two|' + (ydata.length - index) + '} {b|' + value + '}'
                  )
                } else if (ind + 2 === ydata.length) {
                  return (
                    '{three|' + (ydata.length - index) + '} {c|' + value + '}'
                  )
                }
                if (ydata.length - index > 9) {
                  return (
                    '{five|' + (ydata.length - index) + '} {d|' + value + '}'
                  )
                }
                return '{four|' + (ydata.length - index) + '} {d|' + value + '}'
              },
              rich: {
                a: {
                  color: '#333333'
                },
                b: {
                  color: '#333333'
                },
                c: {
                  color: '#333333'
                },
                d: {
                  color: '#333333'
                },
                // 第一名
                one: {
                  // backgroundColor: '#E86452',
                  backgroundColor: {
                    image: require('../../../../../assets/images/trainAnalysis/numb_1.png')
                  },
                  color: '#C67B00',
                  width: 12,
                  height: 19,
                  padding: [1, 0, 0, 5],
                  marginRight: '10px',
                  borderRadius: 10,
                  fontSize: 11
                },
                // 第二名
                two: {
                  backgroundColor: {
                    image: require('../../../../../assets/images/trainAnalysis/numb_2.png')
                  },
                  color: '#83B1D7',
                  width: 12,
                  height: 19,
                  padding: [1, 0, 0, 5],
                  borderRadius: 10,
                  fontSize: 11
                },
                // 第三名
                three: {
                  backgroundColor: {
                    image: require('../../../../../assets/images/trainAnalysis/numb_3.png')
                  },
                  color: '#BD7528',
                  width: 12,
                  height: 19,
                  padding: [1, 0, 0, 5],
                  borderRadius: 10,
                  fontSize: 11
                },
                // 一位数
                four: {
                  color: '#29A387 ',
                  width: 12,
                  height: 16,
                  padding: [1, 0, 0, 5],
                  borderRadius: 10,
                  fontSize: 14,
                  fontWeight: 600
                },
                // 两位数
                five: {
                  color: '#29A387 ',
                  width: 16,
                  height: 16,
                  padding: [1, 0, 0, 1],
                  borderRadius: 10,
                  fontSize: 14,
                  fontWeight: 600
                }
              }
            }
          },
          series: [
            {
              name: '成绩',
              type: 'bar',
              barWidth: 15, // 柱状宽度
              itemStyle: {
                // 柱状颜色和圆角
                color: '#35BA9C ',
                barBorderRadius: [0, 5, 5, 0] // （顺时针左上，右上，右下，左下）
              },
              data: xdata
            }
          ]
        }
        // if (_this.echartsData && _this.echartsData.xData.length > 0) {
        setTimeout(() => {
          _this.barDomFirst = echarts.init(
            document.querySelector('#' + this.barIdFirst)
          )
          _this.barDomFirst.clear()
          _this.barDomFirst.setOption(option)
        }, 100)
        // } else {
        //   _this.barDomFirst = echarts.init(document.querySelector('#' + this.barIdFirst))
        //   if(_this.barDomFirst) {
        //     _this.barDomFirst.dispose()
        //   }
        // }
      })
    }
  },
  beforeDestroy() {}
}
</script>
<style scoped>
.no-data {
  font-size: 13px;
  display: flex;
  align-items: center;
  color: #333333;
}
.no-data > div {
  text-align: center;
  width: 100%;
}
</style>
