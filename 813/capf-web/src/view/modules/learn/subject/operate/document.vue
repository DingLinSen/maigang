<template>
  <div class="modal-container">
      <!-- <p
        slot="header"
        style="width:93%;color:#000000;text-align:center;font-size:18px;height:24PX;line-height:inherit;font-family:Microsoft YaHei;"
      >
        <span>{{ title }}</span>{{ /\.pdf/.test(url.toLowerCase())}}
      </p> -->
        <!-- :style="{ maxHeight: divHeight + 'px', height: divHeight + 'px' }" -->
      <div

        style="display:flex;justify-content:center;align-items:center;overflow: auto; height: 100%; width: 100%"
      >
        <Spin
          fix
          v-if="
            url != null &&
              url != '' &&
              /\.docx/.test(url.toLowerCase()) &&
              !isDocShow
          "
          >加载中...</Spin
        >
        <!-- http://192.168.1.146:3737/js/PDF.js/web/viewer.html?file=http://192.168.1.146:3737/src/Nginx.pdf&page=12&top=150&zoom=1.5 -->
        <iframe
          v-if="
            url != null &&
              url != '' &&
              /\.pdf/.test(url.toLowerCase()) &&
              banOperate
          "
          :src="url == null || url == '' ? '' : 'http://192.168.150.66:8080/static/uploadFiles/file/file/2022-04-24/0ef2f0088a1049ddb2dee70ac6620e27.pdf' + '#toolbar=0'"
          style="width:100%;height:100%;"
        ></iframe>
        <iframe
          v-if="
            url != null &&
              url != '' &&
              /\.pdf/.test(url.toLowerCase()) &&
              !banOperate
          "
          :src="url == null || url == '' ? '' : pdfUrl + url"
          style="width:100%;height:100%;"
        ></iframe>
        <img
          v-if="
            url != null &&
              url != '' &&
              /\.png|\.jpg|\.jpeg|\.bmp/.test(url.toLowerCase())
          "
          :src="url == null || url == '' ? '' : pdfUrl + url"
          style="max-width:100%;max-height:100%;"
        />
        <div
          style="overflow: auto;height: 100%;"
          class="fileWrap"
          ref="file"
          v-if="
            url != null &&
              url != '' &&
              /\.docx/.test(url.toLowerCase()) &&
              isDocShow
          "
        ></div>
        <div
          style="overflow: auto;height: 100%;"
          class="fileWrap"
          ref="file"
          v-if="
            url != null &&
              url != '' &&
              /\.doc/.test(url.toLowerCase()) &&
              isDocShow
          "
          v-html="wordText"
        ></div>
        <div
          style="overflow: auto;height: 100%;"
          class="fileWrap"
          ref="file"
          v-if="
            url != null &&
              url != '' &&
              /\.xlsx/.test(url.toLowerCase()) &&
              isDocShow
          "
        >
          <el-table :data="excelData" style="width: 100%">
            <el-table-column
              v-for="(value, key, index) in excelData[2]"
              :key="index"
              :prop="key"
              :label="key"
            ></el-table-column>
          </el-table>
        </div>
      </div>
      <div></div>
      <div slot="footer">
      </div>
  </div>
</template>
<script>
import { OPERATE_LIST } from '@/libs/mixin'
import mammoth from 'mammoth'
import axios from 'axios'
let docx = require('docx-preview')
export default {
  mixins: [OPERATE_LIST],
  data() {
    return {
      isDetailsShow: false,
      pdfUrl: window.SITE_CONFIG.downFileUrl,
      divHeight: 0,
      isDocShow: false,
      tableau: null,
      wordText: '',
      excelData: [],
      workbook: {}
    }
  },
  props: {
    defaultHeight: {
      type: Number,
      default: 500
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
    banOperate: {
      // 禁用pdf预览的操作栏
      type: Boolean,
      default: true
    }
  },
  activated() {
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
  },
  mounted() {
    if (/\.docx/.test(this.url.toLowerCase())) {
      let params = {
        fileName: this.title,
        path: this.url.replace(/\\/g, '/')
      }
      axios.defaults.withCredentials = true
      axios
        .get(
          window.SITE_CONFIG.baseUrl +
                'common/upload/downloadNet?fileName=' +
                params.fileName +
                '&path=' +
                window.SITE_CONFIG.downFileUrl +
                params.path,
          {
            headers: {
              token: this.$cookie.get('token'),
              'Content-Type': 'application/json; application/octet-stream'
            },
            responseType: 'arraybuffer'
          }
        )
        .then(res => {
          if (res.data) {
            const blob = new Blob([res.data])
            this.isDocShow = true
            setTimeout(() => {
              docx.renderAsync(blob, this.$refs.file)
            }, 500)
          }
        })
        .catch(() => {})
    } else if (/\.doc/.test(this.url.toLowerCase())) {
      let params = {
        fileName: this.title,
        path: this.url.replace(/\\/g, '/')
      }
      axios.defaults.withCredentials = true
      axios
        .get(
          window.SITE_CONFIG.baseUrl +
                'common/upload/downloadNet?fileName=' +
                params.fileName +
                '&path=' +
                window.SITE_CONFIG.downFileUrl +
                params.path,
          {
            headers: {
              token: this.$cookie.get('token'),
              'Content-Type': 'application/json; application/octet-stream'
            },
            responseType: 'arraybuffer'
          }
        )
        .then(res => {
          if (res.data) {
            this.isDocShow = true
            setTimeout(() => {
              mammoth
                .convertToHtml({
                  arrayBuffer: res.data
                })
                .then(resultObject => {
                  this.$nextTick(() => {
                    this.wordText = resultObject.value
                  })
                })
            }, 500)
          }
        })
        .catch(() => {})
    }
  },
  watch: {
    defaultHeight: function(val) {
      if (this.isPdf) {
        this.divHeight = parseInt(val) * 0.9
      } else {
        this.divHeight = parseInt(val) * 0.7
      }
    },
    // isDetailsShow: function() {
    //   console.log(this.isDetailsShow)
    //   if (this.isDetailsShow) {
    //   } else {
    //     this.isDocShow = false
    //   }
    // },
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
          : val.replace('uploadImgUrl', window.SITE_CONFIG.downFileUrl)
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
    },
    close() {
      this.isDetailsShow = false
    },
    downLoadFiles() {
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
.modal-container{
  height: 100%;
  width: 100%;
}
/deep/.docx-wrapper{
  background: #fff !important;
  padding: 0 !important;
}
/deep/.docx-wrapper{
  section.docx{
    box-shadow: 0 !important;
    margin-bottom: 10 !important;
  }
}
</style>
