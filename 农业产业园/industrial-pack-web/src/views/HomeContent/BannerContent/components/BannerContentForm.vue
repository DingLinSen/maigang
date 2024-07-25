<script setup lang="ts">
import { ref, unref, reactive, getCurrentInstance, nextTick, watch } from 'vue'
import { ElButton, ElMessage, ElTooltip } from 'element-plus'
import { Form, FormExpose } from '@/components/Form'
import { Dialog } from '@/components/Dialog'
import { useEmitt } from '@/hooks/web/useEmitt'
import { useValidator } from '@/hooks/web/useValidator'
import { propTypes } from '@/utils/propTypes'
import { FormSchema } from '@/types/form'
import { Editor } from '@/components/Editor'

import {
  addBannerContentApi,
  editBannerContentApi,
  getBannerContentDetailApi
} from '@/api/bannerContent'
import { FileUpload } from '@/components/FileUpload'

const { proxy } = getCurrentInstance() as any

// 表单校验
type Callback = (error?: string | Error | undefined) => void
const { required, validatePositiveInteger, notAllSpace } = useValidator()

const props = defineProps({
  title: propTypes.string.def('')
})

const schema = reactive<FormSchema[]>([
  {
    field: 'title',
    label: '标题',
    component: 'Input',
    colProps: {
      span: 24
    },
    componentProps: {
      maxlength: 10,
      clearable: false
    },
    formItemProps: {
      rules: [required()]
    }
  },
  {
    field: 'coverUrl',
    label: '上传封面',
    colProps: {
      span: 24
    },
    formItemProps: {
      rules: [required()]
    }
  },
  {
    field: 'orderNum',
    label: '显示排序',
    component: 'Input',
    colProps: {
      span: 24
    },
    componentProps: {
      clearable: false,
      maxlength: 6
    },
    formItemProps: {
      rules: [
        required(),
        {
          validator: (_: any, value: string, callback: Callback) => {
            validatePositiveInteger(value, callback, '请输入正整数')
          },
          trigger: 'blur'
        }
      ]
    }
  },
  {
    field: 'content',
    label: '文章内容',
    component: 'Editor',
    colProps: {
      span: 24
    },
    formItemProps: {
      rules: [
        required(),
        {
          validator: (_: any, value: string, callback: Callback) => {
            notAllSpace(value, callback, '不能输入纯空格')
          },
          trigger: 'blur'
        }
      ]
    }
  }
])
const content = ref<any>()

watch(
  () => content.value,
  (val) => {
    let str = val.replace(/<[^>]+>/g, '')
    str = str.replace(/&nbsp;/gi, '')
    setValues({ content: str })
  }
)
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
      data.content = content.value
      if (data.id && detailsId.value) {
        editPost(data)
      } else {
        data.id = ''
        addPost(data)
      }
    }
  })
}

//编辑岗位
const editPost = async (data: any) => {
  const res = await editBannerContentApi(data)
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
    emitter.emit('getBannerList', 'edit')
    closeDrawer()
  }
}

//新增岗位
const addPost = async (data: any) => {
  const res = await addBannerContentApi(data)
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
    emitter.emit('getBannerList', 'add')
    closeDrawer()
  }
}

const isSave = ref<boolean>(false)
const pageTite = ref<string>('')
const detailsId = ref<string>('')

//打开drawer并初始化
const openDrawer = (flag: string, id: string) => {
  content.value = ''
  isShow.value = true
  nextTick(() => {
    //重置表单
    detailsId.value = ''
    setValue(false)
    isSave.value = flag === 'see' ? false : true
    changeDisabled(flag === 'see')
    pageTite.value = props.title + (flag === 'add' ? '新增' : flag === 'edit' ? '编辑' : '详情')

    if (id) {
      getDetailsData(id)
    }
  })
}

//关闭drawer
const closeDrawer = () => {
  content.value = ''
  fileList.value = []
  isShow.value = false
}

const resetFormAfterClose = () => {
  fileList.value = []
  detailsId.value = ''
  //重置表单
  setValue(true)
}
// 上传文件成功
const uploadFileSuccess = (data) => {
  if (data.length <= 0) {
    unref(formRef)?.setValues({
      coverUrl: '',
      fileName: ''
    })
  }
  unref(formRef)?.setValues({
    coverUrl: data[0].url,
    fileName: data[0].name
  })
}
let bannerContentData = reactive<any>({
  title: '',
  coverUrl: '',
  fileName: ''
})

const fileList = ref<any>([])
//获取详情
const getDetailsData = async (id: string) => {
  detailsId.value = id
  const res = await getBannerContentDetailApi(id)
  if (res && res.data) {
    bannerContentData = res.data
    content.value = res.data.content
    fileList.value.push({
      name: res.data.fileName,
      url: res.data.coverUrl
    })
    setValues(bannerContentData)
  }
}

//表单赋值
const setValue = (reset: boolean) => {
  const elFormRef = unref(formRef)?.getElFormRef()
  if (reset) {
    elFormRef?.resetFields()
  } else {
    unref(formRef)?.setValues({
      title: '',
      coverUrl: '',
      fileName: ''
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

defineExpose({
  isShow,
  openDrawer
})
</script>

<template>
  <Dialog v-model="isShow" width="70%" :title="pageTite" @close="closeDrawer">
    <Form :schema="schema" ref="formRef" class="form-content">
      <template #coverUrl>
        <FileUpload
          :modelValue="fileList"
          :isPreviewImg="true"
          :fileType="['jpg', 'gif', 'png', 'jpeg']"
          :fileSize="5"
          :limit="1"
          @upload-file-success="uploadFileSuccess"
        />
      </template>
      <template #content>
        <Editor ref="editorRef" v-model="content" :height="500" />
      </template>
    </Form>
    <template #footer>
      <div class="details-footer">
        <ElButton @click="closeDrawer"> 取消 </ElButton>
        <ElButton v-if="isSave" type="primary" :loading="loading" @click="save"> 保存 </ElButton>
      </div>
    </template>
  </Dialog>
</template>

<style lang="less" scoped>
:deep(.el-input-group__append) {
  background-color: white;
  width: 35px;
}
</style>
