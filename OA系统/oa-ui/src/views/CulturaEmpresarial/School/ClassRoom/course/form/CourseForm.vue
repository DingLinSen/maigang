<!-- 通讯录的新增/编辑 -->
<script setup lang="ts">
import { ref, unref, reactive, nextTick, getCurrentInstance, inject, onMounted } from 'vue'
import { propTypes } from '@/utils/propTypes'
import { useValidator } from '@/hooks/web/useValidator'
import { useEmitt } from '@/hooks/web/useEmitt'
import { ElMessage, ElForm, ElFormItem, ElRow, ElCol, ElInput, ElTreeSelect } from 'element-plus'
import { ElDialog } from '@/components/ElDialog'
import { saveCourseApi, editCourseApi, getCourseDetApi } from '@/api/school/course'
import { PersonnelSelection } from '@/components/PersonnelSelection'
import { getAllUserListApi } from '@/api/user' // 获取所有用户
import { FileUpload } from '@/components/FileUpload' // 文件上传组件
import { ImgUpload } from '@/components/ImgUpload' // 文件上传组件
import { useCache } from '@/hooks/web/useCache'
import { courseType, courseSecondType, yesOrNo } from '../config'

const { wsCache } = useCache()
const loginUserId = ref<string>(wsCache.get('userInfo').userId) // 登录用户id
const { emitter } = useEmitt()
const lecturerList = inject<any>('lecturerList')
onMounted(() => {
  getAllUserlist()
})
// 弹窗的开启和关闭
const dialogFlag = ref<any>(false)
type Callback = (error?: string | Error | undefined) => void

const { required, notSpace } = useValidator()

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
  isAllSelected.value = true
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
      let params = Object.assign({}, ruleForm.value)
      if (movie.value && params.courseUrl) {
        params.videoTime = movie.value.duration
      } else {
        params.videoTime = 0
      }
      let tbCourseUserDos: any[] = []
      selectedPersonArray.value.forEach((item) => {
        tbCourseUserDos.push({ userId: item.userId })
      })
      // 1自定义 0全员可见
      params.viewStatus = isAllSelected.value ? '0' : '1'
      if (params.viewStatus === '0') {
        params.tbCourseUserDos = []
      } else {
        params.tbCourseUserDos = tbCourseUserDos
      }
      if (detailsId.value) {
        params.id = detailsId.value
        const res = await editCourseApi(params)
          .catch(() => {})
          .finally(() => {
            setTimeout(() => {
              loading.value = false
            }, 200)
          })
        if (res) {
          ElMessage.success('保存信息成功')
          emitter.emit('course', 'add')
          closeDialog()
        }
      } else {
        const res = await saveCourseApi(params)
          .catch(() => {})
          .finally(() => {
            setTimeout(() => {
              loading.value = false
            }, 200)
          })
        if (res) {
          ElMessage.success('保存信息成功')
          emitter.emit('course', 'add')
          closeDialog()
        }
      }
    }
  })
}

//查询详情
const getDetailsData = async () => {
  if (detailsId.value) {
    const res = await getCourseDetApi(detailsId.value)
    if (res && res.data) {
      ruleForm.value.courseName = res.data.courseName
      ruleForm.value.lecturerId = res.data.lecturerId
      ruleForm.value.type = String(res.data.type)
      ruleForm.value.secondType = String(res.data.secondType)
      ruleForm.value.choicenessStatus = String(res.data.choicenessStatus)
      ruleForm.value.outline = res.data.outline
      ruleForm.value.coverUrl = res.data.coverUrl
      ruleForm.value.courseUrl = res.data.courseUrl
      selectedPersonArray.value = []
      if (String(res.data.viewStatus) == '0') {
        ruleForm.value.userIds = '-1'
        isAllSelected.value = true
        indeterminate.value = false
      } else {
        isAllSelected.value = false
        if (res.data.tbCourseUserDos && res.data.tbCourseUserDos.length > 0) {
          res.data.tbCourseUserDos.forEach((item: any) => {
            userData.value.forEach((user: any) => {
              if (item.userId === user.userId) {
                selectedPersonArray.value.push(user)
              }
            })
          })
        }
        indeterminate.value = selectedPersonArray.value && selectedPersonArray.value.length > 0
        ruleForm.value.userIds = listToString(selectedPersonArray.value, ',')
      }
    }
  }
}

//表单验证规则
const rules = reactive({
  courseName: [
    { required: true, message: '请输入课程名称', trigger: 'blur' },
    {
      validator: (rule: any, value: string, callback: Callback) =>
        notSpace(value, callback, '不能输入纯空格'),
      trigger: 'blur'
    }
  ],
  lecturerId: [{ required: true, message: '请选择讲师', trigger: 'change' }],
  type: [{ required: true, message: '请选择类型', trigger: 'change' }],
  secondType: [{ required: true, message: '请选择二级类型', trigger: 'change' }],
  choicenessStatus: [{ required: true, message: '请选择是否精选课程', trigger: 'change' }],
  outline: [
    { required: true, message: '请输入课程大纲', trigger: 'blur' },
    {
      validator: (rule: any, value: string, callback: Callback) =>
        notSpace(value, callback, '不能输入纯空格'),
      trigger: 'blur'
    }
  ],
  coverUrl: [{ required: true, message: '请上传封面', trigger: 'change' }],
  courseUrl: [{ required: true, message: '请上传课程文件', trigger: 'change' }],
  userIds: [{ required: true, message: '请选择浏览权限', trigger: 'change' }]
})

//清空表单
const resetForm = () => {
  ruleForm.value = {
    id: '',
    courseName: '',
    lecturerId: '',
    type: '',
    secondType: '',
    choicenessStatus: '',
    outline: '',
    coverUrl: '',
    courseUrl: '',
    userIds: '-1'
  }
}

//表单数据
const ruleForm = ref<any>({
  id: '',
  courseName: '',
  lecturerId: '',
  type: '',
  secondType: '',
  choicenessStatus: '',
  outline: '',
  coverUrl: '',
  courseUrl: '',
  userIds: '-1'
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
  isAllSelected.value = true
  indeterminate.value = false
  selectedPersonArray.value = []
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
    // userData.value.forEach((item: any) => {
    //   if (loginUserId.value === item.userId) {
    //     selectedPersonArray.value.push(item)
    //   }
    // })
    ruleForm.value.userIds = ''
  } else {
    ruleForm.value.userIds = '-1'
  }
  indeterminate.value = selectedPersonArray.value && selectedPersonArray.value.length > 0
}
const isAllSelected = ref<boolean>(false)
const indeterminate = ref<boolean>(false)

const movie = ref()

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
          <el-form-item label="课程名称" prop="courseName">
            <el-input
              maxlength="200"
              v-model="ruleForm.courseName"
              placeholder="请输入课程名称"
              :disabled="pageFlag === 'see'"
              type="text"
            />
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="讲师" prop="lecturerId">
            <el-select
              placeholder="请选择讲师"
              style="width: 100%"
              :clearable="true"
              :filterable="true"
              :disabled="pageFlag === 'see'"
              v-model="ruleForm.lecturerId"
            >
              <el-option
                :value="item.value"
                :label="item.label"
                v-for="item in lecturerList"
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
              :filterable="true"
              :disabled="pageFlag === 'see'"
              v-model="ruleForm.type"
            >
              <el-option
                :value="item.value"
                :label="item.label"
                v-for="item in courseType"
                :key="item.value"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="二级类型" prop="secondType">
            <el-select
              placeholder="请选择二级类型"
              style="width: 100%"
              :clearable="true"
              :filterable="true"
              :disabled="pageFlag === 'see'"
              v-model="ruleForm.secondType"
            >
              <el-option
                :value="item.value"
                :label="item.label"
                v-for="item in courseSecondType"
                :key="item.value"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="精选课程" prop="choicenessStatus">
            <el-select
              placeholder="请选择是否精选课程"
              style="width: 100%"
              :clearable="true"
              :filterable="true"
              :disabled="pageFlag === 'see'"
              v-model="ruleForm.choicenessStatus"
            >
              <el-option
                :value="item.value"
                :label="item.label"
                v-for="item in yesOrNo"
                :key="item.value"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="课程大纲" prop="outline">
            <el-input
              type="textarea"
              autosize
              maxlength="1000"
              :disabled="pageFlag === 'see'"
              v-model="ruleForm.outline"
              placeholder="请输入课程大纲"
            />
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="封面" prop="coverUrl">
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
                v-model:modelValue="ruleForm.coverUrl"
                :limit="2"
                :disabled="pageFlag === 'see'"
                :fileType="['png', 'jpg', 'jpeg']"
              />
            </div>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="课程文件" prop="courseUrl">
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
                v-model:modelValue="ruleForm.courseUrl"
                style="width: 100%"
                :limit="1"
                :disabled="pageFlag === 'see'"
                :fileSize="2 * 1024"
                :fileType="['webm', 'ogg', 'mp4']"
              />
            </div>
            <div v-if="ruleForm.courseUrl">
              <video
                :src="ruleForm.courseUrl ? ruleForm.courseUrl : ''"
                controls
                id="videoPlayer"
                ref="movie"
                :poster="ruleForm.coverUrl ? String(ruleForm.coverUrl) : ''"
                class="video-class"
                controlslist="nodownload noremoteplayback"
                :disablePictureInPicture="true"
                v-show="false"
              >
                您的浏览器不支持 video 标签。
              </video>
            </div>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="浏览权限" prop="userIds">
            <el-input v-model="ruleForm.userIds" v-show="false" type="text" />
            <div class="check-all-class">
              <el-checkbox
                v-model="isAllSelected"
                @change="handleCheckAllChange"
                :indeterminate="indeterminate"
                style="float: right"
                :disabled="pageFlag === 'see'"
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
  </ElDialog>
  <PersonnelSelection ref="personnelSelectionRef" @sure-click="savePerson" />
</template>
<style lang="less" scoped>
.video-class {
  object-fit: cover;
  height: 20px;
}
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
