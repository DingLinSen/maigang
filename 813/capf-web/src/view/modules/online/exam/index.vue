<!--
 * @description examinepoint- 网上考核-成绩管理--index
 * @author yxm
 * @date 2022-04-07
 * -->
<template lang="html">
  <container class="full-container">
    <div slot="content">
      <Tables ref="tables" v-if="tableColumnPugins != null" searchable search-place="top" v-model="listData"
        :exportPath="exportUrl" :exportParams="loadExportParams()" :border="true" :columnControl="true" :loading="loading"
        :columns="tableColumnPugins" :canSearch="canSearch" :canReset="canReset" :canSave="canSave" :canDelete="canDelete"
        @on-sort-change="onSortChange" @btnInsert="createDrawerChange" @btnUpdate="updateDrawerChange"
        @btnDelete="btnDeleteBallast" @btnSearch="reloadList" @handleReset="handleResearch"
        @on-selection-change="selectChange">
        <div slot="search" class="search-info">
          <div class="search-box">
            <span class="search-tip" style="min-width: 70px">考试名称：</span>
            <Input type="text" v-model="searchParams.examinationName" placeholder="输入考试名称查询" :clearable="true"
              :maxlength="15" ref="examinationName" />
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
          <Button type="info" class="search-btn" @click="openBeforeUploadModel()" v-if="canImport">导入</Button>
        </div>
        <page-wrapper slot="footer" :total="totolCount" :pageSize="searchParams.limit" :pageNo="searchParams.current"
          @page-change="pageChange" @page-size-change="pageSizeChange"></page-wrapper>
      </Tables>
    </div>
  </container>
</template>
<script>
import { deleteExaminePointByIds } from '@/api/online/achievement/api-modules-examinepoint'
import { initExamList } from '@/api/online/control/api-modules-control.js'
import { OPERATE_LIST } from '@/libs/mixin'
import ColumnPugins from './index-column'
import { supportNormal } from '@/utils'

export default {
  mixins: [OPERATE_LIST],
  components: {
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
      searchParams: {
        // 查询参数
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
    if (this.isManager) {
      this.tableColumnPugins = ColumnPugins(this) // 管理员
    } else {
      this.tableColumnPugins = ColumnPugins(this) // 管理员
    }
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
        initExamList(this.searchParams)
          .then(res => {
            if (res.data.status) {
              this.totolCount = res.data.data.totalCount
              var data = res.data.data.list
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
        examinationName: null, // 课目名称
        examineName: null, // 考核状态
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
      deleteExaminePointByIds(params)
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
    loadExportParams() {},
    // 启用操作
    handleOpen1() {},
    // 停用操作
    handleStop1() {}
  }
}
</script>

<style lang="less" scoped></style>
