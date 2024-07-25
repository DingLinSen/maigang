<!--
 * @description datamanagement- ${comments}--新增/编辑查看/界面
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
            <FormItem label="资料标题" label-position="top" prop="title">
              <Input
                type="text"
                v-model.trim="formData.title"
                placeholder="请输入资料标题"
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
            <FormItem label="资料简介" label-position="top" prop="introduction">
              <Input
                type="textarea"
                :row="4"
                v-model.trim="formData.introduction"
                placeholder="请输入资料简介"
                ref="introduction"
                :disabled="isSee"
                :maxlength="100"
              />
            </FormItem>
          </Col>
          <Col span="24">
            <FormItem label="文档内容" label-position="top" prop="filePath">
              <br />
              <uploadFile
                v-model="fillList"
                v-show="!isSee"
                ref="uploadBanner"
                :showUpload="true"
                :uploadURL="uploadURL"
                :maxSize="100 * 1024"
                :acceptType="[
                  'ppt',
                  'pptx',
                  'pdf',
                  'docx',
                  'jpg',
                  'jpeg',
                  'png'
                ]"
                :fileNum="1"
                :data="uploadParams"
                @changeFileParams="uploadSuccess"
                class="uploadImg"
              ></uploadFile>
              <div v-if="isSee" style="width:55%;">
                <div
                  class="ivu-upload-list-file ivu-upload-list-file-finish"
                  v-for="(item, index) in fillList"
                  :key="index"
                >
                  <i
                    :class="[
                      /\.png|\.jpg|\.jpeg|\.bmp/.test(item.url.toLowerCase())
                        ? 'ivu-icon ivu-icon-ios-image'
                        : /\.ppt|\.pptx/.test(item.url.toLowerCase())
                        ? 'ivu-icon ivu-icon-ios-videocam'
                        : 'ivu-icon ivu-icon-md-document'
                    ]"
                  ></i>
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
      :url="diaPath"
      :isPdf="true"
      :fileName="diaFileName"
      :picArray="picArray"
      :defaultHeight="defaultHeight"
    ></Dialog>
  </div>
</template>

<script>
import {
  operateDataManagementInfo,
  initDataManagementDetailsById,
  initSubjectList
} from '@/api/info/resource/api-modules-datamanagement'
import uploadFile from '@/components/upload/upload-file'
import { initSubjectManagementDetailsById } from '@/api/info/subject/api-modules-subjectmanagement'
import { OPERATE_PAGE } from '@/libs/mixin'
import FormDataInfo from './form'
import RulesValidate from './form-validate'
import Dialog from './../../../pdf/dialogDetails'
export default {
  mixins: [OPERATE_PAGE],
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
  data() {
    return {
      showDrawer: false,
      formData: FormDataInfo(),
      formValidate: RulesValidate(this),
      subjectArray: [],
      chapterArray: [],
      fillList: [], // 上传文件model
      ppt2PngArray: [],
      picArray: [],
      uploadParams: {
        onePathName: 'file',
        twoPathName: 'file'
      },
      defaultHeight: 500, // 弹出框默认高度
      diaTitle: null,
      diaPath: null,
      diaFileName: null,
      sysName: null,
      moduleName: null,
      uploadURL: 'common/upload/uploadFile' // 上传地址
    }
  },
  activated() {
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
      if(this.isSee) {
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
          initDataManagementDetailsById(params)
            .then(res => {
              if (res.data.status) {
                const data = res.data
                if (data == null) {
                  this.$Message.error('未查询到相关信息')
                  this.handleCancleModelSub()
                  return
                }
                this.formData = res.data.dataManagementDO
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
                this.ppt2PngArray = []
                this.$refs.uploadBanner.uploadData(this.fillList)
                var pptArray = this.formData.dataFileSubDOS
                  ? this.formData.dataFileSubDOS
                  : []
                pptArray.forEach(item => {
                  if (item.filePath) {
                    this.ppt2PngArray.push({
                      filePath: item.filePath,
                      sort: item.sort
                    })
                  }
                })
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
      var pptArray = []
      if (this.ppt2PngArray && this.ppt2PngArray.length > 0) {
        this.ppt2PngArray.forEach(item => {
          if (item.filePath) {
            pptArray.push({
              filePath: item.filePath,
              sort: item.sort
            })
          }
        })
      }
      if (pptArray.length > 0) {
        params['dataFileSubDOS'] = pptArray
      }

      operateDataManagementInfo(params)
        .then(({ data }) => {
          this.$Spin.hide()
          if (data.status) {
            this.$Message.success('成功保存信息')
            this.handleCancleModelSub()
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
    // 选择课目
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
        var pptArray = params.ppt2png ? params.ppt2png : []
        this.ppt2PngArray = []
        pptArray.forEach(item => {
          if (item) {
            this.ppt2PngArray.push({ filePath: item.path, sort: item.sort })
          }
        })

        // console.log(this.ppt2PngArray)
      } else {
        this.formData.filePath = null
        this.fillList = []
        this.ppt2PngArray = []
      }
    },
    // 取消创建
    handleCancleModelSub() {
      this.fillList = []
      this.$refs.uploadBanner.clearFiles()
      this.$refs.uploadBanner.uploadData(this.fillList)
      this.handleCancleModel()
    },
    // 查看文件
    scanFile(index) {
      this.diaTitle = this.fillList[index].name
      this.diaPath = this.fillList[index].url
      this.diaFileName = this.formData.title
      this.sysName = '文件下载'
      this.moduleName = ''
      this.picArray = []
      if (this.ppt2PngArray.length > 0) {
        this.ppt2PngArray.sort((a, b) => parseInt(a.sort) - parseInt(b.sort))
        this.ppt2PngArray.forEach(item => {
          this.picArray.push(item.filePath)
        })
      }
      this.$refs.dialogDetails.open()
    }
  }
}
</script>
<style lang="less" scoped>
.styleqq {
  padding: 4px;
  color: #515a6e;
  border-radius: 4px;
  transition: background-color 0.2s ease-in-out;
  position: relative;
}
</style>
