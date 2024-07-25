 <!--
  * @description 用户管理-index
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
            <span class="search-tip" style="min-width: 44px">角色：</span>
            <Select
              filterable
              :clearable="true"
              v-model="searchParams.roleId"
              placeholder="选择角色查询"
              ref="selectRef"
            >
              <Option v-for="item in roleList" :value="item.id" :key="item.id" :label="item.roleName"></Option>
            </Select>
          </div>
          <div class="search-box">
            <span class="search-tip" >人员名称：</span>
            <Input
              type="text"
              v-model="searchParams.name"
              placeholder="输入人员名称查询"
              :clearable="false"
              :maxlength="6"
              ref="name"
            />
          </div>
          <div class="search-box">
            <span class="search-tip" style="min-width: 57px">手机号：</span>
            <Input
              type="text"
              v-model="searchParams.mobile"
              placeholder="输入手机号查询"
              :clearable="false"
              :maxlength="11"
              ref="mobile"
            />
          </div>
          <!-- <Row :gutter="16" index="">
            <Col span="8">
              <div class="search-box" >
                <span class="search-tip" style="min-width: 44px">角色：</span>
                <Select
                  filterable
                  :clearable="true"
                  v-model="searchParams.roleId"
                  placeholder="选择角色查询"
                  ref="selectRef"
                >
                  <Option v-for="item in roleList" :value="item.id" :key="item.id" :label="item.roleName"></Option>
                </Select>
              </div>
            </Col>
            <Col span="8">
              <div class="search-box" >
                <span class="search-tip" >人员名称：</span>
                <Input
                  type="text"
                  v-model="searchParams.name"
                  placeholder="输入人员名称查询"
                  :clearable="false"
                  :maxlength="6"
                  ref="name"
                />
              </div>
              @keyup.enter.native="searchByName"
            </Col>
            <Col span="8">
              <div class="search-box" >
                <span class="search-tip" style="min-width: 57px">手机号：</span>
                <Input
                  type="text"
                  v-model="searchParams.mobile"
                  placeholder="输入手机号查询"
                  :clearable="false"
                  :maxlength="11"
                  ref="mobile"
                />
              </div>
            </Col>
          </Row> -->
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
      <!-- 启用弹框 -->
      <Modal v-model="openModel" :title="this.$store.state.base.openStatusInfo.title" @on-ok="handleOpen1">
        <p>{{this.$store.state.base.openStatusInfo.msg}}</p>
      </Modal>
      <!-- 禁用弹框 -->
      <Modal v-model="stopModel" :title="this.$store.state.base.stopStatusInfo.title" @on-ok="handleStop1">
        <p>{{this.$store.state.base.stopStatusInfo.msg}}</p>
      </Modal>
    </div>

    <div slot="drawer">
      <before-upload
        ref="beforeModel"
        @handle-next="openUploadModel"
        modelTitle="导入用户数据"
      >
      </before-upload>
      <upload-model
        ref="uploadModel"
        uploadTip
        v-if="uploadURL"
        :downloadURL="downloadURL"
        :uploadURL="uploadURL"
        :uploadParams="uploadParams"
        :acceptType="acceptType"
        :routerTitle="this.$route.meta.title"
        @handleUpload="operateSuccess"
        modelTitle="导入用户数据"
      >
      </upload-model>

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
import { initUserList, deleteUserByIds, operateUserStatus } from '@/api/sys/api-modules-user'
import { initAllRoleList } from '@/api/sys/api-modules-role'
import { OPERATE_LIST } from '@/libs/mixin'
import FormInfo from './operate/form-info.vue'
import columnPugins from './index-column'
import BeforeUpload from './before-upload.vue'
import { sortByKey, supportNormal } from '@/utils'
export default {
  mixins: [OPERATE_LIST],
  components: {
    FormInfo,
    BeforeUpload
  },
  data() {
    return {
      canReset: this.isAuth('sys:user:query'), // 重置
      canSearch: this.isAuth('sys:user:query'), // 查询
      canSave: this.isAuth('sys:user:add'), // 添加
      canEdit: this.isAuth('sys:user:edit'), // 编辑
      canDelete: this.isAuth('sys:user:delete'), // 删除
      canFindByID: true, // id查询
      canPassword: true, // 密码
      canEnable: true, // 启用禁用
      exportUrl: null, // 用户导出
      downloadURL: '人员导入模版.xls', // 下载模板
      canImport: false, // 导入
      uploadURL: 'null',
      acceptType: ['xls', 'xlsx'], // 导入的文件的格式
      uploadParams: null,
      searchParams: { // 查询参数
        limit: 10, // 条数
        current: 1, // 页数
        roleId: null, // 角色
        name: null, // 姓名
        mobile: null // 手机
      },
      roleList: [], // 角色数组
      openModel: false, // 启用操作弹框
      stopModel: false, // 禁用弹框操作
      statusParams: { // 启用、禁用传递的参数
        id: null,
        status: null,
        isOperate: true
      }
    }
  },
  created() {},
  mounted() {
    this.tableColumnPugins = columnPugins(this)
    this.initRoleList()
    this.initListData()
  },
  computed: {
  },
  watch: {
  },
  methods: {
    // 初始化角色
    initRoleList() {
      initAllRoleList().then((res) => {
        if(res.data.status) {
          this.roleList = sortByKey(res.data.data, 'orderNum')
        }
      }).catch(() => {
      })
    },
    // 初始化数据表格信息
    initListData() {
      var validation = supportNormal(this.searchParams)
      if(!validation.isPass) {
        this.$Message.error(validation.message)
      }else{
        this.loading = true
        initUserList(validation.searchParams).then(res => {
          if (res.data.status) {
            this.totolCount = res.data.data.totalCount
            var data = res.data.data
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
      }
    },
    // 回车监听姓名查询
    searchByName() {
      this.initListData()
    },
    // 导出数据
    loadExportParams() {
      let params = this.searchParams
      return {
        limit: params.limit,
        current: params.current
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
        roleId: null, // 角色
        name: null, // 姓名
        mobile: null // 手机
      })
      if(this.$refs.selectRef) {
        this.$refs.selectRef.setQuery(null)
      }
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
      let ids = ''
      this.chooseListData.forEach(element => {
        ids += element.id + ','
      })
      ids = ids.substring(0, ids.lastIndexOf(','))
      let params = {
        ids: ids
      }
      deleteUserByIds(params).then(res => {
        if (res.data.status) {
          this.$Message.success('成功删除信息')
          if (this.listData.length - this.chooseListData.length === 0) {
            this.chooseListData = []
            this.$refs.tables.handleReset()
          } else {
            this.chooseListData = []
            this.initListData()
          }
        } else {
          this.$Message.error(res.msg)
        }
      }).catch(() => {
      })
    },
    // 启用操作 启用0 停用2 删除1
    handleOpen(index, row) {
      this.openModel = true
      this.statusParams = {
        id: this.chooseListData[0].id,
        status: 0
      }
    },
    // 确认启用操作
    handleOpen1() {
      operateUserStatus(this.statusParams).then(({ data }) => {
        if (data.status) {
          this.$Message.success('成功启用信息')
          this.chooseListData = []
          this.statusParams = {}
          this.initListData()
        }
      }).catch(() => {
      })
    },
    // 禁用操作 启用0 停用2 删除1
    handleStop(index, row) {
      this.stopModel = true
      this.statusParams = {
        id: this.chooseListData[0].id,
        status: 2
      }
    },
    // 确认禁用
    handleStop1() {
      operateUserStatus(this.statusParams).then(({ data }) => {
        if (data.status) {
          this.$Message.success('成功禁用信息')
          this.chooseListData = []
          this.statusParams = {}
          this.initListData()
        }
      }).catch(() => {
      })
    },
    // 搜索词改变时触发
    queryChange() {
      if(this.searchParams.roleId) {
        this.searchParams.roleId = this.searchParams.roleId.trim()
      }
    }
  }
}
</script>
<style lang="less" scoped>
// /deep/.ivu-select-item{
//   font-size: 13px !important;
// }
</style>
