<!--
 * @description subjectlearn- 课目学习主表--新增/编辑查看/界面
 * @author yxm
 * @date 2022-04-07
 * -->
<template>
  <div class="details-container" style="height: calc(100% + 9px)">
    <div class="details-title">
      <p>学习日志</p><Icon type="md-close" @click.stop="handleCancleModelSub"/>
    </div>
    <div class="details-content">
      <div class="detail-top">
        <div class="top-col">
          <p>总课程数：<span class="num">{{details.totalSubjectNum || '--'}}</span></p>
        </div>
        <div class="top-col">
          <p>计划学习时长：<span class="num">{{details.planLearnHour || '--'}}</span></p>
        </div>
        <div class="top-col">
          <p>已学习时长：<span class="num">{{details.alreadyLearnHour || '--'}}</span></p>
        </div>
      </div>
      <div class="detail-table">
        <div class="form-wrap">
          <div class="form-col top">
            <div class="col-one">资料名称</div>
            <div class="col-two">课目名称</div>
            <div class="col-three">进度</div>
            <div class="col-four">
              未完成资料
            </div>
          </div>
          <div class="form-row" :style="{height: tableHight + 'px'}"  v-if="tableData.length > 0">
            <div class="form-col" v-for="(item, index) in tableData" :key="index">
              <div class="col-one">
                <div class="sub-col" v-for="(subItem, subItndex) in item.allDataNameList" :key="subItndex">
                  <p>{{subItem || '--'}}</p>
                </div>
              </div>
              <div class="col-two"><p>{{item.subjectName}}</p></div>
              <div class="col-three c-primary">{{(item.totalProgress).toFixed(2) + ' %' }}</div>
              <div class="col-four">
                <div class="sub-col" v-for="(subItem, subItndex) in item.unLearnDataNameList" :key="subItndex" :style="{height: item.unLearnDataNameList.length > 100 ? '48px' : (100 / item.unLearnDataNameList.length) + '%'}">
                  <p>{{subItem || '--'}}</p>
                </div>
              </div>
            </div>
          </div>
          <div class="form-row nodata" v-else :style="{height: tableHight + 'px'}" >
              暂无数据信息
            </div>

        </div>
        <!-- <Tables
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
        </Tables> -->
      </div>
    </div>
  </div>
</template>

<script>
import { initSubjectlearnLog } from '@/api/learn/api-modules-subjectlearn.js'
import { OPERATE_LIST } from '@/libs/mixin'
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
      tableHight: 0,
      details: {
        alreadyLearnHour: null,
        planLearnHour: null,
        totalSubjectNum: null
      },
      tableData: []
    }
  },
  watch: {
    documentClientHeight: function() {
      this.tableHight = this.documentClientHeight - 245
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
    this.tableHight = this.documentClientHeight - 245
    this.initListData()
  },
  methods: {
    // 获取列表信息
    initListData() {
      this.$nextTick(() => {
        initSubjectlearnLog(this.searchParams).then(res => {
          if (res.data.status) {
            const data = res.data.data
            this.tableData = data.subjectLearnSubList
            if(data.alreadyLearnHour) {
              if(data.alreadyLearnHour < 3600) {
                this.details.alreadyLearnHour = (data.alreadyLearnHour / 60).toFixed(1) + '分钟'
              }else{
                this.details.alreadyLearnHour = (data.alreadyLearnHour / 3600).toFixed(1) + '小时'
              }
            }else{
              this.details.alreadyLearnHour = '--'
            }
            if(data.planLearnHour) {
              if (data.planLearnHour > 3600) {
                let totalTimeBr = data.planLearnHour / 3600
                let totalTimeBr2 = Math.round(totalTimeBr * 10) / 10
                this.details.planLearnHour = totalTimeBr2 + '小时'
              } else {
                let totalTimeBr = data.planLearnHour / 60
                let totalTimeBr2 = Math.round(totalTimeBr * 10) / 10
                this.details.planLearnHour = totalTimeBr2 + '分钟'
              }
            }else{
              this.details.alreadyLearnHour = '--'
            }
            this.details.totalSubjectNum = data.totalSubjectNum
          } else {
          }
        }).catch(() => {
        })
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
      this.$emit('closeDrawer', 1)
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
.detail-top{
  display: flex;
  padding: 15px 0% 25px 0%;
  justify-content: space-between;
  .top-col{
    width: 33%;
    font-size: 16px;
    font-family: Microsoft YaHei;
    p{
      display: flex;
      justify-content: center;
    }
    span{
      font-size: 17px;
      color: #29A387;
      font-weight: bold;
      display: inline-block;
    }
    .num{
      max-width: 63%;
      white-space: nowrap;
      text-overflow: ellipsis;
      overflow: hidden;
    }
  }
}
.form-wrap{
  border: 1px solid #e8eaec;
  .form-col{
    display: flex;
    align-items: stretch;
    border-bottom: none;
    text-align: center;
    line-height: 48px;
    font-size: 15px;
    border-bottom: 1px solid #e8eaec;
    &:nth-child(2n){
      background: #f8f8f9;
    }
    &:last-child{
      // border: none;
    }
    .col-one, .col-two, .col-three,.col-four{
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .sub-col{
        width: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        border-bottom: 1px solid #e8eaec;
        &:last-child{
          border-bottom: none;
        }
        p{
          padding: 0 5px;
          width: 100%;
          word-wrap: break-word;
        }
      }
    .col-one{
      width: 27%;
      border-right: 1px solid #e8eaec;
      flex-flow: column;
      flex-wrap: wrap;
    }
    .col-two{
      width: 27%;
      border-right: 1px solid #e8eaec;
      p{
        padding: 0 5px;
        width: 100%;
        word-wrap: break-word;
      }
    }
    .col-three{
       width: 19%;
      border-right: 1px solid #e8eaec;
      font-weight: bold;
    }
    .col-four{
      width: 27%;
      flex-flow: column;
      flex-wrap: wrap;

    }
  }
  .form-row{
    overflow: hidden;
    overflow-y: auto;
  }
  .top{
    background: #f8f8f9;
    font-weight: bold;
    border-bottom: 1px solid #e8eaec;
  }
  .nodata{
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
  }
}

</style>
