<script setup lang="ts">
import { Form, FormExpose } from '@/components/Form'
import { ref, unref, reactive, nextTick, getCurrentInstance } from 'vue'
import { ContentWrap } from '@/components/ContentWrap'
import { propTypes } from '@/utils/propTypes'
import { DrawerWrap } from '@/components/DrawerWrap'
import { useEmitt } from '@/hooks/web/useEmitt'
import { useValidator } from '@/hooks/web/useValidator'
import { FormSchema } from '@/types/form'
import { PostData } from '@/api/post/types'
import { savePostApi, editPostApi, getPostDetApi } from '@/api/post'
import { ComponentOptions } from '@/types/components'
import { ElDialog } from '@/components/ElDialog'
import { ElButton, ElMessage, ElTooltip } from 'element-plus'

const { proxy } = getCurrentInstance() as any
const { sys_normal_disable } = proxy.useDict('sys_normal_disable')
// callback 类型
type Callback = (error?: string | Error | undefined) => void

const { required, notSpace } = useValidator()
// 弹窗的开启和关闭
const DialogFlag = ref<any>(false)
const props = defineProps({
  title: propTypes.string.def('')
})

const schema = reactive<FormSchema[]>([
  {
    field: 'postName',
    label: '岗位名称',
    component: 'Input',
    colProps: {
      span: 12
    },
    componentProps: {
      maxlength: 10,
      clearable: false
    },
    formItemProps: {
      rules: [
        required(),
        {
          validator: (rule: any, value: string, callback: Callback) =>
            notSpace(value, callback, '不能输入纯空格'),
          trigger: 'blur'
        }
      ]
    }
  },
  {
    field: 'postCode',
    label: '岗位编码',
    component: 'Input',
    colProps: {
      span: 12
    },
    componentProps: {
      maxlength: 10,
      clearable: false
    },
    formItemProps: {
      rules: [
        required(),
        {
          validator: (rule: any, value: string, callback: Callback) =>
            notSpace(value, callback, '不能输入纯空格'),
          trigger: 'blur'
        }
      ]
    }
  },
  {
    field: 'postSort',
    label: '岗位排序',
    value: null,
    component: 'InputNumber',
    colProps: {
      span: 12
    },
    componentProps: {
      style: 'width:100%;',
      min: -999999,
      max: 999999,
      precision: 0,
      controlsPosition: 'right'
    },
    formItemProps: {
      rules: [required()]
    }
  },
  {
    field: 'status',
    label: '状态',
    value: '0',
    component: 'Radio',
    componentProps: {
      options: sys_normal_disable
    }
  },
  {
    field: 'remark',
    label: '备注',
    component: 'Input',
    colProps: {
      span: 24
    },
    componentProps: {
      maxlength: 100,
      type: 'textarea',
      autosize: true,
      rows: 3
    },
    formItemProps: {
      rules: [
        {
          validator: (rule: any, value: string, callback: Callback) =>
            notSpace(value, callback, '不能输入纯空格'),
          trigger: 'blur'
        }
      ]
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
      setTimeout(() => {
        loading.value = false
      }, 200)
    })
  if (res) {
    ElMessage.success('保存信息成功')
    emitter.emit('getList', 'add')
    closeDrawer()
  }
}

//新增岗位
const addPost = async (data: PostData) => {
  const res = await savePostApi(data)
    .catch(() => {})
    .finally(() => {
      setTimeout(() => {
        loading.value = false
      }, 200)
    })
  if (res) {
    ElMessage.success('保存信息成功')
    emitter.emit('getList', 'add')
    closeDrawer()
  }
}

const isSave = ref<boolean>(false)
const pageTite = ref<string>('')
const drawerWrap = ref<ComponentRef<typeof DrawerWrap>>()
const detailsId = ref<string>('')

const ElDialogFef = ref()
//打开drawer并初始化
const openDrawer = (flag: string, id: string) => {
  //重置表单
  detailsId.value = ''
  setValue(false)
  isSave.value = flag === 'see' ? false : true
  changeDisabled(flag === 'see')
  pageTite.value = flag === 'add' ? '新增' : flag === 'edit' ? '编辑' : '详情'
  // drawerWrap.value.isShow = true
  DialogFlag.value = true
  ElDialogFef.value.isFullscreen = false
  if (id) {
    getDetailsData(id)
  }
}

//关闭drawer
const closeDrawer = () => {
  // drawerWrap.value.isShow = false
  DialogFlag.value = false
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
  <!-- 可设置宽度 :dialogWidth="400" -->
  <ElDialog
    ref="ElDialogFef"
    class="cultivate-custom"
    v-model="DialogFlag"
    :title="pageTite"
    @closed="DialogFlag = false"
  >
    <Form :schema="schema" ref="formRef">
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
      <div class="footer">
        <el-button type="primary" :loading="loading" @click="save"> 提交 </el-button>
        <el-button @click="closeDrawer"> 取消 </el-button>
      </div>
    </template>
  </ElDialog>
</template>

<style lang="less" scoped>
:deep(.el-input-group__append) {
  background-color: white;
  width: 35px;
}

:deep(.el-input-number .el-input__inner) {
  text-align: left;
}
</style>
