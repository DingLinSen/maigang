<template>
  <div class="upload_table">
    <Breadcrumbs>
      <!-- <template #rightContent>
        <ElButton
          class="no-bg-button"
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
        :selection="false"
        :height="defaultHeight"
        :cell-class-name="showColor"
        :isShowFilter="false"
        :choose-list-all="selectionList"
        @cell-mouse-enter="handleCell"
        @cell-mouse-leave="handleCell"
        @row-click="openMyUploadDetail"
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
                  title="收藏"
                  v-if="row.collectionCount == 0"
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
                <!-- <Icon icon="svg-icon:closeShare" class="cursor-pointer" @click="closeShare(row)" /> -->
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
    <ShareSelection ref="shareSelectionRef" @shareToSuccess="shareToSuccess" />
  </div>
</template>
<script setup lang="ts">
import { ref, reactive, onMounted, h, nextTick } from 'vue'
import Breadcrumbs from '../components/Breadcrumbs.vue'
import { useEmitt } from '@/hooks/web/useEmitt'
import { Table } from '@/components/Table'
import { Icon } from '@/components/Icon'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useTable } from '@/hooks/web/useTable'
import { getShareMeApi } from '@/api/personal/shareWithMe'
import { cancelShareApi } from '@/api/personal/myShare'
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
  getListApi: getShareMeApi,
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
    field: 'createByName',
    label: '分享人',
    minWidth: '60px',
    formatter: (row: Recordable) => {
      return h('span', row.createByName ? row.createByName : '--')
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
const { allSchemas } = useCrudSchemas(crudSchemas)
const { getList } = methods
const handleCell = (row) => {
  row.show = !row.show
}
const openMyUploadDetail = (row) => {
  const { href } = router.resolve({
    path: `/myDetail/${row.titleId}/share/${row.id}`
  })
  window.open(href, '_blank')
}
const shareToSuccess = () => {
  getList()
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
