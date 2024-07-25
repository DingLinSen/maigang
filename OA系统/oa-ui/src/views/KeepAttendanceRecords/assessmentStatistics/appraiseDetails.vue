<!-- 考勤详情 -->
<template>
  <DrawerWrap title="考勤详情" :isShow="isShow" ref="drawerWrap" class="appraiseDetailsWrap">
    <template #content>
      <div class="assessmentStatistics flex">
        <div class="pb-10px w-[17%]" v-if="isAuth('keepAttend:details:dept')">
          <AttendTree @TreeClick="TreeClick" />
        </div>
        <div
          class="assessmentStatistics_left mr-[0.73vw]"
          :class="isAuth('keepAttend:details:dept') ? 'w-[21%]' : 'w-[21%]'"
        >
          <MyselfInfo
            :minWidth="isAuth('keepAttend:details:dept')"
            :detailsData="detailsData"
            :infoUserName="infoUserName"
            :infoDept="infoDept"
          />
          <AttendStatis
            ref="attendStatisRef"
            :minWidth="isAuth('keepAttend:details:dept')"
            :userId="params.userId"
            @date-change="calendarDateChange"
            @getDetail="getDetail"
            @getWorkOrderDetail="getWorkOrderDetail"
          />
          <!-- <ApplyFor v-if="!isAuth('keepAttend:details:dept')" /> -->
        </div>
        <div class="assessmentStatistics_right w-[62%]">
          <AttendCalendar
            ref="attendCalendarRef"
            :userId="params.userId"
            :minWidth="isAuth('keepAttend:details:dept')"
            @handle="handle"
            @date-change="dateChange"
          />
        </div>
      </div>
      <AttendanceStatisticsForm ref="attendanceStatisticsFormRef" />
      <WorkOrderForm ref="workOrderFormRef" />
      <DetailedStatistics ref="detailedStatisticsRef" />
    </template>
  </DrawerWrap>
</template>
<script setup lang="ts">
import { DrawerWrap } from '@/components/DrawerWrapDetails'
import AttendanceStatisticsForm from './attendanceStatisticsForm.vue'
import WorkOrderForm from './workOrderForm.vue'
import DetailedStatistics from './detailedStatistics.vue'
import { isAuth } from '@/utils/is' // 鉴权

import { ref, provide, nextTick } from 'vue'
import { MyselfInfo, AttendStatis, AttendCalendar, AttendTree } from '../module'
import { getDetailsApi } from '@/api/assessment/statistics'

const userInfo = ref()
const detailedStatisticsRef = ref()
const attendanceStatisticsFormRef = ref()
const workOrderFormRef = ref()
const isShow = ref(false)
const attendCalendarRef = ref()
const infoUserName = ref()
const detailsData = ref()
const params = ref({
  userId: '',
  clockinMonth: '',
  clockinYear: ''
})
const infoDept = ref()
//打开drawer并初始化
const drawerWrap = ref()
const openDrawer = (data, name, deptName) => {
  drawerWrap.value.isShow = true
  params.value = data
  infoDept.value = deptName
  infoUserName.value = name
  userInfo.value = {
    userId: data.userId,
    infoUserName: name,
    infoDept: deptName
  }

  // detailsInit(data)
  TreeClick()
}

const detailsInit = async (param) => {
  let res = await getDetailsApi(param)
  if (res && res.data) {
    detailsData.value = res.data
  }
}

const getDetail = (data) => {
  attendanceStatisticsFormRef.value.openDrawer(data)
}

// 工单模块
const getWorkOrderDetail = (data) => {
  workOrderFormRef.value.openDrawer(data)
}

// 考勤详细统计
const handle = (data) => {
  detailedStatisticsRef.value.openDrawer(data)
}

provide('detailsData', detailsData)
provide('timer', params)

const TreeClick = (id?, label?, dept?) => {
  nextTick(() => {
    infoUserName.value = label ? label : userInfo.value.infoUserName
    infoDept.value = dept ? dept : userInfo.value.infoDept
    params.value.userId = id ? id : userInfo.value.userId
    attendCalendarRef.value.calenderInit(null, params.value.userId)
    detailsInit(params.value)
  })
}

const attendStatisRef = ref()
const dateChange = (date: any) => {
  if (attendStatisRef.value) {
    attendStatisRef.value.unifiedTime(date)
  }
}

const calendarDateChange = (date: any) => {
  if (attendCalendarRef.value) {
    attendCalendarRef.value.unifiedTime(date)
  }
}

defineExpose({
  openDrawer
})
</script>
<style lang="less" scoped>
:deep(.el-card__body) {
  padding: 0 !important;
}

:deep(.el-dialog__header) {
  width: 100% !important;
}

.video_details {
  position: relative;
  background-color: #ffffff;
}

.details_title {
  color: #222222;
}

.lecturer {
  margin: 17px 0 22px 0;
}
</style>

<style lang="less">
#treeContentWarp {
  .el-card__body {
    padding: 18px 20px 0 !important;
    background: #fff !important;
  }
}
</style>
