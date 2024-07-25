<script setup lang="ts">
import { ref, onMounted, computed, watch } from 'vue'
import { propTypes } from '@/utils/propTypes'
import FilePreview from '@/views/Components/FilePreview/FilePreview.vue'
import { downloadFile } from '@/utils/index'
import { useEmitt } from '@/hooks/web/useEmitt'
import { useAppStore } from '@/store/modules/app'
import { WhiteDialog } from '@/components/WhiteDialog'
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
  toggleFull(elDialogRef.value.isFullscreen)
}

const elDialogRef = ref()

const props = defineProps({
  title: propTypes.string.def(''),
  content: propTypes.string.def(''),
  type: propTypes.string.def(''),
  url: propTypes.string.def('')
})

const convertHtml = (html) => {
  const pxRegex = /(\d+(\.\d+)?)(px;)/g
  return html.replace(pxRegex, (match, px) => {
    return px + 'px;line-height:' + (Number(px) + 10) + 'px;'
  })
}

const htmlContent = ref<string>('')

watch(
  () => props.content,
  (data: any) => {
    if (data) {
      htmlContent.value = convertHtml(props.content)
    } else {
      htmlContent.value = ''
    }
  },
  {
    immediate: true
  }
)

const divHeight = ref<number>(300)
const toggleFull = (isFull: boolean) => {
  let layoutContentH = 0
  const layoutContent = document.querySelector('.v-layout')
  if (layoutContent) {
    layoutContentH = layoutContent.clientHeight
  }
  if (isFull) {
    divHeight.value = layoutContentH - getSearchWrapperHeight() - getDailogFooterHeight() - 40
  } else {
    divHeight.value = layoutContentH * 0.55
  }
}

const getDailogFooterHeight = (): number => {
  //搜索框加操作栏高度
  let topH = 0
  const searchWrapper = document.querySelector('.el-dialog__footer')
  if (searchWrapper) {
    topH = searchWrapper.clientHeight
  }
  return topH
}

const getSearchWrapperHeight = (): number => {
  //搜索框加操作栏高度
  let topH = 0
  const searchWrapper = document.querySelector('.el-dialog__header')
  if (searchWrapper) {
    topH = searchWrapper.clientHeight
  }
  return topH
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
  <WhiteDialog
    ref="elDialogRef"
    class="cultivate-custom"
    :width="'55%'"
    :maxHeight="'auto'"
    v-model="dialogFlag"
    title-align="center"
    :title="props.title"
    @closed="resetFormAfterClose"
    @toggle-full="toggleFull"
  >
    <div class="content-class" :style="{ maxHeight: divHeight + 'px', height: divHeight + 'px' }">
      <div :style="{ minHeight: divHeight - 20 * props.url.split(',').length - 30 + 'px' }">
        <div v-if="props.type" class="type-class"> 类型：{{ props.type }} </div>
        <div class="content-news-class" v-if="props.content">
          <div @click="setImgBigger" v-html="htmlContent" class="diaContent"> </div>
        </div>
      </div>
      <div v-if="props.url != null && props.url != '' && props.url != 'null'" class="file-class">
        附件：<div
          v-for="(item, index) in props.url.split(',')"
          :key="index"
          @click="handleView(item)"
          class="link"
          >{{ getFileName(item) }}</div
        >
      </div>
    </div>
  </WhiteDialog>
  <FilePreview ref="FilePreviewRef" />
  <BigImg :ifImgShow="ifImgShow" :imgSrc="imgSrc" :imgSite="imgSite" @close-big-img="closeBigImg" />
</template>
<style lang="less">
.diaContent {
  img {
    display: inline-block !important;
  }
}
</style>
<style lang="less" scoped>
.content-class {
  width: 100%;
  height: 100%;
  font-size: 13px;
  font-family: Microsoft YaHei;
}
.content-news-class {
  padding: 0px 15px;
  overflow-y: auto;
  word-break: break-word;
  min-height: 300px;
}
.file-class {
  padding: 0px 15px;
}
.dialog-header-bg-class {
  border-radius: 4px;
  background: white !important;
  font-size: 16px !important;
  font-family: Alibaba PuHuiTi M;
  border-bottom: 1px solid var(--tags-view-border-color);
}
.dialog-body-bg-class {
  padding: 15px !important;
}
.link {
  color: #00a0e9;
  cursor: pointer;
}
.type-class {
  font-size: 14px !important;
  font-family: Alibaba PuHuiTi R;
  font-weight: 400;
  color: #333333;
  line-height: 24px;
  padding: 0 15px;
}
.diaContent {
  white-space: pre-wrap;
  font-size: 14px !important;
  font-family: Alibaba PuHuiTi R;
  font-weight: 400;
  color: #333333;
  line-height: 24px;
  img {
    max-width: 100%;
    display: inline-block;
  }
  p {
    font-size: 14px !important;
    font-family: Alibaba PuHuiTi R;
    font-weight: 400;
    color: #333333;
    line-height: 24px;
    img {
      display: inline-block !important;
    }
  }
}
:deep(ul) {
  list-style: disc !important;
}
:deep(a) {
  color: #00a0e9;
  text-decoration: underline !important;
}
:deep(table) {
  border: 1px solid black;
}
:deep(tr) {
  border: 1px solid black;
}
:deep(th) {
  min-width: 50px;
  padding-top: 10px;
  padding-bottom: 10px;
  border: 1px solid black;
}
:deep(td) {
  min-width: 50px;
  padding-top: 10px;
  padding-bottom: 10px;
  border: 1px solid black;
}
:deep(h1) {
  font-size: 22px;
  font-weight: bold;
}
:deep(h2) {
  font-size: 20px;
  font-weight: bold;
}
:deep(h3) {
  font-size: 18px;
  font-weight: bold;
}
:deep(h4) {
  font-size: 16px;
  font-weight: bold;
}
:deep(h5) {
  font-size: 14px;
  font-weight: bold;
}
</style>
