<template>
  <!-- 时间选择 -->
  <div class="flex flex-wrap 2xl:mt-20px mt-5px">
    <div
      class="relative flex justify-center items-center flex-col w-1/4 2xl:mb-15px cursor-pointer"
      v-for="(item, ind) in allYearData"
      :Key="ind"
      @click="monthClick(ind)"
    >
      <div class="mb-5px">{{ ind + 1 }}月</div>
      <div class="flex">
        <div v-for="(it, index) in weekList" :key="index" class="flex flex-col">
          <div class="2xl:w-25px 2xl:h-24px w-20px h-20px flex justify-center items-center">{{
            it
          }}</div>
          <div
            class="2xl:w-25px 2xl:h-21px w-20px h-20px flex justify-center items-center"
            v-for="(t, i) in item"
            :key="i"
          >
            <img
              :title="t[index]?.clockinDate"
              v-if="t[index]?.flag"
              class="w-16px h-16px mr-[0.19vw]"
              :src="getImg(t[index]?.exceptions[0])"
            />
            <span v-else>{{ t[index]?.day }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import getAssetsFile from '@/utils/pubUse'
import { ref, computed, watch, inject } from 'vue'
const emit = defineEmits(['monthClick'])

const props = defineProps({
  modelValue: {
    type: String,
    default: ''
  }
})

const yearData: any = inject('yearData')
const year: any = inject('eChartsDate')
const allYearData = ref<any>([])
const wDate = ref([])
const getMonthDay = (mouth) => {
  let newArray = []
  // 获取当前日期
  let date = new Date(year.value).getFullYear() + '-' + mouth
  let currentDate = new Date(date)
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
    if (yearData.value.length) {
      dates = dates.map((v) => {
        let a = {
          day: v.day,
          week: v.week
        }
        yearData.value.forEach((j) => {
          if (
            v.day == new Date(j.clockinDate).getDate() &&
            mouth == new Date(j.clockinDate).getMonth() + 1 &&
            new Date(year.value).getFullYear() == new Date(j.clockinDate).getFullYear()
          ) {
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
  }

  return newArray
}
const weekList = ref(['一', '二', '三', '四', '五', '六', '日'])
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
    text: '矿工',
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

const monthClick = (ind) => {
  let data = new Date(year.value).getFullYear() + '-' + (ind < 9 ? '0' + (ind + 1) : ind + 1)
  emit('monthClick', data)
}

watch(
  [yearData, year],
  (value) => {
    if (year) {
      let arr = []
      for (var i = 1; i <= 12; i++) {
        arr.push(getMonthDay(i))
      }
      allYearData.value = arr
    }
  },
  { immediate: true }
)
</script>

<style scoped>
:deep(.dateSelect .el-input) {
  width: 4.06vw !important;
}
</style>
