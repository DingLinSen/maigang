<template>
  <div class="modal-container">
    <Modal
      v-model="isDetailsShow"
      width="900"
      class-name="modalContain"
      @on-cancel="close"
      :styles="{ top: isPdf ? '5px' : '1.33333rem' }"
    >
      <p
        slot="header"
        style="width:93%;color:#000000;text-align:center;font-size:18px;height:24PX;line-height:inherit;font-family:Microsoft YaHei;"
      >
        <span>{{ videoTitle }}</span>
      </p>
      <div
        :style="{ maxHeight: divHeight + 'px', height: divHeight + 'px' }"
        style="display:flex;justify-content:center;align-items:center;overflow: auto;"
      >
        <div
          class="mask-sub"
          style="position: absolute;height: 50px;width: 50px; background: rgba(0,0,0,0); right: 11px; bottom: 42px;z-index: 100"
        ></div>
        <video
          :src="videoUrl ? baseUploadUrl + videoUrl : ''"
          id="videoPlayer"
          ref="movie"
          style="object-fit:contain;position: relative;width:100%;height:100%;background: rgba(0,0,0);"
          controlslist="nodownload noremoteplayback"
          controls="controls"
          autoplay="autoplay"
          :disablePictureInPicture="true"
          oncontextmenu="return false"
        >
          您的浏览器不支持 video 标签。
        </video>
      </div>
      <div></div>
      <div slot="footer">
        <!-- <Button type="primary" @click="downLoadFiles">下载视频</Button> -->
      </div>
    </Modal>
  </div>
</template>
<script>
import { OPERATE_LIST } from '@/libs/mixin'
export default {
  mixins: [OPERATE_LIST],
  data() {
    return {
      isDetailsShow: false,
      baseUploadUrl: window.SITE_CONFIG.downFileUrl,
      pdfUrl: window.SITE_CONFIG.downFileUrl,
      divHeight: 0,
      isDocShow: false,
      videoTitle: null,
      videoUrl: null,
      tableau: null
    }
  },
  props: {
    defaultHeight: {
      type: Number,
      default: 500
    },
    courseUrl: {
      type: String,
      default: null
    },
    coverUrl: {
      type: String,
      default: null
    },
    title: {
      type: String,
      default: null
    },
    type: {
      type: String,
      default: null
    },
    content: {
      type: String,
      default: null
    },
    url: {
      type: String,
      default: null
    },
    fileName: {
      type: String,
      default: null
    },
    isPdf: {
      type: Boolean,
      default: false
    },
    sysName: {
      type: String,
      default: '文件下载'
    },
    moduleName: {
      type: String,
      default: null
    },
    banOperate: {
      // 禁用pdf预览的操作栏
      type: Boolean,
      default: false
    }
  },
  activated() {},
  mounted() {
    this.$refs.movie.addEventListener('play', this.handlePlay)
    this.$refs.movie.addEventListener('pause', this.handleStop)
    this.$refs.movie.addEventListener('timeupdate', this.listener)
  },
  watch: {
    defaultHeight: function(val) {
      if (this.isPdf) {
        this.divHeight = parseInt(val) * 0.9
      } else {
        this.divHeight = parseInt(val) * 0.7
      }
    },
    isDetailsShow: function() {
      if (this.isDetailsShow) {
        // if(/\.docx/.test(this.url.toLowerCase())) {
        // let params = {
        //   path: this.url.replace(/\\/g, '/')
        // }
        // docPreview(params).then(res => {
        //   if (res.data) {
        //     const blob = new Blob([res.data])
        //     this.isDocShow = true
        //     setTimeout(() => {
        //       docx.renderAsync(blob, this.$refs.file)
        //     }, 500)
        //   }
        // })
        // }
      } else {
        this.isDocShow = false
      }
    },
    isPdf: function() {
      if (this.isPdf) {
        this.divHeight = parseInt(this.defaultHeight) * 0.9
      } else {
        this.divHeight = parseInt(this.defaultHeight) * 0.7
      }
    },
    content: function(val) {
      // 对上传的图片路径预处理
      this.content =
        val == null
          ? null
          : val.replace('uploadImgUrl', window.SITE_CONFIG.fileShowURL)
    },
    banOperate: function() {
      if (this.banOperate) {
        //
        this.$nextTick(() => {
          document.oncontextmenu = function() {
            return false
          }
        })
        document.onkeydown = function(e) {
          if (e && e.keyCode === 123) {
            e.returnValue = false
            return false
          }
        }
      } else {
        // 启用右击操作
        this.$nextTick(() => {
          document.oncontextmenu = function() {
            return true
          }
        })
        document.onkeydown = function(e) {
          if (e && e.keyCode === 123) {
            e.returnValue = true
            return true
          }
        }
      }
    }
  },
  methods: {
    open() {
      this.isDetailsShow = true
      setTimeout(() => {
        this.videoTitle = this.title
        this.videoUrl = this.courseUrl
      }, 100)
    },
    close() {
      this.videoTitle = null
      this.videoUrl = null
      this.handleStop()
      setTimeout(() => {
        this.$emit('videDetailes', [])
        this.isDetailsShow = false
      }, 100)
    },
    downLoadFiles() {
      this.downLoadFileSub({
        filePath: this.courseUrl,
        fileName: this.title
      })
      //   this.downloadFile(this.url, this.fileName, this.sysName)
    },
    setModalText(param) {
      this.clearModalText()
      this.title = param.title
      this.type = param.type
      this.content = param.content
    },
    clearModalText() {
      this.title = null
      this.type = null
      this.content = null
      this.isPdf = false
    },
    // 视频监听
    listener() {
      // var sym
      // var video = document.getElementById('videoPlayer')
      // setInterval(function() {
      //   var time = video.currentTime
      //   if (time - sym > 1) {
      //     video.currentTime = sym
      //   }
      //   sym = video.currentTime
      // }, 500)
    },
    // 视频监听
    handlePlay() {
      this.$refs.movie.play()
    },
    // 视频暂停
    handleStop() {
      this.$refs.movie.pause()
      if (!document.getElementById('videoPlayer')) {

      }
    }
  }
}
</script>
<style lang="less" scoped>
/deep/.modalContain {
  // z-index: 19000 !important;
  iframe {
    img {
      height: 100%;
      width: 100%;
    }
  }
}
/deep/.link {
  color: #00a0e9;
  cursor: pointer;
}
/deep/.diaContent {
  img {
    max-width: 100%;
  }
  p {
    font-size: 13px !important;
    font-family: Microsoft YaHei !important;
  }
}
</style>
