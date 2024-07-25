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
import { useEmitt } from '@/hooks/web/useEmitt'
import { useAppStore } from '@/store/modules/app'

useEmitt({
  name: 'window',
  callback: (type: string) => {
    if (type === 'resize') {
      resetTableHeight()
    }
  }
})
const appStore = useAppStore()
const documentClientHeight = computed(() => appStore.getDocumentClientHeight)
const resetTableHeight = () => {
  nextTick()
  let layoutContentH = 0
  const layoutContent = document.querySelector('.v-layout')
  // const windowHeight = document.documentElement.offsetHeight
  if (layoutContent) {
    layoutContentH = layoutContent.clientHeight
  }
  let topH = 0
  const topWrap = document.querySelector('#el-dialog>.el-dialog__header')
  if (topWrap) {
    topH = topWrap.clientHeight + 2
  }
  console.log('topH=>', topH)

  let bodyP = 0
  const bodyWrap = document.querySelector('#el-dialog>.el-dialog__body')
  if (bodyWrap) {
    let computedStyle = getComputedStyle(bodyWrap, null)
    if (computedStyle) {
      bodyP = parseFloat(computedStyle.getPropertyValue('padding-top')) * 2
    }
  }
  console.log('bodyP=>', bodyP)

  let footerH = 0
  const footerWrap = document.querySelector('#el-dialog>.el-dialog__footer')
  if (footerWrap) {
    footerH = footerWrap.clientHeight + 2
  }
  console.log('footerH=>', footerH)
  if (isFullscreen.value) {
    // dialogHeight.value = `${windowHeight - 58 - 60 - (slots.footer ? 67 : 0)}px`
    dialogHeight.value = `${layoutContentH - bodyP - topH - footerH}px`
  } else {
    dialogHeight.value =
      props.maxHeight == 'auto'
        ? 'auto'
        : isNumber(props.maxHeight)
        ? `${props.maxHeight}px`
        : layoutContentH * 0.8 - (props.titleAlign == 'center' ? 35 : 65) - topH - footerH + 'px'
  }
  emit('resizeH', dialogHeight.value)
}

const slots = useSlots()

const emit = defineEmits(['toggleFull', 'open', 'resizeH'])

const props = defineProps({
  modelValue: propTypes.bool.def(false),
  title: propTypes.string.def('Dialog'),
  fullscreen: propTypes.bool.def(true),
  maxHeight: propTypes.oneOfType([String, Number]).def('550px'),
  modelValue: propTypes.bool.def(false),
  feedbackHeight: propTypes.bool.def(false),
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

watch(
  () => isFullscreen.value,
  async (val: boolean) => {
    setTimeout(() => {
      resetTableHeight()
    }, 200)
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
  emit('open')
  emit('toggleFull', isFullscreen.value)
  handleResize()
}
const handleResize = () => {
  nextTick()
  const dialogHeader = document.querySelectorAll('#el-dialog>.el-dialog__header')
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

const closed = () => {
  isFullscreen.value = false
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
  <!-- <div v-dialogDrag="true"> -->
  <ElDialog
    v-bind="getBindValue"
    :fullscreen="isFullscreen"
    destroy-on-close
    lock-scroll
    draggable
    align-center
    :append-to-body="true"
    :append-to="'html'"
    :show-close="false"
    :close-on-click-modal="false"
    @closed="closed"
    @opened="opened"
    id="el-dialog"
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
    </template>

    <ElScrollbar :style="dialogStyle">
      <slot></slot>
    </ElScrollbar>

    <template v-if="slots.footer" #footer>
      <slot name="footer"></slot>
    </template>
  </ElDialog>
  <!-- </div> -->
</template>

<style lang="less">
.news-dialog-title-class {
  word-break: break-word;
  padding-right: 10px;
}
.@{elNamespace}-dialog__header {
  margin-right: 0 !important;
  // background: #f3f4f8 !important;
  border-bottom: 1px solid var(--tags-view-border-color);
}

.@{elNamespace}-dialog__footer {
  border-top: 1px solid var(--tags-view-border-color);
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
