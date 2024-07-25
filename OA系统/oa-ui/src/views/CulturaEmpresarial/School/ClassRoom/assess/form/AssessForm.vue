<!-- 课程考核管理的新增/编辑 -->
<script setup lang="ts">
import { ref, unref, reactive, nextTick, getCurrentInstance, inject, onMounted } from 'vue'
import { propTypes } from '@/utils/propTypes'
import { useValidator } from '@/hooks/web/useValidator'
import { useEmitt } from '@/hooks/web/useEmitt'
import { ElMessage, ElForm, ElFormItem, ElRow, ElCol, ElInput, ElTreeSelect } from 'element-plus'
import { ElDialog } from '@/components/ElDialog'
import { PersonnelSelection } from './index'
import { getAllUserListApi, getdeptListApi } from '@/api/user'
import { FileUpload } from '@/components/FileUpload' // 文件上传组件
import { ImgUpload } from '@/components/ImgUpload' // 文件上传组件
import { useCache } from '@/hooks/web/useCache'
import { getCourseListAllApi } from '@/api/school/course'
import { getCourseAssessApi, saveCourseAssessApi, notCourseAssessApi } from '@/api/school/assess'
import moment from 'moment'

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
const courseNameData = ref([])

// 获取课程名称
const getCourseName = async () => {
  const res = await getCourseListAllApi({ status: 0 })
  if (res.data) {
    courseNameData.value = res.data
  } else {
    courseNameData.value = []
  }
}
onMounted(() => {
  getAllUserlist()
  getAllDeptlist()
})
const pageFlag = ref<string>('')
//弹窗
const elDialogFef = ref()
//打开drawer并初始化
const detailsId = ref<string>('')
const dialogTitle = ref<string>('')
const openDrawer = (type: string, id: string) => {
  dialogFlag.value = true
  pageFlag.value = type
  dialogTitle.value = type == 'add' ? '新增' : type == 'edit' ? '编辑' : '详情'
  elDialogFef.value.isFullscreen = false
  getCourseName()
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
      let tbAssessUserDos: any[] = []
      selectedPersonArray.value.forEach((item: any) => {
        tbAssessUserDos.push({ userId: item.userId })
      })
      params.tbAssessUserDos = tbAssessUserDos
      const res = await saveCourseAssessApi(params)
        .catch(() => {})
        .finally(() => {
          setTimeout(() => {
            loading.value = false
          }, 200)
        })
      if (res) {
        ElMessage.success('保存信息成功')
        emitter.emit('assess', 'add')
        closeDialog()
      }
    }
  })
}

//查询详情
const getDetailsData = async () => {
  if (detailsId.value) {
    const res = await getCourseAssessApi({ id: detailsId.value })
    if (res && res.data) {
      ruleForm.value.courseId = res.data.courseId
      let startDate = res.data.startDate
      let endDate = res.data.endDate
      ruleForm.value.startEndDate.push(startDate, endDate)
      ruleForm.value.score = res.data.score
      courseChange(res.data.courseId)
      let tbAssessUserDos: any[] = res.data.tbAssessUserDos
      selectedPersonArray.value = []
      tbAssessUserDos.forEach((item: any) => {
        userData.value.forEach((user: any) => {
          if (item.userId == user.userId) {
            selectedPersonArray.value.push(user)
          }
        })
      })
      indeterminate.value = selectedPersonArray.value && selectedPersonArray.value.length > 0
      ruleForm.value.userIds = listToString(selectedPersonArray.value, ',')
      isAllSelected.value = selectedPersonArray.value.length === tempUserArray.value.length
      if (isAllSelected.value) {
        indeterminate.value = false
      }
    }
  }
}

//表单验证规则
const rules = reactive({
  courseId: [{ required: true, message: '请选择课程名称', trigger: 'change' }],
  startEndDate: [{ required: true, message: '请选择开始/结束时间', trigger: 'change' }],
  score: [
    { required: true, message: '请输入月度考核扣分', trigger: 'blur' },
    {
      validator: (rule: any, value: string, callback: Callback) =>
        notSpace(value, callback, '不能输入纯空格'),
      trigger: 'blur'
    },
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
  userIds: [{ required: true, message: '请选择被考核人', trigger: 'change' }]
})

//清空表单
const resetForm = () => {
  ruleForm.value = {
    id: '',
    courseId: '',
    startEndDate: [],
    startDate: '',
    endDate: '',
    score: '',
    tbAssessUserDos: [],
    userIds: ''
  }
}

//表单数据
const ruleForm = ref<any>({
  id: '',
  courseId: '',
  startEndDate: [],
  startDate: '',
  endDate: '',
  score: '',
  tbAssessUserDos: [],
  userIds: ''
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
  tempUserArray.value = []
  tempDeptArray.value = []
  resetForm()
}

const startEndDateChange = (date: any) => {
  if (date) {
    let startDate = date[0]
    if (startDate) {
      ruleForm.value.startDate = moment(new Date(startDate)).format('YYYY-MM-DD')
    }
    let endDate = date[1]
    if (endDate) {
      ruleForm.value.endDate = moment(new Date(endDate)).format('YYYY-MM-DD')
    }
  } else {
    ruleForm.value.startDate = ''
    ruleForm.value.endDate = ''
  }
}
//同行人员
const selectedPersonArray = ref<any[]>([])
//添加同行人员
const personnelSelectionRef = ref()
const addPerson = () => {
  if (!ruleForm.value.courseId) {
    ElMessage.warning('请先选择课程名称')
    return
  }
  if (tempUserArray.value.length) {
    nextTick(() => {
      let checkedKeys: any[] = []
      selectedPersonArray.value.forEach((item: any) => {
        checkedKeys.push(item.userId)
      })
      personnelSelectionRef.value.openDialog(checkedKeys, tempUserArray.value, tempDeptArray.value)
    })
  } else {
    ElMessage.warning('没有可用的考核人员，请联系管理员添加考核人员！')
  }
}
//获取所有用户
const userData = ref<any>([])
const getAllUserlist = async () => {
  try {
    const { data } = await getAllUserListApi({})
    userData.value = data
  } catch (error) {}
}
//获取所有部门
const userDeptListData = ref<any>([])
const getAllDeptlist = async () => {
  let res2 = await getdeptListApi({ pageSize: 99999 })
  userDeptListData.value = res2.data
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
  ruleForm.value.userIds = listToString(selectedPersonArray.value, ',')
  isAllSelected.value = selectedPersonArray.value.length === tempUserArray.value.length
  if (isAllSelected.value) {
    indeterminate.value = false
  }
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
  if (tempUserArray.value.length) {
    indeterminate.value = false
    selectedPersonArray.value = []
    if (!val) {
      ruleForm.value.userIds = listToString(selectedPersonArray.value, ',')
      indeterminate.value = selectedPersonArray.value && selectedPersonArray.value.length > 0
    } else {
      selectedPersonArray.value = tempUserArray.value
      ruleForm.value.userIds = listToString(selectedPersonArray.value, ',')
    }
  } else {
    indeterminate.value = false
    isAllSelected.value = false
    ElMessage.warning('没有可用的考核人员，请联系管理员添加考核人员！')
  }
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
const isAllSelected = ref<boolean>(false)
const indeterminate = ref<boolean>(false)

const tempUserArray: any = []
const tempDeptArray: any = []
const courseChange = async (value: any) => {
  isAllSelected.value = false
  indeterminate.value = false
  ruleForm.value.userIds = ''
  selectedPersonArray.value = []
  tempUserArray.value = []
  tempDeptArray.value = []
  const res = await notCourseAssessApi({ courseId: Number(value) })
  tempUserArray.value = []
  tempDeptArray.value = []
  if (res && res.data) {
    res.data.forEach((element: any) => {
      if (element.userList && element.userList.length) {
        tempDeptArray.value.push({ deptId: element.deptId, deptName: element.deptName })
        element.userList.forEach((user: any) => {
          tempUserArray.value.push({
            deptId: element.deptId,
            userId: user.userId,
            nickName: user.name
          })
        })
      }
    })
  }
}

//只能选择当前及以后的日期
const deadlinelimit = (time: any) => {
  return time.getTime() < new Date().getTime() - 8.64e7
}

const setDefaultImage = async (e: any) => {
  const avatar = await import('@/assets/imgs/avatar.jpg')
  e.target.src = avatar.default
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
          <el-form-item label="课程名称" prop="courseId">
            <el-select
              placeholder="请选择课程名称"
              style="width: 100%"
              :clearable="true"
              :filterable="true"
              :disabled="pageFlag === 'see'"
              v-model="ruleForm.courseId"
              @change="courseChange"
            >
              <el-option
                :value="item.id"
                :label="item.courseName"
                v-for="item in courseNameData"
                :key="item.id"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="开始/结束时间" prop="startEndDate">
            <el-date-picker
              v-model="ruleForm.startEndDate"
              :clearable="true"
              format="YYYY-MM-DD"
              :disabled="pageFlag === 'see'"
              value-format="YYYY-MM-DD"
              range-separator="-"
              :disabled-date="deadlinelimit"
              start-placeholder="请选择开始时间"
              end-placeholder="请选择结束时间"
              @change="(val) => startEndDateChange(val)"
              type="daterange"
            ></el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="月度考核扣分" prop="score">
            <el-input
              type="text"
              autosize
              maxlength="5"
              :disabled="pageFlag === 'see'"
              v-model="ruleForm.score"
              placeholder="请输入月度考核扣分"
            />
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="被考核人" prop="userIds">
            <el-input v-model="ruleForm.userIds" v-show="false" type="text" />
            <div class="check-all-class">
              <el-checkbox
                v-model="isAllSelected"
                @change="handleCheckAllChange"
                :indeterminate="indeterminate"
                style="float: right"
                :disabled="!ruleForm.courseId || pageFlag === 'see'"
                >全体人员
              </el-checkbox>
            </div>
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
    <template #footer v-if="pageFlag !== 'see'">
      <div class="footer">
        <el-button class="dialog-btn-sure" :loading="loading" @click="save"> 确定</el-button>
        <el-button class="dialog-btn-cancel" @click="closeDialog"> 取消</el-button>
      </div>
    </template>
  </ElDialog>
  <PersonnelSelection ref="personnelSelectionRef" @sure-click="savePerson" />
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
