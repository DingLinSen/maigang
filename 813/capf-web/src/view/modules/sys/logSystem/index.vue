 <!-- /**
  * @description 系统日志-index
  * @author yxm
  * @date 2021-10-19
  */ -->
<template lang="html">
  <container class="full-container">
    <div slot="content">
      <!-- 列表主体对象 -->
      <Tables
        ref="tables"
        v-if="tableColumnPugins != null"
        searchable
        search-place="top"
        v-model="listData"
        class="table-wrapper"
        :exportPath="API.LIST_EXPORT_URL"
        :exportParams="handleExportParams()"
        :border="true"
        :columnControl="true"
        :loading="loading"
        :columns="tableColumnPugins"
        :canSave="canSave"
        :canDelete="canDelete"
        :canEdit="canEdit"
        :canSearch="canSearch"
        :canReset="canReset"
        @on-sort-change="onSortChange"
        @btnInsert="createDrawerChange"
        @btnUpdate="updateDrawerChange"
        @btnDelete="btnDeleteBallast"
        @btnSearch="reloadList"
        @handleReset="handleResearch"
        @on-selection-change="selectChange"
      >
        <!-- 条件筛选模块 -->
        <div slot="search" style="min-width: 60%">
          <Row :gutter="16" index="">
            <Col span="8">
              <div class="search-box" >
                <span class="search-tip mar-lft-10">操作类型：</span>
                <Select
                  :clearable="true"
                  v-model="searchParams.methodDescribe"
                  placeholder="选择操作类型查询"
                >
                  <Option value="新增" key="insert-level">新增</Option>
                  <Option value="编辑" key="edit-level">编辑</Option>
                  <Option value="删除" key="delete-level">删除</Option>
                  <Option value="查询" key="search-level">查询</Option>
                  <Option value="下载" key="download-level">下载</Option>
                  <Option value="导出" key="export-level">导出</Option>
                  <Option value="导入" key="import-level">导入</Option>
                </Select>
              </div>
            </Col>
            <Col span="8">
            <div class="search-box" >
              <span class="search-tip">开始时间：</span>
              <DatePicker type="date" :clearable = 'false' :confirm = 'true' placeholder="选择开始时间查询" v-model="searchParams.startTime" :options="startTimelimit" @on-change="selStartTime"></DatePicker>
            </div>
          </Col>
          <Col span="8">
            <div class="search-box" >
              <span class="search-tip">结束时间：</span>
              <DatePicker type="date"  :options="endTimelimit"  :clearable = 'false' :confirm = 'true' placeholder="选择结束时间查询" v-model="searchParams.endTime" @on-change="selEndTime"></DatePicker>
            </div>
          </Col>
          </Row>
        </div>

        <!-- 右侧按钮集群 -->
        <div slot="btn-right"></div>

        <!-- 列表分页 -->
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
      <Modal v-model="deleteModel" :title="this.$store.state.base.deleteInfo.title" @on-ok="handleDelete">
        <p>{{this.$store.state.base.deleteInfo.msg}}</p>
      </Modal>
    </div>

    <!-- 附加操作空间 -->
    <div slot="drawer">
      <!-- List列表上传信息页面 -->
      <upload-model
        ref="uploadModel"
        v-if="API.LIST_DOWNLOAD_URL && API.LIST_UPLOAD_URL"
        :downloadURL="API.LIST_DOWNLOAD_URL"
        :uploadURL="API.LIST_UPLOAD_URL"
        :uploadParams="uploadParams"
        :acceptType="['html']"
        @handleUpload="handleOperate"
        modelTitle="上传系统日志表信息"
      ></upload-model>

      <!-- List列表弹窗操作页面 -->
      <transition name="center-show" mode="in-out">
        <keep-alive include="FormInfo">
          <component
            :is="showComponent"
            :detailsId="chooseListData.length === 1 ? chooseListData[0].id + '' : null"
            :isOperate="isOperate"
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
import { initLogList, deleteLogByIds, transListParams } from '@/api/sys/api-modules-log-system'
import { initMenuList } from '@/api/sys/api-modules-menu'

import { API_LOG } from '@/api/sys/api-address-sys'
import { OPERATE_LIST } from '@/libs/mixin'

import ColumnPugins from './index-column'
import FormInfo from './operate/form-info.vue'
import FormDataInfo from './operate/form'
export default {
  mixins: [OPERATE_LIST],
  components: {
    FormInfo
  },
  data() {
    return {
      API: {}, // API对象
      canSearch: true, // 查询/查看权限
      canReset: true, // 条件重置权限
      canSave: false, // 添加权限
      canEdit: false, // 编辑权限
      canDelete: false, // 删除权限
      uploadParams: null, // 附加文件上传参数
      searchParams: { // 查询参数
        // operationModule: null,
        methodDescribe: null, // 操作类型
        startTime: null, // 开始时间
        endTime: null, // 结束时间
        limit: 10, // 每页数量
        current: 1 // 当前页数
      },
      searchAllMenuList: [], // 全部菜单数据列表
      startTimelimit: {}, // 结束时间限制
      endTimelimit: {} // 开始时间限制
    }
  },
  mounted() {
    this.API = API_LOG() // 实例化API对象
    this.tableColumnPugins = ColumnPugins(this)
    this.searchParams = Object.assign(FormDataInfo(), this.searchParams)
    this.initListData()
    this.initSearchMenuList()
  },
  methods: {
    // 获取全部登陆的用户的菜单列表
    initSearchMenuList() {
      initMenuList()
        .then(({ data }) => {
          if (data.status) {
            const dataItems = data.data
            this.searchAllMenuList = dataItems.filter(
              (item, index) => item.url
            )
          }
        })
        .catch(() => {
          this.loading = false
        })
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
    handleOperate() {
    },
    // 导出报表参数
    handleExportParams() {
      return Object.assign(transListParams(this.searchParams), {
        methodDescribe: null, // 操作类型
        startTime: null, // 开始时间
        endTime: null, // 结束时间
        limit: 10, // 每页数量
        current: 1 // 当前页数
      })
    },
    // 初始化数据表格
    initListData() {
      this.loading = true
      if(this.searchParams.startTime) {
        this.searchParams.startTime = this.$moment(this.searchParams.startTime).format('YYYY-MM-DD') + ' 00:00:00'
      }
      if(this.searchParams.endTime) {
        this.searchParams.endTime = this.$moment(this.searchParams.endTime).format('YYYY-MM-DD') + ' 23:59:59'
      }
      initLogList(this.searchParams).then(({ data }) => {
        if (data.status) {
          this.listData = data.data.list
          this.totolCount = data.data.totalCount
          this.$forceUpdate()
          this.$nextTick(() => {
            this.loading = false
          })
        }else{
          this.loading = false
          this.listData = []
        }
      }).catch(() => {
        this.loading = false
      })
      // }
    },
    // 确认删除列表信息
    async handleDelete() {
      let ids = []
      this.chooseListData.forEach(element => {
        ids.push(element.id)
      })

      deleteLogByIds({ids: ids.join(',')}).then(res => {
        if (res.status === true) {
          this.$Message.success('成功删除信息')
          if (this.listData.length - this.chooseListData.length === 0) {
            this.chooseListData = []
            this.$refs.tables.handleReset()
          } else {
            this.chooseListData = []
            this.initListData()
          }
        }
      }).catch(() => {
      })
    },
    // 重置条件查询
    handleResearch() {
      this.searchParams = {
        // 列表数据查询参数
        // operationModule: null,
        methodDescribe: null, // 操作类型
        startTime: null, // 开始时间
        endTime: null, // 结束时间
        limit: 10, // 每页数量
        current: 1 // 当前页数
      }
      this.startTimelimit = {} // 结束时间限制
      this.endTimelimit = {} // 开始时间限制
      this.chooseListData = []
      this.initListData()
    },
    // 选择开始时间
    selStartTime(e) {
      if(this.searchParams.startTime) {
        this.endTimelimit = {
          disabledDate (date) {
            return date && date.valueOf() < new Date(e).valueOf() - 86400000
          }
        }
      }else{
        this.endTimelimit = {}
      }
    },
    // 选择结束时间
    selEndTime(e) {
      if(this.searchParams.endTime) {
        this.startTimelimit = {
          disabledDate (date) {
            return date && date.valueOf() > new Date(e).valueOf()
          }
        }
      }else{
        this.startTimelimit = {}
      }
    }
  }
}
</script>
