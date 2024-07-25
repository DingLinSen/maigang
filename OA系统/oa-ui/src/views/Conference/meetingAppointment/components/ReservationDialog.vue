x
<template>
  <ElDialog
    ref="elDialogFef"
    v-model="dialogFlag"
    :title="pageTitle"
    class="cultivate-custom"
    @closed="resetFormAfterClose"
  >
    <el-form
      ref="formRef"
      :model="ruleForm"
      :rules="rules"
      class="demo-ruleForm"
      label-position="top"
      label-width="100px"
    >
      <el-row>
        <el-col :span="24">
          <el-form-item label="会议主题" prop="summary">
            <el-input
              v-model="ruleForm.summary"
              :disabled="isDetail"
              maxlength="500"
              placeholder="请输入会议主题"
              type="text"
            />
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="开始时间" prop="bookDateStart">
            <el-date-picker
              v-model="ruleForm.bookDateStart"
              :clearable="true"
              :disabled="isDetail"
              :disabled-date="bookDateStartLimit"
              format="YYYY-MM-DD HH:mm"
              placeholder="请选择开始时间"
              style="width: 100%"
              type="datetime"
              value-format="YYYY-MM-DD HH:mm"
            />
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="结束时间" prop="bookDateEnd">
            <el-date-picker
              v-model="ruleForm.bookDateEnd"
              :clearable="true"
              :disabled="isDetail"
              :disabled-date="bookDateEndLimit"
              format="YYYY-MM-DD HH:mm"
              placeholder="请选择结束时间"
              style="width: 100%"
              type="datetime"
              value-format="YYYY-MM-DD HH:mm"
            />
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="会议室" prop="meetingroom">
            <el-select
              v-model="ruleForm.meetingroom"
              :clearable="true"
              :disabled="isDetail"
              placeholder="请选择会议室"
              style="width: 100%"
            >
              <el-option
                v-for="item in meetingroomArray"
                :key="item.value"
                :label="item.label"
                :value="item.label"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col>
          <el-form-item label="组织部门" prop="depName">
            <el-tree-select
              v-model="ruleForm.deptId"
              :clearable="true"
              :controlsPosition="'right'"
              :data="treedata"
              :disabled="isDetail"
              :filterable="true"
              :props="{ label: 'deptName' }"
              check-strictly
              nodeKey="deptId"
              placeholder="请选择组织部门"
              style="width: 100%"
              value-key="deptId"
            />
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="会议详情" prop="meetingContent">
            <el-input
              v-model="ruleForm.meetingContent"
              :autosize="{ minRows: 4 }"
              :disabled="isDetail"
              maxlength="2000"
              placeholder="请输入会议详情"
              type="textarea"
            />
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="参会人员">
            <div class="check-all-class">
              <el-checkbox
                v-model="isAllSelected"
                :disabled="isDetail"
                :indeterminate="indeterminate"
                style="float: right"
                @change="handleCheckAllChange"
              >
                全体人员
              </el-checkbox>
            </div>
            <div v-show="!isAllSelected" class="div-person-bg">
              <div v-for="user in selectedPersonArray" :key="user.userId" class="inline-grid">
                <el-tooltip
                  :content="user.nickName"
                  :show-arrow="false"
                  effect="dark"
                  placement="bottom-start"
                  popper-class="person-popper-class"
                >
                  <img
                    v-if="user.avatar && user.avatar !== ''"
                    :src="user.avatar"
                    class="person-bg"
                    @error="setDefaultImage"
                  />
                  <img v-else class="person-bg" src="@/assets/imgs/avatar.jpg" />
                </el-tooltip>
                <span class="user-name-class">{{ nameOverflow(user.nickName) }}</span>
              </div>
              <div v-if="!isDetail" class="add-person-bg" @click="addPerson">
                <img src="@/assets/imgs/icon/add_icon.png" />
              </div>
            </div>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <template v-if="canEdit" #footer>
      <div class="footer">
        <el-button v-if="isDetail" type="primary" @click="handleEdit">编辑</el-button>
        <el-button :loading="loading" type="primary" @click="save()">提交</el-button>
        <el-button v-if="!isDetail" :loading="loading" @click="resetForm">重置</el-button>
      </div>
    </template>
  </ElDialog>
  <PersonnelSelection ref="personnelSelectionRef" @sure-click="savePerson" />
</template>
<script lang="ts" setup>
import { onMounted, ref, reactive, nextTick } from 'vue'
import { ElDialog } from '@/components/ElDialog'
import { useValidator } from '@/hooks/web/useValidator'
import { isAuth } from '@/utils/is'
import { meetingroomArray } from './config'
import { getAllUserListApi } from '@/api/user' // 获取所有用户
import { getAllDeptListApi } from '@/api/sys/dept'
import { listToTree } from '@/utils/tree'
import { PersonnelSelection } from '@/components/PersonnelSelection'
import moment from 'moment'
import { ElMessage } from 'element-plus'
import { useEmitt } from '@/hooks/web/useEmitt'
import {
  addMeetingApi,
  getDetailMeetingApi,
  editMeetingApi
} from '@/api/Conference/meetingAppointment/index'
import { useCache } from '@/hooks/web/useCache'

const { wsCache } = useCache()
const loginUserId = ref<string>(wsCache.get('userInfo').userId) // 登录用户id
const emit = defineEmits(['refreshList'])
const { emitter } = useEmitt()
onMounted(() => {
  getDeptTreeList()
  getAllUserlist()
})
const setDefaultImage = async (e: any) => {
  const avatar = await import('@/assets/imgs/avatar.jpg')
  e.target.src = avatar.default
}
//弹窗
const elDialogFef = ref()
type Callback = (error?: string | Error | undefined) => void
const { required, notSpace } = useValidator()
//表单验证规则
const rules = reactive({
  summary: [
    { required: true, message: '请输入会议主题', trigger: 'blur' },
    {
      validator: (rule: any, value: string, callback: Callback) =>
        notSpace(value, callback, '不能输入纯空格'),
      trigger: 'blur'
    }
  ],
  meetingroom: [{ required: true, message: '请选择会议室', trigger: 'change' }],
  bookDateStart: [
    { required: true, message: '请选择开始时间', trigger: 'change' },
    {
      validator: (rule: any, value: string, callback: Callback) => {
        if (value) {
          let time = moment(new Date(value)).format('HH:mm')
          if (time === '00:00') {
            let dateSelect = moment(new Date(value)).format('YYYY-MM-DD')
            ruleForm.value.bookDateStart =
              moment(new Date(dateSelect)).format('YYYY-MM-DD') + ' ' + '09:00:00'
          }
          if (ruleForm.value.bookDateEnd) {
            if (
              moment(new Date(ruleForm.value.bookDateStart)).format('YYYY-MM-DD') !=
              moment(new Date(ruleForm.value.bookDateEnd)).format('YYYY-MM-DD')
            ) {
              callback(new Error('开始时间与结束时间非同一日'))
            } else if (
              new Date(ruleForm.value.bookDateStart).getTime() >
              new Date(ruleForm.value.bookDateEnd).getTime()
            ) {
              callback(new Error('开始时间不得晚于结束时间'))
            } else {
              callback()
            }
          }
        }
      },
      trigger: 'change'
    }
  ],
  bookDateEnd: [
    { required: true, message: '请选择结束时间', trigger: 'change' },
    {
      validator: (rule: any, value: string, callback: Callback) => {
        if (value) {
          let time = moment(new Date(value)).format('HH:mm')
          if (time === '00:00') {
            let dateSelect = moment(new Date(value)).format('YYYY-MM-DD')
            ruleForm.value.bookDateEnd =
              moment(new Date(dateSelect)).format('YYYY-MM-DD') + ' ' + '17:30:00'
          }
          if (ruleForm.value.bookDateStart) {
            if (
              moment(new Date(ruleForm.value.bookDateStart)).format('YYYY-MM-DD') !=
              moment(new Date(ruleForm.value.bookDateEnd)).format('YYYY-MM-DD')
            ) {
              callback(new Error('开始时间与结束时间非同一日'))
            } else if (
              new Date(ruleForm.value.bookDateStart).getTime() >
              new Date(ruleForm.value.bookDateEnd).getTime()
            ) {
              callback(new Error('结束时间不得早于开始时间'))
            } else {
              callback()
            }
          }
        }
      },
      trigger: 'change'
    }
  ],
  meetingContent: [
    {
      validator: (rule: any, value: string, callback: Callback) =>
        notSpace(value, callback, '不能输入纯空格'),
      trigger: 'blur'
    }
  ]
})
const ElDialogRef = ref()
// 弹窗的开启和关闭
const dialogFlag = ref<any>(false)
const pageTitle = ref()
// 打开弹出框
const detailsId = ref<string>('')
const isAdd = ref(false)
const isDetail = ref(false)
const isBack = ref(false)
const openDialog = (flag, id) => {
  dialogFlag.value = true
  if (flag == 'add') {
    canEdit.value = true
    isAdd.value = true
    isDetail.value = false
    pageTitle.value = '新建会议'
  } else {
    isAdd.value = false
    isDetail.value = true
    isBack.value = true
    meetingID.value = id
    pageTitle.value = '会议详情'
    getMeetingDetail()
  }
}
// 左侧树形数据
const treedata = ref<any>([])
// 获取部门树
const getDeptTreeList = async () => {
  try {
    if (treedata.value.length > 0) {
      return
    }
    const res = await getAllDeptListApi({})
    if (res) {
      treedata.value = listToTree(res.data, {
        id: 'deptId',
        children: 'children',
        pid: 'parentId'
      })
    }
  } catch (err) {}
}
//获取所有用户
const userData = ref<any>([])
const getAllUserlist = async () => {
  try {
    const { data } = await getAllUserListApi({})
    userData.value = data
  } catch (error) {}
}
//清空表单
const resetForm = () => {
  if (isBack.value) {
    selectedPersonArray.value = []
    getMeetingDetail()
    return
  } else {
    ruleForm.value = {
      meetingContent: '',
      bookDateStart: '',
      bookDateEnd: '',
      meetingroom: '',
      deptId: '',
      meetingUserDos: [],
      summary: ''
    }
    selectedPersonArray.value = []
    indeterminate.value = false
    isAllSelected.value = false
  }
}
//表单数据
const ruleForm = ref<any>({
  id: '',
  meetingContent: '',
  bookDateStart: '',
  bookDateEnd: '',
  meetingroom: '',
  deptId: '',
  meetingUserDos: [],
  summary: ''
})
const bookDateEndLimit = (time: any) => {
  if (ruleForm.value.bookDateStart) {
    let dateSelectMin =
      moment(new Date(ruleForm.value.bookDateStart)).format('YYYY-MM-DD') + ' 00:00:00'
    let dateSelectMax =
      moment(new Date(ruleForm.value.bookDateStart)).format('YYYY-MM-DD') + ' 23:59:59'
    return !(
      time.getTime() >= new Date(dateSelectMin).getTime() &&
      time.getTime() <= new Date(dateSelectMax).getTime()
    )
  } else {
    return time.getTime() < new Date().getTime() - 8.64e7
  }
}
const bookDateStartLimit = (time: any) => {
  if (ruleForm.value.bookDateEnd) {
    let dateSelectMin =
      moment(new Date(ruleForm.value.bookDateEnd)).format('YYYY-MM-DD') + ' 00:00:00'
    let dateSelectMax =
      moment(new Date(ruleForm.value.bookDateEnd)).format('YYYY-MM-DD') + ' 23:59:59'
    return !(
      time.getTime() >= new Date(dateSelectMin).getTime() &&
      time.getTime() <= new Date(dateSelectMax).getTime()
    )
  } else {
    return time.getTime() < new Date().getTime() - 8.64e7
  }
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
  ruleForm.value = {
    meetingContent: '',
    bookDateStart: '',
    bookDateEnd: '',
    meetingroom: '',
    deptId: '',
    meetingUserDos: [],
    summary: ''
  }
  selectedPersonArray.value = []
  indeterminate.value = false
  isAllSelected.value = false
  isBack.value = false
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
//人员确定
const savePerson = (checkAllGroup: any) => {
  selectedPersonArray.value = []
  ruleForm.value.meetingUserDos = []
  checkAllGroup.forEach((item: any) => {
    userData.value.forEach((user: any) => {
      if (item === user.userId) {
        selectedPersonArray.value.push(user)
      }
    })
  })
  selectedPersonArray.value.forEach((item) => {
    return ruleForm.value.meetingUserDos.push({
      userId: item.userId
    })
  })
  console.log(selectedPersonArray.value)
  indeterminate.value = selectedPersonArray.value && selectedPersonArray.value.length > 0
  // ruleForm.value.meetingUserDos = listToString(selectedPersonArray.value, ',')
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
  ruleForm.value.meetingUserDos = []
  if (val) {
    userData.value.map((item) => {
      ruleForm.value.meetingUserDos.push({
        userId: item.userId
      })
    })
  }
  indeterminate.value = selectedPersonArray.value && selectedPersonArray.value.length > 0
}
const isAllSelected = ref<boolean>(false)
const indeterminate = ref<boolean>(false)
//保存等待
const loading = ref(false)
//表单
const formRef = ref<any>()
//编辑数据
const handleEdit = () => {
  isDetail.value = false
}
//保存数据
const save = async () => {
  if (isDetail.value) {
    ElMessage.warning('请进行编辑后再提交')
    return
  }
  //表单验证
  if (!formRef.value) return
  await formRef.value?.validate(async (isValid: boolean) => {
    if (isValid) {
      ruleForm.value.bookDateEnd = moment(ruleForm.value.bookDateEnd).format('YYYY-MM-DD HH:mm:ss')
      ruleForm.value.bookDateStart = moment(ruleForm.value.bookDateStart).format(
        'YYYY-MM-DD HH:mm:ss'
      )
      if (isAdd.value) {
        loading.value = true
        await addMeetingApi(ruleForm.value)
          .then((res) => {
            if (res.data) {
              ElMessage.success('预约会议室成功')
              loading.value = false
              resetFormAfterClose()
              closeDialog()
              emit('refreshList')
            }
          })
          .finally(() => {
            setTimeout(() => {
              loading.value = false
            }, 200)
          })
      } else {
        loading.value = true
        await editMeetingApi(ruleForm.value)
          .then((res) => {
            if (res.data) {
              ElMessage.success('修改会议室成功')
              loading.value = false
              resetFormAfterClose()
              closeDialog()
              emit('refreshList')
            }
          })
          .finally(() => {
            setTimeout(() => {
              loading.value = false
            }, 200)
          })
      }
    }
  })
}
const meetingID = ref()
const canEdit = ref<boolean>(false)
const getMeetingDetail = async () => {
  await getDetailMeetingApi(meetingID.value).then((res) => {
    ruleForm.value = Object.assign({ meetingUserDos: [] }, res.data)
    ruleForm.value.meetingUserDos = []
    res.data.meetingUserDos.map((item) => {
      ruleForm.value.meetingUserDos.push({
        userId: item.userId
      })
    })
    if (ruleForm.value.meetingUserDos) {
      selectedPersonArray.value = []
      ruleForm.value.meetingUserDos.forEach((item: any) => {
        userData.value.forEach((item0: any) => {
          if (item.userId === item0.userId) {
            selectedPersonArray.value.push(item0)
          }
        })
      })
    }
    if (selectedPersonArray.value.length > 0) {
      if (selectedPersonArray.value.length == userData.value.length) {
        isAllSelected.value = true
        indeterminate.value = false
      } else {
        indeterminate.value = true
        isAllSelected.value = false
      }
    } else {
      indeterminate.value = false
      isAllSelected.value = false
    }
    canEdit.value = res.data.flag == 2 && String(res.data.bookBy) == String(loginUserId.value)
  })
}
defineExpose({
  openDialog
})
</script>
<style lang="less" scoped>
:deep(.el-input__wrapper) {
  width: 100% !important;
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
</style>
