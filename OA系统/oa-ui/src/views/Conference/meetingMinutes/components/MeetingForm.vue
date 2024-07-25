<script setup lang="ts">
import { ref, unref, reactive, nextTick, inject, onMounted } from 'vue'
import { propTypes } from '@/utils/propTypes'
import { useValidator } from '@/hooks/web/useValidator'
import { useEmitt } from '@/hooks/web/useEmitt'
import { ElMessage, ElForm, ElFormItem, ElRow, ElCol, ElInput, ElTreeSelect } from 'element-plus'
import { Dialog } from '@/components/Dialog'
import { getMeetingDetApi } from '@/api/meeting'
import { meetingroomArray } from './config'
import { getAllUserListApi } from '@/api/user' // 获取所有用户
import { getAllDeptListApi } from '@/api/sys/dept'
import { listToTree } from '@/utils/tree'
import moment from 'moment'

const props = defineProps({})

onMounted(() => {
  getDeptTreeList()
  getAllUserlist()
})
//弹窗
const elDialogFef = ref()
//打开drawer并初始化
const detailsId = ref<string>('')
// 弹窗的开启和关闭
const dialogFlag = ref<any>(false)
const openDrawer = async (type: string, id: string) => {
  dialogFlag.value = true
  elDialogFef.value.isFullscreen = false
  if (userData.value.length === 0) {
    await getAllUserlist()
  }
  selectedPersonArray.value = []
  nextTick(() => {
    detailsId.value = id
    getDetailsData()
  })
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
const selectedPersonArray = ref<any[]>([])
const isAllSelected = ref<boolean>(false)
const indeterminate = ref<boolean>(false)

//查询详情
const getDetailsData = async () => {
  if (detailsId.value) {
    const res = await getMeetingDetApi(detailsId.value)
    if (res && res.data) {
      selectedPersonArray.value = []
      ruleForm.value.summary = res.data.summary
      ruleForm.value.meetingroom = res.data.meetingroom
      ruleForm.value.bookDateStart = res.data.bookDateStart
        ? moment(res.data.bookDateStart).format('YYYY-MM-DD HH:mm:ss')
        : ''
      ruleForm.value.bookDateEnd = res.data.bookDateEnd
        ? moment(res.data.bookDateEnd).format('YYYY-MM-DD HH:mm:ss')
        : ''
      ruleForm.value.meetingContent = res.data.meetingContent
      ruleForm.value.deptId = res.data.deptId
      // isAllSelected.value = res.data.allStatus == 0
      let meetingUserDos = res.data.meetingUserDos
      if (meetingUserDos) {
        meetingUserDos.forEach((item: any) => {
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
    }
  }
}
//表单验证规则
const rules = reactive({
  meetingroom: [{ required: true, message: '请输入会议室名称', trigger: 'blur' }],
  bookDateStart: [{ required: true, message: '请选择开始时间', trigger: 'change' }],
  bookDateEnd: [{ required: true, message: '请选择结束时间', trigger: 'change' }],
  summary: [{ required: true, message: '请输入会议主题', trigger: 'blur' }]
})
//清空表单
const resetForm = () => {
  ruleForm.value = {
    id: '',
    summary: '',
    meetingroom: '',
    bookDateStart: '',
    bookDateEnd: '',
    meetingContent: '',
    deptId: [],
    meetingUserDos: []
  }
}

//表单数据
const ruleForm = ref<any>({
  id: '',
  summary: '',
  meetingroom: '',
  bookDateStart: '',
  bookDateEnd: '',
  meetingContent: '',
  deptId: [],
  meetingUserDos: []
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
    title="会议记录"
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
          <el-form-item label="会议主题" prop="summary">
            <el-input
              maxlength="500"
              disabled
              v-model="ruleForm.summary"
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
              disabled
              style="width: 100%"
              format="YYYY-MM-DD HH:mm"
              value-format="YYYY-MM-DD HH:mm"
              placeholder="请选择开始时间"
              type="datetime"
            ></el-date-picker>
          </el-form-item>
        </el-col>

        <el-col :span="24">
          <el-form-item label="结束时间" prop="bookDateEnd">
            <el-date-picker
              v-model="ruleForm.bookDateEnd"
              :clearable="true"
              style="width: 100%"
              disabled
              format="YYYY-MM-DD HH:mm"
              value-format="YYYY-MM-DD HH:mm"
              placeholder="请选择结束时间"
              type="datetime"
            ></el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="会议室" prop="meetingroom">
            <el-select
              placeholder="请选择会议室"
              style="width: 100%"
              :clearable="true"
              disabled
              v-model="ruleForm.meetingroom"
            >
              <el-option
                v-for="item in meetingroomArray"
                :key="item.value"
                :value="item.value"
                :label="item.label"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col>
          <el-form-item label="组织部门" prop="deptId">
            <el-tree-select
              v-model="ruleForm.deptId"
              style="width: 100%"
              nodeKey="deptId"
              :filterable="true"
              check-strictly
              disabled
              placeholder="请选择组织部门"
              value-key="deptId"
              :props="{ label: 'deptName' }"
              :controlsPosition="'right'"
              :data="treedata"
            />
          </el-form-item>
        </el-col>

        <el-col :span="24">
          <el-form-item label="会议详情" prop="meetingContent">
            <el-input
              type="textarea"
              disabled
              :autosize="{ minRows: 4 }"
              maxlength="2000"
              v-model="ruleForm.meetingContent"
              placeholder="请输入会议详情"
            />
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="参会人">
            <div class="check-all-class">
              <el-checkbox
                v-model="isAllSelected"
                :indeterminate="indeterminate"
                style="float: right"
                disabled
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
            </div>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <template #footer>
      <div class="footer">
        <el-button class="dialog-btn-cancel" @click="closeDialog"> 取消 </el-button>
      </div>
    </template>
  </Dialog>
</template>

<style lang="less" scoped>
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
</style>
