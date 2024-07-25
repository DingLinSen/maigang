<!-- 培育项目详情 -->
<script setup lang="ts">
import { DrawerWrap } from '@/components/DrawerWrapDetailsSub'
import { computed, getCurrentInstance, nextTick, ref, provide } from 'vue'
import { getAfterSalesApi } from '@/api/project/afterSales'
import {
  ProjectFlow,
  IndicativeTable,
  IndicativeContent,
  UpdateDebriefing,
  FileCollection
} from '../../components'
import {
  ProjectInfo,
  AfterSalesRecord,
  SalesPersonChange,
  AfterSalesPersonChange,
  EndAfterSales
} from '../components'
import { isAuth } from '@/utils/is'
import { useCache } from '@/hooks/web/useCache'
import { Dialog } from '@/components/Dialog'
import { findLastIndex } from '@/utils'

const emit = defineEmits(['resetTable'])
const { wsCache } = useCache()
const { proxy } = getCurrentInstance() as any
const { after_sales } = proxy.useDict('after_sales')
provide('after_sales', after_sales)
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
  acceptDate: '', //验收时间
  afterSaleDate: '', //售后期限
  afterSaleDeadline: '', //售后截止日期
  afterSalePerson: '', //售后负责人
  afterSalePersonName: '', //售后负责人
  afterSalePlan: '', //售后服务计划
  afterSalePurpose: '', //售后服务目的
  afterSaleRequire: '', //售后服务要求
  afterSaleType: '', //售后服务类型 1本部门 2 研发中心
  audit: false, //
  auditSort: '', //转售后审批流程序号 0 未审批 1销售经理上级已审批 2销售经理上级驳回 3 总经理已审批 4总经理驳回
  beginTime: '', //
  createBy: '',
  createTime: '',
  endTime: '',
  finalDate: '', //	尾款时间
  finalMoney: '', //	尾款金额
  id: '',
  itemNumber: '',
  leaders: '',
  ownerName: '', //	用户名称
  params: null,
  paymentDate: '', //回款时间
  paymentFilePath: '',
  paymentMoney: '', //回款金额
  paymentRate: '', //已回款比例
  phase: '',
  pid: '',
  pmAuditList: [],
  pmProgressList: [],
  pollingDate: '', //巡检开始时间
  pollingDateType: '', //巡检时间 1 每周 2 每月 3 每季度 4 每年
  projectAffiliation: '', //项目属性1直签、2转签
  projectTitle: '',
  projectType: '',
  remark: '',
  salesManager: '', //销售经理
  salesManagerLeader: '', //销售经理
  salesManagerLeaderName: '', //销售经理
  salesManagerName: '', //销售经理
  status: '', //1实施转售后审批中，2售后中，3项目结束，4项目结束审批中
  updateBy: '', //
  updateTime: '', //
  year: null
})

//重置
const resetDetail = () => {
  detailsData.value = {
    acceptDate: '', //验收时间
    afterSaleDate: '', //售后期限
    afterSaleDeadline: '', //售后截止日期
    afterSalePerson: '', //售后负责人
    afterSalePersonName: '', //售后负责人
    afterSalePlan: '', //售后服务计划
    afterSalePurpose: '', //售后服务目的
    afterSaleRequire: '', //售后服务要求
    afterSaleType: '', //售后服务类型 1本部门 2 研发中心
    audit: false, //
    auditSort: '', //转售后审批流程序号 0 未审批 1销售经理上级已审批 2销售经理上级驳回 3 总经理已审批 4总经理驳回
    beginTime: '', //
    createBy: '',
    createTime: '',
    endTime: '',
    finalDate: '', //	尾款时间
    finalMoney: '', //	尾款金额
    id: '',
    itemNumber: '',
    leaders: '',
    ownerName: '', //	用户名称
    params: null,
    paymentDate: '', //回款时间
    paymentFilePath: '',
    paymentMoney: '', //回款金额
    paymentRate: '', //已回款比例
    phase: '',
    pid: '',
    pmAuditList: [],
    pmProgressList: [],
    pollingDate: '', //巡检开始时间
    pollingDateType: '', //巡检时间 1 每周 2 每月 3 每季度 4 每年
    projectAffiliation: '', //项目属性1直签、2转签
    projectTitle: '',
    projectType: '',
    remark: '',
    salesManager: '', //销售经理
    salesManagerLeader: '', //销售经理
    salesManagerLeaderName: '', //销售经理
    salesManagerName: '', //销售经理
    status: '', //1实施转售后审批中，2售后中，3项目结束，4项目结束审批中
    updateBy: '', //
    updateTime: '', //
    year: null
  }
}
//获取详情
const getDetailsData = async (ids: number) => {
  let params = {
    id: ids
  }
  const res = await getAfterSalesApi(params)
  if (res && res.data) {
    //找结束时间
    if (res.data.status === '3') {
      let lastIndex = findLastIndex(
        res.data.pmAuditList,
        (item: any) => item.flag === '1' && item.phase === '4' && item.type === '10'
      )
      if (lastIndex > -1) {
        res.data.endTime = res.data.pmAuditList[lastIndex].endDate
          ? res.data.pmAuditList[lastIndex].endDate
          : ''
      }
    }
    res.data.phase = '4'
    detailsData.value = res.data
    detailsData.value.fileList = detailsData.value.file ? detailsData.value.file : {}
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
}

//判断是否可以新增售后服务记录
const checkAddAfterSalesRecord = () => {
  if (detailsData.value.afterSalePerson) {
    if (loginUserId.value === detailsData.value.afterSalePerson) {
      return true
    } else {
      return false
    }
  } else {
    if (detailsData.value.afterSaleType === '1') {
      if (loginUserId.value === detailsData.value.salesManager) {
        return true
      } else {
        return false
      }
    } else {
      let isTrue = false
      after_sales.value.some((value: any, index: number, arr: any[]) => {
        if (String(loginUserId.value) === value.value) {
          isTrue = true
        }
      })
      return isTrue
    }
  }
}

//判断是否超过售后截至时间
const checkDeadlinetDate = () => {
  let afterSaleDeadlineStr = detailsData.value.afterSaleDeadline
  if (afterSaleDeadlineStr) {
    let deadDate = new Date(afterSaleDeadlineStr + ' 23:59:59')
    if (deadDate.getTime() < new Date().getTime()) {
      //超过预计售后截至时间
      return false
    } else {
      return true
    }
  } else {
    return true
  }
}

//关闭售后计划书
const projectInfoRef = ref()
const closeDrawer = () => {
  if (projectInfoRef.value) {
    projectInfoRef.value.colseDataForm()
  }
}

defineExpose({
  isShow,
  openDrawer
})
</script>

<template>
  <DrawerWrap title="售后详情" :isShow="isShow" ref="drawerWrap" @close-drawer="closeDrawer">
    <template #content>
      <!-- 流程 -->
      <ProjectFlow :detailsData="detailsData" phase="4" />

      <!-- 项目信息 -->
      <ProjectInfo :detailsData="detailsData" ref="projectInfoRef" />

      <!-- 项目进展/变更详情 -->
      <IndicativeTable tableFlag="1" :pmProgressList="detailsData.pmProgressList">
        <template #button>
          <div>
            <el-button
              class="segmentation"
              type="primary"
              @click="updateDebriefing('更新项目进展')"
              v-if="
                loginUserId === detailsData.salesManager &&
                detailsData.status !== '1' &&
                detailsData.status !== '4' &&
                detailsData.status !== '5' &&
                isAuth('project:sh:updateprogress')
              "
              >更新项目进展</el-button
            >
            <el-button
              type="primary"
              class="segmentation"
              @click="updateDebriefing('提出指示要求')"
              v-if="
                detailsData.leaders &&
                detailsData.leaders.length &&
                detailsData.leaders.includes(loginUserId) &&
                detailsData.status !== '1' &&
                detailsData.status !== '4' &&
                detailsData.status !== '5' &&
                isAuth('project:sh:indicative')
              "
              >提出指示要求</el-button
            >
            <el-button
              type="success"
              class="segmentation"
              @click="updateDebriefing('新增售后服务记录')"
              v-if="
                checkAddAfterSalesRecord() &&
                detailsData.status === '2' &&
                checkDeadlinetDate() &&
                isAuth('project:sh:record')
              "
              >新增售后服务记录</el-button
            >

            <el-button
              type="danger"
              class="segmentation"
              @click="updateDebriefing('项目结束申请')"
              v-if="
                (detailsData.status === '2' || detailsData.status === '6') &&
                loginUserId === detailsData.salesManager &&
                isAuth('project:sh:end')
              "
              >项目结束申请</el-button
            >
            <el-button
              type="warning"
              class="segmentation"
              @click="updateDebriefing('销售经理变更')"
              v-if="
                (detailsData.status === '2' || detailsData.status === '6') &&
                (loginUserId === detailsData.salesManagerLeader ||
                  loginUserId === detailsData.salesManager) &&
                isAuth('project:sh:personchange')
              "
              >销售经理变更</el-button
            >

            <el-button
              type="warning"
              class="segmentation"
              @click="updateDebriefing('分配售后负责人')"
              v-if="
                detailsData.status === '2' &&
                detailsData.afterSaleType === '2' &&
                detailsData.rdLeaders &&
                detailsData.rdLeaders.length &&
                detailsData.rdLeaders.includes(loginUserId) &&
                isAuth('project:sh:saleschange')
              "
              >分配售后负责人</el-button
            >
          </div>
        </template>
      </IndicativeTable>
      <!-- 提出指示要求详情 -->
      <IndicativeTable tableFlag="2" :pmProgressList="detailsData.pmProgressList" />
      <!-- 文件 -->
      <FileCollection :detailsData="detailsData" />
    </template>
  </DrawerWrap>

  <Dialog
    ref="ElDialogFef"
    v-model="dialogVisible"
    :modal="true"
    :width="'50%'"
    :maxHeight="'auto'"
    :class="'Debriefing'"
    :title="title"
    :draggable="true"
  >
    <!-- 更新项目进展 -->
    <UpdateDebriefing
      v-if="title === '更新项目进展'"
      phase="4"
      :pid="detailsData.pid"
      @close-dialog-click="closePermissionDialog(false)"
    />
    <!-- 提出指示要求 -->
    <IndicativeContent
      v-if="title === '提出指示要求'"
      phase="4"
      :pid="detailsData.pid"
      @close-dialog-click="closePermissionDialog(false)"
    />
    <!-- 新增售后服务记录 -->
    <AfterSalesRecord
      v-if="title === '新增售后服务记录'"
      :pid="detailsData.pid"
      @close-dialog-click="closePermissionDialog(false)"
    />
    <!-- 销售经理变更 -->
    <SalesPersonChange
      v-if="title === '销售经理变更'"
      :detailsData="detailsData"
      @close-dialog-click="closePermissionDialog(true)"
    />
    <!--分配售后负责人-->
    <AfterSalesPersonChange
      v-if="title === '分配售后负责人'"
      :detailsData="detailsData"
      @close-dialog-click="closePermissionDialog(true)"
    />
    <!--项目结束申请-->
    <EndAfterSales
      v-if="title === '项目结束申请'"
      :pid="detailsData.pid"
      @close-dialog-sure="resetClosePermissionDialog"
      @close-dialog-click="closePermissionDialog(true)"
    />
  </Dialog>
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

