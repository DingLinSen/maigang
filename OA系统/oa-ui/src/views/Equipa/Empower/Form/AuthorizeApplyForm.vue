<!-- 权限申报 -->
<script setup lang="ts">
import { ref, unref, reactive, nextTick, getCurrentInstance, onMounted } from 'vue'
import { propTypes } from '@/utils/propTypes'
import { FormSchema } from '@/types/form'
import { useEmitt } from '@/hooks/web/useEmitt'
import moment from 'moment'
import {
  ElMessage,
  ElForm,
  ElFormItem,
  ElRow,
  ElCol,
  ElSelect,
  ElOption,
  ElInput
} from 'element-plus'
import { Dialog } from '@/components/Dialog'
import { useValidator } from '@/hooks/web/useValidator'
import { getAllUserListApi } from '@/api/user'
import { PersonnelSelection } from './index'
import {
  saveAuthorizeManageApi,
  editAuthorizeManageApi,
  publishAuthorizeManageApi,
  getAuthorizeManageDetailApi
} from '@/api/empower'

type Callback = (error?: string | Error | undefined) => void

const { required, notSpace, validateIntegerSearch } = useValidator()
const { proxy } = getCurrentInstance() as any
const { agriculture_projects } = proxy.useDict('agriculture_projects')
const { railway_projects } = proxy.useDict('railway_projects')
const { military_projects } = proxy.useDict('military_projects')
const { other_projects } = proxy.useDict('other_projects')
const { emitter } = useEmitt()
// 弹窗的开启和关闭
const dialogFlag = ref<any>(false)

const props = defineProps({
  title: propTypes.string.def('')
})

const dialogTitle = ref<string>('')
//平台名称集合
const systemNameArray = ref<any>([])
//弹窗
const elDialogFef = ref()
//打开drawer并初始化
const detailsId = ref<string>('')
const pageFlag = ref<string>('') // see 查看 edit 编辑 add 新增

const openDrawer = async (id: string, flag: string) => {
  dialogFlag.value = true
  elDialogFef.value.isFullscreen = false
  nextTick(() => {
    detailsId.value = id
    pageFlag.value = flag
    getDetailsData()
  })
}

//查询详情
const getDetailsData = async () => {
  if (detailsId.value) {
    const res = await getAuthorizeManageDetailApi(detailsId.value)
    if (res && res.data) {
      nextTick()
      ruleForm.value = {
        punter: res.data.punter ? res.data.punter : '',
        type: res.data.type ? res.data.type : '',
        systemName: res.data.systemName ? res.data.systemName : '',
        days: res.data.days ? res.data.days : '',
        authStartTime: res.data.authStartTime
          ? moment(res.data.authStartTime).format('YYYY-MM-DD')
          : '',
        authEndTime: res.data.authEndTime ? moment(res.data.authEndTime).format('YYYY-MM-DD') : '',
        applyReason: res.data.applyReason ? res.data.applyReason : ''
      }
      if (ruleForm.value.authStartTime && ruleForm.value.authEndTime) {
        ruleForm.value.startEndDate = [ruleForm.value.authStartTime, ruleForm.value.authEndTime]
      } else {
        ruleForm.value.startEndDate = []
      }
      typeTemp.value = ruleForm.value.type
      typeChange(ruleForm.value.type)
      if (res.data.users) {
        selectedPersonArray.value = []
        res.data.users.forEach((item: any) => {
          userData.value.forEach((user: any) => {
            if (item.userId === user.userId) {
              selectedPersonArray.value.push(user)
            }
          })
        })
        ruleForm.value.userIds = listToString(selectedPersonArray.value, ',')
      }
    }
  }
}

//清空表单
const resetForm = () => {
  ruleForm.value = {
    id: '',
    punter: '',
    applyReason: '',
    type: '',
    systemName: '',
    startEndDate: [],
    authStartTime: '',
    authEndTime: '',
    urgency: '1',
    userIds: '',
    days: ''
  }
  selectedPersonArray.value = []
}

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

//表单数据
const ruleForm = ref<any>({
  id: '',
  punter: '',
  applyReason: '',
  type: '',
  systemName: '',
  startEndDate: [],
  authStartTime: '',
  authEndTime: '',
  urgency: '1',
  userIds: '',
  days: ''
})
//表单验证规则
const rules = reactive({
  punter: [
    { required: true, message: '请输入客户名称', trigger: 'blur' },
    {
      validator: (rule: any, value: string, callback: Callback) =>
        notSpace(value, callback, '不能输入纯空格'),
      trigger: 'blur'
    }
  ],
  applyReason: [
    { required: true, message: '请输入申请理由', trigger: 'blur' },
    {
      validator: (rule: any, value: string, callback: Callback) =>
        notSpace(value, callback, '不能输入纯空格'),
      trigger: 'blur'
    }
  ],
  type: [{ required: true, message: '请选择平台类型', trigger: 'change' }],
  systemName: [{ required: true, message: '请选择平台名称', trigger: 'change' }],
  startEndDate: [{ required: true, message: '请选择证书有效期', trigger: 'change' }],
  urgency: [{ required: true, message: '请选择紧急程度', trigger: 'change' }],
  userIds: [{ required: true, message: '请选择实施人员', trigger: 'change' }],
  days: [
    { required: true, message: '请输入授权期限', trigger: 'blur' },
    {
      validator: (rule: any, value: number, callback: Callback) =>
        validateIntegerSearch(value, callback, '请输入正整数'),
      trigger: 'blur'
    },
    {
      validator: (rule: any, value: string, callback: Callback) =>
        notSpace(value, callback, '不能输入纯空格'),
      trigger: 'blur'
    }
  ]
})

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

//人员选择
const selectedPersonArray = ref<any>([])
const personnelSelectionRef = ref()
const addPerson = () => {
  nextTick(() => {
    let checkedKeys: any[] = []
    selectedPersonArray.value.forEach((item: any) => {
      checkedKeys.push(Number(item.userId))
    })
    personnelSelectionRef.value.openDialog(checkedKeys)
  })
}
//人员确定
const savePerson = (checkAllGroup: any) => {
  selectedPersonArray.value = []
  checkAllGroup.forEach((item: any) => {
    userData.value.forEach((user: any) => {
      if (String(item) === String(user.userId)) {
        selectedPersonArray.value.push(user)
      }
    })
  })
  ruleForm.value.userIds = listToString(selectedPersonArray.value, ',')
}

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
      let data = ruleForm.value
      if (pageFlag.value === 'add') {
        //新增
        addApply(data, '1')
      } else {
        //编辑
        editApply(data, '1')
      }
    }
  })
}
//申请
const addApply = async (data: any, flag: string) => {
  let users: any = []
  selectedPersonArray.value.forEach((item: any) => {
    users.push({ userId: item.userId })
  })
  let params = {
    flag: flag === '2',
    applyReason: data.applyReason,
    // authStartTime: data.authStartTime + ' 00:00:00',
    // authEndTime: data.authEndTime + ' 23:59:59',
    days: data.days,
    type: data.type,
    punter: data.punter,
    systemName: data.systemName,
    users: users
  }
  const res = await saveAuthorizeManageApi(params)
    .catch(() => {})
    .finally(() => {
      setTimeout(() => {
        loading.value = false
        releaseLoading.value = false
      }, 200)
    })
  if (res) {
    if (flag === '1') {
      ElMessage.success('保存信息成功')
    } else {
      ElMessage.success('发布信息成功')
    }
    //通知列表刷新
    emitter.emit('authorize', 'refresh')
    closeDialog()
  }
}
//编辑
const editApply = async (data: any, flag: string) => {
  let users: any = []
  selectedPersonArray.value.forEach((item: any) => {
    users.push({ userId: item.userId })
  })
  let params = {
    id: detailsId.value,
    flag: flag === '2',
    applyReason: data.applyReason,
    days: data.days,
    // authStartTime: data.authStartTime + ' 00:00:00',
    // authEndTime: data.authEndTime + ' 23:59:59',
    type: data.type,
    punter: data.punter,
    systemName: data.systemName,
    users: users
  }
  const res = await editAuthorizeManageApi(params)
    .catch(() => {})
    .finally(() => {
      setTimeout(() => {
        loading.value = false
        releaseLoading.value = false
      }, 200)
    })
  if (res) {
    if (flag === '1') {
      ElMessage.success('保存信息成功')
    } else {
      ElMessage.success('发布信息成功')
    }
    //通知列表刷新
    emitter.emit('authorize', 'refresh')
    closeDialog()
  }
}

//发布等待
const releaseLoading = ref(false)
//保存数据
const releaseApply = async () => {
  //表单验证
  if (!formRef.value) return
  await formRef.value?.validate(async (isValid: boolean) => {
    if (isValid) {
      releaseLoading.value = true
      let data = ruleForm.value
      if (pageFlag.value === 'add') {
        addApply(data, '2')
      } else {
        //编辑
        editApply(data, '2')
      }
    }
  })
}

// //授权期限
// const startEndDateChange = (date: any) => {
//   if (date) {
//     let authStartTime = date[0]
//     if (authStartTime) {
//       ruleForm.value.authStartTime = moment(new Date(authStartTime)).format('YYYY-MM-DD')
//     }
//     let authEndTime = date[1]
//     if (authEndTime) {
//       ruleForm.value.authEndTime = moment(new Date(authEndTime)).format('YYYY-MM-DD')
//     }
//   } else {
//     ruleForm.value.authStartTime = ''
//     ruleForm.value.authEndTime = ''
//   }
// }

//平台类型切换
const typeTemp = ref<string>('')
const typeChange = (val: any) => {
  if (typeTemp.value !== val) {
    ruleForm.value.systemName = ''
    typeTemp.value = val
  }
  if (val === 'agriculture_projects') {
    systemNameArray.value = agriculture_projects.value
  } else if (val === 'railway_projects') {
    systemNameArray.value = railway_projects.value
  } else if (val === 'military_projects') {
    systemNameArray.value = military_projects.value
  } else if (val === 'other_projects') {
    systemNameArray.value = other_projects.value
  }
}

onMounted(() => {
  getAllUserlist()
})

defineExpose({
  openDrawer
})
</script>
<template>
  <Dialog
    ref="elDialogFef"
    class="cultivate-custom"
    :maxHeight="'auto'"
    v-model="dialogFlag"
    :title="title"
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
          <el-form-item label="客户名称" prop="punter">
            <el-input
              v-model="ruleForm.punter"
              :disabled="pageFlag === 'see'"
              placeholder="请输入客户名称"
              maxlength="200"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="平台类型" prop="type">
            <el-select
              placeholder="请选择平台类型"
              style="width: 100%"
              :clearable="true"
              :disabled="pageFlag === 'see'"
              v-model="ruleForm.type"
              @change="typeChange"
            >
              <el-option value="agriculture_projects" label="农业" />
              <el-option value="railway_projects" label="铁路" />
              <el-option value="military_projects" label="军工" />
              <el-option value="other_projects" label="其他" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="平台名称" prop="systemName">
            <el-select
              placeholder="请选择平台名称"
              style="width: 100%"
              :clearable="true"
              :disabled="pageFlag === 'see'"
              v-model="ruleForm.systemName"
            >
              <el-option
                :value="item.value"
                :label="item.label"
                v-for="item in systemNameArray"
                :key="item.value"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="授权期限" prop="days">
            <el-input
              v-model="ruleForm.days"
              :disabled="pageFlag === 'see'"
              placeholder="请输入授权期限"
              maxlength="6"
            >
              <template #append>天</template></el-input
            >
          </el-form-item>
        </el-col>
        <!-- <el-col :span="12">
          <el-form-item label="紧急程度" prop="urgency">
            <el-select
              v-model="ruleForm.urgency"
              style="width: 100%"
              :disabled="pageFlag === 'see'"
              placeholder="紧急程度"
            >
              <template #prefix
                ><div
                  class="sel-urgency-class"
                  :class="
                    ruleForm.urgency === '1'
                      ? 'sel-urgency-low'
                      : ruleForm.urgency === '2'
                      ? 'sel-urgency-middle'
                      : 'sel-urgency-high'
                  "
                ></div
              ></template>
              <el-option value="1" class="urgencyClass urgency-low" label="正常" />
              <el-option value="2" class="urgencyClass urgency-middle" label="重要" />
              <el-option value="3" class="urgencyClass urgency-high" label="紧急" />
            </el-select>
          </el-form-item>
        </el-col> -->
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

        <el-col :span="24">
          <el-form-item label="实施人员" prop="userIds">
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
      </el-row>
    </el-form>

    <template #footer>
      <div class="footer">
        <el-button
          class="dialog-btn-sure"
          :disabled="releaseLoading"
          :loading="loading"
          @click="save"
          v-if="pageFlag !== 'see'"
        >
          暂存
        </el-button>
        <el-button
          class="dialog-btn-sure"
          :disabled="loading"
          :loading="releaseLoading"
          @click="releaseApply"
          v-if="pageFlag !== 'see'"
        >
          发布
        </el-button>
        <el-button class="dialog-btn-cancel" @click="closeDialog"> 取消 </el-button>
      </div>
    </template>
  </Dialog>
  <PersonnelSelection ref="personnelSelectionRef" @sure-click="savePerson" />
</template>

<style lang="less" scoped>
.red {
  color: red;
}

.left-form-class {
  width: 60%;
}

.right-form-class {
  width: 39%;
  padding-left: 30px;
  padding-right: 10px;
  overflow-y: auto;
}

.right-title-p-class {
  width: 100%;
  color: #333333;
  font-size: 15px;
  font-family: 'Alibaba PuHuiTi M';
  font-weight: 400;
}

.right-title-p-class {
  width: 100%;
  color: #333333;
  font-size: 15px;
  font-family: 'Alibaba PuHuiTi M';
  font-weight: 400;
}
.urgencyClass {
  display: flex;
  align-items: center;
  &:before {
    content: ' ';
    display: inline-block;
    margin-right: 12px;
    width: 20px;
    height: 20px;
    border-radius: 4px;
  }
}
.urgency-low:before {
  background-color: #80c36a;
}
.urgency-middle:before {
  background-color: #eeb915;
}
.urgency-high:before {
  background-color: #df3c2f;
}
.sel-urgency-class {
  content: ' ';
  display: inline-block;
  margin-right: 0.16rem;
  width: 12px;
  height: 12px;
  vertical-align: text-bottom;
  border-radius: 4px;
}

.sel-urgency-low {
  background-color: #80c36a;
}

.sel-urgency-middle {
  background-color: #eeb915;
}

.sel-urgency-high {
  background-color: #df3c2f;
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

