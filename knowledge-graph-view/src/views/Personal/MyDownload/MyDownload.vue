<template>
  <div class="upload_table">
    <Breadcrumbs>
      <template #rightContent>
        <ElButton class="no-bg-button" @click="delData(null, true)">
          <template #icon>
            <Icon :size="14" icon="svg-icon:deleteBut" />
          </template>
          批量删除
        </ElButton>
      </template>
    </Breadcrumbs>
    <div>
      <Table
        :emptyText="'暂无数据'"
        v-model:pageSize="tableObject.pageSize"
        v-model:currentPage="tableObject.currentPage"
        :ref="tableRef"
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
        :isShowFilter="false"
        :selection="true"
        :cell-class-name="showColor"
        :choose-list-all="selectionList"
        @cell-mouse-enter="handleCell"
        @cell-mouse-leave="handleCell"
        @register="register"
        :pagination="{
          total: tableObject.total
        }"
      >
        <template #fileName="{ row }">
          <div class="title_box">
            <div class="title_name"
              ><Icon
                title="文件"
                icon="svg-icon:knowledge_icon"
                class="mr-5px cursor-pointer wenIcon"
              />
              <Icon
                title="文件"
                icon="svg-icon:selected_knowledge_icon"
                class="mr-5px cursor-pointer wenSelectedIcon"
              />
              <p>{{ row.fileName }}</p>
            </div>
            <div class="operation_btn">
              <div v-show="row.show">
                <!-- <Icon icon="svg-icon:share_t_icon" class="cursor-pointer" /> -->
                <Icon
                  title="下载"
                  @click="downLoad(row)"
                  icon="svg-icon:download_icon"
                  class="mx-[1.04vw] cursor-pointer"
                />
                <Icon
                  title="删除"
                  @click="delData(row, false)"
                  icon="svg-icon:delete_t_icon"
                  class="cursor-pointer"
                />
              </div>
            </div>
          </div>
        </template>
      </Table>
    </div>
    <!-- <ShareSelection /> -->
  </div>
</template>
<script setup lang="ts">
import { ref, reactive, onMounted, h, nextTick } from 'vue'
import Breadcrumbs from '../components/Breadcrumbs.vue'
import { useEmitt } from '@/hooks/web/useEmitt'
import { Table } from '@/components/Table'
import { Icon } from '@/components/Icon'
import { ElButton } from 'element-plus'
import { useTable } from '@/hooks/web/useTable'
import { getDownloadRecordApi, delDownloadRecordApi } from '@/api/personal/myDownload'
import { myUploadDownloadApi } from '@/api/personal/myUpload'
import { fileSize } from '@/utils/index'
import { CrudSchema, useCrudSchemas } from '@/hooks/web/useCrudSchemas'
// import ShareSelection from '../components/ShareSelection.vue'

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
const tableRef = ref()
useEmitt({
  name: 'window',
  callback: (type: string) => {
    if (type === 'resize') {
      resetTableHeight()
    }
  }
})

const { register, tableObject, methods } = useTable<TableData>({
  getListApi: getDownloadRecordApi,
  delListApi: delDownloadRecordApi,
  response: {
    list: 'rows',
    total: 'total'
  }
})

//下载

const downLoad = async (row) => {
  await myUploadDownloadApi({ fileId: row.fileId }, row.fileName)
  getList()
}

const delLoading = ref()
// 删除
const delData = async (row: TableData | null, multiple: boolean) => {
  tableObject.currentRow = row
  const { delList, getSelections } = methods
  const selections = await getSelections()

  delLoading.value = true
  await delList(
    multiple ? selections.map((v) => v.id) : [tableObject.currentRow?.id as string],
    multiple
  ).finally(() => {
    delLoading.value = false
  })
}

// 存放表格的数据
const crudSchemas = reactive<CrudSchema[]>([
  {
    field: 'fileName',
    label: '文件',
    minWidth: '550px',
    headerAlign: 'left'
  },
  {
    field: 'createByName',
    label: '创建人',
    minWidth: '60px',
    headerAlign: 'left',
    formatter: (row: Recordable) => {
      return h('span', row.createByName ? row.createByName : '--')
    }
  },
  // {
  //   field: 'operationBtn',
  //   label: '下载时间',
  //   minWidth: '350px'
  //   // formatter: (row: Recordable) => {
  //   //   return h('span', row.title ? row.title : '--')
  //   // }
  // },
  {
    field: 'createTime',
    label: '下载时间',
    minWidth: '120px',
    headerAlign: 'left',
    formatter: (row: Recordable) => {
      return h('span', row.createTime ? row.createTime : '--')
    }
  },

  {
    field: 'fileSize',
    label: '文件大小',
    minWidth: '60px',
    headerAlign: 'left',
    formatter: (row: Recordable) => {
      return h('span', row.fileSize ? fileSize(row.fileSize) : '--')
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
    display: flex;
    align-items: center;

    min-width: 200px;
    // max-width: 500px;
    text-align: left;
    p {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }
  .operation_btn {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    width: 320px !important;
  }
  :deep(.el-icon svg) {
    font-size: 0.72vw;
  }
  :deep(.wenIcon svg) {
    font-size: 2.2vw !important;
  }
  :deep(.wenSelectedIcon svg) {
    font-size: 2.2vw !important;
  }

  .wenSelectedIcon {
    width: 14px;
    display: none;
  }
  .wenIcon {
    width: 16px;
    display: flex;
  }
}

.heli .wenSelectedIcon {
  display: flex;
}

.heli .wenIcon {
  display: none !important;
}
</style>
