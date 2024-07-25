<!-- 培育项目 -->
<script setup lang="ts">
import './ssxm.less'
import {
  ImplementForm, // 新增/编辑
  ArrprovalInfo, // 审批
  ArrprovalInfoChange, // 项目变更审批
  SupplementForm,
  SatisticsMenu,
  ProjectDetail
} from './components/index'
import { nextTick } from 'vue'
import { ContentWrap } from '@/components/ContentWrap'
import { Search } from '@/components/Search'
import { ElTag, ElButton, ElMessage } from 'element-plus'
import { Table } from '@/components/Table'
import { Dialog } from '@/components/Dialog'
import { listToTree } from '@/utils/tree'
import { TableColumn } from '@/types/table'
import { LimitDailog } from '@/views/Components/limit'
import {
  getImplementListApi,
  countHatchImplementApi,
  exportTableListApi,
  getEstablishApi
} from '@/api/project/ssxm'
import moment from 'moment'
import { userSelectByPmApi } from '@/api/user' // 获取所有用户
import { getAllDeptListApi } from '@/api/sys/dept' // 获取所有部门
import { useTable } from '@/hooks/web/useTable'
import { ImplementData, ImplementCount } from '@/api/project/ssxm/types'
import { h, reactive, ref, unref, provide, computed, onMounted, watch } from 'vue'
import { useEmitt } from '@/hooks/web/useEmitt'
import { useAppStore } from '@/store/modules/app'
import { CrudSchema, useCrudSchemas } from '@/hooks/web/useCrudSchemas'
import { isAuth } from '@/utils/is'
import { useCache } from '@/hooks/web/useCache'
import { useRoute } from 'vue-router'
import { AduitRecordTable, RemindView } from '../components'
import {
  implementStatus,
  getProjectStatusLabel,
  projectType,
  getProjectTypeLabel,
  purchaseMethod
} from '../config/config'

defineOptions({
  name: 'Ssxm'
})
const route = useRoute()

const appStore = useAppStore()
// 视窗高度
const documentClientHeight = computed(() => appStore.getDocumentClientHeight)
const { wsCache } = useCache()
const loginUserId = ref<string>(wsCache.get('userInfo').userId) // 登录用户id
const deptInfo = ref<string>(wsCache.get('userInfo').dept) // 登录用户部门信息
const isFinance = ref<boolean>(JSON.stringify(deptInfo).indexOf('财务部') > -1) // 是否是财务部
// 注册
onMounted(() => {
  resetTableHeight()
})
useEmitt({
  name: 'window',
  callback: (type: string) => {
    if (type === 'resize') {
      resetTableHeight()
    }
  }
})

useEmitt({
  name: 'ssxm',
  callback: (type: string) => {
    if (type === 'refresh') {
      resetList()
    }
  }
})
// 重置表格
const resetList = () => {
  isActive.value = ''
  statusVal.value = ''
  let params = {
    pId: '',
    year: '',
    projectTitle: '',
    projectType: '',
    status: '-1',
    projectManager: ''
  }
  if (searchRef.value) {
    let param = {
      pId: '',
      year: '',
      projectTitle: '',
      projectType: '',
      status: '',
      projectManager: ''
    }
    searchRef.value.setValues(param)
  }
  setSearchParamsSub(params)
  getAllDeptlist()
}

const statusVal = ref('')
const defaultHeight = ref(0)
const resetTableHeight = () => {
  const overView = getOverViewWrapper('.satistics_menu-contentWrap')
  const overViewWrapper = getOverViewWrapper('#v-tags-view')
  const footer = getOverViewWrapper('.v-footer')
  const trigger = getOverViewWrapper('.hover-trigger-view')
  const titleH = isFinance.value ? 55 : 0
  defaultHeight.value =
    documentClientHeight.value - overViewWrapper - overView - trigger - footer - 150 - titleH
}

const getOverViewWrapper = (dom: string): number => {
  let topH = 0
  const checkboxWrapper = document.querySelector(dom)
  if (checkboxWrapper) {
    topH = checkboxWrapper.clientHeight
  }
  return topH
}

// 操作方式
const isAction = ref<string>('')
const supplementTitle = ref<string>('项目经理补充')
let deptData = ref<any>([])
const userData = ref<any>([])
const principalTree = ref<any>([])
// 向子组件发送值
provide('principalTree', principalTree)
//获取所有部门
const getAllDeptlist = async () => {
  getAllUserlist()
}

//获取所有用户
const getAllUserlist = async () => {
  try {
    const res = await getAllDeptListApi({})
    const { data } = await userSelectByPmApi({})
    deptData.value = res.data
    userData.value = data
    userData.value.map((item: any, index: number) => {
      if (item.nickName === '张保国' && item.postStr === '董事长') {
        userData.value.unshift(userData.value.splice(index, 1)[0])
      }
    })
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
            deptName: userItem.nickName,
            postStr: userItem.postStr
          })
        }
      })
    })

    deptData.value = deptData.value.filter((v) => {
      return v.children.length
    })
    principalTree.value = listToTree(deptData.value, {
      id: 'deptId',
      children: 'children',
      pid: 'parentId'
    })
  }
}
const { register, tableObject, methods } = useTable<ImplementData>({
  getListApi: getImplementListApi,
  response: {
    list: 'data.rows',
    total: 'data.total'
  },
  defaultParams: {
    fmLook: isFinance.value ? '1' : ''
  }
})

const { getList, setSearchParams } = methods

// 实施数据
let implementCount = ref<any>({
  sszxm: 0, // 实施总项目
  ssz: 0, // 实施中
  yys: 0, // 已验收
  yhkzsh: 0, // 已回款转售后
  yhkzsh: 0, // 结束转售后
  spz: 0
})

// 实施数据统计
const getCountHatch = async () => {
  try {
    const res = await countHatchImplementApi()
    implementCount.value = res.data
  } catch (error) {
    console.log(error)
  }
}

const params = reactive<Recordable>({
  year: '', // 年份
  projectManager: '', // 负责人id
  projectTitle: '', // 项目名称
  ownerName: '', // 用户名称
  status: '-1' // 项目状态
})
//
const changeprincipal = (val: any) => {
  params.principalPerson = String(val[val.length - 1])
}
const ArrprovalInfoRef = ref<any>()
const SupplementFormRef = ref<any>()
const ArrprovalInfoChangeRef = ref<any>()

// 项目总览点击状态
const isActive = ref('sszxm')
useEmitt({
  name: 'getList',
  callback: (type: string) => {
    if (type === 'add') {
      tableObject.currentPage = 1
    }
    resetList()
  }
})
const statusValue = ref('')

const crudSchemas = reactive<CrudSchema[]>([
  {
    field: 'index',
    label: '序号',
    minWidth: '60px',
    formatter: (row: Recordable, __: TableColumn, cellValue: string, index: number) => {
      let itemIndex = index + 1 + tableObject.pageSize * (tableObject.currentPage - 1)
      return h('span', itemIndex)
    }
  },
  {
    field: 'year',
    label: '年份',
    minWidth: '80px',
    search: {
      show: true,
      component: 'DatePicker',
      componentProps: {
        style: 'width: 10vw',
        placeholder: '年份筛选',
        type: 'year',
        filterable: true
      }
    },
    formatter: (row: Recordable) => {
      return h('span', row.year ? row.year : '--')
    }
  },
  {
    field: 'itemNumber',
    label: '项目编号',
    search: {
      show: false
    },
    minWidth: '135px',
    formatter: (row: Recordable) => {
      return h('span', row.itemNumber ? row.itemNumber : '--')
    }
  },
  {
    field: 'projectTitle',
    label: '项目名称',
    minWidth: '160px',
    formatter: (row: Recordable) => {
      return h('span', row.projectTitle ? row.projectTitle : '--')
    },
    search: {
      show: true,
      component: 'Input',
      value: '',
      componentProps: {
        style: 'width: 10vw',
        placeholder: '项目名称/编号筛选'
      }
    }
  },
  {
    field: 'progressStatus',
    label: '提醒',
    minWidth: '165px',
    formatter: (row: Recordable) => {
      return h(RemindView, {
        progressStatus: row.progressStatus
      })
    }
  },
  {
    field: 'status',
    label: '状态',
    minWidth: '145px',
    formatter: (row: Recordable, __: TableColumn, cellValue: string) => {
      return h(
        ElTag,
        {
          type:
            cellValue === '0'
              ? 'success'
              : cellValue === '1'
              ? 'primary'
              : cellValue === '2'
              ? 'success'
              : cellValue === '3'
              ? 'info'
              : cellValue === '4' || cellValue === '6'
              ? 'warning'
              : cellValue === '5'
              ? 'danger'
              : 'danger'
        },
        () => getProjectStatusLabel('3', cellValue) || '--'
      )
    },
    search: {
      show: JSON.stringify(deptInfo).indexOf('财务部') == -1,
      component: 'Select',
      componentProps: {
        value: statusValue.value,
        style: 'width: 10vw',
        placeholder: '状态筛选',
        filterable: true,
        options: implementStatus
      }
    }
  },
  {
    field: 'projectType',
    minWidth: '90px',
    label: '所属行业',
    formatter: (row: Recordable) => {
      return h('span', getProjectTypeLabel(row.projectType) || '--')
    },
    search: {
      show: true,
      component: 'Select',
      componentProps: {
        placeholder: '所属行业筛选',
        style: 'width: 10vw',
        options: projectType,
        filterable: true
      }
    }
  },
  {
    field: 'projectAffiliation',
    minWidth: '90px',
    label: '项目属性',
    formatter: (row: Recordable) => {
      return h(
        'span',
        row.projectAffiliation === '1' ? '直签' : row.projectAffiliation === '2' ? '转签' : '--'
      )
    }
  },
  {
    field: 'contractMoney',
    minWidth: '130px',
    label: '合同金额(万元)',
    formatter: (row: Recordable) => {
      return h('span', row.contractMoney ? row.contractMoney : '--')
    }
  },
  {
    field: 'projectManagerName',
    minWidth: '90px',
    label: '项目经理',
    formatter: (row: Recordable) => {
      return h('span', row.projectManagerName ? row.projectManagerName : '--')
    },
    search: {
      show: true,
      component: 'Cascader',
      componentProps: {
        placeholder: '负责人筛选',
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
    field: 'salesManagerName',
    minWidth: '90px',
    label: '销售经理',
    formatter: (row: Recordable) => {
      return h('span', row.salesManagerName ? row.salesManagerName : '--')
    }
  },
  {
    field: 'contractSignDate',
    minWidth: '115px',
    label: '合同签订日期',
    formatter: (row: Recordable) => {
      return h(
        'span',
        row.contractSignDate ? moment(row.contractSignDate).format('YYYY-MM-DD') : '--'
      )
    }
  },
  {
    field: 'predictAcceptDate',
    minWidth: '115px',
    label: '预计验收日期',
    formatter: (row: Recordable) => {
      return h(
        'span',
        row.predictAcceptDate ? moment(row.predictAcceptDate).format('YYYY-MM-DD') : '--'
      )
    }
  },
  {
    field: 'predictPaymentDate',
    minWidth: '115px',
    label: '预计回款日期',
    formatter: (row: Recordable) => {
      return h(
        'span',
        row.predictPaymentDate ? moment(row.predictPaymentDate).format('YYYY-MM-DD') : '--'
      )
    }
  },
  {
    field: 'action',
    fixed: 'right',
    showOverflowTooltip: false,
    className: 'actionRegion',
    label: '操作'
  }
])

const { allSchemas } = useCrudSchemas(crudSchemas)

// 项目总览切换项目
const searchRef = ref()
const changeitemCount = (type: string, status: string) => {
  isActive.value = type
  statusVal.value = status
  searchRef.value.setValues({ status: status == '-2' ? '' : status })
  setSearchParamsSub({ status: status })
}
provide('changeitemCount', changeitemCount)

//删除加载
const delLoading = ref(false)

//删除
const delData = async (row: ImplementData | null, multiple: boolean) => {
  tableObject.currentRow = row
  const { delList, getSelections } = methods
  const selections = await getSelections()
  delLoading.value = true
  await delList(
    multiple ? selections.map((v) => v.id) : [tableObject.currentRow?.id as unknown as string],
    multiple,
    true,
    true
  ).finally(() => {
    delLoading.value = false
  })
}

//table操作栏按钮事件
const detailsRef = ref()
const action = (row: ImplementData, type: string) => {
  isAction.value = type
  if (type === 'audit') {
    ArrprovalInfoRef.value.openDrawer(type, row.pid)
  } else if (type === 'changeAudit') {
    // 项目变更审批
    ArrprovalInfoChangeRef.value.openDrawer(type, row.pid)
  } else if (type === 'process') {
    ArrprovalInfoRef.value.openDrawer(type, row.pid)
  } else if (type === 'change') {
    ArrprovalInfoChangeRef.value.openDrawer(type, row.pid)
  } else if (type === 'supplement') {
    supplementTitle.value = '项目经理补充'
    SupplementFormRef.value.openDrawer(type, row.pid)
  } else if (type === 'salesSupplement') {
    supplementTitle.value = '销售经理补充'
    SupplementFormRef.value.openDrawer(type, row.pid)
  } else {
    detailsRef.value.openDrawer(row.pid)
  }
}

//搜索
const setSearchParamsSub = (param: Recordable) => {
  params.pId = ''
  params.year = param.year ? new Date(param.year).getFullYear() : ''
  params.projectTitle = param.projectTitle ? param.projectTitle : ''
  params.ownerName = param.ownerName ? param.ownerName : ''
  params.projectType = param.projectType ? param.projectType : ''
  params.status = param.status ? param.status : ''
  params.projectManager = param.projectManagerName
    ? param.projectManagerName[param.projectManagerName.length - 1]
    : ''
  if (params.status === '2') {
    isActive.value = 'ssz'
    statusVal.value = '2'
  } else if (params.status === '3') {
    isActive.value = 'yys'
    statusVal.value = '3'
  } else if (params.status === '4') {
    isActive.value = 'yhkzsh'
    statusVal.value = '4'
  } else if (params.status === '-1') {
    isActive.value = ''
    statusVal.value = '-1'
  } else if (params.status === '-2') {
    isActive.value = 'spz'
    statusVal.value = '-2'
  } else {
    isActive.value = 'sszxm'
    statusVal.value = ''
  }
  setSearchParams(params)
  getCountHatch()
}

// 是否显示筛选窗口
const isShowCell = ref(false)

// 筛选列
const showCell = () => {
  isShowCell.value = !isShowCell.value
}

// 审批日志的弹窗
const dialogVisible = ref(false)

// 弹窗名称
const dialogTitle = ref<string>('审批日志')

// 弹窗关闭
const closeDialog = () => {
  dialogVisible.value = false
}

// 接收审批日志数据
const pidValue = ref<String>('')
// 培育数据统计
const getAuditList = async (pid: number) => {
  pidValue.value = String(pid)
  dialogVisible.value = true
}

//导出
const exLoading = ref(false)
const exportForm = async () => {
  if (tableObject.tableList.length === 0) {
    ElMessage.warning('查询无数据, 无需导出数据')
    return
  }
  exLoading.value = true
  let paramsTemp = Object.assign(params, {
    fmLook: isFinance.value ? '1' : ''
  })
  await exportTableListApi(paramsTemp)
  exLoading.value = false
}

watch(
  () => route.query,
  () => {
    if (route.name == 'Ssxm') {
      if (route.query.pid) {
        // nextTick(async () => {
        //   if (route.query.status == '5') {
        //     ArrprovalInfoChangeRef.value.openDrawer('changeAudit', route.query.pid)
        //   } else if (route.query.status == '6') {
        //     ArrprovalInfoRef.value.openDrawer('audit', route.query.pid)
        //   } else if (route.query.status == '1') {
        //     if (route.query.type === '1') {
        //       let params = {
        //         id: route.query.pid
        //       }
        //       const res = await getEstablishApi(params)
        //       if (res && res.data) {
        //         if (res.data.auditSort === '0') {
        //           supplementTitle.value = '项目经理补充'
        //           SupplementFormRef.value.openDrawer('supplement', route.query.pid)
        //         } else if (res.data.auditSort === '1') {
        //           supplementTitle.value = '销售经理补充'
        //           SupplementFormRef.value.openDrawer('salesSupplement', route.query.pid)
        //         }
        //       }
        //     } else {
        //       ArrprovalInfoRef.value.openDrawer('audit', route.query.pid)
        //     }
        //   }
        // })
        nextTick(() => {
          setSearchParams({ pId: route.query.pid, status: '' })
          getCountHatch()
          getAllDeptlist()
        })
      } else if (route.query.messagepid) {
        nextTick(() => {
          setSearchParams({ pId: route.query.messagepid, status: '' })
          getCountHatch()
          getAllDeptlist()
        })
      } else {
        resetList()
      }
    }
  },
  { immediate: true, deep: true }
)

//自适应列宽
const cellStyle = ({ row, column, rowIndex, columnIndex }) => {
  if (column.className == 'actionRegion') {
    nextTick(() => {
      let arr: any = []
      Array.from(document.querySelectorAll('.actionRegion .cell')).forEach((element: any) => {
        let widths = element.offsetWidth ? element.offsetWidth : 0
        arr.push(widths)
      })
      column.minWidth = Math.max.apply(null, arr)
    })
  }
}
</script>

<template>
  <section>
    <SatisticsMenu :cultivateCount="implementCount" :isActive="isActive" v-if="!isFinance" />
    <ContentWrap :isShowtitle="isFinance" Showtitle="实施项目">
      <Table
        v-model:pageSize="tableObject.pageSize"
        v-model:currentPage="tableObject.currentPage"
        :height="defaultHeight + 155"
        :columns="allSchemas.tableColumns"
        :data="tableObject.tableList"
        :loading="tableObject.loading"
        :border="true"
        :cell-style="cellStyle"
        :selection="false"
        :isShowFilter="true"
        :isShowCell="isShowCell"
        :header-align="'center'"
        :cotentAlign="'center'"
        :pagination="{
          total: tableObject.total
        }"
        @register="register"
      >
        <template #operateBtnLeft>
          <Search
            ref="searchRef"
            :schema="allSchemas.searchSchema"
            @search="setSearchParamsSub"
            @reset="resetList"
            v-if="isAuth('project:ssxm:query')"
        /></template>
        <template #operateBtnRight>
          <div class="mr-[10px]">
            <ElButton
              :loading="exLoading"
              class="btn-other exportBtn"
              v-hasPermi="'project:ssxm:export'"
              @click="exportForm()"
              plain
            >
              <template #icon> <Icon :size="14" icon="svg-icon:exportBut" /> </template>导出
            </ElButton>
          </div>
        </template>
        <template #action="{ row }">
          <ElButton
            v-if="isAuth('project:ssxm:detail')"
            class="btn-default"
            type="success"
            @click="action(row, 'see')"
            :text="true"
          >
            详情
          </ElButton>
          <!-- 项目经理补充 -->
          <ElButton
            v-if="
              isAuth('project:ssxm:supplement') &&
              row.status === '1' &&
              row.auditSort === '0' &&
              row.projectManager === loginUserId
            "
            class="btn-default"
            type="success"
            @click="action(row, 'supplement')"
            :text="true"
          >
            补充
          </ElButton>
          <!-- 销售经理补充 -->
          <ElButton
            v-if="
              isAuth('project:ssxm:supplement') &&
              row.status === '1' &&
              row.auditSort === '1' &&
              row.salesManager === loginUserId
            "
            class="btn-default"
            type="success"
            @click="action(row, 'salesSupplement')"
            :text="true"
          >
            补充
          </ElButton>
          <ElButton
            type="warning"
            class="btn-default"
            @click="action(row, 'audit')"
            :text="true"
            size="small"
            v-if="(row.status == 1 || row.status == 5) && row.audit && isAuth('project:ssxm:audit')"
          >
            审批
          </ElButton>
          <!-- <ElButton
            type="warning"
            class="btn-default"
            @click="action(row, 'changeAudit')"
            :text="true"
            size="small"
            v-if="row.status == 5 && row.audit && isAuth('project:ssxm:audit')"
          >
            审批
          </ElButton> -->
          <ElButton
            type="primary"
            class="btn-default"
            @click="action(row, 'process')"
            v-if="(row.status == 1 || row.status == 5) && isAuth('project:ssxm:approve')"
            :text="true"
            size="small"
          >
            审批进程
          </ElButton>
          <!-- <ElButton
            type="primary"
            class="btn-default"
            @click="action(row, 'change')"
            v-if="row.status == 5 && isAuth('project:ssxm:approve')"
            :text="true"
            size="small"
          >
            审批进程
          </ElButton> -->
          <ElButton
            type="success"
            class="btn-default"
            @click="getAuditList(row.pid)"
            :text="true"
            size="small"
            v-hasPermi="'project:ssxm:log'"
          >
            审批日志
          </ElButton>
        </template>
      </Table>
    </ContentWrap>
    <SupplementForm
      @change-get-detail-and-list="resetList"
      :title="supplementTitle"
      ref="SupplementFormRef"
    />
    <ArrprovalInfo
      :title="'审批'"
      :isAction="isAction"
      @change-get-detail-and-list="resetList"
      ref="ArrprovalInfoRef"
    />
    <ArrprovalInfoChange
      :title="'审批'"
      :isAction="isAction"
      @change-get-detail-and-list="resetList"
      ref="ArrprovalInfoChangeRef"
    />
    <!-- 审批日志 -->
    <AduitRecordTable :pid="pidValue" :visible="dialogVisible" @closed="closeDialog" />

    <ProjectDetail ref="detailsRef" @resetTable="resetList" />
  </section>
  <LimitDailog routerName="ssxm" />
</template>
<style lang="less" scoped>
.tooltip-base-box {
  width: 600px;
}
.tooltip-base-box .row {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.tooltip-base-box .center {
  justify-content: center;
}
.tooltip-base-box .box-item {
  width: 110px;
  margin-top: 10px;
}
.el-date-editor.el-input,
.el-date-editor.el-input__wrapper {
  width: 100%;
}
:deep(.el-loading-mask) {
  top: 0px !important;
  width: 100% !important;
  left: 0px !important;
}

:deep(.actionRegion .cell) {
  /* flex: 1; */
  display: inline-block !important;
  white-space: nowrap !important;
}
:deep(.remind-class) {
  margin: auto;
  height: 26px;
  font-size: 13px;
  display: flex;
  background: #ffe7e8;
  border-radius: 2px;
  padding: 4px 6px;
  color: #ff565c;
  align-items: center;
}

:deep(.img-cell-class) {
  width: 13px;
  height: 13px;
}
:deep(.remind-text-class) {
  width: 82px;
}
:deep(.remind-text-long-class) {
  width: 140px;
}
@media screen and (max-width: 1536px) {
  :deep(.remind-text-class) {
    width: 78px;
  }
  :deep(.remind-text-long-class) {
    width: 130px;
  }
}
</style>
