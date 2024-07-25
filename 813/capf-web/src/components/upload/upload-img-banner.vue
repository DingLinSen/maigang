<template lang="html">
  <div>
    <Modal v-model="showImage" width="800" style="text-align:center;padding: 0px" :footer-hide = true :closable = true>
      <img :src="imageItemUrl" style="max-width: 100%; max-height: 500px;" />
    </Modal>

    <div class="demo-upload-list" v-for="(item,index) in uploadList" :key="index">
      <template v-if="item.status === 'finished'">
        <img :src="imageURL + item.url" style="cursor: pointer;">
        <div class="demo-upload-list-cover">
          <Icon type="ios-eye-outline" @click.native="handleView(item)"></Icon>
          <Icon type="ios-trash-outline" @click.native="handleRemove(item)"></Icon>
        </div>
      </template>
      <template v-else>
        <Progress v-if="item.showProgress" :percent="item.percentage" hide-info></Progress>
      </template>
    </div>
    <Upload
        v-show="size > uploadList.length"
        ref="upload"
        :show-upload-list="false"
        :default-file-list="defaultList"
        :headers="{token: this.$cookie.get('token')}"
        :action="url"
        :on-success="handleSuccess"
        :format="['jpg','jpeg','png']"
        :max-size="1024 * 20"
        :on-exceeded-size="handleMaxSize"
        :on-format-error="handleFormatError"
        :before-upload="beforeUpload"
        :with-credentials="true"
        multiple
        type="drag"
        style="display: inline-block;width:120px;" class="c-index-base">
        <div style="width: 120px;height:120px;line-height: 120px;">
          <Icon :type="icon" size="50"></Icon>
        </div>
    </Upload>
  </div>
</template>
<script>
import imageConversion from 'image-conversion'
export default {
  // components: {imageConversion},
  data() {
    return {
      showImage: false, // 显示大图
      imageItemUrl: null, // 大图地址
      file: null,
      acceptTypeStr: '', // 允许的格式
      url: '', // 上传的路径（拼接后）
      imgName: '',
      visible: false,
      uploadList: []
    }
  },
  props: {
    size: {
      type: Number,
      default: 1
    },
    imageURL: '',
    uploadURL: '',
    icon: '',
    defaultList: {
      type: Array,
      default: () => {
        return []
      }
    },
    acceptType: {
      type: Array,
      default: () => {
        return []
      }
    }
  },
  watch: {
    'defaultList'() {
      this.uploadList = this.$refs.upload.fileList
    }
  },
  mounted() {
    this.url = window.SITE_CONFIG.baseUrl + this.uploadURL
    this.uploadList = this.$refs.upload.fileList
    this.acceptTypeStr = ''
    for(var i = 0; i < this.acceptType.length; i++) {
      this.acceptTypeStr = this.acceptTypeStr + ' ' + this.acceptType[i]
    }
  },
  methods: {
    handleView(item) {
      this.showImage = true
      this.imageItemUrl = this.imageURL + item.url
    },
    handleRemove (file) {
      const fileList = this.$refs.upload.fileList
      this.$refs.upload.fileList.splice(fileList.indexOf(file), 1)
      this.uploadListImg = []
      this.$emit('changeImgParams', '')
    },
    handleMaxSize (file, fileList) {
      this.$Message.destroy()
      this.$Notice.warning({
        title: '文件大小超限',
        desc: '文件  ' + file.name + ' 太大，上传文件大小不能超过20M.'
      })
    },

    beforeUpload (file) {
      this.$Message.destroy()
      var fileName = file.name
      var fileTpe = fileName.substring(fileName.lastIndexOf('.') + 1)
      var isType = false // 格式不正确  true 格式正确
      this.acceptType.forEach(item => {
        if(fileTpe === item) {
          isType = true
        }
      })
      if(!isType) {
        // this.handleFormatError(file)
        return
      }
      return new Promise((resolve, reject) => {
        this.$Message.loading({
          content: '上传中...',
          duration: 0
        })
        let isLt2M = file.size / 1024 < 0.3 // 判定图片大小是否小于4MB
        if (isLt2M) {
          resolve(file)
        }
        // 压缩到质量为0.6的
        imageConversion.compress(file, 0.6).then(res => { // console.log(res)
          // 将Blob 转换到 file中
          file = new window.File(
            [res],
            file.name,
            { type: file.type }
          )
          // this.$refs.upload.fileList = []
          // this.$refs.upload.fileList.push(file.File)
          // this.$refs.upload.fileList.splice(0, 1, file.File)
          resolve(file)
        })
      })
    },
    handleSuccess (res, file) {
      this.$Message.destroy()
      if(res.code === 'OK') {
        this.$Message.success(res.msg)
      }else{
        var index = Number(this.$refs.upload.fileList.length) - 1
        this.$refs.upload.fileList.splice(index, 1)
        this.$Message.error(res.msg)
        return
      }
      this.$emit('changeImgParams', res.data)
      file.url = res.data
      this.uploadListImg = this.$refs.upload.fileList
    },
    handleFormatError (file) { // 格式错误
      this.$Message.destroy()
      this.$Notice.warning({
        title: '文件格式错误',
        desc: '请选择' + this.acceptTypeStr + '格式的文件'
      })
    },
    formatError() {
      this.$Message.destroy()
      this.$Message.error('请选择正确的文件格式')
    }
  }
}
</script>

<style lang="less">
  .ivu-upload{
    display: inline-block
  }
  .demo-upload-list{
    display: inline-block;
    width:180px;
    text-align: center;
    line-height: 60px;
    border: 1px solid transparent;
    border-radius: 4px;
    overflow: hidden;
    background: #fff;
    position: relative;
    box-shadow: 0 1px 1px rgba(0,0,0,.2);
    margin-right: 4px;
  }
  .demo-upload-list img{
    width: 100%;
    height: 100%;
  }
  .demo-upload-list-cover{
    display: none;
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    background: rgba(0,0,0,.6);
  }
  .demo-upload-list:hover .demo-upload-list-cover{
    display: block;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
  }
  .demo-upload-list-cover i{
    color: #fff;
    font-size: 40px;
    cursor: pointer;
    margin: 0 2px;
  }

  .demo-upload-list-cover i:hover {
    color: #3E8EF7;
  }
</style>
