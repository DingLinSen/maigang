<script setup lang="ts">
import { ElMessage, ElUpload } from 'element-plus'
import { UploadFilled } from '@element-plus/icons-vue'
import { ref } from 'vue'
import { uploldFile, download } from '@/api/common'
const props = defineProps({
  tipUpload: {
    type: String,
    default: ''
  },
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
  },
  downloadApi: {
    type: Function,
    default: () => {
      return ''
    }
  },
  // 插槽显示
  importParams: {
    type: Boolean,
    default: () => {
      return false
    }
  },
  // 显示上传框
  showUpload: {
    type: Boolean,
    default: () => {
      return true
    }
  },
  uploadParams: {
    type: Object,
    default: () => {
      return {}
    }
  }
})
//上传Url
// const baseUrl = import.meta.env.VITE_APP_BASE_API
// const { proxy } = getCurrentInstance() as any
const emit = defineEmits(['uploadSuccess'])
const uploadFileUrl = ref(props.uploadUrl) // 上传文件服务器地址

const uploadSuccess = (_: any, __: any, ___: any) => {
  // console.log('uploadSuccess', res, file, fileList)
}
const uploadChange = (_: any, __: any) => {
  // console.log('uploadChange', file, fileList)
}
const isImport = ref(false)
const beforeUpload: any = (file) => {
  if (file.size > 1024 * 1024 * 10) {
    isImport.value = true
    uploadModal.value.clearFiles()
    return ElMessage.error('文件最大不超过10M')
  }
  const list = ['xls', 'xlsx']
  const arr = file.name.split('.')
  const type = arr[arr.length - 1]
  if (!list.includes(type)) {
    isImport.value = true
    uploadModal.value.clearFiles()
    return ElMessage.error('只支持 .xls .xlsx格式文件')
  }
  isImport.value = false
}
const uploadModal = ref()
const uploadCustom = async (param) => {
  if (isImport.value) {
    return
  }
  const res: any = await uploldFile(uploadFileUrl.value, param, props.uploadParams)

  if (res && res.data) {
    ElMessage.success(res.data)
    emit('uploadSuccess', '')
  }
  uploadModal.value.clearFiles()
}
const downloadTempalte = async () => {
  const param = {}
  if (!props.downloadUrl) {
    const res: any = await props.downloadApi(param)
    if (res) {
      ElMessage.success('下载成功！')
    }
    return
  }
  const res: any = await download(props.downloadUrl, param, `${props.uploadName}模板.xlsx`)
  if (res) {
    ElMessage.success('下载成功！')
  }
}
</script>

<template>
  <div class="upload-content">
    <h3>导入数据</h3>
    <div class="upload-tips">
      请先选择 <span>“下载模板”</span> ，根据模板提供的内容样式填充对应数据，然后选择文件上传。
    </div>
    <div class="import-params" v-if="importParams">
      <slot name="importParams"></slot>
    </div>
    <ElUpload
      v-if="showUpload"
      class="upload-demo upload-modal"
      drag
      ref="uploadModal"
      :http-request="uploadCustom"
      :before-upload="beforeUpload"
      :on-success="uploadSuccess"
      :on-change="uploadChange"
      :action="''"
      :multiple="false"
      accept=".xls, .xlsx"
      :limit="1"
    >
      <el-icon class="el-icon--upload" style="color: #409eff"><upload-filled /></el-icon>
      <div class="el-upload__text">
        温馨提示：文件建议不超过10M，只支持 .xls .xlsx格式文件。
        <!-- <em>click to upload</em> -->
      </div>
      <template #tip>
        <!--        <div class="el-upload__tip"> 注：只能上传 xls xlsx 格式的文件 </div>-->
      </template>
    </ElUpload>
    <p class="tip-upload">{{ props.tipUpload }}</p>
    <el-button class="down-template" type="danger" @click="downloadTempalte()">下载模板</el-button>
  </div>
</template>
<style lang="less" scoped>
h3 {
  text-align: center;
  font-size: 20px;
  font-weight: bold;
  color: rgb(60, 154, 76);
  padding-bottom: 10px;
  border-bottom: 1px solid #ccc;
}
.upload-tips {
  margin: 10px 0;
  span {
    color: #c44537;
  }
}
.down-template {
  width: 100%;
}
.tip-upload {
  font-size: 12px;
  color: #f56c6c;
  padding-bottom: 10px;
}
</style>
