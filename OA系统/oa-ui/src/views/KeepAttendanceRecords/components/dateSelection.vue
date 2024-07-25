<template>
  <!-- 时间选择 -->
  <div class="flex items-center relative">
    <img
      @click="prev"
      class="w-8px h-14px cursor-pointer"
      :src="getAssetsFile('keepAttend/arrow_left_icon.png')"
    />
    <div class="px-[0.94vw] cursor-pointer relative flex">
      <p @click="handleDateClick()" class="text-[#444] text-center truncate">{{ textDate }}</p>
      <div class="absolute dateSelect invisible -top-[14px]">
        <el-date-picker v-model="yearMonth" ref="datePicker" :type="type"
      /></div>
    </div>
    <img
      @click="next"
      class="w-8px h-14px transform rotate-180 cursor-pointer"
      :src="getAssetsFile('keepAttend/arrow_left_icon.png')"
    />
  </div>
</template>

<script setup lang="ts">
import getAssetsFile from '@/utils/pubUse'
import moment from 'moment'
import { ref, computed, watch, inject } from 'vue'

const props = defineProps({
  modelValue: {
    type: String,
    default: ''
  },
  type: {
    type: String,
    default: 'month'
  }
})

const eChartsDate: any = inject('eChartsDate')
const timer: any = inject('timer')

const emit = defineEmits(['update:modelValue', 'dateChange'])

const datePicker = ref()
const yearMonth = ref<any>()

const textDate = computed(() => {
  let date = yearMonth.value ? yearMonth.value : new Date()
  let text =
    moment(date).format('YYYY') +
    '年' +
    (props.type == 'month' ? moment(date).format('MM') + '月' : '')
  return text
})

const next = () => {
  let date = yearMonth.value ? moment(yearMonth.value).format('YYYY-MM-DD') : new Date()
  const currentMonth = Number(moment(date).format('MM'))
  // let nextMonthYear = currentMonth === 11 ? date.getFullYear() + 1 : date.getFullYear()
  let nextMonthYear: any = ''

  if (props.type == 'month') {
    nextMonthYear =
      currentMonth === 12
        ? Number(moment(date).format('YYYY')) + 1
        : Number(moment(date).format('YYYY'))
  }
  if (props.type == 'year') {
    nextMonthYear = Number(moment(date).format('YYYY')) + 1
  }
  let nextMonth = currentMonth === 12 ? 0 : currentMonth
  yearMonth.value =
    props.type == 'month'
      ? nextMonthYear + '-' + (nextMonth + 1 < 10 ? '0' + (nextMonth + 1) : nextMonth + 1)
      : props.type == 'year'
      ? nextMonthYear + '-' + (currentMonth + 1 < 10 ? '0' + (currentMonth + 1) : currentMonth + 1)
      : '--'
}

const dateSetting = (data) => {
  console.log('dateSetting==>', data)
  yearMonth.value = data
}

const prev = () => {
  let date = yearMonth.value ? moment(yearMonth.value).format('YYYY-MM-DD') : new Date()

  const currentMonth = Number(moment(date).format('MM'))
  let prevMonthYear: any = ''

  if (props.type == 'month') {
    prevMonthYear =
      currentMonth === 1
        ? Number(moment(date).format('YYYY')) - 1
        : Number(moment(date).format('YYYY'))
  }
  if (props.type == 'year') {
    prevMonthYear = Number(moment(date).format('YYYY')) - 1
  }

  let prevMonth = currentMonth === 1 ? 12 : currentMonth - 1
  yearMonth.value =
    props.type == 'month'
      ? prevMonthYear + '-' + (prevMonth < 10 ? '0' + prevMonth : prevMonth)
      : props.type == 'year'
      ? prevMonthYear + '-' + (currentMonth < 10 ? '0' + currentMonth : currentMonth)
      : '--'
}

watch(
  props.modelValue,
  (value) => {
    yearMonth.value = props.modelValue
  },
  { immediate: true }
)

watch(
  timer,
  (value) => {
    if (timer) {
      yearMonth.value = new Date(timer.value.clockinYear, timer.value.clockinMonth - 1)
    }
  },
  { immediate: true }
)

watch(
  textDate,
  (value) => {
    if (props.type == 'year') {
      yearMonth.value =
        new Date(yearMonth.value).getFullYear() + '-' + (new Date(props.modelValue).getMonth() + 1)
    }
    emit('update:modelValue', yearMonth.value)
    emit('dateChange', yearMonth.value)
  },
  { immediate: true }
)

const handleDateClick = () => {
  datePicker.value.handleOpen()
}

defineExpose({
  dateSetting
})
</script>

<style scoped>
:deep(.dateSelect .el-input) {
  width: 4.06vw !important;
}
</style>
