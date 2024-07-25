<script setup lang="ts">
import { ElDialog, ElScrollbar } from 'element-plus'
import { propTypes } from '@/utils/propTypes'
import { computed, useAttrs, ref, unref, useSlots, watch, nextTick } from 'vue'
import { isNumber } from '@/utils/is'

const slots = useSlots()

const emit = defineEmits(['toggleFull'])

const props = defineProps({
  modelValue: propTypes.bool.def(false),
  modelClose: propTypes.bool.def(false),
  alignCenter: propTypes.bool.def(true),
  title: propTypes.string.def('Dialog'),
  topicName: propTypes.string.def(''),
  modalClass: propTypes.string.def(''),
  marginTop: propTypes.string.def(''),
  fullscreen: propTypes.bool.def(true),
  maxHeight: propTypes.oneOfType([String, Number]).def('500px')
})

const getBindValue = computed(() => {
  const delArr: string[] = ['fullscreen', 'title', 'maxHeight', 'topicName']
  const attrs = useAttrs()
  const obj = { ...attrs, ...props }
  for (const key in obj) {
    if (delArr.indexOf(key) !== -1) {
      delete obj[key]
    }
  }
  return obj
})

const isFullScreen = ref(false)

const toggleFull = async () => {
  isFullScreen.value = !unref(isFullScreen)
  await nextTick()
  emit('toggleFull', isFullScreen.value)
}

const dialogHeight = ref(isNumber(props.maxHeight) ? `${props.maxHeight}px` : props.maxHeight)
const defaultHeight = ref<any>(0)
watch(
  () => defaultHeight.value,
  async (val: any) => {
    await nextTick(() => {})
    if (val) {
      dialogHeight.value = defaultHeight.value
    }
  },
  {
    immediate: true
  }
)
watch(
  () => isFullScreen.value,
  async (val: boolean) => {
    await nextTick()
    if (val) {
      const windowHeight = document.documentElement.offsetHeight
      dialogHeight.value = `${windowHeight - 15 - 60 - (slots.footer ? 63 : 0)}px`
    } else {
      dialogHeight.value = isNumber(props.maxHeight)
        ? `${props.maxHeight}px`
        : props.maxHeight === 'auto'
        ? `calc(80vh - 136px)`
        : props.maxHeight
    }
  },
  {
    immediate: true
  }
)

const dialogStyle = computed(() => {
  return {
    height: unref(dialogHeight),
    marginBottom: (slots.footer ? 63 : 0) + 'px'
  }
})
const dialogRef = ref()
const opened = () => {
  //弹窗
  const dragDom = document.querySelector('.el-overlay-dialog .el-dialog')
  const body = dragDom?.querySelector('.el-dialog__body') || null
  if (props.maxHeight === 'auto') {
    dialogHeight.value = body?.clientHeight ? body?.clientHeight - 80 + 'px' : `calc(80vh - 136px)`
  }
  if (isFullScreen.value) {
    const windowHeight = document.documentElement.offsetHeight
    dialogHeight.value = `${windowHeight - 15 - 60 - (slots.footer ? 63 : 0)}px`
  } else {
    dialogHeight.value = isNumber(props.maxHeight)
      ? `${props.maxHeight}px`
      : props.maxHeight === 'auto'
      ? `calc(80vh - 136px)`
      : props.maxHeight
  }
  emit('toggleFull', isFullScreen.value)
}
</script>

<template>
  <!-- v-element-dialog-resize="{ draggable: true, fullscreen: true }" -->
  <div ref="dialogRef" v-dialog-drag-resize>
    <ElDialog
      v-bind="getBindValue"
      :fullscreen="isFullScreen"
      destroy-on-close
      lock-scroll
      draggable
      :modal-class="modalClass"
      :top="marginTop"
      :align-center="alignCenter"
      :close-on-click-modal="modelClose"
      @opened="opened"
    >
      <template #header>
        <div class="flex justify-between">
          <slot name="title">
            {{ title }}
          </slot>
          <div
            style="
              color: #000000;
              text-align: center;
              font-size: 18px;
              height: 24px;
              line-height: inherit;
              font-family: Microsoft YaHei;
            "
          >
            <slot name="topic-name">
              {{ topicName }}
            </slot>
          </div>
          <Icon
            v-if="fullscreen"
            class="mr-18px cursor-pointer is-hover mt-2px z-10"
            :icon="isFullScreen ? 'zmdi:fullscreen-exit' : 'zmdi:fullscreen'"
            color="var(--el-color-info)"
            @click="toggleFull"
          />
        </div>
      </template>
      <!-- <ElScrollbar :style="dialogStyle">
        <slot></slot>
      </ElScrollbar> -->
      <div class="dialog-content" :style="dialogStyle">
        <ElScrollbar class="content-scrollbar">
          <slot></slot>
        </ElScrollbar>
      </div>
      <template v-if="slots.footer" #footer>
        <slot name="footer" class="dialog-footer"></slot>
        <!-- <div
          class="el-dialog-resize"
          :style="{
            width: '15px',
            height: '15px',
            'z-index': 3000,
            background: 'transparent',
            position: 'absolute',
            bottom: '0px',
            right: '0px',
            cursor: 'se-resize'
          }"
        >
        </div> -->
      </template>
    </ElDialog>
  </div>
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

.el-dialog.is-fullscreen {
  max-height: 100%;
  width: 100% !important;
  height: 100% !important;
}

/*定义滚动条高宽及背景
 高宽分别对应横竖滚动条的尺寸*/
::-webkit-scrollbar {
  width: 0.04rem;
  height: 10px;
  background-color: #f5f5f5;
}

/*定义滚动条轨道
 内阴影+圆角*/
::-webkit-scrollbar-track {
  -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
  border-radius: 10px;
  background-color: #f5f5f5;
}

/*定义滑块
 内阴影+圆角*/
::-webkit-scrollbar-thumb {
  border-radius: 10px;
  -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
  background-color: #409eff;
}

.el-dialog {
  max-height: 80vh;
  position: relative;
  .el-dialog__header {
    // padding-top: 19px !important;
  }
  .el-dialog__body {
    overflow: hidden;
    padding: 8px 20px;

    .dialog-content {
      // height: 100%;
      margin-bottom: 64px;
      overflow-y: scroll;

      /*定义滚动条高宽及背景 高宽分别对应横竖滚动条的尺寸*/
      &::-webkit-scrollbar {
        width: 0.04rem;
        height: 10px;
        background-color: #f5f5f5;
      }

      /*定义滚动条轨道 内阴影+圆角*/
      &::-webkit-scrollbar-track {
        -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
        border-radius: 10px;
        background-color: #f5f5f5;
      }

      /*定义滑块  内阴影+圆角*/
      &::-webkit-scrollbar-thumb {
        border-radius: 10px;
        -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
        background-color: #409eff;
      }
    }
  }

  .el-dialog__footer {
    position: absolute;
    bottom: 0;
    width: 100%;
    background: #fff;
  }
}

.details-footer {
  position: relative;
  top: 5px;
}
</style>
