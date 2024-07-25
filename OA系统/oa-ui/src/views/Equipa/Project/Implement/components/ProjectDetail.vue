<!-- 培育项目详情 -->
<script setup lang="ts">
import { DrawerWrap } from '@/components/DrawerWrapDetailsSub'
import { computed, nextTick, ref } from 'vue'
import { getImplementApi } from '@/api/project/Implement'
import {
  ProjectFlow,
  IndicativeTable,
  IndicativeContent,
  UpdateDebriefing,
  FileCollection,
  StateChange
} from '../../components'
import {
  ProjectInfo,
  ConfirmMilestone,
  ChangeMilestone,
  ChangeResponsibleUser,
  EndTransferExecution
} from '../components'
import { isAuth } from '@/utils/is'
import { useCache } from '@/hooks/web/useCache'
import { Dialog } from '@/components/Dialog'
import { ElLoading } from 'element-plus'

const emit = defineEmits(['resetTable'])
const { wsCache } = useCache()
// 登录用户id
const loginUserId = ref<string>(wsCache.get('userInfo').userId)
//是否显示本页面
const isShow = ref<boolean>(false)
//是否显示保存按钮
const isSave = ref<boolean>(false)
//页面标题
const pageTite = ref<string>('')
//详情页面
const drawerWrap = ref<any>()
//详情Id
const detailsId = ref<any>()
//打开drawer并初始化
const openDrawer = (id: number) => {
  //重置
  resetDetail()
  detailsId.value = id
  drawerWrap.value.isShow = true
  if (id) {
    getDetailsData(id)
  }
}

const detailsData = ref<any>({
  id: '',
  fileList: '',
  createBy: '',
  createTime: '',
  ownerName: '',
  planContent: '',
  estimatedAmount: undefined,
  createByName: '',
  updateBy: '',
  updateTime: '',
  remark: '',
  filePath: '',
  status: '0',
  flag: false,
  pyzxm: null,
  pyspz: null,
  jszz: null,
  jzz: null,
  address: '',
  delFlag: '',
  itemNumber: '',
  lat: '',
  llng: '',
  milestoneList: [],
  pmAuditList: [],
  pmProgressList: [],
  principalPersonName: '',
  phase: '',
  projectTitle: '',
  projectType: '',
  province: '',
  year: '',
  roleId: '',
  roleName: '',
  roleKey: '',
  roleSort: null,
  dataScope: '',
  menuCheckStrictly: false,
  deptCheckStrictly: false,
  menuIds: [],
  deptIds: [],
  permissions: '',
  admin: false,
  workflowInstanceId: null,
  predictContractMoney: ''
})

//重置
const resetDetail = () => {
  detailsData.value = {
    id: '',
    fileList: '',
    createBy: '',
    createTime: '',
    ownerName: '',
    planContent: '',
    estimatedAmount: undefined,
    createByName: '',
    updateBy: '',
    updateTime: '',
    remark: '',
    filePath: '',
    status: '0',
    flag: false,
    pyzxm: null,
    pyspz: null,
    jszz: null,
    jzz: null,
    address: '',
    delFlag: '',
    itemNumber: '',
    lat: '',
    llng: '',
    milestoneList: [],
    pmAuditList: [],
    pmProgressList: [],
    principalPersonName: '',
    phase: '',
    projectTitle: '',
    projectType: '',
    province: '',
    year: '',
    roleId: '',
    roleName: '',
    roleKey: '',
    roleSort: null,
    dataScope: '',
    menuCheckStrictly: false,
    deptCheckStrictly: false,
    menuIds: [],
    deptIds: [],
    permissions: '',
    admin: false,
    workflowInstanceId: null,
    predictContractMoney: ''
  }
}
//获取详情
const pageLoading = ref<boolean>(false)
const getDetailsData = async (ids: number) => {
  pageLoading.value = true
  let params = {
    id: ids
  }
  const res = await getImplementApi(params).finally(() => {
    setTimeout(() => {
      pageLoading.value = false
    }, 200)
  })
  if (res && res.data) {
    detailsData.value = res.data
    detailsData.value.address = res.data.address
    detailsData.value.fileList = res.data.filePath
    console.log('detailsData.value==>', detailsData.value)
  }
}

//操作
const title = ref<string>('') //弹窗标题
const updateDebriefing = (action: string) => {
  title.value = action
  dialogVisible.value = true
  ElDialogFef.value.isFullscreen = false
}

//弹窗
const ElDialogFef = ref()
const dialogVisible = ref<boolean>(false)

//弹窗关闭
const closePermissionDialog = (isRefreshTable: boolean) => {
  dialogVisible.value = false
  ElDialogFef.value.isFullscreen = false
  drawerNextRef.value.isShow = false
  getDetailsData(detailsId.value)
  if (isRefreshTable) {
    emit('resetTable')
  }
}

const resetClosePermissionDialog = () => {
  dialogVisible.value = false
  ElDialogFef.value.isFullscreen = false
  emit('resetTable')
  drawerWrap.value.isShow = false
  drawerNextRef.value.isShow = false
}

//结束转实施
const EndTransferExecutionRef = ref()
const updateEffect = () => {
  drawerNextRef.value.isShow = true
  // 重置表单
  if (EndTransferExecutionRef.value) {
    EndTransferExecutionRef.value.resetConfirmForm()
  }
}
const isNextShow = ref<boolean>(false)
const drawerNextRef = ref()

//关闭项目立项表
const projectInfoRef = ref()
const closeDrawer = () => {
  if (projectInfoRef.value) {
    projectInfoRef.value.colseDataForm()
  }
  pageLoading.value = false
}

defineExpose({
  isShow,
  openDrawer
})
</script>

<template>
  <DrawerWrap title="立项详情" :isShow="isShow" ref="drawerWrap" @close-drawer="closeDrawer">
    <template #content>
      <!-- <div v-loading="pageLoading"> -->
        <!-- 流程 -->
        <ProjectFlow :detailsData="detailsData" phase="2" />

        <!-- 项目信息 -->
        <ProjectInfo :detailsData="detailsData" ref="projectInfoRef" />

        <!-- 项目进展/变更详情 -->
        <IndicativeTable tableFlag="1" :pmProgressList="detailsData.pmProgressList">
          <template #button>
            <div v-if="detailsData.status !== '5'">
              <el-button
                type="primary"
                class="segmentation"
                v-if="
                  loginUserId === detailsData.principalPerson &&
                  detailsData.status !== '1' &&
                  detailsData.status !== '3' &&
                  detailsData.status !== '6' &&
                  detailsData.status !== '7' &&
                  detailsData.status !== '8' &&
                  detailsData.status !== '9' &&
                  detailsData.status !== '4' &&
                  detailsData.status !== '10' &&
                  isAuth('project:implement:updateprogress') &&
                  detailsData.phase == '2'
                "
                @click="updateDebriefing('更新项目进展')"
                >更新项目进展</el-button
              >
              <el-button
                type="warning"
                class="segmentation"
                v-if="
                  detailsData.status !== '1' &&
                  detailsData.status !== '6' &&
                  detailsData.status !== '7' &&
                  detailsData.status !== '3' &&
                  detailsData.milestone !== '3' &&
                  detailsData.status !== '9' &&
                  detailsData.status !== '4' &&
                  detailsData.status !== '10' &&
                  loginUserId === detailsData.principalPerson &&
                  isAuth('project:implement:confirmmilestones') &&
                  detailsData.phase == '2'
                "
                @click="updateDebriefing('确认里程碑')"
                >确认里程碑</el-button
              >
              <el-button
                type="danger"
                class="segmentation"
                v-if="
                  detailsData.status !== '1' &&
                  detailsData.status !== '6' &&
                  detailsData.status !== '7' &&
                  detailsData.status !== '3' &&
                  detailsData.milestone !== '3' &&
                  detailsData.status !== '9' &&
                  detailsData.status !== '4' &&
                  detailsData.status !== '10' &&
                  loginUserId === detailsData.principalPerson &&
                  isAuth('project:implement:editmilestones') &&
                  detailsData.phase == '2'
                "
                @click="updateDebriefing('变更里程碑')"
                >变更里程碑</el-button
              >
              <el-button
                type="primary"
                class="segmentation"
                v-if="
                  detailsData.status !== '1' &&
                  detailsData.status !== '6' &&
                  detailsData.status !== '7' &&
                  detailsData.status !== '3' &&
                  detailsData.status !== '9' &&
                  detailsData.status !== '4' &&
                  detailsData.status !== '10' &&
                  detailsData.leaders &&
                  detailsData.leaders.length &&
                  detailsData.leaders.includes(loginUserId) &&
                  isAuth('project:implement:indicative') &&
                  detailsData.phase == '2'
                "
                @click="updateDebriefing('提出指示要求')"
                >提出指示要求</el-button
              >

              <el-button
                type="success"
                class="segmentation"
                v-if="
                  detailsData.status < 4 &&
                  detailsData.status !== '3' &&
                  detailsData.status !== '1' &&
                  detailsData.status !== '6' &&
                  detailsData.status !== '7' &&
                  detailsData.status !== '9' &&
                  detailsData.status !== '4' &&
                  detailsData.status !== '10' &&
                  loginUserId === detailsData.principalPerson &&
                  isAuth('project:implement:putintoeffect') &&
                  detailsData.phase == '2'
                "
                @click="updateEffect()"
                >申请结束转实施</el-button
              >
              <el-button
                class="segmentation"
                type="warning"
                v-if="
                  detailsData.status !== '1' &&
                  detailsData.status !== '6' &&
                  detailsData.status !== '7' &&
                  detailsData.status !== '9' &&
                  detailsData.status !== '4' &&
                  detailsData.status !== '10' &&
                  (loginUserId === detailsData.principalPerson ||
                    (detailsData.leaders &&
                      detailsData.leaders.length &&
                      detailsData.leaders.includes(loginUserId))) &&
                  isAuth('project:implement:statuschange') &&
                  detailsData.phase == '2'
                "
                @click="updateDebriefing('项目状态变更')"
                >项目状态变更</el-button
              >
              <el-button
                type="danger"
                class="segmentation"
                v-if="
                  detailsData.status !== '1' &&
                  detailsData.status !== '6' &&
                  detailsData.status !== '7' &&
                  detailsData.status !== '3' &&
                  detailsData.status !== '9' &&
                  detailsData.status !== '4' &&
                  detailsData.status !== '10' &&
                  (loginUserId === detailsData.principalPerson ||
                    (detailsData.leaders &&
                      detailsData.leaders.length &&
                      detailsData.leaders.includes(loginUserId))) &&
                  isAuth('project:implement:personcharge') &&
                  detailsData.phase == '2'
                "
                @click="updateDebriefing('负责人变更')"
                >负责人变更</el-button
              >
            </div>
          </template>
        </IndicativeTable>
        <!-- 提出指示要求详情 -->
        <IndicativeTable tableFlag="2" :pmProgressList="detailsData.pmProgressList" />
        <!-- 文件 -->
        <FileCollection :detailsData="detailsData" />
      <!-- </div> -->
    </template>
  </DrawerWrap>

  <Dialog
    ref="ElDialogFef"
    v-model="dialogVisible"
    :modal="true"
    :width="title === '申请结束转实施' ? '85%' : '50%'"
    :maxHeight="'auto'"
    :class="'Debriefing'"
    :title="title"
    :draggable="true"
  >
    <!-- 更新项目进展 -->
    <UpdateDebriefing
      v-if="title === '更新项目进展'"
      phase="2"
      :pid="detailsData.pid"
      @close-dialog-click="closePermissionDialog(false)"
    />
    <!-- 提出指示要求 -->
    <IndicativeContent
      v-if="title === '提出指示要求'"
      phase="2"
      :pid="detailsData.pid"
      @close-dialog-click="closePermissionDialog(false)"
    />
    <!-- 项目状态变更 -->
    <StateChange
      :pid="detailsData.pid"
      :changeApplyFlag="detailsData.pmAuditList[0].changeApplyFlag"
      :status="detailsData.status"
      @close-dialog-click="closePermissionDialog(true)"
      v-if="title === '项目状态变更'"
    />
    <!-- 确认里程碑 -->
    <ConfirmMilestone
      :detailsData="detailsData"
      @close-dialog-click="closePermissionDialog(true)"
      v-if="title === '确认里程碑'"
    />
    <!-- 变更里程碑 -->
    <ChangeMilestone
      :detailsData="detailsData"
      @close-dialog-click="closePermissionDialog(true)"
      v-if="title === '变更里程碑'"
    />
    <!-- 负责人变更 -->
    <ChangeResponsibleUser
      :detailsData="detailsData"
      @close-dialog-click="closePermissionDialog(true)"
      v-if="title === '负责人变更'"
    />
  </Dialog>

  <!-- 申请项目转实施 -->
  <DrawerWrap
    title="结束转实施"
    :isShow="isNextShow"
    class="execution-content execution"
    ref="drawerNextRef"
  >
    <template #content>
      <EndTransferExecution
        ref="EndTransferExecutionRef"
        :detailsData="detailsData"
        @change-get-detail-and-list="resetClosePermissionDialog"
        @close-dialog-click="closePermissionDialog(false)"
      />
    </template>
  </DrawerWrap>
</template>

<style lang="less" scoped>
:deep(.el-input-group__append) {
  background-color: white;
  width: 35px;
}
:deep(.milestone-popper .el-popper) {
  max-width: 100px !important;
}
:deep(.el-popper) {
  max-width: 500px;
}
:deep(.milestone-popper .el-overlay .el-popper) {
  max-width: 100px !important;
}
</style>
<style>
.projectDetails th {
  background-color: rgb(245, 247, 250) !important;
}
</style>

