<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { propTypes } from '@/utils/propTypes'
import FilePreview from '@/views/Components/FilePreview/FilePreview.vue'
import { downloadFile } from '@/utils/index'
import { useEmitt } from '@/hooks/web/useEmitt'
import { useAppStore } from '@/store/modules/app'
import { Dialog } from '@/components/Dialog'
import { NewsDialog, BigImg } from './index'

const appStore = useAppStore()
// 视窗高度
const documentClientHeight = computed(() => appStore.getDocumentClientHeight)
// 注册
onMounted(() => {
  resetHeight()
})

useEmitt({
  name: 'window',
  callback: (type: string) => {
    if (type === 'resize') {
      resetHeight()
    }
  }
})

const resetHeight = () => {
  divHeight.value = documentClientHeight.value * 0.6
}

const elDialogRef = ref()

const props = defineProps({
  title: propTypes.string.def(''),
  content: propTypes.string.def(''),
  type: propTypes.string.def(''),
  url: propTypes.string.def('')
})
const divHeight = ref<number>(300)
const toggleFull = (isFull: boolean) => {
  if (isFull) {
    divHeight.value = documentClientHeight.value * 0.8
  } else {
    divHeight.value = documentClientHeight.value * 0.55
  }
}
// 弹窗的开启和关闭
const dialogFlag = ref<any>(false)
//打开drawer并初始化
const openDrawer = () => {
  divHeight.value = documentClientHeight.value * 0.55
  elDialogRef.value.isFullscreen = false
  dialogFlag.value = true
}
// 获取文件名称
const getFileName = (name: any) => {
  if (name.lastIndexOf('/') > -1) {
    return name.slice(name.lastIndexOf('/') + 1)
  } else {
    return name
  }
}

// 预览弹窗
const previewFile = (fileName: string, path: string | undefined) => {
  FilePreviewRef.value.openDialog(fileName, path)
}
const FilePreviewRef = ref()

// 获取文件名后缀
const fileNext = (path: any) => {
  let extension = ''
  if (path) {
    extension = path.substring(path.lastIndexOf('.') + 1)
  }
  return extension
}
// 删除文件
const handleView = (fileUrl: string) => {
  if (
    fileNext(fileUrl) === 'doc' ||
    fileNext(fileUrl) === 'zip' ||
    fileNext(fileUrl) === 'rar' ||
    fileNext(fileUrl) === 'xls'
  ) {
    downloadFile(fileUrl, getFileName(fileUrl))
  } else {
    previewFile(getFileName(fileUrl), fileUrl)
  }
}
const resetFormAfterClose = () => {
  elDialogRef.value.isFullscreen = false
}

const imgSrc = ref<string>('')
const ifImgShow = ref<boolean>(false)
const imgSite = ref<any>({
  height: 0,
  width: 0
})
const setImgBigger = (e: any) => {
  if (e.target.nodeName === 'IMG') {
    let userAgent = navigator.userAgent //识别浏览器
    if (userAgent.indexOf('Chrome') > -1) {
      imgSrc.value = e.target.currentSrc //谷歌
    } else {
      imgSrc.value = e.target.href //其他
    }
    ifImgShow.value = true
    imgSite.value.height = e.target.offsetHeight
    imgSite.value.width = e.target.offsetWidth
  }
}

const closeBigImg = () => {
  ifImgShow.value = false
  imgSrc.value = ''
}
defineExpose({
  openDrawer
})
</script>


<template>
  <Dialog
    ref="elDialogRef"
    custom-class="cultivate-custom"
    :maxHeight="'auto'"
    v-model="dialogFlag"
    title-align="center"
    :title="props.title"
    @closed="resetFormAfterClose"
    @toggle-full="toggleFull"
  >
    <div style="width: 100%; height: 100%; font-size: 13px; font-family: Microsoft YaHei">
      <div v-if="props.type" style="padding: 0 20px"> 类型：{{ props.type }} </div>
      <div
        style="padding: 10px 20px; overflow-y: auto; word-break: break-word"
        v-if="props.content != null"
        :style="{ maxHeight: divHeight + 'px', height: divHeight + 'px' }"
      >
        <div @click="setImgBigger" v-html="props.content" class="diaContent"> </div>
      </div>
      <div
        v-if="props.url != null && props.url != '' && props.url != 'null'"
        style="padding: 0 20px"
      >
        附件：<div
          v-for="(item, index) in props.url.split(',')"
          :key="index"
          @click="handleView(item)"
          class="link"
          >{{ getFileName(item) }}</div
        >
      </div>
    </div>
  </Dialog>
  <FilePreview ref="FilePreviewRef" />
  <BigImg :ifImgShow="ifImgShow" :imgSrc="imgSrc" :imgSite="imgSite" @close-big-img="closeBigImg" />
</template>
<style lang="less" scoped>
.link {
  color: #00a0e9;
  cursor: pointer;
}
.diaContent {
  img {
    max-width: 100%;
  }
  p {
    font-size: 13px !important;
    font-family: Microsoft YaHei !important;
  }
}
</style>