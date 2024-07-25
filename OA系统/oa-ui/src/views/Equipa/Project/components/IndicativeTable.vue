<!-- 指示要求详情 -->
<script setup lang="ts">
import { Segmentation } from '@/components/Segmentation'
import { ref, watch } from 'vue'
import FilePreview from '@/views/Components/FilePreview/FilePreview.vue'
import NoData from '@/views/Components/NoData.vue'

const props = defineProps({
  pmProgressList: {
    type: Array,
    default: []
  },
  tableFlag: {
    //2提出指示要求详情 1项目进展/变更详情
    type: String,
    default: ''
  }
})

// 项目进展/变更详情 表格数据
const tableData = ref<any>([])
// 监听窗口变化
watch(
  () => props.pmProgressList,
  (data: any) => {
    tableData.value = []
    if (data) {
      if (props.pmProgressList && props.pmProgressList.length > 0) {
        props.pmProgressList.forEach((item: any) => {
          if (props.tableFlag == '2' && item.type === '3') {
            tableData.value.push(item)
          } else if (
            props.tableFlag == '1' &&
            (item.type === '1' || item.type === '2' || item.type === '4')
          ) {
            tableData.value.push(item)
          }
        })
        tableData.value.sort((a: any, b: any) => {
          var x = a['createTime']
          var y = b['createTime']
          return x > y ? -1 : x < y ? 1 : 0
        })
      }
    }
  },
  {
    immediate: true
  }
)

// 预览弹窗
const previewFile = (fileName: string, path: string) => {
  FilePreviewRef.value.openDialog(fileName, path)
}
const FilePreviewRef = ref()
// 获取文件名称
const getFileName = (name: string | string[]) => {
  if (name && name.lastIndexOf('/') > -1) {
    return name.slice(name.lastIndexOf('/') + 1)
  } else {
    return ''
  }
}
const fileNext = (path: any) => {
  let extension = ''
  if (path) {
    extension = path.substring(path.lastIndexOf('.') + 1)
  }
  return extension
}
</script>
<template>
  <Segmentation
    :title="tableFlag == '2' ? '提出指示要求详情' : '项目进展/变更详情'"
    class="projectDebriefing"
  >
    <template #button>
      <slot name="button"></slot>
    </template>
    <template #content>
      <el-table :data="tableData" :border="true">
        <el-table-column prop="progressDate" label="日期" width="120" show-overflow-tooltip>
          <template #default="scope">
            <span> {{ scope.row.progressDate || '--' }}</span>
          </template></el-table-column
        >
        <el-table-column prop="createByName" :label="tableFlag == '2' ? '指示人' : '操作人'" width="100" show-overflow-tooltip>
          <template #default="scope">
            <span> {{ scope.row.createByName || '--' }}</span>
          </template></el-table-column
        >
        <el-table-column prop="content" label="内容" show-overflow-tooltip>
          <template #default="scope">
            <span> {{ scope.row.content || '--' }}</span>
          </template></el-table-column
        >
        <el-table-column prop="filePath" label="文件柜">
          <template #default="scope">
            <el-tooltip
              class="w-full"
              v-if="scope.row.filePath"
              :content="getFileName(scope.row.filePath)"
              placement="top"
            >
              <span v-if="scope.row.filePath" class="w-full">
                <ElLink
                  v-if="
                    fileNext(scope.row.filePath) === 'doc' ||
                    fileNext(scope.row.filePath) === 'zip' ||
                    fileNext(scope.row.filePath) === 'rar' ||
                    fileNext(scope.row.filePath) === 'xls'
                  "
                  class="w-full"
                  :href="`${scope.row.filePath}`"
                  :underline="false"
                  target="_blank"
                >
                  <p class="file-class"> {{ getFileName(scope.row.filePath) }}</p>
                </ElLink>
                <p
                  class="file-class"
                  v-else
                  @click="previewFile(getFileName(scope.row.filePath), scope.row.filePath)"
                >
                  {{ getFileName(scope.row.filePath) }}</p
                >
              </span>
              <span v-else>--</span>
            </el-tooltip>
            <span v-else>--</span>
          </template></el-table-column
        >
        <el-table-column prop="remark" label="备注" show-overflow-tooltip>
          <template #default="scope">
            <span> {{ scope.row.remark || '--' }}</span>
          </template></el-table-column
        >
        <template #empty>
          <NoData />
        </template>
      </el-table>
      <FilePreview title="预览" ref="FilePreviewRef" />
    </template>
  </Segmentation>
</template>

<style lang="less">
.projectDebriefing .el-overlay-dialog {
  background: rgba(0, 0, 0, 0.5) !important;
}
.el-table {
  font-family: 'Alibaba PuHuiTi R';
  font-size: 15px;
  color: #222222;
}
</style>

<style scoped>
:deep(.directorTable-lie) {
  background-color: rgb(245, 247, 250) !important;
}
:deep(.el-popper) {
  max-width: 500px;
}
:deep(.el-link__inner) {
  width: 100%;
}
:deep(.el-link) {
  width: 100%;
}
.file-class {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  cursor: pointer;
  color: rgb(0, 160, 233);
  width: 100%;
}
</style>