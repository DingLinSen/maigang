<!--
 * @description subjectlearn- 课目学习主表--新增/编辑查看/界面
 * @author yxm
 * @date 2022-04-07
 * -->
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
      @click.stop="handleCancleModel"
    />
    <div class="control-container" :style="{ height: controlHight + 'px' }">
      <div class="test-wrap" :style="{ height: controlHight + 'px' }">
        <div class="test-top">
          <div class="title">
            {{ paperName }}
          </div>
          <div style="position: absolute; left: 85%;top:6%">
            <span class="time c-primary">试卷用时：{{ time }}分钟</span>
          </div>
          <br>
        </div>

        <div
          class="test-content"
          :style="{ height: controlHight - 50 + 'px' }"
          id="backTop"
        >
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
                :prop="'radioInfo.radioList.' + index + '.value'"
                :rules="{
                  required: true,
                  message: '请选择选项',
                  trigger: 'change'
                }"
              >
                <p v-if="index === 0" class="one-title">
                  {{ questionInfo.radioInfo.title }}
                </p>
                <p class="qst-title">
                  {{ index + 1 + '、' }}{{ item.title
                  }}{{ item.point ? '（ ' + item.point + ' 分 ）' : '' }}
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
                <RadioGroup v-model="item.value" :disabled="isSeePaper">
                  <!-- <Radio
                    :label="subItme"
                    v-for="(subItme, subIndex) in item.options"
                    :key="subIndex + '11'"
                    :disabled="isSeePaper"
                    >{{ subItme }}</Radio
                  > -->
                  <Radio
                    :label="subItme.name"
                    v-for="(subItme, subIndex) in item.options"
                    :key="subIndex + '11'"
                    :disabled="isSeePaper"
                    >{{ subItme.name + ' ' + subItme.value }}</Radio
                  >
                </RadioGroup>
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
                :prop="'chexkBoxsInfo.chexkBoxsList.' + index + '.value'"
                :rules="{
                  required: true,
                  type: 'array',
                  min: 1,
                  message: '请选择选项',
                  trigger: 'change'
                }"
              >
                <p v-if="index === 0" class="one-title">
                  {{ questionInfo.chexkBoxsInfo.title }}
                </p>
                <p class="qst-title">
                  {{ index + 1 + '、' }}{{ item.title
                  }}{{ item.point ? '（ ' + item.point + ' 分 ）' : '' }}
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
              </FormItem>
              <FormItem
                v-if="
                  questionInfo.judgeInfo &&
                    questionInfo.judgeInfo.judgeList &&
                    questionInfo.judgeInfo.judgeList.length
                "
                v-for="(item, index) in questionInfo.judgeInfo.judgeList"
                :key="index + '33'"
                :prop="'judgeInfo.judgeList.' + index + '.value'"
                :rules="{
                  required: true,
                  message: '请选择选项',
                  trigger: 'change'
                }"
              >
                <p v-if="index === 0" class="one-title">
                  {{ questionInfo.judgeInfo.title }}
                </p>
                <p class="qst-title">
                  {{ index + 1 + '、' }}{{ item.title
                  }}{{ item.point ? '（ ' + item.point + ' 分 ）' : '' }}
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
                <RadioGroup v-model="item.value">
                  <Radio
                    :label="subItme.name"
                    v-for="(subItme, subIndex) in item.options"
                    :key="subIndex + '33'"
                    :disabled="isSeePaper"
                    >{{ subItme.name + ' ' + subItme.value }}</Radio
                  >
                </RadioGroup>
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
                  <p
                    class="qst-title"
                    :style="{ marginTop: index === 0 ? '0px' : '20px' }"
                  >
                    {{ index + 1 + '、' }}{{ item.title
                    }}{{ item.point ? '（ ' + item.point + ' 分 ）' : '' }}
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
                  <!-- <FormItem
                    v-for="(subItem, subIndex) in item.options"
                    :key="subIndex + '4401'"
                    :prop="
                      'fillInfo.fillList.' +
                        index +
                        'options.' +
                        subIndex +
                        '.value'
                    "
                    :rules="{
                      required: true,
                      message: '请作答',
                      trigger: 'change'
                    }"
                  >
                    <div style="display: flex;">
                      <div style="width: 20px">
                        {{ subItem.name }}
                      </div>
                      <div style="width: calc(100% - 20px)">
                        <Input
                          v-model="subItem.value"
                          type="textarea"
                          :show-word-limit="true"
                          :disabled="isSeePaper"
                          style="margin-top: 3px; margin-bottom: 3px;"
                          :maxlength="1000"
                        ></Input>
                      </div>
                    </div>
                  </FormItem> -->
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
                :prop="'shortInfo.shortList.' + index + '.value'"
                :rules="{
                  required: true,
                  message: '请作答',
                  trigger: 'change'
                }"
              >
                <p v-if="index === 0" class="one-title">
                  {{ questionInfo.shortInfo.title }}
                </p>
                <p class="qst-title">
                  {{ index + 1 + '、' }}{{ item.title
                  }}{{ item.point ? '（ ' + item.point + ' 分 ）' : '' }}
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
                <!-- <Input
                  v-model="item.value"
                  type="textarea"
                  :show-word-limit="true"
                  :disabled="isSeePaper"
                  style="margin-top: 8px;margin-bottom: 3px;"
                  :maxlength="1000"
                ></Input> -->
              </FormItem>

              <FormItem>
                <div class="demo-drawer-footer" style="text-align: center;">
                  <Button
                    type="default"
                    class="mar-lft-10"
                    @click.stop="handleCancleModel"
                    >取消操作</Button
                  >
                </div>
              </FormItem>
            </Form>
          </div>
          <!-- <Button type="primary" @click="handleSubmit('questionInfo')">交卷</Button> -->
        </div>
      </div>
      <!-- <div v-if="!listData.length" class="no-data" :style="{height: controlHight - 75 + 'px'}">
          <div>
            <img src="@/assets/images/common/nodata.png" alt="">
            <p>暂无数据信息</p>
          </div>
      </div> -->
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
import { OPERATE_LIST } from '@/libs/mixin'
import {
  initPaperManagementDetailsById,
  getPaperContentById
} from '@/api/online/paper/api-modules-paper'
export default {
  props: {
    detailsId: {
      default: null,
      type: String
    }
  },
  mixins: [OPERATE_LIST],
  components: {},
  data() {
    return {
      controlHight: 0,
      showDrawer: false,
      paperName: null,
      listData: [],
      statisticalModel: false,
      videoWidth: 400,
      videoHeight: 255,
      thisCancas: null,
      thisContext: null,
      thisVideo: null,
      timeNum: 0,
      time: '0',
      summaryList: [
        { num: 0, name: '单选题', point: 0 },
        { num: 0, name: '多选题', point: 0 },
        { num: 0, name: '判断题', point: 0 },
        { num: 0, name: '填空题', point: 0 },
        { num: 0, name: '简答题', point: 0 }
      ],
      index: 1,
      isSeePaper: true,
      totalNum: null,
      totalPoint: null,
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
      uploadUrl: null,
      imgModal: false, // 预览图片
      previewUrl: ''
    }
  },
  watch: {
    documentClientHeight: function() {
      this.controlHight = this.documentClientHeight - 120
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
  mounted() {
    this.controlHight = this.documentClientHeight - 118
    this.uploadUrl = window.SITE_CONFIG.downFileUrl
  },
  methods: {
    initPagerDetails() {
      this.imgModal = false
      let params = {
        id: this.detailsId
      }
      this.$nextTick(() => {
        initPaperManagementDetailsById(params)
          .then(res => {
            if (res.data.status) {
              const data = res.data.paperManagementDO
              this.paperName = data.paperName ? data.paperName : ''
              this.time = data.paperTime ? String(data.paperTime) : '0'
            }
          })
          .catch(() => {})
      })
    },
    initPagerContent() {
      let params = {
        paperId: this.detailsId
      }
      getPaperContentById(params)
        .then(res => {
          if (res.data.status) {
            var data = res.data.data
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

            // this.questionInfo = data.questionInfo
            if (data.questionInfo.radioInfo) {
              this.questionInfo.radioInfo = data.questionInfo.radioInfo
            }
            // this.questionInfo.radioInfo.radioList.forEach(item =>{
            //   item.picturePath = 'uploadFiles/file/file/2022-05-23/1e3cbfe205c7438b84b0089e6efeb04c.jpg'
            // })
            if (data.questionInfo.chexkBoxsInfo) {
              this.questionInfo.chexkBoxsInfo = data.questionInfo.chexkBoxsInfo
            }
            if (data.questionInfo.judgeInfo) {
              this.questionInfo.judgeInfo = data.questionInfo.judgeInfo
            }
            if (data.questionInfo.fillInfo) {
              this.questionInfo.fillInfo = data.questionInfo.fillInfo
            }
            if (data.questionInfo.shortInfo) {
              this.questionInfo.shortInfo = data.questionInfo.shortInfo
            }

            // this.summaryList = data.summaryList
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
    //  绘制图片（拍照功能）
    setImage() {
      var _this = this
      // 点击，canvas画图
      _this.thisContext.drawImage(
        _this.thisVideo,
        0,
        0,
        _this.videoWidth,
        _this.videoHeight
      )
      // 获取图片base64链接
      var image = this.thisCancas.toDataURL('image/png')
      // _this.imgSrc = image
      this.$nextTick(() => {
        this.cameraUrl = image
        _this.stopNavigator() // 拍完关闭摄像头
      })

      // operateSubjectlearnPhotoInfo(params)
      //   .then(({ data }) => {
      //     this.$Spin.hide()
      //     if (data.status) {
      //       this.$Message.success('成功保存信息')
      //     } else {
      //       // this.$Message.error('保存信息时系统异常')
      //     }
      //   })
      //   .catch(() => {})
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
    // 打开弹框并初始化
    handleOpenModel() {
      this.showDrawer = true
      this.$nextTick(() => {
        this.initPagerDetails()
        this.initPagerContent()
      })
    },
    handleCancleModel() {
      this.showDrawer = false
      this.time = '0'
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
      document.getElementById('backTop').scrollTop = 0
    },
    previewImg(value) {
      this.imgModal = true
      this.previewUrl = this.uploadUrl + value
    },
    closePreview() {
      this.imgModal = false
    }
  },
  beforeDestroy() {}
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
}
/deep/.ivu-checkbox-wrapper {
  margin-right: 20px !important;
}
/deep/.ivu-form-item label {
  white-space: pre-line;
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
