<script setup lang="ts">
import {
  ElButton,
  genFileId,
  ElMessage,
  ElUpload,
  ElLink,
  UploadRawFile,
  ElLoading,
  UploadFile,
  UploadStatus
} from 'element-plus'
import { ref, onMounted, nextTick, computed, watch, unref } from 'vue'
import { useCache } from '@/hooks/web/useCache'
import type { UploadUserFile } from 'element-plus'
import { downloadFile } from '@/utils/index'
import { PATH_URL } from '@/config/axios/service'
import FilePreview from '@/views/Components/FilePreview/FilePreview.vue'

const { wsCache } = useCache()

const props = defineProps({
  modelValue: [String, Object, Array],
  splitter: {
    type: String,
    default: ','
  },
  buttonText: {
    type: String,
    default: '上传附件'
  },
  // 是否多选
  isMultiple: {
    type: Boolean,
    default: false
  },
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
    default: 500
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

const emit = defineEmits(['update:modelValue', 'updateModelValue', 'changeFileUrl'])

const fileUpload = ref<any>()
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
      const list = Array.isArray(val) ? val : (props.modelValue as string).split(props.splitter)
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
const handleExceed = (files: any) => {
  ElMessage.error(`上传文件数量不能超过 ${props.limit} 个!`)
}

// 上传失败
const handleUploadError = (err: Error) => {
  ElMessage.error('上传文件失败')
  number.value--
  uploadloadLoadingInstance.close()
}

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
  console.log('uploadedSuccessfully==>1==>', fileList.value)
  console.log('uploadedSuccessfully==>2==>', uploadList.value)

  if (number.value > 0 && uploadList.value.length === number.value) {
    if (props.isMultiple) {
      fileList.value = fileList.value.filter((f) => f.url !== undefined).concat(uploadList.value)
    } else {
      fileList.value = uploadList.value
    }

    uploadList.value = []
    number.value = 0
    console.log('uploadedSuccessfully==>3==>', fileList.value)

    emit('update:modelValue', listToString(fileList.value, null))
    emit('updateModelValue', listToString(fileList.value, null))
    emit('changeFileUrl', listToString(fileList.value, null))
    uploadloadLoadingInstance.close()
  }
}

// 删除文件
const handleDelete = (index: number) => {
  fileList.value.splice(index, 1)
  console.log('update:modelValue', 345678)
  emit('update:modelValue', listToString(fileList.value, null))
  emit('changeFileUrl', listToString(fileList.value, null))
}

// 对象转成指定字符串分隔
const listToString = (list: UploadUserFile[], separator: string | null) => {
  let strs = ''
  separator = separator || props.splitter
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
    <!-- 文件列表 -->
    <transition-group class="el-upload-list el-upload-list--text" name="el-fade-in-linear" tag="ul">
      <div v-if="fileList.length">
        <li
          :key="file.uid"
          class="el-upload-list__item ele-upload-list__item-content"
          v-for="(file, index) in fileList"
        >
          <!-- 文件名 -->
          <!-- <ElLink :underline="false">
            <span class="el-icon-document" @click="downloadFile(file.url, getFileName(file.url))">
              {{ getFileName(file.url) }}
            </span>
          </ElLink> -->

          <el-tooltip :content="getFileName(file.url)">
            <span class="file-name-class" @click="handleView(index)">
              {{ getFileName(file.url) }}
            </span>
          </el-tooltip>

          <!-- 删除按钮 -->
          <div class="ele-upload-list__item-content-action action-wrap">
            <img
              src="@/assets/imgs/order/delete_icon.png"
              class="delete-btn"
              v-if="!disabled"
              @click="handleDelete(index)"
            />
            <!-- <ElLink :underline="false" @click="handleDelete(index)" type="danger">删除</ElLink> -->
            <img
              src="@/assets/imgs/order/view_icon.png"
              class="pre-btn"
              @click="handleView(index)"
            />
          </div>
        </li>
      </div>
    </transition-group>
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
      class="upload-file-uploader upload-demo"
      ref="fileUpload"
      drag
    >
      <template #trigger>
        <div class="upload-button-class flex items-center">
          <img src="@/assets/imgs/icon/sc_icon.png" /> <span> {{ buttonText }}</span>
        </div>
      </template>
    </ElUpload>
    <div
      v-if="disabled && !fileList.length"
      class="el-upload-list__item ele-upload-list__item-content"
    >
      <sapn class="no-data-class">暂无文件信息</sapn>
    </div>
  </div>
  <FilePreview title="预览" ref="FilePreviewRef" />
</template>

<style scoped lang="less">
.action-wrap {
  display: inline-flex;
  margin-right: 5px;
}
.pre-btn {
  padding: 10px 0px;
  margin-left: 12px;
  cursor: pointer;
}
.delete-btn {
  padding: 10px 0px;
  cursor: pointer;
}
.no-data-class {
  height: 34px;
  line-height: 34px;
  font-size: 14px;
  color: #444444;
}
:deep(.el-upload-dragger) {
  border: none;
  padding: 0;
}
:deep(.upload-file-uploader) {
  // margin-bottom: 5px;
}
:deep(.upload-file-list .el-upload-list__item) {
  border: 1px solid #e4e7ed;
  line-height: 2;
  margin-bottom: 10px;
  position: relative;
}

.upload-file {
  width: 100% !important;
}
:deep(.el-upload-list__item) {
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

.upload-button-class {
  height: 36px;
  background: #f5fbfe;
  border: #99d9f6 1px dashed;
  border-radius: 5px;
  padding: 14px;
  font-size: 14px;
  color: #00a0e9;
  max-width: 99px;
}
.file-name-class {
  margin: 6px 0px;
  font-size: 14px;
  color: #444444;
  cursor: pointer;
  flex: 1;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
.file-name-class:hover {
  color: #00a0e9;
}
</style>
