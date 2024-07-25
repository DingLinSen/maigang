<!--
 * @description subjectlearn- 课目学习主表--新增/编辑查看/界面
 * @author yxm
 * @date 2022-04-07
 * -->
<template>
  <div class="details-container" style="left: 0;width: calc(100% - 7px);">
    <div class="details-title">
      <p> 人员信息</p><Icon type="md-close" @click.stop="handleCancleModelSub"/>
    </div>
    <div class="details-content">
      <div class="detail-table">
        <Tables
          ref="tables"
          search-place="top"
          searchable
          v-if="tableColumnPugins != null"
          v-model="listData"
          :border="true"
          :columnControl="true"
          :loading="loading"
          :tableHight = tableHight
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
          <div class="search-box">
            <span class="search-tip">参考人员：</span>
            <Input
              type="text"
              v-model="searchParams.userName"
              placeholder="输入参考人员查询"
              :clearable="false"
              :maxlength="20"
              ref="userName"
            />
          </div>
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
  </div>
</template>

<script>
import { initStaticalListDetailsById } from '@/api/online/control/api-modules-control.js'
import { OPERATE_LIST } from '@/libs/mixin'
import ColumnPugins from './user-column'
import { supportNormal } from '@/utils'
export default {
  mixins: [ OPERATE_LIST ],
  data() {
    return {
      showDrawer: false,
      formData: {},
      canFindByID: true,
      canSearch: true,
      canReset: true,
      searchParams: {// 查询参数
        limit: 10, // 每页数量
        current: 1, // 当前页数
        userName: null,
        parentId: null
      },
      tableHight: 0

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
      this.tableHight = this.documentClientHeight - 208
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
    this.tableHight = this.documentClientHeight - 208
    this.tableColumnPugins = ColumnPugins(this)
    this.searchParams.parentId = this.detailsId
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
        initStaticalListDetailsById(validation.searchParams).then(res => {
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
        userName: null
      })
      this.chooseListData = []
      this.initListData()
    }
  }
}
</script>
<style lang="less" scoped>
/deep/.table-wrap .table-content{
  padding: 10px 0 10px 0 !important;
}
</style>
