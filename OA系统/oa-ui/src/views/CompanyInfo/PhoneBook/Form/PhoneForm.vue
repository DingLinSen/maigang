<!-- 通讯录的新增/编辑 -->
<script setup lang="ts">
import { ref, unref, reactive, nextTick, getCurrentInstance, inject } from 'vue'
import { propTypes } from '@/utils/propTypes'
import { useValidator } from '@/hooks/web/useValidator'
import { useEmitt } from '@/hooks/web/useEmitt'
import { ElMessage, ElForm, ElFormItem, ElRow, ElCol, ElInput, ElTreeSelect } from 'element-plus'
import { ElDialog } from '@/components/ElDialog'
import { savePhoneBookApi, editPhoneBookApi, getPhoneBookDetailApi } from '@/api/phone'

const { emitter } = useEmitt()
const treedata = inject<any>('treedata')
const postSelectList = inject<any>('postSelectList')
// 弹窗的开启和关闭
const dialogFlag = ref<any>(false)
type Callback = (error?: string | Error | undefined) => void

const { required, notSpace, validateEmail, validatePhoneNumber, validateNormalBySearch } =
  useValidator()

const props = defineProps({
  title: propTypes.string.def('')
})

//弹窗
const elDialogFef = ref()
//打开drawer并初始化
const pageTitle = ref<string>('')
const detailsId = ref<string>('')
const openDrawer = (type: string, id: string) => {
  dialogFlag.value = true
  elDialogFef.value.isFullscreen = false
  pageTitle.value = type == 'add' ? '新增' : type == 'edit' ? '编辑' : '详情'
  nextTick(() => {
    detailsId.value = id
    getDetailsData()
  })
}

//表单
const formRef = ref<any>()
//保存等待
const loading = ref(false)
//保存数据
const save = async () => {
  //表单验证
  if (!formRef.value) return
  await formRef.value?.validate(async (isValid: boolean) => {
    if (isValid) {
      loading.value = true
      let params = ruleForm.value
      if (detailsId.value) {
        params.deptId = params.deptId[params.deptId.length - 1]
        params.id = detailsId.value
        const res = await editPhoneBookApi(params)
          .catch(() => {})
          .finally(() => {
            setTimeout(() => {
              loading.value = false
            }, 200)
          })
        if (res) {
          ElMessage.success('保存信息成功')
          emitter.emit('getList', 'add')
          closeDialog()
        }
      } else {
        params.deptId = params.deptId[params.deptId.length - 1]
        const res = await savePhoneBookApi(params)
          .catch(() => {})
          .finally(() => {
            setTimeout(() => {
              loading.value = false
            }, 200)
          })
        if (res) {
          ElMessage.success('保存信息成功')
          emitter.emit('getList', 'add')
          closeDialog()
        }
      }
    }
  })
}

//查询详情
const getDetailsData = async () => {
  if (detailsId.value) {
    const res = await getPhoneBookDetailApi(detailsId.value)
    if (res && res.data) {
      ruleForm.value.name = res.data.name
      let deptIdArray: number[] = []
      let deptIds = res.data.deptId.split(',')
      if (deptIds) {
        deptIds.forEach((element: string) => {
          deptIdArray.push(Number(element))
        })
      }
      ruleForm.value.deptId = deptIdArray
      ruleForm.value.mobile = res.data.mobile
      ruleForm.value.postId = res.data.postId ? Number(res.data.postId) : ''
      ruleForm.value.email = res.data.email
    }
  }
}

//表单验证规则
const rules = reactive({
  name: [
    { required: true, message: '请输入姓名', trigger: 'blur' },
    {
      validator: (rule: any, value: string, callback: Callback) =>
        notSpace(value, callback, '不能输入纯空格'),
      trigger: 'blur'
    },
    {
      validator: (rule: any, value: string, callback: Callback) =>
        validateNormalBySearch(value, callback, '仅支持汉字字母数字'),
      trigger: 'blur'
    }
  ],
  deptId: [{ required: true, message: '请选择部门', trigger: 'change' }],
  mobile: [
    { required: true, message: '请输入电话', trigger: 'blur' },
    {
      validator: (rule: any, value: string, callback: Callback) =>
        notSpace(value, callback, '不能输入纯空格'),
      trigger: 'blur'
    },
    {
      validator: (rule: any, value: string, callback: Callback) => {
        if (value) {
          validatePhoneNumber(value, callback, '请输入正确的手机号或(区号)+电话号码')
        } else {
          callback()
        }
      },
      trigger: 'blur'
    }
  ],
  postId: [{ required: true, message: '请选择职务', trigger: 'change' }],
  email: [
    { required: true, message: '请输入邮箱', trigger: 'blur' },
    {
      validator: (rule: any, value: string, callback: Callback) => {
        if (value) {
          validateEmail(value, callback, '请输入正确的邮箱格式,如1465555@qq.com')
        } else {
          callback()
        }
      },
      trigger: 'blur'
    }
  ]
})

//清空表单
const resetForm = () => {
  ruleForm.value = {
    id: '',
    name: '',
    deptId: [],
    mobile: '',
    postId: '',
    email: ''
  }
}

//表单数据
const ruleForm = ref<any>({
  id: '',
  name: '',
  deptId: [],
  mobile: '',
  postId: '',
  email: ''
})

//关闭
const closeDialog = () => {
  dialogFlag.value = false
}

//关闭后清空
const resetFormAfterClose = () => {
  dialogFlag.value = false
  if (elDialogFef.value) {
    elDialogFef.value.isFullscreen = false
  }
  resetForm()
}
defineExpose({
  openDrawer
})
</script>

<template>
  <ElDialog
    ref="elDialogFef"
    class="cultivate-custom"
    v-model="dialogFlag"
    :title="pageTitle"
    @closed="resetFormAfterClose"
  >
    <el-form
      :model="ruleForm"
      :rules="rules"
      ref="formRef"
      label-position="top"
      label-width="100px"
      class="demo-ruleForm"
    >
      <el-row>
        <el-col :span="12">
          <el-form-item label="姓名" prop="name">
            <el-input maxlength="20" v-model="ruleForm.name" placeholder="请输入姓名" type="text" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="部门" prop="deptId">
            <el-cascader
              placeholder="请选择部门"
              v-model="ruleForm.deptId"
              style="width: 100%"
              :filterable="true"
              :disabled="false"
              :props="{ label: 'deptName', value: 'deptId', checkStrictly: true }"
              :controlsPosition="'right'"
              :options="treedata"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="电话" prop="mobile">
            <el-input
              maxlength="20"
              v-model="ruleForm.mobile"
              placeholder="请输入电话"
              type="text"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="职务" prop="postId">
            <el-select
              placeholder="请选择职务"
              style="width: 100%"
              :clearable="true"
              :filterable="true"
              v-model="ruleForm.postId"
            >
              <el-option
                :value="item.postId"
                :label="item.postName"
                v-for="item in postSelectList"
                :key="item.postId"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="邮箱" prop="email">
            <el-input
              maxlength="20"
              v-model="ruleForm.email"
              placeholder="请输入邮箱"
              type="text"
            />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <template #footer>
      <div class="footer">
        <el-button class="dialog-btn-sure" :loading="loading" @click="save"> 确定 </el-button>
        <el-button class="dialog-btn-cancel" @click="resetForm"> 重置 </el-button>
        <el-button class="dialog-btn-cancel" @click="closeDialog"> 取消 </el-button>
      </div>
    </template>
  </ElDialog>
</template>
<style lang="less" scoped>
:deep(.el-popper) {
  max-width: 100px;
}
</style>