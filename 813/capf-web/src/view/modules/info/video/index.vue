<!--
 * @description videomanagement- 视频管理表--index
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
        :border="true"
        :columnControl="true"
        :loading="loading"
        :columns="tableColumnPugins"
        :canSearch="canSearch"
        :canReset="canReset"
        :canSave="canSave"
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
            <span class="search-tip">课目类型：</span>
            <Select
              filterable
              :clearable="true"
              v-model="searchParams.type"
              placeholder="选择课目类型查询"
              ref="selectRef"
            >
              <Option value="1" label="理论知识"></Option>
              <!-- <Option value="2" label="专业操作"></Option> -->
            </Select>
          </div>
          <div class="search-box">
            <span class="search-tip">课目名称：</span>
            <Input
              type="text"
              v-model="searchParams.subjectName"
              placeholder="输入课目名称查询"
              :clearable="false"
              :maxlength="20"
              ref="subjectName"
            />
          </div>
          <div class="search-box">
            <span class="search-tip">视频标题：</span>
            <Input
              type="text"
              v-model="searchParams.title"
              placeholder="输入视频标题查询"
              :clearable="false"
              :maxlength="20"
              ref="title"
            />
          </div>
        </div>
        <div slot="btn-right"></div>
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

      <Dialog
        :sysName="sysName"
        :moduleName="moduleName"
        ref="dialogDetails"
        :title="diaTitle"
        :courseUrl="diaPath"
        :isPdf="true"
        :defaultHeight="defaultHeight"
      ></Dialog>
    </div>

    <div slot="drawer">
      <!-- <before-upload
        ref="beforeModel"
        @handle-next="openUploadModel"
        modelTitle="导入数据"
      >
      </before-upload> -->

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
  initVideoManagementList,
  deleteVideoManagementByIds
} from '@/api/info/video/api-modules-videomanagement'
import { OPERATE_LIST } from '@/libs/mixin'
import ColumnPugins from './index-column'
import FormInfo from './operate/form-info.vue'
// import BeforeUpload from './before-upload.vue'
import { supportNormal } from '@/utils'
import { exportFile, exportFileWithName } from '@/api/api-base'
import Dialog from './../../video/dialogVideo'
export default {
  mixins: [OPERATE_LIST],
  components: {
    FormInfo,
    Dialog
    // BeforeUpload
  },
  data() {
    return {
      canReset: this.isAuth('info:video:query'), // 重置
      canSearch: this.isAuth('info:video:query'), // 查询
      canSave: this.isAuth('info:video:add'), // 添加
      canEdit: this.isAuth('info:video:edit'), // 编辑
      canDelete: this.isAuth('info:video:delete'), // 删除
      canDownload: this.isAuth('info:video:download'), // 下载
      canFindByID: true, // id查询
      percent: 0,
      API: {}, // api对象
      searchParams: {
        // 查询参数
        limit: 10, // 每页数量
        current: 1, // 当前页数
        subjectName: null, // 名称
        title: null, // 状态
        type: null
      },
      defaultHeight: 500, // 弹出框默认高度
      diaTitle: null,
      diaPath: null,
      diaFileName: null,
      sysName: null,
      moduleName: null
    }
  },
  computed: {
    documentClientHeight: {
      get() {
        return this.$store.state.common.documentClientHeight
      },
      set(val) {
        this.$store.commit('common/updateDocumentClientHeight', val)
      }
    }
  },
  watch: {
    documentClientHeight: function() {
      this.initDialogHeight()
    }
  },
  mounted() {
    // 禁止右键
    document.oncontextmenu = function () { return true }
    this.tableColumnPugins = ColumnPugins(this)
    // this.searchParams = Object.assign(this.searchParams, FormDataInfo())
    this.initListData()
    this.initDialogHeight()
  },
  methods: {
    initDialogHeight() {
      this.defaultHeight = this.documentClientHeight - 80
    },
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
        initVideoManagementList(this.searchParams)
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
        subjectName: null, // 名称
        title: null, // 状态
        type: null
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
      deleteVideoManagementByIds(params)
        .then(res => {
          if (res.data.status) {
            this.$Message.success('成功删除信息')
            this.chooseListData = []
            this.initListData()
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
        subjectName: null, // 名称
        title: null, // 状态
        type: null
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
    },
    //查看文件
    scanFile() {
      this.diaTitle = this.chooseListData[0].fileName
      this.diaPath = this.chooseListData[0].filePath
      this.diaFileName = this.chooseListData[0].fileName
      this.sysName = '文件下载'
      this.moduleName = ''
      this.$refs.dialogDetails.open()
    }
  }
}
</script>

<style lang="less" scoped></style>
