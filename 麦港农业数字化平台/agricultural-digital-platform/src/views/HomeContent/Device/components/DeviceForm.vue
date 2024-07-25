<script setup lang="ts">
import { ref, unref, reactive, getCurrentInstance, nextTick } from 'vue'
import { ElButton, ElMessage, ElTooltip } from 'element-plus'
import { Form, FormExpose } from '@/components/Form'
import { Dialog } from '@/components/Dialog'
import { useEmitt } from '@/hooks/web/useEmitt'
import { useValidator } from '@/hooks/web/useValidator'
import { propTypes } from '@/utils/propTypes'
import { FormSchema } from '@/types/form'
import { PostData } from '@/api/post/types'
import { savePostApi, editPostApi, getPostDetApi } from '@/api/post'
import { FileUpload } from '@/components/FileUpload'

const { proxy } = getCurrentInstance() as any

// 表单校验
type Callback = (error?: string | Error | undefined) => void
const { required, validatePhone } = useValidator()

const props = defineProps({
  title: propTypes.string.def('')
})

const schema = reactive<FormSchema[]>([
  {
    field: 'postName',
    label: '手机号',
    component: 'Input',
    colProps: {
      span: 24
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
    field: 'postName',
    label: '农场名称',
    component: 'Input',
    colProps: {
      span: 24
    },
    componentProps: {
      maxlength: 20,
      clearable: false
    }
  },
  {
    field: 'postName',
    label: '大棚名称',
    component: 'Input',
    colProps: {
      span: 24
    },
    componentProps: {
      maxlength: 20,
      clearable: false
    }
  },
  {
    field: 'postName',
    label: '设备类型',
    component: 'Input',
    colProps: {
      span: 24
    },
    componentProps: {
      maxlength: 20,
      clearable: false
    }
  },
  {
    field: 'postName',
    label: '设备名称',
    component: 'Input',
    colProps: {
      span: 24
    },
    componentProps: {
      maxlength: 20,
      clearable: false
    }
  },
  {
    field: 'postName',
    label: '设备ID',
    component: 'Input',
    colProps: {
      span: 24
    },
    componentProps: {
      maxlength: 20,
      clearable: false
    }
  },
  {
    field: 'postName',
    label: '备注',
    component: 'Input',
    colProps: {
      span: 24
    },
    componentProps: {
      maxlength: 20,
      clearable: false
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
      let data = form?.formModel as PostData
      if (data.postId && detailsId.value) {
        editPost(data)
      } else {
        data.postId = ''
        addPost(data)
      }
    }
  })
}

//编辑岗位
const editPost = async (data: PostData) => {
  const res = await editPostApi(data)
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
const addPost = async (data: PostData) => {
  const res = await savePostApi(data)
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
const openDrawer = (flag: string, id: string) => {
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
  isShow.value = false
}

const resetFormAfterClose = () => {
  detailsId.value = ''
  //重置表单
  setValue(true)
}

let postData = reactive<PostData>({
  createBy: '',
  createTime: '',
  updateBy: '',
  updateTime: '',
  remark: '',
  postId: '',
  postCode: '',
  postName: '',
  postSort: null,
  status: '0',
  flag: false
})

//获取详情
const getDetailsData = async (id: string) => {
  detailsId.value = id
  const res = await getPostDetApi(id)
  if (res && res.data) {
    postData = res.data
    setValues(postData)
  }
}

//表单赋值
const setValue = (reset: boolean) => {
  const elFormRef = unref(formRef)?.getElFormRef()
  if (reset) {
    elFormRef?.resetFields()
  } else {
    unref(formRef)?.setValues({
      postId: '',
      postName: '',
      postSort: null,
      status: '0',
      postCode: '',
      remark: ''
    })
  }
}

const setValues = (form: PostData) => {
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
      <template #filePath>
        <FileUpload :fileType="['jpg', 'gif', 'png', 'jpeg']" :fileSize="5" :limit="3" />
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
