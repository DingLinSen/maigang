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
        <Button type="primary"  @click="transmit" :disabled="step === 2 || step === 3">发报练习</Button>
      </p>
      <p>

        <!-- step === 1 || step === 1 ||  -->
        <Button type="primary" @click="originalInput" :disabled="step === 2 || step === 3">文稿输入</Button>
      </p>
       <p class="time" v-if="step === 2 || step === 3 && timeNum !== 0">{{countdown}}</p>
      <br>
      <p style="margin: 10px 0 30px 0">
        时间
        <el-input-number v-model="practiceTime" :precision="0" :step="1" :min="1" :max="100" size="small" :disabled=" step > 1"></el-input-number>
        <!-- <InputNumber
          :max="100"
          v-model="practiceTime"
          :min="1"
          :step="true"
          :disabled=" step > 1">
        </InputNumber> -->
        分钟
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
    title="发报">
     <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="80">
        <FormItem label="主题" prop="subjectName">
            <Input v-model.trim="formValidate.subjectName" placeholder="请输入主题" :maxlength="300"></Input>
        </FormItem>
        <FormItem label="收件单位" prop="dept">
          <Cascader :data="deptList" v-model="formValidate.dept" placeholder="请选择收件单位"
          :props="{ checkStrictly: true }"  @on-change="selDept" style="width:100%" :clearable="false" change-on-select></Cascader>
        </FormItem>
        <FormItem label="加密方式" prop="type">
            <Select v-model="formValidate.type" placeholder="请选择加密方式">
                <Option value="1">密文</Option>
                <Option value="2">明文</Option>
            </Select>
        </FormItem>
        <FormItem style="text-align:center">
            <Button type="primary" @click="handleSubmit('formValidate')">发报并开始练习</Button>
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
    // 文稿输入
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
      // this.details = {
      //   deptId: '3f14ab019ad51e8dcc7866a914848721',
      //   difficulty: 1,
      //   id: '28511a3ce9fcaa42b477384418264a42',
      //   length: 759,
      //   type: 1
      // }
      // this.originalText = '盼望着，盼望着，东风来了，春天的脚步近了。 一切都像刚睡醒的样子，欣欣然张开了眼。山朗润起来了，水涨起来了，太阳的脸红起来了。 小草偷偷地从土里钻出来，嫩嫩的，绿绿的。园子里，田野里，瞧去，一大片一大片满是的。坐着，躺着，打两个滚，踢几脚球，赛几趟跑，捉几回迷藏。风轻悄悄的，草软绵绵的。 桃树、杏树、梨树，你不让我，我不让你，都开满了花赶趟儿。红的像火，粉的像霞，白的像雪。花里带着甜味儿；闭了眼，树上仿佛已经满是桃儿、杏儿、梨儿。花下成千成百的蜜蜂嗡嗡地闹着，大小的蝴蝶飞来飞去。野花遍地是：杂样儿，有名字的，没名字的，散在草丛里，像眼睛，像星星，还眨呀眨的。 “吹面不寒杨柳风”，不错的，像母亲的手抚摸着你。风里带来些新翻的泥土的气息，混着青草味儿，还有各种花的香，都在微微润湿的空气里酝酿。鸟儿将窠巢安在繁花嫩叶当中，高兴起来了，呼朋引伴地卖弄清脆的喉咙，唱出宛转的曲子，与轻风流水应和着。牛背上牧童的短笛，这时候也成天在嘹亮地响。 雨是最寻常的，一下就是三两天。可别恼。看，像牛毛，像花针，像细丝，密密地斜织着，人家屋顶上全笼着一层薄烟。树叶子却绿得发亮，小草也青得逼你的眼。傍晚时候，上灯了，一点点黄晕的光，烘托出一片安静而和平的夜。乡下去，小路上，石桥边，有撑起伞慢慢走着的人；还有地里工作的农夫，披着蓑，戴着笠的。他们的草屋，稀稀疏疏的，在雨里静默着。 天上风筝渐渐多了，地上孩子也多了。城里乡下，家家户户，老老小小，他们也赶趟儿似的，一个个都出来了。舒活舒活筋骨，抖擞抖擞精神，各做各的一份事去。“一年之计在于春”，刚起头儿，有的是工夫，有的是希望。 春天像刚落地的娃娃，从头到脚都是新的，他生长着。 春天像小姑娘，花枝招展的，笑着，走着。 春天像健壮的青年，有铁一般的胳膊和腰脚，他领着我们上前去。'
      // this.step = 1
    },
    // 发报
    transmit() {
      this.transmitModal = true
      this.handleReset('formValidate')
    },

    // 练习/交卷
    practice(step) {
      if(!this.originalText) {
        this.$Message.error('请先操作"文稿输入"')
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
        type: 1, // 1发报技术 2 收报技术 3译电技术
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
          this.$Message.success('发报成功')
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
/deep/.el-input-number__decrease:hover, .el-input-number__increase:hover{
  color: #29A387 !important
}
</style>
