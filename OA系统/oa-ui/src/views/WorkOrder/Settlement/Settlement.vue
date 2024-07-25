<template>
  <ContentWrap Showtitle="加班结算">
    <template #ContentWrapTitle>
      <div>
        <ElButton
          v-if="isAuth('order:settlement:export')"
          :loading="exLoading"
          class="exportBtn"
          plain
          @click="exportForm()"
        >
          <template #icon>
            <Icon :size="14" icon="svg-icon:exportBut" />
          </template>
          导出
        </ElButton>

        <ElButton
          v-if="isAuth('order:settlement:settlement')"
          class="exportBtn"
          plain
          @click="batchSettlementApply()"
        >
          <template #icon>
            <Icon :size="14" icon="svg-icon:settlement" />
          </template>
          批量结算
        </ElButton>
        <ElButton
          v-if="isAuth('order:settlement:audit')"
          class="exportBtn"
          plain
          @click="batchAudit()"
        >
          <template #icon>
            <Icon :size="14" icon="svg-icon:audit" />
          </template>
          批量审核
        </ElButton>
      </div>
    </template>
    <Table
      v-model:pageSize="tableObject.pageSize"
      v-model:currentPage="tableObject.currentPage"
      :columns="allSchemas.tableColumns"
      :data="tableObject.tableList"
      :loading="tableObject.loading"
      :border="true"
      :isShowCell="isShowCell"
      :header-align="'center'"
      :cotentAlign="'center'"
      :pagination="{
        total: tableObject.total
      }"
      @sort-change="tableSortChange"
      @select-all="selectAll"
      @select="selectOne"
      @register="register"
    >
      <template #operateBtnLeft>
        <Search
          ref="searchRef"
          v-if="isAuth('order:settlement:query')"
          :schema="searchSchema"
          @search="setSearchParamsSub"
          @reset="resetSearchParams"
        />
      </template>
      <template #action="{ row }">
        <ElButton
          class="btn-default"
          :text="true"
          @click="action(row, 'withdraw')"
          v-if="isAuth('order:settlement:withdraw') && row.status == '2'"
        >
          撤回
        </ElButton>
        <ElButton
          class="btn-default"
          :text="true"
          @click="action(row, 'settlement')"
          v-if="isAuth('order:settlement:settlement') && (row.status == '1' || row.status == '4')"
        >
          结算
        </ElButton>
        <ElButton
          class="btn-default"
          :text="true"
          @click="action(row, 'audit')"
          v-if="isAuth('order:settlement:audit') && row.status == '2'"
        >
          审核
        </ElButton>
      </template>
    </Table>
  </ContentWrap>
  <LimitDailog routerName="Settlement" />
  <Dialog v-model="dialogVisible" title="结算" :width="'35%'" :maxHeight="'auto'">
    <el-form
      :model="ruleForm"
      :rules="rules"
      ref="formRef"
      label-width="140px"
      class="settle-ruleForm"
    >
      <el-row>
        <el-col :span="24">
          <el-form-item label="剩余总时长（小时）" prop="totalTime">
            <el-input v-model="ruleForm.totalTime" type="text" disabled />
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="顺延时长（小时）" prop="postponeTime">
            <el-input v-model="ruleForm.postponeTime" type="text" disabled />
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="结算时长（小时）" prop="newTime">
            <el-input v-model="ruleForm.newTime" type="text" disabled />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <template #footer>
      <ElButton class="dialog-btn-sure" :loading="sureLoading" @click="settlementApply">
        确定</ElButton
      >
      <ElButton class="dialog-btn-cancel" @click="dialogVisible = false">取消</ElButton>
    </template>
  </Dialog>
  <Dialog v-model="dialogAuditVisible" title="审核" :width="'35%'" :maxHeight="'auto'">
    <el-form :model="ruleForm" :rules="rules" ref="auditFormRef" class="demo-ruleForm">
      <el-row>
        <el-col :span="24">
          <el-form-item label="备注" prop="remark">
            <el-input
              type="textarea"
              :autosize="{ minRows: 4, maxRows: 8 }"
              maxlength="200"
              v-model="ruleForm.remark"
              placeholder="请输入备注"
            />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <template #footer>
      <ElButton
        class="dialog-btn-reject"
        :loading="rejectLoading"
        :disabled="passLoading"
        @click="reject"
        plain
        >驳回</ElButton
      >
      <ElButton
        class="dialog-btn-sure"
        :loading="passLoading"
        :disabled="rejectLoading"
        @click="pass"
      >
        通过</ElButton
      >
    </template>
  </Dialog>
  <OrderListDailog :data="orderList" ref="orderListRef" />
  <Dialog v-model="dialogSettleVisible" title="批量结算" :width="'35%'" :maxHeight="'auto'">
    <el-form
      :model="ruleForm"
      :rules="rules"
      ref="formRef"
      label-width="140px"
      class="settle-ruleForm"
    >
      <el-row>
        <el-col :span="24">
          <el-form-item label="剩余总时长（小时）" prop="totalTime">
            <el-input v-model="ruleForm.totalTime" type="text" disabled />
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="顺延时长（小时）" prop="postponeTime">
            <el-input v-model="ruleForm.postponeTime" type="text" disabled />
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="结算时长（小时）" prop="newTime">
            <el-input v-model="ruleForm.newTime" type="text" disabled />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <template #footer>
      <ElButton class="dialog-btn-sure" :loading="sureLoading" @click="settlementBatchApply">
        确定</ElButton
      >
      <ElButton class="dialog-btn-cancel" @click="dialogSettleVisible = false">取消</ElButton>
    </template>
  </Dialog>
</template>
<script setup lang="ts">
import { LimitDailog } from '@/views/Components/limit'
import { ContentWrap } from '@/components/ContentWrap'
import { Search } from '@/components/Search'
import { ElButton, ElMessageBox, ElTag, ElMessage } from 'element-plus'
import { Table } from '@/components/Table'
import { useTable } from '@/hooks/web/useTable'
import { CrudSchema, useCrudSchemas } from '@/hooks/web/useCrudSchemas'
import { TableColumn } from '@/types/table'
import { isAuth } from '@/utils/is' // 鉴权
import {
  exportApplyListApi,
  getSettlementListApi,
  applySettlementApi,
  applySettlementBatchApi,
  withdrawSettlementApplyApi,
  auditSettlementOrderApi,
  auditSettlementBatchApi,
  exportSettlementListApi,
  getSettlementHoursApi
} from '@/api/order'
import { useEmitt } from '@/hooks/web/useEmitt'
import { h, nextTick, onMounted, reactive, ref } from 'vue'
import moment from 'moment'
import { FormSchema } from '@/types/form'
import { getAllDeptListApi } from '@/api/sys/dept'
import { listToTree } from '@/utils/tree'
import { Dialog } from '@/components/Dialog'
import { useValidator } from '@/hooks/web/useValidator'
import { OrderListDailog } from './form'
import { AnyAaaaRecord } from 'dns'

defineOptions({
  name: 'Settlement'
})

type Callback = (error?: string | Error | undefined) => void
const { required, notSpace } = useValidator()

const { register, tableObject, methods } = useTable<any>({
  getListApi: getSettlementListApi,
  response: {
    list: 'rows',
    total: 'total'
  }
})

const { getList, setSearchParams } = methods

//查询参数
const params = reactive<Recordable>({
  year: '',
  quarter: '',
  deptId: ''
})

const searchRef = ref()
const quarter = ref<number>(0)
const year = ref<number>(0)

const getCurrentYearMonth = () => {
  let month = new Date().getMonth() + 1
  let yearTemp = new Date().getFullYear()
  quarter.value = Math.ceil(month / 3) - 1 > 0 ? Math.ceil(month / 3) - 1 : 4
  year.value = quarter.value < 4 ? yearTemp : yearTemp - 1
  params.year = String(year.value)
  params.quarter = quarter.value
  nextTick(() => {
    searchRef.value.setValues(params)
  })
  setSearchParams(params)
}

getCurrentYearMonth()

//监听刷新
useEmitt({
  name: 'settlement',
  callback: (type: string) => {
    if (type === 'refresh') {
      tableObject.currentPage = 1
    }
    getList()
  }
})

onMounted(() => {
  getDeptTreeList()
})
// 左侧树形数据
const treedata = ref<any>([])
// 获取部门树
const getDeptTreeList = async () => {
  try {
    if (treedata.value.length > 0) {
      return
    }
    const res = await getAllDeptListApi({})
    if (res) {
      treedata.value = listToTree(res.data, {
        id: 'deptId',
        children: 'children',
        pid: 'parentId'
      })
    }
  } catch (err) {}
}

const crudSchemas = reactive<CrudSchema[]>([
  {
    field: 'quarter',
    minWidth: '90px',
    label: '季度',
    formatter: (row: Recordable) => {
      return h(
        'span',
        row.quarter == 1
          ? '一季度'
          : row.quarter == 2
          ? '二季度'
          : row.quarter == 3
          ? '三季度'
          : row.quarter == 4
          ? '四季度'
          : '--'
      )
    }
  },
  {
    field: 'deptName',
    minWidth: '120px',
    label: '部门',
    formatter: (row: Recordable) => {
      return h('span', row.deptName ? row.deptName : '--')
    }
  },
  {
    field: 'userName',
    minWidth: '120px',
    label: '姓名',
    formatter: (row: Recordable) => {
      return h('span', row.userName ? row.userName : '--')
    }
  },
  {
    field: 'holidayOvertimeHours',
    minWidth: '110px',
    label: '公休加班(h)',
    formatter: (row: Recordable) => {
      return h('span', row.holidayOvertimeHours ? row.holidayOvertimeHours : '0')
    }
  },
  {
    field: 'workOvertimeHours',
    minWidth: '110px',
    label: '日常加班(h)',
    formatter: (row: Recordable) => {
      return h('span', row.workOvertimeHours ? row.workOvertimeHours : '0')
    }
  },
  {
    field: 'restHours',
    minWidth: '110px',
    label: '调休时长(h)',
    formatter: (row: Recordable) => {
      return h('span', row.restHours ? row.restHours : '0')
    }
  },
  {
    field: 'lastResidueHours',
    minWidth: '110px',
    label: '上季结余(h)',
    formatter: (row: Recordable) => {
      return h('span', row.lastResidueHours ? row.lastResidueHours : '0')
    }
  },
  {
    field: 'sumHours',
    minWidth: '115px',
    label: '剩余总时长(h)',
    formatter: (row: Recordable) => {
      return h('span', row.sumHours ? row.sumHours : '0')
    }
  },
  {
    field: 'delayHours',
    minWidth: '110px',
    label: '顺延时长(h)',
    formatter: (row: Recordable) => {
      return h('span', row.delayHours ? row.delayHours : '0')
    }
  },
  {
    field: 'settlementHours',
    minWidth: '110px',
    label: '结算时长(h)',
    formatter: (row: Recordable) => {
      return h('span', row.settlementHours ? row.settlementHours : '0')
    }
  },
  {
    field: 'status',
    label: '状态',
    minWidth: '100px',
    formatter: (row: Recordable, __: TableColumn, cellValue: string) => {
      return h(
        ElTag,
        {
          //未结算、待审核、已结算，已驳回
          type:
            cellValue === '1'
              ? 'primary'
              : cellValue === '2'
              ? 'warning'
              : cellValue === '3'
              ? 'success'
              : cellValue === '4'
              ? 'danger'
              : 'danger'
        },
        () =>
          cellValue === '1'
            ? '未结算'
            : cellValue === '2'
            ? '待审核'
            : cellValue === '3'
            ? '已结算'
            : cellValue === '4'
            ? '已驳回'
            : ''
      )
    }
  },
  {
    field: 'remark',
    minWidth: '140px',
    label: '备注',
    formatter: (row: Recordable) => {
      return h('span', row.remark ? row.remark : '')
    }
  },
  {
    field: 'action',
    fixed: 'right',
    minWidth: '120px',
    label: '操作',
    showOverflowTooltip: false
  }
])
const { allSchemas } = useCrudSchemas(crudSchemas)

//重置
const resetSearchParams = () => {
  params.year = String(year.value)
  params.quarter = quarter.value
  params.deptId = ''
  nextTick(() => {
    searchRef.value.setValues(params)
  })
  setSearchParams(params)
}
//搜索
const setSearchParamsSub = (param: Recordable) => {
  params.year = param.year ? moment(param.year).format('YYYY') : ''
  params.quarter = param.quarter ? param.quarter : ''
  params.deptId = param.deptId ? param.deptId[param.deptId.length - 1] : ''
  setSearchParams(params)
}

//搜索栏
const quarterArray = ref<any>([
  {
    label: '一季度',
    value: 1
  },
  {
    label: '二季度',
    value: 2
  },
  {
    label: '三季度',
    value: 3
  },
  {
    label: '四季度',
    value: 4
  }
])
const searchSchema = reactive<FormSchema[]>([
  {
    field: 'year',
    label: '',
    component: 'DatePicker',
    componentProps: {
      placeholder: '年份筛选',
      filterable: true,
      type: 'year',
      format: 'YYYY',
      valueFormat: 'YYYY',
      style: 'width: 11vw'
    }
  },
  {
    field: 'quarter',
    label: '',
    component: 'Select',
    componentProps: {
      placeholder: '季度筛选',
      filterable: true,
      options: quarterArray,
      style: 'width: 11vw'
    }
  },
  {
    field: 'deptId',
    label: '',
    component: 'Cascader',
    componentProps: {
      style: 'width: 196px',
      options: treedata,
      props: {
        label: 'deptName',
        value: 'deptId'
      },
      filterable: true,
      placeholder: '部门筛选'
    }
  }
])

//
const action = (row: any, flag: string) => {
  if (flag == 'withdraw') {
    //撤回
    withdrawApply(row)
  } else if (flag == 'settlement') {
    //结算
    settlement(row)
  } else if (flag == 'audit') {
    //审核
    auditApply(row)
  }
}

//撤回
const withdrawApply = (row: any) => {
  ElMessageBox.confirm('是否撤回该结算？', '撤回结算提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
    autofocus: false
  }).then(async () => {
    const params = { id: row.id }
    const res = await withdrawSettlementApplyApi(params)
    if (res) {
      nextTick()
      ElMessage.success('撤回结算成功')
      getList()
    }
  })
}

//结算
const dialogVisible = ref<boolean>(false)
const sureLoading = ref<boolean>(false)
const ruleForm = ref<any>({ id: '', totalTime: '', postponeTime: '', newTime: '', remark: '' })

//表单验证规则
const rules = reactive({
  postponeTime: [{ required: true, message: '请输入顺延时长', trigger: 'blur' }],
  totalTime: [{ required: true, message: '请输入剩余总时长', trigger: 'blur' }],
  newTime: [{ required: true, message: '请输入结算时长', trigger: 'blur' }],
  remark: [
    {
      validator: (rule: any, value: string, callback: Callback) =>
        notSpace(value, callback, '不能输入纯空格'),
      trigger: 'blur'
    }
  ]
})
//结算弹框
const settlement = (row: any) => {
  let totalTime = row.sumHours ? row.sumHours : '0'
  let postponeTime = row.delayHours ? row.delayHours : '0'
  let settlementHours = row.settlementHours ? row.settlementHours : '0'
  ruleForm.value = {
    id: row.id,
    totalTime: totalTime,
    postponeTime: postponeTime,
    newTime: settlementHours,
    remark: ''
  }
  sureLoading.value = false
  dialogVisible.value = true
}

const formRef = ref<any>()
//申请结算
const settlementApply = async () => {
  //表单验证
  if (!formRef.value) return
  await formRef.value?.validate(async (isValid: boolean) => {
    if (isValid) {
      sureLoading.value = true
      let data = { id: ruleForm.value.id }
      const res = await applySettlementApi(data).finally(() => {
        sureLoading.value = false
      })
      if (res) {
        nextTick()
        dialogVisible.value = false
        if (res.data.length) {
          orderList.value = res.data
          orderListRef.value.openDrawer()
        } else {
          ElMessage.success('结算申请成功')
          getList()
        }
      }
    }
  })
}

//批量结算
const orderList = ref<any>([])
const orderListRef = ref()
const dialogSettleVisible = ref<boolean>(false)
const batchSettlementApply = async () => {
  const { getSelections } = methods
  const selections = await getSelections()
  let isOk = true
  if (selections.length) {
    isOk = selections.every((v: any) => {
      return v.status == '1' || v.status == '4'
    })
  }
  if (isOk) {
    let totalTime = 0
    let postponeTime = 0
    let settlementHours = 0
    if (selections.length) {
      //有选中的人
      selections.forEach((item: any) => {
        totalTime = totalTime + Number(item.sumHours)
        postponeTime = postponeTime + Number(item.delayHours)
        settlementHours = settlementHours + Number(item.settlementHours)
      })
      ruleForm.value = {
        id: '',
        totalTime: String(totalTime),
        postponeTime: String(postponeTime),
        newTime: String(settlementHours),
        remark: ''
      }
      sureLoading.value = false
      dialogSettleVisible.value = true
    } else {
      let user = ''
      if (selections.length) {
        user = selections.map((v) => v.userId).toString()
      }
      const param = {
        quarter: params.quarter,
        year: params.year,
        deptId: params.deptId,
        userIds: user
      }
      //选择部门
      const res = await getSettlementHoursApi(param)
      if (res) {
        totalTime = res.data.countSumHours ? res.data.countSumHours : 0
        postponeTime = res.data.countDelayHours ? res.data.countDelayHours : 0
        settlementHours = res.data.countSettlementHours ? res.data.countSettlementHours : 0
        nextTick()
        ruleForm.value = {
          id: '',
          totalTime: String(totalTime),
          postponeTime: String(postponeTime),
          newTime: String(settlementHours),
          remark: ''
        }
        sureLoading.value = false
        dialogSettleVisible.value = true
      }
    }
    // ElMessageBox.confirm('是否批量结算加班时长？', '批量结算提示', {
    //   confirmButtonText: '确定',
    //   cancelButtonText: '取消',
    //   type: 'warning',
    //   autofocus: false
    // }).then(async () => {
    //   let user = ''
    //   if (selections.length) {
    //     user = selections.map((v) => v.userId).toString()
    //   }
    //   const param = {
    //     quarter: params.quarter,
    //     year: params.year,
    //     deptId: params.deptId,
    //     userIds: user
    //   }
    //   const res = await applySettlementBatchApi(param)
    //   if (res) {
    //     nextTick()
    //     if (res.data.length) {
    //       orderList.value = res.data
    //       orderListRef.value.openDrawer()
    //     } else {
    //       ElMessage.success('批量结算成功')
    //       getList()
    //     }
    //   }
    // })
  } else {
    ElMessage.error('部分数据无结算权限')
  }
}
const settlementBatchApply = async () => {
  const { getSelections } = methods
  const selections = await getSelections()
  let user = ''
  if (selections.length) {
    user = selections.map((v) => v.userId).toString()
  }
  const param = {
    quarter: params.quarter,
    year: params.year,
    deptId: params.deptId,
    userIds: user
  }
  const res = await applySettlementBatchApi(param).finally(() => {
    sureLoading.value = false
  })
  if (res) {
    nextTick()
    dialogSettleVisible.value = false
    if (res.data.length) {
      orderList.value = res.data
      orderListRef.value.openDrawer()
    } else {
      ElMessage.success('批量结算成功')
      getList()
    }
  }
}
//审核
const dialogAuditVisible = ref<boolean>(false)
const passLoading = ref(false)
const rejectLoading = ref(false)
const auditFormRef = ref<any>()
//审核弹框
const auditApply = (row: any) => {
  isBatchAudit.value = false
  ruleForm.value = {
    id: row.id,
    totalTime: '',
    postponeTime: '',
    newTime: '',
    remark: ''
  }
  dialogAuditVisible.value = true
}
//驳回
const reject = async () => {
  //表单验证
  if (!ruleForm.value.remark) {
    ElMessage.error('请输入备注')
    return
  }
  if (!auditFormRef.value) return
  await auditFormRef.value?.validate(async (isValid: boolean) => {
    if (isValid) {
      rejectLoading.value = true
      if (isBatchAudit.value) {
        const { getSelections } = methods
        const selections = await getSelections()
        let user = ''
        if (selections.length) {
          user = selections.map((v) => v.userId).toString()
        }
        let param = {
          flag: 2,
          quarter: params.quarter,
          year: params.year,
          remark: ruleForm.value.remark,
          deptId: params.deptId,
          userIds: user
        }
        const res = await auditSettlementBatchApi(param).finally(() => {
          rejectLoading.value = false
        })
        if (res) {
          ElMessage.success('加班结算批量驳回成功')
          dialogAuditVisible.value = false
          getList()
        }
      } else {
        let param = {
          flag: 2,
          id: ruleForm.value.id,
          remark: ruleForm.value.remark
        }
        const res = await auditSettlementOrderApi(param).finally(() => {
          rejectLoading.value = false
        })
        if (res) {
          ElMessage.success('加班结算驳回成功')
          dialogAuditVisible.value = false
          getList()
        }
      }
    }
  })
}

//通过
const pass = async () => {
  //表单验证
  if (!auditFormRef.value) return
  await auditFormRef.value?.validate(async (isValid: boolean) => {
    if (isValid) {
      passLoading.value = true
      if (isBatchAudit.value) {
        const { getSelections } = methods
        const selections = await getSelections()
        let user = ''
        if (selections.length) {
          user = selections.map((v) => v.userId).toString()
        }
        let param = {
          flag: 1,
          quarter: params.quarter,
          year: params.year,
          remark: ruleForm.value.remark,
          deptId: params.deptId,
          userIds: user
        }
        const res = await auditSettlementBatchApi(param).finally(() => {
          passLoading.value = false
        })
        if (res) {
          ElMessage.success('加班结算批量审核成功')
          dialogAuditVisible.value = false
          getList()
        }
      } else {
        let param = {
          flag: 1,
          id: ruleForm.value.id,
          remark: ruleForm.value.remark
        }
        const res = await auditSettlementOrderApi(param).finally(() => {
          passLoading.value = false
        })
        if (res) {
          dialogAuditVisible.value = false
          ElMessage.success('加班结算审核成功')
          getList()
        }
      }
    }
  })
}
//批量审核
const isBatchAudit = ref<boolean>(false)
const batchAudit = async () => {
  const { getSelections } = methods
  const selections = await getSelections()
  let isOk = true
  if (selections.length) {
    isOk = selections.every((v: any) => {
      return v.status == '2'
    })
  }
  if (isOk) {
    isBatchAudit.value = true
    ruleForm.value = {
      totalTime: '',
      postponeTime: '',
      newTime: '',
      remark: ''
    }
    dialogAuditVisible.value = true
  } else {
    ElMessage.error('部分数据无审核权限')
  }
}

//导出
const exLoading = ref(false)
const exportForm = async () => {
  if (tableObject.tableList.length === 0) {
    ElMessage.warning('查询无数据, 无需导出数据')
    return
  }
  exLoading.value = true
  await exportSettlementListApi(params)
  exLoading.value = false
}
</script>

<style lang="less">
.settle-ruleForm {
  .el-form-item__label {
    width: 150px !important;
  }
}
</style>
