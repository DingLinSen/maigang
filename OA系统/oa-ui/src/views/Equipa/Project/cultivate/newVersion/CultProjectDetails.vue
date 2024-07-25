<!-- 培育项目详情 -->
<script setup lang="ts">
import { DrawerWrap } from '@/components/DrawerWrapDetailsSub'
import { computed, ref } from 'vue'
import { getCultivateApi } from '@/api/project/cultivate' // 获取信息
import { ProjectFlow, IndicativeTable, IndicativeContent, UpdateDebriefing } from '../../components'
import { ProjectInfo, EndToNextPhase, TerminationProject } from '../newVersion'
import { isAuth } from '@/utils/is'
import { useCache } from '@/hooks/web/useCache'
import { Dialog } from '@/components/Dialog'
import { getCityApi, getProvinceApi } from '@/api/person/induction'

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
const openDrawer = async (id: number) => {
  //重置
  resetDetail()
  detailsId.value = id
  drawerWrap.value.isShow = true
  await getProvinceData()
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
  status: '',
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
  principalPerson: '',
  principalPersonLeaderName: ''
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
    status: '',
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
    principalPerson: '',
    principalPersonLeaderName: '',
    leaders: []
  }
}

const provinceData = ref<any>([])
const getProvinceData = async () => {
  let res = await getProvinceApi()
  if (res) {
    provinceData.value = res.data
  }
}
const pageLoading = ref<boolean>(false)
//获取详情
const getDetailsData = async (ids: number) => {
  pageLoading.value = true
  let params = {
    id: ids
  }
  const res = await getCultivateApi(params).finally(() => {
    setTimeout(() => {
      pageLoading.value = false
    }, 200)
  })
  if (res && res.data) {
    detailsData.value = res.data
    detailsData.value.address = res.data.address
    detailsData.value.fileList = res.data.filePath
    if (detailsData.value.customerId) {
      getLocation(detailsData.value.province, detailsData.value.city)
    }
  }
}

const getLocation = (province: string, city: string) => {
  let id = ''
  provinceData.value.find((item: any) => {
    if (item.code == province) {
      id = item.id
      detailsData.value.location = item.province
    }
  })
  if (city) {
    if (id) {
      getCityApi(id).then((res: any) => {
        res.data.forEach((element: any) => {
          if (element.code == city) {
            detailsData.value.location = detailsData.value.location + '/' + element.city
          }
        })
      })
    }
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
//弹窗内容高度
const dialogHeight = ref('60vh')

const dialogStyle = computed(() => {
  return {
    height: dialogHeight.value
  }
})

//全屏
const toggleFull = (isFull: boolean) => {
  if (isFull) {
    dialogHeight.value = '100%'
  } else {
    dialogHeight.value = '60vh'
  }
}

//弹窗关闭
const closePermissionDialog = (isRefreshTable: boolean) => {
  dialogVisible.value = false
  ElDialogFef.value.isFullscreen = false
  getDetailsData(detailsId.value)
  dialogHeight.value = '60vh'
  if (isRefreshTable) {
    emit('resetTable')
  }
}

const resetClosePermissionDialog = () => {
  dialogVisible.value = false
  ElDialogFef.value.isFullscreen = false
  dialogHeight.value = '60vh'
  emit('resetTable')
  drawerWrap.value.isShow = false
}
const closeDrawer = () =>{
  pageLoading.value = false
}

defineExpose({
  isShow,
  openDrawer
})
</script>

<template>
  <DrawerWrap title="培育详情" :isShow="isShow" ref="drawerWrap" @close-drawer="closeDrawer">
    <template #content>
      <!-- <div v-loading="pageLoading"> -->
        <!-- 流程 -->
        <ProjectFlow :detailsData="detailsData" phase="1" />

        <!-- 项目信息 -->
        <ProjectInfo :detailsData="detailsData" />

        <!-- 项目进展/变更详情 -->
        <IndicativeTable tableFlag="1" :pmProgressList="detailsData.pmProgressList">
          <template #button>
            <div>
              <el-button
                type="primary"
                class="segmentation"
                v-if="
                  Number(detailsData.status) > 0 &&
                  Number(detailsData.status) < 5 &&
                  loginUserId === detailsData.principalPerson &&
                  isAuth('project:cultivate:evolve') &&
                  detailsData.status != '2' &&
                  detailsData.phase == '1'
                "
                @click="updateDebriefing('更新项目进展')"
                >更新项目进展</el-button
              >
              <el-button
                type="primary"
                class="segmentation"
                v-if="
                  Number(detailsData.status) < 5 &&
                  detailsData.status !== '0' &&
                  detailsData.status !== '4' &&
                  detailsData.leaders.includes(loginUserId) &&
                  isAuth('project:cultivate:indicative') &&
                  detailsData.status != '2' &&
                  detailsData.phase == '1'
                "
                @click="updateDebriefing('提出指示要求')"
                >提出指示要求</el-button
              >
              <el-button
                type="success"
                class="segmentation"
                v-if="
                  Number(detailsData.status) < 2 &&
                  detailsData.status !== '0' &&
                  detailsData.status !== '4' &&
                  loginUserId === detailsData.principalPerson &&
                  isAuth('project:cultivate:putintoeffect') &&
                  detailsData.status != '2' &&
                  detailsData.phase == '1'
                "
                @click="updateDebriefing('申请项目转立项')"
                >申请结束转立项</el-button
              >
              <el-button
                type="danger"
                class="segmentation"
                v-if="
                  Number(detailsData.status) < 5 &&
                  detailsData.status !== '0' &&
                  detailsData.status !== '4' &&
                  (loginUserId === detailsData.principalPerson ||
                    detailsData.leaders.includes(loginUserId)) &&
                  isAuth('project:cultivate:end') &&
                  detailsData.status != '2' &&
                  detailsData.phase == '1'
                "
                v-hasPermi="'project:cultivate:end'"
                @click="updateDebriefing('申请项目终止')"
                >申请项目终止</el-button
              >
            </div>
          </template>
        </IndicativeTable>
        <!-- 提出指示要求详情 -->
        <IndicativeTable tableFlag="2" :pmProgressList="detailsData.pmProgressList" />
      <!-- </div> -->
    </template>
  </DrawerWrap>

  <Dialog
    ref="ElDialogFef"
    v-model="dialogVisible"
    :modal="true"
    :width="title === '申请项目转立项' || title === '申请结束转实施' ? '85%' : '50%'"
    :maxHeight="'auto'"
    :class="'Debriefing'"
    :title="title"
    :draggable="true"
    @toggle-full="toggleFull"
  >
    <!-- 更新项目进展 -->
    <UpdateDebriefing
      v-if="title === '更新项目进展'"
      phase="1"
      :pid="detailsData.id"
      @close-dialog-click="closePermissionDialog(false)"
    />
    <!-- 提出指示要求 -->
    <IndicativeContent
      v-if="title === '提出指示要求'"
      phase="1"
      :pid="detailsData.id"
      @close-dialog-click="closePermissionDialog(false)"
    />
    <!-- 申请项目转立项 -->
    <EndToNextPhase
      v-if="title === '申请项目转立项'"
      :style="dialogStyle"
      :detailsData="detailsData"
      @close-dialog-click="resetClosePermissionDialog"
    />
    <!-- 申请项目终止 -->
    <TerminationProject
      v-if="title === '申请项目终止'"
      :id="detailsData.id"
      @close-dialog-click="closePermissionDialog(true)"
    />
  </Dialog>
</template>

