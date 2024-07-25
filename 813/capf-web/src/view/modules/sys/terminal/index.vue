<!--
 * @description Terminal- 系统管理-终端管理--index
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
            <span class="search-tip">ip地址：</span>
            <Input
              type="text"
              v-model="searchParams.ipAddress"
              placeholder="输入ip地址查询"
              :clearable="true"
              :maxlength="20"
              ref="ipAddress"
            />
          </div>
          <div class="search-box">
            <span class="search-tip" >所属单位：</span>
             <Cascader :data="deptList" v-model="dept" placeholder="请选择所属单位"
                :disabled="isSee"  @on-change="selDept" style="width:100%" :clearable="false" change-on-select></Cascader>
          </div>
          <div class="search-box">
            <span class="search-tip" >位置信息：</span>
            <Input
              type="text"
              v-model="searchParams.location"
              placeholder="输入位置信息查询"
              :clearable="true"
              :maxlength="20"
              ref="location"
            />
          </div>
        </div>
        <div slot="btn-right">
          <Button type="info" class="search-btn" @click="openBeforeUploadModel()" v-if="canImport">导入</Button>
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
      <!-- 启用弹框 -->
      <Modal v-model="statusOpenModel" :title="this.$store.state.base.openStatusInfo.title" @on-ok="handleOpen1">
        <p>{{this.$store.state.base.openStatusInfo.msg}}</p>
      </Modal>
      <!-- 禁用弹框 -->
      <Modal v-model="statusStopModel" :title="this.$store.state.base.stopStatusInfo.title" @on-ok="handleStop1">
        <p>{{this.$store.state.base.stopStatusInfo.msg}}</p>
      </Modal>
    </div>

    <div slot="drawer">
      <transition name="center-show" mode="in-out">
        <keep-alive include="FormInfo">
          <component
            ref="formModel"
            :is="showComponent"
            :detailsId="chooseListData.length === 1 ? chooseListData[0].id : null"
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
import { initTerminalList, deleteTerminalByIds } from '@/api/sys/terminal/api-modules-terminal'
import { OPERATE_LIST } from '@/libs/mixin'
import ColumnPugins from './index-column'
import FormInfo from './operate/form-info.vue'
import { initAllDeptList } from '@/api/sys/api-modules-dept'
import { supportNormal, treeDataTranslate } from '@/utils'
export default {
  mixins: [OPERATE_LIST],
  components: {
    FormInfo
  },
  data() {
    return {
      canReset: this.isAuth('sys:terminal:query'), // 重置
      canSearch: this.isAuth('sys:terminal:query'), // 查询
      canSave: this.isAuth('sys:terminal:add'), // 添加
      canEdit: this.isAuth('sys:terminal:edit'), // 编辑
      canDelete: this.isAuth('sys:terminal:delete'), // 删除
      canFindByID: true, // id查询
      canImport: false, // 能否导入
      exportPath: null, // 导出EXCEL地址
      downloadURL: null, // 下载地址
      uploadURL: null, // 上传地址
      exportUrl: null, // 导出地址
      uploadParams: null, // 上传参数
      statusOpenModel: false, // 状态弹框
      statusStopModel: false, // 状态弹框
      dept: [],
      deptList: [],
      API: {}, // api对象
      searchParams: {// 查询参数
        limit: 10, // 每页数量
        current: 1, // 当前页数
        ipAddress: null,
        deptId: null,
        location: null
      }
    }
  },
  mounted() {
    this.tableColumnPugins = ColumnPugins(this)
    this.initSelect()
    // this.searchParams = Object.assign(this.searchParams, FormDataInfo())
    this.initListData()
  },
  methods: {
    initSelect() {
      initAllDeptList()
        .then(res => {
          if (res.data.status) {
            var data = res.data.data
            // 0正常 1停用
            // let deptList = data.filter(item => item.status === '0')
            let deptList = []
            data.forEach(item => {
              if(item.status === '0') {
                deptList.push({
                  ...item,
                  value: item.deptId,
                  label: item.deptName
                })
              }
            })
            this.deptList = treeDataTranslate(deptList, 'deptId')
          } else {
          }
        })
        .catch(() => {
          this.loading = false
        })
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
      if(!validation.isPass) {
        let message = validation.message
        this.$Message.error(message)
      }else{
        this.loading = true
        initTerminalList(this.searchParams).then(res => {
          if (res.data.status) {
            this.totolCount = res.data.page.totalCount
            var data = res.data.page.list
            this.listData = data
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
      this.dept = []
      this.searchParams = Object.assign(this.searchParams, {
        limit: 10, // 每页数量
        current: 1, // 当前页数
        ipAddress: null,
        deptId: null,
        location: null
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
      deleteTerminalByIds(params).then(res => {
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

    },
    // 启用操作
    handleOpen1() {

    },
    // 停用操作
    handleStop1() {

    },
    // 选择部门
    selDept(value) {
      if(value && value.length > 0) {
        this.searchParams.deptId = value[value.length - 1]
      }else if(value.length === 0) {
        this.searchParams.deptId = ''
      }else{
        this.searchParams.deptId = ''
      }
    }
  }
}
</script>

<style lang="less" scoped></style>
