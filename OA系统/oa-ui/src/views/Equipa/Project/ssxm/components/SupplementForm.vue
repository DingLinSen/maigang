<!-- 补充材料 -->
<script setup lang="ts">
import {
  ElButton,
  ElMessage,
  ElCascader,
  ElForm,
  ElFormItem,
  ElDatePicker,
  ElRow,
  ElCol
} from 'element-plus'
import { ref, unref, reactive, onBeforeUpdate, inject, onBeforeMount } from 'vue'
import {
  getAllDeptListApi // 获取所有部门
} from '@/api/sys/dept'
import { listToTree } from '@/utils/tree'
import { Segmentation } from '@/components/Segmentation'
import { DrawerWrap } from '@/components/DrawerWrapDetailsSub'
import { useValidator } from '@/hooks/web/useValidator'
import moment from 'moment'

const { required, notSpace } = useValidator()
import { getEstablishApi, auditProjectApi } from '@/api/project/ssxm'
import { projectType, projectTypeA, projectTypeC } from './config'
defineOptions({
  name: 'SupplementForm'
})

// callback 类型
type Callback = (error?: string | Error | undefined) => void
const emit = defineEmits(['changeGetDetailAndList'])
const isShow = ref<boolean>(false)
const loading = ref<boolean>(false)
const pageTite = ref<string>('')
const drawerWrapSub = ref<any>()
const detailsId = ref<any>()
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

onBeforeMount(() => {
  getAllDeptlist()
})
const nameOverflow = (name: string, length: number) => {
  let nextName = ''
  if (name && name.length) {
    if (name.length > length) {
      nextName = name.slice(0, length) + '...'
    } else {
      nextName = name
    }
  } else {
    nextName = ''
  }
  return nextName
}

// 获取父级数据
let detailsData = ref<any>({
  id: '', // id
  auditSort: '', //转实施审批流程序号 1项目经理已确认，2销售经理已确认，3项目经理上级已确认 ，4销售经理上级已确认， 5项目经理上级已驳回，6销售经理上级已驳回,7 总经理已确认， 8 总经理已驳回
  auditTime: '', //申请时间
  beginTime: '',
  bidResultUrl: '', //投标分析结果地址
  bidUrl: '', //投标文件地址
  contractMoney: '', //合同金额
  contractNumber: '', //项目合同编号
  contractSignDate: '', //合同签订日期
  contractSignUnit: '', //合同签订单位
  createBy: '',
  createTime: '',
  endTime: '',
  gmAffirm: '', //总经理确认
  gmSignature: '', //总经理_签名
  gmSignatureDate: '', //总经理_签名日期
  implementDept: '', //实施部门
  itemNumber: '',
  lastUserUnit: '', //最终用户名称
  params: null,
  phase: '',
  PId: '',
  pmSignature: '', //项目经理_签名
  pmSignatureDate: '', //	项目经理_签名日期
  pmUpprincipalSignatureDate: '', //项目经理_分管负责人_签名日期
  predictAcceptDate: '', //预计验收日期
  predictPaymentDate: '', //预计回款日期
  projectAffiliation: '', //项目属性1直签、2转签
  projectContent: '', //项目内容及实施计划
  projectManager: '', //项目经理
  projectManagerName: '', //项目经理
  projectTeam: '', //项目组其它人员及职责
  projectTitle: '',
  projectType: '',
  projectTypeCompany: '', //项目类型A1常规项目、2灯塔项目、3流水项目、4补助项目
  projectTypeIndustry: '', //项目类型B1农业农村、2铁路交通、3军工、4其它
  projectTypeSales: '', //项目类型C1自有产品销售、2合作产品销售、3软件开发、4运行维护、5咨询设计、6技术服务、7系统集成
  remark: '',
  saleContractUrl: '', //销售合同地址
  salesManager: '', //销售经理
  salesManagerName: '', //销售经理
  searchValue: '',
  smSignature: '', //销售经理_签名
  smSignatureDate: '', //	销售经理_签名日期
  smUpprincipalSignature: '', //	销售经理_分管负责人_签名日期
  smUpprincipalSignatureDate: '', //	销售经理_分管负责人_签名日期
  status: '', //	状态 1立项转实施审批中，2实施中，3已验收，4已回款转售后, 5项目变更审批中,6已回款转售后审批中
  updateBy: '', //
  updateTime: '', //
  upprincipalAffirm: '', //分管负责人确认
  year: null,
  customerId: '',
  directCustomerName: '',
  directContacts: '',
  directPhone: '',
  finalCustomerName: '',
  finalContacts: '',
  finalPhone: ''
})
const validatorDuty = (rule: any, value: string, callback: Callback) => {
  notSpace(value, callback, '不能输入纯空格')
}
const boxRefs = ref<any>([])
// 创建多个ref实例
const setItemRef = (el: any) => {
  if (el) {
    boxRefs.value.push(el)
  }
}
// 下插入
const projectTeamPush = () => {
  if (detailsData.value.projectTeam.length < 10) {
    detailsData.value.projectTeam.push({
      name: '',
      duty: ''
    })
  } else {
    ElMessage.error('最多添加十条数据')
  }
}

// 删除成员及职责
const deleteProjectTeam = (index: any) => {
  if (detailsData.value.projectTeam.length === 1) {
    ElMessage.error('至少保留一条数据')
  } else {
    detailsData.value.projectTeam.splice(index, 1)
  }
}
// 项目组其他人员的选择
const handleChangeProjectTeam = (value: any, index: any) => {
  detailsData.value.projectTeam[index].name = value[1]
  otherOptions.value.forEach((item: any) => {
    if (item.deptName === value[0]) {
      if (item.children.length > 0) {
        item.children.forEach((item0: any) => {
          if (item0.deptName === value[1]) {
            detailsData.value.projectTeam[index].duty = item0.postStr ? item0.postStr : ''
          }
        })
      } else {
        detailsData.value.projectTeam[index].duty = ''
      }
    }
  })
}
const options = inject<any>('principalOtherTree')
const otherOptions = inject<any>('principalOtherTree')

const formRef = ref<any>()

const rules = reactive({
  projectTitle: [{ required: true, message: '请输入项目名称', trigger: 'blur' }],
  itemNumber: [{ required: true, message: '请输入项目编号', trigger: 'blur' }],
  projectAffiliation: [{ required: true, message: '请输入项目属性', trigger: 'blur' }],
  projectTypeCompany: [{ required: true, message: '请输入最终用户联系方式', trigger: 'blur' }],
  predictContractMoney: [{ required: true, message: '请选择项目类型', trigger: 'blur' }],
  projectTypeIndustry: [{ required: true, message: '请选择项目类型', trigger: 'blur' }],
  projectTypeSales: [{ required: true, message: '请选择项目类型', trigger: 'blur' }],
  lastUserUnit: [
    { required: true, message: '请输入最终用户名称', trigger: 'blur' },
    {
      min: 0,
      max: 100,
      message: '长度在0到100字符以内',
      trigger: 'blur'
    }
  ],
  contractSignUnit: [
    {
      // detailsData.projectAffiliation === 1 ? true : false,
      required: true,
      message: '请输入合同签订单位',
      trigger: 'blur'
    },
    {
      min: 0,
      max: 100,
      message: '长度在0到100字符以内',
      trigger: 'blur'
    }
  ],
  contractSignDate: [{ required: true, message: '请选择签约时间', trigger: 'change' }],
  contractNumber: [
    { required: true, message: '请输入项目编号', trigger: 'blur' },
    {
      min: 0,
      max: 200,
      message: '长度在0到200字符以内',
      trigger: 'blur'
    }
  ],
  predictAcceptDate: [{ required: true, message: '请选择预计验收日期', trigger: 'change' }],
  predictPaymentDate: [{ required: true, message: '请选择预计回款日期', trigger: 'change' }],

  contractMoney: [
    { required: true, message: '请输入合同金额（万元）', trigger: 'blur' },
    {
      pattern: /^[0-9]+(.[0-9]{6})/,
      message: '小数点保留后六位',
      trigger: 'blur'
    },
    ,
    {
      validator: (rule: any, value: string, callback: Callback) =>
        notSpace(value, callback, '不能输入纯空格'),
      trigger: 'blur'
    }
  ],
  projectManager: [{ required: true, message: '请选择项目经理', trigger: 'change' }],
  salesManager: [{ required: true, message: '请选择销售经理', trigger: 'change' }],
  projectTeam: [{ required: true, message: '请输入项目组其它人员及职责', trigger: 'blur' }],
  projectContent: [
    { required: true, message: '请输入项目内容及实施计划', trigger: 'blur' },
    {
      validator: (rule: any, value: string, callback: Callback) =>
        notSpace(value, callback, '不能输入纯空格'),
      trigger: 'blur'
    },
    {
      min: 0,
      max: 2000,
      message: '长度在0到500字符以内',
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
  ],
  projectType: [{ required: true, message: '该项为必选项', trigger: 'change' }],
  directCustomerName: [{ required: true, message: '该项为必选项', trigger: 'change' }],
  directContacts: [{ required: true, message: '该项为必选项', trigger: 'change' }],
  directPhone: [{ required: true, message: '该项为必选项', trigger: 'change' }],
  finalCustomerName: [{ required: true, message: '该项为必选项', trigger: 'change' }],
  finalContacts: [{ required: true, message: '该项为必选项', trigger: 'change' }],
  finalPhone: [{ required: true, message: '该项为必选项', trigger: 'change' }]
})
const handleChange = () => {}
const detailsFlag = ref<any>('')
//打开drawer并初始化
const openDrawer = (flag: string, id: number) => {
  //重置
  detailsFlag.value = flag //supplement 项目经理补充 salesSupplement 销售经理补充
  detailsId.value = id
  drawerWrapSub.value.isShow = true
  console.log(drawerWrapSub.value.isShow)
  if (id) {
    getDetailsData(id)
  }
}

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

//获取详情
const getDetailsData = async (ids: number) => {
  detailsId.value = ids
  let params = {
    id: ids
  }
  const res = await getEstablishApi(params)
  if (res && res.data) {
    console.log(res.data, '项目')

    detailsData.value = res.data
    if (detailsFlag.value !== 'supplement') {
      detailsData.value.projectTeam =
        res.data.projectTeam && res.data.projectTeam !== ''
          ? getFilterTeam(res.data.projectTeam)
          : [{ name: '', duty: '' }]
      detailsData.value.projectContent = detailsData.value.approval.projectContent
        ? detailsData.value.approval.projectContent
        : ''
      detailsData.value.predictPaymentDate = '' // 回款日期
    } else {
      detailsData.value.projectTeam = [{ name: '', duty: '' }]
      detailsData.value.projectContent = detailsData.value.approval.projectContent
        ? detailsData.value.approval.projectContent
        : ''
      detailsData.value.predictAcceptDate = ''
      detailsData.value.predictPaymentDate = ''
    }
    detailsData.value.projectTitle = detailsData.value.updateProjectTitle
      ? detailsData.value.updateProjectTitle
      : detailsData.value.projectTitle
    detailsData.value.projectType = detailsData.value.directCustomerId
      ? detailsData.value.projectTypeIndustry
        ? String(Number(detailsData.value.projectTypeIndustry) - 1)
        : detailsData.value.projectType
      : detailsData.value.projectType
  }
}

// 保存
const save = async () => {
  if (!formRef.value) return
  await formRef.value?.validate(async (valid: any, fields: any) => {
    if (valid) {
      loading.value = true
      let teamStr = ''
      // 拼接项目成员及职责
      if (detailsData.value.projectTeam.length > 0) {
        let strList: any = []
        detailsData.value.projectTeam.forEach((ele: any) => {
          strList.push(ele.name + '：' + ele.duty)
        })
        teamStr = strList.join(',')
      }
      let formData: any = null
      // 项目经理补充
      if (detailsFlag.value === 'supplement') {
        formData = {
          pid: detailsId.value,
          flag: '3', // 1 申请 2 审核 3 确认
          status: '1', // 1 同意 2 驳回
          predictAcceptDate: moment(detailsData.value.predictAcceptDate).format('YYYY-MM-DD'), // 预计验收日期
          projectTeam: teamStr // 预计验收日期
        }
      } else {
        // 销售经理补充
        formData = {
          pid: detailsId.value,
          flag: '3', // 1 申请 2 审核 3 确认
          status: '1', // 1 同意 2 驳回
          predictPaymentDate: moment(detailsData.value.predictPaymentDate).format('YYYY-MM-DD'), // 预计验收日期
          projectContent: detailsData.value.projectContent // 预计验收日期
        }
      }

      console.log('formData', formData)

      const res = await auditProjectApi(formData)
        .catch(() => {})
        .finally(() => {
          loading.value = false
        })
      // console.log(res)
      if (res) {
        ElMessage.success('信息保存成功')
        closeDrawer()
        emit('changeGetDetailAndList')
        // closeDialog()
        resetForm()
        // callbackDetail()
      }
    }
  })
}

// 重置表单
const resetForm = () => {
  if (!formRef.value) return
  formRef.value.resetFields()
  detailsData.value = unref({})
}
//关闭drawer
const closeDrawer = () => {
  drawerWrapSub.value.isShow = false
}

onBeforeUpdate(() => {
  boxRefs.value = []
})
defineExpose({
  isShow,
  openDrawer
})
</script>

<template>
  <DrawerWrap :title="pageTite" :isShow="isShow" ref="drawerWrapSub">
    <!-- <template #right>
      <ElButton type="primary" :loading="loading" @click="save"> 保存 </ElButton>
    </template> -->
    <template #content>
      <Segmentation title="项目信息" class="projectDebriefing">
        <template #content>
          <ElForm :model="detailsData" class="top-row-sub">
            <ElRow :gutter="16" style="text-align: center" justify="space-between">
              <ElCol :span="6">
                <el-form-item label="项目编号：">
                  {{ detailsData.itemNumber || '--' }}</el-form-item
                >
              </ElCol>
              <ElCol :span="6">
                <el-form-item label="项目名称：">
                  <p :title="detailsData.projectTitle" class="ellipsis-p-class">{{
                    detailsData.projectTitle || '--'
                  }}</p>
                </el-form-item>
              </ElCol>
              <ElCol :span="6">
                <el-form-item label="合同签订日期：">
                  <p class="ellipsis-p-class">{{
                    detailsData.contractSignDate
                      ? moment(detailsData.contractSignDate).format('YYYY-MM-DD')
                      : '--'
                  }}</p>
                </el-form-item>
              </ElCol>
              <ElCol :span="6">
                <el-form-item label="合同金额：">
                  <p class="ellipsis-p-class">{{
                    detailsData.contractMoney ? detailsData.contractMoney + '万元' : '--'
                  }}</p>
                </el-form-item>
              </ElCol>
              <ElCol :span="6">
                <el-form-item label="预计验收日期：">
                  <p class="ellipsis-p-class">{{
                    detailsData.predictAcceptDate
                      ? moment(detailsData.predictAcceptDate).format('YYYY-MM')
                      : '--'
                  }}</p></el-form-item
                >
              </ElCol>
              <ElCol :span="6">
                <el-form-item label="预计回款日期："
                  ><p class="ellipsis-p-class">{{
                    detailsData.predictPaymentDate
                      ? moment(detailsData.predictPaymentDate).format('YYYY-MM')
                      : '--'
                  }}</p></el-form-item
                >
              </ElCol>
              <ElCol :span="6">
                <el-form-item label="项目经理："
                  ><p class="ellipsis-p-class">{{
                    detailsData.projectManagerName ? detailsData.projectManagerName : '--'
                  }}</p></el-form-item
                >
              </ElCol>
              <ElCol :span="6">
                <el-form-item label="销售经理："
                  ><p class="ellipsis-p-class">{{
                    detailsData.salesManagerName ? detailsData.salesManagerName : '--'
                  }}</p></el-form-item
                >
              </ElCol>
              <ElCol :span="6">
                <el-form-item label="状态：">
                  <el-tag
                    class="mt-1"
                    :type="
                      detailsData.status === '0'
                        ? 'success'
                        : detailsData.status === '1'
                        ? 'primary'
                        : detailsData.status === '2'
                        ? 'success'
                        : detailsData.status === '3'
                        ? 'info'
                        : detailsData.status === '4' || detailsData.status === '6'
                        ? 'warning'
                        : detailsData.status === '5'
                        ? 'danger'
                        : 'danger'
                    "
                  >
                    <!-- 0培育审批中，1进展中，2结束转立项审批中，3结束转立项，4结束终止审批中，5结束终止 -->
                    {{
                      detailsData.status === '1'
                        ? '立项转实施审批中'
                        : detailsData.status === '2'
                        ? '实施中'
                        : detailsData.status === '3'
                        ? '已验收'
                        : detailsData.status === '4'
                        ? '已回款转售后'
                        : detailsData.status === '5'
                        ? '项目变更审批中'
                        : detailsData.status === '6'
                        ? '已回款转售后审批中'
                        : '--'
                    }}
                  </el-tag>
                </el-form-item>
              </ElCol>
            </ElRow>
          </ElForm>
        </template>
      </Segmentation>

      <Segmentation title="立项转实施" class="projectDebriefing">
        <template #content>
          <h3 class="project-title">项目实施确认表</h3>

          <el-form
            :model="detailsData"
            :rules="rules"
            ref="formRef"
            label-width="160px"
            class="demo-ruleForm"
          >
            <el-row>
              <el-col :span="24">
                <el-form-item label="项目名称" prop="projectTitle" class="w-full">
                  <el-Input disabled v-model="detailsData.projectTitle" />
                </el-form-item>
              </el-col>
            </el-row>

            <el-row>
              <el-col :span="12">
                <el-form-item label="项目编号" prop="itemNumber" class="w-full">
                  <el-Input disabled v-model="detailsData.itemNumber" />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="项目属性" prop="projectAffiliation" class="w-full">
                  <el-Radio-group v-model="detailsData.projectAffiliation" disabled>
                    <el-Radio label="1">直签</el-Radio>
                    <el-Radio label="2">转签</el-Radio>
                  </el-Radio-group>
                </el-form-item>
              </el-col>
            </el-row>

            <div v-if="!detailsData.directCustomerId">
              <el-row>
                <el-form-item label="项目类型" required class="w-full project-type">
                  <el-form-item prop="projectTypeCompany" label-width="0" class="w-full">
                    <el-Radio-group v-model="detailsData.projectTypeCompany" disabled>
                      <el-Radio label="1">常规项目</el-Radio>
                      <el-Radio label="2">灯塔项目</el-Radio>
                      <el-Radio label="3">流水项目</el-Radio>
                      <el-Radio label="4">补助项目</el-Radio>
                    </el-Radio-group>
                  </el-form-item>

                  <el-form-item prop="projectTypeIndustry" label-width="0" class="w-full">
                    <el-Radio-group v-model="detailsData.projectTypeIndustry" disabled>
                      <el-Radio label="1">农业农村</el-Radio>
                      <el-Radio label="2">铁路交通</el-Radio>
                      <el-Radio label="3">军工</el-Radio>
                      <el-Radio label="4">其他</el-Radio>
                    </el-Radio-group>
                  </el-form-item>
                  <el-form-item prop="projectTypeSales" label-width="0" class="w-full">
                    <el-Radio-group v-model="detailsData.projectTypeSales" disabled>
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
                <el-col :span="24">
                  <el-form-item label="最终用户名称" prop="lastUserUnit" class="w-full">
                    <el-Input maxlength="100" v-model="detailsData.lastUserUnit" disabled />
                  </el-form-item>
                </el-col>
              </el-row>

              <el-row>
                <el-col :span="24">
                  <el-form-item
                    v-if="detailsData.projectAffiliation === '2'"
                    label="合同签订单位"
                    prop="contractSignUnit"
                    class="w-full"
                  >
                    <el-Input :maxlength="100" v-model="detailsData.contractSignUnit" disabled />
                  </el-form-item>
                  <el-form-item v-else label="合同签订单位" class="w-full">
                    <el-Input
                      :maxlength="100"
                      placeholder="请输入"
                      v-model="detailsData.contractSignUnit"
                      disabled
                    />
                  </el-form-item>
                </el-col>
              </el-row>
            </div>

            <el-row v-if="detailsData.directCustomerId">
              <el-col :span="24">
                <el-form-item label="项目类型" prop="projectTypeCompany" class="w-full">
                  <el-Radio-group v-model="detailsData.projectTypeCompany" disabled>
                    <el-Radio
                      :label="item.value"
                      v-for="(item, index) in projectTypeA"
                      :key="index"
                      >{{ item.label }}</el-Radio
                    >
                  </el-Radio-group>
                </el-form-item>
              </el-col>
              <el-col :span="24">
                <el-form-item label="所属行业" prop="projectType" class="w-full">
                  <el-Radio-group v-model="detailsData.projectType" disabled>
                    <el-Radio
                      :label="item.value"
                      v-for="(item, index) in projectType"
                      :key="index"
                      >{{ item.label }}</el-Radio
                    >
                  </el-Radio-group>
                </el-form-item>
              </el-col>

              <el-col :span="24">
                <el-form-item label="业务分类" prop="projectTypeSales" class="w-full">
                  <el-Radio-group v-model="detailsData.projectTypeSales" disabled>
                    <el-Radio
                      :label="item.value"
                      v-for="(item, index) in projectTypeC"
                      :key="index"
                      >{{ item.label }}</el-Radio
                    >
                  </el-Radio-group>
                </el-form-item>
              </el-col>
              <el-col :span="24">
                <el-form-item label="直接客户" prop="directCustomerName" class="w-full">
                  <el-Input disabled v-model="detailsData.directCustomerName" /> </el-form-item
              ></el-col>
              <el-col :span="12">
                <el-form-item label="用户联系人" prop="directContacts" class="w-full">
                  <el-Input disabled v-model="detailsData.directContacts" />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="用户联系电话" prop="directPhone" class="w-full">
                  <el-Input disabled v-model="detailsData.directPhone" />
                </el-form-item>
              </el-col>
              <el-col :span="24" v-if="detailsData.projectAffiliation === '2'">
                <el-form-item label="最终用户" prop="finalCustomerName" class="w-full">
                  <el-Input disabled v-model="detailsData.finalCustomerName" /> </el-form-item
              ></el-col>
              <el-col :span="12" v-if="detailsData.projectAffiliation === '2'">
                <el-form-item label="最终用户联系人" prop="finalContacts" class="w-full">
                  <el-Input disabled v-model="detailsData.finalContacts" />
                </el-form-item>
              </el-col>
              <el-col :span="12" v-if="detailsData.projectAffiliation === '2'">
                <el-form-item label="最终用户联系电话" prop="finalPhone" class="w-full">
                  <el-Input disabled v-model="detailsData.finalPhone" />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item label="合同签订日期" prop="contractSignDate" class="w-full">
                  <el-date-picker
                    type="date"
                    placeholder="选择日期"
                    v-model="detailsData.contractSignDate"
                    disabled
                  />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="项目合同编号" prop="contractNumber" class="w-full">
                  <el-Input maxlength="200" v-model="detailsData.contractNumber" disabled />
                </el-form-item>
              </el-col>
            </el-row>

            <el-row>
              <el-col :span="12">
                <el-form-item label="预计验收日期" prop="predictAcceptDate" class="w-full">
                  <el-date-picker
                    type="date"
                    placeholder="选择日期"
                    :disabled="detailsFlag === 'salesSupplement'"
                    v-model="detailsData.predictAcceptDate"
                  />
                  <!-- :disabled="" -->
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item
                  v-if="detailsFlag !== 'supplement'"
                  label="预计回款日期"
                  prop="predictPaymentDate"
                  class="w-full"
                >
                  <el-date-picker
                    type="date"
                    :disabled="detailsFlag === 'supplement'"
                    placeholder="选择日期"
                    v-model="detailsData.predictPaymentDate"
                  />
                  <!-- :disabled="" -->
                </el-form-item>
                <el-form-item v-else label="预计回款日期" class="w-full">
                  <el-date-picker
                    type="date"
                    :disabled="detailsFlag === 'supplement'"
                    placeholder="选择日期"
                    v-model="detailsData.predictPaymentDate"
                  />
                  <!-- :disabled="" -->
                </el-form-item>
              </el-col>
            </el-row>

            <el-row>
              <el-col :span="24">
                <el-form-item label="合同金额（万元）" class="w-full" prop="contractMoney">
                  <el-Input placeholder="请输入" v-model="detailsData.contractMoney" disabled />
                </el-form-item>
              </el-col>
            </el-row>

            <el-row>
              <el-col :span="12">
                <el-form-item label="项目经理" prop="projectManager" class="w-full">
                  <el-cascader
                    v-model="detailsData.projectManager"
                    style="width: 100%"
                    :filterable="true"
                    :props="{ label: 'deptName', value: 'deptId' }"
                    :controlsPosition="'right'"
                    placeholder="请选择"
                    :options="options"
                    @change="handleChange"
                    disabled
                  />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="销售经理" prop="salesManager" class="w-full">
                  <el-cascader
                    v-model="detailsData.salesManager"
                    style="width: 100%"
                    :filterable="true"
                    disabled
                    placeholder="请选择"
                    :props="{ label: 'deptName', value: 'deptId' }"
                    :controlsPosition="'right'"
                    :options="options"
                    @change="handleChange"
                  />
                </el-form-item>
              </el-col>
            </el-row>

            <el-row>
              <el-form-item required label="项目组其他成员及职责" class="w-full">
                <el-col
                  :span="24"
                  v-for="(item, index) in detailsData.projectTeam"
                  :key="index"
                  class="team-wrap"
                >
                  <el-form-item
                    style="width: 35%; margin-right: 0px !important"
                    :prop="`projectTeam[${index}].name`"
                    :rules="[{ required: true, message: '请选择成员', trigger: 'change' }]"
                  >
                    <ElCascader
                      :ref="setItemRef"
                      style="width: 90%"
                      v-model="detailsData.projectTeam[index].name"
                      :filterable="true"
                      placeholder="请选择"
                      :validateEvent="true"
                      :disabled="detailsFlag === 'salesSupplement' ? true : false"
                      :props="{ label: 'deptName', value: 'deptName' }"
                      :controlsPosition="'right'"
                      :options="otherOptions"
                      @change="(val) => handleChangeProjectTeam(val, index)"
                    />
                  </el-form-item>
                  <el-form-item
                    style="width: 40%"
                    :prop="`projectTeam[${index}].duty`"
                    :rules="[
                      { required: true, message: '该项为必填项', trigger: 'blur' },
                      {
                        validator: validatorDuty,
                        trigger: 'blur'
                      }
                    ]"
                  >
                    <el-Input
                      maxlength="200"
                      :disabled="detailsFlag === 'salesSupplement' ? true : false"
                      type="textarea"
                      placeholder="请输入"
                      autosize
                      v-model="detailsData.projectTeam[index].duty"
                    />
                  </el-form-item>
                  <el-button
                    v-if="detailsFlag === 'supplement'"
                    type="success"
                    @click="deleteProjectTeam(index)"
                    >删除</el-button
                  >
                  <el-button
                    v-if="index === 0 && detailsFlag === 'supplement'"
                    type="primary"
                    @click="projectTeamPush"
                    >下插入</el-button
                  >
                </el-col>
              </el-form-item>
            </el-row>

            <el-row>
              <el-col :span="24">
                <el-form-item
                  v-if="detailsFlag !== 'supplement'"
                  label="项目内容及实施计划"
                  prop="projectContent"
                  class="w-full"
                >
                  <el-Input
                    maxlength="2000"
                    :disabled="detailsFlag === 'supplement' ? true : false"
                    type="textarea"
                    autosize
                    placeholder="请输入"
                    v-model="detailsData.projectContent"
                  />
                  <!-- :disabled="" -->
                </el-form-item>
                <el-form-item v-else label="项目内容及实施计划" class="w-full">
                  <el-Input
                    maxlength="2000"
                    :disabled="detailsFlag === 'supplement' ? true : false"
                    type="textarea"
                    autosize
                    placeholder="请输入"
                    v-model="detailsData.projectContent"
                  />
                  <!-- :disabled="" -->
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item label="实施部门" prop="implementDept" class="w-full">
                  <el-cascader
                    v-model="detailsData.implementDept"
                    style="width: 100%"
                    :filterable="true"
                    :disabled="true"
                    :props="{ label: 'deptName', value: 'deptId' }"
                    :controlsPosition="'right'"
                    :options="deptDataList"
                  />
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
          <el-row class="text-xs"
            >说明：1.预计验收日期需调整应由项目经理发起，销售经理、分管负责人及总经理确认；</el-row
          >
          <el-row class="text-xs"
            >&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;2.预计回款日期需调整应由销售经理发起，分管负责人及总经理确认；
          </el-row>
          <el-row class="text-xs"
            >&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;3.本文件为保密件。原件留存财务部，复印件留存项目部门。</el-row
          >

          <div class="flex justify-center items-center mt-26px pb-20px">
            <el-button :loading="loading" class="project-btn-sure" @click="save"> 提交</el-button>
            <el-button class="project-btn-cancel" @click="closeDrawer"> 取消</el-button>
          </div>
        </template>
      </Segmentation>
    </template>
  </DrawerWrap>
</template>
<style lang="less">
.name-p {
  font-family: 'Alibaba PuHuiTi R';
  color: #888888;
  font-size: 15px;
}
.name-p mr-2 {
  color: #888888;
  font-size: 15px;
}
.sub-title {
  font-family: 'Alibaba PuHuiTi R';
  font-size: 15px;
  color: #000000;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 3;
  overflow: hidden;
}
.top-row-sub {
  // border-bottom: 1px solid rgba(217, 221, 231, 0.8);
  margin-left: 25px !important;
  margin-right: 25px !important;
  padding: 0px !important;

  p {
    font-size: 14px !important;
    line-height: 32px;
  }
}

.project-type .el-form-item__label {
  margin-top: 3vh;
}
</style>
<style lang="less" scoped>
.team-wrap {
  display: flex;
  margin-bottom: 15px;
}
.project-title {
  text-align: center;
  font-size: 17px;
  line-height: 40px;
}
.ellipsis-p-class {
  width: 100%;
  text-align: left;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
}
</style>
