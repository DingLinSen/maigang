<!-- /**
  * @description 部门--编辑界面
  * @author yxm
  * @date 2021-10-19
  */ -->
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
          <Col span="24">
            <FormItem label="上级部门" label-position="top" prop="parentName">
              <Input
                type="text"
                v-model.trim="formData.parentName"
                placeholder="请输入部门名称"
                ref="parentName"
                disabled
              />
            </FormItem>
          </Col>
          <Col span="24">
            <FormItem label="部门名称" label-position="top" prop="deptName">
              <Input
                type="text"
                v-model.trim="formData.deptName"
                placeholder="请输入部门名称"
                ref="deptName"
                :disabled="isSee"
                :clearable="true"
                :maxlength="20"
              />
            </FormItem>
          </Col>
        </Row>
        <!-- <Row :gutter="32">
          <Col span="24">
            <FormItem label="描述" label-position="top" prop="describes">
              <Input
                type="textarea"
                v-model.trim="formData.describes"
                placeholder="请输入描述"
                ref="line"
                :disabled="isSee"
                :clearable="true"
                :maxlength="200"
              />
            </FormItem>
          </Col>
        </Row> -->
      </Form>
      <br>
      <br>
      <div class="demo-drawer-footer" style="text-align: center;">
        <Button type="primary" @click="handleValidate" v-if="!isSee"
          >确认{{ !isOperate ? '新增' : '编辑' }}</Button
        >
        <Button type="error" class="mar-lft-10" @click.stop="handleResetSub" ghost
          >重置信息</Button
        >
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
import {
  operateDeptInfo,
  initDeptDetailsById
} from '@/api/sys/api-modules-dept'
import { OPERATE_PAGE } from '@/libs/mixin'
import FormDataInfo from './form'
import RulesValidate from './form-validate'
export default {
  mixins: [OPERATE_PAGE],
  props: {
    isSee: {
      default: false,
      type: Boolean
    },
    isOperate: {
      default: false,
      type: Boolean
    },
    detailsId: {
      default: null,
      type: String
    },
    addTree: {
      default: null,
      type: Boolean
    }
  },
  data() {
    return {
      showDrawer: false,
      formData: FormDataInfo(),
      formValidate: RulesValidate(this)
    }
  },
  mounted() {},
  activated() {
    this.initFormData()
  },
  methods: {
    // 根据id 获取详情
    initFormData() {
      this.handleReset() // 重置表单
      let params = {
        id: this.detailsId
      }
      this.$nextTick(() => {
        this.formData = FormDataInfo()
        if (this.isOperate) {
          initDeptDetailsById(params)
            .then(res => {
              if (res.data.status) {
                const data = res.data.sysDeptDO
                if (data == null) {
                  this.$Message.error('未查询到相关信息')
                  this.handleCancleModel()
                  return
                }
                this.formData = {
                  ...data,
                  parentName: ''
                }
                this.formData.parentId = data.parentId ? data.parentId : '0'
                if (this.formData.parentId === '0') {
                  this.formData.parentName = '/'
                }else{
                  this.getParentDeptInfoById(this.formData.parentId)
                }
              } else {
                this.formData = FormDataInfo()
              }
            })
            .catch(() => {})
        } else {
          // 新增
          this.formData = FormDataInfo()
          this.$forceUpdate()
          if (this.addTree) {
            this.formData.parentId = '0'
            this.formData.parentName = '/'
            this.formData.level = '0'
            this.formData.orderNum = '1'
          } else {
            if (this.detailsId) {
              initDeptDetailsById({ id: this.detailsId })
                .then(res => {
                  if (res.data.status) {
                    const data = res.data.sysDeptDO
                    if (data == null) {
                      this.$Message.error('未查询到相关信息')
                      this.handleCancleModel()
                      return
                    }

                    this.formData.parentId = data.deptId ? data.deptId : '0'
                    this.formData.parentName = data.deptName
                    this.formData.level = data.level ? data.level + ',' + this.detailsId : '0'
                    this.formData.orderNum = data.orderNum ? Number(data.orderNum) + 1 : 1
                    this.$forceUpdate() // 刷新表单
                  } else {
                    this.formData = FormDataInfo()
                  }
                })
                .catch(() => {})
            }
          }
        }
      })
    },
    // 根据id 获取父部门详情
    getParentDeptInfoById(id) {
      let params = {
        id: id
      }
      initDeptDetailsById(params)
        .then(res => {
          if (res.data.status) {
            const data = res.data.sysDeptDO
            this.formData.parentName = data.deptName
              ? data.deptName
              : '/'
            this.formData.orderNum = data.orderNum ? Number(data.orderNum) + 1 : '1'
          } else {
            this.formData.parentName = '/'
            this.formData.orderNum = 1
          }
        })
        .catch(() => {})
    },
    // 保存信息 （添加和编辑）
    handleSubmit() {
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
      operateDeptInfo(params)
        .then(({ data }) => {
          this.$Spin.hide()
          if (data.status) {
            this.$Message.success('成功保存信息')
            this.$nextTick(() => {
              this.$emit('operateSuccess', params)
            })
            this.handleCancleModel()
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
    handleResetSub() {
      var parentName = this.formData.parentName
      this.$refs['formValidate'].fields.forEach(function (e) {
        if (e.prop === 'deptName') {
          e.resetField()
        }
      })
      this.formData.parentName = parentName
    }
  }
}
</script>
<style lang="less" scoped></style>
