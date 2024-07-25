<!--
 * @description videomanagement- 题库管理表--index
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
        v-model="listData"
        :border="true"
        :columnControl="true"
        :loading="loading"
        :columns="tableColumnPugins"
        :canSearch="canSearch"
        :canReset="canReset"
        :canSave="canSave"
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
            <span class="search-tip">课目类型：</span>
            <Select
              filterable
              :clearable="true"
              v-model="searchParams.subjectType"
              placeholder="选择课目类型查询"
              ref="selectRef"
            >
              <Option value="1" label="理论知识"></Option>
              <Option value="2" label="专业操作"></Option>
            </Select>
          </div>
          <div class="search-box">
            <span class="search-tip">试卷类型：</span>
            <Select
              filterable
              :clearable="true"
              v-model="searchParams.paperType"
              placeholder="选择试卷类型查询"
              ref="selectRef0"
            >
              <Option value="1" label="理论考核"></Option>
              <Option value="2" label="专业考核"></Option>
            </Select>
          </div>
          <div class="search-box">
            <span class="search-tip">试卷编号：</span>
            <Input
              type="text"
              v-model="searchParams.paperNo"
              placeholder="输入试卷编号查询"
              :clearable="false"
              :maxlength="20"
              ref="paperNo"
            />
          </div>
        </div>
        <div slot="btn-right">
          <Button
            type="primary"
            class="search-btn"
            ghost
            @click="handleOpenUpload()"
            v-if="canImport"
            >导入</Button
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
      >
        <p>{{ this.$store.state.base.deleteInfo.msg }}</p>
      </Modal>

      <!-- 上传 -->
      <Modal
        v-model="uploadModel"
        width="50%"
        title="导入试卷" :mask-closable="false" @on-cancel="uploadCancel"
        class="vertical-center-modal"

      >
         <div style="max-height:490px;overflow-y: auto;overflow-x: hidden;padding-left:6px;padding-right:6px;">
        <Form :model="formData" ref="formValidate" :rules="formValidate"  >
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
                <Option value="2" label="专业考核"></Option>
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
                <Option value="2" label="专业操作"></Option>
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
            <Col span="12">
            <FormItem label="上传文件:" prop="paperTitleDOS">
                </br>
                 <uploadFile
                  v-model="formData.paperTitleDOS"
                  ref="uploadBanner"
                  :showUpload="true"
                  :uploadURL="uploadURL"
                  :acceptType="['xls', 'xlsx']"
                  :fileNum="1"
                  :data="uploadParams"
                  @changeFileParams="uploadSuccess"
                  class="uploadImg"
                ></uploadFile>
                <!-- <Button type="error" long icon="md-download" class="mar-top" v-if='downloadURL !== undefined' @click="downloadTemplate()">下载模板</Button> -->
              <div class="tip">
                <span class="asterisk">*</span>
                  操作说明：请先选择<span
                    style="color: blue; cursor: pointer"
                    @click="downloadTemplate"
                    >下载模板</span
                  >，
                  根据模板提供的内容样式填充对应数据，然后选择文件上传。
                </div>
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
                <div
                  style="display:flex;margin-top:5px;"
                  v-if="formData.subjectNumber > 0"
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
                </div>
                  
                <div
                  style="display:flex;margin-top:5px;"
                  v-if="formData.subjectNumber > 0"
                >
                  <div class="socreBgSub" style="background:#2A6CEC;">
                    填空题{{ formData.packNumber }}题
                  </div>

                  <div class="socreBgSub" style="background:#11C2A1;">
                    简答题{{ formData.sketchNumber }}题
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
        </Form>
        </div>
        <div slot="footer">
          <Button type="primary" @click="handleSubmit">确认</Button>
          <Button type="error" @click="uploadCancel">取消</Button>
        </div>
      </Modal>
    </div>

    <div slot="drawer">
      <FormDetailInfo
        ref="detailFormInfo"
        :detailsId="chooseListData.length === 1 ? chooseListData[0].id : null"
        :routerTitle="this.$route.meta.title"
        @close="closeComponent"
        @error="error()"
      >
      </FormDetailInfo>

      <!-- 上传操作 -->
      <upload-model
        ref="uploadModel"
        v-if="API.LIST_DOWNLOAD_URL && API.LIST_UPLOAD_URL && canImport"
        :downloadURL="API.LIST_DOWNLOAD_URL"
        :uploadURL="API.LIST_UPLOAD_URL"
        :uploadParams="uploadParams"
        :acceptType="['xls', 'xlsx']"
        @handleUpload="operateSuccess"
        modelTitle="导入试卷"
      ></upload-model>

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
  </container>
</template>
<script>
import {
  initPaperManagementList,
  deletePaperManagementByIds,
  importSubmitPaperManagementInfo,
  getSubjectByType
} from '@/api/online/paper/api-modules-paper'
import { API_PAPERMANAGEMENT } from '@/api/online/paper/api-address-paper'
import { OPERATE_LIST } from '@/libs/mixin'
import ColumnPugins from './index-column'
import FormInfo from './operate/form-info.vue'
import FormDetailInfo from './detail/form-info.vue'
// import BeforeUpload from './before-upload.vue'
import { supportNormal } from '@/utils'
import { exportFile,exportModelFile } from '@/api/api-base'
import uploadFile from '@/components/upload/upload-file-modal'
import FormDataInfo from './form'
import RulesValidate from './form-validate'
import axios from 'axios'

export default {
  mixins: [OPERATE_LIST],
  components: {
    uploadFile,
    FormInfo,
    FormDetailInfo
    // BeforeUpload
  },
  data() {
    return {
      canReset: this.isAuth('online:paper:query'), // 重置
      canSearch: this.isAuth('online:paper:query'), // 查询
      canSave: this.isAuth('online:paper:add'), // 添加
      canEdit: false, // 编辑
      canDelete: this.isAuth('online:paper:delete'), // 删除
      canImport: this.isAuth('online:paper:import'), // 能否导入
      canExport: this.isAuth('online:paper:export'), // 导出
      canFindByID: true, // id查询
      exportPath: null, // 导出EXCEL地址
      downloadURL: null, // 下载地址
      uploadURL: null, // 上传地址
      // exportUrl: null, // 导出地址
      uploadParams: null, // 上传参数
      uploadModel: false,
      formData: FormDataInfo(),
      formValidate: RulesValidate(this),
      subjectArray: [],
      fillList: [],
      maxSize: 5 * 1024,
      API: {}, // api对象
      searchParams: {
        // 查询参数
        limit: 10, // 每页数量
        current: 1, // 当前页数
        paperNo: null, // 名称
        paperType: null, // 状态
        subjectType: null
      }
    }
  },
  mounted() {
    this.API = API_PAPERMANAGEMENT()
    this.exportPath = API_PAPERMANAGEMENT().LIST_EXPORT_URL
    this.uploadURL = API_PAPERMANAGEMENT().LIST_UPLOAD_URL
    this.downloadURL = API_PAPERMANAGEMENT().LIST_DOWNLOAD_URL
    // this.uploadURL = 'information/titleManagement/importTable'
    // this.exportUrl = 'information/titleManagement/export'
    this.tableColumnPugins = ColumnPugins(this)
    // this.searchParams = Object.assign(this.searchParams, FormDataInfo())
    this.initListData()
  },
  methods: {
    // 初始化数据表格
    initListData() {
      var validation = supportNormal(this.searchParams)
      if (!validation.isPass) {
        let message = validation.message
        this.$Message.error(message)
      } else {
        this.loading = true
        initPaperManagementList(this.searchParams)
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
        paperNo: null, // 名称
        paperType: null, // 状态
        subjectType: null
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
      deletePaperManagementByIds(params)
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
        paperNo: null, // 名称
        paperType: null, // 状态
        subjectType: null
      })
      return params
    },

    // 上传侧滑控制
    handleOpenUpload(formInfo) {
      this.fillList = []
      this.formData = FormDataInfo()
      this.uploadModel = true
      // this.uploadParams = {}
      // this.$forceUpdate()
      // this.$nextTick(() => {
      //   this.$refs.uploadModel.openModel()
      // })
    },
    // 下载参数
    loadExportParams() {
      let params = {}
      return params
    },
    //导出试卷
    exportTestPaper() {
      if (this.chooseListData.length === 0) {
        this.$Message.warning('请先选择需要导出的数据')
        return
      }
      if (this.exportPath === null) return
      let params = '?id=' + this.chooseListData[0].id
      exportFile(this.exportPath + params)
      setTimeout(() => {
        this.$Notice.success({
          title: '文件下载成功'
        })
      }, 2000)
    },
    openPaperDetailPage() {
      this.isPassword = false
      this.isOperate = false
      this.isSee = false
      this.addTree = false
      this.$forceUpdate()
      this.$nextTick(() => {
        this.$refs.detailFormInfo.handleOpenModel()
      })
    },
    uploadCancel(){
      this.$refs.uploadBanner.clearFiles()
      if (this.$refs['formValidate']) {
        this.$refs['formValidate'].resetFields()
      }
      this.uploadModel = false
    },
    handleSubmit(){
       this.$handleValidate('formValidate', this).then(valid => {
        if (valid) {
          let params = Object.assign(
        { ...this.formData },
        {
          isOperate: false
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
      importSubmitPaperManagementInfo(params)
        .then(({ data }) => {
          this.$Spin.hide()
          if (data.status) {
            this.$Message.success('成功保存信息')
            this.uploadCancel()
            this.initListData()
          } else {
            // this.$Message.error('保存信息时系统异常')
          }
        })
        .catch(() => {
          
        })
        }
      })
    },
     //课目类别选择
    subjectTypeChange(val) {
      if (val) {
        this.subjectArray = []
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
    //选择课目
    subjectChange(val) {
      // this.subjectArray.forEach(item => {
      //   if (item.id === val) {
      //     this.formData.subjectType = String(item.type)
      //   }
      // })
    },
    // 文件上传完成后，把值赋值给formdata
    uploadSuccess(params) {
      this.formData.score = 0
      this.formData.paperTitleDOS = []
      if(params && params.length > 0) {
        this.formData.paperTitleDOS = params
        this.formData.subjectNumber = params.length
        this.formData.judgeNumber = 0
        this.formData.multipleNumber = 0
        this.formData.packNumber = 0
        this.formData.singleNumber = 0
        this.formData.sketchNumber = 0
        this.formData.paperTitleDOS.forEach(item =>{
          if(item.answerType === 1){
            this.formData.singleNumber = this.formData.singleNumber + 1
          } else if(item.answerType === 2){
            this.formData.multipleNumber = this.formData.multipleNumber + 1
          } else if(item.answerType === 3){
            this.formData.judgeNumber = this.formData.judgeNumber + 1
          } else if(item.answerType === 4){
            this.formData.packNumber = this.formData.packNumber + 1
          } else if(item.answerType === 5){
            this.formData.sketchNumber = this.formData.sketchNumber + 1
          } 
        })
        this.formData.score =
          this.formData.singleNumber * 2 +
          this.formData.multipleNumber * 2 +
          this.formData.judgeNumber * 1 +
          this.formData.packNumber * 2 +
          this.formData.sketchNumber * 8
      } else {
        this.formData.paperTitleDOS = []
        this.formData.subjectNumber = 0
      }
    },
    async downloadTemplate() {
      await exportModelFile(this.downloadURL)
    }
  }
}
</script>

<style lang="less" scoped>
/deep/.text3line {
  display: -webkit-box;
  /* autoprefixer: off */
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 3;
  /* autoprefixer: on */
  overflow: hidden;
  text-overflow: ellipsis;
  margin-top: 8px;
  margin-bottom: 8px;
}
/deep/.ivu-input-suffix {
  width: 50px;
}
/deep/.ivu-form-item {
  margin-bottom: 18px;
}
/deep/.mar-top{
  margin-top: 0px;
}
.tip{
  font-size: 13px;
  line-height: 20px;
}
.borderDashed {
  padding: 12px;
  width: 100%;
  border: 1px dashed #17b3a3;
  min-height: 100px;
  border-radius: 5px;
  margin-top: 5px;
}
.socreBgSub {
  height: 32px;
  text-align: center;
  font-size: 12px;
  border: 1px solid #e4e4e4;
  color: white;
  line-height: 32px;
  padding-left: 12px;
  padding-right: 12px;
  margin-right: 18px;
  border-radius: 3px;
}
.asterisk {
  height: 20px;
  margin-left: 0px;
  line-height: 20px;
  font-family: SimSun;
  color: #ed4014;
  font-size: 14px;
}
.vertical-center-modal{
  display: flex;
  align-items: center;
  justify-content: center;

    /deep/.ivu-modal{
      top: 70px !important;
    }
}
/deep/ .ivu-modal-mask {
  z-index: 127 !important;
}
</style>
