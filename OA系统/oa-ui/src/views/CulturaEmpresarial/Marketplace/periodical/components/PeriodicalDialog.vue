<template>
  <ElDialog
    ref="ElDialogRef"
    class="cultivate-custom"
    v-model="AddDialogVisible"
    :title="dialogTitle"
    @closed="back"
  >
    <Form :schema="schema" ref="formRef">
      <!-- 富文本 -->
      <template #content>
        <Editor v-model="content" ref="editorRef" :height="500" :isReadOnly="isDisabled" />
      </template>
    </Form>
    <template #footer>
      <div class="footer">
        <el-button type="primary" :loading="loading" @click="save">保存 </el-button>
        <el-button @click="reset">重置</el-button>
        <el-button @click="back">返回</el-button>
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
import { ElMessage } from 'element-plus'
import { isAuth } from '@/utils/is'
import {
  addCompanyJournal,
  editCompanyJournal,
  getDetailCompanyJournal
} from '@/api/CulturaEmpresarial/periodical'

const formRef = ref<FormExpose>()
const { required, notSpace } = useValidator()
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
const isDisabled = ref(false)
// 表单项
const schema = ref<FormSchema[]>([
  {
    field: 'title',
    label: '标题',
    component: 'Input',
    colProps: {
      span: 24
    },
    componentProps: {
      style: 'width:100%;',
      maxlength: 200,
      clearable: false,
      placeholder: '请输入标题',
      disabled: isDisabled
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
    field: 'filePath',
    label: '上传文件',
    component: 'FileUpload',
    componentProps: {
      style: 'width:100%',
      fileSize: 100,
      disabled: false,
      fileSize: 100,
      limit: 1, // 数量限制
      fileSize: 100,
      fileType: ['pdf'] // 文件类型
    },
    colProps: {
      span: 24
    },
    formItemProps: {
      rules: [required()]
    }
  }
])

// 打开弹出框
const openDialog = (flag: boolean, id: number, str: string) => {
  AddDialogVisible.value = true
  isEdit.value = flag ? false : true
  dialogTitle.value = flag ? '新增' : '编辑'
  if (id) {
    getDetail(id)
  }
  if (str) {
    getDetail(id)
    isDisabled.value = true
  }
}
// 获取详情
const getDetail = async (id) => {
  const res = await getDetailCompanyJournal(id)
  if (res && res.data) {
    var arr = []
    if (res.data.tinfoAnnouncementDeptDos) {
      res.data.tinfoAnnouncementDeptDos.forEach((v) => {
        if (arr.indexOf(v.deptId) == -1) {
          arr.push(v.deptId)
        }
      })
    }
    groupList.value = arr
    content.value = res.data.content ? res.data.content : ''
    setValues(res.data)
  }
}
const setValues = (form) => {
  unref(formRef)?.setValues(form)
}
// 点击返回
const back = () => {
  content.value = ''
  checkAll.value = true
  AddDialogVisible.value = false
  isDisabled.value = false
}
// 新增
const addAnnouncement = async (data: any) => {
  const res = await addCompanyJournal(data)
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
  const res = await editCompanyJournal(data)
    .catch(() => {})
    .finally(() => {
      setTimeout(() => {
        loading.value = false
      }, 200)
    })
  if (res) {
    ElMessage.success('修改信息成功')
    emit('changeGetDetailAndList')
    AddDialogVisible.value = false
  }
}
// 点击保存
const save = async (num: number) => {
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
// 点击重置
const reset = () => {
  if (isDisabled.value == true) {
    return
  }
  unref(formRef)?.setValues({
    title: '',
    filePath: ''
  })
  content.value = ''
  checkAll.value = true
}
// 传递给父组件的方法
defineExpose({
  openDialog
})
</script>
<style lang="scss" scoped></style>
