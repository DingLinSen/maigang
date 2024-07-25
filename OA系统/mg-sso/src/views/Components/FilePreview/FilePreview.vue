<!-- 文件预览 -->

<script setup lang="ts">
// import { Form, FormExpose } from '@/components/Form'
import {
  ref,
  unref,
  reactive,
  nextTick,
  getCurrentInstance,
  inject,
  watch,
  computed,
  onMounted
} from 'vue'
// import { ContentWrap } from '@/components/ContentWrap'
import { propTypes } from '@/utils/propTypes'
// import { DrawerWrap } from '@/components/DrawerWrap'
// import { useEmitt } from '@/hooks/web/useEmitt'
// import { useValidator } from '@/hooks/web/useValidator'
// import { FormSchema } from '@/types/form'
import { Dialog } from '@/components/Dialog'
// import { CultivateData } from '@/api/project/cultivate/types'
// import {
//   saveCultivateApi, // 新增
//   editCultivateApi, // 编辑
//   getCultivateApi, // 获取信息
//   changePrincipalPersonCultivateApi // 变更人
// } from '@/api/project/cultivate'
// import { ComponentOptions } from '@/types/components'
import {
  ElButton,
  ElMessage,
  ElTooltip,
  ElTimePicker,
  ElRadioGroup,
  ElRadioButton
} from 'element-plus'
import { useEmitt } from '@/hooks/web/useEmitt'
import { isNumber } from '@/utils/is'
import { useAppStore } from '@/store/modules/app'
import axios from 'axios'
import * as docx from 'docx-preview'
import * as XLSX from 'xlsx'

const loading = ref<boolean>(false)
// const emit = defineEmits(['changeGetDetailAndList'])
const appStore = useAppStore()
// const { proxy } = getCurrentInstance() as any
// const { province } = proxy.useDict('province')

// const { required } = useValidator()

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

const resetTableHeight = () => {
  defaultHeight.value = documentClientHeight.value * 0.6
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
  DialogFlag.value = true
  ElDialogFef.value.isFullscreen = false
  fileName.value = name
  fileurl.value = url
  //重置表单
  init()
  pageTite.value = '预览'
}

const toggleFull = (isFull: boolean) => {
  if (isFull) {
    defaultHeight.value = documentClientHeight.value * 0.8
  } else {
    defaultHeight.value = documentClientHeight.value * 0.6
  }
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
        console.log(res)
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
        // console.log(error);
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
        console.log(res, 'res')
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
        console.log(error)
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
    custom-class="cultivate-custom"
    v-model="DialogFlag"
    append-to-body
    :title="pageTite"
    :maxHeight="'auto'"
    @toggle-full="toggleFull"
    @closed="DialogFlag = false"
  >
    <div
      v-if="!/\.docx/.test(fileurl.toLowerCase())"
      :style="
        fileurl != null && fileurl != '' && /\.png|\.jpg|\.jpeg|\.bmp/.test(fileurl.toLowerCase())
          ? null
          : { maxHeight: defaultHeight + 'px', height: defaultHeight + 'px' }
      "
      style="display: flex; justify-content: center; align-items: center"
    >
      <iframe
        v-if="fileurl != null && fileurl != '' && /\.pdf/.test(fileurl.toLowerCase())"
        :src="fileurl == null || fileurl == '' ? '' : fileurl"
        style="width: 100%; height: 100%"
      ></iframe>
      <img
        v-if="
          fileurl != null && fileurl != '' && /\.png|\.jpg|\.jpeg|\.bmp/.test(fileurl.toLowerCase())
        "
        :src="fileurl == null || fileurl == '' ? '' : fileurl"
        style="max-width: 100%; max-height: 100%"
      />

      <div
        style="width: 100%; height: 100%"
        v-if="fileurl != null && fileurl != '' && /\.xlsx/.test(fileurl.toLowerCase())"
      >
        <div class="tab">
          <ElRadioGroup size="small" v-model="excel.sheetNameActive" @change="getSheetNameTable">
            <ElRadioButton v-for="(item, index) in excel.sheetNames" :key="index" :label="item" />
          </ElRadioGroup>
        </div>
        <div style="margin-top: 5px; border: 1px solid #a0a0a0; overflow: auto">
          <div v-html="excel.SheetActiveTable" style="padding: 10px 15px"></div>
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
        <el-button type="primary" @click="downloadFile(fileurl, fileName)"> 下载文件 </el-button>
        <!-- </ElLink> -->
      </div>
    </template>
  </Dialog>
</template>

<style lang="less" scoped>
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
