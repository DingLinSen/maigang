<!-- 演示平台 -->
<script setup lang="ts">
import { ContentWrap } from '@/components/ContentWrap'
import { Search } from '@/components/Search'
import { ElButton, ElMessageBox, ElMessage } from 'element-plus'
import { Table } from '@/components/Table'
import { getPlatformListApi, delPlatformListApi } from '@/api/platform'
import { useTable } from '@/hooks/web/useTable'
import { getCurrentInstance, h, reactive, ref, unref, provide, onMounted } from 'vue'
import { useEmitt } from '@/hooks/web/useEmitt'
import { CrudSchema, useCrudSchemas } from '@/hooks/web/useCrudSchemas'
import { TableColumn } from '@/types/table'
import moment from 'moment'
import useDictStore from '@/store/modules/appDict'
import { isAuth } from '@/utils/is'
import { projectType } from './Form/config'
import { Dialog } from '@/components/Dialog'
import { PlatformForm } from './Form'
import { LimitDailog } from '@/views/Components/limit'

defineOptions({
  name: 'DemoPlatform'
})

const pageSize = ref<number>(20)
const { register, tableObject, methods } = useTable<any>({
  getListApi: getPlatformListApi,
  delListApi: delPlatformListApi,
  response: {
    list: 'rows',
    total: 'total'
  }
})
tableObject.pageSize = pageSize


const { getList, setSearchParams } = methods

getList()

useEmitt({
  name: 'platform',
  callback: (type: string) => {
    if (type === 'add') {
      tableObject.currentPage = 1
    }
    getList()
  }
})

const getSysTypeTag = (type: string) => {
  let tag = '--'
  projectType.forEach((element: any) => {
    if (element.value == type) {
      tag = element.label
    }
  })
  return tag
}
const crudSchemas = reactive<CrudSchema[]>([
  {
    field: 'index',
    headerAlign: 'center',
    cotentAlign: 'center',
    label: '序号',
    width: '80px',
    formatter: (row: Recordable, __: TableColumn, cellValue: string, index: number) => {
      let itemIndex = index + 1 + tableObject.pageSize * (tableObject.currentPage - 1)
      return h('span', itemIndex)
    }
  },
  {
    field: 'sysType',
    label: '类型',
    minWidth: '180px',
    search: {
      show: true,
      component: 'Select',
      componentProps: {
        placeholder: '类型筛选',
        style: 'width: 196px',
        options: projectType
      }
    },
    formatter: (row: Recordable) => {
      return h('span', getSysTypeTag(String(row.sysType)))
    }
  },
  {
    field: 'sysName',
    minWidth: '180px',
    label: '平台名称',
    search: {
      show: true,
      componentProps: {
        style: 'width: 196px',
        placeholder: '平台名称筛选'
      }
    },
    formatter: (row: Recordable) => {
      return h(
        'span',
        {
          style: 'cursor:pointer;color: #00a0e9;',
          onClick: () => {
            openPreviewDialog(row)
          }
        },
        row.sysName ? row.sysName : '--'
      )
    }
  },
  {
    field: 'action',
    showOverflowTooltip: false,
    minWidth: '120px',
    fixed: 'right',
    label: '操作'
  }
])

const { allSchemas } = useCrudSchemas(crudSchemas)

//

//添加
const AddAction = () => {
  //   phoneFormRef.value.openDrawer('')
}

//删除加载
const delLoading = ref(false)

//删除
const delData = async (row: any | null, multiple: boolean) => {
  tableObject.currentRow = row
  const { delList, getSelections } = methods
  const selections = await getSelections()
  // 判断选中的数据是否有权限
  let isLimits: boolean = true
  selections.forEach((item: any) => {
    if (String(item.status) == '0') {
      isLimits = false
    }
  })
  if (!isLimits) {
    ElMessage.warning('部分数据没有权限进行操作')
    return
  }
  delLoading.value = true
  await delList(
    multiple ? selections.map((v) => v.id) : [tableObject.currentRow?.id as string],
    multiple,
    true,
    true
  ).finally(() => {
    delLoading.value = false
  })
}

//table操作栏按钮事件
const platformFormRef = ref<ComponentRef<typeof PlatformForm>>()
const action = (row: any, type: string) => {
  platformFormRef.value.openDrawer(type, row ? row.id : '')
}

const params = reactive<Recordable>({
  sysType: null,
  sysName: null
})

//搜索
const setSearchParamsSub = (param: Recordable) => {
  params.sysType = param.sysType ? param.sysType : null
  params.sysName = param.sysName ? param.sysName : null
  setSearchParams(params)
}

const openInfo = ref<any>({
  remark: '',
  sysUrl: '',
  sysName: ''
})

const dialogVisible = ref<boolean>(false)
const closePermissionDialog = () => {
  openInfo.value = {
    remark: '',
    sysUrl: '',
    sysName: ''
  }
}

const openPreviewDialog = (row: any) => {
  openInfo.value = {
    remark: row.remark ? row.remark : '',
    sysUrl: row.sysUrl ? row.sysUrl : '',
    sysName: row.sysName ? row.sysName : ''
  }
  dialogVisible.value = true
}

const handleOpenUrl = (url: string) => {
  dialogVisible.value = false
  setTimeout(() => {
    window.open(url)
  }, 200)
}
</script>

<template>
  <ContentWrap Showtitle="演示平台">
    <template #ContentWrapTitle>
      <div>
        <ElButton
          class="btn-add"
          @click="action(null, 'add')"
          plain
          v-hasPermi="'company:demo:add'"
        >
          <template #icon>
            <Icon :size="14" icon="svg-icon:addBut" />
          </template>
          新增
        </ElButton>
        <ElButton
          :loading="delLoading"
          class="btn-other"
          @click="delData(null, true)"
          plain
          v-hasPermi="'company:demo:remove'"
        >
          <template #icon>
            <Icon :size="14" icon="svg-icon:deleteBut" />
          </template>
          删除
        </ElButton>
      </div>
    </template>

    <Table
      v-model:pageSize="tableObject.pageSize"
      v-model:currentPage="tableObject.currentPage"
      :columns="allSchemas.tableColumns"
      :data="tableObject.tableList"
      :loading="tableObject.loading"
      :page-size="pageSize"
      :is-show-filter="false"
      :border="true"
      :header-align="'center'"
      :cotentAlign="'center'"
      :pagination="{
        total: tableObject.total
      }"
      @register="register"
    >
      <template #operateBtnLeft>
        <Search
          v-if="isAuth('company:demo:query')"
          :schema="allSchemas.searchSchema"
          @search="setSearchParamsSub"
          @reset="setSearchParamsSub"
        />
      </template>
      <template #action="{ row }">
        <ElButton
          @click="action(row, 'edit')"
          :text="true"
          class="btn-default"
          v-if="isAuth('company:demo:edit')"
        >
          编辑
        </ElButton>
        <ElButton
          class="btn-default"
          @click="delData(row, false)"
          :text="true"
          size="small"
          v-if="isAuth('company:demo:remove')"
        >
          删除
        </ElButton>
      </template>
    </Table>
    <LimitDailog routerName="DemoPlatform" />
  </ContentWrap>

  <Dialog
    v-model="dialogVisible"
    :maxHeight="'auto'"
    title="平台信息链接"
    :width="'35%'"
    @closed="closePermissionDialog"
  >
    <div>
      <p>平台名称: {{ openInfo.sysName || '--' }}</p>
      <p>演示地址: {{ openInfo.sysUrl || '--' }}</p>
      <p>备注信息: {{ openInfo.remark || '--' }}</p>
    </div>
    <template #footer>
      <ElButton type="primary" @click="handleOpenUrl(openInfo.sysUrl)"> 确认跳转</ElButton>
      <ElButton @click="dialogVisible = false">取消</ElButton>
    </template>
  </Dialog>
  <PlatformForm ref="platformFormRef" />
</template>
<style lang="less" scoped>
:deep(.el-loading-mask) {
  top: 0px !important;
  width: 100% !important;
  left: 0px !important;
}

:deep(.el-table .cell) {
  line-height: 35px !important;
}
</style>
