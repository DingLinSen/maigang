<script setup lang="ts">
import { ref, computed, watch, unref } from 'vue'
import { ElMessage, ElUpload, ElLink, UploadRawFile, ElLoading, UploadFile } from 'element-plus'
import type { UploadProps, UploadUserFile } from 'element-plus'
import { useCache } from '@/hooks/web/useCache'
import { uploldFile, downloadFileCommon } from '@/api/common'
import { Plus } from '@element-plus/icons-vue'
import { Dialog } from '@/components/Dialog'
import { FilePreview } from '@/components/FilePreview/index'

const { wsCache } = useCache()

const props = defineProps({
  modelValue: [String, Object, Array],
  // 数量限制
  limit: {
    type: Number,
    default: 10
  },
  // 大小限制(MB)
  fileSize: {
    type: Number,
    default: 10
  },
  // 文件名长度
  fileNameLength: {
    type: Number,
    default: 100
  },
  // 文件类型, 例如['png', 'jpg', 'jpeg']
  fileType: {
    type: Array,
    default: () => [
      'xls',
      'xlsx',
      'doc',
      'docx',
      'ppt',
      'pptx',
      'pdf',
      'txt',
      'bmp',
      'gif',
      'jpg',
      'jpeg',
      'png'
    ]
  },
  // 是否显示提示
  isShowTip: {
    type: Boolean,
    default: true
  },
  // 是否是查看
  isSee: {
    type: Boolean,
    default: false
  },
  uploadUrl: {
    type: String,
    default: '/mgdaas-file/upload'
  },
  isPreviewImg: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['update:modelValue', 'upload-file-success'])
const isImport = ref(false)
//最多上传文件个数
const number = ref<number>(0)

//上传文件集合
const uploadList = ref<UploadUserFile[]>([])

//上传Url
const baseUrl = import.meta.env.VITE_APP_BASE_API

// const uploadFileUrl = ref(import.meta.env.VITE_APP_BASE_API + '/mgdaas-file/upload') // 上传文件服务器地址
//请求头
const headers = ref({ Authorization: wsCache.get('Admin-Token') })
//上传成功后的文件集合
const fileList: any = ref<UploadUserFile[]>([])
const showTip = computed(() => props.isShowTip && (props.fileType || props.fileSize))
watch(
  () => props.modelValue,
  (val) => {
    if (val) {
      let temp = 1
      // 首先将值转为数组
      const list = Array.isArray(val) ? val : (props.modelValue as string).split(',')

      // 然后将数组转为对象数组
      fileList.value = list.map((item: any) => {
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
  if (props.fileNameLength) {
    if (file.name.length > props.fileNameLength) {
      ElMessage.error('文件名最大不超过' + props.fileNameLength)
      return false
    }
  }
  // 校检文件大小
  if (props.fileSize) {
    const isLt = file.size / 1024 / 1024 < props.fileSize
    if (!isLt) {
      ElMessage.error(`上传文件大小不能超过 ${props.fileSize} MB!`)
      return false
    }
  }

  uploadloadLoadingInstance = ElLoading.service({
    text: '正在上传文件，请稍候...',
    background: 'rgba(0, 0, 0, 0.7)'
  })
  number.value++
  isImport.value = true

  return true
}

// 文件个数超出
const handleExceed = (files) => {
  if (fileList.value.length > props.limit || files.length > props.limit) {
  }
  ElMessage.error(`上传文件数量不能超过 ${props.limit} 个!`)
}

// 上传失败
const handleUploadError = (err: Error) => {
  ElMessage.error('上传文件失败：' + err)
}

const fileUpload = ref<ComponentRef<typeof ElUpload>>()
// 上传成功回调
const handleUploadSuccess = (res: any, file: UploadFile) => {
  if (res.code === '00000') {
    ElMessage.success('上传成功')
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
  if (number.value > 0 && uploadList.value.length === number.value) {
    fileList.value = fileList.value
      .filter((f) => f.url !== undefined && !f.raw)
      .concat(uploadList.value)

    uploadList.value = []
    number.value = 0
    emit('upload-file-success', fileList.value)
    emit('update:modelValue', listToString(fileList.value, null))
    uploadloadLoadingInstance.close()
  }
}

// 删除文件
const handleDelete = (index: number) => {
  fileList.value.splice(index, 1)
  emit('upload-file-success', fileList.value)
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
// const getFileName = (name: string | string[]) => {
//   if (name.lastIndexOf('/') > -1) {
//     return name.slice(name.lastIndexOf('/') + 1)
//   } else {
//     return ''
//   }
// }
// 自定义上传
const uploadFileUrl = ref(props.uploadUrl) // 上传文件服务器地址
const uploadCustom = async (param) => {
  if (!isImport.value) {
    return
  }
  const res: any = await uploldFile(uploadFileUrl.value, param)
  if (res && res.data) {
    res.data.name = param.file.name
    handleUploadSuccess(res, res.data)
  } else {
    handleUploadError(res.tip)
  }
}
// 图片文件
const dialogImageUrl = ref('')
const dialogVisible = ref(false)

const handleRemove: UploadProps['onRemove'] = (uploadFile, uploadFiles) => {
  console.log('uploadFile', uploadFile)
  fileList.value = uploadFiles
  emit('upload-file-success', fileList.value)
  emit('update:modelValue', listToString(fileList.value, null))
}

const handlePictureCardPreview: UploadProps['onPreview'] = (uploadFile) => {
  dialogImageUrl.value = uploadFile.url!
  dialogVisible.value = true
}
const currentItem = ref<any>()
const isShowPreview = ref(false)
const closeDialog = () => {
  isShowPreview.value = false
}
const previewList = ['jpg', 'png', 'jpeg', 'bmp', 'gif', 'docx', 'xlsx', 'pdf']
const preview = (item) => {
  const list = item.url.split('.')
  const type = list[list.length - 1]
  if (type.toLowerCase() === 'pdf') {
    window.open(item.url)
  } else if (previewList.includes(type.toLowerCase())) {
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
  const param = {}
  const res: any = await downloadFileCommon(item.url, param, item.name)
  if (res) {
    ElMessage.success('下载成功！')
  }
}
</script>

<template>
  <div class="upload-file flex">
    <!-- 单张图片上传 -->
    <template v-if="isPreviewImg">
      <ElUpload
        multiple
        :http-request="uploadCustom"
        :before-upload="handleBeforeUpload"
        v-model:file-list="fileList"
        :limit="limit"
        :on-error="handleUploadError"
        :on-exceed="handleExceed"
        :show-file-list="true"
        :headers="headers"
        :list-type="isPreviewImg ? 'picture-card' : 'text'"
        class="upload-img-uploader"
        ref="fileUpload"
        drag
        :on-preview="handlePictureCardPreview"
        :on-remove="handleRemove"
      >
        <el-icon><Plus /></el-icon>
      </ElUpload>
      <Dialog
        v-model="dialogVisible"
        :modalClass="'file-prview-img'"
        width="50%"
        :maxHeight="'auto'"
        :title="'图片预览'"
      >
        <img w-full :src="dialogImageUrl" alt="图片预览" />
      </Dialog>
    </template>
    <template v-else>
      <ElUpload
        v-if="!isSee"
        multiple
        :http-request="uploadCustom"
        :before-upload="handleBeforeUpload"
        v-model:file-list="fileList"
        :limit="limit"
        :on-error="handleUploadError"
        :on-exceed="handleExceed"
        :show-file-list="false"
        :headers="headers"
        :list-type="isPreviewImg ? 'picture-card' : 'text'"
        class="upload-file-uploader"
        ref="fileUpload"
        drag
      >
        <!-- 上传按钮 -->
        <!-- <ElButton type="primary">选取文件</ElButton> -->
        <Icon class="el-icon--upload" icon="ep:upload-filled" />
        <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>

        <!-- 上传提示 -->
        <div class="el-upload__tip" v-if="showTip && !isSee">
          请上传
          <template v-if="fileSize">
            大小不超过 <b style="color: #f56c6c">{{ fileSize }}MB</b>
          </template>
          <template v-if="fileType">
            格式为 <b style="color: #f56c6c">{{ fileType.join('/') }}</b>
          </template>
          的文件
        </div>
      </ElUpload>

      <!-- 文件列表 -->
      <transition-group
        class="upload-file-list el-upload-list el-upload-list--text ml-10px"
        name="el-fade-in-linear"
        tag="ul"
      >
        <template v-if="fileList.length">
          <li
            :key="file.uid"
            class="el-upload-list__item ele-upload-list__item-content"
            v-for="(file, index) in fileList"
          >
            <!-- <ElLink
              :href="`${file.url?.indexOf('http') > -1 ? '' : baseUrl}${file.url}`"
              :underline="false"
              target="_blank"
            >
              <span class="el-icon-document">
                {{ file.name }}
                {{ getFileName(file.name) }}
              </span>
            </ElLink> -->
            <span class="el-icon-document">
              {{ file.name }}
            </span>
            <div class="ele-upload-list__item-content-action flex">
              <Icon icon="ep:view" class="mr-5px" @click="preview(file)" />
              <Icon icon="ep:download" class="mr-5px" @click="downloadFile(file)" />
              <ElLink
                v-if="!isSee"
                :underline="false"
                class=""
                @click="handleDelete(index)"
                type="danger"
                >删除</ElLink
              >
            </div>
          </li>
        </template>
        <template v-else>
          <div v-if="isSee" class="no-data">暂无数据</div>
        </template>
      </transition-group>
    </template>
  </div>
  <Dialog
    v-model="isShowPreview"
    :modelClose="true"
    :modal="true"
    :modal-class="'file-list-modal'"
    :maxHeight="'auto'"
    :width="'70%'"
    title="查看"
    @closed="closeDialog"
  >
    <FilePreview :fileItem="currentItem" />
  </Dialog>
</template>

<style scoped lang="less">
.upload-file {
  display: flex;
  width: 100%;
  .upload-file-uploader {
    width: 40%;
  }
  .upload-file-list {
    flex: 1;
    width: 60%;
  }
  .el-upload-list {
    margin-left: 10px;
    margin-top: 0;
    // .el-upload-list__item {
    //   white-space: nowrap;
    //   overflow: hidden;
    //   text-overflow: ellipsis;
    // }
  }

  .el-upload__tip {
    margin-top: 0;
  }
  .no-data {
    text-align: center;
  }
}
.upload-file-uploader {
  // margin-bottom: 5px;
  :deep(.el-upload-dragger) {
    padding: 10px 10px;
  }
}

.upload-file-list .el-upload-list__item {
  border: 1px solid #e4e7ed;
  line-height: 2;
  margin-bottom: 10px;
  position: relative;
  word-break: break-all;
  .el-icon-document {
    // cursor: pointer;\
    word-wrap: break-word;
    max-width: 92%;
    word-break: break-all;
  }
}
.upload-file-list .ele-upload-list__item-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: inherit;
  .ele-upload-list__item-content-action {
    align-items: center;
  }
  & > .el-link {
    flex: 1;
    width: calc(100% - 40px);
    overflow: hidden;
    // text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    justify-content: flex-start;
  }
  .el-link--danger {
    :deep(.el-link__inner) {
      white-space: nowrap;
    }
  }

  .ele-upload-list__item-content-action {
    width: 40px;
  }
}
.ele-upload-list__item-content-action .el-link {
  margin-right: 10px;
}
.upload-file-uploader {
  .el-icon--upload {
    // font-size: 30px !important;
    margin-bottom: 0;
    width: 4em;
    height: 4em;
    svg {
      width: 4em;
      height: 4em;
    }
  }
  :deep(.el-icon) svg {
    width: 4em;
    height: 4em;
  }
  :deep(.el-upload-dragger .el-icon--upload) {
    margin-bottom: 0;
  }
}
.upload-img-uploader {
  :deep(.el-upload-dragger) {
    height: 100%;
    padding: 0;
    display: flex;
    align-items: center;
    justify-content: center;
  }
}
.file-prview-img {
  img {
    // width: 100%;
  }
}
</style>
