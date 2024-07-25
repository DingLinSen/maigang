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
            <el-col :span="5">
              <el-form-item label="考核年月" prop="assessmentTime">
                <el-date-picker
                  class="date-picker"
                  :disabled-date="bookDateEndLimit"
                  v-model="ruleForm.assessmentTime"
                  type="month"
                  :disabled="pageFlag == 'see' || status != 0"
                  format="YYYY-MM"
                  value-format="YYYY-MM"
                  placeholder="请选择考核年月"
                />
              </el-form-item>
            </el-col>
            <el-col :span="5" class="mr-[1.04vw]">
              <el-form-item label="考核人" prop="name">
                <el-input
                  type="input"
                  :disabled="true"
                  maxlength="20"
                  v-model="wsCache.get('userInfo').nickName"
                  placeholder="请输入考核人"
                />
              </el-form-item>
            </el-col>
          </el-row>
        </div>
        <div class="rounded bg-[#fff] px-[1.04vw] py-10px pb-20px mb-20px">
          <contentTableDaily
            ref="ybgw"
            :actionWidth="120"
            :delyj="status != 0 && status != 3"
            :addAction="pageFlag == 'see' || status == 1 || status == 2"
            :isDelAction="
              pageFlag == 'see' || status == 1 || status == 2 || status == 4 || status == 6
            "
            :title="'岗位指标考核'"
            :headerTitle="headerTitle"
            v-model="ruleForm.jobAssessment"
          >
            <template #indexContent="{ item, field, index }">
              <el-select
                v-model="item[field]"
                class="w-full"
                :disabled="
                  pageFlag == 'see' || (index < jobAssessmentLength && (status == 4 || status == 6))
                "
                filterable
                popper-class="zhibiaoxila"
                @change="assTypeChange($event, index, 'job')"
                placeholder="请选择指标内容"
              >
                <el-option
                  v-for="it in assTypeData"
                  :key="it.id"
                  :label="it.indexContent"
                  :value="it.indexContent"
                />
              </el-select>
            </template>
            <template #workAssignment="{ item, field, index }">
              <el-input
                type="textarea"
                autosize
                rows="1"
                maxlength="1000"
                :disabled="
                  pageFlag == 'see' || (index < jobAssessmentLength && (status == 4 || status == 6))
                "
                v-model="item[field]"
                placeholder="请输入工作任务"
              />
            </template>
            <template #suggest="{ item, field }">
              <p>{{ item[field] }}</p>
            </template>
            <template #execution="{ item, field }">
              <el-input
                type="textarea"
                autosize
                rows="1"
                maxlength="500"
                :disabled="pageFlag == 'see'"
                v-model="item[field]"
                placeholder="请输入完成情况"
              />
            </template>
            <template #selfEvaluationDeduction="{ item, field }">
              <el-input
                type="input"
                maxlength="2"
                :disabled="pageFlag == 'see'"
                v-model="item[field]"
                placeholder="0"
              />
            </template>
            <template #leaderDeduction="{ item, field }">
              <el-input
                type="input"
                maxlength="2"
                :disabled="true"
                v-model="item[field]"
                placeholder="0"
              />
            </template>
          </contentTableDaily>
        </div>

        <div class="rounded bg-[#fff] px-[1.04vw] py-10px pb-20px mb-20px">
          <contentTableDaily
            ref="ybgr"
            :actionWidth="120"
            :delyj="status != 0 && status != 3"
            :addAction="pageFlag == 'see' || status == 1 || status == 2"
            :isDelAction="
              pageFlag == 'see' || status == 1 || status == 2 || status == 4 || status == 6
            "
            :title="'个人指标考核'"
            :headerTitle="headerTitle"
            v-model="ruleForm.personalAssessment"
          >
            <template #indexContent="{ item, field, index }">
              <el-select
                v-model="item[field]"
                class="w-full"
                :disabled="
                  pageFlag == 'see' ||
                  (index < personalAssessmentLength && (status == 4 || status == 6))
                "
                filterable
                popper-class="zhibiaoxila"
                @change="assTypeChange($event, index, 'person')"
                placeholder="请选择指标内容"
              >
                <el-option
                  v-for="it in assTypeData"
                  :key="it.id"
                  :label="it.indexContent"
                  :value="it.indexContent"
                />
              </el-select>
            </template>
            <template #workAssignment="{ item, field, index }">
              <el-input
                type="textarea"
                autosize
                rows="1"
                :disabled="
                  pageFlag == 'see' ||
                  (index < personalAssessmentLength && (status == 4 || status == 6))
                "
                maxlength="2000"
                v-model="item[field]"
                placeholder="请输入工作任务"
              />
            </template>
            <template #suggest="{ item, field }">
              <p>{{ item[field] }}</p>
            </template>
            <template #execution="{ item, field }">
              <el-input
                type="textarea"
                autosize
                rows="1"
                maxlength="500"
                :disabled="pageFlag == 'see'"
                v-model="item[field]"
                placeholder="请输入完成情况"
              />
            </template>
            <template #selfEvaluationDeduction="{ item, field }">
              <el-input
                type="input"
                maxlength="2"
                :disabled="pageFlag == 'see'"
                v-model="item[field]"
                placeholder="0"
              />
            </template>
            <template #leaderDeduction="{ item, field }">
              <el-input
                type="input"
                maxlength="2"
                :disabled="true"
                v-model="item[field]"
                placeholder="0"
              />
            </template>
          </contentTableDaily>
        </div>

        <div class="rounded bg-[#fff] px-[1.04vw] py-10px">
          <contentTableDaily
            ref="ybty"
            :actionWidth="120"
            :title="'公司指标考核'"
            :isDelAction="true"
            :headerTitle="currentTitle"
            v-model="ruleForm.tyAssessment"
          >
            <template #execution="{ item, field }">
              <el-input
                type="textarea"
                autosize
                rows="1"
                maxlength="500"
                :disabled="pageFlag == 'see'"
                v-model="item[field]"
                placeholder="请输入完成情况"
              />
            </template>
            <template #selfEvaluationDeduction="{ item, field }">
              <el-input
                type="input"
                maxlength="2"
                :disabled="pageFlag == 'see'"
                v-model="item[field]"
                placeholder="0"
              />
            </template>
            <template #leaderDeduction="{ item, field }">
              <el-input
                type="input"
                maxlength="2"
                :disabled="true"
                v-model="item[field]"
                placeholder="0"
              />
            </template>
          </contentTableDaily>
        </div>

        <div
          class="rounded bg-[#fff] px-[1.04vw] py-20px flex justify-center items-center"
          v-if="status == 2"
        >
          <p class="mr-[0.89vw]"
            >个人扣分总计:<span class="text-green-500 text-2xl">{{
              ruleForm.selfEvaluationDeductionSummation
            }}</span></p
          >
          <p class="mr-[0.89vw]"
            >审核扣分总计:<span class="text-green-500 text-2xl">{{
              ruleForm.leaderDeductionSummation
            }}</span></p
          >
          <p>
            得分:<span class="text-red-500 text-2xl">{{
              100 - Number(ruleForm.leaderDeductionSummation)
            }}</span></p
          >
        </div>

        <div class="rounded bg-[#fff] px-[1.04vw] py-10px" v-if="status != 0">
          <h3
            class="relative h3After mb-15px flex items-center font-bold text-16px pl-8px text-[#333]"
            >备注</h3
          >
          <!-- <div class="flex mb-15px">
            <p class="mr-[1.04vw]"
              >审核人：{{ approval.approvalUser ? approval.approvalUser : '--' }}</p
            >
            <p v-if="approval.approvalTime"
              >时间：{{
                approval.approvalTime
                  ? moment(new Date(approval.approvalTime)).format('YYYY-MM-DD HH:mm:ss')
                  : '--'
              }}</p
            >
          </div> -->
          <div class="flex mb-15px" v-if="approval.approvalUser">
            <p class="mr-[1.04vw]"
              >审核人：{{ approval.approvalUser ? approval.approvalUser : '--' }}</p
            >
            <p v-if="approval.approvalTime || approval.plannedTime"
              >时间：
              <span
                v-if="
                  status == '4' || (status == '1' && approval.plannedTime && !approval.approvalTime)
                "
                >{{
                  approval.plannedTime
                    ? moment(new Date(approval.plannedTime)).format('YYYY-MM-DD HH:mm:ss')
                    : '--'
                }}</span
              ><span v-else-if="status == '1' && approval.approvalTime && approval.plannedTime">
                {{
                  new Date(approval.plannedTime).getTime() >
                  new Date(approval.approvalTime).getTime()
                    ? moment(new Date(approval.plannedTime)).format('YYYY-MM-DD HH:mm:ss')
                    : moment(new Date(approval.approvalTime)).format('YYYY-MM-DD HH:mm:ss')
                }} </span
              ><span v-else>{{
                approval.approvalTime
                  ? moment(new Date(approval.approvalTime)).format('YYYY-MM-DD HH:mm:ss')
                  : '--'
              }}</span>
            </p>
          </div>
          <el-form-item prop="approvalAdvice">
            <el-input
              type="textarea"
              rows="4"
              :disabled="true"
              maxlength="500"
              v-model="approval.approvalAdvice"
            />
          </el-form-item>
        </div>
      </el-form>

      <div class="flex justify-center items-center mt-26px pb-20px" v-if="pageFlag != 'see'">
        <!-- <div
          class="w-[7.81vw] cursor-pointer text-16px flex rounded justify-center items-center h-42px bg-[#fff] text-[#191919] border-1 border-[#C9CCD4] mr-[0.625vw]"
          @click="submit(1)"
          >暂存</div
        > -->
        <el-button
          :loading="zcloading"
          :disabled="zcloading"
          class="load-button w-[7.81vw] cursor-pointer text-16px flex rounded justify-center items-center bg-[#fff] text-[#191919] border-1 border-[#C9CCD4] mr-[0.625vw]"
          @click="submit(1)"
          >暂存</el-button
        >
        <el-button
          :loading="loading"
          type="primary"
          :disabled="loading"
          class="load-button w-[7.81vw] cursor-pointer text-16px flex rounded justify-center items-center bg-[#00A0E9] text-[#fff] mr-[0.625vw]"
          @click="submit(2)"
          >提交</el-button
        >
        <!-- <div
          class="w-[7.81vw] cursor-pointer text-16px flex rounded justify-center items-center h-42px bg-[#00A0E9] text-[#fff]"
          @click="submit(2)"
          >提交</div
        > -->
      </div>
    </template>
  </DrawerWrap>
</template>

<script setup lang="ts">
import { DrawerWrap } from '@/components/DrawerWrapDetails'
import { contentTableDaily } from '../components'
import { ref, nextTick, reactive, inject } from 'vue'
import {
  saveApi,
  getByIdApi,
  updateApi,
  getAssTypeSelectApi,
  getWeekSelectApi
} from '@/api/assessment/monthly'

import { getMonthSelectApi } from '@/api/assessment/weekly'
import { ElMessage } from 'element-plus'
import moment from 'moment'
import { useCache } from '@/hooks/web/useCache'
import { useValidator } from '@/hooks/web/useValidator'
const { notSpace, validateNumZero } = useValidator()
const { wsCache } = useCache()
const darwerTitle = ref('')
const detailsId = ref()
const pageFlag = ref()
const assTypeData = ref<any>()

const status = ref()

const approval = ref({
  approvalUser: '',
  approvalTime: '',
  plannedTime: '',
  approvalAdvice: '',
  flag: 0
})

const personalAssessmentLength = ref(0)
const jobAssessmentLength = ref(0)
const zcloading = ref(false)
const loading = ref(false)
const isShow = ref(false)
const drawerWrap = ref()
const openDrawer = (type?, id?) => {
  drawerWrap.value.isShow = true
  detailsId.value = id ? id : ''
  pageFlag.value = type
  darwerTitle.value = type == 'add' ? '创建月报' : type == 'edit' ? '修改月报' : '月报详情'
  reset()
  getMonthSelect()

  if (id) {
    detailsId.value = id
    getDetails(id)
  }
}

const bookDateEndLimit = (time: any) => {
  // 获取当前日期（去除时间部分）
  const currentDate = new Date()
  const currentYear = currentDate.getFullYear()
  const currentMonth = currentDate.getMonth()
  const nextMonth = currentDate.getMonth() + 1

  // 将时间戳转换为日期对象
  const date = new Date(time)
  const year = date.getFullYear()
  const month = date.getMonth()
  //
  return (
    year < currentYear ||
    (year === currentYear && month < currentMonth) ||
    (year === currentYear && month > nextMonth) ||
    (currentMonth < 11 && year > currentYear) ||
    (currentMonth == 11 && year > currentYear + 1) ||
    (year === currentYear + 1 && month != 0 && currentMonth == 11)
  )
}

const rules = reactive({
  yearMonthValue: [{ required: true, message: '请选择年月', trigger: 'blur' }]
})

const headerTitle = ref([
  {
    title: '指标内容',
    width: 100,
    field: 'indexContent',
    rules: {
      indexContent: [{ required: true, message: '请选择指标内容', trigger: 'change' }]
    }
  },
  { title: '评分标准', field: 'standardsOfGrading', noSlot: true },
  {
    title: '工作任务',
    width: 140,
    field: 'workAssignment',
    rules: {
      workAssignment: [
        { required: true, message: '请输入工作任务', trigger: 'blur' },
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
  assessmentTime: moment(new Date()).format('YYYY-MM'),
  jobAssessment: [],
  personalAssessment: [],
  tyAssessment: [
    {
      indexContent: `担当能力：对本岗位所承担责任没有深刻的理解，无法根据工作需要承担一些本岗职责以外的责任，出现一次扣1分`
    },
    {
      indexContent: `沟通能力：不能准确的理解对方意图，不能准确地表达自己意见，导致工作偏差，出现一次扣1分`
    },
    {
      indexContent: `执行能力：不能与上级正常沟通，不注重沟通效果，不能准确理解领导意图，导致工作任务出现失误或拖延，出现一次扣1分`
    },
    {
      indexContent: `团队协作：同工作中相关岗位能够保持愉快的合作关系，收到工作投诉一次扣1分`
    }
  ],
  leaderDeductionSummation: 0,
  selfEvaluationDeductionSummation: 0
})

const weekSelectData = ref([])
const allMonthSelect = ref()
const currentTitle = ref([{ title: '素质能力考核标准', field: 'indexContent' }])
const getWeekSelect = async (j) => {
  let res = await getWeekSelectApi({
    assessmentTime: moment(new Date(ruleForm.value.assessmentTime)).format('YYYY-MM')
  })
  if (res && res.data) {
    let { data } = res
    weekSelectData.value = data
    // console.log(j.assessmentTime, j)
    ruleForm.value = {
      assessmentTime: moment(new Date(j.assessmentTime)).format('YYYY/MM'),
      jobAssessment: j.details
        .filter((v) => v.type == 1)
        .map((v) => {
          return {
            ...v,
            ...{
              execution: v.execution ? v.execution : getExecutionLabel(v.id)
            }
          }
        }),
      personalAssessment: j.details
        .filter((v) => v.type == 2)
        .map((v) => {
          return {
            ...v,
            ...{
              execution: v.execution ? v.execution : getExecutionLabel(v.id)
            }
          }
        }),
      tyAssessment: j.details.filter((v) => v.type == 3),
      leaderDeductionSummation: j.leaderDeductionSummation,
      selfEvaluationDeductionSummation: j.selfEvaluationDeductionSummation
    }
    jobAssessmentLength.value = ruleForm.value.jobAssessment.length
    personalAssessmentLength.value = ruleForm.value.personalAssessment.length
  }
}
// 考核类型
const getAssTypeSelect = async () => {
  let res = await getAssTypeSelectApi()
  if (res.data && res) {
    assTypeData.value = res.data.filter((v) => {
      return v.status == 1
    })
  }
}

getAssTypeSelect()

const getUserLabel = (value: string): string => {
  let label = ''
  assTypeData.value.map((item: any) => {
    if (value == item.indexContent) {
      label = item.standardsOfGrading
    }
  })
  return label
}

// 全部月下拉
const getMonthSelect = async () => {
  let res = await getMonthSelectApi({ yearMonthValue: ruleForm.value.yearMonthValue })
  if (res && res.data) {
    allMonthSelect.value = res.data.map((v) => {
      return {
        value: v.assessmentTime,
        label: v.assessmentTime,
        children: v.details.map((j) => {
          return {
            value: String(j.id),
            label: j.workAssignment
          }
        })
      }
    })
  }
}

const getExecutionLabel = (id: string): string => {
  let label = ''
  weekSelectData.value.map((item: any) => {
    if (id == item.assessmentDetailId) {
      label += item.workItems + ','
    }
  })
  label = label.replace(/,$/, '')
  return label
}

const assTypeChange = (e, index, type) => {
  if (type == 'job') {
    ruleForm.value.jobAssessment[index]['workAssignment'] = e
    ruleForm.value.jobAssessment[index]['standardsOfGrading'] = getUserLabel(e)
  } else if (type == 'person') {
    ruleForm.value.personalAssessment[index]['workAssignment'] = e
    ruleForm.value.personalAssessment[index]['standardsOfGrading'] = getUserLabel(e)
  }
}

const getDetails = async (id) => {
  let res = await getByIdApi({ id: id })
  if (res && res.data) {
    let { data } = res
    status.value = data.status
    ruleForm.value.assessmentTime = data.assessmentTime

    if (data.status == 1 || data.status == 2) {
      headerTitle.value = [
        {
          title: '指标内容',
          width: 100,
          field: 'indexContent'
        },
        { title: '评分标准', field: 'standardsOfGrading', noSlot: true },
        {
          title: '工作任务',
          width: 140,
          field: 'workAssignment'
        },
        { title: '指示', field: 'suggest' },
        {
          title: '完成情况',
          field: 'execution',
          isSlot: pageFlag.value == 'see' ? false : true,
          width: 200,
          rules: {
            execution: [
              { required: true, message: '请输入完成情况', trigger: 'blur' },
              {
                validator: (rule: any, value: string, callback: Callback) =>
                  notSpace(value, callback, '不能输入纯空格'),
                trigger: 'blur'
              }
            ]
          }
        },
        {
          title: '个人扣分',
          field: 'selfEvaluationDeduction',
          isSlot: pageFlag.value == 'see' ? false : true,
          width: 60,
          rules: {
            selfEvaluationDeduction: [
              {
                validator: (rule: any, value: string, callback: Callback) =>
                  validateNumZero(value, callback, '仅支持非负整数'),
                trigger: 'blur'
              }
            ]
          }
        },
        {
          title: '审核扣分',
          field: 'leaderDeduction',
          isSlot: pageFlag.value == 'see' ? false : true,
          width: 60
        }
      ]

      currentTitle.value = [
        { title: '素质能力考核标准', field: 'indexContent' },
        {
          title: '个人扣分',
          field: 'selfEvaluationDeduction',
          isSlot: pageFlag.value == 'see' ? false : true,
          width: 60,
          rules: {
            selfEvaluationDeduction: [
              {
                validator: (rule: any, value: string, callback: Callback) =>
                  validateNumZero(value, callback, '仅支持非负整数'),
                trigger: 'blur'
              }
            ]
          }
        },
        {
          title: '审核扣分',
          field: 'leaderDeduction',
          isSlot: pageFlag.value == 'see' ? false : true,
          width: 60
        }
      ]
    } else if (data.status == 4 || data.status == 6) {
      if (data.status == 4) {
        headerTitle.value = [
          {
            title: '指标内容',
            width: 100,
            field: 'indexContent',
            rules: {
              indexContent: [{ required: true, message: '请选择指标内容', trigger: 'change' }]
            }
          },
          { title: '评分标准', field: 'standardsOfGrading', noSlot: true },
          {
            title: '工作任务',
            width: 140,
            field: 'workAssignment',
            rules: {
              workAssignment: [
                { required: true, message: '请输入工作任务', trigger: 'change' },
                {
                  validator: (rule: any, value: string, callback: Callback) =>
                    notSpace(value, callback, '不能输入纯空格'),
                  trigger: 'blur'
                }
              ]
            }
          },
          { title: '指示', field: 'suggest' },
          {
            title: '完成情况',
            field: 'execution',
            width: 200,
            rules: {
              execution: [
                { required: true, message: '请输入完成情况', trigger: 'blur' },
                {
                  validator: (rule: any, value: string, callback: Callback) =>
                    notSpace(value, callback, '不能输入纯空格'),
                  trigger: 'blur'
                }
              ]
            }
          },
          {
            title: '个人扣分',
            field: 'selfEvaluationDeduction',
            width: 60,
            rules: {
              selfEvaluationDeduction: [
                {
                  validator: (rule: any, value: string, callback: Callback) =>
                    validateNumZero(value, callback, '仅支持非负整数'),
                  trigger: 'blur'
                }
              ]
            }
          }
        ]

        currentTitle.value = [
          { title: '素质能力考核标准', field: 'indexContent' },
          {
            title: '个人扣分',
            field: 'selfEvaluationDeduction',
            isSlot: pageFlag.value == 'see' ? false : true,
            width: 60,
            rules: {
              selfEvaluationDeduction: [
                {
                  validator: (rule: any, value: string, callback: Callback) =>
                    validateNumZero(value, callback, '仅支持非负整数'),
                  trigger: 'blur'
                }
              ]
            }
          }
        ]
      } else {
        headerTitle.value = [
          {
            title: '指标内容',
            width: 100,
            field: 'indexContent',
            rules: {
              indexContent: [{ required: true, message: '请选择指标内容', trigger: 'change' }]
            }
          },
          { title: '评分标准', field: 'standardsOfGrading', noSlot: true },
          {
            title: '工作任务',
            width: 140,
            field: 'workAssignment',
            rules: {
              workAssignment: [
                { required: true, message: '请输入工作任务', trigger: 'change' },
                {
                  validator: (rule: any, value: string, callback: Callback) =>
                    notSpace(value, callback, '不能输入纯空格'),
                  trigger: 'blur'
                }
              ]
            }
          },
          { title: '指示', field: 'suggest' },
          {
            title: '完成情况',
            field: 'execution',
            width: 200,
            rules: {
              execution: [
                { required: true, message: '请输入完成情况', trigger: 'blur' },
                {
                  validator: (rule: any, value: string, callback: Callback) =>
                    notSpace(value, callback, '不能输入纯空格'),
                  trigger: 'blur'
                }
              ]
            }
          },
          {
            title: '个人扣分',
            field: 'selfEvaluationDeduction',
            width: 60,
            rules: {
              selfEvaluationDeduction: [
                {
                  validator: (rule: any, value: string, callback: Callback) =>
                    validateNumZero(value, callback, '仅支持非负整数'),
                  trigger: 'blur'
                }
              ]
            }
          },
          {
            title: '审核扣分',
            field: 'leaderDeduction',
            width: 60
          }
        ]

        currentTitle.value = [
          { title: '素质能力考核标准', field: 'indexContent' },
          {
            title: '个人扣分',
            field: 'selfEvaluationDeduction',
            isSlot: pageFlag.value == 'see' ? false : true,
            width: 60,
            rules: {
              selfEvaluationDeduction: [
                {
                  validator: (rule: any, value: string, callback: Callback) =>
                    validateNumZero(value, callback, '仅支持非负整数'),
                  trigger: 'blur'
                }
              ]
            }
          },
          {
            title: '审核扣分',
            field: 'leaderDeduction',
            width: 60
          }
        ]
      }
    } else if (data.status == 0 || data.status == 5) {
      headerTitle.value = [
        {
          title: '指标内容',
          width: 100,
          field: 'indexContent',
          rules: {
            indexContent: [{ required: true, message: '请选择指标内容', trigger: 'change' }]
          }
        },
        { title: '评分标准', field: 'standardsOfGrading', noSlot: true },
        {
          title: '工作任务',
          width: 140,
          field: 'workAssignment',
          rules: {
            workAssignment: [
              { required: true, message: '请输入工作任务', trigger: 'blur' },
              {
                validator: (rule: any, value: string, callback: Callback) =>
                  notSpace(value, callback, '不能输入纯空格'),
                trigger: 'blur'
              }
            ]
          }
        }
      ]
      currentTitle.value = [{ title: '素质能力考核标准', field: 'indexContent' }]
    } else if (data.status == 3) {
      headerTitle.value = [
        {
          title: '指标内容',
          width: 100,
          field: 'indexContent',
          rules: {
            indexContent: [{ required: true, message: '请选择指标内容', trigger: 'change' }]
          }
        },
        { title: '评分标准', field: 'standardsOfGrading', noSlot: true },
        {
          title: '工作任务',
          width: 140,
          field: 'workAssignment',
          rules: {
            workAssignment: [
              { required: true, message: '请输入工作任务', trigger: 'blur' },
              {
                validator: (rule: any, value: string, callback: Callback) =>
                  notSpace(value, callback, '不能输入纯空格'),
                trigger: 'blur'
              }
            ]
          }
        },
        { title: '指示', field: 'suggest', noSlot: true }
      ]
    }

    approval.value.approvalUser = data.approvalUser
    approval.value.approvalTime = data.approvalTime
    approval.value.plannedTime = data.plannedTime

    approval.value.flag = data.flag
    approval.value.approvalAdvice = data.approvalAdvice
    if (data.status == 4) {
      console.log(data)
      getWeekSelect(data)
    } else {
      ruleForm.value = {
        assessmentTime: data.assessmentTime,
        jobAssessment: data.details.some((v) => v.type == 1)
          ? data.details.filter((v) => v.type == 1)
          : [],
        personalAssessment: data.details.some((v) => v.type == 2)
          ? data.details.filter((v) => v.type == 2)
          : [],
        tyAssessment: data.details.some((v) => v.type == 3)
          ? data.details.filter((v) => v.type == 3)
          : [],
        leaderDeductionSummation: data.leaderDeductionSummation,
        selfEvaluationDeductionSummation: data.selfEvaluationDeductionSummation
      }
    }

    jobAssessmentLength.value = ruleForm.value.jobAssessment.length
    personalAssessmentLength.value = ruleForm.value.personalAssessment.length
  }
}

const getList: any = inject('getList')
const formRef = ref()
const ybgw = ref()
const ybgr = ref()
const ybty = ref()
const submit = async (saveOrSubmit) => {
  if (!ruleForm.value.jobAssessment.length && !ruleForm.value.personalAssessment.length) {
    ElMessage.error('请填写月报内容！')
    return
  }

  if (ybgw.value.subCont() || ybgr.value.subCont()) {
    ElMessage.error('存在未保存的月报内容！')
    return
  }

  let flag = true
  if (status.value == 1 || status.value == 2) {
    let ybgwFlag = await ybgw.value.check()
    let ybgrFlag = await ybgr.value.check()
    let ybtyFlag = await ybty.value.check()
    flag = ybgwFlag && ybgrFlag && ybtyFlag
  }

  if (!flag) {
    return false
  }
  if (!formRef.value) return
  await formRef.value?.validate(async (isValid) => {
    if (isValid) {
      ruleForm.value.jobAssessment = ruleForm.value.jobAssessment.map((v) => {
        const keys = Object.keys(v)
        if (keys.includes('type')) {
          return { ...v, ...{ deptAssessmentTypeId: 1 } }
        } else {
          return { ...v, ...{ type: 1, deptAssessmentTypeId: 1 } }
        }
      })

      ruleForm.value.personalAssessment = ruleForm.value.personalAssessment.map((v) => {
        const keys = Object.keys(v)
        if (keys.includes('type')) {
          return { ...v, ...{ deptAssessmentTypeId: 1 } }
        } else {
          return { ...v, ...{ type: 2, deptAssessmentTypeId: 1 } }
        }
      })

      ruleForm.value.tyAssessment = ruleForm.value.tyAssessment.map((v) => {
        return { ...v, ...{ deptAssessmentTypeId: 1, type: 3 } }
      })

      let arr = [
        ...ruleForm.value.jobAssessment,
        ...ruleForm.value.personalAssessment,
        ...ruleForm.value.tyAssessment
      ]

      let count = 0
      arr.forEach((v) => {
        if (v.selfEvaluationDeduction) {
          count += Number(v.selfEvaluationDeduction)
        }
      })

      if (count > 100) {
        ElMessage.error('个人扣分总和不能大于100')
        return false
      }

      ruleForm.value.selfEvaluationDeductionSummation = count

      let data: any = {
        saveOrSubmit: saveOrSubmit,
        assessmentTime: moment(new Date(ruleForm.value.assessmentTime)).format('YYYY-MM'),
        details: arr,
        leaderDeductionSummation: ruleForm.value.leaderDeductionSummation,
        selfEvaluationDeductionSummation: ruleForm.value.selfEvaluationDeductionSummation,
        approvalAdvice: ''
      }

      if (saveOrSubmit == 1) {
        zcloading.value = true
      } else {
        loading.value = true
      }
      if (detailsId.value) {
        data.id = detailsId.value
        try {
          let res = await updateApi(data)
          if (res) {
            ElMessage.success('保存成功')
          }
        } catch (err) {
          zcloading.value = false
          loading.value = false
          return false
        }
      } else {
        try {
          let res = await saveApi(data)
          if (res) {
            ElMessage.success('保存成功')
          }
        } catch (err) {
          zcloading.value = false
          loading.value = false
          return false
        }
      }
      getList()
      drawerWrap.value.isShow = false
      zcloading.value = false
      loading.value = false
    }
  })
}

// 清空
const reset = () => {
  ruleForm.value = {
    assessmentTime: moment(new Date()).format('YYYY/MM'),
    jobAssessment: [],
    personalAssessment: [],
    tyAssessment: [
      {
        indexContent: `担当能力：对本岗位所承担责任没有深刻的理解，无法根据工作需要承担一些本岗职责以外的责任，出现一次扣1分`
      },
      {
        indexContent: `沟通能力：不能准确的理解对方意图，不能准确地表达自己意见，导致工作偏差，出现一次扣1分`
      },
      {
        indexContent: `执行能力：不能与上级正常沟通，不注重沟通效果，不能准确理解领导意图，导致工作任务出现失误或拖延，出现一次扣1分`
      },
      {
        indexContent: `团队协作：同工作中相关岗位能够保持愉快的合作关系，收到工作投诉一次扣1分`
      }
    ],
    leaderDeductionSummation: 0,
    selfEvaluationDeductionSummation: 0
  }
  status.value = 0
  personalAssessmentLength.value = 0
  jobAssessmentLength.value = 0
  approval.value = {
    approvalUser: '',
    approvalTime: '',
    plannedTime: '',
    approvalAdvice: '',
    flag: 0
  }
  nextTick(() => {
    ybgw.value.reset()
    ybgr.value.reset()
  })

  headerTitle.value = [
    {
      title: '指标内容',
      width: 100,
      field: 'indexContent',
      rules: {
        indexContent: [
          { required: true, message: '请选择指标内容', trigger: 'change' },
          {
            validator: (rule: any, value: string, callback: Callback) =>
              notSpace(value, callback, '不能输入纯空格'),
            trigger: 'blur'
          }
        ]
      }
    },
    { title: '评分标准', field: 'standardsOfGrading', noSlot: true },
    {
      title: '工作任务',
      width: 140,
      field: 'workAssignment',
      rules: {
        workAssignment: [
          { required: true, message: '请输入工作任务', trigger: 'blur' },
          {
            validator: (rule: any, value: string, callback: Callback) =>
              notSpace(value, callback, '不能输入纯空格'),
            trigger: 'blur'
          }
        ]
      }
    }
  ]
  currentTitle.value = [{ title: '素质能力考核标准', field: 'indexContent' }]
}

defineExpose({
  openDrawer
})
</script>

<style lang="less" scoped>
:deep(.el-card__body) {
  padding: 0 !important;
}
:deep(.el-form-item) {
  margin-bottom: 12;
}
:deep(.load-button) {
  height: 40px !important;
}
.h3After {
  &::after {
    content: '';
    width: 3px;
    height: 15px;
    position: absolute;
    top: 50%;
    background: #00a0e9;
    left: 0;
    transform: translateY(-50%);
  }
}
</style>

<style>
.zhibiaoxila {
  max-width: 80vw !important;
}
</style>
