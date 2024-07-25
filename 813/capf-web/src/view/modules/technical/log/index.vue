 <!--
  * @description 考核控制-index
  * @author yxm
  * @date 2021-10-19
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
        :exportPath="exportUrl"
        :exportParams="loadExportParams()"
        :border="true"
        :columnControl="true"
        :loading="loading"
        :columns="tableColumnPugins"
        :canSearch="canSearch"
        :canReset="canReset"
        :canSave="canSave"
        :canDelete="canDelete"
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
            <span class="search-tip" >专业技术：</span>
            <Select
                v-model="searchParams.type"
                placeholder="请选择专业技术查询"
                style="width: 200px"
              >
              <Option value="1">发报技术</Option>
              <Option value="2">收报技术</Option>
              <Option value="3">译电技术</Option>
              </Select>
          </div>
          <div class="search-box" >
              <span class="search-tip">开始时间：</span>
              <DatePicker type="date" :clearable = 'false' :confirm = 'true' placeholder="选择开始时间查询" v-model="searchParams.startTime" :options="startTimelimit" @on-change="selStartTime"></DatePicker>
          </div>
          <div class="search-box" >
              <span class="search-tip">结束时间：</span>
              <DatePicker type="date"  :options="endTimelimit"  :clearable = 'false' :confirm = 'true' placeholder="选择结束时间查询" v-model="searchParams.endTime" @on-change="selEndTime"></DatePicker>
            </div>
          <!-- <div class="search-box">
            <span class="search-tip">训练时间：</span>
              <DatePicker type="date" :clearable = 'false' :confirm = 'true' placeholder="选择训练时间查询" v-model="searchParams.startTime" ></DatePicker>
          </div> -->
        </div>
        <div slot="btn-right">
          <Button type="primary" class="search-btn" @click="openBeforeUploadModel()" v-if="canImport" ghost>导入</Button>
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
      <Modal v-model="deleteModel" :title="this.$store.state.base.deleteInfo.title" @on-ok="handleDelete">
        <p>{{this.$store.state.base.deleteInfo.msg}}</p>
      </Modal>
    </div>

    <div slot="drawer">
      <transition name="center-show" mode="in-out">
        <keep-alive include="FormInfo">
          <component
            ref="formModel"
            :is="showComponent"
            :detailsId="chooseListData.length === 1 ? chooseListData[0].id : null"
            :details="chooseListData.length === 1 ? chooseListData[0] : {}"
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
import { initTransmitList } from '@/api/technical/api-modules-transmit.js'
import { OPERATE_LIST } from '@/libs/mixin'
import columnPugins from './index-column'
export default {
  mixins: [OPERATE_LIST],
  components: {
  },
  data() {
    return {
      canReset: true, // 重置
      canSearch: true, // 查询
      canSave: false, // 添加
      canEdit: false, // 编辑
      canDelete: false, // 删除
      canFindByID: true, // id查询
      canImport: false, // 导入
      exportUrl: '',
      uploadURL: 'null',
      acceptType: ['xls', 'xlsx'], // 导入的文件的格式
      uploadParams: null,
      searchParams: { // 查询参数
        limit: 10, // 条数
        current: 1, // 页数
        type: null,
        startTime: null,
        endTime: null // 结束时间
      },
      startTimelimit: {}, // 结束时间限制
      endTimelimit: {} // 开始时间限制
    }
  },
  created() {},
  mounted() {
    this.tableColumnPugins = columnPugins(this)
    this.initListData()
  },
  watch: {
  },
  methods: {
    // 初始化数据表格信息
    initListData() {
      this.loading = true
      if(this.searchParams.startTime) {
        this.searchParams.startTime = this.$moment(this.searchParams.startTime).format('YYYY-MM-DD') + ' 00:00:00'
      }
      if(this.searchParams.endTime) {
        this.searchParams.endTime = this.$moment(this.searchParams.endTime).format('YYYY-MM-DD') + ' 23:59:59'
      }
      initTransmitList(this.searchParams).then(res => {
        if (res.data.status) {
          this.totolCount = res.data.page.totalCount
          var data = res.data.page
          this.listData = data.list
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
    },
    // 导出数据
    loadExportParams() {
      let params = this.searchParams
      return {
        limit: params.limit,
        current: params.current,
        deptId: ''
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
        limit: 10, // 条数
        current: 1, // 页数
        type: null,
        startTime: null,
        endTime: null
      })
      this.startTimelimit = {} // 结束时间限制
      this.endTimelimit = {} // 开始时间限制
      this.dept = []
      this.chooseListData = []
      this.initListData()
    },
    // 上传参数侧滑
    openBeforeUploadModel() {
      this.$refs.uploadModel.openModel()
    },
    // 上传参数侧滑
    openUploadModel(formInfo) {
      this.uploadParams = {}
      this.$forceUpdate()
      this.$nextTick(() => {
        this.$refs.uploadModel.openModel()
      })
    },
    // 确认删除信息
    async handleDelete() {
      // let ids = ''
      // this.chooseListData.forEach(element => {
      //   ids += element.id + ','
      // })
      // ids = ids.substring(0, ids.lastIndexOf(','))
      // let params = {
      //   ids: ids
      // }
      // deleteAccessControlByIds(params).then(res => {
      //   if (res.data.status) {
      //     this.$Message.success('成功删除信息')
      //     if (this.listData.length - this.chooseListData.length === 0) {
      //       this.chooseListData = []
      //       this.$refs.tables.handleReset()
      //     } else {
      //       this.chooseListData = []
      //       this.initListData()
      //     }
      //   } else {
      //     this.$Message.error(res.msg)
      //   }
      // }).catch(() => {
      // })
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
    },
    // 保留n位小数不进位
    interception(num, decimal) {
      num = num.toString()
      let index = num.indexOf('.')
      if (index !== -1) {
        num = num.substring(0, decimal + index + 1)
      } else {
        num = num.substring(0)
      }
      return parseFloat(num).toFixed(decimal)
    }
  }
}
</script>
<style lang="less" scoped>
// /deep/.ivu-select-item{
//   font-size: 13px !important;
// }
</style>
