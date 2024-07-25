<script setup lang="ts">
import { ref, watch, nextTick, reactive, toRefs, unref, getCurrentInstance } from 'vue'
import { ElMessage, ElUpload } from 'element-plus'
import VueOfficeExcel from '@vue-office/excel'
import VueOfficeDocx from '@vue-office/docx'
import axios from 'axios'

import '@vue-office/excel/lib/index.css'
import '@vue-office/docx/lib/index.css'
// import { download } from '@/api/common'
const props = defineProps({
  fileItem: {
    type: Object,
    default: () => {
      return {}
    }
  }
})
const emit = defineEmits(['uploadSuccess'])
const loading = ref(false)
const { proxy } = getCurrentInstance() as any
const fileType = ref<String>('')
const imgList = ['jpg', 'png', 'jpeg', 'bmp', 'gif']
const wordList = ['doc', 'docx']
const excelList = ['xls', 'xlsx']
const pptList = ['ppt', 'pptx']
const data = reactive({
  excel: {
    // 数据
    workbook: {
      Sheets: {}
    },
    // 表名称集合
    sheetNames: [],
    // 激活项
    sheetNameActive: '',
    // 当前激活表格
    SheetActiveTable: ''
  }
})
const { excel } = toRefs(data)
watch(
  () => props.fileItem,
  (val: any) => {
    const list = val.url.split('.')
    const type = list[list.length - 1]
    fileType.value = type
    if (imgList.includes(type.toLowerCase())) {
      fileType.value = 'img'
    }
    // if (wordList.includes(type)) {
    //   fileType.value = 'word'
    // }
    // if (excelList.includes(type)) {
    //   fileType.value = 'excel'
    // }
    // if (pptList.includes(type)) {
    //   fileType.value = 'ppt'
    // }
    nextTick(() => {})
  },
  {
    immediate: true
    // deep: true
  }
)
</script>

<template>
  <div class="file-preview-content">
    <!-- <h1>{{ props.fileItem.name }}</h1> -->
    <div class="file-content">
      <template v-if="fileType === 'img'">
        <img :src="props.fileItem.url" alt="" />
      </template>
      <template v-if="fileType === 'mp4' || fileType === 'MP4'">
        <video controls :src="props.fileItem.url"></video>
      </template>
      <template v-else-if="fileType === 'doc'">
        <iframe
          class="child"
          frameborder="0"
          :src="
            'https://view.officeapps.live.com/op/view.aspx?src=' +
            encodeURIComponent(props.fileItem.url)
          "
        ></iframe>
      </template>
      <template v-else-if="fileType === 'docx'">
        <vue-office-docx :src="props.fileItem.url" />
      </template>
      <template v-else-if="fileType === 'xlsx'">
        <vue-office-excel :src="props.fileItem.url" />
      </template>
      <template v-else-if="fileType === 'pdf'">
        <iframe :src="props.fileItem.url" frameborder="0"></iframe>
      </template>
    </div>
  </div>
</template>
<style lang="less" scoped>
.file-preview-content {
  height: 100%;
}
h1 {
  font-size: 20px;
  text-align: center;
}
.file-content {
  width: 100%;
  height: 100%;
  text-align: center;
  display: flex;
  justify-content: center;
  align-items: center;
  img {
    margin: 0 auto;
  }
  iframe {
    width: 100%;
    height: 100%;
  }
  .vue-office-excel {
    width: 100%;
  }

  .vue-office-docx {
    width: 100%;
  }
}
</style>
