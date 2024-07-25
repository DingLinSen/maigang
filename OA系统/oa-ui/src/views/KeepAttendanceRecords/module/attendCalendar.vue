<template>
  <ContentWrap :isShowtitle="false" class="nomargin-contentWrap attendCalendar">
    <div class="bg-[#fff]" :class="minWidth ? 'h-771px' : '2xl:h-780px h-715px'">
      <div
        class="h-[51px] leading-[51px] border-b-1 border-[#EEF0F2] flex justify-between items-center"
        ><div class="flex">
          <div class="title">考勤日历 </div>
        </div>
        <ElButton
          v-hasPermi="'keepAttend:details:statistcs'"
          class="btn-other mr-[1.04vw]"
          @click="handle()"
          plain
        >
          考勤详细统计
        </ElButton>
      </div>
      <div class="px-[1.04vw] pb-24px">
        <div class="flex justify-between items-center h-55px">
          <div class="flex">
            <div class="flex cursor-pointer mr-5" style="align-items: center">
              <p
                class="cursor-pointer date-select 2xl:py-[0.35rem] 2xl:px-[1.5rem] py-[0.25rem] px-[0.9rem]"
                :class="tabFlag == 'month' ? 'choose-date' : ''"
                @click="tabClick('month')"
                >月</p
              >
              <p
                class="cursor-pointer date-select 2xl:py-[0.35rem] 2xl:px-[1.5rem] py-[0.25rem] px-[0.9rem]"
                :class="tabFlag == 'year' ? 'choose-date' : ''"
                @click="tabClick('year')"
                >年</p
              >
            </div>
            <DateSelection
              v-model="eChartsDate"
              :type="tabFlag == 'month' ? 'month' : 'year'"
              @date-change="dateChange"
              ref="dateSelectionRef"
            />
          </div>
          <ul class="flex"
            ><li
              @click="calenderInit(item.value)"
              class="min_title 2xl:ml-[0.18vw] ml-[0.1vw] flex items-center justify-center cursor-pointer py-[0.55vw] px-[0.25vw] 2xl:py-[0.55vw] 2xl:px-[0.35vw]"
              :class="chooseKpStatus === index ? 'choose-kp' : ''"
              v-for="(item, index) in kqStatus"
              :key="index"
            >
              <img
                class="w-14px h-14px 2xl:w-16px 2xl:h-16px mr-[0.1vw] 2xl:mr-[0.19vw]"
                :src="getAssetsFile(item.img)"
              />
              <p class="kq-status-title">{{ item.text }}</p></li
            ></ul
          >
        </div>
        <div class="flex h-42px bg-[#F7F8FA] items-center justify-between mb-12px pr-[0.89vw]">
          <div class="flex">
            <h3 class="px-[1.15vw] border-r-1">今日打卡</h3>
            <p class="ml-[0.94vw] flex items-center"
              >上班打卡
              <span class="ml-[0.47vw] flex items-center" v-if="todayData.attenceClockinTime">
                <img
                  class="w-16px h-16px mr-[0.19vw]"
                  :src="getAssetsFile('keepAttend/normal_icon.png')"
                />已打卡 {{ moment(todayData.attenceClockinTime).format('HH:mm:ss') }}
              </span>
              <span class="ml-[0.47vw] flex items-center" v-else
                ><img
                  class="w-16px h-16px mr-[0.19vw]"
                  :src="getAssetsFile('keepAttend/abnormal_icon.png')"
                />未打卡</span
              ></p
            >
            <p class="ml-[0.94vw] flex"
              >下班打卡
              <span class="ml-[0.47vw] flex items-center" v-if="todayData.attenceClockoutTime">
                <img
                  class="w-16px h-16px mr-[0.19vw]"
                  :src="getAssetsFile('keepAttend/normal_icon.png')"
                />已打卡 {{ moment(todayData.attenceClockoutTime).format('HH:mm:ss') }}
              </span>
              <span class="flex items-center ml-[0.47vw]" v-else
                ><img
                  class="w-16px h-16px mr-[0.19vw]"
                  :src="getAssetsFile('keepAttend/abnormal_icon.png')"
                />未打卡</span
              ></p
            ></div
          >
          <p>{{ moment(new Date()).format('YYYY-MM-DD') }} </p></div
        >

        <!-- :width="windowWidth < 1920 ? (collapse ? 'auto' : 95) : collapse ? 'auto' : 139" -->

        <el-table class="w-full attend-table" :data="wDate" border v-if="tabFlag == 'month'">
          <el-table-column
            :label="'周' + item + ' '"
            prop="date"
            v-for="(item, index) in weekList"
            :key="index"
            class="week-title"
          >
            <template #default="scope">
              <!-- <div
                v-if="!minWidth"
                class="pt-[14px] h-[102px] px-[12px]"
                :class="
                  tableDay == scope.row[index]?.day && scope.row[index]?.day != '' ? 'active' : ''
                "
                @click="dateClick(scope.row[index]?.day)"
              >
                <div v-if="scope.row[index]?.day">
                  <div class="flex justify-between items-center">
                    <p>
                      <img
                        v-if="scope.row[index].flag"
                        class="w-16px h-16px mr-[0.19vw]"
                        :src="getImg(scope.row[index].exceptions[0])"
                      />
                    </p>
                    <p class="mr-[0.45vw] text-lg">{{
                      scope.row[index]?.day < 10
                        ? '0' + scope.row[index]?.day
                        : scope.row[index]?.day
                    }}</p>
                  </div>
                  <p
                    v-if="scope.row[index].attenceClockinTime"
                    :class="scope.$index ? 'mt-[7px]' : 'mt-[2px]'"
                    class="text-xs bg-[#ECEFF5] rounded text-center"
                    >签到：{{ getDateHHMMSS(scope.row[index].attenceClockinTime) }}</p
                  >
                  <p
                    class="mt-6px text-xs bg-[#ECEFF5] rounded text-center"
                    v-if="scope.row[index].attenceClockoutTime"
                    >签退：{{ getDateHHMMSS(scope.row[index].attenceClockoutTime) }}
                  </p>
                </div>
              </div> -->
              <div
                class="pt-[8px] 2xl:px-[6px] px-[2px]"
                :class="
                  (tableDay == scope.row[index]?.day && scope.row[index]?.day != ''
                    ? 'active'
                    : '') + '2xl:h-[82px] h-[82px] '
                "
                @click="dateClick(scope.row[index]?.day)"
              >
                <div v-if="scope.row[index]?.day">
                  <div class="flex justify-between items-center">
                    <div>
                      <p class="kq-status-img 2xl:ml-0 ml-5px" v-if="scope.row[index].exceptions">
                        <img
                          :title="
                            imgItem === '1'
                              ? '迟到'
                              : imgItem === '2'
                              ? '早退'
                              : imgItem === '3'
                              ? '漏签'
                              : imgItem === '4'
                              ? '旷工'
                              : imgItem === '5'
                              ? '请假'
                              : imgItem === '6'
                              ? '外出'
                              : imgItem === '7'
                              ? '出差'
                              : imgItem === '8'
                              ? '加班'
                              : ''
                          "
                          v-for="(imgItem, imgIndex) in scope.row[index].exceptions"
                          :key="imgIndex"
                          class="w-16px h-16px mr-[0.19vw]"
                          :src="getImg(imgItem)"
                        />
                      </p>
                    </div>
                    <p class="mr-[0.25vw] kq-form-date">{{
                      scope.row[index]?.day < 10
                        ? '0' + scope.row[index]?.day
                        : scope.row[index]?.day
                    }}</p>
                  </div>
                  <!-- <p class="text-xs bg-[#ECEFF5] rounded text-center mt-[5px]">签到：{{ 11111 }}</p>
                  <p class="text-xs bg-[#ECEFF5] rounded text-center mt-[7px]">签退：{{ 11111 }}</p> -->
                  <div class="hidden 2xl:block k_sign">
                    <p
                      v-if="scope.row[index].attenceClockinTime"
                      :class="scope.$index ? 'mt-[7px]' : 'mt-[2px]'"
                      class="bg-[#ECEFF5] rounded text-center sign-info text-13px py-2px"
                      >签到：{{ getDateHHMMSS(scope.row[index].attenceClockinTime) }}</p
                    >
                    <p
                      class="mt-6px bg-[#ECEFF5] rounded text-center sign-info text-13px py-2px"
                      v-if="scope.row[index].attenceClockoutTime"
                      >签退：{{ getDateHHMMSS(scope.row[index].attenceClockoutTime) }}
                    </p>
                  </div>
                  <div class="block 2xl:hidden">
                    <p
                      v-if="scope.row[index].attenceClockinTime"
                      :class="scope.$index ? 'mt-[7px]' : 'mt-[2px]'"
                      class="bg-[#ECEFF5] rounded text-center sign-info text-13px py-2px"
                      >签到：{{ getDateHHMMSS(scope.row[index].attenceClockinTime) }}</p
                    >
                    <p
                      class="mt-6px bg-[#ECEFF5] rounded text-center sign-info text-13px py-2px"
                      v-if="scope.row[index].attenceClockoutTime"
                      >签退：{{ getDateHHMMSS(scope.row[index].attenceClockoutTime) }}
                    </p>
                  </div>
                </div>
              </div>
            </template>
          </el-table-column>
        </el-table>
        <div v-if="tabFlag == 'year'" class="pt-10px">
          <YearSelection @month-click="monthClick" />
        </div>
      </div>
    </div>
  </ContentWrap>
</template>

<script setup lang="ts">
import { ContentWrap } from '@/components/ContentWrap'
import getAssetsFile from '@/utils/pubUse'
import { useAppStore } from '@/store/modules/app'
import { DateSelection, YearSelection } from '../components'
import { getAllAttApi } from '@/api/assessment/statistics'
import { ref, provide, inject, watch, onMounted, nextTick, computed, onUnmounted } from 'vue'
import moment from 'moment'

const eChartsDate = ref(new Date())
const tableDay = ref(new Date().getDate())
const props = defineProps({
  userId: {
    type: String,
    default: ''
  },
  minWidth: {
    type: Boolean,
    default: false
  }
})

const appStore = useAppStore()

const collapse = computed(() => appStore.getCollapse)
const timer: any = inject('timer')
watch(
  timer,
  (value) => {
    if (timer) {
      console.log(timer)
      eChartsDate.value = new Date(timer.value.clockinYear, timer.value.clockinMonth - 1)
    }
  },
  { immediate: true }
)

watch(
  collapse.value,
  (value) => {
    console.log(collapse.value)
  },
  { immediate: true }
)

const windowWidth = ref(window.innerWidth) // 初始化窗口宽度

const handleResize = () => {
  windowWidth.value = window.innerWidth // 更新窗口宽度值
}

onMounted(() => {
  window.addEventListener('resize', handleResize) // 监听窗口大小变化
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize) // 移除事件监听
})
const calendarLoading = ref(false)
const emit = defineEmits(['handle', 'dateChange'])
const dateSelectionRef = ref()
const wDate = ref([])
const yearData = ref([])
const tabFlag = ref('month')
const todayData = ref<any>({
  attenceClockinTime: '',
  attenceClockoutTime: ''
})
const kqStatus = ref([
  {
    text: '全部',
    img: 'keepAttend/all_icon.png',
    value: null
  },
  {
    text: '迟到',
    img: 'keepAttend/cd_icon.png',
    value: 1
  },
  {
    text: '早退',
    img: 'keepAttend/zt_icon.png',
    value: 2
  },
  {
    text: '漏签',
    img: 'keepAttend/lq_icon.png',
    value: 3
  },
  {
    text: '旷工',
    img: 'keepAttend/kg_icon.png',
    value: 4
  },
  {
    text: '请假',
    img: 'keepAttend/qj_icon.png',
    value: 5
  },
  {
    text: '外出',
    img: 'keepAttend/wc_icon.png',
    value: 6
  },
  {
    text: '出差',
    img: 'keepAttend/cc_icon.png',
    value: 7
  },
  {
    text: '加班',
    img: 'keepAttend/jb_icon.png',
    value: 8
  }
])

const getImg = (value: string): string => {
  let img = ''
  kqStatus.value.map((item: any) => {
    if (value == item.value) {
      img = item.img
    }
  })
  return getAssetsFile(img)
}
const chooseKpStatus = ref(0) // 获取选中的kp状态
const deUserId = ref()
const weekList = ref(['一', '二', '三', '四', '五', '六', '日'])
const calenderInit = async (type?: any, id?: any) => {
  let data = {}
  if (type) {
    data = {
      exceptionsString: type,
      userId: id ? id : props.userId,
      clockinMonth: tabFlag.value == 'month' ? new Date(eChartsDate.value).getMonth() + 1 : '',
      clockinYear: new Date(eChartsDate.value).getFullYear()
    }
    chooseKpStatus.value = type
  } else {
    data = {
      userId: id ? id : props.userId,
      clockinMonth: tabFlag.value == 'month' ? new Date(eChartsDate.value).getMonth() + 1 : '',
      clockinYear: new Date(eChartsDate.value).getFullYear()
    }
    chooseKpStatus.value = 0
  }

  calendarLoading.value = true
  deUserId.value = id ? id : props.userId
  let res = await getAllAttApi(data)
  if (res && res.data) {
    res.data.forEach((v) => {
      if (v.clockinDate == moment(new Date()).format('YYYY-MM-DD')) {
        todayData.value = v
      }
    })
    if (tabFlag.value == 'month') {
      getMonthDay(res.data)
    } else {
      yearData.value = res.data
    }
    calendarLoading.value = false
  }
}

// calenderInit()
provide('yearData', yearData)
provide('eChartsDate', eChartsDate)

const dateClick = (day) => {
  tableDay.value = day
}

const handle = () => {
  let data = {
    userId: props.userId,
    clockinMonth: new Date(eChartsDate.value).getMonth() + 1,
    clockinYear: new Date(eChartsDate.value).getFullYear()
  }
  emit('handle', data)
}
// 获取月
const getMonthDay = (data) => {
  // 获取当前日期
  let currentDate = new Date(eChartsDate.value)
  // 获取本月的第一天
  let firstDayOfMonth: any = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1)
  // 获取下个月的第一天
  let firstDayOfNextMonth: any = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1)
  // 计算本月的天数
  let numberOfDays = Math.round((firstDayOfNextMonth - firstDayOfMonth) / (1000 * 60 * 60 * 24))
  // 创建日期数组
  let dates: any = []
  for (var i = 0; i < numberOfDays; i++) {
    let date = new Date(currentDate.getFullYear(), currentDate.getMonth(), i + 1)
    dates.push({
      day: i + 1,
      week: date.getDay() == 0 ? 7 : date.getDay()
    })
  }

  if (dates.length) {
    if (data.length) {
      dates = dates.map((v) => {
        let a = {
          day: v.day,
          week: v.week
        }
        data.forEach((j) => {
          if (v.day == new Date(j.clockinDate).getDate()) {
            a = { ...a, ...j }
          }
        })
        return a
      })
    }

    let beforeArr: any = []
    let afterArr: any = []

    if (dates[0].week !== 1) {
      beforeArr = new Array(Number(dates[0].week) - 1).fill({
        day: '',
        week: ''
      })
    }
    if (dates[dates.length - 1].week !== 1) {
      afterArr = new Array(7 - Number(dates[dates.length - 1].week)).fill({
        day: '',
        week: ''
      })
    }

    dates = [...beforeArr, ...dates, ...afterArr]
    console.log('dates==>', dates)

    let newArray = []
    for (let i = 0; i < dates.length; i += 7) {
      newArray.push(dates.slice(i, i + 7))
    }

    if (newArray.length != 6) {
      newArray.push(
        new Array(7).fill({
          day: '',
          week: ''
        })
      )
    }
    wDate.value = newArray
  }
}

//获取年
const getYear = () => {}

// 获取时分秒
const getDateHHMMSS = (format) => {
  const date = new Date(format)
  const starHours = date.getHours().toString().padStart(2, '0')
  const starMinutes = date.getMinutes().toString().padStart(2, '0')
  const starSeconds = date.getSeconds().toString().padStart(2, '0')
  format = `${starHours}:${starMinutes}:${starSeconds}`
  return format
}

//点击月跳转到当前月
const monthClick = (data) => {
  tabFlag.value = 'month'
  eChartsDate.value = new Date(data)
  dateSelectionRef.value.dateSetting(eChartsDate.value)
}

const dateChange = () => {
  if (tabFlag.value == 'month') {
    emit('dateChange', eChartsDate.value)
  }
  calenderInit()
}

const tabClick = (data) => {
  tabFlag.value = data
  // calenderInit()
}

const unifiedTime = async (date: any) => {
  if (tabFlag.value == 'month') {
    if (dateSelectionRef.value) {
      dateSelectionRef.value.dateSetting(date)
    }
  }
}

defineExpose({
  calenderInit,
  unifiedTime
})
</script>

<style lang="less" scoped>
.attend-table {
  width: 100%;
  font-size: 14px;
}
:deep(.el-table__row) {
  background: #fff !important;
}
:deep(.el-table__cell) {
  background: #fff !important;
  cursor: pointer !important;
}
:deep(.el-table__cell:hover) {
  background: rgb(230, 247, 255) !important;
}
:deep(.el-table__cell:hover .xh) {
  color: rgb(230, 247, 255) !important;
}
:deep(.el-table__row:hover) {
  background-color: transparent !important;
}

.active {
  background: rgb(230, 247, 255) !important;
}
.title {
  font-size: 16px;
  margin: 0 13px;
  padding: 0 5px;
  font-family: Alibaba PuHuiTi R;
  font-weight: 400;
  color: #333333;
}
</style>

<style lang="less">
.attendCalendar {
  .cell {
    text-align: right !important;
  }
  .el-table--default .el-table__cell {
    padding: 0 !important;
  }
  .cell {
    margin: 0 !important;
    padding: 0 !important;
    height: 100% !important;
  }
  thead {
    height: 40px;
    th {
      border-right: 0 !important;
      .cell {
        padding-right: 10px !important;
        font-weight: 500 !important;
        color: #333 !important;
        font-family: Alibaba PuHuiTi R !important;
      }
    }
  }
}

.date-select {
  // max-height: 34px;
  background: #f7f8fa;
  border-radius: 2px;
  font-size: 1rem;
  font-weight: 400;
  color: #191919;
  font-family: Alibaba PuHuiTi R;
}
.kq-status-title {
  font-size: 14px;
  line-height: 0.91rem;
}
.choose-date {
  background: #eaf4f8;
  color: #00a0e9;
  font-family: Alibaba PuHuiTi M;
  font-weight: 500;
}
.kp-status {
  padding: 0.55rem 0.53rem 0.55rem 0.65rem;
}
.choose-kp {
  background: #eaf4f8;
  border-radius: 4px;
}
.kq-status-img {
  flex: 1;
  display: flex;
  text-align: left;
  overflow: hidden;
  max-width: 56px;
}
.week-title {
  font-size: 0.91rem;
  font-weight: 500;
  color: #333;
  font-family: Alibaba PuHuiTi M;
}
.kq-form-date {
  text-align: right;
  font-size: 16px;
  font-family: Alibaba PuHuiTi M;
  font-weight: 500;
  color: #333333;
}
.sign-info {
  font-family: Alibaba PuHuiTi R;
  font-weight: 400;
  color: #333333;
}
@media (min-width: 1536px) and (max-width: 1919px) {
  .min_title {
    padding: 0.55vw 0.25vw;
    margin-left: 0.1vw;
  }
  .k_sign {
    p {
      font-size: 12px;
    }
  }
}

// @media screen and (max-width: 1280px) {
//   .text-base-title {
//     font-size: 1rem !important;
//   }
//   .text-base {
//     font-size: 1rem !important;
//   }
//   .kq-status-title {
//     font-size: 14px;
//   }
// }
// @media screen and (max-width: 1920px) {
// }
</style>
