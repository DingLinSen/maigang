<template>
  <div class="home-wrap" :style="{height: defaultHeight}">
    <!-- <Row :gutter="32" index="" class="row">
      <Col span="24" style="height: 100%">
        <div class="col-box">
          <div class="left-one-top">
            <div class="left">
              <div class="left-info-one">
                <div class="img-box">
                <img src="@/assets/images/home/avatar_icon@2x.png" alt="">
              </div>
              <div class="name-box">
                <p>
                  <span>{{name}}</span>
                  <span>普通人员</span>
                </p>
                <p>总公司/济南分公司</p>
              </div>
              </div>
              <div class="left-one-bottom">
                <p>我的任务<span>12</span></p>
                <p>我的考试<span>12</span></p>
                <p>岗位证件</p>
              </div>
            </div>
            <div class="right">
              <p>
                <img src="@/assets/images/home/ranking_icon.png" alt="">
              </p>
              <p>总排行榜</p>
              <p class="num">15</p>
            </div>
          </div>
          <div class="left-two">
            <div class="left">
              <p>截止当前本月学习时长</p>
              <div class="bt">
                <p><span class="num">120</span>小时</p>
                <p>月同比<span class="icon">&nbsp;下</span><span class="rate">12%</span></p>
              </div>
            </div>
            <div class="right">
              <p>近期考核</p>
              <p>
                <span class="num">89</span><span>分</span>（技术学习指导）
              </p>
            </div>
          </div>
        </div>
      </Col>
      <Col span="16" style="padding-right: 0">
        <Row :gutter="32" index="" style="margin-left: 0px;height:45%">
          <Col span="15">
            <div class="col-box">
            </div>
          </Col>
          <Col span="9" style="padding-right: 0"><div class="col-box">3</div></Col>
        </Row>
        <Row :gutter="32" index="" style="margin-left: 0px;height:calc(55% - 16px);margin-top:16px">
          <Col span="13"><div class="col-box">4</div></Col>
          <Col span="11" style="padding-right: 0"><div class="col-box">5</div></Col>
        </Row>
      </Col>
    </Row> -->
    <div class="no-data-img" v-if="isLoading">
      <div>
        <img src="@/assets/images/common/nodata.png" alt="">
        <p>暂无数据信息</p>
      </div>
    </div>
  </div>
</template>

<script>
// import { initHomeList } from '@/api/api-base'
export default {
  name: 'home',
  components: {},
  data() {
    return {
      defaultHeight: 0,
      detialHeight: 0,
      plantData: {
        countNum: '1'
      },
      isLoading: false, // 加载的遮罩
      data: [
        {
          lat: '',
          lng: '',
          type: ''
        }
      ]

    }
  },
  watch: {
    documentClientHeight: function() {
      this.resetTableHeight()
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
    },
    name: {
      get () {
        if(this.$store.state.user) {
          return this.$store.state.user.name
        }else{
          return ''
        }
      }
    }
  },
  created() {
    // this.initData()
  },
  mounted() {
    this.resetTableHeight()
    this.initHomeList()
  },
  methods: {
    resetTableHeight() {
      // 重置窗口可视高度
      this.defaultHeight = this.documentClientHeight - 78 + 'px'
      this.detialHeight = (this.documentClientHeight - 270) / 2 + 'px'
    },
    initHomeList() {
      this.isLoading = false
    //   initHomeList().then(({ data }) => {
    //     if (data.status) {
    //       data.data.forEach(item => {
    //       })
    //     } else {
    //     }
    //     this.isLoading = false
    //   }).catch(() => {
    //     this.isLoading = false
    //   })
    }
  }
}
</script>

<style lang="less" scoped>
@import './home.less';
</style>
