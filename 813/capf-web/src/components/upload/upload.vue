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
      :before-upload="beforeUpload"
      :data="data"
      type="drag"
      :disabled="disabled"
      :on-remove="handleRemove"
      :on-format-error="handleFormatError"
      style="display: inline-block;"
    >
      <div style="padding: 20px 0;  text-align:cente" class="c-index-base">
        <Icon type="md-cloud-upload" class="text-lg" size="40"></Icon>
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
        return ['xls', 'xlsx']
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
      default: 10 * 1024
    },
    fileNum: { // 文件个数
      type: Number,
      default: 1
    },
    disabled: { // 是否禁用上传
      type: Boolean,
      default: false
    }
  },
  watch: {
    defaultList() {
      this.uploadList = this.defaultList
    }
  },
  activated() {
    this.url = this.uploadURL
    this.uploadList = this.$refs.upload.fileList
    this.acceptTypeStr = ''
    for (var i = 0; i < this.acceptType.length; i++) {
      this.acceptTypeStr = this.acceptTypeStr + ' .' + this.acceptType[i]
    }
  },
  mounted() {
    this.url = this.uploadURL
    this.uploadList = this.$refs.upload.fileList
    this.acceptTypeStr = ''
    for (var i = 0; i < this.acceptType.length; i++) {
      this.acceptTypeStr = this.acceptTypeStr + ' .' + this.acceptType[i]
    }
  },
  methods: {
    beforeUpload(file) {
      if (this.canUpload) {
        this.file = file
        this.uploadData = this.params
        let promise = new Promise(resolve => {
          this.$nextTick(function() {
            resolve(true)
          })
        })
        return promise // 通过返回一个promis对象解决
      } else {
        this.$Message.error('上传前请先填写必要参数')
        return false
      }
    },
    handleSuccess(res, file) {
      this.$emit('handleUpload', true)
      if (res.result === 'OK') {
        this.$Message.success('导入成功')
      } else if(res.httpCode === 100402) {
        this.$Modal.warning({
          width: '60%',
          transfer: false,
          title: '导入信息提示',
          content: res.msg || '有导入失败项！'
          // render: (h, params) => {
          //   return h('div', [
          //     h('div', {
          //       style: 'margin-bottom:20px;vertical-align: middle;font-size: 16px;color: #17233d;font-weight: 700;'
          //     }, '更新分类')
          //   ])
          // }
        })
        // this.$Message.warning({
        //   content: res.msg || '有导入失败项！',
        //   duration: 15,
        //   closable: true
        // })
      }else {
        this.$Message.error(res.msg)
      }
    },
    handleFormatError(file) {
      this.$Notice.warning({
        title: '文件格式错误',
        desc: '请选择' + this.acceptTypeStr + '格式的文件'
      })
    },
    handleRemove(file) {
      const fileList = this.$refs.upload.fileList
      this.$refs.upload.fileList.splice(fileList.indexOf(file), 1)
    },
    uploadAction() {
      var fileData = new FormData()
      fileData.append('excel', this.file)
      fileData.append('params', JSON.stringify(this.params))
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
