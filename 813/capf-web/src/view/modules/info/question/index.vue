<!--
 * @description videomanagement- 题库管理表--index
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
            <span class="search-tip">课目类型：</span>
            <Select
              filterable
              :clearable="true"
              v-model="searchParams.subjectType"
              placeholder="选择课目类型查询"
              ref="selectRef"
            >
              <Option value="1" label="理论知识"></Option>
              <!-- <Option value="2" label="专业操作"></Option> -->
            </Select>
          </div>
          <div class="search-box">
            <span class="search-tip">题目类型：</span>
            <Select
              filterable
              :clearable="true"
              v-model="searchParams.answerType"
              placeholder="选择题目类型查询"
              ref="selectRef0"
            >
              <Option value="1" label="单选"></Option>
              <Option value="2" label="多选"></Option>
              <Option value="3" label="判断"></Option>
              <Option value="4" label="填空"></Option>
              <Option value="5" label="简答"></Option>
            </Select>
          </div>
          <div class="search-box">
            <span class="search-tip" style="min-width:45px;">题目：</span>
            <Input
              type="text"
              v-model="searchParams.question"
              placeholder="输入题目查询"
              :clearable="false"
              :maxlength="100"
              ref="question"
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
        modelTitle="导入题库管理信息"
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
  initTitleManagementList,
  deleteTitleManagementByIds
} from '@/api/info/question/api-modules-titlemanagement'
import { API_TITLEMANAGEMENT } from '@/api/info/question/api-address-titlemanagement'
import { OPERATE_LIST } from '@/libs/mixin'
import ColumnPugins from './index-column'
import FormInfo from './operate/form-info.vue'
// import BeforeUpload from './before-upload.vue'
import { supportNormal } from '@/utils'

export default {
  mixins: [OPERATE_LIST],
  components: {
    FormInfo
    // BeforeUpload
  },
  data() {
    return {
      canReset: this.isAuth('info:question:query'), // 重置
      canSearch: this.isAuth('info:question:query'), // 查询
      canSave: this.isAuth('info:question:add'), // 添加
      canEdit: this.isAuth('info:question:edit'), // 编辑
      canDelete: this.isAuth('info:question:delete'), // 删除
      canImport: this.isAuth('info:question:import'), // 能否导入
      canExport: this.isAuth('info:question:export'), // 导出
      canFindByID: true, // id查询
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
        question: null, // 名称
        answerType: null, // 状态
        subjectType: null
      }
    }
  },
  mounted() {
    this.API = API_TITLEMANAGEMENT()
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
        initTitleManagementList(this.searchParams)
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
        question: null, // 名称
        answerType: null, // 状态
        subjectType: null
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
      deleteTitleManagementByIds(params)
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
        question: null, // 名称
        answerType: null, // 状态
        subjectType: null
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
    }
  }
}
</script>

<style lang="less" scoped></style>
