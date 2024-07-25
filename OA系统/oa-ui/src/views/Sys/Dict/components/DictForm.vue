<script setup lang="ts">
import { Form, FormExpose } from '@/components/Form'
import { ref, unref, reactive, nextTick, getCurrentInstance } from 'vue'
import { ContentWrap } from '@/components/ContentWrap'
import { propTypes } from '@/utils/propTypes'
import { DrawerWrap } from '@/components/DrawerWrap'
import { useEmitt } from '@/hooks/web/useEmitt'
import { useValidator } from '@/hooks/web/useValidator'
import { FormSchema } from '@/types/form'
import { DictData, DictOptionData } from '@/api/dict/types'
import { saveDictApi, editDictApi, getDictDetApi } from '@/api/dict'
import { ComponentOptions } from '@/types/components'
import { ElMessage } from 'element-plus'
import { ElDialog } from '@/components/ElDialog'

const { proxy } = getCurrentInstance() as any
const { sys_normal_disable } = proxy.useDict('sys_normal_disable')
// 弹窗的开启和关闭
const DialogFlag = ref<any>(false)
type Callback = (error?: string | Error | undefined) => void

const { required, validateEnglishAndNumber, notSpace } = useValidator()

const props = defineProps({
  title: propTypes.string.def('')
})

const schema = reactive<FormSchema[]>([
  {
    field: 'dictName',
    label: '字典名称',
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
    field: 'dictType',
    label: '字典类型',
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
        },
        {
          validator: (rule: any, value: string, callback: Callback) =>
            validateEnglishAndNumber(
              value,
              callback,
              '字典类型必须以字母开头，且只能为（小写字母，数字，下滑线）'
            ),
          trigger: 'blur'
        }
      ]
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
      let data = form?.formModel as DictData
      if (data.dictId && detailsId.value) {
        editDict(data)
      } else {
        data.dictId = ''
        addDict(data)
      }
    }
  })
}

//新增字典
const editDict = async (data: DictData) => {
  const res = await editDictApi(data)
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

//新增字典
const addDict = async (data: DictData) => {
  const res = await saveDictApi(data)
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
  setValue(true)
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

let dictData = reactive<DictData>({
  createBy: '',
  createTime: '',
  updateBy: '',
  updateTime: '',
  remark: '',
  dictId: '',
  dictName: '',
  dictType: '',
  status: '0'
})

//获取详情
const getDetailsData = async (id: string) => {
  detailsId.value = id
  const res = await getDictDetApi(id)
  if (res && res.data) {
    dictData = res.data
    setValues(dictData)
  }
}

//表单赋值
const setValue = (reset: boolean) => {
  const elFormRef = unref(formRef)?.getElFormRef()
  if (reset) {
    elFormRef?.resetFields()
  } else {
    unref(formRef)?.setValues({
      remark: '',
      dictId: '',
      dictName: '',
      dictType: '',
      status: '0'
    })
  }
}

const setValues = (form: DictData) => {
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
