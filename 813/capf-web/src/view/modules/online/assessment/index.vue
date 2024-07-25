<!--
 * @description videomanagement- 考核管理表--index
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
            <span class="search-tip">考试名称：</span>
            <Input
              type="text"
              v-model="searchParams.examinationName"
              placeholder="输入考试名称查询"
              :clearable="false"
              :maxlength="200"
              ref="question"
            />
          </div>
          <div class="search-box">
            <span class="search-tip">考试类型：</span>
            <Select
              filterable
              :clearable="true"
              v-model="searchParams.type"
              placeholder="选择考试类型查询"
              ref="selectRef0"
            >
              <Option value="1" label="结业考核初考"></Option>
              <Option value="2" label="结业考核补考"></Option>
              <Option value="3" label="季度考核"></Option>
              <Option value="4" label="抽考"></Option>
            </Select>
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
          <Button
            type="primary"
            class="search-btn"
            ghost
            @click="exportTestPaper()"
            v-if="canExport"
            :disabled="percent > 0 && percent !== 100"
            >导出</Button
          >
          <div
            v-show="percent > 0 && percent !== 100"
            style="height: 32px; display: inline-block"
          >
            <Progress vertical :percent="percent" />
          </div>
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
    </div>
    <div slot="drawer">
      <transition name="center-show" mode="in-out">
        <ControlDetails
          v-if="controlDetailsModel"
          ref="controlDetailsModel"
          :detailsId="chooseListData.length === 1 ? chooseListData[0].id : null"
          :details="chooseListData.length === 1 ? chooseListData[0] : {}"
          @operateSuccess="operateSuccess"
          @closeDrawer="closeDrawer"
          @close="closeComponent"
          @error="error()"
        >
        </ControlDetails>
      </transition>
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
        modelTitle="导入试卷"
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
  initAssessmentManagementList,
  deleteAssessmentManagementByIds
} from '@/api/online/assessment/api-modules-assessment'
import { API_ASSESSMENTMANAGEMENT } from '@/api/online/assessment/api-address-assessment'
import { OPERATE_LIST } from '@/libs/mixin'
import ColumnPugins from './index-column'
import FormInfo from './operate/form-info.vue'
import { supportNormal } from '@/utils'
import { exportFile } from '@/api/api-base'
import ControlDetails from './operate/controlDetails-info'

export default {
  mixins: [OPERATE_LIST],
  components: {
    FormInfo,
    ControlDetails
    // BeforeUpload
  },
  data() {
    return {
      canReset: this.isAuth('online:assessment:query'), // 重置
      canSearch: this.isAuth('online:assessment:query'), // 查询
      canSave: this.isAuth('online:assessment:add'), // 添加
      canEdit: this.isAuth('online:assessment:edit'), // 编辑
      canExport: this.isAuth('online:assessment:export'), // 导出
      canImport: false,
      canFindByID: true, // id查询
      percent: 0,
      exportPath: null, // 导出EXCEL地址
      // downloadURL: null, // 下载地址
      // uploadURL: null, // 上传地址
      // exportUrl: null, // 导出地址
      uploadParams: null, // 上传参数
      API: {}, // api对象
      searchParams: {
        // 查询参数
        limit: 10, // 每页数量
        current: 1, // 当前页数
        examinationName: null, // 考试名称
        type: '' // 考试类型
        // paperType: '10',
        // paperNo: null
      },
      controlDetailsModel: false
    }
  },
  mounted() {
    this.API = API_ASSESSMENTMANAGEMENT()
    this.exportPath = API_ASSESSMENTMANAGEMENT().LIST_EXPORT_URL
    // this.downloadURL = 'information/titleManagement/downloadTemplate'
    // this.uploadURL = 'information/titleManagement/importTable'
    // this.exportUrl = 'information/titleManagement/export'
    this.tableColumnPugins = ColumnPugins(this)
    // this.searchParams = Object.assign(this.searchParams, FormDataInfo())
    this.initListData()
  },
  methods: {
    // 初始化数据表格
    initListData() {
      var validation = supportNormal(this.searchParams)
      if (!validation.isPass) {
        let message = validation.message
        this.$Message.error(message)
      } else {
        this.loading = true
        initAssessmentManagementList(this.searchParams)
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
      this.chooseListData = []
      if (!formData.isOperate) {
        this.$refs.tables.handleReset()
        return
      }
      this.initListData()
    },

    // 重置条件查询
    handleResearch() {
      this.searchParams = Object.assign(this.searchParams, {
        limit: 10, // 每页数量
        current: 1, // 当前页数
        type: '',
        examinationName: null
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
      deleteAssessmentManagementByIds(params)
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
        type: '',
        examinationName: null
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
    //导出试卷
    exportTestPaper() {
      // if (this.chooseListData.length === 0) {
      //   this.$Message.warning('请先选择需要导出的数据')
      //   return
      // }

      const _this = this
      _this.percent = 0
      const interval = setInterval(() => {
        if (_this.percent >= 50) {
          clearInterval(interval)
          // 开始导出
          _this.finishExport()
          return
        }
        _this.percent += 10
      }, 100)
    },
    async finishExport() {
      // 开始导出操作
      if (this.exportPath === null) return
      let params = ''
      if (this.chooseListData.length > 0) {
        let ids = ''
        this.chooseListData.forEach(element => {
          ids += element.id + ','
        })
        ids = ids.substring(0, ids.lastIndexOf(','))
        params = params + '?ids=' + ids
      }
      await exportFile(this.exportPath + params)
      await this.close()
    },
    close() {
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
    controlDetails() {
      this.controlDetailsModel = true
    },
    closeDrawer(value) {
      this.controlDetailsModel = false
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
