<!-- 请假申请 -->
<script setup lang="ts">
import './urgency.less'
import { ref, reactive, getCurrentInstance, unref, watch } from 'vue'
import { getAllTinfoGoodsList } from '@/api/AdministrativeService/inventoryManagement'
import { propTypes } from '@/utils/propTypes'
import { OrderStep } from '../Step'
import { useValidator } from '@/hooks/web/useValidator'
import { useEmitt } from '@/hooks/web/useEmitt'
import { getOrderDetailApi, auditOrderApi, archiveOrderApi, buyApi } from '@/api/order'

import { addForm } from '../components'
import moment from 'moment'
import {
  ElMessage,
  ElForm,
  ElFormItem,
  ElRow,
  ElCol,
  ElDatePicker,
  ElSelect,
  ElOption,
  ElInput
} from 'element-plus'
import { Dialog } from '@/components/Dialog'

const { emitter } = useEmitt()
const { proxy } = getCurrentInstance() as any
const { goods_type } = proxy.useDict('goods_type')
const goods_name = ref<any>([])

const goodList = ref<any>()

const getUserLabel = (value: string, arr): string => {
  let label = '--'
  unref(arr).map((item: any) => {
    if (value == item.value) {
      label = item.label
    }
  })
  return label
}

const getGoodNameLabel = (value: string): string => {
  let label = '--'
  unref(goodList).map((item: any) => {
    if (value == item.id) {
      label = item.goodsName
    }
  })
  return label
}

// 弹窗的开启和关闭
const dialogFlag = ref<Boolean>(false)
type Callback = (error?: string | Error | undefined) => void

const { required, validateEnglishAndNumber, notSpace, validateNumSearch, validateNotNum } =
  useValidator()

const props = defineProps({
  title: propTypes.string.def('')
})

const pageFlag = ref<string>('add') // see 查看 edit 编辑 add 新增
//表单
const formRef = ref<any>()
//保存等待
const loading = ref(false)
const detailsId = ref<string>('')
const flowDatas = ref<any[]>()
const rejectLoading = ref(false)
const passLoading = ref(false)
const dialogTitle = ref<string>('')

//表单验证规则
const rules = reactive({
  urgency: [{ required: true, message: '请选择紧急程度', trigger: 'change' }],
  orderExpain: [
    {
      validator: (rule: any, value: string, callback: Callback) =>
        notSpace(value, callback, '不能输入纯空格'),
      trigger: 'blur'
    }
  ]
})

//弹窗
const elDialogFef = ref()
//打开drawer并初始化
const openDrawer = (id: string, flag: string) => {
  dialogFlag.value = true
  pageFlag.value = flag
  haveTableData.value = []
  notTableData.value = []
  goodlistFun()
  dialogTitle.value = flag === 'approve' ? '审核' : flag === 'archive' ? '归档' : '详情'
  elDialogFef.value.isFullscreen = false
  if (id) {
    detailsId.value = id
    getDetailsData()
  }
}

const goodlistFun = async () => {
  let res = await getAllTinfoGoodsList()
  if (res && res.data) {
    goodList.value = res.data
  }
}

//查询详情
const getDetailsData = async () => {
  if (detailsId.value) {
    const res = await getOrderDetailApi(detailsId.value)
    if (res && res.data) {
      let data = res.data
      ruleForm.value.flag = data.flag
      ruleForm.value.type = data.type
      ruleForm.value.urgency = String(data.urgency)
      ruleForm.value.remark = data.workorderBuy.remark
      ruleForm.value.applyDate = data.workorderBuy.applyDate
      if (data.workorderBuy.goods.length) {
        // 库里有的
        let haveArr = data.workorderBuy.goods.filter((v) => {
          if (!isNaN(v.goodName)) {
            return true
          } else {
            return false
          }
        })

        haveTableData.value = haveArr.map((v) => {
          return {
            haveGoodName: v.goodName,
            haveGoodType: v.goodType,
            haveGoodNum: v.goodNum,
            haveGoodPrice: v.goodPrice,
            haveGoodAllPrice: Number(v.goodNum) * Number(v.goodPrice)
          }
        })

        // 未入库的
        let notArr = data.workorderBuy.goods.filter((v) => {
          if (isNaN(v.goodName)) {
            return true
          } else {
            return false
          }
        })

        notTableData.value = notArr.map((v) => {
          return {
            notGoodName: v.goodName,
            notGoodType: v.goodType,
            notGoodNum: v.goodNum,
            notGoodPrice: v.goodPrice,
            notGoodAllPrice: Number(v.goodNum) * Number(v.goodPrice)
          }
        })

        ruleForm.value.estimatedAmount = allpreFun()
        flowDatas.value = data.audits

        if (data.workorderBuy.status == '2' || data.workorderBuy.status == '4') {
          let arr = [
            {
              roleName: data.leaderRoleName,
              createByName: data.leaderName,
              orderStep: '待审核'
            },
            {
              roleName: '财务部经理',
              createByName: '赵桂婷',
              orderStep: '待审核'
            },
            {
              roleName: '董事长',
              createByName: '张保国',
              orderStep: '待审核'
            },
            {
              roleName: '申请人',
              createByName: data.createByName,
              orderStep: '待采购'
            },
            {
              roleName: '人力资源部经理',
              createByName: '高敬',
              orderStep: '待归档'
            }
          ]
          flowDatas.value = [...flowDatas.value, ...arr]
        } else if (data.workorderBuy.status == '3') {
          let arr = [
            {
              roleName: '财务部经理',
              createByName: '赵桂婷',
              orderStep: '待审核'
            },
            {
              roleName: '董事长',
              createByName: '张保国',
              orderStep: '待审核'
            },
            {
              roleName: '申请人',
              createByName: data.createByName,
              orderStep: '待采购'
            },
            {
              roleName: '人力资源部经理',
              createByName: '高敬',
              orderStep: '待归档'
            }
          ]
          flowDatas.value = [...flowDatas.value, ...arr]
        } else if (
          data.workorderBuy.status == '6' ||
          data.workorderBuy.status == '12' ||
          data.workorderBuy.status == '8'
        ) {
          let arr: any = []
          if (data.workorderBuy.status == '12') {
            arr.push({
              roleName: '申请人',
              createByName: data.createByName,
              orderStep: '待采购'
            })
          }
          arr.push({
            roleName: '人力资源部经理',
            createByName: '高敬',
            orderStep: '待归档'
          })

          flowDatas.value = [...flowDatas.value, ...arr]
        } else if (data.workorderBuy.status == '11') {
          let arr = [
            {
              roleName: '董事长',
              createByName: '张保国',
              orderStep: '待审核'
            },
            {
              roleName: '申请人',
              createByName: data.createByName,
              orderStep: '待采购'
            },
            {
              roleName: '人力资源部经理',
              createByName: '高敬',
              orderStep: '待归档'
            }
          ]
          flowDatas.value = [...flowDatas.value, ...arr]
        }
      }
    }
  }
}

//清空表单
const resetForm = () => {
  ruleForm.value = {
    flag: '',
    type: 8,
    estimatedAmount: 0,
    orderExpain: '',
    urgency: '1',
    remark: '',
    applyDate: '',
    haveGoodName: '',
    haveGoodType: '',
    haveGoodNum: '',
    haveGoodPrice: '',
    haveGoodAllPrice: '',

    notGoodName: '',
    notGoodType: '',
    notGoodNum: '',
    notGoodPrice: '',
    notGoodAllPrice: ''
  }
}

//关闭
const closeDialog = () => {
  dialogFlag.value = false
}

//关闭后清空
const resetFormAfterClose = () => {
  dialogFlag.value = false
  if (elDialogFef.value) {
    elDialogFef.value.isFullscreen = false
  }
  resetForm()
}

//表单数据
const ruleForm = ref<any>({
  flag: '',
  type: 8,
  urgency: '1',
  estimatedAmount: 0,
  orderExpain: '',
  remark: '',
  applyDate: '',
  haveGoodName: '',
  haveGoodType: '',
  haveGoodNum: '',
  haveGoodPrice: '',
  haveGoodAllPrice: '',
  notGoodName: '',
  notGoodType: '',
  notGoodNum: '',
  notGoodPrice: '',
  notGoodAllPrice: ''
})
//表单验证规则
const haveRules = reactive({
  haveGoodType: [{ required: true, message: '请选择物品类型', trigger: 'change' }],
  haveGoodName: [{ required: true, message: '请选择物品名称', trigger: 'change' }],
  haveGoodNum: [
    { required: true, message: '请输入物品数量', trigger: 'blur' },
    {
      validator: (rule: any, value: string, callback: Callback) =>
        validateNumSearch(value, callback, '仅支持数字'),
      trigger: 'blur'
    }
  ],
  haveGoodPrice: [
    { required: true, message: '请输入物品单价', trigger: 'blur' },
    {
      validator: (rule: any, value: string, callback: Callback) =>
        validateNumSearch(value, callback, '仅支持数字'),
      trigger: 'blur'
    }
  ],
  haveGoodAllPrice: [
    { required: true, message: '请输入物品总价', trigger: 'blur' },
    {
      validator: (rule: any, value: string, callback: Callback) =>
        validateNumSearch(value, callback, '仅支持数字'),
      trigger: 'blur'
    }
  ]
})
const notRules = reactive({
  notGoodType: [{ required: true, message: '请选择物品类型', trigger: 'change' }],
  notGoodName: [
    { required: true, message: '请输入物品名称', trigger: 'blur' },
    {
      validator: (rule: any, value: string, callback: Callback) =>
        validateNotNum(value, callback, '仅支持非纯数字'),
      trigger: 'blur'
    }
  ],
  notGoodNum: [
    { required: true, message: '请输入物品数量', trigger: 'blur' },
    {
      validator: (rule: any, value: string, callback: Callback) =>
        validateNumSearch(value, callback, '仅支持数字'),
      trigger: 'blur'
    }
  ],
  notGoodPrice: [
    { required: true, message: '请输入物品单价', trigger: 'blur' },
    {
      validator: (rule: any, value: string, callback: Callback) =>
        validateNumSearch(value, callback, '仅支持数字'),
      trigger: 'blur'
    }
  ],
  notGoodAllPrice: [
    { required: true, message: '请输入物品总价', trigger: 'blur' },
    {
      validator: (rule: any, value: string, callback: Callback) =>
        validateNumSearch(value, callback, '仅支持数字'),
      trigger: 'blur'
    }
  ]
})

// 已有表格
const haveFormRef = ref<any>()
const haveTableData = ref<any>([])
const haveAddFormRef = ref<any>()

// 未入库表格
const notFormRef = ref<any>()
const notTableData = ref<any>([])
const notAddFormRef = ref<any>()

// 已有表格操作
let editCount = ''
// 编辑
const addFormEdit = (index) => {
  editCount = index
  haveFormRef.value.openForm(true)
  ruleForm.value.haveGoodType = haveTableData.value[index].haveGoodType
  ruleForm.value.haveGoodNum = haveTableData.value[index].haveGoodNum
  ruleForm.value.haveGoodName = haveTableData.value[index].haveGoodName
  ruleForm.value.haveGoodPrice = haveTableData.value[index].haveGoodPrice
  ruleForm.value.haveGoodAllPrice = haveTableData.value[index].haveGoodAllPrice
}
// 删除
const addFormDel = (index) => {
  haveTableData.value.splice(index, 1)
  haveFormRef.value.openForm(false)
  ruleForm.value.estimatedAmount = allpreFun()
  editCount = ''
  clearFormRow()
}
// 入库保存
const addFormSub = async () => {
  //表单验证
  if (!haveAddFormRef.value) return
  await haveAddFormRef.value?.validate(async (isValid) => {
    if (isValid) {
      haveFormRef.value.openForm(false)
      if (editCount || editCount === 0) {
        haveTableData.value[editCount].haveGoodType = ruleForm.value.haveGoodType
        haveTableData.value[editCount].haveGoodNum = ruleForm.value.haveGoodNum
        haveTableData.value[editCount].haveGoodName = ruleForm.value.haveGoodName
        haveTableData.value[editCount].haveGoodPrice = ruleForm.value.haveGoodPrice
        haveTableData.value[editCount].haveGoodAllPrice = ruleForm.value.haveGoodAllPrice
      } else {
        haveTableData.value.push({
          haveGoodType: ruleForm.value.haveGoodType,
          haveGoodNum: ruleForm.value.haveGoodNum,
          haveGoodName: ruleForm.value.haveGoodName,
          haveGoodPrice: ruleForm.value.haveGoodPrice,
          haveGoodAllPrice: ruleForm.value.haveGoodAllPrice
        })
      }
      ruleForm.value.estimatedAmount = allpreFun()
      editCount = ''
      clearFormRow()
    }
  })
}

const allpreFun = () => {
  let allprice = 0
  if (haveTableData.value.length) {
    haveTableData.value.forEach((v) => {
      allprice += Number(v.haveGoodAllPrice)
    })
  }
  if (notTableData.value.length) {
    notTableData.value.forEach((v) => {
      allprice += Number(v.notGoodAllPrice)
    })
  }
  return allprice
}
// 清空表格表单数据
const clearFormRow = () => {
  ruleForm.value.haveGoodType = ''
  ruleForm.value.haveGoodNum = ''
  ruleForm.value.haveGoodName = ''
  ruleForm.value.haveGoodPrice = ''
  ruleForm.value.haveGoodAllPrice = ''
}

// 入库总价
const haveChange = () => {
  if (ruleForm.value.haveGoodNum && ruleForm.value.haveGoodPrice) {
    if (!isNaN(ruleForm.value.haveGoodNum) && !isNaN(ruleForm.value.haveGoodPrice)) {
      ruleForm.value.haveGoodAllPrice =
        Number(ruleForm.value.haveGoodNum) * Number(ruleForm.value.haveGoodPrice)
    } else {
      ruleForm.value.haveGoodAllPrice = ''
    }
  }
}

// 未入库表格操作
let notReceivedCount = ''
// 编辑
const notReceivedFormEdit = (index) => {
  notReceivedCount = index
  notFormRef.value.openForm(true)
  ruleForm.value.notGoodType = notTableData.value[index].notGoodType
  ruleForm.value.notGoodNum = notTableData.value[index].notGoodNum
  ruleForm.value.notGoodName = notTableData.value[index].notGoodName
  ruleForm.value.notGoodPrice = notTableData.value[index].notGoodPrice
  ruleForm.value.notGoodAllPrice = notTableData.value[index].notGoodAllPrice
}
// 删除
const notReceivedFormDel = (index) => {
  notTableData.value.splice(index, 1)
  notFormRef.value.openForm(false)
  ruleForm.value.estimatedAmount = allpreFun()
  notReceivedCount = ''
  clearFormRow()
}
// 未入库保存
const notReceivedFormSub = async () => {
  //表单验证
  if (!notAddFormRef.value) return
  await notAddFormRef.value?.validate(async (isValid) => {
    if (isValid) {
      notFormRef.value.openForm(false)
      if (notReceivedCount || notReceivedCount === 0) {
        notTableData.value[notReceivedCount].notGoodType = ruleForm.value.notGoodType
        notTableData.value[notReceivedCount].notGoodNum = ruleForm.value.notGoodNum
        notTableData.value[notReceivedCount].notGoodName = ruleForm.value.notGoodName
        notTableData.value[notReceivedCount].notGoodPrice = ruleForm.value.notGoodPrice
        notTableData.value[notReceivedCount].notGoodAllPrice = ruleForm.value.notGoodAllPrice
      } else {
        notTableData.value.push({
          notGoodType: ruleForm.value.notGoodType,
          notGoodNum: ruleForm.value.notGoodNum,
          notGoodName: ruleForm.value.notGoodName,
          notGoodPrice: ruleForm.value.notGoodPrice,
          notGoodAllPrice: ruleForm.value.notGoodAllPrice
        })
      }
      ruleForm.value.estimatedAmount = allpreFun()
      notReceivedCount = ''
      notReceivedClearFormRow()
    }
  })
}
// notReceived清空表格表单数据
const notReceivedClearFormRow = () => {
  ruleForm.value.notGoodType = ''
  ruleForm.value.notGoodNum = ''
  ruleForm.value.notGoodName = ''
  ruleForm.value.notGoodPrice = ''
  ruleForm.value.notGoodAllPrice = ''
}

// 未入库总价
const notChange = () => {
  if (ruleForm.value.notGoodNum && ruleForm.value.notGoodPrice) {
    if (!isNaN(ruleForm.value.notGoodNum) && !isNaN(ruleForm.value.notGoodPrice)) {
      ruleForm.value.notGoodAllPrice =
        Number(ruleForm.value.notGoodNum) * Number(ruleForm.value.notGoodPrice)
    } else {
      ruleForm.value.notGoodAllPrice = ''
    }
  }
}

//保存数据
const pass = async () => {
  //表单验证
  if (!formRef.value) return
  await formRef.value?.validate(async (isValid: boolean) => {
    if (isValid) {
      passLoading.value = true
      let data = ruleForm.value
      if (pageFlag.value === 'approve') {
        approveApply(data, '已通过')
      } else if (pageFlag.value === 'archive') {
        archiveOrder(data, '已归档')
      }
    }
  })
}
//保存数据
const reject = async () => {
  //表单验证
  if (!ruleForm.value.orderExpain) {
    ElMessage.error('请输入审核意见')
    return
  }
  if (!formRef.value) return
  await formRef.value?.validate(async (isValid: boolean) => {
    if (isValid) {
      rejectLoading.value = true
      let data = ruleForm.value
      if (pageFlag.value === 'approve') {
        approveApply(data, '已驳回')
      } else if (pageFlag.value === 'archive') {
        archiveOrder(data, '已驳回')
      }
    }
  })
}

//请假申请
const approveApply = async (data: any, flag: string) => {
  let params = {
    orderExpain: data.orderExpain,
    orderId: detailsId.value,
    orderStep: flag
  }
  const res = await auditOrderApi(params)
    .catch(() => {})
    .finally(() => {
      setTimeout(() => {
        rejectLoading.value = false
        passLoading.value = false
      }, 200)
    })
  if (res) {
    if (flag === '已驳回') {
      ElMessage.success('驳回成功')
    } else {
      ElMessage.success('保存信息成功')
    }
    //通知列表刷新
    emitter.emit('order', 'refresh')
    closeDialog()
  }
}
const archiveOrder = async (data: any, flag: string) => {
  let params = {
    orderExpain: data.orderExpain,
    orderId: detailsId.value,
    orderStep: flag
  }
  const res = await archiveOrderApi(params)
    .catch(() => {})
    .finally(() => {
      setTimeout(() => {
        rejectLoading.value = false
        passLoading.value = false
      }, 200)
    })
  if (res) {
    if (flag === '已驳回') {
      ElMessage.success('驳回成功')
    } else {
      ElMessage.success('保存信息成功')
    }
    //通知列表刷新
    emitter.emit('order', 'refresh')
    closeDialog()
  }
}

defineExpose({
  openDrawer
})
</script>

<template>
  <Dialog
    ref="elDialogFef"
    width="68%"
    class="cultivate-custom"
    v-model="dialogFlag"
    :title="dialogTitle"
    @closed="resetFormAfterClose"
  >
    <el-form
      :model="ruleForm"
      :rules="rules"
      ref="formRef"
      label-position="top"
      label-width="100px"
      class="demo-ruleForm"
    >
      <div class="flex items-start justify-start">
        <el-row class="w-[60%]">
          <!-- 已有物品类型需求 -->
          <el-col :span="24" class="mb-20px">
            <addForm title="已有物品类型需求" ref="haveFormRef" :disabled="false">
              <template #table>
                <el-table
                  v-if="haveTableData.length"
                  class="article-addform-table goods-table"
                  :data="haveTableData"
                  maxHeight="190"
                >
                  <el-table-column prop="haveGoodType" label="物品类型">
                    <template #default="scope">
                      <p class="flex justify-center items-center">
                        <span
                          :title="
                            scope.row.haveGoodType
                              ? getUserLabel(scope.row.haveGoodType, goods_type)
                              : '--'
                          "
                          class="truncate text-[#0094D8] rounded px-2 h-26px bg-[rgba(0,160,233,.1)] block"
                          >{{
                            scope.row.haveGoodType
                              ? getUserLabel(scope.row.haveGoodType, goods_type)
                              : '--'
                          }}</span
                        >
                      </p>
                    </template>
                  </el-table-column>
                  <el-table-column prop="haveGoodName" label="物品名称">
                    <template #default="scope">
                      <span>{{
                        scope.row.haveGoodName ? getGoodNameLabel(scope.row.haveGoodName) : '--'
                      }}</span>
                    </template>
                  </el-table-column>
                  <el-table-column prop="haveGoodPrice" label="物品单价（元）"
                    ><template #default="scope">
                      <span>{{
                        scope.row.haveGoodPrice ? scope.row.haveGoodPrice + '￥' : '--'
                      }}</span>
                    </template>
                  </el-table-column>
                  <el-table-column prop="haveGoodNum" label="物品数量（个）" />
                  <el-table-column prop="haveGoodAllPrice" label="物品总价（元）"
                    ><template #default="scope">
                      <span>{{
                        scope.row.haveGoodAllPrice ? scope.row.haveGoodAllPrice + '￥' : '--'
                      }}</span>
                    </template>
                  </el-table-column>
                  <el-table-column label="操作" prop="action" v-if="false">
                    <template #default="scope">
                      <ElButton class="btn-default" :text="true" @click="addFormEdit(scope.$index)">
                        编辑
                      </ElButton>
                      <ElButton class="btn-default" :text="true" @click="addFormDel(scope.$index)">
                        删除
                      </ElButton>
                    </template>
                  </el-table-column>
                </el-table>
              </template>
              <template #content>
                <el-form
                  :model="ruleForm"
                  :rules="haveRules"
                  ref="haveAddFormRef"
                  label-position="top"
                  label-width="100px"
                  class="demo-ruleForm"
                >
                  <el-col :span="24">
                    <el-form-item label="物品类型" prop="haveGoodType">
                      <el-select
                        fit-input-width
                        filterable
                        v-model="ruleForm.haveGoodType"
                        class="w-full"
                        placeholder="请选择物品类型"
                      >
                        <el-option
                          v-for="item in goods_type"
                          :key="item.value"
                          :label="item.label"
                          :value="item.value"
                        />
                      </el-select>
                    </el-form-item>
                  </el-col>
                  <el-col :span="24">
                    <el-form-item label="物品名称" prop="haveGoodName">
                      <el-select
                        fit-input-width
                        filterable
                        v-model="ruleForm.haveGoodName"
                        class="w-full"
                        placeholder="请选择物品名称"
                      >
                        <el-option
                          v-for="item in goods_name"
                          :key="item.id"
                          :label="item.goodsName"
                          :value="item.id"
                        />
                      </el-select>
                    </el-form-item>
                  </el-col>
                  <el-col :span="24">
                    <el-form-item label="物品单价（元）" prop="haveGoodPrice">
                      <el-input
                        type="text"
                        @input="haveChange"
                        maxlength="20"
                        v-model="ruleForm.haveGoodPrice"
                        placeholder="请输入物品单价"
                      />
                    </el-form-item>
                  </el-col>
                  <el-col :span="24">
                    <el-form-item label="物品数量（个）" prop="haveGoodNum">
                      <el-input
                        type="text"
                        @input="haveChange"
                        maxlength="20"
                        v-model="ruleForm.haveGoodNum"
                        placeholder="请输入物品数量"
                      />
                    </el-form-item>
                  </el-col>
                  <el-col :span="24" class="pb-16px">
                    <el-form-item label="物品总价（元）" prop="haveGoodAllPrice">
                      <el-input
                        type="text"
                        maxlength="50"
                        v-model="ruleForm.haveGoodAllPrice"
                        placeholder="请输入物品总价"
                      />
                    </el-form-item>
                  </el-col>
                  <div
                    class="addform-sub h-40px border-1 border-[#99D9F6] bg-[#F5FBFE] flex items-center justify-center text-[#00A0E9] cursor-pointer my-2"
                    @click="addFormSub"
                  >
                    点击保存
                  </div>
                </el-form>
              </template>
            </addForm>
          </el-col>

          <el-col :span="24" class="mb-14px">
            <addForm title="未入库物品类型需求" ref="notFormRef" :disabled="false">
              <template #table>
                <el-table
                  v-if="notTableData.length"
                  class="article-addform-table goods-table"
                  :data="notTableData"
                  maxHeight="190"
                >
                  <el-table-column prop="notGoodType" label="物品类型">
                    <template #default="scope">
                      <p class="flex justify-center items-center">
                        <span
                          :title="
                            scope.row.notGoodType
                              ? getUserLabel(scope.row.notGoodType, goods_type)
                              : '--'
                          "
                          class="truncate text-[#0094D8] rounded px-2 h-26px bg-[rgba(0,160,233,.1)] block"
                          >{{
                            scope.row.notGoodType
                              ? getUserLabel(scope.row.notGoodType, goods_type)
                              : '--'
                          }}</span
                        >
                      </p>
                    </template>
                  </el-table-column>
                  <el-table-column prop="notGoodName" label="物品名称">
                    <template #default="scope">
                      <span>{{ scope.row.notGoodName ? scope.row.notGoodName : '--' }}</span>
                    </template>
                  </el-table-column>
                  <el-table-column prop="notGoodPrice" label="物品单价（元）"
                    ><template #default="scope">
                      <span>{{
                        scope.row.notGoodPrice ? scope.row.notGoodPrice + '￥' : '--'
                      }}</span>
                    </template>
                  </el-table-column>
                  <el-table-column prop="notGoodNum" label="物品数量（个）" />
                  <el-table-column prop="notGoodAllPrice" label="物品总价（元）"
                    ><template #default="scope">
                      <span>{{
                        scope.row.notGoodAllPrice ? scope.row.notGoodAllPrice + '￥' : '--'
                      }}</span>
                    </template>
                  </el-table-column>
                  <el-table-column label="操作" prop="action" v-if="false">
                    <template #default="scope">
                      <ElButton
                        class="btn-default"
                        :text="true"
                        @click="notReceivedFormEdit(scope.$index)"
                      >
                        编辑
                      </ElButton>
                      <ElButton
                        class="btn-default"
                        :text="true"
                        @click="notReceivedFormDel(scope.$index)"
                      >
                        删除
                      </ElButton>
                    </template>
                  </el-table-column>
                </el-table>
              </template>
              <template #content>
                <el-form
                  :model="ruleForm"
                  fit-input-width
                  :rules="notRules"
                  ref="notAddFormRef"
                  label-position="top"
                  label-width="100px"
                  class="demo-ruleForm"
                >
                  <el-col :span="24">
                    <el-form-item label="物品类型" prop="notGoodType">
                      <el-select
                        filterable
                        v-model="ruleForm.notGoodType"
                        class="w-full"
                        placeholder="请选择物品类型"
                      >
                        <el-option
                          v-for="item in goods_name"
                          :key="item.value"
                          :label="item.label"
                          :value="item.value"
                        />
                      </el-select>
                    </el-form-item>
                  </el-col>
                  <el-col :span="24">
                    <el-form-item label="物品名称" prop="notGoodName">
                      <el-input
                        type="text"
                        maxlength="50"
                        v-model="ruleForm.notGoodName"
                        placeholder="请输入物品名称"
                      />
                    </el-form-item>
                  </el-col>
                  <el-col :span="24">
                    <el-form-item label="物品单价（元）" prop="notGoodPrice">
                      <el-input
                        type="text"
                        @input="notChange"
                        maxlength="20"
                        v-model="ruleForm.notGoodPrice"
                        placeholder="请输入物品单价"
                      />
                    </el-form-item>
                  </el-col>
                  <el-col :span="24">
                    <el-form-item label="物品数量（个）" prop="notGoodNum">
                      <el-input
                        type="text"
                        @input="notChange"
                        maxlength="20"
                        v-model="ruleForm.notGoodNum"
                        placeholder="请输入物品数量"
                      />
                    </el-form-item>
                  </el-col>
                  <el-col :span="24" class="pb-16px">
                    <el-form-item label="物品总价（元）" prop="notGoodAllPrice">
                      <el-input
                        type="text"
                        maxlength="50"
                        v-model="ruleForm.notGoodAllPrice"
                        placeholder="请输入物品总价"
                      />
                    </el-form-item>
                  </el-col>

                  <div
                    class="addform-sub h-40px border-1 border-[#99D9F6] bg-[#F5FBFE] flex items-center justify-center text-[#00A0E9] cursor-pointer my-2"
                    @click="notReceivedFormSub"
                  >
                    点击保存
                  </div>
                </el-form>
              </template>
            </addForm>
          </el-col>

          <el-col :span="24">
            <el-form-item>
              <div
                >预计总金额（元）:
                <span class="text-[#00A0E9] text-2xl ml-1">{{
                  ruleForm.estimatedAmount
                }}</span></div
              >
            </el-form-item>
          </el-col>

          <el-col :span="24">
            <el-form-item label="紧急程度" prop="urgency">
              <el-select
                :disabled="true"
                v-model="ruleForm.urgency"
                style="width: 100%"
                placeholder="请选择紧急程度"
              >
                <template #prefix
                  ><div
                    class="sel-urgency-class"
                    :class="
                      ruleForm.urgency === '1'
                        ? 'sel-urgency-low'
                        : ruleForm.urgency === '2'
                        ? 'sel-urgency-middle'
                        : 'sel-urgency-high'
                    "
                  ></div
                ></template>
                <el-option value="1" class="urgencyClass urgency-low" label="正常" />
                <el-option value="2" class="urgencyClass urgency-middle" label="重要" />
                <el-option value="3" class="urgencyClass urgency-high" label="紧急" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col v-if="pageFlag === 'approve' || pageFlag === 'archive'">
            <el-form-item label="" prop="orderExpain">
              <span>审核意见（驳回必填<span class="text-red-500"> *</span>）</span>
              <el-input
                type="textarea"
                :rows="4"
                :disabled="false"
                maxlength="200"
                v-model="ruleForm.orderExpain"
                placeholder="请输入审核意见"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <div class="w-[39%] pl-30px pr-10px">
          <p>审批记录</p>
          <OrderStep :flowDatas="flowDatas" />
        </div>
      </div>
    </el-form>
    <template #footer>
      <div class="footer">
        <el-button
          class="dialog-btn-sure"
          :loading="passLoading"
          :disabled="passLoading"
          @click="pass"
          v-if="pageFlag === 'approve' || pageFlag === 'archive'"
        >
          通过
        </el-button>

        <!-- <el-button class="dialog-btn-sure" @click="procure" v-if="pageFlag === 'procure'">
          准备采购
        </el-button> -->

        <el-button
          class="dialog-btn-reject"
          :loading="passLoading"
          :disabled="passLoading"
          @click="reject"
          v-if="pageFlag === 'approve' || pageFlag === 'archive'"
          plain
        >
          驳回
        </el-button>
        <el-button class="dialog-btn-cancel" @click="closeDialog" v-if="pageFlag === 'see'">
          取消
        </el-button>
      </div>
    </template>
  </Dialog>
</template>

<style lang="less" scoped>
.goods-table {
  width: 100%;
  font-size: 14px;
}
:deep(.el-input-group__append) {
  background-color: white;
  width: 35px;
}
.urgencyClass {
  display: flex;
  align-items: center;
  &:before {
    content: ' ';
    display: inline-block;
    margin-right: 12px;
    width: 20px;
    height: 20px;
    border-radius: 4px;
  }
}
.urgency-low:before {
  background-color: #80c36a;
}
.urgency-middle:before {
  background-color: #eeb915;
}
.urgency-high:before {
  background-color: #df3c2f;
}

.article-addform-title {
  padding-left: 10px;
  font-size: 16px;
  font-weight: 600;
  color: #333333;
}
</style>

<style lang="less">
.article-addform-table {
  color: #666666;
  .el-table__cell {
    padding: 0;
  }
  tr {
    padding: 0 15px !important;
  }
  thead th {
    height: 40px;
    background: #edeef0 !important;
    border-radius: 2px;
    text-align: center !important;
  }
  tbody td {
    background: #f5f6f7 !important;
    height: 50px !important;
    text-align: center !important;
  }
}
</style>
