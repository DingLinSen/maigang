<!-- 课堂详情 -->
<template>
  <div class="w-full">
    <!--      视频    -->
    <div class="assessmentStatistics flex">
      <div class="assessmentStatistics_left mr-[1%] 2xl:w-[36%] w-[30%]">
        <div class="mb-15px">
          <MyselfInfo
            :detailsData="detailsData"
            :infoUserName="infoUserName"
            :infoDept="infoDept"
          />
        </div>
        <div class="mb-15px">
          <AttendStatis
            ref="attendStatisRef"
            :minWidth="isAuth('keepAttend:details:dept')"
            :userId="params.userId"
            @getDetail="getDetail"
            @getWorkOrderDetail="getWorkOrderDetail"
            @date-change="calendarDateChange"
          />
        </div>
        <ApplyFor />
      </div>
      <div class="assessmentStatistics_right 2xl:w-[63%] w-[69%]">
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
  </div>
</template>
<script setup lang="ts">
import AttendanceStatisticsForm from './attendanceStatisticsForm.vue'
import WorkOrderForm from './workOrderForm.vue'
import DetailedStatistics from './detailedStatistics.vue'
import { isAuth } from '@/utils/is' // 鉴权
import { useCache } from '@/hooks/web/useCache'

import { ref, provide, nextTick } from 'vue'
import { MyselfInfo, AttendStatis, AttendCalendar, ApplyFor } from '../module'
import { getDetailsApi } from '@/api/assessment/statistics'
import moment from 'moment'

const { wsCache } = useCache()
const userInfo = ref()
const detailedStatisticsRef = ref()
const attendanceStatisticsFormRef = ref()
const workOrderFormRef = ref()
const attendCalendarRef = ref()
const infoUserName = ref()
const infoDept = ref()
const detailsData = ref()
const params = ref({
  userId: '',
  clockinMonth: '',
  clockinYear: ''
})

const detailsInit = async (param) => {
  let res = await getDetailsApi(param)
  if (res && res.data) {
    console.log(res.data)
    detailsData.value = res.data
  }
}

const getDetail = (data) => {
  nextTick(() => {
    attendanceStatisticsFormRef.value.openDrawer(data)
  })
}

// 工单模块
const getWorkOrderDetail = (data) => {
  nextTick(() => {
    workOrderFormRef.value.openDrawer(data)
  })
}

// 考勤详细统计
const handle = (data) => {
  nextTick(() => {
    detailedStatisticsRef.value.openDrawer(data)
  })
}

provide('detailsData', detailsData)

const TreeClick = (id?, label?, dept?) => {
  nextTick(() => {
    infoDept.value = dept ? dept : userInfo.value.infoDept
    infoUserName.value = label ? label : userInfo.value.infoUserName
    params.value.userId = id ? id : userInfo.value.userId
    attendCalendarRef.value.calenderInit(null, params.value.userId)
    detailsInit(params.value)
  })
}

const init = () => {
  params.value = {
    userId: wsCache.get('userInfo').userId,
    clockinMonth: moment(new Date()).format('M'),
    clockinYear: moment(new Date()).format('YYYY')
  }
  userInfo.value = {
    userId: wsCache.get('userInfo').userId,
    infoUserName: wsCache.get('userInfo').nickName,
    infoDept: wsCache.get('userInfo').dept.deptName
  }
  infoDept.value = userInfo.value.infoDept
  infoUserName.value = userInfo.value.infoUserName
  detailsInit(params.value)
  // TreeClick()
}

init()

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
