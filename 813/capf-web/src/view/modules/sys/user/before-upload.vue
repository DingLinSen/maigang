<!-- /**
  * @description 用户管理-上传
  * @author yxm
  * @date 2021-10-19
  */ -->
<template>
  <Drawer :mask-closable="false"  :mask="false" :title="modelTitle"
    v-model="showModel"
    width="300"
    :transfer="false"
    :inner="true">

    <p class="mar-btm">
      请先选择并填写
      <span class="c-red">“必要信息项目”</span>
      ,填写完成后，点击
      <span class="c-red">“下一步”</span>
      开始上传文件数据。
    </p>

    <Form :model="formData" ref="formValidate" :rules="formValidate">

    </Form>

    <div class="pad-top">
      <Button type="primary" @click="handleSaveSubmit">下一步</Button>
      <Button type="error" class="mar-lft-10" @click.stop="handleReset">重置</Button>
      <Button type="warning"  class="mar-lft-10" @click.stop="cancelOperate">取消</Button>
    </div>
  </Drawer>
</template>

<script>
import { OPERATE_PAGE } from '@/libs/mixin'
export default {
  mixins: [ OPERATE_PAGE ],
  data() {
    return {
      showModel: false,
      formData: {
      },
      formValidate: {
      }
    }
  },
  props: {
    modelTitle: ''
  },
  mounted() {
  },
  computed: {
  },
  watch: {
  },
  methods: {
    openModel() {
      this.showModel = true
    },
    async handleSaveSubmit() { // 保存按钮事件, 校验form表单是否合法
      await this.$refs['formValidate'].validate((valid) => {
        if (valid) {
          this.cancelOperate()
          this.$nextTick(() => {
            this.$emit('handle-next', this.formData)
          })
        } else {
          this.$Message.error('请根据提示信息补全必要内容')
        }
      })
    },
    handleReset () { // 重置信息按钮事件
      this.$refs['formValidate'].resetFields()
    },
    cancelOperate() { // 取消创建
      this.showModel = false
    }
  }
}
</script>

<style>
.track-label:before {
    content: '*';
    display: inline-block;
    margin-right: 4px;
    line-height: 1;
    font-family: SimSun;
    font-size: 12px;
    color: #ed4014;
}
</style>
