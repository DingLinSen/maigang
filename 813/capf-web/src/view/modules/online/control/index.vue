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
            <span class="search-tip">考核单位：</span>
            <Cascader
              :data="deptList"
              v-model="dept"
              placeholder="请选择考核单位"
              :disabled="isSee"
              @on-change="selDept"
              style="width:100%"
              :clearable="false"
              change-on-select
            ></Cascader>
          </div>
        </div>
        <div slot="btn-right">
          <Button
            type="primary"
            class="search-btn"
            @click="openBeforeUploadModel()"
            v-if="canImport"
            ghost
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
      <transition name="center-show" mode="in-out">
        <keep-alive include="FormInfo">
          <component
            ref="formModel"
            :is="showComponent"
            :detailsId="
              chooseListData.length === 1 ? chooseListData[0].id : null
            "
            :details="chooseListData.length === 1 ? chooseListData[0] : {}"
            @operateSuccess="operateSuccess"
            @close="closeComponent"
            @error="error()"
          ></component>
        </keep-alive>
      </transition>
    </div>
    <div slot="drawer">
      <transition name="center-show" mode="in-out">
        <Statistical
          v-if="statisticalModel"
          ref="statisticalModel"
          :detailsId="chooseListData.length === 1 ? chooseListData[0].id : null"
          @operateSuccess="operateSuccess"
          @closeDrawer="closeDrawer"
          @close="closeComponent"
          @error="error()"
        >
        </Statistical>
      </transition>
    </div>
  </container>
</template>

<script>
import { initAllDeptList } from '@/api/sys/api-modules-dept'
import {
  initAccessControlList,
  deleteAccessControlByIds
} from '@/api/online/control/api-modules-control.js'
import { OPERATE_LIST } from '@/libs/mixin'
import columnPugins from './index-column'
import { treeDataTranslate } from '@/utils'
import Details from './controlDetails'
import FormInfo from './operate/form-info.vue'
import Statistical from './operate/statistical'
export default {
  mixins: [OPERATE_LIST],
  components: {
    FormInfo,
    Details,
    Statistical
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
      searchParams: {
        // 查询参数
        limit: 10, // 条数
        current: 1, // 页数
        deptId: '' // 姓名
      },
      dept: [],
      deptList: [],
      statisticalModel: false
    }
  },
  created() {},
  computed: {
    websocketFlag: {
      get() {
        if (this.$store.state.user) {
          return this.$store.state.user.websocketFlag
        }
      }
    },
    userId: {
      get() {
        if (this.$store.state.user) {
          return this.$store.state.user.userId
        }
      }
    }
  },
  mounted() {
    // 建立webscocket
    this.initSelect()
    this.tableColumnPugins = columnPugins(this)
    this.initListData()
  },
  watch: {
    // websocketFlag: function() {
    //   let data = this.websocketFlag
    //   // 1 认证 2 考试 3 拍照 4评判试卷 5 发布成绩  6下线 7交卷
    //   if(!data) {
    //     return
    //   }
    //   if(data.type === 7) {
    //     this.initListData()
    //   }
    // }
  },
  methods: {
    getAudioVideo(constraintsData) {
      if (navigator.mediaDevices === undefined) {
        navigator.mediaDevices = {}
      }
      if (navigator.mediaDevices.getUserMedia === undefined) {
        navigator.mediaDevices.getUserMedia = function(constraints) {
          // 首先，如果有getUserMedia的话，就获得它
          var getUserMedia =
            navigator.getUserMedia ||
            navigator.webkitGetUserMedia ||
            navigator.mozGetUserMedia ||
            navigator.msGetUserMedia
          // 一些浏览器根本没实现它 - 那么就返回一个error到promise的reject来保持一个统一的接口
          if (!getUserMedia) {
            return Promise.reject({ code: 404 })
          }

          // 否则，为老的navigator.getUserMedia方法包裹一个Promise

          return new Promise(function(resolve, reject) {
            getUserMedia.call(navigator, constraints, resolve, reject)
          })
        }
      }
      return navigator.mediaDevices.getUserMedia(constraintsData)
    },
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
          } else {
          }
        })
        .catch(() => {
          this.loading = false
        })
    },
    // 初始化数据表格信息
    initListData() {
      this.loading = true
      initAccessControlList(this.searchParams)
        .then(res => {
          if (res.data.status) {
            this.totolCount = res.data.data.totalCount
            var data = res.data.data
            this.listData = data.list
            this.$forceUpdate()
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
        deptId: ''
      })
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
      let ids = ''
      this.chooseListData.forEach(element => {
        ids += element.id + ','
      })
      ids = ids.substring(0, ids.lastIndexOf(','))
      let params = {
        ids: ids
      }
      deleteAccessControlByIds(params)
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
          } else {
            this.$Message.error(res.msg)
          }
        })
        .catch(() => {})
    },
    // 选择部门
    selDept(value) {
      if (value && value.length > 0) {
        this.searchParams.deptId = value[value.length - 1]
      } else if (value.length === 0) {
        this.searchParams.deptId = ''
      } else {
        this.searchParams.deptId = ''
      }
    },
    statistical() {
      this.statisticalModel = true
    },
    closeDrawer(value) {
      this.statisticalModel = false
    }
  }
}
</script>
<style lang="less" scoped>
// /deep/.ivu-select-item{
//   font-size: 13px !important;
// }
</style>
