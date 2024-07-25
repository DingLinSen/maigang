<template>
  <Drawer
    v-model="showDrawer"
    width="100%"
    :mask-closable="false"
    :transfer="false"
    :inner="true"
  >
    <Icon
      type="md-close"
      slot="close"
      style="cursor: pointer;font-size: 18px;color: #303133;"
      @click.stop="handleCancleModelSub"
    />
    <div class="details-container">
      <div class="test-wrap" :style="{ height: controlHight - 13 + 'px' }">
        <div class="test-top">
          <div class="title">
            {{ paperName
            }}<span class="time c-primary">考试日期：{{ examineDate }}</span
            ><span class="time c-primary">得分：{{ theTotal || 0 }} 分</span>
          </div>
        </div>
        <div class="test-content" :style="{ height: controlHight - 60 + 'px' }">
          <div class="summary">
            <div
              v-for="(item, index) in summaryList"
              :key="index"
              :style="{
                width: (100 / summaryList.length + 1).toFixed(1) + '%'
              }"
            >
              <p>{{ item.name }}</p>
              <p>{{ item.num }} 题</p>
              <p>{{ item.point }} 分</p>
            </div>
            <div
              :style="{
                width: (100 / summaryList.length + 1).toFixed(1) + '%'
              }"
            >
              <p>考试题</p>
              <p>共 {{ totalNum || '--' }} 题</p>
              <p>共 {{ totalPoint || '--' }} 分</p>
            </div>
          </div>
          <!-- 单选、多选、判断、填空、简答  这个顺序吧 -->
          <div class="form">
            <Form ref="questionInfo" :model="questionInfo" :label-width="0">
              <FormItem
                v-if="
                  questionInfo.radioInfo &&
                    questionInfo.radioInfo.radioList &&
                    questionInfo.radioInfo.radioList.length
                "
                v-for="(item, index) in questionInfo.radioInfo.radioList"
                :key="index + '11'"
              >
                <p v-if="index === 0" class="one-title">
                  {{ questionInfo.radioInfo.title }}
                </p>
                <p class="qst-title">
                  {{ index + 1 + '、' }}{{ item.title
                  }}{{ item.point ? '（' + item.point + ' 分）' : '（ 2分）' }}
                </p>
                <div class="picture-box" v-if="item.picturePath">
                   <p  v-if="!isSeePaper">请观看图片 {{item.pictureName}} 作答。</p>
                  <img :src="uploadUrl + item.picturePath" alt="图片加载失败" title="点击放大图片" @click="previewImg(item.picturePath)" />
                </div>
                <div class="video-box" v-if="item.videoPath">
                  <p v-if="!isSeePaper">请观看 {{ item.videoName }} 作答。</p>
                  <video
                    :src="uploadUrl + item.videoPath"
                    id="videoPlayer"
                    ref="movie"
                    style="object-fit:contain;position: relative;background: rgba(0,0,0);"
                    controlslist="nodownload noremoteplayback"
                    controls="controls"
                    :disablePictureInPicture="true"
                    oncontextmenu="return false"
                  >
                    <!-- autoplay="autoplay" -->
                    您的浏览器不支持 video 标签。
                  </video>
                </div>
                <RadioGroup v-model="item.answer">
                  <Radio
                    :label="subItme.name"
                    v-for="(subItme, subIndex) in item.options"
                    :key="subIndex + '11'"
                    :disabled="isSeePaper"
                    >{{ subItme.name + ' ' + subItme.value }}</Radio
                  >
                </RadioGroup>
                <p
                  :class="item.isRight ? 'you-answer green' : 'you-answer red'"
                  v-if="isSeePaper"
                >
                  您的作答：<span>{{ item.yourAnswer || '--' }}</span>
                </p>
              </FormItem>

              <FormItem
                v-if="
                  questionInfo.chexkBoxsInfo &&
                    questionInfo.chexkBoxsInfo.chexkBoxsList &&
                    questionInfo.chexkBoxsInfo.chexkBoxsList.length
                "
                v-for="(item, index) in questionInfo.chexkBoxsInfo
                  .chexkBoxsList"
                :key="index + '22'"
              >
                <!-- :prop="'chexkBoxsInfo.chexkBoxsList.' + index + '.value'"
                :rules="{
                  required: true,
                  type: 'array',
                  min: 1,
                  message: '请选择选项',
                  trigger: 'change'
                }" -->
                <p v-if="index === 0" class="one-title">
                  {{ questionInfo.chexkBoxsInfo.title }}
                </p>
                <p class="qst-title">
                  {{ index + 1 + '、' }}{{ item.title
                  }}{{ item.point ? '（' + item.point + ' 分）' : '（2分）' }}
                </p>
                <div class="picture-box" v-if="item.picturePath">
                  <p  v-if="!isSeePaper">请观看图片 {{item.pictureName}} 作答。</p>
                  <img :src="uploadUrl + item.picturePath" alt="图片加载失败" title="点击放大图片" @click="previewImg(item.picturePath)" />
                </div>
                <div class="video-box" v-if="item.videoPath">
                  <p v-if="!isSeePaper">请观看 {{ item.videoName }} 作答。</p>
                  <video
                    :src="uploadUrl + item.videoPath"
                    id="videoPlayer"
                    ref="movie"
                    style="object-fit:contain;position: relative;background: rgba(0,0,0);"
                    controlslist="nodownload noremoteplayback"
                    controls="controls"
                    :disablePictureInPicture="true"
                    oncontextmenu="return false"
                  >
                    <!-- autoplay="autoplay" -->
                    您的浏览器不支持 video 标签。
                  </video>
                </div>
                <CheckboxGroup v-model="item.value">
                  <Checkbox
                    :label="subItme.name"
                    v-for="(subItme, subIndex) in item.options"
                    :key="subIndex + '22'"
                    :disabled="isSeePaper"
                    >{{ subItme.name + ' ' + subItme.value }}</Checkbox
                  >
                </CheckboxGroup>
                <p
                  :class="item.isRight ? 'you-answer green' : 'you-answer red'"
                  v-if="isSeePaper"
                >
                  您的作答：<span>{{ item.yourAnswer || '--'}}</span>
                </p>
              </FormItem>

              <FormItem
                v-if="
                  questionInfo.judgeInfo &&
                    questionInfo.judgeInfo.judgeList &&
                    questionInfo.judgeInfo.judgeList.length
                "
                v-for="(item, index) in questionInfo.judgeInfo.judgeList"
                :key="index + '33'"
              >
                <!-- :prop="'judgeInfo.judgeList.' + index + '.value'"
                :rules="{
                  required: true,
                  message: '请选择选项',
                  trigger: 'change'
                }" -->
                <p v-if="index === 0" class="one-title">
                  {{ questionInfo.judgeInfo.title }}
                </p>
                <p class="qst-title">
                  {{ index + 1 + '、' }}{{ item.title
                  }}{{ item.point ? '（ ' + item.point + ' 分 ）' : '（1分）' }}
                </p>
                <div class="picture-box" v-if="item.picturePath">
                   <p  v-if="!isSeePaper">请观看图片 {{item.pictureName}} 作答。</p>
                  <img :src="uploadUrl + item.picturePath" alt="图片加载失败" title="点击放大图片" @click="previewImg(item.picturePath)" />
                </div>
                <div class="video-box" v-if="item.videoPath">
                  <p v-if="!isSeePaper">请观看 {{ item.videoName }} 作答。</p>
                  <video
                    :src="uploadUrl + item.videoPath"
                    id="videoPlayer"
                    ref="movie"
                    style="object-fit:contain;position: relative;background: rgba(0,0,0);"
                    controlslist="nodownload noremoteplayback"
                    controls="controls"
                    :disablePictureInPicture="true"
                    oncontextmenu="return false"
                  >
                    <!-- autoplay="autoplay" -->
                    您的浏览器不支持 video 标签。
                  </video>
                </div>
                <RadioGroup v-model="item.answer">
                  <Radio
                    :label="subItme.name"
                    v-for="(subItme, subIndex) in item.options"
                    :key="subIndex + '33'"
                    :disabled="isSeePaper"
                    >{{ subItme.name + ' ' + subItme.value }}</Radio
                  >
                </RadioGroup>
                <p
                  :class="item.isRight ? 'you-answer green' : 'you-answer red'"
                  v-if="isSeePaper"
                >
                  您的作答：<span>{{ item.yourAnswer || '--' }}</span>
                </p>
              </FormItem>

              <FormItem
                v-if="
                  questionInfo.fillInfo &&
                    questionInfo.fillInfo.fillList &&
                    questionInfo.fillInfo.fillList.length
                "
              >
                <div
                  v-for="(item, index) in questionInfo.fillInfo.fillList"
                  :key="index"
                  class="fill-box"
                >
                  <p v-if="index === 0" class="one-title">
                    {{ questionInfo.fillInfo.title }}
                  </p>
                  <p class="qst-title" style="margin-bottom: 5px">
                    {{ index + 1 + '、' }}{{ item.title
                    }}{{ item.point ? '（' + item.point + ' 分）' : '（2分）' }}
                  </p>
                  <div class="picture-box" v-if="item.picturePath">
                    <p  v-if="!isSeePaper">请观看图片 {{item.pictureName}} 作答。</p>
                    <img :src="uploadUrl + item.picturePath" alt="图片加载失败" title="点击放大图片" @click="previewImg(item.picturePath)" />
                  </div>
                  <div class="video-box" v-if="item.videoPath">
                    <p v-if="!isSeePaper">请观看 {{ item.videoName }} 作答。</p>
                    <video
                      :src="uploadUrl + item.videoPath"
                      id="videoPlayer"
                      ref="movie"
                      style="object-fit:contain;position: relative;background: rgba(0,0,0);"
                      controlslist="nodownload noremoteplayback"
                      controls="controls"
                      :disablePictureInPicture="true"
                      oncontextmenu="return false"
                    >
                      <!-- autoplay="autoplay" -->
                      您的浏览器不支持 video 标签。
                    </video>
                  </div>
                  <FormItem
                    v-for="(subItem, subIndex) in item.options"
                    :key="subIndex + '4401'"
                  >
                    <!-- :prop="
                      'fillInfo.fillList.' +
                        index +
                        '.options.' +
                        subIndex +
                        '.value'
                    "
                    :rules="{
                      required: true,
                      message: '请作答',
                      trigger: 'blur'
                    }" -->
                    <div style="display: flex;margin-left: 15px">
                      <div style="width: 15px">
                        {{ subItem.name }}
                      </div>
                      <div style="width: calc(100% - 15px)">
                        <Input
                          v-model="item.value[subIndex]"
                          type="textarea"
                          :show-word-limit="true"
                          :disabled="isSeePaper"
                          style="margin-top: 3px; margin-bottom: 3px; width: calc(100% - 20px)"
                          :maxlength="1000"
                        ></Input>
                      </div>
                    </div>
                  </FormItem>
                  <p
                    :class="
                      item.isRight ? 'you-answer green' : 'you-answer red'
                    "
                    v-if="isSeePaper"
                    style="margin-bottom: 10px"
                  >
                    您的作答：<span>{{ item.yourAnswer || '--' }}</span>
                  </p>
                </div>
              </FormItem>

              <FormItem
                v-if="
                  questionInfo.shortInfo &&
                    questionInfo.shortInfo.shortList &&
                    questionInfo.shortInfo.shortList.length
                "
                v-for="(item, index) in questionInfo.shortInfo.shortList"
                :key="index + '44'"
              >
                <!-- :prop="'shortInfo.shortList.' + index + '.value'"
                :rules="{
                  required: true,
                  message: '请作答',
                  trigger: 'change'
                }" -->
                <p v-if="index === 0" class="one-title">
                  {{ questionInfo.shortInfo.title }}
                </p>
                <p class="qst-title">
                  {{ index + 1 + '、' }}{{ item.title
                  }}{{ item.point ? '（ ' + item.point + ' 分 ）' : '（8分）' }}
                </p>
                <div class="picture-box" v-if="item.picturePath">
                  <p v-if="!isSeePaper">请观看 {{ item.pictureName }} 作答。</p>
                  <img :src="uploadUrl + item.picturePath" alt="" />
                </div>
                <div class="video-box" v-if="item.videoPath">
                  <p v-if="!isSeePaper">请观看 {{ item.videoName }} 作答。</p>
                  <video
                    :src="uploadUrl + item.videoPath"
                    id="videoPlayer"
                    ref="movie"
                    style="object-fit:contain;position: relative;background: rgba(0,0,0);"
                    controlslist="nodownload noremoteplayback"
                    controls="controls"
                    :disablePictureInPicture="true"
                    oncontextmenu="return false"
                  >
                    <!-- autoplay="autoplay" -->
                    您的浏览器不支持 video 标签。
                  </video>
                </div>
                <Input
                  v-model="item.answer"
                  type="textarea"
                  :show-word-limit="true"
                  :disabled="isSeePaper"
                  style="margin-top: 8px;margin-bottom: 3px; width: calc(100% - 20px)"
                  :maxlength="1000"
                ></Input>
                <p
                  :class="item.isRight ? 'you-answer green' : 'you-answer red'"
                  v-if="isSeePaper"
                  style="margin-top: 5px"
                >
                  您的作答：<span>{{ item.yourAnswer  || '--'}}</span>
                </p>
              </FormItem>
            </Form>
          </div>
        </div>
      </div>
    </div>
    <Modal
        width="80vw"
       :footer-hide="true"
        v-model="imgModal"
        :closable="false"
       >
      <img :src="previewUrl" alt="" @click="closePreview"/>
    </Modal>
  </Drawer>
</template>
<script>
// import { OPERATE_PAGE, OPERATE_LIST } from '@/libs/mixin'
import {
  initAccessPaperDetails,
  initFindByPointId
} from '@/api/online/control/api-modules-control.js'
export default {
  //   mixins: [OPERATE_PAGE, OPERATE_LIST],
  props: {
    detailsId: { type: String, default: null },
    paperName: {
      type: String,
      default: null
    },
    assId: {
      type: String,
      default: null
    },
    examineDate: {
      type: String,
      default: null
    }
  },
  data() {
    return {
      showDrawer: false,
      controlHight: 0,
      listData: [],
      statisticalModel: false,
      cameraUrl: null,
      videoWidth: 400,
      videoHeight: 255,
      thisCancas: null,
      thisContext: null,
      thisVideo: null,
      timeNum: 0,
      time: 0,
      summaryList: [
        { num: 0, name: '单选题', point: 0 },
        { num: 0, name: '多选题', point: 0 },
        { num: 0, name: '判断题', point: 0 },
        { num: 0, name: '填空题', point: 0 },
        { num: 0, name: '简答题', point: 0 }
      ],
      index: 1,
      isSeePaper: false,
      questionInfo: {
        radioInfo: {
          title: '一、单选题（0分）',
          radioList: []
        },
        chexkBoxsInfo: {
          title: '二、多选题（0分）',
          chexkBoxsList: []
        },
        judgeInfo: {
          title: '一、判断题（0分）',
          judgeList: []
        },
        fillInfo: {
          title: '四、填空题（0分）',
          shortList: []
        },
        shortInfo: {
          title: '五、简答题（0分）',
          fillList: []
        }
      },
      theTotal: 0, // 本次考试成绩
      isQualified: false, // 是否合格
      totalNum: null,
      totalPoint: null,
      paperId: null,
      uploadUrl: null,
      imgModal: false, // 预览图片
      previewUrl: ''
    }
  },
  watch: {
    documentClientHeight: function() {
      this.controlHight = this.documentClientHeight - 70
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
    },
    userId: {
      get() {
        if (this.$store.state.user) {
          return this.$store.state.user.userId
        } else {
          return ''
        }
      }
    }
  },
  mounted() {
    this.controlHight = this.documentClientHeight - 70
    this.uploadUrl = window.SITE_CONFIG.downFileUrl
    // this.initListData()

    // this.tableColumnPugins = ColumnPugins(this)
  },
  methods: {
    initFormData() {
      this.$nextTick(() => {
        this.initListData()
      })
    },
    // 打开弹框并初始化
    handleOpenModel() {
      this.showDrawer = true
      this.isSeePaper = true
      // setTimeout(() => {
      // this.formData = FormDataInfo()
      this.$nextTick(() => {
        this.initListData()
        this.checkPapar()
      })
      // }, 50)
    },
    handleCancleModelSub() {
      //   this.$refs.uploadBanner.clearFiles()
      this.handleCancleModel()
    },
    handleCancleModel() {
      this.showDrawer = false
      this.summaryList = [
        { num: 0, name: '单选题', point: 0 },
        { num: 0, name: '多选题', point: 0 },
        { num: 0, name: '判断题', point: 0 },
        { num: 0, name: '填空题', point: 0 },
        { num: 0, name: '简答题', point: 0 }
      ]
      this.totalNum = null
      this.totalPoint = null
      this.questionInfo = {
        radioInfo: {
          title: '一、单选题（0分）',
          radioList: []
        },
        chexkBoxsInfo: {
          title: '二、多选题（0分）',
          chexkBoxsList: []
        },
        judgeInfo: {
          title: '一、判断题（0分）',
          judgeList: []
        },
        fillInfo: {
          title: '四、填空题（0分）',
          shortList: []
        },
        shortInfo: {
          title: '五、简答题（0分）',
          fillList: []
        }
      }
    },
    // 获取列表信息
    initListData() {
      if (!this.assId) {
        return
      }
      let params = {
        assId: this.assId
      }
      this.imgModal = false
      initAccessPaperDetails(params)
        .then(res => {
          if (res.data.status) {
            var data = res.data.data
            console.log(data)
            if (data && data.summaryList) {
              data.summaryList.forEach(element => {
                if (element.name === '单选题') {
                  this.summaryList[0].num = element.num
                  this.summaryList[0].point = element.point
                } else if (element.name === '多选题') {
                  this.summaryList[1].num = element.num
                  this.summaryList[1].point = element.point
                } else if (element.name === '判断题') {
                  this.summaryList[2].num = element.num
                  this.summaryList[2].point = element.point
                } else if (element.name === '填空题') {
                  this.summaryList[3].num = element.num
                  this.summaryList[3].point = element.point
                } else if (element.name === '简答题') {
                  this.summaryList[4].num = element.num
                  this.summaryList[4].point = element.point
                }
              })
            }
            if (data && data.questionInfo) {
              if (data.questionInfo.radioInfo) {
                this.questionInfo.radioInfo = data.questionInfo.radioInfo
              }
              if (data.questionInfo.chexkBoxsInfo) {
                this.questionInfo.chexkBoxsInfo =
                  data.questionInfo.chexkBoxsInfo
                if (this.questionInfo.chexkBoxsInfo.chexkBoxsList) {
                  this.questionInfo.chexkBoxsInfo.chexkBoxsList.forEach(
                    item => {
                      if (item.answer) {
                        item.value = item.answer.split(';')
                      }
                    }
                  )
                }
              }
              if (data.questionInfo.judgeInfo) {
                this.questionInfo.judgeInfo = data.questionInfo.judgeInfo
              }
              if (data.questionInfo.fillInfo) {
                this.questionInfo.fillInfo = data.questionInfo.fillInfo
                if (this.questionInfo.fillInfo.fillList) {
                  this.questionInfo.fillInfo.fillList.forEach(item => {
                    if (item.answer) {
                      item.value = item.answer.split(';')
                    }
                  })
                }
              }
              if (data.questionInfo.shortInfo) {
                this.questionInfo.shortInfo = data.questionInfo.shortInfo
              }
            }
            this.totalNum = data.totalNum
            this.totalPoint = data.totalPoint
          } else {
          }
        })
        .catch(() => {})
    },
    // 转换为式分秒
    getTime(time) {
      let h = parseInt((time / 60 / 60) % 24)
      h = h < 10 ? '0' + h : h
      let m = parseInt((time / 60) % 60)
      m = m < 10 ? '0' + m : m
      let s = parseInt(time % 60)
      s = s < 10 ? '0' + s : s
      // if(!h || h === '00') {
      //   return m + ':' + s
      // }else{
      return h + '时' + m + '分' + s + '秒'
      // }
    },
    // base64转文件
    dataURLtoFile(dataurl, filename) {
      var arr = dataurl.split(',')
      var mime = arr[0].match(/:(.*?);/)[1]
      var bstr = atob(arr[1])
      var n = bstr.length
      var u8arr = new Uint8Array(n)
      while (n--) {
        u8arr[n] = bstr.charCodeAt(n)
      }
      return new File([u8arr], filename, { type: mime })
    },
    // 关闭摄像头
    // stopNavigator () {
    //   if(this.thisVideo) {
    //     this.thisVideo.srcObject.getTracks()[0].stop()
    //   }
    // },
    // 查看试卷
    checkPapar() {
      this.isSeePaper = true
      if (!this.detailsId) {
        return
      }
      let params = {
        examinePointId: this.detailsId,
        userId: this.$store.state.user.userId
      }
      initFindByPointId(params)
        .then(res => {
          if (res.data.status) {
            var data = res.data.data
            if (data) {
              let content = JSON.parse(data.content)
              if (content && content.summaryList) {
                content.summaryList.forEach(element => {
                  if (element.name === '单选题') {
                    this.summaryList[0].num = element.num
                    this.summaryList[0].point = element.point
                  } else if (element.name === '多选题') {
                    this.summaryList[1].num = element.num
                    this.summaryList[1].point = element.point
                  } else if (element.name === '判断题') {
                    this.summaryList[2].num = element.num
                    this.summaryList[2].point = element.point
                  } else if (element.name === '填空题') {
                    this.summaryList[3].num = element.num
                    this.summaryList[3].point = element.point
                  } else if (element.name === '简答题') {
                    this.summaryList[4].num = element.num
                    this.summaryList[4].point = element.point
                  }
                })
              }

              if (content && content.questionInfo) {
                if (content.questionInfo.radioInfo) {
                  this.questionInfo.radioInfo = content.questionInfo.radioInfo
                }
                if (content.questionInfo.chexkBoxsInfo) {
                  this.questionInfo.chexkBoxsInfo =
                    content.questionInfo.chexkBoxsInfo
                  if (this.questionInfo.chexkBoxsInfo.chexkBoxsList) {
                    this.questionInfo.chexkBoxsInfo.chexkBoxsList.forEach(
                      item => {
                        if (item.answer) {
                          item.value = item.answer.split(';')
                        }
                      }
                    )
                  }
                }
                if (content.questionInfo.judgeInfo) {
                  this.questionInfo.judgeInfo = content.questionInfo.judgeInfo
                }
                if (content.questionInfo.fillInfo) {
                  this.questionInfo.fillInfo = content.questionInfo.fillInfo
                  if (this.questionInfo.fillInfo.fillList) {
                    this.questionInfo.fillInfo.fillList.forEach(item => {
                      if (item.answer) {
                        item.value = item.answer.split(';')
                      }
                    })
                  }
                }
                if (content.questionInfo.shortInfo) {
                  this.questionInfo.shortInfo = content.questionInfo.shortInfo
                }
              }
              this.theTotal = data.point ? data.point : 0
            }
          } else {
          }
        })
        .catch(() => {})
    },
    previewImg(value) {
      this.imgModal = true
      this.previewUrl = this.uploadUrl + value
    },
    closePreview() {
      this.imgModal = false
    }
  },
  beforeDestroy() {
    if (this.thisVideo) {
      this.thisVideo.srcObject.getTracks()[0].stop()
    }
  }
}
</script>
<style lang="less" scoped>
@import './index.less';
/deep/.ivu-form-item {
  margin-bottom: 20px !important;
}
/deep/.ivu-form-item-error-tip {
  padding-top: 0 !important;
}
/deep/.ivu-radio-wrapper {
  margin-right: 20px !important;
  margin-left: 15px;
}
/deep/.ivu-checkbox-wrapper {
  margin-right: 20px !important;
  margin-left: 15px;
}
/deep/.ivu-input-wrapper {
  margin-left: 15px !important;
}
/deep/ .details-container {
  height: 100%;
}
/deep/.ivu-drawer-close {
  z-index: 10;
}
/deep/.ivu-modal-content{
  background-color: rgba(0, 0, 0, 0) !important;
  text-align: center;
  box-shadow: none !important;
  img{
    margin-top: 5vh;
    max-height: 70vh;
  }
  .ivu-icon-ios-close{
    color: #fff;
  }
}
</style>
