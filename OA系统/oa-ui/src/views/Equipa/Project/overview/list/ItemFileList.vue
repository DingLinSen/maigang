<template>
  <DrawerWrap title="项目文件" :isShow="isShow" ref="drawerWrap" class="project-overflow-drawer">
    <template #content>
      <!-- 表格 -->
      <Table
        :isShowFilter="true"
        :border="true"
        ref="tableRef"
        :height="contentHeight"
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
          <Search :schema="allSchemas.searchSchema" @search="setSearchParamsSub" @reset="reset" />
        </template>
        <template #index="{ $index }">
          <span>{{
            $index + 1 + tableObject.pageSize * (tableObject.currentPage - 1)
          }}</span></template
        >
        <template #action="{ row }">
          <ElButton class="btn-default" :text="true" size="small" @click="handleView(row.filePath)"
            >查看
          </ElButton>
          <!-- <ElButton
            v-else
            class="btn-default"
            :text="true"
            size="small"
            @click="handleView(row.filePath)"
            >下载
          </ElButton> -->
        </template>
      </Table>
      <FilePreview title="预览" ref="FilePreviewRef" />
    </template>
  </DrawerWrap>
</template>
<script setup lang="ts">
import FilePreview from '@/views/Components/FilePreview/FilePreview.vue'
import { ref, reactive, h, onMounted, nextTick } from 'vue'
import { Table } from '@/components/Table'
import { Search } from '@/components/Search'
import { useTable } from '@/hooks/web/useTable'
import { filesApi } from '@/api/project/overview'
import { CrudSchema, useCrudSchemas } from '@/hooks/web/useCrudSchemas'
import moment from 'moment'
import { DrawerWrap } from '@/components/DrawerWrap'
import { downloadFile } from '@/utils/index'

const drawerWrap = ref<ComponentRef<typeof DrawerWrap>>()
const isShow = ref(false)

// 预览弹窗
const previewFile = (fileName: string, path: string | undefined) => {
  FilePreviewRef.value.openDialog(fileName, path)
}
const FilePreviewRef = ref()

// 获取文件名后缀
const fileNext = (path: any) => {
  let extension = ''
  if (path) {
    extension = path.substring(path.lastIndexOf('.') + 1)
  }
  return extension
}
const handleView = (fileUrl) => {
  console.log(fileUrl)
  if (
    fileNext(fileUrl) === 'doc' ||
    fileNext(fileUrl) === 'zip' ||
    fileNext(fileUrl) === 'rar' ||
    fileNext(fileUrl) === 'xls' ||
    fileNext(fileUrl) === 'bmp'
  ) {
    downloadFile(fileUrl, /\/([^/]+)$/.exec(fileUrl)[0].replace('/', ''))
  } else {
    previewFile(/\/([^/]+)$/.exec(fileUrl)[0].replace('/', ''), fileUrl)
  }
}

const params = reactive<any>({
  projectTitle: ''
})

// 存放表格的数据
const crudSchemas = reactive<CrudSchema[]>([
  {
    field: 'index',
    label: '序号',
    minWidth: '80px'
  },
  {
    field: 'projectTitle',
    label: '项目名称',
    minWidth: '120px',
    formatter: (row: Recordable) => {
      return h('span', row.projectTitle ? row.projectTitle : '--')
    },
    search: {
      show: true,
      component: 'Input',
      componentProps: {
        style: 'width: 196px',
        placeholder: '请输入项目名称'
      }
    }
  },
  {
    field: 'filePath',
    label: '文件名称',
    minWidth: '180px',
    formatter: (row: Recordable) => {
      return h('span', row.filePath ? /\/([^/]+)$/.exec(row.filePath)[0].replace('/', '') : '--')
    }
  },
  {
    field: 'phase',
    label: '项目阶段',
    minWidth: '180px',
    formatter: (row: Recordable) => {
      return h(
        'span',
        row.phase == '1'
          ? '培育阶段'
          : row.phase == '2'
          ? '立项阶段'
          : row.phase == '3'
          ? '实施阶段'
          : row.phase == '4'
          ? '售后阶段'
          : row.phase == '5'
          ? '自研阶段'
          : ''
      )
    }
  },
  {
    field: 'createByName',
    label: '上传人',
    minWidth: '140px',
    formatter: (row: Recordable) => {
      return h('span', row.createByName ? row.createByName : '--')
    }
  },
  {
    field: 'createTime',
    label: '时间',
    minWidth: '120px',
    formatter: (row: Recordable) => {
      return h('span', row.createTime ? moment(row.createTime).format('YYYY-MM-DD') : '--')
    }
  },
  {
    field: 'action',
    fixed: 'right',
    minWidth: '120px',
    label: '操作',
    showOverflowTooltip: false
  }
])
const { allSchemas } = useCrudSchemas(crudSchemas)
const { register, tableObject, methods } = useTable<any>({
  getListApi: filesApi,
  response: {
    list: 'rows',
    total: 'total'
  }
})
const { getList, setSearchParams } = methods
//打开drawer并初始化
const openDrawer = (id) => {
  drawerWrap.value.isShow = true
  getList()
  resetTableHeight()
}
//搜索
const setSearchParamsSub = (param: any) => {
  params.projectTitle = param.projectTitle ? param.projectTitle : ''
  setSearchParams(params)
}
// 重置
const reset = (param: any) => {
  params.projectTitle = ''
  setSearchParams(params)
}
// 处理
const handle = () => {}

onMounted(() => {
  resetTableHeight()
})

const tableRef = ref()
const contentHeight = ref<number>(400)
const resetTableHeight = () => {
  //搜索框加操作栏高度
  nextTick(() => {
    setTimeout(() => {
      if (tableRef.value) {
        tableRef.value.resetTableHeight()
      }
    }, 500)
  })
}

defineExpose({
  isShow,
  openDrawer
})
</script>
<style lang="less">
.project-overflow-drawer {
  .el-card {
    border: 0 !important;
  }
}
</style>
