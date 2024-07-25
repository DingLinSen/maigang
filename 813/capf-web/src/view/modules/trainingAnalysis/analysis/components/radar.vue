<template>
  <div class="charts-wrap">
    <!-- v-if="echartsData && echartsData.length >0" -->
    <div
      ref="ringDom"
      :id="ringId"
      :style="{ height: subcontentH +'px' }"
      v-if="echartsData && echartsData.length > 0"
    ></div>
    <div v-else :style="{height: subcontentH+ 'px'}" class="no-data">
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
      ringId: 'ringId',
      indicator: [
        { name: '学习时长' },
        { name: '培训人数' },
        { name: '培训质量' },
        { name: '训练次数' }
      ]
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
    if(this.echartsData && this.echartsData.length > 0) {
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
      // var echartsDom = echarts.init(document.querySelector('#' + this.ringId))
      // echartsDom.dispose()
    },
    drawLine() {
      var _this = this
      this.$nextTick(() => {
        const tooltip = {
          show: true
        }
        let array = this.echartsData[0].concat(this.echartsData[1])
        let max = Math.max(...array)
        const indicator = [
          {
            name: '学习时长',
            max: max
          },
          {
            name: '培训人数',
            max: max
          },
          {
            name: '培训质量',
            max: max
          },
          {
            name: '训练次数',
            max: max
          }
        ]
        const dataArr = [
          {
            name: '理论学习',
            value: _this.echartsData[0],
            symbolSize: 7,
            itemStyle: {
              // color: '#FFFF',
              borderColor: '#CFA448',
              borderWidth: 2
            },
            lineStyle: {
              width: 2
              // color: '#CFA448'
            },
            tooltip: {
              formatter: function (e) {
                let data = e.value
                let html = '<p>理论学习</p>'
                data.forEach((item, index) => {
                  if (index === 0) {
                    html = html + '<p>学习时长：' + item + '小时</p>'
                  } else if (index === 1) {
                    html = html + '<p>培训人数：' + item + '人</p>'
                  } else if (index === 2) {
                    html = html + '<p>培训质量：' + item + '%</p>'
                  } else if (index === 3) {
                    html = html + '<p>训练次数：' + item + '次</p>'
                  }
                })
                return html
              }
            },
            areaStyle: {
            // 单项区域填充样式
              color: {
                type: 'linear',
                x: 0, // 右
                y: 0, // 下
                x2: 1, // 左
                y2: 1, // 上
                colorStops: [
                  {
                    offset: 0,
                    color: 'rgba(238, 191, 95, 0.8)'
                  },
                  {
                    offset: 0.5,
                    color: 'rgba(238, 191, 95, 0.8)'
                  },
                  {
                    offset: 1,
                    color: 'rgba(238, 191, 95, 0.8)'
                  }
                ],
                global: false
              },
              opacity: 1 // 区域透明度
            }
          },
          {
            name: '专业操作',
            value: _this.echartsData[1],
            symbolSize: 7,
            tooltip: {
              formatter: function (e) {
                let data = e.value
                let html = '<p>专业操作</p>'
                data.forEach((item, index) => {
                  if (index === 0) {
                    html = html + '<p>学习时长：' + item + '小时</p>'
                  } else if (index === 1) {
                    html = html + '<p>培训人数：' + item + '人</p>'
                  } else if (index === 2) {
                    html = html + '<p>培训质量：' + item + '%</p>'
                  } else if (index === 3) {
                    html = html + '<p>训练次数：' + item + '次</p>'
                  }
                })
                return html
              }
            },
            itemStyle: {
              // color: '#FFFF',
              borderColor: '#56B8B3',
              borderWidth: 2
            },
            lineStyle: {
              width: 2
              // color: '#56B8B3'
            },
            areaStyle: {
            // 单项区域填充样式
              color: {
                type: 'linear',
                x: 0, // 右
                y: 0, // 下
                x2: 1, // 左
                y2: 1, // 上
                colorStops: [
                  {
                    offset: 0,
                    color: 'rgba(66, 193, 186, 0.8)'
                  },
                  {
                    offset: 0.5,
                    color: 'rgba(66, 193, 186, 0.8)'
                  },
                  {
                    offset: 1,
                    color: 'rgba(66, 193, 186, 0.8)'
                  }
                ],
                global: false
              },
              opacity: 1 // 区域透明度
            }
          }
        ]

        let option = {
          color: ['#EEBF5F', '#42C1BA'],
          legend: {
            data: ['理论学习', '专业操作'],
            bottom: 5, // 位置
            left: '31%', // 位置
            textStyle: {
              color: '#333333',
              fontSize: 13
            },
            itemGap: 10,
            borderRadius: 4, // 圆角
            itemWidth: 12, // 图例图形宽度
            itemHeight: 12 // 图例图形高度
          },
          tooltip,

          radar: {
            center: ['50%', '44%'], // 圆心坐标距离左边和上边的距离
            radius: ['1%', '48%'], // 内外半径，不写默认是75%
            startAngle: 90, // 可以旋转图形
            shape: 'circle',
            axisName: {
              color: '#fff',
              fontSize: 16
            },
            indicator: indicator,
            splitArea: {
              show: false // 默认显示颜色分割区域，不需要显示
            },
            axisLine: {
              show: true, // 是否显示十字交叉线
              // 指向外圈文本的分隔线样式
              lineStyle: {
                color: '#CFD6E2' // 线条颜色
              }
            },
            name: {
              formatter: '{value}',
              textStyle: {
                color: '#33333'
              },
              fontSize: 14
            },
            axisLabel: { show: false },
            splitLine: {
            // 雷达一圈圈
              show: true,
              lineStyle: {
                type: 'solid',
                color: '#CFD6E2', // 雷达一圈圈颜色分隔线颜色
                width: 1 // 分隔线线宽
              }
            }
          },
          series: [
            {
              type: 'radar',
              data: dataArr
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
    },
    buildSeries(data, indicator, data2) {
      const helper = data.map((item, index) => {
        const arr = new Array(data.length)
        arr.splice(index, 1, item)
        return arr
      })

      return [data, ...helper].map((item, index) => {
        return {
          name: '理论学习',
          type: 'radar',
          itemStyle: {
            color: 'rgba(238, 191, 95, 1)'
          },
          lineStyle: {
            color: index === 0 ? 'rgba(238, 191, 95,1)' : 'transparent'
          },
          areaStyle: {
            color: index === 0 ? 'rgba(238, 191, 95, 0.8)' : 'transparent',
            opacity: 0.3
          },
          tooltip: {
            show: index !== 0,
            formatter: function () {
              var unit = ''
              if (index - 1 === 0) {
                unit = '小时'
              } else if (index - 1 === 1) {
                unit = '人'
              } else if (index - 1 === 2) {
                unit = '%'
              } else if (index - 1 === 3) {
                unit = '次'
              }
              return (
                indicator[index - 1].name +
                '<br/>理论学习：' +
                data[index - 1] +
                unit + '<br/>专业操作：' +
                data2[index - 1] +
                unit
              )
            }
          },
          z: index === 0 ? 1 : 2,
          data: [item]
        }
      })
    },
    buildSeries1(data, indicator, data2) {
      const helper = data.map((item, index) => {
        const arr = new Array(data.length)
        arr.splice(index, 1, item)
        return arr
      })

      return [data, ...helper].map((item, index) => {
        return {
          name: '专业操作',
          type: 'radar',
          itemStyle: {
            color: 'rgba(66, 193, 186, 1)'
          },
          lineStyle: {
            color: index === 0 ? 'rgba(66, 193, 186,1)' : 'transparent'
          },
          areaStyle: {
            color: index === 0 ? 'rgba(66, 193, 186,1)' : 'transparent',
            opacity: 0.3
          },
          tooltip: {
            show: index !== 0,
            formatter: function () {
              var unit = ''
              if (index - 1 === 0) {
                unit = '小时'
              } else if (index - 1 === 1) {
                unit = '人'
              } else if (index - 1 === 2) {
                unit = '%'
              } else if (index - 1 === 3) {
                unit = '次'
              }
              return (
                indicator[index - 1].name +
                '<br/>理论学习：' +
                data2[index - 1] +
                unit +
                '<br/>专业操作：' +
                data[index - 1] +
                unit
              )
            }
          },
          z: index === 0 ? 1 : 2,
          data: [item]
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
