<!--
 * @description planyear- 计划-年计划表--新增/编辑查看/界面
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
      <Icon type="md-close" @click.stop="handleCancleModel" />
    </div>
    <div class="details-content">
      <Form :model="formData" ref="formValidate" :rules="formValidate">
        <Row :gutter="32">
          <Col span="12">
            <FormItem label="任务名称" label-position="top" prop="taskName">
              <Input
                type="text"
                v-model.trim="formData.taskName"
                placeholder="请输入任务名称"
                ref="taskName"
                :disabled="isSee"
                :maxlength="40"
              />
            </FormItem>
          </Col>
          <Col span="12">
            <FormItem label="任务期限" label-position="top" prop="dateArray">
              <DatePicker
                v-model="formData.dateArray"
                format="yyyy-MM-dd"
                type="daterange"
                :disabled="isSee"
                placement="bottom-start"
                placeholder="选择任务期限"
                style="width: 100%"
              ></DatePicker>
            </FormItem>
          </Col>
          <Col span="12">
            <FormItem label="任务单位" label-position="top" prop="deptIds">
              <Cascader
                :data="deptList"
                v-model="formData.deptIds"
                placeholder="请选择任务单位"
                :disabled="isSee"
                @on-change="selDept"
                style="width: 100%"
                :clearable="false"
                change-on-select
              ></Cascader>
            </FormItem>
          </Col>
          <Col span="12">
            <FormItem
              label="参与人员"
              label-position="top"
              prop="taskUserArray"
            >
              <Select
                v-model="formData.taskUserArray"
                ref="taskUserArray"
                multiple
                :disabled="isSee"
                name="select"
                filterable
                :clearable="false"
                placeholder="请选择参与人员"
                @on-change="cleanUsear"
              >
                <Option
                  value="all"
                  key="all"
                  v-if="personArray.length !== 0"
                  disabled
                >
                  <Checkbox
                    class="iview-checkbox"
                    v-model="checked"
                    @on-change="selectAll"
                    style="width:100%;color:#515a6e;"
                    >全选</Checkbox
                  >
                </Option>
                <Option
                  v-for="item in personArray"
                  :value="item.id"
                  :key="item.id"
                  :label="item.name"
                ></Option>
              </Select>
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
          <p>任务内容:</p>
        </div>
        <div v-if="formData.subjectType !== '2'">
          <Row :gutter="24">
            <Col span="12">
              <FormItem
                label="课目类型"
                label-position="top"
                prop="subjectType"
              >
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
                  <Option value="2" label="专业操作"></Option>
                </Select>
              </FormItem>
            </Col>
            <Col span="12">
              <FormItem label="培训课目" label-position="top" prop="subjectId">
                <Select
                  v-model="formData.subjectId"
                  ref="subjectId"
                  :disabled="isSee"
                  multiple
                  name="select"
                  filterable
                  :clearable="false"
                  placeholder="请选择培训课目"
                  @on-change="getAllChapter"
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
              <FormItem label="培训章节" label-position="top" prop="chapter">
                <Select
                  v-model="formData.chapter"
                  ref="chapter"
                  :disabled="isSee"
                  multiple
                  name="select"
                  filterable
                  :clearable="false"
                  placeholder="请选择培训章节"
                  @on-change="getTotalTime"
                >
                  <Option
                    value="all"
                    key="all"
                    v-if="chapterArray.length !== 0"
                    disabled
                  >
                    <Checkbox
                      class="iview-checkbox"
                      v-model="checkedChapter"
                      @on-change="selectAllChapter"
                      style="width:100%;color:#515a6e;"
                      >全选</Checkbox
                    >
                  </Option>
                  <Option
                    v-for="item in chapterArray"
                    :value="item.id"
                    :key="item.id"
                    :label="item.chapterTitle + '\xa0\xa0' + item.chapter"
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
                  :readonly="!isSee"
                  :disabled="isSee"
                  :maxlength="10"
                >
                  <span
                    slot="suffix"
                    style="height: 32px;line-height:32px;width:40px;"
                    >{{ timeUnit }}</span
                  >
                  <!-- <Icon type="ios-search" slot="suffix" /> -->
                </Input>
              </FormItem>
            </Col>
            <Col span="24">
              <FormItem label="目标" label-position="top" prop="target">
                <Input
                  type="textarea"
                  :autosize="{ minRows: 2 }"
                  v-model.trim="formData.target"
                  placeholder="请输入目标,例如:学习时长达到90%,考核成绩>=90"
                  ref="target"
                  :disabled="isSee"
                  :maxlength="50"
                />
              </FormItem>
            </Col>
          </Row>
        </div>
        <div>
          <Row :gutter="24" v-if="formData.subjectType === '2'">
            <Col span="12">
              <FormItem
                label="课目类型"
                label-position="top"
                prop="subjectType"
              >
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
                  <Option value="2" label="专业操作"></Option>
                </Select>
              </FormItem>
            </Col>
            <Col span="12">
              <FormItem
                label="培训课目"
                label-position="top"
                prop="subjectIdTemp"
              >
                <Select
                  v-model="formData.subjectIdTemp"
                  ref="subjectIdTemp"
                  :disabled="isSee"
                  name="select"
                  filterable
                  :clearable="false"
                  placeholder="请选择培训课目"
                  @on-change="getSingleSubject"
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
                label="训练次数"
                label-position="top"
                prop="trainFrequency"
              >
                <Input
                  type="text"
                  v-model.trim="formData.trainFrequency"
                  placeholder="请输入训练次数"
                  ref="trainFrequency"
                  :disabled="isSee"
                  :maxlength="10"
                >
                  <span
                    slot="suffix"
                    style="height: 32px;line-height:32px;width:40px;"
                    >次</span
                  >
                </Input>
              </FormItem>
            </Col>
            <Col span="24">
              <FormItem label="目标" label-position="top" prop="target">
                <Input
                  type="textarea"
                  :autosize="{ minRows: 2 }"
                  v-model.trim="formData.target"
                  placeholder="请输入目标,例如:学习时长达到90%,考核成绩>=90"
                  ref="target"
                  :disabled="isSee"
                  :maxlength="50"
                />
              </FormItem>
            </Col>
          </Row>
        </div>
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
// import { initSubjectList } from '@/api/info/resource/api-modules-datamanagement'
import {
  operateTaskTrainInfo,
  initTaskTrainDetailsById,
  initUserByDeptId,
  initTasksGetTime,
  initTasksGetChapter,
  getBelowDept,
  getSubjectHasSub
} from '@/api/tasks/api-modules-tasktrain'
import { getAllAssessmentList } from '@/api/trainPlan/api-modules-planweek'
// import { initAllDeptList } from '@/api/sys/api-modules-dept'
import { sortByKey, treeDataTranslate } from '@/utils'
import { OPERATE_PAGE } from '@/libs/mixin'
import FormDataInfo from './form'
import RulesValidate from './form-validate'
export default {
  mixins: [OPERATE_PAGE],
  data() {
    return {
      subjectArray: [], // 选择培训课目
      startTimelimit: null, // 计划时限
      personArray: [], // 人员类型
      deptList: [], // 计划单位
      deptIds: [],
      chapterArray: [],
      chapterIdArray: [],
      chapterEditArray: [],
      checked: false,
      checkedChapter: false,
      totalTimeHour: '',
      totalTimeWeekHour: null,
      showDrawer: false,
      timeUnit: '小时',
      examineList: [],
      formData: FormDataInfo(),
      formValidate: RulesValidate(this),
      haveChapter: false,
      examineId: null,
      examineName: null
    }
  },
  computed: {},
  activated() {
    this.haveChapter = true
    this.checked = false
    this.subjectArray = []
    this.personArray = []
    this.chapterArray = []
    this.chapterIdArray = []
    this.chapterEditArray = []
    this.chapterEditArray = []
    this.examineList = []
    this.totalTimeWeekHour = null
    this.timeUnit = '小时'
    this.formData.assessment = '2'
    // this.getAssessmentList()
    this.getBelowDept()
    this.initSubjectList('1')
    this.initFormData()
  },
  methods: {
    // 获取考核名称
    getAssessmentList(val) {
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
    getBelowDept() {
      getBelowDept()
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
          } else {
          }
        })
        .catch(() => {
          this.loading = false
        })
    },
    // 获取所有课目
    initSubjectList(val) {
      if (!this.isSee) {
        this.$nextTick(() => {
          val = val ? val : '1'
          let params = { type: val }
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
      }
    },
    // 根据id 获取详情
    initFormData() {
      this.handleReset() // 重置表单
      let params = {
        id: this.detailsId
      }
      this.$nextTick(() => {
        this.formData = FormDataInfo()
        this.formData.assessment = '2'
        // console.log(this.formData)
        if (this.isOperate) {
          initTaskTrainDetailsById(params)
            .then(res => {
              if (res.data.status) {
                const data = res.data.taskTrainDO
                if (data == null) {
                  this.$Message.error('未查询到相关信息')
                  this.handleCancleModel()
                  return
                }
                this.formData.id = data.id ? data.id : ''
                this.formData.taskName = data.taskName
                this.formData.target = data.target
                // console.log(data.deptIds)
                this.formData.deptIds = data.deptIds
                if (!this.isSee) {
                  this.getAllUserFromDeptId(data.deptId, false)
                  this.getAssessmentList(data.deptId)
                } else {
                  this.formData.deptIds = []
                  this.formData.deptIds.push(data.deptId)
                  this.deptList = [{ value: data.deptId, label: data.deptName }]
                }

                var dateArraySub = []
                dateArraySub.push(this.$moment(data.taskTimeStart).toDate())
                dateArraySub.push(this.$moment(data.taskTimeEnd).toDate())
                this.formData.dateArray = dateArraySub

                setTimeout(() => {
                  let userIdArray = []
                  if (this.isSee) {
                    this.personArray = []
                  }
                  data.taskUserDOS.forEach(item => {
                    if (this.isSee) {
                      this.personArray.push({
                        id: item.userId,
                        name: item.userName
                      })
                    }
                    userIdArray.push(item.userId)
                  })
                  this.formData.taskUserArray = userIdArray
                  if (userIdArray.length === this.personArray.length) {
                    this.checked = true
                  } else {
                    this.checked = false
                  }
                }, 50)
                this.totalTimeHour = data.totalTime ? data.totalTime : 0
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

                this.formData.trainFrequency = data.trainFrequency
                  ? String(data.trainFrequency)
                  : ''
                this.formData.chapter = []
                this.chapterIdArray = []
                this.chapterEditArray = []
                let subjectIds = []
                data.taskSubjectDOS.forEach(item => {
                  this.formData.subjectType = String(item.type)
                  if (this.isSee) {
                    this.subjectArray.push({
                      id: item.subjectId,
                      name: item.subjectName
                    })
                  }
                  subjectIds.push(item.subjectId)
                  var chapterArray = item.taskSubjectChapterDOS
                    ? item.taskSubjectChapterDOS
                    : []
                  chapterArray.forEach(item0 => {
                    this.formData.chapter.push(item0.chapterId)
                    this.chapterEditArray.push(item0)
                    this.chapterIdArray.push({
                      id: item0.chapterId,
                      subjectId: item.subjectId
                    })
                    if (this.isSee) {
                      this.chapterArray.push({
                        id: item0.chapterId,
                        chapter: item0.chapter,
                        chapterTitle: item0.chapterTitle
                      })
                    }
                  })
                })
                this.formData.subjectId = subjectIds
                if (!this.isSee) {
                  this.initSubjectList(this.formData.subjectType)
                }
                if (this.formData.subjectType === '2') {
                  this.formData.subjectIdTemp =
                    subjectIds[subjectIds.length - 1]
                }

                this.formData.assessment = data.assessment
                  ? String(data.assessment)
                  : '2'
                this.formData.assessmentId = data.assessmentId
                this.examineId = data.assessmentId
                this.examineName = data.examinationName
                var examineId = []
                this.examineList.forEach(item => {
                  examineId.push(item.id)
                })

                if (data.assessmentId &&
                  (examineId.length === 0 ||
                  examineId.indexOf(data.assessmentId) < 0)
                ) {
                  this.examineList.push({
                    id: data.assessmentId,
                    examinationName: data.examinationName
                  })
                }

                // if (data.planId && this.isSee) {
                // this.deptList = [{ value: data.deptId, label: data.deptName }]
                // }
                // console.log(this.formData.subjectId)
              } else {
                this.formData = FormDataInfo()
                // this.$Message.error('获取信息详情时异常，请联系管理员')
              }
            })
            .catch(() => {})
        }
      })
    },
    //获取章节
    getAllChapter(val) {
      if (this.isSee) {
        return
      }
      if (!val || val.length === 0) {
        this.formData.subjectId = []
        this.chapterArray = []
        this.formData.chapter = []
        this.formData.totalTime = ''
        this.$forceUpdate()
        return
      }
      let params = {
        subjectIds: val
      }
      // if (params.subjectId == '') {
      //   this.formData.totalTime = ''
      //   return
      // }
      initTasksGetChapter(params)
        .then(res => {
          if (res.data.status) {
            this.chapterArray = res.data.data ? res.data.data : []
            var chapterIdsArray = []
            this.chapterArray.forEach(item => {
              chapterIdsArray.push(item.id)
            })
            var chapterIdArray = []
            this.chapterIdArray = []
            this.formData.chapter.forEach(item => {
              if (chapterIdsArray.indexOf(item) > -1) {
                chapterIdArray.push(item)
              }
            })
            this.formData.chapter = chapterIdArray
            if (this.formData.chapter.length === this.chapterArray.length) {
              this.checkedChapter = true
            } else {
              this.checkedChapter = false
            }
            // if (this.chapterEditArray.length > 0) {
            //   this.chapterEditArray = []
            //   return
            // }
            // this.formData.chapter = []
            // this.chapterIdArray = []
            // this.chapterArray.forEach(item => {
            //   this.formData.chapter.push(item.id)
            //   this.chapterIdArray.push(item)
            // })
          }
        })
        .catch(() => {})
    },
    // 选中课目计算时长
    getTotalTime(val) {
      if (this.formData.chapter.length === this.chapterArray.length) {
        this.checkedChapter = true
      } else {
        this.checkedChapter = false
      }
      this.chapterIdArray = []
      this.chapterArray.forEach(item => {
        if (val.indexOf(item.id) > -1) {
          this.chapterIdArray.push(item)
        }
      })
      if (!val || val.length === 0) {
        this.formData.chapter = []
        this.formData.totalTime = ''
        this.$forceUpdate()
        return
      }
      if (this.totalTimeWeekHour) {
        this.totalTimeWeekHour = ''
        return
      }
      let params = {
        chapterIds: val
      }
      initTasksGetTime(params)
        .then(res => {
          if (res.data.status) {
            // 把totalTime转换成小时，精确到小数点后一位
            this.totalTimeHour = res.data.totalTime
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
          }
        })
        .catch(() => {})
    },
    // 保存信息 （添加和编辑）
    handleSubmit() {
      // console.log(this.totalTimeHour)
      let params = Object.assign(
        { ...this.formData },
        {
          isOperate: this.isOperate,
          totalTime: this.totalTimeHour ? this.totalTimeHour : 0
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
      if (this.formData.subjectId) {
        this.formData.subjectId.forEach(item => {
          var chapterArray = []
          this.chapterIdArray.forEach(item0 => {
            if (item === item0.subjectId) {
              chapterArray.push({ chapterId: item0.id })
            }
          })
          subjectArray.push({
            subjectId: item,
            taskSubjectChapterDOS: chapterArray
          })
        })
      }
      params['deptId'] = this.formData.deptIds[this.formData.deptIds.length - 1]
      params['taskSubjectDOS'] = subjectArray
      params['taskTimeStart'] = this.formData.dateArray[0]
        ? this.$moment(this.formData.dateArray[0]).format('YYYY-MM-DD')
        : null
      params['taskTimeEnd'] = this.formData.dateArray[1]
        ? this.$moment(this.formData.dateArray[1]).format('YYYY-MM-DD')
        : null
      var userIdArray = []
      if (this.formData.taskUserArray) {
        this.formData.taskUserArray.forEach(item => {
          userIdArray.push({ userId: item })
        })
      }
      params['taskUserDOS'] = userIdArray
      params['totalTime'] =
        params['totalTime'] === '0.0' ? 0 : params['totalTime']
      // console.log(params)
      operateTaskTrainInfo(params)
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
    },
    // 选择部门
    selDept(value) {
      var deptId = ''
      if (value && value.length > 0) {
        deptId = value[value.length - 1]
      }
      this.getAllUserFromDeptId(deptId, true)
      this.examineList = []
      this.formData.assessmentId = null
      this.getAssessmentList(deptId)
    },
    //获取人员列表
    getAllUserFromDeptId(deptId, isClean) {
      if (this.isSee) {
        return
      }
      this.checked = false
      this.$nextTick(() => {
        let params = { id: deptId }
        this.personArray = []
        initUserByDeptId(params)
          .then(res => {
            if (res.data.status) {
              const data = res.data
              this.personArray = data.data
              if (!this.isSee && isClean) {
                this.formData.taskUserArray = []
              }
              if (
                this.formData.taskUserArray.length === this.personArray.length
              ) {
                this.checked = true
              } else {
                this.checked = false
              }
              this.$forceUpdate()
            }
          })
          .catch(() => {})
      })
    },
    //人员全部选择
    selectAll() {
      setTimeout(() => {
        this.$nextTick(() => {
          this.formData.taskUserArray = []
          if (this.checked) {
            this.personArray.forEach(temp => {
              this.formData.taskUserArray.push(temp.id)
            })
          }
          this.$refs.taskUserArray.visible = false
          this.$forceUpdate()
        })
      }, 0)
    },
    cleanUsear() {
      if (this.formData.taskUserArray.length === this.personArray.length) {
        this.checked = true
      } else {
        this.checked = false
      }
    },
    //章节全部选择
    selectAllChapter() {
      setTimeout(() => {
        this.$nextTick(() => {
          this.formData.chapter = []
          if (this.checkedChapter) {
            this.chapterIdArray = []
            this.chapterArray.forEach(temp => {
              this.formData.chapter.push(temp.id)
              this.chapterIdArray.push(temp)
            })
          }
          this.$refs.chapter.visible = false
          this.$forceUpdate()
        })
      }, 0)
    },
    subjectTypeChange(val) {
      // if (this.$refs['formValidate']) {
      //   this.$refs['formValidate'].resetFields()
      // }
      if (val === '1') {
        this.formData.trainFrequency = null
        this.formData.subjectIdTemp = null
        this.formData.subjectId = []
        this.formData.chapter = []
      } else if (val === '2') {
        this.checkedChapter = false
        this.chapterArray = []
        this.formData.subjectId = []
        this.formData.chapter = []
        this.formData.totalTime = null
      }
      this.initSubjectList(val)
    },
    getSingleSubject(val) {
      this.formData.subjectId = []
      this.formData.subjectId.push(val)
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
/deep/.ivu-input-suffix {
  width: 50px;
}
</style>
