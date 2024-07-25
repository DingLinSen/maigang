<!--
 * @description subjectlearn- 课目学习主表--新增/编辑查看/界面
 * @author yxm
 * @date 2022-04-07
 * -->
<template>
  <div class="details-container" style="">
    <!-- <div class="details-title">
      <p> 考核统计</p><Icon type="md-close" @click.stop="handleCancleModelSub"/>
    </div> -->
    <div class="details-content">
      <div class="detail-table">
        <Tables
          ref="tables"

          v-if="tableColumnPugins != null"
          v-model="listData"
          :border="true"
          :columnControl="true"
          :loading="loading"
          :tableHight = "tableHight"
          :columns="tableColumnPugins"
          :canSearch="canSearch"
          :canReset="canReset"
          @on-sort-change="onSortChange"
          @btnInsert="createDrawerChange"
          @btnUpdate="updateDrawerChange"
          @btnDelete="btnDeleteBallast"
          @btnSearch="reloadList"
          @handleReset="handleResearch"
          @on-selection-change="selectChange"
        >
          <div slot="search" class="search-info">
        </div>
          <div slot="btn-right">
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
      </div>
    </div>
    <div slot="drawer">
      <transition name="center-show" mode="in-out">
        <User
          v-if="userModel"
          ref="userModel"
          :detailsId="detailsId"
          @closeDrawer="closeDrawer"
          @close="closeComponent"
          @error="error()"
        >
        </User>
      </transition>
    </div>
  </div>
</template>

<script>
import { initUnloginList } from '@/api/online/control/api-modules-control.js'
import { OPERATE_LIST } from '@/libs/mixin'
import ColumnPugins from './nologin-column'
import { supportNormal } from '@/utils'
export default {
  mixins: [ OPERATE_LIST ],
  components: {
  },
  data() {
    return {
      showDrawer: false,
      formData: {},
      canFindByID: true,
      canSearch: false,
      canReset: false,
      searchParams: {// 查询参数
        limit: 1000000, // 每页数量
        current: 1, // 当前页数
        username: null,
        subjectName: null,
        examineDate: null,
        assId: null
      },
      tableHight: 0,
      userModel: false

    }
  },
  props: {
    detailsId: {
      type: String,
      default: null
    }
  },
  watch: {
    documentClientHeight: function() {
      this.tableHight = this.documentClientHeight - 260
    }
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
  mounted() {
    this.tableHight = this.documentClientHeight - 260
    this.tableColumnPugins = ColumnPugins(this)
    this.searchParams.assId = this.detailsId
    this.initListData()
  },
  methods: {
    // 根据id 获取详情
    initListData() {
      this.loading = true
      var validation = supportNormal(this.searchParams)
      if(!validation.isPass) {
        this.$Message.error(validation.message)
      }else{
        initUnloginList(validation.searchParams).then(res => {
          if (res.data.status) {
            this.totolCount = res.data.data.length
            var data = res.data.data
            this.listData = data
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

    // 打开弹框并初始化
    handleOpenModel() {
      this.showDrawer = true
      this.initFormData()
    },
    // 关闭弹窗
    handleCancleModelSub() {
      this.showDrawer = false
      this.$emit('closeDrawer', 1)
    },
    // 重置条件查询
    handleResearch() {
      this.searchParams = Object.assign(this.searchParams, {
        limit: 1000000, // 每页数量
        current: 1, // 当前页数
        username: null,
        subjectName: null,
        examineDate: null
      })
      this.chooseListData = []
      this.initListData()
    },
    openUserModel() {
      this.userModel = true
    },
    closeDrawer(value) {
      this.userModel = false
    }
  }
}
</script>
<style lang="less" scoped>
/deep/.table-wrap .table-content{
  padding: 10px 0 10px 0 !important;
}
</style>
