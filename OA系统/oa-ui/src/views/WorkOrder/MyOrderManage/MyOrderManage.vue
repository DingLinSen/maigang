<script setup lang="ts">
import { ContentWrap } from '@/components/ContentWrap'
import { Search } from '@/components/Search'
import { ElButton, ElMessageBox, ElTag, ElMessage } from 'element-plus'
import { Table } from '@/components/Table'
import { useTable } from '@/hooks/web/useTable'
import { getCurrentInstance, h, nextTick, provide, reactive, ref, unref } from 'vue'
import { useEmitt } from '@/hooks/web/useEmitt'
import { CrudSchema, useCrudSchemas } from '@/hooks/web/useCrudSchemas'
import { TableColumn } from '@/types/table'
import moment from 'moment'
import { Dialog } from '@/components/Dialog'
import {
  exportApplyListApi,
  getMyOrderAlltApi,
  delOrderListApi,
  publishApi,
  withdrawApplyApi,
  buyApi
} from '@/api/order'
import { WorkOrder } from '@/api/order/types'
import { isAuth } from '@/utils/is' // 鉴权
import { getAllUserListApi } from '@/api/user' // 获取所有用户
import { getAllDeptListApi } from '@/api/sys/dept' // 获取所有部门
import { listToTree } from '@/utils/tree'
import {
  LeaveApplyForm,
  BusinessTripApplyForm,
  OvertimeApplyForm,
  OutApplyForm,
  RejectedEdieForm,
  MaterialLendForm,
  ArticleUseForm,
  StampApplicationForm,
  PurchasingRequisitionForm,
  LeavePostponeForm,
  OvertimeTaskForm
} from '../Form'
import { useCache } from '@/hooks/web/useCache'
import {
  LeaveApproveDialog,
  BusinessTripApproveDialog,
  OutApproveDialog,
  OvertimeApproveDialog,
  ArticleUseDialog,
  MaterialLendDialog,
  PurchasingRequisitionDialog,
  StampApplicationDialog,
  LeavePostponeApprove,
  OvertimeTaskApprovelDialog
} from '../Approve'
import { LimitDailog } from '@/views/Components/limit'

defineOptions({
  name: 'MyOrderManage'
})

const { wsCache } = useCache()
const loginUserId = ref<string>(wsCache.get('userInfo').userId) // 登录用户id

const { register, tableObject, methods } = useTable<WorkOrder>({
  getListApi: getMyOrderAlltApi,
  delListApi: delOrderListApi,
  response: {
    list: 'rows',
    total: 'total'
  }
})

const { getList, setSearchParams } = methods

getList()
const { emitter } = useEmitt()
useEmitt({
  name: 'order',
  callback: (type: string) => {
    if (type === 'refresh') {
      tableObject.currentPage = 1
    }
    getList()
  }
})

//表单验证规则
const rules = reactive({})
//部门数据
let deptData = ref<any>([])
const filiteDeptData = ref<any>([])
//人员数据
const userData = ref<any>([])
//部门人员整合后的数据
const principalTree = ref<any>([])
// 向子组件发送值
provide('principalTree', principalTree)
//获取所有用户
const getAllUserlist = async () => {
  try {
    const res = await getAllDeptListApi({})
    const { data } = await getAllUserListApi({})
    deptData.value = res.data
    filiteDeptData.value = res.data.map((v) => {
      return {
        value: v.deptId,
        label: v.deptName
      }
    })
    userData.value = data
    userData.value.reverse()
    getprincipalTree()

    return data
  } catch (error) {
    console.log(error)
  }
}
const getprincipalTree = async () => {
  if (deptData.value.length) {
    deptData.value.forEach((deptItem: any) => {
      userData.value.forEach((userItem: any) => {
        if (deptItem.deptId === userItem.deptId) {
          deptItem.children.push({
            deptId: userItem.userId,
            deptName: userItem.nickName
          })
        }
      })
    })
    console.log()
    principalTree.value = listToTree(deptData.value, {
      id: 'deptId',
      children: 'children',
      pid: 'parentId'
    })
  }
}
getAllUserlist()
//工单类型
const orderType = ref<any[]>([
  {
    label: '请假申请',
    value: '1'
  },
  {
    label: '出差申请',
    value: '2'
  },
  {
    label: '加班申请',
    value: '3'
  },
  {
    label: '外出申请',
    value: '4'
  },
  {
    label: '物资外借',
    value: '5'
  },
  {
    label: '物品领用',
    value: '6'
  },
  {
    label: '用章申请',
    value: '7'
  },
  {
    label: '采购申请',
    value: '8'
  },
  {
    label: '调休顺延申请',
    value: '9'
  },
  {
    label: '加班任务',
    value: '10'
  }
])
const getOrderTypeLabel = (value: string): string => {
  let label = '--'
  if (value) {
    orderType.value.forEach((item: any) => {
      if (value.toString() === item.value) {
        label = item.label
      }
    })
  }

  return label
}

// 状态
const projectStatus = ref<any>([
  {
    label: '审核中',
    value: '2'
  },
  {
    label: '待归档',
    value: '5'
  },
  {
    label: '采购中',
    value: '6'
  },
  {
    label: '待采购',
    value: '12'
  },
  {
    label: '待领取/待借出',
    value: '9'
  },
  {
    label: '待归还',
    value: '10'
  },
  {
    label: '归档',
    value: '7'
  },
  {
    label: '已驳回',
    value: '4'
  },
  {
    label: '人事驳回',
    value: '8'
  }
])
const getStatusElTagType = (value: string): string => {
  let label = '--'
  if (value) {
    projectStatus.value.forEach((item: any) => {
      if (value === item.value) {
        label = item.label
      }
    })
    if (value === '3' || value === '11') {
      label = '审核中'
    }
  }

  return label
}
const crudSchemas = reactive<CrudSchema[]>([
  {
    field: 'index',
    label: '序号',
    minWidth: '60px'
  },
  {
    field: 'type',
    minWidth: '130px',
    label: '工单类型',
    formatter: (row: Recordable) => {
      return h('span', getOrderTypeLabel(row.type))
    },
    search: {
      show: true,
      component: 'Select',
      componentProps: {
        placeholder: '工单类型筛选',
        style: 'width: 10vw',
        options: orderType,
        filterable: true
      }
    }
  },
  {
    field: 'urgency',
    label: '紧急状态',
    minWidth: '120px',
    formatter: (row: Recordable, __: TableColumn, cellValue: string) => {
      return h(
        ElTag,
        {
          type:
            cellValue == '1'
              ? 'primary'
              : cellValue == '2'
              ? 'warning'
              : cellValue == '3'
              ? 'danger'
              : 'danger'
        },
        () => {
          return row.urgency == '1'
            ? '正常'
            : row.urgency == '2'
            ? '重要'
            : row.urgency == '3'
            ? '紧急'
            : '--'
        }
      )
    }
  },
  {
    field: 'status',
    label: '状态',
    minWidth: '140px',
    formatter: (row: Recordable, __: TableColumn, cellValue: string) => {
      return h(
        ElTag,
        {
          type:
            cellValue === '1'
              ? 'primary'
              : cellValue === '2'
              ? 'success'
              : cellValue === '3'
              ? 'success'
              : cellValue === '4'
              ? 'danger'
              : cellValue === '5'
              ? 'warning'
              : cellValue === '6'
              ? 'warning'
              : cellValue === '7'
              ? 'success'
              : cellValue === '8'
              ? 'danger'
              : cellValue === '9'
              ? 'warning'
              : cellValue === '10'
              ? 'warning'
              : cellValue === '11'
              ? 'success'
              : cellValue === '12'
              ? 'warning'
              : 'danger'
        },
        () => getStatusElTagType(cellValue)
      )
    },
    search: {
      show: true,
      component: 'Select',
      componentProps: {
        placeholder: '状态筛选',
        style: 'width: 10vw',
        filterable: true,
        options: projectStatus
      }
    }
  },
  {
    table: {
      show: false
    },
    field: 'deptId',
    minWidth: '120px',
    componentProps: {
      style: 'display: none'
    },
    label: '部门',
    formatter: (row: Recordable) => {
      return h('span', row.deptId ? row.deptId : '--')
    },
    search: {
      show: true,
      component: 'Select',
      componentProps: {
        placeholder: '部门筛选',
        style: 'width: 10vw',
        filterable: true,
        options: filiteDeptData
      }
    }
  },
  {
    field: 'createByName',
    minWidth: '120px',
    label: '申请人',
    formatter: (row: Recordable) => {
      return h('span', row.createByName ? row.createByName : '--')
    },
    search: {
      show: true,
      component: 'Cascader',
      componentProps: {
        placeholder: '申请人筛选',
        filterable: true,
        options: principalTree,
        style: 'width: 10vw',
        props: {
          label: 'deptName',
          value: 'deptId'
        }
      }
    }
  },

  {
    field: 'createTime',
    minWidth: '120px',
    label: '申请时间',
    formatter: (row: Recordable) => {
      return h('span', row.createTime ? moment(row.createTime).format('YYYY-MM-DD') : '--')
    },
    search: {
      show: true,
      component: 'DatePicker',
      componentProps: {
        style: 'width:16vw',
        type: 'daterange', // 组件type属性+
        format: 'YYYY-MM-DD',
        startPlaceholder: '开始时间',
        endPlaceholder: '结束时间'
      }
    }
  },
  {
    field: 'auditByName',
    minWidth: '120px',
    label: '审核人',
    formatter: (row: Recordable) => {
      return h('span', row.auditByName ? row.auditByName : '--')
    }
  },
  {
    field: 'auditDate',
    minWidth: '120px',
    label: '审核时间',
    formatter: (row: Recordable) => {
      return h('span', row.auditDate ? moment(row.auditDate).format('YYYY-MM-DD') : '--')
    }
  },
  {
    field: 'action',
    fixed: 'right',
    minWidth: '100',
    label: '操作',
    showOverflowTooltip: false
  }
])
const { allSchemas } = useCrudSchemas(crudSchemas)

//删除加载
const delLoading = ref(false)

//删除
const delData = async (row: WorkOrder | null, multiple: boolean) => {
  tableObject.currentRow = row
  const { delList, getSelections } = methods
  const selections = await getSelections()
  delLoading.value = true
  console.log(
    selections.map((v) => v.id),
    [tableObject.currentRow?.id as string]
  )
  await delList(
    multiple ? selections.map((v) => v.id) : [tableObject.currentRow?.id as string],
    multiple
  ).finally(() => {
    delLoading.value = false
  })
}

//工单类型
const orderExportType = ref<any[]>([
  {
    label: '物资外借',
    value: '5'
  },
  {
    label: '物品领用',
    value: '6'
  },
  {
    label: '用章申请',
    value: '7'
  },
  {
    label: '采购申请',
    value: '8'
  }
])

//导出
const ruleForm = ref<any>({ type: '', beginTime: '', endTime: '' })
// 导出
const selectDaterange = (type: string) => {
  ruleForm.value.type = type
  ruleForm.value.beginTime = ''
  ruleForm.value.endTime = ''
  dialogVisible.value = true
}

const dialogVisible = ref<boolean>(false)
const exLoading = ref<boolean>(false)
const sureLoading = ref<boolean>(false)
const exportForm = async () => {
  let beginTime = ruleForm.value.beginTime
    ? moment(ruleForm.value.beginTime[0]).format('YYYY-MM-DD') + ' 00:00:00'
    : ''
  let endTime = ruleForm.value.beginTime
    ? moment(ruleForm.value.beginTime[1]).format('YYYY-MM-DD') + ' 23:59:59'
    : ''
  let param = {
    type: ruleForm.value.type,
    beginTime: beginTime,
    endTime: endTime
  }
  sureLoading.value = true
  let fileName = ''
  orderExportType.value.forEach((item: any) => {
    if (item.value === ruleForm.value.type) {
      fileName = item.label
    }
  })
  await exportApplyListApi(param, fileName)
  sureLoading.value = false
  setTimeout(() => {
    dialogVisible.value = false
  }, 200)
}

//查询参数
const params = reactive<Recordable>({
  type: '',
  status: '',
  beginTime: '',
  endTime: '',
  deptId: '',
  createBy: ''
})

//搜索
const setSearchParamsSub = (param: Recordable) => {
  params.beginTime = param.createTime
    ? moment(param.createTime[0]).format('YYYY-MM-DD') + ' 00:00:00'
    : ''
  params.endTime = param.createTime
    ? moment(param.createTime[1]).format('YYYY-MM-DD') + ' 23:59:59'
    : ''

  params.createBy = param.createByName ? param.createByName[param.createByName.length - 1] : ''
  params.deptId = param.deptId
  params.type = param.type ? param.type : ''
  params.status = param.status ? param.status : ''
  setSearchParams(params)
}
//请假申请
const leaveApplyFormRef = ref<ComponentRef<typeof LeaveApplyForm>>()
//出差申请
const businessTripApplyFormRef = ref<ComponentRef<typeof BusinessTripApplyForm>>()
//加班申请
const overtimeApplyFormRef = ref<ComponentRef<typeof OvertimeApplyForm>>()
//外出申请
const outApplyFormRef = ref<ComponentRef<typeof OutApplyForm>>()
//调休顺延申请
const leavePostponeFormRef = ref<ComponentRef<typeof LeavePostponeForm>>()
// 物资领用
const materialLendFormRef = ref<ComponentRef<typeof MaterialLendForm>>()
// 物品领用
const articleUseFormRef = ref<ComponentRef<typeof ArticleUseForm>>()
// 用章
const stampApplicationFormRef = ref<ComponentRef<typeof StampApplicationForm>>()
// 采购申请
const purchasingRequisitionFormRef = ref<ComponentRef<typeof PurchasingRequisitionForm>>()
//加班任务
const overtimeTaskFormRef = ref<ComponentRef<typeof OvertimeTaskForm>>()

const rejectedEdieFormRef = ref<ComponentRef<typeof RejectedEdieForm>>()

const leaveApproveDialogRef = ref<ComponentRef<typeof LeaveApproveDialog>>()
const businessTripApproveDialogRef = ref<ComponentRef<typeof BusinessTripApproveDialog>>()
const outApproveDialogRef = ref<ComponentRef<typeof OutApproveDialog>>()
const overtimeApproveDialogRef = ref<ComponentRef<typeof OvertimeApproveDialog>>()

const articleUseDialogRef = ref<ComponentRef<typeof ArticleUseDialog>>()
const materialLendDialogRef = ref<ComponentRef<typeof MaterialLendDialog>>()
const purchasingRequisitionDialogRef = ref<ComponentRef<typeof PurchasingRequisitionDialog>>()
const stampApplicationDialogRef = ref<ComponentRef<typeof StampApplicationDialog>>()
const leavePostponeApproveRef = ref<ComponentRef<typeof LeavePostponeApprove>>()
const overtimeTaskApprovelRef = ref<ComponentRef<typeof OvertimeTaskApprovelDialog>>()

//编辑/详情
const action = (row: any, type: string) => {
  if (row.type === '1') {
    //请假申请
    openLeaveApplyForm(row.status, row.id, type)
  } else if (row.type === '2') {
    //出差申请
    openBusinessTripForm(row.status, row.id, type)
  } else if (row.type === '3') {
    //加班申请
    openOverTimeApplyForm(row.status, row.id, type)
  } else if (row.type === '4') {
    //外出申请
    openOutApplyForm(row.status, row.id, type)
  } else if (row.type === '5') {
    //物资外借
    openMaterialLendForm(row.status, row.id, type)
  } else if (row.type === '6') {
    //物品领用
    openArticleUseForm(row.status, row.id, type)
  } else if (row.type === '7') {
    //用章申请
    openStampApplicationForm(row.status, row.id, type)
  } else if (row.type === '8') {
    //采购申请
    openPurchasingRequisitionForm(row.status, row.id, type)
  } else if (row.type == '9') {
    //调休顺延申请
    openLeavePostponeForm(row.status, row.id, type)
  } else if (row.type == '10') {
    //加班任务
    overtimeTaskApprovel(row.status, row.id, type)
  }
}

//加班任务申请编辑/详情
const overtimeTaskApprovel = (status: string, orderId: string, type: string) => {
  if (type === 'edit') {
    if (status === '8') {
      //人资归档驳回
      rejectedEdieFormRef.value.openDrawer(orderId)
    } else {
      overtimeTaskFormRef.value.openDrawer(orderId, type)
    }
  } else if (type === 'see') {
    if (status === '1') {
      overtimeTaskFormRef.value.openDrawer(orderId, type)
    } else {
      overtimeTaskApprovelRef.value.openDrawer(orderId, type)
    }
  }
}

//调休顺延申请编辑/详情
const openLeavePostponeForm = (status: string, orderId: string, type: string) => {
  if (type === 'edit') {
    if (status === '8') {
      //人资归档驳回
      rejectedEdieFormRef.value.openDrawer(orderId)
    } else {
      leavePostponeFormRef.value.openDrawer(orderId, type)
    }
  } else if (type === 'see') {
    if (status === '1') {
      leavePostponeFormRef.value.openDrawer(orderId, type)
    } else {
      leavePostponeApproveRef.value.openDrawer(orderId, type)
    }
  }
}

//请假申请编辑/详情
const openLeaveApplyForm = (status: string, orderId: string, type: string) => {
  if (type === 'edit') {
    if (status === '8') {
      //人资归档驳回
      rejectedEdieFormRef.value.openDrawer(orderId)
    } else {
      leaveApplyFormRef.value.openDrawer(orderId, type)
    }
  } else if (type === 'see') {
    if (status === '1') {
      leaveApplyFormRef.value.openDrawer(orderId, type)
    } else {
      leaveApproveDialogRef.value.openDrawer(orderId, type)
    }
  }
}

//出差申请编辑/详情
const openBusinessTripForm = (status: string, orderId: string, type: string) => {
  if (type === 'edit') {
    if (status === '8') {
      //人资归档驳回
      rejectedEdieFormRef.value.openDrawer(orderId)
    } else {
      businessTripApplyFormRef.value.openDrawer(orderId, type)
    }
  } else if (type === 'see') {
    if (status === '1') {
      businessTripApplyFormRef.value.openDrawer(orderId, type)
    } else {
      businessTripApproveDialogRef.value.openDrawer(orderId, type)
    }
  }
}

//加班申请编辑/详情
const openOverTimeApplyForm = (status: string, orderId: string, type: string) => {
  if (type === 'edit') {
    if (status === '8') {
      //人资归档驳回
      rejectedEdieFormRef.value.openDrawer(orderId)
    } else {
      overtimeApplyFormRef.value.openDrawer(orderId, type)
    }
  } else if (type === 'see') {
    if (status === '1') {
      overtimeApplyFormRef.value.openDrawer(orderId, type)
    } else {
      overtimeApproveDialogRef.value.openDrawer(orderId, type)
    }
  }
}

//外出申请编辑/详情
const openOutApplyForm = (status: string, orderId: string, type: string) => {
  if (type === 'edit') {
    if (status === '8') {
      //人资归档驳回
      rejectedEdieFormRef.value.openDrawer(orderId)
    } else {
      outApplyFormRef.value.openDrawer(orderId, type)
    }
  } else if (type === 'see') {
    if (status === '1') {
      outApplyFormRef.value.openDrawer(orderId, type)
    } else {
      outApproveDialogRef.value.openDrawer(orderId, type)
    }
  }
}

// 物资外借
const openMaterialLendForm = (status: string, orderId: string, type: string) => {
  if (type === 'edit') {
    if (status === '8') {
      //人资归档驳回
      rejectedEdieFormRef.value.openDrawer(orderId)
    } else {
      materialLendFormRef.value.openDrawer(orderId, type)
    }
  } else if (type === 'see') {
    if (status === '1') {
      materialLendFormRef.value.openDrawer(orderId, type)
    } else {
      materialLendDialogRef.value.openDrawer(orderId, type)
    }
  }
}

// 物品领用
const openArticleUseForm = (status: string, orderId: string, type: string) => {
  if (type === 'edit') {
    if (status === '8') {
      //人资归档驳回
      rejectedEdieFormRef.value.openDrawer(orderId)
    } else {
      articleUseFormRef.value.openDrawer(orderId, type)
    }
  } else if (type === 'see') {
    if (status === '1') {
      articleUseFormRef.value.openDrawer(orderId, type)
    } else {
      articleUseDialogRef.value.openDrawer(orderId, type)
    }
  }
}

// 用章申请
const openStampApplicationForm = (status: string, orderId: string, type: string) => {
  if (type === 'edit') {
    if (status === '8') {
      //人资归档驳回
      rejectedEdieFormRef.value.openDrawer(orderId)
    } else {
      stampApplicationFormRef.value.openDrawer(orderId, type)
    }
  } else if (type === 'see') {
    if (status === '1') {
      stampApplicationFormRef.value.openDrawer(orderId, type)
    } else {
      stampApplicationDialogRef.value.openDrawer(orderId, type)
    }
  }
}

// 采购申请
const openPurchasingRequisitionForm = (status: string, orderId: string, type: string) => {
  if (type === 'edit') {
    if (status === '8') {
      //人资归档驳回
      rejectedEdieFormRef.value.openDrawer(orderId)
    } else {
      purchasingRequisitionFormRef.value.openDrawer(orderId, type)
    }
  } else if (type === 'see') {
    if (status === '1') {
      purchasingRequisitionFormRef.value.openDrawer(orderId, type)
    } else {
      purchasingRequisitionDialogRef.value.openDrawer(orderId, type)
    }
  }
}

//发布
const releaseApply = (row: any) => {
  ElMessageBox.confirm('是否发布该信息？', '发布信息提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
    autofocus: false
  }).then(async () => {
    const params = { id: row.id }
    const res = await publishApi(params)
    if (res) {
      nextTick()
      ElMessage.success('发布信息成功')
      getList()
      emitter.emit('order', 'update')
    }
  })
}

//撤回
const withdrawApply = (row: any) => {
  ElMessageBox.confirm('是否撤回该信息？', '撤回信息提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
    autofocus: false
  }).then(async () => {
    const params = { id: row.id }
    const res = await withdrawApplyApi(params)
    if (res) {
      nextTick()
      ElMessage.success('撤回信息成功')
      getList()
    }
  })
}

//采购
const procure = (row: any) => {
  ElMessageBox.confirm('是否要进行采购？', '采购提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
    autofocus: false
  }).then(async () => {
    const params = { id: row.id }
    const res = await buyApi(params)
    if (res) {
      nextTick()
      ElMessage.success('采购成功')
      getList()
    }
  })
}
</script>

<template>
  <ContentWrap Showtitle="工单管理">
    <template #ContentWrapTitle>
      <div class="operation-button-container">
        <el-popover placement="bottom" trigger="hover">
          <template #reference>
            <ElButton
              :loading="exLoading"
              class="other exportBtn"
              plain
              v-hasPermi="'order:myOrderManage:export'"
            >
              <template #icon>
                <Icon :size="14" icon="svg-icon:exportBut" />
              </template>
              导出
            </ElButton>
          </template>
          <div class="upload-btn" v-for="item in orderExportType" :key="item.value">
            <ElButton class="w-full" @click="selectDaterange(item.value)"
              >{{ item.label }}
            </ElButton>
          </div>
        </el-popover>
      </div>
    </template>
    <Table
      v-model:pageSize="tableObject.pageSize"
      v-model:currentPage="tableObject.currentPage"
      :columns="allSchemas.tableColumns"
      :data="tableObject.tableList"
      :loading="tableObject.loading"
      :border="true"
      :selection="false"
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
          v-if="isAuth('order:myOrderManage:query')"
          :schema="allSchemas.searchSchema"
          @search="setSearchParamsSub"
          @reset="setSearchParamsSub"
        />
      </template>
      <template #index="{ $index }">
        <span>{{
          $index + 1 + tableObject.pageSize * (tableObject.currentPage - 1)
        }}</span></template
      >

      <template #action="{ row }">
        <ElButton
          class="btn-default"
          :text="true"
          @click="action(row, 'see')"
          v-if="isAuth('order:myOrderManage:detail')"
        >
          详情
        </ElButton>
      </template>
    </Table>
  </ContentWrap>
  <Dialog v-model="dialogVisible" title="选择时间" :width="'35%'" :maxHeight="'auto'">
    <el-form
      :model="ruleForm"
      :rules="rules"
      ref="formRef"
      label-width="100px"
      class="demo-ruleForm"
    >
      <el-row>
        <el-col :span="24">
          <el-form-item label="起止时间" prop="beginTime">
            <el-date-picker
              v-model="ruleForm.beginTime"
              type="daterange"
              start-placeholder="开始时间"
              end-placeholder="结束时间"
              format="YYYY-MM-DD"
            />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <template #footer>
      <ElButton type="primary" :loading="sureLoading" @click="exportForm"> 确定</ElButton>
      <ElButton @click="dialogVisible = false">取消</ElButton>
    </template>
  </Dialog>
  <LeaveApplyForm title="请假申请" ref="leaveApplyFormRef" />
  <BusinessTripApplyForm title="出差申请" ref="businessTripApplyFormRef" />
  <OvertimeApplyForm title="加班申请" ref="overtimeApplyFormRef" />
  <OutApplyForm title="外出申请" ref="outApplyFormRef" />
  <LeaveApproveDialog ref="leaveApproveDialogRef" title="请假申请" />
  <BusinessTripApproveDialog ref="businessTripApproveDialogRef" title="出差申请" />
  <OutApproveDialog ref="outApproveDialogRef" title="外出申请" />
  <OvertimeApproveDialog ref="overtimeApproveDialogRef" title="加班申请" />
  <RejectedEdieForm ref="rejectedEdieFormRef" title="详细事由" />
  <LeavePostponeForm ref="leavePostponeFormRef" />
  <LeavePostponeApprove ref="leavePostponeApproveRef" title="调休顺延申请" />
  <OvertimeTaskForm ref="overtimeTaskFormRef" />

  <ArticleUseForm ref="articleUseFormRef" title="物品领用" />
  <MaterialLendForm ref="materialLendFormRef" title="物资外借" />
  <StampApplicationForm ref="stampApplicationFormRef" title="用章申请" />
  <PurchasingRequisitionForm ref="purchasingRequisitionFormRef" title="采购申请" />
  <MaterialLendDialog ref="materialLendDialogRef" title="物资外借" />
  <ArticleUseDialog ref="articleUseDialogRef" title="物品领用" />
  <PurchasingRequisitionDialog ref="purchasingRequisitionDialogRef" title="采购申请" />
  <StampApplicationDialog ref="stampApplicationDialogRef" title="用章申请" />
  <OvertimeTaskApprovelDialog ref="overtimeTaskApprovelRef" />
  <LimitDailog routerName="MyOrderManage" />
</template>
