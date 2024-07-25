<script setup lang="ts">
import { inject, ref } from 'vue'
import { Segmentation } from '@/components/Segmentation'
import moment from 'moment'
import FilePreview from '@/views/Components/FilePreview/FilePreview.vue'
//详情数据
const conclusionData = inject<any>('conclusionData')
defineOptions({
  name: 'ConclusionInfo'
})
//文件预览弹窗
const previewFile = (fileName: string, path: string) => {
  FilePreviewRef0.value.openDialog(fileName, path)
}
//文件预览
const FilePreviewRef0 = ref()
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
  <Segmentation title="结题信息" class="projectDebriefing">
    <template #content>
      <div class="pl-11 pr-11">
        <ElRow :gutter="16" style="text-align: center" justify="space-between" class="top-row">
          <ElCol :span="8">
            <div class="flex">
              <p class="name-p mr-2"> 结题时间：</p>
              <p class="sub-title" :title="conclusionData.auditDate">
                {{ moment(conclusionData.auditDate).format('YYYY-MM-DD') || '--' }}
              </p>
            </div>
          </ElCol>
          <ElCol :span="8">
            <div class="flex">
              <p class="name-p mr-2"> 结题人：</p>
              <p class="p-ellipsis-ky" :title="conclusionData.createByName">
                {{ conclusionData.createByName || '--' }}
              </p>
            </div>
          </ElCol>
          <ElCol :span="8">
            <div class="flex">
              <p class="name-p mr-2"> 研究成果：</p>
              <p class="p-ellipsis-ky" :title="getFileName(conclusionData.conclusionFilePath)">
                <span>
                  <ElLink
                    v-if="
                      fileNext(conclusionData.conclusionFilePath) === 'doc' ||
                      fileNext(conclusionData.conclusionFilePath) === 'zip' ||
                      fileNext(conclusionData.conclusionFilePath) === 'rar' ||
                      fileNext(conclusionData.conclusionFilePath) === 'xls'
                    "
                    :href="`${conclusionData.conclusionFilePath}`"
                    :underline="false"
                    target="_blank"
                  >
                    <p style="cursor: pointer; color: rgb(0, 160, 233)">
                      {{ getFileName(conclusionData.conclusionFilePath) }}
                    </p>
                  </ElLink>
                  <ElLink v-else :underline="false" target="_blank">
                    <p
                      style="cursor: pointer; color: rgb(0, 160, 233)"
                      @click="
                        previewFile(
                          conclusionData.conclusionFilePath,
                          conclusionData.conclusionFilePath
                        )
                      "
                    >
                      {{ getFileName(conclusionData.conclusionFilePath) }}</p
                    >
                  </ElLink>
                </span>
              </p>
            </div>
          </ElCol>
          <ElCol :span="24">
            <div class="flex">
              <p class="name-p mr-2 w-70px"> 结题原因：</p>
              <p class="flex-1 text-left" :title="conclusionData.conclusionReason">
                {{ conclusionData.conclusionReason || '--' }}
              </p>
            </div>
          </ElCol>
          <ElCol :span="24">
            <div class="flex">
              <p class="name-p mr-2 w-70px"> 研究总结：</p>
              <p class="flex-1 text-left" :title="conclusionData.summarize">
                {{ conclusionData.summarize || '--' }}
              </p>
            </div>
          </ElCol>
          <ElCol :span="24">
            <div class="flex">
              <p class="name-p mr-2 w-70px text-right"> 备注：</p>
              <p class="flex-1 text-left" :title="conclusionData.remark">
                {{ conclusionData.remark || '--' }}
              </p>
            </div>
          </ElCol>
        </ElRow>
      </div>
    </template>
  </Segmentation>
  <FilePreview title="预览" ref="FilePreviewRef0" />
</template>

<style lang="less">
.name-p {
  font-family: 'Alibaba PuHuiTi R';
  color: #888888;
  font-size: 15px;
}
.name-p mr-2 {
  color: #888888;
  font-size: 15px;
}
.sub-title {
  font-family: 'Alibaba PuHuiTi R';
  font-size: 15px;
  color: #000000;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 3;
  overflow: hidden;
}
.top-row {
  // border-bottom: 1px solid rgba(217, 221, 231, 0.8);
  margin: 0 0px !important;
  padding: 15px 0 20px 0;

  p {
    font-size: 14px !important;
    line-height: 32px;
  }
}

.p-ellipsis-ky {
  width: 64%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  text-align: left;
}
</style>
