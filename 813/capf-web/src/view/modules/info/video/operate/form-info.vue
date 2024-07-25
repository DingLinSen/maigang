<!--
 * @description videomanagement- 视频管理表--新增/编辑查看/界面
 * @author yxm
 * @date 2022-04-07
 * -->
<template>
  <div class="details-container">
    <div class="details-title">
      <p>
        {{
          isSee
            ? '查看' + routerTitle + '信息'
            : !isOperate
            ? '新增' + routerTitle + '信息'
            : '编辑' + routerTitle + '信息'
        }}
      </p>
      <Icon type="md-close" @click.stop="handleCancleModelSub" />
    </div>
    <div class="details-content">
      <Form :model="formData" ref="formValidate" :rules="formValidate">
        <Row :gutter="32">
          <Col span="12">
            <FormItem label="视频标题" label-position="top" prop="title">
              <Input
                type="text"
                v-model.trim="formData.title"
                placeholder="请输入视频标题"
                ref="title"
                :disabled="isSee"
                :maxlength="20"
              />
            </FormItem>
          </Col>
          <Col span="12">
            <FormItem label="课目类型" label-position="top" prop="type">
              <Select
                v-model="formData.type"
                ref="type"
                disabled
                remote
                name="select"
                :clearable="false"
                placeholder="请选择课目类型"
              >
                <Option value="1" label="理论知识"></Option>
                <Option value="2" label="专业操作"></Option>
              </Select>
            </FormItem>
          </Col>
          <Col span="12">
            <FormItem label="课目名称" label-position="top" prop="subjectId">
              <Select
                v-model="formData.subjectId"
                ref="subjectId"
                :disabled="isSee"
                remote
                name="select"
                :clearable="false"
                placeholder="请选择课目名称"
                @on-change="subjectChange"
              >
                <Option
                  v-for="item in subjectArray"
                  :value="item.id"
                  :key="item.id"
                  :label="item.name"
                ></Option>
              </Select>
            </FormItem>
          </Col>
          <Col span="12">
            <FormItem label="章节" label-position="top" prop="chapterId">
              <Select
                v-model="formData.chapterId"
                ref="chapterId"
                :disabled="isSee"
                remote
                name="select"
                :clearable="false"
                placeholder="请选择章节"
              >
                <Option
                  v-for="item in chapterArray"
                  :value="item.id"
                  :key="item.id"
                  :label="item.chapterTitle + '\xa0\xa0' + item.chapter"
                ></Option>
              </Select>
            </FormItem>
          </Col>
          <Col span="24">
            <FormItem label="视频简介" label-position="top" prop="introduction">
              <Input
                type="textarea"
                :row="4"
                v-model.trim="formData.introduction"
                placeholder="请输入视频简介"
                ref="introduction"
                :disabled="isSee"
                :maxlength="100"
              />
            </FormItem>
          </Col>
          <Col span="24">
            <FormItem label="视频内容" label-position="top" prop="filePath">
              <br />
              <uploadFile
                v-model="fillList"
                v-show="!isSee"
                ref="uploadBanner"
                :showUpload="true"
                :uploadURL="uploadURL"
                :maxSize="1024 * 1024"
                :acceptType="['mpeg', 'avi', 'mpg', 'mp4', 'wmv']"
                :fileNum="1"
                :data="uploadParams"
                @changeFileParams="uploadSuccess"
                @beforeUploadInfo="beforeUploadInfo"
                class="uploadImg"
              ></uploadFile>
              <div v-if="isSee" style="width:55%;">
                <div
                  class="ivu-upload-list-file ivu-upload-list-file-finish"
                  v-for="(item, index) in fillList"
                  :key="index"
                >
                  <i :class="[ /\.mpeg|\.mpg/.test(item.url.toLowerCase()) ? 'ivu-icon ivu-icon-ios-document-outline' : 'ivu-icon ivu-icon-ios-film']"></i>
                  <span @click="scanFile(index)">{{ item.name }}</span>
                </div>
              </div>
            </FormItem>
          </Col>
        </Row>
      </Form>
      <div class="demo-drawer-footer" style="text-align: center;">
        <Button type="primary" @click="handleValidate" v-if="!isSee"
          >确认{{ !isOperate ? '新增' : '编辑' }}</Button
        >
        <Button
          type="default"
          class="mar-lft-10"
          @click.stop="handleCancleModelSub"
          >取消操作</Button
        >
      </div>
    </div>
    <Dialog
      :sysName="sysName"
      :moduleName="moduleName"
      ref="dialogDetails"
      :title="diaTitle"
      :courseUrl="diaPath"
      :isPdf="true"
      :defaultHeight="defaultHeight"
    ></Dialog>
  </div>
</template>

<script>
import {
  operateVideoManagementInfo,
  initVideoManagementDetailsById
} from '@/api/info/video/api-modules-videomanagement'
import { initSubjectList } from '@/api/info/resource/api-modules-datamanagement'
import { initSubjectManagementDetailsById } from '@/api/info/subject/api-modules-subjectmanagement'
import uploadFile from '@/components/upload/upload-file'
import { OPERATE_PAGE } from '@/libs/mixin'
import FormDataInfo from './form'
import RulesValidate from './form-validate'
import Dialog from './../../../video/dialogVideo'
export default {
  mixins: [OPERATE_PAGE],
  data() {
    return {
      showDrawer: false,
      formData: FormDataInfo(),
      formValidate: RulesValidate(this),
      subjectArray: [],
      chapterArray: [],
      fillList: [], // 上传文件model
      uploadParams: {
        onePathName: 'file',
        twoPathName: 'file'
      },
      videoDuration: 0,
      defaultHeight: 500, // 弹出框默认高度
      diaTitle: null,
      diaPath: null,
      diaFileName: null,
      sysName: null,
      moduleName: null,
      uploadURL: 'common/upload/uploadFile' // 上传地址
    }
  },
  computed: {
    documentClientHeight: {
      get() {
        return this.$store.state.common.documentClientHeight
      },
      set(val) {
        this.$store.commit('common/updateDocumentClientHeight', val)
      }
    }
  },
  watch: {
    documentClientHeight: function() {
      this.initDialogHeight()
    }
  },
  components: {
    uploadFile,
    Dialog
  },
  activated() {
    this.fillList = []
    this.$refs.uploadBanner.clearFiles()
    this.$refs.uploadBanner.uploadData(this.fillList)
    this.initSubjectList()
    this.initFormData()
    this.initDialogHeight()
  },
  methods: {
    initDialogHeight() {
      this.defaultHeight = this.documentClientHeight - 80
    },
    // 初始化章节列表
    initSubjectList() {
      if(this.isSee){
        return
      }
      this.$nextTick(() => {
        let params = {}
        this.subjectArray = []
        initSubjectList(params)
          .then(res => {
            if (res.data.status) {
              const data = res.data
              if (data == null) {
                this.$Message.error('未查询到相关信息')
                this.handleCancleModelSub()
                return
              }
              this.subjectArray = data.data
            }
          })
          .catch(() => {})
      })
    },
    // 根据id 获取详情
    initFormData() {
      this.handleReset() // 重置表单
      let params = {
        id: this.detailsId
      }
      this.$nextTick(() => {
        this.formData = FormDataInfo()
        if (this.isOperate) {
          initVideoManagementDetailsById(params)
            .then(res => {
              if (res.data.status) {
                const data = res.data
                if (data == null) {
                  this.$Message.error('未查询到相关信息')
                  this.handleCancleModel()
                  return
                }
                this.formData = res.data.videoManagementDO
                this.formData.type = String(this.formData.type)
                this.$nextTick(() => {
                  this.getChapterArray(this.formData.subjectId)
                })
                var fileNames = this.formData.filePath.split('/')
                this.fillList = [
                  {
                    name: this.formData.fileName
                      ? this.formData.fileName
                      : fileNames[fileNames.length - 1],
                    url: this.formData.filePath,
                    status: 'finished'
                  }
                ]
                this.$refs.uploadBanner.uploadData(this.fillList)
                if (this.isSee) {
                  this.subjectArray = [
                    {
                      id: res.data.dataManagementDO.subjectId,
                      name: res.data.dataManagementDO.subjectName
                    }
                  ]
                }
              } else {
                this.formData = FormDataInfo()
                // this.$Message.error('获取信息详情时异常，请联系管理员')
              }
            })
            .catch(() => {})
        }
      })
    },
    // 保存信息 （添加和编辑）
    handleSubmit() {
      let params = Object.assign(
        { ...this.formData },
        {
          isOperate: this.isOperate
        }
      )
      Object.keys(this.formData).forEach((item, index) => {
        if (!params[item]) {
          if (this.formData[item]) {
            params[item] = ((this.formData[item] || null) + '').trim()
          }
        }
      })
      if (this.fillList && this.fillList.length > 0) {
        params['fileName'] = this.fillList[0].name
      }
      operateVideoManagementInfo(params)
        .then(({ data }) => {
          this.$Spin.hide()
          if (data.status) {
            this.$Message.success('成功保存信息')
            this.handleCancleModel()
            this.$nextTick(() => {
              this.$emit('operateSuccess', params)
            })
          } else {
            // this.$Message.error('保存信息时系统异常')
          }
        })
        .catch(() => {})
    },

    // 打开弹框并初始化
    handleOpenModel() {
      this.showDrawer = true
      this.initFormData()
    },
    //选择课目
    subjectChange(val) {
      this.subjectArray.forEach(item => {
        if (item.id === val) {
          this.formData.type = String(item.type)
        }
      })
      this.formData.chapterId = null
      this.getChapterArray(val)
    },
    getChapterArray(val) {
      if (!val) {
        return
      }
      let params = {
        id: val
      }
      this.$nextTick(() => {
        initSubjectManagementDetailsById(params)
          .then(res => {
            if (res.data.status) {
              const data = res.data
              if (data == null) {
                this.$Message.error('未查询到相关章节信息')
                return
              }
              var formData = res.data.subjectManagementDO
              this.chapterArray = []
              if (formData.delFlag === '2') {
                if (!this.isSee) {
                  this.formData.subjectId = null
                  this.formData.chapterId = null
                  return
                }
              }
              if (
                formData.subjectChapterDOS &&
                formData.subjectChapterDOS.length > 0
              ) {
                this.chapterArray = formData.subjectChapterDOS
              }
            }
          })
          .catch(() => {})
      })
    },
    // 文件上传完成后，把值赋值给formdata
    uploadSuccess(params) {
      // console.log(params)
      if (params) {
        this.formData.filePath = params.uploadPath ? params.uploadPath : null
        this.fillList = params.uploadPath
          ? [
              {
                name: params.originalFileName,
                url: params.uploadPath,
                status: 'finished'
              }
            ]
          : []
      } else {
        this.formData.filePath = null
        this.fillList = []
      }
    },
    // 取消创建
    handleCancleModelSub() {
      this.fillList = []
      this.$refs.uploadBanner.clearFiles()
      this.$refs.uploadBanner.uploadData(this.fillList)
      this.handleCancleModel()
    },
    //查看文件
    scanFile(index) {
      this.diaTitle = this.fillList[index].name
      this.diaPath = this.fillList[index].url
      this.diaFileName = this.formData.title
      this.sysName = '文件下载'
      this.moduleName = ''
      this.$refs.dialogDetails.open()
    },
    beforeUploadInfo(file) {
      var url = URL.createObjectURL(file)
      var audioElement = new Audio(url)
      var self = this
      var result
      audioElement.addEventListener('loadedmetadata', function() {
        // 视频时长值的获取要等到这个匿名函数执行完毕才产生
        result = parseInt(audioElement.duration) //得到时长为秒，小数，182.36
        self.formData.duration = result //转为int值
      })
    }
  }
}
</script>
<style lang="less" scoped></style>
