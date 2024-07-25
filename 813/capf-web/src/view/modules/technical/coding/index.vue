<!--
 * @description subjectlearn- 课目学习主表--新增/编辑查看/界面
 * @author yxm
 * @date 2022-04-07
 * -->
<template>
  <div class="control-container" :style="{ height: defaultHeight + 'px' }">
    <div class="left">
      <div class="waiting-certification">
        <div class="original-input">
          <!-- 初始文本 -->
          <Input
            v-model="originalText"
            type="textarea"
            :rows="15"
            :show-word-limit="true"
            :maxlength="originalText.length"
            disabled
            style="margin-bottom: 15px"
          ></Input>
        </div>
        <!-- <div class="original" style="border-color:#ed4014">
        {{originalTextMinuend}}
      </div> -->
        <Input
          v-model="inputText"
          type="textarea"
          :rows="10"
          :show-word-limit="true"
          :maxlength="originalTextMinuend.length"
          v-if="step !== 3"
          :disabled="step !== 2"
        ></Input>
        <div v-html="contrastStr" v-if="step == 3" class="original"></div>
      </div>
    </div>

    <!-- 右侧内容 -->
    <div class="right">
      <div style="width: 100%">
        <p>
          <Button
            type="primary"
            @click="originalInput"
            :disabled="step === 2 || step === 3"
            >减表练习</Button
          >
        </p>
        <p class="time" v-if="step === 2 || (step === 3 && timeNum !== 0)">
          {{ countdown }}
        </p>
        <p
          class="time"
          style="
            display: inline-block;
            padding: 8px 15px;
            border: 1px solid rgb(220, 222, 226);
            border-radius: 4px;
            margin-bottom: 20px;
          "
          v-if="useMinuend || useMinuend === 0"
        >
          {{ useMinuend }}
        </p>
        <p style="margin: 10px 0 30px 0">
          时间
          <!-- <InputNumber
          :max="100"
          v-model="practiceTime"
          :min="1"
          :disabled=" step > 1"
          :formatter="value => `${value}min`"
          :parser="value => value.replace('min', '')">
        </InputNumber> -->
          <el-input-number
            v-model="practiceTime"
            :precision="0"
            :step="1"
            :min="1"
            :max="100"
            size="small"
            :disabled="step > 1"
          ></el-input-number>
          分钟
        </p>
        <div class="result">
          <div>
            <p>错字：{{ errorNum }}个</p>
            <p>速度：{{ speed }}个字/秒</p>
            <p>键速：{{ keySpeed }}个键/秒</p>
            <p v-if="step === 3">用时：{{ actualTime }}</p>
          </div>
        </div>
        <br />
        <br />
        <p>
          <Button type="error" @click="practice(1)" :disabled="step !== 1"
            >开始练习</Button
          >
          <Button type="error" @click="practice(2)" :disabled="step !== 2"
            >交卷</Button
          >
        </p>
        <p>
          <Button
            type="primary"
            @click="again"
            :disabled="step !== 3"
            v-if="!this.$route.query.subjectId"
            >重练</Button
          >
        </p>
        <p></p>
        <br />
      </div>
    </div>
    <div
      class="mask"
      style="
        position: absolute;
        background: rgba(0, 0, 0, 0.5);
        height: 100%;
        width: calc(100% - 29px);
        top: 0;
      "
      v-if="isLoading"
    >
      <div>
        <p class="center" style="margin-top: 20%">
          <i class="el-icon-loading"></i>
        </p>
        <p
          class="title center"
          style="font-size: 18px; margin-top: 10px; color: #fff"
        >
          加载中
        </p>
      </div>
    </div>
  </div>
</template>

<script>
import {
  initTransmitExtract,
  operateTransmitInfo
} from '@/api/technical/api-modules-transmit.js'
export default {
  components: {},
  data() {
    return {
      defaultHeight: 0,
      listData: [],
      isLoading: false,
      originalText: '', // 原始文本
      originalTextMinuend: '', // 减表后的初始字段
      inputText: '', // 输入的文本
      initialTextArray: [], // 初始文本数组
      originalTextArray: [], // 原始文本数组
      inputTextArray: [], // 输入文本数组
      contrastStr: '', // 校对之后的字符串
      practiceTime: 1, // 练习时间时间
      errorNum: 0, // 错字数
      speed: 0, // 速度
      keyNum: 0, // 按键输入个数
      keySpeed: 0, // 键速
      timeInterval: null, // 倒计时计时器
      countdown: 0,
      timeNum: 0, // 倒计时
      step: 0, // 1初始阶段 2开始练习 3交卷4重练
      details: {},
      actualTime: 0, // 实际用时
      useMinuend: '' // 减表减数
    }
  },
  watch: {
    documentClientHeight: function () {
      this.resetTableHeight()
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
  created() {
    // 禁止右键
    document.oncontextmenu = function () { return true }
  },
  mounted() {
    var _this = this
    this.$nextTick(() => {
      document.onkeydown = function (event) {
        if (event.ctrlKey && event.keyCode === 67) {
          event.returnValue = false
          _this.$Message.error('禁止复制')
        }
        if (window.event && window.event.keyCode === 123) {
          // event.keyCode = 0;
          event.returnValue = false
        }
        if (_this.step === 2) {
          // 开始练习的时候记录键入
          _this.keyNum++
        }
      }
      document.onmousedown = function () {
        if (event.button === 2) {
          event.returnValue = false
        }
      }
    })
    this.resetTableHeight()
  },
  methods: {
    initData() {},
    // 重练
    again() {
      this.step = 4
      this.originalText = ''
      this.inputText = ''
      this.originalTextMinuend = ''
      this.errorNum = 0
      this.speed = 0
      this.keySpeed = 0
      this.countdown = 0
      this.timeNum = 0
      this.actualTime = 0
    },
    // 减表练习
    originalInput() {
      // 文本 2 密电码
      initTransmitExtract({ flag: 2 })
        .then(res => {
          if (res.data.status) {
            console.log(res.data)
            window.clearInterval(this.timeInterval)
            this.details = res.data.data
            this.originalText = res.data.data.content // 获取原始文本
            this.step = 1 // 初始阶段
          } else {
          }
        })
        .catch(() => {
          this.loading = false
        })
    },
    // 练习/交卷
    practice(step) {
      if (!this.originalText) {
        this.$Message.error('请先操作"减表练习"')
        return
      }
      if (step === 1) {
        let array = this.originalText.split(' ') // 原始文本拆分
         this.initialTextArray = []
        this.initialTextArray = array
        // console.log();
        this.originalTextMinuend = ''
        this.originalTextArray = []
        let i = Number(Math.floor(Math.random() * (array.length - 1)) + 0) // 生成一个随机数
        this.useMinuend = array[i] // 随机减去的数值
        // console.log(1)

        if (array && array.length) {
          array.forEach(item => {
            this.originalTextArray.push(Number(item) - Number(this.useMinuend))
            this.originalTextMinuend =
              this.originalTextMinuend +
              (Number(item) - Number(this.useMinuend)) +
              ' '
          })
          console.log(this.originalTextArray)
        }

        this.inputText = '' // 输入的文本
        this.errorNum = 0 // 错字数
        this.speed = 0 // 速度
        this.keyNum = 0 // 按键输入个数
        this.keySpeed = 0 // 键速
        this.actualTime = 0
        var actualTime = 0
        this.actualTime = this.getTime(actualTime)
        this.timeNum = this.practiceTime * 60
        this.timeInterval = setInterval(() => {
          this.timeNum--
          actualTime++
          this.actualTime = this.getTime(actualTime)
          if (this.timeNum === 10) {
            this.$Message.error('练习时间还剩10秒，即将自动交卷')
          }
          this.countdown = this.getTime(this.timeNum)
          if (this.timeNum === 0) {
            this.practice(2)
            window.clearInterval(this.timeInterval)
          }
        }, 1000)
        this.step = 2
      } else if (step === 2) {
        window.clearInterval(this.timeInterval)
        // console.log(2)
        this.proofread()
      }
    },
    // 校对
    proofread() {
      // this.originalTextArray = this.originalTextMinuend.split(' ')
      console.log(this.inputText)
      if (this.inputText !== '') {
        this.inputTextArray = this.inputText.split(' ')
      } else {
        this.inputTextArray = []
      }

      console.log(this)
      this.contrastStr = '' // 校对之后的字符串
      this.errorNum = 0 // 错字数
      this.speed = 0 // 速度
      // this.keyNum = 0 // 按键输入个数
      this.keySpeed = 0 // 键速
      console.log(this.originalTextArray)
      console.log(this.inputTextArray)

      // for循环嵌套查找重复元素
      if (!this.inputTextArray.length) {
        console.log(this.originalTextArray)
        for (let i = 0; i < this.originalTextArray.length; i++) {
          // if (Number(this.inputTextArray[i]) === this.originalTextArray[i]) {
          // 两者相等
          this.contrastStr =
            this.contrastStr +
            '<span style="background: #F4F4F4; color: #ACACAC;">' +
            this.originalTextArray[i] +
            '</span>' +
            ' '
          // } else {
          //   this.errorNum++
          //   this.contrastStr =
          //     this.contrastStr +
          //     '<span class="c-red" style="background: rgba(245, 61, 61, .15)">' +
          //     this.inputTextArray[i] +
          //     '</span>' +
          //     ' '
          // }
        }
        this.errorNum = this.originalTextArray.length
        // console.log(this.contrastStr)
      } else {
        // console.log(2)
        if (this.inputTextArray.length < this.originalTextArray.length) {
          // 输入比原文短的
          for (let i = 0; i < this.inputTextArray.length; i++) {
            if (Number(this.inputTextArray[i]) === this.originalTextArray[i]) {
              // 两者相等
              this.contrastStr =
                this.contrastStr +
                '<span >' +
                this.inputTextArray[i] +
                '</span>' +
                ' '
            } else {
              this.errorNum++
              this.contrastStr =
                this.contrastStr +
                '<span class="c-red" style="background: rgba(245, 61, 61, .15)">' +
                this.inputTextArray[i] +
                '</span>' +
                ' '
            }
          }
          // 超出部分置灰
          for (
            let j = this.inputTextArray.length;
            j < this.originalTextArray.length;
            j++
          ) {
            this.errorNum++
            this.contrastStr =
              this.contrastStr +
              '<span style="background: #F4F4F4; color: #ACACAC;">' +
              this.originalTextArray[j] +
              '</span>' +
              ' '
          }
        } else {
          // 输入比原文长的或者相等
          for (let i = 0; i < this.inputTextArray.length; i++) {
            if (i > this.originalTextArray.length - 1) {
              // 输入比原文长的
              this.errorNum++
              this.contrastStr =
                this.contrastStr +
                '<span class="c-red" style="background: rgba(245, 61, 61, .15)">' +
                Number(this.inputTextArray[i]) +
                '</span>' +
                ' '
            } else {
              if (
                Number(this.inputTextArray[i]) === this.originalTextArray[i]
              ) {
                // 两者相等
                this.contrastStr =
                  this.contrastStr +
                  '<span ">' +
                  this.inputTextArray[i] +
                  '</span>' +
                  ' '
              } else {
                this.errorNum++
                this.contrastStr =
                  this.contrastStr +
                  '<span class="c-red" style="background: rgba(245, 61, 61, .15)">' +
                  Number(this.inputTextArray[i]) +
                  '</span>' +
                  ' '
              }
            }
          }
        }
      }
      // this.errorNum = 0 // 错字数
      // this.speed = 0 // 速度
      // this.keyNum = 0 // 按键输入个数
      // this.keySpeed = 0 // 键速
      // 获取用时
      let time = 1 // 实际用时多少
      if (this.timeNum > 0) {
        // 倒计时结束前写完
        time = this.practiceTime * 60 - this.timeNum
      } else {
        time = this.practiceTime * 60
      }
      this.speed = (this.inputText.length / time).toFixed(1)
      this.keySpeed = (this.keyNum / time).toFixed(1)

      console.log(this.originalTextMinuend.length);
      console.log(this.errorNum);
      let params = {
        content: this.inputText, // 打字后的内容
        // groupId": "string",
        libraryContent: this.originalTextMinuend, // 稿库源数据内容
        libraryId: this.details.id, // 关联稿库的id
        resultKey: Number(this.keySpeed),
        // resultScore: 0, // 得分
        resultSpeed: Number(this.speed),
        resultWrong: this.errorNum, // 打错个数
        // rightNum: this.originalTextMinuend.length - this.errorNum,
        // totalNum: this.originalTextMinuend.length, // 总字数
        rightNum: this.initialTextArray.length - this.errorNum,
        totalNum: this.initialTextArray.length, // 总字数
        type: 3, // 1发报技术 2 收报技术 3译电技术
        subjectLearnId: this.$route.query.subjectId
          ? this.$route.query.subjectId
          : null,
        useMinuend: this.useMinuend, // 译电参数减数
        useTime: time,
        alreadyInputNum: this.inputText.length // 已输入字数
      }
      operateTransmitInfo(params)
        .then(({ data }) => {
          this.$Spin.hide()
          if (data.status) {
            this.timeNum = 0
            this.useMinuend = ''
          } else {
            // this.$Message.error('保存信息时系统异常')
          }
        })
        .catch(() => {})
      this.step = 3
    },
    resetTableHeight() {
      // 重置窗口可视高度
      this.defaultHeight = this.documentClientHeight - 125
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
    }
  },
  beforeDestroy() {}
}
</script>
<style lang="less" scoped>
/deep/.original-input {
  .ivu-input[disabled] {
    color: #515a6e;
    background-color: #fff;
  }
}
@import './index.less';
/deep/.ivu-input {
  font-size: 14px !important;
}
</style>
