<!--
 * @description planyear- 登记统计-年训练档案--index
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
            <span class="search-tip" style="min-width: 70px">训练时间：</span>
            <DatePicker
              v-model="searchParams.year"
              format="yyyy"
              type="year"
              placement="bottom-start"
              placeholder="选择训练时间查询"
              style="width: 215px;"
            ></DatePicker>
          </div>
        </div>
        <page-wrapper
          slot="footer"
          :total="totolCount"
          :pageSize="searchParams.limit"
          :pageNo="searchParams.page"
          @page-change="pageChange"
          @page-size-change="pageSizeChange"
        ></page-wrapper>
      </Tables> 
    </div>

    <div slot="drawer">
      <transition name="center-show" mode="in-out">
        <!-- <keep-alive include="FormInfo">
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
        </keep-alive> -->
      </transition>
    </div>
  </container>
</template>

<script>
import { OPERATE_LIST } from '@/libs/mixin'
import ColumnPugins from './index-column'
// import FormInfo from './operate/form-info.vue'
export default {
  mixins: [OPERATE_LIST],
  components: {
    // FormInfo
  },
  data() {
    return {
      canSearch: this.isAuth('statistics:month:query'), // 查询
      canReset: this.isAuth('statistics:month:query'), // 重置
      canSave: false, // 添加
      canEdit: false, // 编辑
      canExport: this.isAuth('statistics:week:export'),
      canFindByID: true, // id查询
      canImport: false, // 能否导入
      exportPath: null, // 导出EXCEL地址
      downloadURL: null, // 下载地址
      dateArray: [],
      API: {}, // api对象
      listData:[],
      searchParams: {
        // 查询参数
        limit: 10, // 每页数量
        page: 1, // 当前页数
        year: null
      },
      isManager: false,
    }
  },
  mounted() {
    // this.API = API_TASKTRAIN()
    let roleListStr = this.$store.state.user
      ? this.$store.state.user.roleId
      : ''
    this.isManager =
      roleListStr.indexOf('d6d606efd5fc363aeeed3af199384389') !== -1 ||
      roleListStr.indexOf('fe0793017f48f79aa47568b25b3f98ea') !== -1 ||
      roleListStr.indexOf('42537d2aa67dc239d7533bef9866972b') !== -1 ||
      roleListStr.indexOf('bbedc5f4e53941c9abe314d91024e9d3') !== -1
    this.tableColumnPugins = ColumnPugins(this) // 管理员
    // this.searchParams = Object.assign(this.searchParams, FormDataInfo())
    this.initListData()
  },
  methods: {
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
      // this.loading = true
      // initTaskTrainList(this.searchParams)
      //   .then(res => {
      //     // console.log(res)
      //     if (res.data.status) {
      //       this.totolCount = res.data.page.totalCount
      //       // console.log(this.totolCount)
      //       var data = res.data.page.list
      //       // console.log(data)
      //       this.listData = data
      //       this.$nextTick(() => {
      //         this.loading = false
      //       })
      //     } else {
      //       this.loading = false
      //       this.listData = []
      //     }
      //   })
      //   .catch(() => {
      //     this.loading = false
      //   })
    },

    // 根据参数刷新当前表格(添加是时刷新到第一页第一条；编辑、上传、删除后刷新到当前页)
    operateSuccess(formData) {
      this.handleResearch()
    },

    // 重置条件查询
    handleResearch() {
      this.searchParams = Object.assign(this.searchParams, {
        limit: 10, // 每页数量
        page: 1, // 当前页数
        year: null
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
      // deleteTaskTrainByIds(params)
      //   .then(res => {
      //     if (res.data.status) {
      //       this.$Message.success('成功删除信息')
      //       if (this.listData.length - this.chooseListData.length === 0) {
      //         this.chooseListData = []
      //         this.$refs.tables.handleReset()
      //       } else {
      //         this.chooseListData = []
      //         this.initListData()
      //       }
      //     }
      //   })
      //   .catch(() => {})
    },
    // 下载参数
    loadExportParams() {
      // if (this.searchParams.taskTimeStart) {
      //   this.searchParams.taskTimeStart =
      //     this.$moment(this.searchParams.taskTimeStart).format('YYYY-MM-DD') +
      //     ' 00:00:00'
      // }
      let params = {
        year: this.searchParams.year
          ? this.searchParams.year
          : null
      }
      return params
    }
  }
}
</script>
<style lang="less" scoped></style>
