<script setup lang="ts">
import { ref, unref, reactive, getCurrentInstance, nextTick } from 'vue'
import { ElButton, ElMessage, ElTooltip } from 'element-plus'
import { Form, FormExpose } from '@/components/Form'
import { Dialog } from '@/components/Dialog'
import { useEmitt } from '@/hooks/web/useEmitt'
import { useValidator } from '@/hooks/web/useValidator'
import { propTypes } from '@/utils/propTypes'
import { FormSchema } from '@/types/form'
import {
  saveCropLevelApi,
  editCropLevelApi,
  getCropLevelApi,
  getCropLevelDetailApi
} from '@/api/crop'
import { FileUpload } from '@/components/FileUpload'

const { proxy } = getCurrentInstance() as any

// 表单校验
type Callback = (error?: string | Error | undefined) => void
const { required, validatePhone } = useValidator()

const props = defineProps({
  title: propTypes.string.def('')
})
const categoryData = ref<any>([])
const classificationData = ref<any>([])

const schema = reactive<FormSchema[]>([
  {
    field: 'grandName',
    label: '类别',
    component: 'Input',
    colProps: {
      span: 24
    },
    componentProps: {
      style: 'width:100%;', //宽度
      maxlength: 20,
      clearable: false
    },
    formItemProps: {
      rules: [required()]
    }
  },
  {
    field: 'parentName',
    label: '作物分类',
    component: 'Input',
    colProps: {
      span: 24
    },
    componentProps: {
      style: 'width:100%;', //宽度
      maxlength: 20,
      clearable: false
    },
    formItemProps: {
      rules: [required()]
    }
  },
  {
    field: 'name',
    label: '作物种类',
    component: 'Input',
    colProps: {
      span: 24
    },
    componentProps: {
      style: 'width:100%;', //宽度
      maxlength: 20,
      clearable: false
    },
    formItemProps: {
      rules: [required()]
    }
  }
])

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
      data.level = '3'
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
  const res = await editCropLevelApi(data)
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
    emitter.emit('getPostList', 'edit')
    closeDrawer()
  }
}

//新增岗位
const addPost = async (data: any) => {
  const res = await saveCropLevelApi(data)
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
    emitter.emit('getPostList', 'add')
    closeDrawer()
  }
}

const isSave = ref<boolean>(false)
const pageTite = ref<string>('')
const detailsId = ref<string>('')
//打开drawer并初始化
const openDrawer = async (flag: string, id: string) => {
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
  unref(formRef)?.setValues({
    coverUrl: data[0].url,
    fileName: data[0].name
  })
}
let CropLevelData = reactive<any>({})
const fileList = ref<any>([])
//获取详情
const getDetailsData = async (id: string) => {
  detailsId.value = id
  const res = await getCropLevelApi(id)
  if (res && res.data) {
    CropLevelData = res.data
    unref(formRef)?.setValues({
      parentId: res.data.parentId
    })
    fileList.value.push({
      name: res.data.fileName,
      url: res.data.coverUrl
    })
    setValues(CropLevelData)
  }
}

//表单赋值
const setValue = (reset: boolean) => {
  const elFormRef = unref(formRef)?.getElFormRef()
  if (reset) {
    elFormRef?.resetFields()
  } else {
    unref(formRef)?.setValues({})
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
  <Dialog v-model="isShow" width="70%" :maxHeight="'auto'" :title="pageTite" @close="closeDrawer">
    <Form :schema="schema" ref="formRef" class="form-content">
      <template #coverUrl>
        <FileUpload
          :modelValue="fileList"
          :fileType="['jpg', 'gif', 'png', 'jpeg']"
          :fileSize="5"
          :limit="1"
          @upload-file-success="uploadFileSuccess"
        />
      </template>
      <template #path-append>
        <ElTooltip
          effect="dark"
          content="访问的路由地址，如：`user`，如外网地址需内链访问则以`http(s)://`开头"
        >
          <Icon icon="ep:question-filled" />
        </ElTooltip>
      </template>

      <template #component-append>
        <ElTooltip
          effect="dark"
          content="访问的组件路径，如：`system/user/index`，默认在`views`目录下"
        >
          <Icon icon="ep:question-filled" />
        </ElTooltip>
      </template>
      <template #perms-append>
        <ElTooltip
          effect="dark"
          content="控制器中定义的权限字符，如：@PreAuthorize(`@ss.hasPermi('system:user:list')`)"
        >
          <Icon icon="ep:question-filled" />
        </ElTooltip>
      </template>

      <template #query-append>
        <ElTooltip
          effect="dark"
          content="访问路由的默认传递参数，如：`{``id``: 1, ``name``: ``ry``}`"
        >
          <Icon icon="ep:question-filled" />
        </ElTooltip>
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
