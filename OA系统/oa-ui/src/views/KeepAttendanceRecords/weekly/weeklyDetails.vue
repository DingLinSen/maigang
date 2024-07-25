<template>
  <DrawerWrap
    :title="darwerTitle"
    :isShow="isShow"
    ref="drawerWrap"
    class="daily-details-drawer-wrap"
  >
    <template #content>
      <el-form
        :model="ruleForm"
        :rules="rules"
        ref="formRef"
        label-position="top"
        label-width="100px"
        class="demo-ruleForm"
      >
        <div class="mb-10px rounded bg-[#fff] px-[1.04vw] py-20px">
          <el-row>
            <el-col :span="6" class="mr-[1.04vw]">
              <el-form-item label="月份" prop="yearMonthValue">
                <el-date-picker
                  :disabled-date="bookDateEndLimit"
                  class="date-picker"
                  v-model="ruleForm.yearMonthValue"
                  type="month"
                  @change="monthChange"
                  format="YYYY-MM"
                  :disabled="pageFlag == 'see' || yearMonthValueFlag"
                  value-format="YYYY-MM"
                  placeholder="请选择月份"
                />
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="考核周" prop="weekValue">
                <el-select
                  v-model="ruleForm.weekValue"
                  class="w-full"
                  :disabled="pageFlag == 'see'"
                  @change="weekChange"
                  fit-input-width
                  placeholder="请选择考核周"
                >
                  <el-option
                    v-for="it in weekSelect"
                    :key="it.value"
                    :label="it.label"
                    :disabled="it.disabled"
                    :value="it.value"
                  />
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
        </div>
        <div class="rounded bg-[#fff] px-[1.04vw] py-10px pb-20px mb-20px">
          <ContentTable
            :isDelAction="pageFlag == 'see'"
            ref="zbbz"
            :actionWidth="140"
            :selectData="allMonthSelect"
            :title="'本周工作总结'"
            :headerTitle="headerTitle"
            v-model="ruleForm.completeWeek"
          >
            <template #workItems="{ item, field }">
              <el-input
                type="textarea"
                autosize
                rows="1"
                maxlength="2000"
                v-model="item[field]"
                placeholder="请输入工作事项"
              />
            </template>
            <template #startTime="{ item, field, index }">
              <el-date-picker
                :prefix-icon="false"
                v-model="item[field]"
                class="date-picker"
                type="date"
                :disabled-date="startTimeDisabled.bind(null, index, 'completeWeek', 'start')"
                format="YYYY-MM-DD"
                value-format="YYYY-MM-DD"
                placeholder="请选择开始时间"
              />
            </template>
            <template #endTime="{ item, field, index }">
              <el-date-picker
                v-model="item[field]"
                class="date-picker"
                :disabled-date="startTimeDisabled.bind(null, index, 'completeWeek', 'end')"
                type="date"
                format="YYYY-MM-DD"
                value-format="YYYY-MM-DD"
                placeholder="请选择结束时间"
              />
            </template>
            <template #finishTime="{ item, field, index }">
              <el-date-picker
                v-model="item[field]"
                class="date-picker"
                type="date"
                :disabled-date="startTimeDisabled.bind(null, index, 'completeWeek', 'finish')"
                format="YYYY-MM-DD"
                value-format="YYYY-MM-DD"
                placeholder="请选择实际完成时间"
              />
            </template>
            <template #players="{ item, field }">
              <el-input
                type="input"
                rows="1"
                maxlength="100"
                v-model="item[field]"
                placeholder="请输入参与人"
              />
            </template>
            <template #assessmentDetailId="{ item, field, index }">
              <el-tree-select
                filterable
                clearable
                @change="handleNodeChange($event, index, 'completeWeek')"
                v-model="item[field]"
                :data="allMonthSelect"
                :render-after-expand="false"
              />
            </template>
            <template #action="{ item, index }">
              <span class="cursor-pointer text-blue-500" @click="noComplete('completeWeek', index)">
                未完成</span
              >
            </template>
          </ContentTable>
        </div>
        <div class="rounded bg-[#fff] px-[1.04vw] py-10px pb-20px mb-20px">
          <ContentTable
            :isDelAction="pageFlag == 'see'"
            ref="zbwwc"
            :selectData="allMonthSelect"
            :actionWidth="140"
            :title="'本周未完成工作总结'"
            :headerTitle="headerTitle"
            v-model="ruleForm.incompleteWeek"
          >
            <template #workItems="{ item, field }">
              <el-input
                type="textarea"
                autosize
                rows="1"
                maxlength="2000"
                v-model="item[field]"
                placeholder="请输入工作事项"
              />
            </template>
            <template #startTime="{ item, field, index }">
              <el-date-picker
                v-model="item[field]"
                class="date-picker"
                :disabled-date="startTimeDisabled.bind(null, index, 'incompleteWeek', 'start')"
                type="date"
                format="YYYY-MM-DD"
                value-format="YYYY-MM-DD"
                placeholder="请选择开始时间"
              />
            </template>
            <template #endTime="{ item, field, index }">
              <el-date-picker
                v-model="item[field]"
                class="date-picker"
                type="date"
                :disabled-date="startTimeDisabled.bind(null, index, 'incompleteWeek', 'end')"
                format="YYYY-MM-DD"
                value-format="YYYY-MM-DD"
                placeholder="请选择结束时间"
              />
            </template>
            <template #finishTime="{ item, field, index }">
              <el-date-picker
                v-model="item[field]"
                class="date-picker"
                type="date"
                :disabled-date="startTimeDisabled.bind(null, index, 'incompleteWeek', 'finish')"
                format="YYYY-MM-DD"
                value-format="YYYY-MM-DD"
                placeholder="请选择实际完成时间"
              />
            </template>
            <template #players="{ item, field }">
              <el-input
                type="input"
                rows="1"
                maxlength="100"
                v-model="item[field]"
                placeholder="请输入参与人"
              />
            </template>
            <template #assessmentDetailId="{ item, field, index }">
              <el-tree-select
                filterable
                clearable
                @change="handleNodeChange($event, index, 'incompleteWeek')"
                v-model="item[field]"
                :data="allMonthSelect"
                :render-after-expand="false"
              />
            </template>
            <template #action="{ item, index }">
              <span
                class="cursor-pointer text-blue-500 mr-[0.45vw]"
                @click="complete('incompleteWeek', index)"
              >
                已完成</span
              >
            </template>
          </ContentTable>
        </div>
        <div class="rounded bg-[#fff] px-[1.04vw] py-10px pb-20px">
          <ContentTable
            ref="zbxz"
            :actionWidth="140"
            :isDelAction="pageFlag == 'see'"
            :title="'下周工作计划'"
            :selectData="allMonthSelect"
            :headerTitle="headerTitle"
            v-model="ruleForm.nextWeek"
          >
            <template #workItems="{ item, field }">
              <el-input
                type="textarea"
                autosize
                rows="1"
                maxlength="2000"
                v-model="item[field]"
                placeholder="请输入工作事项"
              />
            </template>
            <template #startTime="{ item, field, index }">
              <el-date-picker
                v-model="item[field]"
                class="date-picker"
                type="date"
                :disabled-date="startTimeDisabled.bind(null, index, 'nextWeek', 'start')"
                format="YYYY-MM-DD"
                value-format="YYYY-MM-DD"
                placeholder="请选择开始时间"
              />
            </template>
            <template #endTime="{ item, field, index }">
              <el-date-picker
                v-model="item[field]"
                class="date-picker"
                type="date"
                :disabled-date="startTimeDisabled.bind(null, index, 'nextWeek', 'end')"
                format="YYYY-MM-DD"
                value-format="YYYY-MM-DD"
                placeholder="请选择结束时间"
              />
            </template>
            <template #finishTime="{ item, field, index }">
              <el-date-picker
                v-model="item[field]"
                class="date-picker"
                type="date"
                :disabled-date="startTimeDisabled.bind(null, index, 'nextWeek', 'finish')"
                format="YYYY-MM-DD"
                value-format="YYYY-MM-DD"
                placeholder="请选择实际完成时间"
              />
            </template>
            <template #players="{ item, field }">
              <el-input
                type="input"
                rows="1"
                maxlength="100"
                v-model="item[field]"
                placeholder="请输入参与人"
              />
            </template>
            <template #assessmentDetailId="{ item, field, index }">
              <el-tree-select
                filterable
                clearable
                @change="handleNodeChange($event, index, 'nextWeek')"
                v-model="item[field]"
                :data="allMonthSelect"
                :render-after-expand="false"
              />
            </template>
          </ContentTable>
        </div>
      </el-form>

      <div class="flex justify-center items-center mt-26px pb-20px" v-if="pageFlag != 'see'">
        <el-button
          :loading="zcloading"
          :disabled="zcloading"
          class="load-button w-[7.81vw] cursor-pointer text-16px flex rounded mr-[0.625vw] justify-center items-center h-42px bg-[#fff] text-[#191919] border-1 border-[#C9CCD4]"
          @click="submit(1)"
          >暂存</el-button
        >
        <el-button
          :loading="loading"
          type="primary"
          :disabled="loading"
          class="load-button w-[7.81vw] cursor-pointer text-16px flex rounded justify-center items-center h-42px bg-[#00A0E9] text-[#fff]"
          @click="submit(2)"
          >发布</el-button
        >
      </div>
    </template>
  </DrawerWrap>
</template>

<script setup lang="ts">
import { DrawerWrap } from '@/components/DrawerWrapDetails'
import { ContentTable } from '../components'
import { ref, nextTick, reactive, inject } from 'vue'
import { ElMessage } from 'element-plus'
import moment from 'moment'
import { useCache } from '@/hooks/web/useCache'
const { wsCache } = useCache()
import {
  saveApi,
  updateApi,
  getByIdApi,
  getMonthSelectApi,
  getLastWeekReportApi
} from '@/api/assessment/weekly'
import { useValidator } from '@/hooks/web/useValidator'
const { notSpace } = useValidator()
const isShow = ref(false)
const drawerWrap = ref()
const detailsId = ref()
const darwerTitle = ref('')
const pageFlag = ref()
const loading = ref(false)
const zcloading = ref(false)
const allMonthSelect = ref<any>()
const yearMonthValueFlag = ref(false)
const openDrawer = (type?, id?) => {
  drawerWrap.value.isShow = true
  detailsId.value = id ? id : ''
  pageFlag.value = type
  darwerTitle.value = type == 'add' ? '创建周报' : type == 'edit' ? '修改周报' : '周报详情'
  reset()

  // 查询周报下拉
  getWeekNum()
  // 查询月报下拉
  getMonthSelect()
  if (type == 'add') {
    // 上个月周报
    getLastWeekReport()
  } else {
    getDetails(detailsId.value)
  }

  // if (type == 'add' || type == 'edit') {
  headerTitle.value = [
    {
      title: '工作事项',
      field: 'workItems',
      rules: {
        workItems: [
          { required: true, message: '请输入工作事项', trigger: 'blur' },
          {
            validator: (rule: any, value: string, callback: Callback) =>
              notSpace(value, callback, '不能输入纯空格'),
            trigger: 'blur'
          }
        ]
      },
      width: 270,
      isShow: true,
      dropdownShow: false
    },
    { title: '开始时间', field: 'startTime', isShow: true, dropdownShow: false, width: 60 },
    { title: '结束时间', field: 'endTime', isShow: true, dropdownShow: false, width: 60 },
    { title: '实际完成时间', field: 'finishTime', isShow: false, dropdownShow: true, width: 60 },
    {
      title: '参与人',
      width: 40,
      field: 'players',
      isShow: false,
      dropdownShow: true
    },
    {
      title: '关联月报',
      field: 'assessmentDetailId',
      width: 60,
      isSelect: true,
      isShow: false,
      dropdownShow: true
    }
  ]
  // }
}
const weekSelect = ref<any>()
// 全部月下拉
const getMonthSelect = async () => {
  let res = await getMonthSelectApi({ yearMonthValue: ruleForm.value.yearMonthValue })
  if (res && res.data) {
    allMonthSelect.value = res.data
      .map((v) => {
        return {
          value: v.assessmentTime,
          label: v.assessmentTime,
          children: v.details.map((j) => {
            return {
              value: j.id,
              text: j.workAssignment,
              label: j.workAssignment.slice(0, 40) + (j.workAssignment.length > 40 ? '...' : '')
            }
          })
        }
      })
      .filter((v) => {
        let year = new Date().getFullYear()
        let month = new Date().getMonth()

        let vaYear = new Date(v.value).getFullYear()
        let vaMonth = new Date(v.value).getMonth()

        return (
          (vaYear == year && month == vaMonth) ||
          (vaYear == year && month + 1 == vaMonth) ||
          (vaYear != year && month == 0 && vaMonth == 11)
        )
      })
  }
}

// 获取月
const bookDateEndLimit = (time: any) => {
  // 获取当前日期（去除时间部分）
  const currentDate = new Date(moment(new Date()).isoWeekday(1).format('YYYY-MM-DD'))
  const currentYear = currentDate.getFullYear()
  const currentMonth = currentDate.getMonth()
  const preMonth = currentDate.getMonth() - 1

  // 将时间戳转换为日期对象
  const date = new Date(moment(new Date(time)).isoWeekday(1).format('YYYY-MM-DD'))
  const year = date.getFullYear()
  const month = date.getMonth()

  // 仅允许选择这个月和上个月的日期
  return (
    year < currentYear ||
    (year === currentYear && month < preMonth) ||
    (year === currentYear && month >= currentMonth) ||
    year > currentYear
  )
}

// 获取上周
const getLastWeekReport = async () => {
  let res = await getLastWeekReportApi({
    weekValue: ruleForm.value.weekValue,
    yearMonthValue: ruleForm.value.yearMonthValue
  })

  if (res && res.data) {
    let { data } = res

    let dailyArr = []
    let weekArr = []
    if (data.daily.length) {
      dailyArr = data.daily.map((v) => {
        return {
          workItems: v.workDescribe,
          startTime: moment(new Date(v.workDate)).format('YYYY-MM-DD'),
          endTime: moment(new Date(v.workDate)).format('YYYY-MM-DD'),
          finishTime: moment(new Date(v.workDate)).format('YYYY-MM-DD'),
          players: v.createByName,
          assessmentDetailId: '',
          assessmentTime: v.assessmentTime
        }
      })
    }

    if (data.week.length) {
      weekArr = data.week.map((v) => {
        return {
          workItems: v.workItems,
          startTime: v.startTime,
          endTime: v.endTime,
          finishTime: v.finishTime,
          players: v.players,
          assessmentDetailId:
            v.createByName == wsCache.get('userInfo').nickName ? v.assessmentDetailId : '',
          assessmentTime: v.assessmentTime
        }
      })
    }

    ruleForm.value = {
      weekValue: ruleForm.value.weekValue,
      yearMonthValue: ruleForm.value.yearMonthValue,
      completeWeek: [...dailyArr, ...weekArr],
      incompleteWeek: [],
      nextWeek: []
    }

    if (detailsId.value) {
      getDetails(detailsId.value)
    }
  }
}

// 时间判断
const startTimeDisabled = (index, type, lin, time) => {
  const date = new Date(time)

  if (type == 'completeWeek') {
    if (ruleForm.value.completeWeek[index]) {
      if (lin == 'start') {
        if (
          ruleForm.value.completeWeek[index].finishTime &&
          ruleForm.value.completeWeek[index].endTime
        ) {
          let dat =
            new Date(ruleForm.value.completeWeek[index].finishTime) >
            new Date(ruleForm.value.completeWeek[index].endTime)
              ? ruleForm.value.completeWeek[index].endTime
              : ruleForm.value.completeWeek[index].finishTime
          return date > new Date(dat)
        }
        if (ruleForm.value.completeWeek[index].endTime) {
          return date > new Date(ruleForm.value.completeWeek[index].endTime)
        }
        if (ruleForm.value.completeWeek[index].finishTime) {
          return date > new Date(ruleForm.value.completeWeek[index].finishTime)
        }
      } else if (lin == 'end' || lin == 'finish') {
        if (ruleForm.value.completeWeek[index].startTime) {
          let year = new Date(ruleForm.value.completeWeek[index].startTime).getFullYear()
          let month = new Date(ruleForm.value.completeWeek[index].startTime).getMonth()
          let dat = new Date(ruleForm.value.completeWeek[index].startTime).getDate()
          return date < new Date(year, month, dat)
        }
      }
    }
  } else if (type == 'incompleteWeek') {
    if (ruleForm.value.incompleteWeek[index]) {
      if (lin == 'start') {
        if (
          ruleForm.value.incompleteWeek[index].finishTime &&
          ruleForm.value.incompleteWeek[index].endTime
        ) {
          let dat =
            new Date(ruleForm.value.incompleteWeek[index].finishTime) >
            new Date(ruleForm.value.incompleteWeek[index].endTime)
              ? ruleForm.value.incompleteWeek[index].endTime
              : ruleForm.value.incompleteWeek[index].finishTime
          return date > new Date(dat)
        }
        if (ruleForm.value.incompleteWeek[index].endTime) {
          return date > new Date(ruleForm.value.incompleteWeek[index].endTime)
        }
        if (ruleForm.value.incompleteWeek[index].finishTime) {
          return date > new Date(ruleForm.value.incompleteWeek[index].finishTime)
        }
      } else if (lin == 'end' || lin == 'finish') {
        if (ruleForm.value.incompleteWeek[index].startTime) {
          let year = new Date(ruleForm.value.incompleteWeek[index].startTime).getFullYear()
          let month = new Date(ruleForm.value.incompleteWeek[index].startTime).getMonth()
          let dat = new Date(ruleForm.value.incompleteWeek[index].startTime).getDate()
          return date < new Date(year, month, dat)
        }
      }
    }
  } else if (type == 'nextWeek') {
    if (ruleForm.value.nextWeek[index]) {
      if (lin == 'start') {
        if (ruleForm.value.nextWeek[index].finishTime && ruleForm.value.nextWeek[index].endTime) {
          let dat =
            new Date(ruleForm.value.nextWeek[index].finishTime) >
            new Date(ruleForm.value.nextWeek[index].endTime)
              ? ruleForm.value.nextWeek[index].endTime
              : ruleForm.value.nextWeek[index].finishTime
          return date > new Date(dat)
        }
        if (ruleForm.value.nextWeek[index].endTime) {
          return date > new Date(ruleForm.value.nextWeek[index].endTime)
        }
        if (ruleForm.value.nextWeek[index].finishTime) {
          return date > new Date(ruleForm.value.nextWeek[index].finishTime)
        }
      } else if (lin == 'end' || lin == 'finish') {
        if (ruleForm.value.nextWeek[index].startTime) {
          let year = new Date(ruleForm.value.nextWeek[index].startTime).getFullYear()
          let month = new Date(ruleForm.value.nextWeek[index].startTime).getMonth()
          let dat = new Date(ruleForm.value.nextWeek[index].startTime).getDate()
          return date < new Date(year, month, dat)
        }
      }
    }
  }
}
// const timeChange = (index, type) => {

//   startTimeDisabled(index, type)
// }
const rules = reactive({
  yearMonthValue: [{ required: true, message: '请选择月份', trigger: 'blur' }],
  weekValue: [{ required: true, message: '请选择考核周', trigger: 'blur' }]
})
const options = ref([
  {
    label: '第一周',
    value: 1
  }
])
const headerTitle = ref([
  {
    title: '工作事项',
    field: 'workItems',
    rules: {
      workItems: [
        { required: true, message: '请输入工作事项', trigger: 'blur' },
        {
          validator: (rule: any, value: string, callback: Callback) =>
            notSpace(value, callback, '不能输入纯空格'),
          trigger: 'blur'
        }
      ]
    },
    minWidth: 170,
    isShow: true,
    dropdownShow: false
  },
  { title: '开始时间', field: 'startTime', isShow: true, dropdownShow: false, width: 80 },
  { title: '结束时间', field: 'endTime', isShow: true, dropdownShow: false, width: 80 },
  { title: '实际完成时间', field: 'finishTime', isShow: false, dropdownShow: true, width: 90 },
  {
    title: '参与人',
    width: 60,
    field: 'players',
    isShow: false,
    dropdownShow: true
  },
  {
    title: '关联月报',
    field: 'assessmentDetailId',
    width: 80,
    isSelect: true,
    isShow: false,
    dropdownShow: true
  }
])

//表单数据
const ruleForm = ref<any>({
  weekValue: '',
  yearMonthValue: moment(new Date()).isoWeekday(1).format('YYYY-MM'),
  completeWeek: [],
  incompleteWeek: [],
  nextWeek: []
})

const handleNodeChange = (data, index, type) => {
  let a = ''
  allMonthSelect.value.forEach((v) => {
    if (v.children) {
      if (v.children.some((j) => j.value == data)) {
        a = v.value
      }
    }
  })

  if (type == 'completeWeek') {
    ruleForm.value.completeWeek[index]['assessmentTime'] = a
  } else if (type == 'incompleteWeek') {
    ruleForm.value.incompleteWeek[index]['assessmentTime'] = a
  } else if (type == 'nextWeek') {
    ruleForm.value.nextWeek[index]['assessmentTime'] = a
  }
}

const getWeekNum = (date?) => {
  // 获取当前日期
  var currentDate = date
    ? new Date(moment(date).isoWeekday(1).format('YYYY-MM-DD'))
    : new Date(moment(new Date()).isoWeekday(1).format('YYYY-MM-DD'))
  // 获取当月的第一天
  var firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1)
  // 获取当月的最后一天
  var lastDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0)

  const firstDayOfWeek = firstDayOfMonth.getDay() ? firstDayOfMonth.getDay() : 7

  var totalWeeks = Math.ceil(
    (lastDayOfMonth.getDate() - firstDayOfMonth.getDate() + firstDayOfWeek) / 7
  )

  var nowfirstDayOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1)
  const nowfirstDayOfWeek = nowfirstDayOfMonth.getDay() ? nowfirstDayOfMonth.getDay() : 7
  var nowWeek = Math.ceil(
    (new Date().getDate() - nowfirstDayOfMonth.getDate() + nowfirstDayOfWeek) / 7
  )

  //当前第几周
  var currentWeeks = Math.ceil(
    (currentDate.getDate() - firstDayOfMonth.getDate() + firstDayOfWeek) / 7
  )

  if (firstDayOfWeek !== 1) {
    totalWeeks = totalWeeks - 1
    currentWeeks = currentWeeks - 1
  }

  ruleForm.value.weekValue = String(currentWeeks)

  if (
    ruleForm.value.weekValue == 1 ||
    (currentDate.getMonth() != new Date().getMonth() && nowWeek != 1)
  ) {
    yearMonthValueFlag.value = false
  } else {
    yearMonthValueFlag.value = true
  }
  weekSelect.value = []
  for (var i = 1; i <= totalWeeks; i++) {
    weekSelect.value.push({
      value: String(i),
      disabled:
        ((i == ruleForm.value.weekValue || i == ruleForm.value.weekValue - 1) &&
          new Date().getMonth() == new Date(ruleForm.value.yearMonthValue).getMonth()) ||
        (currentDate.getMonth() != new Date().getMonth() && nowWeek != 1 && i == totalWeeks) ||
        (currentDate.getMonth() != new Date().getMonth() &&
          nowWeek == 1 &&
          (i == totalWeeks || i == totalWeeks - 1) &&
          Number(currentDate.getMonth()) + 1 == Number(new Date().getMonth()))
          ? false
          : true,
      label:
        i == 1
          ? '第一周'
          : i == 2
          ? '第二周'
          : i == 3
          ? '第三周'
          : i == 4
          ? '第四周'
          : i == 5
          ? '第五周'
          : i == 6
          ? '第六周'
          : '--'
    })
  }
}

const getDetails = async (id) => {
  let res = await getByIdApi({ id: id })
  if (res && res.data) {
    let { data } = res
    ruleForm.value = {
      weekValue: data.weekValue,
      yearMonthValue: data.yearMonthValue,
      completeWeek: data.details.filter((v) => v.weekFlag == 0 && v.finishFlag == 0),
      incompleteWeek: data.details.filter((v) => v.weekFlag == 0 && v.finishFlag == 1),
      nextWeek: data.details.filter((v) => v.weekFlag == 1 && v.finishFlag == 1)
    }
  }
}

const complete = (type, index) => {
  // console.log(zbwwc.value.subCont())
  // if (zbwwc.value.subCont()) {
  //   ElMessage.error('存在未保存的周报内容！')
  //   return
  // }

  zbwwc.value.qiehuandata(index).then((res) => {
    ruleForm.value.completeWeek.push(ruleForm.value.incompleteWeek[index])

    ruleForm.value.completeWeek.forEach((v) => {
      if (v.finishFlag != 0) {
        v.finishFlag = 0
      }
    })
    ruleForm.value.incompleteWeek.splice(index, 1)
  })
  // ruleForm.value.incompleteWeek.splice(index, 1)
}

const noComplete = async (type, index) => {
  // if (zbbz.value.subCont()) {
  //   ElMessage.error('存在未保存的周报内容！')
  //   return
  // }
  zbbz.value.qiehuandata(index).then((res) => {
    ruleForm.value.incompleteWeek.push(ruleForm.value.completeWeek[index])
    ruleForm.value.incompleteWeek.forEach((v) => {
      if (v.finishFlag != 1) {
        v.finishFlag = 1
      }
    })

    console.log(ruleForm.value.completeWeek[index])
    ruleForm.value.completeWeek.splice(index, 1)
  })
}

const getList: any = inject('getList')
const formRef = ref()
const zbbz = ref()
const zbwwc = ref()
const zbxz = ref()
const submit = async (saveOrder) => {
  if (
    !ruleForm.value.completeWeek.length &&
    !ruleForm.value.incompleteWeek.length &&
    !ruleForm.value.nextWeek.length
  ) {
    ElMessage.error('请填写周报内容！')
    return
  }

  if (zbbz.value.subCont() || zbwwc.value.subCont() || zbxz.value.subCont()) {
    ElMessage.error('存在未保存的周报内容！')
    return
  }
  if (!formRef.value) return
  await formRef.value?.validate(async (isValid) => {
    if (isValid) {
      ruleForm.value.completeWeek = ruleForm.value.completeWeek.map((v) => {
        const keys = Object.keys(v)
        if (keys.includes('weekFlag') && keys.includes('finishFlag')) {
          return v
        } else {
          return { ...v, ...{ weekFlag: 0, finishFlag: 0 } }
        }
      })

      ruleForm.value.incompleteWeek = ruleForm.value.incompleteWeek.map((v) => {
        const keys = Object.keys(v)
        if (keys.includes('weekFlag') && keys.includes('finishFlag')) {
          return v
        } else {
          return { ...v, ...{ weekFlag: 0, finishFlag: 1 } }
        }
      })

      ruleForm.value.nextWeek = ruleForm.value.nextWeek.map((v) => {
        const keys = Object.keys(v)
        if (keys.includes('weekFlag') && keys.includes('finishFlag')) {
          return v
        } else {
          return { ...v, ...{ weekFlag: 1, finishFlag: 1 } }
        }
      })

      let data: any = {
        saveOrSubmit: saveOrder, // 1暂存 2 发布
        weekValue: ruleForm.value.weekValue,
        yearMonthValue: moment(new Date(ruleForm.value.yearMonthValue)).format('YYYY-MM'),
        details: [
          ...ruleForm.value.completeWeek,
          ...ruleForm.value.incompleteWeek,
          ...ruleForm.value.nextWeek
        ]
      }

      if (saveOrder == 1) {
        zcloading.value = true
      } else {
        loading.value = true
      }

      if (detailsId.value) {
        data.id = detailsId.value
        try {
          let res = await updateApi(data)
          if (res) {
            if (saveOrder == 1) {
              ElMessage.success('暂存成功')
            } else {
              ElMessage.success('发布成功')
            }
          }
        } catch (err) {
          setTimeout(() => {
            loading.value = false
            zcloading.value = false
          }, 200)
          return false
        }
      } else {
        try {
          let res = await saveApi(data)
          if (res) {
            if (saveOrder == 1) {
              ElMessage.success('暂存成功')
            } else {
              ElMessage.success('发布成功')
            }
          }
        } catch (err) {
          setTimeout(() => {
            loading.value = false
            zcloading.value = false
          }, 200)
          return false
        }
      }
      getList()
      drawerWrap.value.isShow = false
      setTimeout(() => {
        loading.value = false
        zcloading.value = false
      }, 200)
    }
  })
}

const monthChange = (e) => {
  let date = moment(e)
  let nowdate = moment(new Date(moment(new Date()).isoWeekday(1).format('YYYY-MM-DD')))

  if (date.month() < nowdate.month()) {
    getWeekNum(moment(e).endOf('months').format('YYYY-MM-DD'))
  } else {
    getWeekNum(nowdate)
  }

  ruleForm.value.weekValue = ''
  // if (pageFlag.value == 'add') {
  //   ruleForm.value.yearMonthValue = moment(new Date(e)).format('YYYY-MM')
  //   // 上个月周报
  //   getLastWeekReport()
  // }
}

const weekChange = (e) => {
  if (pageFlag.value == 'add') {
    ruleForm.value.weekValue = e
    // 上个月周报
    getLastWeekReport()
  }
}

const reject = () => {
  drawerWrap.value.isShow = false
}
// 清空
const reset = () => {
  ruleForm.value = {
    weekValue: '',
    yearMonthValue: moment(new Date()).isoWeekday(1).format('YYYY-MM'),
    completeWeek: [],
    incompleteWeek: [],
    nextWeek: []
  }

  nextTick(() => {
    zbbz.value.reset()
    zbwwc.value.reset()
    zbxz.value.reset()
  })
}

defineExpose({
  openDrawer
})
</script>

<style lang="less" scoped>
:deep(.el-card__body) {
  padding: 0 !important;
}
:deep(.load-button) {
  height: 40px !important;
}
:deep(.el-input__prefix) {
  display: none !important;
}
:deep(.el-input__inner) {
  font-size: 14px !important;
}
</style>
