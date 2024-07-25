<template>
  <ContentWrap Showtitle="制度管理">
    <template #ContentWrapTitle>
      <div>
        <ElButton
          class="btn-add"
          v-if="isAuth('AdministrativeService:systemManagement:add')"
          @click="openDialog(true, null)"
          plain
        >
          <template #icon>
            <Icon :size="14" icon="svg-icon:addBut" />
          </template>
          新增
        </ElButton>
        <ElButton
          :loading="publishLoading"
          class="exportBtn"
          v-if="isAuth('AdministrativeService:systemManagement:batchPublish')"
          @click="publishData(null, true)"
          plain
        >
          <template #icon>
            <Icon :size="14" icon="svg-icon:publish" />
          </template>
          批量发布
        </ElButton>
        <ElButton
          :loading="delLoading"
          v-if="isAuth('AdministrativeService:systemManagement:batchDel')"
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
      :loading="tableObject.loading"
      :columns="allSchemas.tableColumns"
      :cell-style="cellStyle"
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
          v-hasPermi="'AdministrativeService:systemManagement:query'"
          :schema="allSchemas.searchSchema"
          @search="setSearchParamsSub"
          @reset="setSearchParamsSub"
        />
      </template>
      <template #action="{ row }">
        <ElButton
          v-if="isAuth('AdministrativeService:systemManagement:downLoad') && row.filePath"
          class="btn-default"
          :text="true"
          size="small"
          @click="downloadFile(row.filePath, getFileName(row.filePath))"
          >下载
        </ElButton>
        <ElButton
          class="btn-default"
          :text="true"
          size="small"
          v-if="
            row.status != 1 &&
            row.roleAuth == 0 &&
            isAuth('AdministrativeService:systemManagement:edit')
          "
          @click="openDialog(false, row)"
          >编辑
        </ElButton>
        <ElButton
          class="btn-default"
          :text="true"
          size="small"
          v-if="row.roleAuth == 0 && isAuth('AdministrativeService:systemManagement:del')"
          @click="delData(row, false)"
          >删除
        </ElButton>
        <ElButton
          class="btn-default"
          :text="true"
          size="small"
          v-if="
            row.status != 1 &&
            row.roleAuth == 0 &&
            isAuth('AdministrativeService:systemManagement:publish')
          "
          @click="publishData(row, false)"
          >发布
        </ElButton>
        <ElButton
          class="btn-default"
          :text="true"
          size="small"
          v-if="
            row.status != 2 &&
            row.roleAuth == 0 &&
            row.status != 0 &&
            isAuth('AdministrativeService:systemManagement:revocation')
          "
          @click="revocation(row.id)"
          >撤回
        </ElButton>
      </template>
    </Table>
    <!-- 弹出框 -->
    <SystemManagementDialog
      @change-get-detail-and-list="resetList"
      ref="SystemManagementDialogRef"
    />
    <LimitDailog routerName="systemManagement" />
  </ContentWrap>
</template>
<script setup lang="ts">
import { ref, reactive, computed, onMounted, h, unref, nextTick } from 'vue'
import { SystemManagementDialog } from './components'
import { ContentWrap } from '@/components/ContentWrap'
import { Table } from '@/components/Table'
import { TableColumn } from '@/types/table'
import { useEmitt } from '@/hooks/web/useEmitt'
import { Search } from '@/components/Search'
import { useTable } from '@/hooks/web/useTable'
import { useAppStore } from '@/store/modules/app'
import { AnnouncementData } from '@/api/AdministrativeService/announcement/types'
import {
  getAnnouncementOrInstitution,
  delAnnouncementOrInstitution,
  publishAnnouncementOrInstitution,
  revocationAnnouncementOrInstitution
} from '@/api/AdministrativeService/announcement'
import { CrudSchema, useCrudSchemas } from '@/hooks/web/useCrudSchemas'
import { downloadFile } from '@/utils/index'
import { ElButton, ElTag, ElMessage, ElMessageBox } from 'element-plus'
import moment from 'moment'
import { isAuth } from '@/utils/is' // 鉴权
import { LimitDailog } from '@/views/Components/limit'

const SystemManagementDialogRef = ref<any>()
const appStore = useAppStore()
//删除加载
const delLoading = ref(false)
const publishLoading = ref(false)

// 表格高度
const defaultHeight = ref(0)
// 发布状态的数据
const publishDataList = [
  {
    value: '0',
    label: '未发布'
  },
  {
    value: '1',
    label: '已发布'
  },
  {
    value: '2',
    label: '已撤回'
  }
]
const params = reactive<any>({
  title: '',
  status: ''
})
// 存放表格的数据
const crudSchemas = reactive<CrudSchema[]>([
  {
    field: 'id',
    label: '序号',
    width: '60px'
  },
  {
    field: 'title',
    label: '标题',
    minWidth: '350px',
    formatter: (row: Recordable) => {
      return h('span', row.title ? row.title : '--')
    },
    search: {
      show: true,
      component: 'Input',
      componentProps: {
        style: 'width: 196px',
        placeholder: '标题筛选'
      }
    }
  },
  {
    field: 'status',
    label: '状态',
    width: '80px',
    formatter: (row: any, __: TableColumn, cellValue: string) => {
      let label: string = getElTagLabel(cellValue)
      return h(
        ElTag,
        {
          type:
            cellValue === '0'
              ? 'info'
              : cellValue === '1'
              ? 'success'
              : cellValue === '2'
              ? 'danger'
              : ''
        },
        () => label
      )
    },
    search: {
      show: true,
      component: 'Select',
      componentProps: {
        style: 'width: 196px',
        options: publishDataList,
        placeholder: '状态筛选',
        filterable: true
      }
    }
  },
  {
    field: 'pubDate',
    label: '发布日期',
    width: '140px',
    formatter: (row: Recordable) => {
      return h('span', row.pubDate ? moment(row.pubDate).format('YYYY-MM-DD') : '--')
    }
  },
  {
    field: 'createByName',
    label: '创建人',
    width: '80px',
    formatter: (row: Recordable) => {
      return h('span', row.createByName ? row.createByName : '--')
    }
  },
  {
    field: 'createDate',
    label: '创建时间',
    width: '140px',
    formatter: (row: Recordable) => {
      return h('span', row.createDate ? moment(row.createDate).format('YYYY-MM-DD') : '--')
    }
  },
  {
    field: 'updateByName',
    label: '编辑人',
    width: '80px',
    formatter: (row: Recordable) => {
      return h('span', row.updateByName ? row.updateByName : '--')
    }
  },
  {
    field: 'updateDate',
    label: '编辑时间',
    width: '140px',
    formatter: (row: Recordable) => {
      return h('span', row.updateDate ? moment(row.updateDate).format('YYYY-MM-DD') : '--')
    }
  },
  {
    field: 'action',
    fixed: 'right',
    width: '220px',
    className: 'actionRegion',
    label: '操作',
    showOverflowTooltip: false
  }
])
const { allSchemas } = useCrudSchemas(crudSchemas)
const { register, tableObject, methods } = useTable<AnnouncementData>({
  getListApi: getAnnouncementOrInstitution,
  delListApi: delAnnouncementOrInstitution,
  response: {
    list: 'rows',
    total: 'total'
  },
  defaultParams: {
    pageType: 'b'
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
// 判断Tag标签
const getElTagLabel = (value: string): string => {
  let label = ''
  unref(publishDataList).map((item: any) => {
    if (value === item.value) {
      label = item.label
    }
  })
  return label
}
//搜索
const setSearchParamsSub = (param: any) => {
  params.title = param.title ? param.title : ''
  params.status = param.status ? param.status : ''
  setSearchParams(params)
}
// 打开新增/编辑查看窗口
const openDialog = (flag: boolean, row: any) => {
  if (flag) {
    SystemManagementDialogRef.value.openDialog(flag)
  } else {
    SystemManagementDialogRef.value.openDialog(flag, row.id)
  }
}
// 删除/批量删除
const delData = async (row: any, flag: boolean) => {
  tableObject.currentRow = row
  const { delList, getSelections } = methods
  const selections = await getSelections()
  // 判断选中的数据是否有权限
  let res = selections.every(function (item) {
    return item.roleAuth == 0
  })
  if (!res) {
    ElMessage.warning('部分数据没有权限进行操作')
    return
  }
  delLoading.value = true
  await delList(
    flag ? selections.map((v) => v.id) : [tableObject.currentRow?.id as unknown as string],
    flag,
    true,
    true
  ).finally(() => {
    delLoading.value = false
  })
}
// 发布/批量发布
const publishData = async (row: any, flag: boolean) => {
  const { getSelections } = methods
  const selections = await getSelections()
  // 判断选中的数据是否有权限
  let res = selections.every(function (item) {
    return item.roleAuth == 0
  })
  if (!res) {
    ElMessage.warning('部分数据没有权限进行操作')
    return
  }
  let ids = flag ? selections.map((v) => v.id).toString() : row.id
  if (!selections.length && flag) {
    ElMessage.warning('请选择需要发布的数据')
    return
  }
  ElMessageBox.confirm('是否要进行发布?', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
    autofocus: false
  }).then(async () => {
    publishLoading.value = true
    const res = await publishAnnouncementOrInstitution({
      ids: ids,
      status: 1
    })
    if (res.data) {
      ElMessage.success('发布信息成功')
      getList()
      publishLoading.value = false
    }
  })
}
// 撤回
const revocation = async (id: number) => {
  ElMessageBox.confirm('是否要进行撤回?', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
    autofocus: false
  }).then(async () => {
    const res = await revocationAnnouncementOrInstitution({
      id: id,
      status: 2
    })
    if (res.data) {
      ElMessage.success('撤回信息成功')
      getList()
    }
  })
}
// 获取文件名称
const getFileName = (name: any) => {
  if (name.lastIndexOf('/') > -1) {
    return name.slice(name.lastIndexOf('/') + 1)
  } else {
    return ''
  }
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
<style lang="less" scoped>
.top {
  display: flex;
  justify-content: space-between;
}

:deep(.actionRegion .cell) {
  /* flex: 1; */
  display: inline-block !important;
  white-space: nowrap !important;
  padding: 6px !important;
}
</style>
