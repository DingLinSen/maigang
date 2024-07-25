<template>
  <uploader
    :options="options"
    class="uploader-example"
    ref="uploaderRef"
    :file-status-text="fileStatusText"
    @file-success="onFileSuccess"
    @complete="fileComplete"
    @file-added="onFileAdded"
    @files-added="onFilesAdded"
  >
    <ContentWrap :Showtitle="props.showTitle" class="content-wrap">
      <template #ContentWrapTitle>
        <div class="btn-right">
          <el-popover placement="bottom" trigger="hover">
            <template #reference>
              <ElButton
                v-if="
                  isAuth(
                    `${props.auth == 'poduct' ? 'school' : 'AdministrativeService'}:${
                      props.auth
                    }:upload`
                  )
                "
                :loading="exLoading"
                class="exportBtn"
                plain
              >
                <Icon class="mr-5px" icon="svg-icon:uploadFile" />
                上传
              </ElButton>
            </template>
            <uploader-btn>上传文件</uploader-btn>
            <uploader-btn :directory="true">上传文件夹</uploader-btn>
          </el-popover>

          <ElButton
            v-if="
              isAuth(
                `${props.auth == 'poduct' ? 'school' : 'AdministrativeService'}:${
                  props.auth == 'poduct' ? 'product' : props.auth
                }:download`
              )
            "
            class="exportBtn"
            plain
            @click="downloadFileS()"
          >
            <Icon class="mr-5px" icon="svg-icon:downloadFile" />
            下载
          </ElButton>
          <ElButton
            v-if="
              isAuth(
                `${props.auth == 'poduct' ? 'school' : 'AdministrativeService'}:${props.auth}:del`
              )
            "
            :loading="delLoading"
            class="btn-other"
            plain
            @click="delData(null, true)"
          >
            <template #icon>
              <Icon :size="14" icon="svg-icon:deleteBut" />
            </template>
            删除
          </ElButton>
        </div>
      </template>
      <Table
        v-model:currentPage="props.tableObject.currentPage"
        v-model:pageSize="props.tableObject.pageSize"
        :columns="allSchemas.tableColumns"
        :cotentAlign="'center'"
        :data="props.tableObject.tableList"
        :header-align="'center'"
        :isFileMenu="true"
        :isShowCell="isShowCell"
        :isShowTable="isShowTable"
        :loading="props.tableObject.loading"
        @register="register"
        @selection-change="selectionChange"
      >
        <template #fileName="{ row }">
          <div v-if="row.filePath">
            <svg v-if="row.fileType == 2" aria-hidden="true" class="fileIcon">
              <use xlink:href="#icon-wenjianjia" />
            </svg>
            <svg
              v-else-if="/\.pdf/.test(row.filePath.toLowerCase())"
              aria-hidden="true"
              class="fileIcon"
            >
              <use xlink:href="#icon-pdf" />
            </svg>
            <svg
              v-else-if="/\.xlsx|\.xls/.test(row.filePath.toLowerCase())"
              aria-hidden="true"
              class="fileIcon"
            >
              <use xlink:href="#icon-excel" />
            </svg>
            <svg
              v-else-if="/\.doc|\.docx/.test(row.filePath.toLowerCase())"
              aria-hidden="true"
              class="fileIcon"
            >
              <use xlink:href="#icon-word" />
            </svg>
            <svg
              v-else-if="/\.ppt/.test(row.filePath.toLowerCase())"
              aria-hidden="true"
              class="fileIcon"
            >
              <use xlink:href="#icon-ppt" />
            </svg>
            <svg
              v-else-if="/\.zip/.test(row.filePath.toLowerCase())"
              aria-hidden="true"
              class="fileIcon"
            >
              <use xlink:href="#icon-yasuowenjian3" />
            </svg>
            <svg
              v-else-if="/\.mp4|\.mov/.test(row.filePath.toLowerCase())"
              aria-hidden="true"
              class="fileIcon"
            >
              <use xlink:href="#icon-video" />
            </svg>
            <svg
              v-else-if="/\.jpg|\.png|\.gif|\.jpeg/.test(row.filePath.toLowerCase())"
              aria-hidden="true"
              class="fileIcon"
            >
              <use xlink:href="#icon-photo" />
            </svg>
            <!--        <img v-else-if="/\.jpg|\.png|\.gif|\.mpeg/.test(row.filePath.toLowerCase())" :src="row.filePath" class="table-img">-->
            <svg v-else aria-hidden="true" class="fileIcon">
              <use xlink:href="#icon-weizhi3" />
            </svg>
            <span
              v-if="
                (row.fileName || row.docName) &&
                isAuth(
                  `${props.auth == 'poduct' ? 'school' : 'AdministrativeService'}:${
                    props.auth == 'poduct' ? 'product' : props.auth
                  }:detail`
                )
              "
              class="text-[#00A0E9] cursor-pointer"
              @click="jump(row)"
              >{{ row.fileName ? row.fileName : row.docName }}</span
            >
            <span v-else-if="row.fileName || row.docName">{{
              row.fileName ? row.fileName : row.docName
            }}</span>
            <span v-else>--</span>
          </div>
        </template>
        <template #icon>
          <div v-if="isShowFilesList" class="icon_list" @click="changeShow">
            <Icon icon="svg-icon:filesList" />
          </div>
          <div v-if="isShowFilesGrid" class="icon_list" @click="changeShow">
            <Icon icon="svg-icon:filesGrid" />
          </div>
        </template>
        <template #filesTop>
          <div class="tableTop">
            <div class="tableTop-left">
              <el-breadcrumb separator="/">
                <el-breadcrumb-item @click="linkTo(0, null)"><a>全部文件</a></el-breadcrumb-item>
                <el-breadcrumb-item
                  v-for="(item, index) in breadcrumbList"
                  @click="linkTo(item.id, index)"
                >
                  <a> {{ item.name }}</a>
                </el-breadcrumb-item>
              </el-breadcrumb>
            </div>
            <div class="tableTop-right">
              已选中
              <span style="color: #00a0e9">{{ selections ? selections : 0 }}</span>
              个文件/文件夹，共
              <span style="color: #00a0e9">{{ props.tableObject.tableList.length }}</span> 个
            </div>
          </div>
        </template>
        <template #operateBtnLeft>
          <Search
            v-if="
              isAuth(
                `${props.auth == 'poduct' ? 'school' : 'AdministrativeService'}:${
                  props.auth == 'poduct' ? 'product' : props.auth
                }:query`
              )
            "
            :schema="allSchemas.searchSchema"
            @reset="reset"
            @search="setSearchParamsSub"
          />
        </template>
        <template #grid>
          <div class="gridList">
            <div
              v-for="(item, index) in props.tableObject.tableList"
              :key="item.id"
              :class="{ 'click-gridList': isBorder }"
              class="gridList-item"
              @click="changGrid(item, index)"
            >
              <div v-if="item.filePath">
                <div class="dbl-click" @dblclick="jump(item)"></div>
                <div v-if="item.isShowBorder" class="grid-border"></div>
                <Icon v-if="item.isShowBorder" class="mr-5px sure" icon="svg-icon:selectedIcon" />
                <svg v-if="item.fileType == 2" aria-hidden="true" class="file-img">
                  <use xlink:href="#icon-wenjianjia" />
                </svg>
                <svg
                  v-else-if="/\.pdf/.test(item.filePath.toLowerCase())"
                  aria-hidden="true"
                  class="file-img"
                >
                  <use xlink:href="#icon-pdf" />
                </svg>
                <svg
                  v-else-if="/\.xlsx|\.xls/.test(item.filePath.toLowerCase())"
                  aria-hidden="true"
                  class="file-img"
                >
                  <use xlink:href="#icon-excel" />
                </svg>
                <svg
                  v-else-if="/\.doc|\.docx/.test(item.filePath.toLowerCase())"
                  aria-hidden="true"
                  class="file-img"
                >
                  <use xlink:href="#icon-word" />
                </svg>
                <svg
                  v-else-if="/\.ppt/.test(item.filePath.toLowerCase())"
                  aria-hidden="true"
                  class="file-img"
                >
                  <use xlink:href="#icon-ppt" />
                </svg>
                <svg
                  v-else-if="/\.zip/.test(item.filePath.toLowerCase())"
                  aria-hidden="true"
                  class="file-img"
                >
                  <use xlink:href="#icon-yasuowenjian3" />
                </svg>
                <svg
                  v-else-if="/\.mp4|\.mov/.test(item.filePath.toLowerCase())"
                  aria-hidden="true"
                  class="file-img"
                >
                  <use xlink:href="#icon-video" />
                </svg>
                <!-- <svg
                v-else-if="/\.png|\.gif|\.jpg|\.jpeg/.test(item.filePath.toLowerCase())"
                aria-hidden="true"
                class="file-img"
              >
                <use xlink:href="#icon-photo" />
              </svg> -->
                <img
                  v-else-if="/\.png|\.gif|\.jpg|\.jpeg/.test(item.filePath.toLowerCase())"
                  :src="item.filePath"
                  class="file-img"
                />
                <svg v-else aria-hidden="true" class="file-img">
                  <use xlink:href="#icon-weizhi3" />
                </svg>
                <div class="file-name">{{ item.fileName ? item.fileName : item.docName }} </div>
              </div>
            </div>
          </div>
        </template>
      </Table>
      <!-- 视频预览 -->
      <ElDialog
        ref="previewFileDialogRef"
        v-model="previewFileDialogVisible"
        custom-class="cultivate-custom"
        title="预览"
        @closed="back"
      >
        <div class="video_center">
          <video controls="controls">
            <source :src="fileUrl" type="video/mp4" />
          </video>
        </div>
      </ElDialog>
      <!--   文件预览 -->
      <FilePreview ref="FilePreviewRef" title="预览" />
      <!--    上传列表   -->
      <div v-if="progressDialog" class="uploadList">
        <div class="title">
          <div class="title-left">上传列表</div>
          <div class="title-right">
            <span @click="closeProgressDialog">×</span>
          </div>
        </div>
        <div class="upload-list">
          <uploader-list />
        </div>
      </div>
      <LimitDailog routerName="contract" />
    </ContentWrap>
  </uploader>
</template>
<script lang="ts" setup>
import { ElDialog } from '@/components/ElDialog'
import { ContentWrap } from '@/components/ContentWrap'
import { Search } from '@/components/Search'
import FilePreview from '@/views/Components/FilePreview/FilePreview.vue'
import { ElButton, ElMessageBox, ElMessage, ElLoading } from 'element-plus'
import { Table } from '@/components/Table'
import {
  deleteBatchFolderOrFile,
  downloadFolderOrFile,
  downloadBatchFolderOrFile
} from '@/api/AdministrativeService/qualifications'
import { h, reactive, ref, watch, onMounted, nextTick } from 'vue'
import { useEmitt } from '@/hooks/web/useEmitt'
import { CrudSchema, useCrudSchemas } from '@/hooks/web/useCrudSchemas'
import { isAuth } from '@/utils/is'
import { useCache } from '@/hooks/web/useCache'
import { useAppStore } from '@/store/modules/app'
import { LimitDailog } from '@/views/Components/limit'
import { PATH_URL } from '@/config/axios/service'
import { fileSize } from '@/utils/index'

const { wsCache } = useCache()
const appStore = useAppStore()

const emit = defineEmits(['getList', 'setSearchParams'])

defineOptions({
  name: 'Qualifications'
})
const props = defineProps({
  // 标题
  showTitle: {
    type: String,
    default: ''
  },
  //   传给后端得参数
  //    mgCompanyQualification 公司资质
  //    mgProjectQualificationsummary 项目申报
  // mgCooperationAgreement 合同管理
  //   mgPropertyRightsPlan 产品方案
  flag: {
    type: String,
    default: ''
  },
  tableObject: {
    type: Object,
    default: () => {}
  },
  auth: {
    type: String,
    default: ''
  }
})
const uploaderRef = ref(null)
// 上传文件的配置项
const options = {
  target: PATH_URL + '/oa-administrative/upload/uploadFolderOrFileDrag', // '//jsonplaceholder.typicode.com/posts/',
  testChunks: false,
  allowDuplicateUploads: true,
  headers: {
    Authorization: wsCache.get(appStore.getToken)
  },
  query: function (file, trunk, isTest) {
    if (breadcrumbList.value.length > 0) {
      // 如果在子目录上传，将当前层级的id/path 传输
      return {
        fileName: file.name,
        flag: props.flag,
        parentDocId: breadcrumbList.value[breadcrumbList.value.length - 1].id,
        parentFilePath: breadcrumbList.value[breadcrumbList.value.length - 1].path
      }
    } else {
      return {
        fileName: file.name,
        // 如果是根目录或搜索模式下上传 传空值
        flag: props.flag,
        parentDocId: '',
        parentFilePath: ''
      }
    }
  },
  parseTimeRemaining: function (timeRemaining, parsedTimeRemaining) {
    return parsedTimeRemaining
      .replace(/\syears?/, '年')
      .replace(/\days?/, '天')
      .replace(/\shours?/, '小时')
      .replace(/\sminutes?/, '分钟')
      .replace(/\sseconds?/, '秒')
  },
  chunkSize: 1024 * 1024 * 1024 * 1024
}
// 提示语
// const statusText = {
//   success: '成功',
//   error: '失败',
//   uploading: '上传中',
//   paused: '暂停',
//   waiting: '排队中'
// }
const fileStatusText = (status, response) => {
  if (status == 'success' && response.code != '00000') {
    status = 'error'
  }
  // 第一个 status 为状态，第二个为响应内容
  const statusTextMap = {
    success: '成功',
    error: '失败',
    uploading: '上传中',
    paused: '暂停',
    waiting: '等待'
  }
  return statusTextMap[status]
}
// 关闭上传文件列表
const closeProgressDialog = () => {
  progressDialog.value = false
  window.uploader.cancel()
}
const fileNum = ref()
// 上传文件
const onFileAdded = (fileList) => {
  fileNum.value = fileList.length
  progressDialog.value = true
}
// 上传文件夹
const onFilesAdded = (fileList) => {
  fileNum.value = fileList.length
  progressDialog.value = true
}
const onFileSuccess = (rootFile, file, message, chunk) => {
  let data = JSON.parse(message)
  if (data.code != '00000') {
    ElMessage({
      showClose: true,
      duration: 0,
      message: data.tip,
      type: 'error'
    })
  }
  if (fileNum.value == 1 && data.code == '00000') {
    ElMessage({
      message: `文件: ${file.name} 上传成功`,
      type: 'success'
    })
    emit('getList')
  }
}
// 文件上传成功
const fileComplete = () => {
  if (fileNum.value > 1) {
    ElMessage({
      message: '上传成功',
      type: 'success'
    })
    emit('getList')
  }
}
onMounted(() => {
  nextTick(() => {
    window.uploader = uploaderRef.value.uploader
  })
})
const FilePreviewRef = ref()
// 是否显示筛选窗口
const isShowCell = ref(false)
//导出加载
const exLoading = ref(false)
const isShowFilesList = ref<boolean>(true)
const isShowFilesGrid = ref<boolean>(false)
const isShowTable = ref<boolean>(true)
const selections = ref()
const delLoading = ref(false)
const previewFileDialogVisible = ref(false)
const fileUrl = ref('')
const breadcrumbList = ref([])
const progressDialog = ref(false)

// const { register, tableObject, methods } = useTable<InductionData>({
//   getListApi: getFilesListApi,
//   delListApi: deleteBatchFolderOrFile,
//   response: {
//     list: 'data',
//     total: 'total'
//   },
//   defaultParams: {
//     id: '0'
//   }
// })
// tableObject.pageSize = 9999
// const { getList, setSearchParams } = methods
// getList()

watch(
  () => props.tableObject.tableList,
  (val) => {
    props.tableObject.tableList.forEach((item: any) => {
      item.fileSize = undefined || item.fileSize === '--' ? 0 : Number(item.fileSize)
      if (item.createByName === undefined) {
        item.createByName = null
      }
      if (item.updateTime === undefined) {
        item.updateTime = null
      }
    })
  },
  { deep: true, immediate: true }
)

useEmitt({
  name: 'getList',
  callback: (type: string) => {
    if (type === 'add') {
      props.tableObject.currentPage = 1
    }
    emit('getList')
  }
})
// 搜索的配置项
const params = reactive<any>({
  fileName: '',
  id: ''
})
// 表格配置项
const crudSchemas = reactive<CrudSchema[]>([
  {
    field: 'fileName',
    label: '文件名',
    minWidth: '500px',
    align: 'left',
    headerAlign: 'left',
    table: {
      sortable: true
    },
    search: {
      show: true,
      component: 'Input',
      componentProps: {
        style: 'width: 196px',
        placeholder: '当前目录搜索文件/文件夹'
      }
    }
  },
  {
    field: 'fileSize',
    label: '大小',
    minWidth: '180px',
    table: {
      sortable: true
    },
    formatter: (row: any) => {
      return fileSize(row)
    }
  },
  {
    field: 'createByName',
    minWidth: '160px',
    label: '上传人',
    table: {
      sortable: true
    },
    formatter: (row: any) => {
      return h(
        'span',
        row.createByName ? row.createByName : row.createUserName ? row.createUserName : '--'
      )
    }
  }
  // {
  //   field: 'updateTime',
  //   minWidth: '160px',
  //   label: '修改时间',
  //   table: {
  //     sortable: true
  //   },
  //   formatter: (row: any) => {
  //     return h('span', row.updateTime ? row.updateTime : row.editTime ? row.editTime : '--')
  //   }
  // }
])
if (props.flag == 'mgPropertyRightsPlan') {
  crudSchemas.push({
    field: 'editTime',
    minWidth: '160px',
    label: '修改时间',
    table: {
      sortable: true
    },
    formatter: (row: any) => {
      return h('span', row.editTime ? row.editTime : '--')
    }
  })
} else {
  crudSchemas.push({
    field: 'updateTime',
    minWidth: '160px',
    label: '修改时间',
    table: {
      sortable: true
    },
    formatter: (row: any) => {
      return h('span', row.updateTime ? row.updateTime : '--')
    }
  })
}
const { allSchemas } = useCrudSchemas(crudSchemas)

// 点击全部文件
const linkTo = (id, index) => {
  const params = {
    id: id
  }
  emit('setSearchParams', params)
  fileId.value = null
  breadcrumbList.value.splice(index + 1, breadcrumbList.value.length)
  if (id == 0) {
    breadcrumbList.value = []
  }
}
const selectionsData = ref([])
// 获取选中的数据
const selectionChange = (val) => {
  selections.value = val.length
  selectionsData.value = Array.from(val)
}
// 是否显示列表/网格图标
const changeShow = async () => {
  isShowFilesGrid.value = !isShowFilesGrid.value
  isShowFilesList.value = !isShowFilesList.value
  if (isShowFilesGrid.value) {
    isShowTable.value = false
    selections.value = 0
  } else {
    isShowTable.value = true
    selectData = []
    selections.value = 0
  }
}
// 删除/批量删除
const delData = async () => {
  if (!selectionsData.value.length && !selectData.length) {
    ElMessage({
      message: '请选择需要删除的数据',
      type: 'warning'
    })
    return
  } else if (selectionsData.value.length) {
    // 判断选中的数据是否有权限
    let res = selectionsData.value.every(function (item) {
      return item.delFlag == 0
    })
    if (!res) {
      ElMessage.warning('部分数据没有权限进行操作')
      return
    }
    let ids = selectionsData.value.map((v) => v.id).toString()
    const data = {
      ids: ids,
      flag: props.flag
    }
    ElMessageBox.confirm('是否删除所选中数据？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
      autofocus: false
    }).then(async () => {
      delLoading.value = true
      await deleteBatchFolderOrFile(data).then((res) => {
        if (res) {
          ElMessage({
            message: '删除成功',
            type: 'success'
          })
          delLoading.value = false
          emit('getList')
        }
      })
    })
  } else if (selectData.length) {
    let gridFlag = selectData.every((item) => {
      return item.delFlag == 0
    })
    if (!gridFlag) {
      ElMessage.warning('部分数据没有权限进行操作')
      return
    }
    let ids = selectData.map((v) => v.id).toString()
    ElMessageBox.confirm('是否删除所选中数据？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
      autofocus: false
    }).then(async () => {
      delLoading.value = true
      await deleteBatchFolderOrFile({
        ids: ids,
        flag: props.flag
      }).then((res) => {
        if (res) {
          ElMessage({
            message: '删除成功',
            type: 'success'
          })
          delLoading.value = false
          emit('getList')
        }
      })
    })
  }
}
const fileId = ref()
//table操作栏按钮事件
const jump = (row) => {
  if (row.fileType == 2) {
    breadcrumbList.value.push({
      name: row.docName,
      id: row.id,
      path: row.filePath
    })
    const params = {
      id: row.id,
      fileName: ''
    }
    fileId.value = row.id
    emit('setSearchParams', params)
    return
  } else if (/\.pdf|\.png|\.jpg|\.jpeg|\.docx|\.xlsx/.test(row.filePath.toLowerCase())) {
    FilePreviewRef.value.openDialog(row.fileName, row.filePath)
    return
  } else if (/\.mp4|\.mov/.test(row.filePath.toLowerCase())) {
    previewFileDialogVisible.value = true
    fileUrl.value = row.filePath
    return
  } else /\.doc|\.docx|\.xls|\.xlsx|\.ppt/.test(row.filePath.toLowerCase())
  {
    const parmas = {
      path: row.filePath,
      folderOrFile: 'file'
    }
    const data = {
      url: '/mgdaas-file/downloadFolderOrFile',
      fileName: row.fileName
    }
    downloadFolderOrFile(parmas, data)
  }
}
let selectData = reactive([])
//点击Grid布局
const changGrid = (item, index) => {
  if (item.isShowBorder) {
    item.isShowBorder = false
    const ind = selectData.indexOf(item)
    if (selectData.indexOf(item) != -1) {
      selectData.splice(ind, 1)
    }
    selections.value = selectData.length
  } else {
    item.isShowBorder = true
    selectData.push(item)
    selections.value = selectData.length
  }
}
const isBorder = ref(false)
// 下载
const downloadFileS = async () => {
  if (!selectionsData.value.length && !selectData.length) {
    ElMessage({
      message: '请选择需要下载的数据',
      type: 'warning'
    })
    return
  }
  const loading = ElLoading.service({
    lock: true,
    text: '下载中',
    background: 'rgba(0, 0, 0, 0.7)'
  })
  if (selectionsData.value.length) {
    let path = ''
    for (let i = 0; i < selectionsData.value.length; i++) {
      path += selectionsData.value[i].filePath + ','
    }
    //去掉最后一个逗号(如果不需要去掉，就不用写)
    if (path.length > 0) {
      path = path.substr(0, path.length - 1)
    }
    if (selectionsData.value.length == 1 && selectionsData.value[0].fileType == 2) {
      const parmas = {
        path: path,
        folderOrFile: 'folder'
      }
      const data = {
        url: '/mgdaas-file/downloadFolderOrFile',
        fileName: selectionsData.value[0].docName + '.zip'
      }
      await downloadFolderOrFile(parmas, data)
        .then(() => {
          loading.close()
        })
        .catch(() => {
          loading.close()
        })
      return
    }
    if (selectionsData.value.length == 1 && selectionsData.value[0].fileType != 2) {
      const parmas = {
        path: selectionsData.value[0].filePath,
        folderOrFile: 'file'
      }
      const data = {
        url: '/mgdaas-file/downloadFolderOrFile',
        fileName: selectionsData.value[0].fileName
      }
      await downloadFolderOrFile(parmas, data)
        .then(() => {
          loading.close()
        })
        .catch(() => {
          loading.close()
        })
      return
    }
    if (selectionsData.value.length > 1) {
      const parmas = {
        paths: path
      }
      await downloadBatchFolderOrFile(parmas)
        .then(() => {
          loading.close()
        })
        .catch(() => {
          loading.close()
        })
    }
  } else if (selectData.length) {
    let path = ''
    for (let i = 0; i < selectData.length; i++) {
      path += selectData[i].filePath + ','
    }
    //去掉最后一个逗号(如果不需要去掉，就不用写)
    if (path.length > 0) {
      path = path.substr(0, path.length - 1)
    }
    if (selectData.length == 1 && selectData[0].fileType == 2) {
      const parmas = {
        path: path,
        folderOrFile: 'folder'
      }
      const data = {
        url: '/mgdaas-file/downloadFolderOrFile',
        fileName: selectData[0].docName + '.zip'
      }
      await downloadFolderOrFile(parmas, data)
        .then(() => {
          loading.close()
        })
        .catch(() => {
          loading.close()
        })
      return
    }
    if (selectData.length == 1 && selectData[0].fileType != 2) {
      const parmas = {
        path: selectData[0].filePath,
        folderOrFile: 'file'
      }
      const data = {
        url: '/mgdaas-file/downloadFolderOrFile',
        fileName: selectData[0].fileName
      }
      await downloadFolderOrFile(parmas, data)
        .then(() => {
          loading.close()
        })
        .catch(() => {
          loading.close()
        })
      return
    }
    if (selectData.length > 1) {
      const parmas = {
        paths: path,
        folderOrFile: 'file'
      }
      await downloadBatchFolderOrFile(parmas)
        .then(() => {
          loading.close()
        })
        .catch(() => {
          loading.close()
        })
    }
  }
}
//搜索
const setSearchParamsSub = (param: any) => {
  params.fileName = param.fileName ? param.fileName : ''
  params.id = fileId.value ? fileId.value : 0
  emit('setSearchParams', params)
  if (param.fileName != '') {
    breadcrumbList.value = []
  }
}
// 重置
const reset = (param: any) => {
  fileId.value = null
  params.fileName = param.fileName ? param.fileName : ''
  params.id = param.id ? param.id : 0
  emit('setSearchParams', params)
  breadcrumbList.value = []
}
</script>

<style lang="less" scoped>
.uploader-btn {
  text-align: center;
  width: 100%;
  display: inline-block;
  position: relative;
  padding: 4px 8px;
  font-size: 16px;
  line-height: 1.7;
  color: 0;
  margin: 3px 0;
  border: 1px solid #eee;
  cursor: pointer;
  border-radius: 2px;
  background: 0 0;
  outline: 0;
}
.uploader-btn:hover {
  border: 1px solid #c6e2ff;
  color: #00a0e9;
  background-color: #ecf5ff;
}
:deep(.el-loading-mask) {
  top: 0px !important;
  width: 100% !important;
  left: 0px !important;
}

:deep(.el-upload) {
  width: 100%;
}

.content-wrap {
  position: relative;
}

.btn-right {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.btn-right div {
  margin: 0 10px;
}

.upload-btn {
  margin-bottom: 5px;
}

.tableTop {
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
}

.icon {
  margin-left: 10px;
  cursor: pointer;
}

.gridList {
  display: flex;
  flex-wrap: wrap;
}

.gridList-item {
  position: relative;
  padding: 20px 0;
  width: 10%;
  margin: 5px;
}

.grid-border {
  border: 1px solid #309fff;
  cursor: pointer;
  height: 100%;
  width: 100%;
  position: absolute;
  top: 0;
}

.dbl-click {
  z-index: 9999;
  cursor: pointer;
  height: 100%;
  width: 100%;
  position: absolute;
  top: 0;
}

.sure {
  position: absolute;
  top: 12px;
  left: 10px;
}

.gridList-item:hover {
  background-color: #f6f6f6;
  cursor: pointer;
}

.file-img {
  width: 50px;
  height: 50px;
  margin: 0px auto 10px;
}

.file-name {
  text-align: center;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  padding: 0 10px;
}

.uploadFile {
  width: 45%;
  margin-top: 10px;
}

.uploadFiles {
  margin-top: 10px;
  width: 45%;
  float: right;
}

.uploadFiles label {
  width: 100%;
  cursor: pointer;
}

.file-wj {
  width: 100%;
  height: 700px;
}

@keyframes Model {
  0% {
    height: 0;
  }

  100% {
    height: 400px;
  }
}
::-webkit-scrollbar {
  width: 6px;
  height: 6px;
  // background-color: red;
}
::-webkit-scrollbar-thumb {
  background-color: #00a0e9;
  border-radius: 3px;
}
.uploadList {
  z-index: 9999;
  position: fixed;
  width: 650px;
  // height: 400px;
  right: 0;
  bottom: 0px;
  background-color: #ffffff;
  box-shadow: 0 0px 10px rgba(0, 0, 0, 0.15);
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
  animation-name: Model;
  animation-duration: 1s;
  .upload-list {
    overflow: scroll;
    height: 350px;
  }

  .title {
    background-color: #ffffff;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 5px 10px;
    border-top-left-radius: 10px;
    border-top-right-radius: 10px;
    color: #000;

    .title-left {
      font-weight: 600;
    }
  }

  .title-right {
    cursor: pointer;

    span {
      font-size: 28px;
      color: #979a9f;
      margin: 0 5px;
    }
  }
}

.table-img {
  width: 1em;
  height: 1em;
  vertical-align: -0.15em;
  fill: currentColor;
  overflow: hidden;
  display: inline-block;
  margin-right: 8px;
}

.video_center {
  display: flex;
  justify-content: center;
}

.icon_list {
  margin-left: 10px;
  width: 40px;
  height: 33px;
  border: 1px solid #dcdfe6;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}

.icon_list:hover {
  color: #00a0e9 !important;
  border: 1px solid #c6e2ff;
  background-color: #ecf5ff;
}

.uploadList_header {
  display: flex;
  justify-content: space-between;
  padding: 10px 20px;
  font-weight: 600;
  background-color: #f7f8fa;

  .uploadList_name {
    width: 55%;
  }

  .uploadList_size {
    text-align: center;
    flex: 1;
  }

  .uploadList_progress {
    text-align: center;
    flex: 1;
  }
}

.uploadList_content {
  display: flex;
  justify-content: space-between;
  padding: 10px 20px;
  font-weight: 600;
  //background-color: #f7f8fa;

  .uploadList_name {
    width: 55%;
    overflow: hidden;
  }

  .uploadList_size {
    text-align: center;
    flex: 1;
  }

  .uploadList_progress {
    text-align: center;
    flex: 1;
  }
}
</style>
