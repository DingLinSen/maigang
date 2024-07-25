<template>
  <ContentWrap Showtitle="考核类型管理">
    <template #ContentWrapTitle>
      <div>
        <ElButton
          class="btn-add"
          v-if="isAuth('AdministrativeService:assessmentType:add')"
          @click="openDialog(true, null)"
          plain
        >
          <template #icon>
            <Icon :size="14" icon="svg-icon:addBut" />
          </template>
          新增
        </ElButton>
        <ElButton
          :loading="delLoading"
          v-if="isAuth('AdministrativeService:assessmentType:batchDel')"
          class="btn-other"
          @click="delData(null, true)"
          plain
        >
          <template #icon>
            <Icon :size="14" icon="svg-icon:deleteBut" />
          </template>
          批量删除
        </ElButton>
      </div>
    </template>
    <!-- 表格 -->
    <Table
      :isShowFilter="true"
      :border="true"
      ref="ElTableRef"
      v-model:pageSize="tableObject.pageSize"
      v-model:currentPage="tableObject.currentPage"
      :data="tableObject.tableList"
      :cell-style="cellStyle"
      :loading="tableObject.loading"
      :columns="allSchemas.tableColumns"
      :header-align="'center'"
      :cotentAlign="'center'"
      :pagination="{
        total: tableObject.total
      }"
      @register="register"
    >
      <template #id="{ $index }">
        <span>
          {{ $index + 1 + tableObject.pageSize * (tableObject.currentPage - 1) }}
        </span>
      </template>
      <template #operateBtnLeft>
        <Search
          v-if="isAuth('AdministrativeService:assessmentType:query')"
          :schema="allSchemas.searchSchema"
          @search="setSearchParamsSub"
          @reset="setSearchParamsSub"
        />
      </template>
      <template #action="{ row }">
        <ElButton
          v-if="isAuth('AdministrativeService:assessmentType:edit')"
          class="btn-default"
          :text="true"
          size="small"
          @click="openDialog(false, row)"
          >编辑
        </ElButton>
        <ElButton
          v-if="isAuth('AdministrativeService:assessmentType:del')"
          class="btn-default"
          :text="true"
          size="small"
          @click="delData(row, false)"
          >删除
        </ElButton>
      </template>
    </Table>
    <!-- 弹出框 -->
    <assessmentTypeDialog @change-get-detail-and-list="resetList" ref="assessmentTypeDialogRef" />
    <LimitDailog routerName="assessmentType" />
  </ContentWrap>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted, h, unref, nextTick } from 'vue'
import { assessmentTypeDialog } from './components'
import { ContentWrap } from '@/components/ContentWrap'
import { Table } from '@/components/Table'
import { TableColumn } from '@/types/table'
import { useEmitt } from '@/hooks/web/useEmitt'
import { Search } from '@/components/Search'
import { useTable } from '@/hooks/web/useTable'
import { useAppStore } from '@/store/modules/app'
import { AnnouncementData } from '@/api/AdministrativeService/announcement/types'
import {
  getAssessmentTypeList,
  delAssessmentType,
  changeStatus
} from '@/api/AdministrativeService/assessmentType'
import { CrudSchema, useCrudSchemas } from '@/hooks/web/useCrudSchemas'
import { ElButton, ElTag, ElMessage, ElMessageBox, ElSwitch } from 'element-plus'
import moment from 'moment'
import { isAuth } from '@/utils/is'
import { getdeptListApi } from '@/api/user'
import { LimitDailog } from '@/views/Components/limit'

defineOptions({
  name: 'AssessmentType'
})

const assessmentTypeDialogRef = ref<any>()
const appStore = useAppStore()
//删除加载
const delLoading = ref(false)
// 表格高度
const defaultHeight = ref(0)
const params = reactive<any>({
  deptId: ''
})
const deptList = ref([])
const getDepList = async () => {
  let res = await getdeptListApi({ pageSize: 99999 })
  res.data.map((item) => {
    let obj = {
      value: '',
      label: ''
    }
    obj.value = item.deptId
    obj.label = item.deptName
    deptList.value.push(obj)
  })
}
getDepList()
// 存放表格的数据
const crudSchemas = reactive<CrudSchema[]>([
  {
    field: 'id',
    label: '序号',
    width: '60px'
  },
  {
    field: 'deptName',
    label: '部门',
    minWidth: '160px',
    formatter: (row: Recordable) => {
      return h('span', row.deptName ? row.deptName : '--')
    },
    search: {
      show: true,
      component: 'Select',
      componentProps: {
        style: 'width: 196px',
        placeholder: '请选择部门',
        options: deptList.value
      }
    }
  },
  {
    field: 'indexContent',
    label: '指标内容',
    width: '350px',
    formatter: (row: Recordable) => {
      return h('span', row.indexContent ? row.indexContent : '--')
    }
  },
  {
    field: 'standardsOfGrading',
    label: '评分标准',
    width: '350px',
    formatter: (row: Recordable) => {
      return h('span', row.standardsOfGrading ? row.standardsOfGrading : '--')
    }
  },
  {
    field: 'orderNum',
    label: '排序',
    width: '80px',
    formatter: (row: Recordable) => {
      return h('span', row.orderNum ? row.orderNum : '--')
    }
  },
  {
    field: 'status',
    label: '状态',
    table: {
      show: true
    },
    formatter: (row: Recordable, __: TableColumn, cellValue: string) => {
      return h(
        ElSwitch,
        {
          modelValue: cellValue == '0' ? false : true,
          onClick: () => {
            switchChange(row)
          }
        },
        () => (cellValue == '0' ? false : true)
      )
    }
  },
  {
    field: 'action',
    fixed: 'right',
    className: 'actionRegion',
    minWidth: '110px',
    label: '操作',
    showOverflowTooltip: false
  }
])
const { allSchemas } = useCrudSchemas(crudSchemas)
const { register, tableObject, methods } = useTable<AnnouncementData>({
  getListApi: getAssessmentTypeList,
  delListApi: delAssessmentType,
  response: {
    list: 'rows',
    total: 'total'
  }
})
const { getList, setSearchParams } = methods
getList()
// 视窗高度
const documentClientHeight = computed(() => appStore.getDocumentClientHeight)
const resetTableHeight = () => {
  const overView = getOverViewWrapper('.overView')
  const overViewWrapper = getOverViewWrapper('#v-tags-view')
  const footer = getOverViewWrapper('.v-footer')
  const trigger = getOverViewWrapper('.hover-trigger-view')
  defaultHeight.value =
    documentClientHeight.value - overViewWrapper - overView - trigger - footer - 200
}
const getOverViewWrapper = (dom: string): number => {
  let topH = 0
  const checkboxWrapper = document.querySelector(dom)
  if (checkboxWrapper) {
    topH = checkboxWrapper.clientHeight
  }
  return topH
}
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
const switchChange = (row: Recordable) => {
  let msg = ''
  let title = ''
  if (row.status === 0) {
    title = '状态启用提示'
    msg = '确认要启用吗？'
  } else {
    title = '状态停用提示'
    msg = '确认要停用吗？'
  }
  ElMessageBox.confirm(msg, title, {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
    autofocus: false
  }).then(async () => {
    const params = {
      id: row.id,
      status: row.status === 0 ? 1 : 0
    }
    const res = await changeStatus(params)
    if (res) {
      nextTick()
      ElMessage.success(row.status == 0 ? '启用成功' : '停用成功')
      // row.status = row.status === 0 ? 1 : 0
      await getList()
    }
  })
}
//搜索
const setSearchParamsSub = (param: any) => {
  params.deptId = param.deptName ? param.deptName : ''
  setSearchParams(params)
}
// 打开新增/编辑查看窗口
const openDialog = (flag: boolean, row: any) => {
  if (flag) {
    assessmentTypeDialogRef.value.openDialog(flag)
  } else {
    assessmentTypeDialogRef.value.openDialog(flag, row.id)
  }
}
// 删除/批量删除
const delData = async (row: any, flag: boolean) => {
  tableObject.currentRow = row
  const { delList, getSelections } = methods
  const selections = await getSelections()
  delLoading.value = true
  // 判断选中的数据是否有权限
  // let res = selections.every(function(item) {
  //   return item.roleAuth == 0
  // })
  // if (!res) {
  //   ElMessage.warning('部分数据没有权限进行操作')
  //   return
  // }
  await delList(
    flag ? selections.map((v) => v.id) : [tableObject.currentRow?.id as unknown as string],
    flag,
    true,
    true
  ).finally(() => {
    delLoading.value = false
  })
}

const cellStyle = ({ row, column, rowIndex, columnIndex }) => {
  if (column.className == 'actionRegion') {
    nextTick(() => {
      let arr = []
      Array.from(document.querySelectorAll('.actionRegion .cell')).forEach((element) => {
        let widths = element.offsetWidth ? element.offsetWidth : 0
        arr.push(widths)
      })
      column.minWidth = Math.max.apply(null, arr)
    })
  }
}
// 更新表格
const resetList = () => {
  tableObject.currentPage = 1
  getList()
}
</script>

<style scoped>
:deep(.actionRegion .cell) {
  /* flex: 1; */
  display: inline-block !important;
  white-space: nowrap !important;
  padding: 6px !important;
}
</style>
