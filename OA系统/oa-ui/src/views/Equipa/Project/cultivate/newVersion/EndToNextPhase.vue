<!-- 培育详情-申请结束转立项 -->
<script setup lang="ts">
import { unref, ref, inject, nextTick, onBeforeMount, watch } from 'vue'
import { ElButton, ElMessage, ElForm, ElCascader, ElFormItem, ElDatePicker } from 'element-plus'
import moment from 'moment'
import { useValidator } from '@/hooks/web/useValidator'
import { approvalApplyCultivateApi } from '@/api/project/cultivate' // 获取信息
import { useEmitt } from '@/hooks/web/useEmitt'
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
  projectAffiliation
} from '../../config/config'
import { getCustomerDetailApi, getCustomerListApi } from '@/api/customer'
import { useCache } from '@/hooks/web/useCache'

const props = defineProps({
  detailsData: {
    type: Object,
    default: {}
  }
})
const { wsCache } = useCache()
const loginUserId = ref<string>(wsCache.get('userInfo').userId) // 登录用户id
const dept = ref<string>(wsCache.get('userInfo').dept.deptId)
const customerId = ref<string>('')
const projectTitle = ref<string>('')

const { emitter } = useEmitt()

const emit = defineEmits(['closeDialogClick', 'changeGetDetail'])

// callback 类型
type Callback = (error?: string | Error | undefined) => void
// 导入表单校验
const { required, notSpace, validatePhoneNumber } = useValidator()
const options = inject<any>('principalTree')
const isSeeSub = ref(false)

const projectAffiliationFlag = ref<boolean>(false)

const ruleForm = ref<any>({
  pid: props.detailsData.id, // 项目名称
  projectTitle: props.detailsData.projectTitle, // 项目名称
  projectSource: props.detailsData.projectSource, // 项目来源
  projectAffiliation: '1', // 项目属性
  projectTypeCompany: '', // 项目类型1
  projectTypeIndustry: String(Number(props.detailsData.projectType) + 1), // 项目类型2
  projectTypeSales: '', // 项目类型3
  lastUserPerson: '', // 	最终用户联系人
  lastUserDept: '', // 最终用户部门及职务
  lastUserLink: '', // 	最终用户联系方式
  lastUserTypeA: '', // 	最终用户类型A
  lastUserTypeB: '', // 	最终用户类型B
  purchaseMethod: '', // 	预计采购方式
  projectPhasesCondition: '', // 	项目目前阶段
  predictSignedOdds: '', // 	预计签约几率
  predictContractMoney: '', // 		预计合同金额
  projectContent: props.detailsData.planContent, // 			项目内容描述
  milestoneA: '', // 			预计时间-1项目关键人实际对接
  milestoneB: '', // 			预计时间-1项目关键人实际对接
  milestoneC: '', // 			预计时间-1项目关键人实际对接
  preSalesPerson: '', // 			售前支持人员
  salesPerson: '', // 			销售人员
  preSalesPersonId: [], // 			售前支持人员
  salesPersonId: [Number(dept.value), Number(loginUserId.value)], // 			销售人员
  createByName: '', // 		立项人
  projectApprovalTime: '', // 		立项时间
  upPrincipalStatus: '', // 	分管负责人审批状态 0同意、1驳回
  relatedDeptPerson: '', // 	相关部门负责人
  relatedDeptPersonId: [], // 	相关部门负责人
  gmStatus: '', // 总经理审批状态 0同意、1驳回
  turnUserName: '', // 转签用户名称
  turnUserPerson: '', // 转签用户名称
  turnUserTypeA: '', // 转签用户名称
  turnUserTypeB: '', // 转签用户名称
  turnUserDept: '', // 转签用户名称
  turnUserLink: '', // 转签用户名称
  lastUserName: '', // 最终用户名称
  updateProjectTitle: ''
})

const getByRejectData = () => {
  nextTick(() => {
    ruleForm.value = Object.assign(ruleForm.value, props.detailsData.rejectData)
    ruleForm.value.salesPersonId =
      ruleForm.value.salesPerson && ruleForm.value.salesPerson !== ''
        ? Number(ruleForm.value.salesPerson)
        : [Number(dept.value), Number(loginUserId.value)]
    ruleForm.value.projectTypeIndustry =
      ruleForm.value.projectTypeIndustry && ruleForm.value.projectTypeIndustry !== ''
        ? ruleForm.value.projectTypeIndustry
        : String(Number(props.detailsData.projectType) + 1)
    ruleForm.value.preSalesPersonId = ruleForm.value.preSalesPerson
      ? Number(ruleForm.value.preSalesPerson)
      : ''
    ruleForm.value.relatedDeptPersonId = ruleForm.value.relatedDeptPerson
      ? Number(ruleForm.value.relatedDeptPerson)
      : ''
    ruleForm.value.pid = props.detailsData.id // 项目名称
    ruleForm.value.projectTitle = props.detailsData.projectTitle // 项目名称
    ruleForm.value.projectType = props.detailsData.projectType // 项目名称
  })
}
onBeforeMount(() => {
  getByRejectData()
})

const formRef = ref<any>()
const sureLoading = ref<boolean>(false)
const endDialogVisible = ref(false)

const rules = ref<any>({
  lastUserName: [
    { required: true, message: '该项为必填项', trigger: 'blur' },
    {
      validator: (rule: any, value: string, callback: Callback) =>
        notSpace(value, callback, '不能输入纯空格'),
      trigger: 'blur'
    }
  ],
  lastUserDept: [
    { required: true, message: '该项为必填项', trigger: 'blur' },
    {
      validator: (rule: any, value: string, callback: Callback) =>
        notSpace(value, callback, '不能输入纯空格'),
      trigger: 'blur'
    }
  ],
  lastUserLink: [
    { required: true, message: '该项为必填项', trigger: 'blur' },
    {
      validator: (rule: any, value: string, callback: Callback) => {
        if (value) {
          validatePhoneNumber(value, callback, '请输入正确的手机号或(区号)+电话号码')
        } else {
          callback()
        }
      },
      trigger: 'blur'
    }
  ],

  lastUserPerson: [
    { required: true, message: '该项为必填项', trigger: 'blur' },
    {
      validator: (rule: any, value: string, callback: Callback) =>
        notSpace(value, callback, '不能输入纯空格'),
      trigger: 'blur'
    }
  ],
  predictContractMoney: [
    { required: true, message: '该项为必填项', trigger: 'blur' },
    {
      validator: (rule: any, value: string, callback: Callback) =>
        notSpace(value, callback, '不能输入纯空格'),
      trigger: 'blur'
    },
    {
      validator: (rule: any, value: string, callback: Callback) => {
        if (/(^[1-9]{1}\d{0,4}$)|(^[0-9]{1}\d{0,4}[.]{1}[0-9]{1,6}$)/.test(value)) {
          callback()
        } else {
          callback(new Error('请输入大于0小于100000之间的数字，小数点后最多六位'))
        }
      },
      trigger: 'blur'
    }
  ],
  projectContent: [
    { required: true, message: '该项为必填项', trigger: 'blur' },
    {
      validator: (rule: any, value: string, callback: Callback) =>
        notSpace(value, callback, '不能输入纯空格'),
      trigger: 'blur'
    }
  ],
  projectTitle: [{ required: true, message: '该项为必填项', trigger: 'blur' }],
  projectSource: [{ required: true, message: '该项为必选项', trigger: 'change' }],
  lastUserTypeA: [{ required: true, message: '该项为必选项', trigger: 'change' }],
  lastUserTypeB: [{ required: true, message: '该项为必选项', trigger: 'change' }],
  purchaseMethod: [{ required: true, message: '该项为必选项', trigger: 'change' }],
  customerId: [{ required: true, message: '该项为必选项', trigger: 'change' }],
  customerContactsId: [{ required: true, message: '该项为必选项', trigger: 'change' }],
  projectAffiliation: [{ required: true, message: '该项为必选项', trigger: 'change' }],
  projectTypeCompany: [{ required: true, message: '该项为必选项', trigger: 'change' }],
  projectTypeIndustry: [{ required: true, message: '该项为必选项', trigger: 'change' }],
  projectTypeSales: [{ required: true, message: '该项为必选项', trigger: 'change' }],
  projectPhasesCondition: [{ required: true, message: '该项为必选项', trigger: 'change' }],
  predictSignedOdds: [{ required: true, message: '该项为必选项', trigger: 'change' }],
  milestoneA: [{ required: true, message: '该项为必选项', trigger: 'change' }],
  milestoneB: [{ required: true, message: '该项为必选项', trigger: 'change' }],
  milestoneC: [{ required: true, message: '该项为必选项', trigger: 'change' }],
  preSalesPersonId: [{ required: true, message: '该项为必选项', trigger: 'blur' }],
  salesPersonId: [{ required: true, message: '该项为必选项', trigger: 'change' }],
  turnUserName: [
    {
      required: true,
      message: '该项为必填项',
      trigger: 'blur'
    },
    {
      validator: (rule: any, value: string, callback: Callback) =>
        notSpace(value, callback, '不能输入纯空格'),
      trigger: 'blur'
    }
  ],
  turnUserPerson: [
    {
      required: true,
      message: '该项为必填项',
      trigger: 'blur'
    },
    {
      validator: (rule: any, value: string, callback: Callback) =>
        notSpace(value, callback, '不能输入纯空格'),
      trigger: 'blur'
    }
  ],
  turnUserDept: [
    {
      required: true,
      message: '该项为必填项',
      trigger: 'blur'
    },
    {
      validator: (rule: any, value: string, callback: Callback) =>
        notSpace(value, callback, '不能输入纯空格'),
      trigger: 'blur'
    }
  ],
  turnUserLink: [
    {
      required: true,
      message: '该项为必填项',
      trigger: 'blur'
    },
    {
      validator: (rule: any, value: string, callback: Callback) => {
        if (value) {
          validatePhoneNumber(value, callback, '请输入正确的手机号或(区号)+电话号码')
        } else {
          callback()
        }
      },
      trigger: 'blur'
    }
  ],
  turnUserTypeA: [
    {
      required: true,
      message: '该项为必选项',
      trigger: 'blur'
    }
  ],
  turnUserTypeB: [
    {
      required: true,
      message: '该项为必选项',
      trigger: 'blur'
    }
  ],
  resource: [{ required: false, message: '请输入备注', trigger: 'blur' }]
})
const handleChange = () => {}
const handleChangeSalesPerson = (val: any) => {
  // console.log(val)
}
// 重置表单
const chanageprojectAffiliationFlag = (val: any) => {
  if (val == 2) {
    // nextTick(() => {
    projectAffiliationFlag.value = true
    // })
  } else {
    projectAffiliationFlag.value = false
  }
  // console.log(val)
}
// 重置表单
const resetForm = () => {
  if (!formRef.value) return
  formRef.value.resetFields()
  ruleForm.value = unref({
    pid: props.detailsData.id,
    reason: ''
  })
  customerId.value = ''
  customerArray.value = []
  contactsArray.value = []
}
// 获取某月最后一天
const getMonthLast = (timestamp: any) => {
  let date: any = timestamp ? new Date(timestamp) : new Date()
  let year: any = date.getFullYear()
  let month: any = date.getMonth()
  // day为0表示获取上一个月最后一天，所以month+1
  // 86300表示一天秒数，最后日期为 23:59:59
  return (new Date(year, month + 1, 0) / 1000 + 86399) * 1000
}

// 项目进展
const submitEvolve = async () => {
  const form = unref(formRef)
  if (!formRef.value) return
  await formRef.value?.validate(async (valid: any, fields: any) => {
    if (valid) {
      sureLoading.value = true
      if (projectTitle.value != ruleForm.value.projectTitle) {
        let updateProjectTitle = ruleForm.value.projectTitle
        ruleForm.value.updateProjectTitle = updateProjectTitle
        ruleForm.value.projectTitle = projectTitle.value
      }
      // 售前支持人员
      ruleForm.value.preSalesPerson =
        ruleForm.value.preSalesPersonId instanceof Array
          ? ruleForm.value.preSalesPersonId[ruleForm.value.preSalesPersonId.length - 1] + ''
          : ruleForm.value.preSalesPersonId
      ruleForm.value.relatedDeptPerson =
        ruleForm.value.relatedDeptPersonId instanceof Array
          ? ruleForm.value.relatedDeptPersonId[ruleForm.value.relatedDeptPersonId.length - 1] + ''
          : ruleForm.value.relatedDeptPersonId
      // 销售人员
      ruleForm.value.salesPerson =
        ruleForm.value.salesPersonId instanceof Array
          ? ruleForm.value.salesPersonId[ruleForm.value.salesPersonId.length - 1] + ''
          : ruleForm.value.salesPersonId
      ruleForm.value.milestoneA = moment(getMonthLast(ruleForm.value.milestoneA)).format(
        'YYYY-MM-DD'
      )
      ruleForm.value.milestoneB = moment(getMonthLast(ruleForm.value.milestoneB)).format(
        'YYYY-MM-DD'
      )
      ruleForm.value.milestoneC = moment(getMonthLast(ruleForm.value.milestoneC)).format(
        'YYYY-MM-DD'
      )
      const res = await approvalApplyCultivateApi(ruleForm.value)
        .catch(() => {})
        .finally(() => {
          setTimeout(() => {
            sureLoading.value = false
          }, 200)
        })
      if (res) {
        ElMessage.success('信息保存成功')
        closeDialog()
        resetForm()
        callbackDetail()
        //通知立项项目列表刷新
        emitter.emit('implement', 'refresh')
      }
    }
  })
}
// 关闭弹窗
const closeDialog = () => {
  emit('closeDialogClick')
}

const callbackDetail = () => {
  emit('changeGetDetail')
}
const signature = () => {
  endDialogVisible.value = true
}

const changeAmount = (num: any) => {
  var x = String(num).indexOf('.') + 1 //得到小数点的位置
  var y = String(num).length - x //小数点的位数
  if (x > 0 && y > 6) {
    ruleForm.value.predictContractMoney = Number(Number(num).toFixed(6))
  } else {
    ruleForm.value.predictContractMoney = num
  }
}

const otherOptions = inject<any>('principalOtherTree')

//选择客户
const customerChange = (value: any) => {
  contactsArray.value = []
  if (value) {
    getContactsArrayByCustomer(value)
  } else {
    ruleForm.value.customerContactsId = ''
  }
}
//客户集合
const customerArray = ref<any>([])
const getCustomerArray = async () => {
  let param = { pageSize: 999, pageNum: 1, status: '2' }
  let res = await getCustomerListApi(param)
  if (res) {
    customerArray.value = res.rows
  }
}

//用户联系人
const contactsArray = ref<any>([])
const getContactsArrayByCustomer = async (id: string) => {
  let res = await getCustomerDetailApi(id)
  if (res && res.data) {
    contactsArray.value = res.data.contacts && res.data.contacts.length ? res.data.contacts : []
    if (contactsArray.value.length > 0) {
      ruleForm.value.customerContactsId = contactsArray.value[0].id
    } else {
      ruleForm.value.customerContactsId = ''
    }
  }
}

// 监听父级传递数据
watch(
  () => props.detailsData,
  (data: any) => {
    if (data) {
      getCustomerArray()
      nextTick(async () => {
        customerId.value = props.detailsData.customerId ? props.detailsData.customerId : ''
        projectTitle.value = props.detailsData.projectTitle ? props.detailsData.projectTitle : ''
      })
    }
  },
  {
    immediate: true
  }
)
</script>

<template>
  <section class="w-4/5 overflow-x-hidden" style="max-height: 100%; width: 100%">
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
            <el-Input
              v-model="ruleForm.projectTitle"
              maxlength="200"
              placeholder="请输入项目名称"
            />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row v-if="!customerId">
        <el-col :span="24">
          <el-form-item label="项目来源" prop="projectSource" class="w-full">
            <el-Radio-group v-model="ruleForm.projectSource">
              <el-Radio :label="item.value" v-for="(item, index) in projectSource" :key="index">{{
                item.label
              }}</el-Radio>
            </el-Radio-group>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="项目类型" prop="projectTypeCompany" class="w-full">
            <el-Radio-group v-model="ruleForm.projectTypeCompany">
              <el-Radio :label="item.value" v-for="(item, index) in projectTypeA" :key="index">{{
                item.label
              }}</el-Radio>
            </el-Radio-group>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-form-item label="业务分类" prop="projectTypeSales" class="w-full">
            <el-Radio-group v-model="ruleForm.projectTypeSales">
              <el-Radio :label="item.value" v-for="(item, index) in projectTypeC" :key="index">{{
                item.label
              }}</el-Radio>
            </el-Radio-group>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row v-if="!customerId">
        <el-col :span="12">
          <el-form-item label="客户名称" prop="customerId">
            <el-select
              v-model="ruleForm.customerId"
              placeholder="请选择客户名称"
              style="width: 100%"
              :clearable="true"
              :filterable="true"
              :disabled="pageFlag == 'see' || pageFlag == 'alter'"
              @change="customerChange"
            >
              <el-option
                :value="item.id"
                :label="item.customerName"
                v-for="item in customerArray"
                :key="item.id"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="客户联系人" prop="customerContactsId">
            <el-select
              v-model="ruleForm.customerContactsId"
              placeholder="请选择客户联系人"
              style="width: 100%"
              :clearable="true"
              :filterable="true"
              :disabled="pageFlag == 'see' || pageFlag == 'alter'"
            >
              <el-option
                :value="item.id"
                :label="item.contacts"
                v-for="item in contactsArray"
                :key="item.id"
              />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <!-- <div>
        <el-row v-if="!ruleForm.customerId">
          <el-col :span="12">
            <el-form-item label="项目来源" prop="projectSource" class="w-full">
              <el-Radio-group v-model="ruleForm.projectSource">
                <el-Radio :label="item.value" v-for="(item, index) in projectSource" :key="index">{{
                  item.label
                }}</el-Radio>
              </el-Radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="项目属性" prop="projectAffiliation" class="w-full">
              <el-Radio-group
                v-model="ruleForm.projectAffiliation"
                @change="chanageprojectAffiliationFlag"
              >
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
        <el-row v-if="!ruleForm.customerId">
          <el-form-item disabled label="项目类型" required class="w-full project-type">
            <el-form-item prop="projectTypeCompany" label-width="0" class="w-full ts-form">
              <el-Radio-group v-model="ruleForm.projectTypeCompany">
                <el-Radio :label="item.value" v-for="(item, index) in projectTypeA" :key="index">{{
                  item.label
                }}</el-Radio>
              </el-Radio-group>
            </el-form-item>
            <el-form-item
              prop="projectTypeIndustry"
              label-width="0"
              class="w-full ts-form mt-[1vh]"
            >
              <el-Radio-group disabled v-model="ruleForm.projectTypeIndustry">
                <el-Radio :label="item.value" v-for="(item, index) in projectTypeB" :key="index">{{
                  item.label
                }}</el-Radio>
              </el-Radio-group>
            </el-form-item>
            <el-form-item prop="projectTypeSales" label-width="0" class="w-full ts-form mt-[1vh]">
              <el-Radio-group v-model="ruleForm.projectTypeSales">
                <el-Radio :label="item.value" v-for="(item, index) in projectTypeC" :key="index">{{
                  item.label
                }}</el-Radio>
              </el-Radio-group>
            </el-form-item>
          </el-form-item>
        </el-row>
        <el-row v-if="!ruleForm.customerId">
          <el-form-item label="最终用户名称" prop="lastUserName" class="w-full">
            <el-Input maxlength="100" placeholder="请输入" v-model="ruleForm.lastUserName" />
          </el-form-item>
        </el-row>
        <el-row v-if="!ruleForm.customerId">
          <el-col :span="8">
            <el-form-item label="最终用户联系人" prop="lastUserPerson" class="w-full">
              <el-Input maxlength="100" placeholder="请输入" v-model="ruleForm.lastUserPerson" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="部门及职务" prop="lastUserDept" class="w-full">
              <el-Input maxlength="100" placeholder="请输入" v-model="ruleForm.lastUserDept" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="电话" prop="lastUserLink" class="w-full">
              <el-Input maxlength="15" placeholder="请输入" v-model="ruleForm.lastUserLink" />
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
              <el-Radio-group v-model="ruleForm.lastUserTypeA">
                <el-Radio :label="item.value" v-for="(item, index) in turnUserTypeA" :key="index">{{
                  item.label
                }}</el-Radio>
              </el-Radio-group>
            </el-form-item>
            <el-form-item
              label="企业及机构："
              prop="lastUserTypeB"
              class="w-full turn-type-sub ts-form mt-[1.4vh]"
            >
              <el-Radio-group v-model="ruleForm.lastUserTypeB">
                <el-Radio :label="item.value" v-for="(item, index) in turnUserTypeB" :key="index">{{
                  item.label
                }}</el-Radio>
              </el-Radio-group>
            </el-form-item>
          </el-form-item>
        </el-row>
        <el-row v-if="ruleForm.projectAffiliation === '2' && !ruleForm.customerId">
          <el-col :span="12">
            <el-form-item label="转签用户名称" prop="turnUserName" class="w-full">
              <el-Input placeholder="请输入" v-model="ruleForm.turnUserName" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="转签用户联系人" prop="turnUserPerson" class="w-full">
              <el-Input placeholder="请输入" v-model="ruleForm.turnUserPerson" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="转签用户部门及职务" prop="turnUserDept" class="w-full">
              <el-Input placeholder="请输入" v-model="ruleForm.turnUserDept" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="	转签用户联系方式" prop="turnUserLink" class="w-full">
              <el-Input maxlength="15" placeholder="请输入" v-model="ruleForm.turnUserLink" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row v-if="ruleForm.projectAffiliation === '2' && !ruleForm.customerId">
          <el-form-item
            label="转签用户类型"
            :required="ruleForm.projectAffiliation === '2'"
            class="w-full turn-type"
          >
            <el-form-item prop="turnUserTypeA" label-width="0" class="w-full">
              <el-Radio-group v-model="ruleForm.turnUserTypeA">
                <el-Radio :label="item.value" v-for="(item, index) in turnUserTypeA" :key="index">{{
                  item.label
                }}</el-Radio>
              </el-Radio-group>
            </el-form-item>
            <el-form-item prop="turnUserTypeB" label-width="0" class="w-full mt-[1.4vh]">
              <el-Radio-group v-model="ruleForm.turnUserTypeB">
                <el-Radio :label="item.value" v-for="(item, index) in turnUserTypeB" :key="index">{{
                  item.label
                }}</el-Radio>
              </el-Radio-group>
            </el-form-item>
          </el-form-item>
        </el-row>
      </div> -->
      <el-row>
        <el-form-item label="预计采购方式" prop="purchaseMethod" class="w-full">
          <el-Radio-group v-model="ruleForm.purchaseMethod">
            <el-Radio :label="item.value" v-for="(item, index) in purchaseMethod" :key="index">{{
              item.label
            }}</el-Radio>

            <!-- <el-Radio label="1">公开招标</el-Radio>
            <el-Radio label="2">竞争性谈判</el-Radio>
            <el-Radio label="3">竞争性磋商</el-Radio>
            <el-Radio label="4">单一来源</el-Radio>
            <el-Radio label="5">协商签订</el-Radio> -->
          </el-Radio-group>
        </el-form-item>
      </el-row>

      <el-row>
        <el-form-item label="项目目前阶段" prop="projectPhasesCondition" class="w-full">
          <el-Radio-group v-model="ruleForm.projectPhasesCondition">
            <el-Radio
              :label="item.value"
              v-for="(item, index) in projectPhasesCondition"
              :key="index"
              >{{ item.label }}</el-Radio
            >
            <!-- <el-Radio label="1">预算资金已到位</el-Radio>
            <el-Radio label="2">已有预算,资金未到位</el-Radio>
            <el-Radio label="3">已确定,预算未定</el-Radio>
            <el-Radio label="4">前期需求调研</el-Radio> -->
          </el-Radio-group>
        </el-form-item>
      </el-row>

      <el-row>
        <el-col :span="12">
          <el-form-item label="预计签约几率" prop="predictSignedOdds" class="w-full">
            <el-Radio-group v-model="ruleForm.predictSignedOdds">
              <el-Radio :label="item.value" v-for="(item, index) in predictSignedOdds" :key="index"
                >({{ item.label }})</el-Radio
              >
              <!-- <el-Radio label="1">(&gt; 90%)</el-Radio>
              <el-Radio label="2">(70-90%)</el-Radio>
              <el-Radio label="3">(50-70%)</el-Radio>
              <el-Radio label="4">(&lt; 50% )</el-Radio> -->
            </el-Radio-group>
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item label="预计合同金额(万元)" prop="predictContractMoney">
            <el-input
              style="width: 100%"
              :maxLength="13"
              :clearable="true"
              placeholder="请输入"
              @change="changeAmount"
              v-model="ruleForm.predictContractMoney"
            />
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="24">
          <el-form-item label="项目内容描述" prop="projectContent">
            <el-Input
              type="textarea"
              placeholder="请输入"
              maxlength="1000"
              :autosize="{ minRows: 1, maxRows: 8 }"
              v-model="ruleForm.projectContent"
            />
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="3" style="display: flex; align-items: center"
          ><el-form-item label="项目预计时间" required class="w-full"
        /></el-col>
        <el-col :span="20" class="xl:ml-[20px] 2xl:ml-[-20px]">
          <el-col :span="24" class="flex pb-4 border-solid border-b-1">
            <el-form-item label="里程碑1：项目关键人实际对接" prop="milestoneA" label-width="220">
              <el-date-picker
                format="YYYY-MM"
                type="month"
                placeholder="选择日期"
                v-model="ruleForm.milestoneA"
              />
            </el-form-item>
          </el-col>
          <el-col :span="24" class="flex py-4 border-solid border-b-1">
            <el-form-item label="里程碑2：用户已认可项目方案" prop="milestoneB" label-width="220">
              <el-date-picker
                format="YYYY-MM"
                type="month"
                placeholder="选择日期"
                v-model="ruleForm.milestoneB"
              />
            </el-form-item>
          </el-col>
          <el-col :span="24" class="flex py-4">
            <el-form-item label="里程碑3：招标或签约时间确定" prop="milestoneC" label-width="220">
              <el-date-picker
                type="month"
                format="YYYY-MM"
                placeholder="选择日期"
                v-model="ruleForm.milestoneC"
              />
            </el-form-item> </el-col
        ></el-col>
      </el-row>

      <el-row>
        <el-col :span="12">
          <el-form-item label="销售人员" prop="salesPersonId" class="w-full">
            <ElCascader
              v-model="ruleForm.salesPersonId"
              :filterable="true"
              :disabled="false"
              placement="top"
              :props="{ label: 'deptName', value: 'deptId' }"
              :controlsPosition="'right'"
              :options="options"
              @change="handleChangeSalesPerson"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="售前支持人员" prop="preSalesPersonId">
            <ElCascader
              v-model="ruleForm.preSalesPersonId"
              :filterable="true"
              :validateEvent="true"
              :disabled="false"
              placement="top"
              :props="{ label: 'deptName', value: 'deptId' }"
              :controlsPosition="'right'"
              :options="options"
              :popper-append-to-body="false"
              @change="handleChange"
            />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="相关部门(如需)" prop="relatedDeptPersonId" class="w-full">
            <ElCascader
              v-model="ruleForm.relatedDeptPersonId"
              :filterable="true"
              :disabled="false"
              placement="top"
              :props="{ label: 'deptName', value: 'deptId' }"
              :controlsPosition="'right'"
              :options="otherOptions"
            />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <el-row class="text-xs">说明：本文件为保密件。原件留存财务部，复印件留存立项部门。</el-row>
    <div class="flex justify-center">
      <ElButton type="primary" :loading="sureLoading" @click="submitEvolve"> 确定 </ElButton>
      <ElButton @click="closeDialog">取消</ElButton></div
    >
  </section>
</template>

<style lang="less" scoped>
:deep(.el-input-number .el-input__inner) {
  text-align: left;
}
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
