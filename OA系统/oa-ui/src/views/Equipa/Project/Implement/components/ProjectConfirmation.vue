<!--项目计划确认表-->
<script setup lang="ts">
import { reactive, unref, ref, inject, onBeforeMount, nextTick, watch } from 'vue'
import { ElButton, ElMessage, ElForm, ElFormItem, ElDatePicker } from 'element-plus'
import { getAllDeptListApi } from '@/api/sys/dept' // 获取所有部门
import { listToTree } from '@/utils/tree'
import { useValidator } from '@/hooks/web/useValidator'
import moment from 'moment'
import { useCache } from '@/hooks/web/useCache'
import {
  projectTypeA,
  projectTypeB,
  projectTypeC,
  projectAffiliation,
  projectType
} from '../../config/config'
import { getCustomerDetailApi, getCustomerListApi } from '@/api/customer'

const { required, notSpace, validatePhoneNumber } = useValidator()
// callback 类型
type Callback = (error?: string | Error | undefined) => void
const { wsCache } = useCache()
const loginUserId = ref<string>(wsCache.get('userInfo').userId) // 登录用户id
const props = defineProps({
  detailsData: {
    type: Object,
    default: {}
  },
  newData: {
    type: Object,
    default: {}
  }
})
const emit = defineEmits(['update:confirmData', 'closeDialogClick'])
const ruleForm = ref<any>({
  pid: props.detailsData.pid, // 项目id
  projectTitle: props.detailsData.projectTitle, // 项目名称
  itemNumber: props.detailsData.itemNumber, // 项目编号
  projectAffiliation: props.detailsData.projectAffiliation
    ? props.detailsData.projectAffiliation
    : '1', // 项目属性
  projectType: props.detailsData.projectType,
  projectTypeCompany: props.detailsData.projectTypeCompany, // 项目类型1
  projectTypeIndustry: props.detailsData.projectTypeIndustry, // 项目类型2
  projectTypeSales: props.detailsData.projectTypeSales, // 项目类型3
  directCustomerId: props.detailsData.directCustomerId
    ? props.detailsData.directCustomerId
    : props.detailsData.customerId, // 项目类型3
  directCustomerContactsId: props.detailsData.directCustomerContactsId
    ? Number(props.detailsData.directCustomerContactsId)
    : Number(props.detailsData.customerContactsId),
  directPhone: props.detailsData.directPhone,
  finalCustomerId: props.detailsData.finalCustomerId, // 项目类型3
  finalCustomerContactsId: Number(props.detailsData.finalCustomerContactsId),
  finalPhone: props.detailsData.finalPhone,
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
  projectTeam: '',
  implementDept: '', // 实施部门
  smSignatureDate: '', // 	销售经理_签名_日期
  smUpprincipalSignature: '', // 		销售经理_分管负责人_签名
  smUpprincipalSignatureDate: '', // 		销售经理_分管负责人_签名日期
  pmUpprincipalSignature: '', // 	项目经理_分管负责人_签名
  pmUpprincipalSignatureDate: '', // 	项目经理_分管负责人_签名日期
  gmSignature: '', // 总经理_签名
  gmSignatureDate: '', // 总经理_签名日期
  updateProjectTitle: ''
})

// 监听父级传递数据
watch(
  () => props.newData,
  (data: any) => {
    if (data) {
      nextTick(async () => {
        ruleForm.value = props.newData
        ruleForm.value.projectTitle = props.detailsData.projectTitle
        ruleForm.value.itemNumber = props.detailsData.itemNumber
        ruleForm.value.projectAffiliation = ruleForm.value.projectAffiliation
          ? ruleForm.value.projectAffiliation
          : props.detailsData.projectAffiliation
        ruleForm.value.projectType = ruleForm.value.projectType
          ? ruleForm.value.projectType
          : props.detailsData.projectType
        ruleForm.value.directCustomerId = ruleForm.value.directCustomerId
          ? ruleForm.value.directCustomerId
          : props.detailsData.directCustomerId
          ? props.detailsData.directCustomerId
          : ruleForm.value.customerId
          ? ruleForm.value.customerId
          : props.detailsData.customerId
        ruleForm.value.directCustomerContactsId = ruleForm.value.directCustomerContactsId
          ? ruleForm.value.directCustomerContactsId
          : props.detailsData.directCustomerContactsId
          ? props.detailsData.directCustomerContactsId
          : ruleForm.value.customerContactsId
          ? ruleForm.value.customerContactsId
          : props.detailsData.customerContactsId
        ruleForm.value.directPhone = ruleForm.value.directPhone
          ? ruleForm.value.directPhone
          : props.detailsData.directPhone
          ? props.detailsData.directPhone
          : ruleForm.value.phone
          ? ruleForm.value.phone
          : props.detailsData.phone
        ruleForm.value.finalCustomerId = ruleForm.value.finalCustomerId
          ? ruleForm.value.finalCustomerId
          : props.detailsData.finalCustomerId
        ruleForm.value.finalCustomerContactsId = ruleForm.value.finalCustomerContactsId
          ? ruleForm.value.finalCustomerContactsId
          : props.detailsData.finalCustomerContactsId
        ruleForm.value.finalPhone = ruleForm.value.finalPhone
          ? ruleForm.value.finalPhone
          : props.detailsData.finalPhone
        ruleForm.value.projectTypeCompany = ruleForm.value.projectTypeCompany
          ? ruleForm.value.projectTypeCompany
          : props.detailsData.projectTypeCompany
        ruleForm.value.projectTypeIndustry = ruleForm.value.projectTypeIndustry
          ? ruleForm.value.projectTypeIndustry
          : props.detailsData.projectTypeIndustry
        ruleForm.value.projectTypeSales = ruleForm.value.projectTypeSales
          ? ruleForm.value.projectTypeSales
          : props.detailsData.projectTypeSales
        ruleForm.value.implementDept = ruleForm.value.implementDept
          ? Number(ruleForm.value.implementDept)
          : ''
        ruleForm.value.lastUserUnit = ruleForm.value.lastUserUnit
          ? ruleForm.value.lastUserUnit
          : props.detailsData.lastUserName
        ruleForm.value.projectManager = ruleForm.value.projectManager
          ? Number(ruleForm.value.projectManager)
          : ''
        ruleForm.value.salesManager = ruleForm.value.salesManager
          ? Number(ruleForm.value.salesManager)
          : Number(loginUserId.value)

        if (ruleForm.value.directCustomerId) {
          let res = await getCustomerDetailApi(ruleForm.value.directCustomerId)
          if (res && res.data) {
            contactsArray.value =
              res.data.contacts && res.data.contacts.length ? res.data.contacts : []
          }
          let checkData = customerArray.value.find(
            (element: any) => element.id == ruleForm.value.directCustomerId
          )
          if (!checkData) {
            customerArray.value.push({
              id: ruleForm.value.directCustomerId,
              customerName: res.data.customerName,
              disabled: true
            })
          }
        }

        if (ruleForm.value.finalCustomerId) {
          let res = await getCustomerDetailApi(ruleForm.value.finalCustomerId)
          if (res && res.data) {
            lastContactsArray.value =
              res.data.contacts && res.data.contacts.length ? res.data.contacts : []
            let checkData = customerArray.value.find(
              (element: any) => element.id == ruleForm.value.finalCustomerId
            )
            if (!checkData) {
              customerArray.value.push({
                id: ruleForm.value.finalCustomerId,
                customerName: res.data.customerName,
                disabled: true
              })
            }
          }
        }
      })
    }
  },
  {
    immediate: true
  }
)
// 监听父级传递数据
const projectTitle = ref<string>('')
watch(
  () => props.detailsData,
  (data: any) => {
    if (data) {
      nextTick(async () => {
        projectTitle.value = props.detailsData.projectTitle ? props.detailsData.projectTitle : ''
      })
    }
  },
  {
    immediate: true
  }
)
const options = inject<any>('principalOtherTree')
const deptDataList = ref<any>([])
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
}

const formRef = ref<any>()
const sureLoading = ref<boolean>(false)

const rules = reactive({
  itemNumber: [
    { required: true, message: '该项为必填项', trigger: 'blur' },
    {
      validator: (rule: any, value: string, callback: Callback) =>
        notSpace(value, callback, '不能输入纯空格'),
      trigger: 'blur'
    }
  ],
  projectTitle: [
    { required: true, message: '该项为必填项', trigger: 'blur' },
    {
      validator: (rule: any, value: string, callback: Callback) =>
        notSpace(value, callback, '不能输入纯空格'),
      trigger: 'blur'
    }
  ],
  projectAffiliation: [
    { required: true, message: '该项为必填项', trigger: 'blur' },
    {
      validator: (rule: any, value: string, callback: Callback) =>
        notSpace(value, callback, '不能输入纯空格'),
      trigger: 'blur'
    }
  ],
  projectType: [
    { required: true, message: '该项为必填项', trigger: 'blur' },
    {
      validator: (rule: any, value: string, callback: Callback) =>
        notSpace(value, callback, '不能输入纯空格'),
      trigger: 'blur'
    }
  ],
  projectTypeCompany: [
    { required: true, message: '该项为必填项', trigger: 'blur' },
    {
      validator: (rule: any, value: string, callback: Callback) =>
        notSpace(value, callback, '不能输入纯空格'),
      trigger: 'blur'
    }
  ],
  projectTypeIndustry: [{ required: true, message: '该项为必选项', trigger: 'blur' }],
  projectTypeSales: [{ required: true, message: '该项为必选项', trigger: 'blur' }],
  lastUserUnit: [{ required: true, message: '该项为必填项', trigger: 'blur' }],
  directCustomerId: [{ required: true, message: '该项为必选项', trigger: 'change' }],
  directCustomerContactsId: [{ required: true, message: '该项为必选项', trigger: 'change' }],
  directPhone: [{ required: true, message: '该项为必选项', trigger: 'change' }],
  finalCustomerId: [{ required: true, message: '该项为必选项', trigger: 'change' }],
  finalCustomerContactsId: [{ required: true, message: '该项为必选项', trigger: 'change' }],
  finalPhone: [{ required: true, message: '该项为必选项', trigger: 'change' }],
  contractSignUnit: [
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
  contractSignDate: [{ required: true, message: '该项为必选项', trigger: 'change' }],
  contractNumber: [
    { required: true, message: '该项为必填项', trigger: 'blur' },
    {
      validator: (rule: any, value: string, callback: Callback) =>
        notSpace(value, callback, '不能输入纯空格'),
      trigger: 'blur'
    }
  ],
  predictAcceptDate: [{ required: true, message: '该项为必选项', trigger: 'change' }],
  predictPaymentDate: [{ required: true, message: '该项为必选项', trigger: 'change' }],
  contractMoney: [
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
  projectManager: [
    { required: true, message: '该项为必选项', trigger: 'change' },
    {
      trigger: 'change',
      validator: (rule: any, value: string, callback: Callback) => {
        if (value && value.length < 2) {
          callback(new Error('请选择项目经理'))
        }
        callback()
      }
    }
  ],
  salesManager: [
    { required: true, message: '该项为必选项', trigger: 'change' },
    {
      trigger: 'change',
      validator: (rule: any, value: string, callback: Callback) => {
        if (value && value.length < 2) {
          callback(new Error('请选择销售经理'))
        }
        callback()
      }
    }
  ],
  name: [{ required: true, message: '请选择', trigger: 'change' }],
  projectTeam: [
    { required: true, message: '该项为必填项', trigger: 'blur' },
    {
      validator: (rule: any, value: string, callback: Callback) =>
        notSpace(value, callback, '不能输入纯空格'),
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
  implementDept: [
    { required: true, message: '该项为必选项', trigger: 'change' },
    {
      validator: (rule: any, value: string, callback: Callback) =>
        notSpace(value, callback, '不能输入纯空格'),
      trigger: 'blur'
    }
  ]
})
const handleChange = (val: any) => {}
// 项目进展
const submitEvolve = async () => {
  if (!formRef.value) return
  await formRef.value?.validate(async (valid: any, fields: any) => {
    if (valid) {
      sureLoading.value = true
      if (projectTitle.value != ruleForm.value.projectTitle) {
        let updateProjectTitle = ruleForm.value.projectTitle
        ruleForm.value.updateProjectTitle = updateProjectTitle
        ruleForm.value.projectTitle = projectTitle.value
      }
      ruleForm.value.projectManager =
        ruleForm.value.projectManager instanceof Array
          ? ruleForm.value.projectManager[ruleForm.value.projectManager.length - 1] + ''
          : ruleForm.value.projectManager
      ruleForm.value.salesManager =
        ruleForm.value.salesManager instanceof Array
          ? ruleForm.value.salesManager[ruleForm.value.salesManager.length - 1] + ''
          : ruleForm.value.salesManager
      ruleForm.value.implementDept =
        ruleForm.value.implementDept instanceof Array
          ? ruleForm.value.implementDept[ruleForm.value.implementDept.length - 1] + ''
          : ruleForm.value.implementDept
      ruleForm.value.contractSignDate = moment(ruleForm.value.contractSignDate).format('YYYY-MM-DD')
      emit('update:confirmData', ruleForm.value)
      closeDialog()
      setTimeout(() => {
        sureLoading.value = false
      }, 200)
    }
  })
}

// 关闭弹窗
const closeDialog = () => {
  emit('closeDialogClick')
}
// 关闭弹窗
const propDataForm = () => {}
// 后去驳回的数据
const getByRejectData = () => {
  nextTick(() => {
    ruleForm.value = Object.assign(ruleForm.value, props.detailsData.rejectData)
    //  项目经理
    ruleForm.value.projectManager =
      ruleForm.value.projectManager && ruleForm.value.projectManager !== ''
        ? Number(ruleForm.value.projectManager)
        : ''
    // 销售经理
    ruleForm.value.salesManager = ruleForm.value.salesManager
      ? Number(ruleForm.value.salesManager)
      : ''
    // 实施部门
    ruleForm.value.implementDept = ruleForm.value.implementDept
      ? Number(ruleForm.value.implementDept)
      : ''
    ruleForm.value.pid = props.detailsData.pid // 项目名称
    ruleForm.value.itemNumber = props.detailsData.itemNumber // 项目编号
    ruleForm.value.projectTitle = props.detailsData.projectTitle // 项目名称
    console.log('ruleForm.value.projectTypeIndustry==>', ruleForm.value.projectTypeIndustry)
    ruleForm.value.projectType = ruleForm.value.projectTypeIndustry
      ? String(Number(ruleForm.value.projectTypeIndustry) - 1)
      : props.detailsData.projectType
  })
}

onBeforeMount(() => {
  getByRejectData()
  getAllDeptlist()
  getCustomerArray()
})
//选择客户
const customerChange = (value: any) => {
  contactsArray.value = []
  if (value) {
    getContactsArrayByCustomer(value)
  } else {
    ruleForm.value.directCustomerContactsId = ''
    ruleForm.value.directPhone = ''
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
      ruleForm.value.directCustomerContactsId = contactsArray.value[0].id
      ruleForm.value.directPhone = contactsArray.value[0].phone
    } else {
      ruleForm.value.directCustomerContactsId = ''
      ruleForm.value.directPhone = ''
    }
  }
}

//
const lastContactsArray = ref<any>([])
const getLastContactsArrayByCustomer = async (id: string) => {
  let res = await getCustomerDetailApi(id)
  if (res && res.data) {
    lastContactsArray.value = res.data.contacts && res.data.contacts.length ? res.data.contacts : []
    if (lastContactsArray.value.length > 0) {
      ruleForm.value.finalCustomerContactsId = lastContactsArray.value[0].id
      ruleForm.value.finalPhone = lastContactsArray.value[0].phone
    } else {
      ruleForm.value.finalCustomerContactsId = ''
      ruleForm.value.finalPhone = ''
    }
  }
}

const lastCustomerChange = (value: any) => {
  lastContactsArray.value = []
  if (value) {
    getLastContactsArrayByCustomer(value)
  } else {
    ruleForm.value.finalCustomerContactsId = ''
    ruleForm.value.finalPhone = ''
  }
}

const affiliationChange = (value: any) => {
  if (value == '1') {
    ruleForm.value.finalCustomerId = ''
    ruleForm.value.finalCustomerContactsId = ''
    ruleForm.value.finalPhone = ''
  }
}
defineExpose({})
</script>

<template>
  <section class="w-4/5 overflow-x-hidden" style="height: 100%; width: 100%">
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

      <el-row>
        <el-col :span="12">
          <el-form-item label="项目编号" prop="itemNumber" class="w-full">
            <el-Input disabled v-model="ruleForm.itemNumber" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="项目属性" prop="projectAffiliation" class="w-full">
            <el-Radio-group v-model="ruleForm.projectAffiliation" @change="affiliationChange">
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

      <el-row>
        <el-col :span="24">
          <el-form-item label="项目类型" prop="projectTypeCompany" class="w-full">
            <el-Radio-group v-model="ruleForm.projectTypeCompany">
              <el-Radio :label="item.value" v-for="(item, index) in projectTypeA" :key="index">{{
                item.label
              }}</el-Radio>
            </el-Radio-group>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="所属行业" prop="projectType" class="w-full">
            <el-Radio-group v-model="ruleForm.projectType">
              <el-Radio :label="item.value" v-for="(item, index) in projectType" :key="index">{{
                item.label
              }}</el-Radio>
            </el-Radio-group>
          </el-form-item>
        </el-col>
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
      </el-row>
      <!-- <el-row>
        <el-form-item label="项目类型" required class="w-full project-type">
          <el-form-item prop="projectTypeCompany" label-width="0" class="w-full">
            <el-Radio-group v-model="ruleForm.projectTypeCompany">
              <el-Radio :label="item.value" v-for="(item, index) in projectTypeA" :key="index">{{
                item.label
              }}</el-Radio>
            </el-Radio-group>
          </el-form-item>
          <el-form-item prop="projectTypeIndustry" label-width="0" class="w-full">
            <el-Radio-group v-model="ruleForm.projectTypeIndustry" disabled>
              <el-Radio :label="item.value" v-for="(item, index) in projectTypeB" :key="index">{{
                item.label
              }}</el-Radio>
            </el-Radio-group>
          </el-form-item>
          <el-form-item prop="projectTypeSales" label-width="0" class="w-full">
            <el-Radio-group v-model="ruleForm.projectTypeSales">
              <el-Radio :label="item.value" v-for="(item, index) in projectTypeC" :key="index">{{
                item.label
              }}</el-Radio>
            </el-Radio-group>
          </el-form-item>
        </el-form-item>
      </el-row> -->

      <el-row>
        <el-col :span="24">
          <el-form-item label="直接客户" prop="directCustomerId">
            <el-select
              v-model="ruleForm.directCustomerId"
              placeholder="请选择直接客户"
              style="width: 100%"
              :clearable="true"
              :filterable="true"
              @change="customerChange"
            >
              <el-option
                :value="item.id"
                :label="item.customerName"
                v-for="item in customerArray"
                :key="item.id"
                :disabled="item.disabled"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="客户联系人" prop="directCustomerContactsId">
            <el-select
              v-model="ruleForm.directCustomerContactsId"
              placeholder="请选择客户联系人"
              style="width: 100%"
              :clearable="true"
              :filterable="true"
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
        <el-col :span="12">
          <el-form-item label="客户联系电话" prop="directPhone">
            <el-input
              maxlength="15"
              v-model="ruleForm.directPhone"
              :disabled="true"
              placeholder="请输入客户联系电话"
            />
          </el-form-item>
        </el-col>
        <el-col :span="24" v-if="ruleForm.projectAffiliation === '2'">
          <el-form-item label="最终用户" prop="finalCustomerId">
            <el-select
              v-model="ruleForm.finalCustomerId"
              placeholder="请选择最终用户"
              style="width: 100%"
              :clearable="true"
              :filterable="true"
              @change="lastCustomerChange"
            >
              <el-option
                :value="item.id"
                :label="item.customerName"
                v-for="item in customerArray"
                :key="item.id"
                :disabled="item.disabled"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12" v-if="ruleForm.projectAffiliation === '2'">
          <el-form-item label="最终用户联系人" prop="finalCustomerContactsId">
            <el-select
              v-model="ruleForm.finalCustomerContactsId"
              placeholder="请选择最终用户联系人"
              style="width: 100%"
              :clearable="true"
              :filterable="true"
            >
              <el-option
                :value="item.id"
                :label="item.contacts"
                v-for="item in lastContactsArray"
                :key="item.id"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12" v-if="ruleForm.projectAffiliation === '2'">
          <el-form-item label="最终用户联系电话" prop="finalPhone">
            <el-input
              maxlength="15"
              v-model="ruleForm.finalPhone"
              :disabled="true"
              placeholder="请输入最终用户联系电话"
            />
          </el-form-item>
        </el-col>
      </el-row>
      <!-- <el-row>
        <el-form-item label="最终用户名称" prop="lastUserUnit" class="w-full">
          <el-Input :maxlength="100" placeholder="请输入" v-model="ruleForm.lastUserUnit" />
        </el-form-item>
      </el-row>

      <el-row>
        <el-form-item
          v-if="ruleForm.projectAffiliation === '2'"
          label="合同签订单位"
          prop="contractSignUnit"
          class="w-full"
        >
          <el-Input :maxlength="100" v-model="ruleForm.contractSignUnit" />
        </el-form-item>
        <el-form-item v-else label="合同签订单位" class="w-full">
          <el-Input :maxlength="100" placeholder="请输入" v-model="ruleForm.contractSignUnit" />
        </el-form-item>
      </el-row> -->

      <el-row>
        <el-col :span="12">
          <el-form-item label="合同签订日期" prop="contractSignDate">
            <el-date-picker
              type="date"
              placeholder="选择日期"
              v-model="ruleForm.contractSignDate"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="项目合同编号" prop="contractNumber">
            <el-Input :maxlength="200" placeholder="请输入" v-model="ruleForm.contractNumber" />
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-form-item label="合同金额（万元）" prop="contractMoney" class="w-full">
          <el-Input placeholder="请输入" v-model.trim="ruleForm.contractMoney" />
        </el-form-item>
      </el-row>

      <el-row>
        <el-col :span="12">
          <el-form-item label="项目经理" prop="projectManager">
            <el-cascader
              v-model="ruleForm.projectManager"
              style="width: 100%"
              :filterable="true"
              :disabled="false"
              :props="{ label: 'deptName', value: 'deptId' }"
              :controlsPosition="'right'"
              :options="options"
              placement="top-start"
              @change="handleChange"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="销售经理" prop="salesManager">
            <el-cascader
              v-model="ruleForm.salesManager"
              style="width: 100%"
              :filterable="true"
              :disabled="false"
              :props="{ label: 'deptName', value: 'deptId' }"
              :controlsPosition="'right'"
              :options="options"
              placement="top-start"
              @change="handleChange"
            />
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="12">
          <el-form-item label="实施部门" prop="implementDept">
            <el-cascader
              v-model="ruleForm.implementDept"
              style="width: 100%"
              :filterable="true"
              :disabled="false"
              placement="top-start"
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
    <div class="flex justify-center">
      <ElButton type="primary" :loading="sureLoading" @click="submitEvolve"> 确定 </ElButton>
      <ElButton @click="closeDialog">取消</ElButton></div
    >
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
