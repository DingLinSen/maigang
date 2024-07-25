<template>
  <DrawerWrap
    :title="pageFlag == 'edit' ? '月报审核' : '详情'"
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
                  v-model="ruleForm.assessmentTime"
                  type="month"
                  format="YYYY-MM"
                  :disabled="true"
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
                  v-model="createByName"
                  placeholder="请输入考核人"
                />
              </el-form-item>
            </el-col>
          </el-row>
        </div>
        <div class="rounded bg-[#fff] px-[1.04vw] py-10px pb-20px mb-20px">
          <ContentTable
            ref="yshgw"
            :isDelAction="true"
            :title="'岗位指标考核'"
            :headerTitle="headerTitle"
            v-model="ruleForm.jobAssessment"
          >
            <template #suggest="{ item, field, index }">
              <el-input
                type="textarea"
                autosize
                rows="1"
                :disabled="pageFlag == 'see'"
                maxlength="500"
                v-model="item[field]"
                placeholder="请输入指示要求"
              />
            </template>
            <template #selfEvaluationDeduction="{ item, field }">
              <el-input
                type="input"
                maxlength="2"
                :disabled="true"
                v-model="item[field]"
                placeholder="0"
              />
            </template>
            <template #leaderDeduction="{ item, field }">
              <el-input
                type="input"
                :disabled="pageFlag == 'see'"
                maxlength="2"
                v-model="item[field]"
                placeholder="0"
              />
            </template>
          </ContentTable>
        </div>

        <div class="rounded bg-[#fff] px-[1.04vw] py-10px pb-20px mb-20px">
          <ContentTable
            ref="yshgr"
            :isDelAction="true"
            :title="'个人指标考核'"
            :headerTitle="headerTitle"
            v-model="ruleForm.personalAssessment"
          >
            <template #suggest="{ item, field }">
              <el-input
                type="textarea"
                autosize
                rows="1"
                :disabled="pageFlag == 'see'"
                maxlength="500"
                v-model="item[field]"
                placeholder="请输入指示要求"
              />
            </template>
            <template #selfEvaluationDeduction="{ item, field }">
              <el-input
                type="input"
                maxlength="2"
                :disabled="true"
                v-model="item[field]"
                placeholder="0"
              />
            </template>
            <template #leaderDeduction="{ item, field }">
              <el-input
                type="input"
                maxlength="2"
                :disabled="pageFlag == 'see'"
                v-model="item[field]"
                placeholder="0"
              />
            </template>
          </ContentTable>
        </div>

        <div class="rounded bg-[#fff] px-[1.04vw] py-10px">
          <ContentTable
            ref="yshgs"
            :title="'公司指标考核'"
            :isDelAction="true"
            :isDropdown="false"
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
                :disabled="true"
                v-model="item[field]"
                placeholder="0"
              />
            </template>
            <template #leaderDeduction="{ item, field }">
              <el-input
                type="input"
                maxlength="2"
                :disabled="pageFlag == 'see'"
                v-model="item[field]"
                placeholder="0"
              />
            </template>
          </ContentTable>
        </div>
        <div
          class="rounded bg-[#fff] px-[1.04vw] py-20px flex justify-center items-center"
          v-if="status == 1 || status == 2"
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
              :disabled="pageFlag == 'see'"
              maxlength="500"
              v-model="ruleForm.approvalAdvice"
              :placeholder="pageFlag == 'see' ? '' : '请输入备注'"
            />
          </el-form-item>
        </div>
      </el-form>

      <div class="flex justify-center items-center mt-26px pb-20px" v-if="pageFlag != 'see'">
        <el-button
          :loading="tyloading"
          :disabled="tyloading"
          type="primary"
          class="load-button w-[7.81vw] cursor-pointer text-16px flex rounded justify-center items-center bg-[#fff] text-[#191919] border-1 border-[#C9CCD4] mr-[0.625vw]"
          @click="submit(1)"
          >同意</el-button
        >
        <el-button
          :loading="bhloading"
          type="danger"
          plain
          :disabled="bhloading"
          class="load-button w-[7.81vw] cursor-pointer text-16px flex rounded justify-center items-center bg-[#00A0E9] text-[#fff] mr-[0.625vw]"
          @click="submit(2)"
          >驳回</el-button
        >
        <!-- <div
          class="w-[7.81vw] cursor-pointer text-16px flex rounded justify-center items-center h-42px bg-[#00A0E9] text-[#fff] mr-[0.625vw]"
          @click="submit(1)"
          >同意</div
        >
        <div
          class="w-[7.81vw] cursor-pointer text-16px flex rounded justify-center items-center h-42px bg-[#fff] text-[#FF3939] border-1 border-[#EA6D6D]"
          @click="submit(2)"
          >驳回</div
        > -->
      </div>
    </template>
  </DrawerWrap>
</template>

<script setup lang="ts">
import { DrawerWrap } from '@/components/DrawerWrapDetails'
import { ContentTable } from '../components'
import { ref, reactive, inject } from 'vue'
import { getAuditApi, getByIdApi } from '@/api/assessment/monthly'
import { ElMessage } from 'element-plus'
import moment from 'moment'

import { useCache } from '@/hooks/web/useCache'
import { useValidator } from '@/hooks/web/useValidator'
const { notSpace, validateNumZero } = useValidator()
const { wsCache } = useCache()

const approval = ref({
  approvalUser: '',
  approvalTime: '',
  approvalAdvice: '',
  plannedTime: '',
  flag: 0
})

const createByName = ref()
const detailsId = ref()
const pageFlag = ref()
const tyloading = ref(false)
const bhloading = ref(false)
const isShow = ref(false)
const drawerWrap = ref()
const openDrawer = (type?, id?) => {
  drawerWrap.value.isShow = true
  detailsId.value = id ? id : ''
  pageFlag.value = type
  reset()

  if (id) {
    detailsId.value = id
    getDetails(id)
  }
}

const rules = reactive({
  assessmentTime: [{ required: true, message: '请选择年月', trigger: 'blur' }],
  approvalAdvice: [
    {
      validator: (rule: any, value: string, callback: Callback) =>
        notSpace(value, callback, '不能输入纯空格'),
      trigger: 'blur'
    }
  ]
})

// const isShow =

const headerTitle: any = ref([
  { title: '指标内容', field: 'indexContent', isShow: false, width: 60, dropdownShow: true },
  { title: '评分标准', field: 'standardsOfGrading', isShow: false, width: 60, dropdownShow: true },
  { title: '工作任务', field: 'workAssignment', isShow: true, width: 200, dropdownShow: false },
  {
    title: '完成情况',
    field: 'execution',
    rules: {
      execution: [
        {
          validator: (rule: any, value: string, callback: Callback) =>
            notSpace(value, callback, '不能输入纯空格'),
          trigger: 'blur'
        }
      ]
    },
    width: 300,
    isShow: true,
    dropdownShow: false
  },
  {
    title: '指示要求',
    field: 'suggest',
    isSlot: pageFlag.value == 'see' ? false : true,
    width: 100,
    isShow: false,
    dropdownShow: true
  },
  {
    title: '个人扣分',
    field: 'selfEvaluationDeduction',
    isSlot: pageFlag.value == 'see' ? false : true,
    width: 40,
    isShow: false,
    dropdownShow: true
  },
  {
    title: '审核扣分',
    field: 'leaderDeduction',
    isSlot: pageFlag.value == 'see' ? false : true,
    width: 40,
    rules: {
      leaderDeduction: [
        {
          validator: (rule: any, value: string, callback: Callback) =>
            validateNumZero(value, callback, '仅支持非负整数'),
          trigger: 'blur'
        }
      ]
    },
    isShow: false,
    dropdownShow: true
  }
])

//表单数据
const ruleForm = ref<any>({
  saveOrSubmit: 2,
  assessmentTime: '',
  jobAssessment: [],
  personalAssessment: [],
  tyAssessment: [],
  approvalAdvice: '',
  leaderDeductionSummation: 0,
  selfEvaluationDeductionSummation: 0
})
const status = ref()
const currentTitle = ref([
  { title: '素质能力考核标准', field: 'indexContent', isShow: true, dropdownShow: true }
])

const getDetails = async (id) => {
  let res = await getByIdApi({ id: id })
  if (res && res.data) {
    let { data } = res
    status.value = data.status
    createByName.value = data.createByName

    approval.value.approvalUser = data.approvalUser
    approval.value.approvalTime = data.approvalTime
    approval.value.plannedTime = data.plannedTime

    approval.value.flag = data.flag
    approval.value.approvalAdvice = data.approvalAdvice
    if (data.status == 5 || data.status == 0 || data.status == 3) {
      headerTitle.value = [
        { title: '指标内容', field: 'indexContent', isShow: true, width: 60, dropdownShow: false },
        {
          title: '评分标准',
          field: 'standardsOfGrading',
          isShow: false,
          width: 60,
          dropdownShow: true
        },
        {
          title: '工作任务',
          field: 'workAssignment',
          width: 200,
          isShow: true,
          dropdownShow: false
        },
        {
          title: '指示要求',
          field: 'suggest',
          isSlot: pageFlag.value == 'see' ? false : true,
          width: 100,
          rules: {
            suggest: [
              {
                validator: (rule: any, value: string, callback: Callback) =>
                  notSpace(value, callback, '不能输入纯空格'),
                trigger: 'blur'
              }
            ]
          },
          isShow: true,
          dropdownShow: false
        }
      ]
      currentTitle.value = [
        { title: '素质能力考核标准', field: 'indexContent', isShow: true, dropdownShow: true }
      ]
    } else if (data.status == 1 || data.status == 4 || data.status == 2 || data.status == 6) {
      currentTitle.value = [
        { title: '素质能力考核标准', field: 'indexContent', isShow: true, dropdownShow: true },
        {
          title: '个人扣分',
          field: 'selfEvaluationDeduction',
          isSlot: pageFlag.value == 'see' ? false : true,
          width: 40,
          isShow: true,
          dropdownShow: true
        },
        {
          title: '审核扣分',
          field: 'leaderDeduction',
          isSlot: pageFlag.value == 'see' ? false : true,
          width: 40,
          rules: {
            leaderDeduction: [
              {
                validator: (rule: any, value: string, callback: Callback) =>
                  validateNumZero(value, callback, '仅支持非负整数'),
                trigger: 'blur'
              }
            ]
          },
          isShow: true,
          dropdownShow: true
        }
      ]
      headerTitle.value = [
        { title: '指标内容', field: 'indexContent', isShow: false, width: 60, dropdownShow: true },
        {
          title: '评分标准',
          field: 'standardsOfGrading',
          isShow: false,
          width: 60,
          dropdownShow: true
        },
        {
          title: '工作任务',
          field: 'workAssignment',
          isShow: true,
          width: 200,
          dropdownShow: false
        },
        {
          title: '指示要求',
          field: 'suggest',
          width: 100,
          isShow: false,
          dropdownShow: true
        },
        {
          title: '完成情况',
          field: 'execution',
          isShow: true,
          width: 300,
          dropdownShow: false
        },
        {
          title: '个人扣分',
          field: 'selfEvaluationDeduction',
          isSlot: pageFlag.value == 'see' ? false : true,
          width: 40,
          isShow: true,
          dropdownShow: false
        },
        {
          title: '审核扣分',
          field: 'leaderDeduction',
          isSlot: pageFlag.value == 'see' ? false : true,
          width: 40,
          rules: {
            leaderDeduction: [
              {
                validator: (rule: any, value: string, callback: Callback) =>
                  validateNumZero(value, callback, '仅支持非负整数'),
                trigger: 'blur'
              }
            ]
          },
          isShow: true,
          dropdownShow: false
        }
      ]
    }
    ruleForm.value = {
      saveOrSubmit: data.saveOrSubmit,
      assessmentTime: data.assessmentTime,
      approvalAdvice: data.approvalAdvice,
      jobAssessment: data.details.filter((v) => v.type == 1),
      personalAssessment: data.details.filter((v) => v.type == 2),
      tyAssessment: data.details.filter((v) => v.type == 3),
      leaderDeductionSummation: data.leaderDeductionSummation,
      selfEvaluationDeductionSummation: data.selfEvaluationDeductionSummation
    }
  }
}

const yshgw: any = ref()
const yshgr: any = ref()
const yshgs: any = ref()

const getList: any = inject('getList')
const formRef = ref()
const submit = async (flag) => {
  let yshgwFlag = await yshgw.value.check()
  let yshgrFlag = await yshgr.value.check()
  let yshgsFlag = await yshgs.value.check()
  if (yshgwFlag && yshgrFlag && yshgsFlag) {
    if (!formRef.value) return
    await formRef.value?.validate(async (isValid) => {
      if (isValid) {
        ruleForm.value.jobAssessment = ruleForm.value.jobAssessment.map((v) => {
          const keys = Object.keys(v)
          if (keys.includes('type')) {
            return v
          } else {
            return { ...v, ...{ type: 1, deptAssessmentTypeId: 1 } }
          }
        })

        ruleForm.value.personalAssessment = ruleForm.value.personalAssessment.map((v) => {
          const keys = Object.keys(v)
          if (keys.includes('type')) {
            return v
          } else {
            return { ...v, ...{ type: 2, deptAssessmentTypeId: 1 } }
          }
        })

        ruleForm.value.tyAssessment = ruleForm.value.tyAssessment.map((v) => {
          return { ...v, ...{ type: 3, deptAssessmentTypeId: 1 } }
        })

        let arr = [
          ...ruleForm.value.jobAssessment,
          ...ruleForm.value.personalAssessment,
          ...ruleForm.value.tyAssessment
        ]

        let count = 0
        let leaderCount = 0
        arr.forEach((v) => {
          if (v.selfEvaluationDeduction) {
            count += Number(v.selfEvaluationDeduction)
          }
          if (v.leaderDeduction) {
            leaderCount += Number(v.leaderDeduction)
          }
        })

        if (count > 100) {
          ElMessage.error('个人扣分总和不能大于100')
          return false
        }

        if (leaderCount > 100) {
          ElMessage.error('审核扣分总和不能大于100')
          return false
        }

        ruleForm.value.selfEvaluationDeductionSummation = count
        ruleForm.value.leaderDeductionSummation = leaderCount

        let data: any = {
          assessmentTime: moment(new Date(ruleForm.value.assessmentTime)).format(
            'YYYY-MM-DD HH:mm:ss'
          ),
          details: arr,
          approvalAdvice: ruleForm.value.approvalAdvice,
          leaderDeductionSummation: ruleForm.value.leaderDeductionSummation,
          selfEvaluationDeductionSummation: ruleForm.value.selfEvaluationDeductionSummation
        }

        if (detailsId.value) {
          data.id = detailsId.value
          data.flag = flag
          data.approvalUser = wsCache.get('userInfo').nickName
          if (flag == 1) {
            tyloading.value = true
            try {
              let res = await getAuditApi(data)
              if (res) {
                ElMessage.success('审批通过')
              }
            } catch (err) {
              setTimeout(() => {
                tyloading.value = false
              }, 200)
              return false
            }
          } else {
            if (!data.approvalAdvice) {
              ElMessage.error('请输入备注')
              return false
            }
            bhloading.value = true
            try {
              let res = await getAuditApi(data)
              if (res) {
                ElMessage.success('已驳回')
              }
            } catch (err) {
              setTimeout(() => {
                bhloading.value = false
              }, 200)
              return false
            }
          }
        }
        getList()
        drawerWrap.value.isShow = false
        setTimeout(() => {
          bhloading.value = false
          tyloading.value = false
        }, 200)
      }
    })
  }
}

// 清空
const reset = () => {
  ruleForm.value = {
    saveOrSubmit: 2,
    assessmentTime: '',
    jobAssessment: [],
    personalAssessment: [],
    leaderDeductionSummation: 0,
    selfEvaluationDeductionSummation: 0
  }

  approval.value = {
    approvalUser: '',
    approvalTime: '',
    plannedTime: '',
    approvalAdvice: '',
    flag: 0
  }

  status.value = 0
  currentTitle.value = [
    { title: '素质能力考核标准', field: 'indexContent', isShow: true, dropdownShow: true }
  ]
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
// :deep(.el-form-item) {
//   margin-bottom: 0;
// }
</style>

<style lang="less" scoped>
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
