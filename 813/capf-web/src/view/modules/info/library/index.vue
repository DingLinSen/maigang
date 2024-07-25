<!--
 * @description manuscriptlibrary- 稿库管理表--index
 * @author yxm
 * @date 2022-04-07
 * -->
<template lang="html">
  <container class="full-container">
    <div slot="content">
      <Tables
        ref="tables"
        v-if="tableColumnPugins != null"
        searchable
        search-place="top"
        v-model="listData"
        :exportPath="API.LIST_EXPORT_URL"
        :exportParams="loadExportParams()"
        :border="true"
        :columnControl="true"
        :loading="loading"
        :columns="tableColumnPugins"
        :canSearch="canSearch"
        :canReset="canReset"
        :canSave="canSave"
        :canExport="canExport"
        @on-sort-change="onSortChange"
        @btnInsert="createDrawerChange"
        @btnUpdate="updateDrawerChange"
        @btnDelete="btnDeleteBallast"
        @btnSearch="reloadList"
        @handleReset="handleResearch"
        @on-selection-change="selectChange"
      >
        <div slot="search" class="search-info">
          <div class="search-box">
            <span class="search-tip">稿件内容：</span>
            <Input
              type="text"
              v-model="searchParams.content"
              placeholder="输入稿件内容查询"
              :clearable="true"
              :maxlength="50"
              ref="content"
            />
          </div>
        </div>
        <div slot="btn-right">
          <Button
            type="primary"
            class="search-btn"
            ghost
            @click="handleOpenUpload()"
            v-if="canImport"
            >导入</Button
          >
        </div>
        <page-wrapper
          slot="footer"
          :total="totolCount"
          :pageSize="searchParams.limit"
          :pageNo="searchParams.current"
          @page-change="pageChange"
          @page-size-change="pageSizeChange"
        ></page-wrapper>
      </Tables>

      <!-- 删除弹框 -->
      <Modal
        v-model="deleteModel"
        :title="this.$store.state.base.deleteInfo.title"
        @on-ok="handleDelete"
      >
        <p>{{ this.$store.state.base.deleteInfo.msg }}</p>
      </Modal>

      <!-- 导入弹框 -->
      <!-- <Modal width="34%" v-model="fileModel" title="导入大纲" prop="fillList">
           <Row>
                <span class="search-tip mar-top-5">大纲名称：</span>
                <Col span="12">
                
                    <Input
                          type="text"
                          v-model="outlineName"
                          placeholder="输入大纲名称"
                          :clearable="false"
                          :maxlength="6"
                          ref="name"
                        />
              </Col>
            </Row>
          </br>
         <uploadFile
          v-model="fillList"
          ref="uploadBanner"
          :showUpload="true"
          :uploadURL="uploadURL"
          :acceptType="['pdf' , 'docx', 'doc']"
          :fileNum="1"
          :data="uploadParams"
          @changeFileParams="uploadSuccess"
          class="uploadImg"
        ></uploadFile>
        <div slot="footer">
          <Button type="primary" @click="handleSubmit">确认</Button>
          <Button type="error" @click="fileListFill">取消</Button>
        </div>
      </Modal> -->
    </div>

    <div slot="drawer">
      <!-- 上传操作 -->
      <upload-model
        ref="uploadModel"
        v-if="API.LIST_DOWNLOAD_URL && API.LIST_UPLOAD_URL && canImport"
        :downloadURL="API.LIST_DOWNLOAD_URL"
        :uploadURL="API.LIST_UPLOAD_URL"
        :uploadParams="uploadParams"
        :acceptType="['xls', 'xlsx']"
        @handleUpload="operateSuccess"
        modelTitle="导入稿库管理信息"
      ></upload-model>

      <transition name="center-show" mode="in-out">
        <keep-alive include="FormInfo">
          <component
            ref="formModel"
            :is="showComponent"
            :detailsId="
              chooseListData.length === 1 ? chooseListData[0].id : null
            "
            :isOperate="isOperate"
            :isPassword="isPassword"
            :isSee="isSee"
            :routerTitle="this.$route.meta.title"
            @operateSuccess="operateSuccess"
            @close="closeComponent"
            @error="error()"
          ></component>
        </keep-alive>
      </transition>
    </div>
  </container>
</template>
<script>
import {
  initManuscriptLibraryList,
  deleteManuscriptLibraryByIds
} from '@/api/info/library/api-modules-manuscriptlibrary'
import { API_MANUSCRIPTLIBRARY } from '@/api/info/library/api-address-manuscriptlibrary'
import { OPERATE_LIST } from '@/libs/mixin'
import ColumnPugins from './index-column'
import FormInfo from './operate/form-info.vue'
// import BeforeUpload from './before-upload.vue'
import { supportNormal } from '@/utils'
import { exportFile, exportFileWithName } from '@/api/api-base'
export default {
  mixins: [OPERATE_LIST],
  components: {
    FormInfo
    // BeforeUpload
  },
  data() {
    return {
      canReset: this.isAuth('info:library:query'), // 重置
      canSearch: this.isAuth('info:library:query'), // 查询
      // canEdit: this.isAuth('info:library:edit'), // 编辑
      canEdit: false, // 编辑
      canDelete: this.isAuth('info:library:delete'), // 删除
      canImport: this.isAuth('info:library:import'), // 能否导入
      // canExport: this.isAuth('info:library:export'), // 导出
      canExport: false, // 导出
      // canDownload: this.isAuth('info:library:download'), // 导出
      canDownload: false, // 导出
      canSave: false, // 添加
      canFindByID: false, // id查询
      exportPath: null, // 导出EXCEL地址
      downloadURL: null, // 下载地址
      uploadURL: null, // 上传地址
      exportUrl: null, // 导出地址
      uploadParams: null, // 上传参数
      API: {}, // api对象
      percent: 0,
      searchParams: {
        // 查询参数
        limit: 10, // 每页数量
        current: 1, // 当前页数
        content: null
      }
    }
  },
  mounted() {
    this.API = API_MANUSCRIPTLIBRARY()
    this.tableColumnPugins = ColumnPugins(this)
    // this.searchParams = Object.assign(this.searchParams, FormDataInfo())
    this.initListData()
  },
  methods: {
    // 初始化数据表格
    initListData() {
      // const reg = /^[A-Za-z\u4e00-\u9fa5]+$/gi
      // let name = this.searchParams.name
      // if (!reg.test(name) && (name || name === 0)) {
      //   this.$Message.error('名称项请输入汉字或字母')
      //   return
      // }
      var validation = supportNormal(this.searchParams)
      if (!validation.isPass) {
        let message = validation.message
        this.$Message.error(message)
      } else {
        this.loading = true
        initManuscriptLibraryList(this.searchParams)
          .then(res => {
            if (res.data.status) {
              this.totolCount = res.data.page.totalCount
              var data = res.data.page.list
              this.listData = data
              this.$nextTick(() => {
                this.loading = false
              })
            } else {
              this.loading = false
              this.listData = []
            }
          })
          .catch(() => {
            this.loading = false
          })
      }
    },

    // 根据参数刷新当前表格(添加是时刷新到第一页第一条；编辑、上传、删除后刷新到当前页)
    operateSuccess(formData) {
      this.handleResearch()
    },

    // 重置条件查询
    handleResearch() {
      this.searchParams = Object.assign(this.searchParams, {
        limit: 10, // 每页数量
        current: 1, // 当前页数
        content: null
      })
      this.chooseListData = []
      this.initListData()
    },

    // 确认删除列表信息
    async handleDelete() {
      let ids = ''
      this.chooseListData.forEach(element => {
        ids += element.id + ','
      })
      ids = ids.substring(0, ids.lastIndexOf(','))
      let params = {
        ids: ids
      }
      deleteManuscriptLibraryByIds(params)
        .then(res => {
          if (res.data.status) {
            this.$Message.success('成功删除信息')
            if (this.listData.length - this.chooseListData.length === 0) {
              this.chooseListData = []
              this.$refs.tables.handleReset()
            } else {
              this.chooseListData = []
              this.initListData()
            }
          }
        })
        .catch(() => {})
    },

    // 上传前设定上传参数的侧滑控制
    handleBeforeUpload() {
      this.$refs.beforeModel.openModel()
    },
    // 导出报表参数
    handleExportParams() {
      let params = Object.assign(this.searchParams, {
        limit: 10, // 每页数量
        current: 1, // 当前页数
        status: null, // 状态
        name: null // 名称
      })
      return params
    },

    // 上传侧滑控制
    handleOpenUpload(formInfo) {
      this.uploadParams = {}
      this.$forceUpdate()
      this.$nextTick(() => {
        this.$refs.uploadModel.openModel()
      })
    },
    // 下载参数
    loadExportParams() {
      let params = {}
      return params
    },
    downLoadFile() {
      let params = this.chooseListData[0]
      // 开始导出操作
      this.percent = 0
      const interval = setInterval(() => {
        if (this.percent >= 50) {
          clearInterval(interval)
          // 开始导出
          var exportPath = params.filePath
          if (exportPath === null) return
          exportFileWithName(exportPath, params.fileName)
          this.fileClose()
          return
        }
        this.percent += 10
      }, 100)
    },
    fileClose() {
      const _this = this
      const interval = setInterval(() => {
        if (_this.percent >= 100) {
          clearInterval(interval)
          _this.$Notice.success({
            title: '文件下载成功'
          })
          _this.$Spin.hide()
          return
        }

        _this.percent += 10
      }, 100)
    }
  }
}
</script>

<style lang="less" scoped>
/deep/.text3line {
  display: -webkit-box;
  /* autoprefixer: off */
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 3;
  /* autoprefixer: on */
  overflow: hidden;
  text-overflow: ellipsis;
  margin-top: 8px;
  margin-bottom: 8px;
}
</style>
