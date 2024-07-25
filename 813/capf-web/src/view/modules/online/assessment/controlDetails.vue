<!--
 * @description subjectlearn- 课目学习主表--新增/编辑查看/界面
 * @author yxm
 * @date 2022-04-07
 * -->
<template>
<!-- :style="{height: controlHight + 'px'}" -->
  <div class="details-container" >
    <div class="control-top">
      <div class="one">
        网上考核>考核控制
      </div>
      <div class="two">
        {{examinationName || '--'}}
      </div>
      <div class="three">
        <span>考场名称：</span>{{examinationName || '--'}} &nbsp;&nbsp;<span>考试单位：</span>{{deptName || '--'}} &nbsp;&nbsp;
      </div>
    </div>
    <!-- :style="{maxHeight: controlHight - 120+ 'px'}" -->
    <div class="control-content" style="max-height: calc(100% - 130px)">
      <div class="card-wrap" v-for="(item, index) in listData" :key="index" >
        <div class="card-top">
          <img class="dec" src="@/assets/images/common/sb_icon.png" alt="">
          <span class="dec-name">{{item.codeNumber}}</span>
          <span class="status on"><img src="@/assets/images/common/online_icon.png" alt="">已上线</span>
          <span class="status off"><img src="@/assets/images/common/offline_icon.png" alt="">强制下线</span>
          <span class="status dowm"><img src="@/assets/images/common/downline_icon.png" alt="">已下线</span>
        </div>
        <div class="card-bottom">
          <div class="card-left">
            <p>
              <span class="name">{{item.userName || '--'}}</span>
              <!-- 0 未认证 1认证 默认0 -->
              <span class="icon">{{item.authIs === '1' ? '已认证' : '未认证'}}</span>
              <span class="sub">所属：</span>
              <span class="dept">{{deptName || '--'}}</span>
            </p>
            <p><span class="sub">当前考试：</span><span class="dept">济南分公司公司制度条例安全</span></p>
          </div>
          <div class="card-right">
             <!-- 0 未考核 1 考核结束 默认0 -->
            <span class="btu">{{item.assStatus ==='1' ? '已交卷' : '未交卷'}}</span>
          </div>
        </div>
      </div>
       <!-- :style="{height: controlHight - 130 + 'px'}" -->
       <div v-if="!listData.length" class="no-data" style="max-height: calc(100% - 140px)">
          <div>
            <img src="@/assets/images/common/nodata.png" alt="">
            <p>暂无数据信息</p>
          </div>
      </div>
    </div>
    <div class="control-bottom" style="height: 60px">
      <div class="btu">认证</div>
      <!-- <div class="btu">考试开始</div>
      <div class="btu">评判试卷</div>
      <div class="btu">发布成绩</div> -->
      <div class="btu" @click="statistical">考核统计</div>
    </div>
    <div slot="drawer">
      <transition name="center-show" mode="in-out">
        <Statistical
          v-if="statisticalModel"
          ref="statisticalModel"
          :detailsId="chooseListData.length === 1 ? chooseListData[0].id : null"
          :routerTitle="this.$route.meta.title"
          @operateSuccess="operateSuccess"
          @closeDrawer="closeDrawer"
          @close="closeComponent"
          @error="error()"
        >
        </Statistical>
      </transition>
    </div>
  </div>
</template>

<script>
import { OPERATE_LIST } from '@/libs/mixin'
import Statistical from './operate/statistical.vue'
import MainNavbar from '../../../wapper/nav/main-navbar.vue'
import { initAccessControlDetailsById } from '@/api/online/control/api-modules-control.js'
export default {
  mixins: [OPERATE_LIST],
  components: {
    Statistical,
    MainNavbar
  },
  data() {
    return {
      controlHight: 0,
      listData: [],
      statisticalModel: false,
      searchParams: {
        assId: null,
        examineRoomId: null
      },
      examinationName: null, // 考场名称
      deptName: null //
    }
  },
  watch: {
    // documentClientHeight: function() {
    //   this.controlHight = this.documentClientHeight - 60
    // }
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
    this.controlHight = this.documentClientHeight - 60
    this.searchParams = this.$route.query
    this.examinationName = this.$route.query.examinationName
    this.deptName = this.$route.query.deptName
    this.initListData()
  },
  methods: {
    collChange(state) { // 缩放按钮点击
      this.sidebarFold = state
    },
    // 获取列表信息
    initListData() {
      // let params = {
      //   assId
      //   examineRoomId
      // }
      initAccessControlDetailsById(this.searchParams).then(res => {
        if (res.data.status) {
          var data = res.data.data
          this.listData = data
        }else{
          this.listData = []
        }
      }).catch(() => {
      })
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
@import './index.less';

</style>
