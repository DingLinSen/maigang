<!-- 行业知识的新增/编辑 -->
<script setup lang="ts">
import { ref, unref, reactive, nextTick, inject } from 'vue'
import { propTypes } from '@/utils/propTypes'
import { useValidator } from '@/hooks/web/useValidator'
import { useEmitt } from '@/hooks/web/useEmitt'
import { ElMessage, ElForm, ElFormItem, ElRow, ElCol, ElInput, ElTreeSelect } from 'element-plus'
import { Dialog } from '@/components/Dialog'
import { FileUpload } from '@/components/FileUpload' // 文件上传组件
import { PersonnelSelection } from '@/components/PersonnelSelection'
import { getAllUserListApi } from '@/api/user' // 获取所有用户
import { saveKnowledgeApi, editKnowledgeApi, getKnowledgeDetApi } from '@/api/school/industry'
import { useCache } from '@/hooks/web/useCache'

const { wsCache } = useCache()
const loginUserId = ref<string>(wsCache.get('userInfo').userId) // 登录用户id
const { emitter } = useEmitt()
const props = defineProps({
  title: propTypes.string.def('')
})
type Callback = (error?: string | Error | undefined) => void
const { required, notSpace } = useValidator()
// 弹窗的开启和关闭
const dialogFlag = ref<any>(false)
//弹窗
const elDialogFef = ref()
//打开drawer并初始化
const detailsId = ref<string>('')
const pageFlag = ref<string>('') // see 查看 edit 编辑 add 新增
const pageTitle = ref<string>('')
const projectType = inject('com_info_types')

const openDrawer = async (type: string, id: string) => {
  dialogFlag.value = true
  elDialogFef.value.isFullscreen = false
  if (userData.value.length === 0) {
    await getAllUserlist()
  }
  selectedPersonArray.value = []
  userData.value.forEach((item: any) => {
    if (loginUserId.value === item.userId) {
      selectedPersonArray.value.push(item)
    }
  })
  nextTick(() => {
    pageTitle.value = type === 'add' ? '新增' : type === 'edit' ? '编辑' : '详情'
    detailsId.value = id
    pageFlag.value = type
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
      if (isAllSelected.value) {
        params.allStatus = 0
        params.industryKnowledgeUserDos = []
      } else {
        params.allStatus = 1
        params.industryKnowledgeUserDos = []
        selectedPersonArray.value.forEach((item) => {
          params.industryKnowledgeUserDos.push({ userId: item.userId })
        })
      }
      if (detailsId.value) {
        params.id = detailsId.value
        const res = await editKnowledgeApi(params)
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
        const res = await saveKnowledgeApi(params)
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
    const res = await getKnowledgeDetApi(detailsId.value)
    if (res && res.data) {
      selectedPersonArray.value = []
      ruleForm.value.title = res.data.title
      ruleForm.value.type = res.data.type
      ruleForm.value.describeInfo = res.data.describeInfo
      ruleForm.value.filePath = res.data.filePath
      isAllSelected.value = res.data.allStatus == 0
      let industryKnowledgeUserDos = res.data.industryKnowledgeUserDos
      if (industryKnowledgeUserDos) {
        industryKnowledgeUserDos.forEach((item: any) => {
          userData.value.forEach((item0: any) => {
            if (item.userId === item0.userId) {
              selectedPersonArray.value.push(item0)
            }
          })
        })
      }
    }
  }
}

//表单验证规则
const rules = reactive({
  title: [
    { required: true, message: '请输入标题', trigger: 'blur' },
    {
      validator: (rule: any, value: string, callback: Callback) =>
        notSpace(value, callback, '不能输入纯空格'),
      trigger: 'blur'
    }
  ],
  type: [{ required: true, message: '请选择类型', trigger: 'change' }],
  describeInfo: [
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
    title: '',
    type: '',
    describeInfo: '',
    industryKnowledgeUserDos: [],
    filePath: ''
  }
}

//表单数据
const ruleForm = ref<any>({
  id: '',
  title: '',
  type: '',
  describeInfo: '',
  industryKnowledgeUserDos: [],
  filePath: ''
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
  isAllSelected.value = false
  selectedPersonArray.value = []
  indeterminate.value = false
  resetForm()
}

//同行人员
const selectedPersonArray = ref<any[]>([])
//添加同行人员
const personnelSelectionRef = ref()
const addPerson = () => {
  nextTick(() => {
    let checkedKeys: any[] = []
    selectedPersonArray.value.forEach((item: any) => {
      checkedKeys.push(item.userId)
    })
    personnelSelectionRef.value.openDialog(checkedKeys)
  })
}
//获取所有用户
const userData = ref<any>([])
const getAllUserlist = async () => {
  try {
    const { data } = await getAllUserListApi({})
    userData.value = data
  } catch (error) {}
}
//人员确定
const savePerson = (checkAllGroup: any) => {
  selectedPersonArray.value = []
  checkAllGroup.forEach((item: any) => {
    userData.value.forEach((user: any) => {
      if (item === user.userId) {
        selectedPersonArray.value.push(user)
      }
    })
  })
  indeterminate.value = selectedPersonArray.value && selectedPersonArray.value.length > 0
}
const nameOverflow = (name: string) => {
  let nextName = ''
  if (name && name.length) {
    if (name.length > 3) {
      nextName = name.slice(0, 3) + '...'
    } else {
      nextName = name
    }
  } else {
    nextName = ''
  }
  return nextName
}
const handleCheckAllChange = (val: boolean) => {
  selectedPersonArray.value = []
  indeterminate.value = false
  if (!val) {
    userData.value.forEach((item: any) => {
      if (loginUserId.value === item.userId) {
        selectedPersonArray.value.push(item)
      }
    })
  }
}
const isAllSelected = ref<boolean>(false)
const indeterminate = ref<boolean>(false)
const setDefaultImage = async (e: any) => {
  const avatar = await import('@/assets/imgs/avatar.jpg')
  e.target.src = avatar.default
}
defineExpose({
  openDrawer
})
</script>
<template>
  <Dialog
    ref="elDialogFef"
    class="cultivate-custom"
    v-model="dialogFlag"
    :maxHeight="'auto'"
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
        <el-col :span="24">
          <el-form-item label="标题" prop="title">
            <el-input
              maxlength="200"
              v-model="ruleForm.title"
              placeholder="请输入标题"
              type="text"
            />
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="类型" prop="type">
            <el-select
              placeholder="请选择类型"
              style="width: 100%"
              :clearable="true"
              v-model="ruleForm.type"
            >
              <el-option
                :value="item.value"
                :label="item.label"
                v-for="item in projectType"
                :key="item.value"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="描述" prop="describeInfo">
            <el-input
              type="textarea"
              :autosize="{ minRows: 4, maxRows: 8 }"
              maxlength="500"
              v-model="ruleForm.describeInfo"
              placeholder="请输入描述"
            />
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="文件上传" prop="filePath">
            <div
              style="
                width: 100%;
                display: flex;
                vertical-align: middle;
                line-height: normal;
                align-items: center;
              "
            >
              <FileUpload
                class="w-full"
                v-model:modelValue="ruleForm.filePath"
                :limit="1"
                :fileSize="2 * 1024"
                :fileType="[
                  'pdf',
                  'doc',
                  'docx',
                  'png',
                  'jpg',
                  'jpeg',
                  'bmp',
                  'xls',
                  'xlsx',
                  'zip',
                  'rar'
                ]"
              />
            </div>
          </el-form-item>
        </el-col>

        <el-col :span="24">
          <el-form-item label="查看权限">
            <div class="check-all-class">
              <el-checkbox
                v-model="isAllSelected"
                @change="handleCheckAllChange"
                :indeterminate="indeterminate"
                style="float: right"
                :disabled="pageFlag !== 'see'"
                >全体人员</el-checkbox
              >
            </div>
            <div class="div-person-bg" v-show="!isAllSelected">
              <div v-for="user in selectedPersonArray" :key="user.userId" class="inline-grid">
                <el-tooltip
                  effect="dark"
                  :content="user.nickName"
                  placement="bottom-start"
                  :show-arrow="false"
                  popper-class="person-popper-class"
                >
                  <img
                    v-if="user.avatar && user.avatar !== ''"
                    :src="user.avatar"
                    class="person-bg"
                    @error="setDefaultImage"
                  />
                  <img v-else src="@/assets/imgs/avatar.jpg" class="person-bg" />
                </el-tooltip>
                <span class="user-name-class">{{ nameOverflow(user.nickName) }}</span>
              </div>
              <div class="add-person-bg" @click="addPerson" v-if="pageFlag !== 'see'">
                <img src="@/assets/imgs/icon/add_icon.png" />
              </div>
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
  </Dialog>
  <PersonnelSelection ref="personnelSelectionRef" @sure-click="savePerson" />
</template>
<style lang="less" scoped>
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
</style>
