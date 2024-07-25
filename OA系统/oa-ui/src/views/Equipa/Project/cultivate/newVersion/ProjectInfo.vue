<!--培育项目信息-->
<script setup lang="ts">
import { nextTick, ref, watch } from 'vue'
import { Segmentation } from '@/components/Segmentation'
import FilePreview from '@/views/Components/FilePreview/FilePreview.vue'
import moment from 'moment'
import {
  getProjectStatusLabel,
  getProjectTypeLabel,
  getProjectSourceLabel
} from '../../config/config'

const props = defineProps({
  detailsData: {
    type: Object,
    default: {}
  }
})

const fileArray = ref<any>([])
watch(
  () => props.detailsData,
  (data: any) => {
    if (data) {
      fileArray.value = []
      nextTick(async () => {
        fileArray.value = props.detailsData.filePath ? props.detailsData.filePath.split(',') : []
      })
    }
  },
  {
    immediate: true
  }
)

const FilePreviewRef = ref()
const getFileName = (name: string | string[]) => {
  if (name.lastIndexOf('/') > -1) {
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
// 预览弹窗
const previewFile = (fileName: string, path: string) => {
  FilePreviewRef.value.openDialog(fileName, path)
}
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
  <Segmentation title="项目信息">
    <template #content>
      <div class="ml-[15px]">
        <ElRow :gutter="16" style="text-align: center" justify="space-between" class="top-row-sub">
          <ElCol :span="6" style="display: flex">
            <P class="name-p mr-2"> 项目编号：</P>
            <p class="sub-title flex-1 truncate text-left" :title="detailsData.itemNumber">
              {{ detailsData.itemNumber || '--' }}
            </p></ElCol
          >

          <ElCol :span="6">
            <div class="flex" style="align-items: center">
              <p class="name-p mr-2"> 项目名称：</p>
              <p class="p-ellipsis flex-1 truncate text-left" :title="detailsData.projectTitle">
                {{ detailsData.projectTitle || '--' }}
              </p>
            </div>
          </ElCol>
          <ElCol :span="6">
            <div class="flex">
              <P class="name-p mr-2"> 申请人：</P>
              <p class="flex-1 truncate text-left">
                {{ detailsData.createByName ? detailsData.createByName : '--' }}
              </p>
            </div>
          </ElCol>
          <ElCol :span="6">
            <div class="flex">
              <P class="name-p mr-2"> 申请时间：</P>
              <p class="flex-1 truncate text-left">
                {{
                  detailsData.createTime
                    ? moment(detailsData.createTime).format('YYYY-MM-DD')
                    : '--'
                }}
              </p>
            </div>
          </ElCol>
          <ElCol :span="6" v-if="detailsData.customerId">
            <div class="flex">
              <P class="name-p mr-2"> 项目来源：</P>
              <p class="p-ellipsis flex-1 truncate text-left">
                {{ getProjectSourceLabel(detailsData.projectSource) }}
              </p>
            </div>
          </ElCol>
          <ElCol :span="6">
            <div class="flex">
              <P class="name-p mr-2"> 所属行业：</P>
              <p class="p-ellipsis flex-1 truncate text-left">
                {{ getProjectTypeLabel(detailsData.projectType) }}
              </p>
            </div>
          </ElCol>
          <ElCol :span="6" v-if="detailsData.customerId">
            <div class="flex">
              <P class="name-p mr-2"> 客户性质：</P>
              <p class="p-ellipsis flex-1 truncate text-left" :title="detailsData.nature">
                {{ detailsData.nature || '--' }}
              </p>
            </div>
          </ElCol>
          <ElCol :span="6" v-if="detailsData.customerId">
            <div class="flex">
              <P class="name-p mr-2"> 客户名称：</P>
              <p class="p-ellipsis flex-1 truncate text-left" :title="detailsData.ownerName">
                {{ detailsData.ownerName || '--' }}
              </p>
            </div>
          </ElCol>
          <ElCol :span="6" v-if="detailsData.customerId">
            <div class="flex">
              <P class="name-p mr-2"> 所属省份：</P>
              <p class="p-ellipsis flex-1 truncate text-left">
                {{ detailsData.location || '--' }}
              </p>
            </div>
          </ElCol>
          <ElCol :span="6" v-if="detailsData.customerId">
            <div class="flex">
              <P class="name-p mr-2"> 客户联系人：</P>
              <p class="p-ellipsis flex-1 truncate text-left" :title="detailsData.contacts">
                {{ detailsData.contacts || '--' }}
              </p>
            </div>
          </ElCol>
          <ElCol :span="6" v-if="detailsData.customerId">
            <div class="flex">
              <P class="name-p mr-2"> 部门及职务：</P>
              <p class="p-ellipsis flex-1 truncate text-left" :title="detailsData.position">
                {{ detailsData.position || '--' }}
              </p>
            </div>
          </ElCol>
          <ElCol :span="6" v-if="detailsData.customerId">
            <div class="flex">
              <P class="name-p mr-2"> 电话：</P>
              <p class="p-ellipsis flex-1 truncate text-left" :title="detailsData.phone">
                {{ detailsData.phone || '--' }}
              </p>
            </div>
          </ElCol>
          <ElCol :span="6" v-if="detailsData.customerId">
            <div class="flex">
              <P class="name-p mr-2"> 详细地址：</P>
              <p class="p-ellipsis flex-1 truncate text-left" :title="detailsData.address">
                {{ detailsData.address || '--' }}
              </p>
            </div>
          </ElCol>
          <ElCol :span="6" v-if="!detailsData.customerId">
            <div class="flex">
              <P class="name-p mr-2"> 客户名称：</P>
              <p class="p-ellipsis flex-1 truncate text-left" :title="detailsData.ownerName">
                {{ detailsData.ownerName || '--' }}
              </p>
            </div>
          </ElCol>
          <ElCol :span="6" v-if="!detailsData.customerId">
            <div class="flex">
              <P class="name-p mr-2"> 预计金额：</P>
              <p class="flex-1 truncate text-left">
                {{
                  (detailsData.estimatedAmount ? detailsData.estimatedAmount + '万元' : '--') ||
                  '--'
                }}
              </p>
            </div>
          </ElCol>
          <ElCol :span="6">
            <div class="flex">
              <P class="name-p mr-2"> 状态：</P>
              <div class="flex-1 truncate text-left">
                <el-tag
                  class="mt-1"
                  :type="
                    detailsData.status === '0'
                      ? 'warning'
                      : detailsData.status === '1'
                      ? 'success'
                      : detailsData.status === '2'
                      ? 'success'
                      : detailsData.status === '3'
                      ? 'info'
                      : detailsData.status === '4'
                      ? 'primary'
                      : detailsData.status === '5'
                      ? 'info'
                      : detailsData.status === '6'
                      ? 'warning'
                      : 'danger'
                  "
                  :effect="detailsData.status === '6' ? 'dark' : ''"
                >
                  {{ getProjectStatusLabel('1', detailsData.status) }}
                </el-tag>
              </div>
            </div>
          </ElCol>
          <ElCol :span="6">
            <div class="flex">
              <P class="name-p mr-2"> 负责人：</P>
              <p class="flex-1 truncate text-left">
                {{ detailsData.principalPersonName ? detailsData.principalPersonName : '--' }}
              </p>
            </div>
          </ElCol>
          <ElCol :span="6"></ElCol>
          <ElCol :span="6"></ElCol>
          <ElCol :span="24">
            <div class="flex details">
              <p class="name-p mr-2"> 项目内容：</p>
              <p class="p-ellipsis-sub flex-1 truncate text-left" :title="detailsData.planContent">
                {{ detailsData.planContent || '--' }}
              </p>
            </div>
          </ElCol>
          <ElCol :span="24" class="mt-[5px]">
            <div class="flex">
              <P class="name-p mr-2"> 文件：</P>
              <div class="flex-1">
                <span v-if="detailsData.filePath" class="w-full">
                  <div v-for="(item, index) in fileArray" :key="index" class="w-full">
                    <ElLink
                      v-if="
                        fileNext(item) === 'doc' ||
                        fileNext(item) === 'zip' ||
                        fileNext(item) === 'rar' ||
                        fileNext(item) === 'xls'
                      "
                      :href="`${item}`"
                      :underline="false"
                      target="_blank"
                      class="file-class"
                    >
                      <p style="cursor: pointer; color: rgb(0, 160, 233)">
                        {{ getFileName(item) }}</p
                      >
                    </ElLink>
                    <ElLink v-else :underline="false" target="_blank" class="file-class">
                      <p
                        style="cursor: pointer; color: rgb(0, 160, 233)"
                        @click="
                          previewFile(getFileName(item), item)
                        "
                      >
                        {{ getFileName(item) }}</p
                      >
                    </ElLink>
                  </div>
                </span>
                <p v-else>--</p>
              </div>
            </div>
          </ElCol>
        </ElRow>
      </div>
      <FilePreview title="预览" ref="FilePreviewRef" />
    </template>
  </Segmentation>
</template>


<style lang="less">
.file-class {
  width: 100%;
  justify-content: flex-start;
}
.name-p {
  font-family: 'Alibaba PuHuiTi R';
  font-size: 15px;
}
.name-p mr-2 {
  color: #999999;
  font-size: 15px;
}
.sub-title {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 1;
  overflow: hidden;
}
.top-row-sub {
  margin: 0 0px !important;
  p {
    font-size: 14px !important;
    line-height: 32px;
  }
}

@media screen and (min-width: 1366px) {
  .p-ellipsis {
    width: 66%;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    text-align: left;
  }

  .p-ellipsis-sub {
    width: 91%;
    white-space: normal;
    text-align: left;
    word-break: break-word;
  }
}
@media screen and (min-width: 1400px) {
  .p-ellipsis {
    width: 74%;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    text-align: left;
  }

  .p-ellipsis-sub {
    width: 94%;
    white-space: normal;
    text-align: left;
    word-break: break-word;
  }
}
.details {
  p {
    margin-top: 6px;
    margin-bottom: 6px;
    line-height: 20px;
  }
}
</style>


