<script setup lang="ts">
import { Segmentation } from '@/components/Segmentation'
import { ref, unref, inject, watch } from 'vue'
import FilePreview from '@/views/Components/FilePreview/FilePreview.vue'
import NoData from '@/views/Components/NoData.vue'

defineOptions({
  name: 'IndicativeTable'
})
// 获取 父级数据
const detailsData = inject<any>('detailsData')
// 项目进展/变更详情 表格数据
const tableData = ref<any>([])
// 监听窗口变化
watch(
  () => detailsData.value,
  (data: any) => {
    tableData.value = []
    if (data) {
      unref(detailsData)
        ? detailsData.value.pmProgressList.forEach((item) => {
            if (item.type === '3') {
              tableData.value.push(item)
            }
          })
        : []
    }
  },
  {
    immediate: true
  }
)

//文件预览弹窗
const previewFile = (fileName: string, path: string) => {
  FilePreviewRef1.value.openDialog(fileName, path)
}
//文件预览
const FilePreviewRef1 = ref()
// 获取文件名称
const getFileName = (name: string | string[]) => {
  if (name && name.lastIndexOf('/') > -1) {
    return name.slice(name.lastIndexOf('/') + 1)
  } else {
    return ''
  }
}
//获取文件后缀
const fileNext = (path: any) => {
  let extension = ''
  if (path) {
    extension = path.substring(path.lastIndexOf('.') + 1)
  }
  return extension
}
//根据length截取字符串
const nameOverflow = (name: string, length: number) => {
  let nextName = ''
  if (name && name.length) {
    if (name.length > length) {
      nextName = name.slice(0, length) + '...'
    } else {
      nextName = name
    }
  } else {
    nextName = ''
  }
  return nextName
}
</script>
<template>
  <Segmentation title="提出指示要求详情" class="projectDebriefing">
    <template #content>
      <el-table :data="tableData" :border="true">
        <el-table-column prop="progressDate" label="日期" width="120" show-overflow-tooltip>
          <template #default="scope">
            <span> {{ scope.row.progressDate || '--' }}</span>
          </template></el-table-column
        >
        <el-table-column prop="createByName" label="指示人" width="100" show-overflow-tooltip>
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
              v-if="scope.row.filePath"
              :content="getFileName(scope.row.filePath)"
              placement="top"
            >
              <span v-if="scope.row.filePath">
                <!-- :href="`${scope.row.filePath}`" -->
                <!-- @click="previewFile(getFileName(scope.row.filePath), scope.row.filePath)" -->
                <ElLink
                  v-if="
                    fileNext(scope.row.filePath) === 'doc' ||
                    fileNext(scope.row.filePath) === 'zip' ||
                    fileNext(scope.row.filePath) === 'rar' ||
                    fileNext(scope.row.filePath) === 'xls'
                  "
                  :href="`${scope.row.filePath}`"
                  :underline="false"
                  target="_blank"
                >
                  <p style="cursor: pointer; color: rgb(0, 160, 233)">
                    {{ nameOverflow(getFileName(scope.row.filePath), 30) }}</p
                  >
                </ElLink>
                <ElLink v-else :underline="false" target="_blank">
                  <p
                    style="cursor: pointer; color: rgb(0, 160, 233)"
                    @click="previewFile(getFileName(scope.row.filePath), scope.row.filePath)"
                  >
                    {{ nameOverflow(getFileName(scope.row.filePath), 30) }}</p
                  >
                </ElLink>
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
          <NoData   />
        </template>
      </el-table>
      <FilePreview title="预览" ref="FilePreviewRef1" />
    </template>
  </Segmentation>
</template>

<style>
.directorTable-lie {
  background-color: rgb(245, 247, 250) !important;
}
</style>

<style scoped>
:deep(.el-popper) {
  max-width: 500px;
}
</style>
