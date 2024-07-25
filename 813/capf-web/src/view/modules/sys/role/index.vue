 <!--
  * @description 角色管理-index
  * @author yxm
  * @date 2021-10-19
 -->
<template lang="html">
  <container class="full-container">
    <div slot="content">
      <Tables
        ref="tables"
        v-if="tableColumnPugins != null"
        searchable
        search-place="top"
        v-model="listData"
        class="table-wrapper"
        :border="true"
        :columnControl="true"
        :loading="loading"
        :columns="tableColumnPugins"
        :canSave="canSave"
        :canReset="canReset"
        :canSearch="canSearch"
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
          <span class="search-tip" >角色名称：</span>
          <Input
            type="text"
            v-model="searchParams.roleName"
            placeholder="输入角色名称查询"
            :clearable="false"
            :maxlength="10"
            ref="roleName"
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
      <Modal v-model="deleteModel" :title="this.$store.state.base.deleteInfo.title" @on-ok="handleDelete">
        <p>{{this.$store.state.base.deleteInfo.msg}}</p>
      </Modal>

      <!-- List列表弹窗操作页面 -->
      <transition name="center-show" mode="in-out">
        <keep-alive include="FormInfo">
          <component
            ref="formModel"
            :is="showComponent"
            :detailsId="isOperate ? chooseListData.length === 1? chooseListData[0].id + '': null: null"
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

    <div slot="drawer"></div>
  </container>
</template>

<script>
import { initRoleList, deleteRoleByIds } from '@/api/sys/api-modules-role'
import { OPERATE_LIST } from '@/libs/mixin'
import ColumnPugins from './index-column'
import FormInfo from './operate/form-info.vue'
import { supportNormal } from '@/utils'
// import FormDataInfo from './operate/form'
export default {
  mixins: [OPERATE_LIST],
  components: {
    FormInfo
  },
  data() {
    return {
      canSave: true, // 添加
      canEdit: true, // 编辑
      canDelete: true, // 删除

      canReset: true, // 重置
      canSearch: true, // 查询
      // canReset: this.isAuth('sys:role:query'), // 重置
      // canSearch: this.isAuth('sys:role:query'), // 查询
      // canSave: this.isAuth('sys:role:add'), // 添加
      // canEdit: this.isAuth('sys:role:edit'), // 编辑
      // canDelete: this.isAuth('sys:role:delete'), // 删除
      canFindByID: true, // id查询
      exportPath: null, // 导出EXCEL地址
      downloadURL: null, // 下载地址
      uploadURL: null, // 上传地址
      uploadParams: null, // 上传参数
      searchParams: {// 查询参数
        limit: 10, // 每页数量
        current: 1, // 当前页数
        roleName: null
      }
    }
  },
  mounted() {
    this.tableColumnPugins = ColumnPugins(this)
    this.initListData()
  },
  methods: {
    // 初始化数据表格
    initListData() {
      this.loading = true
      var validation = supportNormal(this.searchParams)
      if(!validation.isPass) {
        this.$Message.error(validation.message)
      }else{
        this.loading = true
        initRoleList(this.searchParams).then(res => {
          if (res.data.status) {
            this.totolCount = res.data.data.totalCount
            var data = res.data.data.list
            this.listData = data
            // this.$forceUpdate()
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
        limit: 10, // 一页多少条
        current: 1, // 第几页
        roleName: null
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
      deleteRoleByIds(params).then(res => {
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
      }).catch(() => {
      })
    },
    // 上传前设定上传参数的侧滑控制
    handleBeforeUpload() {
      this.$refs.beforeModel.openModel()
    },
    // 导出报表参数
    handleExportParams() {
      let params = Object.assign(this.searchParams, {
        limit: 10, // 一页多少条
        current: 1, // 第几页
        roleName: null
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
    }
  }
}
</script>
<style lang="less" scoped></style>
