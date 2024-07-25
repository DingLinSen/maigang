<script setup lang="ts">
import { onMounted, reactive, ref, unref } from 'vue'
import { ElRow, ElCol, ElDialog, ElButton, ElMessage, ElUpload } from 'element-plus'
import 'vue-cropper/dist/index.css'
import { VueCropper } from 'vue-cropper'
import { uploadAvatarApi } from '@/api/user'
import { useCache } from '@/hooks/web/useCache'
import { useEmitt } from '@/hooks/web/useEmitt'
import { useAppStore } from '@/store/modules/app'

const { wsCache } = useCache()
const appStore = useAppStore()
const { emitter } = useEmitt()
const cropperRef = ref<ComponentRef<typeof VueCropper>>()

const open = ref(false)
const visible = ref(false)
const title = ref('修改头像')

//图片裁剪数据
const options = reactive({
  img: wsCache.get('userInfo').avatar, // 裁剪图片的地址
  autoCrop: true, // 是否默认生成截图框
  autoCropWidth: 200, // 默认生成截图框宽度
  autoCropHeight: 200, // 默认生成截图框高度
  fixedBox: true, // 固定截图框大小 不允许改变
  outputType: 'png', // 默认生成截图为PNG格式
  fixed: true,
  full: true,
  previews: { url: '', img: '' } //预览数据
})

const getDefaultImage = async () => {
  const avatar = await import('@/assets/imgs/avatar.jpg')
  options.img = wsCache.get('userInfo').avatar ? wsCache.get('userInfo').avatar : avatar.default
}

/** 编辑头像 */
const editCropper = () => {
  open.value = true
}
/** 打开弹出层结束时的回调 */
const modalOpened = () => {
  visible.value = true
}
/** 覆盖默认上传行为 */
const requestUpload = () => {}
/** 向左旋转 */
const rotateLeft = () => {
  unref(cropperRef).rotateLeft()
}
/** 向右旋转 */
const rotateRight = () => {
  unref(cropperRef).rotateRight()
}
/** 图片缩放 */
const changeScale = (num: number) => {
  num = num || 1
  unref(cropperRef).changeScale(num)
}
/** 上传预处理 */
const beforeUpload = (file: Blob) => {
  if (file.type.indexOf('image/') == -1) {
    ElMessage.error('文件格式错误，请上传图片类型,如：JPG，PNG后缀的文件。')
  } else {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => {
      options.img = reader.result
    }
  }
}
/** 上传图片 */
const uploadImg = () => {
  unref(cropperRef).getCropBlob((data: Blob) => {
    let formData = new FormData()
    formData.append('avatarfile', data)
    uploadAvatarApi(formData).then((response) => {
      open.value = false
      let avatar = response.data as string
      options.img = avatar.startsWith('http') ? avatar : import.meta.env.VITE_APP_BASE_API + avatar
      const user = wsCache.get('userInfo')
      user.avatar = options.img
      wsCache.set(appStore.getUserInfo, user)
      appStore.setAvatar(user.avatar)
      ElMessage.success('修改成功')
      emitter.emit('avator', 'img')
      visible.value = false
    })
  })
}
/** 实时预览 */
const realTime = (data: any) => {
  options.previews = data
}
/** 关闭窗口 */
const closeDialog = () => {
  getDefaultImage()
  // options.visible = false
}

onMounted(() => {
  getDefaultImage()
})
</script>

<template>
  <div class="user-info-head" @click="editCropper()">
    <img :src="options.img" title="点击上传头像" class="img-circle img-lg" />
    <ElDialog
      :title="title"
      v-model="open"
      width="800px"
      append-to-body
      @opened="modalOpened"
      @close="closeDialog"
    >
      <ElRow>
        <ElCol :xs="24" :md="12" :style="{ height: '350px' }">
          <VueCropper
            ref="cropperRef"
            :img="options.img"
            :info="true"
            :autoCrop="options.autoCrop"
            :autoCropWidth="options.autoCropWidth"
            :autoCropHeight="options.autoCropHeight"
            :fixedBox="options.fixedBox"
            :outputType="options.outputType"
            @realTime="realTime"
            v-if="visible"
          />
        </ElCol>
        <ElCol :xs="24" :md="12" :style="{ height: '350px' }">
          <div class="avatar-upload-preview">
            <img :src="options.previews?.url" :style="options.previews?.img" />
          </div>
        </ElCol>
      </ElRow>
      <br />
      <ElRow>
        <ElCol :lg="2" :md="2">
          <ElUpload
            action="#"
            :http-request="requestUpload"
            :show-file-list="false"
            :before-upload="beforeUpload"
          >
            <ElButton>
              选择
              <Icon icon="ep:upload-filled" class="ml-5px" />
            </ElButton>
          </ElUpload>
        </ElCol>
        <ElCol :lg="{ span: 1, offset: 2 }" :md="2">
          <ElButton @click="changeScale(1)"><Icon icon="ep:plus" /></ElButton>
        </ElCol>
        <ElCol :lg="{ span: 1, offset: 1 }" :md="2">
          <ElButton @click="changeScale(-1)"><Icon icon="ep:minus" /></ElButton>
        </ElCol>
        <ElCol :lg="{ span: 1, offset: 1 }" :md="2">
          <ElButton @click="rotateLeft()"><Icon icon="ep:refresh-left" /></ElButton>
        </ElCol>
        <ElCol :lg="{ span: 1, offset: 1 }" :md="2">
          <ElButton @click="rotateRight()"><Icon icon="ep:refresh-right" /></ElButton>
        </ElCol>
        <ElCol :lg="{ span: 2, offset: 6 }" :md="2">
          <ElButton type="primary" @click="uploadImg()">提 交</ElButton>
        </ElCol>
      </ElRow>
    </ElDialog>
  </div>
</template>

<style lang="less" scoped>
.img-circle {
  border-radius: 50%;
}

.img-lg {
  width: 120px;
  height: 120px;
}

.avatar-upload-preview {
  position: absolute;
  top: 50%;
  transform: translate(50%, -50%);
  width: 200px;
  height: 200px;
  border-radius: 50%;
  box-shadow: 0 0 4px #ccc;
  overflow: hidden;
  img {
    max-width: inherit;
  }
}

.user-info-head {
  position: relative;
  display: inline-block;
  height: 120px;
}

.user-info-head:hover:after {
  content: '+';
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  color: #eee;
  background: rgba(0, 0, 0, 0.5);
  font-size: 24px;
  font-style: normal;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  cursor: pointer;
  line-height: 110px;
  border-radius: 50%;
}
</style>
