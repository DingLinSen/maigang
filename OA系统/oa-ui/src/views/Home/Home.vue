<template>
  <div class="v-content-wrap" :style="homeHeightStyle">
    <header class="flex">
      <SettingMenu />
    </header>
    <div class="news-wrap">
      <HomeTabs
        :height="(documentClientHeight - 132) * 0.48"
        :contentArray="contentArray"
        :labelArray="firstTitleArray"
        :tabValue="firstLabel"
        @item-click="noticeClick"
        @tabs-change="firstTabsChange"
      />

      <HomeTabs
        :height="(documentClientHeight - 132) * 0.48"
        :contentArray="contentArray"
        :isMore="isMore"
        :labelArray="secondTitleArray"
        :tabValue="secondLabel"
        class="item-class"
        @item-click="noticeClick"
        @tabs-change="secondTabsChange"
      />

      <HomeTabs
        :height="(documentClientHeight - 132) * 0.48"
        :contentArray="contentArray"
        :isMore="true"
        :labelArray="thirdTitleArray"
        :tabValue="thirdLabel"
        class="item-class"
        @item-click="noticeClick"
        @tabs-change="thirdTabsChange"
      />
    </div>
    <div class="news-wrap">
      <AttendanceStatistics ref="attendanceStatisticsRef" />
      <MeetingRoom ref="meetingRoomRef" class="item-class" />
      <CompanyJournal ref="companyJournalRef" class="item-class" @item-click="openPreviewFile" />
    </div>
    <div class="footer-class"> 山东麦港数据系统有限公司 版权所有 技术支持：研发中心 </div>
  </div>

  <LimitDailog routerName="" :showLimitButton="false" />

  <DetailsDialog
    ref="detailsDialogRef"
    :content="content"
    :title="title"
    :type="type"
    :url="fileUrl"
  />
  <FilePreview ref="FilePreviewRef" :title="fileName" title-align="center" :isWhite="true" />
  <BirthModel ref="birthModelRef" v-model="visible" />
  <ListDialog
    ref="listDialogRef"
    v-model="dialogVisible"
    :listDatas="listDatas"
    @show-announcement="showAnnounceDetail"
  />
  <HighGrowthDialog ref="highGrowthDialogRef" v-model="growthVisible" />
</template>

<script lang="ts" setup>
import getAssetsFile from '@/utils/pubUse'
import { useRouter } from 'vue-router'
import Socket from '@/socket/index'
import { computed, nextTick, onBeforeMount, onMounted, onUnmounted, ref, unref, watch } from 'vue'
import { useCache } from '@/hooks/web/useCache'
import { SettingMenu } from './setting'
import { HomeTabs } from './card'
import { DetailsDialog } from '@/views/Components/Details'
import FilePreview from '@/views/Components/FilePreview/FilePreview.vue'
import { AttendanceStatistics, MeetingRoom, CompanyJournal } from './bottom'
import { getAnnouncementOrInstitution } from '@/api/AdministrativeService/announcement'
import { getCompanyContentList } from '@/api/CulturaEmpresarial/news'
import { BirthModel } from '@/views/Components/BirthDay'
import { ListDialog, HighGrowthDialog } from './dialog'
import moment from 'moment'
import { getAccessWarmingInfoApi, updateWarmingReadApi } from '@/api/school/assess'
import { getUnreadProjectInfoApi, updateProjectInfoApi } from '@/api/project/notice'
import { getUnreadAssessInfoApi, updateAssessInfoApi } from '@/api/assessment/notice'
import { getPointRankHomeApi } from '@/api/point'
import {
  getUnreadInfoApi,
  updateReadFlagApi,
  getDetailAnnouncementOrInstitution
} from '@/api/AdministrativeService/announcement'
import { birthApi } from '@/api/person/personalFileManage'
import { useAppStore } from '@/store/modules/app'
import { useEmitt } from '@/hooks/web/useEmitt'
import { LimitDailog } from '@/views/Components/limit'
import { useWebSocketStore } from '@/store/modules/webSocket'

defineOptions({
  name: 'Home'
})

const PATH_URL = import.meta.env.VITE_WS_BASE_URL

const { wsCache } = useCache()

const store = useWebSocketStore()

const appStore = useAppStore()

// 视窗高度
const documentClientHeight = computed(() => appStore.getDocumentClientHeight)
useEmitt({
  name: 'window',
  callback: (type: string) => {
    if (type === 'resize') {
      restHomeHeight()
    }
  }
})
const homeHeight = ref(`${documentClientHeight.value - 132}px`)
const restHomeHeight = () => {
  homeHeight.value = `${documentClientHeight.value - 132}px`
}

const homeHeightStyle = computed(() => {
  return {
    height: unref(homeHeight)
  }
})
const timer = ref()

onMounted(() => {
  // growthVisible.value = true
  checkDailogData()
  // checkLeader()
  getPageSetting()
  getContentData()
})
//登录用户是否是领导
const isLeader = ref<boolean>(false)
//判断用户是否是领导
const basePath = import.meta.env.VITE_API_BASEPATH
const checkLeader = () => {
  isLeader.value = false
  let deptInfo =
    wsCache.get('userInfo') && wsCache.get('userInfo').dept ? wsCache.get('userInfo').dept : null
  if (deptInfo && deptInfo.deptId) {
    if (basePath == 'pro') {
      //部门是高管
      if (String(deptInfo.deptId) == '5') {
        isLeader.value = true
      } else {
        //角色是财务部经理、人力资源部经理、综合部负责人
        let rolesInfo = wsCache.get('userInfo').roles
        if (rolesInfo) {
          let roleStr = JSON.stringify(rolesInfo)
          if (
            roleStr.indexOf('174') > -1 ||
            roleStr.indexOf('157') > -1 ||
            roleStr.indexOf('164') > -1
          ) {
            isLeader.value = true
          }
        }
      }
    } else {
      //部门是高管
      if (String(deptInfo.deptId) == '239') {
        isLeader.value = true
      } else {
        //角色是财务部经理、人力资源部经理、综合部负责人
        let rolesInfo = wsCache.get('userInfo').roles
        if (rolesInfo) {
          let roleStr = JSON.stringify(rolesInfo)
          if (
            roleStr.indexOf('128') > -1 ||
            roleStr.indexOf('157') > -1 ||
            roleStr.indexOf('168') > -1
          ) {
            isLeader.value = true
          }
        }
      }
    }
  }
}

const getPageSetting = () => {
  if (isLeader.value) {
    firstLabel.value = 'todo'
    firstTitleArray.value = [{ name: '待办事宜', value: 'todo', unread: 9 }]
    isMore.value = false
    secondLabel.value = 'message'
    secondTitleArray.value = [{ name: '消息提醒', value: 'message', unread: 10 }]
    thirdLabel.value = 'notice'
    thirdTitleArray.value = [
      { name: '公告通知', value: 'notice' },
      { name: '新闻动态', value: 'news' }
    ]
  } else {
    firstLabel.value = 'message'
    firstTitleArray.value = [
      { name: '消息提醒', value: 'message', unread: 10 },
      { name: '待办事宜', value: 'todo', unread: 9 }
    ]
    isMore.value = true
    secondLabel.value = 'notice'
    secondTitleArray.value = [{ name: '公告通知', value: 'notice' }]
    thirdLabel.value = 'news'
    thirdTitleArray.value = [
      { name: '新闻动态', value: 'news' },
      { name: '积分排行', value: 'rank' }
    ]
  }
}
const contentArray = ref<any>({
  message: [],
  todo: [],
  notice: [],
  news: [],
  rank: {}
})
//第一个消息卡片
const firstLabel = ref<string>('message')
const firstTitleArray = ref<any>([])

const firstTabsChange = (value: string) => {
  firstLabel.value = value
}

//第二个消息卡片
const isMore = ref<boolean>(true)
const secondLabel = ref<string>('notice')
const secondTitleArray = ref<any>([])

const secondTabsChange = (value: string) => {
  secondLabel.value = value
}
//第三个消息卡片
const thirdLabel = ref<string>('news')
const thirdTitleArray = ref<any>([])

const thirdTabsChange = (value: string) => {
  thirdLabel.value = value
}

//
const detailsDialogRef = ref()
const title = ref<string>('')
const content = ref<string>('')
const type = ref<string>('')
const fileUrl = ref<string>('')
const noticeClick = (flag: string, item: any) => {
  title.value = item.title
  fileUrl.value = item.filePath
  content.value = item.content ? item.content : ''
  detailsDialogRef.value.openDrawer()
}

// 预览弹窗
const fileName = ref<string>('公司期刊')
const openPreviewFile = (row: any) => {
  fileName.value = row.title
  previewFile(row.title + '.' + fileNext(row.filePath), row.filePath)
}
const previewFile = (fileName: string, path: string) => {
  FilePreviewRef.value.openDialog(fileName, path)
}
const fileNext = (path: any) => {
  let extension = ''
  if (path) {
    extension = path.substring(path.lastIndexOf('.') + 1)
  }
  return extension
}
const FilePreviewRef = ref()

const noticeArray = ref<any>([])
const newsArray = ref<any>([])
//获取通知公告
const getCompanyNoticeData = async () => {
  let params = {
    pageNum: 1,
    pageSize: 5,
    pageType: 'a',
    status: '1'
  }
  const res = await getAnnouncementOrInstitution(params)
  nextTick()
  noticeArray.value = []
  if (res && res.rows) {
    contentArray.value.notice = res.rows
  } else {
    contentArray.value.notice = []
  }
}

const getContentData = () => {
  getCompanyNoticeData()
  getCompanyNewsData()
  getPointRank()
}

const getPointRank = async () => {
  const res = await getPointRankHomeApi()
  nextTick()
  if (res && res.data) {
    contentArray.value.rank = res.data
  } else {
    contentArray.value.rank = {}
  }
}

//获取公司新闻
const getCompanyNewsData = async () => {
  let params = {
    pageNum: 1,
    pageSize: 5,
    aduStatus: '1'
  }
  const res = await getCompanyContentList(params)
  nextTick()
  if (res && res.rows) {
    contentArray.value.news = res.rows
  } else {
    contentArray.value.news = []
  }
}

const getTodoData = async () => {
  contentArray.value.todo = []
}

const getMessageData = async () => {
  contentArray.value.message = []
}

//生日弹窗
const visible = ref<boolean>(false)

//获取未读的消息
const checkDailogData = () => {
  //是否是登陆进来的
  if (wsCache.get('isTip')) {
    wsCache.set('isTip', false)
    getReadInfoList()
  }
}
const dialogVisible = ref<boolean>(false)
const listDatas = ref<any>([])
const checkBirth = () => {
  //生日提醒
  birthApi().then((res) => {
    if (res && res.data) {
      if (res.data.remindFlag == 1) {
        nextTick()
        visible.value = true
      }
    }
  })
}

const getReadInfoList = async () => {
  listDatas.value = []

  //课程考核的数据
  const assessData = await getAccessWarmingInfoApi()
  //公告制度
  const systemData = await getUnreadInfoApi()
  //项目管理
  const projectData = await getUnreadProjectInfoApi()
  //月度考核
  const assessRes = await getUnreadAssessInfoApi()
  if (assessData && assessData.data && assessData.data.list) {
    assessData.data.list.forEach((element: any) => {
      element.flag = 0
      listDatas.value.push(element)
    })
  }

  if (systemData && systemData.data && systemData.data.list) {
    systemData.data.list.forEach((element: any) => {
      element.flag = 0
      listDatas.value.push(element)
    })
  }

  if (projectData && projectData.data) {
    projectData.data.forEach((element: any) => {
      element.flag = 0
      element.type = 'd'
      listDatas.value.push(element)
    })
  }
  listDatas.value.sort((a: any, b: any) => b.editTime.localeCompare(a.editTime))

  if (assessRes && assessRes.data) {
    assessRes.data.forEach((element: any) => {
      element.flag = 0
      element.type = 'e'
      listDatas.value.unshift(element)
    })
  }
  if (listDatas.value.length === 1) {
    // 若只有一条 直接弹出
    showAnnounceDetail(listDatas.value[0])
  } else if (listDatas.value.length > 1) {
    // 若多条未读 则弹出列表
    dialogVisible.value = true
  }
  checkBirth()
}

const showAnnounceDetail = async (item: any) => {
  // 查询详情展示
  title.value = ''
  fileUrl.value = ''
  content.value = ''
  // 查看公告制度通知
  if (item.type == 'a' || item.type == 'b') {
    let params = {
      id: item.id
    }
    await updateReadFlagApi(params)
    const res = await getDetailAnnouncementOrInstitution(params)
    if (res && res.data) {
      if (res.data.pageType == 'a') {
        title.value = res.data.title // 标题
        content.value = res.data.content // 描述
        fileUrl.value = res.data.filePath ? res.data.filePath : '' // 附件路径
        detailsDialogRef.value.openDrawer()
      } else {
        fileName.value = res.data.title
        previewFile(res.data.title + '.' + fileNext(res.data.filePath), res.data.filePath)
      }
    }
  } else if (item.type == 'c') {
    // 课程考核的数据
    let params = {
      id: item.id
    }
    await updateWarmingReadApi(params)
  } else if (item.type == 'd') {
    // 项目管理的数据
    await updateProjectInfoApi(item.id)
    title.value = item.title // 标题
    content.value = item.content // 描述
    fileUrl.value = '' // 附件路径
    detailsDialogRef.value.openDrawer()
  } else if (item.type == 'e') {
    // 查看月度考核通知
    await updateAssessInfoApi(item.id)
    title.value = item.title // 标题
    content.value = item.content // 描述
    fileUrl.value = '' // 附件路径
    detailsDialogRef.value.openDrawer()
  }
}

//高成长
const growthVisible = ref<boolean>(false)

const messageArray = computed(() => store.getWebSocketData)

watch(
  () => messageArray.value,
  (val: any) => {
    if (val) {
      contentArray.value.message = []
      contentArray.value.todo = []
      messageArray.value.forEach((element: any) => {
        if (element.flag == '1') {
          contentArray.value.message.push(element)
          contentArray.value.message = contentArray.value.message.reverse()
        } else {
          contentArray.value.todo.push(element)
          contentArray.value.todo = contentArray.value.todo.reverse()
        }
      })
    }
  },
  { deep: true, immediate: true }
)
</script>
<style lang="less">
.text {
  font-size: 0.0833rem;
}
</style>
<style lang="less" scoped>
.news-wrap {
  margin-top: 1.6em;
  display: flex;
  .item-class {
    margin-left: 0.8%;
  }
}
.v-content-wrap {
}
:deep(.limit-button-class) {
  bottom: -20px !important;
}
.footer-class {
  padding: 1vh;
  font-size: 14px;
  font-family: Alibaba PuHuiTi R;
  width: 100%;
  text-align: center;
  color: #666666;
}
@media screen and (min-width: 1920px) {
  .bottom_moudle {
    height: 38%;
  }
  .top_moudle {
    height: 48%;
  }
  .header_moudle {
    height: 12%;
  }
}

@media (min-width: 1536px) and (max-width: 1919px) {
  .bottom_moudle {
    height: 44%;
  }
  .top_moudle {
    height: 45%;
  }
  .header_moudle {
    height: 10%;
  }
}

@media screen and (min-width: 1436px) and (max-width: 1535px) {
  .bottom_moudle {
    height: 44%;
  }
  .top_moudle {
    height: 300px;
  }
  .header_moudle {
    height: 9%;
  }
}

@media screen and (max-width: 1435px) {
  .bottom_moudle {
    height: 44%;
  }
  .top_moudle {
    //  height: auto;
  }
  .header_moudle {
    height: 12%;
  }
}
</style>
