<script setup lang="ts">
import { ContentWrap } from '@/components/ContentWrap'
import { Search } from '@/components/Search'
import { useCache } from '@/hooks/web/useCache'
import { ElButton, ElMessageBox, ElTag, ElMessage } from 'element-plus'
import { Table } from '@/components/Table'
import { useTable } from '@/hooks/web/useTable'
import { getCurrentInstance, h, nextTick, reactive, ref, unref, provide } from 'vue'
import { useEmitt } from '@/hooks/web/useEmitt'
import { CrudSchema, useCrudSchemas } from '@/hooks/web/useCrudSchemas'
import { TableColumn } from '@/types/table'
import moment from 'moment'
import { getOrderAuditListApi, exportApplyListApi, archiveOrderApi } from '@/api/order'
import { WorkOrder } from '@/api/order/types'
import { isAuth } from '@/utils/is' // 鉴权
import { getAllUserListApi } from '@/api/user' // 获取所有用户
import { getAllDeptListApi } from '@/api/sys/dept' // 获取所有部门
import { listToTree } from '@/utils/tree'
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
import { Dialog } from '@/components/Dialog'
import { LimitDailog } from '@/views/Components/limit'

defineOptions({
  name: 'OrderApprove'
})

const { wsCache } = useCache()

// 综合部普通员工可见
const rolesFlag = ref(false)
// if (wsCache.get('userInfo').roles.length) {
//   let flag = wsCache.get('userInfo').roles.some((v) => {
//     return v.roleId == 166
//   })
//   rolesFlag.value = flag
// }

const { proxy } = getCurrentInstance() as any
const { role } = proxy.useDict('role')

const checkRolesFlag = () => {
  role.value.forEach((element: any) => {
    if (element.label == '综合部普通员工') {
      if (wsCache.get('userInfo').roles.length) {
        let flag = wsCache.get('userInfo').roles.some((v) => {
          return v.roleId == Number(element.value)
        })
        rolesFlag.value = flag
      }
    }
  })
  return rolesFlag.value
}

checkRolesFlag()

const { register, tableObject, methods } = useTable<WorkOrder>({
  getListApi: getOrderAuditListApi,
  response: {
    list: 'rows',
    total: 'total'
  }
})

const { getList, setSearchParams } = methods

getList()

useEmitt({
  name: 'order',
  callback: (type: string) => {
    if (type === 'refresh' || type === 'update') {
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
const projectStatus0 = ref<any>([
  {
    label: '待审核',
    value: '2'
  },
  {
    label: '已审核',
    value: '-1'
  }
])

// 状态
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
    label: '已审核',
    value: '-1'
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
      if (value === '3' || value === '11') {
        label = '审核中'
      }
    })
  }
  return label
}
const crudSchemas = reactive<CrudSchema[]>([
  {
    field: 'index',
    label: '序号',
    minWidth: '70px'
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
    minWidth: '130px',
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
        options: projectStatus0
      }
    }
  },
  {
    field: 'createByName',
    minWidth: '100px',
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
        style: 'width: 11vw',
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
        style: 'width: 16vw',
        type: 'daterange', // 组件type属性+
        format: 'YYYY-MM-DD',
        startPlaceholder: '开始时间',
        endPlaceholder: '结束时间'
      }
    }
  },
  {
    field: 'auditByName',
    minWidth: '100px',
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
    minWidth: '200px',
    label: '操作',
    showOverflowTooltip: false
  }
])
const { allSchemas } = useCrudSchemas(crudSchemas)

//查询参数
const params = reactive<Recordable>({
  type: '',
  status: '',
  beginTime: '',
  endTime: '',
  createBy: ''
})

//搜索
const setSearchParamsSub = (param: Recordable) => {
  let beginTime = param.createTime
    ? moment(param.createTime[0]).format('YYYY-MM-DD') + ' 00:00:00'
    : ''
  let endTime = param.createTime
    ? moment(param.createTime[1]).format('YYYY-MM-DD') + ' 23:59:59'
    : ''
  params.beginTime = beginTime
  params.endTime = endTime
  params.type = param.type ? param.type : ''
  params.status = param.status ? param.status : ''
  params.createBy = param.createByName ? param.createByName[param.createByName.length - 1] : ''
  setSearchParams(params)
}

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

const archived = ref<boolean>(false)
//详情/审核/归档
const action = async (row: any, type: string) => {
  if (row.type === '1') {
    //请假申请
    leaveApproveDialogRef.value.openDrawer(row.id, type)
  } else if (row.type === '2') {
    //出差申请
    businessTripApproveDialogRef.value.openDrawer(row.id, type)
  } else if (row.type === '3') {
    //加班申请
    overtimeApproveDialogRef.value.openDrawer(row.id, type)
  } else if (row.type === '4') {
    //外出申请
    outApproveDialogRef.value.openDrawer(row.id, type)
  } else if (row.type === '5') {
    //物资外借
    materialLendDialogRef.value.openDrawer(row.id, type)
  } else if (row.type === '6') {
    //物品领用
    articleUseDialogRef.value.openDrawer(row.id, type)
  } else if (row.type === '7') {
    //用章申请
    stampApplicationDialogRef.value.openDrawer(row.id, type)
  } else if (row.type === '8') {
    if (type == 'archive') {
      archived.value = true
      let params = {
        orderId: row.id,
        orderStep: '已归档'
      }
      const res = await archiveOrderApi(params)
        .catch(() => {})
        .finally(() => {
          archived.value = false
        })
      if (res) {
        ElMessage.success('归档成功')
        getList()
      }
    } else {
      purchasingRequisitionDialogRef.value.openDrawer(row.id, type)
    }
  } else if (row.type === '9') {
    //调休顺延申请
    leavePostponeApproveRef.value.openDrawer(row.id, type)
  } else if (row.type === '10') {
    //加班任务
    overtimeTaskApprovelRef.value.openDrawer(row.id, type)
  }
}

//导出
const ruleForm = ref<any>({ type: '', beginTime: '', endTime: '' })
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

const selectDaterange = (type: string) => {
  ruleForm.value.type = type
  ruleForm.value.beginTime = ''
  ruleForm.value.endTime = ''
  dialogVisible.value = true
}

//表单验证规则
const rules = reactive({})

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
</script>

<template>
  <ContentWrap Showtitle="工单审批">
    <template #ContentWrapTitle>
      <div class="operation-button-container">
        <el-popover placement="bottom" trigger="hover">
          <template #reference>
            <ElButton
              :loading="exLoading"
              class="other exportBtn"
              plain
              v-hasPermi="'order:orderApprove:export'"
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
      :isShowCell="isShowCell"
      :header-align="'center'"
      :cotentAlign="'center'"
      :pagination="{
        total: tableObject.total
      }"
      :selection="false"
      @sort-change="tableSortChange"
      @select-all="selectAll"
      @select="selectOne"
      @register="register"
    >
      <template #operateBtnLeft>
        <Search
          v-if="isAuth('order:orderApprove:query')"
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
          v-if="isAuth('order:orderApprove:detail')"
        >
          详情
        </ElButton>
        <ElButton
          class="btn-default"
          :text="true"
          @click="action(row, 'lend')"
          v-if="
            isAuth('order:orderApprove:lend') &&
            (row.type == '5' || row.type == '7') &&
            row.status == '9' &&
            checkRolesFlag()
          "
        >
          借出
        </ElButton>

        <ElButton
          class="btn-default"
          :text="true"
          @click="action(row, 'receive')"
          v-if="
            isAuth('order:orderApprove:receive') &&
            row.type == '6' &&
            row.status == '9' &&
            checkRolesFlag()
          "
        >
          领用
        </ElButton>

        <ElButton
          class="btn-default"
          :text="true"
          @click="action(row, 'approve')"
          v-if="isAuth('order:orderApprove:approve') && row.audit"
        >
          审核
        </ElButton>

        <ElButton
          class="btn-default"
          :text="true"
          @click="action(row, 'restitution')"
          v-if="
            isAuth('order:orderApprove:restitution') &&
            (row.type == '5' || row.type == '7') &&
            row.status == '10' &&
            checkRolesFlag()
          "
        >
          归还
        </ElButton>

        <ElButton
          class="btn-default"
          :text="true"
          :disabled="archived"
          @click="action(row, 'archive')"
          v-if="isAuth('order:orderApprove:file') && row.end && row.status != '10'"
        >
          归档
        </ElButton>
      </template>
    </Table>
  </ContentWrap>
  <LeaveApproveDialog ref="leaveApproveDialogRef" title="请假申请" />
  <BusinessTripApproveDialog ref="businessTripApproveDialogRef" title="出差申请" />
  <OutApproveDialog ref="outApproveDialogRef" title="外出申请" />
  <OvertimeApproveDialog ref="overtimeApproveDialogRef" title="加班申请" />

  <MaterialLendDialog ref="materialLendDialogRef" title="物资外借" />
  <ArticleUseDialog ref="articleUseDialogRef" title="物品领用" />
  <StampApplicationDialog ref="stampApplicationDialogRef" title="用章申请" />
  <PurchasingRequisitionDialog ref="purchasingRequisitionDialogRef" title="采购申请" />
  <LeavePostponeApprove ref="leavePostponeApproveRef" title="调休顺延申请" />
  <OvertimeTaskApprovelDialog ref="overtimeTaskApprovelRef" />
  <Dialog
    v-model="dialogVisible"
    title="选择时间"
    :width="'35%'"
    @closed="closePermissionDialog"
    :maxHeight="'auto'"
  >
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

  <LimitDailog routerName="OrderApprove" />
</template>

<style scoped>
.upload-btn {
  margin-bottom: 5px;
}
</style>
