<template>
  <BottomCard title="考勤统计" @moreClick="more">
    <template #content>
      <div class="attendance-wrap-class">
        <img class="kq-img-class" src="@/assets/imgs/home/kq_bg.png" />
        <div class="top-div-class">
          <span class="flex time-text-class">
            <img class="time-img-class" src="@/assets/imgs/home/time_icon.png" />{{ time }}
          </span>
          <span style="margin: auto"></span>
          <div class="flex">
            <span class="text-class">实际出勤 </span>
            <span class="attendance-day-class"> {{ AttendanceData.realDays }}</span>
            <span class="attendance-day-text-class">天 </span>
          </div>
        </div>
        <div class="clock-in-wrap-class">
          <el-row class="w-full">
            <el-col :span="12">
              <div class="flex ml-[0.94em] clock-in-t">
                <span class="clock-in-text-class">上班打卡</span>
                <div v-if="startTime" class="clock-in-time-class">
                  <img class="clock-in-img-class" src="@/assets/imgs/home/qx_icon.png" />
                  <span class="ml-[3px]">已打卡{{ startTime }} </span>
                </div>
                <div v-else class="clock-in-time-class-not"> 未打卡 </div>
              </div>
            </el-col>
            <el-col :span="12">
              <div class="flex ml-[0.94em] clock-in-t">
                <span class="clock-in-text-class">下班打卡</span>
                <div v-if="endTime" class="clock-in-time-class">
                  <img class="clock-in-img-class" src="@/assets/imgs/home/qx_icon.png" />
                  <span class="ml-[3px]">已打卡{{ endTime }} </span>
                </div>
                <div v-else class="clock-in-time-class-not"> 未打卡 </div>
              </div>
            </el-col>
          </el-row>
        </div>

        <div class="leave-wrap-class">
          <el-row class="w-full ml-[1vw] mr-[1vw] -mt-3px 2xl:mt-0">
            <el-col :span="6">
              <div class="grid">
                <span class="leave-title-class">迟到 </span>
                <div class="center-class">
                  <span class="leave-number-class"> {{ AttendanceData.late }}</span>
                  <span class="leave-unit-class">次 </span>
                </div>
              </div>
            </el-col>
            <el-col :span="6">
              <div class="grid">
                <span class="leave-title-class">早退 </span>
                <div class="center-class">
                  <span class="leave-number-class"> {{ AttendanceData.premature }}</span>
                  <span class="leave-unit-class">次 </span>
                </div>
              </div>
            </el-col>
            <el-col :span="6">
              <div class="grid">
                <span class="leave-title-class">旷工 </span>
                <div class="center-class">
                  <span class="leave-number-class"> {{ AttendanceData.absenteeism }}</span>
                  <span class="leave-unit-class">次 </span>
                </div>
              </div>
            </el-col>
            <el-col :span="6">
              <div class="grid">
                <span class="leave-title-class">请假 </span>
                <div class="center-class">
                  <span class="leave-number-class"> {{ AttendanceData.leave }}</span>
                  <span class="leave-unit-class">次 </span>
                </div>
              </div>
            </el-col>
          </el-row>
        </div>
      </div>
    </template>
  </BottomCard>
</template>
<script lang="ts" setup>
import moment from 'moment'
import { onBeforeUnmount, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { BottomCard } from './components'
import { getDetailsApi, getAllAttApi } from '@/api/assessment/statistics'
import { useCache } from '@/hooks/web/useCache'
import { useEmitt } from '@/hooks/web/useEmitt'

const { wsCache } = useCache()

const AttendanceData = ref({}) // 存放考勤的数据
const ClockData = ref<any>([]) // 存放打卡时间的数据
const startTime = ref()
const endTime = ref()
// 获取考勤统计
const getAttendance = async () => {
  await getDetailsApi({
    userId: wsCache.get('userInfo').userId,
    clockinMonth: moment(new Date()).format('M'),
    clockinYear: moment(new Date()).format('YYYY')
  }).then((res) => {
    AttendanceData.value = res.data
  })
}
// 获取打卡时间
const getClockTime = async () => {
  await getAllAttApi({
    userId: wsCache.get('userInfo').userId,
    clockinMonth: moment(new Date()).format('M'),
    clockinYear: moment(new Date()).format('YYYY')
  }).then((res) => {
    res.data.map((item) => {
      if (item.clockinDate == moment(new Date()).format('YYYY-MM-DD')) {
        ClockData.value = item
      }
    })
    // startTime.value = '08:43'
    startTime.value = ClockData.value.attenceClockinTime
      ? moment(ClockData.value.attenceClockinTime).format('HH:mm')
      : ''
    endTime.value = ClockData.value.attenceClockoutTime
      ? moment(ClockData.value.attenceClockoutTime).format('HH:mm')
      : ''
  })
}
getClockTime()
getAttendance()
const { push } = useRouter()
const time = ref()
// 获取当前时间
const getTime = () => {
  time.value = moment(new Date()).format('YYYY年M月D日 HH:mm:ss')
}
var timer: any = null
onMounted(() => {
  timer = setInterval(() => {
    //设置定时器
    getTime() //自定义事件
  }, 1000)
})
onBeforeUnmount(() => {
  clearInterval(timer) //清除定时器
  timer = null
})

const more = () => {
  push({ name: 'AssessmentStatistics' })
}
</script>

<style lang="less" scoped>
.attendance-wrap-class {
  width: 100%;
  height: 100%;
  position: relative;
  background: linear-gradient(180deg, #f5fbfe 0%, #def1fd 100%);
}

.kq-img-class {
  position: absolute;
  bottom: 0px;
  left: 0px;
  height: 11.31em;
}

.top-div-class {
  width: 100%;
  display: flex;
  position: absolute;
  margin-top: 20px;
  padding-left: 20px;
  padding-right: 20px;
}

.time-img-class {
  width: 14px;
  height: 14px;
  margin-top: 3px;
  margin-right: 6px;
}

.time-text-class {
  font-size: 15px;
  font-family: Alibaba PuHuiTi R;
  font-weight: 400;
  color: #444444;
}

.text-class {
  font-size: 15px;
  font-family: Alibaba PuHuiTi R;
  font-weight: 400;
  color: #444444;
}

.attendance-day-class {
  font-size: 20px;
  margin-left: 4px;
  margin-top: -5px;
  font-family: Alibaba PuHuiTi M;
  font-weight: 500;
  color: #00a0e9;
}

.attendance-day-text-class {
  font-size: 15px;
  font-family: Alibaba PuHuiTi R;
  font-weight: 400;
  color: #00a0e9;
}

.clock-in-wrap-class {
  max-width: 88%;
  width: 25.73em;
  height: 3.13em;
  background: #ffffff;
  opacity: 0.8;
  display: flex;
  position: absolute;
  top: 5.13em;
  right: 26px;
  border-radius: 4px;
}

.leave-wrap-class {
  max-width: 88%;
  width: 25.73em;
  height: 5em;
  background: #ffffff;
  opacity: 0.8;
  display: flex;
  position: absolute;
  top: 9em;
  right: 26px;
  border-radius: 4px;
}

.clock-in-text-class {
  font-size: 14px;
  height: 3.13em;
  line-height: 3.13em;
  font-family: Alibaba PuHuiTi M;
  font-weight: 500;
  color: #444444;
}

.clock-in-time-class {
  display: flex;
  font-size: 14px;
  font-family: Alibaba PuHuiTi M;
  font-weight: 500;
  height: 3.13em;
  line-height: 3.13em;
  color: #00a0e9;
}

.clock-in-time-class-not {
  display: flex;
  font-size: 14px;
  font-family: Alibaba PuHuiTi M;
  font-weight: 500;
  height: 3.13em;
  line-height: 3.13em;
  margin-left: 5px;
  color: #999999;
  //color: #00a0e9;
}

.clock-in-img-class {
  width: 1em;
  height: 1em;
  margin-top: 1.06em;
  margin-left: 3px;
}

.leave-title-class {
  text-align: center;
  margin-top: 1.1em;
  font-size: 14px;
  font-family: Alibaba PuHuiTi M;
  font-weight: 500;
  color: #444444;
}

.leave-number-class {
  font-size: 16px;
  font-family: Alibaba PuHuiTi M;
  font-weight: 500;
  color: #00a0e9;
}

.leave-unit-class {
  font-size: 13px;
  font-family: Alibaba PuHuiTi M;
  font-weight: 500;
  color: #00a0e9;
  margin-top: 0.22em;
}

.center-class {
  display: flex;
  justify-content: center;
}

// @media screen and (max-width: 1536px) {
//   .time-text-class,
//   .text-class,
//   .attendance-day-text-class {
//     font-size: 13px;
//   }
//   .attendance-day-class {
//     font-size: 18px;
//   }
//   .clock-in-wrap-class {
//     height: 60px;
//     top: 55px;
//     right: 20px;

//     .clock-in-text-class {
//       color: #444 !important;
//       margin-top: 8px;
//       font-size: 14px !important;
//     }
//     .clock-in-t {
//       display: flex;
//       flex-direction: column;
//       justify-content: center;
//     }
//     .clock-in-time-class {
//       margin-top: -13px;
//       margin-left: -2px;
//     }
//     .clock-in-time-class-not {
//       margin-top: -13px;
//       margin-left: 0;
//     }
//   }
//   .leave-wrap-class {
//     height: 60px;
//     top: 125px;
//     right: 20px;
//     .leave-title-class {
//       margin-top: 17px;
//     }
//     .grid {
//       line-height: 16px;
//       .leave-number-class {
//         font-size: 16px;
//         line-height: 20px;
//       }
//     }
//   }
// }
</style>
