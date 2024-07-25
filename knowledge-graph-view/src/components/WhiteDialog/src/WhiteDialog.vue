<script setup lang="ts">
import { ElDialog, ElScrollbar } from 'element-plus'
import { propTypes } from '@/utils/propTypes'
import {
  computed,
  useAttrs,
  ref,
  unref,
  useSlots,
  watch,
  nextTick,
  onMounted,
  onUnmounted
} from 'vue'
import { isNumber } from '@/utils/is'

const slots = useSlots()

const emit = defineEmits(['toggleFull', 'open'])

const props = defineProps({
  modelValue: propTypes.bool.def(false),
  title: propTypes.string.def('Dialog'),
  fullscreen: propTypes.bool.def(true),
  maxHeight: propTypes.oneOfType([String, Number]).def('500px'),
  titleAlign: propTypes.string.def('left')
})

const getBindValue = computed(() => {
  const delArr: string[] = ['fullscreen', 'title', 'maxHeight']
  const attrs = useAttrs()
  const obj = { ...attrs, ...props }
  for (const key in obj) {
    if (delArr.indexOf(key) !== -1) {
      delete obj[key]
    }
  }
  return obj
})

const isFullscreen = ref(false)

const toggleFull = async () => {
  isFullscreen.value = !unref(isFullscreen)
  await nextTick()
  emit('toggleFull', isFullscreen.value)
}

const dialogHeight = ref(isNumber(props.maxHeight) ? `${props.maxHeight}px` : props.maxHeight)
const resetTableHeight = () => {
  nextTick()
  let layoutContentH = 0
  const layoutContent = document.querySelector('.v-layout')
  // const windowHeight = document.documentElement.offsetHeight
  if (layoutContent) {
    layoutContentH = layoutContent.clientHeight
  }
  let topH = 0
  const topWrap = document.querySelector('.el-dialog__header')
  if (topWrap) {
    topH = topWrap.clientHeight
  }
  let footerH = 0
  const footerWrap = document.querySelector('.el-dialog__footer')
  if (footerWrap) {
    footerH = footerWrap.clientHeight
  }
  if (isFullscreen.value) {
    // dialogHeight.value = `${windowHeight - 58 - 60 - (slots.footer ? 67 : 0)}px`
    dialogHeight.value = `${layoutContentH - 35 - topH - footerH}px`
  } else {
    dialogHeight.value =
      props.maxHeight == 'auto'
        ? 'auto'
        : isNumber(props.maxHeight)
        ? `${props.maxHeight}px`
        : layoutContentH * 0.8 - 35 - topH - footerH + 'px'
  }
}
watch(
  () => isFullscreen.value,
  async (val: boolean) => {
    resetTableHeight()
  },
  {
    immediate: true
  }
)

const dialogStyle = computed(() => {
  return {
    height: unref(dialogHeight)
  }
})
const opened = () => {
  emit('toggleFull', isFullscreen.value)
  handleResize()
}

const handleResize = () => {
  nextTick()
  const dialogHeader = document.querySelectorAll('.el-dialog__header')
  if (dialogHeader && dialogHeader.length) {
    dialogHeader.forEach((e: any) => {
      e.style.zoom = document.body.style.zoom
    })
  }
  const dialogBody = document.querySelectorAll('.el-dialog__body')
  if (dialogBody && dialogBody.length) {
    dialogBody.forEach((e: any) => {
      e.style.zoom = document.body.style.zoom
    })
  }
  const dialogFooter = document.querySelectorAll('.el-dialog__footer')
  if (dialogFooter && dialogFooter.length) {
    dialogFooter.forEach((e: any) => {
      e.style.zoom = document.body.style.zoom
    })
  }
  setTimeout(() => {
    resetTableHeight()
  }, 200)
}
// 注册
onMounted(() => {
  resetTableHeight()
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
})

defineExpose({
  isFullscreen
})
</script>

<template>
  <ElDialog
    class="white-class"
    v-bind="getBindValue"
    :fullscreen="isFullscreen"
    destroy-on-close
    lock-scroll
    draggable
    :append-to-body="true"
    :append-to="'html'"
    align-center
    :show-close="false"
    :close-on-click-modal="false"
    @open="opened"
  >
    <template #header="{ close }">
      <div class="flex justify-between">
        <slot name="title">
          <span
            class="w-full news-dialog-title-class"
            :style="{ 'text-align': props.titleAlign }"
            >{{ title }}</span
          >
        </slot>
        <div
          class="pl-[5px] pr-[5px] cursor-pointer mr-11px cursor-pointer"
          @click="toggleFull"
          v-if="fullscreen"
        >
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
      <div class="line-class"></div>
    </template>

    <ElScrollbar :style="dialogStyle">
      <slot></slot>
    </ElScrollbar>

    <template v-if="slots.footer" #footer>
      <slot name="footer"></slot>
    </template>
  </ElDialog>
</template>

<style lang="less">
.white-class {
  .el-dialog__header {
    position: relative;
    border-radius: 4px;
    background-color: white !important;
    font-size: 16px !important;
    font-family: Alibaba PuHuiTi M;
    border-bottom: 0px solid var(--tags-view-border-color);
    .line-class {
      position: absolute;
      bottom: 0px;
      left: 30px;
      right: 30px;
      background: #eeeeee;
      height: 1px;
    }
  }
  .el-dialog__body {
    padding: 15px !important;
  }
}
.dialog-header-bg-class {
  border-radius: 4px;
  background-color: white !important;
  font-size: 16px !important;
  font-family: Alibaba PuHuiTi M;
  border-bottom: 1px solid var(--tags-view-border-color);
}
.dialog-body-bg-class {
  padding: 15px !important;
}

.news-dialog-title-class {
  word-break: break-word;
  padding-right: 10px;
  font-size: 18px;
  font-family: Alibaba PuHuiTi M;
  font-weight: 500;
  color: #333333;
}

.is-hover {
  &:hover {
    color: var(--el-color-primary) !important;
  }
}

.dark {
  .@{elNamespace}-dialog__header {
    border-bottom: 1px solid var(--el-border-color);
  }

  .@{elNamespace}-dialog__footer {
    border-top: 1px solid var(--el-border-color);
  }
}
</style>
