<!--
 * @description subjectlearn- 课目学习主表--新增/编辑查看/界面
 * @author yxm
 * @date 2022-04-07
 * -->
<template>
  <div class="details-container" style="left: 0; width: 100%;background:#E7EBEE;height: calc(100% + 11px)">
    <div class="learn-top">
      <div class="top-left">
        <div class="url-box">当前位置：在线学习>课目学习</div>
        <div class="title">{{detailsObj.subjectName || '--'}}</div>
      </div>
      <div class="top-right">
        <Icon type="md-close" @click.stop="handleCancleModelSub"/>
      </div>
    </div>
    <div class="learn-content" :style="{height: contentH + 'px'}">
      <div class="content-left" :style="{width: (detailsObj.totalProgress ? 'calc(100% - 340px)' : '100%')}">
        <div class="content-col">
          <div class="title">简介</div>
          <div class="details" style="color:#1C1F21;margin-bottom:0">{{detailsObj.introduction || '--'}}</div>
        </div>
        <div class="content-col" v-for="(item, index) in chapterList" :key="index">
          <div class="title">{{item.chapterTitle}} {{item.chapter}}</div>
          <div class="video-box">
            <div class="video-col" v-for="(subItem, subIndex) in item.subjectLearnSubDataList" :key="subIndex">
              <p>
                <span class="icon iconfont icon-video_icon" v-if="subItem.flag === '2'"></span>
                <span class="icon iconfont icon-wendangicon" v-if="subItem.flag === '1'" ></span>
                {{subItem.flag === '1' ? '文档' : (subItem.flag === '2' ? '视频' : ('')) }}：<span class="dataName" @click="toVideo(item, index, subItem, subIndex)">{{subItem.dataName}}{{subItem.duration ? '（' + getTime(subItem.duration) + '）' : ''}}</span>
              </p>
              <p>{{subItem.speedProgress}}%</p>
            </div>
          </div>
        </div>
      </div>
      <div class="content-right" v-if="detailsObj.totalProgress">
        <div class="content-col">
          <div class="titel-box">
            <p>已学：{{detailsObj.totalProgress + ' %'}}</p><p>学习耗时： {{totalRealTime || '-'}}</p>
          </div>
          <div class="line">
            <p :style="{width: detailsObj.totalProgress + '%'}"></p>
          </div>
          <p class="last" :style="{maxHeight: contentH * 0.45 + 'px'}" v-if="detailsObj.lastLearnDataName">上次学至  {{detailsObj.lastLearnDataName}}</p>
          <div class="btu" @click="toVideoLast"><span class="icon iconfont icon-play_icon"></span>学习</div>
        </div>
      </div>
    </div>
    <div class="video">
      <Drawer title="Basic Drawer" :closable="false" :mask-closable="false" v-model="videoDrawer" width="100vw">
        <Video
        v-if="videoDrawer"
        :leranData= leranData
        @closeDrawer="closeDrawer"
        @leranDataUpdate="leranDataUpdate"
        ></Video>
      </Drawer>
    </div>
  </div>
</template>

<script>
import { OPERATE_LIST } from '@/libs/mixin'
import { initSubjectlearn, operateSubjectlearnPhotoInfo } from '@/api/learn/api-modules-subjectlearn.js'
import Video from './video.vue'
export default {
  mixins: [ OPERATE_LIST ],
  components: {
    Video
  },
  data() {
    return {
      showDrawer: false,
      formData: {},
      searchParams: {// 查询参数
        limit: 10, // 每页数量
        current: 1 // 当前页数
      },
      contentH: 0,
      videoDrawer: false,
      detailsObj: {},
      chapterList: [],
      leranData: {},
      totalRealTime: null,
      lastLearnData: {},
      videoWidth: 400,
      videoHeight: 250,
      imgSrc: '',
      thisCancas: null,
      thisContext: null,
      thisVideo: null,
      cameraList: []
    }
  },
  watch: {
    documentClientHeight: function() {
      this.contentH = this.documentClientHeight - 140
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
    this.contentH = this.documentClientHeight - 140
    this.initFormData()
    // this.getCompetence()
    this.cameraList = []
  },
  props: {
    details: {
      type: Object,
      default: null
    }
  },
  methods: {

    // 根据id 获取详情
    initFormData() {
      let params = {
        id: this.details.id
      }
      this.$nextTick(() => {
        initSubjectlearn(params).then(res => {
          if (res.data.status) {
            const data = res.data.data
            this.detailsObj = data
            this.totalRealTime = this.getTime(this.detailsObj.totalRealTime)
            this.chapterList = data.subjectLearnChapterList
            let chapterData = {}
            let subChapterData = {}
            data.subjectLearnChapterList.forEach((item, index) => {
              if(item.chapterId === data.lastLearnChapterId) {
                chapterData = {
                  index: index,
                  ...item
                }
                item.subjectLearnSubDataList.forEach((subItem, subIndex) => {
                  if(subItem.dataId === data.lastLearnDataId) {
                    subChapterData = {
                      index: subIndex,
                      ...subItem
                    }
                  }
                })
              }
            })
            this.lastLearnData = {
              parentId: this.details.id,
              chapterData: chapterData,
              subChapterData: subChapterData
            }
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
      this.$emit('closeDrawer', 3)
    },
    // 重置条件查询
    handleResearch() {
      this.searchParams = Object.assign(this.searchParams, {
        limit: 10, // 每页数量
        current: 1 // 当前页数
      })
      this.chooseListData = []
      this.initListData()
    },
    initListData() {

    },
    toVideo(item, index, subItem, subIndex) {
      this.leranData = {}
      this.leranData = {
        parentId: this.details.id,
        chapterData: {
          index: index,
          ...item
        },
        subChapterData: {
          index: subIndex,
          ...subItem
        }
      }
      this.videoDrawer = true
    },
    toVideoLast() {
      this.leranData = this.lastLearnData
      this.videoDrawer = true
    },
    closeDrawer() {
      this.videoDrawer = false
      this.initFormData()
    },
    leranDataUpdate(data) {
      this.leranData = data
    },
    getTime(time) {
      // 转换为式分秒
      let h = parseInt(time / 60 / 60 % 24)
      h = h < 10 ? '0' + h : h
      let m = parseInt(time / 60 % 60)
      m = m < 10 ? '0' + m : m
      let s = parseInt(time % 60)
      s = s < 10 ? '0' + s : s
      if(!h || h === '00') {
        return '00:' + m + ':' + s
      }else{
        return h + ':' + m + ':' + s
      }
    }

  }
}
</script>
<style lang="less" scoped>
@import './learn.less';
/deep/.details-content{
  padding: 0px 0 10px 0 !important;
}
/deep/.table-wrap .table-content{
  padding: 10px 0 10px 0 !important;
}
/deep/.ivu-drawer-content{
  background: #1C1F21 !important;
  .ivu-drawer-header{
    display: none !important;
  }
  .ivu-drawer-body{
    padding: 0 !important;
    height: 100% !important;
  }
}
.camera_outer{
    position: relative;
    overflow: hidden;
    background: pink;
    width: 100%;
    height: 280px;
    video,canvas,.tx_img{
      -moz-transform:scaleX(-1);
      -webkit-transform:scaleX(-1);
      -o-transform:scaleX(-1);
      transform:scaleX(-1);
    }
    .btn_camera{
      position: absolute;
      bottom: 4px;
      left: 0;
      right: 0;
      height: 50px;
      background-color: rgba(0,0,0,0.3);
      line-height: 50px;
      text-align: center;
      color: #ffffff;
    }
    .bg_r_img{
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      top: 0;
    }
    .img_bg_camera{
      position: absolute;
      bottom: 0;
      left: 400px;
      right: 0;
      top: 0;
      // img{
      //   width: 100%;
      //   height: 100%;
      // }
      .img_btn_camera{
        position: absolute;
        bottom: 0;
        left: 0;
        right: 0;
        height: 50px;
        line-height: 50px;
        text-align: center;
        background-color: rgba(0,0,0,0.3);
        color: #ffffff;
        .loding_img{
          width: 50px;
          height: 50px;
        }
      }
    }
  }

</style>
