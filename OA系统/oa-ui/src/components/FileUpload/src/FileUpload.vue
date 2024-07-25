<script setup lang="ts">
import {
  ElButton,
  ElMessage,
  ElUpload,
  ElLink,
  UploadRawFile,
  ElLoading,
  UploadFile,
  UploadStatus
} from 'element-plus'
import { ref, onMounted, computed, watch, unref } from 'vue'
import { useCache } from '@/hooks/web/useCache'
import type { UploadUserFile } from 'element-plus'
import { downloadFile } from '@/utils/index'
import { PATH_URL } from '@/config/axios/service'
import FilePreview from '@/views/Components/FilePreview/FilePreview.vue'

const { wsCache } = useCache()

const props = defineProps({
  modelValue: [String, Object, Array],
  // 数量限制
  disabled: {
    type: Boolean,
    default: false
  },
  // 数量限制
  limit: {
    type: Number,
    default: 5
  },
  // 大小限制(MB)
  fileSize: {
    type: Number,
    default: 100
  },
  // 文件类型, 例如['png', 'jpg', 'jpeg']
  fileType: {
    type: Array,
    default: () => ['doc', 'xls', 'ppt', 'txt', 'pdf']
  },
  // 是否显示提示
  isShowTip: {
    type: Boolean,
    default: true
  }
})

const emit = defineEmits(['update:modelValue', 'updateModelValue'])

//最多上传文件个数
const number = ref<number>(0)

//上传文件集合
const uploadList = ref<UploadUserFile[]>([])

//上传Url
const baseUrl = PATH_URL

const uploadFileUrl = ref(PATH_URL + '/mgdaas-file/upload') // 上传文件服务器地址
//请求头
const headers = ref({ Authorization: wsCache.get('access_token') })
//上传成功后的文件集合
const fileList = ref<UploadUserFile[]>([])
const showTip = computed(() => props.isShowTip && (props.fileType || props.fileSize))
watch(
  () => props.modelValue,
  (val) => {
    if (val) {
      let temp = 1
      // 首先将值转为数组
      const list = Array.isArray(val) ? val : (props.modelValue as string).split(',')
      // 然后将数组转为对象数组
      fileList.value = list.map((item) => {
        if (typeof item === 'string') {
          item = { name: item, url: item }
        }
        item.uid = item.uid || new Date().getTime() + temp++
        return item
      })
    } else {
      fileList.value = []
      return []
    }
  },
  { deep: true, immediate: true }
)

let uploadloadLoadingInstance: any

// 上传前校检格式和大小
const handleBeforeUpload = (file: UploadRawFile) => {
  const nameLength = file.name.length
  if (nameLength > 60) {
    ElMessage.error('上传文件名长度不能超过60个字符!')
    return false
  }
  // 校检文件类型
  if (props.fileType.length) {
    const fileName = file.name.split('.')
    const fileExt = fileName[fileName.length - 1]
    const isTypeOk = props.fileType.indexOf(fileExt.toLowerCase()) >= 0
    if (!isTypeOk) {
      ElMessage.error(`文件格式不正确, 请上传${props.fileType.join('/')}格式文件!`)
      return false
    }
  }
  // 校检文件大小
  if (props.fileSize) {
    const isLt = file.size / 1024 / 1024 < props.fileSize
    if (!isLt) {
      if (props.fileSize / 1024 < 1) {
        ElMessage.error(`上传文件大小不能超过 ${props.fileSize} MB!`)
      } else {
        ElMessage.error(`上传文件大小不能超过 ${props.fileSize / 1024} GB!`)
      }
      return false
    }
  }
  uploadloadLoadingInstance = ElLoading.service({
    text: '正在上传文件，请稍候...',
    background: 'rgba(0, 0, 0, 0.7)'
  })
  number.value++
  return true
}

// 文件个数超出
const handleExceed = () => {
  ElMessage.error(`上传文件数量不能超过 ${props.limit} 个!`)
}

// 上传失败
const handleUploadError = (err: Error) => {
  ElMessage.error('上传文件失败')
}

const fileUpload = ref<ComponentRef<typeof ElUpload>>()
// 上传成功回调
const handleUploadSuccess = (res: any, file: UploadFile) => {
  if (res.code === '00000') {
    console.log(res.data)
    ElMessage.success('上传文件成功')
    uploadList.value.push({ name: res.data.name, url: res.data.url })
    uploadedSuccessfully()
  } else {
    number.value--
    uploadloadLoadingInstance.close()
    ElMessage.error(res.tip || res.message)
    unref(fileUpload)?.handleRemove(file)
    uploadedSuccessfully()
  }
}

// 上传结束处理
function uploadedSuccessfully() {
  console.log(fileList.value)
  console.log(uploadList.value)

  if (number.value > 0 && uploadList.value.length === number.value) {
    fileList.value = fileList.value.filter((f) => f.url !== undefined).concat(uploadList.value)
    uploadList.value = []
    number.value = 0
    console.log(fileList.value)

    emit('update:modelValue', listToString(fileList.value, null))
    emit('updateModelValue', listToString(fileList.value, null))
    uploadloadLoadingInstance.close()
  }
}

// 删除文件
const handleDelete = (index: number) => {
  fileList.value.splice(index, 1)
  console.log('update:modelValue', 345678)
  emit('update:modelValue', listToString(fileList.value, null))
}

// 对象转成指定字符串分隔
const listToString = (list: UploadUserFile[], separator: string | null) => {
  let strs = ''
  separator = separator || ','
  for (let i in list) {
    if (list[i].url) {
      strs += list[i].url + separator
    }
  }
  return strs != '' ? strs.substr(0, strs.length - 1) : ''
}

// 获取文件名称
const getFileName = (name: any) => {
  console.log(name)

  if (name.lastIndexOf('/') > -1) {
    return name.slice(name.lastIndexOf('/') + 1)
  } else {
    return ''
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

const handleView = (index: number) => {
  let fileUrl = fileList.value[index]
  if (
    fileNext(fileUrl.url) === 'doc' ||
    fileNext(fileUrl.url) === 'zip' ||
    fileNext(fileUrl.url) === 'rar' ||
    fileNext(fileUrl.url) === 'xls' ||
    fileNext(fileUrl.url) === 'bmp'
  ) {
    downloadFile(fileUrl.url, getFileName(fileUrl.url))
  } else {
    previewFile(getFileName(fileUrl.url), fileUrl.url)
  }
}
</script>

<template>
  <div class="upload-file">
    <ElUpload
      v-if="!disabled"
      multiple
      :action="uploadFileUrl"
      :before-upload="handleBeforeUpload"
      :file-list="fileList"
      :limit="limit"
      :on-error="handleUploadError"
      :on-exceed="handleExceed"
      :on-success="handleUploadSuccess"
      :show-file-list="false"
      :headers="headers"
      class="upload-file-uploader"
      ref="fileUpload"
      drag
    >
      <!-- 上传按钮 -->
      <!-- <ElButton type="primary">选取文件</ElButton> -->
      <Icon class="el-icon--upload" icon="ep:upload-filled" />
      <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
    </ElUpload>
    <!-- 上传提示 -->
    <div class="el-upload__tip" v-if="showTip && !disabled">
      请上传
      <template v-if="fileSize">
        大小不超过
        <b style="color: #f56c6c">{{
          fileSize / 1024 < 1 ? fileSize + 'MB' : fileSize / 1024 + 'GB'
        }}</b>
      </template>
      <template v-if="fileType">
        格式为 <b style="color: #f56c6c">{{ fileType.join('/') }}</b>
      </template>
      的文件
    </div>
    <!-- 文件列表 -->
    <transition-group class="el-upload-list el-upload-list--text" name="el-fade-in-linear" tag="ul">
      <div v-if="fileList.length">
        <li
          :key="file.uid"
          class="el-upload-list__item ele-upload-list__item-content"
          v-for="(file, index) in fileList"
        >
          <!-- 文件名 -->
          <ElLink :underline="false">
            <span class="el-icon-document" @click="handleView(index)">
              {{ getFileName(file.url) }}
            </span>
          </ElLink>
          <!-- 删除按钮 -->
          <div class="ele-upload-list__item-content-action" v-if="!disabled">
            <ElLink :underline="false" @click="handleDelete(index)" type="danger">删除</ElLink>
          </div>
        </li>
      </div>
      <!-- <li v-if="!fileList.length && disabled" class="text-sm">暂无数据</li> -->
    </transition-group>

    <div v-if="disabled && !fileList.length" class="nodata">
      <sapn class="no-data-class"
        >暂无文件信息</sapn
      >
    </div>
  </div>
  <FilePreview title="预览" ref="FilePreviewRef" />
</template>

<style scoped lang="less">
:deep(.el-icon--upload){
  font-size: 67px !important;
}
.no-data-class {
  height: 34px;
  line-height: 34px;
  font-size: 14px;
  color: #444444;
}
:deep(.upload-file-uploader) {
  margin-bottom: 5px;
}
:deep(.upload-file-list .el-upload-list__item) {
  border: 1px solid #e4e7ed;
  line-height: 2;
  margin-bottom: 10px;
  position: relative;
}

:deep(.el-upload-list__item) {
  display: flex;
  justify-content: space-between;
}
:deep(.upload-file-list .ele-upload-list__item-content) {
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: inherit;
}
:deep(.el-upload-list) {
  margin: 0;
}
:deep(.ele-upload-list__item-content-action .el-link) {
  margin-right: 10px;
}

.nodata {
  display: flex;
  justify-content: space-between;
  min-height: 36px;
  background: #f9f9f9;
  border: 1px solid #e2e2e2;
  border-radius: 2px;
  padding-left: 12px;
  padding-right: 12px;
  margin-top: 10px;
  align-items: center;
}
</style>
