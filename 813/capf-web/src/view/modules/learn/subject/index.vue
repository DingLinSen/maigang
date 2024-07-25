<!--
 * @description subjectlearn- 课目学习主表--index
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
          <div class="search-box" v-if="level === 4">
            <span class="search-tip">课目名称：</span>
            <Input
              type="text"
              v-model="searchParams.subjectName"
              placeholder="输入课目名称查询"
              :clearable="true"
              :maxlength="15"
              ref="subjectName"
            />
          </div>
           <div class="search-box" v-if="level === 4">
            <span class="search-tip">任务名称：</span>
            <Input
              type="text"
              v-model="searchParams.taskName"
              placeholder="输入任务名称查询"
              :clearable="true"
              :maxlength="15"
              ref="name"
            />
          </div>
          <!--<div class="search-box">
            <span class="search-tip">资料内容：</span>
            <Input
              type="text"
              v-model="searchParams.name"
              placeholder="输入资料内容查询"
              :clearable="true"
              :maxlength="15"
              ref="name"
            />
          </div> -->
        </div>
        <div slot="btn-right">
          <Button type="primary" ghost class="search-btn" @click="openBeforeUploadModel()" v-if="canImport">导入</Button>
          <Button type="primary" ghost class="search-btn" @click="openDrawer(1)" v-if="level == 4">学习日志</Button>
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
        <keep-alive include="logModel">
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
    <div slot="drawer">
      <transition name="center-show" mode="in-out">
        <Log
          v-if="logModel"
          ref="logModel"
          :detailsId="chooseListData.length === 1 ? chooseListData[0].id : null"
          :routerTitle="this.$route.meta.title"
          @operateSuccess="operateSuccess"
          @closeDrawer="closeDrawer"
          @close="closeComponent"
          @error="error()"
        >
        </Log>
      </transition>
    </div>
    <div slot="drawer">
      <transition name="center-show" mode="in-out">
        <Details
          v-if="detailsModel"
          ref="detailsModel"
          :details="chooseListData.length === 1 ? chooseListData[0] : {}"
          :level="level"
          :routerTitle="this.$route.meta.title"
          @operateSuccess="operateSuccess"
          @closeDrawer="closeDrawer"
          @close="closeComponent"
          @error="error()"
        >
        </Details>
      </transition>
    </div>
    <div slot="drawer">
      <transition name="center-show" mode="in-out">
        <Learn
          v-if="learnModel"
          ref="learnModel"
          :details="chooseListData.length === 1 ? chooseListData[0] : {}"
          :routerTitle="this.$route.meta.title"
          @operateSuccess="operateSuccess"
          @closeDrawer="closeDrawer"
          @close="closeComponent"
          @error="error()"
        >
        </Learn>
      </transition>
    </div>
  </container>
</template>
<script>
import { initSubjectlearnList, deleteSubjectlearnByIds } from '@/api/learn/api-modules-subjectlearn.js'
import { OPERATE_LIST } from '@/libs/mixin'
import ColumnPugins from './index-column'
import ColumnPuginsST from './index-column-st' // 省厅管理员、市总队管理员
import ColumnPuginsQX from './index-column-qx' // 区、县支队管理员
import FormInfo from './operate/form-info.vue'
import Log from './operate/log.vue'
import Details from './operate/details.vue'
import Learn from './operate/learn.vue'
import { supportNormal } from '@/utils'
export default {
  mixins: [OPERATE_LIST],
  components: {
    FormInfo,
    Log,
    Details,
    Learn
  },
  data() {
    return {
      canSearch: false, // 查询
      canReset: false, // 重置
      canSave: false, // 添加
      canEdit: false, // 编辑
      canDelete: false, // 删除
      canFindByID: true, // id查询
      canLearn: true, // 学习
      canImport: false, // 能否导入
      exportPath: null, // 导出EXCEL地址
      downloadURL: null, // 下载地址
      uploadURL: null, // 上传地址
      exportUrl: null, // 导出地址
      uploadParams: null, // 上传参数
      statusOpenModel: false, // 状态弹框
      statusStopModel: false, // 状态弹框
      API: {}, // api对象
      searchParams: {// 查询参数
        limit: 10, // 每页数量
        current: 1, // 当前页数
        subjectName: null, // 名称
        taskName: null
      },
      logModel: false, // 学习日志
      detailsModel: false, // 详情
      learnModel: false, // 学习
      level: 1 // 1省厅2市总队3区县分队4普通用户
    }
  },
  computed: {
    roleId: {
      get() {
        return this.$store.state.user.roleId
      }
    }
  },
  mounted() {
    // 省厅管理员 bbedc5f4e53941c9abe314d91024e9d3
    // 总队管理员 d6d606efd5fc363aeeed3af199384389
    // 支队管理员 fe0793017f48f79aa47568b25b3f98ea
    // 管理员 42537d2aa67dc239d7533bef9866972b
    // 普通用户 01c89d7383cf55ca6e72486c21116b88  不做处理
    this.tableColumnPugins = ColumnPugins(this)
    if(this.roleId === 'bbedc5f4e53941c9abe314d91024e9d3') { // 省厅
      this.level = 1
      this.tableColumnPugins = ColumnPuginsST(this)
    }else if(this.roleId === 'd6d606efd5fc363aeeed3af199384389') {
      this.level = 2
      this.tableColumnPugins = ColumnPuginsST(this)
    }else if(this.roleId === 'fe0793017f48f79aa47568b25b3f98ea') {
      this.level = 3
      this.tableColumnPugins = ColumnPuginsQX(this)
    }else {
      this.level = 4
      this.canSearch = true
      this.canReset = true
      this.tableColumnPugins = ColumnPugins(this)
    }
    if(this.roleId === '42537d2aa67dc239d7533bef9866972b') {
      this.level = 5
    }
    this.initListData()
  },
  methods: {
    // 初始化数据表格
    initListData() {
      if(this.roleId === '42537d2aa67dc239d7533bef9866972b') {
        return
      }
      var validation = supportNormal(this.searchParams)
      if(!validation.isPass) {
        let message = validation.message
        this.$Message.error(message)
      }else{
        this.loading = true
        initSubjectlearnList(this.searchParams).then(res => {
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
      this.searchParams = Object.assign(this.searchParams, {
        limit: 10, // 每页数量
        current: 1, // 当前页数
        subjectName: null, // 名称
        taskName: null
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
      deleteSubjectlearnByIds(params).then(res => {
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
        subjectName: null, // 名称
        taskName: null
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
    // 打开学习日志
    openDrawer(value) {
      if(value === 1) {
        this.logModel = true
      }else if(value === 2) {
        this.detailsModel = true
      }else if(value === 3) {
        this.learnModel = true
      }
    },
    // 打开学习日志
    closeDrawer(value) {
      if(value === 1) {
        this.logModel = false
      }else if(value === 2) {
        this.detailsModel = false
      }else if(value === 3) {
        this.initListData()
        this.learnModel = false
      }
    }
  }
}
</script>

<style lang="less" scoped></style>
