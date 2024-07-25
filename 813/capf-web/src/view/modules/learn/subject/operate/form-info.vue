<!--
 * @description subjectlearn- 课目学习主表--新增/编辑查看/界面
 * @author yxm
 * @date 2022-04-07
 * -->
<template>
  <div class="details-container">
    <div class="details-title">
      <p>{{isSee ? '查看' + routerTitle + '信息' : (!isOperate ? '新增' + routerTitle + '信息' : '编辑' + routerTitle + '信息')}}</p><Icon type="md-close" @click.stop="handleCancleModel"/>
    </div>
    <div class="details-content">
      <Form :model="formData" ref="formValidate" :rules="formValidate">
        <Row :gutter="32">
          <Col span="12">
            <FormItem label="课目id" label-position="top" prop="subjectId">
              <Input
                type="text"
                v-model.trim="formData.subjectId"
                placeholder="请输入课目id"
                ref="subjectId"
                :disabled="isSee"
                :maxlength="15"
              />
            </FormItem>
          </Col>
          <Col span="12">
            <FormItem label="用户id" label-position="top" prop="userId">
              <Input
                type="text"
                v-model.trim="formData.userId"
                placeholder="请输入用户id"
                ref="userId"
                :disabled="isSee"
                :maxlength="15"
              />
            </FormItem>
          </Col>
          <Col span="12">
            <FormItem label="开始日期期限" label-position="top" prop="startDate">
              <Input
                type="text"
                v-model.trim="formData.startDate"
                placeholder="请输入开始日期期限"
                ref="startDate"
                :disabled="isSee"
                :maxlength="15"
              />
            </FormItem>
          </Col>
          <Col span="12">
            <FormItem label="结束日期期限" label-position="top" prop="endDate">
              <Input
                type="text"
                v-model.trim="formData.endDate"
                placeholder="请输入结束日期期限"
                ref="endDate"
                :disabled="isSee"
                :maxlength="15"
              />
            </FormItem>
          </Col>
          <Col span="12">
            <FormItem label="创建时间" label-position="top" prop="createTime">
              <Input
                type="text"
                v-model.trim="formData.createTime"
                placeholder="请输入创建时间"
                ref="createTime"
                :disabled="isSee"
                :maxlength="15"
              />
            </FormItem>
          </Col>
          <Col span="12">
            <FormItem label="修改时间" label-position="top" prop="updateTime">
              <Input
                type="text"
                v-model.trim="formData.updateTime"
                placeholder="请输入修改时间"
                ref="updateTime"
                :disabled="isSee"
                :maxlength="15"
              />
            </FormItem>
          </Col>
          <Col span="12">
            <FormItem label="创建人id" label-position="top" prop="createBy">
              <Input
                type="text"
                v-model.trim="formData.createBy"
                placeholder="请输入创建人id"
                ref="createBy"
                :disabled="isSee"
                :maxlength="15"
              />
            </FormItem>
          </Col>
          <Col span="12">
            <FormItem label="修改人id" label-position="top" prop="updateBy">
              <Input
                type="text"
                v-model.trim="formData.updateBy"
                placeholder="请输入修改人id"
                ref="updateBy"
                :disabled="isSee"
                :maxlength="15"
              />
            </FormItem>
          </Col>
          <Col span="12">
            <FormItem label="课目学习总进度值" label-position="top" prop="totalProgress">
              <Input
                type="text"
                v-model.trim="formData.totalProgress"
                placeholder="请输入课目学习总进度值"
                ref="totalProgress"
                :disabled="isSee"
                :maxlength="15"
              />
            </FormItem>
          </Col>
        </Row>
      </Form>
      <div class="demo-drawer-footer" style="text-align: center;">
        <Button type="primary" @click="handleValidate"  v-if="!isSee">确认{{ !isOperate ? '新增' : '编辑' }}</Button>
        <Button type="error" class="mar-lft-10" @click.stop="handleReset" v-if="!isSee">重置信息</Button>
        <Button type="default" class="mar-lft-10" @click.stop="handleCancleModel">取消操作</Button>
      </div>
    </div>
  </div>
</template>

<script>
import { operateSubjectlearnInfo, initSubjectlearnDetailsById } from '@/api/learn/api-modules-subjectlearn.js'
import { OPERATE_PAGE } from '@/libs/mixin'
import FormDataInfo from './form'
import RulesValidate from './form-validate'
export default {
  mixins: [OPERATE_PAGE],
  data() {
    return {
      showDrawer: false,
      formData: FormDataInfo(),
      formValidate: RulesValidate(this)
    }
  },
  computed: {
  },
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
          initSubjectlearnDetailsById(params).then(res => {
            if (res.data.status) {
              const data = res.data
              if (data == null) {
                this.$Message.error('未查询到相关信息')
                this.handleCancleModel()
                return
              }
              this.formData = res.data.data
            } else {
              this.formData = FormDataInfo()
              // this.$Message.error('获取信息详情时异常，请联系管理员')
            }
          }).catch(() => {
          })
        }
      })
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
          if(this.formData[item]) {
            params[item] = ((this.formData[item] || null) + '').trim()
          }
        }
      })
      operateSubjectlearnInfo(params).then(({ data }) => {
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
      }).catch(() => {
      })
    },

    // 打开弹框并初始化
    handleOpenModel() {
      this.showDrawer = true
      this.initFormData()
    }
  }
}
</script>
<style lang="less" scoped>
</style>
