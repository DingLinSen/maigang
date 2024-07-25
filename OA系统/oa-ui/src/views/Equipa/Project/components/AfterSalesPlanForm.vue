<!--售后计划书-->
<!-- 立项详情-申请结束转实施 -->
<script setup lang="ts">
import { reactive, unref, ref, nextTick, watch } from 'vue'
import { ElMessage, ElForm, ElFormItem, ElDatePicker } from 'element-plus'
import moment from 'moment'

const props = defineProps({
  detailsData: {
    type: Object,
    default: {}
  },
  border: {
    type: Boolean,
    default: true
  }
})

const ruleForm = ref<any>({
  acceptDate: '', //验收时间
  afterSaleDate: '', //售后期限
  afterSaleDeadline: '', //售后截止日期
  afterSalePerson: '', //售后负责人
  afterSalePersonName: '', //售后负责人
  afterSalePlan: '', //售后服务计划
  afterSalePurpose: '', //售后服务目的
  afterSaleRequire: '', //售后服务要求
  afterSaleType: '', //售后服务类型 1本部门 2 研发中心
  audit: false, //
  auditSort: '', //转售后审批流程序号 0 未审批 1销售经理上级已审批 2销售经理上级驳回 3 总经理已审批 4总经理驳回
  beginTime: '', //
  createBy: '',
  createTime: '',
  endTime: '',
  finalDate: '', //	尾款时间
  finalMoney: '', //	尾款金额
  id: '',
  itemNumber: '',
  leaders: '',
  ownerName: '', //	用户名称
  params: null,
  paymentDate: '', //回款时间
  paymentFilePath: '',
  paymentMoney: '', //回款金额
  paymentRate: '', //已回款比例
  phase: '',
  pid: '',
  pmAuditList: [],
  pmProgressList: [],
  pollingDate: '', //巡检开始时间
  pollingDateType: '', //巡检时间 1 每周 2 每月 3 每季度 4 每年
  projectAffiliation: '', //项目属性1直签、2转签
  projectTitle: '',
  projectType: '',
  remark: '',
  salesManager: '', //销售经理
  salesManagerLeader: '', //销售经理
  salesManagerLeaderName: '', //销售经理
  salesManagerName: '', //销售经理
  status: '', //1实施转售后审批中，2售后中，3项目结束，4项目结束审批中
  updateBy: '', //
  updateTime: '', //
  year: null
})
// 监听父级传递数据
watch(
  () => props.detailsData,
  (data: any) => {
    if (data) {
      nextTick(() => {
        ruleForm.value = props.detailsData
        ruleForm.value.projectTitle = props.detailsData.projectTitle
        ruleForm.value.itemNumber = props.detailsData.itemNumber
        ruleForm.value.implementDept = ruleForm.value.implementDept
          ? Number(ruleForm.value.implementDept)
          : ''
      })
    }
  },
  {
    immediate: true
  }
)

const formRef = ref<any>()
const sureLoading = ref<boolean>(false)
const endDialogVisible = ref(false)

const rules = reactive({})
defineExpose({})
</script>

<template>
  <section
    class="border-solid border-1 px-6"
    :class="border ? 'border-1 mt-6  pt-4 pb-6' : 'border-0'"
  >
    <h3 class="form-title">项目售后计划书</h3>
    <p class="form-number pb-2">项目编号：{{ detailsData.itemNumber || '--' }}&nbsp;&nbsp;</p>
    <el-form
      :model="ruleForm"
      :rules="rules"
      ref="formRef"
      label-width="150px"
      class="demo-ruleForm"
    >
      <el-row>
        <el-col :span="12" class="padding-right">
          <el-form-item label="项目名称" prop="projectTitle" class="w-full">
            <el-Input disabled v-model="ruleForm.projectTitle" />
          </el-form-item>
        </el-col>
        <el-col :span="12" class="padding-right">
          <el-form-item label="用户名称" prop="ownerName" class="w-full">
            <el-Input v-model="ruleForm.ownerName" disabled />
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="12" class="padding-right">
          <el-form-item label="验收日期" prop="acceptDate" class="w-full">
            <div class="el-p">
              <el-date-picker
                type="date"
                placeholder="选择日期"
                disabled
                style="width: 100%"
                v-model="ruleForm.acceptDate"
              />
            </div>
          </el-form-item>
        </el-col>
        <el-col :span="12" class="padding-right">
          <el-form-item label="回款日期" prop="paymentDate" class="w-full">
            <div class="el-p">
              <el-date-picker
                type="date"
                placeholder="选择日期"
                style="width: 100%"
                disabled
                v-model="ruleForm.paymentDate"
              />
            </div>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="12" class="padding-right">
          <el-form-item label="回款金额（万元）" prop="paymentMoney" class="w-full">
            <el-Input
              v-model="ruleForm.paymentMoney"
              maxlength="13"
              @change="paymentMoneyChange"
              disabled
            />
          </el-form-item>
        </el-col>
        <el-col :span="12" class="padding-right">
          <el-form-item label="尾款时间" prop="finalDate" class="w-full">
            <div class="el-p">
              <el-date-picker
                type="date"
                placeholder="选择日期"
                style="width: 100%"
                v-model="ruleForm.finalDate"
                disabled
              />
            </div>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="12" class="padding-right">
          <el-form-item label="尾款金额（万元）" prop="finalMoney" class="w-full">
            <el-Input v-model="ruleForm.finalMoney" disabled />
          </el-form-item>
        </el-col>
        <el-col :span="12" class="padding-right">
          <el-form-item label="已回款比例（%）" prop="paymentRate" class="w-full">
            <el-Input v-model="ruleForm.paymentRate" disabled />
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="12" class="padding-right">
          <el-form-item label="售后期限" prop="afterSaleDate" class="w-full">
            <el-Input v-model="ruleForm.afterSaleDate" maxlength="10" disabled />
          </el-form-item>
        </el-col>
        <el-col :span="12" class="padding-right">
          <el-form-item label="售后截至时间" prop="afterSaleDeadline" class="w-full">
            <div class="el-p">
              <el-date-picker
                type="date"
                placeholder="选择日期"
                style="width: 100%"
                v-model="ruleForm.afterSaleDeadline"
                disabled
              />
            </div>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="12" class="padding-right">
          <el-form-item label="巡检开始时间" prop="pollingDate" class="w-full">
            <div class="el-p">
              <el-date-picker
                type="date"
                placeholder="选择日期"
                style="width: 100%"
                v-model="ruleForm.pollingDate"
                disabled
              />
            </div>
          </el-form-item>
        </el-col>
        <el-col :span="12" class="padding-right">
          <el-form-item label="巡检周期" prop="pollingDateType" class="w-full">
            <el-select
              v-model="ruleForm.pollingDateType"
              placeholder="选择巡检周期"
              style="width: 100%"
              disabled
            >
              <el-option value="1" label="一周" />
              <el-option value="2" label="一月" />
              <el-option value="3" label="一季度" />
              <el-option value="4" label="一年" />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-form-item label="售后服务部门" prop="afterSaleType" class="w-full">
          <el-Radio-group v-model="ruleForm.afterSaleType" disabled>
            <el-Radio label="1">本部门</el-Radio>
            <el-Radio label="2">研发中心</el-Radio>
          </el-Radio-group>
        </el-form-item>
      </el-row>
      <el-row>
        <el-form-item label="售后服务要求" prop="afterSaleRequire" class="w-full">
          <el-Input
            maxlength="1000"
            type="textarea"
            autosize
            v-model="ruleForm.afterSaleRequire"
            disabled
          />
        </el-form-item>
      </el-row>

      <el-row>
        <el-form-item label="售后服务目的" prop="afterSalePurpose" class="w-full">
          <el-Input
            maxlength="1000"
            type="textarea"
            autosize
            v-model="ruleForm.afterSalePurpose"
            disabled
          />
        </el-form-item>
      </el-row>
      <el-row>
        <el-form-item label="售后服务计划" prop="afterSalePlan" class="w-full">
          <el-Input
            maxlength="2000"
            type="textarea"
            autosize
            v-model="ruleForm.afterSalePlan"
            disabled
          />
        </el-form-item>
      </el-row>
    </el-form>
  </section>
</template>

<style lang="less">
.cancellation {
  margin-bottom: 0 !important;
}
</style>
<style lang="less" scoped>
.form-title {
  text-align: center;
  font-size: 17px;
  line-height: 40px;
}
.form-number {
  text-align: right;
  font-size: 14px;
  line-height: 30px;
}
</style>
