<template>
  <div class="charts-wrap">
    <div
      ref="barDomSecond"
      :id="barIdSecond"
      :style="{ height: subcontentH + 'px' }"
       v-if="echartsData && echartsData.xData && echartsData.xData.length > 0"
    ></div>
    <!-- <div ref="barDomSecond" :id="barIdSecond" :style="{height: subcontentH + 20 + 'px'}" v-if="echartsData && echartsData.xData.length >0"></div> -->
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
  name: 'barIdSecond',
  props: {
    echartsData: Object,
    index: Number,
    subcontentH: Number
  },
  data() {
    return {
      barDomSecond: null,
      barIdSecond: 'barIdSecond',
      indexNum: 0
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
    subcontentH: function() {
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
      this.barDomSecond.resize()
    },
    // 销毁
    destroyLine() {
      if (document.querySelector('#' + this.barIdSecond)) {
        var echartsDom = echarts.init(
          document.querySelector('#' + this.barIdSecond)
        )
        echartsDom.dispose()
      }
    },
    drawLine() {
      var _this = this
      let ydata = _this.echartsData.yData
      let xdata = _this.echartsData.xData
      let timeData = _this.echartsData.timeData
      this.indexNum = 0
      this.$nextTick(() => {
        let option = {
          color: [ '#35BA9C', '#EABD60' ],
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              type: 'none'
            },
            formatter: function(params) {
              let html = ''
              params.forEach((v) => {
                if (v.seriesIndex === 0) {
                  html += `<div style="color: #ffffff;font-size: 14px;line-height: 24px"><p>${v.name}</p><span style="display:inline-block;margin-right:5px;border-radius:10px;width:10px;height:10px;background-color:${
                    [
                      '#35BA9C',
                      '#EABD60'
                    ][v.componentIndex]};"></span>${v.seriesName}：<span style="color:#ffffff;font-weight: bold;">${v.value.toFixed(1)}</span> 分`
                } else {
                  html += `<div style="color: #ffffff;font-size: 14px;line-height: 24px"><span style="display:inline-block;margin-right:5px;border-radius:10px;width:10px;height:10px;background-color:${
                    [
                      '#35BA9C',
                      '#EABD60'
                    ][v.componentIndex]};"></span>${v.seriesName}：<span style="color:#ffffff;font-weight: bold;">${v.value.toFixed(1)}</span> 小时`
                }
              })
              return html
            }
          },
          grid: {
            left: '3%',
            right: '4%',
            bottom: '10%',
            top: '25%',
            containLabel: true
          },
          legend: {
            icon: 'rect', // 形状  类型包括 circle，rect,line，roundRect，triangle，diamond，pin，arrow，none
            itemWidth: 10, // 设置宽度
            itemHeight: 10, // 设置高度
            itemGap: 24, // 设置间距
            data: [ '考核分数', '训练时长' ],
            textStyle: {
              // 文字样式
              color: '#333333',
              fontSize: '11'
            },
            top: '3%'
          },
          xAxis: [
            {
              type: 'category',
              data: xdata,
              //   axisTick: {
              //     alignWithLabel: false
              //   },
              axisTick: {
                show: false
              },
              axisLabel: {// X轴文字
                show: true, // 是否显示x轴
                interval: 0, // 显示x轴所有内容 间距
                margin: 8,
                fontSize: 12,
                // rotate: 10,
                // textStyle: {
                //   color: '#fff' // X轴文字颜色
                // }
                formatter: (value) => {
                  if (!value) return ''
                  if (value.length > 6) { // 10是截取的字符串长度，根据你的情况调整数值
                    value = value.slice(0, 6) + '...'
                  }
                  return value
                }
                // formatter: function (value) {
                //   var ret = '' // 拼接加\n返回的类⽬项
                //   var maxLength = 6 // 每项显⽰⽂字个数，⾃定义
                //   var valLength = value.length // X轴类⽬项的⽂字个数
                //   var rowN = Math.ceil(valLength / maxLength) // 类⽬项需要换⾏的⾏数
                //   if (rowN > 1) {
                //   // 如果类⽬项的⽂字⼤于3,
                //     for (var i = 0; i < rowN; i++) {
                //       var temp = '' // 每次截取的字符串
                //       var start = i * maxLength // 开始截取的位置
                //       var end = start + maxLength // 结束截取的位置
                //       // 这⾥也可以加⼀个是否是最后⼀⾏的判断，但是不加也没有影响，那就不加吧
                //       temp = value.substring(start, end) + '\n'
                //       ret += temp // 凭借最终的字符串
                //     }
                //     return ret
                //   } else {
                //     return value
                //   }
                // }
              }

            }
          ],
          yAxis: [
            {
              type: 'value',
              name: '单位：分',
              // axisLabel: {
              //   formatter: '{value} 分'
              // }
              axisLabel: {
                formatter: function(value) {
                  return value
                }
              }
            },
            {
              type: 'value',
              name: '单位：小时',
              interval: 5,
              axisLabel: {
                formatter: function(value) {
                  return value
                }
              }
            }

          ],
          series: [
            {
              name: '考核分数',
              type: 'bar',
              barWidth: 10,
              data: ydata
            },
            {
              name: '训练时长',
              type: 'bar',
              yAxisIndex: 1,
              barWidth: 10,
              data: timeData
            }

          ]
        }

        if (_this.echartsData && _this.echartsData.xData.length > 0) {
          setTimeout(() => {
            _this.barDomSecond = echarts.init(document.querySelector('#' + this.barIdSecond))
            _this.barDomSecond.clear()
            _this.barDomSecond.setOption(option)
          }, 100)
        } else {
          _this.barDomSecond = echarts.init(document.querySelector('#' + this.barIdSecond))
          if(_this.barDomSecond) {
            _this.barDomSecond.dispose()
          }
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
