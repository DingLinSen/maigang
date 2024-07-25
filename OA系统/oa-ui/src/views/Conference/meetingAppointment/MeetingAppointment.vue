<template>
  <div class="reservation w-full h-full">
    <div class="reservation_header h-51px pl-20px">
      <p class="reservation_header_text">会议室预约</p>
    </div>
    <div class="reservation_content">
      <div class="reservation_content_top my-13px px-20px flex justify-between items-center">
        <div class="reservation_content_top_left flex items-center">
          <ElButton class="btn-add reservation_btn" plain @click="handleReservation">
            点击预约</ElButton
          >
          <div class="select_data w-184px h-36px ml-10px flex justify-between">
            <div :class="{ active: dateIndex == 0 }" class="reservation_date" @click="handleDate(0)"
              >月
            </div>
            <div :class="{ active: dateIndex == 1 }" class="reservation_date" @click="handleDate(1)"
              >周
            </div>
            <div :class="{ active: dateIndex == 2 }" class="reservation_date" @click="handleDate(2)"
              >日
            </div>
          </div>
        </div>
        <!--        月的日期选择器    -->
        <div v-if="dateIndex == 0" class="relative flex items-center">
          <Icon
            class="time_user cursor-pointer"
            icon="svg-icon:arrow_left_icon"
            @click="prevMonth"
          />
          <span class="cursor-pointer time_select" @click="handleDateClick()">{{ MonthDate }}</span>
          <div class="absolute dateSelect invisible -top-[14px]">
            <el-date-picker
              ref="datePicker"
              v-model="dateValue"
              type="month"
              @change="handleTime"
            />
          </div>
          <Icon
            class="time_user ml-10px cursor-pointer"
            icon="svg-icon:arrow_right_icon"
            @click="nextMonth"
          />
        </div>
        <!--        周的日期选择器    -->
        <div v-if="dateIndex == 1" class="relative flex items-center">
          <Icon
            class="time_user cursor-pointer"
            icon="svg-icon:arrow_left_icon"
            @click="prevWeek"
          />
          <span class="cursor-pointer time_select" @click="handleDateClick()">
            {{
              moment(weekValue).startOf('week').format('YYYY年MM月DD日') +
              ' - ' +
              moment(weekValue).endOf('week').format('YYYY年MM月DD日')
            }}
          </span>
          <div class="absolute dateSelect invisible -top-[14px]">
            <el-date-picker ref="datePicker" v-model="weekValue" type="week" @change="handleWeek" />
          </div>
          <Icon
            class="time_user ml-10px cursor-pointer"
            icon="svg-icon:arrow_right_icon"
            @click="nextWeek"
          />
        </div>
        <!--        日的日期选择器    -->
        <div v-if="dateIndex == 2" class="relative flex items-center">
          <Icon class="time_user cursor-pointer" icon="svg-icon:arrow_left_icon" @click="prevDay" />
          <span class="cursor-pointer time_select" @click="handleDateClick()">{{
            moment(dayValue).format('YYYY年MM月DD日')
          }}</span>
          <div class="absolute dateSelect invisible -top-[14px]">
            <el-date-picker ref="datePicker" v-model="dayValue" type="date" />
          </div>
          <Icon
            class="time_user ml-10px cursor-pointer"
            icon="svg-icon:arrow_right_icon"
            @click="nextDay"
          />
        </div>
        <div class="reservation_content_top_right flex">
          <div class="reservation_status flex items-center">
            <div class="status bg-[#00A0E9]"></div>
            <p>即将开始</p>
          </div>
          <div class="reservation_status flex items-center mx-15px">
            <div class="status bg-[#FF7649]"></div>
            <p>进行中</p>
          </div>
          <div class="reservation_status flex items-center">
            <div class="status bg-[#A7A7A7]"></div>
            <p>已结束</p>
          </div>
        </div>
      </div>
      <!--      月    -->
      <table v-if="dateIndex == 0" class="ml-20px" width="98%">
        <thead>
          <tr class="table_header border-1 h-40px">
            <th v-for="(day, index) in weekData" :key="index">{{ day }}</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(week, index) in weeksData" :key="index">
            <td
              v-for="(day, index) in week"
              :key="index"
              :class="{ table_active: day == moment(new Date()).format('D') }"
              align="right"
              class="table_td border-1"
            >
              <div class="table_time">
                <p class="table_date">
                  {{ day }}
                </p>
              </div>
              <template
                v-for="(item, index) in textContent(monthValue + (day <= 9 ? '0' + day : day))"
              >
                <div class="table_hys_details">
                  <template v-for="ele in item.list.slice(0, 2)">
                    <div
                      :class="{
                        ended: ele.flag == 0,
                        progress: ele.flag == 1,
                        not_started: ele.flag == 2
                      }"
                      class="table_hys"
                      @click.stop="handleReservationDetails($event, ele.id)"
                    >
                      <p
                        :class="{
                          ended_meeting: ele.flag == 0,
                          progress_meeting: ele.flag == 1,
                          not_started_meeting: ele.flag == 2
                        }"
                        class="hys_title"
                        >{{ ele.meetingroom }}</p
                      >
                      <p class="hy_time">
                        {{
                          moment(ele.bookDateStart).format('HH:mm') +
                          '-' +
                          moment(ele.bookDateEnd).format('HH:mm')
                        }}
                      </p>
                    </div>
                    <div
                      v-if="reservationDetailsIndex == ele.id"
                      :style="{ top: clientY, left: clientX }"
                      class="reservationDetails_month w-400px bg-[#FFFFFF] cursor-pointer"
                      @click.stop=""
                    >
                      <div
                        class="reservationDetails_header bg-[#00A0E9] h-50px text-[#FFFFFF] flex justify-between px-15px items-center"
                      >
                        <div class="reservationDetails_header_left">
                          {{ reservationDetailsData.summary }}
                        </div>
                        <div class="flex items-center">
                          <Icon
                            v-if="ele.detailAuth == '0'"
                            class="mr-10px editOrDelIcon"
                            icon="svg-icon:edit_icon"
                            @click.stop="handleEditOrDetails"
                          />
                          <Icon
                            v-if="ele.flag == 2 && ele.bookBy == loginUserId"
                            class="mr-10px editOrDelIcon"
                            icon="svg-icon:delete_icon"
                            @click.stop="handleDel(ele.id)"
                          />
                          <span class="text-3xl" @click.stop="closeDialog">×</span>
                        </div>
                      </div>
                      <div class="reservationDetails_content pl-25px pt-25px pb-30px">
                        <div class="flex items-center">
                          <Icon class="time_user" icon="svg-icon:time_icon" />
                          <div class="text-[#777777]">起止时间:</div>
                          <span class="ml-10px"
                            >{{
                              moment(reservationDetailsData.bookDateStart).format('M月D日 HH:mm')
                            }}
                            - {{ moment(reservationDetailsData.bookDateEnd).format('HH:mm') }}</span
                          >
                        </div>
                        <div class="flex items-center mt-10px">
                          <Icon class="time_user" icon="svg-icon:admin_icon_1" />
                          <div class="text-[#777777]">发起人:</div>
                          <span class="ml-23px">{{ reservationDetailsData.bookByName }}</span>
                        </div>
                      </div>
                    </div>
                  </template>
                </div>
                <div
                  v-if="item.list.length > 2"
                  class="more text-[#00a0e9]"
                  @click.stop="moreList(item.list)"
                  >更多
                </div>
              </template>
            </td>
          </tr>
        </tbody>
      </table>
      <!--    周    -->
      <table
        v-if="dateIndex == 1"
        v-loading="tableLoading"
        class="table_week ml-44px mr-20px"
        width="95%"
      >
        <tr>
          <th></th>
          <th
            v-for="day in tableWeekData"
            :class="{
              'bg-[#F0F2F6]  text-[#00A0E9]':
                moment(new Date()).format('YYYY-MM-DD') == day.day.slice(0, 10)
            }"
            class="h-40px border-1"
            width="14%"
            >{{ day.day }}
          </th>
        </tr>
        <template v-for="(item, index) in tableWeekDataTime">
          <tr>
            <td class="td_border" height="40px">{{ item.flag ? '' : item.hour }}</td>
            <template v-for="day in tableWeekData">
              <template v-for="(ele, i) in item.list">
                <td v-if="day.day == ele.day" class="table_content_td">
                  <div class="flex reservationDetails_week_box">
                    <template v-for="(v, i) in ele.children">
                      <!--     预约详情弹窗    -->
                      <div
                        :class="{
                          ended: v.flag == 0,
                          progress: v.flag == 1,
                          not_started: v.flag == 2
                        }"
                        :style="{ height: v.hourFlag * 2 * 40 + 'px' }"
                        class="reservation_box border-1 bg-[#F7F8FA] cursor-pointer"
                        @click.stop="handleReservationDetails($event, v.meetId)"
                      >
                        <div
                          :class="{
                            ended_meeting: v.flag == 0,
                            progress_meeting: v.flag == 1,
                            not_started_meeting: v.flag == 2,
                            reservation_title_width: ele.children.length > 2
                          }"
                          class="reservation_title text-xs"
                          >{{ v.meetingroom }}
                        </div>
                        <div
                          :class="{ reservation_time: ele.children.length > 2 }"
                          class="reservation_text"
                        >
                          {{ v.time }}
                        </div>
                      </div>
                      <div
                        v-if="reservationDetailsIndex == v.meetId"
                        :style="{ top: clientY, left: clientX }"
                        class="reservationDetails_week w-400px bg-[#FFFFFF] cursor-pointer"
                        @click.stop=""
                      >
                        <div
                          class="reservationDetails_header bg-[#00A0E9] h-50px text-[#FFFFFF] flex justify-between px-15px items-center"
                        >
                          <div class="reservationDetails_header_left">
                            {{ reservationDetailsData.summary }}
                          </div>
                          <div class="flex items-center">
                            <Icon
                              v-if="v.detailAuth == '0'"
                              class="mr-10px editOrDelIcon"
                              icon="svg-icon:edit_icon"
                              @click.stop="handleEditOrDetails"
                            />
                            <Icon
                              v-if="v.flag == 2 && v.bookBy == loginUserId"
                              class="mr-10px editOrDelIcon"
                              icon="svg-icon:delete_icon"
                              @click.stop="handleDel(v.meetId)"
                            />
                            <span class="text-3xl" @click.stop="closeDialog">×</span>
                          </div>
                        </div>
                        <div class="reservationDetails_content pl-25px pt-25px pb-30px">
                          <div class="flex items-center">
                            <Icon class="time_user" icon="svg-icon:time_icon" />
                            <div class="text-[#777777]">起止时间:</div>
                            <span class="ml-10px"
                              >{{
                                moment(reservationDetailsData.bookDateStart).format('M月D日 HH:mm')
                              }}
                              -
                              {{ moment(reservationDetailsData.bookDateEnd).format('HH:mm') }}</span
                            >
                          </div>
                          <div class="flex items-center mt-10px">
                            <Icon class="time_user" icon="svg-icon:admin_icon_1" />
                            <div class="text-[#777777]">发起人:</div>
                            <span class="ml-23px">{{ reservationDetailsData.bookByName }}</span>
                          </div>
                        </div>
                      </div>
                    </template>
                  </div>
                </td>
              </template>
            </template>
          </tr>
        </template>
      </table>
      <!--    日  -->
      <table v-if="dateIndex == 2" class="table_day ml-44px mr-20px" width="95%">
        <tr>
          <th></th>
          <th class="bg-[#F0F2F6] h-40px text-[#00A0E9] border-1" colspan="24">
            {{ tableDayData.day }}
          </th>
        </tr>
        <tr v-for="(item, index) in tableDayData.list">
          <td class="border-r-1" height="40px" width="60px">{{ item.flag ? '' : item.hour }}</td>
          <td
            v-for="(ele, i) in item.children"
            :class="{ ended: ele.flag == 0, progress: ele.flag == 1, not_started: ele.flag == 2 }"
            :colspan="ele.hourFlag == 1 ? '24' : ''"
            :rowspan="ele.hourFlag * 2"
            class="pl-12px border-1 bg-[#F7F8FA] cursor-pointer reservationDetails_td"
            @click.stop="handleReservationDetails($event, ele.meetId)"
          >
            <!--     预约详情弹窗    -->
            <div :style="{ height: ele.hourFlag * 2 * 40 + 'px' }">
              <span
                :class="{
                  ended_meeting: ele.flag == 0,
                  progress_meeting: ele.flag == 1,
                  not_started_meeting: ele.flag == 2
                }"
                class="reservation_title_day"
                >{{ ele.meetingroom }}
              </span>
              <div>{{ ele.time }}</div>
            </div>
            <div
              v-if="reservationDetailsIndex == ele.meetId"
              :style="{ top: clientY, left: clientX }"
              class="reservationDetails w-400px bg-[#FFFFFF] cursor-pointer"
              @click.stop=""
            >
              <div
                class="reservationDetails_header bg-[#00A0E9] h-50px text-[#FFFFFF] flex justify-between px-15px items-center"
              >
                <div class="reservationDetails_header_left">
                  {{ reservationDetailsData.summary }}
                </div>
                <div class="flex items-center">
                  <Icon
                    v-if="ele.detailAuth == '0'"
                    class="mr-10px editOrDelIcon"
                    icon="svg-icon:edit_icon"
                    @click.stop="handleEditOrDetails"
                  />
                  <Icon
                    v-if="ele.flag == 2 && ele.bookBy == loginUserId"
                    class="mr-10px editOrDelIcon"
                    icon="svg-icon:delete_icon"
                    @click.stop="handleDel(ele.meetId)"
                  />
                  <span class="text-3xl" @click.stop="closeDialog">×</span>
                </div>
              </div>
              <div class="reservationDetails_content pl-25px pt-25px pb-30px">
                <div class="flex items-center">
                  <Icon class="time_user" icon="svg-icon:time_icon" />
                  <div class="w-80px text-[#777777]">起止时间:</div>
                  {{ moment(reservationDetailsData.bookDateStart).format('M月D日 HH:mm') }} -
                  {{ moment(reservationDetailsData.bookDateEnd).format('HH:mm') }}
                </div>
                <div class="flex items-center mt-10px">
                  <Icon class="time_user" icon="svg-icon:admin_icon_1" />
                  <div class="w-80px text-[#777777]">发起人:</div>
                  {{ reservationDetailsData.bookByName }}
                </div>
              </div>
            </div>
          </td>
          <!--          <td v-if="item.flag == true" :class="{ dashed_time: item.flag }" :colspan="24"></td>-->
          <!--          <td v-else :colspan="24" class="solid_time"></td>-->
        </tr>
      </table>
      <!--更多的弹出框-->
      <Dialog
        ref="elDialogFef"
        v-model="dialogFlag"
        class="cultivate-custom"
        height="100%"
        title="会议详情"
        width="35%"
        @closed="resetFormAfterClose"
      >
        <div class="h-400px">
          <template v-for="item in moreDataList">
            <div
              :class="{
                ended: item.flag == 0,
                progress: item.flag == 1,
                not_started: item.flag == 2
              }"
              class="table_hys_dialog"
              @click.stop="handleReservationDetailsDialog($event, item.id)"
            >
              <p
                :class="{
                  ended_meeting: item.flag == 0,
                  progress_meeting: item.flag == 1,
                  not_started_meeting: item.flag == 2
                }"
                class="hys_title"
                >{{ item.meetingroom }}</p
              >
              <p class="hy_time">
                {{
                  moment(item.bookDateStart).format('HH:mm') +
                  '-' +
                  moment(item.bookDateEnd).format('HH:mm')
                }}
              </p>
              <!--          -->
              <div
                v-if="reservationDetailsIndexDialog == item.id"
                :style="{ top: clientY, left: clientX }"
                class="reservationDetails_month_dialog w-400px bg-[#FFFFFF] cursor-pointer"
              >
                <div
                  class="reservationDetails_header bg-[#00A0E9] h-50px text-[#FFFFFF] flex justify-between px-15px items-center"
                >
                  <div class="reservationDetails_header_left">
                    {{ reservationDetailsData.summary }}
                  </div>
                  <div class="flex items-center">
                    <Icon
                      v-if="item.detailAuth == '0'"
                      class="mr-10px editOrDelIcon"
                      icon="svg-icon:edit_icon"
                      @click.stop="handleEditOrDetailsDialog"
                    />
                    <Icon
                      v-if="item.flag == 2 && item.bookBy == loginUserId"
                      class="mr-10px editOrDelIcon"
                      icon="svg-icon:delete_icon"
                      @click.stop="handleDel(item.id)"
                    />
                    <span class="text-3xl" @click.stop="closeDialogMore">×</span>
                  </div>
                </div>
                <div class="reservationDetails_content pl-25px pt-25px pb-30px">
                  <div class="flex items-center">
                    <Icon class="time_user" icon="svg-icon:time_icon" />
                    <div class="w-80px text-[#777777]">起止时间:</div>
                    {{ moment(reservationDetailsData.bookDateStart).format('M月D日 HH:mm') }}
                    - {{ moment(reservationDetailsData.bookDateEnd).format('HH:mm') }}
                  </div>
                  <div class="flex items-center mt-10px">
                    <Icon class="time_user" icon="svg-icon:admin_icon_1" />
                    <div class="w-80px text-[#777777]">发起人:</div>
                    {{ reservationDetailsData.bookByName }}
                  </div>
                </div>
              </div>
            </div>
          </template>
        </div>
      </Dialog>
    </div>
    <!--    新增会议室预约  -->
    <ReservationDialog ref="ReservationDialogRef" @refresh-list="refreshList" />
    <!--    详情/编辑   -->
    <ReservationDetails ref="ReservationDetailsRef" />
  </div>
  <LimitDailog routerName="meetingAppointment" />
</template>

<script lang="ts" setup>
import { computed, ref, watch } from 'vue'
import ReservationDialog from './components/ReservationDialog.vue'
import ReservationDetails from './components/ReservationDetails.vue'
import { ElDialog } from '@/components/ElDialog'
import moment from 'moment'
import {
  getMeetingDayApi,
  getDetailMeetingApi,
  delMeetingApi,
  getMeetingMonthApi,
  getMeetingWeekApi
} from '@/api/Conference/meetingAppointment/index'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useCache } from '@/hooks/web/useCache'
import { LimitDailog } from '@/views/Components/limit'
import { Dialog } from '@/components/Dialog'

defineOptions({
  name: 'MeetingAppointment'
})

const { wsCache } = useCache()
const loginUserId = ref<string>(wsCache.get('userInfo').userId) // 登录用户id
const elDialogFef = ref()

interface week {
  day: String
  list: any
}

interface tabweek {
  hour: String
  flag: any
  children: any
}

const tableLoading = ref(true)
const monthTime = ref()
const yearTime = ref()
const dateValue = ref(new Date())
const dayValue = ref(new Date())
const weekValue = ref(new Date())
const datePicker = ref()
const ReservationDialogRef = ref()
const ReservationDetailsRef = ref()
const dateIndex = ref(0)
const weekData = ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
const weeksData = ref()
const momentDate = ref(moment())
const tableMonthData = ref([]) // 月的数据
const tableDayData = ref([]) // 日的数据
const tableWeekData = ref<week[]>() // 周的数据
const monthValue = ref()
// 月日期的默认值
const MonthDate = computed(() => {
  let date = dateValue.value ? new Date(dateValue.value) : new Date()
  yearTime.value = date.getFullYear()
  monthTime.value = date.getMonth() + 1
  let text = date.getFullYear() + '年' + (date.getMonth() + 1) + '月'
  monthValue.value =
    date.getFullYear() +
    '-' +
    (date.getMonth() + 1 <= 9 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) +
    '-'
  return text
})
watch(
  () => dateValue.value,
  () => {
    generateCalendar()
  }
)
watch(
  () => dayValue.value,
  () => {
    handleDate(dateIndex.value)
  }
)
watch(
  () => weekValue.value,
  () => {
    handleDate(dateIndex.value)
  }
)
const dialogFlag = ref(false)
const moreDataList = ref([])
// 点击更多获取月更多的数据
const moreList = (data) => {
  reservationDetailsIndex.value = null
  moreDataList.value = data
  dialogFlag.value = true
}
// 获取日历的时间
const generateCalendar = () => {
  const date = dateValue.value ? new Date(dateValue.value) : new Date()
  const year = date.getFullYear()
  const month = date.getMonth()
  yearTime.value = year
  monthTime.value = month + 1
  const firstDay = new Date(year, month, 1).getDay()
  const lastDate = new Date(year, month + 1, 0).getDate()
  const weeks = [[]]
  let dayCount = 1
  if (firstDay == 0) {
    for (let i = 0; i < 6; i++) {
      weeks[0].push('')
    }
  } else {
    for (let i = 0; i < firstDay - 1; i++) {
      weeks[0].push('')
    }
  }
  for (let i = 1; i <= lastDate; i++) {
    if (weeks[weeks.length - 1].length === 7) {
      weeks.push([])
    }
    weeks[weeks.length - 1].push(i)
  }
  weeksData.value = weeks
}
generateCalendar()
// 获取某天的数据
const textContent = (date) => {
  //当前date是拿到上面日历组件当前的日期值 根据该值去筛选测试数据找到对应各个日期下对应的数据return出去
  return tableMonthData.value.filter((item) => {
    return date === item.day
  })
}
// 点击时间弹出时间选择器
const handleDateClick = () => {
  datePicker.value.handleOpen()
}
// 点击选择器
const handleTime = (e) => {
  handleDate(dateIndex.value)
}
// 上一月
const prevMonth = () => {
  let date = dateValue.value ? new Date(dateValue.value) : new Date()
  const currentMonth = date.getMonth()
  let prevMonthYear: any = ''
  prevMonthYear = currentMonth === 0 ? date.getFullYear() - 1 : date.getFullYear()
  let prevMonth = currentMonth === 0 ? 11 : currentMonth - 1
  dateValue.value = prevMonthYear + '-' + (prevMonth + 1)
  yearTime.value = prevMonthYear
  monthTime.value = prevMonth + 1
  generateCalendar()
  handleDate(dateIndex.value)
}
// 下一月
const nextMonth = () => {
  let date = dateValue.value ? new Date(dateValue.value) : new Date()
  const currentMonth = date.getMonth()
  let nextMonthYear = currentMonth === 11 ? date.getFullYear() + 1 : date.getFullYear()
  let nextMonth = currentMonth === 11 ? 0 : currentMonth + 1
  dateValue.value = nextMonthYear + '-' + (nextMonth + 1)
  yearTime.value = nextMonthYear
  monthTime.value = nextMonth + 1
  generateCalendar()
  handleDate(dateIndex.value)
}
// 上一天
const prevDay = () => {
  dayValue.value = moment(dayValue.value).subtract(1, 'days')
}
// 下一天
const nextDay = () => {
  dayValue.value = moment(dayValue.value).add(1, 'days')
}
// 上一周
const prevWeek = () => {
  weekValue.value = moment(weekValue.value).startOf('week').subtract(1, 'weeks')
}
// 下一周
const nextWeek = () => {
  weekValue.value = moment(weekValue.value).startOf('week').add(1, 'weeks')
}
// 周的24小时
const tableWeekDataTime = ref<any>([])
// 日期切换并查询数据
const handleDate = async (val) => {
  dateIndex.value = val
  if (dateIndex.value == 0) {
    await getMeetingMonthApi({
      year: yearTime.value,
      month: monthTime.value
    }).then((res) => {
      tableMonthData.value = res.data
    })
  }
  if (dateIndex.value == 1) {
    await getMeetingWeekApi({
      startDay: moment(weekValue.value).startOf('week').format('YYYY-MM-DD'),
      endDay: moment(weekValue.value).endOf('week').format('YYYY-MM-DD')
    }).then((res) => {
      if (res && res.data.length) {
        tableLoading.value = false
        tableWeekData.value = res.data
        if (tableWeekData.value) {
          tableWeekDataTime.value = tableWeekData.value[0].list
          tableWeekData.value.forEach((item) => {
            item.list.forEach((listItem) => {
              let hourFlag = 0
              if (listItem.children) {
                listItem.children.forEach((c) => {
                  if (c.hourFlag > hourFlag) {
                    hourFlag = c.hourFlag
                  }
                })
              }
              listItem.hourFlag = hourFlag
            })
          })
          tableWeekDataTime.value = tableWeekDataTime.value.map((v) => {
            // 对象形式
            // let obj = {}
            // obj[v.hour] = []
            // 数组形式
            let obj = {
              hour: v.hour,
              flag: v.flag,
              list: []
            }
            return obj
          })
          tableWeekData.value.forEach((v) => {
            v.list.forEach((j) => {
              let obj = {}
              // 对象形式
              // obj[j.hour] = [
              //   {
              //     day: v.day,
              //     flag: j.flag,
              //     children: j.children
              //   }
              // ]
              // 数组形式
              obj = {
                hour: j.hour,
                list: [
                  {
                    day: v.day,
                    children: j.children
                  }
                ]
              }

              if (tableWeekDataTime.value.length) {
                tableWeekDataTime.value.forEach((k) => {
                  // 对象形式
                  // var key = Object.keys(k)
                  // if (key.includes(j.hour)) {
                  //   k[j.hour].push({
                  //     day: v.day,
                  //     flag: j.flag,
                  //     children: j.children
                  //   })
                  // }
                  // 数组形式
                  if (k.hour == j.hour) {
                    k.list.push({
                      day: v.day,
                      children: j.children,
                      hourFlag: j.hourFlag
                    })
                  }
                })
              }
            })
          })
        }
      }
    })
  }
  if (dateIndex.value == 2) {
    await getMeetingDayApi({
      day: moment(dayValue.value).format('YYYY-MM-DD')
    }).then((res) => {
      tableDayData.value = res.data[0]
    })
  }
  reservationDetailsIndex.value = ''
}
handleDate(dateIndex.value)
// 打开新增会议室预约
const handleReservation = () => {
  reservationDetailsIndex.value = ''
  ReservationDialogRef.value.openDialog('add')
}
const reservationDetailsIndex = ref() // 会议室预约详情的下标
const reservationDetailsIndexDialog = ref() // 会议室预约详情的下标
const reservationDetailsData = ref({}) // 会议室预约详情的数据
const clientX = ref()
const clientY = ref()
// 打开会议室预约详情
const handleReservationDetails = async (event, meetId) => {
  let x = event.x //鼠标点击的x坐标
  let y = event.y //鼠标点击的y坐标
  let menuWidth = 400 //菜单宽度，这个与.popup-menu样式对应的宽度一致
  let menuHeight = 160 //菜单高度，根据菜单项自动计算的高度
  let windowWidth = document.documentElement.clientWidth // 实时屏幕宽度
  let windowHeight = document.documentElement.clientHeight // 实时屏幕高度
  clientX.value = parseFloat(x) - 10 + 'px'
  clientY.value = parseFloat(y) + 10 + 'px'
  if (parseFloat(x) + menuWidth > windowWidth) {
    clientX.value = parseFloat(windowWidth) - menuWidth - 50 + 'px'
  }
  if (parseFloat(y) + menuHeight > windowHeight) {
    clientY.value = parseFloat(windowHeight) - menuHeight - 50 + 'px'
  }
  reservationDetailsData.value = {}
  reservationDetailsIndex.value = meetId
  await getDetailMeetingApi(meetId).then((res) => {
    reservationDetailsData.value = res.data
  })
}
const handleReservationDetailsDialog = async (event, meetId) => {
  let x = event.x //鼠标点击的x坐标
  let y = event.y //鼠标点击的y坐标
  let menuWidth = 400 //菜单宽度，这个与.popup-menu样式对应的宽度一致
  let menuHeight = 160 //菜单高度，根据菜单项自动计算的高度
  let windowWidth = document.documentElement.clientWidth // 实时屏幕宽度
  let windowHeight = document.documentElement.clientHeight // 实时屏幕高度
  clientX.value = parseFloat(x) - 10 + 'px'
  clientY.value = parseFloat(y) + 10 + 'px'
  if (parseFloat(x) + menuWidth > windowWidth) {
    clientX.value = parseFloat(windowWidth) - menuWidth - 50 + 'px'
  }
  if (parseFloat(y) + menuHeight > windowHeight) {
    clientY.value = parseFloat(windowHeight) - menuHeight - 50 + 'px'
  }
  reservationDetailsIndexDialog.value = meetId
  await getDetailMeetingApi(meetId).then((res) => {
    reservationDetailsData.value = res.data
  })
}
// 关闭会议室预约详情
const closeDialog = () => {
  reservationDetailsIndex.value = ''
  reservationDetailsData.value = {}
}
const resetFormAfterClose = () => {
  dialogFlag.value = false
  elDialogFef.value.isFullscreen = false
  reservationDetailsIndexDialog.value = ''
  reservationDetailsData.value = {}
}
//刷新表格
const refreshList = () => {
  reservationDetailsIndexDialog.value = null
  dialogFlag.value = false
  handleDate(dateIndex.value)
}
// 详情/编辑
const handleEditOrDetails = () => {
  ReservationDialogRef.value.openDialog('see', reservationDetailsIndex.value)
  reservationDetailsIndex.value = ''
}
const handleEditOrDetailsDialog = () => {
  ReservationDialogRef.value.openDialog('see', reservationDetailsIndexDialog.value)
  reservationDetailsIndex.value = ''
}
// 关闭更多弹窗
const closeDialogMore = () => {
  reservationDetailsIndexDialog.value = ''
}
// 删除
const handleDel = (id) => {
  ElMessageBox.confirm('是否删除所选中数据?', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
    autofocus: false
  })
    .then(async () => {
      await delMeetingApi(id).then((res) => {
        ElMessage({
          type: 'success',
          message: '删除成功'
        })
        handleDate(dateIndex.value)
        reservationDetailsIndexDialog.value = null
        dialogFlag.value = false
      })
    })
    .catch(() => {})
}
</script>

<style lang="less" scoped>
.reservation {
  background-color: #ffffff;
}

.reservation_header {
  line-height: 51px;
  border-bottom: 1px solid #eef0f2;
}

.reservation_header_text {
  font-family: 'Alibaba PuHuiTi M';
  font-weight: 500;
  font-size: 16px;
}

.reservation_btn {
  border-radius: 4px !important;
}

.active {
  color: #00a0e9;
  //line-height: 36px;
  text-align: center;
  width: 100%;
  background: #ccecfb;
  border-radius: 2px;
  padding: 5px 0;
  margin: 1px 1px;
}

.select_data {
  border: 1px solid #c9ccd4;
}

.reservation_date {
  cursor: pointer;
  padding: 5px 0;
  //line-height: 36px;
  text-align: center;
  width: 100%;
}

.status {
  width: 10px;
  height: 10px;
  border-radius: 2px;
  margin-right: 3px;
}

.reservation_box {
  width: 25%;
  min-width: 20%;
  padding: 5px 5px 0;
  //padding: 2px 0 10px;
  border-radius: 4px;
  position: relative;
  flex: 1;
  z-index: 2;
}

.reservation_title {
  font-size: 14px;
  padding: 2px 9px;
  border-radius: 9px;
  color: #ffffff;
  overflow: hidden;
  white-space: nowrap;
  margin: 0 auto;
}
.reservation_title_day {
  font-size: 14px;
  padding: 0px 9px;
  border-radius: 9px;
  color: #ffffff;
  overflow: hidden;
  white-space: nowrap;
  margin: 0 auto;
}

.reservation_title_width {
  font-size: 12px;
  padding: 2px 9px;
  border-radius: 9px;
  color: #ffffff;
  width: 50px;
  overflow: hidden;
  white-space: nowrap;
}

.reservation_text {
  //line-height: 1.2;
  margin: 0 auto;
}

.reservation_time {
  width: 50px;
  overflow: hidden;
  white-space: nowrap;
}

.ended {
  background: rgba(237, 237, 237, 0.8);
  border: 1px solid #dfdfdf;
}

.progress {
  background-color: #f9dbd1;
  border: 1px solid #f6c3b2;
}

.not_started {
  background: rgba(204, 236, 251, 0.9);
  border: 1px solid #a6daf2;
}

.ended_meeting {
  background-color: #a7a7a7;
}

.progress_meeting {
  background-color: #ff7649;
}

.not_started_meeting {
  background-color: #00a0e9;
}

.solid_time {
  border-top: 1px solid #eeeeee;
  border-left: 1px solid #eeeeee;
  border-right: 1px solid #eeeeee;
}

.dashed_time {
  width: 0%;
  border-top: 1px dashed #cccccc;
  border-left: 1px solid #eeeeee;
  border-right: 1px solid #eeeeee;
}

.reservationDetails_td {
  position: relative;
}

.reservationDetails {
  box-shadow: 0px 0px 14px 0px rgba(0, 0, 0, 0.12);
  border-radius: 4px;
  position: fixed;
  //left: 10%;
  //top: 40px;
  //bottom: 0;
  z-index: 2;
  //width: 100%;
}

.reservationDetails_week {
  box-shadow: 0px 0px 14px 0px rgba(0, 0, 0, 0.12);
  border-radius: 4px;
  position: fixed;
  //top: 40px;
  //left: 10%;
  //bottom: 0;
  z-index: 3;
}

.reservationDetails_header_left {
  font-size: 16px;
  text-align: left !important;
  width: 300px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.reservationDetails_month {
  box-shadow: 0px 0px 14px 0px rgba(0, 0, 0, 0.12);
  border-radius: 4px;
  position: fixed;
  //left: 50%;
  //top: 0px;
  //bottom: 0;
  //width: 100%;
  z-index: 2;
}

.reservationDetails_month_dialog {
  box-shadow: 0px 0px 14px 0px rgba(0, 0, 0, 0.12);
  border-radius: 4px;
  position: fixed;
  //bottom: 0;
  //left: 10%;
  //top: 0;
  z-index: 3;
}

.editOrDelIcon {
  font-size: 16px !important;
}

.time_user {
  font-size: 14px !important;
  vertical-align: middle;
  margin-right: 10px;
}

.time_select {
  font-size: 18px;
  font-weight: 500;
  margin: 0 18px;
}

:deep(.el-calendar__header) {
  display: none;
}

:deep(.el-calendar-day) {
  position: relative;
  height: 122px;
}

.table_date {
  position: absolute;
  right: 15px;
}
// @media screen and (max-width: 1430px) {
//   .table_hys {
//     display: flex;
//     flex-direction: column;
//     padding: 2px 3px 0 !important;
//   }
//   .hys_title {
//     width: 100%;
//     text-align: center;
//   }
//   .table_time {
//     right: -6px !important;
//     top: -1px !important;
//   }
//   .table_hys_details {
//     top: 12px !important;
//   }
//   .reservation_title {
//     font-size: 14px !important;
//     padding: 3px 9px;
//   }
//   .reservation_title_day {
//     font-size: 14px !important;
//     // padding: 3px 9px;
//   }
//   .text-xs {
//     font-size: 14px !important;
//   }
//   .text-sm {
//     font-size: 14px !important;
//   }
// }
.table_hys {
  // height: 26px;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 98%;
  margin: 4px 4px 0 4px;
  padding: 3px;

  //background: #ccecfb;
  //border: 1px solid #a6daf2;
  position: relative;
  font-size: 12px !important;
}

.table_hys_dialog {
  height: 25px;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 98%;
  margin-bottom: 14px;
  //background: #ccecfb;
  //border: 1px solid #a6daf2;
  position: relative;
}

.table_hys_details {
  padding: 2px;
  position: absolute;
  top: 35px;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  width: 100%;
}

.more {
  position: absolute;
  bottom: 0;
  right: 20px;
}

.hys_title {
  padding: 0 10px;
  //background: #00a0e9;
  color: #ffffff;
  border-radius: 9px;
  font-size: 12px;
  // margin: 5px 0 5px 3px;
}

.hy_time {
  // margin-right: 8px;
}

.table_header {
  background-color: #f7f8fa;
}

.table_td {
  height: 122px;
  position: relative;
  cursor: pointer;
}

.table_time {
  position: absolute;
  right: 15px;
  top: 15px;
  font-weight: 600;
}

.week_time {
  position: absolute;
  right: 20px;
  top: 20px;
  font-weight: 600;
}

.table_active {
  background: #ebf4f8;
}

.table_week {
  tr:nth-child(even) {
    td {
      border-bottom: 1px dashed #eee;
      border-left: 1px solid #eee;
      border-right: 1px solid #eee;
    }
  }

  tr:nth-child(odd) {
    td {
      border-bottom: 1px solid #eee;
      border-left: 1px solid #eee;
      border-right: 1px solid #eee;
    }
  }
}

.table_day {
  tr:nth-child(even) {
    border-bottom: 1px dashed #eee;
    border-left: 1px solid #eee;
    border-right: 1px solid #eee;
  }

  tr:nth-child(odd) {
    border-bottom: 1px solid #eee;
    border-left: 1px solid #eee;
    border-right: 1px solid #eee;
  }

  tr:nth-child(1) {
    border: 1px solid #ffffff;
  }

  tr {
    td:nth-child(1) {
      border: 1px solid #ffffff;
      border-right: 1px solid #eeeeee;
    }
  }
}

.td_border {
  border: none !important;
}

.table_content_td {
  position: relative;
  text-align: center;
}

.reservationDetails_week_box {
  top: 0;
  width: 100%;
  position: absolute;
}

.table_content {
  width: 100%;
  position: absolute;
  top: 0;
  display: flex;

  div {
    flex: 1;
  }
}
</style>
