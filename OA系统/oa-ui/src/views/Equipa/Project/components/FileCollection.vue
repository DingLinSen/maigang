<!-- 项目相关文件 -->
<script setup lang="ts">
import { Segmentation } from '@/components/Segmentation'
import { ref, watch } from 'vue'
import FilePreview from '@/views/Components/FilePreview/FilePreview.vue'
import NoData from '@/views/Components/NoData.vue'

const props = defineProps({
  detailsData: {
    type: Object,
    default: {}
  }
})
// 项目进展/变更详情 表格数据
const tableData = ref<any>([])

// 监听窗口变化
watch(
  () => props.detailsData,
  (data: any) => {
    tableData.value = []
    if (data.milestoneList && data.milestoneList.length) {
      data.milestoneList.forEach((element: any) => {
        if (element.type == '1' && element.filePath) {
          tableData.value.push({ fileType: '里程碑1', filePath: element.filePath })
        }
        if (element.type == '2' && element.filePath) {
          tableData.value.push({ fileType: '里程碑2', filePath: element.filePath })
        }
        if (element.type == '3' && element.filePath) {
          tableData.value.push({ fileType: '里程碑3', filePath: element.filePath })
        }
      })
    } else if (data.milestones && data.milestones.length) {
      data.milestones.forEach((element: any) => {
        if (element.type == '1' && element.filePath) {
          tableData.value.push({ fileType: '里程碑1', filePath: element.filePath })
        }
        if (element.type == '2' && element.filePath) {
          tableData.value.push({ fileType: '里程碑2', filePath: element.filePath })
        }
        if (element.type == '3' && element.filePath) {
          tableData.value.push({ fileType: '里程碑3', filePath: element.filePath })
        }
      })
    }
    if (data.fileList) {
      if (data.fileList.bidUrl) {
        tableData.value.push({ fileType: '投标文件', filePath: data.fileList.bidUrl })
      }
      if (data.fileList.bidResultUrl) {
        tableData.value.push({ fileType: '投标结果分析', filePath: data.fileList.bidResultUrl })
      }
      if (data.fileList.saleContractUrl) {
        tableData.value.push({ fileType: '销售合同', filePath: data.fileList.saleContractUrl })
      }
      if (data.fileList.photoFilePath) {
        tableData.value.push({ fileType: '项目实施照片', filePath: data.fileList.photoFilePath })
      }
      if (data.fileList.acceptFilePath) {
        tableData.value.push({ fileType: '验收材料', filePath: data.fileList.acceptFilePath })
      }
      if (data.fileList.acceptReportFilePath) {
        tableData.value.push({ fileType: '验收报告', filePath: data.fileList.acceptReportFilePath })
      }
      if (data.fileList.paymentFilePath) {
        tableData.value.push({ fileType: '回款记录', filePath: data.fileList.paymentFilePath })
      }
      if (data.fileList.endPaymentPath && data.status == '3') {
        tableData.value.push({ fileType: '尾款汇款记录', filePath: data.fileList.endPaymentPath })
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
  <Segmentation title="项目相关文件" class="projectDebriefing">
    <template #content>
      <el-table :data="tableData" border>
        <el-table-column prop="fileType" label="文件类型" width="360" show-overflow-tooltip>
          <template #default="scope">
            <span> {{ scope.row.fileType || '--' }}</span>
          </template></el-table-column
        >
        <el-table-column prop="filePath" label="文件柜">
          <template #default="scope">
            <el-tooltip
              v-if="scope.row.filePath"
              class="w-full"
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
          </template>
        </el-table-column>
        <template #empty>
          <NoData />
        </template>
      </el-table>
      <FilePreview title="预览" ref="FilePreviewRef" />
    </template>
  </Segmentation>
</template>

<style>
.directorTable-lie {
  background-color: rgb(245, 247, 250) !important;
}
</style>

<style scoped>
:deep(.el-link) {
  width: 100%;
}
:deep(.el-link__inner) {
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
:deep(.el-popper) {
  max-width: 500px;
}
</style>
