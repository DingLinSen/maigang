<script setup lang="ts">
import { ref, onBeforeMount, onMounted, nextTick } from 'vue'
import Socket from '@/socket/index'
import config from '@/socket/config/config'
import flvjs from 'flv.js'

Socket.getSocketInstance().then((socket) => {
  if (socket) {
    socket.close(config.ERROR_CODE.normal)
  }
})

const player = ref()
const playerDom = ref()
const playVideo = () => {
  if (flvjs.isSupported()) {
    let video = playerDom
    // var videoElement = document.getElementById('videoElement')
    if (video.value) {
      player.value = flvjs.createPlayer(
        {
          type: 'flv',
          isLive: true,
          // url: `rtsp://admin:mg123456@192.168.8.201:554/Streaming/Channels/101`,
          url: 'http://10.0.0.30/live/8859/1.flv',
          // url: 'https://mister-ben.github.io/videojs-flvjs/bbb.flv',
          // url: 'http://yw.mgdaas.net:20000/live/97fd/1.flv',
          hasAudio: false,
          hasVideo: true,
          cors: true // 是否跨域
          // withCredentials: true
        },
        {
          autoCleanupSourceBuffer: true, //对SourceBuffer进行自动清理缓存
          autoCleanupMaxBackwardDuration: 120, //    当向后缓冲区持续时间超过此值（以秒为单位）时，请对SourceBuffer进行自动清理
          autoCleanupMinBackwardDuration: 60, //指示进行自动清除时为反向缓冲区保留的持续时间（以秒为单位）。
          enableStashBuffer: false, //关闭IO隐藏缓冲区
          reuseRedirectedURL: true, //重用301/302重定向url，用于随后的请求，如查找、重新连接等。
          stashInitialSize: 128,
          headers: {
            Authorization: 'Basic ' + btoa(unescape(encodeURIComponent('admin:1qaz@WSX')))
          }
        }
      )
      player.value.attachMediaElement(video.value)
      if (player.value) {
        player.value.load()
        player.value.play()
      }
      setTimeout(() => {
        player.value.on(flvjs.Events.ERROR, (errType, errDetail) => {
          if (errType == flvjs.ErrorTypes.MEDIA_ERROR) {
            console.log('媒体错误')
            if (errDetail == flvjs.ErrorDetails.MEDIA_FORMAT_UNSUPPORTED) {
              console.log('媒体格式不支持')
            }
            destroy()
          }
          if (errType == flvjs.ErrorTypes.NETWORK_ERROR) {
            console.log('网络错误')
            if (errDetail == flvjs.ErrorDetails.NETWORK_STATUS_CODE_INVALID) {
              console.log('http状态码异常')
            }
          }
          if (errType == flvjs.ErrorTypes.OTHER_ERROR) {
            console.log('其他异常：', errDetail)
          }
        })
        // 画面卡死
        player.value.on('statistics_info', function (res) {
          console.log('res', res)
        })
      }, 500)
    }
  } else {
    console.log('不支持')
  }
}
onBeforeMount(() => {})
onMounted(() => {
  nextTick(() => {
    playVideo()
  })
})
const destroy = () => {
  player.value.pause() //暂停播放数据流
  player.value.unload() //取消数据流加载
  player.value.detachMediaElement() //将播放实例从节点中取出
  player.value.destroy() //销毁播放实例
  player.value = null
}
</script>

<template>
  <video id="videoElement" class="demo-video" ref="playerDom" controls muted></video>
</template>

<style lang="less" scoped>
@prefix-cls: ~'@{namespace}-login';

.@{prefix-cls} {
  &__left {
    &::before {
      position: absolute;
      top: 0;
      left: 0;
      z-index: -1;
      width: 100%;
      height: 100%;
      background-image: url('@/assets/svgs/login-bg.svg');
      background-position: center;
      background-repeat: no-repeat;
      content: '';
    }
  }
}
</style>
