<template>
  <Drawer
    v-model="showDrawer"
    width="100%"
    :mask-closable="false"
    :transfer="false"
    :inner="true"
  >
    <div class="details-container">
      <div class="details-title">
        <p>
          {{ '生成计划' }}
        </p>
        <Icon type="md-close" @click.stop="handleCancleModelSub()" />
      </div>
      <div class="details-content">
        <Form :model="formData" ref="formValidate" :rules="formValidate">
          <Row :gutter="32">
            <Col span="12">
              <FormItem label="计划年份" label-position="top" prop="planMonth">
                <DatePicker
                  type="year"
                  style="width: 100%"
                  :clearable="false"
                  :confirm="true"
                  :disabled="isSee"
                  placeholder="请选择计划年份"
                  v-model="formData.planMonth"
                  :options="TimelimitMonth"
                  @on-change="getPlan"
                >
                </DatePicker>
              </FormItem>
            </Col>
            <Col span="12">
              <FormItem label="计划名称" label-position="top" prop="name">
               <Select
                v-model="formData.name"
                name="select"
                ref="name"
                filterable
                remote
                :clearable="true"
                placeholder="请选择计划名称"
                :disabled="isSee || !formData.planMonth"
                @on-change="getTimeLimit"
              >
                <Option
                  v-for="(item,index) in fromList"
                  :value="item.id"
                  :key="index"
                  :label="item.name"
                ></Option>
                </Select>
              </FormItem>
            </Col>
            <Col span="12">
              <FormItem label="计划单位" label-position="top" prop="deptId">
                <Cascader
                  :data="deptList"
                  v-model="formData.deptIds"
                  placeholder="请选择计划单位"
                  disabled
                  @on-change="selDept"
                  style="width: 100%"
                  :clearable="true"
                  change-on-select
                ></Cascader>
              </FormItem>
            </Col>
            <Col span="12">
              <FormItem label="人员类型" label-position="top" prop="personType">
                <Select
                  v-model="formData.personType"
                  ref="personType"
                  disabled
                  name="select"
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
        </Form>
        <Tables
          ref="tables"
          v-if="tableColumnPugins != null"
          :isTable="true"
          v-model="listData"
          :loading="loading"
          :border="true"
          :columnControl="true"
          :columns="tableColumnPugins"
        >
          <!-- <page-wrapper
            slot="footer"
            :total="totolCount"
            :pageSize="searchParams.limit"
            :pageNo="searchParams.current"
            @page-change="pageChange"
            @page-size-change="pageSizeChange"
          ></page-wrapper> -->
        </Tables>
        <div class="demo-drawer-footer" style="text-align: center">
          <Button type="primary" @click="handleValidate" v-if="!isSee"
            >确认{{ !isOperate ? '新增' : '编辑' }}</Button
          >
          <Button
            type="default"
            class="mar-lft-10"
            @click.stop="handleCancleModelSub()"
            >取消操作</Button
          >
        </div>
      </div>
      <br />
    </div>
  </Drawer>
</template>
<script>
import { initAllDeptList } from '@/api/sys/api-modules-dept'
import { initAllRoleList } from '@/api/sys/api-modules-role'
import { sortByKey, treeDataTranslate } from '@/utils'
import {
  initPlanmonthSaveBatch,
  initPlanmonthCreatePlan,
  initPlanmonthGetPlanByYear
} from '@/api/trainPlan/api-modules-planmonth'
import { OPERATE_PAGE, OPERATE_LIST } from '@/libs/mixin'
import FormDataInfo from './form'
import RulesValidate from './form-validate'
import ColumnPugins from './index-column'
export default {
  mixins: [OPERATE_PAGE, OPERATE_LIST],
  data() {
    return {
      personArray: [], // 人员类型
      deptList: [], // 计划单位
      deptIds: [],
      showDrawer: false,
      formData: FormDataInfo(),
      formValidate: RulesValidate(this),
      listData: [],
      TimelimitMonth: null,
      loading: false,
      tableColumnPugins: ColumnPugins(this),
      searchParams: {
        // 查询参数
        limit: 10, // 每页数量
        current: 1 // 当前页数
      },
      fromList: [],
      tableList: [],
      totolCount: 0,
      pageSize: 12,
      pageNo: 1
    }
  },
  mounted() {

    // this.tableColumnPugins = ColumnPugins(this)
  },
  methods: {
    initFormData() {
      this.$nextTick(() => {
        this.initRoleList()
      })
    },
    getPlan() {
      this.tableList = []
      this.fromList = []
      if (!this.formData.planMonth) {
        return
      }
      var year = this.$moment(this.formData.planMonth).format('YYYY')
      let params = {
        year: year
      }
      initPlanmonthGetPlanByYear(params)
        .then(res => {
          if (res.data) {
            var planData = res.data.data
            planData.forEach(item => {
              this.fromList.push({
                ...item,
                value: item.id,
                label: item.name
              })
            })
          }
        })
    },
    getTimeLimit() {
      this.listData = []
      if (!this.formData.name) {
        return
      }
      let params = {
        planId: this.formData.name
      }
      this.loading = true
      initPlanmonthCreatePlan(params)
        .then(res => {
          if (res.data.status) {
            this.loading = false
            var data = res.data.data
            this.listData = data
            this.tableList = this.listData
            this.formData.deptId = this.listData[0].deptId
            this.formData.deptIds = this.listData[0].deptIds
            this.formData.personType = this.listData[0].personType
            this.$nextTick(() => {
            })
          } else {
            this.listData = []
          }
        })
        .catch(() => {
          this.loading = false
        })
    },
    initRoleList() {
      initAllRoleList()
        .then(res => {
          if (res.status) {
            this.roleList = sortByKey(res.data.data, 'orderNum')
          }
        })
        .catch(() => {})
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
          } else {
          }
        })
        .catch(() => {
          this.loading = false
        })
    },
    // 保存信息 （添加和编辑）
    handleSubmit() {
      var tableListSub = this.tableList
      for(let i = 0; i < tableListSub.length; i++) {
        this.$set(tableListSub[i], 'type', '1')
      }
      initPlanmonthSaveBatch(tableListSub)
        .then(({ data }) => {
          this.$Spin.hide()
          if (data.status) {
            this.$Message.success('成功保存信息')
            this.handleCancleModel()
            this.$nextTick(() => {
              this.$emit('operateSuccess', tableListSub)
            })
          } else {
            // this.$Message.error('保存信息时系统异常')
          }
        })
        .catch(() => {})
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
    // 打开弹框并初始化
    handleOpenModel() {
      this.showDrawer = true
      setTimeout(() => {
        this.loading = false
        this.formData = FormDataInfo()
        this.initFormData()
      }, 500)
    },
    handleCancleModelSub() {
      //   this.$refs.uploadBanner.clearFiles()
      this.handleCancleModel()
      this.listData = []
    },
    handleCancleModel() {
      this.showDrawer = false
      this.handleReset()
      this.listData = []
    }
  }
}
</script>
<style lang="less" scoped>
/deep/ .details-container {
  top: 0px;
  height: 96% !important;
}
</style>
