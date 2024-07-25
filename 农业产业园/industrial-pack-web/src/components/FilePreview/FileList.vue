<script setup lang="ts">
import { ref } from 'vue'
import { ElMessage, ElUpload } from 'element-plus'
import { Dialog } from '@/components/Dialog'
import { FilePreview } from './index'
import { downloadFileCommon } from '@/api/common'
const props = defineProps({
  fileList: {
    type: Array,
    default: () => {
      return []
    }
  },
  uploadName: {
    type: String,
    default: ''
  },
  uploadUrl: {
    type: String,
    default: ''
  },
  downloadUrl: {
    type: String,
    default: ''
  }
})
const emit = defineEmits(['uploadSuccess'])
const currentItem = ref<any>()
const isShowPreview = ref(false)
const closeDialog = () => {
  isShowPreview.value = false
}
const previewList = ['jpg', 'png', 'jpeg', 'bmp', 'gif', 'docx', 'xlsx', 'pdf']
const preview = (item) => {
  const list = item.url.split('.')
  const type = list[list.length - 1]

  if (previewList.includes(type.toLowerCase())) {
    currentItem.value = item
    isShowPreview.value = true
  } else {
    // window.open(item.url)
    let link = document.createElement('a')
    link.href = item.url
    link.setAttribute('download', item.name) // 下载文件的名字
    document.body.appendChild(link)
    link.style.display = 'none'
    link.click()
    document.body.removeChild(link)
  }
}
const downloadFile = async (item) => {
  console.log('downloadFile', item)

  const param = {}
  const res: any = await downloadFileCommon(item.url, param, item.name)
  if (res) {
    ElMessage.success('下载成功！')
  }
}
</script>

<template>
  <div class="file-view-content">
    <div class="file-item" v-for="(item, index) in fileList" :key="index">
      <span class="name">{{ item?.name }}</span>
      <span class="preview">
        <Icon icon="ep:view" class="mr-5px" @click="preview(item)" />
        <Icon icon="ep:download" class="ml-5px" @click="downloadFile(item)" />
      </span>
    </div>
  </div>
  <Dialog
    v-model="isShowPreview"
    :modelClose="true"
    :modal="true"
    :modal-class="'file-preview-modal'"
    :width="'70%'"
    title="查看"
    @closed="closeDialog"
  >
    <FilePreview :fileItem="currentItem" />
  </Dialog>
</template>
<style lang="less" scoped>
.file-item {
  .preview {
    display: flex;
    .el-icon {
      &:hover {
        color: #1263ef;
      }
    }
  }
}
.file-view-content {
  .file-item {
    .name {
      width: 93%;
      word-wrap: break-word;
    }
  }
}
</style>
