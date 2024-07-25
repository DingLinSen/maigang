<!--
 * @description subjectlearn- 课目学习主表--新增/编辑查看/界面
 * @author yxm
 * @date 2022-04-07
 * -->
<template>
  <div class="details-container" style="height: calc(100% + 11px)">
    <div class="details-title">
      <p>{{details.deptName}} 详情</p><Icon type="md-close" @click.stop="handleCancleModelSub"/>
    </div>
    <div class="details-content">
      <div class="detail-table">
        <Tables
          ref="tables"
          search-place="top"
          v-if="tableColumnPugins != null"
          v-model="listData"
          :border="true"
          :columnControl="true"
          :loading="loading"
          :tableHight = tableHight
          :columns="tableColumnPugins"
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
  </div>
</template>

<script>
import { initSubjectlearnDetailsById, initSubjectlearnDetailsByIdSub } from '@/api/learn/api-modules-subjectlearn.js'
import { OPERATE_LIST } from '@/libs/mixin'
import ColumnPugins from './details-column'
import ColumnPuginsSub from './details-column-sub'
export default {
  mixins: [ OPERATE_LIST ],
  data() {
    return {
      showDrawer: false,
      formData: {},
      searchParams: {// 查询参数
        limit: 10, // 每页数量
        current: 1 // 当前页数
      },
      tableHight: 0

    }
  },
  props: {
    details: {
      // eslint-disable-next-line vue/require-valid-default-prop
      default: {},
      type: Object
    },
    level: {
      default: 1,
      type: Number
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
    if(this.level === 1 || this.level === 2) {
      this.tableColumnPugins = ColumnPugins(this)
    }else if(this.level === 3 || this.level === 4) {
      this.tableColumnPugins = ColumnPuginsSub(this)
    }

    this.initListData()
  },
  methods: {
    // 根据id 获取详情
    initListData() {
      this.loading = true
      let params = {
        // ...this.details,
        ...this.searchParams,
        startDate: this.details.startDate,
        endDate: this.details.endDate,
        id: this.details.id

      }
      this.$nextTick(() => {
        if(this.level === 1 || this.level === 2) {
          initSubjectlearnDetailsById(params).then(res => {
            if (res.data.status) {
              const data = res.data.page

              this.totolCount = data.totalCount
              this.listData = data.list
              this.loading = false
            } else {
              this.loading = false
            }
          }).catch(() => {
            this.loading = false
          })
        }else if(this.level === 3 || this.level === 4) {
          initSubjectlearnDetailsByIdSub(params).then(res => {
            if (res.data.status) {
              const data = res.data.page

              this.totolCount = data.totalCount
              this.listData = data.list
              this.loading = false
            } else {
              this.loading = false
            }
          }).catch(() => {
            this.loading = false
          })
        }
      })
    },

    // 打开弹框并初始化
    handleOpenModel() {
      this.showDrawer = true
      this.initFormData()
    },
    // 关闭弹窗
    handleCancleModelSub() {
      this.showDrawer = false
      this.$emit('closeDrawer', 2)
    },
    // 重置条件查询
    handleResearch() {
      this.searchParams = Object.assign(this.searchParams, {
        limit: 10, // 每页数量
        current: 1 // 当前页数
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
