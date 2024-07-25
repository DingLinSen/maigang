<template>
  <ContentWrap Showtitle="公司期刊">
    <template #ContentWrapTitle>
      <div>
        <ElButton
          class="btn-add"
          v-if="isAuth('Marketplace:periodical:add')"
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
          v-if="isAuth('Marketplace:periodical:batchDel')"
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
      :header-align="'center'"
      :cotentAlign="'center'"
      :pagination="{
        total: tableObject.total
      }"
      @register="register"
    >
      <template #operateBtnLeft>
        <Search
          v-if="isAuth('Marketplace:periodical:query')"
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
          v-if="isAuth('Marketplace:periodical:edit')"
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
          v-if="isAuth('Marketplace:periodical:del')"
          @click="delData(row, false)"
          >删除
        </ElButton>
        <ElButton
          class="btn-default"
          :text="true"
          size="small"
          v-if="isAuth('Marketplace:periodical:download')"
          @click="download(row)"
          >下载
        </ElButton>
      </template>
    </Table>
    <!-- 弹出框 -->
    <PeriodicalDialog @change-get-detail-and-list="resetList" ref="PeriodicalDialogRef" />
    <LimitDailog routerName="periodical" />
  </ContentWrap>
</template>
<script setup lang="ts">
import { ref, reactive, computed, onMounted, h, unref } from 'vue'
import { PeriodicalDialog } from './components'
import { ContentWrap } from '@/components/ContentWrap'
import { Table } from '@/components/Table'
import { TableColumn } from '@/types/table'
import { useEmitt } from '@/hooks/web/useEmitt'
import { Search } from '@/components/Search'
import { useTable } from '@/hooks/web/useTable'
import { useAppStore } from '@/store/modules/app'
import { AnnouncementData } from '@/api/AdministrativeService/announcement/types'
import { downloadFile } from '@/utils/index'
import {
  getAnnouncementOrInstitution,
  delAnnouncementOrInstitution,
  publishAnnouncementOrInstitution,
  revocationAnnouncementOrInstitution
} from '@/api/AdministrativeService/announcement'
import { delCompanyJournal, getCompanyJournalList } from '@/api/CulturaEmpresarial/periodical'
import { CrudSchema, useCrudSchemas } from '@/hooks/web/useCrudSchemas'
import { ElButton, ElTag, ElMessage, ElMessageBox } from 'element-plus'
import moment from 'moment'
import { isAuth } from '@/utils/is'
import axios from 'axios' // 鉴权
import { LimitDailog } from '@/views/Components/limit'

const publishLoading = ref(false)

const PeriodicalDialogRef = ref<any>()
const appStore = useAppStore()
//删除加载
const delLoading = ref(false)
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
    field: 'action',
    fixed: 'right',
    minWidth: '260px',
    label: '操作',
    showOverflowTooltip: false
  }
])
const { allSchemas } = useCrudSchemas(crudSchemas)
const { register, tableObject, methods } = useTable<AnnouncementData>({
  getListApi: getCompanyJournalList,
  delListApi: delCompanyJournal,
  response: {
    list: 'rows',
    total: 'total'
  },
  defaultParams: {
    pageType: 'a'
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
    PeriodicalDialogRef.value.openDialog(flag)
  } else {
    PeriodicalDialogRef.value.openDialog(flag, row.id)
  }
}
// 删除/批量删除
const delData = async (row: any, flag: boolean) => {
  tableObject.currentRow = row
  const { delList, getSelections } = methods
  const selections = await getSelections()
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
      publishLoading.value = false
      ElMessage.success('发布信息成功')
      await getList()
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
// 下载
const download = (row) => {
  axios
    .request({
      method: 'GET', //这个不解释了吧
      url: row.filePath, //路径
      responseType: 'blob' //告诉服务器想到的响应格式
    })
    .then((res) => {
      const blob = new Blob([res.data])
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.style.display = 'none'
      a.download = row.title ? row.title + '.pdf' : '公司期刊.pdf'
      a.href = url
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      //释放一个通过 URL.createObjectURL() 方法创建的 URL,防止内存泄漏
      URL.revokeObjectURL(url)
    })
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
</style>
