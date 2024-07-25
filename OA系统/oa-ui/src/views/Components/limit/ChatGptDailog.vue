<template>
  <ElDialog
    ref="ElDialogFef"
    class="chat-gpt"
    v-model="DialogFlag"
    :fullscreen="isFullscreen"
    :maxHeight="'auto'"
    append-to-body
    @closed="closed"
  >
    <div :style="dialogStyle" class="chat-gpt-content">
      <div style="height: 56px" class="chat-gpt-close">
        <div class="pl-[5px] pr-[5px] cursor-pointer mr-11px cursor-pointer" @click="toggleFull">
          <Icon
            class="is-hover mt-5px z-10"
            :icon="isFullscreen ? 'svg-icon:ss_icon' : 'svg-icon:full_screen_icon'"
            :size="14"
          />
        </div>
        <div class="pl-[5px] pr-[5px] cursor-pointer" @click="close">
          <Icon class="is-hover z-10 mt-5px" icon="svg-icon:close_icon_dialog" :size="14" />
        </div>
      </div>
      <iframe
        src="https://maxkb.fit2cloud.com/ui/chat/2ddd8b594ce09dbb"
        style="width: 100%; height: 100%"
      ></iframe>
    </div>
  </ElDialog>
</template>

<script setup lang="ts">
import { useEmitt } from '@/hooks/web/useEmitt'
import { computed, ref, unref } from 'vue'

const ElDialogFef = ref()
// 弹窗的开启和关闭
const DialogFlag = ref<any>(false)
//打开drawer并初始化
const openDialog = () => {
  resetTableHeight()
  DialogFlag.value = true
  // isFullscreen.value = false
}

const dialogStyle = computed(() => {
  return {
    height: unref(defaultHeight),
    maxHeight: unref(defaultHeight)
  }
})

const defaultHeight = ref(document.documentElement.offsetHeight * 0.8 + 'px')

const resetTableHeight = () => {
  setTimeout(() => {
    let layoutContentH = 0
    const layoutContent = document.querySelector('.v-layout')
    if (layoutContent) {
      layoutContentH = layoutContent.clientHeight
    }
    // let topH = 0
    // const topWrap = document.querySelector('.chat-gpt>.el-dialog__header')
    // if (topWrap) {
    //   topH = topWrap.clientHeight + 2
    // }
    // let bodyP = 0
    // const bodyWrap = document.querySelector('.chat-gpt>.el-dialog__body')
    // if (bodyWrap) {
    //   let computedStyle = getComputedStyle(bodyWrap, null)
    //   if (computedStyle) {
    //     bodyP = parseFloat(computedStyle.getPropertyValue('padding-top')) * 2
    //   }
    // }
    if (ElDialogFef.value.isFullscreen) {
      defaultHeight.value = `${layoutContentH - 4}px`
    } else {
      defaultHeight.value = layoutContentH * 0.8 + 'px'
    }
  }, 500)
}

// const toggleFull = (isFull: boolean) => {
//   resetTableHeight()
// }

useEmitt({
  name: 'window',
  callback: (type: string) => {
    if (type === 'resize') {
      resetTableHeight()
    }
  }
})
const isFullscreen = ref<boolean>(false)
//Dialog全屏
const toggleFull = () => {
  isFullscreen.value = !isFullscreen.value
  ElDialogFef.value.isFullscreen = isFullscreen.value
  resetTableHeight()
}
//	Dialog 关闭的回调
const close = () => {
  DialogFlag.value = false
}
//Dialog 关闭动画结束时的回调
const closed = () => {
  isFullscreen.value = false
  ElDialogFef.value.isFullscreen = false
  resetTableHeight()
}
defineExpose({
  openDialog
})
</script>

<style lang="less" scoped>
.chat-gpt-content {
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
}
.chat-gpt-close {
  position: absolute;
  display: flex;
  justify-content: space-between;
  top: 0px;
  right: 0px;
  padding: 18px;
}
</style>
<style lang="less">
.chat-gpt {
  .el-dialog__header {
    display: none;
  }
  .el-dialog__body {
    padding: 0px !important;
  }
}
</style>