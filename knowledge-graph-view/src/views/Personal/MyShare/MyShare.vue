<template>
  <div class="upload_table">
    <Breadcrumbs>
      <!-- <template #rightContent>
        <ElButton
          class="btn-add float-right"
          v-hasPermi="'system:tag:add'"
          @click="AddAction(null)"
          plain
        >
          <template #icon>
            <Icon :size="14" icon="svg-icon:addBut" />
          </template>
          批量下载
        </ElButton>
      </template> -->
    </Breadcrumbs>
    <div>
      <Table
        ref="tableRef"
        :emptyText="'暂无数据'"
        v-model:pageSize="tableObject.pageSize"
        v-model:currentPage="tableObject.currentPage"
        :border="false"
        :selectionWidth="16"
        :columns="allSchemas.tableColumns"
        :data="tableObject.tableList"
        :loading="tableObject.loading"
        cotentAlign="left"
        headerAlign="left"
        :selection="false"
        :statisticsList="true"
        :index="true"
        :height="defaultHeight"
        :cell-class-name="showColor"
        :isShowFilter="false"
        @row-click="openMyUploadDetail"
        :choose-list-all="selectionList"
        @cell-mouse-enter="handleCell"
        @cell-mouse-leave="handleCell"
        :pagination="{
          total: tableObject.total
        }"
        @register="register"
        :expandWidth="1"
        :expand="true"
      >
        <template #expand="{ row }">
          <div class="mx-42px py-2px flex items-center">
            <div v-if="row.type == 1"
              >分享链接：{{ urlHttp + 'myDetail/' + row.titleId + '/uuid/' + row.uuid }} &nbsp;
              &nbsp; 提取码：{{ row.withCode == 1 ? row.extractCode : '无提取码' }}</div
            >
            <div v-else>被分享人：{{ row.users.map((v) => v.userName).join(',') }}</div>
          </div>
        </template>
        <template #title="{ row }">
          <div class="title_box">
            <div class="title_name"> {{ row.title }}</div>
            <div class="operation_btn">
              <div class="icon_title">
                <Icon
                  v-if="row.collectionCount == 0"
                  title="收藏"
                  icon="svg-icon:collection_t_icon"
                  class="mx-[1.04vw] cursor-pointer"
                  @click.stop="collectionClick(row)"
                />
                <Icon
                  title="取消收藏"
                  v-else-if="row.collectionCount > 0"
                  icon="svg-icon:ycollection"
                  class="mx-[1.04vw] cursor-pointer"
                  @click.stop="collectionClick(row)"
                />
                <Icon
                  icon="svg-icon:closeShare"
                  title="取消分享"
                  class="cursor-pointer"
                  @click.stop="closeShare(row)"
                />
              </div>
            </div>
          </div>
        </template>
      </Table>
    </div>
    <ShareSelection ref="shareSelectionRef" @shareToSuccess="shareToSuccess" />
  </div>
</template>
<script setup lang="ts">
import { ref, reactive, onMounted, h, unref, nextTick } from 'vue'
import Breadcrumbs from '../components/Breadcrumbs.vue'
import { useEmitt } from '@/hooks/web/useEmitt'
import { Table } from '@/components/Table'
import { Icon } from '@/components/Icon'
import { ElButton, ElMessage, ElMessageBox } from 'element-plus'
import { useTable } from '@/hooks/web/useTable'
import { getMyShareListApi, cancelShareApi } from '@/api/personal/myShare'
import { closeCollectionApi } from '@/api/personal/myCollection'
import { CrudSchema, useCrudSchemas } from '@/hooks/web/useCrudSchemas'
import ShareSelection from '../components/ShareSelection.vue'
import { useRouter } from 'vue-router'

const urlHttp = import.meta.env.VITE_URL
const router = useRouter()
const getOverViewWrapper = (dom: string): number => {
  let topH = 0
  const checkboxWrapper = document.querySelector(dom)
  if (checkboxWrapper) {
    topH = checkboxWrapper.clientHeight
  }
  return topH
}
const getPadding = (dom: string): number => {
  let topH = 0
  const checkboxWrapper = document.querySelector(dom)
  if (checkboxWrapper) {
    topH =
      parseFloat(getComputedStyle(checkboxWrapper).paddingBottom) +
      parseFloat(getComputedStyle(checkboxWrapper).paddingTop) +
      parseFloat(getComputedStyle(checkboxWrapper).marginBottom) +
      parseFloat(getComputedStyle(checkboxWrapper).marginTop)
  }
  return topH
}
const selectionList = ref([])
const defaultHeight = ref<number>(0)
const resetTableHeight = () => {
  nextTick(() => {
    const documentClientHeight = getOverViewWrapper('body')
    const overView = getOverViewWrapper('.v-tool-header')
    const tagsHeight: any = getOverViewWrapper('.tags-view-cont')
    // const tagsViewCont: any = document.querySelector('.tags-view-cont')
    const toolHeaderPadding = getPadding('.v-tool-header')
    const uploadTablePadding = getPadding('.upload_table')
    const tagsViewContMargin = getPadding('.tags-view-cont')
    const elPaginationHeight = getOverViewWrapper('.el-pagination')
    const elPaginationPadding = getPadding('.el-pagination')
    const overViewWrapper = getOverViewWrapper('#tags-view-cont')

    defaultHeight.value =
      documentClientHeight -
      overView -
      tagsHeight -
      elPaginationHeight -
      elPaginationPadding -
      overViewWrapper -
      tagsViewContMargin -
      uploadTablePadding -
      toolHeaderPadding
  })
}
useEmitt({
  name: 'window',
  callback: (type: string) => {
    if (type === 'resize') {
      resetTableHeight()
    }
  }
})
const shareToSuccess = () => {
  getList()
}
const collectionClick = async (row) => {
  let data = {
    type: row.collectionCount > 0 ? '2' : '1',
    shareId: row.id ? row.id : null,
    titleId: row.titleId
  }
  let res = await closeCollectionApi(data)
  if (res) {
    ElMessage.success('操作成功！')
    getList()
  }
}
const shareSelectionRef = ref()
const { register, tableObject, methods } = useTable<TableData>({
  getListApi: getMyShareListApi,
  // delListApi: delGroupApi,
  response: {
    list: 'rows',
    total: 'total'
  }
})
const shareClick = (row) => {
  shareSelectionRef.value.openDrawer(row.titleId)
}
const closeShare = async (row) => {
  ElMessageBox.confirm('是否取消分享这条数据？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
    autofocus: false
  }).then(async () => {
    let res = await cancelShareApi({
      id: row.id
    })
    if (res) {
      ElMessage.success('操作成功！')
      getList()
    }
  })
}
// 存放表格的数据
const crudSchemas = reactive<CrudSchema[]>([
  // {
  //   field: 'id',
  //   label: '序号',
  //   width: '60px'
  // },
  {
    field: 'title',
    label: '标题',
    minWidth: '550px',
    headerAlign: 'left'
  },
  {
    field: 'type',
    label: '分享方式',
    minWidth: '100px',
    formatter: (row: Recordable) => {
      return h('span', row.type == 1 ? '链接分享' : row.type == 2 ? '发送好友' : '--')
    }
  },
  {
    field: 'createTime',
    label: '分享时间',
    minWidth: '120px',
    formatter: (row: Recordable) => {
      return h('span', row.createTime ? row.createTime : '--')
    }
  },
  {
    field: 'invalidDate',
    label: '失效时间',
    minWidth: '80px',
    formatter: (row: Recordable) => {
      return h(
        'span',
        row.isCancel == 1
          ? '已失效'
          : row.effectiveDays == -1
          ? '永久'
          : row.invalidDate
          ? row.invalidDate
          : '--'
      )
    }
  }
])
const tableRef = ref()
const { allSchemas } = useCrudSchemas(crudSchemas)
const { getList, setSearchParams } = methods
const handleCell = (row) => {
  // row.__proto__.show = !row.__proto__.show
  // console.log(row.show)
  // if (row.show) {
  //   row.show = false
  // } else {
  //   row.show = true
  // }
}
const openMyUploadDetail = (row) => {
  console.log(tableRef.value, 999)
  unref(tableRef)?.elTableRef?.toggleRowExpansion(row)
  // const { href } = router.resolve({
  //   path: `/myDetail/${row.titleId}/share/${row.id}`
  // })
  // window.open(href, '_blank')
}
const showColor = ({ row }) => {
  const checkIdList = selectionList.value.map((item) => item.id)
  if (checkIdList.includes(row.id)) {
    return 'heli'
  }
}
onMounted(() => {
  getList()
  resetTableHeight()
})
</script>
<style lang="less">
.customPopper {
  width: 120px !important;
  min-width: 120px !important;
}
</style>
<style scoped lang="less">
.upload_table {
  padding: 20px;
}
.operationBtn {
  li {
    padding: 0 0 0 8px;
    cursor: pointer;
    margin: 8px 0;
  }
}
.title_box {
  padding-right: 20px;
  display: flex;
  justify-content: space-between;
  .title_name {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    // min-width: 200px;
    cursor: pointer !important;
    // max-width: 500px;
    text-align: left;
  }
  .operation_btn {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    text-align: right;
    width: 320px !important;
  }
  :deep(.el-icon svg) {
    font-size: 0.72vw;
  }
  .icon_title {
    display: none;
  }
}

:deep(.el-table__expand-column.el-table__cell) {
  visibility: hidden;
}
:deep(.el-table tbody .el-table__row:hover .icon_title) {
  display: block !important;
}
</style>
