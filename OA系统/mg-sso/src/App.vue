<script setup lang="ts">
import { computed, onMounted, watch } from 'vue'
import { useAppStore } from '@/store/modules/app'
import { ConfigGlobal } from '@/components/ConfigGlobal'
import { isDark } from '@/utils/is'
import { useDesign } from '@/hooks/web/useDesign'
import { useCache } from '@/hooks/web/useCache'
import { useEmitt } from '@/hooks/web/useEmitt'
import { useRouter, onBeforeRouteUpdate } from 'vue-router'
import { useCookies } from 'vue3-cookies'
const { cookies } = useCookies()
let router = useRouter()
onBeforeRouteUpdate((to) => {
  console.log('onBeforeRouteUpdate', to)
})
watch(
  () => router.currentRoute.value.path,
  (newValue, oldValue) => {
    console.log('watch', newValue)
  },
  { immediate: true }
)

const { getPrefixCls } = useDesign()

const prefixCls = getPrefixCls('app')

const appStore = useAppStore()

const currentSize = computed(() => appStore.getCurrentSize)

const greyMode = computed(() => appStore.getGreyMode)

const { wsCache } = useCache()

const { emitter } = useEmitt()
// 监听浏览器窗口高度的变化
const resetClientHeight = () => {
  appStore.setDocumentClientHeight(document.documentElement['clientHeight'])
  window.onresize = () => {
    appStore.setDocumentClientHeight(document.documentElement['clientHeight'])
    emitter.emit('window', 'resize')
  }
}
// 获取用户信息保存
const getUaserInfo = () => {
  let token = cookies.get('access_token')
  if (token) {
    const avatar = cookies.get('user_info')
    wsCache.set(appStore.getUserInfo, avatar)
  }
}
onMounted(() => {
  getUaserInfo()
  window.addEventListener('resize', resetClientHeight)
  resetClientHeight()
})

// 根据浏览器当前主题设置系统主题色
const setDefaultTheme = () => {
  if (wsCache.get('isDark') !== null) {
    appStore.setIsDark(wsCache.get('isDark'))
    return
  }
  const isDarkTheme = isDark()
  appStore.setIsDark(isDarkTheme)
}

setDefaultTheme()
</script>

<template>
  <ConfigGlobal :size="currentSize">
    <RouterView :class="greyMode ? `${prefixCls}-grey-mode` : ''" />
  </ConfigGlobal>
</template>

<style lang="less">
@prefix-cls: ~'@{namespace}-app';
.fileIcon {
  width: 1em;
  height: 1em;
  vertical-align: -0.15em;
  fill: currentColor;
  overflow: hidden;
  display: inline-block;
  margin-right: 8px;
}

.size {
  width: 100%;
  height: 100%;
}

html,
body {
  padding: 0 !important;
  margin: 0;
  overflow: hidden;
  .size;

  #app {
    .size;
  }
}

.@{prefix-cls}-grey-mode {
  filter: grayscale(100%);
}
</style>
