<!--
 * @description planyear- 计划-年计划表--index
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
        <div slot="search" class="search-info" style="max-width:80%">
          <div class="search-box">
            <span class="search-tip" style="min-width: 70px">任务单位：</span>
            <Cascader
              :data="deptList"
              v-model="dept"
              placeholder="请选择任务单位"
              @on-change="selDept"
              style="width:100%"
              :clearable="false"
              change-on-select
            ></Cascader>
          </div>
          <div class="search-box">
            <span class="search-tip" style="min-width: 70px">任务名称：</span>
            <Input
              type="text"
              v-model="searchParams.taskName"
              placeholder="输入任务名称查询"
              :clearable="true"
              style="width:100%"
              :maxlength="50"
              ref="taskName"
            />
          </div>
          <div class="search-box">
            <span class="search-tip" style="min-width: 70px">进度类型：</span>
            <Select
              filterable
              v-model="searchParams.status"
              placeholder="选择进度类型查询"
              style="width:120px;"
              ref="selectRef"
            >
              <Option value="5" label="全部"></Option>
              <Option value="1" label="未启动" v-if="isManager"></Option>
              <Option value="2" label="进行中"></Option>
              <Option value="3" label="已关闭" v-if="isManager"></Option>
              <Option value="4" label="已结束"></Option>
            </Select>
          </div>
          <div class="search-box">
            <span class="search-tip" style="min-width: 70px">任务期限：</span>
            <DatePicker
              v-model="dateArray"
              format="yyyy-MM-dd"
              type="daterange"
              placement="bottom-end"
              placeholder="选择任务期限查询"
              style="width: 215px;"
              @on-change="selDate"
            ></DatePicker>
          </div>
        </div>
        <!-- <div slot="btn-right">
          <Button type="info" class="search-btn" @click="openBeforeUploadModel()" v-if="canImport">导入</Button>
        </div> -->
        <page-wrapper
          slot="footer"
          :total="totolCount"
          :pageSize="searchParams.limit"
          :pageNo="searchParams.page"
          @page-change="pageChange"
          @page-size-change="pageSizeChange"
        ></page-wrapper>
      </Tables>

      <!-- 关闭弹框 -->
      <Modal v-model="closeModel" title="确认关闭该任务" @on-ok="handleColse">
        <p>任务一旦关闭就无法再次开启，确认关闭该任务吗？</p>
      </Modal>

      <!-- 确认发布弹窗 -->
      <Modal
        v-model="publishModel"
        title="确认发布该任务"
        @on-ok="sucessPublish"
      >
        <p>确认发布该任务吗？</p>
      </Modal>
    </div>

    <div slot="drawer">
      <!-- <before-upload
        ref="beforeModel"
        @handle-next="openUploadModel"
        modelTitle="导入数据"
      >
      </before-upload> -->

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
  initTaskTrainList,
  deleteTaskTrainByIds,
  publishTaskTrainInfo,
  closeTaskTrainInfo
} from '@/api/tasks/api-modules-tasktrain'
import { initAllDeptList } from '@/api/sys/api-modules-dept'
import { API_TASKTRAIN } from '@/api/tasks/api-address-tasktrain'
import { OPERATE_LIST } from '@/libs/mixin'
import ColumnPugins from './index-column'
import ColumnPuginsSub from './index-column-sub'
import FormInfo from './operate/form-info.vue'
// import BeforeUpload from './before-upload.vue'
import { supportNormal, treeDataTranslate } from '@/utils'
export default {
  mixins: [OPERATE_LIST],
  components: {
    FormInfo
    // BeforeUpload
  },
  data() {
    return {
      canSearch: this.isAuth('tasks:query'), // 查询
      canReset: this.isAuth('tasks:query'), // 重置
      canSave: this.isAuth('tasks:add'), // 添加
      canEdit: this.isAuth('tasks:edit'), // 编辑
      canPublish: this.isAuth('tasks:publish'), // 发布
      canClose: this.isAuth('tasks:close'),
      canExport: this.isAuth('tasks:export'),
      closeModel: false, // 审核弹窗
      publishModel: false, // 发布弹窗
      canFindByID: true, // id查询
      canImport: true, // 能否导入
      exportPath: null, // 导出EXCEL地址
      downloadURL: null, // 下载地址
      uploadURL: null, // 上传地址
      uploadParams: null, // 上传参数
      statusOpenModel: false, // 状态弹框
      statusStopModel: false, // 状态弹框
      dateArray: [],
      API: {}, // api对象
      searchParams: {
        // 查询参数
        limit: 10, // 每页数量
        page: 1, // 当前页数
        status: '5', // 状态
        taskTimeStart: null,
        taskTimeEnd: null,
        taskName: null,
        groupId: ''
      },
      isManager: false,
      dept: [],
      deptList: []
    }
  },
  mounted() {
    this.API = API_TASKTRAIN()
    let roleListStr = this.$store.state.user
      ? this.$store.state.user.roleId
      : ''
    this.isManager =
      roleListStr.indexOf('d6d606efd5fc363aeeed3af199384389') !== -1 ||
      roleListStr.indexOf('fe0793017f48f79aa47568b25b3f98ea') !== -1 ||
      roleListStr.indexOf('42537d2aa67dc239d7533bef9866972b') !== -1 ||
      roleListStr.indexOf('bbedc5f4e53941c9abe314d91024e9d3') !== -1
    this.tableColumnPugins = this.isManager
      ? ColumnPugins(this) // 管理员
      : ColumnPuginsSub(this) // 个人用户
    // this.searchParams = Object.assign(this.searchParams, FormDataInfo())
    this.initSelect()
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
              if (item.status === '0') {
                deptList.push({
                  ...item,
                  value: item.deptId,
                  label: item.deptName
                })
              }
            })
            this.deptList = treeDataTranslate(deptList, 'deptId')
          }
        })
        .catch(() => {})
    },
    // 初始化数据表格
    initListData() {
      if (this.searchParams.taskTimeStart) {
        this.searchParams.taskTimeStart =
          this.$moment(this.searchParams.taskTimeStart).format('YYYY-MM-DD') +
          ' 00:00:00'
      }
      if (this.searchParams.taskTimeEnd) {
        this.searchParams.taskTimeEnd =
          this.$moment(this.searchParams.taskTimeEnd).format('YYYY-MM-DD') +
          ' 23:59:59'
      }
      let params = {
        status: this.searchParams.status, // 状态
        taskName: this.searchParams.taskName
          ? this.searchParams.taskName
          : null,
        groupId: this.searchParams.groupId ? this.searchParams.groupId : ''
      }
      var validation = supportNormal(params)
      if (!validation.isPass) {
        let message = validation.message
        this.$Message.error(message)
      } else {
        this.loading = true
        params['taskTimeEnd'] = this.searchParams.taskTimeEnd
          ? this.searchParams.taskTimeEnd
          : null
        params['taskTimeStart'] = this.searchParams.taskTimeStart
          ? this.searchParams.taskTimeStart
          : null
        initTaskTrainList(this.searchParams)
          .then(res => {
            // console.log(res)
            if (res.data.status) {
              this.totolCount = res.data.page.totalCount
              // console.log(this.totolCount)
              var data = res.data.page.list
              // console.log(data)
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
      this.dept = []
      this.searchParams = Object.assign(this.searchParams, {
        limit: 10, // 每页数量
        page: 1, // 当前页数
        status: '5', // 状态
        taskTimeStart: null,
        taskTimeEnd: null,
        taskName: null,
        groupId: ''
      })
      this.chooseListData = []
      this.dateArray = []
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
      deleteTaskTrainByIds(params)
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
        page: 1, // 当前页数
        status: '5', // 状态
        taskTimeStart: null,
        taskTimeEnd: null,
        taskName: null,
        groupId: ''
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
    handlePublish() {
      if (this.chooseListData.length > 0) {
        // 批量判断是否已经通过审核
        this.chooseListData.forEach((item, index) => {
          // console.log(item.status)
          if (item.status !== '1') {
            this.$Message.error('该任务已经发布,请不要重复发布')
          } else {
            this.publishModel = true
          }
        })
      } else {
        this.$Message.error('请选择至少一条数据信息执行操作')
      }
    },
    sucessPublish() {
      // 修改状态接口
      let params = {
        id: this.chooseListData[0].id
      }
      publishTaskTrainInfo(params)
        .then(res => {
          this.publishModel = false
          if (res.data.status) {
            this.$Message.success('成功发布任务')
            this.initListData()
          }
        })
        .catch(() => {})
    },
    // 确认关闭
    handleColse() {
      // 修改状态接口
      let params = {
        id: this.chooseListData[0].id
      }
      closeTaskTrainInfo(params)
        .then(res => {
          this.auditModel = false
          if (res.data.status) {
            this.$Message.success('该任务成功关闭')
            this.initListData()
          }
        })
        .catch(() => {})
    },
    // 下载参数
    loadExportParams() {
      if (this.searchParams.taskTimeStart) {
        this.searchParams.taskTimeStart =
          this.$moment(this.searchParams.taskTimeStart).format('YYYY-MM-DD') +
          ' 00:00:00'
      }
      if (this.searchParams.taskTimeEnd) {
        this.searchParams.taskTimeEnd =
          this.$moment(this.searchParams.taskTimeEnd).format('YYYY-MM-DD') +
          ' 23:59:59'
      }
      let params = {
        status: this.searchParams.status, // 状态
        taskTimeStart: this.searchParams.taskTimeStart
          ? this.searchParams.taskTimeStart
          : null,
        taskTimeEnd: this.searchParams.taskTimeEnd
          ? this.searchParams.taskTimeEnd
          : null,
        taskName: this.searchParams.taskName
          ? this.searchParams.taskName
          : null,
        groupId: this.searchParams.groupId ? this.searchParams.groupId : ''
      }
      return params
    },
    handleBeforeChange() {
      if (this.canPublish) {
        var data = this.chooseListData[0]
        if (data.status === '1') {
          this.handlePublish()
        }
      }
    },
    //关闭任务
    closeTask() {
      this.closeModel = true
    },
    //选择任务时间
    selDate(e) {
      this.searchParams.taskTimeStart = e[0] ? e[0] : null
      this.searchParams.taskTimeEnd = e[1] ? e[1] : null
    },
    // 选择部门
    selDept(value) {
      if (value && value.length > 0) {
        this.searchParams.groupId = value[value.length - 1]
      } else if (value.length === 0) {
        this.searchParams.groupId = ''
      } else {
        this.searchParams.groupId = ''
      }
    }
  }
}
</script>

<style lang="less" scoped>
/deep/ .details-container {
  left: 0px;
  width: calc(100%);
}
/deep/ .el-switch__label {
  position: absolute;
  display: none;
  color: #fff;
  top: 1px;
  font-size: 13px;
}
/deep/.el-switch__label * {
  font-size: 13px;
}
/deep/ .el-switch__label--left {
  z-index: 1;
  left: 25px;
}
/deep/ .el-switch__label--right {
  z-index: 1;
  left: -2px;
}
/deep/ .el-switch__label.is-active {
  display: block;
  color: #fff;
}
/deep/ .el-switch.is-checked .el-switch__core::after {
  left: 94%;
}
/deep/ .el-switch .el-switch__core,
.el-switch .el-switch__label {
  width: 48px !important;
  height: 20px !important;
}
/deep/ .el-switch__core {
  // border-radius:15px;
  &:after {
    width: 18px;
    height: 18px;
    top: 0px;
    // left:3px;
    // z-index:10;
  }
}
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
