<!--
 * @description otherexamine- 网上考核-其他考核--新增/编辑查看/界面
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
            <FormItem label="考核名称" label-position="top" prop="name">
              <Input
                type="text"
                v-model.trim="formData.name"
                placeholder="请输入考核名称"
                ref="name"
                :disabled="isSee"
                :maxlength="15"
              />
            </FormItem>
          </Col>
          <Col span="12">
            <FormItem label="考核部门" label-position="top" prop="deptIds">
              <Cascader
                :data="deptList"
                v-model="formData.deptIds"
                placeholder="请选择考核部门"
                @on-change="selDept"
                style="width: 100%"
                :clearable="false"
                :disabled="isOperate"
                change-on-select
              ></Cascader>
            </FormItem>
          </Col>
          <Col span="12">
            <FormItem label="课目名称" label-position="top" prop="subjectId">
              <Select
                v-model="formData.subjectId"
                ref="subjectId"
                :disabled="isSee"
                name="select"
                filterable
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
            <FormItem label="课目类型" label-position="top" prop="type">
              <Select
                v-model="formData.type"
                ref="type"
                disabled
                remote
                name="select"
                :clearable="false"
                placeholder="请选择课目类型"
              >
                <Option value="1" label="理论知识"></Option>
                <Option value="2" label="专业操作"></Option>
              </Select>
            </FormItem>
          </Col>
          <Col span="12">
            <FormItem label="考核类型" label-position="top" prop="examineType">
              <Select
                filterable
                :clearable="true"
                v-model="formData.examineType"
                placeholder="请选择考核类型"
                ref="selectRef"
                :disabled="isSee"
              >
                <Option value="1" label="结业考核初考"></Option>
                <Option value="2" label="结业考核补考"></Option>
                <Option value="3" label="季度考核"></Option>
                <Option value="4" label="抽考"></Option>
              </Select>
            </FormItem>
          </Col>
          <Col span="12">
            <FormItem
              label="考核时间"
              label-position="top"
              prop="examineStartDate"
            >
              <DatePicker
                type="date"
                style="width: 100%"
                :clearable="false"
                :confirm="true"
                :disabled="isSee"
                placeholder="请选择考核时间"
                v-model="formData.examineStartDate"
                :options="startTimelimitStart"
              >
              </DatePicker>
            </FormItem>
          </Col>
          <Col span="12">
            <FormItem label="备注" label-position="top" prop="remark">
              <Input
                type="textarea"
                v-model.trim="formData.remark"
                placeholder="请输入备注"
                ref="remark"
                :disabled="isSee"
                :maxlength="200"
                show-word-limit
              />
            </FormItem>
          </Col>
          <Col span="12">
            <FormItem label="文档内容" label-position="top" prop="fillList">
              <br />
              <div v-if="!isOperate">
                <uploadFile
                  ref="upload"
                  v-model="formData.fillList"
                  :uploadParams="uploadParams"
                  :isOther="true"
                  @handleUpload="handleUpload"
                  @changeFileParams="changeFileParams"
                  :format="acceptType"
                  :acceptType="acceptType"
                  :on-format-error="handleFormatError"
                  :on-success="uploadSuccess"
                  :on-exceeded-size="handleMaxSize"
                  :max-size="maxSize"
                  :action="uploadSub"
                >
                </uploadFile>
                <div class="tip">
                  操作说明： 请先选择<span
                    style="color: blue; cursor: pointer"
                    @click="downFile"
                    >下载模板</span
                  >， 根据模板提供的内容样式填充对应数据，然后选择文件上传。
                </div>
              </div>
              <div class="fillBlack" v-if="isOperate">
                标准模板.xls
              </div>
            </FormItem>
          </Col>
        </Row>
      </Form>
      <div class="demo-drawer-footer" style="text-align: center;">
        <Button type="primary" @click="handleValidate" v-if="!isSee"
          >确认{{ !isOperate ? '新增' : '编辑' }}</Button
        >
        <!-- <Button type="error" class="mar-lft-10" @click.stop="handleReset" v-if="!isSee">重置信息</Button> -->
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
  operateOtherExamineInfo,
  initOtherExamineDetailsById,
  getFormTemplate
} from '@/api/online/other/api-modules-otherexamine'
import { initAllDeptList } from '@/api/sys/api-modules-dept'
import { initAllRoleList } from '@/api/sys/api-modules-role'
import { sortByKey, treeDataTranslate } from '@/utils'
import {
  initAllSubjectData
} from '@/api/statistics/week/api-modules-week'
import axios from 'axios'
import { API_OTHEREXAMINE } from '@/api/online/other/api-address-otherexamine'
import { getSubjectHasSub } from '@/api/tasks/api-modules-tasktrain'
import { OPERATE_PAGE } from '@/libs/mixin'
import { exportFileWithNameSub } from '@/api/api-base'
import uploadFile from '@/components/upload/upload-file'
import FormDataInfo from './form'
import RulesValidate from './form-validate'
export default {
  mixins: [OPERATE_PAGE],
  data() {
    return {
      subjectArray: [], // 选择课目
      deptList: [], // 考核部门
      deptIds: [],
      deptId: '',
      showDrawer: false,
      startTimelimitStart: {}, // 计划开始时限
      startTimelimitEnd: {}, // 计划结束时限
      fillList: [], // 上传文件model
      uploadParams: {}, // 上传参数
      acceptType: ['xls', 'xlsx'], // 导入的文件的格式
      acceptTypeStr: '', // 允许的格式
      maxSize: 1024 * 1024,
      uploadURL: API_OTHEREXAMINE().LIST_DOWNLOAD_URL,
      formData: FormDataInfo(),
      formValidate: RulesValidate(this)
    }
  },
  components: {
    uploadFile
  },
  computed: {},
  activated() {
    this.initSubjectList()
    this.initRoleList()
    this.initFormData()
    this.acceptTypeStr = ''
    for (var i = 0; i < this.acceptType.length; i++) {
      this.acceptTypeStr = this.acceptTypeStr + ' ' + '.' + this.acceptType[i]
    }
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
            // this.deptId = this.deptList[0].deptId
            // this.formData.deptName = this.deptList[0].deptName
            // this.deptNameSub = this.deptList[0].deptName
          } else {
          }
        })
        .catch(() => {
          this.loading = false
        })
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
    // 获取所有课目
    initSubjectList() {
      this.$nextTick(() => {
        let params = {}
        this.subjectArray = []
        initAllSubjectData(params)
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
    // 选择课目
    subjectChange(val) {
      this.subjectArray.forEach(item => {
        if (item.id === val) {
          this.formData.type = String(item.type)
        }
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
        if (this.isOperate) {
          initOtherExamineDetailsById(params)
            .then(res => {
              if (res.data.status) {
                const data = res.data.otherExamineDO
                if (data == null) {
                  this.$Message.error('未查询到相关信息')
                  this.handleCancleModelSub()
                  return
                }
                // this.formData = res.data.otherExamineDO
                this.formData.id = data.id
                this.formData.name = data.name
                this.formData.deptId = data.deptId
                this.formData.deptIds = data.deptIds
                this.formData.subjectId = data.subjectId
                this.formData.type = String(data.subjectType)
                this.formData.examineType = data.examineType
                this.formData.examineStartDate = data.examineStartDate
                this.formData.remark = data.remark
                this.formData.fillList = ['1']
                this.formData.deptName = data.deptName
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
          isOperate: this.isOperate,
          startDate: this.$moment(this.formData.examineStartDate).format(
            'YYYY-MM-DD HH:mm:ss'
          ),
          examineStartDate: this.$moment(this.formData.examineStartDate).format(
            'YYYY-MM-DD HH:mm:ss'
          ),
          file: this.formData.file
        }
      )
      Object.keys(this.formData).forEach((item, index) => {
        if (!params[item]) {
          if (this.formData[item]) {
            params[item] = ((this.formData[item] || null) + '').trim()
          }
        }
      })
      if (params.fillList) {
        delete params.fillList
      }
      params.file = this.fillList[0]
      var formData = new FormData()
      if (!this.isOperate) {
        formData.append('file', this.fillList[0])
        formData.append(
          'startDate',
          this.$moment(this.formData.examineStartDate).format(
            'YYYY-MM-DD HH:mm:ss'
          )
        )
        formData.append(
          'deptId',
          this.formData.deptIds[this.formData.deptIds.length - 1]
        )
        formData.append('name', this.formData.name)
        formData.append('subjectId', this.formData.subjectId)
        formData.append('examineType', this.formData.examineType)
        formData.append('remark', this.formData.remark)
        axios.defaults.withCredentials = true
        axios
          .post(API_OTHEREXAMINE().BASE_SAVEEXCEL, formData, {
            headers: {
              token: this.$cookie.get('token'),
              'x-auth-token': this.$cookie.get('token'),
              'Content-Type':
                'multipart/form-data; boundary=----WebKitFormBoundary86jMnF89uMTs6Oxw'
            }
          })
          .then(res => {
            this.$Spin.hide()
            if (res.status === 200) {
              var data = res.data.httpCode
              if (data === 200) {
                this.listData = []
                this.uploadFile = []
                this.totolCount = 0
                this.$Message.success('上传成功')
                this.handleCancleModelSub()
                this.$nextTick(() => {
                  this.$emit('operateSuccess', params)
                })
              } else {
                if (res.data.msg) {
                  this.$Message.error(res.data.msg)
                } else {
                  this.$Message.error('上传失败,请稍后重试')
                }
              }
            } else {
              this.$Message.error('上传失败,请稍后重试')
            }
          }).catch(() => { this.$Spin.hide() })
      } else {
        operateOtherExamineInfo(params)
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
          .catch(() => { this.$Spin.hide() })
      }
    },

    // 打开弹框并初始化
    handleOpenModel() {
      this.showDrawer = true
      this.formData.fillList = []

      this.initFormData()
    },
    // 取消创建
    handleCancleModelSub() {
      this.formData.fillList = []
      if (!this.isOperate) {
        this.$refs.upload.clearFiles()
        this.$refs.upload.uploadData(this.formData.fillList)
        this.handleCancleModel()
      } else {
        this.handleCancleModel()
      }
    },
    downFile() {
      this.$nextTick(() => {
        exportFileWithNameSub(
          API_OTHEREXAMINE().LIST_DOWNLOAD_URL,
          '标准模板.xls'
        )
      })
    },
    handleUpload(file) {
      this.fillList = []
      // 后缀获取
      var suffix = ''
      try {
        var flieArr = file.name.split('.')
        suffix = flieArr[flieArr.length - 1]
      } catch (e) {
        suffix = ''
      }
      if (suffix) {
        // 判断文件格式是否错误
        var result = this.acceptType.some(function(item) {
          return item == suffix
        })
        if (result) {
          // 判断文件是否超出规定的大小
          // 判断文件是否超出规定的大小
          if (file.size > this.maxSize * 1024) {
            this.handleMaxSize(file, this.uploadFile)
          } else {
            // 保存文件到需要上传的文件数组里
            this.fillList.push(file)
          }
          this.formData.fillList = [
            {
              name: file.name,
              url: '',
              status: 'finished'
            }
          ]
          this.$refs.upload.uploadData(this.formData.fillList)
        } else {
          this.handleFormatError(file)
        }
      } else {
        this.handleFormatError(file)
      }

      // 返回 falsa 停止自动上传 我们需要手动上传
      return false
    },
    handleFormatError(file) {
      // 格式错误
      // this.$Message.destroy()
      this.$Notice.warning({
        title: '文件格式错误',
        desc:
          '文件  ' +
          file.name +
          ' 格式错误，请选择' +
          this.acceptTypeStr +
          '格式的文件'
      })
    },
    handleMaxSize(file, fileList) {
      // this.$Message.destroy()
      this.$Notice.warning({
        title: '文件大小超限',
        desc:
          '文件  ' +
          file.name +
          ' 太大，上传文件大小不能超过' +
          this.maxSize / 1024 +
          'M.'
      })
    },
    uploadSub() {
      // 上传文件
      if (this.uploadFile && this.uploadFile.length > 0) {
        this.lackFileStr = ''
        for (let i = 0; i < this.listFileLimit.length; i++) {
          var item = this.listFileLimit[i]
          var isExist = this.uploadFile.some(function(item0) {
            return item0.name.toLowerCase().indexOf(item.toLowerCase()) != -1
          })
          if (!isExist) {
            this.lackFileStr =
              this.lackFileStr === '' ? item : this.lackFileStr + '、 ' + item
          }
        }
        if (this.lackFileStr && this.lackFileStr.length > 0) {
          this.lackModel = true
        } else {
          // uploadFile 需要手动上传的数据数组
          this.handleUploadFile()
        }
      } else {
        this.$Message.error('请选择导入的文件')
      }
    },
    uploadSuccess(res, file) {
      // 文件上传回调 上传成功后删除待上传文件
      this.listData = []
      this.uploadFile = []
      this.totolCount = 0
      this.loading = false
      // if (this.fileUrl) {
      //   this.formData.fillList = [
      //     {
      //       name: params.originalFileName,
      //       url: params.uploadPath,
      //       status: 'finished'
      //     }
      //   ]
      // }
      this.$Message.success('上传成功')
    },
    uploadError(err, file) {
      // 文件上传回调 上传失败后删除待上传文件
      if (err) {
        this.$Message.error('上传失败')
      }
    },
    changeFileParams(val) {
      if (val || val.length === 0) {
        this.formData.fillList = []
      }
    }
  }
}
</script>
<style lang="less" scoped>
.tip {
  margin-left: 70px;
  width: 50%;
}
.fillBlack {
  margin-left: 4vw;
  width: 25vw;
  height: 13vh;
  border: 1px dashed gray;
  text-align: center;
  line-height: 13vh;
  // background-color: pink;
}
</style>
