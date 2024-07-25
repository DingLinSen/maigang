<template>
  <div class="upload_table">
    <Breadcrumbs>
      <template #rightContent>
        <ElButton class="no-bg-button" @click="delClick()">
          <template #icon>
            <Icon :size="14" icon="svg-icon:deleteBut" />
          </template>
          清空回收站
        </ElButton>
      </template>
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
        :selection="true"
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
            <div class="title_name"> {{ row.title }} </div>
            <div class="operation_btn">
              <div v-show="row.show">
                <Icon
                  title="还原"
                  @click="action(row)"
                  icon="svg-icon:recycleBin"
                  class="cursor-pointer"
                />
                <!-- <Icon icon="svg-icon:download_icon" class="mx-[1.04vw] cursor-pointer" /> -->
                <!-- <Icon icon="svg-icon:collection_t_icon" class="mx-[1.04vw] cursor-pointer" /> -->
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
  </div>
</template>
<script setup lang="ts">
import { ref, reactive, onMounted, h, nextTick } from 'vue'
import Breadcrumbs from '../components/Breadcrumbs.vue'
import { useEmitt } from '@/hooks/web/useEmitt'
import { Table } from '@/components/Table'
import { Icon } from '@/components/Icon'
import { useTable } from '@/hooks/web/useTable'
import { ElButton, ElMessage, ElMessageBox } from 'element-plus'
import { getRecycleListApi, restoreApi, delRecordApi } from '@/api/personal/recycleBin'
import { CrudSchema, useCrudSchemas } from '@/hooks/web/useCrudSchemas'
import { useCache } from '@/hooks/web/useCache'

const { wsCache } = useCache()
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

const { register, tableObject, methods } = useTable<TableData>({
  getListApi: getRecycleListApi,
  // delListApi: delGroupApi,
  response: {
    list: 'rows',
    total: 'total'
  }
})

onMounted(() => {
  resetTableHeight()
})

const delClick = async () => {
  ElMessageBox.confirm('是否清空回收站中的全部数据？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
    autofocus: false
  }).then(async () => {
    let res = await delRecordApi(wsCache.get('userInfo').userName)
    if (res) {
      ElMessage.success('已清空！')
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
    field: 'updateTime',
    label: '删除时间',
    minWidth: '120px',
    formatter: (row: Recordable) => {
      return h('span', row.updateTime ? row.updateTime : '--')
    }
  },
  {
    field: 'liveTime',
    label: '有效时间',
    minWidth: '60px',
    formatter: (row: Recordable) => {
      return h('span', row.liveTime ? row.liveTime + '天' : '--')
    }
  }
])

const action = async (row) => {
  ElMessageBox.confirm('是否还原当前数据？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
    autofocus: false
  }).then(async () => {
    let res = await restoreApi({ titleId: row.id })
    if (res) {
      ElMessage.success('还原成功！')
      getList()
    }
  })
}
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
    min-width: 200px;
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
