<!-- /**
  * @description 部门管理-index
  * @author yxm
  * @date 2021-10-19
  */ -->
<template lang="html">
  <container class="full-container">
    <div slot="content">
      <Tables
        ref="tables"
        v-if="tableColumnPugins != null"
        searchable
        search-place="top"
        v-model="listData"
        :treeTable="true"
        class="table-wrapper"
        :border="true"
        :columnControl="true"
        :loading="loading"
        :columns="tableColumnPugins"
        :canSave="false"
        :canReset="canReset"
        :canSearch="canSearch"
        @on-sort-change="onSortChange"
        @btnInsert="addTreeDrawerSub"
        @btnUpdate="updateDrawerChange"
        @btnDelete="btnDeleteBallast"
        @btnSearch="reloadList"
        @handleReset="handleResearch"
        @on-selection-change="selectChange"
      >
        <div slot="search" >
            <div class="search-box">
              <span class="search-tip">部门名称：</span>
              <Input
                type="text"
                v-model="searchParams.deptName"
                placeholder="输入部门名称查询"
                :clearable="true"
                :maxlength="20"
                ref="deptName"
              />
            </div>
        </div>
        <div slot="btn-right"></div>
      </Tables>

      <!-- 删除弹框 -->
      <Modal
        v-model="deleteModel"
        :title="this.$store.state.base.deleteInfo.title"
        @on-ok="handleDelete"
      >
        <p>{{ this.$store.state.base.deleteInfo.msg }}</p>
      </Modal>

      <!-- List列表弹窗操作页面 -->

      <transition name="center-show" mode="in-out">
        <keep-alive include="FormInfo">
          <component
            ref="formModel"
            :is="showComponent"
            :detailsId="
              chooseListData.length === 1 ? chooseListData[0].id : null
            "
            :isOperate="isOperate"
            :isSee="isSee"
            :addTree="addTree"
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
import { initAllDeptList, deleteDeptByIds } from '@/api/sys/api-modules-dept'
import { OPERATE_LIST } from '@/libs/mixin'
import ColumnPugins from './index-column'
import FormInfo from './operate/form-info.vue'
import { supportNormal, treeDataTranslateOpen } from '@/utils'
export default {
  mixins: [OPERATE_LIST],
  components: {
    FormInfo
  },
  computed: {
    documentClientHeight: {
      get() {
        return this.$store.state.common.documentClientHeight
      },
      set(val) {
        this.$store.commit('common/updateDocumentClientHeight', val)
      }
    }
  },
  watch: {
    documentClientHeight: function() {
      this.resetTableHeight()
    }
  },
  data() {
    return {
      canReset: this.isAuth('sys:dept:query'), // 重置
      canSearch: this.isAuth('sys:dept:query'), // 查询
      canSave: this.isAuth('sys:dept:add'), // 添加
      canEdit: this.isAuth('sys:dept:edit'), // 编辑
      canDelete: this.isAuth('sys:dept:delete'), // 删除
      canFindByID: true, // id查询
      exportPath: null, // 导出EXCEL地址
      downloadURL: null, // 下载地址
      uploadURL: null, // 上传地址
      uploadParams: null, // 上传参数
      searchParams: { // 查询参数
        deptName: null // 部门
      },
      defaultHeight: 0,
      spinShow: false
    }
  },
  mounted() {
    this.tableColumnPugins = ColumnPugins(this)
    this.initListData()
  },
  methods: {
    // 组织父级数据
    handlerData(array, level) {
      array.forEach((item, index) => {
        item._level = level + 1
        var subArray = item.children
        if (subArray) {
          this.handlerData(subArray, item._level)
        }
      })
    },
    // 重置窗口可视高度
    resetTableHeight() {
      let topH = 0
      if (this.$refs.searchWrapper) {
        topH = this.$refs.searchWrapper.offsetHeight // 获取查询区域的高度
      }
      var footerHeight = 0
      if (document.querySelector('.ivu-table-footer')) {
        footerHeight = document.querySelector('.ivu-table-footer').offsetHeight
      }
      this.defaultHeight = this.documentClientHeight - 120 - topH - footerHeight
    },
    // 初始化数据表格
    initListData() {
      this.spinShow = true
      var validation = supportNormal(this.searchParams)
      if (!validation.isPass) {
        this.$Message.error(validation.message)
      } else {
        this.loading = true
        initAllDeptList(validation.searchParams)
          .then(res => {
            this.spinShow = false
            if (res.data.status) {
              var data = res.data.data
              // 0正常 1停用
              let listData = data.filter(item => item.status === '0')
              var tempList = treeDataTranslateOpen(listData, 'deptId')
              tempList.forEach((item, index) => {
                item._level = 1
                if (item.children) {
                  this.handlerData(item.children, 1)
                }
              })
              this.listData = tempList
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
      // if (!formData.isOperate) {
      //   this.$refs.tables.handleReset()
      //   return
      // }
      this.initListData()
    },
    // 重置条件查询
    handleResearch() {
      this.searchParams = Object.assign(this.searchParams, {
        deptName: null // 部门
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
      deleteDeptByIds(params)
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
        deptName: null // 部门
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
    rowEditClick() {
      if (this.chooseListData && this.chooseListData.length > 0) {
        var result = this.chooseListData[0]
        if (!result._level || result._level < 1) {
          this.addTree = false
        } else {
          this.addTree = true
        }
        this.updateDrawerChange()
      }
    },
    // 添加子集
    rowAddClick() {
      if (this.chooseListData && this.chooseListData.length > 0) {
        var result = this.chooseListData[0]
        if (!result.orderNum || result.orderNum < 3) {
          this.isOperate = false
          this.createDrawerChange()
        } else {
          this.$Message.error('暂不可创建子级')
        }
      }
    },
    addTreeDrawerSub() {
      this.chooseListData = []
      this.addTreeDrawer()
    },
    dealArray(array, size) {
      let [start, end, result] = [null, null, []]
      for (let i = 0; i < Math.ceil(array.length / size); i++) {
        start = i * size
        end = start + size
        result.push(array.slice(start, end))
      }
      return result
    },
    getColLine(h, max, dealArray, index) {
      var array = []
      for (let i = 0; i < max; i++) {
        array.push(
          h(
            'span',
            {
              style: {
                width: '100px'
              }
            },
            dealArray[i][index] ? dealArray[i][index] : ''
          )
        )
      }
      return array
    }
    // changeSubComponent(component) {
    //   this.chooseDetailsId = null
    //   this.showComponent = component
    // },
    // // 关闭子页面
    // closeSubComponent() {
    //   this.changeSubComponent(null)
    // }
  }
}
</script>
<style lang="less" scoped>
/deep/.autoTbale th {
  padding-left: 20px !important;
  // text-align: center !important;
  border-right: 1px solid #e8eaec;
}
/deep/.autoTbale td,
.autoTbale th {
  padding-left: 20px !important;
}

/deep/.td-content {
  max-width: 95% !important;
}
/deep/.ivu-select-item {
  font-size: 13px !important;
}
.right-auto {
  margin-right: auto !important;
}
/deep/.ivu-table-cell-tree {
  .ivu-icon {
    font-size: 15px;
  }
}

/deep/.ivu-btn > span {
  display: block !important;
}
/deep/.ivu-tooltip-inner {
  max-width: 600px !important;
}
</style>
