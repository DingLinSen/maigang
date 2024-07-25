<template>
  <div
    >首页
    <div class="text"></div>
  </div>
</template>

<script setup lang="ts">
import Socket from '@/socket/index'
import { onBeforeMount, onUnmounted } from 'vue'
import { useCache } from '@/hooks/web/useCache'
const PATH_URL = import.meta.env.VITE_WS_BASE_URL

const { wsCache } = useCache()

const openCallback = (res: any) => {
  console.log('openCallback==>', res)
}
const messageCallback = (res: any) => {
  console.log('messageCallback==>', res)
}
const closeCallback = (res: any) => {
  console.log('closeCallback==>', res)
}
const errorCallback = (res: any) => {
  console.log('errorCallback==>', res)
}

const socketParams = {
  url: PATH_URL + `/message-center/ws/oa?Authorization=${wsCache.get('access_token')}`,
  reconnectLimit: 6,
  openCallback: openCallback,
  messageCallback: messageCallback,
  closeCallback: closeCallback,
  errorCallback: errorCallback
}

let socket = new Socket(socketParams)

// onUnmounted(() => {
//   if (socket) {
//     socket.close()
//   }
// })
</script>
<style lang="less">
.text {
  font-size: 0.0833rem;
}
</style>
