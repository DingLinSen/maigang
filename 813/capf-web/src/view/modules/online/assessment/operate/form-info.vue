<!--
 * @description videomanagement- 考核管理表--新增/编辑查看/界面
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
          <!--          考试名称-->
          <Col span="12">
            <FormItem
              label="考试名称"
              label-position="top"
              prop="examinationName"
            >
              <Input
                type="text"
                v-model.trim="formData.examinationName"
                placeholder="请输入考试名称"
                ref="examinationName"
                :disabled="isSee"
                :maxlength="200"
              />
            </FormItem>
          </Col>
          <!--          考试描述-->
          <Col span="12">
            <FormItem label="考试描述" label-position="top" prop="remark">
              <Input
                type="text"
                v-model.trim="formData.remark"
                placeholder="请输入考试描述"
                ref="remark"
                :disabled="isSee"
                :maxlength="500"
              />
            </FormItem>
          </Col>
          <!--          试卷名称-->
          <Col span="12">
            <FormItem label="试卷名称" label-position="top" prop="paperId">
              <Select
                v-model="formData.paperId"
                ref="paperId"
                :disabled="isSee"
                remote
                filterable
                name="paperId"
                :clearable="false"
                placeholder="请选择试卷名称"
                @on-change="paperChange"
              >
                <Option
                  v-for="item in paperList"
                  :value="item.id"
                  :key="item.id"
                  :label="item.paperName"
                ></Option>
              </Select>
            </FormItem>
          </Col>
          <!--          考场名称-->
          <Col span="12">
            <FormItem
              label="考场名称"
              label-position="top"
              prop="examinationId"
            >
              <Select
                v-model="formData.examinationId"
                ref="examinationId"
                :disabled="isSee"
                remote
                name="examinationId"
                :clearable="false"
                placeholder="请选择考场名称"
                @on-change="roomChange"
              >
                <Option
                  v-for="item in roomArray"
                  :value="item.id"
                  :key="item.id"
                  :label="item.name"
                ></Option>
              </Select>
            </FormItem>
          </Col>
          <!--          考试类型-->
          <Col span="12">
            <FormItem label="考试类型" label-position="top" prop="type">
              <Select
                v-model="formData.type"
                ref="type"
                :disabled="isSee"
                remote
                name="select"
                :clearable="false"
                placeholder="请选择考试类型"
              >
                <Option value="1" label="结业考核初考"></Option>
                <Option value="2" label="结业考核补考"></Option>
                <Option value="3" label="季度考核"></Option>
                <Option value="4" label="抽考"></Option>
              </Select>
            </FormItem>
          </Col>
          <!--          总分数-->
          <Col span="12">
            <FormItem label="总分数" label-position="top" prop="score">
              <Input
                type="text"
                v-model.trim="formData.score"
                placeholder="请输入总分数"
                ref="score"
                disabled
              />
            </FormItem>
          </Col>
          <!--          及格分-->
          <Col span="12">
            <FormItem label="及格分" label-position="top" prop="passScore">
              <Input
                type="text"
                v-model.trim="formData.passScore"
                placeholder="请输入及格分"
                ref="passScore"
                :disabled="isSee"
                :maxlength="200"
              />
            </FormItem>
          </Col>
          <!--          是否认证-->
          <Col span="2">
            <FormItem label="是否认证" label-position="top" prop="isAuth">
              <el-switch
                v-model="formData.isAuth"
                :disabled="isSee"
                active-color="#13ce66"
                inactive-color="#ff4949"
              >
              </el-switch>
            </FormItem>
          </Col>
          <Col span="10"> </Col>
          <!--          是否限时-->
          <Col span="2">
            <FormItem label="是否限时" label-position="top" prop="isLimitTime">
              <el-switch
                v-model="formData.isLimitTime"
                :disabled="isSee"
                active-color="#13ce66"
                inactive-color="#ff4949"
                @change="handleIsLimitTime"
              >
              </el-switch>
            </FormItem>
          </Col>
          <Col span="10"> </Col>
          <!--          考试时间-->
          <Col span="12" v-if="formData.isLimitTime">
            <FormItem
              label="考试时间"
              label-position="top"
              prop="examinationTime"
            >
              <DatePicker
                v-model="formData.examinationTime"
                format="yyyy-MM-dd HH:mm"
                type="datetimerange"
                style="width: 100%"
                placeholder="选择考试时间"
                :disabled="isSee"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
              >
              </DatePicker>
            </FormItem>
          </Col>
          <!--          考试时长(分钟)-->
          <Col span="12" v-if="!formData.isLimitTime">
            <FormItem
              label="考试时长(分钟)"
              label-position="top"
              prop="testDuration"
            >
              <Input
                type="text"
                v-model.trim="formData.testDuration"
                placeholder="请输入考试时长"
                ref="testDuration"
                :disabled="isSee"
              />
            </FormItem>
          </Col>
          <!--          考试日期-->
          <Col span="12" v-if="!formData.isLimitTime">
            <FormItem label="考试日期" label-position="top" prop="examDate">
              <DatePicker
                @on-change="changeDate"
                v-model="formData.examDate"
                format="yyyy-MM-dd"
                type="daterange"
                :disabled="isSee"
                placement="bottom-start"
                placeholder="选择考试日期"
                style="width: 100%"
              ></DatePicker>
            </FormItem>
          </Col>
          <!--          分配考生-->
          <Col span="12">
            <FormItem
              label="分配考生"
              label-position="top"
              prop="taskUserArray"
            >
              <div class="select_dept">
                <template v-if="formData.taskUserArray.length > 0">
                  <div
                    v-for="(item, index) in formData.taskUserArray"
                    class="select_dept_name"
                    :key="index"
                  >
                    <span> {{ getUserLabel(item) }}</span>
                  </div>
                </template>
                <div
                  v-if="!isOperate || !isSee"
                  class="add_icon"
                  @click="addPerson"
                >
                  <img src="@/assets/images/add_icon.png" alt="" />
                </div>
              </div>
            </FormItem>
          </Col>
        </Row>
      </Form>
      <br />
      <div class="demo-drawer-footer" style="text-align: center">
        <Button type="primary" @click="handleValidate" v-if="!isSee"
          >确认{{ !isOperate ? '新增' : '编辑' }}
        </Button>
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
          >取消操作
        </Button>
      </div>
    </div>
    <Modal
      title="选择人员"
      v-model="addPersonDialog"
      width="50%"
      @on-ok="surePerson"
      @on-cancel="cancelPerson"
    >
      <div class="addPersonDialog_content">
        <div class="addPersonDialog_left">
          <el-tree
            ref="tree"
            show-checkbox
            :data="personList"
            :props="defaultProps"
            :default-checked-keys="userData"
            accordion
            node-key="id"
            @check="checkAllGroupChange"
          >
          </el-tree>
        </div>
        <div class="addPersonDialog_right">
          <div class="addPersonDialog_right_title">
            <span>已选</span>
            <span class="delAll" @click="delCheckListAll">全部删除</span>
          </div>
          <ul>
            <li class="del_list" v-for="(item, index) in userData" :key="index">
              <span class="ml-[0.42vw]">{{ getUserLabel(item) }}</span>
              <span class="del_size" @click="delCheckList(item)">×</span>
            </li>
          </ul>
        </div>
      </div>
    </Modal>
  </div>
</template>

<script>
import {
  operateAssessmentManagementInfo,
  initAssessmentManagementDetailsById,
  initAllPaper,
  initAllRoom,
  getAssessmentManagementDept
} from '@/api/online/assessment/api-modules-assessment'
import { initUserByDeptId } from '@/api/tasks/api-modules-tasktrain'
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
      paperList: [],
      deptArray: [],
      roomArray: [],
      startTimeOption: null,
      endTimeOption: null,
      checked: false,
      personArray: [],
      deleteChooseModel: false,
      answerEditIndex: 0,
      answerOptionId: null,
      paperTime: -1,
      startTimeOld: 0,
      addPersonDialog: false,
      personList: [],
      selectedFlag: 0,
      userListData: [],
      userData: [],
      checkAll: false,
      indeterminate: false,
      defaultProps: {
        children: 'users',
        label: 'name'
      }
    }
  },
  components: {},
  computed: {},
  watch: {},
  activated() {
    this.startTimeOption = {
      disabledDate(date) {
        return date && date.valueOf() < Date.now() - 86400000
      }
    }
    this.endTimeOption = {}
    this.getAllRoom()
    this.getAllPaper()
    this.initFormData()
    this.getUserOrDept()
  },
  methods: {
    // 切换是否限时
    handleIsLimitTime() {
      if (this.formData.isLimitTime) {
        this.formData.testDuration = ''
        this.formData.examDate = []
      }
    },
    // 全选
    handleCheckAllChange(item, type, index) {
      this.userListData = item.users
      this.indeterminate = false
      this.checkAll = !this.checkAll
      if (this.checkAll) {
        this.$nextTick(() => {
          this.userData = this.userListData.map(item => item.id)
        })
      } else {
        this.userData = []
      }
    },
    // 选择用户
    checkAllGroupChange(data, checkedData) {
      this.userData = []
      checkedData.checkedNodes.forEach(item => {
        if (!item.users) {
          this.userData.push(item.id)
        }
      })
      // let arr = this.userListData.map(item => item.id)
      // this.indeterminate = arr.length != this.userData.length
      // if(arr.length == this.userData.length) {
      //   this.checkAll = true
      // }
    },
    // 点击部门
    deptClick(item, index) {
      if (item.deptId == this.selectedFlag) {
        this.selectedFlag = 0
        return
      }
      this.selectedFlag = item.deptId
      this.userListData = item.users
    },
    changeDate(val) {},
    // 获取自己以及下级部门
    getUserOrDept() {
      getAssessmentManagementDept().then(res => {
        res.data.data.forEach((item, index) => {
          this.personList = res.data.data
          this.personList[index].name = item.deptName
          this.personList[index].id = item.deptId
        })
      })
    },
    getUserLabel(value) {
      let label = ''
      this.personList.map(item => {
        item.users.forEach(ele => {
          if (value == ele.id) {
            label = ele.name
          }
        })
      })
      return label
    },
    // 删除已选的用户
    delCheckList(val) {
      this.personList.forEach((item, index) => {
        item.users.forEach((ele, i) => {
          if (ele.id == val) {
            this.userData.splice(i, 1)
            this.$refs.tree.setCheckedKeys(this.userData)
          }
        })
      })
    },
    // 全部删除已选的用户
    delCheckListAll() {
      this.userData = []
      this.$refs.tree.setCheckedKeys(this.userData)
      // this.checkAll = false
    },
    // 确认选择的用户
    surePerson() {
      this.formData.taskUserArray = this.userData
    },
    // 关闭
    cancelPerson() {
      this.userData = []
      this.$refs.tree.setCheckedKeys(this.userData)
    },
    // 打开部门弹窗
    addPerson() {
      this.addPersonDialog = true
      this.$refs.tree.setCheckedKeys(this.formData.taskUserArray)
      this.userData = this.formData.taskUserArray
      this.getUserOrDept()
    },
    // 获取所有试卷
    getAllPaper() {
      this.paperList = []
      initAllPaper()
        .then(res => {
          if (res.data.status) {
            if (res.data.data) {
              this.paperList = res.data.data
            }
          }
        })
        .catch(() => {})
    },
    // 获取所有考场
    getAllRoom() {
      this.roomArray = []
      initAllRoom()
        .then(res => {
          if (res.data.status) {
            if (res.data.data) {
              this.roomArray = res.data.data
            }
          }
        })
        .catch(() => {})
    },
    // 根据id 获取详情
    initFormData() {
      this.handleResetSub() // 重置表单
      this.formData.examDate = []
      let params = {
        id: this.detailsId
      }
      this.$nextTick(() => {
        this.formData = FormDataInfo()
        if (this.isOperate) {
          initAssessmentManagementDetailsById(params)
            .then(res => {
              if (res.data.status) {
                const data = res.data.assessmentManagementDO
                if (data == null) {
                  this.$Message.error('未查询到相关信息')
                  this.handleCancleModel()
                  return
                }
                this.formData.id = data.id
                this.formData.startTime = data.startTime
                var startTime = new Date(this.formData.startTime).valueOf()
                this.startTimeOld = startTime
                this.endTimeOption = {
                  disabledDate(date) {
                    return date && date.valueOf() <= startTime
                  }
                }
                this.formData.endTime = data.endTime
                var endTime = new Date(this.formData.endTime).valueOf()

                // this.startTimeOption = {
                //   disabledDate(date) {
                //     return date && date.valueOf() > endTime
                //   }
                // }
                this.formData.examinationName = data.examinationName
                  ? data.examinationName
                  : null
                let userIdArray = []
                if (this.isSee) {
                  this.personArray = []
                }
                data.assessmentManagementSubDOS.forEach(item => {
                  if (this.isSee) {
                    this.personArray.push({
                      id: item.userId,
                      name: item.userName
                    })
                  }
                  userIdArray.push(item.userId)
                  this.userListData.push({
                    id: item.userId,
                    name: item.userName
                  })
                })
                this.formData.taskUserArray = userIdArray
                this.userData = userIdArray
                if (userIdArray.length === this.personList.length) {
                  this.checkAll = true
                  this.indeterminate = false
                } else {
                  this.indeterminate = true
                  this.checkAll = false
                }
                this.paperList.forEach(item => {
                  if (item.id === this.formData.paperId) {
                    this.paperTime = item.paperTime
                  }
                })
                this.formData.type = data.type
                this.formData.paperId = data.paperId
                this.formData.paperName = data.paperName
                this.formData.paperNo = String(data.paperNo)
                this.formData.paperType = String(data.paperType)
                this.formData.examinationDept = data.examinationDept
                this.formData.examinationDeptName = data.examinationDeptName
                this.formData.examinationRoomName = data.examinationRoomName
                this.formData.examinationId = data.examinationId
                this.formData.testDuration = data.testDuration
                  ? data.testDuration
                  : null
                this.formData.remark = data.remark
                this.formData.score = data.score
                this.formData.passScore = data.passScore ? data.passScore : null
                this.formData.isAuth = data.isAuth == 1
                this.formData.isLimitTime = data.isLimitTime == 1
                if (this.formData.isLimitTime) {
                  this.formData.examinationTime.push(new Date(data.startTime))
                  this.formData.examinationTime.push(new Date(data.endTime))
                  this.formData.testDuration = ''
                } else {
                  this.formData.examDate.push(new Date(data.startTime))
                  this.formData.examDate.push(new Date(data.endTime))
                }
                // this.formData.examDate = new Date(data.startTime)+ new Date(data.endTime)
                // this.formData.examinationTime[0] = new Date(data.startTime)
                // this.formData.examinationTime[1] = new Date(data.endTime)
                this.getAllUserFromDeptId(data.examinationDept, false)

                // setTimeout(() => {
                //   let userIdArray = []
                //   if (this.isSee) {
                //     this.personArray = []
                //   }
                //   data.assessmentManagementSubDOS.forEach(item => {
                //     if (this.isSee) {
                //       this.personArray.push({
                //         id: item.userId,
                //         name: item.userName
                //       })
                //     }
                //     userIdArray.push(item.userId)
                //   })
                //   this.formData.taskUserArray = userIdArray
                //   if (userIdArray.length === this.personArray.length) {
                //     this.checked = true
                //   } else {
                //     this.checked = false
                //   }
                //   this.paperList.forEach(item => {
                //     if (item.id === this.formData.paperId) {
                //       this.paperTime = item.paperTime
                //     }
                //   })
                // }, 50)
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
      let startTime = null
      let endTime = null
      if (this.formData.isLimitTime) {
        startTime = this.$moment(this.formData.examinationTime[0]).format(
          'YYYY-MM-DD HH:mm:ss'
        )
        endTime = this.$moment(this.formData.examinationTime[1]).format(
          'YYYY-MM-DD HH:mm:ss'
        )
      } else {
        startTime = this.$moment(this.formData.examDate[0]).format(
          'YYYY-MM-DD 00:00:00'
        )
        endTime = this.$moment(this.formData.examDate[1]).format(
          'YYYY-MM-DD 23:59:59'
        )
      }
      if (this.isOperate) {
        var startDate = this.startTimeOld - 5 * 60 * 1000
        if (startDate < Date.now()) {
          this.$Spin.hide()
          this.$Message.error('考试即将或已经开始，无法修改信息！')
          setTimeout(() => {
            this.handleCancleModel()
          }, 200)
          return
        }
      }
      let params = Object.assign(
        { ...this.formData },
        {
          isOperate: this.isOperate
        }
      )
      if (this.formData.isAuth) {
        params['isAuth'] = 1
      } else {
        params['isAuth'] = 0
      }
      if (this.formData.isLimitTime) {
        params['isLimitTime'] = 1
      } else {
        params['isLimitTime'] = 0
      }
      Object.keys(this.formData).forEach((item, index) => {
        if (!params[item]) {
          if (this.formData[item]) {
            params[item] = ((this.formData[item] || null) + '').trim()
          }
        }
      })
      // var startTime = this.$moment(this.formData.startTime).format(
      //   'YYYY-MM-DD HH:mm:ss'
      // )
      // var endTime = this.$moment(this.formData.endTime).format(
      //   'YYYY-MM-DD HH:mm:ss'
      // )
      params['startTime'] = startTime
      params['endTime'] = endTime
      var assessmentManagementSubDOS = []
      this.formData.taskUserArray.forEach(item => {
        assessmentManagementSubDOS.push({
          groupId: this.formData.examinationDept,
          userId: item
        })
      })
      params['assessmentManagementSubDOS'] = assessmentManagementSubDOS
      operateAssessmentManagementInfo(params)
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
    // 取消创建
    handleCancleModelSub() {
      this.personList = []
      this.userData = []
      this.handleCancleModel()
    },
    handleResetSub() {
      this.handleReset()
    },
    // 人员选择
    cleanUsear() {
      if (this.formData.taskUserArray.length === this.personArray.length) {
        this.checked = true
      } else {
        this.checked = false
      }
    },
    // 开始时间选择
    startTimeChange(e) {
      if (e) {
        this.endTimeOption = {
          disabledDate(date) {
            // 设置结束日期 可以选择开始日期当天的日期
            let startTime = ''
            // 获取当前e对应的日期 xxxx/xx/xx
            let curD = new Date(e).toLocaleDateString()
            // 判断 选择日期e的毫秒数与00:00时的毫秒数比较大小，增加这个判断是因为开始选择的时分是00:00时，结束日期的不可选日期多了当前日期前面的一天
            // 可以把这个判断去掉试一下直接：
            if (new Date(curD).valueOf() < new Date(e).valueOf()) {
              // 86400000 = 1 * 24 * 60 * 60 * 1000 是一天(24小时)的毫秒数
              startTime = e ? new Date(e).valueOf() - 86400000 : ''
            } else {
              startTime = e ? new Date(e).valueOf() : ''
            }
            return date && date.valueOf() < startTime
            // return date && date.valueOf() < dateNow
          }
        }
        if (this.paperTime > -1) {
          this.formData.endTime = new Date(
            this.formData.startTime.valueOf() + this.paperTime * 60 * 1000
          )
        }
      } else {
        this.endTimeOption = {}
      }
    },
    // 结束时间选择
    endTimeChange(e) {
      // if (e) {
      //   var dateNow = this.formData.endTime
      //   this.startTimeOption = {
      //     disabledDate(date) {
      //       return date && date.valueOf() > dateNow
      //     }
      //   }
      // } else {
      //   this.startTimeOption = {}
      // }
    },
    // 试卷选择
    paperChange(val) {
      this.formData.paperNo = null
      this.formData.paperName = null
      this.formData.paperType = null
      this.paperTime = -1
      if (val) {
        this.paperList.forEach(item => {
          if (item.id === val) {
            this.paperTime = item.paperTime
            this.formData.paperName = item.paperName
            this.formData.paperNo = String(item.paperNo)
            this.formData.paperType = String(item.paperType)
            this.formData.score = item.score
            if (this.formData.startTime) {
              this.formData.endTime = new Date(
                this.formData.startTime.valueOf() + this.paperTime * 60 * 1000
              )
            }
          }
        })
      }
    }, // 获取人员列表
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
    // 人员全部选择
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
    roomChange(val) {
      this.formData.examinationDept = null
      this.formData.examinationDeptName = null
      this.formData.examinationRoomName = null
      this.taskUserArray = []
      this.checked = false
      if (val) {
        this.roomArray.forEach(item => {
          if (item.id === val) {
            this.formData.examinationDept = item.deptId
            this.formData.examinationDeptName = item.deptName
            this.formData.examinationRoomName = item.name
            // this.getAllUserFromDeptId(item.deptId, true)
          }
        })
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

.add_icon {
  width: 40px;
  height: 40px;
  float: left;
  margin-left: 8px;
  margin-bottom: 8px;
  background-color: #ebeced;
  border-radius: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
}

.li-active {
  background: #f4f4f4;
}

.addPersonDialog_content {
  display: flex;
  border: 1px solid #eee;
}

.addPersonDialog_left {
  flex: 1;
  border-right: 1px solid #eee;

  ul {
    li {
      list-style: none;

      .deptTitle {
        align-items: center;
        justify-content: space-between;
        display: flex;
        padding: 10px;
      }
    }
  }
}

.user_list {
  padding-left: 15px;
  //padding-bottom: 16px;
}

.addPersonDialog_right {
  flex: 1;
  padding: 10px;

  .addPersonDialog_right_title {
    display: flex;
    justify-content: space-between;

    .delAll {
      color: #ff3939;
      cursor: pointer;
    }
  }

  .del_list {
    list-style: none;
    background-color: #f4f4f4;
    padding: 5px 10px;
    margin: 8px 0;
    display: flex;
    justify-content: space-between;
    align-items: center;

    .del_size {
      font-size: 24px;
      cursor: pointer;
    }
  }
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
  border: 1px solid #e4e4e4;
  text-align: center;
  font-size: 12px;
  line-height: 40px;
}

.arrow {
  margin-right: 10px;
  width: 6px;
  height: 6px;
  border-right: 2px solid #000;
  border-bottom: 2px solid #000;
  transform: rotate(45deg);
}

.arrow_click {
  margin-right: 10px;
  width: 6px;
  height: 6px;
  border-right: 2px solid #000;
  border-bottom: 2px solid #000;
  transform: rotate(225deg);
}

.select_dept {
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
}

.select_dept_name {
  span {
    padding: 6px 10px;
    background-color: #eeeeee;
    margin-left: 8px;
  }
}
</style>
