<!--实施确认表 -->
<script setup lang="ts">
import { reactive, unref, ref, inject, onBeforeUpdate, onBeforeMount, nextTick, watch } from 'vue'
import { ElMessage, ElForm, ElFormItem, ElDatePicker } from 'element-plus'
import { getAllDeptListApi } from '@/api/sys/dept' // 获取所有部门
import { listToTree } from '@/utils/tree'
import { useValidator } from '@/hooks/web/useValidator'
import {
  projectTypeA,
  projectTypeB,
  projectTypeC,
  projectAffiliation,
  projectType
} from '../config/config'
import moment from 'moment'

const { required } = useValidator()
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
  pid: '', // 项目id
  projectTitle: '', // 项目名称
  itemNumber: '', // 项目编号
  projectAffiliation: '', // 项目属性
  projectTypeCompany: '', // 项目类型1
  projectTypeIndustry: '', // 项目类型2
  projectTypeSales: '', // 项目类型3
  lastUserUnit: '', // 	最终用户名称
  contractSignUnit: '', // 合同签订单位
  contractSignDate: '', // 	合同签订日期
  contractNumber: '', // 	项目合同编号
  predictAcceptDate: '', // 	预计验收日期
  predictPaymentDate: '', // 	预计回款日期
  contractMoney: '', // 	合同金额
  projectManager: '', // 	项目经理
  salesManager: '', // 		销售经理
  projectContent: '', // 		项目内容及实施计划
  pmSignatureDate: '', // 	项目经理_签名_日期
  pmSignature: '', // 			项目经理_签名
  smSignature: '', // 			销售经理_签名
  projectTeam: [],
  implementDept: '', // 实施部门
  smSignatureDate: '', // 	销售经理_签名_日期
  smUpprincipalSignature: '', // 		销售经理_分管负责人_签名
  smUpprincipalSignatureDate: '', // 		销售经理_分管负责人_签名日期
  pmUpprincipalSignature: '', // 	项目经理_分管负责人_签名
  pmUpprincipalSignatureDate: '', // 	项目经理_分管负责人_签名日期
  gmSignature: '', // 总经理_签名
  gmSignatureDate: '', // 总经理_签名日期
  projectType: '',
  customerId: '',
  directCustomerName: '',
  directContacts: '',
  directPhone: '',
  finalCustomerName: '',
  finalContacts: '',
  finalPhone: '',
  realProjectType: ''
})

// 拆分显示项目组成员职责
const getFilterTeam = (str: any) => {
  console.log(str)
  let teamList: any = []
  str.split(',').forEach((item: any) => {
    if (item.indexOf('：') > -1) {
      teamList.push({ name: item.split('：')[0], duty: item.split('：')[1] })
    }
  })
  return teamList
}
// 监听父级传递数据
watch(
  () => props.detailsData,
  (data: any) => {
    if (data) {
      nextTick(() => {
        console.log('props.detailsData==>', props.detailsData)
        ruleForm.value = props.detailsData
        ruleForm.value.itemNumber = props.detailsData.itemNumber
        ruleForm.value.implementDept = ruleForm.value.implementDept
          ? Number(ruleForm.value.implementDept)
          : ''
        ruleForm.value.realProjectTitle = props.detailsData.updateProjectTitle
          ? props.detailsData.updateProjectTitle
          : props.detailsData.projectTitle
        ruleForm.value.realProjectType = ruleForm.value.directCustomerId
          ? props.detailsData.projectTypeIndustry
            ? String(Number(props.detailsData.projectTypeIndustry) - 1)
            : ruleForm.value.projectType
          : ruleForm.value.projectType
      })
    }
  },
  {
    immediate: true
  }
)

const options = inject<any>('principalOtherTree')
const deptDataList = ref<any>([])
const isSeeSub = ref(false)
//获取所有部门
const getAllDeptlist = async () => {
  const res = await getAllDeptListApi({})
  if (res) {
    deptDataList.value = listToTree(res.data, {
      id: 'deptId',
      children: 'children',
      pid: 'parentId'
    })
  }
  console.log(deptDataList.value)
}

const formRef = ref<any>()
const sureLoading = ref<boolean>(false)
const endDialogVisible = ref(false)

const rules = reactive({})
const handleChange = (val: any) => {}

const boxRefs = ref<any>([])
// 创建多个ref实例
const setItemRef = (el: any) => {
  if (el) {
    boxRefs.value.push(el)
  }
}

// 项目组其他人员的选择
const handleChangeProjectTeam = (index: any) => {
  let nodesInfo = boxRefs.value[index].getCheckedNodes()
  ruleForm.value.projectTeam[index].name = nodesInfo[0].data.deptName
  if (ruleForm.value.projectTeam[index].duty === '') {
    ruleForm.value.projectTeam[index].duty = nodesInfo[0].data.postStr
  }
}

onBeforeMount(() => {
  getAllDeptlist()
})
onBeforeUpdate(() => {
  boxRefs.value = []
})
defineExpose({})
</script>

<template>
  <section
    class="border-solid border-1 px-6"
    :class="border ? 'border-1 mt-6  pt-4 pb-6' : 'border-0'"
  >
    <h3 class="form-title">项目实施确认表</h3>
    <p class="form-number pb-2">项目编号：{{ detailsData.itemNumber || '--' }}&nbsp;&nbsp;</p>
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
            <el-Input disabled v-model="ruleForm.realProjectTitle" />
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="12">
          <el-form-item label="项目编号" prop="itemNumber">
            <el-Input disabled v-model="ruleForm.itemNumber" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
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

      <div v-if="!ruleForm.directCustomerId">
        <el-row>
          <el-form-item label="项目类型" class="w-full project-type">
            <el-form-item prop="projectTypeCompany" label-width="0">
              <el-Radio-group disabled v-model="ruleForm.projectTypeCompany" class="w-full">
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

        <el-row>
          <el-form-item label="最终用户名称" prop="lastUserUnit" class="w-full">
            <el-Input
              disabled
              :maxlength="100"
              placeholder="请输入"
              v-model="ruleForm.lastUserUnit"
            />
          </el-form-item>
        </el-row>

        <el-row>
          <el-form-item
            v-if="ruleForm.projectAffiliation === '2'"
            label="合同签订单位"
            prop="contractSignUnit"
            class="w-full"
          >
            <el-Input :maxlength="100" disabled v-model="ruleForm.contractSignUnit" />
          </el-form-item>
          <el-form-item v-else label="合同签订单位" class="w-full">
            <el-Input
              :maxlength="100"
              disabled
              placeholder="请输入"
              v-model="ruleForm.contractSignUnit"
            />
          </el-form-item>
        </el-row>
      </div>
      <el-row v-if="ruleForm.directCustomerId">
        <el-col :span="24">
          <el-form-item label="项目类型" prop="projectTypeCompany">
            <el-Radio-group v-model="ruleForm.projectTypeCompany" disabled>
              <el-Radio :label="item.value" v-for="(item, index) in projectTypeA" :key="index">{{
                item.label
              }}</el-Radio>
            </el-Radio-group>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="所属行业" prop="realProjectType">
            <el-Radio-group v-model="ruleForm.realProjectType" disabled>
              <el-Radio :label="item.value" v-for="(item, index) in projectType" :key="index">{{
                item.label
              }}</el-Radio>
            </el-Radio-group>
          </el-form-item>
        </el-col>

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
          <el-form-item label="直接客户" prop="directCustomerName">
            <el-Input disabled v-model="ruleForm.directCustomerName" /> </el-form-item
        ></el-col>
        <el-col :span="12">
          <el-form-item label="客户联系人" prop="directContacts">
            <el-Input disabled v-model="ruleForm.directContacts" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="客户联系电话" prop="directPhone">
            <el-Input disabled v-model="ruleForm.directPhone" />
          </el-form-item>
        </el-col>
        <el-col :span="24" v-if="ruleForm.projectAffiliation === '2'">
          <el-form-item label="最终用户" prop="finalCustomerName">
            <el-Input disabled v-model="ruleForm.finalCustomerName" /> </el-form-item
        ></el-col>
        <el-col :span="12" v-if="ruleForm.projectAffiliation === '2'">
          <el-form-item label="最终用户联系人" prop="finalContacts">
            <el-Input disabled v-model="ruleForm.finalContacts" />
          </el-form-item>
        </el-col>
        <el-col :span="12" v-if="ruleForm.projectAffiliation === '2'">
          <el-form-item label="最终用户联系电话" prop="finalPhone">
            <el-Input disabled v-model="ruleForm.finalPhone" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="合同签订日期" prop="contractSignDate">
            <el-date-picker
              type="date"
              disabled
              placeholder="选择日期"
              v-model="ruleForm.contractSignDate"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="项目合同编号" prop="contractNumber">
            <el-Input
              disabled
              :maxlength="200"
              placeholder="请输入"
              v-model="ruleForm.contractNumber"
            />
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="12">
          <el-form-item label="预计验收日期" prop="predictAcceptDate" class="w-full">
            <el-date-picker
              type="date"
              disabled
              placeholder="选择日期"
              v-model="ruleForm.predictAcceptDate"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="预计回款日期" prop="predictPaymentDate" class="w-full">
            <el-date-picker
              type="date"
              disabled
              placeholder="选择日期"
              v-model="ruleForm.predictPaymentDate"
            />
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="24">
          <el-form-item label="合同金额（万元）" prop="contractMoney">
            <el-Input disabled placeholder="请输入" v-model.trim="ruleForm.contractMoney" />
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="12">
          <el-form-item label="项目经理" prop="projectManager" class="w-full">
            <el-cascader
              v-model="ruleForm.projectManager"
              style="width: 100%"
              :filterable="true"
              :disabled="true"
              :props="{ label: 'deptName', value: 'deptId' }"
              :controlsPosition="'right'"
              :options="options"
              @change="handleChange"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="销售经理" prop="salesManager" class="w-full">
            <el-cascader
              v-model="ruleForm.salesManager"
              style="width: 100%"
              :filterable="true"
              :disabled="true"
              :props="{ label: 'deptName', value: 'deptId' }"
              :controlsPosition="'right'"
              :options="options"
              @change="handleChange"
            />
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="24">
          <el-form-item label="项目组其他成员及职责" class="w-full">
            <el-col
              :span="24"
              v-for="(item, index) in ruleForm.projectTeam"
              :key="index"
              style="display: flex"
            >
              <el-form-item
                style="width: 35%; margin-right: 0px !important"
                :prop="`projectTeam[${index}].name`"
                :rules="[{ required: false, message: '请选择成员', trigger: 'change' }]"
              >
                <ElCascader
                  :ref="setItemRef"
                  style="width: 90%"
                  v-model="ruleForm.projectTeam[index].name"
                  :filterable="true"
                  :validateEvent="true"
                  :disabled="true"
                  :props="{ label: 'deptName', value: 'deptName' }"
                  :controlsPosition="'right'"
                  :options="options"
                  @change="handleChangeProjectTeam(index)"
                />
              </el-form-item>
              <el-form-item
                style="width: 60%; margin-right: 0px !important"
                :prop="`projectTeam[${index}].duty`"
                :rules="[{ required: false, message: '该项为必填项', trigger: 'blur' }]"
              >
                <el-Input
                  maxlength="200"
                  disabled
                  type="textarea"
                  autosize
                  v-model="ruleForm.projectTeam[index].duty"
                />
              </el-form-item>
            </el-col>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="24">
          <el-form-item label="项目内容及实施计划" prop="projectContent">
            <el-Input
              maxlength="2000"
              disabled
              type="textarea"
              autosize
              v-model="ruleForm.projectContent"
            />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="实施部门" prop="implementDept" class="w-full">
            <el-cascader
              v-model="ruleForm.implementDept"
              style="width: 100%"
              :filterable="true"
              :disabled="true"
              :props="{ label: 'deptName', value: 'deptId' }"
              :controlsPosition="'right'"
              :options="deptDataList"
              @change="handleChange"
            />
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
