<template>
  <BottomCard title="会议室预约" @more-click="more">
    <template #content>
      <div class="meeting-wrap-class">
        <div class="top-div-class">
          <span class="flex today-text-class"> {{ today }} 今天 </span>
          <span class="return-today-class" @click="returnToday"> 回到今日</span>
          <span style="margin: auto"></span>
          <span class="meeting-room-appointment" @click="reservation">去预约 </span>
        </div>
        <div class="calendar-wrap-class 2xl:h-[54px] h-[45px] overflow-hidden">
          <Icon
            :size="18"
            class="2xl:next-week-wrap next-week-wrap-min"
            icon="ep:arrow-left-bold"
            @click="lastWeek"
          />
          <div class="week-day-grid">
            <div class="week-day-item">
              <span class="2xl:week-title-class week-title-class-min"> 日</span>
              <div class="date-class">
                <span
                  :class="
                    dayOfWeekArray.length && selectedDateStr == dayOfWeekArray[0].time
                      ? '2xl:selected_day-class selected_day-class-min'
                      : '2xl:week-day-class week-day-class-min'
                  "
                  @click="dayClick(dayOfWeekArray[0])"
                >
                  {{ dayOfWeekArray.length ? dayOfWeekArray[0].date : '--' }}
                </span>
                <span
                  v-if="
                    dayOfWeekArray.length &&
                    dayOfWeekArray[0].time == todayStr &&
                    selectedDateStr != todayStr
                  "
                  class="to-data-class"
                >
                </span>
              </div>
            </div>
            <div class="week-day-item">
              <span class="2xl:week-title-class week-title-class-min"> 一</span>
              <div class="date-class">
                <span
                  :class="
                    dayOfWeekArray.length && selectedDateStr == dayOfWeekArray[1].time
                      ? '2xl:selected_day-class selected_day-class-min'
                      : '2xl:week-day-class week-day-class-min'
                  "
                  @click="dayClick(dayOfWeekArray[1])"
                >
                  {{ dayOfWeekArray.length ? dayOfWeekArray[1].date : '--' }}
                </span>
                <span
                  v-if="
                    dayOfWeekArray.length &&
                    dayOfWeekArray[1].time == todayStr &&
                    selectedDateStr != todayStr
                  "
                  class="to-data-class"
                >
                </span>
              </div>
            </div>
            <div class="week-day-item">
              <span class="2xl:week-title-class week-title-class-min"> 二</span>
              <div class="date-class">
                <span
                  :class="
                    dayOfWeekArray.length && selectedDateStr == dayOfWeekArray[2].time
                      ? '2xl:selected_day-class selected_day-class-min'
                      : '2xl:week-day-class week-day-class-min'
                  "
                  @click="dayClick(dayOfWeekArray[2])"
                >
                  {{ dayOfWeekArray.length ? dayOfWeekArray[2].date : '--' }}
                </span>
                <span
                  v-if="
                    dayOfWeekArray.length &&
                    dayOfWeekArray[2].time == todayStr &&
                    selectedDateStr != todayStr
                  "
                  class="to-data-class"
                >
                </span>
              </div>
            </div>
            <div class="week-day-item">
              <span class="2xl:week-title-class week-title-class-min">三</span>
              <div class="date-class">
                <span
                  :class="
                    dayOfWeekArray.length && selectedDateStr == dayOfWeekArray[3].time
                      ? '2xl:selected_day-class selected_day-class-min'
                      : '2xl:week-day-class week-day-class-min'
                  "
                  @click="dayClick(dayOfWeekArray[3])"
                >
                  {{ dayOfWeekArray.length ? dayOfWeekArray[3].date : '--' }}
                </span>
                <span
                  v-if="
                    dayOfWeekArray.length &&
                    dayOfWeekArray[3].time == todayStr &&
                    selectedDateStr != todayStr
                  "
                  class="to-data-class"
                >
                </span>
              </div>
            </div>
            <div class="week-day-item">
              <span class="2xl:week-title-class week-title-class-min">四</span>
              <div class="date-class">
                <span
                  :class="
                    dayOfWeekArray.length && selectedDateStr == dayOfWeekArray[4].time
                      ? '2xl:selected_day-class selected_day-class-min'
                      : '2xl:week-day-class week-day-class-min'
                  "
                  @click="dayClick(dayOfWeekArray[4])"
                >
                  {{ dayOfWeekArray.length ? dayOfWeekArray[4].date : '--' }}
                </span>
                <span
                  v-if="
                    dayOfWeekArray.length &&
                    dayOfWeekArray[4].time == todayStr &&
                    selectedDateStr != todayStr
                  "
                  class="to-data-class"
                >
                </span>
              </div>
            </div>
            <div class="week-day-item">
              <span class="2xl:week-title-class week-title-class-min">五</span>
              <div class="date-class">
                <span
                  :class="
                    dayOfWeekArray.length && selectedDateStr == dayOfWeekArray[5].time
                      ? '2xl:selected_day-class selected_day-class-min'
                      : '2xl:week-day-class week-day-class-min'
                  "
                  @click="dayClick(dayOfWeekArray[5])"
                >
                  {{ dayOfWeekArray.length ? dayOfWeekArray[5].date : '--' }}
                </span>
                <span
                  v-if="
                    dayOfWeekArray.length &&
                    dayOfWeekArray[5].time == todayStr &&
                    selectedDateStr != todayStr
                  "
                  class="to-data-class"
                >
                </span>
              </div>
            </div>
            <div class="week-day-item">
              <span class="2xl:week-title-class week-title-class-min">六</span>
              <div class="date-class">
                <span
                  :class="
                    dayOfWeekArray.length && selectedDateStr == dayOfWeekArray[6].time
                      ? '2xl:selected_day-class selected_day-class-min'
                      : '2xl:week-day-class week-day-class-min'
                  "
                  @click="dayClick(dayOfWeekArray[6])"
                >
                  {{ dayOfWeekArray.length ? dayOfWeekArray[6].date : '--' }}
                </span>
                <span
                  v-if="
                    dayOfWeekArray.length &&
                    dayOfWeekArray[6].time == todayStr &&
                    selectedDateStr != todayStr
                  "
                  class="to-data-class"
                >
                </span>
              </div>
            </div>
          </div>
          <Icon
            :size="18"
            class="2xl:next-week-wrap next-week-wrap-min"
            icon="ep:arrow-right-bold"
            style="color: #999999"
            @click="nextWeek"
          />
        </div>
        <div
          v-if="recordList.length"
          class="meeting-record-wrap"
          :style="{ height: tableheight + 'px' }"
        >
          <div
            v-for="(item, index) in recordList"
            :key="index"
            :style="{ 'margin-top': index > 0 ? '6px' : '0px' }"
            class="record-out-wrap"
          >
            <div class="record-item-wrap">
              <div
                :class="
                  item.flag == '1'
                    ? 'orange-dot-class'
                    : item.flag == '2'
                    ? 'blue-dot-class'
                    : 'gray-dot-class'
                "
              ></div>
              <span
                :class="
                  item.flag == '1'
                    ? 'orange-address-class'
                    : item.flag == '2'
                    ? 'blue-address-class'
                    : 'gray-address-class'
                "
                >{{ item.meetingroom }}
              </span>
              <p :title="item.summary" class="record-content-class">{{ item.summary }} </p>
              <span class="record-time-class">{{ item.time }}</span>
            </div>

            <div
              v-if="index < recordList.length - 1"
              :class="
                item.flag == '1'
                  ? 'orange-line-class'
                  : item.flag == '2'
                  ? 'blue-line-class'
                  : 'gray-line-class'
              "
            >
            </div>
          </div>
        </div>
        <div class="mt-8px 2xl:mt-0 flex-1" v-else><NoData class="no-data" /> </div>
        <!-- <div class="block 2xl:block text-center mt-12px text-[#333]">暂无数据</div> -->
      </div>
    </template>
  </BottomCard>
</template>
<script lang="ts" setup>
import moment from 'moment'
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { BottomCard } from './components'
import { getMeetingDayApi } from '@/api/Conference/meetingAppointment'
import NoData from '@/views/Components/NoData.vue'


const { push } = useRouter()
//今天
const today = ref<string>()
const todayStr = ref<string>('')
onMounted(() => {
  today.value = moment(new Date()).format('YYYY年M月D日')
  selectedDateStr.value = moment(new Date()).format('YYYY-MM-DD')
  todayStr.value = moment(new Date()).format('YYYY-MM-DD')
  generateWeek()
  getMeetingList()
})

const dayOfWeekArray = ref<any>([])
const generateWeek = () => {
  const selectedDate = new Date(selectedDateStr.value)
  const dayOfWeek = selectedDate.getDay()
  dayOfWeekArray.value = []
  for (let i = 0; i < 7; i++) {
    let oneDate = new Date(selectedDate)
    oneDate.setDate(selectedDate.getDate() - dayOfWeek + i)
    dayOfWeekArray.value.push({
      date: oneDate.getDate(),
      time: moment(oneDate).format('YYYY-MM-DD')
    })
  }
}
//选中时间
const selectedDateStr = ref<string>('')

//更多
const more = () => {
  push({ name: 'MeetingAppointment' })
}
//回到今日
const returnToday = () => {
  recordList.value = []
  selectedDateStr.value = todayStr.value
  generateWeek()
  getMeetingList()
}
//预约
const reservation = () => {
  push({ name: 'MeetingAppointment' })
}
//上一周
const lastWeek = () => {
  recordList.value = []
  selectedDateStr.value = getDay(-7)
  generateWeek()
  getMeetingList()
}

//获得当前日期
const getDay = (day: number) => {
  let date = new Date(selectedDateStr.value)
  let targetday_milliseconds = date.getTime() + 1000 * 60 * 60 * 24 * day
  date.setTime(targetday_milliseconds) //注意，这行是关键代码
  let tYear = date.getFullYear()
  let tMonth = date.getMonth()
  let tDate = date.getDate()
  let tMonthSub = doHandleMonth(tMonth + 1)
  let tDateSub = doHandleMonth(tDate)
  return tYear + '-' + tMonthSub + '-' + tDateSub
}
const doHandleMonth = (month: number) => {
  let m = ''
  if (month.toString().length == 1) {
    m = '0' + month
  } else {
    m = month.toString()
  }
  return m
}
//下一周
const nextWeek = () => {
  recordList.value = []
  selectedDateStr.value = getDay(7)
  generateWeek()
  getMeetingList()
}

//选择日期
const dayClick = (item: any) => {
  recordList.value = []
  if (item) {
    selectedDateStr.value = item.time
    getMeetingList()
  }
}

const getMeetingList = async () => {
  await getMeetingDayApi({
    day: moment(selectedDateStr.value ? selectedDateStr.value : new Date()).format('YYYY-MM-DD')
  }).then((res) => {
    recordList.value = []
    res.data[0].list.forEach((item) => {
      if (item.children != null) {
        item.children.forEach((ele) => {
          recordList.value.push({ ...ele })
        })
      }
    })
  })
}

const recordList = ref<any>([
  // {
  //   title: '研发中心周例会研发中心周例会研发中心周例会研发中心周例会',
  //   address: '培训会议室',
  //   time: '09:30:00-10:15:00',
  //   status: '0'
  // },
  // { title: '研发中心周例会', address: '党建会议室', time: '09:30:00-10:15:00', status: '1' },
  // { title: '研发中心周例会', address: '党建会议室', time: '09:30:00-10:15:00', status: '2' }
])
//查询当日预约记录
const getMeetingRecord = () => {}
</script>

<style lang="less" scoped>
.meeting-wrap-class {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
}
.no-data {
  display: flex;
  align-items: center;
  justify-content: center;
}

.top-div-class {
  width: 100%;
  display: flex;
  padding-left: 20px;
  padding-right: 20px;
}

.today-text-class {
  font-size: 15px;
  margin-top: 20px;
  font-family: Alibaba PuHuiTi R;
  font-weight: 400;
  color: #444444;
}

.return-today-class {
  margin-left: 10px;
  cursor: pointer;
  font-size: 15px;
  margin-top: 20px;
  font-family: Alibaba PuHuiTi R;
  font-weight: 400;
  color: #00a0e9;
}

.meeting-room-appointment {
  width: 70px;
  height: 28px;
  background: rgba(0, 160, 233, 0.1);
  border: 1px solid #00a0e9;
  border-radius: 14px;
  font-size: 14px;
  text-align: center;
  line-height: 28px;
  margin-top: 14px;
  font-family: Alibaba PuHuiTi R;
  font-weight: 400;
  color: #00a0e9;
  cursor: pointer;
}

.calendar-wrap-class {
  width: 100%;
  display: flex;
  margin-top: 10px;
  padding-left: 20px;
  padding-right: 20px;
}

.next-week-wrap {
  margin-top: 13.5px;
  color: #999999 !important;
  cursor: pointer;
}

.next-week-wrap-min {
  margin-top: 10.5px;
  color: #999999 !important;
  cursor: pointer;
}

.week-day-grid {
  height: 100%;
  width: 100%;
  display: flex;
}

.week-day-item {
  width: 14.285%;
  height: 100%;
  display: grid;
}

.week-title-class {
  width: 100%;
  text-align: center;
  font-size: 15px;
  font-family: Alibaba PuHuiTi R;
  font-weight: 400;
  color: #999999;
}

.week-title-class-min {
  width: 100%;
  text-align: center;
  font-size: 13px;
  font-family: Alibaba PuHuiTi R;
  font-weight: 400;
  color: #999999;
}

.week-day-class {
  width: 30px;
  height: 30px;
  line-height: 30px;
  text-align: center;
  font-size: 15px;
  font-family: Alibaba PuHuiTi R;
  font-weight: 400;
  color: #222222;
  cursor: pointer;
}

.week-day-class-min {
  width: 20px;
  height: 20px;
  line-height: 20px;
  text-align: center;
  font-size: 13px;
  font-family: Alibaba PuHuiTi R;
  font-weight: 400;
  color: #222222;
  cursor: pointer;
}

.to-data-class {
  width: 4px;
  height: 4px;
  margin-left: -5px;
  margin-top: 0px;
  background: #00a0e9;
  border-radius: 50%;
}

.selected_day-class {
  width: 30px;
  height: 30px;
  background: #00a0e9;
  border-radius: 50%;
  line-height: 30px;
  text-align: center;
  font-size: 15px;
  font-family: Alibaba PuHuiTi R;
  font-weight: 400;
  color: #ffffff;
  cursor: pointer;
}

.selected_day-class-min {
  width: 26px;
  height: 26px;
  background: #00a0e9;
  border-radius: 50%;
  line-height: 26px;
  text-align: center;
  font-size: 13px;
  font-family: Alibaba PuHuiTi R;
  font-weight: 400;
  color: #ffffff;
  cursor: pointer;
}

.date-class {
  display: flex;
  justify-content: center;
}

.meeting-record-wrap {
  margin-top: 10px;
  // height: 49%;
  width: 100%;
  overflow-y: auto;
  padding-left: 20px;
  padding-right: 20px;
}

.record-item-wrap {
  z-index: 99;
  width: 100%;
  height: 32px;
  display: flex;
  background: #f7f8fa;
  border-radius: 4px;
}

.orange-dot-class {
  width: 8px;
  height: 8px;
  background: #ff7649;
  border-radius: 50%;
  margin-left: 12px;
  margin-top: 12px;
}

.blue-dot-class {
  width: 8px;
  height: 8px;
  background: #00a0e9;
  border-radius: 50%;
  margin-left: 12px;
  margin-top: 12px;
}

.gray-dot-class {
  width: 8px;
  height: 8px;
  background: #a7a7a7;
  border-radius: 50%;
  margin-left: 12px;
  margin-top: 12px;
}

.orange-address-class {
  width: 86px;
  height: 20px;
  line-height: 18px;
  margin-top: 6px;
  margin-left: 20px;
  text-align: center;
  font-size: 14px;
  font-family: Alibaba PuHuiTi R;
  font-weight: 400;
  color: #ff7649;
  border: 1px solid #ff7649;
  border-radius: 9px;
}

.blue-address-class {
  width: 86px;
  height: 20px;
  line-height: 18px;
  margin-top: 6px;
  margin-left: 20px;
  text-align: center;
  font-size: 14px;
  font-family: Alibaba PuHuiTi R;
  font-weight: 400;
  color: #00a0e9;
  border: 1px solid #00a0e9;
  border-radius: 9px;
}

.gray-address-class {
  width: 86px;
  height: 20px;
  line-height: 18px;
  margin-top: 6px;
  margin-left: 20px;
  text-align: center;
  font-size: 14px;
  font-family: Alibaba PuHuiTi R;
  font-weight: 400;
  color: #a7a7a7;
  border: 1px solid #a7a7a7;
  border-radius: 9px;
}

.record-time-class {
  width: 90px;
  height: 32px;
  line-height: 32px;
  font-size: 14px;
  font-family: Alibaba PuHuiTi R;
  margin-right: 12px;
  font-weight: 400;
  color: #444444;
}

.record-content-class {
  flex: 1;
  width: 13vw;
  height: 32px;
  line-height: 32px;
  font-size: 14px;
  font-family: Alibaba PuHuiTi R;
  font-weight: 400;
  color: #444444;
  margin-left: 10px;
  margin-right: 10px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.record-out-wrap {
  position: relative;
  width: 100%;
}

.orange-line-class {
  position: absolute;
  z-index: 100;
  width: 2px;
  top: 25px;
  height: 20px;
  left: 14.5px;
  border: 1.5px dashed #ff7649;
}

.blue-line-class {
  position: absolute;
  z-index: 100;
  width: 2px;
  top: 25px;
  height: 20px;
  left: 14.5px;
  border: 1.5px dashed #00a0e9;
}

.gray-line-class {
  position: absolute;
  z-index: 100;
  width: 2px;
  top: 25px;
  height: 20px;
  left: 14.5px;
  border: 1.5px dashed #a7a7a7;
}
@media screen and (max-width: 1536px) {
  .today-text-class,
  .return-today-class,
  .meeting-room-appointment {
    font-size: 13px;
  }
  .meeting-room-appointment {
    width: 55px;
    height: 22px;
    line-height: 20px;
  }
  .record-item-wrap {
    height: 28px;
    font-size: 13px;
  }
  .calendar-wrap-class,
  .top-div-class,
  .meeting-record-wrap {
    padding: 0 14px;
  }
  .meeting-record-wrap {
    margin-top: 6px;
    height: 100px !important;
  }
  .record-content-class,
  .record-time-class {
    height: 28px;
    font-size: 13px;
  }
  .gray-address-class,
  .orange-address-class,
  .blue-address-class {
    height: 20px;
    line-height: 18px;
    font-size: 12px;
  }
  .blue-dot-class {
    margin-top: 11px;
  }
  .orange-line-class,
  .gray-line-class,
  .blue-line-class {
    top: 22px;
    left: 15px;
  }
  .record-content-class {
    width: 100px !important;
  }
}
</style>
