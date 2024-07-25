<script setup lang="ts">
import { ref } from 'vue'
import { PATH_URL } from '@/config/axios/service'
import { useCache } from '@/hooks/web/useCache'

const { wsCache } = useCache()
import { ElButton, ElMessage, ElUpload, UploadFile } from 'element-plus'

const props = defineProps({
  modelValue: {
    type: String,
    default: ''
  },
  disabled: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['update:modelValue'])
//请求头
const headers = ref({ Authorization: wsCache.get('access_token') })
const uploadFileUrl = ref(PATH_URL + '/mgdaas-file/upload') // 上传文件服务器地址

// 上传成功
const handleSuccess = (res: any, file: UploadFile) => {
  if (res.code === '00000') {
    emit('update:modelValue', res.data.url)
    // file.value = res.data.url
    ElMessage.success('上传文件成功')
  } else {
    ElMessage.error(res.tip || res.message)
  }
}

const beforeAvatarUpload: any = (rawFile) => {
  const isLt = rawFile.size / 1024 / 1024 < 10
  if (!isLt) {
    ElMessage.error(`上传文件大小不能超过10 MB!`)
    return false
  }
  if (rawFile.type !== 'image/jpeg' && rawFile.type !== 'image/png') {
    ElMessage.error('只支持图片格式!')
    return false
  }
  return true
}

// 上传失败
const handleUploadError = (err: Error) => {
  ElMessage.error('上传文件失败')
}
const setAvatarImage = async (e: any) => {
  const avatar = await import('@/assets/imgs/icon/tx_defalut.png')
  e.target.src = avatar.default
}
</script>
<template>
  <section class="headSculpture">
    <el-form-item prop="photo">
      <el-upload
        :disabled="disabled"
        v-model="props.modelValue"
        class="headSculpture-upload"
        :before-upload="beforeAvatarUpload"
        :action="uploadFileUrl"
        :headers="headers"
        :accept="'image/jpeg,image/png'"
        :on-error="handleUploadError"
        :on-success="handleSuccess"
      >
        <div v-if="props.modelValue" class="w-[4.79vw] h-[4.79vw] border-1 headSculpture-img">
          <img class="w-full h-full" :src="props.modelValue" @error="setAvatarImage"/>
        </div>
        <div
          v-else
          class="w-[4.79vw] h-[4.79vw] border-1 headSculpture-upload-img relative flex items-center justify-center"
        >
          <img class="w-[1.875vw] h-[1.875vw]" src="@/assets/imgs/icon/tx_icon.png" />
          <p
            class="absolute w-full bottom-0 h-[1.15vw] flex items-center justify-center bg-[#E8F4FF] text-[#02A7F2]"
            >上传头像</p
          >
        </div>
      </el-upload>
    </el-form-item>
    <!-- <el-button type="primary"></el-button> -->
  </section>
</template>
<style lang="less">
.headSculpture {
  border-radius: 10px;
}
.headSculpture-img {
  border-radius: 10px;
  overflow: hidden;
}
.headSculpture-upload .el-upload-list {
  display: none !important;
}
.headSculpture .el-form-item__content .headSculpture-upload {
  height: 4.79vw !important;
}
.headSculpture .el-form-item {
  margin-bottom: 0;
}
.headSculpture-upload-img {
  background: #02a7f2;
  border-radius: 10px;
}
.headimg {
}
</style>
