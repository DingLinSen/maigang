<script setup lang="ts">
import { ref, unref, reactive, nextTick } from 'vue'
import { ElButton, ElMessage } from 'element-plus'
import { Form, FormExpose } from '@/components/Form'
import { Dialog } from '@/components/Dialog'
import { useEmitt } from '@/hooks/web/useEmitt'
// import { useValidator } from '@/hooks/web/useValidator'
import { propTypes } from '@/utils/propTypes'
import { FormSchema } from '@/types/form'
// import {
//   addImageContentApi,
//   editImageContentApi,
//   getImageContentDetailApi
// } from '@/api/imageContent'

// const { proxy } = getCurrentInstance() as any

// 表单校验
// type Callback = (error?: string | Error | undefined) => void
// const { required, validatePhone } = useValidator()

const props = defineProps({
  title: propTypes.string.def('')
})

const schema = reactive<FormSchema[]>([
  {
    field: 'taskName',
    label: '业务功能',
    component: 'Input',
    colProps: {
      span: 24
    }
  },
  {
    field: 'route',
    label: '业务接口',
    component: 'Input',
    colProps: {
      span: 24
    }
  },
  {
    field: 'operator',
    label: '操作类型',
    component: 'Input',
    colProps: {
      span: 24
    }
  },
  {
    field: 'operateTime',
    label: '操作结果',
    component: 'Input',
    colProps: {
      span: 24
    }
  },
  {
    field: 'operateTime',
    label: '请求地址',
    component: 'Input',
    colProps: {
      span: 24
    }
  },
  {
    field: 'operateTime',
    label: '请求参数',
    component: 'Input',
    colProps: {
      span: 24
    }
  },
  {
    field: 'operateTime',
    label: '操作人',
    component: 'Input',
    colProps: {
      span: 24
    }
  },
  {
    field: 'operateTime',
    label: '备注',
    component: 'Input',
    colProps: {
      span: 24
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
  // const form = unref(formRef)
  // const elFormRef = form?.getElFormRef()
  // await elFormRef?.validate(async (isValid) => {
  //   if (isValid) {
  //     loading.value = true
  //     let data = form?.formModel as any
  //     if (data.id && detailsId.value) {
  //       editPost(data)
  //     } else {
  //       data.id = ''
  addPost()
  //     }
  //   }
  // })
}

//编辑岗位
const editPost = async (data: any) => {
  const res = await editImageContentApi(data)
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
    emitter.emit('getImageList', 'edit')
    closeDrawer()
  }
}

//新增岗位
const addPost = async () => {
  // const res = await addImageContentApi(data)
  //   .catch(() => {})
  //   .finally(() => {
  //     nextTick(() => {
  //       setTimeout(() => {
  //         loading.value = false
  //       }, 300)
  //     })
  //   })
  // if (res) {
  ElMessage.success('成功保存信息')
  // emitter.emit('getImageList', 'add')
  closeDrawer()
  // }
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
let ImageContentData = reactive<any>({
  content: '',
  coverUrl: '',
  title: '',
  fileName: ''
})
//获取详情
const getDetailsData = async (id: string) => {
  detailsId.value = id
  const res = await getImageContentDetailApi(id)
  if (res && res.data) {
    ImageContentData = res.data
    setValues(ImageContentData)
  }
}
//表单赋值
const setValue = (reset: boolean) => {
  const elFormRef = unref(formRef)?.getElFormRef()
  if (reset) {
    elFormRef?.resetFields()
  } else {
    unref(formRef)?.setValues({
      content: '',
      coverUrl: '',
      title: '',
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
  <Dialog v-model="isShow" width="70%" :maxHeight="'auto'" :title="pageTite" @close="closeDrawer">
    <Form :schema="schema" ref="formRef" class="form-content"></Form>
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
