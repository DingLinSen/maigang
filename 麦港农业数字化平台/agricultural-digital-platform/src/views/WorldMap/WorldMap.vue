<template>
  <div class="map_box">
    <!-- <div style="background: #000; width: 100%; height: 100vh"></div> -->
    <div ref="worldBox" class="main"></div>
    <div class="title-class">
      <div class="map_top">
        <div class="btn-left"
          ><img src="@/assets/echarts/word_icon.png" alt="" /><span>系统文档</span></div
        >
        <div class="top_title"> <span>麦港农业数字化平台</span> </div>
        <div class="btn-right">
          <div class="btn-box">
            <img src="@/assets/imgs/platformHome/manage_icon.png" alt="" /><span>系统设置</span>
          </div>
          <div class="btn-box login_out" @click="loginOut">
            <img src="@/assets/imgs/platformHome/quit_icon.png" alt="" /><span>退出</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { onMounted, ref } from 'vue'
import * as echarts from 'echarts'
import 'echarts-gl'
import earthBg from '../../assets/echarts/worldMap.jpg' //导入背景纹理
import scatterIcon from '../../assets/echarts/scatter_icon.png'
import { useRouter } from 'vue-router'
import { ElSwitch, ElDialog, ElInput, ElTable, ElMessageBox } from 'element-plus'
import { loginOutApi } from '@/api/login'
import { useI18n } from '@/hooks/web/useI18n'
import { useCache } from '@/hooks/web/useCache'
import { useTagsViewStore } from '@/store/modules/tagsView'

const tagsViewStore = useTagsViewStore()
const { t } = useI18n()
const { wsCache } = useCache()
const { replace } = useRouter()
const worldBox = ref(null)
onMounted(async () => {
  world_fun()
})

// 定义数据
var data = [
  { name: '上海', value: [121.4737, 31.2304] },
  { name: '广州', value: [113.2806, 23.1251] },
  { name: '广州', value: [110.2806, 35.1251] },
  { name: '广州', value: [107.2806, 23.1251] },
  { name: '广州', value: [107.2806, 27.1251] }
]
const world_fun = () => {
  var option = {
    backgroundColor: '#000',
    globe: {
      baseTexture: earthBg, // 地球表面覆盖的图片
      shading: 'color', // 地球中三维图形的着色效果
      zoom: 2,
      viewControl: {
        autoRotate: false, // 自动旋转
        // autoRotateSpeed: 3, //物体自转的速度,单位为角度 / 秒，默认为10也就是36秒转一圈。
        // autoRotateAfterStill: 2, // 在鼠标静止操作后恢复自动旋转的时间间隔,默认 3s
        // rotateSensitivity: 2, // 旋转操作的灵敏度，值越大越灵敏.设置为0后无法旋转。[1, 0]只能横向旋转.[0, 1]只能纵向旋转
        targetCoord: [108.55, 34.32], // 定位到中国中心点
        // maxDistance: 100,
        // minDistance: 100,
        distance: 60
      }
    },
    series: [
      {
        type: 'scatter3D',
        // name: '麦港农业产业园',
        coordinateSystem: 'globe',
        symbol:
          'path://M25.1,0C11.26,0,0,11.26,0,25.1s11.26,25.1,25.1,25.1,25.1-11.26,25.1-25.1S38.94,0,25.1,0Zm0,49C11.92,49,1.2,38.28,1.2,25.1S11.92,1.2,25.1,1.2s23.9,10.72,23.9,23.9-10.72,23.9-23.9,23.9Z M25.1,11.5c-7.5,0-13.6,6.1-13.6,13.6s6.1,13.6,13.6,13.6,13.6-6.1,13.6-13.6-6.1-13.6-13.6-13.6Zm0,26c-6.84,0-12.4-5.56-12.4-12.4s5.56-12.4,12.4-12.4,12.4,5.56,12.4,12.4-5.56,12.4-12.4,12.4Z M25.1,16.5c-4.74,0-8.6,3.86-8.6,8.6s3.86,8.6,8.6,8.6,8.6-3.86,8.6-8.6-3.86-8.6-8.6-8.6Zm0,16c-4.08,0-7.4-3.32-7.4-7.4s3.32-7.4,7.4-7.4,7.4,3.32,7.4,7.4-3.32,7.4-7.4,7.4Z',
        symbolSize: 40,
        itemStyle: {
          color: '#f3da34' // 设置颜色
        },
        label: {
          show: true,
          formatter: '麦港农业产业园',
          textStyle: {
            fontSize: 20,
            backgroundColor: '#f3da34',
            fontWeight: '600',
            color: '#000',
            padding: [6, 5]
            // backgroundColor: {
            //   image: scatterIcon
            // }
          },
          position: 'bottom'
        },
        emphasis: {
          label: {
            show: true
          }
        },
        data: data
      }
    ]
  }
  // 随机数据 i控制线数量
  //   for (let i = 0; i < 30; i++) {
  //     option.series[0].data = option.series[0].data.concat(randomData())
  //   }
  var BlChart = echarts.init(worldBox.value)

  BlChart.setOption(option)
  window.onresize = () => {
    BlChart.resize()
  }

  BlChart.on('click', function (args) {
    replace({ path: '/platformHome' })
  })
}

// 随机生成起始及终点经纬度坐标
const randomData = () => {
  let name = '随机点' + Math.random().toFixed(5) * 100000
  // 起点经纬度-北京
  let longitude = 116.2,
    latitude = 39.56
  // 随机终点经纬度
  let longitude2 = Math.random() * 360 - 180
  let latitude2 = Math.random() * 180 - 90
  return {
    coords: [
      [longitude, latitude],
      [longitude2, latitude2]
    ],
    value: (Math.random() * 3000).toFixed(2)
  }
}
// 退出登录
const loginOut = () => {
  ElMessageBox.confirm(t('common.loginOutMessage'), t('common.reminder'), {
    confirmButtonText: t('common.ok'),
    cancelButtonText: t('common.cancel'),
    type: 'warning',
    autofocus: false,
    confirmButtonClass: 'quit-btn'
  })
    .then(async () => {
      const res = await loginOutApi().catch(() => {})
      if (res) {
        wsCache.clear()
        tagsViewStore.delAllViews()
        // resetRouter() // 重置静态路由表
        replace('/login')
      }
    })
    .catch(() => {})
}
</script>

<style lang="less" scoped>
.map_box {
  position: relative;
}
.main {
  background-color: #000;
  width: 100vw;
  height: 100vh;
  position: absolute;
  top: 0px;
}
.map_top {
  position: relative;
  height: 115px;
  //   display: flex;
  //   justify-content: center;
  //   align-items: center;
  //   background: transparent;
  .btn-left {
    z-index: 2;
    position: absolute;
    top: 18px;
    left: 42px;
    width: 107px;
    height: 45px;
    cursor: pointer;
    background-image: url('@/assets/echarts/btn_bg.png');
    background-repeat: no-repeat;
    display: flex;
    align-items: center;
    img {
      width: 16px;
      height: 16px;
      margin-left: 10px;
    }
    span {
      color: #b0e0da;
      line-height: 36px;
      margin-left: 2px;
    }
  }

  .title-class {
    position: absolute;
    top: 0px;
  }
  .top_title {
    position: absolute;
    top: 50px;
    left: 50%;
    transform: translate(-50%, -50%);
    text-align: center;
    width: 1629px;
    height: 115px;
    background-image: url('@/assets/echarts/top_bg.png');
    background-repeat: no-repeat;
    font-size: 56px;
    font-weight: 400;
    color: #ffffff;
    span {
      background: linear-gradient(
        0deg,
        #b1ebea 0%,
        #7bdbcc 28.4423828125%,
        #d0f8f7 62.5244140625%,
        #ffffff 100%
      );
      text-shadow: 0px 5px 4px rgba(0, 0, 0, 0.3);
      -webkit-text-stroke: 1px #e9f3ff;
      text-stroke: 1px #e9f3ff;
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }
  }
  .btn-right {
    position: absolute;
    top: 18px;
    right: 40px;
    display: flex;
    .btn-box {
      cursor: pointer;
      margin-right: 14px;
      //      top: 18px;
      // left: 42px;
      width: 107px;
      height: 45px;
      background-image: url('@/assets/echarts/btn_bg.png');
      background-repeat: no-repeat;
      display: flex;
      align-items: center;
      img {
        width: 16px;
        height: 16px;
        margin-left: 10px;
      }
      span {
        color: #b0e0da;
        line-height: 36px;
        margin-left: 2px;
      }
    }
    .login_out {
      display: flex;
      justify-content: center;
    }
  }
}
</style>
