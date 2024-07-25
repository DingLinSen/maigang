<template>
  <InvalidPage
    v-if="isShareShow"
    :invalid="invalid"
    :with-code="withCode"
    :share-name="shareUserName"
    :isAuth="isAuth"
    @handle-code="handleCode"
    :isFile="isFile"
  />
  <div v-else>
    <div class="upload_box" v-loading="loading">
      <div class="upload_header">
        <div class="header_left" :title="uploadDetailData.title">{{ uploadDetailData.title }}</div>
        <div class="header_right">
          <div class="flex">
            <div
              class="upload_edit"
              @click="handleEdit"
              v-if="isEdit == 1 || userInfo.userId == 1 || createUserId == userInfo.userId"
            >
              编辑
            </div>
            <div
              class="upload_tags"
              @click="handleTags"
              v-if="isEdit == 1 || userInfo.userId == 1 || createUserId == userInfo.userId"
            >
              标签调整
            </div>
          </div>
          <div class="flex">
            <div
              class="upload_icon"
              @click="handleShare(uploadDetailData.id)"
              v-if="isShare == 1 || userInfo.userId == 1 || createUserId == userInfo.userId"
            >
              <Icon
                icon="svg-icon:share_t_icon"
                :color="'#666A6E'"
                class="cursor-pointer size_icon"
              />
            </div>
            <div class="upload_icon" @click="handleCollection(isCollection)">
              <Icon
                v-if="isCollection == 0"
                icon="svg-icon:collection_icon"
                class="cursor-pointer size_icon"
              />
              <Icon
                v-else-if="isCollection > 0"
                icon="svg-icon:ycollection"
                class="cursor-pointer size_icon"
                :color="'#00A0E9'"
              />
            </div>
          </div>
          <div class="flex ml-10px">
            <!--<div class="upload_tags" @click="cancel">关闭</div>-->
          </div>
        </div>
      </div>
      <div class="contentH">
        <div class="upload_content">
          <div class="content-row" :style="{ height: contentH + 'px' }">
            <div class="content_left">
              <div class="base_info first-info">
                <div class="base_info_title">基本信息</div>
                <div class="base_info_content">
                  <el-form :model="uploadDetailData" class="infoForm">
                    <el-form-item label="作&emsp;&emsp;者:">
                      <div class="info_right">{{ uploadDetailData.author }}</div>
                    </el-form-item>
                    <el-form-item label="所属部门:">
                      <div class="info_right">{{ uploadDetailData.deptName }}</div>
                    </el-form-item>
                    <el-form-item label="创建时间:">
                      <div class="info_right">{{ uploadDetailData.createTime }}</div>
                    </el-form-item>
                    <el-form-item label="所属分类:">
                      <div class="info_right">{{ uploadDetailData.knowledgeTypeName }}</div>
                    </el-form-item>
                    <el-form-item label="标&emsp;&emsp;签:">
                      <div class="flex items-center flex-wrap">
                        <div class="tagsName" v-for="item in tagTypeName" :key="item" :title="item"
                          >{{ item }}
                        </div>
                      </div>
                    </el-form-item>
                  </el-form>
                </div>
              </div>
              <div
                class="base_info mt-[10px] relative_map"
                :style="{ minHeight: baseInfoH + 'px' }"
              >
                <div class="base_info_title">关系图</div>
                <div class="info_content">
                  <Icon icon="svg-icon:nodata_icon" class="icon_size" />
                  <div>暂无数据</div>
                </div>
              </div>
              <div class="base_info mt-[10px]" :style="{ minHeight: baseInfoH + 'px' }">
                <div class="base_info_title">推荐知识</div>
                <div class="info_content">
                  <Icon icon="svg-icon:nodata_icon" class="icon_size" />
                  <div>暂无数据</div>
                </div>
              </div>
              <div class="base_info mt-[10px]" :style="{ minHeight: baseInfoH + 'px' }">
                <div class="base_info_title">关联知识</div>
                <div class="info_content">
                  <Icon icon="svg-icon:nodata_icon" class="icon_size" />
                  <div>暂无数据</div>
                </div>
              </div>
            </div>
            <div class="content_right">
              <div class="ml-[10px]">
                <div class="breadcrumb">
                  <el-breadcrumb :separator-icon="ArrowRight">
                    <el-breadcrumb-item>知识图谱</el-breadcrumb-item>
                    <el-breadcrumb-item class="breadcrumb_title" :title="uploadDetailData.title">
                      {{ uploadDetailData.title }}
                    </el-breadcrumb-item>
                  </el-breadcrumb>
                </div>
                <div class="title_box" :title="uploadDetailData.title"
                  >{{ uploadDetailData.title }}
                </div>
                <div class="title_bottom">
                  <span class="border_right">作者：{{ uploadDetailData.author }}</span>
                  <span class="border_right">浏览量：{{ uploadDetailData.viewNum }}</span>
                  <span
                    >分享：{{ uploadDetailData.shareNum ? uploadDetailData.shareNum : '0' }}</span
                  >
                </div>
                <div
                  v-if="uploadDetailData.abstracts"
                  class="abstracts"
                  :title="uploadDetailData.abstracts"
                  v-html="
                    uploadDetailData.abstracts.replace(/\n|\r\n/g, '<br>').replace(/ /g, ' &nbsp')
                  "
                ></div>
                <div class="file_content mt-35px relative">
                  <div
                    class="full-screen"
                    @click="handleFullScreen"
                    v-if="!/\.ppt/.test(fileType.toLowerCase())"
                  >
                    <Icon icon="svg-icon:full_screen" class="full_icon" />
                  </div>
                  <!--                  <VueOfficeDocx-->
                  <!--                    :src="fileUrl"-->
                  <!--                    style="height: 430px"-->
                  <!--                    v-if="/\.docx/.test(fileUrl.toLowerCase())"-->
                  <!--                  />-->
                  <!--                  <VueOfficeExcel-->
                  <!--                    :src="fileUrl"-->
                  <!--                    style="height: 430px"-->
                  <!--                    v-else-if="/\.xlsx/.test(fileUrl.toLowerCase())"-->
                  <!--                  />-->
                  <iframe
                    v-if="!loading"
                    :src="`${fileUrl}#toolbar=0`"
                    class="iframe-height"
                    style="width: 100%"
                    allowfullscreen
                  ></iframe>
                </div>
                <div class="attachment">
                  <div>附件</div>
                  <div class="line"></div>
                </div>
                <div class="files_list">
                  <div class="files_top">
                    <el-checkbox
                      :indeterminate="isIndeterminate"
                      @change="toggleAll"
                      v-model="checkAll"
                    >
                      <span class="font-bold">全选</span>
                    </el-checkbox>
                    <div class="down_btn">
                      <div
                        class="batch_download cursor-pointer"
                        @click="handleBatchDownload"
                        v-if="
                          isDownload == 1 || userInfo.userId == 1 || createUserId == userInfo.userId
                        "
                      >
                        批量下载
                      </div>
                      <div
                        class="download_all cursor-pointer"
                        @click="handleDownloadAll"
                        v-if="
                          isDownload == 1 || userInfo.userId == 1 || createUserId == userInfo.userId
                        "
                      >
                        下载全部
                      </div>
                    </div>
                  </div>
                  <div
                    class="files_info"
                    v-for="item in fileList"
                    :key="item"
                    :class="selectedItems.some((v) => v == item.id) ? 'bc' : ''"
                  >
                    <div class="flex items-center">
                      <el-checkbox
                        v-model="selectedItems"
                        @change="changeCheck(item)"
                        :label="item.id"
                      >
                        <br />
                      </el-checkbox>
                      <svg
                        v-if="/\.pdf/.test(item.name.toLowerCase())"
                        aria-hidden="true"
                        class="fileIcon"
                      >
                        <use xlink:href="#icon-pdf" />
                      </svg>
                      <svg
                        v-else-if="/\.xlsx|\.xls/.test(item.name.toLowerCase())"
                        aria-hidden="true"
                        class="fileIcon"
                      >
                        <use xlink:href="#icon-excel" />
                      </svg>
                      <svg
                        v-else-if="/\.doc|\.docx/.test(item.name.toLowerCase())"
                        aria-hidden="true"
                        class="fileIcon"
                      >
                        <use xlink:href="#icon-word" />
                      </svg>
                      <svg
                        v-else-if="/\.ppt/.test(item.name.toLowerCase())"
                        aria-hidden="true"
                        class="fileIcon"
                      >
                        <use xlink:href="#icon-ppt" />
                      </svg>
                      <svg
                        v-else-if="/\.jpg|\.png|\.gif|\.jpeg/.test(item.name.toLowerCase())"
                        aria-hidden="true"
                        class="fileIcon"
                      >
                        <use xlink:href="#icon-photo" />
                      </svg>
                      <svg v-else aria-hidden="true" class="fileIcon">
                        <use xlink:href="#icon-weizhi3" />
                      </svg>
                      <div class="files_name" :title="item.name">
                        <span class="cursor-pointer file-name" @click="handleFileName(item.url)">{{
                          item.name
                        }}</span>
                      </div>
                    </div>
                    <div class="files_size">{{ fileSize(item.size) }}</div>
                    <div class="files_btn">
                      <Icon
                        title="查看"
                        icon="svg-icon:ck_icon"
                        class="cursor-pointer size_icon bc-icon"
                        @click="seeFile(item.url, item.name)"
                      />
                      <Icon
                        title="下载"
                        v-if="
                          isDownload == 1 || userInfo.userId == 1 || createUserId == userInfo.userId
                        "
                        icon="svg-icon:file_download_icon"
                        class="ml-20px cursor-pointer size_icon bc-icon"
                        @click="handleDownload(item)"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- 标签弹出框 -->
    <TagsDialog ref="tagsDialogRef" @reset-page="getDetailData" :isDetail="true" :detailId="id" />
    <div v-if="isFullscreen" class="absolute top-0 z-101 w-full h-full">
      <div class="relative w-full h-full">
        <div class="full-screen" @click="handleFullScreen">
          <Icon icon="svg-icon:cacelFullscreen" class="full_icon" />
        </div>
        <!--        <VueOfficeDocx-->
        <!--          :src="fileUrl"-->
        <!--          style="height: 100%; width: 100%"-->
        <!--          v-if="/\.docx/.test(fileUrl.toLowerCase())"-->
        <!--        />-->
        <!--        <VueOfficeExcel-->
        <!--          :src="fileUrl"-->
        <!--          style="height: 100%; width: 100%"-->
        <!--          v-else-if="/\.xlsx/.test(fileUrl.toLowerCase())"-->
        <!--        />-->
        <iframe
          :src="`${fileUrl}#toolbar=0`"
          style="height: 100%; width: 100%"
          allowfullscreen
        ></iframe>
      </div>
    </div>
    <ShareSelection ref="shareSelectionRef" />
    <Upload v-if="uploadFlag" @is-show-upload="isShowUpload" :editId="id" />
  </div>
</template>
<script lang="ts" setup>
import { nextTick, onMounted, ref, unref, onUnmounted, watch } from 'vue'
import { Icon } from '@/components/Icon'
import { ArrowRight } from '@element-plus/icons-vue'
import { getUploadDetailApi, myUploadDownloadApi } from '@/api/personal/myUpload'
import { getByUuidApi } from '@/api/personal/myShare'
import TagsDialog from '@/views/Personal/components/TagsDialog.vue'
import { fileSize } from '@/utils/index'
import ShareSelection from '@/views/Personal/components/ShareSelection.vue'
//引入VueOfficeDocx组件
import VueOfficeDocx from '@vue-office/docx'
//引入VueOfficeExcel组件
import VueOfficeExcel from '@vue-office/excel'
//引入相关样式
import '@vue-office/docx/lib/index.css'
import '@vue-office/excel/lib/index.css'
import { ElMessage } from 'element-plus'
import { closeCollectionApi } from '@/api/personal/myCollection'
import { useRouter } from 'vue-router'
import { useRoute } from 'vue-router'
import Upload from '@/views/Personal/components/Upload.vue'
import { useEmitt } from '@/hooks/web/useEmitt'
import emitter from '@/utils/bus'
import { Base64 } from 'js-base64'
import InvalidPage from '@/views/Personal/components/InvalidPage.vue'
import { useCache } from '@/hooks/web/useCache'
import CryptoJS from 'crypto-js'

const { wsCache } = useCache()
// 用戶信息
const userInfo = ref<any>(wsCache.get('userInfo')) // 登录用户
const router = useRouter()
const route = useRoute()
const { currentRoute, addRoute, push, replace } = useRouter()
const shareSelectionRef = ref()
const tagsDialogRef = ref<any>()
const checkAll = ref<boolean>(false) //全选
const isIndeterminate = ref<boolean>(false)
const isShareShow = ref<boolean>(false)
const selectedItems = ref<any>([]) // 多选框数组
const uploadDetailData = ref<any>({ title: null }) // 上传详情的数据
const fileList = ref<any>([]) // 附件的数据
const downloadList = ref<any>([]) // 下载的数据
const tagTypeName = ref<any>([]) // 标签的名称
const tagTypeList = ref<any>([]) // 标签的数据
const uploadFlag = ref<any>(false) // 控制编辑页面的显示隐藏
const uuid = ref<any>('')
const invalid = ref<any>()
const shareUserName = ref('')
const isAuth = ref<any>(false)
const isFile = ref<any>(false)
const loading = ref<any>(false)
const withCode = ref<any>()
const shareId = ref<any>(null)
const extractCode = ref<any>('')
const contentH = ref<number>(document.body.clientHeight * 0.8)
useEmitt({
  name: 'window',
  callback: (type: string) => {
    if (type === 'resize') {
      resetHeight()
    }
  }
})
const baseInfoH = ref<number>(180)
const resetHeight = () => {
  // nextTick()
  setTimeout(() => {
    let bodyH = document.documentElement.clientHeight
    let headerH = getOverViewWrapper('.upload_header')
    let firstInfoH = getOverViewWrapper('.first-info')
    let pageMargin = 0
    const content = document.querySelector('.contentH')
    if (content) {
      let computedStyle = getComputedStyle(content, null)
      if (computedStyle) {
        pageMargin = parseFloat(computedStyle.getPropertyValue('margin-top'))
      }
    }
    contentH.value = bodyH - headerH - pageMargin - 30
    const relativeMap = document.querySelector('.relative_map')
    let letMargin = 0
    if (relativeMap) {
      let computedStyle = getComputedStyle(relativeMap, null)
      if (computedStyle) {
        letMargin = parseFloat(computedStyle.getPropertyValue('margin-top')) * 3
      }
    }
    baseInfoH.value = (contentH.value - firstInfoH - letMargin) / 3
  }, 500)
}
const getOverViewWrapper = (dom: string): number => {
  let topH = 0
  const checkboxWrapper = document.querySelector(dom)
  if (checkboxWrapper) {
    topH = checkboxWrapper.clientHeight
  }
  return topH
}
onMounted(() => {
  emitter.on('resetDetail', () => {
    getDetailData()
  })
  resetHeight()
})
onUnmounted(() => {
  emitter.off('resetDetail') // 取消handleEvent事件的handelEventFn函数监听
})
// 点击编辑按钮
const handleEdit = () => {
  uploadFlag.value = true
}
const isShowUpload = (val) => {
  uploadFlag.value = val
}
// 标签调整
const handleTags = () => {
  tagsDialogRef.value.openDialog(tagTypeList.value)
}
// 点击分享
const handleShare = (id) => {
  shareSelectionRef.value.openDrawer(id)
}
// 点击收藏
const isFastClick = ref<boolean>(false)
const handleCollection = async (val) => {
  if (!isFastClick.value) {
    isFastClick.value = true
    let data = {
      type: val > 0 ? '2' : '1',
      shareId: shareId.value ? shareId.value : null,
      titleId: uploadDetailData.value.id
    }
    let res = await closeCollectionApi(data).finally(() => {
      setTimeout(() => {
        isFastClick.value = false
      }, 200)
    })
    if (res) {
      ElMessage.success(val > 0 ? '取消收藏成功！' : '收藏成功')
      if (val > 0) {
        isCollection.value = 0
      } else {
        isCollection.value = 1
      }
      // getDetailData()
    }
  }
}
// 下载
const handleDownload = (data) => {
  myUploadDownloadApi({ fileId: data.id }, data.name)
}
// 批量下载
const handleBatchDownload = () => {
  if (!downloadList.value.length) {
    ElMessage.warning('请选择需要下载的数据')
  } else {
    downloadList.value.forEach((item) => {
      myUploadDownloadApi({ fileId: item.id }, item.name)
    })
  }
}
// 全部下载
const handleDownloadAll = () => {
  fileList.value.forEach((item) => {
    myUploadDownloadApi({ fileId: item.id }, item.name)
  })
}
const isFullscreen = ref<boolean>(false)
// 点击全屏
const handleFullScreen = () => {
  isFullscreen.value = !isFullscreen.value
}
// 点击文件名切换展示
const handleFileName = (val) => {
  const viteUrl = import.meta.env.VITE_UPLOAD_URL
  fileUrl.value = viteUrl + '/onlinePreview?url=' + encodeURIComponent(Base64.encode(val))
}
// 查看附件
const seeFile = (url, title) => {
  const viteUrl = import.meta.env.VITE_UPLOAD_URL
  // 打开新窗口
  const newWindow = window.open(
    viteUrl + '/onlinePreview?url=' + encodeURIComponent(Base64.encode(url)),
    '_blank'
  )
  // 确保新窗口成功打开
  if (!newWindow || newWindow.closed || typeof newWindow.postMessage !== 'function') {
    alert('无法打开新窗口或浏览器不支持')
    return
  }
}
// 全选
const toggleAll = (val) => {
  if (checkAll.value) {
    downloadList.value = fileList.value
  } else {
    downloadList.value = []
  }
  selectedItems.value = val
    ? unref(fileList).map((item) => {
        return item.id
      })
    : []
  isIndeterminate.value = false
}
// 多选
const changeCheck = (data) => {
  const index = downloadList.value.findIndex((item) => item.id == data.id)
  if (index > -1) {
    downloadList.value.splice(index, 1)
  } else {
    downloadList.value.push(data)
  }
  const checkedCount = selectedItems.value.length
  checkAll.value = checkedCount === fileList.value.length
  isIndeterminate.value = checkedCount > 0 && checkedCount < fileList.value.length
}
// 获取我的上传详情
const fileUrl = ref<String>('')
const fileType = ref<String>('')
const id = ref<any>('')
const isEdit = ref<string>('')
const isShare = ref<string>('')
const isCopy = ref<string>('')
const isDownload = ref<string>('')
const createUserId = ref<string>('')
const whetherSkipCode = ref<boolean>(false)
if (route.params.id) {
  id.value = route.params.id
}
if (route.params.shareId) {
  shareId.value = route.params.shareId
  whetherSkipCode.value = true
} else {
  whetherSkipCode.value = false
}
if (route.params.uuid) {
  uuid.value = route.params.uuid
}
const isCollection = ref()
const getDetailData = async () => {
  loading.value = true
  await getUploadDetailApi({
    id: id.value,
    extractCode: extractCode.value,
    shareId: shareId.value,
    whetherSkipCode: whetherSkipCode.value
  })
    .then((res) => {
      loading.value = false
      isShareShow.value = false
      if (res.data) {
        uploadDetailData.value = res.data
        isCollection.value = res.data.collectionCount
        const name = res.data.tagTypeName
        tagTypeName.value = name.split(',')
        tagTypeList.value = res.data.tagTypeList
        fileList.value = res.data.files
        const viteUrl = import.meta.env.VITE_UPLOAD_URL
        fileUrl.value =
          viteUrl + '/onlinePreview?url=' + encodeURIComponent(Base64.encode(res.data.files[0].url))
        fileType.value = res.data.files[0].url
        createUserId.value = res.data.createBy
        if (res.data.params) {
          isEdit.value = res.data.params.edit
          isShare.value = res.data.params.share
          isCopy.value = res.data.params.copy
          isDownload.value = res.data.params.download
        }
        resetHeight()
      }
    })
    .catch((error) => {
      loading.value = false
      isShareShow.value = true
      if (error.code == 'A0301') {
        isAuth.value = true
      } else if (error.code == 'A0407') {
        invalid.value = true
      } else if (error.code == 'A0400') {
        isFile.value = true
        console.log('isFile=>', isFile.value)
      }
    })
}
// 获取UUid
const getUUid = async () => {
  const res = await getByUuidApi({
    uuid: uuid.value
  })
  if (res && res.data) {
    shareUserName.value = res.data.shareUserName
    invalid.value = res.data.invalid
    withCode.value = res.data.withCode
    shareId.value = res.data.shareId
  }
  if (!withCode.value && !invalid.value) {
    await getDetailData()
  } else {
    isShareShow.value = true
  }
}
if (!uuid.value) {
  getDetailData()
} else {
  getUUid()
}
// 点击提取码确定
const handleCode = (code) => {
  extractCode.value = code
  getDetailData()
}
const cancel = () => {
  window.open('about:blank', '_self')
  window.close()
}
</script>
<style lang="less">
.infoForm {
  .el-form-item {
    margin-bottom: 6px !important;
    .el-form-item__label {
      height: 20px !important;
      line-height: 20px !important;
      color: #222222 !important;
      font-weight: bold !important;
    }
    .el-form-item__content {
      line-height: 20px !important;
    }
  }
}
</style>
<style scoped lang="less">
:deep(.bc) {
  background: #00a0e9 !important;
  color: #fff !important;
  .el-checkbox__inner::after {
    border: 2px solid #00a0e9;
    border-left: 0;
    border-top: 0;
  }
  .el-checkbox__inner {
    background: #fff !important;
  }
  .file-name {
    &:hover {
      color: #ffffff !important;
      text-decoration-line: underline !important;
    }
  }
  .bc-icon :hover {
    color: #ffffff !important;
  }
}
.bc-icon :hover {
  color: #00a0e9 !important;
}
:deep(.breadcrumb .el-breadcrumb__inner) {
  color: #999 !important;
}
:deep(.breadcrumb .breadcrumb_title .el-breadcrumb__inner) {
  color: #333333 !important;
}
.full-screen {
  position: absolute;
  right: 30px;
  top: 10px;
  cursor: pointer;
  width: 35px;
  height: 35px;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  justify-content: center;
  align-items: center;
}
.iframe-height {
  height: 520px;
}
.full_icon {
  font-size: 26px !important;
}
.icon_size {
  font-size: 70px !important;
}
.size_icon {
  font-size: 14px !important;
}
:deep(.el-breadcrumb__inner) {
  max-width: 450px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.upload_box {
  width: 100%;
  height: 100%;
  background: #f4f4f4;
  font-size: 14px;
  .upload_header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 60px;
    background: #ffffff;
    border-radius: 2px;
    // background: #ffffff;
    padding: 0 25px;
    .header_left {
      font-size: 16px;
      max-width: 900px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .header_right {
      display: flex;
      .upload_edit {
        width: 80px;
        height: 30px;
        line-height: 30px;
        text-align: center;
        background: #00a0e9;
        color: #fff;
        cursor: pointer;
      }
      .upload_edit:hover {
        background: #0db3ff;
      }
      .upload_tags {
        width: 80px;
        height: 30px;
        line-height: 30px;
        text-align: center;
        border: 1px solid #c9ccd4;
        margin-right: 10px;
        cursor: pointer;
        &:active {
          border: 1px solid #00a0e9 !important;
          color: #0091d3 !important;
        }
      }
      .upload_tags:hover {
        border: 1px solid #99d9f6;
        color: #0db3ff;
      }
      .upload_icon {
        width: 40px;
        height: 30px;
        line-height: 30px;
        text-align: center;
        border: 1px solid #c9ccd4;
        cursor: pointer;
        &:active {
          border: 1px solid #00a0e9 !important;
          color: #0091d3 !important;
        }
      }
      .upload_icon:hover {
        border: 1px solid #99d9f6;
        .size_icon {
          color: #0db3ff;
        }
      }
    }
  }
  .upload_content {
    //display: table;
    display: flex;
    width: 100%;
    padding: 0px 10%;
    //overflow: scroll;
    .content-row {
      width: 100%;
      display: flex;
      //display: table-row;
      height: 100%;
      //overflow-y: auto;
      .content_left {
        width: 330px;
        margin-right: 10px;
        //padding-right: 10px;
        //display: table-cell;
        overflow: auto;
        //display: flex;
        //flex-direction: column;
        //justify-content: space-between;
        .base_info {
          width: 100%;
          //height: 24%;
          min-height: 190px;
          background: #ffffff;
          .base_info_title {
            font-weight: bold;
            height: 50px;
            line-height: 50px;
            border-bottom: 1px solid #eeeeee;
            padding-left: 15px;
          }
          .base_info_content {
            padding-left: 15px;
            padding-top: 10px;
            .info_right {
              color: #666666;
              width: 180px;
              white-space: nowrap;
              overflow: hidden;
              text-overflow: ellipsis;
            }
            .tagsName {
              margin: 0 4px 4px 0px;
              max-width: 160px;
              background: #eeeeee;
              white-space: nowrap;
              overflow: hidden;
              text-overflow: ellipsis;
              padding: 4px 6px;
            }
          }
          .info_content {
            display: flex;
            justify-content: center;
            flex-direction: column;
            align-items: center;
            color: #999999;
            margin-top: 15px;
          }
        }
      }
      .content_right {
        width: 100%;
        background: #ffffff;
        padding: 25px;
        overflow: auto;
        //display: table-cell;
        .title_box {
          font-size: 22px;
          margin-top: 28px;
          max-width: 900px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .abstracts {
          margin: 6px 0;
          word-wrap: break-word; //自动换行
          word-break: break-all; //自动换行（兼容字母）
          //overflow: hidden; //超出隐藏
          //text-overflow: ellipsis; //溢出显示省略号
          display: -webkit-box;
          //-webkit-line-clamp: 3; //显示3行
          -webkit-box-orient: vertical;
        }
        .title_bottom {
          color: #999999;
          .border_right {
            &::after {
              content: '';
              margin-left: 15px;
              padding-left: 15px;
              border-left: 1px solid #ccc;
              height: 14px;
              display: inline-block;
              vertical-align: middle;
            }
          }
        }
        .attachment {
          display: flex;
          align-items: center;
          margin-top: 20px;
          .line {
            height: 1px;
            flex: 1;
            background: #eeeeee;
            margin-left: 8px;
          }
        }
      }
    }
  }
  .files_list {
    //max-height: 80px;
    .files_top {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding-left: 10px;
      .down_btn {
        display: flex;
        .batch_download {
          margin-right: 9px;
          color: #00a0e9;
          &:hover {
            color: #0db3ff;
            text-decoration-line: underline !important;
          }
          &:active {
            color: #0092d4;
            text-decoration-line: underline !important;
          }
          &:after {
            content: '';
            margin-left: 9px;
            border-left: 1px solid #dedede;
            height: 12px;
            display: inline-block;
            vertical-align: middle;
          }
        }
        .download_all {
          color: #00a0e9;
          &:hover {
            color: #0db3ff;
            text-decoration-line: underline !important;
          }
          &:active {
            color: #0092d4;
            text-decoration-line: underline !important;
          }
        }
      }
    }
    .files_info {
      display: flex;
      align-items: center;
      justify-content: space-between;
      background: #f9f9f9;
      padding-left: 10px;
      margin: 4px 0;
      &:hover {
        background: #f1f2f4;
      }
      svg {
        font-size: 18px;
      }
      .files_name {
        margin-left: 10px;
        width: 450px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        .file-name {
          &:hover {
            color: #0db3ff;
            text-decoration-line: underline;
          }
        }
      }
      .files_btn {
        margin-right: 15px;
      }
    }
  }
}
.contentH {
  margin-top: 30px;
  //overflow-y: auto;
}
</style>