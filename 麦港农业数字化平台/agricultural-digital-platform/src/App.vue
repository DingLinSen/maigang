<script setup lang="ts">
import { computed, onMounted, watch, ref } from 'vue'
import { useAppStore } from '@/store/modules/app'
import { useRouter } from 'vue-router'
import { ConfigGlobal } from '@/components/ConfigGlobal'
import { isDark } from '@/utils/is'
import { useDesign } from '@/hooks/web/useDesign'
import { useCache } from '@/hooks/web/useCache'

import { useEmitt } from '@/hooks/web/useEmitt'

const { getPrefixCls } = useDesign()
const router = useRouter()

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
onMounted(() => {
  window.addEventListener('resize', resetClientHeight)
  resetClientHeight()
})

// 根据浏览器当前主题设置系统主题色
const setDefaultTheme = () => {
  if (wsCache.get('isDark') !== null) {
    appStore.setIsDark(wsCache.get('isDark'))
    return
  }
  // const isDarkTheme = isDark()
  // appStore.setIsDark(isDarkTheme)
}

// 定义rem 大屏字体设置100px
const rem = ref(0)
const getRem = () => {
  var w = document.body.clientWidth || document.documentElement.clientWidth
  rem.value = (w / 1920) * 100
}
getRem()
window.addEventListener('resize', function () {
  getRem()
})

watch(
  [() => router?.currentRoute.value, rem],
  ([routerValue, remValue]) => {
    if (routerValue?.name === 'PlatformHome') {
      document.documentElement.style.fontSize = remValue + 'px'
    } else {
      document.documentElement.style.fontSize = 16 + 'px'
    }
  },
  { immediate: true }
)

setDefaultTheme()
</script>

<template>
  <ConfigGlobal :size="currentSize">
    <RouterView :class="greyMode ? `${prefixCls}-grey-mode` : ''" />
  </ConfigGlobal>
</template>

<style lang="less">
@prefix-cls: ~'@{namespace}-app';

.size {
  width: 100%;
  height: 100%;
}

html,
body {
  font-size: 16px;
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

.el-input-number .el-input__inner {
  text-align: left !important;
}

.search-select-max-width {
  .select-trigger {
    .el-select-tags-wrapper {
      .el-tag__content {
        .el-select__tags-text {
          max-width: 80px !important;
        }
      }
    }
  }
}
</style>
