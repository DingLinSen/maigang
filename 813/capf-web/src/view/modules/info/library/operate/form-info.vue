<!--
 * @description manuscriptlibrary- 稿库管理表--新增/编辑查看/界面
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
          <Col span="24">
            <FormItem label="稿件内容" label-position="top" prop="content">
              <Input
                type="textarea"
                :autosize="{minRows: 4}"
                v-model.trim="formData.content"
                placeholder="请输入稿件内容"
                ref="content"
                :disabled="isSee"
                :maxlength="1000"
              />
            </FormItem>
          </Col>
          <Col span="12">
            <FormItem label="长度" label-position="top" prop="length">
              <Input
                type="text"
                v-model.trim="formData.length"
                placeholder="请输入长度"
                ref="length"
                :disabled="isSee"
                :maxlength="15"
              />
            </FormItem>
          </Col>
          <Col span="12">
            <FormItem label="码长" label-position="top" prop="codeLength">
              <Input
                type="text"
                v-model.trim="formData.codeLength"
                placeholder="请输入码长"
                ref="codeLength"
                :disabled="isSee"
                :maxlength="15"
              />
            </FormItem>
          </Col>
          <Col span="12">
            <FormItem label="难度" label-position="top" prop="difficulty">
              <Select
                v-model="formData.difficulty"
                ref="difficulty"
                :disabled="isSee"
                remote
                name="select"
                :clearable="false"
                placeholder="请选择难度"
              >
                <Option value="1" label="低"></Option>
                <Option value="2" label="中"></Option>
                <Option value="3" label="高"></Option>
              </Select>
            </FormItem>
          </Col>
        </Row>
      </Form>
      <div class="demo-drawer-footer" style="text-align: center;">
        <Button type="primary" @click="handleValidate"  v-if="!isSee">确认{{ !isOperate ? '新增' : '编辑' }}</Button>
        <!-- <Button type="error" class="mar-lft-10" @click.stop="handleReset" v-if="!isSee">重置信息</Button> -->
        <Button type="default" class="mar-lft-10" @click.stop="handleCancleModel">取消操作</Button>
      </div>
    </div>
  </div>
</template>

<script>
import { operateManuscriptLibraryInfo, initManuscriptLibraryDetailsById } from '@/api/info/library/api-modules-manuscriptlibrary'
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
          initManuscriptLibraryDetailsById(params).then(res => {
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
      operateManuscriptLibraryInfo(params).then(({ data }) => {
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
