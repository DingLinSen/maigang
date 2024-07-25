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
    default: 1
  },
  // 大小限制(MB)
  fileSize: {
    type: Number,
    default: 100
  },
  fileType: {
    type: Array,
    default: () => ['png', 'jpg', 'jpeg']
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
      const list = Array.isArray(val) ? val : (props.modelValue as string).split(';')
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
      ElMessage.error(`上传文件大小不能超过 ${props.fileSize} MB!`)
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
    fileList.value = uploadList.value
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
  separator = separator || ';'
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

const handleRemove = (file: any) => {
  fileList.value.splice(fileList.value.indexOf(file), 1)
  emit('update:modelValue', listToString(fileList.value, null))
  emit('updateModelValue', listToString(fileList.value, null))
}

const dialogImageUrl = ref('')
const dialogVisible = ref(false)
const handlePreview = (file: any) => {
  dialogImageUrl.value = file.url!
  dialogVisible.value = true
}
const setBannerImage = async (e: any) => {
  const avatar = await import('@/assets/imgs/default_pic3.png')
  e.target.src = avatar.default
}
</script>

<template>
  <div class="upload-file">
    <transition-group class="el-upload-list el-upload-list--text" name="el-fade-in-linear" tag="ul">
      <div v-if="fileList.length">
        <div class="demo-upload-list" v-for="(item, index) in fileList" :key="index">
          <img :src="item.url" style="cursor: pointer" @error="setBannerImage" />
          <div class="demo-upload-list-cover">
            <Icon
              icon="ion:eye-outline"
              @click="handlePreview(item)"
              :size="24"
              style="color: #fff; margin-right: 10px"
            ></Icon>

            <Icon
              icon="ion:trash-outline"
              @click="handleRemove(item)"
              :size="24"
              style="color: #fff"
            ></Icon>
          </div>
        </div>
      </div>
    </transition-group>
    <ElUpload
      v-if="!disabled && !fileList.length"
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
      class="avatar-uploader"
      ref="fileUpload"
      drag
    >
      <template #trigger>
        <div class="upload-button-class flex items-center">
          <Icon class="avatar-uploader-icon" icon="ep:plus" :size="42" />
        </div>
      </template>
    </ElUpload>
    <!-- 上传提示 -->
    <div class="el-upload__tip" v-if="showTip && !disabled">
      请上传
      <template v-if="fileSize">
        大小不超过 <b style="color: #f56c6c">{{ fileSize }}MB</b>
      </template>
      <template v-if="fileType">
        格式为 <b style="color: #f56c6c">{{ fileType.join('/') }}</b>
      </template>
      的文件
    </div>
  </div>
  <el-dialog v-model="dialogVisible" class="img-pre" :align-center="true">
    <div class="img-wrap">
      <img w-full :src="dialogImageUrl" alt="Preview Image" />
    </div>
  </el-dialog>
</template>

<style scoped lang="less">
.img-wrap {
  width: 100%;
  justify-content: center;
  display: flex;
}
.demo-upload-list {
  display: flex;
  width: 281px;
  height: 160px;
  justify-content: center;
  text-align: center;
  // line-height: 60px;
  border: 1px dashed var(--el-color-primary);
  border-radius: 4px;
  overflow: hidden;
  background: #fff;
  position: relative;
  box-shadow: 0 1px 1px rgba(0, 0, 0, 0.2);
  margin-right: 4px;

  .ivu-upload {
    display: inline-block;
  }
}
.demo-upload-list img {
  width: 120px;
  height: 120px;
  margin-top: 20px;
}
.demo-upload-list-cover {
  display: none;
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(0, 0, 0, 0.6);
  line-height: 60px;
}
.demo-upload-list:hover .demo-upload-list-cover {
  display: block;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}
.demo-upload-list-cover i {
  color: #999;
  font-size: 40px;
  cursor: pointer;
  margin: 0 2px;
}

.demo-upload-list-cover i:hover {
  color: #3e8ef7;
}
.upload-button-class {
  width: 158px;
  height: 158px;
  justify-content: center;
}
:deep(.el-upload-dragger) {
  display: flex;
  justify-content: center;
  padding: 0px;
}

:deep(.el-icon.avatar-uploader-icon) {
  width: 85px !important;
  height: 85px !important;
}
.avatar-uploader .avatar {
  width: 158px;
  height: 158px;
  display: block;
}
</style>
<style lang="less">
.avatar-uploader .el-upload {
  border: 1px dashed var(--el-color-primary);
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: var(--el-transition-duration-fast);
}

.avatar-uploader .el-upload:hover {
  border-color: var(--el-color-primary);
}

.el-icon.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 85px;
  height: 85px;
  text-align: center;
}

.img-pre {
  .el-dialog__body {
    max-height: 85vh;
    overflow-y: auto;
  }

  .el-dialog__header {
    background: #ffffff !important;
    border-bottom: 0px solid var(--tags-view-border-color);
  }
}
</style>
