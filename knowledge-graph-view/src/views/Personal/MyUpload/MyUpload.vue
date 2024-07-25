<template>
  <div class="upload_table">
    <Breadcrumbs>
      <template #rightContent>
        <ElButton :loading="delLoading" class="no-bg-button" plain @click="delSelectData">
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
        @row-click="openMyUploadDetail"
        @register="register"
        :pagination="{
          total: tableObject.total
        }"
      >
        <template #title="{ row }">
          <div class="title_box">
            <div class="title_name text-active" :title="row.title"> {{ row.title }}</div>
            <div class="operation_btn" v-show="row.show">
              <!-- <Icon
              title="分享"
              icon="svg-icon:share_t_icon"
              class="cursor-pointer"
              @click.stop="handleShare(row.id)"
            /> -->
              <Icon
                title="收藏"
                v-if="row.collectionCount == 0"
                icon="svg-icon:collection_t_icon"
                class="mx-[1.04vw] cursor-pointer"
                @click.stop="handleCollection(row)"
              />
              <Icon
                title="取消收藏"
                v-else-if="row.collectionCount > 0"
                icon="svg-icon:ycollection"
                class="mx-[1.04vw] cursor-pointer"
                @click.stop="handleCollection(row)"
              />
              <Icon
                @click.stop="delData(row)"
                title="删除"
                icon="svg-icon:delete_t_icon"
                class="cursor-pointer"
              />
            </div>
          </div>
        </template>
      </Table>
    </div>
  </div>
  <ShareSelection ref="shareSelectionRef" />
</template>
<script setup lang="ts">
import {
  ref,
  reactive,
  computed,
  onMounted,
  h,
  unref,
  nextTick,
  onBeforeMount,
  onUnmounted
} from 'vue'
import { Table } from '@/components/Table'
import { Icon } from '@/components/Icon'
import { useTable } from '@/hooks/web/useTable'
import { CrudSchema, useCrudSchemas } from '@/hooks/web/useCrudSchemas'
import { getMyUploadApi, delMyUploadApi } from '@/api/personal/myUpload'
import Breadcrumbs from '../components/Breadcrumbs.vue'
import emitter from '@/utils/bus'
import { useEmitt } from '@/hooks/web/useEmitt'
import { ElMessage, ElMessageBox } from 'element-plus'
import ShareSelection from '../components/ShareSelection.vue'
import { closeCollectionApi } from '@/api/personal/myCollection'
import { useRouter } from 'vue-router'

const router = useRouter()
const { currentRoute, addRoute, push, replace } = useRouter()
defineOptions({
  name: 'myUpload'
})
const emit = defineEmits(['isShowUploadDetail'])
const { register, tableObject, methods } = useTable({
  getListApi: getMyUploadApi,
  response: {
    list: 'rows',
    total: 'total'
  }
})
const { getList, setSearchParams } = methods
getList()
const selectionList = ref<any>([])
// 存放表格的数据
const crudSchemas = reactive<CrudSchema[]>([
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
    field: 'updateTime',
    label: '上传时间',
    minWidth: '120px',
    formatter: (row: Recordable) => {
      return h('span', row.updateTime ? row.updateTime : '--')
    }
  }
])
const { allSchemas } = useCrudSchemas(crudSchemas)
const defaultHeight = ref<number>(0)
const shareSelectionRef = ref<any>()
// 点击分享
const handleShare = (id) => {
  shareSelectionRef.value.openDrawer(id)
}
// 点击收藏
const handleCollection = async (row) => {
  let data = {
    type: row.collectionCount > 0 ? '2' : '1',
    titleId: row.id
  }
  let res = await closeCollectionApi(data)
  if (res) {
    ElMessage.success('操作成功！')
    getList()
  }
}
//删除加载
const delLoading = ref(false)
// 批量删除
const delSelectData = () => {
  if (selectionList.value.length) {
    ElMessageBox.confirm('是否删除所选中数据？', '提示', {
      confirmButtonText: '确认',
      cancelButtonText: '取消',
      type: 'warning',
      autofocus: false
    }).then(async () => {
      let ids = ''
      for (let i = 0; i < selectionList.value.length; i++) {
        ids += selectionList.value[i].id + ','
      }
      //去掉最后一个逗号(如果不需要去掉，就不用写)
      if (ids.length > 0) {
        ids = ids.substr(0, ids.length - 1)
      }
      await delMyUploadApi({
        ids: ids
      }).then(() => {
        selectionList.value = []
        ElMessage.success('删除成功!')
        getList()
      })
    })
  } else {
    ElMessage.warning('请选择需要删除的数据!')
  }
}
const delData = (row) => {
  ElMessageBox.confirm('是否删除所选中数据？', '提示', {
    confirmButtonText: '确认',
    cancelButtonText: '取消',
    type: 'warning',
    autofocus: false
  }).then(async () => {
    await delMyUploadApi({
      ids: row.id
    }).then(() => {
      ElMessage.success('删除成功!')
      getList()
    })
  })
}
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
useEmitt({
  name: 'window',
  callback: (type: string) => {
    if (type === 'resize') {
      resetTableHeight()
    }
  }
})
const showColor = ({ row }) => {
  const checkIdList = selectionList.value.map((item) => item.id)
  if (checkIdList.includes(row.id)) {
    return 'heli'
  }
}
onMounted(() => {
  emitter.on('resetList', () => {
    getList()
  })
  resetTableHeight()
})
onUnmounted(() => {
  emitter.off('resetList')
})
// 点击表格行打开详情
const openMyUploadDetail = (row) => {
  const { href } = router.resolve({
    path: `/myDetail/${row.id}`
  })
  window.open(href, '_blank')
}
const handleCell = (row) => {
  row.show = !row.show
}
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
.operation_btn {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  li {
    padding: 0 0 0 8px;
    cursor: pointer;
    margin: 8px 0;
  }
}
.title_box {
  padding-right: 20px;
  width: 100%;
  display: flex;
  justify-content: space-between;
  .title_name {
    max-width: 760px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    text-align: left;
  }
}
</style>
