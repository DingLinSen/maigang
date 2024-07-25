<!-- 培育详情-申请结束转立项 -->
<script setup lang="ts">
import { reactive, unref, ref, inject } from 'vue'
import {
  ElButton,
  ElMessage,
  ElUpload,
  ElLink,
  UploadRawFile,
  ElLoading,
  UploadFile,
  UploadStatus,
  ElForm,
  ElFormItem,
  ElDatePicker,
  Input
} from 'element-plus'
import moment from 'moment'
import { object } from 'vue-types'
// 获取父级数据
// const detailsData = inject<any>('detailsData')
const options = inject<any>('principalOtherTree')
const isSeeSub = ref(false)

const detailProps = defineProps({
  detailsData: {
    type: Object,
    default: () => {}
  }
})

// let { detailsData } = detailProps
// eslint-disable-next-line vue/no-setup-props-destructure
let detailsData = unref(detailProps.detailsData)
console.log(detailProps.detailsData, detailsData.id)

// const options = ref([])
const ruleForm = ref<any>({
  pid: detailsData.id, // 项目名称
  projectTitle: detailsData.projectTitle, // 项目名称
  projectSource: detailsData.projectSource, // 项目来源
  projectAffiliation: detailsData.projectAffiliation, // 项目属性
  projectTypeCompany: detailsData.projectTypeCompany, // 项目类型1
  projectTypeIndustry: detailsData.projectTypeIndustry, // 项目类型2
  projectTypeSales: detailsData.projectTypeSales, // 项目类型3
  lastUserPerson: detailsData.lastUserPerson, // 	最终用户联系人
  lastUserDept: detailsData.lastUserDept, // 最终用户部门及职务
  lastUserLink: detailsData.lastUserLink, // 	最终用户联系方式
  lastUserTypeA: detailsData.lastUserTypeA, // 	最终用户类型A
  lastUserTypeB: detailsData.lastUserTypeB, // 	最终用户类型B
  purchaseMethod: detailsData.purchaseMethod, // 	预计采购方式
  projectPhasesCondition: detailsData.projectPhasesCondition, // 	项目目前阶段
  predictSignedOdds: detailsData.predictSignedOdds, // 	预计签约几率
  predictContractMoney: detailsData.predictContractMoney, // 		预计合同金额
  projectContent: detailsData.projectContent, // 			项目内容描述
  milestoneA: detailsData.milestoneA, // 			预计时间-1项目关键人实际对接
  milestoneB: detailsData.milestoneB, // 			预计时间-1项目关键人实际对接
  milestoneC: detailsData.milestoneC, // 			预计时间-1项目关键人实际对接
  preSalesPerson: Number(detailsData.preSalesPerson), // 			售前支持人员
  salesPerson: Number(detailsData.salesPerson), // 			销售人员
  principalPersonName: detailsData.principalPersonName, // 		立项人
  projectApprovalTime: detailsData.projectApprovalTime
    ? moment(detailsData.projectApprovalTime).format('YYYY-MM-DD')
    : '', // 		立项时间
  upPrincipalStatus: detailsData.upPrincipalStatus, // 	分管负责人审批状态 0同意、1驳回
  relatedDeptPerson: Number(detailsData.relatedDeptPerson), // 	相关部门负责人
  gmStatus: detailsData.gmStatus, // 总经理审批状态 0同意、1驳回
  lastUserName: detailsData.lastUserName, // 最终用户名称
  turnUserDept: detailsData.turnUserDept,
  turnUserLink: detailsData.turnUserLink,
  turnUserName: detailsData.turnUserName,
  turnUserPerson: detailsData.turnUserPerson,
  turnUserTypeA: detailsData.turnUserTypeA,
  turnUserTypeB: detailsData.turnUserTypeB
})
const formRef = ref<any>()
const rules = reactive({
  lastUserName: [{ required: true, message: '请输入最终用户名称', trigger: 'blur' }],
  lastUserDept: [{ required: true, message: '请输入最终用户部门及职务', trigger: 'blur' }],
  lastUserLink: [{ required: true, message: '请输入最终用户联系方式', trigger: 'blur' }],
  lastUserPerson: [{ required: true, message: '请输入最终用户联系人', trigger: 'blur' }],
  predictContractMoney: [{ required: true, message: '请输入预计合同金额', trigger: 'blur' }],
  projectContent: [{ required: true, message: '请输入项目内容描述', trigger: 'blur' }],
  projectTitle: [{ required: true, message: '请输入项目名称', trigger: 'blur' }],
  projectSource: [{ required: true, message: '该项为必填项', trigger: 'change' }],
  lastUserTypeA: [{ required: true, message: '该项为必填项', trigger: 'change' }],
  lastUserTypeB: [{ required: true, message: '该项为必填项', trigger: 'change' }],
  purchaseMethod: [{ required: true, message: '该项为必填项', trigger: 'change' }],
  projectAffiliation: [{ required: true, message: '该项为必填项', trigger: 'change' }],
  projectTypeCompany: [{ required: true, message: '该项为必填项', trigger: 'change' }],
  projectTypeIndustry: [{ required: true, message: '该项为必填项', trigger: 'change' }],
  projectTypeSales: [{ required: true, message: '该项为必填项', trigger: 'change' }],
  projectPhasesCondition: [{ required: true, message: '该项为必填项', trigger: 'change' }],
  predictSignedOdds: [{ required: true, message: '该项为必填项', trigger: 'change' }],
  milestoneA: [{ required: true, message: '该项为必填项', trigger: 'change' }],
  milestoneB: [{ required: true, message: '该项为必填项', trigger: 'change' }],
  milestoneC: [{ required: true, message: '该项为必填项', trigger: 'change' }],
  preSalesPerson: [{ required: true, message: '该项为必填项', trigger: 'change' }],
  salesPerson: [{ required: true, message: '该项为必填项', trigger: 'change' }],
  resource: [{ required: false, message: '请输入备注', trigger: 'blur' }],
  turnUserName: [{ required: true, message: '该项为必填项', trigger: 'blur' }],
  turnUserPerson: [{ required: true, message: '该项为必填项', trigger: 'blur' }],
  turnUserDept: [{ required: true, message: '该项为必填项', trigger: 'blur' }],
  turnUserLink: [{ required: true, message: '该项为必填项', trigger: 'blur' }],
  turnUserTypeA: [{ required: true, message: '该项为必选项', trigger: 'blur' }],
  turnUserTypeB: [{ required: true, message: '该项为必选项', trigger: 'blur' }]
})
const handleChange = () => {}
</script>
<template>
  <section class="mt-6 border-solid border-1 px-6 pt-4 pb-6">
    <h3 class="form-title">项目立项表</h3>
    <p class="form-number pb-2">项目立项编号：{{ detailsData.itemNumber || '--' }}&nbsp;&nbsp;</p>
    <el-form
      :model="ruleForm"
      :rules="rules"
      ref="formRef"
      label-width="150px"
      class="demo-ruleForm"
    >
      <el-row>
        <el-form-item label="项目名称" prop="projectTitle" class="w-full">
          <el-Input disabled v-model="ruleForm.projectTitle" />
        </el-form-item>
      </el-row>

      <el-row>
        <el-col :span="12">
          <el-form-item label="项目来源" prop="projectSource" class="w-full">
            <el-Radio-group disabled v-model="ruleForm.projectSource">
              <el-Radio label="1">自主挖掘</el-Radio>
              <el-Radio label="2">合作介绍</el-Radio>
              <el-Radio label="3">公司安排</el-Radio>
            </el-Radio-group>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="项目属性" prop="projectAffiliation" class="w-full">
            <el-Radio-group disabled v-model="ruleForm.projectAffiliation">
              <el-Radio label="1">直签</el-Radio>
              <el-Radio label="2">转签</el-Radio>
            </el-Radio-group>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-form-item disabled label="项目类型" required class="w-full project-type">
          <!-- 项目类型A -->
          <el-form-item prop="projectTypeCompany" label-width="0" class="w-full ts-form">
            <el-Radio-group disabled v-model="ruleForm.projectTypeCompany">
              <el-Radio label="1">常规项目</el-Radio>
              <el-Radio label="2">灯塔项目</el-Radio>
              <el-Radio label="3">流水项目</el-Radio>
              <el-Radio label="4">补助项目</el-Radio>
            </el-Radio-group>
          </el-form-item>

          <!-- 项目类型B -->
          <el-form-item prop="projectTypeIndustry" label-width="0" class="w-full ts-form">
            <el-Radio-group disabled v-model="ruleForm.projectTypeIndustry">
              <el-Radio label="1">农业农村</el-Radio>
              <el-Radio label="2">铁路交通</el-Radio>
              <el-Radio label="3">军工</el-Radio>
              <el-Radio label="4">其他</el-Radio>
            </el-Radio-group>
          </el-form-item>

          <!-- 项目类型C -->
          <el-form-item prop="projectTypeSales" label-width="0" class="w-full ts-form">
            <el-Radio-group disabled v-model="ruleForm.projectTypeSales">
              <el-Radio label="1">自有产品销售</el-Radio>
              <el-Radio label="2">合作产品销售</el-Radio>
              <el-Radio label="3">软件开发</el-Radio>
              <el-Radio label="4">运行维护</el-Radio>
              <el-Radio label="5">咨询设计</el-Radio>
              <el-Radio label="6">技术服务</el-Radio>
              <el-Radio label="7">系统集成</el-Radio>
            </el-Radio-group>
          </el-form-item>
        </el-form-item>
      </el-row>

      <el-row>
        <el-form-item label="最终用户名称" prop="lastUserName" class="w-full">
          <el-Input disabled v-model="ruleForm.lastUserName" />
        </el-form-item>
      </el-row>

      <el-row>
        <el-col :span="8">
          <el-form-item label="最终用户联系人" prop="lastUserPerson" class="w-full">
            <el-Input disabled v-model="ruleForm.lastUserPerson" />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="部门及职务" prop="lastUserDept" class="w-full">
            <el-Input disabled v-model="ruleForm.lastUserDept" />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="电话" prop="lastUserLink" class="w-full">
            <el-Input disabled v-model="ruleForm.lastUserLink" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-form-item label="最终用户类型" required class="w-full turn-type">
          <!-- 最终用户类型A -->
          <el-form-item
            label="政府事业单位："
            prop="lastUserTypeA"
            class="w-full turn-type-sub ts-form"
          >
            <el-Radio-group v-model="ruleForm.lastUserTypeA" disabled>
              <el-Radio label="1">国家级</el-Radio>
              <el-Radio label="2">省厅级</el-Radio>
              <el-Radio label="3">市局级</el-Radio>
              <el-Radio label="4">区县级</el-Radio>
              <el-Radio label="5">村镇级</el-Radio>
            </el-Radio-group>
          </el-form-item>
          <!-- 	最终用户类型B -->
          <el-form-item
            label="企业及机构："
            prop="lastUserTypeB"
            class="w-full turn-type-sub ts-form"
          >
            <el-Radio-group v-model="ruleForm.lastUserTypeB" disabled>
              <el-Radio label="1">国资</el-Radio>
              <el-Radio label="2">上市</el-Radio>
              <el-Radio label="3">民营</el-Radio>
              <el-Radio label="4">外资</el-Radio>
              <el-Radio label="5">高校或科研单位</el-Radio>
              <el-Radio label="6">军工单位</el-Radio>
            </el-Radio-group>
          </el-form-item>
        </el-form-item>
      </el-row>

      <el-row v-if="ruleForm.projectAffiliation === '2'">
        <el-col :span="12">
          <el-form-item label="转签用户名称" prop="turnUserName" class="w-full">
            <el-Input placeholder="请输入" v-model="ruleForm.turnUserName" disabled />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="转签用户联系人" prop="turnUserPerson" class="w-full">
            <el-Input placeholder="请输入" v-model="ruleForm.turnUserPerson" disabled />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="转签用户部门及职务" prop="turnUserDept" class="w-full">
            <el-Input placeholder="请输入" v-model="ruleForm.turnUserDept" disabled />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="	转签用户联系方式" prop="turnUserLink" class="w-full">
            <el-Input
              maxlength="15"
              placeholder="请输入"
              v-model="ruleForm.turnUserLink"
              disabled
            />
          </el-form-item>
        </el-col>
      </el-row>
      <!-- 转签用户类型 -->
      <el-row v-if="ruleForm.projectAffiliation === '2'">
        <el-form-item
          label="转签用户类型"
          :required="ruleForm.projectAffiliation === '2'"
          class="w-full turn-type"
        >
          <!-- 转签用户类型A -->
          <el-form-item prop="turnUserTypeA" label-width="0" class="w-full ts-form">
            <el-Radio-group v-model="ruleForm.turnUserTypeA" disabled>
              <el-Radio label="1">国家级</el-Radio>
              <el-Radio label="2">省厅级</el-Radio>
              <el-Radio label="3">市局级</el-Radio>
              <el-Radio label="4">区县级</el-Radio>
              <el-Radio label="5">村镇级</el-Radio>
            </el-Radio-group>
          </el-form-item>

          <!-- 转签用户类型B -->
          <el-form-item prop="turnUserTypeB" label-width="0" class="w-full ts-form">
            <el-Radio-group v-model="ruleForm.turnUserTypeB" disabled>
              <el-Radio label="1">国资</el-Radio>
              <el-Radio label="2">上市</el-Radio>
              <el-Radio label="3">民营</el-Radio>
              <el-Radio label="4">外资</el-Radio>
              <el-Radio label="5">高校或科研单位</el-Radio>
              <el-Radio label="6">军工单位</el-Radio>
            </el-Radio-group>
          </el-form-item>
        </el-form-item>
      </el-row>

      <el-row>
        <el-form-item label="预计采购方式" prop="purchaseMethod" class="w-full">
          <el-Radio-group disabled v-model="ruleForm.purchaseMethod">
            <el-Radio label="1">公开招标</el-Radio>
            <el-Radio label="2">竞争性谈判</el-Radio>
            <el-Radio label="3">竞争性磋商</el-Radio>
            <el-Radio label="4">单一来源</el-Radio>
            <el-Radio label="5">协商签订</el-Radio>
          </el-Radio-group>
        </el-form-item>
      </el-row>

      <el-row>
        <el-form-item label="项目目前阶段" prop="projectPhasesCondition" class="w-full">
          <el-Radio-group disabled v-model="ruleForm.projectPhasesCondition">
            <el-Radio label="1">预算资金已到位</el-Radio>
            <el-Radio label="2">已有预算,资金未到位</el-Radio>
            <el-Radio label="3">已确定,预算未定</el-Radio>
            <el-Radio label="4">前期需求调研</el-Radio>
          </el-Radio-group>
        </el-form-item>
      </el-row>

      <el-row>
        <el-col :span="12">
          <el-form-item label="预计签约几率" prop="predictSignedOdds" class="w-full">
            <el-Radio-group disabled v-model="ruleForm.predictSignedOdds">
              <el-Radio label="1">(&gt; 90%)</el-Radio>
              <el-Radio label="2">(70-90%)</el-Radio>
              <el-Radio label="3">(50-70%)</el-Radio>
              <el-Radio label="4">(&lt; 50% )</el-Radio>
            </el-Radio-group>
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item label="预计合同金额(万元)" prop="predictContractMoney" class="w-full">
            <el-Input disabled v-model="ruleForm.predictContractMoney" />
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-form-item label="项目内容描述" prop="projectContent" class="w-full">
          <el-Input disabled type="textarea" autosize v-model="ruleForm.projectContent" />
        </el-form-item>
      </el-row>

      <el-row>
        <el-col :span="3" style="display: flex; align-items: center"
          ><el-form-item disabled label="项目预计时间" required class="w-full"
        /></el-col>
        <el-col :span="20" class="xl:ml-[20px] 2xl:ml-[-20px]">
          <el-col :span="24" class="flex pb-4 border-solid border-b-1">
            <el-form-item
              label="里程碑1：项目关键人实际对接"
              prop="milestoneA"
              class="w-full"
              label-width="220"
            >
              <el-date-picker
                disabled
                type="date"
                format="YYYY-MM"
                placeholder="选择日期"
                v-model="ruleForm.milestoneA"
              />
            </el-form-item>
          </el-col>
          <el-col :span="24" class="flex py-4 border-solid border-b-1">
            <el-form-item
              label="里程碑2：用户已认可项目方案"
              prop="milestoneB"
              class="w-full"
              label-width="220"
            >
              <el-date-picker
                disabled
                type="date"
                format="YYYY-MM"
                placeholder="选择日期"
                v-model="ruleForm.milestoneB"
              />
            </el-form-item>
          </el-col>
          <el-col :span="24" class="flex py-4">
            <el-form-item
              label="里程碑3：招标或签约时间确定"
              prop="milestoneC"
              class="w-full"
              label-width="220"
            >
              <el-date-picker
                disabled
                format="YYYY-MM"
                type="date"
                placeholder="选择日期"
                v-model="ruleForm.milestoneC"
              />
            </el-form-item> </el-col
        ></el-col>
      </el-row>

      <el-row>
        <el-col :span="12">
          <el-form-item label="销售人员" prop="salesPerson" class="w-full">
            <el-cascader
              v-model="ruleForm.salesPerson"
              style="width: 100%"
              :filterable="true"
              disabled
              :props="{ label: 'deptName', value: 'deptId' }"
              :controlsPosition="'right'"
              :options="options"
              @change="handleChange"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="售前支持人员" prop="preSalesPerson" class="w-full">
            <el-cascader
              v-model="ruleForm.preSalesPerson"
              style="width: 100%"
              :filterable="true"
              disabled
              :props="{ label: 'deptName', value: 'deptId' }"
              :controlsPosition="'right'"
              :options="options"
              @change="handleChange"
            />
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="12">
          <el-form-item label="立项人" prop="principalPersonName" class="w-full">
            <el-Input disabled v-model="ruleForm.principalPersonName" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="立项时间" prop="name" class="w-full">
            <el-Input disabled v-model="ruleForm.projectApprovalTime" />
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="12">
          <el-form-item label="分管负责人" prop="upPrincipalStatus" class="w-full">
            <el-Radio-group disabled v-model="ruleForm.upPrincipalStatus">
              <el-Radio label="0">同意立项</el-Radio>
              <el-Radio label="1">不同意立项</el-Radio>
            </el-Radio-group>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="相关部门（如需）" prop="relatedDeptPerson" class="w-full">
            <el-cascader
              v-model="ruleForm.relatedDeptPerson"
              style="width: 100%"
              :filterable="true"
              disabled
              :props="{ label: 'deptName', value: 'deptId' }"
              :controlsPosition="'right'"
              :options="options"
              @change="handleChange"
            />
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="24" class="pb-2">
          <el-form-item label="总经理" prop="gmStatus" class="w-full border-b-1 pb-4">
            <el-Radio-group disabled v-model="ruleForm.gmStatus">
              <el-Radio label="0">同意立项</el-Radio>
              <el-Radio label="1">不同意立项</el-Radio>
            </el-Radio-group>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <el-row class="text-xs">说明：本文件为保密件。原件留存财务部，复印件留存立项部门。</el-row>
    <!-- <div class="flex justify-center">
      <ElButton type="primary" :loading="sureLoading" @click="submitEvolve"> 确定 </ElButton>
      <ElButton @click="closeDialog">取消</ElButton></div
    > -->
  </section>
</template>

<style lang="less">
// @import './index.less'
.cancellation {
  margin-bottom: 0 !important;
}
// .Debriefing {
//   // margin-top: var(--el-dialog-margin-top,6vh);
//   --el-dialog-margin-top: 8vh !important;
// }
.project-type .el-form-item__label {
  margin-top: 3vh;
}
.turn-type .el-form-item__label {
  margin-top: 1.5vh;
}
.turn-type-sub .el-form-item__label {
  margin-top: 0px;
}
</style>
<style lang="less" scoped>
.form-number {
  text-align: right;
  font-size: 14px;
  line-height: 30px;
}
.form-title {
  text-align: center;
  font-size: 17px;
  line-height: 40px;
}
</style>
