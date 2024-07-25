<!--
 * @description planyear- 计划-年计划表--新增/编辑查看/界面
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
                <Option value="1">年计划</Option>
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
            <FormItem label="计划期限" label-position="top" prop="timeLimit">
              <DatePicker
                type="year"
                style="width: 100%"
                :clearable="false"
                :confirm="true"
                :disabled="isSee"
                placeholder="请选择计划期限"
                v-model="formData.timeLimit"
                :options="startTimelimit"
              >
              </DatePicker>
            </FormItem>
          </Col>
          <Col span="12">
            <FormItem label="计划单位" label-position="top" prop="deptId">
              <!-- <Cascader
                :data="deptList"
                v-model="formData.deptIds"
                placeholder="请选择计划单位"

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
              <!-- <Input
                type="text"
                v-model.trim="formData.personType"
                placeholder="请输入人员类型"
                ref="personType"
                :disabled="isSee"
                :maxlength="10"
              /> -->
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
              <span slot="suffix" style="height: 32px;line-height:32px;width:40px;"
                  >{{timeUnit}}</span
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
import {
  operatePlanyearInfo,
  initPlanyearDetailsById,
  initPlanyearGetTime
} from '@/api/trainPlan/api-modules-planyear'
import { OPERATE_PAGE } from '@/libs/mixin'
import FormDataInfo from './form'
import RulesValidate from './form-validate'
export default {
  mixins: [OPERATE_PAGE],
  data() {
    return {
      subjectArray: [], // 选择培训课目
      startTimelimit: null, // 计划期限
      personArray: [], // 人员类型
      deptList: [], // 计划单位
      deptIds: [],
      deptId: '',
      deptNameSub: '',
      totalTimeHour: '',
      timeUnit: '',
      totalTimeWeekHour: null,
      showDrawer: false,
      formData: FormDataInfo(),
      formValidate: RulesValidate(this)
    }
  },
  computed: {},
  activated() {
    this.formData.type = '1'
    this.totalTimeWeekHour = null
    this.initSubjectList()
    this.initRoleList()
    this.initFormData()
    // this.formData.deptName = this.deptNameSub
    // console.log(this.deptNameSub)
    // console.log(this.formData.deptName)
  },
  methods: {
    // 获取所有部门
    initRoleList() {
      initAllRoleList()
        .then(res => {
          if (res.status) {
            this.roleList = sortByKey(res.data.data, 'orderNum')
          }
        })
        .catch(() => {})
      var user = this.$cookie.get(
        this.CONST_VALUE.LOGIN_USER_INFO
      )
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
    // 根据id 获取详情
    initFormData() {
      this.handleReset() // 重置表单
      let params = {
        id: this.detailsId
      }
      this.$nextTick(() => {
        this.formData = FormDataInfo()
        // console.log(this.formData)
        this.formData.type = '1'
        if (this.isOperate) {
          initPlanyearDetailsById(params)
            .then(res => {
              if (res.data.status) {
                const data = res.data.planYearDO
                if (data == null) {
                  this.$Message.error('未查询到相关信息')
                  this.handleCancleModel()
                  return
                }
                // this.formData = res.data.planYearDO
                this.formData.id = data.id
                this.formData.name = data.name
                this.formData.personType = data.personType
                this.formData.timeLimit = data.timeLimit
                this.formData.target = data.target

                this.formData.deptId = data.deptId
                this.deptIds = data.deptIds
                this.formData.deptName = res.data.planYearDO.deptName

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
    // 选中课目计算时长
    getTotalTime(val) {
      let params = {
        subjectId: val
      }
      // console.log(params)
      // 如果params为空，则不调用接口
      // eslint-disable-next-line eqeqeq
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
            if (this.totalTimeHour > 3600) {
              let totalTimeBr = this.totalTimeHour / 3600
              let totalTimeHourStr = totalTimeBr.toFixed(1)
              this.formData.totalTime = totalTimeHourStr
              this.timeUnit = '小时'
            } else {
              let totalTimeBr = this.totalTimeHour / 60
              let totalTimeHourStr = totalTimeBr.toFixed(1)
              this.formData.totalTime = totalTimeHourStr
              this.timeUnit = '分钟'
            }
          }
        })
        .catch(() => {})
    },
    // 保存信息 （添加和编辑）
    handleSubmit() {
      let params = Object.assign(
        { ...this.formData },
        {
          isOperate: this.isOperate,
          timeLimit: this.$moment(this.formData.timeLimit).format('YYYY'),
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
      operatePlanyearInfo(params)
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
