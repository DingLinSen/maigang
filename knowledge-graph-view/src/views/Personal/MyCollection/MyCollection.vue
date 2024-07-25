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
        :statisticsList="true"
        :index="true"
        :height="defaultHeight"
        :cell-class-name="showColor"
        :isShowFilter="false"
        :selection="false"
        @row-click="openMyUploadDetail"
        :choose-list-all="selectionList"
        @cell-mouse-enter="handleCell"
        @cell-mouse-leave="handleCell"
        :pagination="{
          total: tableObject.total
        }"
        @register="register"
      >
        <template #title="{ row }">
          <div class="title_box">
            <div class="title_name text-active"> {{ row.title }}</div>
            <div class="operation_btn">
              <div v-show="row.show">
                <!-- <Icon
                title="分享"
                icon="svg-icon:share_t_icon"
                class="cursor-pointer"
                @click.stop="shareClick(row)"
              /> -->
                <!-- <Icon icon="svg-icon:download_icon" class="mx-[1.04vw] cursor-pointer" /> -->
                <Icon
                  title="取消收藏"
                  icon="svg-icon:ycollection"
                  class="mx-[1.04vw] cursor-pointer"
                  @click.stop="collectionClick(row)"
                />
                <!-- <Icon
                icon="svg-icon:delete_t_icon"
                class="mx-[1.04vw] cursor-pointer"
                @click="delData(row, false)"
              /> -->
              </div>
            </div>
          </div>
        </template>
      </Table>
    </div>
    <ShareSelection ref="shareSelectionRef" />
  </div>
</template>
<script setup lang="ts">
import { ref, reactive, onMounted, h, nextTick } from 'vue'
import Breadcrumbs from '../components/Breadcrumbs.vue'
import { useEmitt } from '@/hooks/web/useEmitt'
import { Table } from '@/components/Table'
import { Icon } from '@/components/Icon'
import { ElMessage } from 'element-plus'
import { useTable } from '@/hooks/web/useTable'
import { getMyCollectionApi } from '@/api/personal/myCollection'
import { closeCollectionApi } from '@/api/personal/myCollection'
import { CrudSchema, useCrudSchemas } from '@/hooks/web/useCrudSchemas'
import ShareSelection from '../components/ShareSelection.vue'
import { useRouter } from 'vue-router'

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
  nextTick(() => {
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
const collectionClick = async (row) => {
  let data = {
    type: '2',
    shareId: row.shareId ? row.shareId : null,
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
  getListApi: getMyCollectionApi,
  // delListApi: delGroupApi,
  response: {
    list: 'rows',
    total: 'total'
  }
})
const openMyUploadDetail = (row) => {
  const { href } = router.resolve({
    path: `/myDetail/${row.titleId}${row.shareId ? '/share/' + row.shareId : ''}`
  })
  window.open(href, '_blank')
}
const shareClick = (row) => {
  shareSelectionRef.value.openDrawer(row.titleId)
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
    field: 'knowledgeTypeName',
    label: '知识分类',
    minWidth: '120px',
    formatter: (row: Recordable) => {
      return h('span', row.knowledgeTypeName ? row.knowledgeTypeName : '--')
    }
  },
  {
    field: 'createTime',
    label: '收藏时间',
    minWidth: '120px',
    formatter: (row: Recordable) => {
      return h('span', row.createTime ? row.createTime : '--')
    }
  }
])
const { allSchemas } = useCrudSchemas(crudSchemas)
const { getList } = methods
const handleCell = (row) => {
  row.show = !row.show
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
}
</style>
