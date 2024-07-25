<!-- 科研项目 -->
<script setup lang="ts">
import './kyxm.less'
import moment from 'moment'
import { ContentWrap } from '@/components/ContentWrap'
import { Search } from '@/components/Search'
import { ElTag, ElButton, ElMessage } from 'element-plus'
import { Table } from '@/components/Table'
import { Dialog } from '@/components/Dialog'
import { listToTree } from '@/utils/tree'
import { TableColumn } from '@/types/table'
import {
  getScientificListApi, // 列表
  delScientificListApi, // 删除
  countHatchScientificApi, // 数据统计
  exportTableListApi //导出
} from '@/api/project/scientific'
import { isAuth } from '@/utils/is' // 鉴权
import { userSelectByPmApi } from '@/api/user' // 获取所有用户
import { getAllDeptListApi } from '@/api/sys/dept' // 获取所有部门
import { useCache } from '@/hooks/web/useCache' //缓存
import { useTable } from '@/hooks/web/useTable'
import { ScientificData } from '@/api/project/scientific/types'
import { h, reactive, ref, unref, provide, computed, onMounted, nextTick, watch } from 'vue'
import { useEmitt } from '@/hooks/web/useEmitt'
import { useAppStore } from '@/store/modules/app'
import { Icon } from '@/components/Icon'
import { CrudSchema, useCrudSchemas } from '@/hooks/web/useCrudSchemas'
import { KyxmForm, ArrprovalInfo, DetailsForm, SatisticsMenu } from './components'
import { useRoute } from 'vue-router'
import { LimitDailog } from '@/views/Components/limit'
import { AduitRecordTable, RemindView } from '../components'

const route = useRoute()

defineOptions({
  name: 'Scientific'
})
// 科研统计数据
let cultivateCount = ref<any>({
  zxm: 0, // 总项目
  jzz: 0, // 进展中
  jszz: 0, // 结束终止
  yzt: 0,
  spz: 0
})
//缓存
const { wsCache } = useCache()
const deptInfo = ref<string>(wsCache.get('userInfo').dept) // 登录用户部门信息
const isFinance = ref<boolean>(JSON.stringify(deptInfo).indexOf('财务部') > -1) // 是否是财务部
const appStore = useAppStore()
// 视窗高度
const documentClientHeight = computed(() => appStore.getDocumentClientHeight)
// 注册
onMounted(() => {
  resetTableHeight()
})

// if()
// 项目状态
const projectStatus = reactive<any>([
  {
    label: '自研审批中',
    value: '1'
  },
  {
    label: '进展中',
    value: '2'
  },
  {
    label: '状态变更审批中',
    value: '3'
  },
  {
    label: '负责人变更审批中',
    value: '4'
  },
  {
    label: '结题审批中',
    value: '5'
  },
  {
    label: '已结题',
    value: '6'
  },
  {
    label: '已终止',
    value: '7'
  },
  {
    label: '已暂停',
    value: '8'
  }
])
// 项目类型
const projectType = reactive<any>([
  {
    label: '新产品研发项目',
    value: '1'
  },
  {
    label: '技术攻关项目',
    value: '2'
  },
  {
    label: '技改项目',
    value: '3'
  }
])
//监听窗口高度变化
useEmitt({
  name: 'window',
  callback: (type: string) => {
    if (type === 'resize') {
      resetTableHeight()
    }
  }
})
//监听外部传递的列表刷新
useEmitt({
  name: 'kyxm',
  callback: (type: string) => {
    if (type === 'refresh') {
      resetList()
    }
  }
})
// 登录用户id
const loginUserId = ref<string>(wsCache.get('userInfo').userId)
// 列表高度
const defaultHeight = ref(0)
// 重置列表高度
const resetTableHeight = () => {
  //计算统计高度
  const overView = getOverViewWrapper('.satistics_menu-contentWrap')
  //计算导航栏高度
  const overViewWrapper = getOverViewWrapper('#v-tags-view')
  //计算底部footer高度
  const footer = getOverViewWrapper('.v-footer')
  const trigger = getOverViewWrapper('.hover-trigger-view')
  const titleH = isFinance.value ? 55 : 0
  defaultHeight.value =
    documentClientHeight.value - overViewWrapper - overView - trigger - footer - 138 - titleH
}
//根据class计算高度
const getOverViewWrapper = (dom: string): number => {
  let topH = 0
  const checkboxWrapper = document.querySelector(dom)
  if (checkboxWrapper) {
    topH = checkboxWrapper.clientHeight
  }
  return topH
}
//根据value获取状态字段
const getElTagLabel = (value: string): string => {
  let label = ''
  unref(projectStatus).map((item: any) => {
    if (value === item.value) {
      label = item.label
    }
  })
  return label
}
//部门数据
let deptData = ref<any>([])
//人员数据
const userData = ref<any>([])
//部门人员整合后的数据
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
  } catch (error) {}
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
const { register, tableObject, methods } = useTable<ScientificData>({
  getListApi: getScientificListApi,
  delListApi: delScientificListApi,
  response: {
    list: 'rows',
    total: 'total'
  },
  defaultParams: {
    fmLook: isFinance.value ? '1' : ''
  }
})

const { getList, setSearchParams } = methods
// 科研数据统计
const getCountHatch = async () => {
  try {
    const res = await countHatchScientificApi()
    cultivateCount.value = res.data
  } catch (error) {
    console.log(error)
  }
}

//搜索参数
const params = reactive<Recordable>({
  pId: '',
  year: '', // 年份
  principalPerson: '', // 负责人id
  projectTitle: '', // 项目名称
  ownerName: '', // 用户名称
  status: isFinance.value ? '2' : '-2' // 项目状态
})
//负责人切换
const changeprincipal = (val: any) => {
  params.principalPerson = String(val[val.length - 1])
}
//详情页面
const ProjectDetailsRef = ref<any>()
//审批/审批进程页面
const ArrprovalInfoRef = ref<any>()
//列表
const ElTableRef = ref()
//监听新增页面保存成功刷新列表
useEmitt({
  name: 'getList',
  callback: (type: string) => {
    console.log('type', type)
    if (type === 'add') {
      tableObject.currentPage = 1
    }
    // getCountHatch()
    // getList()
    resetList()
  }
})
//列表项
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
    minWidth: '165px',
    formatter: (row: Recordable) => {
      return h(RemindView, {
        progressStatus: row.progressStatus
      })
    }
  },
  {
    field: 'type',
    minWidth: '110px',
    label: '项目类型',
    formatter: (row: Recordable) => {
      return h(
        'span',
        row.type === '1'
          ? '新产品研发项目'
          : row.type === '2'
          ? '技术攻关项目'
          : row.type === '3'
          ? '技改项目'
          : '--'
      )
    },
    search: {
      show: true,
      component: 'Select',
      componentProps: {
        placeholder: '项目类型筛选',
        style: 'width: 9.2vw',
        options: projectType,
        filterable: true
      }
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
            cellValue === '1'
              ? 'primary'
              : cellValue === '2'
              ? 'success'
              : cellValue === '3'
              ? 'warning'
              : cellValue === '4'
              ? 'warning'
              : cellValue === '5'
              ? 'danger'
              : cellValue === '6'
              ? 'success'
              : cellValue === '7'
              ? 'info'
              : cellValue === '8'
              ? 'danger'
              : 'danger',
          effect: cellValue === '4' || cellValue === '8' || cellValue === '6' ? 'dark' : ''
        },
        () => getElTagLabel(cellValue)
      )
    },
    search: {
      show: JSON.stringify(deptInfo).indexOf('财务部') == -1,
      component: 'Select',
      componentProps: {
        placeholder: '状态筛选',
        style: 'width: 9.2vw',
        filterable: true,
        options: projectStatus
      }
    }
  },
  {
    field: 'principalPersonName',
    minWidth: '90px',
    label: '项目负责人',
    formatter: (row: Recordable) => {
      return h('span', row.principalPersonName ? row.principalPersonName : '--')
    },
    search: {
      show: true,
      component: 'Cascader',
      componentProps: {
        placeholder: '项目负责人筛选',
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
    field: 'principalPersonLeaderName',
    minWidth: '90px',
    label: '分管负责人',
    formatter: (row: Recordable) => {
      return h('span', row.principalPersonLeaderName ? row.principalPersonLeaderName : '--')
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
    field: 'action',
    fixed: 'right',
    className: 'actionRegion',
    label: '操作',
    showOverflowTooltip: false
  }
])
const { allSchemas } = useCrudSchemas(crudSchemas)
// 项目总览点击状态
const isActive = ref('zxm')
// 项目总览切换项目
const searchRef = ref()
//项目总览切事件
const changeitemCount = (type: string, status: string) => {
  isActive.value = type
  searchRef.value.setValues({ status: status === '-1' || status === '-3' ? '' : status })
  setSearchParamsSub({ status: status })
}
//向子控件传递统计选择
provide('changeitemCount', changeitemCount)
//删除加载
const delLoading = ref(false)
//删除
const delData = async (row: ScientificData | null, multiple: boolean) => {
  tableObject.currentRow = row
  const { delList, getSelections } = methods
  const selections = await getSelections()
  delLoading.value = true
  await delList(
    multiple
      ? selections.map((v) => String(v.pid))
      : [tableObject.currentRow?.pid as unknown as string],
    multiple,
    true,
    true
  ).finally(() => {
    delLoading.value = false
  })
}
//搜索
const setSearchParamsSub = (param: Recordable) => {
  params.pId = ''
  params.year = param.year ? moment(param.year).format('YYYY') : ''
  params.projectTitle = param.projectTitle ? param.projectTitle : ''
  params.status = param.status ? param.status : isFinance.value ? '2' : ''
  params.type = param.type ? param.type : ''
  params.principalPerson = param.principalPersonName
    ? param.principalPersonName[param.principalPersonName.length - 1]
    : ''
  if (params.status === '2') {
    isActive.value = 'jzz'
  } else if (params.status === '-1' || params.status === '6' || params.status === '7') {
    isActive.value = 'jszz'
  } else if (params.status === '-3') {
    isActive.value = 'spz'
  } else if (params.status === '-2') {
    isActive.value = ''
  } else {
    isActive.value = 'zxm'
  }
  getCountHatch()
  setSearchParams(params)
}
// 是否显示筛选窗口
const isShowCell = ref(false)
// 筛选列显示
const showCell = () => {
  isShowCell.value = !isShowCell.value
}
// 审批日志的弹窗
const dialogVisible = ref(false)
// 审批日志弹窗关闭
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
// 重置表格
const resetList = () => {
  isActive.value = ''
  let param = {
    year: '',
    principalPerson: '',
    projectTitle: '',
    type: '',
    status: isFinance.value ? '2' : '-2'
  }
  if (searchRef.value) {
    let params = {
      year: '',
      principalPerson: '',
      projectTitle: '',
      type: '',
      status: isFinance.value ? '2' : ''
    }
    searchRef.value.setValues(params)
  }
  setSearchParamsSub(param)
  getAllDeptlist()
  // getCountHatch()
}

//新增编辑弹框
const CultivateDialogRef = ref<any>()
//弹框标题
const pageTitle = ref<string>('')
// 操作方式
const isAction = ref<string>('')
// 打开新增/编辑/审批查看窗口
const openDialog = (row: any, type: string) => {
  isAction.value = type
  if (type === 'add') {
    CultivateDialogRef.value.openDialog(type)
  } else if (type === 'edit') {
    // 编辑
    CultivateDialogRef.value.openDialog(type, row.pid)
  } else if (type === 'audit') {
    // 审批
    pageTitle.value = '审批'
    ArrprovalInfoRef.value.openDrawer(type, row.pid)
  } else if (type === 'process') {
    // 审批进程
    pageTitle.value = '审批进程'
    ArrprovalInfoRef.value.openDrawer(type, row.pid)
  } else {
    ProjectDetailsRef.value.openDrawer(type, row.pid)
  }
}

watch(
  () => route.query,
  () => {
    if (route.name == 'Scientific') {
      if (route.query.pid) {
        // nextTick(() => {
        //   pageTitle.value = '审批'
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
</script>

<template>
  <section>
    <SatisticsMenu :cultivateCount="cultivateCount" :isActive="isActive" v-if="!isFinance" />
    <ContentWrap :isShowtitle="isFinance" Showtitle="自研项目">
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
        :cell-style="cellStyle"
        :selection="false"
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
            v-if="isAuth('project:kyxm:query')"
          />
        </template>
        <template #operateBtnRight>
          <div class="mr-[10px]">
            <ElButton
              class="btn-add"
              @click="openDialog(null, 'add')"
              plain
              v-hasPermi="'project:kyxm:save'"
            >
              <template #icon> <Icon :size="14" icon="svg-icon:addBut" /> </template>新增</ElButton
            >
            <ElButton
              :loading="exLoading"
              class="btn-other exportBtn"
              v-hasPermi="'project:kyxm:export'"
              @click="exportForm()"
              plain
            >
              <template #icon> <Icon :size="14" icon="svg-icon:exportBut" /> </template>导出
            </ElButton>
          </div>
        </template>
        <template #action="{ row }">
          <ElButton
            class="btn-default"
            v-if="isAuth('project:kyxm:edit') && row.edit && row.status == 1"
            @click="openDialog(row, 'edit')"
            :text="true"
          >
            编辑
          </ElButton>
          <ElButton
            class="btn-default"
            v-hasPermi="'project:kyxm:detail'"
            @click="openDialog(row, 'see')"
            :text="true"
          >
            详情
          </ElButton>
          <!-- 审批权限 -->
          <ElButton
            class="btn-default"
            type="warning"
            @click="openDialog(row, 'audit')"
            :text="true"
            v-if="
              isAuth('project:kyxm:audit') &&
              row.audit &&
              (row.status == 1 || row.status == 3 || row.status == 4 || row.status == 5)
            "
          >
            审批
          </ElButton>
          <ElButton
            class="btn-default"
            type="primary"
            v-if="
              (row.status == 1 || row.status == 3 || row.status == 4 || row.status == 5) &&
              isAuth('project:kyxm:process')
            "
            @click="openDialog(row, 'process')"
            :text="true"
          >
            审批进程
          </ElButton>
          <ElButton
            class="btn-default"
            type="success"
            v-hasPermi="'project:kyxm:log'"
            @click="getAuditList(row.pid)"
            :text="true"
          >
            审批日志
          </ElButton>
          <ElButton
            class="btn-default"
            type="danger"
            @click="delData(row, false)"
            :text="true"
            v-if="isAuth('project:kyxm:delete') && row.edit && row.status == 1"
          >
            删除
          </ElButton>
        </template>
      </Table>
    </ContentWrap>
    <DetailsForm ref="ProjectDetailsRef" title="自研详情" @change-get-detail-and-list="resetList" />
    <!-- 审批 -->
    <ArrprovalInfo
      :title="pageTitle"
      @change-get-detail-and-list="resetList"
      :isAction="isAction"
      ref="ArrprovalInfoRef"
    />

    <!-- 新增/编辑 -->
    <KyxmForm
      :dialogTitle="'自研项目'"
      @change-get-detail-and-list="resetList"
      :isAction="isAction"
      ref="CultivateDialogRef"
    />
    <!-- 审批日志 -->
    <AduitRecordTable :pid="pidValue" :visible="dialogVisible" @closed="closeDialog" />
  </section>
  <LimitDailog routerName="scientific" />
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
