<template>
  <div>
    <div class="h-[40px] date-content flex items-center pl-11px">
      <DateSelection v-model="eChartsDate" @date-change="dateChange" ref="dateSelectionRef" />
    </div>
    <ContentWrap :isShowtitle="false" class="nomargin-contentWrap attendStatis_contentWrap">
      <div class="bg-[#fff]" :class="minWidth ? 'h-542px' : '2xl:h-474px h-430px'">
        <div class="h-[51px] leading-[51px] border-b-1 border-[#EEF0F2] mx-[1.04vw] mb-19px">
          <div class="title">出勤统计 </div>
        </div>
        <section v-if="minWidth" class="bg-[#fff]">
          <div class="flex 2xl:mb-25px mb-15px">
            <div class="2xl:ml-[1.67vw] ml-[0.55vw]">
              <CircularProportion
                :width="73"
                :height="73"
                :day="moudleDatailData.realDays ? moudleDatailData.realDays : 0"
              />
            </div>
            <div
              class="flex flex-col justify-center items-start 2xl:ml-[2.19vw] ml-[0.59vw] text-[#333]"
            >
              <p class="mb-8px"
                >实际出勤
                <span>{{ moudleDatailData.realDays ? moudleDatailData.realDays : 0 }}天</span>
                占
                <span
                  >{{
                    Math.round(
                      (Number(moudleDatailData.realDays) / Number(moudleDatailData.shouldDays)) *
                        10000
                    ) / 100
                  }}%</span
                >
              </p>
              <p
                >未出勤
                <span>{{ moudleDatailData.miss ? moudleDatailData.miss : 0 }}天</span>
                占
                <span
                  >{{
                    Math.round(
                      (Number(moudleDatailData.miss) / Number(moudleDatailData.shouldDays)) * 10000
                    ) / 100
                  }}%</span
                >
              </p>
            </div>
          </div>
          <div class="flex justify-between items-center 2xl:px-[2.03vw] px-[0.75vw] mb-25px">
            <div class="cursor-pointer" @click="getDetail(2)">
              <CircularProportion
                :width="65"
                :height="65"
                :day="moudleDatailData.evection ? moudleDatailData.evection : 0"
                :fontSize="13"
              />
              <p class="mt-8px text-center">本月出差</p>
            </div>
            <div class="cursor-pointer" @click="getDetail(4)">
              <CircularProportion
                :width="65"
                :height="65"
                :day="moudleDatailData.egress ? moudleDatailData.egress : 0"
                :fontSize="13"
              />
              <p class="mt-8px text-center">本月外出</p>
            </div>
            <div class="cursor-pointer" @click="getDetail(3)">
              <CircularProportion
                :width="65"
                :height="65"
                :day="
                  moudleDatailData.restOvertime
                    ? Math.round((Number(moudleDatailData.restOvertime) / 7) * 100) / 100
                    : 0
                "
                :fontSize="13"
              />
              <p class="mt-8px text-center">本月加班</p>
            </div>
          </div>
          <div
            class="bg-[#F7F8FA] mb-10px 2xl:mx-[1.04vw] 2xl:px-[0.83vw] mx-[0.55vw] px-[0.55vw] 2xl:py-17px py-8px"
            >本月应出勤<b class="text-[#00A0E9]">{{
              moudleDatailData.shouldDays ? moudleDatailData.shouldDays : 0
            }}</b
            >天，<span class="hidden 2xl:inline-block"
              >实际出勤<b class="text-[#00A0E9]">{{
                moudleDatailData.realDays ? moudleDatailData.realDays : 0
              }}</b
              >天，</span
            >未出勤<b class="text-[#FF5252]">{{
              moudleDatailData.miss ? moudleDatailData.miss : 0
            }}</b
            >天；<span class="hidden 2xl:inline-block"
              >出差<b class="text-[#00A0E9]">{{
                moudleDatailData.evection ? moudleDatailData.evection : 0
              }}</b
              >天；外出<b class="text-[#00A0E9]">{{
                moudleDatailData.egress ? moudleDatailData.egress : 0
              }}</b
              >天；加班<b class="text-[#00A0E9]">{{
                moudleDatailData.restOvertime
                  ? Math.round((Number(moudleDatailData.restOvertime) / 7) * 100) / 100
                  : 0
              }}</b
              >天</span
            ></div
          >
        </section>
        <section v-else>
          <!-- 大屏幕 -->
          <div class="px-[1.04vw] mb-20px block md:hidden 2xl:block">
            <div class="h-168px flex items-center">
              <div class="w-158px border-r-1 flex justify-center flex-col items-center"
                ><CircularProportion
                  :day="moudleDatailData.realDays ? moudleDatailData.realDays : 0"
                />
                <p class="mt-8px">实际出勤</p></div
              >
              <div
                class="w-158px flex justify-center flex-col items-center cursor-pointer"
                @click="getDetail(2)"
                ><CircularProportion
                  :day="moudleDatailData.evection ? moudleDatailData.evection : 0"
                />
                <p class="mt-8px">本月出差</p></div
              >
              <div
                class="w-158px flex justify-center flex-col items-center cursor-pointer"
                @click="getDetail(4)"
                ><CircularProportion :day="moudleDatailData.egress ? moudleDatailData.egress : 0" />
                <p class="mt-8px">本月外出</p></div
              >
              <div
                class="w-158px flex justify-center flex-col items-center cursor-pointer"
                @click="getDetail(3)"
                ><CircularProportion
                  :day="
                    moudleDatailData.restOvertime
                      ? Math.round((Number(moudleDatailData.restOvertime) / 7) * 100) / 100
                      : 0
                  "
                />
                <p class="mt-8px">本月加班</p></div
              >
            </div>
            <div class="h-44px flex items-center justify-center bg-[#F7F8FA] mb-4px"
              >本月应出勤<b class="text-[#00A0E9]">{{
                moudleDatailData.shouldDays ? moudleDatailData.shouldDays : 0
              }}</b
              >天，实际出勤<b class="text-[#00A0E9]">{{
                moudleDatailData.realDays ? moudleDatailData.realDays : 0
              }}</b
              >天，未出勤<b class="text-[#FF5252]">{{
                moudleDatailData.miss ? moudleDatailData.miss : 0
              }}</b
              >天<span class="hidden_title"
                >；出差<b class="text-[#00A0E9]">{{
                  moudleDatailData.evection ? moudleDatailData.evection : 0
                }}</b
                >天；外出<b class="text-[#00A0E9]">{{
                  moudleDatailData.egress ? moudleDatailData.egress : 0
                }}</b
                >天；加班<b class="text-[#00A0E9]">{{
                  moudleDatailData.restOvertime
                    ? Math.round((Number(moudleDatailData.restOvertime) / 7) * 100) / 100
                    : 0
                }}</b
                >天</span
              ></div
            >
          </div>
          <!-- 小屏幕 -->
          <div class="px-[1.04vw] mb-10px hidden md:block 2xl:hidden">
            <div class="h-128px flex items-center">
              <div class="w-158px border-r-1 flex justify-center flex-col items-center"
                ><CircularProportion
                  :width="65"
                  :height="65"
                  :day="moudleDatailData.realDays ? moudleDatailData.realDays : 0"
                />
                <p class="mt-8px">实际出勤</p></div
              >
              <div
                class="w-158px flex justify-center flex-col items-center cursor-pointer"
                @click="getDetail(2)"
                ><CircularProportion
                  :width="55"
                  :height="55"
                  :day="moudleDatailData.evection ? moudleDatailData.evection : 0"
                />
                <p class="mt-8px">本月出差</p></div
              >
              <div
                class="w-158px flex justify-center flex-col items-center cursor-pointer"
                @click="getDetail(4)"
                ><CircularProportion
                  :width="55"
                  :height="55"
                  :day="moudleDatailData.egress ? moudleDatailData.egress : 0"
                />
                <p class="mt-8px">本月外出</p></div
              >
              <div
                class="w-158px flex justify-center flex-col items-center cursor-pointer"
                @click="getDetail(3)"
                ><CircularProportion
                  :width="55"
                  :height="55"
                  :day="
                    moudleDatailData.restOvertime
                      ? Math.round((Number(moudleDatailData.restOvertime) / 7) * 100) / 100
                      : 0
                  "
                />
                <p class="mt-8px">本月加班</p></div
              >
            </div>
            <div class="py-8px px-15px bg-[#F7F8FA] mb-4px text-center"
              >本月应出勤<b class="text-[#00A0E9]">{{
                moudleDatailData.shouldDays ? moudleDatailData.shouldDays : 0
              }}</b
              >天，实际出勤<b class="text-[#00A0E9]">{{
                moudleDatailData.realDays ? moudleDatailData.realDays : 0
              }}</b
              >天，未出勤<b class="text-[#FF5252]">{{
                moudleDatailData.miss ? moudleDatailData.miss : 0
              }}</b
              >天<span class="hidden 2xl:inline-block"
                >；出差<b class="text-[#00A0E9]">{{
                  moudleDatailData.evection ? moudleDatailData.evection : 0
                }}</b
                >天；外出<b class="text-[#00A0E9]">{{
                  moudleDatailData.egress ? moudleDatailData.egress : 0
                }}</b
                >天；加班<b class="text-[#00A0E9]">{{
                  moudleDatailData.restOvertime
                    ? Math.round((Number(moudleDatailData.restOvertime) / 7) * 100) / 100
                    : 0
                }}</b
                >天</span
              ></div
            >
          </div>
        </section>
        <div class="h-[51px] leading-[51px] border-b-1 border-[#EEF0F2] mx-[1.04vw] mb-9px">
          <div class="title">考勤异常统计 </div>
        </div>
        <div class="mx-[0.75vw] 2xl:mx-[1.04vw] bg-[#F7F8FA]">
          <div
            class="h-82px flex items-center justify-between"
            :class="minWidth ? 'px-[1.72vw]' : 'px-[2vw]'"
          >
            <p
              class="flex flex-col items-center justify-center cursor-pointer"
              @click="getWorkOrderDetail(1)"
            >
              <span class="text-[#00A0E9]"
                ><b class="text-xl">{{ moudleDatailData.late ? moudleDatailData.late : 0 }}</b
                >次</span
              >
              <span>迟到</span>
            </p>
            <p
              class="flex flex-col items-center justify-center cursor-pointer"
              @click="getWorkOrderDetail(2)"
            >
              <span class="text-[#00A0E9]"
                ><b class="text-xl">{{
                  moudleDatailData.premature ? moudleDatailData.premature : 0
                }}</b
                >次</span
              >
              <span>早退</span>
            </p>
            <p
              class="flex flex-col items-center justify-center cursor-pointer"
              @click="getWorkOrderDetail(4)"
            >
              <span class="text-[#00A0E9]"
                ><b class="text-xl">{{
                  moudleDatailData.absenteeism ? moudleDatailData.absenteeism : 0
                }}</b
                >次</span
              >
              <span>旷工</span>
            </p>
            <p
              class="flex flex-col items-center justify-center cursor-pointer"
              @click="getDetail(1)"
            >
              <span class="text-[#00A0E9]"
                ><b class="text-xl">{{ moudleDatailData.leave ? moudleDatailData.leave : 0 }}</b
                >次</span
              >
              <span>请假</span>
            </p>
          </div>
        </div>
      </div>
    </ContentWrap>
  </div>
</template>

<script setup lang="ts">
import { ContentWrap } from '@/components/ContentWrap'
import { ref, inject, watch } from 'vue'
import { CircularProportion, DateSelection } from '../components'
import { getDetailsApi } from '@/api/assessment/statistics'
import moment from 'moment'

const eChartsDate = ref(new Date())

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

const timer: any = inject('timer')
watch(
  timer,
  (value) => {
    if (timer) {
      eChartsDate.value = new Date(timer.value.clockinYear, timer.value.clockinMonth - 1)
    }
  },
  { immediate: true }
)

const emit = defineEmits(['getDetail', 'getWorkOrderDetail', 'dateChange'])
const moudleDatailData = ref<any>({})

const detailsData: any = inject('detailsData')

const dateChange = async (date) => {
  if (!date) return false
  emit('dateChange', date)
  let data = {
    userId: props.userId,
    clockinMonth: new Date(date).getMonth() + 1,
    clockinYear: new Date(date).getFullYear()
  }
  const res = await getDetailsApi(data)
  if (res && res.data) {
    moudleDatailData.value = res.data
  }
}

const dateSelectionRef = ref()
const unifiedTime = async (date: any) => {
  if (dateSelectionRef.value) {
    dateSelectionRef.value.dateSetting(date)
  }
}

//
const getDetail = (type) => {
  let data = {
    workOrderType: type,
    userId: props.userId,
    clockinMonth: new Date(eChartsDate.value).getMonth() + 1,
    clockinYear: new Date(eChartsDate.value).getFullYear()
  }
  emit('getDetail', data)
}

//工单
const getWorkOrderDetail = (type) => {
  let data = {
    exceptionsString: type,
    userId: props.userId,
    clockinMonth: new Date(eChartsDate.value).getMonth() + 1,
    clockinYear: new Date(eChartsDate.value).getFullYear()
  }
  emit('getWorkOrderDetail', data)
}
watch(
  detailsData,
  (value) => {
    if (detailsData.value) {
      moudleDatailData.value = detailsData.value
    }
  },
  { immediate: true }
)

defineExpose({
  unifiedTime
})
</script>

<style lang="less" scoped>
.title {
  font-size: 16px;
  padding: 0 5px;
  font-family: Alibaba PuHuiTi R;
  font-weight: 400;
  color: #333333;
}
.date-content {
  background: rgba(255, 255, 255, 0.6);
  border-radius: 4px 4px 0 0;
}
@media (min-width: 1536px) and (max-width: 1919px) {
  .hidden_title {
    display: none;
  }
}
</style>

<style>
.attendStatis_contentWrap {
  border-radius: 0 !important;
}
</style>
