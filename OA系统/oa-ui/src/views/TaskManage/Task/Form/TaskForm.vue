<script lang="ts" setup>
import { ref, unref, reactive, nextTick, getCurrentInstance, inject, provide } from 'vue'
import { propTypes } from '@/utils/propTypes'
import { useValidator } from '@/hooks/web/useValidator'
import { useEmitt } from '@/hooks/web/useEmitt'
import { ElMessage, ElForm, ElFormItem, ElRow, ElCol, ElInput, ElTreeSelect } from 'element-plus'
import { ElDialog } from '@/components/ElDialog'
import { DrawerWrap } from '@/components/DrawerWrapDetails'
import { saveTaskApi, editTaskApi, getTaskDetApi } from '@/api/task'
import { PersonnelSelection } from '@/components/PersonnelSelection'
import { getAllUserListApi } from '@/api/user' // 获取所有用户
import { FileUpload } from '@/components/FileUpload' // 文件上传组件
import { FileButtonUpload } from '@/components/FileButtonUpload'
import { useCache } from '@/hooks/web/useCache'
import { Milestone, ContentTable } from './index'
import FilePreview from '@/views/Components/FilePreview/FilePreview.vue'
import { downloadFile } from '@/utils/index'
import moment from 'moment'

const { wsCache } = useCache()
const loginUserId = ref<string>(wsCache.get('userInfo').userId) // 登录用户id
const principalTree = inject('principalTree')
const { emitter } = useEmitt()
// 弹窗的开启和关闭
const dialogFlag = ref<any>(false)
type Callback = (error?: string | Error | undefined) => void

const { required, notSpace } = useValidator()

//弹窗
const drawerWrap = ref()
//打开drawer并初始化
const detailsId = ref<string>('')
const pageFlag = ref<string>('')
const pageTitle = ref<string>('')
const openDrawer = async (type: string, id: string) => {
  drawerWrap.value.isShow = true
  pageFlag.value = type
  pageTitle.value = type == 'add' ? '新增' : type == 'edit' ? '编辑' : '详情'
  await getAllUserlist()
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
  let allArray = contentTableRef.value.getAllArray()
  if (ruleForm.value.mgTaskMilestoneDos.length != allArray.length) {
    ElMessage.warning('部分里程碑数据未保存，请先保存！')
    return
  }
  //表单验证
  if (!formRef.value) return
  await formRef.value?.validate(async (isValid: boolean) => {
    if (isValid) {
      //判断里程碑截至时间是否晚于任务截止时间
      let res = ruleForm.value.mgTaskMilestoneDos.every((element: any) => {
        return (
          new Date(element.milestoneDeadline).getTime() <=
          new Date(ruleForm.value.deadline).getTime()
        )
      })
      if (!res) {
        ElMessage.error('部分里程碑截至时间晚于任务截止时间，请及时调整！')
        return
      }
      loading.value = true
      let params = ruleForm.value
      let users: any = []
      if (isAllSelected.value) {
        userData.value.forEach((item: any) => {
          users.push({ userId: item.userId })
        })
      } else {
        selectedPersonArray.value.forEach((item: any) => {
          users.push({ userId: item.userId })
        })
      }
      params.mgTaskConnectUserDos = users
      let mgTaskMilestoneDOS: any = []
      ruleForm.value.mgTaskMilestoneDos.forEach((item: any, index: number) => {
        mgTaskMilestoneDOS.push({
          milestoneTitle: item.milestoneTitle, // 里程碑标题
          milestoneDeadline: item.milestoneDeadline
            ? moment(item.milestoneDeadline).format('YYYY-MM-DD')
            : '', // 里程碑截止时间
          milestoneDescription: item.milestoneDescription, // 里程碑描述
          milestoneStatus: item.milestoneStatus,
          sort: index,
          taskId: detailsId.value ? detailsId.value : null
        })
      })
      params.mgTaskMilestoneDos = mgTaskMilestoneDOS
      params.fileName = params.filePath ? getFileName(params.filePath) : ''
      params.executor = Array.isArray(ruleForm.value.executor)
        ? params.executor[ruleForm.value.executor.length - 1]
        : ruleForm.value.executor
      if (detailsId.value) {
        params.id = detailsId.value
        const res = await editTaskApi(params)
          .catch(() => {})
          .finally(() => {
            setTimeout(() => {
              loading.value = false
            }, 200)
          })
        if (res) {
          ElMessage.success('保存信息成功')
          emitter.emit('taskManage', 'add')
          closeDrawer()
        }
      } else {
        params.status = '3'
        const res = await saveTaskApi(params)
          .catch(() => {})
          .finally(() => {
            setTimeout(() => {
              loading.value = false
            }, 200)
          })
        if (res) {
          ElMessage.success('保存信息成功')
          emitter.emit('taskManage', 'add')
          closeDrawer()
        }
      }
    }
  })
}

//查询详情
const taskUserIdSee = ref<any>([])
const getDetailsData = async () => {
  let executor: any = 0
  if (detailsId.value) {
    const res = await getTaskDetApi(detailsId.value)
    if (res && res.data) {
      ruleForm.value.title = res.data.title
      // ruleForm.value.executor = Number(res.data.executor)
      executor = res.data.executor
      ruleForm.value.deadline = res.data.deadline
        ? moment(res.data.deadline).format('YYYY-MM-DD')
        : ''
      ruleForm.value.description = res.data.description ? res.data.description : ''
      ruleForm.value.fileName = res.data.fileName
      ruleForm.value.filePath = res.data.filePath
      ruleForm.value.status = res.data.status
      ruleForm.value.updateUser = res.data.updateUser
      ruleForm.value.jobStatus = res.data.jobStatus
      taskUserIdSee.value = []
      taskUserIdSee.value.push(res.data.deptId)
      taskUserIdSee.value.push(res.data.executor)
      ruleForm.value.executor = []
      if (res.data.jobStatus !== 3) {
        ruleForm.value.executor.push(res.data.deptId)
        ruleForm.value.executor.push(res.data.executor)
      } else {
        ruleForm.value.executor = []
      }
      let users = res.data.mgTaskConnectUserDos
      nextTick()
      if (users && users.length > 0) {
        selectedPersonArray.value = []
        users.forEach((item: any) => {
          userData.value.forEach((user: any) => {
            if (item.userId === user.userId) {
              selectedPersonArray.value.push(user)
            }
          })
        })
      }
      if (selectedPersonArray.value.length == userData.value.length) {
        isAllSelected.value = true
        indeterminate.value = false
      } else {
        isAllSelected.value = false
        if (selectedPersonArray.value.length) {
          indeterminate.value = true
        } else {
          indeterminate.value = false
        }
      }
      ruleForm.value.mgTaskMilestoneDos = []
      res.data.mgTaskMilestoneDos.forEach((item: any) => {
        item.milestoneStatus = String(item.milestoneStatus)
        ruleForm.value.mgTaskMilestoneDos.push(item)
      })

      ruleForm.value.mgTaskLogDos = res.data.mgTaskLogDos
      ruleForm.value.createUser = res.data.createUser
    }
  }
  if (pageFlag.value == 'edit') {
    if (loginUserId.value == ruleForm.value.createUser) {
      editFlag.value = 'all'
    } else if (loginUserId.value == executor) {
      editFlag.value = 'status'
    }
  } else if (pageFlag.value == 'add') {
    editFlag.value = 'all'
  } else {
    editFlag.value = 'see'
  }
  nextTick()
  contentTableRef.value.updateArray(ruleForm.value.mgTaskMilestoneDos)
}

//表单验证规则
const rules = reactive({
  title: [
    { required: true, message: '请输入任务标题', trigger: 'blur' },
    {
      validator: (rule: any, value: string, callback: Callback) =>
        notSpace(value, callback, '不能输入纯空格'),
      trigger: 'blur'
    }
  ],
  executor: [{ required: true, message: '请选择任务执行人', trigger: 'change' }],
  deadline: [{ required: true, message: '请选择截止时间', trigger: 'change' }],
  description: [
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
    executor: '',
    deadline: '',
    description: '',
    fileName: '',
    filePath: '',
    status: '3',
    updateUser: '',
    jobStatus: '',
    mgTaskConnectUserDos: [],
    mgTaskMilestoneDos: [],
    mgTaskLogDos: []
  }
}

//表单数据
const ruleForm = ref<any>({
  id: '',
  title: '',
  executor: '',
  deadline: '',
  description: '',
  fileName: '',
  filePath: '',
  status: '3',
  jobStatus: '',
  updateUser: '',
  mgTaskConnectUserDos: [],
  mgTaskMilestoneDos: [],
  mgTaskLogDos: []
})

//关闭后清空
const resetFormAfterClose = () => {
  resetForm()
  selectedPersonArray.value = []
  isAllSelected.value = false
  indeterminate.value = false
  editFlag.value = 'all'
}

//关闭drawer
const closeDrawer = () => {
  drawerWrap.value.isShow = false
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
  if (userData.value.length > 0) {
    return
  }
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
}
const isAllSelected = ref<boolean>(false)
const indeterminate = ref<boolean>(false)

//添加里程碑
const contentTableRef = ref()
const headerTitle = ref([
  { title: '里程碑标题', field: 'milestoneTitle', isRequired: true },
  { title: '截至时间', field: 'milestoneDeadline', isRequired: true },
  { title: '里程碑状态', field: 'milestoneStatus', isRequired: true },
  { title: '里程碑描述', field: 'milestoneDescription', isRequired: false }
])

//截止时间变换
const selDeadline = (e: any) => {
  if (contentTableRef.value) {
    let allArray = contentTableRef.value.getAllArray()
    if (allArray.length > 0) {
      ElMessage.warning('您的任务截止时间发生了变化，请注意更改里程碑截至时间。')
    }
  }
}

//保存里程碑
const milestoneChange = (value: any) => {
  ruleForm.value.mgTaskMilestoneDos = value
}

// 预览弹窗
const fileName = ref<string>('')
const openPreviewFile = (row: any) => {
  fileName.value = row.title
  previewFile(row.title + '.' + fileNext(row.filePath), row.filePath)
}
const previewFile = (fileName: string, path: string) => {
  FilePreviewRef.value.openDialog(fileName, path)
}
const FilePreviewRef = ref()
// 获取文件名称
const getFileName = (name: string) => {
  if (name && name.lastIndexOf('/') > -1) {
    return name.slice(name.lastIndexOf('/') + 1)
  } else {
    return ''
  }
}

const nameArr = ref()
const isShow = ref(false)
const getFileNameItem = (name: string) => {
  nameArr.value = name.split(',')
  return nameArr
}
const fileNext = (path: any) => {
  let extension = ''
  if (path) {
    extension = path.substring(path.lastIndexOf('.') + 1)
  }
  return extension
}

const handleView = (fileUrl: string) => {
  if (
    fileNext(fileUrl) === 'doc' ||
    fileNext(fileUrl) === 'zip' ||
    fileNext(fileUrl) === 'rar' ||
    fileNext(fileUrl) === 'xls' ||
    fileNext(fileUrl) === 'bmp'
  ) {
    downloadFile(fileUrl, getFileName(fileUrl))
  } else {
    previewFile(getFileName(fileUrl), fileUrl)
  }
}

//是否可以全部编辑
const editFlag = ref<string>('all')

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
  <DrawerWrap
    ref="drawerWrap"
    :isShow="isShow"
    :title="pageTitle"
    @closeDrawer="resetFormAfterClose"
  >
    <template #content>
      <el-form
        ref="formRef"
        :model="ruleForm"
        :rules="rules"
        class="demo-ruleForm"
        label-position="top"
        label-width="100px"
      >
        <div class="mb-10px rounded bg-[#fff] px-[1.04vw] py-20px">
          <el-row>
            <el-col :span="8">
              <el-form-item label="任务标题" prop="title">
                <el-input
                  v-model="ruleForm.title"
                  :disabled="pageFlag == 'see' || (pageFlag == 'edit' && editFlag == 'status')"
                  maxlength="200"
                  placeholder="请输入任务标题"
                  type="text"
                />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item
                :label="
                  '任务执行人' +
                  (ruleForm.jobStatus === 3 && pageFlag != 'see' && ruleForm.executor.length == 0
                    ? '   ' + ruleForm.executorName + '已离职，请重新指派。'
                    : '')
                "
                prop="executor"
              >
                <el-cascader
                  v-model="ruleForm.executor"
                  :controlsPosition="'right'"
                  :disabled="pageFlag == 'see' || (pageFlag == 'edit' && editFlag == 'status')"
                  :filterable="true"
                  :options="principalTree"
                  :props="{ label: 'deptName', value: 'deptId' }"
                  placeholder="请选择任务执行人"
                  style="width: 100%"
                />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="截止时间" prop="deadline">
                <el-date-picker
                  v-model="ruleForm.deadline"
                  :clearable="true"
                  :disabled="pageFlag === 'see' || (pageFlag == 'edit' && editFlag == 'status')"
                  :disabled-date="deadlinelimit"
                  format="YYYY-MM-DD"
                  placeholder="请选择截止时间"
                  style="width: 100%"
                  type="date"
                  value-format="YYYY-MM-DD"
                  @change="selDeadline"
                ></el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="任务协同人">
                <div class="check-all-class">
                  <el-checkbox
                    v-model="isAllSelected"
                    :disabled="pageFlag === 'see' || (pageFlag == 'edit' && editFlag == 'status')"
                    :indeterminate="indeterminate"
                    style="float: right"
                    @change="handleCheckAllChange"
                    >全体人员
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
                  <div
                    v-if="pageFlag == 'add' || (pageFlag == 'edit' && editFlag == 'all')"
                    class="add-person-bg"
                    @click="addPerson"
                  >
                    <img src="@/assets/imgs/icon/add_icon.png" />
                  </div>
                </div>
              </el-form-item>
            </el-col>
          </el-row>
        </div>

        <div class="mb-10px rounded bg-[#fff] px-[1.04vw] py-20px">
          <ContentTable
            ref="contentTableRef"
            :canDelete="pageFlag === 'add' || (pageFlag == 'edit' && editFlag != 'status')"
            :dataArray="mgTaskMilestoneDos"
            :deadline="ruleForm.deadline"
            :editFlag="editFlag"
            :headerTitle="headerTitle"
            title="里程碑"
            @dataChange="milestoneChange"
          >
          </ContentTable>
        </div>

        <div class="mb-10px rounded bg-[#fff] px-[1.04vw] py-20px">
          <el-row>
            <el-col :span="24">
              <el-form-item label="任务描述" prop="description">
                <el-input
                  v-model="ruleForm.description"
                  :autosize="{ minRows: 4 }"
                  :disabled="pageFlag == 'see' || (pageFlag == 'edit' && editFlag == 'status')"
                  maxlength="2000"
                  placeholder="请输入任务描述"
                  type="textarea"
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
                  <FileButtonUpload
                    v-model:modelValue="ruleForm.filePath"
                    :fileSize="100"
                    :disabled="pageFlag == 'see' || (pageFlag == 'edit' && editFlag == 'status')"
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
                    :isMultiple="true"
                    :limit="15"
                  />
                </div>
              </el-form-item>
            </el-col>
          </el-row>
        </div>

        <el-row :gutter="32" class="mt-[20px]">
          <el-col span="24">
            <ul>
              <!-- 0未完成，1已完成，3待接受(新建任务后初始状态)，4已拒绝，5已驳回，6已归档 -->
              <li v-for="(item, index) in ruleForm.mgTaskLogDos" :key="index">
                <p v-if="item.status === 0" class="list-text-class">
                  <img class="list-img-class" src="@/assets/imgs/task/state_icon3.png" />&nbsp;{{
                    item.createTime
                  }}&nbsp;任务已被&nbsp;{{ item.createUserName }}&nbsp;接受。
                </p>
                <div v-if="item.status === 1">
                  <p class="list-text-class">
                    <img class="list-img-class" src="@/assets/imgs/task/state_icon3.png" />
                    &nbsp;{{ item.createTime }}&nbsp;任务已被&nbsp;{{ item.createUserName }}&nbsp;
                    完成，完成情况: &nbsp;{{ item.finishCondition }}
                  </p>
                  <div v-if="item.filePath" class="ml-[31px]"
                    >成果文档：<span class="file-sapn" @click="handleView(item.filePath)">{{
                      getFileNameItem(item.filePath) ? '' : ''
                    }}</span>
                    <p v-for="ele in nameArr" class="file-sapn" @click="handleView(ele)">{{
                      getFileName(ele)
                    }}</p>
                  </div>
                </div>
                <p v-if="item.status === 4" class="list-text-class">
                  <img class="list-img-class" src="@/assets/imgs/task/state_icon5.png" />&nbsp;{{
                    item.createTime
                  }}&nbsp;任务已被&nbsp;{{ item.createUserName }}&nbsp;拒绝，拒绝理由:&nbsp;{{
                    item.reason
                  }}。
                </p>
                <p v-if="item.status === 5" class="list-text-class">
                  <img class="list-img-class" src="@/assets/imgs/task/state_icon4.png" />&nbsp;{{
                    item.createTime
                  }}&nbsp;任务已被&nbsp;{{ item.createUserName }}&nbsp;驳回，驳回理由:&nbsp;{{
                    item.reason
                  }}。
                </p>
                <p v-if="item.status === 6" class="list-text-class">
                  <img class="list-img-class" src="@/assets/imgs/task/state_icon6.png" />&nbsp;{{
                    item.createTime
                  }}&nbsp;任务已被&nbsp;{{ item.createUserName }}&nbsp;归档。
                </p>
              </li>
            </ul>
          </el-col>
        </el-row>

        <div v-if="pageFlag != 'see'" class="flex justify-center items-center mt-26px pb-20px">
          <el-button :loading="loading" class="dialog-btn-sure" @click="save"> 提交</el-button>
          <el-button class="dialog-btn-cancel" @click="closeDrawer"> 取消</el-button>
        </div>
      </el-form>
    </template>
  </DrawerWrap>
  <PersonnelSelection ref="personnelSelectionRef" @sure-click="savePerson" />
  <!-- <Milestone
    ref="milestoneRef"
    :index="milestoneIndex"
    :deadline="ruleForm.deadline"
    :details="milestoneBean"
    @sure-click="saveMilestone"
  /> -->
  <FilePreview ref="FilePreviewRef" title="预览" />
</template>
<style lang="less" scoped>
:deep(.el-card__body) {
  padding: 0 !important;
}

:deep(.el-input__wrapper) {
  width: 100%;
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

ul {
  padding-bottom: 1.1rem;

  li {
    word-break: break-all;
    list-style: none;
    padding: 5px;
    display: flex;
    align-items: center;

    span {
      display: inline-block;
    }

    .time {
      margin: 0 15px 0 5px;
    }

    .message {
    }
  }
}

.list-text-class {
  font-size: 14px;
  font-family: Alibaba PuHuiTi R;
  font-weight: 400;
  color: #222222;
  display: flex;
  width: 100%;
  overflow: hidden;
  word-break: break-word;
}

.list-img-class {
  width: 16px;
  height: 16px;
  margin-right: 5px;
  margin-left: 10px;
  margin-top: 2px;
}

.file-sapn {
  cursor: pointer;
  color: #00a0e9;
}
</style>
