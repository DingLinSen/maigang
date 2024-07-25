<!--
 * @description planweek- 计划-周计划表--新增/编辑查看/界面
 * @author yxm
 * @date 2022-04-07
 * -->
<template>
  <div class="details-container" style="width: 100%;left:0">
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
      <Icon type="md-close" @click.stop="handleCancleModel" />
    </div>
    <div class="details-content">
      <Form :model="formData" ref="formValidate" :rules="formValidate">
        <Row :gutter="32">
          <Col span="12">
            <FormItem label="计划类型" label-position="top" prop="type">
              <Select
                v-model="formData.type"
                ref="type"
                :disabled="isSee"
                name="select"
                filterable
                remote
                :clearable="false"
                placeholder="请选择计划类型"
              >
                <Option value="1">周计划</Option>
              </Select>
            </FormItem>
          </Col>
          <Col span="12">
            <FormItem label="计划名称" label-position="top" prop="name">
              <Input
                type="text"
                v-model.trim="formData.name"
                placeholder="请输入计划名称"
                ref="name"
                :disabled="isSee"
                :maxlength="40"
              />
            </FormItem>
          </Col>
          <Col span="12">
            <FormItem label="计划单位" label-position="top" prop="deptId">
              <!-- <Cascader
                :data="deptList"
                v-model="formData.deptIds"
                placeholder="请选择计划单位"
                :disabled="isSee"
                @on-change="selDept"
                style="width: 100%"
                :clearable="false"
                change-on-select
              ></Cascader> -->
              <Input
                type="text"
                v-model.trim="formData.deptName"
                placeholder="计划单位"
                ref="deptName"
                disabled
                :maxlength="10"
              />
            </FormItem>
          </Col>
          <Col span="12">
            <FormItem label="人员类型" label-position="top" prop="personType">
              <Select
                v-model="formData.personType"
                ref="personType"
                :disabled="isSee"
                name="select"
                filterable
                remote
                :clearable="false"
                placeholder="请选择人员类型"
              >
                <Option value="1">类型1</Option>
                <Option value="2">类型2</Option>
                <Option value="3">类型3</Option>
              </Select>
            </FormItem>
          </Col>
          <Col span="12">
            <FormItem
              label="计划开始时间"
              label-position="top"
              prop="timeLimitStart"
            >
              <DatePicker
                type="date"
                style="width: 100%"
                :clearable="false"
                :confirm="true"
                :disabled="isSee"
                placeholder="请选择计划开始时间"
                v-model="formData.timeLimitStart"
                :options="startTimelimitStart"
                @on-change="assessmentLimitStart"
              >
              </DatePicker>
            </FormItem>
          </Col>
          <Col span="12">
            <FormItem
              label="计划结束时间"
              label-position="top"
              prop="timeLimitEnd"
            >
              <DatePicker
                type="date"
                style="width: 100%"
                :clearable="false"
                :confirm="true"
                :disabled="isSee"
                placeholder="请选择计划结束时间"
                v-model="formData.timeLimitEnd"
                :options="startTimelimitEnd"
                @on-change="assessmentLimitEnd"
              >
              </DatePicker>
            </FormItem>
          </Col>
          <Col span="12">
            <FormItem label="是否考核" label-position="top" prop="assessment">
              <Select
                v-model="formData.assessment"
                ref="assessment"
                :disabled="isSee"
                name="select"
                filterable
                remote
                :clearable="false"
                placeholder="请选择是否考核"
              >
                <Option value="1">考核</Option>
                <Option value="2">不考核</Option>
              </Select>
            </FormItem>
          </Col>
          <!-- <Col span="12">
            <FormItem
              label="考核时间"
              label-position="top"
              prop="assessmentTime"
            >
              <DatePicker
                type="date"
                style="width: 100%"
                :clearable="false"
                :confirm="true"
                :disabled="isSee"
                placeholder="请选择考核时间"
                v-model="formData.assessmentTime"
                :options="startAssessmentTime"
              >
              </DatePicker>
            </FormItem>
          </Col> -->
          <Col span="12" v-if="formData.assessment === '1'">
            <FormItem label="考核名称" label-position="top" prop="assessmentId">
              <Select
                v-model="formData.assessmentId"
                ref="assessmentId"
                :disabled="isSee"
                name="select"
                filterable
                remote
                :clearable="false"
                placeholder="请选择考核名称"
              >
                <Option
                  v-for="item in examineList"
                  :value="item.id"
                  :key="item.id"
                  :label="item.examinationName"
                ></Option>
              </Select>
            </FormItem>
          </Col>
        </Row>
        <div class="center">
          <p>计划内容:</p>
        </div>
        <Row :gutter="24">
          <Col span="12">
            <FormItem label="培训课目" label-position="top" prop="subjectId">
              <Select
                v-model="formData.subjectId"
                ref="subjectId"
                :disabled="isSee"
                remote
                multiple
                filterable
                name="select"
                :clearable="false"
                placeholder="请选择培训课目"
                @on-change="getTotalTime"
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
            <FormItem
              label="培训课目总时长"
              label-position="top"
              prop="totalTime"
            >
              <Input
                type="text"
                v-model.trim="formData.totalTime"
                placeholder="培训课目总时长"
                ref="totalTime"
                disabled
                :maxlength="10"
              >
                <span
                  slot="suffix"
                  style="height: 32px;line-height:32px;width:40px;"
                  >{{ timeUnit }}</span
                >
              </Input>
            </FormItem>
          </Col>
          <Col span="12">
            <FormItem label="目标" label-position="top" prop="target">
              <Input
                type="text"
                v-model.trim="formData.target"
                placeholder="请输入目标,例如:学习时常达到90%,考核成绩>=90"
                ref="target"
                :disabled="isSee"
                :maxlength="40"
              />
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
          @click.stop="handleReset"
          v-if="!isSee"
          >重置信息</Button
        > -->
        <Button
          type="default"
          class="mar-lft-10"
          @click.stop="handleCancleModel"
          >取消操作</Button
        >
      </div>
    </div>
  </div>
</template>

<script>
import { getSubjectHasSub } from '@/api/tasks/api-modules-tasktrain'
import { initAllDeptList } from '@/api/sys/api-modules-dept'
import { initAllRoleList } from '@/api/sys/api-modules-role'
import { sortByKey, treeDataTranslate } from '@/utils'
import { initPlanyearGetTime } from '@/api/trainPlan/api-modules-planyear'
import {
  operatePlanweekInfo,
  initPlanweekDetailsById,
  getAllAssessmentList
} from '@/api/trainPlan/api-modules-planweek'
import { OPERATE_PAGE } from '@/libs/mixin'
import FormDataInfo from './form'
import RulesValidate from './form-validate'
export default {
  mixins: [OPERATE_PAGE],
  data() {
    return {
      showDrawer: false,
      deptIds: [], // 部门id
      deptId: '', // 部门id
      timeUnit: '', // 时间单位
      deptList: [], // 部门列表
      totalTimeWeekHour: null,
      subjectArray: [], // 选择培训课目
      startAssessmentTime: {}, // 考核时间
      startTimelimitStart: {}, // 计划开始时限
      startTimelimitEnd: {}, // 计划结束时限
      formData: FormDataInfo(),
      examineList: [],
      formValidate: RulesValidate(this),
      examineId: null,
      examineName: null
    }
  },
  computed: {},
  activated() {
    this.formData.type = '1'
    this.startAssessmentTime = {}
    this.startTimelimitStart = {}
    this.startTimelimitEnd = {}
    this.examineList = []
    this.totalTimeWeekHour = null
    // this.initAllAssessmentList()
    this.initSubjectList()
    this.initRoleList()
    this.initFormData()
  },
  methods: {
    initAllAssessmentList(val) {
      if (val) {
        let params = { deptId: val }
        getAllAssessmentList(params)
          .then(res => {
            if (res.status) {
               if (res.data.data && res.data.data.length > 0) {
                var examineId = []
                this.examineList.forEach(item => {
                  examineId.push(item.id)
                })
                res.data.data.forEach(item => {
                  if (
                    examineId.length === 0 ||
                    examineId.indexOf(item.id) < 0
                  ) {
                    this.examineList.push(item)
                  }
                })
              }
            }
          })
          .catch(() => {})
      }
    },
    // 获取所有部门
    initRoleList() {
      initAllRoleList()
        .then(res => {
          if (res.status) {
            this.roleList = sortByKey(res.data.data, 'orderNum')
          }
        })
        .catch(() => {})
      var user = this.$cookie.get(this.CONST_VALUE.LOGIN_USER_INFO)
      var listSub = JSON.parse(user)
      initAllDeptList()
        .then(res => {
          if (res.data.status) {
            var data = res.data.data
            let deptList = []
            data.forEach(item => {
              deptList.push({
                ...item,
                value: item.deptId,
                label: item.deptName
              })
            })
            this.deptList = treeDataTranslate(deptList, 'deptId')
            this.deptId = this.deptList[0].deptId
            this.formData.deptName = this.deptList[0].deptName
            this.deptNameSub = this.deptList[0].deptName
            this.initAllAssessmentList(this.deptId)
          } else {
          }
        })
        .catch(() => {
          this.loading = false
        })
    },
    // 获取所有课目
    initSubjectList() {
      this.$nextTick(() => {
        let params = { type: '1' }
        this.subjectArray = []
        getSubjectHasSub(params)
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
    // 选中课目计算时长
    getTotalTime(val) {
      let params = {
        subjectId: val
      }
      // console.log(params)
      // 如果params为空，则不调用接口
      // if (params.subjectId == '') {
      //   this.formData.totalTime = ''
      //   return
      // }
      if (this.totalTimeWeekHour) {
        this.totalTimeWeekHour = ''
        return
      }
      initPlanyearGetTime(params)
        .then(res => {
          if (res.data.status) {
            // 把totalTime转换成小时，精确到小数点后一位
            this.totalTimeHour = res.data.totalTime
            // let totalTimeBr = this.totalTimeHour / 3600
            // let totalTimeHourStr = totalTimeBr.toFixed(1)
            // this.formData.totalTime = totalTimeHourStr + 'h'
            if (this.totalTimeHour > 3600) {
              let totalTimeBr = this.totalTimeHour / 3600
              let totalTimeHourStr = Math.round(totalTimeBr * 10) / 10
              this.formData.totalTime = totalTimeHourStr
              this.timeUnit = '小时'
            } else {
              let totalTimeBr = this.totalTimeHour / 60
              let totalTimeHourStr = Math.round(totalTimeBr * 10) / 10
              this.formData.totalTime = totalTimeHourStr
              this.timeUnit = '分钟'
            }
            this.$forceUpdate()
          }
        })
        .catch(() => {})
    },
    // 根据id 获取详情
    initFormData() {
      this.handleReset() // 重置表单
      let params = {
        id: this.detailsId
      }
      this.$nextTick(() => {
        this.formData = FormDataInfo()
        this.formData.type = '1'
        if (this.isOperate) {
          initPlanweekDetailsById(params)
            .then(res => {
              if (res.data.status) {
                const data = res.data.planWeekDO
                if (data == null) {
                  this.$Message.error('未查询到相关信息')
                  this.handleCancleModel()
                  return
                }
                // this.formData = res.data.planWeekDO
                this.formData.id = data.id
                this.formData.name = data.name
                this.formData.personType = data.personType
                this.formData.assessment = data.assessment
                this.formData.assessmentId = data.assessmentId
                this.examineId = data.assessmentId
                this.examineName = data.examinationName
                var examineId = []
                this.examineList.forEach(item => {
                  examineId.push(item.id)
                })
                if (
                  data.assessmentId &&
                  (examineId.length === 0 ||
                  examineId.indexOf(data.assessmentId) < 0)
                ) {
                  this.examineList.push({
                    id: data.assessmentId,
                    examinationName: data.examinationName
                  })
                }
                this.formData.assessmentTime = data.assessmentTime
                this.formData.target = data.target

                this.formData.timeLimitStart = data.timeLimitStart
                this.formData.timeLimitEnd = data.timeLimitEnd
                var startTime = new Date(this.formData.timeLimitStart).valueOf()
                this.startTimelimitEnd = {
                  disabledDate(date) {
                    return date && date.valueOf() < startTime
                  }
                }
                var endTime = new Date(this.formData.timeLimitEnd).valueOf()
                this.startTimelimitStart = {
                  disabledDate(date) {
                    return date && date.valueOf() > endTime
                  }
                }
                this.startAssessmentTime = {
                  disabledDate(date) {
                    return (
                      date &&
                      (date.valueOf() < startTime || date.valueOf() > endTime)
                    )
                  }
                }
                this.formData.deptId = data.deptId
                this.deptIds = data.deptIds
                this.formData.deptName = res.data.planWeekDO.deptName

                this.totalTimeHour = data.totalTime
                if (this.totalTimeHour > 3600) {
                  let totalTimeBr = this.totalTimeHour / 3600
                  let totalTimeHourStr = Math.round(totalTimeBr * 10) / 10
                  this.formData.totalTime = totalTimeHourStr
                  this.totalTimeWeekHour = String(totalTimeHourStr)
                  this.timeUnit = '小时'
                } else {
                  let totalTimeBr = this.totalTimeHour / 60
                  let totalTimeHourStr = Math.round(totalTimeBr * 10) / 10
                  this.formData.totalTime = totalTimeHourStr
                  this.totalTimeWeekHour = String(totalTimeHourStr)
                  this.timeUnit = '分钟'
                }
                // 循环取出subbjectId
                let subjectIds = []
                data.planSubjectDOS.forEach(item => {
                  subjectIds.push(item.subjectId)
                })
                // 循环取出subbjectIName
                data.planSubjectDOS.forEach(item => {
                  if (this.isSee) {
                    this.subjectArray.push({
                      id: item.subjectId,
                      name: item.subjectName
                    })
                  }
                })
                this.formData.subjectId = subjectIds
              } else {
                this.formData = FormDataInfo()
                this.formData.type = '1'
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
          isOperate: this.isOperate,
          timeLimitStart: this.$moment(this.formData.timeLimitStart).format(
            'YYYY-MM-DD'
          ),
          timeLimitEnd: this.$moment(this.formData.timeLimitEnd).format(
            'YYYY-MM-DD'
          ),
          assessmentTime: this.$moment(this.formData.assessmentTime).format(
            'YYYY-MM-DD'
          ),
          totalTime: this.totalTimeHour ? this.totalTimeHour : 0,
          deptId: this.deptId
        }
      )
      Object.keys(this.formData).forEach((item, index) => {
        if (!params[item]) {
          if (this.formData[item]) {
            params[item] = ((this.formData[item] || null) + '').trim()
          }
        }
      })
      if (params.createBy) {
        delete params.createBy
      }
      if (params.createTime) {
        delete params.createTime
      }
      if (params.delFlag) {
        delete params.delFlag
      }
      if (params.updateBy) {
        delete params.updateBy
      }
      if (params.updateTime) {
        delete params.updateTime
      }
      if (params.deptName) {
        delete params.deptName
      }
      var subjectArray = []
      if (this.formData.subjectId) {
        this.formData.subjectId.forEach(item => {
          subjectArray.push({ subjectId: item })
        })
      }
      params['planSubjectDOS'] = subjectArray
      params['totalTime'] =
        params['totalTime'] === '0.0' ? 0 : params['totalTime']
      operatePlanweekInfo(params)
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
    // 选择部门
    selDept(value) {
      if (value && value.length > 0) {
        this.formData.deptId = value[value.length - 1]
      } else if (value.length === 0) {
        this.formData.deptId = ''
      } else {
        this.formData.deptId = ''
      }
    },
    assessmentLimitStart(e) {
      this.$forceUpdate()
      var timeLimitStart = this.formData.timeLimitStart
      var timeLimitEnd = this.formData.timeLimitEnd
      this.startTimelimitEnd = {
        disabledDate(date) {
          return date && date.valueOf() < timeLimitStart
        }
      }
      if (timeLimitStart) {
        if (timeLimitEnd) {
          this.startAssessmentTime = {
            disabledDate(date) {
              return (
                date &&
                (date.valueOf() < timeLimitStart ||
                  date.valueOf() > timeLimitEnd)
              )
            }
          }
        } else {
          this.startAssessmentTime = {
            disabledDate(date) {
              return date && date.valueOf() < timeLimitStart
            }
          }
        }
        this.formData.assessmentTime = null
      } else {
        this.startAssessmentTime = {}
      }
    },
    assessmentLimitEnd(e) {
      var timeLimitEnd = this.formData.timeLimitEnd
      var timeLimitStart = this.formData.timeLimitStart
      this.startTimelimitStart = {
        disabledDate(date) {
          return date && date.valueOf() > timeLimitEnd
        }
      }
      if (timeLimitEnd) {
        if (timeLimitStart) {
          this.startAssessmentTime = {
            disabledDate(date) {
              return (
                date &&
                (date.valueOf() < timeLimitStart ||
                  date.valueOf() > timeLimitEnd)
              )
            }
          }
        } else {
          this.startAssessmentTime = {
            disabledDate(date) {
              return date && date.valueOf() > timeLimitEnd
            }
          }
        }
        this.formData.assessmentTime = null
      } else {
        this.startAssessmentTime = {}
        timeLimitEnd = {}
      }
    }
  }
}
</script>
<style lang="less" scoped>
.center {
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-pack: justify;
  -ms-flex-pack: justify;
  justify-content: space-between;
  font-size: 15px;
  border-bottom: 1px solid #e9e9e9;
  padding-bottom: 15px;
}
/deep/ .details-title p {
  padding-top: 10px;
}
/deep/ .details-content {
  height: 96% !important;
}
</style>
