<script setup lang="ts">
import { ElDialog, ElScrollbar } from 'element-plus'
import { propTypes } from '@/utils/propTypes'
import { computed, useAttrs, ref, unref, useSlots, watch, nextTick, onMounted } from 'vue'
import { useAppStore } from '@/store/modules/app'

import { useEmitt } from '@/hooks/web/useEmitt'
import { isNumber } from '@/utils/is'

const slots = useSlots()

const emit = defineEmits(['toggleFull'])

const appStore = useAppStore()
// 弹窗自定义配置
const props = defineProps({
  customClass: propTypes.string.def(''),
  modelValue: propTypes.bool.def(false),
  title: propTypes.string.def('Dialog'),
  fullscreen: propTypes.bool.def(true),
  maxHeight: propTypes.oneOfType([String, Number]).def(''),
  dialogWidth: propTypes.oneOfType([String, Number]).def('')
})
useEmitt({
  name: 'window',
  callback: (type: string) => {
    if (type === 'resize') {
      resetTableHeight()
    }
  }
})
const getOverViewWrapper = (dom: string): number => {
  let topH = 0
  const checkboxWrapper = document.querySelector(dom)
  if (checkboxWrapper) {
    topH = checkboxWrapper.clientHeight
  }
  return topH
}
// 视窗高度
const documentClientHeight = computed(() => appStore.getDocumentClientHeight)
const defaultHeight = ref(0)
const mTop = ref(10)
const dialogHeight = ref(isNumber(props.maxHeight) ? `${props.maxHeight}px` : defaultHeight.value)
const resetTableHeight = () => {
  defaultHeight.value = (documentClientHeight.value - 60 - 55 - 63) * 0.7
  mTop.value = defaultHeight.value * 0.15
}

const getBindValue = computed(() => {
  const delArr: string[] = ['fullscreen', 'title', 'maxHeight', 'customClass']
  const attrs = useAttrs()
  const obj = { ...attrs, ...props }
  for (const key in obj) {
    if (delArr.indexOf(key) !== -1) {
      delete obj[key]
    }
  }
  return obj
})
// 是否为全屏 Dialog
const isFullscreen = ref(false)

const toggleFull = async () => {
  isFullscreen.value = !unref(isFullscreen)
  await nextTick()
  emit('toggleFull', isFullscreen.value)
}

watch(
  () => defaultHeight.value,
  async (val: any) => {
    await nextTick()
    if (val) {
      dialogHeight.value = defaultHeight.value
      mTop.value = defaultHeight.value * 0.15
    }
  },
  {
    immediate: true
  }
)
watch(
  () => isFullscreen.value,
  async (val: boolean) => {
    await nextTick()
    if (val) {
      const windowHeight = document.documentElement.offsetHeight
      dialogHeight.value = `${windowHeight - 55 - 60 - (slots.footer ? 63 : 0)}px`
    } else {
      dialogHeight.value = isNumber(props.maxHeight)
        ? `${props.maxHeight}px`
        : `${defaultHeight.value}px`
    }
  },
  {
    immediate: true
  }
)

const dialogStyle = computed(() => {
  return {
    maxHeight: unref(dialogHeight)
  }
})
const opened = () => {
  emit('toggleFull', isFullscreen.value)
}

// 注册
onMounted(() => {
  resetTableHeight()
})

defineExpose({
  isFullscreen
})
</script>

<template>
  <!-- <div class="dialog-1" ref="dialogRef" v-dialog-drag-resize> -->
  <ElDialog
    :top="`${mTop}px`"
    style="width: auto; max-width: calc(100vw)"
    :style="{ width: dialogWidth + 'px' }"
    v-bind="getBindValue"
    :fullscreen="isFullscreen"
    :append-to-body="true"
    modal
    destroy-on-close
    lock-scroll
    draggable
    :close-on-click-modal="false"
    @opened="opened"
  >
    <template #header>
      <div class="flex justify-between">
        <slot name="title">
          {{ title }}
        </slot>
        <Icon
          v-if="fullscreen"
          class="mr-18px cursor-pointer is-hover mt-2px z-10"
          :icon="isFullscreen ? 'zmdi:fullscreen-exit' : 'zmdi:fullscreen'"
          color="var(--el-color-info)"
          @click="toggleFull"
        />
      </div>
    </template>

    <!-- <ElScrollbar> -->
    <div :style="dialogStyle" style="overflow-y: auto">
      <slot></slot>
    </div>

    <!-- </ElScrollbar> -->

    <template v-if="slots.footer" #footer>
      <slot name="footer"></slot>
    </template>
  </ElDialog>
  <!-- </div> -->
</template>

<style lang="less">
.@{elNamespace}-dialog__header {
  margin-right: 0 !important;
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
