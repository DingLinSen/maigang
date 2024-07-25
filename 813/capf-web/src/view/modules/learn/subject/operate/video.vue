<template>
  <div class="video-wrap" ref="wrap" style="height: calc(100vh - 62px)">
    <div class="video-top" >
      <div class="top-left">
        <span class="back" @click="returnLearn"><span class="icon iconfont icon-return_icon" style="color:#999999"></span></span>
        <span class="title">{{leranData.subChapterData.dataName}}</span>
        <span class="time" v-if="allTime">（{{allTime}}）</span>
      </div>
      <div class="top-right">
        <div class="sub-box">
            <div class="info-box">
              <img class="img-circle login-header-img" src="~@/assets/images/common/avatar_icon.png" alt="">{{name}}
            </div>
            <div class="icon-box">
              <i class='icon iconfont icon-out_icon' @click="logout()"></i><span @click="logout()">退出</span>
            </div>
          </div>
      </div>
    </div>
    <div class="video-content" >
      <div class="conent-left" ref="left" >
        <!-- 视频学习 -->
        <div class="video-box" :style="{width: width + 'px'}" v-if="leranData.subChapterData.flag === '2' && videoUrl">
          <video-player  class="video-player vjs-custom-skin"
            ref="videoPlayer"
            :style="{height: height + 'px', width: width + 'px'}"
            :playsinline="true"
            :options="playerOptions"
            @loadeddata="onPlayerLoadeddata($event)"
            @canplay="canplay($event)"
            @play="play($event)"
            @pause="pause($event)"
            @ended="onPlayerEnded"
            @timeupdate="timeupdate($event)"
            @seeking="seeked"
          ></video-player>
        </div>
        <!-- 文件学习 -->
        <div class="text-box" :style="{width: width + 10 + 'px', height: height + 60 + 'px'}" v-if="leranData.subChapterData.flag === '1'">
          <!-- pdf学习 -->
          <div class="page-container" v-if="pdfsrc && /\.pdf|\.docx/.test(pdfsrc.toLowerCase())">
            <div class="main" style="height: calc(100% - 50px);">
              <pdf
              :src="pdfsrc"
              :page="currentPage"
              @progress="loadedRatio = $event"
              @loaded="loadPdfHandler"
              @num-pages="pageCount=$event"
              @page-loaded="currentPage=$event"
              ref="pdfWrapper"
              class="pdf"></pdf>
            </div>
            <ul class="footers">
              <li :class="{select:pdfIndex==0}" @touchstart="pdfIndex=0" @touchend="pdfIndex=-1" @click="scaleD" :style="{color: scale < 200 ? '#333' : '#BBBCBC'}">
                <p class="more-p">放大</p>
              </li>
              <li :class="{select:pdfIndex==1}" @touchstart="pdfIndex=1" @touchend="pdfIndex=-1" @click="scaleX" :style="{color: scale > 100 ? '#333' : '#BBBCBC'}">
                <p class="small-p">缩小</p>
              </li>
              <li :class="{select:pdfIndex==2}" @touchstart="pdfIndex=2" @touchend="pdfIndex=-1" @click="changePdfPage(0)" :style="{color: currentPage > 1 ? '#333' : '#BBBCBC'}">
                <p class="up-p" v-if="pageCount > 1">上一页</p>
              </li>
              <li :class="{select:pdfIndex==3}" @touchstart="pdfIndex=3" @touchend="pdfIndex=-1" @click="changePdfPage(1)"  :style="{color: (currentPage < pageCount && isTwoMinutes) ? '#333' : '#BBBCBC'}">
                <p class="down-p">
                  <span v-if="!isTwoMinutes">{{countdown}}秒</span>
                  <span v-if="isTwoMinutes" style="cursor: pointer;">下一页</span>
                </p>
              </li>
              <li>
                <p style="margin-left:10px">第<span style="font-weight: bold;color:#333;"> {{ currentPage }} </span>页 / 共<span class="c-red" style="font-weight: bold"> {{ pageCount }} </span>页</p>
              </li>
            </ul>
          </div>
          <!-- ppt、png学习 -->
          <div v-if="pdfsrc && (/\.ppt|\.pptx/.test(pdfsrc.toLowerCase()) || (/\.png|\.jpg|\.jpeg|\.bmp/.test(pdfsrc.toLowerCase())))" class="img-privew" style="width: 100%;;height: 100%">
            <div class="img-box" style="height: calc(100% - 50px);width: 100%;text-align: center;display: flex;;align-items: center; justify-content: center;overflow: auto;">
              <img :src="pngSrc" style="height: 100%" ref="imgref">
            </div>
            <ul class="footers">
              <li  @click="scaleD(1)" :style="{color: scale < 200 ? '#333' : '#BBBCBC'}">
                <p class="more-p">放大</p>
              </li>
              <li  @click="scaleX(1)" :style="{color: scale > 100 ? '#333' : '#BBBCBC'}">
                <p class="small-p">缩小</p>
              </li>
              <li  @click="changeImgPage(0)" :style="{color: currentPage > 1 ? '#333' : '#BBBCBC'}">
                <p class="up-p" v-if="pageCount > 1">上一页</p>
              </li>
              <li @click="changeImgPage(1)" :style="{color: (currentPage < pageCount && isTwoMinutes) ? '#333' : '#BBBCBC'}">
                <span v-if="countdown && countdown > 0">{{countdown}}秒</span>
                <span v-if="countdown < 1 && pageCount > 1 " style="cursor: pointer;">下一页</span>
              </li>
              <li>
                <p style="margin-left:10px">第<span style="font-weight: bold;color:#333;"> {{ currentPage}} </span>页 / 共<span class="c-red" style="font-weight: bold"> {{ pageCount }} </span>页</p>
              </li>
            </ul>
          </div>
          <!-- word学习 -->
          <!-- <div  v-if="pdfsrc && /\.docx/.test(pdfsrc.toLowerCase())" class="img-privew" style="width: 100%;;height: 100%">
            <Preview
              v-if="pdfsrc"
              style="height: 100;width: 100%"
              ref="documentDetails"
              :title="leranData.subChapterData.dataName"
              :url="pdfsrc"
              :isPdf="true"
              :fileName="leranData.subChapterData.filePath"
              :defaultHeight="800"
            ></Preview>
          </div> -->
        </div>
      </div>
      <div class="conent-right" :style="{width: widthRight + 'px',height: height + 'px'}" ref="conentRight">
        <div class="title">{{detailsObj.subjectName || '--'}}</div>
        <div class="intr">{{detailsObj.introduction || '--'}} </div>
        <div class="subiect" v-for="(item, index) in chapterList" :key="index">
          <p class="name">{{item.chapterTitle}} {{item.chapter}}</p>
          <div  v-for="(subItem, subIndex) in item.subjectLearnSubDataList" :key="subIndex" :class="(index === leranData.chapterData.index && subIndex === leranData.subChapterData.index) ? 'video-col is-active' : 'video-col'">
            <p class="sub-name">
              <span class="icon iconfont icon-video_icon" v-if="subItem.flag === '2'"></span>
              <span class="icon iconfont icon-wendangicon" v-if="subItem.flag === '1'" ></span>
              <span class="flag">{{subItem.flag === '1' ? '文档' : (subItem.flag === '2' ? '视频' : ('')) }}：</span>
              <span class="dataName" @click="toNext(item, index, subItem, subIndex)">{{subItem.dataName}}{{subItem.duration ? '（' + getTime(subItem.duration) + '）' : ''}}</span>
            </p>
          </div>
        </div>
      </div>
    </div>
    <div class="camera_outer">
      <video id="videoCamera" autoplay style="height: 0"></video>
      <canvas style="display:none;" id="canvasCamera" :width="videoWidth" :height="videoHeight" ></canvas>
    </div>
    <!-- :closable="false" :footer-hide="true" -->
    <Modal v-model="confirmModel" title="继续学习" :closable="false" :footer-hide="true" :mask-closable="false">
      <p>是否继续学习</p>
      <p style="text-align:center">
        <Button type="success" size="small" @click="handleContinue">确定</Button>
      </p>
    </Modal>
  </div>
</template>

<script>
import { OPERATE_LIST } from '@/libs/mixin'
import { videoPlayer } from 'vue-video-player'
import 'video.js/dist/video-js.css'
import { initSubjectlearn, operateSubjectlearnInfo, operateSubjectlearnPhotoInfo } from '@/api/learn/api-modules-subjectlearn.js'
import pdf from 'vue-pdf'
import Preview from './document.vue'
import { userLogout } from '@/api/api-base'
import { clearLoginInfo } from '@/utils'

export default {
  mixins: [OPERATE_LIST],
  components: {
    videoPlayer,
    pdf,
    Preview
  },
  data() {
    return {
      currentPage: 0, // 当前页码
      pageCount: 0, // 总页码
      scale: 100, // pdf放大尺寸
      pdfIndex: -1, //
      loadedRatio: 0,
      pdfsrc: '', // pdf路径
      confirmModel: false, // 确认弹框
      detailsObj: {}, // 全局信息
      chapterList: [], // 右侧章节信息
      duration: 0, // 视频总时长
      lastTime: 0, // 上次学习的时间用于监听拖动进度条
      allTime: 0, // 视频学习总时长
      videoUrl: '',
      player: null, // 视频播放器插件
      height: 0, // 播放器高度
      width: 0, // 播放器宽度
      widthRight: 400, // 右侧简介宽度
      playerOptions: { // 视频插件
        autoplay: false, // 是否自动播放
        muted: false, // 默认音量为静音
        language: 'zh-CN',
        playbackRates: [1],
        // playbackRates: [ 0.75, 1.0, 1.25, 1.5, 2.0 ], // 倍数
        sources: [{ // 视频data
          type: 'video/ogg',
          // type: 'video/webm',
          // type: 'video/mp4',
          src: ''

        }],
        fluid: false, // 当true时，Video.js player将拥有流体大小。换句话说，它将按比例缩放以适应其容器。
        flash: { hls: {withCredentials: false} }, // 可以使用rtmp视频
        html5: { hls: {withCredentials: false} }, // 可以使用m3u8视频
        loop: false, // 导致视频一结束就重新开始。
        preload: 'auto', // 建议浏览器在<video>加载元素后是否应该开始下载视频数据。auto浏览器选择最佳行为,立即开始加载视频（如果浏览器支持）
        aspectRatio: '16:9', // 将播放器置于流畅模式，并在计算播放器的动态大小时使用该值。值应该代表一个比例 - 用冒号分隔的两个数字（例如"16:9"或"4:3"）
        poster: require('@/assets/images/common/video_bg.png'), // 你的封面地址
        notSupportedMessage: '浏览器不支持使用video标签/此视频暂无法播放，请稍后再试',
        controlBar: {
          timeDivider: true, // 当前时间和持续时间的分隔符
          durationDisplay: true, // 显示持续时间
          remainingTimeDisplay: true, // 是否显示剩余时间功能
          fullscreenToggle: true // 是否显示全屏按钮
        }
      },
      pageOpenTime: 0, // 页面打开是的时间
      pageCloseTime: 0, // 页面关闭时的时间
      browserTabTime: 0, // 浏览器切换的时间
      imgList: [], // 预览ppt集合
      pngSrc: '',
      lastLearnPage: null, // 上次学习的进度
      isTwoMinutes: null, // 两分钟计时器
      photoTimerInterval: null, // 定时器名称五分钟拍一次照计时器
      countdown: 0, // 倒计时
      fiveTimes: null, // 5分钟倒计时
      twoTimes: null, // 两分钟倒计时
      fiveNum: 0, // 倒计时五分钟
      lastRealTime: 0, // 上次耗时
      // 拍照
      cameraUrl: null,
      videoWidth: 400,
      videoHeight: 255,
      thisCancas: null,
      thisContext: null,
      thisVideo: null
    }
  },
  props: {
    leranData: {
      type: Object,
      default: null
    }
  },
  computed: {
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
    //  document.oncontextmenu = function () { return true }
    document.addEventListener('visibilitychange', () => {
      window.clearInterval(this.fiveTimes)
      if(document.visibilityState === 'hidden') { // 离开当前tab标签
        window.clearInterval(this.photoTimerInterval)
        window.clearInterval(this.twoTimes)
        console.log(this.countdown);
        this.pageCloseTime = (new Date()).getTime()
        let time = 0
        localStorage.setItem('currentTime', time)
        if(this.pageOpenTime) {
          time = (this.pageCloseTime - this.pageOpenTime) / 1000
        }
        localStorage.setItem('browserTabTime', time) // 设置name为john
        if(this.leranData.subChapterData.flag === '2' && this.player && !this.confirmModel) {
          this.player.pause()
        }
        this.stopNavigator()
      }else {
        // 实时刷新时间单位为毫秒
        this.photoTimerInterval = setInterval(() => {
          this.getCompetence()
          if(this.isCamera) {
            setTimeout(() => {
              this.setImage()
            }, 1000)
          }
        }, 1000 * 60 * 5)
        if(!this.isTwoMinutes && this.leranData.subChapterData.flag === '1') {
          this.isTwoMinutes = false
          this.countdown = 120 // 赋值
          this.twoTimes = setInterval(() => {
            this.countdown-- // 递减
            if (this.countdown === 0) {
              this.isTwoMinutes = true
              // <=0 变成获取按钮
              window.clearInterval(this.twoTimes)
            }
          }, 1000) // 1000毫秒后执行
        }
        this.pageOpenTime = (new Date()).getTime()
        if(this.leranData.subChapterData.flag === '2' && this.player && !this.confirmModel) {
          this.player.play()
        }
      }
    })
    window.onbeforeunload = function(e) {
      this.updated()
      // var e = window.event || e
      // e.returnValue = ('是否确定关闭页面')
    }
  },
  mounted() {
    this.resetClientHeight()
    window.addEventListener('resize', this.resetClientHeight)
    this.initData()
    // 实时刷新时间单位为毫秒
    this.photoTimerInterval = setInterval(() => {
      this.getCompetence()
      if(this.isCamera) {
        setTimeout(() => {
          this.setImage()
        }, 1000)
      }
    }, 1000 * 60 * 5)
  },
  watch: {
    // duration: {
    //   deep: true,
    //   handler() {
    //     if(this.duration) {
    //       // this.continuePlay()
    //       this.player.play()
    //       this.player.currentTime(this.leranData.subChapterData.progressTime)
    //     }
    //   }
    // },
    leranData: {
      handler() {
        let _this = this
        if(_this.leranData.parentId) {
          _this.initData()
        }
      },
      deep: true
    }
  },
  methods: {
    // 重置窗口高度
    resetClientHeight() {
      if(this.$refs.wrap) {
        this.height = this.$refs.wrap.clientHeight - 60 - 30
        this.width = this.height * 1.79
        this.widthRight = this.$refs.wrap.clientWidth - this.width - 40
      }
    },
    // 初始化数据
    initData() {
      this.duration = 0
      this.pageCount = 0
      this.currentPage = 1
      this.scale = 100
      this.pageOpenTime = (new Date()).getTime()
      localStorage.setItem('browserTabTime', 0)
      let params = {
        id: this.leranData.parentId
      }
      this.$nextTick(() => {
        initSubjectlearn(params).then(res => {
          if (res.data.status) {
            const data = res.data.data
            this.lastRealTime = this.leranData.subChapterData.realTime
            if(this.leranData.subChapterData.flag === '2') { // 视频
              this.player = null
              this.videoUrl = window.SITE_CONFIG.downFileUrl + this.leranData.subChapterData.filePath
              this.duration = this.leranData.subChapterData.duration
              this.allTime = this.duration ? this.getTime(this.duration) : null
              this.playerOptions.sources[0].src = this.videoUrl
              this.lastLearnPage = this.leranData.subChapterData.progressTime
            }else{
              // this.player = null
              let filePath = this.leranData.subChapterData.filePath
              this.pdfsrc = this.leranData.subChapterData.filePath
              let type = filePath.substring(filePath.lastIndexOf('.') + 1)
              this.countdown = 120 // 赋值
              this.twoTimes = setInterval(() => {
                this.countdown-- // 递减
                if (this.countdown < 1) {
                  this.isTwoMinutes = true
                  // <=0 变成获取按钮
                  window.clearInterval(this.twoTimes)
                }
              }, 1000) // 1000毫秒后执行

              if(type === 'png' || type === 'jpg' || type === 'jpeg') {
                this.currentPage = 1
                this.pageCount = 1
                this.pngSrc = window.SITE_CONFIG.downFileUrl + this.leranData.subChapterData.filePath
                this.lastLearnPage = this.leranData.subChapterData.progressPage
                this.imgList = [
                  {
                    filePath: filePath,
                    id: '1000202'
                  }
                ]
              }else if(type === 'pptx' || type === 'ppt') {
                this.pdfsrc = this.leranData.subChapterData.filePath
                if(this.leranData.subChapterData.dataFileSubList.length) {
                  this.imgList = this.leranData.subChapterData.dataFileSubList
                  this.currentPage = this.leranData.subChapterData.progressPage ? Number(this.leranData.subChapterData.progressPage) : 1
                  this.lastLearnPage = this.leranData.subChapterData.progressPage
                  this.pngSrc = window.SITE_CONFIG.downFileUrlSub + this.imgList[this.currentPage - 1].filePath
                  this.pageCount = this.imgList.length
                }
              }else if(type === 'docx') {
                let url = ''
                if(this.leranData.subChapterData.dataFileSubList.length) {
                  url = this.leranData.subChapterData.dataFileSubList[0].filePath
                }
                this.pdfsrc = window.SITE_CONFIG.downFileUrlSub + url
                this.lastLearnPage = this.leranData.subChapterData.progressPage ? Number(this.leranData.subChapterData.progressPage) : 0
                this.currentPage = this.leranData.subChapterData.progressPage ? Number(this.leranData.subChapterData.progressPage) : 1
              }else{
                this.pdfsrc = window.SITE_CONFIG.downFileUrl + this.leranData.subChapterData.filePath
                this.lastLearnPage = this.leranData.subChapterData.progressPage ? Number(this.leranData.subChapterData.progressPage) : 0
                this.currentPage = this.leranData.subChapterData.progressPage ? Number(this.leranData.subChapterData.progressPage) : 1
              }
            }

            this.detailsObj = data
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

    // ==================视频学习=========================
    // 视频加载完毕
    onPlayerLoadeddata(player) {
      if(player) {
        this.player = player
        player.currentTime(this.leranData.subChapterData.progressTime)
        setTimeout(() => {
          player.play()
        }, 300)
      }
    },

    loop(currentTime) { // 视频轮询以计算播放时间
    },
    // 默认加载之后，就会执行该函数
    canplay(player) {
      // console.log('默认加载之后，就会执行该函数')
    },
    // 点击视频播放
    play(player) {
      var timeNum = 300
      clearInterval(this.fiveTimes)
      this.fiveTimes = setInterval(() => {
        timeNum-- // 递减
        if (timeNum === 0) {
          clearInterval(this.fiveTimes)
          if(this.player && this.leranData.subChapterData.flag === '2') {
            this.lastTime = this.player.cache_.currentTime
            if(this.lastLearnPage < this.player.cache_.currentTime) {
              this.lastLearnPage = this.player.cache_.currentTime
            }
            if(!this.confirmModel) {
              this.confirmModel = true
              this.player.pause()
              this.updated()
            }
          }
        }
      }, 1000) // 1000毫秒后执行
    },
    // 点击暂停时触发
    pause(player) {
      // console.log('点击暂停 ' + player.cache_.currentTime)
    },
    onPlayerEnded(player) {
      this.pageCloseTime = (new Date()).getTime()
      let rate = null
      var currentTime = null
      let backProgressTime = null
      if(this.player && this.leranData.subChapterData.flag === '2') {
        currentTime = player.cache_.currentTime > this.duration ? this.duration : player.cache_.currentTime
        if(Number(this.lastLearnPage) < currentTime) { // 本次学习比上次快才会记录
          rate = ((currentTime / this.duration)) * 100
        }else{
          backProgressTime = currentTime
          currentTime = null
        }
        this.lastLearnPage = currentTime
        let time = (this.pageCloseTime - this.pageOpenTime) ? (this.pageCloseTime - this.pageOpenTime) / 1000 : 0
        var realTime = time + (this.lastRealTime ? Number(this.lastRealTime) : 0) + (localStorage.getItem('browserTabTime') ? Number(localStorage.getItem('browserTabTime')) : 0)
        realTime = realTime ? realTime.toFixed(0) : 0
        let params = {
          id: this.leranData.parentId, //
          isOperate: true,
          lastLearnDataId: this.leranData.subChapterData.dataId,
          lastLearnChapterId: this.leranData.subChapterData.chapterId,
          lastLearnDataName: this.leranData.subChapterData.dataName,
          subjectLearnSubList: [
            {
              backProgressPage: null,
              backProgressTime: backProgressTime, // 回退时间
              id: this.leranData.subChapterData.subjectLearnSubId,
              progressPage: null,
              progressTime: currentTime, // 视频学习时间进度条
              realTime: realTime, // 实际耗时
              speedProgress: rate ? (rate > 100 ? '100' : rate.toFixed(2)) : null, // 进度：百分比
              subjectLearnId: this.leranData.subChapterData.subjectLearnId
            }
          ]
        }
        this.lastLearnPage = this.lastTime
        operateSubjectlearnInfo(params).then(res => {
          if (res.data.status) {
            this.lastRealTime = realTime
            this.pageOpenTime = (new Date()).getTime()
            localStorage.setItem('browserTabTime', 0) // 设置name为john
            clearInterval(this.fiveTimes)
          } else {
          }
        }).catch(() => {
        })
      }
    },
    // 元素的currentTime发生变化时触发 禁止视频快进
    timeupdate(player) {
      // 五分钟确认一下
      this.curr = player.cache_.currentTime
      if(this.curr > this.lastLearnPage) { // 超出学习记录不让快进
        // 限制快进
        if(this.curr - this.lastTime > 0.4) {
          if(this.curr > this.lastLearnPage) {
            this.player.currentTime(this.lastTime)
          }else{
            this.lastTime = this.curr
          }
        } else {
          this.lastTime = this.curr
        }
      }else{
        if (this.lastTime > this.curr && this.lastTime > this.lastLearnPage) {
          this.pageCloseTime = (new Date()).getTime()
          let rate = null
          var currentTime = null
          let backProgressTime = null
          if(this.player && this.leranData.subChapterData.flag === '2') {
            currentTime = this.lastTime > this.duration ? this.duration : this.lastTime
            if(Number(this.lastLearnPage) < currentTime) { // 本次学习比上次快才会记录
              rate = ((currentTime / this.duration)) * 100
            }else{
              backProgressTime = currentTime
              currentTime = null
            }
            this.lastLearnPage = currentTime
            let time = (this.pageCloseTime - this.pageOpenTime) ? (this.pageCloseTime - this.pageOpenTime) / 1000 : 0
            var realTime = time + (this.lastRealTime ? Number(this.lastRealTime) : 0) + (localStorage.getItem('browserTabTime') ? Number(localStorage.getItem('browserTabTime')) : 0)
            realTime = realTime ? realTime.toFixed(0) : 0
            let params = {
              id: this.leranData.parentId, //
              isOperate: true,
              lastLearnDataId: this.leranData.subChapterData.dataId,
              lastLearnChapterId: this.leranData.subChapterData.chapterId,
              lastLearnDataName: this.leranData.subChapterData.dataName,
              subjectLearnSubList: [
                {
                  backProgressPage: null,
                  backProgressTime: backProgressTime, // 回退时间
                  id: this.leranData.subChapterData.subjectLearnSubId,
                  progressPage: null,
                  progressTime: currentTime, // 视频学习时间进度条
                  realTime: realTime, // 实际耗时
                  speedProgress: rate ? (rate > 100 ? '100' : rate.toFixed(2)) : null, // 进度：百分比
                  subjectLearnId: this.leranData.subChapterData.subjectLearnId
                }
              ]
            }
            this.lastLearnPage = this.lastTime
            // this.lastTime = this.curr
            operateSubjectlearnInfo(params).then(res => {
              if (res.data.status) {
                this.pageOpenTime = (new Date()).getTime()
                localStorage.setItem('browserTabTime', 0) // 设置name为john
                this.lastRealTime = realTime
              } else {
              }
            }).catch(() => {
            })
          }
        }else{
          this.lastTime = this.curr
        }
      }
    },
    // 每次学习五分钟
    handleContinue() {
      this.player.play()
      this.confirmModel = false
      this.player.currentTime(this.lastTime)
    },
    seeked() { // 跳跃操作完成时触发
      // console.log('跳跃操作完成时触发')
    },
    // 视频学习全屏功能
    fullScreen() {
      const player = this.$refs.videoPlayer.player
      player.requestFullscreen()// 调用全屏api方法
      player.isFullscreen(true)
      player.play()
    },
    // ==========================图片集合学习==================
    // 改变PDF页码,val传过来区分上一页下一页的值,0上一页,1下一页
    changePdfPage(val) {
      if(val === 0 && this.currentPage > 1) { // 上一页
        window.clearInterval(this.twoTimes)
        if(this.leranData.subChapterData.progressPage < this.currentPage) {
          if(this.isTwoMinutes) {
            this.lastLearnPage = this.currentPage
          }else{
            this.lastLearnPage = this.currentPage - 1
          }
          this.updated()
          this.isTwoMinutes = true
          this.currentPage--
          this.countdown = 0
        }else{
          this.isTwoMinutes = true
          this.currentPage--
          this.countdown = 0
        }
      }
      if(val === 1 && this.currentPage < this.pageCount) {
        if(this.leranData.subChapterData.progressPage <= this.currentPage) {
          if(!this.isTwoMinutes) {
            this.$Message.warning('每页学习时长不少于两分钟')
            return
          }
          this.currentPage++
          this.isTwoMinutes = false
          this.countdown = 120 // 赋值
          this.twoTimes = setInterval(() => {
            this.countdown-- // 递减
            if (this.countdown < 1) {
              this.isTwoMinutes = true
              // <=0 变成获取按钮
              window.clearInterval(this.twoTimes)
            }
          }, 1000) // 1000毫秒后执行
        }else{
          this.currentPage++
          this.countdown = 0
          this.isTwoMinutes = true
        }
      }
    },
    // pdf加载时
    loadPdfHandler(e) {
      this.currentPage = 1 // 加载的时候先加载第一页
    },
    // pdf放大
    scaleD(val) {
      if(this.scale < 200) {
        if(val === 1) {
          this.$refs.imgref.style.width = parseInt(this.scale) + '%'
          this.$refs.imgref.style.height = parseInt(this.scale) + '%'
        }else{
          this.$refs.pdfWrapper.$el.style.width = parseInt(this.scale) + '%'
        }
        this.scale += 5
      }
    },

    // pdf缩小
    scaleX(val) {
      // eslint-disable-next-line eqeqeq
      if(this.scale == 100) {
        this.$refs.imgref.style.width = null
        this.$refs.imgref.style.height = '100%'
        return
      }
      this.scale += -5
      if(val === 1) {
        this.$refs.imgref.style.width = parseInt(this.scale) + '%'
        this.$refs.imgref.style.height = parseInt(this.scale) + '%'
      }else{
        this.$refs.pdfWrapper.$el.style.width = parseInt(this.scale) + '%'
      }
    },
    // =====================预览图片数组======================
    changeImgPage(val) {
      if(val === 0 && this.currentPage > 1) { // 上一页
        window.clearInterval(this.twoTimes)
        if(this.leranData.subChapterData.progressPage < this.currentPage) {
          if(this.isTwoMinutes) {
            this.lastLearnPage = this.currentPage
          }else{
            this.lastLearnPage = this.currentPage - 1
          }
          this.updated()
          this.isTwoMinutes = true
          this.currentPage--
          this.pngSrc = window.SITE_CONFIG.downFileUrlSub + this.imgList[this.currentPage - 1].filePath
          this.countdown = 0
        }else{
          this.isTwoMinutes = true
          this.currentPage--
          this.pngSrc = window.SITE_CONFIG.downFileUrlSub + this.imgList[this.currentPage - 1].filePath
          this.countdown = 0
        }
      }
      if(val === 1 && this.currentPage < this.pageCount) {
        if(this.leranData.subChapterData.progressPage <= this.currentPage) {
          if(!this.isTwoMinutes) {
            this.$Message.warning('每页学习时长不少于两分钟')
            return
          }
          this.currentPage++
          this.pngSrc = window.SITE_CONFIG.downFileUrlSub + this.imgList[this.currentPage - 1].filePath
          this.isTwoMinutes = false
          this.countdown = 120 // 赋值
          this.twoTimes = setInterval(() => {
            this.countdown-- // 递减
            if (this.countdown < 1) {
              this.isTwoMinutes = true
              // <=0 变成获取按钮
              window.clearInterval(this.twoTimes)
            }
          }, 1000) // 1000毫秒后执行
        }else{
          this.currentPage++
          this.countdown = 0
          this.isTwoMinutes = true
        }
      }
    },
    // 转换为式分秒
    getTime(time) {
      let h = parseInt(time / 60 / 60 % 24)
      h = h < 10 ? '0' + h : h
      let m = parseInt(time / 60 % 60)
      m = m < 10 ? '0' + m : m
      let s = parseInt(time % 60)
      s = s < 10 ? '0' + s : s
      if(!h || h === '00') {
        return m + ':' + s
      }else{
        return h + ':' + m + ':' + s
      }
    },

    // 更新学习进度
    updated () {
      this.pageCloseTime = (new Date()).getTime()
      let rate = null
      var currentTime = null
      let currentPage = null
      let backProgressPage = null
      let backProgressTime = null
      if(this.player && this.leranData.subChapterData.flag === '2') {
        currentTime = this.player.cache_.currentTime > this.duration ? this.duration : this.player.cache_.currentTime
        if(Number(this.lastLearnPage) <= currentTime) { // 本次学习比上次快才会记录
          rate = ((currentTime / this.duration)) * 100
        }else{
          backProgressTime = currentTime
          currentTime = null
        }
      }else{
        let type = this.pdfsrc.substring(this.pdfsrc.lastIndexOf('.') + 1)
        if(type === 'pdf' || type === 'pptx' || type === 'docx' || type === 'ppt') {
          if(this.pageCount) {
            // 本次学习比上次快才会记录
            if(Number(this.lastLearnPage) < this.currentPage) {
              if(this.isTwoMinutes) {
                currentPage = this.currentPage
                rate = (this.currentPage / this.pageCount) * 100
              }else{
                currentPage = this.currentPage - 1
                rate = ((this.currentPage - 1) / this.pageCount) * 100
              }
            }else{
              backProgressPage = this.currentPage
            }
          }else{
            currentPage = null
            rate = null
          }
        }else if(type === 'png' || type === 'jpg' || type === 'jpeg') {
          if(this.isTwoMinutes) {
            currentPage = 1
            rate = 100
          }else{
            if(this.lastLearnPage > 0) {
              currentPage = 1
              rate = 100
            }else{
              currentPage = 0
              rate = 0
            }
          }
        }
      }
      let time = (this.pageCloseTime - this.pageOpenTime) ? (this.pageCloseTime - this.pageOpenTime) / 1000 : 0
      var realTime = time + (this.lastRealTime ? Number(this.lastRealTime) : 0) + (localStorage.getItem('browserTabTime') ? Number(localStorage.getItem('browserTabTime')) : 0)
      realTime = realTime ? realTime.toFixed(0) : 0
      let params = {
        id: this.leranData.parentId, //
        isOperate: true,
        lastLearnDataId: this.leranData.subChapterData.dataId,
        lastLearnChapterId: this.leranData.subChapterData.chapterId,
        lastLearnDataName: this.leranData.subChapterData.dataName,
        subjectLearnSubList: [
          {
            backProgressPage: backProgressPage,
            backProgressTime: backProgressTime, // 回退时间
            id: this.leranData.subChapterData.subjectLearnSubId,
            progressPage: currentPage || null,
            progressTime: currentTime, // 视频学习时间进度条
            realTime: realTime, // 实际耗时
            speedProgress: rate ? (rate > 100 ? '100' : rate.toFixed(2)) : null, // 进度：百分比
            subjectLearnId: this.leranData.subChapterData.subjectLearnId
          }
        ]
      }
      operateSubjectlearnInfo(params).then(res => {
        if (res.data.status) {
          this.lastRealTime = realTime
          this.pageOpenTime = (new Date()).getTime()
        } else {
        }
      }).catch(() => {
      })
    },
    // 当前页点击各个资料之间进行切换
    toNext(item, index, subItem, subIndex) {
      // this.$emit('leranDataUpdate', leranData)
      window.clearInterval(this.fiveTimes)
      window.clearInterval(this.twoTimes)
      let leranData = {
        parentId: this.leranData.parentId,
        chapterData: {
          index: index,
          ...item
        },
        subChapterData: {
          index: subIndex,
          ...subItem
        }
      }
      this.pageCloseTime = (new Date()).getTime()
      let rate = null
      var currentTime = null
      let currentPage = null
      let backProgressPage = null
      let backProgressTime = null
      if(this.player && this.leranData.subChapterData.flag === '2') {
        currentTime = this.player.cache_.currentTime > this.duration ? this.duration : this.player.cache_.currentTime
        if(Number(this.lastLearnPage) < currentTime) { // 本次学习比上次快才会记录
          rate = ((currentTime / this.duration)) * 100
        }else{
          backProgressTime = currentTime
          currentTime = null
        }
      }else{
        let type = this.pdfsrc.substring(this.pdfsrc.lastIndexOf('.') + 1)
        if(type === 'pdf' || type === 'pptx' || type === 'docx' || type === 'ppt') {
          if(this.pageCount) {
            // 本次学习比上次快才会记录
            if(Number(this.lastLearnPage) < this.currentPage) {
              if(this.isTwoMinutes) {
                currentPage = this.currentPage
                rate = (this.currentPage / this.pageCount) * 100
              }else{
                currentPage = this.currentPage - 1
                rate = ((this.currentPage - 1) / this.pageCount) * 100
              }
            }else{
              backProgressPage = this.currentPage
            }
          }else{
            currentPage = null
            rate = null
          }
        }else if(type === 'png' || type === 'jpg' || type === 'jpeg') {
          if(this.isTwoMinutes) {
            currentPage = 1
            rate = 100
          }else{
            if(this.lastLearnPage > 0) {
              currentPage = 1
              rate = 100
            }else{
              currentPage = 0
              rate = 0
            }
          }
        }
      }
      let time = (this.pageCloseTime - this.pageOpenTime) ? (this.pageCloseTime - this.pageOpenTime) / 1000 : 0
      var realTime = time + (this.lastRealTime ? Number(this.lastRealTime) : 0) + (localStorage.getItem('browserTabTime') ? Number(localStorage.getItem('browserTabTime')) : 0)
      realTime = realTime ? realTime.toFixed(0) : 0
      let params = {
        id: this.leranData.parentId, //
        isOperate: true,
        lastLearnDataId: this.leranData.subChapterData.dataId,
        lastLearnChapterId: this.leranData.subChapterData.chapterId,
        lastLearnDataName: this.leranData.subChapterData.dataName,
        subjectLearnSubList: [
          {
            backProgressPage: backProgressPage,
            backProgressTime: backProgressTime, // 回退时间
            id: this.leranData.subChapterData.subjectLearnSubId,
            progressPage: currentPage || null,
            progressTime: currentTime, // 视频学习时间进度条
            realTime: realTime, // 实际耗时
            speedProgress: rate ? (rate > 100 ? '100' : rate.toFixed(2)) : null, // 进度：百分比
            subjectLearnId: this.leranData.subChapterData.subjectLearnId
          }
        ]
      }
      operateSubjectlearnInfo(params).then(res => {
        if (res.data.status) {
          setTimeout(() => {
            this.pdfsrc = ''
            this.lastRealTime = realTime
            this.$emit('leranDataUpdate', leranData)
          }, 200)
        } else {
        }
      }).catch(() => {
      })
    },
    // 左上角返回功能
    returnLearn() {
      window.clearInterval(this.photoTimerInterval)
      window.clearInterval(this.fiveTimes)
      window.clearInterval(this.twoTimes)
      this.pageCloseTime = (new Date()).getTime()
      let rate = null
      var currentTime = null
      let currentPage = null
      let backProgressPage = null
      let backProgressTime = null
      if(this.player && this.leranData.subChapterData.flag === '2') {
        currentTime = this.player.cache_.currentTime > this.duration ? this.duration : this.player.cache_.currentTime
        if(Number(this.lastLearnPage) < currentTime) { // 本次学习比上次快才会记录
          rate = ((currentTime / this.duration)) * 100
        }else{
          backProgressTime = currentTime
          currentTime = null
        }
      }else{
        let type = this.pdfsrc.substring(this.pdfsrc.lastIndexOf('.') + 1)
        if(type === 'pdf' || type === 'pptx' || type === 'docx' || type === 'ppt') {
          if(this.pageCount) {
            // 本次学习比上次快才会记录
            if(Number(this.lastLearnPage) < this.currentPage) {
              if(this.isTwoMinutes) {
                currentPage = this.currentPage
                rate = (this.currentPage / this.pageCount) * 100
                // this.$Message.success('学习了：' + currentPage + ',进度：' + rate)
              }else{
                currentPage = this.currentPage - 1
                rate = ((this.currentPage - 1) / this.pageCount) * 100
                // this.$Message.success('学习了：' + currentPage + ',进度：' + rate)
              }
            }else{
              backProgressPage = this.currentPage
              // this.$Message.success('回退了')
            }
          }else{
            currentPage = null
            rate = null
            // this.$Message.success('无效学习')
          }
        }else if(type === 'png' || type === 'jpg' || type === 'jpeg') {
          if(this.isTwoMinutes) {
            currentPage = 1
            rate = 100
          }else{
            if(this.lastLearnPage > 0) {
              currentPage = 1
              rate = 100
            }else{
              currentPage = 0
              rate = 0
            }
          }
        }
      }
      let time = (this.pageCloseTime - this.pageOpenTime) ? (this.pageCloseTime - this.pageOpenTime) / 1000 : 0
      var realTime = time + (this.lastRealTime ? Number(this.lastRealTime) : 0) + (localStorage.getItem('browserTabTime') ? Number(localStorage.getItem('browserTabTime')) : 0)
      realTime = realTime ? realTime.toFixed(0) : 0
      let params = {
        id: this.leranData.parentId, //
        isOperate: true,
        lastLearnDataId: this.leranData.subChapterData.dataId,
        lastLearnChapterId: this.leranData.subChapterData.chapterId,
        lastLearnDataName: this.leranData.subChapterData.dataName,
        subjectLearnSubList: [
          {
            backProgressPage: backProgressPage,
            backProgressTime: backProgressTime, // 回退时间
            id: this.leranData.subChapterData.subjectLearnSubId,
            progressPage: currentPage || null,
            progressTime: currentTime, // 视频学习时间进度条
            realTime: realTime, // 实际耗时
            speedProgress: rate ? (rate > 100 ? '100' : rate.toFixed(2)) : null, // 进度：百分比
            subjectLearnId: this.leranData.subChapterData.subjectLearnId
          }
        ]
      }
      operateSubjectlearnInfo(params).then(res => {
        if (res.data.status) {
          setTimeout(() => {
            this.$emit('closeDrawer')
          }, 200)
        } else {
        }
      }).catch(() => {
      })
    },
    async logout() {
      this.updated()
      userLogout().then(res => {
        if (res.data.status) {
          clearLoginInfo()
          sessionStorage.removeItem('store')
          sessionStorage.setItem('menuList', '[]')
          sessionStorage.setItem('permissions', '[]')
          this.$store.dispatch('user/handleLogOut')
          this.$router.options.isAddDynamicMenuRoutes = false
          this.$cookie.set('loginUserInfo', [])
          this.$router.push('/login')
          this.$Message.success('退出登录成功')
        } else {
          // this.$Message.error('获取信息详情时系统异常')
        }
      }).catch(() => {
      })
    },
    // =============================================调用权限（打开摄像头功能）
    // 调用权限（打开摄像头功能）
    getCompetence () {
      this.showCamera = true
      setTimeout(() => {
        var _this = this
        this.thisCancas = document.getElementById('canvasCamera')
        this.thisContext = this.thisCancas.getContext('2d')
        this.thisVideo = document.getElementById('videoCamera')
        // 旧版本浏览器可能根本不支持mediaDevices，我们首先设置一个空对象
        if (navigator.mediaDevices === undefined) {
          navigator.mediaDevices = {}
        }
        // 一些浏览器实现了部分mediaDevices，我们不能只分配一个对象
        // 使用getUserMedia，因为它会覆盖现有的属性。
        // 这里，如果缺少getUserMedia属性，就添加它。
        if (navigator.mediaDevices.getUserMedia === undefined) {
          navigator.mediaDevices.getUserMedia = function (constraints) {
            // 首先获取现存的getUserMedia(如果存在)
            var getUserMedia = navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.getUserMedia
            // 有些浏览器不支持，会返回错误信息
            // 保持接口一致
            if (!getUserMedia) {
              _this.isCamera = false
              return Promise.reject(new Error('getUserMedia is not implemented in this browser'))
            }else{
            }
            // 否则，使用Promise将调用包装到旧的navigator.getUserMedia
            return new Promise(function (resolve, reject) {
              getUserMedia.call(navigator, constraints, resolve, reject)
            })
          }
        }
        var constraints = { audio: false, video: { width: this.videoWidth, height: this.videoHeight, transform: 'scaleX(-1)' } }
        navigator.mediaDevices.getUserMedia(constraints).then(function (stream) {
          // 旧的浏览器可能没有srcObject
          if ('srcObject' in _this.thisVideo) {
            _this.thisVideo.srcObject = stream
          } else {
            // 避免在新的浏览器中使用它，因为它正在被弃用。
            _this.thisVideo.src = window.URL.createObjectURL(stream)
          }
          _this.thisVideo.onloadedmetadata = function (_e) {
            _this.thisVideo.play()
            _this.isCamera = true
          }
        }).catch(_err => {
          if(_err) {
            // _this.$Message.error('请检查摄像设备是否连接正常')
          }
        })
      }, 10)
    },
    //  绘制图片（拍照功能）
    setImage (value) {
      // conosle.log(this.thisVideo)
      if(!this.isCamera) {
        return
      }
      var _this = this
      // 点击，canvas画图
      _this.thisContext.drawImage(_this.thisVideo, 0, 0, _this.videoWidth, _this.videoHeight)
      // 获取图片base64链接
      var image = this.thisCancas.toDataURL('image/png')
      this.$nextTick(() => {
        this.cameraUrl = image
        _this.stopNavigator() // 拍完关闭摄像头
        let pparams = {
          fileName: this.name + '学习照片' + new Date(),
          filePath: this.cameraUrl,
          userId: this.userId,
          subjectLearnId: this.assId,
          flag: 1 // 1 学习拍照 2 考试照片
        }
        operateSubjectlearnPhotoInfo(pparams)
          .then(({ data }) => {
            this.$Spin.hide()
            this.stopNavigator()
          })
          .catch(() => {})
      })
    },
    // base64转文件
    dataURLtoFile (dataurl, filename) {
      var arr = dataurl.split(',')
      var mime = arr[0].match(/:(.*?);/)[1]
      var bstr = atob(arr[1])
      var n = bstr.length
      var u8arr = new Uint8Array(n)
      while (n--) {
        u8arr[n] = bstr.charCodeAt(n)
      }
      return new File([u8arr], filename, { type: mime })
    },
    // 关闭摄像头
    stopNavigator () {
      console.log('关闭摄像头')
      if(this.thisVideo) {
        this.thisVideo.srcObject.getTracks()[0].stop()
      }
    }
  },
  beforeDestroy() {
    window.clearInterval(this.photoTimerInterval)
    window.clearInterval(this.fiveTimes)
    window.clearInterval(this.twoTimes)
    this.stopNavigator()
    if(this.player) {
      this.player.pause()
    }
  }
}
</script>
<style lang="less" scoped>
@import './video.less';
.video-player{
  // height: 200px;
  // margin: 0 auto;
  // display: flex;
  // flex-direction: column;
  // justify-content: center;
}
/deep/.vjs-big-play-button{
  // background-color: rebeccapurple !important;
  // border: solid 1px #979797;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  margin: auto;
  height: 1rem;
  width: 1rem;
  line-height: 1rem;
}
</style>
<style scoped>
.footers {
  position: absolute;
  bottom: 0;
  width: 100%;
  display: flex;
  z-index: 100;
  color: #333;
  border-top: 1px solid #f0f0f0;
  line-height: 10px;
  height: 50px;
  line-height: 50px;
  list-style: none;
  padding: 0 10px;
}
.li {
  text-align: center;
  flex: 1;
  padding: 5px;
  cursor: pointer;
}
.ul {
  list-style: none;
}
.more-p {
  /* border-right: 1px solid #f0f0f0; */
  margin-right: 10px;
  cursor: pointer;
  font-weight: bold;
}
.small-p {
  margin-right: 15px;
  cursor: pointer;
}
.up-p {
  margin-right: 10px;
  cursor: pointer;
}
.down-p {
  border-radius: 0 none;
  cursor: pointer;
  margin-right: 10px;
}
.page-container{
  height: 100%;
  width: 100%;
}
.page-container> .main {
  height: calc(100%- 50px);
  width: 100%;
  overflow: auto;
  /* overflow: hidden; */
}
</style>
