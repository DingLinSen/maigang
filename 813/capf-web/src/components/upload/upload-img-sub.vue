<template lang="html">
  <div>
    <Modal
      v-model="showImage"
      width="800"
      style="text-align:center;padding: 0px"
      :footer-hide="true"
      :closable="true"
    >
      <img
        :src="imageItemUrl"
        style="max-width: 100%; max-height: 400px;object-fit:contain;margin-top:20px"
        v-if="type === 'image'"
      />
    </Modal>

    <div
      class="demo-upload-list"
      v-for="(item, index) in uploadList"
      :key="index"
    >
      <template v-if="item.status === 'finished'">
        <img
          :src="imageURL + item.url"
          style="cursor: pointer;object-fit:contain;width:100%;height:100%;"
          v-if="type === 'image'"
        />
        <span
          style="max-width: 100%; max-height: 500px;"
          v-if="type !== 'image'"
        >
          {{ item.name }}
        </span>
        <div class="demo-upload-list-cover">
          <Icon
            type="ios-eye-outline"
            v-if="type === 'image'"
            @click.native="handleView(item)"
          ></Icon>
          <Icon
            type="ios-trash-outline"
            v-if="fileNum > 0 && showRemove"
            @click.native="handleRemove(item)"
          ></Icon>
        </div>
      </template>
      <template v-else>
  <Progress
    v-if="item.showProgress"
    :percent="item.percentage"
    hide-info
  ></Progress>
</template>
    </div>
    <!-- :on-format-error="handleFormatError" -->
    <Upload
      v-show="showUpload && fileNum > uploadList.length"
      ref="upload"
      :show-upload-list="false"
      :default-file-list="defaultList"
      :headers="{ token: this.$cookie.get('token') }"
      :action="url"
      :on-success="handleSuccess"
      :format="acceptType"
      :max-size="maxSize"
      :with-credentials="true"
      :on-exceeded-size="handleMaxSize"
      :before-upload="beforeUpload"
      :data="data"
      type="drag"
      style="display: inline-block;width: 50%"
    >
      <div style="padding: 20px 0" class="c-index-base">
        <Icon type="md-add" size="40" />
        <p class="mar-btm-5" style="font-size: 12px">
          温馨提示：文件建议不超过{{ maxSize / 1024 }}M，只支持{{
            acceptTypeStr
          }}格式文件。
        </p>
      </div>
    </Upload>
    <p v-if="uploadList.length === 0 && !showUpload" class="prompt">
      暂无图片
    </p>
  </div>
</template>
<script>
// import imageConversion from 'image-conversion'
export default {
  // components: {imageConversion},
  data() {
    return {
      params: {},
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
    data: {
      type: Object,
      default: () => {
        return {}
      }
    },
    showUpload: {
      type: Boolean,
      default: false
    },
    showRemove: {
      type: Boolean,
      default: true
    },
    size: {
      type: Number,
      default: 1
    },
    type: {
      default: 'upload',
      type: String
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
    },
    maxSize: {
      // 最大大小
      type: Number,
      default: 5 * 1024
    },
    fileNum: {
      // 文件个数
      type: Number,
      default: 1
    },
    minWidth: {
      // 最小宽度
      type: Number,
      default: 1
    },
    minHeight: {
      // 最小高度
      type: Number,
      default: 1
    },
    maxWidth: {
      // 最大宽度
      type: Number,
      default: 2000
    },
    maxHeight: {
      // 最大高度
      type: Number,
      default: 2000
    }
  },
  watch: {
    defaultList() {
      // console.log(this.$refs.upload.fileList)
      this.uploadList = this.$refs.upload.fileList
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
    handleView(item) {
      // this.$Message.destroy()
      this.showImage = true
      this.imageItemUrl = this.imageURL + item.url
    },
    handleRemove(file) {
      const fileList = [...this.$refs.upload.fileList]
      this.$refs.upload.fileList.splice(fileList.indexOf(file), 1)
      this.uploadListImg = []
      this.$emit('changeImgParams', '')
    },
    handleMaxSize(file, fileList) {
      // this.$Message.destroy()
      this.$Notice.warning({
        title: '文件大小超限',
        desc:
          '文件  ' +
          file.name +
          ' 太大，上传文件大小不能超过' +
          this.maxSize / 1024 +
          'M.'
      })
    },

    async beforeUpload(file) {
      // const check = this.uploadList.length > 3
      // if (check) {
      //   this.$Notice.warning({
      //     title: '文件上传超出限制',
      //     desc: `最多可上传${this.size}个文件资料`
      //   })
      //   return false
      // }

      // this.$Message.destroy()
      var fileName = file.name
      var fileTpe = fileName.substring(fileName.lastIndexOf('.') + 1)
      var isType = false // 格式不正确  true 格式正确

      this.acceptType.forEach(item => {
        if (fileTpe === item) {
          isType = true
        }
      })
      if (!isType) {
        this.handleFormatError(file)
      }

      if (this.type === 'image') {
        return this.checkImageWH(
          file,
          this.minWidth,
          this.minHeight,
          this.maxWidth,
          this.maxHeight
        )
        // return new Promise((resolve, reject) => {
        //   this.$Message.loading({
        //     content: '上传中...',
        //     duration: 0
        //   })
        //   let isLt2M = file.size / 1024 < 0.3 // 判定图片大小是否小于4MB
        //   if (isLt2M) {
        //     resolve(file)
        //   }
        //   // 压缩到400KB,这里的400就是要压缩的大小,可自定义
        //   imageConversion.compressAccurately(file, 40).then(res => {
        //     // console.log(res)
        // eslint-disable-next-line no-irregular-whitespace
        //     // 将 Blob 转换到 file中
        //     file = new window.File([res], file.name, { type: file.type })
        //     // this.$refs.upload.fileList = []
        //     // this.$refs.upload.fileList.push(file.File)
        //     // this.$refs.upload.fileList.splice(0, 1, file.File)
        //     resolve(file)
        //   })
        // })
      } else {
        return new Promise(resolve => {
          this.$nextTick(function () {
            resolve(true)
          })
        })
      }
    },
    // checkImageWH  返回一个promise  监测通过返回resolve  失败返回reject组织图片上传==判断图片上传的大小
    checkImageWH(file, minWidth, minHeight, maxWidth, maxHeight) {
      let self = this
      return new Promise(function (resolve, reject) {
        let filereader = new FileReader()
        filereader.onload = e => {
          let src = e.target.result
          const image = new Image()
          image.onload = function () {
            if (!minWidth || !maxWidth || this.width < minWidth) {
              self.$Message.error('请上传宽度在' + minWidth + 'px以上的图片')
              reject()
            } else if (!minHeight || !maxHeight || this.height < minHeight) {
              self.$Message.error('请上传高度在' + minHeight + 'px以上的图片')
              reject()
            } else {
              resolve()
            }
            // if (!minWidth || !maxWidth || this.width < minWidth || this.width > maxWidth) {
            //   self.$Message.error('请上传宽度在' + minWidth + 'px~' + maxWidth + 'px的图片')
            //   reject()
            // } else if (!minHeight || !maxHeight || this.height < minHeight || this.height > maxHeight) {
            //   self.$Message.error('请上传高度在' + minHeight + 'px~' + maxHeight + 'px的图片')
            //   reject()
            // } else {
            //   resolve()
            // }
          }
          image.onerror = reject
          image.src = src
        }
        filereader.readAsDataURL(file)
      })
    },
    handleSuccess(res, file) {
      // this.$Message.destroy()
      if (res.result === 'OK') {
        this.$Message.success(res.msg)
      } else {
        var index = Number(this.$refs.upload.fileList.length) - 1
        this.$refs.upload.fileList.splice(index, 1)
        this.$Message.error(res.msg)
        return
      }

      this.$emit('changeImgParams', res.data)
      file.url = res.data.uploadPath
      this.uploadListImg = this.$refs.upload.fileList
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
    formatError() {
      // this.$Message.destroy()
      this.$Message.error('请选择正确的文件格式')
    }
  }
}
</script>

<style lang="less" scoped>
.demo-upload-list {
  display: inline-block;
  width: 300px;
  height: 150px;
  text-align: center;
  line-height: 60px;
  border: 1px solid transparent;
  border-radius: 4px;
  overflow: hidden;
  background: #fff;
  position: relative;
  box-shadow: 0px 0px 1px 1px rgba(0, 0, 0, 0.2);
  margin-right: 4px;

  .ivu-upload {
    display: inline-block;
  }
}
.demo-upload-list img {
  width: 100%;
}
.demo-upload-list-cover {
  display: none;
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(0, 0, 0, 0.6);
}
.demo-upload-list:hover .demo-upload-list-cover {
  display: block;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}
.demo-upload-list-cover i {
  color: #fff;
  font-size: 40px;
  cursor: pointer;
  margin: 0 2px;
}

.demo-upload-list-cover i:hover {
  color: #3e8ef7;
}
.prompt {
  font-size: 13px;
  display: inline-block;
  width: 50%;
  height: 150px;
  border: 1px dashed #29a387;
  border-radius: 4px;
  box-shadow: 0 1px 1px rgba(0, 0, 0, 0.2);
  line-height: 150px;
  text-align: center;
}
</style>
