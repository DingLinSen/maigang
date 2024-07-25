<template>
  <ElDialog
    ref="ElDialogRef"
    v-model="AddDialogVisible"
    :title="dialogTitle"
    class="cultivate-custom"
    @closed="back"
  >
    <Form ref="formRef" :schema="schema"> </Form>
    <template #footer>
      <div class="footer">
        <el-button
          v-if="isAuth('AdministrativeService:inventoryManagement:submit')"
          :loading="loading"
          type="primary"
          @click="save"
          >保存
        </el-button>
        <el-button :loading="loading" @click="reset">重置</el-button>
        <el-button @click="back">返回</el-button>
      </div>
    </template>
  </ElDialog>
</template>
<script lang="ts" setup>
import { ref, unref, nextTick, reactive, getCurrentInstance } from 'vue'
import { ElDialog } from '@/components/ElDialog'
import { useValidator } from '@/hooks/web/useValidator'
import { FormSchema } from '@/types/form'
import { Form, FormExpose } from '@/components/Form'
import {
  addTinfoGoods,
  getDetailTinfoGoods,
  editTinfoGoods
} from '@/api/AdministrativeService/inventoryManagement'
import { ElMessage } from 'element-plus'
import { isAuth } from '@/utils/is'
import { Message } from 'postcss' // 鉴权

// 从字典管理拿到物品类型的数据
const { proxy } = getCurrentInstance() as any
const { goods_type } = proxy.useDict('goods_type')
const formRef = ref<FormExpose>()
const {
  required,
  notSpace,
  validateNumSearch,
  validateNotNum,
  validateIntegerSearch,
  validateNoNum
} = useValidator()
// callback 类型
type Callback = (error?: string | Error | undefined) => void
const groupList = ref<any>()
const content = ref<any>()
const checkboxList = ref<any>()
const loading = ref(false)
// 弹窗默认关闭
const AddDialogVisible = ref<boolean>(false)
// 弹出框的标题
const dialogTitle = ref<string>('')
const ElDialogRef = ref()
// 是否为编辑
const isEdit = ref<boolean>(false)
const emit = defineEmits(['changeGetDetailAndList'])
let goodsData = reactive({
  goodsName: '',
  goodsType: '',
  stockNum: ''
})
// 是否为负值
const isMinus = ref<boolean>(false)
// 表单项
const schema = ref<FormSchema[]>([
  {
    field: 'goodsType',
    label: '物品类型',
    component: 'Select',
    colProps: {
      span: 24
    },
    componentProps: {
      options: goods_type,
      style: 'width:100%;',
      maxlength: 200,
      clearable: false,
      placeholder: '请选择物品类型'
    },
    formItemProps: {
      rules: [required('该项为必选项')]
    }
  },
  {
    field: 'goodsName',
    label: '物品名称',
    component: 'Input',
    colProps: {
      span: 24
    },
    componentProps: {
      style: 'width:100%;',
      maxlength: 200,
      clearable: false,
      placeholder: '请输入物品名称'
    },
    formItemProps: {
      rules: [
        required(),
        {
          validator: (rule: any, value: number, callback: Callback) =>
            validateNoNum(value, callback, '不支持纯数字'),
          trigger: 'blur'
        }
      ]
    }
  },
  {
    field: 'stockNum',
    label: '库存数量',
    component: 'Input',
    colProps: {
      span: 24
    },
    value: 0,
    componentProps: {
      style: 'width:100%;',
      maxlength: 200,
      clearable: false,
      placeholder: '请输入库存数量'
    },
    formItemProps: {
      rules: [
        required(),
        {
          validator: (rule: any, value: number, callback: Callback) =>
            validateIntegerSearch(value, callback, '请输入正整数'),
          trigger: 'blur'
        },
        {
          validator: (rule: any, value: number, callback: Callback) => {
            const form = unref(formRef)?.formModel
            if (form.stockNum.length > 8) {
              callback(new Error('请输入八位以内的正整数'))
            } else {
              callback()
            }
          },
          trigger: 'blur'
        }
      ]
    }
  },
  {
    field: 'changeNum',
    label: '新增数量',
    component: 'Input',
    colProps: {
      span: 24
    },
    value: 1,
    componentProps: {
      style: 'width:100%;',
      maxlength: 200,
      clearable: false,
      placeholder: '请输入数量'
    },
    formItemProps: {
      rules: [
        required(),
        {
          validator: (rule: any, value: number, callback: Callback) =>
            validateIntegerSearch(value, callback, '请输入正整数'),
          trigger: 'blur'
        },
        {
          validator: (rule: any, value: string, callback: Callback) => {
            const form = unref(formRef)?.formModel
            if (form.changeNum.length > 8) {
              callback(new Error('请输入八位以内的正整数'))
            } else {
              callback()
            }
            // if (isMinus.value) {
            //   console.log(Number(form.stockNum) < Number(form.changeNum))
            //   if (Number(form.stockNum) < Number(form.changeNum)) {
            //     ElMessage.warning('减少数量不能大于库存数量')
            //     return
            //     callback(new Error('减少数量不能大于库存数量'))
            //   } else {
            //     debugger
            //     callback()
            //   }
            // }
          },
          trigger: 'blur'
        }
      ]
    }
  }
])
//FormItem显示隐藏
const setFormHidden = (field: string, value: boolean) => {
  nextTick(() => {
    unref(formRef)?.setSchema([
      {
        field: field,
        path: 'hidden',
        value: value
      }
    ])
  })
}
// 更改FormItem的值
const editFormLabel = (field: string, value: string) => {
  nextTick(() => {
    unref(formRef)?.setSchema([
      {
        field: field,
        path: 'label',
        value: value
      }
    ])
  })
}
// ComponentProps是否禁用
const formDisabled = (obj: any, value: boolean) => {
  nextTick(() => {
    for (let key in obj) {
      unref(formRef)?.setSchema([
        {
          field: key,
          path: 'componentProps.disabled',
          value: value
        }
      ])
    }
  })
}
const isInput = ref(false)
// 打开弹出框
const openDialog = (flag: boolean, id: number, str: string) => {
  ElDialogRef.value.isFullscreen = false
  AddDialogVisible.value = true
  isEdit.value = flag ? false : true
  isMinus.value = str ? true : false
  setFormHidden('changeNum', isEdit.value ? false : true)
  formDisabled(goodsData, isEdit.value ? true : false)
  dialogTitle.value = flag ? '新增' : '编辑'
  if (isMinus.value) {
    editFormLabel('changeNum', '减少数量')
  } else {
    editFormLabel('changeNum', '新增数量')
  }
  if (id) {
    getDetail(id)
    editFormLabel('stockNum', '现有库存数量')
  } else {
    editFormLabel('stockNum', '库存数量')
  }
}
// 获取详情
const getDetail = async (id: number) => {
  let params = {
    id: id
  }
  const res = await getDetailTinfoGoods(params)
  let data = res.data
  // 新增数量的默认值
  data.changeNum = 1
  setValues(data)
}
const setValues = (form) => {
  unref(formRef)?.setValues(form)
}
// 点击返回
const back = () => {
  unref(formRef)?.setValues({
    goodsName: '',
    goodsType: '',
    stockNum: ''
  })
  AddDialogVisible.value = false
}
// 新增
const addAnnouncement = async (data: any) => {
  const res = await addTinfoGoods(data)
    .catch(() => {})
    .finally(() => {
      setTimeout(() => {
        loading.value = false
      }, 200)
    })
  if (res) {
    ElMessage.success('新增库存成功')
    emit('changeGetDetailAndList')
    AddDialogVisible.value = false
  }
}
// 编辑
const EditAnnouncement = async (data: any) => {
  const res = await editTinfoGoods(data)
    .catch(() => {})
    .finally(() => {
      setTimeout(() => {
        loading.value = false
      }, 200)
    })
  if (res) {
    ElMessage.success('修改库存成功')
    emit('changeGetDetailAndList')
    AddDialogVisible.value = false
  }
}
// 点击保存
const save = async () => {
  const form = unref(formRef)
  const elFormRef = form?.getElFormRef()
  await elFormRef?.validate((isValid) => {
    if (isValid) {
      let data = form?.formModel as any
      if (isMinus.value) {
        let num = '-' + data.changeNum
        if (Number(data.stockNum) < Number(data.changeNum)) {
          ElMessage.warning('减少数量不能大于库存数量')
          return
        }
        data.changeNum = num
      }
      loading.value = true
      if (isEdit.value) {
        EditAnnouncement(data)
      } else {
        addAnnouncement(data)
      }
    }
  })
}
// 点击重置
const reset = () => {
  if (isEdit.value) {
    unref(formRef)?.setValues({
      changeNum: ''
    })
    return
  }
  unref(formRef)?.setValues({
    goodsName: '',
    goodsType: '',
    stockNum: ''
  })
}
// 传递给父组件的方法
defineExpose({
  openDialog
})
</script>
<style lang="scss" scoped></style>
