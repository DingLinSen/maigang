<template>
  <div class="editor-wrapper">
    <div :id="editorId"></div>
  </div>
</template>

<script>
// import Editor from 'wangeditor'
import Editor from 'wangeditor'
import 'wangeditor/release/wangEditor.min.css'
// import axios from 'axios'
import { oneOf } from '@/libs/tools'
// import imageConversion from 'image-conversion' // 压缩图片
import { Message } from 'iview'
export default {
  name: 'Editor',
  props: {
    value: {
      type: String,
      default: ''
    },
    /**
     * 绑定的值的类型, enum: ['html', 'text']
     */
    valueType: {
      type: String,
      default: 'html',
      validator: (val) => {
        return oneOf(val, ['html', 'text'])
      }
    },
    /**
     * @description 设置change事件触发时间间隔
     */
    changeInterval: {
      type: Number,
      default: 200
    },
    /**
     * @description 是否开启本地存储
     */
    cache: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    editorId () {
      return `editor${this._uid}`
    }
  },
  data() {
    return{
      uploadImgForm: {
        file: {},
        onePathName: 'introduction',
        twoPathName: 'introduction'
      }
    }
  },
  methods: {
    initEditor() {
      this.editor.txt.clear()
    },
    setHtml(html) {
      this.editor.txt.html(html)
    },
    getEditor() {
      return this.editor.txt.html()
    }
  },
  activated() {
    this.initEditor()
  },
  mounted () {
    // var Editor = window.wangEditor
    this.editor = new Editor(`#${this.editorId}`)
    this.editor.customConfig.menus = [
      'head', // 标题
      'bold', // 粗体
      'fontSize', // 字号
      'fontName', // 字体
      'italic', // 斜体
      // 'underline', // 下划线
      // 'strikeThrough', // 删除线
      // 'foreColor', // 文字颜色
      // 'backColor', // 背景颜色
      // 'link', // 插入链接
      // 'list', // 列表
      // 'justify', // 对齐方式
      // // 'quote', // 引用
      'image' // 插入图片
      // 'table' // 表格
    ]
    this.editor.customConfig.showLinkImg = false // 屏蔽网络图片的上传入口
    this.editor.customConfig.uploadImgMaxLength = 1 // 限制一次最多上传 5 张图片
    this.editor.customConfig.uploadImgMaxSize = 3 * 1024 * 1024 // 将图片大小限制为 3M 默认为5M
    this.editor.customConfig.uploadImgTimeout = 50000
    this.editor.customConfig.uploadImgShowBase64 = true // 上传本地图片
    this.editor.customConfig.uploadFileName = 'file'
    this.editor.customConfig.uploadImgServer = window.SITE_CONFIG.baseUrl + 'common/upload/uploadFile' // 设置上传文件的服务器路径
    // 关闭粘贴样式的过滤
    this.editor.customConfig.pasteFilterStyle = false
    // 忽略粘贴内容中的图片
    this.editor.customConfig.pasteIgnoreImg = true
    this.editor.customConfig.uploadImgHeaders = { 'token': this.$cookie.get('token') }// 自定义 header
    // 自定义发生错误时将信息抛出
    this.editor.customConfig.customAlert = function (info) {
      Message.error(info)
    }
    this.editor.customConfig.withCredentials = true
    this.editor.customConfig.uploadImgParams = {
    // 如果版本 <=v3.1.0 ，属性值会自动进行 encode ，此处无需 encode
    // 如果版本 >=v3.1.1 ，属性值不会自动 encode ，如有需要自己手动 encode
      onePathName: 'introduction',
      twoPathName: 'introduction'
    }
    // this.editor.customConfig.uploadImgShowBase64 = true  // 是否将图片上传到本地
    /* 自定义图片上传（支持跨域和非跨域上传，简单操作） */
    this.editor.customConfig.customUploadImg = async (files, insert) => {
      files = new window.File(
        // [res],
        // files[0].name,
        // { type: files[0].type }
      )
    //   var self = this
    //   let formdata = new FormData() // 创建form对象
    //   if(files[0]) {
    //     // Message.loading({
    //     //   content: '上传中...',
    //     //   duration: 0
    //     // })
    //     // 将图片压缩到40 kb：
    //   //   imageConversion.compress(files[0], 1).then(res => {
    //   //     // eslint-disable-next-line no-irregular-whitespace
    // eslint-disable-next-line no-irregular-whitespace
    //   //     // 将//Blob 转换到 file中
    //   //     // files = new window.File(
    //   //     //   [res],
    //   //     //   files[0].name,
    //   //     //   { type: files[0].type }
    //   //     // )
    //   //     // files = new window.File(
    //   //     //   [res],
    //   //     //   files[0].name,
    //   //     //   { type: files[0].type }
    //   //     // )
    //   //     // files = new window.File(
    //   //     //   [res],
    //   //     //   files[0].name,
    //   //     //   { type: files[0].type }
    //   //     // )
    //   //     // self.uploadImgForm.file = {[res]}

    //   //     // 转formData格式发送数据
    //   //     Object.keys(self.uploadImgForm).forEach((key) => {
    //   //       formdata.append(key, self.uploadImgForm[key])
    //   //     })
    //   //     // 允许携带cookie
    //   //     axios.defaults.withCredentials = true
    //   //     // // 将图片以文件流的形式上传到台返回url
    //   //     axios.post(window.SITE_CONFIG.baseUrl + 'common/upload/uploadFile', formdata, {
    //   //       headers: {
    //   //         'token': this.$cookie.get('token'),
    //   //         'Content-Type': 'multipart/form-data'
    //   //       }
    //   //     }).then(res => {
    //   //       Message.destroy()
    //   //       if(res.data.httpCode === 200) {
    //   //         var url = ''
    //   //         url = window.SITE_CONFIG.uploadImage + res.data.data.uploadPath
    //   //         insert(url) /* insert 是编辑器自带的 获取图片 url 后，插入到编辑器的方法 上传代码返回结果之后，将图片插入到编辑器中 */
    //   //       }
    //   //     })
    //   //     setTimeout(() => {
    //   //       Message.destroy()
    //   //     }, 5000)
    //   //   })
    //   // }
    }

    this.editor.customConfig.uploadImgHooks = {
      fail: (xhr, editor, result) => {
      },
      success: (xhr, editor, result) => {
      },
      timeout: (xhr, editor) => {
        // 网络超时的回调
      },
      error: (xhr, editor) => {
        // 图片上传错误的回调
      },
      customInsert: (insertImg, result, editor) => {
        Message.loading({
          content: '上传中...',
          duration: 0
        })
        // 图片上传成功,插入图片的回调
        if(result.result === 'OK') {
          Message.error(result.result)
          Message.success('上传成功')
          var url = result.data.uploadPath
          insertImg(window.SITE_CONFIG.uploadImage + url)// 将内容插入到富文本中

          Message.destroy()
        }
        setTimeout(() => {
          Message.destroy()
        }, 5000)
      }
    }

    this.editor.customConfig.onchange = (html) => {
      let text = this.editor.txt.text()
      if (this.cache) localStorage.editorCache = html
      this.$emit('input', this.valueType === 'html' ? html : text)
      this.$emit('on-change', html, text)
    }
    // this.editor.customConfig.onchangeTimeout = this.changeInterval

    // create这个方法一定要在所有配置项之后调用
    this.editor.create()

    // 如果本地有存储加载本地存储内容
    // let html = localStorage.editorCache
    // if (html) this.editor.txt.html(html)
  }
}
</script>

<style>

</style>
