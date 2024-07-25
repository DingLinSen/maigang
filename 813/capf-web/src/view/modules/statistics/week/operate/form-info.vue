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
            <FormItem label="训练部门" label-position="top" prop="deptName">
              <Input
                type="text"
                v-model.trim="formData.deptName"
                placeholder="请输入训练部门"
                ref="deptName"
                disabled
                :maxlength="40"
              />
            </FormItem>
          </Col>
          <Col span="12">
            <FormItem label="参训人员" label-position="top" prop="userIds">
              <Select
                v-model="formData.userIds"
                multiple
                ref="userIds"
                :disabled="isSee || isOperate"
                name="select"
                filterable
                :clearable="false"
                placeholder="请选择参训人员"
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
            <FormItem label="课目名称" label-position="top" prop="subjectIds">
              <Select
                v-model="formData.subjectIds"
                ref="subjectId"
                :disabled="isSee"
                name="select"
                filterable
                multiple
                :clearable="false"
                placeholder="请选择课目名称"
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
            <FormItem label="训练时间" label-position="top" prop="dateArray">
              <DatePicker
                v-model="formData.dateArray"
                format="yyyy-MM-dd"
                type="daterange"
                :disabled="isSee"
                placement="bottom-start"
                placeholder="选择训练时间"
                style="width: 100%"
                :options="startTimeOption"
              ></DatePicker>
            </FormItem>
          </Col>
          <Col span="12">
            <FormItem
              label="训练次数（专业技术）"
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
          <Col span="12">
            <FormItem
              label="训练时长（理论知识）"
              label-position="top"
              prop="trainTime"
            >
              <Input
                type="text"
                v-model.trim="formData.trainTime"
                placeholder="请输入训练时长"
                ref="trainTime"
                :disabled="isSee"
                :maxlength="10"
              >
                <span
                  slot="suffix"
                  style="height: 32px;line-height:32px;width:40px;"
                  >小时</span
                >
              </Input>
            </FormItem>
          </Col>
          <Col span="12">
            <FormItem label="考核成绩" label-position="top" prop="score">
              <Input
                type="text"
                v-model.trim="formData.score"
                placeholder="请输入考核成绩"
                ref="score"
                :disabled="isSee"
                :maxlength="10"
              >
                <span
                  slot="suffix"
                  style="height: 32px;line-height:32px;width:40px;"
                  >分</span
                >
              </Input>
            </FormItem>
          </Col>
          <Col span="12">
            <FormItem label="训练效果" label-position="top">
              <Input
                type="text"
                v-model.trim="formData.effect"
                placeholder="请输入训练效果"
                ref="effect"
                :disabled="isSee"
                :maxlength="100"
              >
              </Input>
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
import { initUserByDeptId } from '@/api/tasks/api-modules-tasktrain'
import {
  initRecordWeekDetailsById,
  operateRecordWeekInfo,
  initAllSubjectData
} from '@/api/statistics/week/api-modules-week'
import { initAllDeptList } from '@/api/sys/api-modules-dept'
import { OPERATE_PAGE } from '@/libs/mixin'
import { sortByKey, treeDataTranslate } from '@/utils'
import FormDataInfo from './form'
import RulesValidate from './form-validate'
export default {
  mixins: [OPERATE_PAGE],
  data() {
    return {
      subjectArray: [], // 选择培训课目
      personArray: [], // 人员类型
      checked: false,
      startTimeOption: null,
      formData: FormDataInfo(),
      formValidate: RulesValidate(this)
    }
  },
  computed: {},
  activated() {
    this.startTimeOption = {
      disabledDate(date) {
        return date && date.valueOf() > Date.now()
      }
    }
    this.checked = false
    this.subjectArray = []
    this.personArray = []
    this.getDeptInfo()
    this.initSubjectList()
    this.initFormData()
  },
  methods: {
    getDeptInfo() {
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
            this.formData.deptId = this.deptList[0].deptId
              ? this.deptList[0].deptId
              : ''
            this.formData.deptName = this.deptList[0].deptName
              ? this.deptList[0].deptName
              : ''
            this.getAllUserFromDeptId(this.formData.deptId, true)
          } else {
          }
        })
        .catch(() => {
          this.loading = false
        })
    },
    // 获取所有课目
    initSubjectList() {
      if (!this.isSee) {
        this.$nextTick(() => {
          this.subjectArray = []
          initAllSubjectData()
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
        // console.log(this.formData)
        if (this.isOperate) {
          initRecordWeekDetailsById(params)
            .then(res => {
              if (res.data.status) {
                const data = res.data.recordWeekDO
                if (data == null) {
                  this.$Message.error('未查询到相关信息')
                  this.handleCancleModel()
                  return
                }
                this.formData.id = data.id ? data.id : ''
                this.formData.trainFrequency = data.trainFrequency
                  ? String(data.trainFrequency)
                  : ''
                if (data.trainTime || String(data.trainTime) === '0') {
                  let totalTimeBr = data.trainTime / 3600
                  let totalTimeBr2 = Math.round(totalTimeBr * 10) / 10
                  this.formData.trainTime = String(totalTimeBr2)
                } else {
                  this.formData.trainTime = ''
                }

                this.formData.score = data.score ? String(data.score) : ''
                this.formData.effect = data.effect ? String(data.effect) : ''
                // console.log(data.deptIds)
                this.formData.deptId = data.deptId
                var dateArraySub = []
                dateArraySub.push(this.$moment(data.taskTimeStart).toDate())
                dateArraySub.push(this.$moment(data.taskTimeEnd).toDate())
                this.formData.dateArray = dateArraySub
                if (this.isSee) {
                  this.personArray = []
                  this.personArray.push({
                    id: data.userId,
                    name: data.userName
                  })
                }
                let userIdArray = []
                userIdArray.push(data.userId)
                this.formData.userIds = userIdArray
                let subjectIds = []
                data.recordSubjectDOS.forEach(item => {
                  if (this.isSee) {
                    this.subjectArray.push({
                      id: item.subjectId,
                      name: item.subjectName
                    })
                  }
                  subjectIds.push(item.subjectId)
                })
                this.formData.subjectIds = subjectIds
                if (!this.isSee) {
                  this.initSubjectList(this.formData.subjectType)
                }
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
      // console.log(this.totalTimeHour)
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
      if (this.formData.subjectIds) {
        this.formData.subjectIds.forEach(item => {
          subjectArray.push({
            subjectId: item
          })
        })
      }
      params['trainTime'] = this.formData.trainTime
        ? parseFloat(this.formData.trainTime) * 3600
        : ''
      params['deptId'] = this.formData.deptId
      params['deptName'] = this.formData.deptName
      params['recordSubjectDOS'] = subjectArray
      params['taskTimeStart'] = this.formData.dateArray[0]
        ? this.$moment(this.formData.dateArray[0]).format('YYYY-MM-DD')
        : null
      params['taskTimeEnd'] = this.formData.dateArray[1]
        ? this.$moment(this.formData.dateArray[1]).format('YYYY-MM-DD')
        : null
      if (this.isOperate) {
        params['userId'] = this.formData.userIds[
          this.formData.userIds.length - 1
        ]
      }
      // console.log(params)
      operateRecordWeekInfo(params)
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
              if (!this.isSee && isClean && !this.isOperate) {
                this.formData.userIds = []
              }
              if (this.formData.userIds.length === this.personArray.length) {
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
          this.formData.userIds = []
          if (this.checked) {
            this.personArray.forEach(temp => {
              this.formData.userIds.push(temp.id)
            })
          }
          this.$refs.userIds.visible = false
          this.$forceUpdate()
        })
      }, 0)
    },
    cleanUsear() {
      if (this.formData.userIds.length === this.personArray.length) {
        this.checked = true
      } else {
        this.checked = false
      }
    },
    getSingleSubject(val) {
      // this.formData.subjectId = []
      // this.formData.subjectId.push(val)
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
