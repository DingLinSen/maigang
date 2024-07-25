<template lang="html">
  <div class="upload-container">
    <Upload
      ref="upload"
      :show-upload-list="true"
      :default-file-list="defaultList"
      :headers="{ token: this.$cookie.get('token') }"
      :action="url"
      :with-credentials="true"
      :on-success="handleSuccess"
      :format="acceptType"
      :max-size="maxSize"
      :on-exceeded-size="handleMaxSize"
      :on-format-error="handleFormatError"
      :before-upload="beforeUpload"
      :data="data"
      type="drag"
      :disabled="disabled"
      :on-remove="handleRemove"
      style="display: inline-block;width: 50%;"
    >
      <div style="padding: 20px 0" class="c-index-base">
        <Icon type="md-add" size="40"/>
        <p class="mar-btm-5" style="font-size: 12px">温馨提示：文件建议不超过{{maxSize/1024}}M，只支持{{ acceptTypeStr }}格式文件。</p>
      </div>
    </Upload>
  </div>
</template>
<script>
export default {
  data() {
    return {
      uploadList: [],
      file: null,
      acceptTypeStr: '', // 允许的格式
      url: '' // 上传路径
    }
  },
  props: {
    linkURL: {
      default: null,
      type: String
    },
    uploadURL: '',
    acceptType: {
      type: Array,
      default: () => {
        return []
      }
    },
    data: {
      type: Object,
      default: () => {
        return {}
      }
    },
    params: {
      default: () => {},
      type: Object
    },
    canUpload: {
      default: true,
      type: Boolean
    },
    defaultList: {
      type: Array,
      default: () => {
        return []
      }
    },
    maxSize: { // 最大大小
      type: Number,
      default: 5 * 1024
    },
    fileNum: { // 文件个数
      type: Number,
      default: 1
    },
    disabled: { // 是否禁用上传
      type: Boolean,
      default: false
    },
    isOther: {
      type: Boolean,
      default: false
    }
  },
  // watch: {
  //   params: function() {}
  // },
  watch: {
    defaultList() {
      // this.uploadList = this.defaultList
      this.uploadList = this.$refs.upload.fileList
    }
  },
  activated() {
    this.url = window.SITE_CONFIG.baseUrl + this.uploadURL
    this.uploadList = this.$refs.upload.fileList
    this.acceptTypeStr = ''
    for (var i = 0; i < this.acceptType.length; i++) {
      this.acceptTypeStr = this.acceptTypeStr + ' ' + '.' + this.acceptType[i]
    }
  },
  mounted() {
    this.url = window.SITE_CONFIG.baseUrl + this.uploadURL
    this.uploadList = this.$refs.upload.fileList
    this.acceptTypeStr = ''
    for (var i = 0; i < this.acceptType.length; i++) {
      this.acceptTypeStr = this.acceptTypeStr + ' ' + '.' + this.acceptType[i]
    }
  },
  methods: {
    clearFiles() {
      this.uploadList = []
      this.$refs.upload.clearFiles()
    },
    uploadData(list) {
      this.uploadList = list
      this.$refs.upload.fileList = list
    },
    beforeUpload(file) {
      if(this.$refs.upload.fileList.length < this.fileNum) {
        this.file = file
        this.$emit('beforeUploadInfo', file)
        if(this.isOther) {
          this.$emit('handleUpload', file)
          return false
        }
        let promise = new Promise(resolve => {
          this.$nextTick(function() {
            resolve(true)
          })
        })
        return promise // 通过返回一个promis对象解决
      }else{
        this.$Notice.warning({
          title: '文件数量错误',
          desc: '最多' + this.fileNum + '个文件'
        })
        return false
      }
    },
    handleSuccess(res, file) {
      // this.$emit('handleUpload', true)
      // if (res.result === 'OK') {
      //   this.$Message.success(res.msg)
      // } else {
      //   this.$Message.error(res.msg)
      // }
      // this.$Message.destroy()
      console.log('===handleSuccess==')
      if (res.result === 'OK') {
        this.$Message.success(res.msg)
      } else {
        var index = Number(this.$refs.upload.fileList.length) - 1
        this.$refs.upload.fileList.splice(index, 1)
        this.$Message.error(res.msg)
        return
      }
      this.$emit('changeFileParams', res.data)
      file.url = res.data.uploadPath
      this.uploadList = this.$refs.upload.fileList
    },
    handleFormatError(file) {
      // 格式错误
      // this.$Message.destroy()
      this.$Notice.warning({
        title: '文件格式错误',
        desc: '请选择' + this.acceptTypeStr + '格式的文件'
      })
    },
    handleRemove(file, fileList) {
      this.uploadList = fileList
      this.$emit('changeParams', this.uploadList)
      this.$emit('changeFileParams', this.uploadList)
    },
    formatError() {
      this.$Message.error('请选择正确的文件格式')
    },
    handleMaxSize(file, fileList) {
      // this.$Message.destroy()
      this.$Notice.warning({
        title: '文件大小超限',
        desc: '文件  ' + file.name + ' 太大，上传文件大小不能超过' + ((this.maxSize) / 1024) + 'M。'
      })
    }
  }
}
</script>

<style lang="less" scoped>
.ivu-upload {
  display: block;
}
.upload-container {
  .ivu-form .ivu-form-item-label {
    padding: 5px 12px 5px 12px !important;
    margin-bottom: 0 !important;
  }

  .ivu-form-item {
    margin-bottom: 18px !important;
  }
}
</style>
