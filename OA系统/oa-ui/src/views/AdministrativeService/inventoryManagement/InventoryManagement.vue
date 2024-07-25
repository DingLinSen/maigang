<template>
  <ContentWrap Showtitle="库存管理">
    <template #ContentWrapTitle>
      <div>
        <ElButton
          v-if="isAuth('AdministrativeService:inventoryManagement:add')"
          class="btn-add"
          plain
          @click="openDialog(true, null, null)"
        >
          <template #icon>
            <Icon :size="14" icon="svg-icon:addBut" />
          </template>
          新增
        </ElButton>
        <ElButton
          v-if="isAuth('AdministrativeService:inventoryManagement:export')"
          :loading="exLoading"
          class="exportBtn"
          plain
          @click="exportForm()"
        >
          <template #icon>
            <Icon :size="14" icon="svg-icon:exportBut" />
          </template>
          导出
        </ElButton>
        <ElButton
          v-if="isAuth('AdministrativeService:inventoryManagement:batchDel')"
          :loading="delLoading"
          class="btn-other"
          plain
          @click="delData(null, true)"
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
      ref="ElTableRef"
      v-model:currentPage="tableObject.currentPage"
      v-model:pageSize="tableObject.pageSize"
      :border="true"
      :columns="allSchemas.tableColumns"
      :cotentAlign="'center'"
      :data="tableObject.tableList"
      :header-align="'center'"
      :isShowFilter="true"
      :loading="tableObject.loading"
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
          v-if="isAuth('AdministrativeService:inventoryManagement:query')"
          ref="searchRef"
          :schema="allSchemas.searchSchema"
          `
          @reset="setSearchParamsSub"
          @search="setSearchParamsSub"
        />
      </template>
      <template #goodsName="{ row }">
        <span
          v-if="row.goodsName && isAuth('AdministrativeService:inventoryManagement:detail')"
          class="text-[#00A0E9] cursor-pointer"
          @click="jump(row)"
          >{{ row.goodsName ? row.goodsName : row.goodsName }}</span
        >
        <span v-else-if="row.goodsName">{{ row.goodsName ? row.goodsName : row.goodsName }}</span>
        <span v-else>--</span>
      </template>
      <template #action="{ row }">
        <ElButton
          v-if="isAuth('AdministrativeService:inventoryManagement:intoTheLibrary')"
          :text="true"
          class="btn-default"
          size="small"
          @click="openDialog(false, row, false)"
          >入库
        </ElButton>
        <ElButton
          v-if="isAuth('AdministrativeService:inventoryManagement:discLibrary')"
          :text="true"
          class="btn-default"
          size="small"
          @click="openDialog(false, row, true)"
          >盘库
        </ElButton>
        <ElButton
          v-if="isAuth('AdministrativeService:inventoryManagement:del')"
          :text="true"
          class="btn-default"
          size="small"
          @click="delData(row, false)"
          >删除
        </ElButton>
      </template>
    </Table>
    <!-- 弹出框 -->
    <InventoryManagementDialog
      ref="InventoryManagementDialogRef"
      @change-get-detail-and-list="resetList"
    />
    <EntryAndExitRecords ref="EntryAndExitRecordsRef" />
    <LimitDailog routerName="inventoryManagement" />
  </ContentWrap>
</template>
<script lang="ts" setup>
import { ref, reactive, computed, onMounted, h, unref, getCurrentInstance } from 'vue'
import { InventoryManagementDialog } from './components'
import EntryAndExitRecords from './entryAndExitRecords/EntryAndExitRecords.vue'
import { ContentWrap } from '@/components/ContentWrap'
import { Table } from '@/components/Table'
import { TableColumn } from '@/types/table'
import { useEmitt } from '@/hooks/web/useEmitt'
import { Search } from '@/components/Search'
import { useTable } from '@/hooks/web/useTable'
import { useAppStore } from '@/store/modules/app'
import { AnnouncementData } from '@/api/AdministrativeService/announcement/types'
import {
  getTinfoGoodsList,
  deltinfoGoods,
  exportTinfoGoodsListApi,
  getGoodsList
} from '@/api/AdministrativeService/inventoryManagement'
import { CrudSchema, useCrudSchemas } from '@/hooks/web/useCrudSchemas'
import { ElButton, ElTag, ElMessage, ElMessageBox } from 'element-plus'
import moment from 'moment'
import { isAuth } from '@/utils/is' // 鉴权
import { useRouter } from 'vue-router'
import { deleteBatchFolderOrFile } from '@/api/AdministrativeService/qualifications'
import { LimitDailog } from '@/views/Components/limit'

const EntryAndExitRecordsRef = ref()
const router = useRouter()
// 从字典管理拿到物品类型的数据
const { proxy } = getCurrentInstance() as any
const { goods_type } = proxy.useDict('goods_type')
const InventoryManagementDialogRef = ref<any>()
const appStore = useAppStore()

const getUserLabel = (value: string, arr): string => {
  let label = ''
  unref(goods_type).map((item: any) => {
    if (value == item.value) {
      label = item.label
    }
  })
  return label
}
//删除加载
const delLoading = ref(false)
// 表格高度
const defaultHeight = ref(0)

const params = reactive<any>({
  goodsName: '',
  goodsType: ''
})
// 存放物品名称的数据
let goodsListData = ref([])
// 存放表格的数据
const crudSchemas = reactive<CrudSchema[]>([
  {
    field: 'id',
    label: '序号',
    minWidth: '60px'
  },
  {
    field: 'goodsType',
    label: '物品类型',
    minWidth: '120px',
    formatter: (row: Recordable) => {
      return h('span', row.goodsType ? getUserLabel(row.goodsType) : '--')
    },
    search: {
      show: true,
      component: 'Select',
      componentProps: {
        style: 'width: 196px',
        options: goods_type,
        placeholder: '物品类型',
        filterable: true
      }
    }
  },
  {
    field: 'goodsName',
    label: '物品名称',
    minWidth: '140px',
    search: {
      show: true,
      component: 'Select',
      componentProps: {
        maxlength: 200,
        style: 'width: 196px',
        placeholder: '物品名称',
        options: goodsListData,
        filterable: true,
        popperClass: 'max-select'
      }
    }
  },
  {
    field: 'stockNum',
    label: '库存数量',
    minWidth: '80px',
    formatter: (row: Recordable) => {
      return h('span', row.stockNum ? row.stockNum : '0')
    }
  },
  {
    field: 'createName',
    label: '录入人',
    minWidth: '120px',
    formatter: (row: Recordable) => {
      return h('span', row.createName ? row.createName : '--')
    }
  },
  {
    field: 'createDate',
    label: '录入时间',
    minWidth: '120px',
    formatter: (row: Recordable) => {
      return h('span', row.createDate ? moment(row.createDate).format('YYYY-MM-DD') : '--')
    }
  },
  {
    field: 'action',
    fixed: 'right',
    minWidth: '180px',
    label: '操作',
    showOverflowTooltip: false
  }
])
const { allSchemas } = useCrudSchemas(crudSchemas)
const { register, tableObject, methods } = useTable<AnnouncementData>({
  getListApi: getTinfoGoodsList,
  delListApi: deltinfoGoods,
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
const getGoodsListData = async () => {
  if (goodsListData.value.length > 0) {
    goodsListData.value = []
    const res = await getGoodsList()
    res.data.forEach((item) => {
      goodsListData.value.push({
        value: item,
        label: item
      })
    })
  } else {
    const res = await getGoodsList()
    res.data.forEach((item) => {
      goodsListData.value.push({
        value: item,
        label: item
      })
    })
  }
  return goodsListData.value
}
getGoodsListData()
useEmitt({
  name: 'window',
  callback: (type: string) => {
    if (type === 'resize') {
      resetTableHeight()
    }
  }
})
//搜索
const setSearchParamsSub = (param: any) => {
  params.goodsName = param.goodsName ? param.goodsName : ''
  params.goodsType = param.goodsType ? param.goodsType : ''
  setSearchParams(params)
}
// 打开新增/编辑查看窗口
const openDialog = (flag: boolean, row: any, status: boolean) => {
  if (flag) {
    InventoryManagementDialogRef.value.openDialog(flag)
  } else {
    InventoryManagementDialogRef.value.openDialog(flag, row.id, status)
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
  await exportTinfoGoodsListApi(params)
  exLoading.value = false
}
const searchRef = ref()
// 删除/批量删除
const delData = async (row: any, flag: boolean) => {
  tableObject.currentRow = row
  const { delList, getSelections } = methods
  const selections = await getSelections()
  if (!selections.length && flag) {
    ElMessage.warning('请选择需要删除的数据')
    return
  }
  if (selections.length) {
    ElMessageBox.confirm('是否删除所选中数据？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
      autofocus: false
    }).then(async () => {
      let ids = selections.map((v) => v.id).toString()
      deltinfoGoods(flag ? ids : row.id).then((res) => {
        if (res) {
          ElMessage.success('删除成功')
          getGoodsListData()
          searchRef.value.reset()
          getList()
        }
      })
    })
  } else {
    ElMessageBox.confirm('是否删除该数据？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
      autofocus: false
    }).then(async () => {
      let ids = selections.map((v) => v.id).toString()
      deltinfoGoods(flag ? ids : row.id).then((res) => {
        if (res) {
          ElMessage.success('删除成功')
          getGoodsListData()
          searchRef.value.reset()
          getList()
        }
      })
    })
  }
}
// 点击物品名称跳转到出入库管理
const jump = (row) => {
  EntryAndExitRecordsRef.value.openDrawer(row.id)
  // router.push({
  //   path: '/AdministrativeService/entryAndExitRecords',
  //   query: {
  //     id: row.id
  //   }
  // })
}

// 更新表格
const resetList = () => {
  tableObject.currentPage = 1
  getList()
  getGoodsListData()
}
</script>
<style lang="less" scoped>
.top {
  display: flex;
  justify-content: space-between;
}
</style>
