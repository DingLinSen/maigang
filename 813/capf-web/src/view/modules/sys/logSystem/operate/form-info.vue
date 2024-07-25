 <!-- /**
  * @description 系统日志-编辑界面
  * @author yxm
  * @date 2021-10-19
  */ -->
<template>
  <div class="details-container">
    <div class="details-title">
      <p>{{isSee ? '查看' + routerTitle + '信息' : (!isOperate ? '新增' + routerTitle + '信息': '编辑' + routerTitle + '信息')}}</p><Icon type="md-close" @click.stop="handleCancleModel"/>
    </div>
    <div class="details-content">
      <Form :model="formData" ref="formValidate" :rules="formValidate">
        <Row :gutter="32">
          <Col span="8">
          </Col>
          <Col span="8">
          </Col>
          <Col span="8">
          </Col>
        </Row>
        <Divider class="mar-no"/>
      </Form>
      <div class="demo-drawer-footer">
        <Button type="primary" @click="handleValidate">确认{{ (!isOperate ? '新增' : '编辑') }}</Button>
        <!-- <Button type="error" class="mar-lft-10" @click.stop="handleReset" ghost v-if="!isSee">重置信息</Button> -->
        <Button type="default"  class="mar-lft-10" @click.stop="handleCancleModel">取消操作</Button>
      </div>
    </div>
  </div>
</template>

<script>
import { initLogDetailsById, operateLogInfo } from '@/api/sys/api-modules-log-system'
import { OPERATE_PAGE } from '@/libs/mixin'

import FormDataInfo from './form'
import RulesValidate from './form-validate'
export default {
  mixins: [ OPERATE_PAGE ],
  data() {
    return {
      formData: FormDataInfo(), // 表单操作对象
      formValidate: RulesValidate(this) // 表单验证对象
    }
  },
  activated() {
    this.initFormData()
  },
  methods: {
    // 根据id 获取详情
    initFormData() {
      this.handleReset() // 重置表单
      if (this.isOperate) {
        initLogDetailsById({id: this.detailsId}).then(res => {
          if (res.data.status) {
            const data = res.data
            if (data == null) {
              this.$Message.error('未查询到相关信息')
              this.handleCancleModel()
              return
            }
            // 强制重置对象，用于确保无法注入ID
            this.formData.id = this.detailsId
          } else {
            this.formData = FormDataInfo()
            this.$Message.error('获取信息详情时异常，请联系管理员')
          }
        })
      } else {
        this.formData = FormDataInfo()
        this.$forceUpdate()
      }
    },
    // 保存信息, 表单提交，区分put与post。insert使用post
    handleSubmit() {
      let params = {
        isOperate: this.isOperate
      }

      // 重置参数对象匹配后台对象
      Object.keys(this.formData).forEach((item, index) => {
        if (!params[item]) {
          params[item] = ((this.formData[item] || null) + '').trim()
        }
      })

      // 服务调用
      operateLogInfo(params).then(({ data }) => {
        this.$Spin.hide()
        if (data.status) {
          this.handleCancleModel()
          this.$Message.success('成功保存信息')
          this.$nextTick(() => {
            this.$emit('operateSuccess', params)
          })
        } else {
          // this.$Message.error('保存信息时系统异常')
        }
      }).catch(() => {
      })
    }
  }
}
</script>
