<!--
 * @description examinepoint- 网上考核-成绩管理--index
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
            <span class="search-tip" style="min-width: 70px">课目名称：</span>
            <!-- <Select
              filterable
              :clearable="true"
              v-model="searchParams.subjectName"
              placeholder="选择状态查询"
              ref="selectRef"
            >
              <Option value="1" label="理论考核"></Option>
              <Option value="2" label="专业考核"></Option>
            </Select> -->
            <Input
              type="text"
              v-model="searchParams.subjectName"
              placeholder="输入课目名称查询"
              :clearable="true"
              :maxlength="15"
              ref="subjectName"
            />
          </div>
          <div class="search-box">
            <span class="search-tip" style="min-width: 70px">考核名称：</span>
            <Input
              type="text"
              v-model="searchParams.examineName"
              placeholder="输入考核名称查询"
              :clearable="true"
              :maxlength="15"
              ref="examineName"
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
        <!-- <before-upload
          ref="beforeModel"
          @handle-next="openUploadModel"
          modelTitle="导入数据"
        >
        </before-upload> -->
        <!-- <upload-model
        ref="uploadModel"
        uploadTip
        v-if="uploadURL"
        :downloadURL="downloadURL"
        :uploadURL="uploadURL"
        :uploadParams="uploadParams"
        :acceptType="acceptType"
        :routerTitle="this.$route.meta.title"
        @handleUpload="operateSuccess"
        modelTitle="导入数据"
      >
      </upload-model> -->

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
            :examineName="chooseListData.length === 1 ? chooseListData[0].examineName : null"
            @operateSuccess="operateSuccess"
            @close="closeComponent"
            @error="error()"
          ></component>
        </keep-alive>
      </transition>
    </div>
    <div slot="drawer">
          <FormInfo0
            ref="formModel0"
            :detailsId="
               chooseListData.length === 1
                  ? chooseListData[0].id + ''
                  : null
            "
            :assId="
               chooseListData.length === 1
                  ? chooseListData[0].assessmentId + ''
                  : null
            "
            :isSee="isSee"
            :paperName="chooseListData.length === 1 ? chooseListData[0].paperName : null"
            :examineDate="chooseListData.length === 1 ? chooseListData[0].examineDate : null"
            @close="closeComponent"
          ></FormInfo0>
     </div>
  </container>
</template>
<script>
import { initExaminePointList, deleteExaminePointByIds } from '@/api/online/achievement/api-modules-examinepoint'
import FormInfo0 from './operate/form-infoPaper.vue'
import { OPERATE_LIST } from '@/libs/mixin'
import ColumnPugins from './index-column'
import ColumnPuginsSub from './index-columSub'
import FormInfo from './operate/form-info.vue'
// import BeforeUpload from './before-upload.vue'
import { supportNormal } from '@/utils'
export default {
  mixins: [OPERATE_LIST],
  components: {
    FormInfo,
    FormInfo0
    // BeforeUpload
  },
  data() {
    return {
      canSearch: true, // 查询
      canReset: true, // 重置
      canSave: false, // 添加
      canEdit: true, // 编辑
      canDelete: false, // 删除
      canFindByID: true, // id查询
      canImport: false, // 能否导入
      exportPath: null, // 导出EXCEL地址
      downloadURL: null, // 下载地址
      uploadURL: null, // 上传地址
      exportUrl: null, // 导出地址
      uploadParams: null, // 上传参数
      statusOpenModel: false, // 状态弹框
      statusStopModel: false, // 状态弹框
      API: {}, // api对象
      isManager: false,
      searchParams: {// 查询参数
        limit: 10, // 每页数量
        current: 1, // 当前页数
        name: null, // 名称
        status: null // 状态
      }
    }
  },
  mounted() {
    let roleListStr = this.$store.state.user
      ? this.$store.state.user.roleId
      : ''
    this.isManager =
      roleListStr.indexOf('d6d606efd5fc363aeeed3af199384389') !== -1 ||
      roleListStr.indexOf('fe0793017f48f79aa47568b25b3f98ea') !== -1 ||
      roleListStr.indexOf('42537d2aa67dc239d7533bef9866972b') !== -1 ||
      roleListStr.indexOf('bbedc5f4e53941c9abe314d91024e9d3') !== -1
    if(this.isManager) {
      this.tableColumnPugins = ColumnPugins(this) // 管理员
      // this.tableColumnPugins = ColumnPuginsSub(this) // 个人用户
    }else{
      this.tableColumnPugins = ColumnPuginsSub(this) // 个人用户
      // this.tableColumnPugins = ColumnPugins(this) // 管理员
    }

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
      if(!validation.isPass) {
        let message = validation.message
        this.$Message.error(message)
      }else{
        this.loading = true
        initExaminePointList(this.searchParams).then(res => {
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
        subjectName: null, // 课目名称
        examineName: null // 考核状态
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
      deleteExaminePointByIds(params).then(res => {
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
    generatePlanSucess() {
      this.isSee = false
      this.$refs.formModel0.handleOpenModel()
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

    }

  }
}
</script>

<style lang="less" scoped></style>
