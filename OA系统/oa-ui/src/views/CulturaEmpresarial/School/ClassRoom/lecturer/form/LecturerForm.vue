<!-- 通讯录的新增/编辑 -->
<script setup lang="ts">
import { ref, unref, reactive, nextTick, getCurrentInstance, inject } from 'vue'
import { propTypes } from '@/utils/propTypes'
import { useValidator } from '@/hooks/web/useValidator'
import { useEmitt } from '@/hooks/web/useEmitt'
import { ElMessage, ElForm, ElFormItem, ElRow, ElCol, ElInput, ElTreeSelect } from 'element-plus'
import { ElDialog } from '@/components/ElDialog'
import { saveLecturerApi, editLecturerApi, getLecturerDetApi } from '@/api/school/lecturer'
import { PersonnelSelection } from '@/components/PersonnelSelection'
import { getAllUserListApi } from '@/api/user' // 获取所有用户
import { FileUpload } from '@/components/FileUpload' // 文件上传组件
import { ImgUpload } from '@/components/ImgUpload' // 文件上传组件
import { useCache } from '@/hooks/web/useCache'

const { wsCache } = useCache()
const loginUserId = ref<string>(wsCache.get('userInfo').userId) // 登录用户id
const { emitter } = useEmitt()
const lecturerList = inject<any>('lecturerList')
// 弹窗的开启和关闭
const dialogFlag = ref<any>(false)
type Callback = (error?: string | Error | undefined) => void

const { required, notSpace, validateIntegerSearch } = useValidator()

const props = defineProps({
  title: propTypes.string.def('')
})
const pageFlag = ref<string>('')
//弹窗
const elDialogFef = ref()
//打开drawer并初始化
const detailsId = ref<string>('')
const dialogTitle = ref<string>('')
const openDrawer = (type: string, id: string) => {
  dialogTitle.value = type == 'add' ? '新增' : type == 'edit' ? '编辑' : '详情'
  dialogFlag.value = true
  pageFlag.value = type
  elDialogFef.value.isFullscreen = false
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
        params.id = detailsId.value
        const res = await editLecturerApi(params)
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
        const res = await saveLecturerApi(params)
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
    const res = await getLecturerDetApi(detailsId.value)
    if (res && res.data) {
      ruleForm.value.lecturerName = res.data.lecturerName ? res.data.lecturerName : ''
      ruleForm.value.lecturerPost = res.data.lecturerPost ? res.data.lecturerPost : ''
      ruleForm.value.lecturerInfo = res.data.lecturerInfo ? res.data.lecturerInfo : ''
      ruleForm.value.sort = res.data.sort ? res.data.sort : ''
      ruleForm.value.headUrl = res.data.headUrl ? res.data.headUrl : null
    }
  }
}

//表单验证规则
const rules = reactive({
  lecturerName: [
    { required: true, message: '请输入讲师姓名', trigger: 'blur' },
    {
      validator: (rule: any, value: string, callback: Callback) =>
        notSpace(value, callback, '不能输入纯空格'),
      trigger: 'blur'
    }
  ],
  lecturerPost: [
    { required: true, message: '请输入职称', trigger: 'blur' },
    {
      validator: (rule: any, value: string, callback: Callback) =>
        notSpace(value, callback, '不能输入纯空格'),
      trigger: 'blur'
    }
  ],
  sort: [
    { required: true, message: '请输入排序', trigger: 'blur' },
    {
      validator: (rule: any, value: string, callback: Callback) =>
        notSpace(value, callback, '不能输入纯空格'),
      trigger: 'blur'
    },
    {
      validator: (rule: any, value: string, callback: Callback) =>
        validateIntegerSearch(value, callback, '请输入正整数'),
      trigger: 'blur'
    }
  ],
  lecturerInfo: [
    { required: true, message: '请输入讲师介绍', trigger: 'blur' },
    {
      validator: (rule: any, value: string, callback: Callback) =>
        notSpace(value, callback, '不能输入纯空格'),
      trigger: 'blur'
    }
  ]
})

//清空表单
const resetForm = () => {
  ruleForm.value = {
    id: '',
    lecturerName: '',
    lecturerPost: '',
    lecturerInfo: '',
    headUrl: '',
    sort: ''
  }
}

//表单数据
const ruleForm = ref<any>({
  id: '',
  lecturerName: '',
  lecturerPost: '',
  lecturerInfo: '',
  headUrl: '',
  sort: ''
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
    :title="dialogTitle"
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
        <el-col :span="24">
          <el-form-item label="讲师姓名" prop="lecturerName">
            <el-input
              maxlength="50"
              v-model="ruleForm.lecturerName"
              placeholder="请输入讲师姓名"
              :disabled="pageFlag === 'see'"
              type="text"
            />
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="职称" prop="lecturerPost">
            <el-input
              maxlength="50"
              v-model="ruleForm.lecturerPost"
              placeholder="请输入职称"
              :disabled="pageFlag === 'see'"
              type="text"
            />
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="讲师介绍" prop="lecturerInfo">
            <el-input
              type="textarea"
              autosize
              maxlength="500"
              :disabled="pageFlag === 'see'"
              v-model="ruleForm.lecturerInfo"
              placeholder="请输入讲师介绍"
            />
          </el-form-item>
        </el-col>
        <!-- <el-col :span="24">
          <el-form-item label="排序" prop="sort">
            <el-input
              type="text"
              maxlength="5"
              :disabled="pageFlag === 'see'"
              v-model="ruleForm.sort"
              placeholder="请输入排序"
            />
          </el-form-item>
        </el-col> -->
        <el-col :span="24">
          <el-form-item label="头像" prop="headUrl">
            <div
              style="
                width: 100%;
                display: flex;
                vertical-align: middle;
                line-height: normal;
                align-items: center;
              "
            >
              <ImgUpload
                v-model:modelValue="ruleForm.headUrl"
                :limit="2"
                :disabled="pageFlag === 'see'"
                :fileType="['png', 'jpg', 'jpeg']"
              />
            </div>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <template #footer>
      <div class="footer">
        <el-button class="dialog-btn-sure" :loading="loading" @click="save"> 确定 </el-button>
        <el-button class="dialog-btn-cancel" @click="closeDialog"> 取消 </el-button>
      </div>
    </template>
  </ElDialog>
</template>
<style lang="less" scoped>
:deep(.el-popper) {
  max-width: 100px;
}
.add-person-bg {
  width: 40px;
  height: 40px;
  float: left;
  margin-left: 8px;
  margin-bottom: 8px;
  background-color: #ebeced;
  border-radius: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
}
.person-bg {
  width: 40px;
  height: 40px;
  float: left;
  margin-left: 8px;
  border-radius: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
}
.div-person-bg {
  display: flex;
  flex-wrap: wrap;
  width: 100%;
}
.check-all-class {
  margin-top: -35px;
  width: 100%;
}
.user-name-class {
  width: 100%;
  text-align: center;
}
.avatar-uploader .avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>
<style lang="less">
.avatar-uploader .el-upload {
  border: 1px dashed var(--el-border-color);
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: var(--el-transition-duration-fast);
}

.avatar-uploader .el-upload:hover {
  border-color: var(--el-color-primary);
}

.el-icon.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  text-align: center;
}
</style>
