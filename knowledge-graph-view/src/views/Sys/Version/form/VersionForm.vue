<script setup lang="ts">
import { Form, FormExpose } from '@/components/Form'
import { ref, unref, reactive, nextTick } from 'vue'
import { ContentWrap } from '@/components/ContentWrap'
import { propTypes } from '@/utils/propTypes'
import { DrawerWrap } from '@/components/DrawerWrap'
import { useEmitt } from '@/hooks/web/useEmitt'
import { useValidator } from '@/hooks/web/useValidator'
import { FormSchema } from '@/types/form'
import { ElDialog } from '@/components/ElDialog'
import { addVersionApi, editVersionApi, getVersionDetailApi } from '@/api/version'
import { ComponentOptions } from '@/types/components'
import { ElButton, ElMessage, ElTooltip } from 'element-plus'
import moment from 'moment'

// callback 类型
type Callback = (error?: string | Error | undefined) => void

// 弹窗的开启和关闭
const DialogFlag = ref<any>(false)
const { required, notSpace } = useValidator()

const props = defineProps({
  title: propTypes.string.def('')
})

const schema = reactive<FormSchema[]>([
  {
    field: 'versionNumber',
    label: '版本号',
    component: 'Input',
    colProps: {
      span: 12
    },
    componentProps: {
      maxlength: 20,
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
    field: 'publishTime',
    label: '发版时间',
    component: 'DatePicker',
    colProps: {
      span: 12
    },
    componentProps: {
      style: 'width:100%',
      placeholder: '请选择发版时间',
      format: 'YYYY-MM-DD',
      valueFormat: 'YYYY-MM-DD'
    },
    formItemProps: {
      rules: [required()]
    }
  },
  {
    field: 'versionDescription',
    label: '版本说明',
    component: 'Editor',
    colProps: {
      span: 24
    },
    componentProps: {
      height: 500
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
      data.publishTime = moment(data.publishTime).format('YYYY-MM-DD')
      if (detailsId.value) {
        editNotice(data)
      } else {
        addNotice(data)
      }
    }
  })
}

//编辑岗位
const editNotice = async (data: any) => {
  const res = await editVersionApi(data)
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
const addNotice = async (data: any) => {
  const res = await addVersionApi(data)
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
  DialogFlag.value = true
  ElDialogFef.value.isFullscreen = false
  if (id) {
    getDetailsData(id)
  }
}

//关闭drawer
const closeDrawer = () => {
  DialogFlag.value = false
  // drawerWrap.value.isShow = false
}

const resetFormAfterClose = () => {
  detailsId.value = ''
  //重置表单
  setValue(true)
}

let postData = ref<any>({
  versionNumber: '',
  versionDescription: '',
  publishTime: ''
})

//获取详情
const getDetailsData = async (id: string) => {
  detailsId.value = id
  const res = await getVersionDetailApi(id)
  if (res && res.data) {
    postData.value = res.data
    setValues(postData.value)
  }
}

//表单赋值
const setValue = (reset: boolean) => {
  const elFormRef = unref(formRef)?.getElFormRef()
  if (reset) {
    elFormRef?.resetFields()
  } else {
    unref(formRef)?.setValues({
      versionNumber: '',
      versionDescription: '',
      publishTime: ''
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
  <ElDialog
    ref="ElDialogFef"
    class="cultivate-custom"
    :maxHeight="'auto'"
    v-model="DialogFlag"
    :title="pageTite"
    @closed="DialogFlag = false"
  >
    <Form :schema="schema" ref="formRef" />
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
</style>
