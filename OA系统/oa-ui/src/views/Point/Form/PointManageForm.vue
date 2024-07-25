<template>
  <Dialog
    ref="elDialogRef"
    class="cultivate-custom"
    v-model="dialogFlag"
    :title="props.title"
    :maxHeight="'auto'"
    @closed="resetFormAfterClose"
  >
    <PersonnelSelection ref="personnelSelectionRef" @sure-click="savePerson" :isTrans="false" />
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
          <el-form-item label="奖惩项目" prop="bonusPenalty">
            <el-select
              placeholder="请选择奖惩项目"
              style="width: 100%"
              :clearable="true"
              :disabled="pageFlag === 'see'"
              v-model="ruleForm.bonusPenalty"
            >
              <el-option
                :value="item.label"
                :label="item.label"
                v-for="item in pointTypeArray"
                :key="item.value"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="类型" prop="type">
            <el-select
              placeholder="请选择类型"
              style="width: 100%"
              :clearable="true"
              :disabled="pageFlag === 'see'"
              v-model="ruleForm.type"
            >
              <el-option value="1" label="奖分" />
              <el-option value="2" label="扣分" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="积分" prop="fraction">
            <el-input
              placeholder="请输入积分"
              maxlength="5"
              v-model="ruleForm.fraction"
              :disabled="pageFlag === 'see'"
            />
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="添加成员" prop="userIds">
            <el-input v-model="ruleForm.userIds" v-show="false" type="text" />
            <div class="div-person-bg">
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
        <el-col :span="24">
          <el-form-item label="申请理由" prop="applyReason">
            <el-input
              type="textarea"
              :autosize="{ minRows: 4, maxRows: 8 }"
              maxlength="500"
              :disabled="pageFlag === 'see'"
              v-model="ruleForm.applyReason"
              placeholder="请输入申请理由"
            />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <template #footer>
      <div class="footer">
        <el-button
          class="dialog-btn-sure"
          :loading="loading"
          @click="save"
          v-if="pageFlag !== 'see'"
        >
          确定
        </el-button>
        <el-button class="dialog-btn-cancel" @click="closeDialog"> 取消 </el-button>
      </div>
    </template>
  </Dialog>
</template>
<script setup lang="ts">
import { ref, unref, reactive, nextTick, getCurrentInstance } from 'vue'
import { propTypes } from '@/utils/propTypes'
import { useValidator } from '@/hooks/web/useValidator'
import { useEmitt } from '@/hooks/web/useEmitt'
import { ElMessage } from 'element-plus'
import { Dialog } from '@/components/Dialog'
import { PersonnelSelection } from '@/components/PersonnelSelection'
import { getAllUserListApi } from '@/api/user' // 获取所有用户
import { savePointManageApi, editPointManageApi } from '@/api/point'

const { emitter } = useEmitt()
const { proxy } = getCurrentInstance() as any
const { human_resources_type } = proxy.useDict('human_resources_type')
const { department_type } = proxy.useDict('department_type')
const { general_type } = proxy.useDict('general_type')
// 弹窗的开启和关闭
const dialogFlag = ref<any>(false)
type Callback = (error?: string | Error | undefined) => void

const { required, validateEnglishAndNumber, notSpace } = useValidator()

const props = defineProps({
  title: propTypes.string.def('')
})
const pointTypeArray = ref<any>([])
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
      let users: any = []
      selectedPersonArray.value.forEach((item: any) => {
        users.push({ userId: item.userId })
      })
      let flag = '2'
      human_resources_type.value.find((item: any) => {
        if (item.label == ruleForm.value.bonusPenalty) {
          flag = '1'
        }
      })
      general_type.value.find((item: any) => {
        if (item.label == ruleForm.value.bonusPenalty) {
          flag = '3'
        }
      })
      let params = {
        applyReason: ruleForm.value.applyReason,
        bonusPenalty: ruleForm.value.bonusPenalty,
        flag: flag,
        fraction: ruleForm.value.fraction,
        type: ruleForm.value.type,
        users: users
      }
      await savePointManageApi(params)
        .then((res) => {
          if (res) {
            ElMessage.success('保存信息成功')
            emitter.emit('pointManage', 'refresh')
            closeDialog()
          }
        })
        .catch(() => {})
        .finally(() => {
          setTimeout(() => {
            loading.value = false
          }, 200)
        })
    }
  })
}

//弹窗
const elDialogRef = ref()
//打开drawer并初始化
const detailsId = ref<string>('')
const pageFlag = ref<string>('') // see 查看 edit 编辑 add 新增

const openDrawer = async (id: string, flag: string) => {
  dialogFlag.value = true
  elDialogRef.value.isFullscreen = false
  selectedPersonArray.value = []
  pointTypeArray.value = human_resources_type.value
    .concat(department_type.value)
    .concat(general_type.value)
  if (!userData.value.length) {
    await getAllUserlist()
  }
  nextTick(() => {
    detailsId.value = id
    pageFlag.value = flag
    getDetailsData()
  })
}

//同行人员
const selectedPersonArray = ref<any[]>([])
const personnelSelectionRef = ref()
//添加同行人员
const addPerson = () => {
  nextTick(() => {
    let checkedKeys: any[] = []
    selectedPersonArray.value.forEach((item: any) => {
      checkedKeys.push(item.userId)
    })
    personnelSelectionRef.value.openDialog(checkedKeys)
  })
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
  ruleForm.value.userIds = listToString(selectedPersonArray.value, ',')
}
// 对象转成指定字符串分隔
const listToString = (list: any[], separator: string | null) => {
  let strs = ''
  separator = separator || ','
  for (let i in list) {
    if (list[i].userId) {
      strs += list[i].userId + separator
    }
  }
  return strs != '' ? strs.substr(0, strs.length - 1) : ''
}
//查询详情
const getDetailsData = async () => {
  if (detailsId.value) {
  }
}

//清空表单
const resetForm = () => {
  selectedPersonArray.value = []
  ruleForm.value = {
    type: '',
    bonusPenalty: '',
    fraction: '',
    userIds: '',
    applyReason: ''
  }
}

//关闭
const closeDialog = () => {
  dialogFlag.value = false
}

//关闭后清空
const resetFormAfterClose = () => {
  dialogFlag.value = false
  if (elDialogRef.value) {
    elDialogRef.value.isFullscreen = false
  }
  resetForm()
}

//表单数据
const ruleForm = ref<any>({
  type: '',
  bonusPenalty: '',
  fraction: '',
  userIds: '',
  applyReason: ''
})
//表单验证规则
const rules = reactive({
  type: [{ required: true, message: '请选择类型', trigger: 'change' }],
  bonusPenalty: [{ required: true, message: '请选择奖惩项目', trigger: 'change' }],
  fraction: [
    { required: true, message: '请输入积分', trigger: 'blur' },
    {
      validator: (rule: any, value: string, callback: Callback) =>
        notSpace(value, callback, '不能输入纯空格'),
      trigger: 'blur'
    },
    {
      validator: (rule: any, value: string, callback: Callback) => {
        if (/^[+]?((\d*(\.\d{1,1})$)|([1-9]\d*$))/.test(value) && Number(value) > 0) {
          callback()
        } else {
          callback(new Error('请输入正整数或含一位小数数字'))
        }
      },
      trigger: 'blur'
    }
  ],
  userIds: [{ required: true, message: '请添加成员', trigger: 'change' }],
  applyReason: [
    { required: true, message: '请输入申请理由', trigger: 'blur' },
    {
      validator: (rule: any, value: string, callback: Callback) =>
        notSpace(value, callback, '不能输入纯空格'),
      trigger: 'blur'
    }
  ]
})

const setDefaultImage = async (e: any) => {
  const avatar = await import('@/assets/imgs/avatar.jpg')
  e.target.src = avatar.default
}

//获取所有用户
const userData = ref<any>([])
const getAllUserlist = async () => {
  try {
    const { data } = await getAllUserListApi({})
    userData.value = data
  } catch (error) {}
}
getAllUserlist()

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

defineExpose({
  openDrawer
})
</script>

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
.user-name-class {
  width: 100%;
  text-align: center;
}
</style>
<style>
.person-popper-class {
  margin-top: -14px !important;
  padding: 0px 4px;
}
</style>