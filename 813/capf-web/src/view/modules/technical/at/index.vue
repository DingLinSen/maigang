<!--
 * @description subjectlearn- 课目学习主表--新增/编辑查看/界面
 * @author yxm
 * @date 2022-04-07
 * -->
<template>
  <div class="control-container" :style="{height: defaultHeight + 'px'}">
  <div class="left">
    <div class="waiting-certification" >
      <!-- <div class="original" >
        {{originalText}}
      </div> -->
       <div class="original-input">
        <Input v-model="originalText" type="textarea" :rows="15" :show-word-limit="true" :maxlength="originalText.length" disabled style="margin-bottom: 15px"></Input>
      </div>
      <Input v-model="inputText" type="textarea" :rows="10" :show-word-limit="true" :maxlength="originalText.length" v-if="step !== 3"  :disabled="step !== 2"></Input>
      <div v-html="contrastStr" v-if="step == 3" class="original" >
      </div>
    </div>
  </div>
    <div class="right">
    <div style="width: 100%">
      <p>
        <Button type="primary"  @click="transmit" :disabled="step === 2 || step === 3">收报练习</Button>
      </p>
      <p>
        <Button type="primary" @click="originalInput" :disabled="step === 2 || step === 3">文稿输入</Button>
      </p>
       <p class="time" v-if="step === 2 || step === 3 && timeNum !== 0">{{countdown}}</p>
      <br>
      <p style="margin: 10px 0 30px 0">
        时间
        <el-input-number v-model="practiceTime" :precision="0" :step="1" :min="1" :max="100" size="small" :disabled=" step > 1"></el-input-number>
         分钟
        <!-- <InputNumber
          :max="100"
          v-model="practiceTime"
          :min="1"
          :disabled=" step > 1"
          :formatter="value => `${value}min`"
          :parser="value => value.replace('min', '')">
        </InputNumber> -->
      </p>
      <div class="result">
        <div>
          <p>错字：{{errorNum}}个</p>
          <p>速度：{{speed}}个字/秒</p>
          <p>键速：{{keySpeed}}个键/秒</p>
          <p v-if="step === 3">用时：{{actualTime}}</p>
        </div>
      </div>
      <br>
      <br>
      <p>
        <Button type="error" @click="practice(1)" :disabled="step !== 1">开始练习</Button>
        <Button type="error" @click="practice(2)" :disabled="step !== 2">交卷</Button>
      </p>
      <p>
        <Button type="primary" @click="again"  :disabled="step !== 3" v-if=" !this.$route.query.subjectId">重练</Button>
      </p>
      <br>

    </div>
  </div>
  <div class="mask" style="position: absolute;background: rgba(0, 0, 0, .5);height: 100%;width: calc(100% - 29px);
    top: 0;" v-if="isLoading">
    <div>
      <p class="center" style="margin-top: 20%">
        <i class="el-icon-loading"></i>
      </p>
      <p class="title center" style="font-size: 18px;margin-top: 10px;color: #fff;">加载中</p>
    </div>
  </div>
  <Modal
    v-model="transmitModal"
    :footer-hide="true"
    :mask-closable="false"
    width="50%"
    title="收报">
     <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="80">
        <FormItem label="主题" prop="subjectName">
            <Input v-model.trim="formValidate.subjectName" placeholder="请输入主题" :maxlength="300"></Input>
        </FormItem>
        <FormItem label="收件单位" prop="dept">
          <Cascader :data="deptList" v-model="formValidate.dept" placeholder="请选择收件单位"
          :props="{ checkStrictly: true }"  @on-change="selDept" style="width:100%" :clearable="false" change-on-select></Cascader>
        </FormItem>
        <FormItem style="text-align:center">
            <Button type="primary" @click="handleSubmit('formValidate')">收报并开始练习</Button>
        </FormItem>
    </Form>
  </Modal>
  </div>
</template>

<script>
import { initAllDeptList } from '@/api/sys/api-modules-dept'
import { initTransmitExtract, operateTransmitInfo } from '@/api/technical/api-modules-transmit.js'
import { treeDataTranslate } from '@/utils'
export default{
  components: {
  },
  data() {
    return {
      defaultHeight: 0,
      listData: [],
      isLoading: false,
      originalText: '', // 原始文本
      inputText: '', // 输入的文本
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
      transmitModal: false,
      deptList: [], // 所属单位
      formValidate: {
        subjectName: '',
        dept: [],
        type: '1',
        deptId: ''
      },
      ruleValidate: {
        subjectName: [
          { required: true, message: '请输入主题', trigger: 'blur' }
        ],
        type: [
          { required: true, message: '请选择加密方式', trigger: 'change' }
        ],
        dept: [
          {
            required: true,
            trigger: 'change',
            validator: (rule, value, callback) => {
              const dept = this.formValidate.dept
              if(dept.length === 0) {
                callback(new Error('请选择收件单位'))
              }
              callback()
            }
          }
        ]

      },
      details: {},
      actualTime: 0 // 实际用时

    }
  },
  watch: {
    documentClientHeight: function() {
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
    document.oncontextmenu = function () { return false }

    // // 禁止ctrl+c
    // document.onkeydown = function () {
    //   if ((window.event && window.event.keyCode == 123) || ((event.ctrlKey) || (window.event.keycode == 67))) {
    //     event.keyCode = 0
    //     event.returnValue = false
    //     return false
    //   }
    // }
    // })
  },
  mounted() {
    var _this = this
    this.$nextTick(() => {
      document.onkeydown = function(event) {
        if((event.ctrlKey) && (event.keyCode === 67)) {
          event.returnValue = false
          _this.$Message.error('禁止复制')
        }
        if (window.event && window.event.keyCode === 123) {
          // event.keyCode = 0;
          event.returnValue = false
        }
        if(_this.step === 2) { // 开始练习的时候记录键入
          _this.keyNum++
        }
      }
      document.onmousedown = function() {
        if(event.button === 2) {
          event.returnValue = false
        }
      }
    })
    this.resetTableHeight()
    this.initSelect()
  },
  methods: {
    initSelect() {
      initAllDeptList()
        .then(res => {
          if (res.data.status) {
            var data = res.data.data
            // 0正常 1停用
            // let deptList = data.filter(item => item.status === '0')
            let deptList = []
            data.forEach(item => {
              if(item.status === '0') {
                deptList.push({
                  ...item,
                  value: item.deptId,
                  label: item.deptName
                })
              }
            })
            this.deptList = treeDataTranslate(deptList, 'deptId')
          } else {
          }
        })
        .catch(() => {
          this.loading = false
        })
    },
    initData() {

      // operateTransmitInfo
    },
    // 重练
    again() {
      this.step = 4
      this.originalText = ''
      this.inputText = ''
      this.errorNum = 0
      this.speed = 0
      this.keySpeed = 0
      this.countdown = 0
      this.timeNum = 0
    },
    // 电码输入
    originalInput() {
      // 文本 2 密电码
      initTransmitExtract({flag: 1})
        .then(res => {
          if (res.data.status) {
            this.details = res.data.data
            this.originalText = res.data.data.content
            this.step = 1
          } else {
          }
        })
        .catch(() => {
          this.loading = false
        })
        // this.originalText = '生活是蜿蜒在山中的小径，坎坷不平，沟崖在侧。摔倒了，要哭就哭吧，怕什么，不要装模作样！这是直率，不是软弱，因为哭一场并不影响赶路，反而能一份小心。山花烂漫，景色宜人，如果陶醉了，想笑就笑吧，不心故作矜持！这是直率，不是骄傲，因为笑一次并不影响赶路，反而能增添一份信心。生活是蜿蜒在山中的小径，坎坷不平，沟崖在侧。摔倒了，要哭就哭吧，怕什么，不要装模作样！这是直率，不是软弱，因为哭一场并不影响赶路，反而能一份小心。山花烂漫，景色宜人，如果陶醉了，想笑就笑吧，不心故作矜持！这是直率，不是骄傲，因为笑一次并不影响赶路，反而能增添一份信心。'
    },
    // 收报
    transmit() {
      this.transmitModal = true
      this.handleReset('formValidate')
    },

    // 练习/交卷
    practice(step) {
      if(!this.originalText) {
        this.$Message.error('请先操作"电码输入"')
        return
      }
      if(step === 1) {
        this.inputText = ''
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
          if(this.timeNum === 10) {
            this.$Message.error('练习时间还剩10秒，即将自动交卷')
          }
          this.countdown = this.getTime(this.timeNum)
          if(this.timeNum === 0) {
            this.practice(2)
            window.clearInterval(this.timeInterval)
          }
        }, 1000)
        this.step = 2
      }else if(step === 2) {
        window.clearInterval(this.timeInterval)
        this.proofread()
      }
    },
    // 校对
    proofread() {
      this.originalTextArray = this.originalText.split('')
      this.inputTextArray = this.inputText.split('')
      this.contrastStr = ''
      this.errorNum = 0 // 错字数
      this.speed = 0 // 速度
      // this.keyNum = 0 // 按键输入个数
      this.keySpeed = 0 // 键速
      // for循环嵌套查找重复元素
      if(this.inputTextArray.length < this.originalTextArray.length) { // 输入比原文短的
        for (let i = 0; i < this.inputTextArray.length; i++) {
          if(this.inputTextArray[i] === this.originalTextArray[i]) { // 两者相等
          // class="c-primary"
            this.contrastStr = this.contrastStr + '<span >' + this.inputTextArray[i] + '</span>'
          }else{
            this.errorNum++
            this.contrastStr = this.contrastStr + '<span class="c-red" style="background: rgba(245, 61, 61, .15)">' + this.inputTextArray[i] + '</span>'
          }
        }
        for (let j = this.inputTextArray.length; j < this.originalTextArray.length; j++) {
          this.errorNum++
          this.contrastStr = this.contrastStr + '<span style="background: #F4F4F4; color: #ACACAC;">' + this.originalTextArray[j] + '</span>'
        }
      }else{ // 输入比原文长的或者相等
        for (let i = 0; i < this.inputTextArray.length; i++) {
          if(i > this.originalTextArray.length - 1) { // 输入比原文长的
            this.errorNum++
            this.contrastStr = this.contrastStr + '<span class="c-red" style="background: rgba(245, 61, 61, .15)">' + this.inputTextArray[i] + '</span>'
          }else {
            if(this.inputTextArray[i] === this.originalTextArray[i]) { // 两者相等
            // class="c-primary
              this.contrastStr = this.contrastStr + '<span ">' + this.inputTextArray[i] + '</span>'
            }else{
              this.errorNum++
              this.contrastStr = this.contrastStr + '<span class="c-red" style="background: rgba(245, 61, 61, .15)">' + this.inputTextArray[i] + '</span>'
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
      if(this.timeNum > 0) { // 倒计时结束前写完
        time = this.practiceTime * 60 - this.timeNum
      }else{
        time = this.practiceTime * 60
      }
      this.speed = (this.inputText.length / time).toFixed(1)
      this.keySpeed = (this.keyNum / time).toFixed(1)
      let params = {
        content: this.inputText, // 打字后的内容
        // groupId": "string",
        libraryContent: this.originalText, // 稿库源数据内容
        libraryId: this.details.id, // 关联稿库的id
        resultKey: Number(this.keySpeed),
        // resultScore: 0, // 得分
        resultSpeed: Number(this.speed),
        resultWrong: this.errorNum, // 打错个数
        rightNum: this.originalText.length - this.errorNum,
        totalNum: this.originalText.length, // 总字数
        type: 2, // 1发报技术 2 收报技术 3译电技术
        subjectLearnId: this.$route.query.subjectId ? this.$route.query.subjectId : null,
        // useMinuend: 0, // 译电参数减数
        useTime: time,
        alreadyInputNum: this.inputText.length // 已输入字数
      }
      operateTransmitInfo(params).then(({ data }) => {
        this.$Spin.hide()
        if (data.status) {
          this.timeNum = 0
        } else {
          // this.$Message.error('保存信息时系统异常')
        }
      }).catch(() => {
      })
      this.step = 3
    },
    resetTableHeight() {
      // 重置窗口可视高度
      this.defaultHeight = this.documentClientHeight - 125
    },
    // 转换为式分秒
    getTime(time) {
      let h = parseInt(time / 60 / 60 % 24)
      h = h < 10 ? '0' + h : h
      let m = parseInt(time / 60 % 60)
      m = m < 10 ? '0' + m : m
      let s = parseInt(time % 60)
      s = s < 10 ? '0' + s : s
      // if(!h || h === '00') {
      //   return m + ':' + s
      // }else{
      return h + '时' + m + '分' + s + '秒'
      // }
    },
    handleSubmit (name) {
      this.$refs[name].validate((valid) => {
        if (valid) {
          this.transmitModal = false
          this.$Message.success('收报成功')
          this.transmitModal = false
        } else {
          this.$Message.error('请根据提示信息补全提交的内容信息')
        }
      })
    },
    handleReset (name) {
      this.$refs[name].resetFields()
    },
    // 选择部门
    selDept(value) {
      if(value && value.length > 0) {
        this.formValidate.deptId = value[value.length - 1]
      }else if(value.length === 0) {
        this.formValidate.deptId = ''
      }else{
        this.formValidate.deptId = ''
      }
    }
  },
  beforeDestroy () {
  }
}
</script>
<style lang="less" scoped>
/deep/.original-input{
  .ivu-input[disabled]{
  color: #515a6e;
  background-color: #fff;
  }
}
@import './index.less';
/deep/.ivu-input{
  font-size: 14px !important;
}
</style>
