<!--
 * @description subjectlearn- 课目学习主表--新增/编辑查看/界面
 * @author yxm
 * @date 2022-04-07
 * -->
<template>
  <div class="details-container" style="">
    <div class="details-title">
      <p> 考核统计</p><Icon type="md-close" @click.stop="handleCancleModelSub"/>
    </div>
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
          <!-- <div class="search-box">
            <span class="search-tip">课目信息：</span>
            <Input
              type="text"
              v-model="searchParams.subjectName"
              placeholder="输入课目信息查询"
              :clearable="false"
              :maxlength="20"
              ref="subjectName"
            />
          </div> -->
          <!-- <div class="search-box">
            <span class="search-tip">人员名称：</span>
            <Input
              type="text"
              v-model="searchParams.username"
              placeholder="输入人员名称查询"
              :clearable="false"
              :maxlength="20"
              ref="username"
            />
          </div> -->
          <!-- <div class="search-box">
            <span class="search-tip">考核时间：</span>
            <DatePicker type="date" placeholder="请选择考核时间" v-model="searchParams.examineDate"></DatePicker>
          </div> -->
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
          :detailsId="chooseListData.length === 1 ? chooseListData[0].id : null"
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
import { initStaticalList } from '@/api/online/control/api-modules-control.js'
import { OPERATE_LIST } from '@/libs/mixin'
import ColumnPugins from './statistical-column'
import { supportNormal } from '@/utils'
import User from './user'
export default {
  mixins: [ OPERATE_LIST ],
  components: {
    User
  },
  data() {
    return {
      showDrawer: false,
      formData: {},
      canFindByID: true,
      canSearch: false,
      canReset: false,
      searchParams: {// 查询参数
        limit: 10, // 每页数量
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
      this.tableHight = this.documentClientHeight - 150
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
    this.tableHight = this.documentClientHeight - 150
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
        this.loading = true
        initStaticalList(validation.searchParams).then(res => {
          if (res.data.status) {
            this.totolCount = res.data.page.totalCount
            var data = res.data.page
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
        limit: 10, // 每页数量
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
