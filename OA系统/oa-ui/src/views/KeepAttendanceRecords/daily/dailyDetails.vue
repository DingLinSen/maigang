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
              <el-form-item label="日报标题" prop="title">
                <el-input
                  :disabled="true"
                  type="input"
                  maxlength="20"
                  v-model="ruleForm.title"
                  placeholder="请输入日报标题"
                />
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="考核日" prop="workDate">
                <el-date-picker
                  :disabled-date="bookDateEndLimit"
                  class="date-picker"
                  :disabled="pageFlag == 'see'"
                  @change="dateChange"
                  v-model="ruleForm.workDate"
                  type="date"
                  placeholder="请选择考核日"
                />
              </el-form-item>
            </el-col>
          </el-row>
          <h3
            class="relative mb-12px after:-mt-1px font-bold text-16px after:content-[''] after:w-3px after:h-15px after:absolute after:top-1/2 after:bg-[#00A0E9] after:left-0 after:transform after:-translate-y-1/2 pl-8px text-[#333]"
            >关联周报</h3
          >
          <el-row>
            <el-col :span="6" class="mr-[1.04vw]">
              <el-form-item label="月份" prop="yearMonthValue">
                <el-date-picker
                  class="date-picker"
                  v-model="ruleForm.yearMonthValue"
                  type="month"
                  format="YYYY-MM"
                  :disabled="true"
                  placeholder="请选择月份"
                />
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="考核周" prop="weekValue">
                <el-select
                  v-model="ruleForm.weekValue"
                  class="w-full"
                  fit-input-width
                  :disabled="true"
                  placeholder="请选择考核周"
                >
                  <el-option
                    v-for="it in weekSelect"
                    :key="it.value"
                    :label="it.label"
                    :value="it.value"
                  />
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
        </div>
        <div class="rounded bg-[#fff] px-[1.04vw] py-10px pb-20px">
          <contentTableDaily
            :isDelAction="pageFlag == 'see'"
            ref="rb"
            :title="'日报内容'"
            :headerTitle="headerTitle"
            v-model="ruleForm.details"
          >
            <template #workDescribe="{ item, field }">
              <el-input
                type="textarea"
                rows="1"
                autosize
                maxlength="2000"
                v-model="item[field]"
                placeholder="请输入日报内容"
              />
            </template>
          </contentTableDaily>
          <el-col :span="24" class="pt-20px">
            <el-form-item prop="fileUrl">
              <FileButtonUpload
                :disabled="pageFlag == 'see'"
                :isMultiple="true"
                :fileSize="100"
                v-model:modelValue="ruleForm.fileUrl"
                :limit="10"
                :fileType="[
                  'pdf',
                  'doc',
                  'docx',
                  'png',
                  'jpg',
                  'jpeg',
                  'bmp',
                  'xls',
                  'xlsx',
                  'zip',
                  'rar'
                ]"
              />
            </el-form-item>
          </el-col>
        </div>
      </el-form>
      <div class="flex justify-center items-center mt-26px pb-20px" v-if="pageFlag != 'see'">
        <el-button
          :loading="loading"
          type="primary"
          :disabled="loading"
          class="load-button w-[7.81vw] cursor-pointer text-16px flex rounded justify-center items-center h-42px bg-[#00A0E9] text-[#fff] mr-[0.625vw]"
          @click="submit"
          >提交</el-button
        >
        <div
          class="w-[7.81vw] cursor-pointer text-16px flex rounded justify-center items-center h-42px bg-[#fff] text-[#191919] border-1 border-[#C9CCD4]"
          @click="drawerWrap.isShow = false"
          >取消</div
        >
      </div>
    </template>
  </DrawerWrap>
</template>

<script setup lang="ts">
import { DrawerWrap } from '@/components/DrawerWrapDetails'
import { contentTableDaily } from '../components'
import { FileButtonUpload } from '@/components/FileButtonUpload'
import { ref, nextTick, reactive, inject } from 'vue'
import { saveApi, getByIdApi, updateApi } from '@/api/assessment/daily'
import moment from 'moment'
import { ElMessage } from 'element-plus'
import { useValidator } from '@/hooks/web/useValidator'
const { notSpace } = useValidator()

const loading = ref(false)
const darwerTitle = ref('')
const pageFlag = ref<string>('add')
const rb = ref()
const detailsId = ref<string>('')
const isShow = ref(false)
const drawerWrap = ref()
const openDrawer = (type?, id?) => {
  drawerWrap.value.isShow = true
  detailsId.value = id ? id : ''
  pageFlag.value = type
  darwerTitle.value = type == 'add' ? '创建日报' : type == 'edit' ? '修改日报' : '日报详情'
  reset()
  nextTick(() => {
    rb.value.reset()
  })

  getWeekNum()
  if (id) {
    getDetails(id)
  }
}

const formRef = ref()

const weekSelect = ref<any>()

const getDetails = async (id?) => {
  let res = await getByIdApi({ id: id })
  if (res && res.data) {
    let { data } = res
    ruleForm.value = {
      weekValue: data.weekValue,
      workDate: data.workDate,
      title: data.title,
      yearMonthValue: data.yearMonthValue, // 迟到
      fileUrl: data.files.length ? data.files.map((v) => v.fileUrl).join(',') : '',
      details: data.details // 年假
    }
  }
}

const dateChange = (e) => {
  ruleForm.value.title = moment(e).format('YYYY-MM-DD') + '日报'
  ruleForm.value.yearMonthValue = new Date(moment(e).isoWeekday(1).format('YYYY-MM'))
  getWeekNum(moment(e).format('YYYY-MM-DD'))
}

const bookDateEndLimit = (time: any) => {
  // 获取当前日期
  const currentDate = new Date()
  currentDate.setHours(0, 0, 0, 0)

  // 昨天
  const yesterdayDate = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth(),
    currentDate.getDate() - 1
  )
  yesterdayDate.setHours(0, 0, 0, 0)

  // 将时间戳转换为日期对象
  const date = new Date(time)

  return date > currentDate || date < yesterdayDate
}

const headerTitle = ref([
  {
    title: '日报内容',
    field: 'workDescribe',
    rules: {
      workDescribe: [
        { required: true, message: '请输入日报内容', trigger: 'blur' },
        {
          validator: (rule: any, value: string, callback: Callback) =>
            notSpace(value, callback, '不能输入纯空格'),
          trigger: 'blur'
        }
      ]
    }
  }
])

//表单数据
const ruleForm = ref<any>({
  weekValue: '',
  workDate: moment(new Date()).format('YYYY-MM-DD'),
  title: moment(new Date()).format('YYYY-MM-DD') + '日报',
  yearMonthValue: moment(new Date()).isoWeekday(1).format('YYYY-MM'), // 迟到
  fileUrl: [],
  details: [] // 年假
})

const rules = reactive({
  title: [
    { required: true, message: '请输入日报标题', trigger: 'blur' },
    {
      validator: (rule: any, value: string, callback: Callback) =>
        notSpace(value, callback, '不能输入纯空格'),
      trigger: 'blur'
    }
  ],
  workDate: [{ required: true, message: '请选择日期', trigger: 'blur' }],
  yearMonthValue: [{ required: true, message: '请选择年月', trigger: 'blur' }],
  weekValue: [{ required: true, message: '请选择周', trigger: 'blur' }]
})
const getWeekNum = (date?) => {
  // 获取当前日期
  var currentDate = date
    ? new Date(moment(date).isoWeekday(1).format('YYYY-MM-DD'))
    : new Date(moment(new Date()).isoWeekday(1).format('YYYY-MM-DD'))

  // 获取当月的第一天
  var firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1)
  // 获取当月的最后一天
  var lastDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0)
  // 获取当天
  // var currentDay = new Date()

  const firstDayOfWeek = firstDayOfMonth.getDay() ? firstDayOfMonth.getDay() : 7

  var totalWeeks = Math.ceil(
    (lastDayOfMonth.getDate() - firstDayOfMonth.getDate() + firstDayOfWeek) / 7
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

  weekSelect.value = []
  for (var i = 1; i <= totalWeeks; i++) {
    weekSelect.value.push({
      value: String(i),
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

const getList: any = inject('getList')
const reject = () => {
  drawerWrap.value.isShow = false
}

const submit = async () => {
  if (!ruleForm.value.details.length) {
    ElMessage.error('请填写日报内容！')
    return
  }

  if (rb.value.subCont()) {
    ElMessage.error('存在未保存的日报内容！')
    return
  }
  if (!formRef.value) return
  await formRef.value?.validate(async (isValid) => {
    if (isValid) {
      let data: any = {
        weekValue: ruleForm.value.weekValue,
        workDate: moment(new Date(ruleForm.value.workDate)).format('YYYY-MM-DD'),
        title: ruleForm.value.title,
        yearMonthValue: moment(new Date(ruleForm.value.yearMonthValue)).format('YYYY-MM'),
        files: ruleForm.value.fileUrl.length
          ? ruleForm.value.fileUrl.split(',').map((v) => {
              return {
                fileUrl: v
              }
            })
          : [],
        details: ruleForm.value.details
      }

      loading.value = true
      if (detailsId.value) {
        data.id = detailsId.value
        try {
          let res = await updateApi(data)
          if (res) {
            ElMessage.success('修改成功')
          }
        } catch (err) {
          setTimeout(() => {
            loading.value = false
          }, 200)
          return false
        }
      } else {
        try {
          let res = await saveApi(data)
          if (res) {
            ElMessage.success('保存成功')
          }
        } catch (err) {
          setTimeout(() => {
            loading.value = false
          }, 200)
          return false
        }
      }
      getList()
      drawerWrap.value.isShow = false
      setTimeout(() => {
        loading.value = false
      }, 200)
    }
  })
}

// 清空
const reset = () => {
  ruleForm.value = {
    weekValue: '',
    workDate: moment(new Date()).format('YYYY-MM-DD'),
    title: moment(new Date()).format('YYYY-MM-DD') + '日报',
    yearMonthValue: moment(new Date()).isoWeekday(1).format('YYYY-MM'), // 迟到
    fileUrl: [],
    details: [] // 年假
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
:deep(.load-button) {
  height: 40px !important;
}
</style>
