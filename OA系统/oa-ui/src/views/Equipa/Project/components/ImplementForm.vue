<!-- 项目立项表 -->
<script setup lang="ts">
import { reactive, unref, ref, inject, getCurrentInstance } from 'vue'
import { ElButton, ElMessage, ElForm, ElFormItem } from 'element-plus'
import moment from 'moment'
import {
  projectTypeA,
  projectTypeB,
  projectTypeC,
  purchaseMethod,
  predictSignedOdds,
  projectPhasesCondition,
  turnUserTypeA,
  turnUserTypeB,
  projectSource,
  projectType,
  projectAffiliation
} from '../config/config'

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
const { proxy } = getCurrentInstance() as any
//客户性质
const { customer_nature } = proxy.useDict('customer_nature')
const options = inject<any>('principalOtherTree')
const ruleForm = ref<any>({
  pid: props.detailsData.id, // 项目名称
  updateProjectTitle: props.detailsData.updateProjectTitle,
  projectTitle: props.detailsData.updateProjectTitle
    ? props.detailsData.updateProjectTitle
    : props.detailsData.projectTitle, // 项目名称
  customerId: props.detailsData.customerId, // 客户id
  customerName: props.detailsData.customerName, // 客户名称
  contacts: props.detailsData.contacts, // 用户联系人
  position: props.detailsData.position, //部门及职务
  phone: props.detailsData.phone, //电话
  nature: props.detailsData.nature, //电话
  projectSource: props.detailsData.projectSource, // 项目来源
  projectType: props.detailsData.projectType, // 项目来源
  projectAffiliation: props.detailsData.projectAffiliation, // 项目属性
  projectTypeCompany: props.detailsData.projectTypeCompany, // 项目类型1
  projectTypeIndustry: props.detailsData.projectTypeIndustry, // 项目类型2
  projectTypeSales: props.detailsData.projectTypeSales, // 项目类型3
  lastUserPerson: props.detailsData.lastUserPerson, // 	最终用户联系人
  lastUserDept: props.detailsData.lastUserDept, // 最终用户部门及职务
  lastUserLink: props.detailsData.lastUserLink, // 	最终用户联系方式
  lastUserTypeA: props.detailsData.lastUserTypeA, // 	最终用户类型A
  lastUserTypeB: props.detailsData.lastUserTypeB, // 	最终用户类型B
  purchaseMethod: props.detailsData.purchaseMethod, // 	预计采购方式
  projectPhasesCondition: props.detailsData.projectPhasesCondition, // 	项目目前阶段
  predictSignedOdds: props.detailsData.predictSignedOdds, // 	预计签约几率
  predictContractMoney: props.detailsData.predictContractMoney, // 		预计合同金额
  projectContent: props.detailsData.projectContent, // 			项目内容描述
  milestoneA: props.detailsData.milestoneA, // 			预计时间-1项目关键人实际对接
  milestoneB: props.detailsData.milestoneB, // 			预计时间-1项目关键人实际对接
  milestoneC: props.detailsData.milestoneC, // 			预计时间-1项目关键人实际对接
  turnUserTypeA: props.detailsData.turnUserTypeA, // 转签用户名称
  turnUserTypeB: props.detailsData.turnUserTypeB, // 转签用户名称
  preSalesPerson: Number(props.detailsData.preSalesPerson), // 			售前支持人员
  salesPerson: Number(props.detailsData.salesPerson), // 			销售人员
  principalPersonName: props.detailsData.principalPersonName, // 		立项人
  projectApprovalTime: props.detailsData.projectApprovalTime
    ? moment(props.detailsData.projectApprovalTime).format('YYYY-MM-DD')
    : '', // 		立项时间
  upPrincipalStatus: props.detailsData.upPrincipalStatus, // 	分管负责人审批状态 0同意、1驳回
  relatedDeptPerson: Number(props.detailsData.relatedDeptPerson), // 	相关部门负责人
  gmStatus: props.detailsData.gmStatus, // 总经理审批状态 0同意、1驳回
  lastUserName: props.detailsData.lastUserName, // 最终用户名称
  turnUserDept: props.detailsData.turnUserDept,
  turnUserLink: props.detailsData.turnUserLink,
  turnUserName: props.detailsData.turnUserName,
  turnUserPerson: props.detailsData.turnUserPerson
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
  turnUserTypeB: [{ required: true, message: '该项为必选项', trigger: 'blur' }],
  contacts: [{ required: true, message: '该项为必填项', trigger: 'blur' }],
  position: [{ required: true, message: '该项为必填项', trigger: 'blur' }],
  phone: [{ required: true, message: '该项为必填项', trigger: 'blur' }],
  projectType: [{ required: true, message: '该项为必填项', trigger: 'blur' }],
  customerName: [{ required: true, message: '该项为必填项', trigger: 'blur' }],
  nature: [{ required: true, message: '该项为必填项', trigger: 'change' }]
})
const handleChange = () => {}
</script>
<template>
  <section
    class="border-solid border-1 px-6"
    :class="border ? 'border-1 mt-6  pt-4 pb-6' : 'border-0'"
  >
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
        <el-col :span="24">
          <el-form-item label="项目名称" prop="projectTitle">
            <el-Input disabled v-model="ruleForm.projectTitle" />
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="12">
          <el-form-item label="项目来源" prop="projectSource">
            <el-Radio-group disabled v-model="ruleForm.projectSource">
              <el-Radio :label="item.value" v-for="(item, index) in projectSource" :key="index">{{
                item.label
              }}</el-Radio>
            </el-Radio-group>
          </el-form-item>
        </el-col>
        <el-col :span="12" v-if="!ruleForm.customerId">
          <el-form-item label="项目属性" prop="projectAffiliation">
            <el-Radio-group disabled v-model="ruleForm.projectAffiliation">
              <el-Radio
                :label="item.value"
                v-for="(item, index) in projectAffiliation"
                :key="index"
                >{{ item.label }}</el-Radio
              >
            </el-Radio-group>
          </el-form-item>
        </el-col>
      </el-row>

      <div v-if="ruleForm.customerId">
        <el-row>
          <el-col :span="24">
            <el-form-item label="项目类型" prop="projectTypeCompany">
              <el-Radio-group v-model="ruleForm.projectTypeCompany" disabled>
                <el-Radio :label="item.value" v-for="(item, index) in projectTypeA" :key="index">{{
                  item.label
                }}</el-Radio>
              </el-Radio-group>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="所属行业" prop="projectType">
              <el-Radio-group v-model="ruleForm.projectType" disabled>
                <el-Radio :label="item.value" v-for="(item, index) in projectType" :key="index">{{
                  item.label
                }}</el-Radio>
              </el-Radio-group>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="业务分类" prop="projectTypeSales">
              <el-Radio-group v-model="ruleForm.projectTypeSales" disabled>
                <el-Radio :label="item.value" v-for="(item, index) in projectTypeC" :key="index">{{
                  item.label
                }}</el-Radio>
              </el-Radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="客户名称" prop="customerName">
              <el-Input disabled v-model="ruleForm.customerName" /> </el-form-item
          ></el-col>
          <el-col :span="8">
            <el-form-item label="客户联系人" prop="contacts">
              <el-Input disabled v-model="ruleForm.contacts" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="部门及职务" prop="position">
              <el-Input disabled v-model="ruleForm.position" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="电话" prop="phone">
              <el-Input disabled v-model="ruleForm.phone" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="客户性质" prop="nature">
              <el-Radio-group v-model="ruleForm.nature" disabled>
                <el-Radio
                  :label="item.label"
                  v-for="(item, index) in customer_nature"
                  :key="index"
                  >{{ item.label }}</el-Radio
                >
              </el-Radio-group>
            </el-form-item>
          </el-col>
        </el-row>
      </div>
      <div v-if="!ruleForm.customerId">
        <el-row v-if="!ruleForm.customerId">
          <el-form-item disabled label="项目类型" required class="w-full project-type">
            <el-form-item prop="projectTypeCompany" label-width="0" class="w-full">
              <el-Radio-group disabled v-model="ruleForm.projectTypeCompany">
                <el-Radio :label="item.value" v-for="(item, index) in projectTypeA" :key="index">{{
                  item.label
                }}</el-Radio>
              </el-Radio-group>
            </el-form-item>
            <el-form-item prop="projectTypeIndustry" label-width="0" class="w-full">
              <el-Radio-group disabled v-model="ruleForm.projectTypeIndustry">
                <el-Radio :label="item.value" v-for="(item, index) in projectTypeB" :key="index">{{
                  item.label
                }}</el-Radio>
              </el-Radio-group>
            </el-form-item>
            <el-form-item prop="projectTypeSales" label-width="0" class="w-full">
              <el-Radio-group disabled v-model="ruleForm.projectTypeSales">
                <el-Radio :label="item.value" v-for="(item, index) in projectTypeC" :key="index">{{
                  item.label
                }}</el-Radio>
              </el-Radio-group>
            </el-form-item>
          </el-form-item>
        </el-row>
        <el-row v-if="!ruleForm.customerId">
          <el-col :span="24">
            <el-form-item label="最终用户名称" prop="lastUserName">
              <el-Input disabled v-model="ruleForm.lastUserName" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row v-if="!ruleForm.customerId">
          <el-col :span="8">
            <el-form-item label="最终用户联系人" prop="lastUserPerson">
              <el-Input disabled v-model="ruleForm.lastUserPerson" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="部门及职务" prop="lastUserDept">
              <el-Input disabled v-model="ruleForm.lastUserDept" />
            </el-form-item>
          </el-col>

          <el-col :span="8">
            <el-form-item label="电话" prop="lastUserLink">
              <el-Input disabled v-model="ruleForm.lastUserLink" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row v-if="!ruleForm.customerId">
          <el-form-item label="最终用户类型" required class="w-full turn-type">
            <el-form-item
              label="政府事业单位："
              prop="lastUserTypeA"
              class="w-full turn-type-sub ts-form"
            >
              <el-Radio-group v-model="ruleForm.lastUserTypeA" disabled>
                <el-Radio :label="item.value" v-for="(item, index) in turnUserTypeA" :key="index">{{
                  item.label
                }}</el-Radio>
              </el-Radio-group>
            </el-form-item>
            <el-form-item
              label="企业及机构："
              prop="lastUserTypeB"
              class="w-full turn-type-sub ts-form"
            >
              <el-Radio-group v-model="ruleForm.lastUserTypeB" disabled>
                <el-Radio :label="item.value" v-for="(item, index) in turnUserTypeB" :key="index">{{
                  item.label
                }}</el-Radio>
              </el-Radio-group>
            </el-form-item>
          </el-form-item>
        </el-row>
        <el-row v-if="ruleForm.projectAffiliation === '2' && !ruleForm.customerId">
          <el-col :span="12">
            <el-form-item label="转签用户名称" prop="turnUserName">
              <el-Input v-model="ruleForm.turnUserName" disabled />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="转签用户联系人" prop="turnUserPerson">
              <el-Input v-model="ruleForm.turnUserPerson" disabled />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="转签用户部门及职务" prop="turnUserDept">
              <el-Input v-model="ruleForm.turnUserDept" disabled />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="	转签用户联系方式" prop="turnUserLink">
              <el-Input maxlength="15" v-model="ruleForm.turnUserLink" disabled />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row v-if="ruleForm.projectAffiliation === '2' && !ruleForm.customerId">
          <el-form-item
            label="转签用户类型"
            :required="ruleForm.projectAffiliation === '2'"
            class="w-full turn-type"
          >
            <el-form-item prop="turnUserTypeA" label-width="0" class="w-full ts-form">
              <el-Radio-group v-model="ruleForm.turnUserTypeA" disabled>
                <el-Radio :label="item.value" v-for="(item, index) in turnUserTypeA" :key="index">{{
                  item.label
                }}</el-Radio>
              </el-Radio-group>
            </el-form-item>
            <el-form-item prop="turnUserTypeB" label-width="0" class="w-full ts-form">
              <el-Radio-group v-model="ruleForm.turnUserTypeB" disabled>
                <el-Radio :label="item.value" v-for="(item, index) in turnUserTypeB" :key="index">{{
                  item.label
                }}</el-Radio>
              </el-Radio-group>
            </el-form-item>
          </el-form-item>
        </el-row>
      </div>
      <el-row>
        <el-col :span="24">
          <el-form-item label="预计采购方式" prop="purchaseMethod">
            <el-Radio-group disabled v-model="ruleForm.purchaseMethod">
              <el-Radio :label="item.value" v-for="(item, index) in purchaseMethod" :key="index">{{
                item.label
              }}</el-Radio>
            </el-Radio-group>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="24">
          <el-form-item label="项目目前阶段" prop="projectPhasesCondition">
            <el-Radio-group disabled v-model="ruleForm.projectPhasesCondition">
              <el-Radio
                :label="item.value"
                v-for="(item, index) in projectPhasesCondition"
                :key="index"
                >{{ item.label }}</el-Radio
              >
            </el-Radio-group>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="12">
          <el-form-item label="预计签约几率" prop="predictSignedOdds">
            <el-Radio-group disabled v-model="ruleForm.predictSignedOdds">
              <el-Radio :label="item.value" v-for="(item, index) in predictSignedOdds" :key="index"
                >({{ item.label }})</el-Radio
              >
            </el-Radio-group>
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item label="预计合同金额(万元)" prop="predictContractMoney">
            <el-Input disabled v-model="ruleForm.predictContractMoney" />
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="24">
          <el-form-item label="项目内容描述" prop="projectContent">
            <el-Input disabled type="textarea" autosize v-model="ruleForm.projectContent" />
          </el-form-item>
        </el-col>
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
                format="YYYY-MM"
                type="date"
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
                format="YYYY-MM"
                type="date"
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
          <el-form-item label="销售人员" prop="salesPerson">
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
          <el-form-item label="售前支持人员" prop="preSalesPerson">
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
          <el-form-item label="立项人" prop="name" class="w-full">
            <el-Input disabled placeholder="请输入" v-model="ruleForm.principalPersonName" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="立项时间" prop="name" class="w-full">
            <el-Input disabled placeholder="请输入" v-model="ruleForm.projectApprovalTime" />
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
  </section>
</template>

<style lang="less">
.cancellation {
  margin-bottom: 0 !important;
}
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
