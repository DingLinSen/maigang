<!-- 培育项目 -->
<script setup lang="ts">
import './Implement.less'
import { ImplementForm, ArrprovalInfo, SatisticsMenu, ProjectDetail } from './components/index'
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
  exportTableListApi
} from '@/api/project/Implement'
import moment from 'moment'
import { userSelectByPmApi } from '@/api/user' // 获取所有用户
import { getAllDeptListApi } from '@/api/sys/dept' // 获取所有部门
import { useTable } from '@/hooks/web/useTable'
import { ImplementData, ImplementCount } from '@/api/project/Implement/types'
import { h, reactive, ref, unref, provide, computed, onMounted, watch } from 'vue'
import { useEmitt } from '@/hooks/web/useEmitt'
import { useAppStore } from '@/store/modules/app'
import { CrudSchema, useCrudSchemas } from '@/hooks/web/useCrudSchemas'
import { isAuth } from '@/utils/is'
import { useRoute } from 'vue-router'
import { useCache } from '@/hooks/web/useCache'
import { AduitRecordTable, RemindView } from '../components'
import {
  approvalStatus,
  getProjectStatusLabel,
  projectType,
  getProjectTypeLabel,
  purchaseMethod
} from '../config/config'

const route = useRoute()
const appStore = useAppStore()
// 视窗高度
const documentClientHeight = computed(() => appStore.getDocumentClientHeight)
defineOptions({
  name: 'Implement'
})
const { wsCache } = useCache()
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
  name: 'implement',
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
    year: '',
    projectTitle: '',
    projectType: '',
    status: isFinance.value ? '2' : '-1',
    principalPerson: ''
  }
  if (searchRef.value) {
    let param = {
      year: '',
      projectTitle: '',
      projectType: '',
      status: isFinance.value ? '2' : '',
      principalPerson: ''
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
let deptData = ref<any>([])
const userData = ref<any>([])
const principalTree = ref<any>([])
// 向子组件发送值
provide('principalTree', principalTree)
provide('deptData', deptData)
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
  } catch (error) {}
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

// 培育数据
let implementCount = ref<any>({
  count: 0, // 立项总项目
  lxzt: 0, //
  jszz: 0, // 结束终止
  jzz: 0, // 进展中
  jszss: 0,
  spz: 0
})

// 培育数据统计
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
  principalPerson: '', // 负责人id
  projectTitle: '', // 项目名称
  ownerName: '', // 用户名称
  status: isFinance.value ? '2' : '-1' // 项目状态
})
//
const changeprincipal = (val: any) => {
  params.principalPerson = String(val[val.length - 1])
}
const ImplementFormRef = ref<any>()
const ArrprovalInfoRef = ref<any>()

// 项目总览点击状态
const isActive = ref('count')
useEmitt({
  name: 'getList',
  callback: (type: string) => {
    if (type === 'add') {
      tableObject.currentPage = 1
    }
    getList()
    getCountHatch()
  }
})
const statusValue = ref('')

const getPurchaseMethod = (value: string) => {
  let statusLabel = '--'
  unref(purchaseMethod).map((item: any) => {
    if (value === item.value) {
      statusLabel = item.label
    }
  })
  return statusLabel
}

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
    minWidth: '110px',
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
    minWidth: '130px',
    formatter: (row: Recordable, __: TableColumn, cellValue: string) => {
      return h(
        ElTag,
        {
          type:
            cellValue === '0'
              ? 'primary'
              : cellValue === '1'
              ? 'primary'
              : cellValue === '2'
              ? 'success'
              : cellValue === '3'
              ? 'danger'
              : cellValue === '4' || cellValue === '8'
              ? 'success'
              : cellValue === '5'
              ? 'info'
              : cellValue === '6'
              ? 'primary'
              : cellValue === '7' || cellValue === '10'
              ? 'warning'
              : cellValue === '9'
              ? 'warning'
              : 'danger',
          effect: cellValue === '9' ? 'dark' : ''
        },
        () => getProjectStatusLabel('2', cellValue) || '--'
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
        options: approvalStatus
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
    field: 'predictContractMoney',
    minWidth: '130px',
    label: '预计合同金额(万元)',
    formatter: (row: Recordable) => {
      return h('span', row.predictContractMoney ? row.predictContractMoney : '--')
    }
  },
  {
    field: 'principalPersonName',
    minWidth: '80px',
    label: '负责人',
    formatter: (row: Recordable) => {
      return h('span', row.principalPersonName ? row.principalPersonName : '--')
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
    field: 'upPrincipalName',
    minWidth: '100px',
    label: '分管负责人',
    formatter: (row: Recordable) => {
      return h('span', row.upPrincipalName ? row.upPrincipalName : '--')
    }
  },
  {
    field: 'projectApprovalTime',
    minWidth: '110px',
    label: '立项时间',
    formatter: (row: Recordable) => {
      return h(
        'span',
        row.projectApprovalTime ? moment(row.projectApprovalTime).format('YYYY-MM-DD') : '--'
      )
    }
  },
  {
    field: 'milestoneC',
    minWidth: '115px',
    label: '项目签约时间',
    formatter: (row: Recordable) => {
      return h('span', row.milestoneC ? moment(row.milestoneC).format('YYYY-MM') : '--')
    }
  },
  {
    field: 'purchaseMethod',
    minWidth: '115px',
    label: '预计采购方式',
    formatter: (row: Recordable) => {
      return h('span', getPurchaseMethod(row.purchaseMethod))
    }
  },
  {
    field: 'milestone',
    minWidth: '100px',
    label: '当前里程碑',
    formatter: (row: Recordable) => {
      return h(
        'span',
        row.milestone === '1'
          ? '里程碑1'
          : row.milestone === '2'
          ? '里程碑2'
          : row.milestone === '3'
          ? '里程碑3'
          : '--'
      )
    }
  },
  {
    field: 'createTime',
    minWidth: '175px',
    label: '操作时间',
    formatter: (row: Recordable) => {
      return h('span', row.updateTime ? row.updateTime : '--')
    }
  },
  {
    field: 'action',
    fixed: 'right',
    className: 'actionRegion',
    showOverflowTooltip: false,
    label: '操作'
  }
])

const { allSchemas } = useCrudSchemas(crudSchemas)

// 项目总览切换项目
// 项目总览切换项目
const searchRef = ref()
const changeitemCount = (type: string, status: string) => {
  isActive.value = type
  statusValue.value = status
  searchRef.value.setValues({ status: status == '-2' ? '' : status })
  setSearchParamsSub({ status: status })
}
provide('changeitemCount', changeitemCount)

//添加
const AddAction = () => {
  isAction.value = 'add'
  ImplementFormRef.value.openDrawer('add', null)
}

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

  if (type === 'edit') {
    ImplementFormRef.value.openDrawer(type, row.id)
  } else if (type === 'alter') {
    ImplementFormRef.value.openDrawer(type, row.pid)
  } else if (type === 'audit') {
    ArrprovalInfoRef.value.openDrawer(type, row.pid)
  } else if (type === 'process') {
    ArrprovalInfoRef.value.openDrawer(type, row.pid)
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
  params.status = param.status ? param.status : isFinance.value ? '2' : ''
  params.principalPerson = param.principalPersonName
    ? param.principalPersonName[param.principalPersonName.length - 1]
    : ''
  if (params.status === '2') {
    isActive.value = 'jzz'
    statusVal.value = '2'
  } else if (params.status === '3') {
    isActive.value = 'lxzt'
    statusVal.value = '3'
  } else if (params.status === '5') {
    isActive.value = 'jszz'
    statusVal.value = '5'
  } else if (params.status === '4') {
    isActive.value = 'jszss'
    statusVal.value = '4'
  } else if (params.status === '-1') {
    isActive.value = ''
    statusVal.value = '-1'
  } else if (params.status === '-2') {
    isActive.value = 'spz'
    statusVal.value = '-2'
  } else {
    isActive.value = 'count'
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
  await exportTableListApi(params)
  exLoading.value = false
}

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

watch(
  () => route.query,
  () => {
    if (route.name == 'Implement') {
      if (route.query.pid) {
        // nextTick(() => {
        //   ArrprovalInfoRef.value.openDrawer('audit', route.query.pid)
        // })
        nextTick(() => {
          setSearchParams({ pId: route.query.pid, status: '' })
          getAllDeptlist()
          getCountHatch()
        })
      } else if (route.query.messagepid) {
        nextTick(() => {
          setSearchParams({ pId: route.query.messagepid, status: '' })
          getAllDeptlist()
          getCountHatch()
        })
      } else {
        resetList()
      }
    }
  },
  { immediate: true, deep: true }
)
</script>

<template>
  <section>
    <SatisticsMenu :cultivateCount="implementCount" :isActive="isActive" v-if="!isFinance" />
    <ContentWrap :isShowtitle="isFinance" Showtitle="立项项目">
      <Table
        v-model:pageSize="tableObject.pageSize"
        v-model:currentPage="tableObject.currentPage"
        :height="defaultHeight + 155"
        :columns="allSchemas.tableColumns"
        :data="tableObject.tableList"
        :loading="tableObject.loading"
        :border="true"
        :selection="false"
        :isShowFilter="true"
        :isShowCell="isShowCell"
        :header-align="'center'"
        :cell-style="cellStyle"
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
            v-if="isAuth('project:implement:query')"
        /></template>
        <template #operateBtnRight>
          <div class="mr-[10px]">
            <ElButton
              :loading="exLoading"
              class="btn-other exportBtn"
              v-hasPermi="'project:implement:export'"
              @click="exportForm()"
              plain
            >
              <template #icon> <Icon :size="14" icon="svg-icon:exportBut" /> </template>导出
            </ElButton>
          </div>
        </template>
        <template #action="{ row }">
          <ElButton
            v-if="isAuth('project:implement:detail')"
            class="btn-default"
            type="success"
            @click="action(row, 'see')"
            :text="true"
          >
            详情
          </ElButton>
          <ElButton
            type="warning"
            class="btn-default"
            @click="action(row, 'audit')"
            :text="true"
            size="small"
            v-if="
              (row.status == 1 ||
                row.status == 6 ||
                row.status == 7 ||
                row.status == 9 ||
                row.status == 10) &&
              row.audit &&
              isAuth('project:implement:audit')
            "
          >
            审批
          </ElButton>
          <ElButton
            type="primary"
            class="btn-default"
            @click="action(row, 'process')"
            v-if="
              (row.status == 1 ||
                row.status == 6 ||
                row.status == 7 ||
                row.status == 9 ||
                row.status == 10) &&
              isAuth('project:implement:approve')
            "
            :text="true"
            size="small"
            v-hasPermi="'project:implement:approve'"
          >
            审批进程
          </ElButton>
          <ElButton
            type="success"
            class="btn-default"
            @click="getAuditList(row.pid)"
            :text="true"
            size="small"
            v-hasPermi="'project:implement:log'"
          >
            审批日志
          </ElButton>
        </template>
      </Table>
    </ContentWrap>
    <ImplementForm title="立项项目" :isAction="isAction" ref="ImplementFormRef" />
    <ArrprovalInfo
      :title="'审批'"
      :isAction="isAction"
      @change-get-detail-and-list="resetList"
      ref="ArrprovalInfoRef"
    />
    <!-- 审批日志 -->
    <AduitRecordTable :pid="pidValue" :visible="dialogVisible" @closed="closeDialog" />

    <ProjectDetail ref="detailsRef" @reset-table="resetList" />
  </section>
  <LimitDailog routerName="Implement" />
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
</style>
