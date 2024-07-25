<template>
  <div class="charts-wrap">
    <div
      ref="ringDom"
      :id="ringId"
      :style="{ height: subcontentH + 'px' }"
      v-if="echartsData && echartsData.length > 0"
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
  name: 'ringId',
  props: {
    echartsData: Array,
    index: Number,
    subcontentH: Number
  },
  data() {
    return {
      ringDom: null,
      ringId: 'ringId'
    }
  },
  watch: {
    echartsData: {
      handler() {
        this.destroyLine()
        if (this.echartsData && this.echartsData.length > 0) {
          this.drawLine() // 绘制图表
        }
      },
      deep: true
    },
    subcontentH: function () {
      this.destroyLine()
      if (this.echartsData && this.echartsData.length > 0) {
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
    if (this.echartsData && this.echartsData.length > 0) {
      this.destroyLine()
      this.drawLine() // 绘制图表
    }
  },
  methods: {
    // 自适应
    resize() {
      this.ringDom.resize()
    },
    // 销毁
    destroyLine() {
      if (this.$refs.ringDom) {
        var echartsDom = echarts.init(this.$refs.ringDom)
        echartsDom.dispose()
      }
    },
    drawLine() {
      var _this = this
      var colorList = [
        '#5F87D9 ',
        '#35BA9C',
        '#6A7892',
        '#EABD60 ',
        '#786DD1 ',
        '#72B7D3'
      ]
      //   let maxName = this.echartsData[0].name
      //   let maxPer = this.echartsData[0].value + '万亩'
      this.$nextTick(() => {
        let option = {
          tooltip: {
            trigger: 'axis'
          },
          // title: {
          //   // show: false,
          //   left: '32.6%',
          //   top: '38%',
          //   textStyle: {
          //     color: '#4DFDFC',
          //     fontSize: 12
          //   }
          // },
          legend: {
            // bottom: '15%',
            top: '15%',
            right: '5%',
            orient: 'vertical', // 垂直显示
            icon: 'circle',
            itemHeight: 10, // 修改icon图形大小
            textStyle: {
              // 图例文字的样式
              color: '#333333',
              fontSize: '12'
            },
            formatter: (name) => {
              if (!name) return ''
              if (name.length > 10) { // 10是截取的字符串长度
                name = name.slice(0, 10) + '...'
              }
              return name
            }
          },
          series: [
            {
              name: 'Access From',
              type: 'pie',
              radius: ['50%', '80%'],
              center: ['25%', '55%'],
              avoidLabelOverlap: false,
              label: {
                normal: {
                  show: false,
                  formatter: '{b}\n{d}%',
                  position: 'center',
                  lineHight: 30
                }
              },
              itemStyle: {
                normal: {
                  color: function (params) {
                    return colorList[params.dataIndex]
                  }
                }
              },
              emphasis: {
                label: {
                  show: true,
                  fontSize: '12',
                  color: '#333333',
                  formatter: (val) => {
                    let value = ''
                    if (val.name.length > 7) { // 6是截取的字符串长度
                      value = val.name.slice(0, 7) + '...' + '\n' + val.percent + '%'
                    }else{
                      value = val.name + '\n' + val.percent + '%'
                    }
                    return value
                  }
                }

              },
              labelLine: {
                show: false
              },
              data: this.echartsData
            }
          ]
        }
        if (_this.echartsData && _this.echartsData.length > 0) {
          setTimeout(() => {
            _this.ringDom = echarts.init(this.$refs.ringDom)
            _this.ringDom.clear()
            _this.ringDom.setOption(option)
          }, 100)
        } else {
          _this.ringDom = echarts.init(this.$refs.ringDom)
          _this.ringDom = _this.ringDom ? _this.ringDom.dispose() : null
        }
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
