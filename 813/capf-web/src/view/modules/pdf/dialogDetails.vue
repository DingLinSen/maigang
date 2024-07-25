<template>
  <div class="modal-container">
    <Modal
      v-model="isDetailsShow"
      width="900"
      class-name="modalContain"
      footer-hide
      :styles="{ top: isPdf ? '5px' : '1.33333rem' }"
    >
      <p
        slot="header"
        style="width:93%;color:#000000;text-align:center;font-size:18px;height:24PX;line-height:inherit;font-family:Microsoft YaHei;"
      >
        <span>{{ title }}</span>
      </p>
      <div
        :style="{ maxHeight: divHeight + 'px', height: divHeight + 'px' }"
        style="display:flex;justify-content:center;align-items:center;overflow: auto;"
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
        <iframe
          v-if="
            url != null &&
              url != '' &&
              /\.pdf/.test(url.toLowerCase())
          "
          :src="url == null || url == '' ? '' : pdfUrl + url + '#toolbar=0'"
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
          v-if="
            url != null && url != '' && /\.ppt|\.pptx/.test(url.toLowerCase())
          "
          class="img-privew"
          style="width: 100%;;height: 100%"
        >
          <div
            class="img-box"
            style="height: calc(100% - 50px);width: 100%;text-align: center;display: flex;align-items: center; justify-content: center;overflow: auto;"
          >
            <!-- <div> -->
            <img
              :src="pngSrc == null || pngSrc == '' ? '' : pptUrl + pngSrc"
              style="height: 100%"
              ref="imgref"
            />
            <!-- </div> -->
          </div>
          <ul class="footers">
            <li
              @click="scaleD(1)"
              :style="{ color: scale < 200 ? '#333' : '#BBBCBC' }"
            >
              <p class="more-p">放大</p>
            </li>
            <li
              @click="scaleX(1)"
              :style="{ color: scale > 100 ? '#333' : '#BBBCBC' }"
            >
              <p class="small-p">缩小</p>
            </li>
            <li
              @click="changeImgPage(0)"
              :style="{ color: currentPage > 1 ? '#333' : '#BBBCBC' }"
            >
              <p class="up-p">上一页</p>
            </li>
            <li
              @click="changeImgPage(1)"
              :style="{ color: currentPage === pageCount ? '#BBBCBC' : '#333' }"
            >
              <p class="down-p">下一页</p>
            </li>
            <li>
              <p>
                第<span style="font-weight: bold;color:#333">
                  {{ currentPage }} </span
                >页 / 共<span class="c-red" style="font-weight: bold">
                  {{ pageCount }} </span
                >页
              </p>
            </li>
          </ul>
        </div>

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
        <!-- <Button type="primary" @click="downLoadFiles">下载文件</Button> -->
      </div>
    </Modal>
  </div>
</template>
<script>
import { OPERATE_LIST } from '@/libs/mixin'
import { docPreview, docPreviewSub } from '@/api/api-base.js'
import mammoth from 'mammoth'
import axios from 'axios'
let docx = require('docx-preview')
export default {
  mixins: [OPERATE_LIST],
  data() {
    return {
      isDetailsShow: false,
      pdfUrl: window.SITE_CONFIG.downFileUrl,
      pptUrl: window.SITE_CONFIG.downFileUrlSub,
      divHeight: 0,
      isDocShow: false,
      tableau: null,
      pdfIndex: -1, //
      scale: 100, // pdf放大尺寸
      currentPage: 0, // 当前页码
      pageCount: 0, // 总页码
      wordText: '',
      pngSrc: '',
      excelData: [],
      workbook: {}
    }
  },
  props: {
    picArray: {
      type: Array,
      default: []
    },
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
  mounted() {},
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
        } else if (/\.ppt|\.pptx/.test(this.url.toLowerCase())) {
          this.currentPage = 1
          this.scale = 100
          this.pageCount = this.picArray.length
          this.pngSrc = this.picArray[this.currentPage - 1]
        }
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
      this.currentPage = 0
      this.scale = 100
      this.pageCount = 0
      this.pngSrc = []
      this.title = null
      this.url = mull
      this.isDetailsShow = false
    },
    downLoadFiles() {
      // console.log(this.url, this.fileName, this.sysName);
      // this.downloadFile(this.url, this.fileName, this.sysName)
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
    // pdf放大
    scaleD(val) {
      if (this.scale < 200) {
        if (val === 1) {
          this.$refs.imgref.style.width = parseInt(this.scale) + '%'
          this.$refs.imgref.style.height = parseInt(this.scale) + '%'
        }
        this.scale += 5
      }
    },

    // pdf缩小
    scaleX(val) {
      // eslint-disable-next-line eqeqeq
      if (this.scale == 100) {
        return
      }
      this.scale += -5
      if (val === 1) {
        this.$refs.imgref.style.width = parseInt(this.scale) + '%'
        this.$refs.imgref.style.height = parseInt(this.scale) + '%'
      }
    },
    // =====================预览图片数组======================
    changeImgPage(val) {
      if (val === 0 && this.currentPage > 1) {
        this.currentPage--
        this.pngSrc = this.picArray[this.currentPage - 1]
      }
      if (val === 1 && this.currentPage < this.pageCount) {
        this.currentPage++
        this.pngSrc = this.picArray[this.currentPage - 1]
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
.footers {
  position: absolute;
  bottom: 0;
  width: 96%;
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
.page-container {
  height: 100%;
  width: 100%;
}
.page-container > .main {
  height: calc(100%- 50px);
  width: 100%;
  overflow: auto;
  /* overflow: hidden; */
}
</style>
