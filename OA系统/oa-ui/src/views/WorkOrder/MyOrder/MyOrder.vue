<script setup lang="ts">
import { ContentWrap } from '@/components/ContentWrap'
import { Search } from '@/components/Search'
import { ElButton, ElMessageBox, ElTag, ElMessage } from 'element-plus'
import { Table } from '@/components/Table'
import { useTable } from '@/hooks/web/useTable'
import { getCurrentInstance, h, nextTick, provide, reactive, ref, unref, computed } from 'vue'
import { useEmitt } from '@/hooks/web/useEmitt'
import { CrudSchema, useCrudSchemas } from '@/hooks/web/useCrudSchemas'
import { TableColumn } from '@/types/table'
import moment from 'moment'
import {
  getMyOrderListApi,
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
  name: 'MyOrder'
})

const { wsCache } = useCache()
const loginUserId = ref<string>(wsCache.get('userInfo').userId) // 登录用户id

const isLeader = computed(() => {
  let flag = false
  if (wsCache.get('userInfo')) {
    if (wsCache.get('userInfo').dept.leader == wsCache.get('userInfo').userId) {
      flag = true
    }
  }
  return flag
})

const { register, tableObject, methods } = useTable<WorkOrder>({
  getListApi: getMyOrderListApi,
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

//部门数据
let deptData = ref<any>([])
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
//1未发布 2已发布 3审核中 4已驳回  5待归档 6采购中 7归档 8人事驳回 9待领取/待借出 10待归还 11财务经理审核 12待采购
const projectStatus = ref<any>([
  {
    label: '未发布',
    value: '1'
  },
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
    minWidth: '100px',
    label: '工单类型',
    formatter: (row: Recordable) => {
      return h('span', getOrderTypeLabel(row.type))
    },
    search: {
      show: true,
      component: 'Select',
      componentProps: {
        placeholder: '工单类型筛选',
        style: 'width: 11vw',
        options: orderType,
        filterable: true
      }
    }
  },
  {
    field: 'urgency',
    label: '紧急状态',
    minWidth: '90px',
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
    minWidth: '100px',
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
        style: 'width: 11vw',
        filterable: true,
        options: projectStatus
      }
    }
  },
  {
    field: 'createByName',
    minWidth: '90px',
    label: '申请人',
    formatter: (row: Recordable) => {
      return h('span', row.createByName ? row.createByName : '--')
    }
  },
  {
    field: 'createTime',
    minWidth: '110px',
    label: '申请时间',
    formatter: (row: Recordable) => {
      return h('span', row.createTime ? moment(row.createTime).format('YYYY-MM-DD') : '--')
    }
  },
  {
    field: 'auditByName',
    minWidth: '90px',
    label: '审核人',
    formatter: (row: Recordable) => {
      return h('span', row.auditByName ? row.auditByName : '--')
    }
  },
  {
    field: 'auditDate',
    minWidth: '110px',
    label: '审核时间',
    formatter: (row: Recordable) => {
      return h('span', row.auditDate ? moment(row.auditDate).format('YYYY-MM-DD') : '--')
    }
  },
  {
    field: 'action',
    fixed: 'right',
    minWidth: '270px',
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

//查询参数
const params = reactive<Recordable>({
  type: '',
  status: ''
})

//搜索
const setSearchParamsSub = (param: Recordable) => {
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

// 物资领用
const materialLendFormRef = ref<ComponentRef<typeof MaterialLendForm>>()
// 物品领用
const articleUseFormRef = ref<ComponentRef<typeof ArticleUseForm>>()
// 用章
const stampApplicationFormRef = ref<ComponentRef<typeof StampApplicationForm>>()
// 采购申请
const purchasingRequisitionFormRef = ref<ComponentRef<typeof PurchasingRequisitionForm>>()
//调休顺延申请
const leavePostponeFormRef = ref<ComponentRef<typeof LeavePostponeForm>>()
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
      rejectedEdieFormRef.value.openDrawer(orderId, false)
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
      rejectedEdieFormRef.value.openDrawer(orderId, false)
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
      rejectedEdieFormRef.value.openDrawer(orderId, true)
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
      rejectedEdieFormRef.value.openDrawer(orderId, true)
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
      rejectedEdieFormRef.value.openDrawer(orderId, true)
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
      rejectedEdieFormRef.value.openDrawer(orderId, true)
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
      rejectedEdieFormRef.value.openDrawer(orderId, true)
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
      rejectedEdieFormRef.value.openDrawer(orderId, true)
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
      rejectedEdieFormRef.value.openDrawer(orderId, true)
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
      rejectedEdieFormRef.value.openDrawer(orderId, true)
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
  <ContentWrap Showtitle="我的工单">
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
          v-if="isAuth('order:myOrder:query')"
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
          v-if="isAuth('order:myOrder:detail')"
        >
          详情
        </ElButton>
        <ElButton
          class="btn-default"
          :text="true"
          @click="action(row, 'edit')"
          v-if="
            isAuth('order:myOrder:edit') &&
            (row.status === '1' || row.status === '4' || row.status === '8') &&
            loginUserId == row.createBy
          "
        >
          编辑
        </ElButton>
        <ElButton
          class="btn-default"
          :text="true"
          @click="releaseApply(row)"
          v-if="isAuth('order:myOrder:edit') && row.status == '1' && loginUserId == row.createBy"
        >
          发布
        </ElButton>
        <ElButton
          class="btn-default"
          :text="true"
          @click="delData(row, false)"
          v-if="
            isAuth('order:myOrder:delete') &&
            (row.status == '1' || row.status == '4' || row.status == '8') &&
            loginUserId == row.createBy
          "
        >
          删除
        </ElButton>
        <ElButton
          class="btn-default"
          :text="true"
          @click="withdrawApply(row)"
          v-if="
            isAuth('order:myOrder:withdraw') &&
            (row.status === '2' || (row.status === '3' && isLeader)) &&
            loginUserId == row.createBy
          "
        >
          撤回
        </ElButton>
        <ElButton
          class="btn-default"
          :text="true"
          @click="procure(row)"
          v-if="
            isAuth('order:myOrder:procure') && row.status === '12' && loginUserId == row.createBy
          "
        >
          采购
        </ElButton>
      </template>
    </Table>
  </ContentWrap>
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
  <LimitDailog routerName="MyOrder" />
</template>
