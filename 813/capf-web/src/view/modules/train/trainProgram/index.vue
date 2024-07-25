<template lang="html">
  <container class="full-container">
    <div slot="content">
      <Tables
        ref="tables"
        v-if="tableColumnPugins != null"
        searchable
        search-place="top"
        v-model="listData"
        class="table-wrapper"
        :stripe="false"
        :border="true"
        :columnControl="true"
        :loading="loading"
        :columns="tableColumnPugins"
        :canDelete="false"
        :show-header="true"
        @handleReset="handleResearch"
        @on-sort-change="onSortChange"
        @btnInsert="createDrawerChange"
        @btnUpdate="updateDrawerChange"
        @btnDelete="btnDeleteBallast"
        @btnSearch="reloadList"
        @on-selection-change="selectChange"
      >
      <div slot="btn-right">
          <Button type="primary" ghost class="search-btn" @click="handleOpenUpload()" v-if="canImport">导入大纲</Button>
        </div>
        <page-wrapper
          slot="footer"
          :total="totolCount"
          :pageSize="searchParams.limit"
          :pageNo="searchParams.current"
          @page-change="pageChange"
          @page-size-change="pageSizeChange"
        >
        </page-wrapper>
      </Tables>
      <!-- 导入弹框 -->
      <Modal width="34%" v-model="fileModel" title="导入大纲" prop="fillList" :mask-closable="false" @on-cancel="fileListFill">
        <Form :model="formData" ref="formValidate" :rules="formValidate">
          <Row :gutter="32">
            <Col span="24">
              <FormItem label="大纲名称:" prop="outlineName">
                <Input
                  type="text"
                  v-model="formData.outlineName"
                  placeholder="输入大纲名称(40字以内)"
                  :clearable="false"
                  :maxlength="40"
                  ref="outlineName"
                />
              </FormItem>
              <FormItem label="上传文件:" prop="fillList">
                </br>
                 <uploadFile
                  v-model="formData.fillList"
                  ref="uploadBanner"
                  :showUpload="true"
                  :uploadURL="uploadURL"
                  :acceptType="['pdf' , 'docx']"
                  :fileNum="1"
                  :data="uploadParams"
                  @changeFileParams="uploadSuccess"
                  class="uploadImg"
                ></uploadFile>
              </FormItem>
            </Col>
          </Row>
        </Form>
        <div slot="footer">
          <Button type="primary" @click="handleSubmit">确认</Button>
          <Button type="error" @click="fileListFill">取消</Button>
        </div>
      </Modal>

      <!-- 删除弹框 -->

      <Modal
        v-model="deleteModel"
        :title="this.$store.state.base.deleteInfo.title"
        @on-ok="handleDelete"
        :mask-closable="false"
      >
        <!-- <p>{{ this.$store.state.base.deleteInfo.msg }}</p> -->
        <p>确定删除选中的数据信息吗？</p>
      </Modal>
       <Dialog
      :sysName="sysName"
      :moduleName="moduleName"
      ref="dialogDetails"
      :title="diaTitle"
      :url="diaPath"
      :isPdf="true"
      :fileName="diaFileName"
      :picArray="diaPicArray"
      :defaultHeight="defaultHeight"
    ></Dialog>
    </div>
  </container>
</template>
<script>
import { OPERATE_LIST } from '@/libs/mixin'
import { supportNormal } from '@/utils'
import ColumnPugins from './index-column'
import uploadFile from '@/components/upload/upload-file'
import FormDataInfo from './form'
import RulesValidate from './form-validate'
// import { downloadFile } from '@/api/upload/api-modules-upload.js'
import { exportFileWithName } from '@/api/api-base'
import {
  initProgramList,
  deleteProgramByIds,
  saveProgramInfo
} from '@/api/trainProgram/api-modules-trainProgram.js'
import Dialog from '../../pdf/dialogDetails'
export default {
  mixins: [OPERATE_LIST],
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
  watch: {
    documentClientHeight: function () {
      this.initDialogHeight()
    }
  },
  components: {
    uploadFile,
    Dialog
  },
  data() {
    return {
      formData: FormDataInfo(),
      isshow: false,
      canSave: true, // 添加
      canEdit: true, // 编辑
      canDelete: this.isAuth('train:trainProgram:delete'), // 删除
      canImport: this.isAuth('train:trainProgram:import'), // 能否导入
      download: this.isAuth('train:trainProgram:download'),
      downloadURL: '', // 下载地址
      exportPath: '', // 导出地址
      listData: [],
      searchParams: {
        limit: 10, // 每页数量
        current: 1 // 当前页数
      },
      percent: 0,
      yuLan: false,
      fileModel: false, // 上传弹框
      uploadParams: {
        onePathName: 'trinFile',
        twoPathName: 'trinProgramFile'
      },
      formValidate: RulesValidate(this),
      uploadURL: 'common/upload/uploadFile', // 上传地址
      defaultHeight: 500, // 弹出框默认高度
      diaTitle: null,
      diaPath: null,
      diaFileName: null,
      sysName: null,
      moduleName: null,
      diaPicArray: []
    }
  },
  mounted() {
    this.exportPath = window.SITE_CONFIG.downFileUrl
    this.tableColumnPugins = ColumnPugins(this)
    this.initListData()
    this.initDialogHeight()
  },
  methods: {
    initDialogHeight() {
      this.defaultHeight = this.documentClientHeight - 80
    },
    // 初始化数据表格
    initListData() {
      var validation = supportNormal(this.searchParams)
      if (!validation.isPass) {
        this.$Message.error(validation.message)
      } else {
        this.loading = true
        initProgramList(validation.searchParams)
          .then(res => {
            // console.log(res)
            if (res.data.status) {
              this.totolCount = res.data.page.totalCount
              var data = res.data.page
              this.listData = data.list
              this.$forceUpdate()
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
    // 确认删除列表信息
    // 删除
    async handleDelete() {
      let ids = ''
      this.chooseListData.forEach(element => {
        ids += element.id + ','
      })
      ids = ids.substring(0, ids.lastIndexOf(','))
      let params = {
        ids: ids
      }
      deleteProgramByIds(params)
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
          } else {
            this.$Message.error(res.msg)
          }
        })
        .catch(() => {})
    },
    async handleValidateSub(val) {
      // console.log(this.formData)
      var isPass = true
      var isPass1 = true
      this.$refs['formValidate'].validate(valid => {
        if (valid) {
          isPass1 = true
        } else {
          isPass1 = false
        }
      })
      if (this.formArr.length) {
        this.$refs['formValidate1'].forEach(item => {
          item.validate(valid => {
            if (valid) {
              isPass = true
            } else {
              isPass = false
            }
          })
        })
      }

      if (!isPass1 || !isPass) {
        this.$Message.error('请根据提示信息补全提交的内容信息')
      } else {
        this.handleSubmit()
      }
    },
    // 保存
    handleSubmit() {
      this.$handleValidate('formValidate', this).then(valid => {
        if (valid) {
          let params = {
            outlineName: this.formData.outlineName,
            filePath: this.fileUrl,
            fileName: this.formData.fillList[0].name
          }
          saveProgramInfo(params)
            .then(({ data }) => {
              this.$Spin.hide()
              if (data.httpCode === 200) {
                this.fileListFill()
                this.$Message.success('成功保存信息')
                this.$nextTick(() => {
                  this.$emit('operateSuccess', params)
                  this.initListData()
                })
              } else {
                // this.$Message.error('大纲名称已存在，请重新输入！')
              }
            })
            .catch(() => {})
        }else{

        }
      })
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
      this.searchParams = {
        limit: 10, // 每页数量
        current: 1 // 当前页数
      }
      this.chooseListData = []
      this.initListData()
    },
    pageSizeChange(pageSize) {
      // 切换每页条数时的回调，返回切换后的每页条数o
      // console.log(pageSize)
      this.searchParams.limit = pageSize
      this.$emit('page-size-change', pageSize)
      this.initListData()
    },
    pageChange(pageNo) {
      // 页码改变的回调，返回改变后的页码
      this.searchParams.current = pageNo
      this.$emit('page-change', pageNo)
      this.initListData()
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
        name: null // 名称
      })
      return params
    },
    // 导入
    dataFileItem(params) {
      this.uploadURL = 'common/upload/uploadFile'
      this.$refs['formValidate'].resetFields()
      this.fileModel = true
    },
    // 文件上传完成后，把值赋值给formdata
    uploadSuccess(params) {
      if(params) {
        this.fileUrl = params.uploadPath ? params.uploadPath : ''
        if (this.fileUrl) {
          this.formData.fillList = [
            {
              name: params.originalFileName,
              url: params.uploadPath,
              status: 'finished'
            }
          ]
        }else{
          this.formData.fillList = []
        }
      }
    },
    // 关闭
    fileListFill() {
      this.$refs.uploadBanner.clearFiles()
      this.fileModel = false
      this.formData.outlineName = null
      this.formData.fillList = []
    },
    // 上传侧滑控制
    handleOpenUpload(formInfo) {
      this.formData = FormDataInfo()
      this.$refs['formValidate'].resetFields()
      this.fileModel = true
    },
    // 下载文件的方法
    // downloadFile(row) {
    //   let params = {
    //     fileName: row.fileName,
    //     path: this.exportPath + row.filePath
    //   }
    // downloadFile(params)
    //   .then(res => {
    //     if (res.data.status) {
    //       window.open(res.data.data)
    //     } else {
    //       this.$Message.error(res.data.msg)
    //     }
    //   })
    //   .catch(() => {})
    //   axios
    //     .get('http://localhost:8088/common/upload/downloadNet', {
    //       headers: {
    //         token: this.$cookie.get('token')
    //       },
    //       responseType: 'blob',
    //       params: params
    //     })
    //     .then(res => {
    //       this.spinShow = false
    //       console.log(res.data)
    //     })
    //     .catch(() => {
    //       this.spinShow = false
    //     })
    // },
    // 下载
    downloadFile(params) {
      // console.log(params)
      // 开始导出操作
      this.percent = 0
      const interval = setInterval(() => {
        if (this.percent >= 50) {
          clearInterval(interval)
          // 开始导出
          var exportPath = params.filePath
          console.log(exportPath)
          if (exportPath === null) return
          exportFileWithName(exportPath, params.fileName)
          this.fileClose()
          return
        }
        this.percent += 10
      }, 100)
    },
    fileClose() {
      const _this = this
      const interval = setInterval(() => {
        if (_this.percent >= 100) {
          clearInterval(interval)
          _this.$Notice.success({
            title: '文件下载成功'
          })
          _this.$Spin.hide()
          return
        }

        _this.percent += 10
      }, 100)
    },
    aaa(params) {
      // console.log(params)
      this.diaTitle = params.outlineName
      this.diaPath = params.filePath
      this.diaFileName = params.fileName
      this.sysName = '文件下载'
      this.moduleName = ''
      this.$refs.dialogDetails.open()
    }
  }
}
</script>
<style lang="less" scoped>
/deep/ .ivu-upload {
  width: 100% !important;
}
/deep/ .ivu-modal-body{
  line-height: 1;
}
/deep/ .ivu-modal-mask {
      z-index: 127 !important;
}
</style>
