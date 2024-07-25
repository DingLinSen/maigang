<!-- 培育项目详情 -->
<script setup lang="ts">
import { DrawerWrap } from '@/components/DrawerWrapDetailsSub'
import { computed, nextTick, ref } from 'vue'
import { getEstablishApi } from '@/api/project/ssxm'
import {
  ProjectFlow,
  IndicativeTable,
  IndicativeContent,
  UpdateDebriefing,
  FileCollection
} from '../../components'
import { ProjectInfo, ProjectAccept, ProjectChange, EndTransferAfterSales } from '../components'
import { isAuth } from '@/utils/is'
import { useCache } from '@/hooks/web/useCache'
import { Dialog } from '@/components/Dialog'
import { findLastIndex } from '@/utils'

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
  id: '', // id
  acceptDate: '',
  auditSort: '', //转实施审批流程序号 1项目经理已确认，2销售经理已确认，3项目经理上级已确认 ，4销售经理上级已确认， 5项目经理上级已驳回，6销售经理上级已驳回,7 总经理已确认， 8 总经理已驳回
  auditTime: '', //申请时间
  beginTime: '',
  bidResultUrl: '', //投标分析结果地址
  bidUrl: '', //投标文件地址
  contractMoney: '', //合同金额
  contractNumber: '', //项目合同编号
  contractSignDate: '', //合同签订日期
  contractSignUnit: '', //合同签订单位
  createBy: '',
  createTime: '',
  endTime: '',
  gmAffirm: '', //总经理确认
  gmSignature: '', //总经理_签名
  gmSignatureDate: '', //总经理_签名日期
  implementDept: '', //实施部门
  itemNumber: '',
  lastUserUnit: '', //最终用户名称
  params: null,
  phase: '',
  pid: '',
  pmSignature: '', //项目经理_签名
  pmSignatureDate: '', //	项目经理_签名日期
  pmUpprincipalSignatureDate: '', //项目经理_分管负责人_签名日期
  predictAcceptDate: '', //预计验收日期
  predictPaymentDate: '', //预计回款日期
  projectAffiliation: '', //项目属性1直签、2转签
  projectContent: '', //项目内容及实施计划
  projectManager: '', //项目经理
  projectManagerName: '', //项目经理
  projectTeam: '', //项目组其它人员及职责
  projectTitle: '',
  projectType: '',
  projectTypeCompany: '', //项目类型A1常规项目、2灯塔项目、3流水项目、4补助项目
  projectTypeIndustry: '', //项目类型B1农业农村、2铁路交通、3军工、4其它
  projectTypeSales: '', //项目类型C1自有产品销售、2合作产品销售、3软件开发、4运行维护、5咨询设计、6技术服务、7系统集成
  remark: '',
  saleContractUrl: '', //销售合同地址
  salesManager: '', //销售经理
  salesManagerName: '', //销售经理
  searchValue: '',
  smSignature: '', //销售经理_签名
  smSignatureDate: '', //	销售经理_签名日期
  smUpprincipalSignature: '', //	销售经理_分管负责人_签名日期
  smUpprincipalSignatureDate: '', //	销售经理_分管负责人_签名日期
  status: '', //	状态 1立项转实施审批中，2实施中，3已验收，4已回款转售后, 5项目变更审批中,6已回款转售后审批中
  updateBy: '', //
  updateTime: '', //
  upprincipalAffirm: '', //分管负责人确认
  year: null
})

//重置
const resetDetail = () => {
  detailsData.value = {
    id: '', // id
    acceptDate: '',
    auditSort: '', //转实施审批流程序号 1项目经理已确认，2销售经理已确认，3项目经理上级已确认 ，4销售经理上级已确认， 5项目经理上级已驳回，6销售经理上级已驳回,7 总经理已确认， 8 总经理已驳回
    auditTime: '', //申请时间
    beginTime: '',
    bidResultUrl: '', //投标分析结果地址
    bidUrl: '', //投标文件地址
    contractMoney: '', //合同金额
    contractNumber: '', //项目合同编号
    contractSignDate: '', //合同签订日期
    contractSignUnit: '', //合同签订单位
    createBy: '',
    createTime: '',
    endTime: '',
    gmAffirm: '', //总经理确认
    gmSignature: '', //总经理_签名
    gmSignatureDate: '', //总经理_签名日期
    implementDept: '', //实施部门
    itemNumber: '',
    lastUserUnit: '', //最终用户名称
    params: null,
    phase: '',
    pid: '',
    pmSignature: '', //项目经理_签名
    pmSignatureDate: '', //	项目经理_签名日期
    pmUpprincipalSignatureDate: '', //项目经理_分管负责人_签名日期
    predictAcceptDate: '', //预计验收日期
    predictPaymentDate: '', //预计回款日期
    projectAffiliation: '', //项目属性1直签、2转签
    projectContent: '', //项目内容及实施计划
    projectManager: '', //项目经理
    projectManagerName: '', //项目经理
    projectTeam: '', //项目组其它人员及职责
    projectTitle: '',
    projectType: '',
    projectTypeCompany: '', //项目类型A1常规项目、2灯塔项目、3流水项目、4补助项目
    projectTypeIndustry: '', //项目类型B1农业农村、2铁路交通、3军工、4其它
    projectTypeSales: '', //项目类型C1自有产品销售、2合作产品销售、3软件开发、4运行维护、5咨询设计、6技术服务、7系统集成
    remark: '',
    saleContractUrl: '', //销售合同地址
    salesManager: '', //销售经理
    salesManagerName: '', //销售经理
    searchValue: '',
    smSignature: '', //销售经理_签名
    smSignatureDate: '', //	销售经理_签名日期
    smUpprincipalSignature: '', //	销售经理_分管负责人_签名日期
    smUpprincipalSignatureDate: '', //	销售经理_分管负责人_签名日期
    status: '', //	状态 1立项转实施审批中，2实施中，3已验收，4已回款转售后, 5项目变更审批中,6已回款转售后审批中
    updateBy: '', //
    updateTime: '', //
    upprincipalAffirm: '', //分管负责人确认
    year: null
  }
}
//获取详情
const getDetailsData = async (ids: number) => {
  let params = {
    id: ids
  }
  const res = await getEstablishApi(params)
  if (res && res.data) {
    let progressList = res.data.pmProgressList
    if (progressList) {
      let lastIndex = findLastIndex(
        progressList,
        (item: any) => item.phase === '3' && item.type === '5'
      )
      if (lastIndex > -1) {
        res.data.acceptDate = progressList[lastIndex].acceptDate
          ? progressList[lastIndex].acceptDate
          : ''
      }
    }
    detailsData.value = res.data
    detailsData.value.projectTeam =
      detailsData.value.projectTeam && detailsData.value.projectTeam !== ''
        ? getFilterTeam(detailsData.value.projectTeam)
        : [{ name: '', duty: '' }]
    detailsData.value.fileList = detailsData.value.file ? detailsData.value.file : {}
  }
}
// 拆分显示项目组成员职责
const getFilterTeam = (str: any) => {
  let teamList: any = []
  str.split(',').forEach((item: any) => {
    if (item.indexOf('：') > -1) {
      teamList.push({ name: item.split('：')[0], duty: item.split('：')[1] })
    }
  })
  return teamList
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

//判断是否超过预计验收时间
const checkAcceptDate = () => {
  let acceptDateStr = detailsData.value.predictAcceptDate
  if (acceptDateStr) {
    let acceptDate = new Date(acceptDateStr + ' 23:59:59')
    if (acceptDate.getTime() < new Date().getTime()) {
      //超过预计验收时间
      return false
    } else {
      return true
    }
  } else {
    return true
  }
}

//判断是否超过预计回款时间
const checkPaymentDate = () => {
  let acceptDateStr = detailsData.value.predictPaymentDate
  if (acceptDateStr) {
    let acceptDate = new Date(acceptDateStr + ' 23:59:59')
    if (acceptDate.getTime() < new Date().getTime()) {
      //超过预计回款时间
      return false
    } else {
      return true
    }
  } else {
    return true
  }
}

//关闭项目实施确认表
const projectInfoRef = ref()
const closeDrawer = () => {
  if(projectInfoRef.value) {
    projectInfoRef.value.colseDataForm()
  }
}

defineExpose({
  isShow,
  openDrawer
})
</script>

<template>
  <DrawerWrap title="实施详情" :isShow="isShow" ref="drawerWrap" @close-drawer="closeDrawer">
    <template #content>
      <!-- 流程 -->
      <ProjectFlow :detailsData="detailsData" phase="3"/>

      <!-- 项目信息 -->
      <ProjectInfo :detailsData="detailsData" ref="projectInfoRef"/>

      <!-- 项目进展/变更详情 -->
      <IndicativeTable tableFlag="1" :pmProgressList="detailsData.pmProgressList">
        <template #button>
          <div>
            <el-button
              type="primary"
              class="segmentation"
              @click="updateDebriefing('更新项目进展')"
              v-if="
                (loginUserId === detailsData.projectManager ||
                  loginUserId === detailsData.salesManager) &&
                detailsData.status !== '1' &&
                detailsData.status !== '5' &&
                detailsData.status !== '6' &&
                isAuth('project:ssxm:updateprogress') &&
                detailsData.phase == '3'
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
                detailsData.status !== '5' &&
                detailsData.status !== '6' &&
                isAuth('project:ssxm:indicative') &&
                detailsData.phase == '3'
              "
              >提出指示要求</el-button
            >
            <el-button
              type="danger"
              class="segmentation"
              @click="updateDebriefing('项目验收')"
              v-if="
                loginUserId === detailsData.projectManager &&
                detailsData.status === '2' &&
                isAuth('project:ssxm:accept') &&
                detailsData.phase == '3'
              "
              >项目验收</el-button
            >
            <el-button
              type="success"
              class="segmentation"
              @click="updateDebriefing('已回款转售后')"
              v-if="
                detailsData.status === '3' &&
                loginUserId === detailsData.salesManager &&
                isAuth('project:ssxm:sales') &&
                detailsData.phase == '3'
              "
              >已回款转售后</el-button
            >
            <el-button
              type="warning"
              class="segmentation"
              @click="updateDebriefing('项目变更申请')"
              v-if="
                ((detailsData.status === '2' &&
                  (loginUserId === detailsData.projectManagerLeader ||
                    loginUserId === detailsData.salesManagerLeader ||
                    (loginUserId === detailsData.projectManager && checkAcceptDate()) ||
                    (loginUserId === detailsData.salesManager && checkPaymentDate()))) ||
                  (detailsData.status === '3' &&
                    (loginUserId === detailsData.salesManagerLeader ||
                      (loginUserId === detailsData.salesManager && checkPaymentDate())))) &&
                isAuth('project:ssxm:statuschange') &&
                detailsData.phase == '3'
              "
              >项目变更申请</el-button
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
    :width="title === '已回款转售后' ? '85%' : '50%'"
    :maxHeight="'auto'"
    :class="'Debriefing'"
    :title="title"
    :draggable="true"
  >
    <!-- 更新项目进展 -->
    <UpdateDebriefing
      v-if="title === '更新项目进展'"
      phase="3"
      :pid="detailsData.pid"
      @close-dialog-click="closePermissionDialog(false)"
    />
    <!-- 提出指示要求 -->
    <IndicativeContent
      v-if="title === '提出指示要求'"
      phase="3"
      :pid="detailsData.pid"
      @close-dialog-click="closePermissionDialog(false)"
    />
    <!-- 项目验收 -->
    <ProjectAccept
      v-if="title === '项目验收'"
      :pid="detailsData.pid"
      @close-dialog-click="closePermissionDialog(false)"
      @close-dialog-sure="closePermissionDialog(true)"
    />
    <!-- 已回款转售后 -->
    <EndTransferAfterSales
      v-if="title === '已回款转售后'"
      :detailsData="detailsData"
      @close-dialog-sure="resetClosePermissionDialog"
      @close-dialog-click="closePermissionDialog"
    />
    <!--项目变更申请-->
    <ProjectChange
      v-if="title === '项目变更申请'"
      :detailsData="detailsData"
      @close-dialog-click="closePermissionDialog(false)"
      @close-dialog-sure="closePermissionDialog(true)"
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

