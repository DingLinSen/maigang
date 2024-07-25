<script setup lang="ts">
import { ref, unref, reactive, nextTick } from 'vue'
import { ElMessage } from 'element-plus'

import { Dialog } from '@/components/Dialog'
import { Form, FormExpose } from '@/components/Form'
import { useEmitt } from '@/hooks/web/useEmitt'
import { useValidator } from '@/hooks/web/useValidator'
import { FormSchema } from '@/types/form'
import { propTypes } from '@/utils/propTypes'
import { DictData } from '@/api/dict/types'
import { saveDictApi, editDictApi, getDictDetApi } from '@/api/dict'

// const { proxy } = getCurrentInstance() as any
// const { sys_normal_disable } = proxy.useDict('sys_normal_disable')

type Callback = (error?: string | Error | undefined) => void

const { required, validateEnglishAndNumber } = useValidator()

const props = defineProps({
  title: propTypes.string.def('')
})

const schema = reactive<FormSchema[]>([
  {
    field: 'dictName',
    label: '字典名称',
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
    field: 'dictType',
    label: '字典类型',
    component: 'Input',
    colProps: {
      span: 8
    },
    componentProps: {
      maxlength: 50,
      clearable: false
    },
    formItemProps: {
      rules: [
        required(),
        {
          validator: (_: any, value: string, callback: Callback) =>
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
    colProps: {
      span: 8
    },
    componentProps: {
      // options: sys_normal_disable
      options: [
        {
          label: '正常',
          value: '0'
        },
        {
          label: '禁用',
          value: '1'
        }
      ]
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
      maxlength: 500,
      type: 'textarea',
      rows: 3
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

//编辑字典
const editDict = async (data: DictData) => {
  const res = await editDictApi(data)
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
    emitter.emit('getDictList', 'edit')
    closeDrawer()
  }
}

//新增字典
const addDict = async (data: DictData) => {
  const res = await saveDictApi(data)
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
    emitter.emit('getDictList', 'add')
    closeDrawer()
  }
}

const isSave = ref<boolean>(false)
const pageTite = ref<string>('')
const detailsId = ref<string>('')

//打开drawer并初始化
const openDrawer = (flag: string, id?: string) => {
  isShow.value = true

  nextTick(() => {
    //重置表单
    detailsId.value = ''
    setValue(true)
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
  <Dialog v-model="isShow" width="70%" :maxHeight="'auto'" :title="pageTite" @close="closeDrawer">
    <Form :schema="schema" ref="formRef" class="form-content" />
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
