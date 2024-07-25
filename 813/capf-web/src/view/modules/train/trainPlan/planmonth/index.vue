<!--
 * @description planmonth- ${comments}--index
 * @author yxm
 * @date 2022-04-07
 * -->
<template lang="html">
  <container class="full-container">
    <div slot="content">
      <Tables
        ref="tables"
        v-if="tableColumnPugins != null"
        searchable
        search-place="top"
        :isTable="true"
        v-model="listData"
        :exportPath="exportUrl"
        :exportParams="loadExportParams()"
        :border="true"
        :columnControl="true"
        :loading="loading"
        :columns="tableColumnPugins"
        :canSearch="canSearch"
        :canReset="canReset"
        :canSave="canSave"
        :canExport="canExport"
        :canDelete="canDelete"
        @on-sort-change="onSortChange"
        @btnInsert="createDrawerChange"
        @btnUpdate="updateDrawerChange"
        @btnDelete="btnDeleteBallast"
        @btnSearch="reloadList"
        @handleReset="handleResearch"
        @on-selection-change="selectChange"
      >
        <div slot="search" class="search-info">
          <div class="search-box">
            <span class="search-tip" style="min-width: 70px">计划状态：</span>
            <Select
              filterable
              :clearable="true"
              v-model="searchParams.status"
              placeholder="选择状态查询"
              ref="selectRef"
            >
              <Option value="1" label="待发布"></Option>
              <Option value="2" label="待审核"></Option>
              <Option value="3" label="已审核"></Option>
              <Option value="5" label="已驳回"></Option>
            </Select>
          </div>
          <div class="search-box">
            <span class="search-tip" style="min-width: 70px">计划名称：</span>
            <Input
              type="text"
              v-model="searchParams.name"
              placeholder="输入名称查询"
              :clearable="true"
              :maxlength="40"
              ref="name"
            />
          </div>
        </div>
        <div slot="btn-right">
          <Button
            type="primary"
            class="search-btn"
            @click="generatePlanSucess()"
            style="margin-left:15px"
            >生成计划</Button
          >
        </div>
        <page-wrapper
          slot="footer"
          :total="totolCount"
          :pageSize="searchParams.limit"
          :pageNo="searchParams.current"
          @page-change="pageChange"
          @page-size-change="pageSizeChange"
        ></page-wrapper>
      </Tables>

      <!-- 删除弹框 -->
      <Modal
        v-model="deleteModel"
        :title="this.$store.state.base.deleteInfo.title"
        @on-ok="handleDelete"
        :mask-closable="false"
      >
        <p>{{ this.$store.state.base.deleteInfo.msg }}</p>
      </Modal>
      <!-- 启用弹框 -->
      <Modal
        v-model="statusOpenModel"
        :title="this.$store.state.base.openStatusInfo.title"
        @on-ok="handleOpen1"
        :mask-closable="false"
      >
        <p>{{ this.$store.state.base.openStatusInfo.msg }}</p>
      </Modal>
      <!-- 禁用弹框 -->
      <Modal
        v-model="statusStopModel"
        :title="this.$store.state.base.stopStatusInfo.title"
        @on-ok="handleStop1"
        :mask-closable="false"
      >
        <p>{{ this.$store.state.base.stopStatusInfo.msg }}</p>
      </Modal>
      <!-- 撤回弹窗 -->
      <Modal
        v-model="backModel"
        title="确认撤回该计划"
        @on-ok="sucessBack"
        :mask-closable="false"
      >
        <p>确认撤回该计划吗？</p>
      </Modal>
      <!-- 确认发布弹窗 -->
      <Modal
        v-model="publishModel"
        title="确认发布该计划"
        @on-ok="handlePublishSucess"
        :mask-closable="false"
      >
        <p>确认发布该计划吗？</p>
      </Modal>
      <!-- 确认审核 -->
      <Modal v-model="auditModel" title="计划审核" :mask-closable="false">
        <p>确定通过该计划吗？</p>
        <div slot="footer">
          <Button type="error" @click="AuditBack">驳回</Button>
          <Button type="primary" @click="handleAuditSucess">通过</Button>
        </div>
      </Modal>
      <!-- 驳回弹框 -->
      <Modal v-model="reasonModel" title="请输入驳回原因">
        <div>
          <Form ref="formValidate" :model="formData" :rules="formValidate">
            <FormItem label="驳回原因" prop="reason">
              <Input
                type="textarea"
                :rows="6"
                v-model="formData.reason"
                placeholder="请输入驳回原因"
                maxlength="30"
                show-word-limit
              />
            </FormItem>
          </Form>
        </div>
        <div slot="footer" style="height:30px">
          <Button type="primary" @click="handleAuditBack" style="float:right"
            >确定</Button
          >
          <!-- <Button
            @click="handleReset"
            style="float:right;margin-right: 8px"
            >重置</Button
          > -->
        </div>
      </Modal>
      <!-- 撤销审核弹窗 -->
      <Modal
        v-model="revokeModel"
        title="确认撤销审核该计划"
        @on-ok="revokeSucess"
        :mask-closable="false"
      >
        <p>确认撤销审核该计划吗？</p>
      </Modal>
    </div>

    <div slot="drawer">
      <!-- <before-upload
        ref="beforeModel"
        @handle-next="openUploadModel"
        modelTitle="导入数据"
      >
      </before-upload> -->

      <transition name="center-show" mode="in-out">
        <keep-alive include="FormInfo">
          <component
            ref="formModel"
            :is="showComponent"
            :detailsId="
              chooseListData.length === 1 ? chooseListData[0].id : null
            "
            :isOperate="isOperate"
            :isPassword="isPassword"
            :isSee="isSee"
            :routerTitle="this.$route.meta.title"
            @operateSuccess="operateSuccess"
            @close="closeComponent"
            @error="error()"
          ></component>
        </keep-alive>
      </transition>
    </div>
    <div slot="drawer">
      <FormInfo0
        ref="formModel0"
        :detailsId="
          chooseListData.length === 1 ? chooseListData[0].id + '' : null
        "
        :isOperate="isOperate"
        :isSee="isSee"
        :flag="isFlag"
        @close="closeComponent"
        @operateSuccess="operateSuccess"
        @error="error()"
      ></FormInfo0>
    </div>
  </container>
</template>
<script>
import {
  initPlanmonthList,
  deletePlanmonthByIds,
  initPlanmonthPublish
} from '@/api/trainPlan/api-modules-planmonth'
import FormInfo0 from './operate/form-generatePlan.vue'
import { OPERATE_LIST } from '@/libs/mixin'
import ColumnPugins from './index-column'
import FormInfo from './operate/form-info.vue'
import RulesValidate from './form-validate'
// import BeforeUpload from './before-upload.vue'
import { supportNormal } from '@/utils'
export default {
  mixins: [OPERATE_LIST],
  components: {
    FormInfo,
    FormInfo0
    // BeforeUpload
  },
  data() {
    return {
      canSearch: this.isAuth('train:trainPlanMonth:select'), // 查询
      canReset: this.isAuth('train:trainPlanMonth:reset'), // 重置
      canSave: this.isAuth('train:trainPlanMonth:save'), // 添加
      canEdit: this.isAuth('train:trainPlanMonth:edit'), // 编辑
      canPublish: this.isAuth('train:trainPlanMonth:publish'), // 发布
      canExamine: this.isAuth('train:trainPlanMonth:examine'), // 审核
      canRevoke: this.isAuth('train:trainPlanMonth:revoke'), // 撤销
      canDelete: this.isAuth('train:trainPlanMonth:delete'), // 删除
      canBack: this.isAuth('train:trainPlanMonth:back'), // 回退
      auditModel: false, // 审核弹窗
      publishModel: false, // 发布弹窗
      revokeModel: false, // 撤销审核弹窗
      reasonModel: false, // 驳回弹窗
      backModel: false, // 撤回弹窗
      canExport: false, // 导出
      canFindByID: true, // id查询
      canImport: true, // 能否导入
      loading: false, // 加载
      exportPath: null, // 导出EXCEL地址
      downloadURL: null, // 下载地址
      uploadURL: null, // 上传地址
      exportUrl: null, // 导出地址
      uploadParams: null, // 上传参数
      statusOpenModel: false, // 状态弹框
      statusStopModel: false, // 状态弹框
      API: {}, // api对象
      searchParams: {
        // 查询参数
        limit: 10, // 每页数量
        current: 1, // 当前页数
        name: null, // 名称
        status: null // 状态
      },
      isFlag: null,
      formData: {
        reason: null
      },
      formValidate: RulesValidate(this)
    }
  },
  mounted() {
    this.tableColumnPugins = ColumnPugins(this)
    // this.searchParams = Object.assign(this.searchParams, FormDataInfo())
    this.initListData()
  },
  methods: {
    // 初始化数据表格
    initListData() {
      // const reg = /^[A-Za-z\u4e00-\u9fa5]+$/gi
      // let name = this.searchParams.name
      // if (!reg.test(name) && (name || name === 0)) {
      //   this.$Message.error('名称项请输入汉字或字母')
      //   return
      // }
      var validation = supportNormal(this.searchParams)
      if (!validation.isPass) {
        let message = validation.message
        this.$Message.error(message)
      } else {
        this.loading = true
        initPlanmonthList(this.searchParams)
          .then(res => {
            if (res.data.status) {
              this.totolCount = res.data.page.totalCount
              var data = res.data.page.list
              this.listData = data
              this.$nextTick(() => {
                this.loading = false
              })
            } else {
              this.loading = false
              this.listData = []
            }
          })
          .catch(() => {
            this.loading = false
          })
      }
    },

    // 根据参数刷新当前表格(添加是时刷新到第一页第一条；编辑、上传、删除后刷新到当前页)
    operateSuccess(formData) {
      this.chooseListData = []
      if (!formData.isOperate) {
        this.$refs.tables.handleReset()
        return
      }
      this.initListData()
    },

    // 重置条件查询
    handleResearch() {
      this.searchParams = Object.assign(this.searchParams, {
        limit: 10, // 每页数量
        current: 1, // 当前页数
        name: null, // 名称
        status: null // 状态
      })
      this.chooseListData = []
      this.initListData()
    },

    // 确认删除列表信息
    async handleDelete() {
      let ids = ''
      this.chooseListData.forEach(element => {
        ids += element.id + ','
      })
      ids = ids.substring(0, ids.lastIndexOf(','))
      let params = {
        ids: ids
      }
      deletePlanmonthByIds(params)
        .then(res => {
          if (res.data.status) {
            this.$Message.success('成功删除信息')
            if (this.listData.length - this.chooseListData.length === 0) {
              this.chooseListData = []
              this.$refs.tables.handleReset()
            } else {
              this.chooseListData = []
              this.initListData()
            }
          }
        })
        .catch(() => {})
    },

    // 上传前设定上传参数的侧滑控制
    handleBeforeUpload() {
      this.$refs.beforeModel.openModel()
    },
    // 导出报表参数
    handleExportParams() {
      let params = Object.assign(this.searchParams, {
        limit: 10, // 每页数量
        current: 1, // 当前页数
        status: null, // 状态
        name: null // 名称
      })
      return params
    },

    // 上传侧滑控制
    handleOpenUpload(formInfo) {
      this.uploadParams = {}
      this.$forceUpdate()
      this.$nextTick(() => {
        this.$refs.uploadModel.openModel()
      })
    },
    handlePublish() {
      this.publishModel = true
    },
    // 确认发布计划方法
    handlePublishSucess() {
      if (this.chooseListData.length > 0) {
        // console.log(this.chooseListData)
        // 批量判断是否已经通过审核
        this.chooseListData.forEach((item, index) => {
          // console.log(item.status)
          if (item.status !== '1' && item.status !== '5') {
            this.$Message.error('该数据已经发布,请不要重复发布')
          } else {
            this.sucessPublish()
          }
        })
      } else {
        this.$Message.error('请选择至少一条数据信息执行操作')
      }
      this.$nextTick(() => {
        this.publishModel = false
      })
    },
    sucessPublish() {
      // 修改状态接口
      let roleListStr = this.$store.state.user
        ? this.$store.state.user.roleId
        : ''
      var isManager =
        roleListStr.indexOf('fe0793017f48f79aa47568b25b3f98ea') !== -1 //支队管理员
      let params = {
        id: this.chooseListData[0].id,
        status: isManager ? '2' : '3',
        reason: ''
      }
      initPlanmonthPublish(params)
        .then(res => {
          this.publishModel = false
          if (res.data.status) {
            this.$Message.success('成功发布信息')
            if (this.listData.length - this.chooseListData.length === 0) {
              this.chooseListData = []
              this.$refs.tables.handleReset()
            } else {
              this.chooseListData = []
              this.initListData()
            }
          }
        })
        .catch(() => {})
    },
    // 打开撤回弹窗
    handleBack() {
      this.backModel = true
    },
    // 确认撤回
    sucessBack() {
      // 修改状态接口
      let params = {
        id: this.chooseListData[0].id,
        status: '1'
      }
      initPlanmonthPublish(params)
        .then(res => {
          this.revokeModel = false
          if (res.data.status) {
            this.$Message.success('成功撤回该计划')
            if (this.listData.length - this.chooseListData.length === 0) {
              this.chooseListData = []
              this.$refs.tables.handleReset()
            } else {
              this.chooseListData = []
              this.initListData()
            }
          }
        })
        .catch(() => {})
    },
    // 打开审核通过弹窗
    handleExamine() {
      this.auditModel = true
    },
    // 确认审核通过
    handleAuditSucess() {
      if (this.chooseListData.length > 0) {
        // console.log(this.chooseListData)
        // 批量判断是否已经通过审核
        this.chooseListData.forEach((item, index) => {
          // console.log(item.status)
          if (item.status === '3') {
            this.$Message.error('该数据已经审核,请不要重复审核')
          } else {
            this.sucessAudit()
          }
        })
      } else {
        this.$Message.error('请选择至少一条数据信息执行操作')
      }
      this.$nextTick(() => {
        this.auditModel = false
      })
    },
    // 确认审核通过
    sucessAudit() {
      // 修改状态接口
      let params = {
        id: this.chooseListData[0].id,
        status: '3'
      }
      initPlanmonthPublish(params)
        .then(res => {
          this.auditModel = false
          if (res.data.status) {
            this.$Message.success('该计划成功通过审核')
            if (this.listData.length - this.chooseListData.length === 0) {
              this.chooseListData = []
              this.$refs.tables.handleReset()
            } else {
              this.chooseListData = []
              this.initListData()
            }
          }
        })
        .catch(() => {})
    },
    AuditBack() {
      this.formData.reason = ''
      this.reasonModel = true
      this.auditModel = false
    },
    // 确认驳回审核
    handleAuditBack() {
      if (this.chooseListData.length > 0) {
        // console.log(this.chooseListData)
        // 批量判断是否已经通过审核
        this.chooseListData.forEach((item, index) => {
          // console.log(item.status)
          if (item.status === '5') {
            this.$Message.error('该数据已经审核,请不要重复审核')
          } else {
            this.backAudit()
          }
        })
      } else {
        this.$Message.error('请选择至少一条数据信息执行操作')
      }
    },
    // 驳回审核
    backAudit() {
      // 修改状态接口
      this.$handleValidate('formValidate', this).then(valid => {
        if (valid) {
          this.$Spin.hide()
          let params = {
            id: this.chooseListData[0].id,
            reason: this.formData.reason,
            status: '5'
          }
          initPlanmonthPublish(params)
            .then(res => {
              this.auditModel = false
              if (res.data.status) {
                this.loading = false
                this.$Message.success('该计划成功驳回')

                if (this.listData.length - this.chooseListData.length === 0) {
                  this.chooseListData = []
                  this.$refs.tables.handleReset()
                } else {
                  this.chooseListData = []
                  this.initListData()
                }
              }
              this.$nextTick(() => {
                this.reasonModel = false
                this.loading = false
              })
            })
            .catch(() => {
              this.loading = false
            })
        } else {
        }
      })
    },
    // 打开审核不通过弹窗
    handleRevoke() {
      this.revokeModel = true
    },
    // 确认撤销审核
    revokeSucess() {
      if (this.chooseListData.length > 0) {
        // console.log(this.chooseListData)
        // 批量判断是否已经通过审核
        this.chooseListData.forEach((item, index) => {
          // console.log(item.status)
          if (item.status === '1') {
            this.$Message.error('该计划已经撤销审核,请不要重复撤销')
          } else {
            this.sucessRevoke()
          }
        })
      } else {
        this.$Message.error('请选择至少一条数据信息执行操作')
      }
      this.$nextTick(() => {
        this.revokeModel = false
      })
    },
    // 确认撤销审核
    sucessRevoke() {
      // 修改状态接口
      let params = {
        id: this.chooseListData[0].id,
        status: '1'
      }
      initPlanmonthPublish(params)
        .then(res => {
          this.revokeModel = false
          if (res.data.status) {
            this.$Message.success('成功撤销审核')
            if (this.listData.length - this.chooseListData.length === 0) {
              this.chooseListData = []
              this.$refs.tables.handleReset()
            } else {
              this.chooseListData = []
              this.initListData()
            }
          }
        })
        .catch(() => {})
    },
    generatePlanSucess() {
      this.isSee = false
      this.$refs.formModel0.handleOpenModel()
    },
    pageSizeChange(pageSize) {
      // 切换每页条数时的回调，返回切换后的每页条数o
      // console.log(pageSize)
      this.searchParams.limit = pageSize
      this.$emit('page-size-change', pageSize)
      this.initListData()
    },
    pageChange(pageNo) {
      // console.log(pageNo)
      // 页码改变的回调，返回改变后的页码
      this.searchParams.current = pageNo
      this.$emit('page-change', pageNo)
      this.initListData()
    },
    // 下载参数
    loadExportParams() {},
    // 启用操作
    handleOpen1() {},
    // 停用操作
    handleStop1() {}
  }
}
</script>

<style lang="less" scoped>
/deep/ .details-container {
  left: 0px;
  width: calc(100%);
}
</style>
