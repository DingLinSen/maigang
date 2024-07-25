<template>
  <Drawer :mask-closable="false" title=""
    v-model="showModel"
    width="260"
    :styles="styles"
    :transfer="false"
    :inner="true">
    <p slot="header" style="color:#29A387; text-align:center">
      <Icon type="md-cloud-upload" class="text-lg"></Icon>
      <span>{{ modelTitle }}</span>
    </p>
    <p class="mar-btm">
      <p v-if='downloadURL !== undefined'>请先选择 <span class="c-red">“下载模板”</span> ，根据模板提供的内容样式填充对应数据，然后选择文件上传。</p>
      <br v-if='downloadURL !== undefined'>
      <span class="c-red">注：只能上传{{acceptTypeStr}} 格式的文件</span> <br/><br/>
    </p>
    <slot name="uploadParams"></slot>
    <upload-file :params="uploadData"
      :uploadURL="uploadURL"
      :acceptType="acceptType"
      :fileNum="1"
      :maxSize="5*1024"
      @handleUpload="handleUpload" v-if= "showSubmodel"></upload-file>
    <Button type="error" size="large" long icon="md-download" class="mar-top" v-if='downloadURL !== undefined' @click="downloadTemplate()">下载模板</Button>
  </Drawer>
</template>
<script>
import { exportModelFile } from '@/api/api-base'
import UploadFile from './upload'
export default {
  watch: {
    'uploadParams': function() {
      this.uploadData = Object.assign((this.uploadParams || {}), {
      })
    }
  },
  mounted() {
    this.showSubmodel = false
    this.uploadData = Object.assign((this.uploadParams || {}), {
    })
    this.acceptTypeStr = ''
    for(var i = 0; i < this.acceptType.length; i++) {
      this.acceptTypeStr = this.acceptTypeStr + ' ' + this.acceptType[i]
    }
  },
  components: {
    UploadFile
  },
  data() {
    return {
      uploadData: {},
      showModel: false,
      styles: {
        bottom: '0'
      },
      showSubmodel: true,
      acceptTypeStr: ''
    }
  },
  props: {
    uploadTip: { // 切换提示文字
      default: false,
      type: Boolean
    },
    acceptType: {
      type: Array,
      default: () => {
        return []
      }
    },
    modelTitle: null,
    downloadURL: null,
    uploadURL: null,
    uploadParams: {
      type: Object,
      // eslint-disable-next-line vue/require-valid-default-prop
      default: {}
    }
  },
  methods: {
    handleUpload(value) {
      if (value) {
        this.showModel = false
      }
      this.$emit('handleUpload', value)
    },
    openModel() {
      this.showSubmodel = false
      setTimeout(() => {
        this.showModel = true
        this.openSub()
      }, 100)
    },
    openSub() {
      this.showSubmodel = true
    },
    async downloadTemplate() {
      this.$emit('downloadTemplate', 'download')
      await exportModelFile(this.downloadURL)
    }
  }
}
</script>
