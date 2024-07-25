<!-- 请假申请 -->
<script setup lang="ts">
import './urgency.less'
import { getAllTinfoGoodsList } from '@/api/AdministrativeService/inventoryManagement'
import { ref, reactive, getCurrentInstance, unref, nextTick } from 'vue'
import { propTypes } from '@/utils/propTypes'
import { useValidator } from '@/hooks/web/useValidator'
import { useEmitt } from '@/hooks/web/useEmitt'
import { applyOrderApi, editOrderApi, getOrderDetailApi } from '@/api/order'
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
  let label = ''
  unref(arr).map((item: any) => {
    if (value == item.value) {
      label = item.label
    }
  })
  return label
}

const getGoodNameLabel = (value: string): string => {
  let label = ''
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
//表单
const formRef = ref<any>()
//保存等待
const loading = ref(false)
const releaseLoading = ref(false)

const pageFlag = ref<string>('add') // see 查看 edit 编辑 add 新增
const goodList = ref<any>([])

const goodTypeChange = (value) => {
  ruleForm.value.goodName = ''
  goods_name.value = goodList.value.filter((v) => {
    return v.goodsType == value
  })
}

//保存数据
const save = async (flag) => {
  if (!tableData.value.length) {
    ElMessage.error('请添加物品明细！')
    return
  }
  //表单验证
  if (!formRef.value) return
  await formRef.value?.validate(async (isValid) => {
    if (isValid) {
      if (flag === 1) {
        loading.value = true
      } else {
        releaseLoading.value = true
      }
      let data = {
        flag: flag,
        type: ruleForm.value.type,
        urgency: ruleForm.value.urgency,
        goodApply: {
          remark: ruleForm.value.remark,
          applyDate: ruleForm.value.applyDate,
          goods: tableData.value
        }
      }
      if (pageFlag.value === 'add') {
        addApply(data)
      } else {
        editApply(data)
      }
    }
  })
}

//物品领用 新增
const addApply = async (data: any) => {
  const res = await applyOrderApi(data)
    .catch(() => {})
    .finally(() => {
      setTimeout(() => {
        loading.value = false
        releaseLoading.value = false
      }, 200)
    })
  if (res) {
    if (data.flag == '1') {
      ElMessage.success('保存信息成功')
    } else {
      ElMessage.success('发布信息成功')
    }
    //通知列表刷新
    emitter.emit('order', 'refresh')
    closeDialog()
  }
}

//物品领用 编辑
const editApply = async (data: any) => {
  data.id = detailsId.value
  const res = await editOrderApi(data)
    .catch(() => {})
    .finally(() => {
      setTimeout(() => {
        loading.value = false
        releaseLoading.value = false
      }, 200)
    })
  if (res) {
    if (data.flag == '1') {
      ElMessage.success('保存信息成功')
    } else {
      ElMessage.success('发布信息成功')
    }
    //通知列表刷新
    emitter.emit('order', 'refresh')
    closeDialog()
  }
}

//弹窗
const elDialogFef = ref()
const pageTite = ref<string>('')
//打开drawer并初始化
const openDrawer = (id: string, flag: string) => {
  dialogFlag.value = true
  pageFlag.value = flag
  pageTite.value = flag == 'add' ? props.title : flag == 'edit' ? '编辑' : '详情'
  tableData.value = []
  elDialogFef.value.isFullscreen = false
  goodlistFun()
  if (id) {
    detailsId.value = id
    getDetailsData()
  }
}

const goodlistFun = async () => {
  let res = await getAllTinfoGoodsList()

  console.log(res)
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
  applyDate: [{ required: true, message: '请选择领用日期', trigger: 'change' }],
  urgency: [{ required: true, message: '请选择紧急程度', trigger: 'change' }]
})

//表单验证规则
const addRules = reactive({
  goodType: [{ required: true, message: '请选择物品类型', trigger: 'change' }],
  goodName: [{ required: true, message: '请选择物品名称', trigger: 'change' }],
  goodNum: [
    { required: true, message: '请输入物品数量', trigger: 'blur' },
    {
      validator: (rule: any, value: string, callback: Callback) =>
        validateNumSearch(value, callback, '请输入大于0且小于1000000的整数'),
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
  goodTypeChange(tableData.value[index].goodType)
  editCount = index
  addFormRef.value.openForm(true)
  nextTick(() => {
    ruleForm.value.goodType = tableData.value[index].goodType
    ruleForm.value.goodNum = tableData.value[index].goodNum
    ruleForm.value.goodName = Number(tableData.value[index].goodName)
  })
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
      if (editCount || editCount === 0) {
        if (tableData.value.length) {
          let flag = tableData.value.some((v) => {
            return ruleForm.value.goodName == v.goodName
          })

          if (flag && tableData.value[editCount].goodName != ruleForm.value.goodName) {
            ElMessage.error('选择物品重复，已添加该物品，请重新编辑！')
            return false
          }
        }
        tableData.value[editCount].goodType = ruleForm.value.goodType
        tableData.value[editCount].goodNum = ruleForm.value.goodNum
        tableData.value[editCount].goodName = ruleForm.value.goodName
      } else {
        if (tableData.value.length) {
          let flag = tableData.value.some((v) => {
            return ruleForm.value.goodName == v.goodName
          })

          if (flag) {
            ElMessage.error('选择物品重复，已添加该物品，请进行编辑！')
            return false
          }
        }
        tableData.value.push({
          goodType: ruleForm.value.goodType,
          goodNum: ruleForm.value.goodNum,
          goodName: ruleForm.value.goodName
        })
      }
      addFormRef.value.openForm(false)
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

defineExpose({
  openDrawer
})
</script>

<template>
  <Dialog
    ref="elDialogFef"
    class="cultivate-custom"
    v-model="dialogFlag"
    :title="pageTite"
    @closed="resetFormAfterClose"
  >
    <el-form
      :model="ruleForm"
      :rules="rules"
      ref="formRef"
      :disabled="pageFlag === 'see'"
      label-position="top"
      label-width="100px"
      class="demo-ruleForm"
    >
      <el-row>
        <el-col :span="24">
          <el-form-item label="物品用途" prop="remark">
            <el-input
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
          <addForm title="物品明细" ref="addFormRef" :disabled="pageFlag !== 'see'">
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
                <el-table-column label="操作" prop="action" v-if="pageFlag !== 'see'">
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
                      fit-input-width
                      filterable
                      @change="goodTypeChange"
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
                      fit-input-width
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
                      maxlength="6"
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
          <el-form-item>
            <div
              >物品明细汇总-数量（个）：<span class="text-[#00A0E9] text-2xl ml-1">{{
                ruleForm.articleNum
              }}</span></div
            >
          </el-form-item>
        </el-col>
      </el-row>
      <el-col :span="24">
        <el-form-item label="紧急程度" prop="urgency">
          <el-select
            fit-input-width
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
    </el-form>
    <template #footer>
      <div class="footer">
        <el-button
          class="dialog-btn-sure"
          :disabled="releaseLoading"
          :loading="loading"
          @click="save(1)"
          v-if="pageFlag !== 'see'"
        >
          暂存
        </el-button>
        <el-button
          class="dialog-btn-sure"
          :disabled="loading"
          :loading="releaseLoading"
          @click="save(2)"
          v-if="pageFlag !== 'see'"
        >
          发布
        </el-button>
        <el-button class="dialog-btn-cancel" @click="closeDialog"> 取消 </el-button>
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
