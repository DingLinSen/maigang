<!-- 文件预览 -->

<script setup lang="ts">
import { ref, unref, computed, onMounted } from 'vue'
import { propTypes } from '@/utils/propTypes'
import { Dialog } from '@/components/Dialog'
import { ElButton } from 'element-plus'
import { useEmitt } from '@/hooks/web/useEmitt'
import { isNumber } from '@/utils/is'
import { useAppStore } from '@/store/modules/app'
import axios from 'axios'
import * as docx from 'docx-preview'
import * as XLSX from 'xlsx'
useEmitt({
  name: 'window',
  callback: (type: string) => {
    if (type === 'resize') {
      resetTableHeight()
    }
  }
})
const props = defineProps({
  titleAlign: propTypes.string.def('left'),
  isWhite: propTypes.bool.def(false)
})

const loading = ref<boolean>(false)
const appStore = useAppStore()

// 接收父组件数据

const excel = ref<any>({
  // 数据
  workbook: {},
  // 表名称集合
  sheetNames: [],
  // 激活项
  sheetNameActive: '',
  // 当前激活表格
  SheetActiveTable: ''
})

const file = ref()

const emptyTips = ref('暂无内容')

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
const defaultHeight = ref('')

const resetTableHeight = () => {
  setTimeout(() => {
    let layoutContentH = 0
    const layoutContent = document.querySelector('.v-layout')
    // const windowHeight = document.documentElement.offsetHeight
    if (layoutContent) {
      layoutContentH = layoutContent.clientHeight
    }
    let topH = 0
    const topWrap = document.querySelector('.filePreview>.el-dialog__header')
    if (topWrap) {
      topH = topWrap.clientHeight + 2
    }
    let bodyP = 0
    const bodyWrap = document.querySelector('.filePreview>.el-dialog__body')
    if (bodyWrap) {
      let computedStyle = getComputedStyle(bodyWrap, null)
      if (computedStyle) {
        bodyP = parseFloat(computedStyle.getPropertyValue('padding-top')) * 2
      }
    }
    console.log('bodyP=>', bodyP)

    let footerH = 0
    const footerWrap = document.querySelector('.filePreview>.el-dialog__footer')
    if (footerWrap) {
      footerH = footerWrap.clientHeight + 2
    }
    if (ElDialogFef.value.isFullscreen) {
      // defaultHeight.value = `${documentClientHeight.value - 30 - 51 - 60}px`
      defaultHeight.value = `${layoutContentH - topH - footerH - bodyP}px`
    } else {
      defaultHeight.value =
        layoutContentH * 0.8 - (props.titleAlign == 'center' ? 35 : 65) - topH - footerH + 'px'
    }
  }, 500)
}

const resizeH = (dialogHeight: any) => {
  defaultHeight.value = isNumber(dialogHeight) ? `${dialogHeight}px` : dialogHeight
}
// 弹窗的开启和关闭
const DialogFlag = ref<any>(false)

const pageTite = ref<string>('')

// const detailsId = ref<number | null>(null)

const fileName = ref<string>('')
const fileurl = ref('')
const ElDialogFef = ref()
//打开drawer并初始化
const openDialog = (name: string, url: string) => {
  resetTableHeight()
  DialogFlag.value = true
  ElDialogFef.value.isFullscreen = false
  fileName.value = name
  fileurl.value = url
  //重置表单
  init()
  pageTite.value = '预览'
}

const toggleFull = (isFull: boolean) => {
  setTimeout(() => {
    let layoutContentH = 0
    const layoutContent = document.querySelector('.v-layout')
    // const windowHeight = document.documentElement.offsetHeight
    if (layoutContent) {
      layoutContentH = layoutContent.clientHeight
    }
    let topH = 0
    const topWrap = document.querySelector('.filePreview>.el-dialog__header')
    if (topWrap) {
      topH = topWrap.clientHeight + 2
    }

    let footerH = 0
    const footerWrap = document.querySelector('.filePreview>.el-dialog__footer')
    if (footerWrap) {
      footerH = footerWrap.clientHeight + 2
    }
    let bodyP = 0
    const bodyWrap = document.querySelector('.filePreview>.el-dialog__body')
    if (bodyWrap) {
      let computedStyle = getComputedStyle(bodyWrap, null)
      if (computedStyle) {
        bodyP = parseFloat(computedStyle.getPropertyValue('padding-top')) * 2
      }
    }
    if (isFull) {
      // defaultHeight.value = `${documentClientHeight.value - 30 - 51 - 60}px`
      defaultHeight.value = `${layoutContentH - topH - footerH - bodyP}px`
    } else {
      defaultHeight.value =
        layoutContentH * 0.8 - (props.titleAlign == 'center' ? 35 : 65) - topH - footerH + 'px'
    }
  }, 500)
}

const init = () => {
  if (fileurl.value != null && fileurl.value != '' && /\.docx/.test(fileurl.value.toLowerCase())) {
    axios
      .request({
        method: 'GET', //
        url: fileurl.value, //路径
        responseType: 'blob' //告诉服务器想到的响应格式
      })
      .then((res) => {
        if (res) {
          // let docx = require("docx-preview");
          docx.renderAsync(res.data, file.value)
        } else {
          // Message.error({ title: "失败", message: "接口请求失败" });
          loading.value = false
        }
      })
      .catch(function () {
        // Message.error({ title: "失败", message: "接口请求失败" });
        loading.value = false
      })
  } else if (
    fileurl.value != null &&
    fileurl.value != '' &&
    /\.xlsx/.test(fileurl.value.toLowerCase())
  ) {
    //表格
    axios
      .request({
        method: 'GET', //这个不解释了吧
        url: fileurl.value, //路径
        responseType: 'arraybuffer', //告诉服务器想到的响应格式
        headers: {
          'Content-Type':
            'application/vnd.ms-excel;application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        }
      })
      .then((res) => {
        if (res) {
          const workbook = XLSX.read(new Uint8Array(res.data), {
            type: 'array'
          })
          const sheetNames = workbook.SheetNames // 工作表名称集合
          excel.value.workbook = workbook
          excel.value.sheetNames = sheetNames
          excel.value.sheetNameActive = sheetNames[0]
          getSheetNameTable(sheetNames[0])
        } else {
          // Message.error({ title: "失败", message: "接口请求失败" });
          loading.value = false
        }
      })
      .catch(function (error) {
        // Message.error({ title: "失败", message: "接口请求失败" });
        loading.value = false
      })
  }
}
// const formRef = ref<FormExpose>()

const isShow = ref<boolean>(false)

const { emitter } = useEmitt({
  name: 'drawer',
  callback: (type: string) => {
    if (type === 'closed') {
      // resetFormAfterClose()
    }
  }
})

// const loading = ref(false)

// 下载文件
const downloadFile = (filePath: any, fileName: any) => {
  axios
    .request({
      method: 'GET', //这个不解释了吧
      url: filePath, //路径
      responseType: 'blob' //告诉服务器想到的响应格式
    })
    .then((res) => {
      let blob = new Blob([res.data])
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.style.display = 'none'
      a.download = fileName
      a.href = url
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      //释放一个通过 URL.createObjectURL() 方法创建的 URL,防止内存泄漏
      URL.revokeObjectURL(url)
    })
}
//关闭drawer
const getSheetNameTable = (sheetName: any) => {
  try {
    // 获取当前工作表的数据
    const worksheet = excel.value.workbook.Sheets[sheetName]
    // 转换为数据  1.json数据有些问题，2.如果是html那么样式需修改
    let htmlData = XLSX.utils.sheet_to_html(worksheet, { header: '', footer: '' })
    htmlData =
      htmlData === ''
        ? htmlData
        : htmlData.replace(
            /<table/,
            '<table class="default-table" border="1px solid #ccc" cellpadding="0" cellspacing="0"'
          )
    // 第一行进行改颜色
    htmlData =
      htmlData === '' ? htmlData : htmlData.replace(/<tr/, '<tr style="background:#b4c9e8"')
    excel.value.SheetActiveTable = htmlData
  } catch (e) {
    // 如果工作表没有数据则到这里来处理
    excel.value.SheetActiveTable = '<h4 style="text-align: center">' + emptyTips.value + '</h4>'
  }
}

const dialogStyle = computed(() => {
  if (
    fileurl.value != null &&
    fileurl.value != '' &&
    /\.png|\.jpg|\.jpeg|\.bmp/.test(fileurl.value.toLowerCase())
  ) {
    return null
  } else {
    return {
      height: unref(defaultHeight),
      maxHeight: unref(defaultHeight)
    }
  }
})

// 注册
onMounted(() => {
  resetTableHeight()
})
defineExpose({
  isShow,
  openDialog
})
</script>

<template>
  <!-- 可设置宽度 :dialogWidth="400" -->
  <Dialog
    ref="ElDialogFef"
    :class="props.isWhite ? 'white-home-class-sub' : ''"
    v-model="DialogFlag"
    :width="'55%'"
    append-to-body
    :title-align="props.titleAlign"
    :title="pageTite"
    @toggle-full="toggleFull"
    @closed="DialogFlag = false"
    class="filePreview"
  >
    <div
      v-if="!/\.docx/.test(fileurl.toLowerCase())"
      :style="dialogStyle"
      style="display: flex; justify-content: center; align-items: center"
    >
      <iframe
        v-if="fileurl != null && fileurl != '' && /\.pdf/.test(fileurl.toLowerCase())"
        :src="fileurl == null || fileurl == '' ? '' : fileurl"
        style="width: 100%; height: 100%"
      ></iframe>
      <div>
        <img
          v-if="
            fileurl != null &&
            fileurl != '' &&
            /\.png|\.jpg|\.jpeg|\.bmp/.test(fileurl.toLowerCase())
          "
          :src="fileurl == null || fileurl == '' ? '' : fileurl"
          style="max-height: 100%"
        />
      </div>

      <div
        style="width: 100%; height: 100%"
        v-if="fileurl != null && fileurl != '' && /\.xlsx/.test(fileurl.toLowerCase())"
      >
        <div class="tab">
          <ElRadioGroup size="small" v-model="excel.sheetNameActive" @change="getSheetNameTable">
            <ElRadioButton v-for="(item, index) in excel.sheetNames" :key="index" :label="item" />
          </ElRadioGroup>
        </div>
        <div class="sheet-wrap">
          <div v-html="excel.SheetActiveTable" class="sheet-content"></div>
        </div>
      </div>
    </div>

    <div
      class="fileWrap"
      ref="file"
      v-if="fileurl != null && fileurl != '' && /\.docx/.test(fileurl.toLowerCase())"
    ></div>
    <template #footer>
      <div class="footer">
        <!-- <ElLink :href="`${fileurl}`" :underline="false" target="_blank"> -->
        <el-button
          type="primary"
          @click="downloadFile(fileurl, fileName)"
          v-if="fileurl"
          class="down-btn-class"
        >
          下载文件</el-button
        >
        <!-- </ElLink> -->
      </div>
    </template>
  </Dialog>
</template>

<style lang="less" scoped>
.sheet-wrap {
  margin-top: 5px;
  border: 1px solid #a0a0a0;
  overflow: auto;
}
.sheet-content {
  padding: 10px 15px;
}
.file-pre {
  height: calc(100vh - 40px);
  padding: 20px;

  .table-html-wrap v-deep table {
    border-right: 1px solid #e8eaec;
    border-bottom: 1px solid #e8eaec;
    border-collapse: collapse;
    margin: auto;
  }

  .table-html-wrap v-deep table td {
    border-left: 1px solid #e8eaec;
    border-top: 1px solid #e8eaec;
    white-space: wrap;
    text-align: left;
    min-width: 100px;
    padding: 4px;
  }

  table {
    border-top: 1px solid #ebeef5;
    border-left: 1px solid #ebeef5;
    width: 100%;
    overflow: auto;

    tr {
      height: 44px;
    }

    td {
      min-width: 200px;
      max-width: 400px;
      padding: 4px 8px;
      border-right: 1px solid #ebeef5;
      border-bottom: 1px solid #ebeef5;
    }
  }

  .el-tabs--border-card {
    // height: calc(100vh - 40px);;
  }

  .el-tabs--border-card > .el-tabs__content {
    overflow: auto;
    height: calc(100vh - 110px);
  }
}

:deep(table) {
  width: 100% !important;
  border-collapse: collapse !important;
  border-spacing: 0 !important;
  text-align: center !important;
  border: 0px !important;
  overflow-x: auto !important;
}

:deep(table tr td) {
  /* border: 1px solid gray !important; */
  border-left: 1px solid gray !important;
  border-right: 1px solid gray !important;
  border-bottom: 1px solid gray !important;
  width: 300px !important;
  height: 33px !important;
}

/**整体样式 */
:deep(.excel-view-container) {
  background-color: #ffffff;
}

/**标题样式 */
:deep(.class4Title) {
  font-size: 22px !important;
  font-weight: bold !important;
  padding: 10px !important;
}

/**表格表头样式 */
:deep(.class4TableTh) {
  /* font-size: 14px !important; */
  font-weight: bold !important;
  padding: 2px !important;
  background-color: #ccc !important;
}

:deep(.el-input-group__append) {
  background-color: white;
  width: 35px;
}

:deep(.docx-wrapper) {
  background-color: #fff;
  padding: 0;
}

:deep(.docx-wrapper > section.docx) {
  width: 100% !important;
  padding: 0rem !important;
  min-height: auto !important;
  box-shadow: none;
  margin-bottom: 0;
}
</style>

<style lang="less">
.filePreview{
  .el-dialog__body {
    padding: 7px !important;
  }
}
.white-home-class-sub {
  .el-dialog__header {
    border-radius: 4px;
    background-color: white !important;
    font-size: 16px !important;
    font-family: Alibaba PuHuiTi M;
    border-bottom: 1px solid var(--tags-view-border-color);
  }
  .el-dialog__body {
    padding: 7px !important;
  }
}

.el-button.down-btn-class {
  height: 3.5vh !important;
  font-size: 14px !important;
  span {
    font-size: 1em !important;
  }
}
</style>
