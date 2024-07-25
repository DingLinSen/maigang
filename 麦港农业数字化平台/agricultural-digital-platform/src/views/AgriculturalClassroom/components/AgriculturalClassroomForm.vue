<script setup lang="ts">
import { ref, unref, reactive, getCurrentInstance, nextTick, onMounted } from 'vue'
import { ElButton, ElMessage, ElTooltip } from 'element-plus'
import { Form, FormExpose } from '@/components/Form'
import { Dialog } from '@/components/Dialog'
import { useEmitt } from '@/hooks/web/useEmitt'
import { useValidator } from '@/hooks/web/useValidator'
import { propTypes } from '@/utils/propTypes'
import { FormSchema } from '@/types/form'
import { saveFarmCourseApi, editFarmCourseApi, getFarmCourseApi } from '@/api/agriculturalClassroom'
import { FileUpload } from '@/components/FileUpload'
import { PATH_URL } from '@/config/axios/service'
import { useCache } from '@/hooks/web/useCache'
import { useAppStore } from '@/store/modules/app'
import { FilePreview } from '@/components/FilePreview/index'

const { proxy } = getCurrentInstance() as any
const { wsCache } = useCache()
const appStore = useAppStore()

// 表单校验
type Callback = (error?: string | Error | undefined) => void
const { required, validatePhone } = useValidator()

const props = defineProps({
  title: propTypes.string.def('')
})
const courseTypeData = ref<any>([
  {
    label: '公开课',
    value: '0'
  },
  {
    label: '中级课',
    value: '1'
  },
  {
    label: '高级课',
    value: '2'
  }
])

const schema = reactive<FormSchema[]>([
  {
    field: 'courseType',
    label: '课程分类',
    component: 'Select',
    colProps: {
      span: 8
    },
    componentProps: {
      style: 'width:100%;', //宽度
      maxlength: 20,
      clearable: false,
      options: courseTypeData
    },
    formItemProps: {
      rules: [required()]
    }
  },
  {
    field: 'courseName',
    label: '课程名称',
    component: 'Input',
    colProps: {
      span: 8
    },
    componentProps: {
      maxlength: 20,
      style: 'width:100%;' //宽度
    },
    formItemProps: {
      rules: [required()]
    }
  },
  {
    field: 'teacherName',
    label: '讲师',
    component: 'Input',
    colProps: {
      span: 8
    },
    componentProps: {
      maxlength: 20,
      clearable: false
    },
    formItemProps: {
      rules: [required()]
    }
  },
  {
    field: 'remark',
    label: '课程介绍',
    component: 'Input',
    colProps: {
      span: 8
    },
    componentProps: {
      maxlength: 11,
      clearable: false
    }
  },
  {
    field: 'pictureUrl',
    label: '缩略图上传',
    component: 'Input',
    colProps: {
      span: 24
    },
    componentProps: {
      maxlength: 11,
      clearable: false
    },
    formItemProps: {
      rules: [required()]
    }
  },
  {
    field: 'fileList',
    colProps: {
      span: 24
    }
  }
])

const uploaderRef = ref(null)
// 上传文件的配置项
const options = {
  target: PATH_URL + '/mgdaas-file/upload', // '//jsonplaceholder.typicode.com/posts/',
  testChunks: false,
  allowDuplicateUploads: true,
  headers: {
    Authorization: wsCache.get(appStore.getToken)
  },
  // query: function (file, trunk, isTest) {
  //   if (breadcrumbList.value.length > 0) {
  //     // 如果在子目录上传，将当前层级的id/path 传输
  //     return {
  //       fileName: file.name,
  //       flag: 'mgCompanyQualification',
  //       parentDocId: breadcrumbList.value[breadcrumbList.value.length - 1].id,
  //       parentFilePath: breadcrumbList.value[breadcrumbList.value.length - 1].path
  //     }
  //   } else {
  //     return {
  //       fileName: file.name,
  //       // 如果是根目录或搜索模式下上传 传空值
  //       flag: 'mgCompanyQualification',
  //       parentDocId: '',
  //       parentFilePath: ''
  //     }
  //   }
  // },
  parseTimeRemaining: function (timeRemaining, parsedTimeRemaining) {
    return parsedTimeRemaining
      .replace(/\syears?/, '年')
      .replace(/\days?/, '天')
      .replace(/\shours?/, '小时')
      .replace(/\sminutes?/, '分钟')
      .replace(/\sseconds?/, '秒')
  },
  chunkSize: 1024 * 1024 * 1024 * 1024
}
// 提示语
const statusText = {
  success: '成功',
  error: '失败',
  uploading: '上传中',
  paused: '暂停',
  waiting: '排队中'
}
const attrs = {
  accept: 'video/*'
  // multiple: false,
  // multipleLimit:1
}
const videoNameArr = ref<any>([])
// 文件上传成功
const fileComplete = (file) => {
  videoNameArr.value.push(file.name)
  unref(formRef)?.setValues({
    videoName: videoNameArr.value.join(';')
  })
  ElMessage({
    message: '上传成功',
    type: 'success'
  })
}
const videoUrlArr = ref<any>([])
const onFileSuccess = (rootFile, file, response, chunk) => {
  console.log(111)

  let res = JSON.parse(response)
  videoUrlArr.value.push(res.data.url)
  unref(formRef)?.setValues({
    videoUrl: videoUrlArr.value.join(';')
  })
}
onMounted(() => {
  nextTick(() => {
    window.uploader = uploaderRef.value.uploader
  })
})

const formRef = ref<FormExpose>()

const isShow = ref<boolean>(false)

const { emitter } = useEmitt({
  name: 'drawer',
  callback: (type: string) => {
    if (type === 'closed') {
      resetFormAfterClose()
    }
  }
})

const loading = ref(false)
//保存数据
const save = async () => {
  //表单验证
  const form = unref(formRef)
  const elFormRef = form?.getElFormRef()
  await elFormRef?.validate(async (isValid) => {
    if (isValid) {
      loading.value = true
      let data = form?.formModel as any
      if (data.id && detailsId.value) {
        editPost(data)
      } else {
        addPost(data)
      }
    }
  })
}

//编辑岗位
const editPost = async (data: any) => {
  const res = await editFarmCourseApi(data)
    .catch(() => {})
    .finally(() => {
      nextTick(() => {
        setTimeout(() => {
          loading.value = false
        }, 300)
      })
    })
  if (res) {
    ElMessage.success('成功保存信息')
    emitter.emit('getClassRoomList', 'edit')
    closeDrawer()
  }
}

//新增岗位
const addPost = async (data: any) => {
  const res = await saveFarmCourseApi(data)
    .catch(() => {})
    .finally(() => {
      nextTick(() => {
        setTimeout(() => {
          loading.value = false
        }, 300)
      })
    })
  if (res) {
    ElMessage.success('成功保存信息')
    emitter.emit('getClassRoomList', 'add')
    closeDrawer()
  }
}
// 上传文件成功
const uploadFileSuccess = (data) => {
  unref(formRef)?.setValues({
    pictureUrl: data[0].url,
    pictureName: data[0].name
  })
}

const isSave = ref<boolean>(false)
const pageTite = ref<string>('')
const detailsId = ref<string>('')
const isEdit = ref<boolean>(false)
//打开drawer并初始化
const openDrawer = (flag: string, id: string) => {
  isShow.value = true
  videoNameArr.value = []
  nextTick(() => {
    if (uploaderRef.value) {
      uploaderRef.value.fileList = []
    }
    //重置表单
    detailsId.value = ''
    setValue(false)
    isSave.value = flag === 'see' ? false : true
    isEdit.value = flag === 'edit' ? true : false
    changeDisabled(flag === 'see')
    pageTite.value = props.title + (flag === 'add' ? '新增' : flag === 'edit' ? '编辑' : '详情')

    if (id) {
      getDetailsData(id)
    }
  })
}

//关闭drawer
const closeDrawer = () => {
  fileList.value = []
  isShow.value = false
}

const resetFormAfterClose = () => {
  fileList.value = []
  detailsId.value = ''
  //重置表单
  setValue(true)
}

let courseData = reactive<any>({
  courseType: '',
  courseName: '',
  teacherName: '',
  remark: '',
  pictureUrl: ''
})
const fileList = ref<any>([])
const videoList = ref<any>([])
//获取详情
const getDetailsData = async (id: string) => {
  detailsId.value = id
  const res = await getFarmCourseApi(id)
  fileList.value = []
  videoList.value = []
  if (res && res.data) {
    if (res.data.videoUrl) {
      let videoUrl = res.data.videoUrl
      let videoName = res.data.videoName
      let videoUrlArr = videoUrl.split(';') // 按字符分割
      let videoNameArr = videoName.split(';') // 按字符分割
      videoUrlArr.map((item, index) => {
        videoList.value.push({
          name: videoNameArr[index],
          url: item
        })
      })
    }
    courseData = res.data
    fileList.value.push({
      name: res.data.pictureName,
      url: res.data.pictureUrl
    })
    setValues(courseData)
  }
}

//表单赋值
const setValue = (reset: boolean) => {
  const elFormRef = unref(formRef)?.getElFormRef()
  if (reset) {
    elFormRef?.resetFields()
  } else {
    unref(formRef)?.setValues({
      courseType: '',
      courseName: '',
      teacherName: '',
      remark: '',
      pictureUrl: ''
    })
  }
}

const setValues = (form: any) => {
  unref(formRef)?.setValues(form)
}

//表单禁用
const changeDisabled = (bool: boolean) => {
  unref(formRef)?.setProps({
    disabled: bool
  })
}
const isShowPreview = ref(false)
const currentItem = ref('')
// 预览视频
const videoPreview = (item) => {
  currentItem.value = item
  isShowPreview.value = true
}

// 删除视频
const delVideo = (index) => {
  videoList.value.splice(index, 1)
  let videoUrlArr = [] as any
  let videoNameArr = [] as any
  if (videoList.value.length <= 0) {
    unref(formRef)?.setValues({
      videoUrl: '',
      videoName: ''
    })
  }
  videoList.value.map((item: any) => {
    videoUrlArr.push(item.url)
    videoNameArr.push(item.name)
    unref(formRef)?.setValues({
      videoUrl: videoUrlArr.join(';'),
      videoName: videoNameArr.join(';')
    })
  })
}

defineExpose({
  isShow,
  openDrawer
})
</script>

<template>
  <uploader
    :options="options"
    :file-status-text="statusText"
    class="uploader-example"
    ref="uploaderRef"
    @file-complete="fileComplete"
    @file-success="onFileSuccess"
  >
    <Dialog v-model="isShow" width="70%" :maxHeight="'auto'" :title="pageTite" @close="closeDrawer">
      <Form :schema="schema" ref="formRef" class="form-content">
        <template #pictureUrl>
          <FileUpload
            :isPreviewImg="true"
            :is-see="!isSave"
            :modelValue="fileList"
            :fileType="['jpg', 'gif', 'png', 'jpeg']"
            :fileSize="10"
            :limit="1"
            @upload-file-success="uploadFileSuccess"
          />
        </template>
        <template #fileList>
          <uploader-list />
          <div v-if="(isEdit || !isSave) && videoList.length > 0">
            <p>课程视频</p>
            <div v-for="(item, index) in videoList" :key="item" class="video_list">
              <p
                >视频名称: <span style="margin-left: 10px">{{ item.name }}</span>
              </p>
              <p
                >视频地址:
                <span class="videoUrl" @click="videoPreview(item)">{{ item.url }}</span></p
              >
              <ElButton type="primary" @click="delVideo(index)"> 删除视频 </ElButton>
            </div>
          </div>
        </template>
      </Form>
      <template #footer>
        <div class="details-footer">
          <ElButton @click="closeDrawer"> 取消 </ElButton>
          <uploader-btn :attrs="attrs">添加视频</uploader-btn>
          <!-- <ElButton v-if="isSave" type="primary" :loading="loading" @click="save">
          添加视频
        </ElButton> -->
          <ElButton v-if="isSave" type="primary" :loading="loading" @click="save"> 保存 </ElButton>
        </div>
      </template>
      <Dialog
        v-model="isShowPreview"
        :modelClose="true"
        :modal="true"
        :modal-class="'file-list-modal'"
        :maxHeight="'auto'"
        :width="'70%'"
        title="查看视频"
        @closed="closeDialog"
      >
        <FilePreview :fileItem="currentItem" />
      </Dialog>
    </Dialog>
  </uploader>
</template>

<style lang="less" scoped>
:deep(.el-input-group__append) {
  background-color: white;
  width: 35px;
}
.uploader-list {
  width: 100%;
}
.uploader-btn {
  background-color: #3c9a4c;
  border: 1px solid #3c9a4c;
  border-radius: 3px;
  font-size: 14px;
  line-height: 1.6;
  margin: 0 10px;
  color: #fff;
  &:hover {
    background-color: #2e8d3f;
  }
}
.video_list {
  background-color: #f5f7fa;
  margin: 10px 0;
  padding: 10px;
}
.videoUrl {
  margin-left: 10px;
  color: #3c9a4c;
  cursor: pointer;
}
</style>
