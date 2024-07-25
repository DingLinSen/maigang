<script setup lang="ts">
import { ref, inject } from 'vue'
import { PATH_URL } from '@/config/axios/service'
import { useCache } from '@/hooks/web/useCache'
import { downloadFile } from '@/utils/index'

const { wsCache } = useCache()
import { ElButton, ElMessage, ElUpload, UploadFile } from 'element-plus'

const props = defineProps({
  showUpload: {
    type: Boolean,
    default: true
  },
  title: {
    type: String,
    default: ''
  },
  modelValue: {
    type: String,
    default: ''
  },
  fileName: {
    type: String,
    default: ''
  }
})

const emit = defineEmits(['update:modelValue', 'update:fileName'])
//请求头
const headers = ref({ Authorization: wsCache.get('access_token') })
const uploadFileUrl = ref(PATH_URL + '/mgdaas-file/upload') // 上传文件服务器地址

// 上传成功
const handleSuccess = (res: any, file: UploadFile) => {
  if (res.code === '00000') {
    emit('update:modelValue', res.data.url)
    emit('update:fileName', res.data.name)
    ElMessage.success('上传文件成功')
  } else {
    ElMessage.error(res.tip || res.message)
  }
}

const handleBeforeUpload: any = (file) => {
  if (file.name.split('.')[0].length > 50) {
    ElMessage.error('文件名长度不能超过50个字符！')
    return false
  }
  const extension = file.name.split('.').pop().toLowerCase()
  const isLt = file.size / 1024 / 1024 < 100
  if (!isLt) {
    ElMessage.error(`上传文件大小不能超过100 MB!`)
    return false
  }
  if (extension !== 'doc' && extension !== 'docx' && extension !== 'pdf') {
    ElMessage.error('只能上传pdf和word格式的文件！')
    return false // 阻止文件上传
  }
  return true // 允许文件上传
}
const forbidden = inject('forbidden')
// 删除文件
const handleDelete = () => {
  emit('update:modelValue', '')
  emit('update:fileName', '')
}
// 上传失败
const handleUploadError = (err: Error) => {
  ElMessage.error('上传文件失败')
}
</script>
<template>
  <section class="w-full">
    <el-row v-if="showUpload">
      <el-col :span="8">
        <el-upload
          v-model="props.modelValue"
          class="headSculpture-upload"
          :action="uploadFileUrl"
          :headers="headers"
          :on-error="handleUploadError"
          :before-upload="handleBeforeUpload"
          :on-success="handleSuccess"
        >
          <el-button class="head-sculpture-btn flex justify-center">
            <img class="-ml-1 mr-4px" src="@/assets/imgs/icon/sc_icon.png" />
            <span>上传文件</span>
          </el-button>
        </el-upload>
      </el-col>
      <el-col :span="13">
        <div
          class="flie_upload cursor-pointer ml-1 text-blue-500"
          @click="downloadFile(props.modelValue, props.fileName)"
          :title="props.fileName"
          >{{ props.fileName }}</div
        >
      </el-col>
      <el-col :span="3">
        <div class="ele-upload-list__item-content-action ml-1" v-if="props.fileName">
          <ElLink :underline="false" @click="handleDelete()" type="danger" class="truncate"
            >删除</ElLink
          >
        </div>
      </el-col>
    </el-row>
    <el-row v-else>
      <el-col :span="21">
        <div
          class="flie_upload flie_upload_none cursor-pointer text-blue-500"
          @click="downloadFile(props.modelValue, props.fileName)"
          :title="props.fileName"
          >{{ props.fileName }}</div
        >
      </el-col>
    </el-row>
  </section>
</template>
<style lang="less">
.headSculpture-upload .el-upload-list {
  display: none !important;
}
.flie_upload {
  padding-left: 14px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.flie_upload_none {
  padding-left: 0;
}
</style>
<style>
.head-sculpture-btn {
  height: 32px !important;
  margin-top: -2px;
  color: #00a0e9;
  border-top: 1px dashed #00a0e9;
  border-bottom: 1px dashed #00a0e9;
  border-left: 1px solid #00a0e9;
  border-right: 1px solid #00a0e9;
  font-size: 14px;
}
</style>
