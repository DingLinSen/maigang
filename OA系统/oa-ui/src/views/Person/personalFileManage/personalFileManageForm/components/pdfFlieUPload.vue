<script setup lang="ts">
import { ref, inject, watch, unref } from 'vue'
import { PATH_URL } from '@/config/axios/service'
import { useCache } from '@/hooks/web/useCache'
import { downloadFile } from '@/utils/index'
import { propTypes } from '@/utils/propTypes'

const { wsCache } = useCache()
import { ElButton, ElMessage, ElUpload, UploadFile, UploadUserFile } from 'element-plus'

const props = defineProps({
  title: propTypes.string.def(''),
  modelValue: {
    type: String,
    default: ''
  },
  fileName: {
    type: String,
    default: ''
  },
  limit: {
    type: Number,
    default: 9
  }
})

//上传成功后的文件集合
const fileList = ref<UploadUserFile[]>([])

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

const fileName = ref()
const emit = defineEmits(['update:modelValue', 'update:fileName', 'openFilePreview'])
//最多上传文件个数
const number = ref<number>(0)
//上传文件集合
const uploadList = ref<UploadUserFile[]>([])
//请求头
const headers = ref({ Authorization: wsCache.get('access_token') })
const uploadFileUrl = ref(PATH_URL + '/mgdaas-file/upload') // 上传文件服务器地址
const fileUpload = ref<ComponentRef<typeof ElUpload>>()
// 上传成功
const handleSuccess = (res: any, file: UploadFile) => {
  if (res.code === '00000') {
    ElMessage.success('上传文件成功')
    uploadList.value.push({ name: res.data.name, url: res.data.url })
    uploadedSuccessfully()
  } else {
    number.value--
    ElMessage.error(res.tip || res.message)
    unref(fileUpload)?.handleRemove(file)
    uploadedSuccessfully()
  }
}

const handleBeforeUpload: any = (file) => {
  console.log('handleBeforeUpload==>', file)
  if (file.name.split('.')[0].length > 50) {
    ElMessage.error('文件名长度不能超过50个字符！')
    return false
  }
  const extension = file.name.split('.').pop().toLowerCase()
  const isLt = file.size / 1024 / 1024 < 10
  if (!isLt) {
    ElMessage.error(`上传文件大小不能超过10 MB!`)
    return false
  }

  const imageFormats = ['jpg', 'jpeg', 'gif', 'png', 'bmp']

  if (!(extension == 'pdf' || imageFormats.includes(extension))) {
    ElMessage.error('只能上传pdf格式的文件或者图片！')
    return false // 阻止文件上传
  }
  number.value++
  return true // 允许文件上传
}
const forbidden = inject('forbidden')
// 删除文件
const handleDelete = (index: number) => {
  fileList.value.splice(index, 1)
  emit('update:modelValue', listToString(fileList.value, null))
  emit('update:fileName', listFileToString(fileList.value, null))
}
// 上传失败
const handleUploadError = (err: Error) => {
  ElMessage.error('上传文件失败')
}

// 上传结束处理
function uploadedSuccessfully() {
  if (number.value > 0 && uploadList.value.length === number.value) {
    fileList.value = fileList.value.filter((f) => f.url !== undefined).concat(uploadList.value)
    uploadList.value = []
    number.value = 0
    emit('update:modelValue', listToString(fileList.value, null))
    emit('update:fileName', listFileToString(fileList.value, null))
  }
}
// 对象转成指定字符串分隔
const listFileToString = (list: UploadUserFile[], separator: string | null) => {
  let strs = ''
  separator = separator || ','
  for (let i in list) {
    if (list[i].url) {
      strs += getFileName(list[i].url) + separator
    }
  }
  return strs != '' ? strs.substr(0, strs.length - 1) : ''
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
  if (name.lastIndexOf('/') > -1) {
    return name.slice(name.lastIndexOf('/') + 1)
  } else {
    return ''
  }
}

const openFilePreview = (fileUrl: string, fileName: string) => {
  if (fileName && fileUrl) {
    emit('openFilePreview', fileName, fileUrl)
  }
}

// 文件个数超出
const handleExceed = (files: any) => {
  ElMessage.error(`上传文件数量不能超过 ${props.limit} 个!`)
}
</script>
<template>
  <section class="mt-[36px] pb-[36px] border-b-1">
    <p class="font-2xl addform-title pb-[11px]">{{ title }}</p>

    <div v-if="!forbidden">
      <el-upload
        ref="fileUpload"
        v-model="props.modelValue"
        multiple
        :limit="limit"
        class="pdfFlie-upload"
        :action="uploadFileUrl"
        :headers="headers"
        :show-file-list="false"
        :on-error="handleUploadError"
        :on-exceed="handleExceed"
        :before-upload="handleBeforeUpload"
        :on-success="handleSuccess"
      >
        <div class="pdf-sculpture-btn flex justify-center items-center">
          <img class="mr-5px" src="@/assets/imgs/icon/sc_icon.png" />
          <span>点击上传</span>
        </div>
      </el-upload>

      <div
        v-if="!(props.modelValue && !forbidden)"
        class="flex justify-between items-center mt-2 text-[#f00] text-sm"
        >只能上传pdf格式的文件或者图片！</div
      >
    </div>

    <div
      v-if="forbidden && fileList.length == 0"
      class="pdf-sculpture-btn flex justify-center items-center"
    >
      <span>暂无数据</span>
    </div>
    <div v-else class="w-[100%] mt-2">
      <li
        v-for="(file, index) in fileList"
        :key="index"
        class="w-[100%] flex justify-between items-center mb-2"
      >
        <div
          class="pdfFlie_upload cursor-pointer text-blue-500"
          @click="openFilePreview(file.url, getFileName(file.url))"
          >{{ getFileName(file.url) }}</div
        >
        <div class="ele-upload-list__item-content-action" v-if="props.modelValue && !forbidden">
          <ElLink :underline="false" @click="handleDelete(index)" type="danger">删除</ElLink>
        </div>
      </li>
    </div>
  </section>
</template>
<style lang="less">
.pdfFlieUPload-upload .el-upload-list {
  display: none !important;
}
.pdfFlie_upload {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.addform-title {
  padding-left: 8px;
  font-size: 16px;
  color: #333333;
  position: relative;
  &::after {
    content: '';
    display: block;
    width: 3px;
    height: 15px;
    background: #00a0e9;
    border-radius: 2px;
    position: absolute;
    left: 0;
    top: 5px;
  }
}
</style>
<style>
.pdf-sculpture-btn {
  width: 100%;
  height: 50px !important;
  margin-top: -2px;
  color: #00a0e9;
  border-top: 1px dashed #00a0e9;
  border-bottom: 1px dashed #00a0e9;
  border-left: 1px solid #00a0e9;
  border-right: 1px solid #00a0e9;
  font-size: 14px;
}
</style>

<style>
.pdfFlie-upload .el-upload {
  width: 100%;
}
</style>
