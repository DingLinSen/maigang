 <!-- /**
  * @description 用户管理-编辑页面
  * @author yxm
  * @date 2021-10-19
  */ -->
<template>
  <div class="details-container">
    <div class="control-container" >
      <div class="control-top">
        <div class="one">
          <span>考场名称：</span>{{details.examinationRoomName || '--'}} &nbsp;&nbsp;<span>考试单位：</span>{{details.examinationDeptName || '--'}} &nbsp;&nbsp;
        </div>
        <div class="two">
          {{details.examinationName || '--'}}
        </div>
        <div class="three">
          <Icon type="md-close" @click.stop="handleCancleModel" />
        </div>
      </div>
      <!-- :style="{maxHeight: controlHight - 120+ 'px'}" -->
      <div class="control-content" :style="{maxHeight: controlHight - 120 + 'px'}">
        <div class="card-wrap" v-for="(item, index) in listData" :key="index"  :style="{background: item.userId ? '#ffffff' : '#F4F4F4'}">
          <div class="card-top" style="background: #F9F9F9">
            <div class="left" :style="{borderRight: item.userId ? '1px solid rgba(152, 152, 152, 0.2)' : 'none'}">
              <img class="dec" src="@/assets/images/common/sb_icon.png" alt="" v-if="item.userId">
              <img class="dec" src="@/assets/images/common/sb_offline_icon.png" alt="" v-else>
              <span class="dec-name" :style="{color: item.userId ? '#333333' : '#ABABAB'}">{{item.codeNumber}}</span>
              <span class="status on"  v-if="item.userId"><img src="@/assets/images/common/online_icon.png" alt="">已上线</span>
              <span class="status dowm" v-else><img src="@/assets/images/common/downline_icon.png" alt="" >已下线</span>
              <Button type="error" size="small" @click="forcedOffline(item)"  v-if="item.userId">强制下线</Button>
            </div>
            <div class="right" v-if="item.userId">
              <span class="icon iconfont icon-photo_selected_icon" style="font-size: 22px" @click="takePhoto(item)"></span>
            </div>
          </div>
          <div class="card-bottom" :style="{background: item.userId ? '#ffffff' : '#F4F4F4'}">
            <div class="card-left">
              <p>
                <span class="name" :style="{color: item.userId ? '#222222' : '#ACACAC'}">{{item.userName || '--'}}</span>
                <!-- 0 未认证 1认证 默认0 -->
                <span class="icon" v-if="item.authIs === '1'">已认证</span>
                <span class="icon" v-if="item.authIs === '0'">未认证</span>
                <span class="sub" :style="{color: item.userId ? '#222222' : '#ACACAC'}">所属：</span>
                <span class="dept" :style="{color: item.userId ? '#222222' : '#ACACAC'}">{{item.deptName || '--'}}</span>
              </p>
              <p><span class="sub">当前考试：</span><span class="dept" :style="{color: item.userId ? '#222222' : '#ACACAC'}">{{item.paperName}}</span></p>
            </div>
            <div class="card-right">
              <span class="btu" :style="{color: item.userId ? '#26A386' : '#ACACAC', borderColor: item.userId ? '#26A386' : '#BFBFBF'}">{{item.assStatus ==='1' ? '已交卷' : '未交卷'}}</span>
            </div>
          </div>
        </div>
        <div v-if="!listData.length" class="no-data" :style="{height: controlHight - 130 + 'px'}">
            <div>
              <img src="@/assets/images/common/nodata.png" alt="">
              <p>暂无数据信息</p>
            </div>
        </div>
      </div>
      <div class="control-bottom" style="height: 60px">
        <div class="btu" @click="certification">认证</div>
        <div class="btu" @click="noLogin">未登录人员</div>
        <!-- <div class="btu" @click="statistical">考核统计</div> -->
      </div>
      <div slot="drawer">
        <transition name="center-show" mode="in-out">
          <Statistical
            v-if="statisticalModel"
            ref="statisticalModel"
            :detailsId="this.detailsId"
            @closeDrawer="closeDrawer"
            @close="closeComponent"
            @error="error()"
          >
          </Statistical>
        </transition>
      </div>
      <div slot="drawer">
        <transition name="center-show" mode="in-out">
        </transition>
      </div>
      <Modal
        v-model="loginModal"
        :footer-hide="true"
        :mask-closable="false"
        width="50%"
        title="未登录人员详情表">
        <Nologin
          v-if="loginModal"
          ref="loginModal"
          :detailsId="this.detailsId"
          @closeDrawer="closeDrawer"
          @close="closeComponent"
          @error="error()"
        >
        </Nologin>
      </Modal>
    </div>
  </div>
</template>

<script>
import { OPERATE_PAGE, OPERATE_LIST } from '@/libs/mixin'
import Statistical from './statistical'
import Nologin from './nologin'
import { initAccessControlDetailsById, operatePointInfo, initAssessmentIsStatical } from '@/api/online/control/api-modules-control.js'
import webSocket from '@/libs/websocket.js'
import columnPugins from '../index-column'
export default {
  mixins: [OPERATE_PAGE, OPERATE_LIST],
  components: {
    Nologin,
    Statistical
  },
  data() {
    return {
      showDrawer: false,
      controlHight: 0,
      listData: [],
      statisticalModel: false,
      loginModal: false,
      searchParams: { // 查询参数
        limit: 10, // 条数
        current: 1 // 页数
      }
    }
  },
  activated() {
    this.controlHight = this.documentClientHeight - 60
    let socketUrl = window.SITE_CONFIG.baseUrl + 'socketServer/' + this.userId + '/' + this.detailsId
    const _this = this
    webSocket.openSocket(socketUrl, _this)
    this.initFormData()
  },
  watch: {
    documentClientHeight: function() {
      this.controlHight = this.documentClientHeight - 60
    },
    websocketFlag: function() {
      let data = this.websocketFlag
      // 1 认证 2 考试 3 拍照 4评判试卷 5 发布成绩  6下线 7交卷
      if(!data) {
        return
      }
      if(data.type === 7) {
        this.initFormData()
      }
      if(data.type === 8) {
        this.initFormData()
      }
    }
  },
  props: {
    details: {
      default: null,
      type: Object
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
    userId: {
      get() {
        return this.$store.state.user.userId
      },
      set(val) {
        this.$store.commit('user/userId', val)
      }
    },
    websocketFlag: {
      get() {
        if (this.$store.state.user) {
          return this.$store.state.user.websocketFlag
        }
      }
    }
  },
  mounted() {
    this.tableColumnPugins = columnPugins(this)
    // // websocket刷新
    // this.Bus.$on('assessment', (msg) => {
    // })
  },
  methods: {
    // 初始化表单
    initFormData() {
      let params = {
        assId: this.detailsId,
        examineRoomId: this.details.examinationId
      }
      initAccessControlDetailsById(params).then(res => {
        if (res.data.status) {
          var data = res.data.data
          this.listData = data
          setTimeout(() => {
            this.initFormData()
          }, 1000 * 60)
        }else{
          this.listData = []
        }
      }).catch(() => {
      })
    },
    // 打开抽屉框
    openModel() {
      this.showDrawer = true
      this.initFormData()
    },
    // 获取列表信息
    initListData() {

    },
    statistical() {
      this.statisticalModel = true
    },
    closeDrawer(value) {
      this.statisticalModel = false
      this.loginModal = false
    },
    // 强制下线
    forcedOffline(item) {
      if(item.userId) {
        this.$Message.error('该用户将会被强制下线')
        let params = {
          type: 6,
          messageContent: '强制下线',
          toWho: item.userId,
          token: item.token
        }
        webSocket.sendMessage(JSON.stringify(params))
        setTimeout(() => {
          this.initFormData()
        }, 2000)
      }else{
        this.$Message.error('暂时不能强制下线')
      }
    },
    certification() {
      let params = {
        assId: this.detailsId,
        limit: 10,
        current: 1
      }
      initAssessmentIsStatical(params).then(res => {
        if (res.data.status) {
          var data = res.data
          if(!data.data.length) {
            let params = {
              ...this.details,
              examineDate: this.$moment(this.details.startTime).format('YYYY-MM-DD'),
              examineName: this.details.examinationName,
              examineType: this.details.type,
              paperPoint: this.details.score,
              assessmentId: this.details.id,
              deptId: this.details.examinationDept
            }
            operatePointInfo(params)
              .then(({ data }) => {
                this.$Spin.hide()
                if (data.status) {
                  let subparams = {
                    type: 1,
                    messageContent: {
                      userId: this.userId,
                      assId: this.detailsId,
                      examinePointId: data.data.id
                    },
                    toWho: ''
                  }
                  webSocket.sendMessage(JSON.stringify(subparams))
                  this.$Message.success('发送认证成功')
                } else {
                  this.$Message.error('发送认证失败，请重新发送')
                }
              })
              .catch(() => {})
          }else{
            let subparams = {
              type: 1,
              messageContent: {
                userId: this.userId,
                assId: this.detailsId,
                examinePointId: data.data[0].id
              },
              toWho: ''
            }
            webSocket.sendMessage(JSON.stringify(subparams))
            this.$Message.success('发送认证成功')
          }
        }else{
          this.loading = false
          this.listData = []
        }
      }).catch(() => {
        this.loading = false
      })
    },
    noLogin() {
      this.loginModal = true
    },
    operateSuccess() {

    },
    // 主动照相环节
    takePhoto(item) {
      this.$Message.success('拍照要求发送成功')
      let subparams = {
        type: 3,
        messageContent: {
          assId: this.detailsId
        },
        toWho: item.userId
      }
      webSocket.sendMessage(JSON.stringify(subparams))
    },
    // 关闭弹窗
    handleCancleModel() {
      this.showDrawer = false
      this.$emit('closeDrawer', 1)
    }
  }
}
</script>
<style>
.demo-drawer-footer {
  width: 100%;
  padding: 10px 16px;
  text-align: right;
  background: #fff;
}

</style>
<style lang="less" scoped>
@import '../index.less';
/deep/.ivu-checkbox-group-item{
  min-width: 100px;
  padding-left: 15px;
}
</style>
