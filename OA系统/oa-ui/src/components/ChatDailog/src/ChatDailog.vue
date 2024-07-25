<template>
  <div
    :class="isFullscreen ? 'chat-gpt-wrap-full' : 'chat-gpt-wrap'"
    v-if="show"
    v-loading="loading"
  >
    <div class="chat-gpt-content">
      <div style="height: 56px; padding: 21px" class="chat-gpt-close">
        <div class="pl-[5px] pr-[5px] cursor-pointer mr-11px cursor-pointer" @click="toggleFull">
          <img
            src="@/assets/svgs/ss_icon.svg"
            style="width: 14px; height: 14px"
            v-if="isFullscreen"
          />
          <img
            src="@/assets/svgs/full_screen_icon.svg"
            style="width: 14px; height: 14px"
            v-if="!isFullscreen"
          />
        </div>
        <div class="pl-[5px] pr-[5px] cursor-pointer" @click="close">
          <img src="@/assets/svgs/close_icon_dialog.svg" style="width: 14px; height: 14px" />
        </div>
      </div>
      <iframe id="chatFrame" :src="chatUrl" class="chat-content" ref="chatFrame"></iframe>
    </div>
  </div>
</template>
<script setup lang="ts">
import { propTypes } from '@/utils/propTypes'
import { onMounted, ref, watch } from 'vue'

const chatUrl = import.meta.env.VITE_CHAT_BASE_URL
const props = defineProps({
  show: propTypes.bool.def(false)
})

const loading = ref<boolean>(false)
const emit = defineEmits(['close'])
// const showClose = ref<boolean>(false)
const chatFrame = ref()

watch(
  () => chatFrame.value,
  (val: any) => {
    if (val) {
      chatFrame.value.onload = frameLoadedListener
    }
  },
  { deep: true, immediate: true }
)

watch(
  () => props.show,
  (val: any) => {
    if (val) {
      loading.value = true
      setTimeout(() => {
        if (loading.value) {
          loading.value = false
        }
      }, 1000)
    } else {
      loading.value = false
    }
  },
  { deep: true, immediate: true }
)

const frameLoadedListener = () => {
  //   showClose.value = true
  loading.value = false
}

const isFullscreen = ref<boolean>(false)
//Dialog全屏
const toggleFull = () => {
  isFullscreen.value = !isFullscreen.value
}
const close = () => {
  emit('close')
}
</script>
<style lang="less" scoped>
.chat-gpt-wrap-full {
  position: absolute;
  bottom: 0px;
  right: 0px;
  width: 50vw;
  height: 100vh;
  z-index: 2000;
  box-shadow: 0px 3px 4px 0px rgba(31, 31, 31, 0.2);
  border-radius: 4px;
  background: #f5f6f7;
}
.chat-gpt-wrap {
  position: absolute;
  bottom: 40px;
  right: 85px;
  width: 30vw;
  height: 60vh;
  z-index: 2000;
  box-shadow: 0px 3px 4px 0px rgba(31, 31, 31, 0.2);
  border-radius: 4px;
  background: #f5f6f7;
}
.chat-gpt-content {
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  width: 100%;
  height: 100%;
}
.chat-gpt-close {
  position: absolute;
  display: flex;
  justify-content: space-between;
  top: 0px;
  right: 0px;
  padding: 18px;
  height: 56px;
}
.chat-content {
  width: 100%;
  height: 100%;
}
</style>
