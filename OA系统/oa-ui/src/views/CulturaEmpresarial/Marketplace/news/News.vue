<template>
  <ContentWrap Showtitle="新闻管理">
    <template #ContentWrapTitle>
      <div>
        <ElButton
          class="btn-add"
          v-if="isAuth('Marketplace:news:add')"
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
          v-if="isAuth('Marketplace:news:batchDel')"
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
      v-if="tableShow"
      :isShowFilter="true"
      :border="true"
      ref="ElTableRef"
      v-model:pageSize="tableObject.pageSize"
      v-model:currentPage="tableObject.currentPage"
      :data="tableObject.tableList"
      :loading="tableObject.loading"
      :columns="allSchemas.tableColumns"
      :header-align="'center'"
      :cotentAlign="'center'"
      :pagination="{
        total: tableObject.total
      }"
      :cell-style="cellStyle"
      @register="register"
    >
      <template #operateBtnLeft>
        <Search
          v-if="isAuth('Marketplace:news:query')"
          :schema="allSchemas.searchSchema"
          @search="setSearchParamsSub"
          @reset="setSearchParamsSub"
        />
      </template>
      <template #id="{ $index }">
        <span>
          {{ $index + 1 + tableObject.pageSize * (tableObject.currentPage - 1) }}
        </span>
      </template>
      <template #action="{ row }">
        <ElButton
          v-if="isAuth('Marketplace:news:detail')"
          class="btn-default"
          :text="true"
          size="small"
          @click="openDialog(false, row, 'detail')"
          >详情
        </ElButton>
        <ElButton
          v-if="isAuth('Marketplace:news:edit') && row.aduStatus != 1"
          class="btn-default"
          :text="true"
          size="small"
          @click="openDialog(false, row)"
          >编辑
        </ElButton>
        <ElButton
          class="btn-default"
          :text="true"
          size="small"
          v-if="isAuth('Marketplace:news:del')"
          @click="delData(row, false)"
          >删除
        </ElButton>
        <ElButton
          class="btn-default"
          :text="true"
          size="small"
          v-if="isAuth('Marketplace:news:publish') && row.aduStatus != 1"
          @click="publishData(row, false)"
          >发布
        </ElButton>
        <ElButton
          class="btn-default"
          :text="true"
          size="small"
          v-if="isAuth('Marketplace:news:revocation') && row.aduStatus != 2 && row.aduStatus != 0"
          @click="publishData(row, true)"
          >撤回
        </ElButton>
      </template>
    </Table>
    <!-- 弹出框 -->
    <NewsDialog @change-get-detail-and-list="resetList" ref="NewsDialogRef" />
    <LimitDailog routerName="news" />
  </ContentWrap>
</template>
<script setup lang="ts">
import { ref, reactive, computed, onMounted, h, unref, nextTick, watch } from 'vue'
import { NewsDialog } from './components'
import { ContentWrap } from '@/components/ContentWrap'
import { Table } from '@/components/Table'
import { TableColumn } from '@/types/table'
import { useEmitt } from '@/hooks/web/useEmitt'
import { Search } from '@/components/Search'
import { useTable } from '@/hooks/web/useTable'
import { useAppStore } from '@/store/modules/app'
import { AnnouncementData } from '@/api/AdministrativeService/announcement/types'
import {
  getCompanyContentList,
  delCompanyContent,
  updateStatusApi
} from '@/api/CulturaEmpresarial/news'
import { CrudSchema, useCrudSchemas } from '@/hooks/web/useCrudSchemas'
import { ElButton, ElTag, ElMessage, ElMessageBox } from 'element-plus'
import moment from 'moment'
import { isAuth } from '@/utils/is' // 鉴权
import { LimitDailog } from '@/views/Components/limit'
import axios from 'axios'
import { useRoute } from 'vue-router'

const tableShow = ref(false)

const basePath = import.meta.env.VITE_API_BASEPATH
const publishLoading = ref(false)

const NewsDialogRef = ref<any>()
const appStore = useAppStore()
//删除加载
const delLoading = ref(false)
// 表格高度
const defaultHeight = ref(0)
// 发布状态的数据
const publishDataList = [
  {
    value: 0,
    label: '未发布'
  },
  {
    value: 1,
    label: '已发布'
  },
  {
    value: 2,
    label: '已撤回'
  }
]
const params = reactive<any>({
  title: ''
})
// 存放表格的数据
const crudSchemas = reactive<CrudSchema[]>([
  {
    field: 'id',
    label: '序号',
    minWidth: '80px'
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
        maxlength: 200,
        style: 'width: 196px',
        placeholder: '标题名称筛选'
      }
    }
  },
  {
    field: 'aduStatus',
    label: '状态',
    minWidth: '120px',
    formatter: (row: any, __: TableColumn, cellValue: string) => {
      let label: string = getElTagLabel(cellValue)
      return h(
        ElTag,
        {
          type:
            cellValue == '0'
              ? 'info'
              : cellValue == '1'
              ? 'success'
              : cellValue == '2'
              ? 'danger'
              : ''
        },
        () => label
      )
    }
  },
  {
    field: 'pubTime',
    label: '发布日期',
    minWidth: '120px',
    formatter: (row: Recordable) => {
      return h('span', row.pubTime ? moment(row.pubTime).format('YYYY-MM-DD') : '--')
    }
  },
  {
    field: 'createUserName',
    label: '创建人',
    minWidth: '120px',
    formatter: (row: Recordable) => {
      return h('span', row.createUserName ? row.createUserName : '--')
    }
  },
  {
    field: 'createTime',
    label: '创建时间',
    minWidth: '120px',
    formatter: (row: Recordable) => {
      return h('span', row.createTime ? moment(row.createTime).format('YYYY-MM-DD') : '--')
    }
  },
  {
    field: 'editUserName',
    label: '编辑人',
    minWidth: '120px',
    formatter: (row: Recordable) => {
      return h('span', row.editUserName ? row.editUserName : '--')
    }
  },
  {
    field: 'editTime',
    label: '编辑时间',
    minWidth: '120px',
    formatter: (row: Recordable) => {
      return h('span', row.editTime ? moment(row.editTime).format('YYYY-MM-DD') : '--')
    }
  },
  {
    field: 'action',
    fixed: 'right',
    className: 'actionRegion',
    label: '操作',
    minWidth: '200px',
    showOverflowTooltip: false
  }
])

const cellStyle = ({ row, column, rowIndex, columnIndex }) => {
  if (column.className == 'actionRegion') {
    nextTick(() => {
      let arr = []
      Array.from(document.querySelectorAll('.actionRegion .cell')).forEach((element) => {
        arr.push(element.children.length)
      })
      column.minWidth = Math.max.apply(null, arr) * 50 + 40
    })
  }
}
const { allSchemas } = useCrudSchemas(crudSchemas)
const { register, elTableRef, tableObject, methods } = useTable<AnnouncementData>({
  getListApi: getCompanyContentList,
  delListApi: delCompanyContent,
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

useEmitt({
  name: 'del',
  callback: (type: string) => {
    if (type === 'sure') {
      deleteData()
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
  setSearchParams(params)
}
// 打开新增/编辑查看窗口
const openDialog = (flag: boolean, row: any, str: string) => {
  if (flag) {
    NewsDialogRef.value.openDialog(flag)
  } else if (str == 'detail') {
    NewsDialogRef.value.openDialog(flag, row.id, 'detail')
  } else {
    NewsDialogRef.value.openDialog(flag, row.id)
  }
}
// 删除/批量删除
const ids = ref<string>('')
const delData = async (row: any, flag: boolean) => {
  ids.value = ''
  tableObject.currentRow = row
  const { delList, getSelections } = methods
  const selections = await getSelections()
  delLoading.value = true
  let dataIds = flag
    ? selections.map((v) => v.id)
    : [tableObject.currentRow?.id as unknown as string]
  await delList(dataIds, flag, true, true).finally(() => {
    delLoading.value = false
  })
  ids.value = dataIds.toString()
}
//删除官网新闻
const deleteData = async () => {
  if (ids.value && basePath == 'pro') {
    axios.defaults.withCredentials = true
    axios.delete('/news-api/companyContent?ids=' + ids.value).then((res) => {
      console.log('新闻删除：' + res.status)
      ids.value = ''
    })
  }
}

// 发布/撤回
const publishData = async (row: any, flag: boolean) => {
  ElMessageBox.confirm(flag ? '是否要进行撤回?' : '是否要进行发布?', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
    autofocus: false
  }).then(async () => {
    publishLoading.value = true
    const res = await updateStatusApi({
      id: row.id,
      aduStatus: flag ? 2 : 1,
      flag: basePath == 'pro' ? '0' : ''
      // flag: '0'
    })
    if (res.data) {
      // publishNewsData(row.id, flag ? 2 : 1)
      publishLoading.value = false
      ElMessage.success(flag ? '撤回信息成功' : '发布信息成功')
      await getList()
    }
  })
}
//发布/撤回官网新闻
const publishNewsData = (ids: any, flag: any) => {
  if (basePath == 'pro') {
    axios.defaults.withCredentials = true
    axios
      .get('/news-api/companyContent/updateStatus?id=' + ids + '&aduStatus=' + flag)
      .then((res) => {
        if (flag == 2) {
          console.log('新闻撤回：' + res.status)
        } else {
          console.log('新闻发布：' + res.status)
        }
      })
  }
}
// 更新表格
const resetList = () => {
  tableObject.currentPage = 1
  getList()
}

const route = useRoute()

watch(
  () => route,
  () => {
    if (route.name == 'News') {
      nextTick()
      tableShow.value = true
    } else {
      tableShow.value = false
    }
  },
  { immediate: true, deep: true }
)
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
}
</style>
