<script setup lang="ts">
import { DrawerWrap } from '@/components/DrawerWrapDetailsSub'
import { ref, provide, watch } from 'vue'
import { ProjectFlow } from './flow'
import { Dialog } from '@/components/Dialog'
import {
  UpdateDebriefing,
  IndicativeContent,
  PersonChange,
  StateChange,
  EndProject,
  ProjectInfo,
  ConclusionInfo,
  IndicativeTable
} from './form'
import { Segmentation } from '@/components/Segmentation'
import moment from 'moment'
import { getScientificApi } from '@/api/project/scientific' //获取详情
import { useCache } from '@/hooks/web/useCache'
import { propTypes } from '@/utils/propTypes'
import FilePreview from '@/views/Components/FilePreview/FilePreview.vue'
import { findLastIndex } from '@/utils'
import { isAuth } from '@/utils/is' // 鉴权
import { useRoute, useRouter } from 'vue-router'
import NoData from '@/views/Components/NoData.vue'

const route = useRoute()
const router = useRouter()

defineOptions({
  name: 'DetailsForm'
})
const props = defineProps({
  title: propTypes.string.def('')
})
//缓存
const { wsCache } = useCache()
// 登录用户id
const loginUserId = ref<string>(wsCache.get('userInfo').userId)
const emit = defineEmits(['changeGetDetailAndList'])
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
const openDrawer = (flag: string, id: number) => {
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
  pageTite.value = props.title
  //重置
  detailsId.value = id
  isSave.value = flag === 'see' ? false : true
  drawerWrap.value.isShow = true
  if (id) {
    getDetailsData(id)
  }
}
// 项目进展/变更详情 表格数据
const tableData = ref<any>([])
// 详情数据
let detailsData = ref<any>({
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
//向子控件抛出详情
provide('detailsData', detailsData)

//结题数据
const conclusionData = ref<any>({
  auditDate: '',
  createByName: '',
  conclusionReason: '',
  summarize: '',
  remark: '',
  conclusionFilePath: ''
})
provide('conclusionData', conclusionData)
//获取详情
const getDetailsData = async (ids: number) => {
  detailsId.value = ids
  let params = {
    id: ids
  }
  const res = await getScientificApi(params)
  if (res && res.data) {
    detailsData.value = res.data
    tableData.value = []
    if (
      detailsData.value &&
      detailsData.value.pmProgressList &&
      detailsData.value.pmProgressList.length > 0
    ) {
      //获取进展和指示列表信息
      detailsData.value.pmProgressList.forEach((item: any) => {
        if (item.type === '1' || item.type === '2') {
          //进展列表信息
          tableData.value.push(item)
        }
      })
    }
    //获取结题信息
    if (detailsData.value.status === '6') {
      let auditLisData = res.data.pmAuditList
      let lastIndex = findLastIndex(
        auditLisData,
        (item: any) => item.flag === '1' && item.phase === '5' && item.type === '12'
      )
      if (lastIndex > -1) {
        conclusionData.value = {
          auditDate: auditLisData[lastIndex].auditDate,
          createByName: auditLisData[lastIndex].createByName,
          conclusionReason: auditLisData[lastIndex].conclusionReason,
          summarize: auditLisData[lastIndex].summarize,
          remark: auditLisData[lastIndex].remark,
          conclusionFilePath: auditLisData[lastIndex].conclusionFilePath
        }
      }
    } else {
      conclusionData.value = {
        auditDate: '',
        createByName: '',
        conclusionReason: '',
        summarize: '',
        remark: '',
        conclusionFilePath: ''
      }
    }
  }
}
// 是否显示弹窗
const dialogVisible = ref(false)
//弹窗
const ElDialogFef = ref()
//弹窗标题
const dialogTitle = ref('更新项目进展')
// 弹窗类功能
const updateDebriefing = (a: string) => {
  dialogTitle.value = a
  dialogVisible.value = true
  ElDialogFef.value.isFullscreen = false
}
//关闭弹窗并刷新详情
const closePermissionDialog = () => {
  dialogVisible.value = false
  getDetailsData(detailsId.value)
}
//关闭弹窗并刷新详情和列表
const resetClosePermissionDialog = () => {
  closePermissionDialog()
  emit('changeGetDetailAndList')
}
//文件预览弹窗
const previewFile = (fileName: string, path: string) => {
  FilePreviewRef.value.openDialog(fileName, path)
}
//文件预览
const FilePreviewRef = ref()
// 获取文件名称
const getFileName = (name: string | string[]) => {
  if (name && name.lastIndexOf('/') > -1) {
    return name.slice(name.lastIndexOf('/') + 1)
  } else {
    return ''
  }
}
//获取文件后缀
const fileNext = (path: any) => {
  let extension = ''
  if (path) {
    extension = path.substring(path.lastIndexOf('.') + 1)
  }
  return extension
}
//根据length截取字符串
const nameOverflow = (name: string, length: number) => {
  let nextName = ''
  if (name && name.length) {
    if (name.length > length) {
      nextName = name.slice(0, length) + '...'
    } else {
      nextName = name
    }
  } else {
    nextName = ''
  }
  return nextName
}

defineExpose({
  isShow,
  openDrawer
})
</script>

<template>
  <Dialog
    ref="ElDialogFef"
    v-model="dialogVisible"
    :modal="true"
    :width="'50%'"
    :maxHeight="'auto'"
    :class="'Debriefing'"
    :title="dialogTitle"
    :draggable="true"
    @closed="closePermissionDialog"
  >
    <!-- 更新项目进展 -->
    <UpdateDebriefing
      v-if="dialogTitle === '更新项目进展'"
      @close-dialog-click="closePermissionDialog"
    />
    <!-- 状态变更 -->
    <StateChange v-if="dialogTitle === '状态变更'" @close-dialog-click="closePermissionDialog" />
    <!-- 提出指示要求 -->
    <IndicativeContent
      v-if="dialogTitle === '提出指示要求'"
      @close-dialog-click="closePermissionDialog"
    />
    <!-- 申请结题 -->
    <EndProject
      v-if="dialogTitle === '申请结题'"
      @close-dialog-sure="resetClosePermissionDialog"
      @close-dialog-click="closePermissionDialog"
    />
    <!-- 销售经理变更 -->
    <PersonChange @close-dialog-click="closePermissionDialog" v-if="dialogTitle === '负责人变更'" />
  </Dialog>
  <DrawerWrap :title="pageTite" :isShow="isShow" ref="drawerWrap">
    <template #content>
      <!-- 流程 -->
      <ProjectFlow />
      <!-- 项目信息 -->
      <ProjectInfo />
      <!-- 项目进展变更详情 -->
      <Segmentation title="项目进展/变更详情" class="projectDebriefing">
        <template #button>
          <div v-if="detailsData.status !== '7' && detailsData.status !== '6'">
            <el-button
              type="primary"
              class="segmentation"
              @click="updateDebriefing('更新项目进展')"
              v-if="
                loginUserId === detailsData.principalPerson &&
                detailsData.status !== '1' &&
                detailsData.status !== '3' &&
                detailsData.status !== '4' &&
                detailsData.status !== '5' &&
                detailsData.status !== '8' &&
                isAuth('project:kyxm:updateprogress')
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
                detailsData.status !== '3' &&
                detailsData.status !== '4' &&
                detailsData.status !== '5' &&
                detailsData.status !== '8' &&
                isAuth('project:kyxm:indicative')
              "
              >提出指示要求</el-button
            >
            <el-button
              type="warning"
              @click="updateDebriefing('负责人变更')"
              class="segmentation"
              v-if="
                detailsData.status === '2' &&
                loginUserId === detailsData.principalPerson &&
                isAuth('project:kyxm:personchange')
              "
              >负责人变更</el-button
            >
            <el-button
              type="success"
              @click="updateDebriefing('状态变更')"
              class="segmentation"
              v-if="
                detailsData.status !== '1' &&
                detailsData.status !== '3' &&
                detailsData.status !== '4' &&
                detailsData.status !== '5' &&
                loginUserId === detailsData.principalPerson &&
                isAuth('project:kyxm:switchstate')
              "
              >状态变更</el-button
            >

            <el-button
              class="segmentation"
              type="danger"
              @click="updateDebriefing('申请结题')"
              v-if="
                detailsData.status === '2' &&
                loginUserId === detailsData.principalPerson &&
                isAuth('project:kyxm:end')
              "
              >申请结题</el-button
            >
          </div>
        </template>
        <template #content>
          <el-table :data="tableData" :border="true">
            <el-table-column prop="progressDate" label="日期" width="120" show-overflow-tooltip>
              <template #default="scope">
                <span> {{ moment(scope.row.progressDate).format('YYYY-MM-DD') || '--' }}</span>
              </template></el-table-column
            >
            <el-table-column prop="createByName" label="操作人" width="100" show-overflow-tooltip>
              <template #default="scope">
                <span> {{ scope.row.createByName || '--' }}</span>
              </template></el-table-column
            >
            <el-table-column prop="content" label="内容" show-overflow-tooltip>
              <template #default="scope">
                <span> {{ scope.row.content || '--' }}</span>
              </template></el-table-column
            >
            <el-table-column prop="filePath" label="文件柜">
              <template #default="scope">
                <el-tooltip
                  v-if="scope.row.filePath"
                  :content="getFileName(scope.row.filePath)"
                  placement="top"
                >
                  <span v-if="scope.row.filePath">
                    <ElLink
                      v-if="
                        fileNext(scope.row.filePath) === 'doc' ||
                        fileNext(scope.row.filePath) === 'zip' ||
                        fileNext(scope.row.filePath) === 'rar' ||
                        fileNext(scope.row.filePath) === 'xls'
                      "
                      :href="`${scope.row.filePath}`"
                      :underline="false"
                      target="_blank"
                    >
                      <p style="cursor: pointer; color: rgb(0, 160, 233)">
                        {{ nameOverflow(getFileName(scope.row.filePath), 30) }}</p
                      >
                    </ElLink>
                    <ElLink v-else :underline="false" target="_blank">
                      <p
                        style="cursor: pointer; color: rgb(0, 160, 233)"
                        @click="previewFile(getFileName(scope.row.filePath), scope.row.filePath)"
                      >
                        {{ nameOverflow(getFileName(scope.row.filePath), 30) }}</p
                      >
                    </ElLink>
                  </span>
                  <span v-else>--</span>
                </el-tooltip>
                <span v-else>--</span>
              </template></el-table-column
            >
            <el-table-column prop="remark" label="备注" show-overflow-tooltip>
              <template #default="scope">
                <span> {{ scope.row.remark || '--' }}</span>
              </template></el-table-column
            >
            <template #empty>
              <NoData   />
            </template>
          </el-table>
        </template>
        <!-- 更新项目进展  -->
      </Segmentation>
      <!-- 提出指示要求详情 -->
      <IndicativeTable />
      <!-- 结题信息 -->
      <ConclusionInfo v-if="detailsData.status === '6'" />
    </template>
  </DrawerWrap>
  <FilePreview title="预览" ref="FilePreviewRef" />
</template>

<style lang="less">
.name-p {
  font-family: 'Alibaba PuHuiTi R';
  color: #888888;
  font-size: 15px;
}
.name-p mr-2 {
  color: #888888;
  font-size: 15px;
}
.sub-title {
  font-family: 'Alibaba PuHuiTi R';
  font-size: 15px;
  color: #000000;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 3;
  overflow: hidden;
}
.top-row {
  // border-bottom: 1px solid rgba(217, 221, 231, 0.8);
  margin: 0 0px !important;
  padding: 15px 0 20px 0;

  p {
    font-size: 14px !important;
    line-height: 32px;
  }
}

@media screen and (min-width: 1366px) {
  .p-ellipsis-ky {
    width: 60%;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    text-align: left;
  }

  .p-ellipsis-ky-sub {
    width: 41%;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    text-align: left;
  }
}
@media screen and (min-width: 1400px) {
  .p-ellipsis-ky {
    width: 64%;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    text-align: left;
  }

  .p-ellipsis-ky-sub {
    width: 62%;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    text-align: left;
  }
}
</style>
