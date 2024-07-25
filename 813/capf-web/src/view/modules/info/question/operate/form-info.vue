<!--
 * @description videomanagement- 题库管理表--新增/编辑查看/界面
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
          <Col span="24">
            <FormItem label="题目" label-position="top" prop="title">
              <Input
                type="textarea"
                :row="4"
                v-model.trim="formData.title"
                placeholder="请输入题目"
                ref="introduction"
                :disabled="isSee"
                :maxlength="300"
              />
            </FormItem>
          </Col>
          <Col span="12">
            <FormItem
              label="题目难度"
              label-position="top"
              prop="answerDifficulty"
            >
              <Select
                v-model="formData.answerDifficulty"
                ref="answerDifficulty"
                :disabled="isSee"
                remote
                name="select"
                :clearable="false"
                placeholder="请选择课目类型"
              >
                <Option value="1" label="低"></Option>
                <Option value="2" label="中"></Option>
                <Option value="3" label="高"></Option>
              </Select>
            </FormItem>
          </Col>
          <Col span="12">
            <FormItem label="题目类型" label-position="top" prop="answerType">
              <Select
                v-model="formData.answerType"
                ref="answerType"
                :disabled="isSee"
                remote
                name="select"
                :clearable="false"
                placeholder="请选择题目类型"
                @on-change="questionTypeChange"
              >
                <Option value="1" label="单选"></Option>
                <Option value="2" label="多选"></Option>
                <Option value="3" label="判断"></Option>
                <Option value="4" label="填空"></Option>
                <Option value="5" label="简答"></Option>
              </Select>
            </FormItem>
          </Col>

          <Col span="12">
            <FormItem label="课目类型" label-position="top" prop="subjectType">
              <Select
                v-model="formData.subjectType"
                ref="subjectType"
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
            <FormItem label="题目来源" label-position="top" prop="source">
              <Input
                type="text"
                v-model.trim="formData.source"
                placeholder="请输入题目来源"
                ref="source"
                :disabled="isSee"
                :maxlength="50"
              />
            </FormItem>
          </Col>
          <Col span="24">
            <FormItem
              label="选项区域"
              label-position="top"
              prop="answerArray"
              v-if="formData.answerType !== '5'"
            >
              <br />
              <br />
              <div>
                <div
                  style="display: flex; margin-top: -25px"
                  v-if="formData.answerType !== '3' && !isSee"
                >
                  <Button
                    type="primary"
                    style="width: 140px; margin-bottom: 10px"
                    @click="addMoreAnswer"
                    >添加题目选项</Button
                  >
                  <span class="asterisk">*</span>
                  <span class="remark">最多容纳8个选项</span>
                </div>
                <div
                  v-if="
                    formData.answerType === '1' ||
                    formData.answerType === '3' ||
                    formData.answerType === '4'
                  "
                >
                  <RadioGroup
                    v-model="answerFlag"
                    vertical
                    style="width: 100%"
                    :disabled="isSee"
                    v-if="
                      formData.answerArray && formData.answerArray.length > 0
                    "
                    @on-change="chooseChange"
                  >
                    <div
                      v-for="(item, index) in formData.answerArray"
                      :key="index"
                      style="display: flex; margin-bottom: 25px"
                    >
                      <Form
                        ref="ruleForm"
                        :model="item"
                        :rules="formValidate1"
                        style="width: 100%"
                      >
                        <FormItem prop="content" style="width: 100%">
                          <div style="display: flex">
                            <Radio
                              :label="item.sortFlag"
                              style="width: 90%"
                              :disabled="isSee"
                            >
                              <span> {{ item.sortFlag }} </span>
                              <!-- {{item.content ? item.content : '2'}} -->
                              <Input
                                v-model="item.content"
                                style="margin-left: 5px; width: 95%"
                                placeholder="请输入选项内容"
                                :ref="item.sortFlag"
                                :readonly="formData.answerType === '3'"
                                :disabled="isSee"
                                :maxlength="100"
                                @blur="inputChange($event, index)"
                              />
                              <!-- @input="inputChange($event,index)" -->
                            </Radio>
                            <span
                              v-if="!isSee && formData.answerType !== '3'"
                              class="c-error"
                              style="margin-left: 20px; cursor: pointer"
                              @click="deleteAnswerChoose(index)"
                              >删除</span
                            >
                          </div>
                        </FormItem>
                      </Form>
                    </div>
                  </RadioGroup>
                </div>
                <div v-if="formData.answerType === '2'">
                  <div
                    style="display: flex; margin-bottom: 25px"
                    v-for="(item, index) in formData.answerArray"
                    :key="index"
                  >
                    <Form
                      ref="ruleForm"
                      :model="item"
                      :rules="formValidate1"
                      style="width: 100%"
                    >
                      <FormItem prop="content" style="width: 100%">
                        <Checkbox
                          v-model="item.seleted"
                          :label="item.sortFlag"
                          :disabled="isSee"
                          style="width: 90%"
                        >
                          <!-- @on-change="chooseMultipleChange($event,index)" -->
                          <span> {{ item.sortFlag }} </span>
                          <Input
                            type="text"
                            v-model="item.content"
                            style="margin-left: 5px; width: 95%"
                            placeholder="请输入选项内容"
                            ref="content"
                            :disabled="isSee || formData.answerType === '3'"
                            :maxlength="100"
                          />
                          <!-- @input="inputChange($event,index)" -->
                        </Checkbox>
                        <span
                          v-if="!isSee && formData.answerType !== '3'"
                          class="c-error"
                          style="margin-left: 20px; cursor: pointer"
                          @click="deleteMultipleChoose(index)"
                          >删除</span
                        >
                      </FormItem>
                    </Form>
                  </div>
                </div>
              </div>
            </FormItem>
          </Col>
          <Col span="24">
            <FormItem
              label="解答参考区域"
              label-position="top"
              prop="answerText"
              v-if="formData.answerType === '5'"
            >
              <Input
                type="textarea"
                :autosize="{ minRows: 4 }"
                v-model.trim="formData.answerText"
                placeholder="请输入参考答案关键词，若多个关键词请用;隔开。例如：关键词;主题语"
                ref="answerText"
                :disabled="isSee"
                :maxlength="500"
              />
            </FormItem>
          </Col>
          <Col span="12">
            <FormItem label="图片上传" label-position="top" prop="picturePath">
              <br />
              <uploadImg
                v-model="fillImgList"
                ref="uploadImg"
                type="image"
                :showUpload="!isSee"
                :showRemove="!isSee"
                :uploadURL="uploadURL"
                :imageURL="imageURL"
                :maxSize="100 * 1024"
                :acceptType="['jpg', 'jpeg', 'png']"
                :fileNum="1"
                :data="uploadParams"
                @changeImgParams="uploadImgSuccess"
                class="uploadImg"
              ></uploadImg>
            </FormItem>
          </Col>
          <Col span="12">
            <FormItem label="视频上传" label-position="top" prop="videoPath">
              <br />
              <uploadFile
                v-model="fillVideoList"
                :showUpload="!isSee"
                ref="uploadVideo"
                :uploadURL="uploadURL"
                :maxSize="1024 * 1024"
                :acceptType="['mpeg', 'avi', 'mpg', 'mp4', 'wmv']"
                :fileNum="1"
                :data="uploadParams"
                @changeFileParams="uploadVideoSuccess"
                class="uploadImg"
              ></uploadFile>
              <!-- @beforeUploadInfo="beforeUploadInfo" -->
              <div v-if="isSee && fillVideoList.length > 0" class="prompt">
                <div
                  class="ivu-upload-list-file ivu-upload-list-file-finish"
                  v-for="(item, index) in fillVideoList"
                  :key="index"
                >
                  <i class="ivu-icon ivu-icon-ios-film"></i>
                  <span @click="scanFile(index)">{{ item.name }}</span>
                </div>
              </div>
            </FormItem>
          </Col>
        </Row>
      </Form>
      <div class="demo-drawer-footer" style="text-align: center">
        <Button type="primary" @click="handleValidate" v-if="!isSee"
          >确认{{ !isOperate ? '新增' : '编辑' }}</Button
        >
        <!-- <Button
          type="error"
          class="mar-lft-10"
          @click.stop="handleResetSub"
          v-if="!isSee"
          >重置信息</Button
        > -->
        <Button
          type="default"
          class="mar-lft-10"
          @click.stop="handleCancleModelSub"
          >取消操作</Button
        >
      </div>
    </div>
    <!-- 删除弹框 -->
    <Modal
      v-model="deleteChooseModel"
      :title="this.$store.state.base.deleteInfo.title"
      @on-ok="handleDelete"
    >
      <p>{{ this.$store.state.base.deleteInfo.msg }}</p>
    </Modal>
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
  operateTitleManagementInfo,
  initTitleManagementDetailsById
} from '@/api/info/question/api-modules-titlemanagement'
import { OPERATE_PAGE } from '@/libs/mixin'
import FormDataInfo from './form'
import AnswerOption from './form-option'
import RulesValidate from './form-validate'
import uploadFile from '@/components/upload/upload-file-sub'
import uploadImg from '@/components/upload/upload-img-sub'
import Dialog from './../../../video/dialogVideo'
import RulesValidate1 from './form-validate1'

export default {
  mixins: [OPERATE_PAGE],
  data() {
    return {
      showDrawer: false,
      formData: FormDataInfo(),
      formValidate: RulesValidate(this),
      formValidate1: RulesValidate1(this),
      answerFlag: '',
      deleteChooseModel: false,
      answerEditIndex: 0,
      answerOptionId: null,
      fillImgList: [], // 上传文件model
      fillVideoList: [], // 上传文件model
      uploadParams: {
        onePathName: 'file',
        twoPathName: 'file'
      },
      imageURL: window.SITE_CONFIG.downFileUrl,
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
  components: {
    uploadFile,
    uploadImg,
    Dialog
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
    documentClientHeight: function () {
      this.initDialogHeight()
    }
  },
  activated() {
    this.formData.subjectType = '1'
    this.answerOptionId = ''
    this.initFormData()
    this.initDialogHeight()
  },
  methods: {
    initDialogHeight() {
      this.defaultHeight = this.documentClientHeight - 80
    },
    // 根据id 获取详情
    initFormData() {
      this.handleResetSub() // 重置表单
      let params = {
        id: this.detailsId
      }
      this.$nextTick(() => {
        this.formData = FormDataInfo()
        this.formData.subjectType = '1'
        if (this.isOperate) {
          initTitleManagementDetailsById(params)
            .then(res => {
              if (res.data.status) {
                const data = res.data.titleManagementDO
                if (data == null) {
                  this.$Message.error('未查询到相关信息')
                  this.handleCancleModel()
                  return
                }
                // this.formData = res.data.titleManagementDO
                this.formData.id = data.id
                this.formData.title = data.title
                this.formData.source = data.source
                this.formData.answerType = String(data.answerType)
                this.formData.subjectType = String(data.subjectType)
                this.formData.answerDifficulty = String(data.answerDifficulty)
                // console.log(this.formData)

                if (data.titleOptionDOS) {
                  data.titleOptionDOS.forEach(item => {
                    if (String(data.answerType) !== '5') {
                      let item0 = {
                        content: item.content,
                        createBy: item.createBy,
                        createTime: item.createTime,
                        id: item.id,
                        isCorrect: item.isCorrect,
                        seleted: item.isCorrect === 1,
                        sort: item.sort,
                        sortFlag: String.fromCharCode(64 + item.sort),
                        titleId: item.titleId,
                        updateBy: item.updateBy,
                        updateTime: item.updateTime
                      }
                      this.formData.answerArray.push(item0)

                      if (item.isCorrect === 1) {
                        if (
                          this.formData.answerType === '1' ||
                          this.formData.answerType === '3'
                        ) {
                          this.answerFlag = String.fromCharCode(64 + item.sort)
                        }
                      }

                      // this.formData.answerArray.push({
                      //   content: item.content,
                      //   sortFlag: item.sortFlag,
                      //   seleted: item.seleted
                      // })
                    } else {
                      this.formData.answerText = item.content
                      this.answerOptionId = item.id
                    }
                  })
                }
                this.fillImgList = []
                if (data.picturePath) {
                  var pictureNames = data.picturePath.split('/')
                  this.fillImgList = [
                    {
                      name: data.pictureName
                        ? data.pictureName
                        : pictureNames[pictureNames.length - 1],
                      url: data.picturePath,
                      status: 'finished'
                    }
                  ]
                  this.$refs.uploadImg.uploadData(this.fillImgList)
                } else {
                  this.$refs.uploadImg.uploadData([])
                }
                this.fillVideoList = []
                if (data.videoPath) {
                  var videoNames = data.videoPath.split('/')
                  this.fillVideoList = [
                    {
                      name: data.videoName
                        ? data.videoName
                        : videoNames[videoNames.length - 1],
                      url: data.videoPath,
                      status: 'finished'
                    }
                  ]
                  this.$refs.uploadVideo.uploadData(this.fillVideoList)
                } else {
                  this.$refs.uploadVideo.uploadData([])
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
      let isValid = true
      if (this.formData.answerType !== '5') {
        this.$refs['ruleForm'].forEach(item => {
          // console.log(item)
          item.validate(valid => {
            if (!valid) {
              isValid = false
            }
          })
        })
      }
      if (!isValid) {
        this.$Spin.hide()
        return
      }
      isValid = true
      // this.$Spin.hide()
      // console.log(isValid)
      // return
      if (
        this.formData.answerType === '1' ||
        this.formData.answerType === '3'
      ) {
        if (!this.answerFlag) {
          this.$Message.error('请先选择正确题目选项')
          isValid = false
        }
      } else if (this.formData.answerType === '2') {
        var answerFlag = []
        this.formData.answerArray.forEach((item, index) => {
          if (item.seleted) {
            answerFlag.push(item.sortFlag)
          }
        })
        if (answerFlag.length === 0) {
          this.$Message.error('请先选择正确题目选项')
          isValid = false
        }
      }
      if (!isValid) {
        this.$Spin.hide()
        return
      }
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
      var optionArray = []
      if (this.formData.answerType === '5') {
        var option = AnswerOption()
        option.id = this.answerOptionId ? this.answerOptionId : null
        option.titleId = this.detailsId ? this.detailsId : null
        option.content = this.formData.answerText.replace(
          new RegExp('；', 'gi'),
          ';'
        )
        optionArray.push(option)
      } else {
        this.formData.answerArray.forEach((item, index) => {
          item.sort = index + 1
          item.isCorrect = item.seleted ? 1 : 2
          optionArray.push(item)
        })
      }
      params['titleOptionDOS'] = optionArray
      operateTitleManagementInfo(params)
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
        .catch(() => {
          this.$Spin.hide()
        })
    },

    // 打开弹框并初始化
    handleOpenModel() {
      this.showDrawer = true
      this.initFormData()
    },
    // 添加题目选项
    addMoreAnswer() {
      // console.log(this.formData.answerArray)
      if (!this.formData.answerType) {
        this.$Message.error('请先选择题目类型')
        return
      }
      if (this.formData.answerArray.length > 7) {
        this.$Message.error('最多容纳8个选项')
        return
      }
      var alphabet = String.fromCharCode(
        64 + this.formData.answerArray.length + 1
      )
      this.$nextTick(() => {
        let item = {
          content: null,
          createBy: '',
          createTime: '',
          id: '',
          isCorrect: this.formData.answerType === '4' ? 1 : 2,
          seleted: false,
          sort: this.formData.answerArray.length + 1,
          sortFlag: alphabet,
          titleId: '',
          updateBy: '',
          updateTime: ''
        }
        this.formData.answerArray.push(item)
      })
    },
    // 删除题目选项
    deleteAnswerChoose(index) {
      this.answerEditIndex = index
      this.deleteChooseModel = true
    },
    handleDelete() {
      if (this.formData.answerArray[this.answerEditIndex].seleted) {
        this.answerFlag = ''
      }
      this.formData.answerArray.splice(this.answerEditIndex, 1)
      this.formData.answerArray.forEach((item, index) => {
        // item.seleted = false
        item.sortFlag = String.fromCharCode(64 + index + 1)
      })
    },
    // 题目类型选择
    questionTypeChange(value) {
      this.answerFlag = ''
      this.formData.answerArray = []
      if (value === '3') {
        this.formData.answerArray = [
          {
            content: '正确',
            createBy: '',
            createTime: '',
            id: '',
            isCorrect: 2,
            seleted: false,
            sort: 1,
            sortFlag: 'A',
            titleId: '',
            updateBy: '',
            updateTime: ''
          },
          {
            content: '错误',
            createBy: '',
            createTime: '',
            id: '',
            isCorrect: 2,
            seleted: false,
            sort: 2,
            sortFlag: 'B',
            titleId: '',
            updateBy: '',
            updateTime: ''
          }
        ]
      }
    },
    // 答案选择
    chooseChange(value) {
      this.formData.answerArray.forEach(item => {
        if (item.sortFlag === value) {
          item.seleted = true
        } else {
          item.seleted = false
        }
      })
    },
    // 多选答案选择
    chooseMultipleChange(value, index) {
      // console.log(value)
      // console.log(index)
    },
    deleteMultipleChoose(index) {
      this.answerEditIndex = index
      this.deleteChooseModel = true
    },
    // 文件上传完成后，把值赋值给formdata
    uploadVideoSuccess(params) {
      // console.log(params)
      if (params) {
        this.formData.videoPath = params.uploadPath ? params.uploadPath : null
        this.formData.videoName = params.originalFileName
          ? params.originalFileName
          : null
        this.fillVideoList = params.uploadPath
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
        this.fillVideoList = []
      }
    },
    uploadImgSuccess(params) {
      // console.log(params)
      if (params) {
        this.formData.picturePath = params.uploadPath ? params.uploadPath : null
        this.formData.pictureName = params.originalFileName
          ? params.originalFileName
          : null
        this.fillImgList = params.uploadPath
          ? [
              {
                name: params.originalFileName,
                url: params.uploadPath,
                status: 'finished'
              }
            ]
          : []
      } else {
        this.formData.picturePath = null
        this.formData.pictureName = null
        this.fillImgList = []
      }
    },
    // 取消创建
    handleCancleModelSub() {
      this.fillVideoList = []
      this.$refs.uploadVideo.clearFiles()
      this.fillImgList = []
      this.$refs.uploadImg.clearFiles()
      this.handleCancleModel()
    },
    // 查看文件
    scanFile(index) {
      // console.log(this.fillVideoList[index].url)
      this.diaTitle = this.fillVideoList[index].name
      this.diaPath = this.fillVideoList[index].url
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
      audioElement.addEventListener('loadedmetadata', function () {
        // 视频时长值的获取要等到这个匿名函数执行完毕才产生
        result = audioElement.duration // 得到时长为秒，小数，182.36
        self.formData.duration = parseInt(result) // 转为int值
      })
    },
    handleResetSub() {
      this.$refs.uploadVideo.clearFiles()
      this.$refs.uploadImg.clearFiles()
      this.handleReset()
    },
    inputChange(value, index) {
      this.$forceUpdate()
      this.$refs['ruleForm'].forEach(item => {
        // console.log(item)
        item.validate(valid => {})
      })
      // this.formData.answerArray[index].content = value
      // this.$set(this.formData.answerArray, index, this.formData.answerArray[index])
    }
  }
}
</script>
<style lang="less" scoped>
.title {
  display: flex;
  align-items: center;
  font-weight: bold;
  span {
    display: inline-block;
    height: 16px;
    width: 3px;
    background: #3c9a4c;
    margin-right: 5px;
  }
}
.asterisk {
  height: 35px;
  margin-left: 10px;
  line-height: 35px;
  font-family: SimSun;
  color: #ed4014;
  font-size: 14px;
}
.remark {
  height: 35px;
  line-height: 35px;
  color: #ed4014;
  font-size: 13px;
}
// /deep/
// .ivu-input[disabled]{
//   background: #FFFFFF !important;
//   color: #515a6e !important;
// }
.prompt {
  font-size: 13px;
  display: inline-block;
  width: 50%;
  padding: 2px;
  border: 1px dashed #29a387;
  border-radius: 4px;
  box-shadow: 0 1px 1px rgba(0, 0, 0, 0.2);
  // line-height: 150px;
  text-align: center;
}
/deep/.ivu-upload-list-file {
  padding: 0px;
}
</style>
