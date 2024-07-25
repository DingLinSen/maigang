<template>
  <ElDialog
    ref="ElDialogRef"
    class="cultivate-custom"
    v-model="AddDialogVisible"
    :title="dialogTitle"
    @closed="back"
  >
    <Form :schema="schema" ref="formRef"> </Form>
    <template #footer>
      <div class="footer">
        <el-button
          v-if="isAuth('AdministrativeService:assessmentType:submit')"
          type="primary"
          :loading="loading"
          @click="save"
          >保存
        </el-button>
        <el-button @click="back">取消</el-button>
      </div>
    </template>
  </ElDialog>
</template>
<script setup lang="ts">
import { ref, unref, onMounted } from 'vue'
import { ElDialog } from '@/components/ElDialog'
import { useValidator } from '@/hooks/web/useValidator'
import { FormSchema } from '@/types/form'
import { Form, FormExpose } from '@/components/Form'
import { Editor } from '@/components/Editor'
import {
  addAssessmentType,
  editAssessmentType,
  getDetailAssessmentType
} from '@/api/AdministrativeService/assessmentType'
import { ElMessage } from 'element-plus'
import { getdeptListApi } from '@/api/user'
import { isAuth } from '@/utils/is'

const formRef = ref<FormExpose>()
const { required, notSpace, validateNumSearch, validateIntegerSearch } = useValidator()
// callback 类型
type Callback = (error?: string | Error | undefined) => void
const groupList = ref<any>()
const checkAll = ref<boolean>(true) // 全选
const isIndeterminate = ref<boolean>(false) //复选框的样式,
const content = ref<any>()
const checkboxList = ref<any>()
const loading = ref(false)
// 弹窗默认关闭
const AddDialogVisible = ref<boolean>(false)
// 弹出框的标题
const dialogTitle = ref<string>('')
// 是否为编辑
const isEdit = ref<boolean>(false)
const emit = defineEmits(['changeGetDetailAndList'])
onMounted(() => {
  // getdeptList()
})
// 获取部门列表
const deptList = ref([])
const getDepList = async () => {
  let res = await getdeptListApi({ pageSize: 99999 })
  res.data.map((item) => {
    let obj = {
      value: '',
      label: ''
    }
    obj.value = item.deptId
    obj.label = item.deptName
    deptList.value.push(obj)
  })
}
getDepList()
// 表单项
const schema = ref<FormSchema[]>([
  {
    field: 'deptId',
    label: '部门',
    component: 'Select',
    colProps: {
      span: 24
    },
    componentProps: {
      style: 'width:100%;',
      maxlength: 200,
      clearable: false,
      placeholder: '请选择部门',
      options: deptList.value
    },
    formItemProps: {
      rules: [required('该项为必选项')]
    }
  },
  {
    field: 'indexContent',
    component: 'Input',
    label: '指标内容',
    colProps: {
      span: 24
    },
    componentProps: {
      placeholder: '请输入指标内容',
      disabled: false,
      maxlength: 500,
      clearable: true,
      autosize: true,
      style: 'width:100%',
      type: 'textarea',
      rows: 3
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
    field: 'standardsOfGrading',
    component: 'Input',
    label: '评分标准',
    colProps: {
      span: 24
    },
    componentProps: {
      placeholder: '请输入评分标准',
      disabled: false,
      maxlength: 500,
      clearable: true,
      autosize: true,
      style: 'width:100%',
      type: 'textarea',
      rows: 3
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
    field: 'orderNum',
    label: '排序',
    component: 'Input',
    colProps: {
      span: 24
    },
    componentProps: {
      style: 'width:100%;',
      maxlength: 200,
      clearable: false,
      placeholder: '请输入排序'
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
            console.log(value.length)
            if (value.length > 2) {
              callback(new Error('只能输入两位数'))
            } else {
              callback()
            }
          },
          trigger: 'blur'
        }
      ]
    }
  }
])

const ElDialogRef = ref()
// 打开弹出框
const openDialog = (flag: boolean, id: number) => {
  ElDialogRef.value.isFullscreen = false
  AddDialogVisible.value = true
  isEdit.value = flag ? false : true
  dialogTitle.value = flag ? '新增' : '编辑'
  if (id) {
    getDetail(id)
  }
}
// 获取详情
const getDetail = async (id: number) => {
  let params = {
    id: id
  }
  const res = await getDetailAssessmentType(params)
  setValues(res.data)
}
const setValues = (form) => {
  unref(formRef)?.setValues(form)
}
// 点击返回
const back = () => {
  content.value = ''
  checkAll.value = true
  AddDialogVisible.value = false
}
// 新增公告
const addAnnouncement = async (data: any) => {
  const res = await addAssessmentType(data)
    .catch(() => {})
    .finally(() => {
      setTimeout(() => {
        loading.value = false
      }, 200)
    })
  if (res) {
    ElMessage.success('保存信息成功')
    emit('changeGetDetailAndList')
    AddDialogVisible.value = false
  }
}
// 编辑
const EditAnnouncement = async (data: any) => {
  const res = await editAssessmentType(data)
    .catch(() => {})
    .finally(() => {
      setTimeout(() => {
        loading.value = false
      }, 200)
    })
  if (res) {
    ElMessage.success('成功修改信息')
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
      loading.value = true
      let data = form?.formModel as any
      if (isEdit.value) {
        EditAnnouncement(data)
      } else {
        addAnnouncement(data)
      }
    }
  })
}
// 传递给父组件的方法
defineExpose({
  openDialog
})
</script>
<style lang="scss" scoped>
</style>
