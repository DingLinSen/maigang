<template>
  <div class='demo-progress'>
    <ElProgress :percentage='progress' />
  </div>
</template>
<script setup lang='ts'>
import { ref } from 'vue'
import { ElProgress } from 'element-plus'
import axios from 'axios'
import { PATH_URL } from '@/config/axios/service'
import { useCache } from '@/hooks/web/useCache'
import { useAppStore } from '@/store/modules/app'

const { wsCache } = useCache()
const appStore = useAppStore()
const props = defineProps({
  progressNumber: {
    type: Number,
    default: 0
  },
  data: {
    type: Object,
    default: () => {
    }
  }
})
const emit = defineEmits(['finish'])
const progress = ref(0)
let url = PATH_URL + '/oa-administrative/upload/uploadFolderOrFileDrag'
const changeProgress = () => {
  if (progress.value >= 100) {
    emit('finish', progress.value) // 发射事件，并传递一个参数
  }
}
axios({
  url,
  method: 'post',
  data: props.data,
  headers: {
    Authorization: wsCache.get(appStore.getToken)
  },
  //原生获取上传进度的事件
  onUploadProgress: function(progressEvent) {
    progress.value = ((progressEvent.loaded / progressEvent.total) * 100) | 0
  }
})
  .then((res) => {
    if (res) {
      changeProgress()
    }
  })
  .catch((err) => {
    console.log(err)
  })
</script>
<style scoped>
.demo-progress .el-progress--line {
  margin-bottom: 15px;
  width: 280px;
}
</style>
