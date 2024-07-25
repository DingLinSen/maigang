<template>
  <div id="target-element" class="exam" @click="enterFullscreen">
    <div class="exam_title">
      {{ examData.examinationName ? examData.examinationName : '' }}
    </div>
    <div class="exam_content">
      <div class="exam_content_left">
        <div class="exam_content_user">
          <img v-if="userFace" :src="userFace" alt="" class="userFace" />
          <img
            v-else
            alt=""
            class="exam_content_userImg"
            src="@/assets/images/sb_offline_icon.png"
          />
          <div class="exam_content_userInfo">
            <span class="exam_content_userName">{{ userName }}</span>
            <p class="exam_content_dept">{{ deptName }}</p>
          </div>
        </div>
        <!-- 倒计时 -->
        <div class="exam_content_countdown">
          <span class="exam_content_residue">剩余时间</span>
          <div class="exam_content_countdownTime">
            <div class="exam_arrow_time_box">
              <span class="exam_arrow_time">{{
                honur ? honur + ':' : ''
              }}</span>
              <span>时</span>
            </div>
            <div class="exam_arrow_time_box" style="margin: 0 20px">
              <span class="exam_arrow_time">{{ min ? min + ':' : '' }}</span>
              <span>分</span>
            </div>
            <div class="exam_arrow_time_box">
              <span class="exam_arrow_time">{{ sen }}</span>
              <span>秒</span>
            </div>
          </div>
        </div>
        <div class="exam_content_answerItems">
          <span class="exam_content_residue">答题卡</span>
          <!-- 单选、多选、判断、填空、简答 -->
          <div
            v-if="questionInfo.radioInfo.radioList.length > 0"
            class="exam_topic_items"
          >
            <div class="exam_topic">单选题</div>
            <div class="exam_topic_box">
              <div
                v-for="(item, index) in questionInfo.radioInfo.radioList"
                :key="index"
                :class="
                  item == selectData && item.yourAnswer != ''
                    ? 'exam_topic_indexed_all'
                    : item.yourAnswer != ''
                    ? 'exam_topic_indexed'
                    : item == selectData
                    ? 'exam_topic_index_selected'
                    : ''
                "
                class="exam_topic_index"
                @click="handlSwitch(0, item)"
              >
                {{ item.index }}
              </div>
            </div>
          </div>
          <div
            v-if="questionInfo.chexkBoxsInfo.chexkBoxsList.length > 0"
            class="exam_topic_items"
          >
            <div class="exam_topic">多选题</div>
            <div class="exam_topic_box">
              <div
                v-for="(item, index) in questionInfo.chexkBoxsInfo
                  .chexkBoxsList"
                :key="index"
                :class="
                  item == selectData && item.yourAnswerArray.length > 0
                    ? 'exam_topic_indexed_all'
                    : item.yourAnswerArray.length > 0
                    ? 'exam_topic_indexed'
                    : item == selectData
                    ? 'exam_topic_index_selected'
                    : ''
                "
                class="exam_topic_index"
                @click="handlSwitch(1, item)"
              >
                {{ item.index }}
              </div>
            </div>
          </div>
          <div
            v-if="questionInfo.judgeInfo.judgeList.length > 0"
            class="exam_topic_items"
          >
            <div class="exam_topic">判断题</div>
            <div class="exam_topic_box">
              <div
                v-for="(item, index) in questionInfo.judgeInfo.judgeList"
                :key="index"
                :class="
                  item == selectData && item.yourAnswer != ''
                    ? 'exam_topic_indexed_all'
                    : item.yourAnswer != ''
                    ? 'exam_topic_indexed'
                    : item == selectData
                    ? 'exam_topic_index_selected'
                    : ''
                "
                class="exam_topic_index"
                @click="handlSwitch(2, item)"
              >
                {{ item.index }}
              </div>
            </div>
          </div>
          <div
            v-if="questionInfo.fillInfo.fillList.length > 0"
            class="exam_topic_items"
          >
            <div class="exam_topic">填空题</div>
            <div class="exam_topic_box">
              <div
                v-for="(item, index) in questionInfo.fillInfo.fillList"
                :key="index"
                :class="
                  item == selectData && item.yourAnswer != ''
                    ? 'exam_topic_indexed_all'
                    : item.yourAnswer != ''
                    ? 'exam_topic_indexed'
                    : item == selectData
                    ? 'exam_topic_index_selected'
                    : ''
                "
                class="exam_topic_index"
                @click="handlSwitch(3, item)"
              >
                {{ item.index }}
              </div>
            </div>
          </div>
          <div
            v-if="questionInfo.shortInfo.shortList.length > 0"
            class="exam_topic_items"
          >
            <div class="exam_topic">简答题</div>
            <div class="exam_topic_box">
              <div
                v-for="(item, index) in questionInfo.shortInfo.shortList"
                :key="index"
                :class="
                  item == selectData && item.yourAnswer != ''
                    ? 'exam_topic_indexed_all'
                    : item.yourAnswer != ''
                    ? 'exam_topic_indexed'
                    : item == selectData
                    ? 'exam_topic_index_selected'
                    : ''
                "
                class="exam_topic_index"
                @click="handlSwitch(4, item)"
              >
                {{ item.index }}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="exam_content_right">
        <div class="exam_content_right_title">
          <div class="exam_content_right_title_left">
            {{ examData.paperName }}
          </div>
          <div class="exam_content_right_title_right">
            <div class="exam_topic_paper" @click="handelSave(false)">交卷</div>
            <div class="exam_topic_paper" hidden @click="captureScreen">
              截图
            </div>
            <span v-for="(item, index) in summaryList" :key="index"
              >&nbsp;{{ item.name + '·' + item.num }} &nbsp;|</span
            >
            <span class="exam_scpoe">满分·{{ totalPoint }}分</span>
          </div>
        </div>
        <!-- 单选、多选、判断、填空、简答 -->
        <div v-if="selectData.type == 1" class="exam_topic_content">
          <div class="exam_topic_content_index">
            <span>{{ selectData.index + '、' }}</span>
            <span>【单选题】</span>
            <span class="exam_topic_fraction">{{ selectData.point }}分</span>
          </div>
          <div class="exam_topic_content_title">
            {{ selectData.title }}
          </div>
          <div>
            <el-image
              v-if="selectData.picturePath"
              style="width: 600px"
              :src="uploadUrl + selectData.picturePath"
              :fit="fill"
            ></el-image>
          </div>
          <div class="exam_topic_answer_options">
            <RadioGroup v-model="selectData.yourAnswer">
              <Radio
                v-for="(ele, i) in selectData.options"
                :key="i"
                :label="ele.name"
                class="exam_topic_answer_options_radio"
              >
                <span class="exam_topic_answer_options_span">
                  {{ ele.name + '.' + ' ' + ele.value }}</span
                >
              </Radio>
            </RadioGroup>
          </div>
        </div>
        <div v-if="selectData.type == 2" class="exam_topic_content">
          <div class="exam_topic_content_index">
            <span>{{ selectData.index + '、' }}</span>
            <span>【多选题】</span>
            <span class="exam_topic_fraction">{{ selectData.point }}分</span>
          </div>
          <div class="exam_topic_content_title">
            {{ selectData.title }}
          </div>
          <div>
            <el-image
              v-if="selectData.picturePath"
              style="width: 600px"
              :src="uploadUrl + selectData.picturePath"
              :fit="fill"
            ></el-image>
          </div>
          <div>
            <CheckboxGroup
              v-model="selectData.yourAnswerArray"
              class="exam_topic_answer_options"
            >
              <Checkbox
                v-for="(item, index) in selectData.options"
                :key="index"
                :label="item.name"
                class="exam_topic_answer_options_radio"
              >
                <span class="exam_topic_answer_options_span">{{
                  item.name + '.' + ' ' + item.value
                }}</span>
              </Checkbox>
            </CheckboxGroup>
          </div>
        </div>
        <div v-if="selectData.type == 3" class="exam_topic_content">
          <div class="exam_topic_content_index">
            <span>{{ selectData.index + '、' }}</span>
            <span>【判断题】</span>
            <span class="exam_topic_fraction">{{ selectData.point }}分</span>
          </div>
          <div class="exam_topic_content_title">
            {{ selectData.title }}
          </div>
          <div>
            <el-image
              v-if="selectData.picturePath"
              style="width: 600px"
              :src="uploadUrl + selectData.picturePath"
              :fit="fill"
            ></el-image>
          </div>
          <div class="exam_topic_answer_options">
            <RadioGroup v-model="selectData.yourAnswer">
              <Radio
                v-for="(ele, i) in selectData.options"
                :key="i"
                :label="ele.name"
                class="exam_topic_answer_options_radio"
              >
                {{ ele.name + '.' + ' ' + ele.value }}
              </Radio>
            </RadioGroup>
          </div>
        </div>
        <div v-if="selectData.type == 4" class="exam_topic_content">
          <div class="exam_topic_content_index">
            <span>{{ selectData.index + '、' }}</span>
            <span>【填空题】</span>
            <span class="exam_topic_fraction">{{ selectData.point }}分</span>
          </div>
          <div class="exam_topic_content_title">
            {{ selectData.title }}
          </div>
          <div>
            <el-image
              v-if="selectData.picturePath"
              style="width: 600px"
              :src="uploadUrl + selectData.picturePath"
              :fit="fill"
            ></el-image>
          </div>
          <div
            v-for="(ele, i) in selectData.options"
            :key="i"
            class="exam_topic_answer_options"
          >
            <span></span>
            <input
              v-model="ele.value"
              class="exam_topic_answer_options_radio"
              placeholder="点击输入答题内容"
              style="border: none; outline: none"
              type="text"
              @input="handleFill"
            />
          </div>
        </div>
        <div v-if="selectData.type == 5" class="exam_topic_content">
          <div class="exam_topic_content_index">
            <span>{{ selectData.index + '、' }}</span>
            <span>【简答题】</span>
            <span class="exam_topic_fraction">{{ selectData.point }}分</span>
          </div>
          <div class="exam_topic_content_title">
            {{ selectData.title }}
          </div>
          <div>
            <el-image
              v-if="selectData.picturePath"
              style="width: 600px"
              :src="uploadUrl + selectData.picturePath"
              :fit="fill"
            ></el-image>
          </div>
          <div class="exam_topic_answer_options">
            <textarea
              v-model="selectData.yourAnswer"
              rows="20"
              style="outline: none; max-height: 300px"
            />
          </div>
        </div>
        <div class="exam_topic_content_bottom">
          <div class="exam_topic_switch_on" @click="handelOnTopic">上一题</div>
          <div class="exam_topic_switch_down" @click="handelDownTopic">
            下一题
          </div>
        </div>
      </div>
    </div>
    <!-- 删除弹框 -->
    <Modal
      v-model="topicModal"
      class-name="vertical-center-modal"
      title="提示"
      @on-ok="surePaper"
    >
      <p>您还有题目未作答,确认要交卷吗?</p>
    </Modal>
  </div>
</template>

<script>
import {
  initAccessPaperDetails,
  submitAnswer,
  initAssessmentManagementDetailsById,
  changeScreen
} from '@/api/online/control/api-modules-control.js'
import html2canvas from 'html2canvas'
import { operateSubjectlearnPhotoInfo } from '@/api/learn/api-modules-subjectlearn.js'

export default {
  name: 'exam',
  data() {
    return {
      uploadUrl: null,
      set: Date.parse(new Date().toString()), // 创建时间 获得时间戳
      end: null, // 结束时间
      day: null, // 日
      honur: null, // 时
      min: null, // 分
      sen: null, // 秒
      assId: null, // 考核ID
      topicAllData: [], // 保存所有题目
      questionInfo: {
        radioInfo: {
          radioList: []
        },
        chexkBoxsInfo: {
          chexkBoxsList: []
        },
        judgeInfo: {
          judgeList: []
        },
        fillInfo: {
          fillList: []
        },
        shortInfo: {
          shortList: []
        }
      }, // 保存题目的数据
      summaryList: [], // 保存题目的类型、数量和分数
      totalPoint: null, // 总分
      userName: null, // 用户名
      deptName: null, // 部门
      topicIndex: 0, // 题目下标
      selectData: {}, // 显示的题目
      userId: null,
      yourAnswer: null, // 填写的答案
      submitFlag: 2, // 1定时发送 2提交发送
      submitStatus: false, // 提交的状态 手动提交true
      remainder: '', // 剩余时间
      endPage: 0, // 页面隐藏次数
      timer: null, // 倒计时定时器
      countdown: null, // 定时发送剩余时间
      topicModal: false, // 弹框的显示和隐藏
      userFace: null, // 用户头像
      isTopic: false, // 判断是否交卷
      randomNum: null // 随机数
    }
  },
  props: {
    examData: {
      type: Object,
      default: null
    },
    examFlag: {
      type: Boolean,
      default: false
    },
    isLimitTime: {
      type: String,
      default: ''
    }
  },
  mounted() {
    // 调用切屏事件
    this.onVisibilityChange()
    this.getAccessPaperDetails()
    this.uploadUrl = window.SITE_CONFIG.downFileUrl
    // 存储step的值
    sessionStorage.setItem('testStep', 4)
    // 获取考核ID
    const loginUserInfo = JSON.parse(
      this.$cookie.get(this.CONST_VALUE.LOGIN_USER_INFO)
    )
    this.assId = this.$route.query.assId
      ? this.$route.query.assId
      : loginUserInfo.assId
    this.userName = loginUserInfo.name
    this.deptName = loginUserInfo.deptName
    this.userId = loginUserInfo.userId
    let str = sessionStorage.getItem('faceId')
    this.userFace = str.replace(/["']/g, '')
    // 定时发送考试剩余时间
    this.countdown = setInterval(() => {
      this.yourAnswer = this.selectData.yourAnswer
      this.submitFlag = 1
      this.handleSubmitAnswer()
    }, 30000)
    this.getExamInfo()
    // 监听是否全屏
    window.addEventListener('fullscreenchange', this.handleFullscreenchange)
    // 判断是否返回
    if (window.history && window.history.pushState) {
      history.pushState(null, null, document.URL)
      window.addEventListener('popstate', this.back, false)
    }
  },
  destroyed() {
    // 关闭监听事件
    window.removeEventListener('popstate', this.back, false)
    window.removeEventListener('fullscreenchange', this.handleFullscreenchange)
    sessionStorage.removeItem('testStep')
    // 关闭定时器
    clearInterval(this.timer)
    clearInterval(this.countdown)
  },
  methods: {
    // 统计切屏和退出全屏
    async handleChangeScreen() {
      const loginUserInfo = JSON.parse(
        this.$cookie.get(this.CONST_VALUE.LOGIN_USER_INFO)
      )
      let params = new FormData()
      params.append(
        'assId',
        this.$route.query.assId ? this.$route.query.assId : loginUserInfo.assId
      )
      await changeScreen(params).then(res => {
        this.endPage = Number(res.data.msg)
      })
    },
    // 页面截图
    captureScreen() {
      const loginUserInfo = JSON.parse(
        this.$cookie.get(this.CONST_VALUE.LOGIN_USER_INFO)
      )
      const element = document.getElementById('target-element') // 替换为要截屏的元素的ID或选择器
      html2canvas(element).then(canvas => {
        // 将Canvas转换为Base64编码
        const base64 = canvas.toDataURL('image/png')
        // 执行进一步操作，如显示或上传Base64图像
        let params = {
          fileName: this.userName + '训练考核截图',
          filePath: base64,
          userId: this.userId,
          subjectLearnId: this.$route.query.assId
            ? this.$route.query.assId
            : loginUserInfo.assId,
          flag: 3 // 1 学习拍照 2 考试照片
        }
        operateSubjectlearnPhotoInfo(params)
      })
    },
    // 屏幕变化,根据变化去判断是否退出全屏
    checkFull() {
      let isFull = !!document.fullscreenElement
      if (isFull === undefined || isFull === null) isFull = false
      return isFull
    },
    async handleFullscreenchange() {
      // 监听到屏幕变化，在回调中判断是否已退出全屏
      if (!this.checkFull()) {
        await this.handleChangeScreen()
        if (this.endPage < 10) {
          this.$Message.error({
            content: `您已经切屏/退出全屏${this.endPage}次，超过10次系统将自动交卷！`,
            duration: 30,
            closable: true
          })
        } else if (this.endPage >= 10) {
          this.handelSave(true)
          this.$Message.error({
            content: `您已经切屏/退出全屏${this.endPage}次，系统自动交卷！`,
            duration: 30,
            closable: true
          })
        }
      }
    },
    // 点击浏览器返回
    back() {
      this.yourAnswer = this.selectData.yourAnswer
      this.submitFlag = 1
      this.handleSubmitAnswer()
    },
    // 获取考试信息
    getExamInfo() {
      const loginUserInfo = JSON.parse(
        this.$cookie.get(this.CONST_VALUE.LOGIN_USER_INFO)
      )
      let params = {
        id: this.$route.query.assId
          ? this.$route.query.assId
          : loginUserInfo.assId
      }
      initAssessmentManagementDetailsById(params).then(res => {
        if (res.data.status) {
          var data = res.data.assessmentManagementDO
          this.examData.examinationName = data.examinationName
          this.examData.endTime = data.endTime
          this.examData.paperName = data.paperName
          this.examData.testDuration = data.testDuration
          this.examData.startTime = data.startTime
          this.examData.passScore = data.passScore
          this.examData.isAuth = data.isAuth
          this.examData.isLimitTime = data.isLimitTime
        }
      })
    },
    // 监听页面是否被隐藏
    async onVisibilityChange() {
      document.body.onblur = async () => {
        if (this.isTopic) return
        if (this.$route.path !== '/test') {
          this.assId = null
          return
        }
        await this.handleChangeScreen()
        if (this.endPage < 10) {
          this.$Message.error({
            content: `您已经切屏/退出全屏${this.endPage}次，超过10次系统将自动交卷！`,
            duration: 30,
            closable: true
          })
        } else if (this.endPage >= 10) {
          this.handelSave(true)
          this.$Message.error({
            content: `您已经切屏/退出全屏${this.endPage}次，系统自动交卷！`,
            duration: 30,
            closable: true
          })
        }
      }
    },
    // 设置全屏
    enterFullscreen() {
      const element = document.documentElement
      if (element.requestFullscreen) {
        element.requestFullscreen()
      } else if (element.mozRequestFullScreen) {
        element.mozRequestFullScreen()
      } else if (element.webkitRequestFullscreen) {
        element.webkitRequestFullscreen()
      } else if (element.msRequestFullscreen) {
        element.msRequestFullscreen()
      }
    },
    // 倒计时
    showTime() {
      let maxtime = (this.end - Date.parse(new Date().toString())) / 1000 // 获得剩余时间 秒
      // 获取随机数
      let randomNum = this.randomNum ? this.randomNum.split(',') : null
      // 如果剩余时间等于随机数就屏幕截图
      if (randomNum) {
        randomNum.forEach(item => {
          if (maxtime == item) {
            this.captureScreen()
          }
        })
      }
      if (maxtime >= 0) {
        this.honur = Math.floor((maxtime / 60 / 60) % 24)
        if (this.honur <= 9) {
          this.honur = '0' + this.honur
        }
        this.min = Math.floor((maxtime / 60) % 60)
        if (this.min <= 9) {
          this.min = '0' + this.min
        }
        this.sen = Math.floor(maxtime % 60)
        if (this.sen <= 9) {
          this.sen = '0' + this.sen
        }
        this.displays = ` ${this.min} 分 ${this.sen}秒`
        maxtime--
        this.remainder = maxtime
        if (maxtime === 179) {
          this.$Message.warning('考试时间剩余三分钟，请及时提交试卷')
        } else if (maxtime === 29) {
          this.$Message.error('考试时间剩余30秒，即将自动交卷。')
        } else if (maxtime === 1) {
          this.$Message.error('考试时间已到，即将自动交卷。')
        }
      } else {
        this.handelSave(true)
        this.$emit('handleTime')
        this.honur = '00'
        this.min = '00'
        this.sen = '00'
        clearInterval(this.timer)
      }
    },
    // 获取试卷内容
    getAccessPaperDetails() {
      const loginUserInfo = JSON.parse(
        this.$cookie.get(this.CONST_VALUE.LOGIN_USER_INFO)
      )
      let params = {
        assId: this.$route.query.assId
          ? this.$route.query.assId
          : loginUserInfo.assId
      }
      initAccessPaperDetails(params).then(res => {
        if (res.data.status) {
          var data = res.data.data
          this.summaryList = data.summaryList
          this.totalPoint = data.totalPoint
          // 获取所有的题目 如果存在数据添加进数组 topicAllData
          if (data.questionInfo.radioInfo) {
            data.questionInfo.radioInfo.radioList.forEach((item, index) => {
              // 给题目添加type值 1单选2多选3判断4填空5简答
              item.type = 1
              this.topicAllData.push(item)
            })
          }
          if (data.questionInfo.chexkBoxsInfo) {
            data.questionInfo.chexkBoxsInfo.chexkBoxsList.forEach(
              (item, index) => {
                item.type = 2
                this.topicAllData.push(item)
              }
            )
          }
          if (data.questionInfo.judgeInfo) {
            data.questionInfo.judgeInfo.judgeList.forEach((item, index) => {
              item.type = 3
              this.topicAllData.push(item)
            })
          }
          if (data.questionInfo.fillInfo) {
            data.questionInfo.fillInfo.fillList.forEach((item, index) => {
              item.type = 4
              this.topicAllData.push(item)
            })
          }
          if (data.questionInfo.shortInfo) {
            data.questionInfo.shortInfo.shortList.forEach((item, index) => {
              item.type = 5
              this.topicAllData.push(item)
            })
          }
          // selectData 当前的题目 默认给第一个
          this.selectData = this.topicAllData[0]
          // 左边题目的数据
          this.questionInfo.radioInfo = data.questionInfo.radioInfo
            ? data.questionInfo.radioInfo
            : {
                radioList: []
              }
          this.questionInfo.chexkBoxsInfo = data.questionInfo.chexkBoxsInfo
            ? data.questionInfo.chexkBoxsInfo
            : {
                chexkBoxsList: []
              }
          this.questionInfo.judgeInfo = data.questionInfo.judgeInfo
            ? data.questionInfo.judgeInfo
            : {
                judgeList: []
              }
          this.questionInfo.fillInfo = data.questionInfo.fillInfo
            ? data.questionInfo.fillInfo
            : {
                fillList: []
              }
          this.questionInfo.shortInfo = data.questionInfo.shortInfo
            ? data.questionInfo.shortInfo
            : {
                shortList: []
              }
          // 获取剩余时间 如果做过题就会有剩余时间
          this.remainder =
            data.yourAnswer.length > 0 ? data.yourAnswer[0].remainder : ''
          // 如果有剩余时间 根据剩余时间判断倒计时  否则根据考试时间设置倒计时
          if (this.remainder != '' && this.$route.query.assId) {
            this.end = this.set + 1000 * 60 * (this.remainder / 60)
          } else {
            // 如果是限时时间 获取结束时间 否则获取考试时间
            if (!this.examData.testDuration) {
              this.end = Date.parse(this.examData.endTime.toString())
            } else {
              this.end = this.set + 1000 * 60 * this.examData.testDuration
            }
          }
          this.timer = setInterval(this.showTime, 1000)
          this.randomNum = sessionStorage.getItem(`randomNum${this.assId}`)
            ? sessionStorage.getItem(`randomNum${this.assId}`)
            : null
          if (this.randomNum) return
          let maxtime = (this.end - Date.parse(new Date().toString())) / 1000 // 获得剩余时间 秒
          let arr = []
          while (arr.length < 3) {
            let num = parseInt(Math.random() * maxtime)
            // parseInt取正，小数点后面的数字全部抹掉
            // Math.random() 0-1的随机数
            if (arr.indexOf(num) == -1) {
              // arr.indexOf(num)若等于-1则证明arr这个数组里没有num这个随机数，因此可以放进这个数组里
              arr.push(num)
            }
          }
          // 数组排序
          arr.sort(function (a, b) {
            if (a > b) {
              return -1
            }
            if (a < b) {
              return 1
            }
            return 0
          })
          sessionStorage.setItem(`randomNum${this.assId}`, arr)
        }
      })
    },
    // 切换题目
    changeTopic() {
      this.submitFlag = 2
      if (
        this.selectData.type == 1 ||
        this.selectData.type == 3 ||
        this.selectData.type == 5
      ) {
        this.yourAnswer = this.selectData.yourAnswer
        this.handleSubmitAnswer()
      } else if (this.selectData.type == 2) {
        let array = this.selectData.yourAnswerArray.filter(item => item !== '')
        array.sort((a, b) => {
          return a.localeCompare(b)
        })
        let str = array.join(';')
        this.yourAnswer = str
        this.handleSubmitAnswer()
      } else if (this.selectData.type == 4) {
        let arr = []
        this.selectData.options.forEach(item => {
          arr.push(item.value)
        })
        let str = arr.join(';')
        this.yourAnswer = str
        this.handleSubmitAnswer()
      }
    },
    // 点击题目
    handlSwitch(type, item) {
      this.changeTopic()
      this.topicAllData.forEach((ele, i) => {
        if (ele == item) {
          this.selectData = ele
          this.topicIndex = i
        }
      })
    },
    // 上一题
    handelOnTopic() {
      this.changeTopic()
      if (this.topicIndex == 0) return
      this.topicIndex -= 1
      this.selectData = this.topicAllData[this.topicIndex]
    },
    // 切换下一题
    handelDownTopic() {
      this.changeTopic()
      if (this.topicIndex == this.topicAllData.length - 1) return
      this.topicIndex += 1
      this.selectData = this.topicAllData[this.topicIndex]
    },
    // 点击提交按钮
    handelSave(flag) {
      const loginUserInfo = JSON.parse(
        this.$cookie.get(this.CONST_VALUE.LOGIN_USER_INFO)
      )
      let isOk = true
      // 循环判断是否有没做答的题
      this.topicAllData.map(item => {
        if (
          item.type == 1 ||
          item.type == 3 ||
          item.type == 4 ||
          item.type == 5
        ) {
          if (item.yourAnswer == '') {
            isOk = false
          }
        } else if (item.type == 2) {
          if (item.yourAnswerArray.length <= 0) {
            isOk = false
          }
        }
      })
      if (!isOk && !flag) {
        this.topicModal = true
      } else {
        this.submitStatus = true
        this.submitFlag = 2
        this.changeTopic()
      }
    },
    surePaper() {
      this.captureScreen()
      this.handelSave(true)
    },
    // 提交答案
    handleSubmitAnswer() {
      const loginUserInfo = JSON.parse(
        this.$cookie.get(this.CONST_VALUE.LOGIN_USER_INFO)
      )
      submitAnswer({
        answerType: this.selectData.type,
        indexNum: this.selectData.index,
        yourAnswer: this.yourAnswer,
        flag: this.submitFlag,
        assId: this.$route.query.assId
          ? this.$route.query.assId
          : loginUserInfo.assId,
        userId: this.userId,
        remainder: this.remainder,
        submit: this.submitStatus
      }).then(res => {
        if (this.submitStatus && res.data.status) {
          this.$Message.success('提交成功')
          this.isTopic = true
          this.$emit('handleSave', res.data.data)
        }
      })
    },
    // 填写填空
    handleFill() {
      let arr = []
      this.selectData.options.forEach(item => {
        if (item.value !== '') {
          arr.push(item.value)
        }
      })
      let str = arr.join(';')
      this.selectData.yourAnswer = str
    }
  }
}
</script>

<style scoped>
.exam {
  background-color: #e7ebee;
}

.exam_title {
  text-align: center;
  font-size: 28px;
  padding: 35px 0;
}

.exam_content {
  width: 100%;
  /* height: 878px; */
  padding: 0 75px;
  display: flex;
  justify-content: space-between;
}

.exam_content_left {
  width: 420px;
  /* height: 100%; */
  display: flex;
  flex-direction: column;
}

.exam_content_user {
  padding: 10px 24px;
  background-color: #fff;
  display: flex;
  align-items: center;
  border-radius: 4px;
}

.exam_content_userImg {
  width: 58px;
  height: 58px;
}

.exam_content_userInfo {
  margin-left: 10px;
}

.exam_content_userName {
  font-size: 18px;
}

.exam_content_dept {
  margin-top: 6px;
  font-size: 14px;
}

.exam_content_countdown {
  margin-top: 22px;
  border-radius: 4px;
  background-color: #fff;
  height: 160px;
  padding: 24px 20px;
}

.exam_content_residue {
  font-size: 18px;
}

.exam_content_countdownTime {
  margin-top: 16px;
  height: 80px;
  background-color: #f2f5f7;
  display: flex;
  justify-content: center;
  align-items: center;
}

.exam_arrow_time_box {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.exam_arrow_time {
  font-weight: 600;
  font-size: 30px;
  color: #399a84;
}

.exam_content_answerItems {
  padding: 24px 20px;
  margin-top: 22px;
  flex: 1;
  background-color: #fff;
}

.exam_topic_items {
  margin-top: 20px;
}

.exam_topic_box {
  margin-top: 12px;
  /* padding: 20px; */
  background-color: #f2f5f7;
  display: flex;
  /* justify-content: space-between; */
  flex-wrap: wrap;
  padding-top: 10px;
  padding-left: 10px;
  padding-bottom: 20px;
}

.exam_topic_index_selected {
  border: 1px solid #399a84;
  color: #399a84;
}

.exam_topic_indexed {
  width: 40px;
  height: 30px;
  background: #399a84 !important;
  color: #fff !important;
  border-radius: 4px;
  text-align: center;
  line-height: 30px;
  margin-left: 10px;
  margin-top: 10px;
  cursor: pointer;
}

.exam_topic_indexed_all {
  width: 40px;
  height: 30px;
  background: #1c6c5a !important;
  color: #fff !important;
  border-radius: 4px;
  text-align: center;
  line-height: 30px;
  margin-left: 10px;
  margin-top: 10px;
  cursor: pointer;
}

.exam_topic_index {
  cursor: pointer;
  width: 40px;
  height: 30px;
  /* background: #399a84; */
  background: #fff;
  border-radius: 4px;
  text-align: center;
  line-height: 30px;
  /* color: #fff; */
  margin-left: 10px;
  margin-top: 10px;
}

.exam_content_right {
  margin-left: 20px;
  flex: 1;
  height: 100%;
  background-color: #fff;
  padding: 25px 20px;
}

.exam_content_right_title {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.exam_content_right_title_right {
  display: flex;
  align-items: center;
}

.exam_scpoe {
  color: #29a387;
}

.exam_topic_content {
  height: 100%;
  /* height: 690px; */
  background-color: #f2f5f7;
  margin-top: 27px;
  padding: 35px;
}

.exam_topic_content_index {
  color: #29a387;
}

.exam_topic_fraction {
  display: inline-block;
  width: 34px;
  height: 20px;
  background: #399a84;
  border-radius: 10px;
  color: #fff;
  text-align: center;
  line-height: 20px;
}

.exam_topic_content_title {
  font-size: 18px;
  margin: 22px 0;
}

.exam_topic_answer_options {
  margin-top: 15px;
  display: flex;
  flex-direction: column;
}

.exam_topic_answer_options_span {
  white-space: initial;
}

.exam_topic_answer_options_radio {
  overflow: hidden;
  margin: 20px 0;
  padding: 16px 20px 16px 20px;
  width: 1000px;
  background-color: #fff;
  border-radius: 25px;
}

.exam_topic_answer_options_radio_ed {
  margin: 20px 0;
  padding: 16px 20px 16px 20px;
  width: 100%;
  background-color: #fff;
  border-radius: 25px;
  border: #29a387 1px solid;
}

.exam_topic_content_bottom {
  margin-top: 32px;
  display: flex;
  justify-content: center;
}

.exam_topic_switch_on {
  cursor: pointer;
  width: 300px;
  height: 44px;
  background: rgba(57, 154, 132, 0.15);
  border: 1px solid #399a84;
  border-radius: 4px;
  line-height: 40px;
  color: #399a84;
  text-align: center;
}

.exam_topic_switch_down {
  margin-left: 20px;
  cursor: pointer;
  width: 300px;
  height: 44px;
  background: #399a84;
  border: 1px solid #399a84;
  border-radius: 4px;
  line-height: 40px;
  color: #fff;
  text-align: center;
}

.exam_topic_paper {
  /* margin-left: 20px; */
  cursor: pointer;
  /* width: 300px; */
  /* height: 44px; */
  background: #399a84;
  border: 1px solid #399a84;
  border-radius: 4px;
  /* line-height: 40px; */
  color: #fff;
  text-align: center;
  padding: 8px 20px;
  margin-right: 5px;
}

.result-wrap {
  background-color: #fff;
  border-radius: 4px;
  display: flex;
  align-items: center;
  text-align: center;
  justify-content: center;
  font-size: 26px;
  font-weight: bold;
  color: #333333;
  position: relative;
}

.result-wrap span {
  display: inline-block;
  margin-right: 5px;
  /* color: #29a387; */
  font-size: 30px;
}

.result-wrap p {
  margin-bottom: -40px;
}

.result-wrap .bottom {
  position: absolute;
  bottom: 20px;
  line-height: 40px;
  text-align: center;
}

.topicImg {
  width: 600px;
  /* height: 400px; */
}

.exam_content_right_title_left {
  width: 500px;
}

.userFace {
  /* width: 50px; */
  height: 50px;
}
</style>
