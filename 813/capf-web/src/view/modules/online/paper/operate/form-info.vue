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
          <Col span="12">
            <FormItem label="试卷类型" label-position="top" prop="paperType">
              <Select
                v-model="formData.paperType"
                ref="paperType"
                :disabled="isSee"
                remote
                name="select"
                :clearable="false"
                placeholder="请选择试卷类型"
              >
                <Option value="1" label="理论考核"></Option>
                <Option value="2" label="专业考核" v-if="isOperate || isSee"></Option>
              </Select>
            </FormItem>
          </Col>
          <Col span="12">
            <FormItem label="试卷名称" label-position="top" prop="paperName">
              <Input
                type="text"
                v-model.trim="formData.paperName"
                placeholder="请输入试卷名称"
                ref="paperName"
                :disabled="isSee"
                :maxlength="50"
              />
            </FormItem>
          </Col>

          <Col span="12">
            <FormItem label="课目类型" label-position="top" prop="subjectType">
              <Select
                v-model="formData.subjectType"
                ref="subjectType"
                :disabled="isSee"
                remote
                name="select"
                :clearable="false"
                placeholder="请选择课目类型"
                @on-change="subjectTypeChange"
              >
                <Option value="1" label="理论知识"></Option>
                <Option value="2" label="专业操作" v-if="isOperate || isSee"></Option>
              </Select>
            </FormItem>
          </Col>

          <Col span="12">
            <FormItem label="课目名称" label-position="top" prop="subjectId">
              <Select
                v-model="formData.subjectId"
                ref="subjectName"
                filterable
                multiple
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

          <Col span="24"
            ><div style="margin-bottom:10px;">
              <span class="asterisk">*</span>
              <span class="remark">试卷内容</span>
            </div></Col
          >

          <Col span="12">
            <FormItem label="题库" label-position="top" prop="sources">
              <br />

              <CheckboxGroup
                v-model="formData.sources"
                class="borderDashed"
                :disabled="isSee"
                @on-change="questionBankChange"
              >
                <Checkbox
                  :label="item.source"
                  v-for="(item, index) in questionBankArray"
                  :key="index"
                  :disabled="isSee"
                  style="width: 90%;display:block;margin-bottom:5px;"
                >
                  {{ item.source }}
                </Checkbox>
              </CheckboxGroup>

              <!-- <RadioGroup
                v-model="formData.libraryFlag"
                vertical
                style="width: 100%;"
                class="borderDashed"
                :disabled="isSee"
              >
                <Radio
                  :label="item.flag"
                  v-for="(item, index) in formData.answerArray"
                  :key="index"
                  style="width: 90%;display:block;margin-bottom:5px;"
                  :disabled="isSee"
                >
                  {{ item.content }}
                </Radio>
              </RadioGroup> -->
            </FormItem>
          </Col>

          <Col span="12">
            <FormItem label-position="top" prop="subjectNumber">
              <span slot="label">
                <span>试卷出题/ 已出</span>
                <span class="c-primary">{{ formData.subjectNumber }}</span>
                <span>题</span>
              </span>
              <br />
              <div class="borderDashed">
                <Row :gutter="32">
                  <Col span="16">
                    <li
                      v-for="(item, index) in questionBankSelectArray"
                      :key="index"
                      style="list-style: none;display:block"
                      class="boldStyle"
                    >
                      {{ item.source + '（'+(item.questionCount? item.questionCount + '\xa0\xa0' : '') +'共' + item.count + '题）' }}
                    </li>
                  </Col>
                  <Col span="4">
                    <!-- <span class="right-auto"></span> -->
                    <Select
                      v-if="questionBankSelectArray.length > 0"
                      v-model="formData.questionSelectType"
                      ref="questionNum"
                      :disabled="isSee"
                      style="width:140px;"
                      remote
                      name="select"
                      :clearable="false"
                      placeholder="请选择出题方式"
                      @on-change="questionSelectTypeChange"
                    >
                      <Option value="1" label="自动选题"></Option>
                      <Option value="2" label="自定义选题"></Option>
                    </Select>
                  </Col>
                </Row>
                <div
                  style="display:flex;margin-top:5px;"
                  v-if="formData.questionSelectType === '1'"
                >
                  <!-- style="background:#0F9E07;" -->
                  <div class="socreBgSub" style="background:#0F9E07;">
                    单选题{{ formData.singleNumber }}题
                  </div>

                  <div class="socreBgSub" style="background:#F17F03;">
                    多选题{{ formData.multipleNumber }}题
                  </div>

                  <div class="socreBgSub" style="background:#FF4747;">
                    判断题{{ formData.judgeNumber }}题
                  </div>

                  <div class="socreBgSub" style="background:#2A6CEC;">
                    填空题{{ formData.packNumber }}题
                  </div>

                  <div class="socreBgSub" style="background:#11C2A1;">
                    简答题{{ formData.sketchNumber }}题
                  </div>
                </div>

                <div v-if="formData.questionSelectType === '2'">
                  <div style="display:flex;margin-top:5px;">
                    <div class="socreInputBgSub" style="background:#0F9E07;">
                      单选题<InputNumber
                        :max="singleMaxNumber"
                        :min="0"
                        size="small"
                        :formatter="value => `${parseInt(value)}`"
                        v-model="formData.singleNumber"
                        controls-outside
                        class="inputNumberStyle"
                      >
                      </InputNumber
                      >题
                    </div>

                    <div class="socreInputBgSub" style="background:#F17F03;">
                      多选题<InputNumber
                        :max="multipleMaxNumber"
                        :min="0"
                        size="small"
                        :formatter="value => `${parseInt(value)}`"
                        v-model="formData.multipleNumber"
                        controls-outside
                        class="inputNumberStyle"
                      >
                      </InputNumber
                      >题
                    </div>

                    <div class="socreInputBgSub" style="background:#FF4747;">
                      判断题<InputNumber
                        :max="judgeMaxNumber"
                        :min="0"
                        size="small"
                        :formatter="value => `${parseInt(value)}`"
                        v-model="formData.judgeNumber"
                        controls-outside
                        class="inputNumberStyle"
                      >
                      </InputNumber
                      >题
                    </div>
                  </div>

                  <div style="display:flex;margin-top:5px;">
                    <div class="socreInputBgSub" style="background:#2A6CEC;">
                      填空题<InputNumber
                        :max="packMaxNumber"
                        :min="0"
                        size="small"
                        :formatter="value => `${parseInt(value)}`"
                        v-model="formData.packNumber"
                        controls-outside
                        class="inputNumberStyle"
                      >
                      </InputNumber
                      >题
                    </div>

                    <div class="socreInputBgSub" style="background:#11C2A1;">
                      简答题<InputNumber
                        :max="sketchMaxNumber"
                        :min="0"
                        size="small"
                        :formatter="value => `${parseInt(value)}`"
                        v-model="formData.sketchNumber"
                        controls-outside
                        class="inputNumberStyle"
                      >
                      </InputNumber
                      >题
                    </div>
                  </div>
                </div>
              </div>
            </FormItem>
          </Col>
        </Row>

        <Row :gutter="32">
          <Col span="12">
            <FormItem label="答题时间" label-position="top" prop="paperTime">
              <Input
                type="text"
                v-model.trim="formData.paperTime"
                placeholder="请输入答题时间"
                ref="paperTime"
                :disabled="isSee"
                :maxlength="4"
              >
                <span slot="suffix" style="height: 32px;line-height:32px;"
                  >分钟</span
                ></Input
              >
            </FormItem>
          </Col>

          <Col span="12">
            <FormItem label="试卷分值" label-position="top" prop="score">
              <Input
                type="text"
                v-model.trim="formData.score"
                placeholder="请输入试卷分值"
                ref="score"
                :disabled="isSee"
                :readonly="!isSee"
                :maxlength="4"
              >
                <span slot="suffix" style="height: 32px;line-height:32px;"
                  >分</span
                ></Input
              >
            </FormItem>
          </Col>
        </Row>

        <Row
          :gutter="32"
          style="margin-left:-5px;margin-right:0px;margin-top:5px"
        >
          <Col span="8" style="padding:0px;">
            <div class="socreBg" style="background:#0F9E07;">
              单选题每题2分
            </div>
          </Col>
          <Col span="8" style="padding:0px;">
            <div class="socreBg" style="background:#F17F03;">
              多选题每题2分
            </div>
          </Col>
          <Col span="8" style="padding:0px;">
            <div class="socreBg" style="background:#FF4747;">
              判断题每题1分
            </div>
          </Col>
          <Col span="8" style="padding:0px;margin-top:10px">
            <div class="socreBg" style="background:#2A6CEC;">
              填空题每题2分
            </div>
          </Col>
          <Col span="8" style="padding:0px;margin-top:10px">
            <div class="socreBg" style="background:#11C2A1;">
              简答题每题8分
            </div>
          </Col>
        </Row>
      </Form>
      <br />
      <div class="demo-drawer-footer" style="text-align: center;">
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
  </div>
</template>

<script>
import {
  operatePaperManagementInfo,
  initPaperManagementDetailsById,
  getSource,
  getSubjectByType
} from '@/api/online/paper/api-modules-paper'
import { OPERATE_PAGE } from '@/libs/mixin'
import FormDataInfo from './form'
import RulesValidate from './form-validate'

export default {
  mixins: [OPERATE_PAGE],
  data() {
    return {
      showDrawer: false,
      formData: FormDataInfo(),
      formValidate: RulesValidate(this),
      subjectArray: [],
      questionBankArray: [],
      questionBankSelectArray: [],
      singleMaxNumber: 0,
      sketchMaxNumber: 0,
      judgeMaxNumber: 0,
      multipleMaxNumber: 0,
      packMaxNumber: 0
    }
  },
  components: {},
  computed: {
    score: {
      get() {
        this.formData.score =
          this.formData.singleNumber * 2 +
          this.formData.multipleNumber * 2 +
          this.formData.judgeNumber * 1 +
          this.formData.packNumber * 2 +
          this.formData.sketchNumber * 8
        return this.formData.score
      }
    },
    subjectNumber: {
      get() {
        this.formData.subjectNumber =
          this.formData.singleNumber +
          this.formData.multipleNumber +
          this.formData.judgeNumber +
          this.formData.packNumber +
          this.formData.sketchNumber
        return this.formData.subjectNumber
      }
    }
  },
  watch: {
    score: function() {},
    subjectNumber: function() {}
  },
  activated() {
    this.questionBankSelectArray = []
    this.initFormData()
    this.initQuestionBank()
  },
  methods: {
    // 查询所有题库
    initQuestionBank() {
      this.questionBankArray = []
      this.$nextTick(() => {
        let params = {}
        getSource(params)
          .then(res => {
            if (res.data.status) {
              // console.log(res.data)
              var data = res.data.data
              if (data) {
                data.forEach((item, index) => {
                  var alphabet = String.fromCharCode(64 + index + 1)
                  let item0 = Object.assign(item, {
                    flag: alphabet
                  })
                  this.questionBankArray.push(item0)
                })
              }
            }
          })
          .catch(() => {})
      })
    },
    // 根据id 获取详情
    initFormData() {
      this.handleResetSub() // 重置表单
      let params = {
        id: this.detailsId
      }
      this.$nextTick(() => {
        this.formData = FormDataInfo()
        if (this.isOperate) {
          initPaperManagementDetailsById(params)
            .then(res => {
              if (res.data.status) {
                // console.log(res.data)
                const data = res.data.paperManagementDO
                if (data == null) {
                  this.$Message.error('未查询到相关信息')
                  this.handleCancleModel()
                  return
                }
                this.formData.id = data.id
                this.formData.paperType = String(data.paperType)
                this.formData.paperName = data.paperName ? data.paperName : ''
                this.formData.subjectType = String(data.subjectType)
                this.subjectTypeChange(this.formData.subjectType)
                this.formData.paperSubjectDOS = data.paperSubjectDOS
                this.formData.subjectId = []
                if (data.paperSubjectDOS) {
                  data.paperSubjectDOS.forEach(item => {
                    this.formData.subjectId.push(item.subjectId)
                  })
                }
                this.formData.singleNumber = data.singleNumber
                  ? data.singleNumber
                  : 0
                this.formData.multipleNumber = data.multipleNumber
                  ? data.multipleNumber
                  : 0
                this.formData.judgeNumber = data.judgeNumber
                  ? data.judgeNumber
                  : 0
                this.formData.packNumber = data.packNumber ? data.packNumber : 0
                this.formData.sketchNumber = data.sketchNumber
                  ? data.sketchNumber
                  : 0
                this.formData.subjectNumber = data.subjectNumber
                  ? data.subjectNumber
                  : 0
                this.formData.sources = data.sources ? data.sources : []
                this.formData.paperTime = data.paperTime
                  ? String(data.paperTime)
                  : ''
                this.formData.score = data.score ? data.score : 0
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
      var subjectArray = []
      this.formData.subjectId.forEach(item => {
        subjectArray.push({ subjectId: item })
      })
      params['paperSubjectDOS'] = subjectArray

      operatePaperManagementInfo(params)
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
    // 多选答案选择
    chooseMultipleChange(value, index) {
      // console.log(value)
      // console.log(index)
    },
    // 取消创建
    handleCancleModelSub() {
      this.handleCancleModel()
    },
    handleResetSub() {
      this.handleReset()
    },
    // 题库选择
    questionBankChange(val) {
      this.singleMaxNumber = 0
      this.multipleMaxNumber = 0
      this.judgeMaxNumber = 0
      this.packMaxNumber = 0
      this.sketchMaxNumber = 0
      var arrayTemp = []
      if (val && val.length > 0) {
        this.questionBankArray.forEach(item => {
          if (val.indexOf(item.source) > -1) {
            arrayTemp.push(item)
            var questionCount = ''
            var answerCount = item.answerCount
            if (answerCount) {
              answerCount.sort(function(a, b) {
                return parseInt(a.answerType) - parseInt(b.answerType)
              })
              answerCount.forEach(item0 => {
                if (item0.answerType === '1') {
                  this.singleMaxNumber =
                    this.singleMaxNumber + parseInt(item0.count)
                  questionCount = questionCount
                    ? questionCount + '\xa0\xa0单选题' + item0.count + '题'
                    : '单选题' + item0.count + '题'
                } else if (item0.answerType === '2') {
                  this.multipleMaxNumber =
                    this.multipleMaxNumber + parseInt(item0.count)
                  questionCount = questionCount
                    ? questionCount + '\xa0\xa0多选题' + item0.count + '题'
                    : '多选题' + item0.count + '题'
                } else if (item0.answerType === '3') {
                  this.judgeMaxNumber =
                    this.judgeMaxNumber + parseInt(item0.count)
                  questionCount = questionCount
                    ? questionCount + '\xa0\xa0判断题' + item0.count + '题'
                    : '判断题' + item0.count + '题'
                } else if (item0.answerType === '4') {
                  this.packMaxNumber =
                    this.packMaxNumber + parseInt(item0.count)
                  questionCount = questionCount
                    ? questionCount + '\xa0\xa0填空题' + item0.count + '题'
                    : '填空题' + item0.count + '题'
                } else if (item0.answerType === '5') {
                  this.sketchMaxNumber =
                    this.sketchMaxNumber + parseInt(item0.count)
                  questionCount = questionCount
                    ? questionCount + '\xa0\xa0简答题' + item0.count + '题'
                    : '简答题' + item0.count + '题'
                }
              })
            }
            item.questionCount = questionCount
          }
        })
      }
      this.questionBankSelectArray = arrayTemp
    },
    // 选择课目
    subjectChange(val) {
      // this.subjectArray.forEach(item => {
      //   if (item.id === val) {
      //     this.formData.subjectType = String(item.type)
      //   }
      // })
    },
    // 课目类别选择
    subjectTypeChange(val) {
      if (val) {
        this.subjectArray = []
        this.formData.subjectId = []
        this.$nextTick(() => {
          let params = { type: val }
          getSubjectByType(params)
            .then(res => {
              if (res.data.status) {
                var data = res.data.data
                if (data) {
                  this.subjectArray = data
                }
              }
            })
            .catch(() => {})
        })
      }
    },
    questionSelectTypeChange(val) {
      if (val === '1') {
        if (this.formData.subjectNumber < 40) {
          this.$Notice.warning({
            title: '温馨提示',
            desc: '题库内题目总数量不足，已切换自定义选题'
          })
          // this.$Message.error('题库内题目总数量不足，已切换自定义选题')
          this.formData.questionSelectType = '2'
          return
        }
        if (this.singleMaxNumber < 10) {
          this.$Notice.warning({
            title: '温馨提示',
            desc: '题库内单选题总数量不足，已切换自定义选题'
          })
          // this.$Message.error('题库内单选题总数量不足，已切换自定义选题')
          this.formData.questionSelectType = '2'
          return
        }
        if (this.multipleMaxNumber < 5) {
          this.$Notice.warning({
            title: '温馨提示',
            desc: '题库内多选题总数量不足，已切换自定义选题'
          })
          // this.$Message.error('题库内多选题总数量不足，已切换自定义选题')
          this.formData.questionSelectType = '2'
          return
        }
        if (this.judgeMaxNumber < 10) {
          this.$Notice.warning({
            title: '温馨提示',
            desc: '题库内判断题总数量不足，已切换自定义选题'
          })
          // this.$Message.error('题库内判断题总数量不足，已切换自定义选题')
          this.formData.questionSelectType = '2'
          return
        }
        if (this.packMaxNumber < 10) {
          this.$Notice.warning({
            title: '温馨提示',
            desc: '题库内填空题总数量不足，已切换自定义选题'
          })
          // this.$Message.error('题库内填空题总数量不足，已切换自定义选题')
          this.formData.questionSelectType = '2'
          return
        }
        if (this.sketchMaxNumber < 5) {
          this.$Notice.warning({
            title: '温馨提示',
            desc: '题库内简答题总数量不足，已切换自定义选题'
          })
          // this.$Message.error('题库内简答题总数量不足，已切换自定义选题')
          this.formData.questionSelectType = '2'
          return
        }
        this.formData.singleNumber = 10
        this.formData.multipleNumber = 5
        this.formData.judgeNumber = 10
        this.formData.packNumber = 10
        this.formData.sketchNumber = 5
      } else {
        this.formData.singleNumber = 0
        this.formData.multipleNumber = 0
        this.formData.judgeNumber = 0
        this.formData.packNumber = 0
        this.formData.sketchNumber = 0
      }
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
  margin-left: 0px;
  line-height: 35px;
  font-family: SimSun;
  color: #ed4014;
  font-size: 14px;
}
.remark {
  height: 35px;
  line-height: 35px;
  color: #515a6e;
  font-size: 14px;
}
// /deep/
// .ivu-input[disabled]{
//   background: #FFFFFF !important;
//   color: #515a6e !important;
// }
.borderDashed {
  padding: 12px;
  width: 100%;
  border: 1px dashed #17b3a3;
  min-height: 100px;
  border-radius: 5px;
  margin-top: 5px;
}
.socreBg {
  height: 40px;
  margin-left: 5px;
  color: white;
  border: 1px solid #e4e4e4;
  text-align: center;
  font-size: 14px;
  line-height: 40px;
  border-radius: 5px;
}
.socreBgSub {
  min-height: 36px;
  text-align: center;
  font-size: 13px;
  border: 1px solid #e4e4e4;
  color: white;
  line-height: 36px;
  padding-left: 8px;
  padding-right: 8px;
  margin-right: 10px;
  border-radius: 3px;
}

.socreInputBgSub {
  min-height: 36px;
  text-align: center;
  font-size: 13px;
  border: 1px solid #e4e4e4;
  color: white;
  line-height: 36px;
  padding-left: 6px;
  padding-right: 6px;
  margin-right: 10px;
  border-radius: 3px;
}
.boldStyle {
  font-weight: bold;
  line-height: 20px;
}
.right-auto {
  margin-right: auto !important;
}
.inputNumberStyle {
  margin-left: 5px;
  margin-right: 5px;
  width: 80px;
  margin-top: -4px;
}
/deep/.ivu-input-suffix {
  width: 50px;
}
// 改变input框背景颜色
/deep/.ivu-input-number {
  background: transparent !important;
  background-color: transparent !important;
  border: 1px solid transparent;
}
/deep/.ivu-input-number-handler-wrap {
  background: transparent !important;
  background-color: transparent !important;
}
</style>
