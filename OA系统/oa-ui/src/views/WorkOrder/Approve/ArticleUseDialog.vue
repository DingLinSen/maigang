<!-- 请假申请 -->
<script setup lang="ts">
import './urgency.less'
import { getAllTinfoGoodsList } from '@/api/AdministrativeService/inventoryManagement'
import { ref, reactive, getCurrentInstance, unref } from 'vue'
import { propTypes } from '@/utils/propTypes'
import { useValidator } from '@/hooks/web/useValidator'
import { OrderStep } from '../Step'
import { useEmitt } from '@/hooks/web/useEmitt'
import { getOrderDetailApi, auditOrderApi, archiveOrderApi, lendApi } from '@/api/order'
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
const goods_name = ref<any>()
type Callback = (error?: string | Error | undefined) => void
// 弹窗的开启和关闭
const dialogFlag = ref<Boolean>(false)

const { required, validateEnglishAndNumber, notSpace, validateNumSearch } = useValidator()

const props = defineProps({
  title: propTypes.string.def('')
})

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

const addFormRef = ref<any>()
const addTableFormRef = ref<any>()
const detailsId = ref<string>('')
const flowDatas = ref<any[]>()
const rejectLoading = ref(false)
const passLoading = ref(false)
const lyLoading = ref(false)
const dialogTitle = ref<string>('')
//表单
const formRef = ref<any>()
//保存等待
const loading = ref(false)

const pageFlag = ref<string>('add') // see 查看 edit 编辑 add 新增
const goodList = ref<any>()
//弹窗
const elDialogFef = ref()
//打开drawer并初始化
const openDrawer = (id: string, flag: string) => {
  dialogFlag.value = true
  pageFlag.value = flag
  tableData.value = []
  elDialogFef.value.isFullscreen = false
  goodlistFun()
  receive
  dialogTitle.value =
    flag === 'approve' ? '审核' : flag === 'archive' ? '归档' : flag === 'receive' ? '领用' : '详情'
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
      ruleForm.value.remark = data.goodApply.remark
      ruleForm.value.applyDate = data.goodApply.applyDate
      if (data.goodApply.goods.length) {
        tableData.value = data.goodApply.goods.map((v) => {
          return {
            goodType: v.goodType,
            goodName: v.goodName,
            goodNum: v.goodNum
          }
        })
      }
      ruleForm.value.articleNum = allNumFun()
      flowDatas.value = data.audits
      if (data.goodApply.status == '2' || data.goodApply.status == '4') {
        let arr = [
          {
            roleName: data.leaderRoleName,
            createByName: data.leaderName,
            orderStep: '待审核'
          },
          {
            roleName: '行政专员',
            createByName: '张路路',
            orderStep: '待领取'
          }
        ]
        flowDatas.value = [...flowDatas.value, ...arr]
      } else if (data.goodApply.status == '9' || data.goodApply.status == '8') {
        let arr = [
          {
            roleName: '行政专员',
            createByName: '张路路',
            orderStep: '待领取'
          }
        ]
        flowDatas.value = [...flowDatas.value, ...arr]
      }
    }
  }
}

//清空表单
const resetForm = () => {
  ruleForm.value = {
    flag: '',
    type: 6,
    urgency: '1',
    remark: '',
    applyDate: null,
    goodName: '',
    goodType: '',
    goodNum: '',
    orderExpain: '',
    articleNum: 0
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
  type: 6,
  urgency: '1',
  remark: '',
  applyDate: null,
  goodName: '',
  goodType: '',
  goodNum: '',
  orderExpain: '',
  articleNum: 0
})
//表单验证规则
const rules = reactive({
  remark: [
    // { required: true, message: '请输入物品用途', trigger: 'blur' },
    {
      validator: (rule: any, value: string, callback: Callback) =>
        notSpace(value, callback, '不能输入纯空格'),
      trigger: 'blur'
    }
  ],
  // applyDate: [{ required: true, message: '请选择领用日期', trigger: 'change' }],
  urgency: [{ required: true, message: '请选择紧急程度', trigger: 'change' }],
  orderExpain: [
    {
      validator: (rule: any, value: string, callback: Callback) =>
        notSpace(value, callback, '不能输入纯空格'),
      trigger: 'blur'
    }
  ]
})

//表单验证规则
const addRules = reactive({
  goodType: [{ required: true, message: '请选择物品类型', trigger: 'change' }],
  goodName: [{ required: true, message: '请选择物品名称', trigger: 'change' }],
  goodNum: [
    { required: true, message: '请输入物品单价', trigger: 'blur' },
    {
      validator: (rule: any, value: string, callback: Callback) =>
        validateNumSearch(value, callback, '仅支持数字'),
      trigger: 'blur'
    }
  ]
})

const tableData = ref<any>([])

const allNumFun = () => {
  let allNum = 0
  if (tableData.value.length) {
    tableData.value.forEach((v) => {
      allNum += Number(v.goodNum)
    })
  }
  return allNum
}

let editCount = ''
// 编辑
const addFormEdit = (index) => {
  editCount = index
  addFormRef.value.openForm(true)
  ruleForm.value.goodType = tableData.value[index].goodType
  ruleForm.value.goodNum = tableData.value[index].goodNum
  ruleForm.value.goodName = tableData.value[index].goodName
}

// 删除
const addFormDel = (index) => {
  tableData.value.splice(index, 1)
  addFormRef.value.openForm(false)
  ruleForm.value.articleNum = allNumFun()
  editCount = ''
  clearFormRow()
}

// 保存
const addFormSub = async () => {
  //表单验证
  if (!addTableFormRef.value) return
  await addTableFormRef.value?.validate(async (isValid) => {
    if (isValid) {
      addFormRef.value.openForm(false)
      if (editCount || editCount === 0) {
        tableData.value[editCount].goodType = ruleForm.value.goodType
        tableData.value[editCount].goodNum = ruleForm.value.goodNum
        tableData.value[editCount].goodName = ruleForm.value.goodName
      } else {
        tableData.value.push({
          goodType: ruleForm.value.goodType,
          goodNum: ruleForm.value.goodNum,
          goodName: ruleForm.value.goodName
        })
      }
      ruleForm.value.articleNum = allNumFun()
      editCount = ''
      clearFormRow()
    }
  })
}

// 清空表格表单数据
const clearFormRow = () => {
  ruleForm.value.goodType = ''
  ruleForm.value.goodNum = ''
  ruleForm.value.goodName = ''
}

// 审核保存
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
      passLoading.value = true
      rejectLoading.value = true
      let data = ruleForm.value
      if (pageFlag.value === 'approve') {
        approveApply(data, '已驳回')
      } else if (pageFlag.value === 'archive') {
        archiveOrder(data, '已驳回')
      } else if (pageFlag.value === 'receive') {
        receive(data, '已领取')
      }
    }
  })
}
//领用
const receive = async (data: any, flag: string) => {
  let params = {
    id: detailsId.value
  }
  lyLoading.value = true
  const res = await lendApi(params)
    .catch(() => {})
    .finally(() => {
      setTimeout(() => {
        lyLoading.value = false
        rejectLoading.value = false
        passLoading.value = false
      }, 200)
    })
  if (res) {
    ElMessage.success('领取成功')
    //通知列表刷新
    emitter.emit('order', 'refresh')
    closeDialog()
  }
}
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
          <el-col :span="24">
            <el-form-item label="物品用途" prop="remark">
              <el-input
                :disabled="true"
                type="textarea"
                :rows="4"
                maxlength="500"
                v-model="ruleForm.remark"
                placeholder="请输入物品用途"
              />
            </el-form-item>
          </el-col>
          <el-col :span="24" v-if="pageFlag !== 'add' && ruleForm.applyDate">
            <el-form-item label="领用日期" prop="applyDate">
              <el-date-picker
                type="date"
                :disabled="true"
                value-format="YYYY-MM-DD"
                format="YYYY-MM-DD"
                placeholder="请选择领用日期"
                class="date-picker"
                v-model="ruleForm.applyDate"
              />
            </el-form-item>
          </el-col>

          <el-col :span="24">
            <addForm title="物品明细" ref="addFormRef" :disabled="false">
              <template #table>
                <el-table
                  v-if="tableData.length"
                  class="article-addform-table goods-table"
                  :data="tableData"
                  maxHeight="190"
                >
                  <el-table-column prop="goodType" label="物品类型" width="140">
                    <template #default="scope">
                      <p class="flex justify-center items-center">
                        <span
                          class="text-[#0094D8] rounded w-68px h-26px bg-[rgba(0,160,233,.1)] block flex justify-center items-center"
                          >{{ getUserLabel(scope.row.goodType, goods_type) }}</span
                        >
                      </p>
                    </template>
                  </el-table-column>
                  <el-table-column prop="goodName" label="物品名称">
                    <template #default="scope">
                      <span>{{ getGoodNameLabel(scope.row.goodName) }}</span>
                    </template>
                  </el-table-column>
                  <el-table-column prop="goodNum" label="数量" />
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
                  :rules="addRules"
                  ref="addTableFormRef"
                  label-position="top"
                  label-width="100px"
                  class="demo-ruleForm"
                >
                  <el-col :span="24">
                    <el-form-item label="物品类型" prop="goodType">
                      <el-select
                        filterable
                        v-model="ruleForm.goodType"
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
                    <el-form-item label="物品名称" prop="goodName">
                      <el-select
                        filterable
                        v-model="ruleForm.goodName"
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
                  <el-col :span="24" class="pb-16px">
                    <el-form-item label="物品数量（个）" prop="goodNum">
                      <el-input
                        type="text"
                        maxlength="200"
                        v-model="ruleForm.goodNum"
                        placeholder="请输入物品数量"
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
          <el-col :span="24" class="mt-8px">
            <el-form-item prop="urgency">
              <div
                >物品明细汇总-数量（个）：<span class="text-[#00A0E9] text-2xl ml-1">{{
                  ruleForm.articleNum
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

        <el-button
          class="dialog-btn-sure"
          :loading="lyLoading"
          :disabled="lyLoading"
          @click="receive"
          v-if="pageFlag === 'receive'"
        >
          领用
        </el-button>

        <el-button
          class="dialog-btn-reject"
          :loading="rejectLoading"
          :disabled="rejectLoading"
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
