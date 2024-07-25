<template>
  <ElDialog
    ref="ElDialogRef"
    class="cultivate-custom"
    v-model="AddDialogVisible"
    :title="dialogTitle"
    @closed="back"
  >
    <Form :schema="schema" ref="formRef">
      <!-- 多选框 -->
      <template #tinfoAnnouncementDeptDos>
        <el-checkbox
          :indeterminate="isIndeterminate"
          v-model="checkAll"
          class="checkbox_all"
          label="全选"
          @change="handleCheckAllChange"
        />
        <el-checkbox-group
          v-model="groupList"
          class="group-item"
          @change="handleCheckedColumnChange"
        >
          <el-checkbox
            :checked="true"
            v-for="(item, index) in checkboxList"
            :key="index"
            :label="item.deptId"
            >{{ item.deptName }}
          </el-checkbox>
        </el-checkbox-group>
      </template>
      <!-- 富文本 -->
      <template #content>
        <Editor v-model="content" ref="editorRef" :height="500" />
      </template>
    </Form>
    <template #footer>
      <div class="footer">
        <el-button @click="back">取消</el-button>
        <el-button
          v-if="isAuth('AdministrativeService:Announcement:submit')"
          type="primary"
          :loading="loading"
          @click="save(0)"
          >保存
        </el-button>
        <el-button
          v-if="isAuth('AdministrativeService:Announcement:publishing')"
          type="success"
          @click="save(1)"
          >一键发布
        </el-button>
      </div>
    </template>
  </ElDialog>
</template>
<script setup lang="ts">
import { ref, unref, onMounted, watch } from 'vue'
import { ElDialog } from '@/components/ElDialog'
import { useValidator } from '@/hooks/web/useValidator'
import { FormSchema } from '@/types/form'
import { Form, FormExpose } from '@/components/Form'
import { Editor } from '@/components/Editor'
import {
  addAnnouncementOrInstitution,
  getDetailAnnouncementOrInstitution,
  editAnnouncementOrInstitution
} from '@/api/AdministrativeService/announcement'
import { getdeptListApi } from '@/api/user'
import { ElMessage } from 'element-plus'
import { isAuth } from '@/utils/is'

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
      placeholder: '请输入标题'
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
    field: 'tinfoAnnouncementDeptDos',
    label: '部门',
    component: 'Checkbox',
    colProps: {
      span: 24
    },
    formItemProps: {
      rules: [
        {
          required: true,
          message: '该项为必选项',
          trigger: 'change'
        }
      ]
    }
  },
  {
    field: 'content',
    component: 'Editor',
    label: '描述',
    colProps: {
      span: 24
    },
    componentProps: {
      maxlength: 2000,
      style: 'width:100%'
    }
  },
  {
    field: 'filePath',
    label: '上传文件',
    component: 'FileUpload',
    componentProps: {
      style: 'width:100%',
      disabled: false,
      limit: 15, // 数量限制
      fileType: ['pdf', 'doc', 'docx'] // 文件类型
    },
    colProps: {
      span: 24
    }
  }
])
const ElDialogRef = ref()
// 打开弹出框
const openDialog = (flag: boolean, id: number) => {
  ElDialogRef.value.isFullscreen = false
  getdeptList()
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
  const res = await getDetailAnnouncementOrInstitution(params)
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
    if (groupList.value.length == checkboxList.value.length) {
      isIndeterminate.value = false
    } else {
      isIndeterminate.value = true
    }
    content.value = res.data.content ? res.data.content : ''
    setValues(res.data)
  }
}
const setValues = (form) => {
  unref(formRef)?.setValues(form)
}
// 获取复选框的数据
const getdeptList = async () => {
  let res = await getdeptListApi({ pageSize: 99999 })
  checkboxList.value = res.data
  handleCheckAllChange(true)
}
// 点击全选
const handleCheckAllChange = (val) => {
  groupList.value = val
    ? unref(checkboxList).map((item) => {
        return item.deptId
      })
    : []
  isIndeterminate.value = false
  unref(formRef)?.setValues({
    tinfoAnnouncementDeptDos: groupList.value
  })
}

watch(
  () => groupList.value,
  (val: number) => {
    unref(formRef)?.setValues({
      tinfoAnnouncementDeptDos: groupList.value
    })
  }
)
// 点击多选框
const handleCheckedColumnChange = (value) => {
  const checkedCount = value.length
  checkAll.value = checkedCount === checkboxList.value.length
  isIndeterminate.value = checkedCount > 0 && checkedCount < checkboxList.value.length
  // unref(formRef)?.setValues({
  //   tinfoAnnouncementDeptDos: groupList.value
  // })
}
// 点击返回
const back = () => {
  content.value = ''
  checkAll.value = true
  getdeptList()
  AddDialogVisible.value = false
}
// 新增公告
const addAnnouncement = async (data: any) => {
  const res = await addAnnouncementOrInstitution(data)
    .catch(() => {})
    .finally(() => {
      setTimeout(() => {
        loading.value = false
      }, 200)
    })
  if (res) {
    ElMessage.success(data.status == 0 ? '保存信息成功' : '发布信息成功')
    emit('changeGetDetailAndList')
    AddDialogVisible.value = false
  }
}
// 编辑
const EditAnnouncement = async (data: any) => {
  const res = await editAnnouncementOrInstitution(data)
    .catch(() => {})
    .finally(() => {
      setTimeout(() => {
        loading.value = false
      }, 200)
    })
  if (res) {
    ElMessage.success(data.status == 0 ? '保存信息成功' : '发布信息成功')
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
      let list = Array.from(groupList.value)
      // 复选框
      data.tinfoAnnouncementDeptDos = list.map((item) => {
        return { deptId: item }
      })
      // 页面类型
      data.pageType = 'a'
      // 描述
      data.content = content.value
      if (num === 0) {
        data.status = 0
      } else {
        data.status = 1
      }
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
  unref(formRef)?.setValues({
    title: '',
    publishStatus: '',
    fileList: ''
  })
  content.value = ''
  checkAll.value = true
  getdeptList()
}
// 传递给父组件的方法
defineExpose({
  openDialog
})
</script>
<style lang="less" scoped>
.checkbox_all {
  margin-right: 7px !important;
}
</style>
