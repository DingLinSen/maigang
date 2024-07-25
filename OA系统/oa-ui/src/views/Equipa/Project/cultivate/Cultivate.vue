<!-- 培育项目 -->
<script setup lang="ts">
import './cultivate.less'
import moment from 'moment'
import { ContentWrap } from '@/components/ContentWrap'
import { Search } from '@/components/Search'
import { ElTag, ElButton, ElMessage } from 'element-plus'
import { Table } from '@/components/Table'
import { Dialog } from '@/components/Dialog'
import { listToTree } from '@/utils/tree'
import { TableColumn } from '@/types/table'
import { CultivateFormTwo, ArrprovalInfo, SatisticsMenu } from './components'
import { AduitRecordTable, RemindView } from '../components'
import {
  getCultivateListApi,
  delCultivateListApi,
  countHatchCultivateApi,
  exportTableListApi
} from '@/api/project/cultivate'
import { isAuth } from '@/utils/is' // 鉴权
import { userSelectByPmApi } from '@/api/user' // 获取所有用户
import { getAllDeptListApi } from '@/api/sys/dept' // 获取所有部门
import { useCache } from '@/hooks/web/useCache'
import { useTable } from '@/hooks/web/useTable'
import { CultivateData, cultivateCount } from '@/api/project/cultivate/types'
import { h, reactive, ref, unref, provide, computed, nextTick, onMounted, watch } from 'vue'
import { useEmitt } from '@/hooks/web/useEmitt'
import { useAppStore } from '@/store/modules/app'
import { Icon } from '@/components/Icon'
import { CrudSchema, useCrudSchemas } from '@/hooks/web/useCrudSchemas'
import { useRoute } from 'vue-router'
import { LimitDailog } from '@/views/Components/limit'
import { CultProjectDetails, ProjectOperateForm } from './newVersion'
import {
  cultivateStatus,
  getProjectStatusLabel,
  projectType,
  getProjectTypeLabel
} from '../config/config'

const route = useRoute()

defineOptions({
  name: 'Cultivate'
})
// 培育数据
let cultivateCount = ref<any>({
  pyzxm: 0, // 培育总项目
  pyspz: 0, // 培育审批中
  jszz: 0, // 结束终止
  jzz: 0, // 进展中
  jszlx: 0
})
const { wsCache } = useCache()
const appStore = useAppStore()

const deptInfo = ref<string>(wsCache.get('userInfo').dept) // 登录用户部门信息
const isFinance = ref<boolean>(JSON.stringify(deptInfo).indexOf('财务部') > -1) // 是否是财务部
// 视窗高度
const documentClientHeight = computed(() => appStore.getDocumentClientHeight)

// 注册
onMounted(() => {
  resetTableHeight()
})

const pageTitle = ref<string>('')

useEmitt({
  name: 'window',
  callback: (type: string) => {
    if (type === 'resize') {
      resetTableHeight()
    }
  }
})

const loginUserId = ref<string>(wsCache.get('userInfo').userId) // 登录用户id
const defaultHeight = ref(0)
const resetTableHeight = () => {
  const overView = getOverViewWrapper('.satistics_menu-contentWrap')
  const overViewWrapper = getOverViewWrapper('#v-tags-view')
  const footer = getOverViewWrapper('.v-footer')
  const trigger = getOverViewWrapper('.hover-trigger-view')
  const titleH = isFinance.value ? 55 : 0
  defaultHeight.value =
    documentClientHeight.value - overViewWrapper - overView - trigger - footer - 138 - titleH
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
    // console.log(error)
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
const { register, tableObject, methods } = useTable<CultivateData>({
  getListApi: getCultivateListApi,
  delListApi: delCultivateListApi,
  response: {
    list: 'data.rows',
    total: 'data.total'
  },
  defaultParams: {
    fmLook: isFinance.value ? '1' : ''
  }
})

const { getList, setSearchParams } = methods
const statusValue = ref('')
// 培育数据统计
const getCountHatch = async () => {
  try {
    const res = await countHatchCultivateApi()
    cultivateCount.value = res.data
  } catch (error) {
    // console.log(error)
  }
}

const params = reactive<Recordable>({
  id: '',
  year: '', // 年份
  principalPerson: '', // 负责人id
  projectTitle: '', // 项目名称
  ownerName: '', // 客户名称
  status: isFinance.value ? '1' : '-1' // 项目状态
})
//
const changeprincipal = (val: any) => {
  // console.log('val', val)
  params.principalPerson = String(val[val.length - 1])
}
const CultivateFormRef = ref<ComponentRef<typeof CultivateFormTwo>>()
const ArrprovalInfoRef = ref<any>()
const ElTableRef = ref()
// 项目总览点击状态
const isActive = ref('')
useEmitt({
  name: 'getList',
  callback: (type: string) => {
    if (type === 'add') {
      tableObject.currentPage = 1
    }
    getCountHatch()

    getList()

    resetList()
  }
})

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
      label: undefined,
      componentProps: {
        type: 'year',
        style: 'width: 9.2vw',
        filterable: true,
        placeholder: '年份筛选'
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
      componentProps: {
        style: 'width: 9.2vw',
        placeholder: '项目名称/编号筛选'
      },
      component: 'Input'
    }
  },
  {
    field: 'progressStatus',
    label: '提醒',
    minWidth: '160px',
    formatter: (row: Recordable) => {
      return h(RemindView, {
        progressStatus: row.progressStatus
      })
    }
  },
  {
    field: 'ownerName',
    label: '客户名称',
    minWidth: '120px',
    formatter: (row: Recordable) => {
      return h('span', row.ownerName ? row.ownerName : '--')
    }
  },
  {
    field: 'projectType',
    minWidth: '90px',
    label: '所属行业',
    formatter: (row: Recordable) => {
      return h('span', getProjectTypeLabel(row.projectType))
    },
    search: {
      show: true,
      component: 'Select',
      componentProps: {
        placeholder: '所属行业筛选',
        style: 'width: 9.2vw',
        options: projectType,
        filterable: true
      }
    }
  },
  // {
  //   field: 'estimatedAmount',
  //   minWidth: '125px',
  //   label: '预计金额(万元)',
  //   formatter: (row: Recordable) => {
  //     return h('span', row.estimatedAmount ? row.estimatedAmount : '--')
  //   }
  // },
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
              ? 'warning'
              : cellValue === '1'
              ? 'success'
              : cellValue === '2'
              ? 'success'
              : cellValue === '3'
              ? 'info'
              : cellValue === '4'
              ? 'primary'
              : cellValue === '5'
              ? 'info'
              : cellValue === '6'
              ? 'warning'
              : 'danger',
          effect: cellValue === '6' ? 'dark' : ''
        },
        () => getProjectStatusLabel('1', cellValue) || '--'
      )
    },
    search: {
      show: JSON.stringify(deptInfo).indexOf('财务部') == -1,
      component: 'Select',
      componentProps: {
        placeholder: '状态筛选',
        style: 'width: 9.2vw',
        filterable: true,
        options: cultivateStatus
      }
    }
  },

  {
    field: 'createByName',
    minWidth: '80px',
    label: '申请人',
    formatter: (row: Recordable) => {
      return h('span', row.createByName ? row.createByName : '--')
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
        style: 'width: 9.2vw',
        props: {
          label: 'deptName',
          value: 'deptId'
        }
      }
    }
  },
  {
    field: 'budget',
    minWidth: '90px',
    label: '项目经费',
    formatter: (row: Recordable) => {
      return h('span', row.budget ? row.budget : '--')
    }
  },
  // {
  //   field: 'availableLimit',
  //   minWidth: '180px',
  //   label: '可用额度',
  //   formatter: (row: Recordable) => {
  //     return h('span', row.availableLimit ? row.availableLimit : '--')
  //   }
  // },
  {
    field: 'createTime',
    minWidth: '110px',
    label: '申请时间',
    formatter: (row: Recordable) => {
      return h('span', row.createTime ? moment(row.createTime).format('YYYY-MM-DD') : '--')
    }
  },
  {
    field: 'action',
    fixed: 'right',
    className: 'actionRegion',
    label: '操作',
    showOverflowTooltip: false
  }
])

const { allSchemas } = useCrudSchemas(crudSchemas)

// 项目总览切换项目
const searchRef = ref()
const changeitemCount = (type: string, status: string) => {
  isActive.value = type
  statusValue.value = status
  searchRef.value.setValues({ status: status == '-2' ? '' : status })
  // console.log(111)
  setSearchParamsSub({ status: status })
}
provide('changeitemCount', changeitemCount)

//删除加载
const delLoading = ref(false)

//删除
const delData = async (row: CultivateData | null, multiple: boolean) => {
  tableObject.currentRow = row
  const { delList, getSelections } = methods
  const selections = await getSelections()
  delLoading.value = true
  await delList(
    multiple
      ? selections.map((v) => String(v.id))
      : [tableObject.currentRow?.id as unknown as string],
    multiple,
    true,
    true
  ).finally(() => {
    delLoading.value = false
  })
  // resetList()
}

//搜索
const setSearchParamsSub = (param: Recordable) => {
  // console.log(2222)
  params.id = ''
  params.year = param.year ? moment(param.year).format('YYYY') : ''
  params.projectTitle = param.projectTitle ? param.projectTitle : ''
  params.ownerName = param.ownerName ? param.ownerName : ''
  params.status = param.status ? param.status : isFinance.value ? '1' : ''
  params.projectType = param.projectType ? param.projectType : ''
  params.principalPerson = param.principalPersonName
    ? param.principalPersonName[param.principalPersonName.length - 1]
    : ''
  if (params.status === '0') {
    isActive.value = 'pyspz'
    statusValue.value = '0'
  } else if (params.status === '1') {
    isActive.value = 'jzz'
    statusValue.value = '1'
  } else if (params.status === '5') {
    isActive.value = 'jszz'
    statusValue.value = '5'
  } else if (params.status === '2') {
    isActive.value = 'jszlx'
    statusValue.value = '2'
  } else if (params.status === '-1') {
    isActive.value = ''
    statusValue.value = '-1'
  } else if (params.status === '-2') {
    isActive.value = 'pyspz'
    statusValue.value = '-2'
  } else {
    isActive.value = 'pyzxm'
    statusValue.value = ''
  }
  getCountHatch()
  setSearchParams(params)
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
  document.getElementsByTagName('body')[0].className = ''
  document.getElementsByTagName('body')[0].style.width = '100%'
}

// 接收审批日志数据
const pidValue = ref<String>('')
// 培育数据统计
const getAuditList = async (pid: number) => {
  pidValue.value = String(pid)
  dialogVisible.value = true
}

// 重置表格
const resetList = () => {
  isActive.value = ''
  statusValue.value = ''
  let param = {
    year: '',
    projectTitle: '',
    projectType: '',
    status: isFinance.value ? '1' : '-1',
    principalPerson: ''
  }
  if (searchRef.value) {
    let params = {
      year: '',
      projectTitle: '',
      projectType: '',
      status: isFinance.value ? '1' : '',
      principalPerson: ''
    }
    searchRef.value.setValues(params)
  }
  setSearchParamsSub(param)
  getAllDeptlist()
}

const CultivateDialogRef = ref<any>()
const detailsRef = ref()
const projectOperateFormRef = ref<any>()
// 打开新增/编辑查看窗口
const openDialog = (row: any, type: string) => {
  isAction.value = type
  if (type === 'add') {
    // CultivateDialogRef.value.openDialog(type)
    projectOperateFormRef.value.openDialog(type)
  } else if (type === 'edit') {
    // 编辑
    // CultivateDialogRef.value.openDialog(type, row.id)
    projectOperateFormRef.value.openDialog(type, row.id)
  } else if (type === 'alter') {
    // 变更
    // CultivateDialogRef.value.openDialog(type, row.id)
    projectOperateFormRef.value.openDialog(type, row.id)
  } else if (type === 'audit') {
    // 审批

    pageTitle.value = '审批'

    ArrprovalInfoRef.value.openDrawer(type, row.id)
  } else if (type === 'process') {
    // 审批进程
    pageTitle.value = '审批进程'
    ArrprovalInfoRef.value.openDrawer(type, row.id)
  } else {
    // dialogVisible.value = true
    detailsRef.value.openDrawer(row.id)
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
  await exportTableListApi(params)
  exLoading.value = false
}

watch(
  () => route.query,
  () => {
    if (route.name == 'Cultivate') {
      if (route.query.pid) {
        nextTick(() => {
          setSearchParams({ id: route.query.pid, status: '' })
          getAllDeptlist()
          getCountHatch()
        })
      } else if (route.query.messagepid) {
        nextTick(() => {
          setSearchParams({ id: route.query.messagepid, status: '' })
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
  } else if (column.className == 'actionRegion') {

  }
}
</script>

<template>
  <section>
    <SatisticsMenu :cultivateCount="cultivateCount" :isActive="isActive" v-if="!isFinance" />
    <ContentWrap :isShowtitle="isFinance" Showtitle="培育项目">
      <template #ContentWrapTitle> </template>

      <Table
        ref="ElTableRef"
        v-model:pageSize="tableObject.pageSize"
        v-model:currentPage="tableObject.currentPage"
        :isShowFilter="true"
        :height="defaultHeight + 145"
        :columns="allSchemas.tableColumns"
        :data="tableObject.tableList"
        :loading="tableObject.loading"
        :border="true"
        :selection="false"
        :cell-style="cellStyle"
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
            v-if="isAuth('project:cultivate:query')"
          />
        </template>
        <template #operateBtnRight>
          <div class="mr-[10px]">
            <ElButton class="btn-add" @click="openDialog(null, 'add')" plain>
              <template #icon> <Icon :size="14" icon="svg-icon:addBut" /> </template>新增</ElButton
            >
            <ElButton
              :loading="exLoading"
              class="btn-other exportBtn"
              v-hasPermi="'project:cultivate:export'"
              @click="exportForm()"
              plain
            >
              <template #icon> <Icon :size="14" icon="svg-icon:exportBut" /> </template>导出
            </ElButton></div
          >
        </template>
        <template #action="{ row }">
          <ElButton
            class="btn-default"
            v-if="
              row.status == 0 &&
              loginUserId === row.principalPerson &&
              isAuth('project:cultivate:edit')
            "
            @click="openDialog(row, 'edit')"
            :text="true"
          >
            编辑
          </ElButton>
          <ElButton
            class="btn-default"
            v-hasPermi="'project:cultivate:detail'"
            @click="openDialog(row, 'see')"
            :text="true"
          >
            详情
          </ElButton>
          <ElButton
            class="btn-default"
            type="danger"
            @click="delData(row, false)"
            :text="true"
            v-if="
              isAuth('project:cultivate:save') &&
              row.status == 0 &&
              loginUserId === row.principalPerson
            "
          >
            删除
          </ElButton>
          <!-- 审批权限 -->
          <ElButton
            class="btn-default"
            type="warning"
            @click="openDialog(row, 'audit')"
            :text="true"
            v-if="
              isAuth('project:cultivate:audit') &&
              row.audit &&
              (row.status == 0 || row.status == 4 || row.status == 6) &&
              row.status != 2
            "
          >
            审批
          </ElButton>
          <ElButton
            class="btn-default"
            type="warning"
            @click="openDialog(row, 'alter')"
            :text="true"
            v-if="isAuth('project:cultivate:alter') && row.status == 1"
          >
            变更
          </ElButton>
          <ElButton
            class="btn-default"
            type="primary"
            v-if="
              (row.status == 0 || row.status == 4 || row.status == 6) &&
              isAuth('project:cultivate:process') &&
              row.status != 2
            "
            @click="openDialog(row, 'process')"
            :text="true"
          >
            审批进程
          </ElButton>
          <ElButton
            class="btn-default"
            type="success"
            v-hasPermi="'project:cultivate:log'"
            @click="getAuditList(row.id)"
            :text="true"
          >
            审批日志
          </ElButton>
        </template>
      </Table>
    </ContentWrap>
    <!-- 审批 -->
    <ArrprovalInfo
      :title="pageTitle"
      @change-get-detail-and-list="resetList"
      :isAction="isAction"
      ref="ArrprovalInfoRef"
    />

    <!-- 新增/编辑 -->
    <!-- <CultivateFormTwo
      :dialogTitle="'培育项目'"
      @change-get-detail-and-list="resetList"
      :isAction="isAction"
      ref="CultivateDialogRef"
    /> -->
    <!-- 新增/编辑 -->
    <ProjectOperateForm @reset-list="resetList" ref="projectOperateFormRef" />

    <!-- 审批日志 -->
    <AduitRecordTable :pid="pidValue" :visible="dialogVisible" @closed="closeDialog" />

    <CultProjectDetails ref="detailsRef" @reset-table="resetList" />
  </section>
  <LimitDailog routerName="cultivate" />
</template>
<style lang="less" scoped>
:deep(.el-date-editor.el-input, .el-date-editor.el-input__wrapper) {
  width: 100%;
}
:deep(.el-loading-mask) {
  top: 0 !important;
  width: 100% !important;
  left: 0 !important;
}
:deep(.actionRegion .cell) {
  /* flex: 1; */
  display: inline-block !important;
  white-space: nowrap !important;
}
</style>
