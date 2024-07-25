<template>
  <Form ref="loginForm" :model="form" :rules="rules" @keydown.enter.native="handleSubmit">
    <FormItem prop="userName">
      <Input v-model="form.userName" placeholder="请输入用户名">
        <span slot="prepend">
          <Icon :size="16" type="ios-person"></Icon>
        </span>
      </Input>
    </FormItem>
    <FormItem prop="password">
      <Input type="password" v-model="form.password" placeholder="请输入密码">
        <span slot="prepend">
          <Icon :size="14" type="md-lock"></Icon>
        </span>
      </Input>
    </FormItem>
    <FormItem prop="code" style="position: relative;">
      <Input v-model="form.code" placeholder="请输入验证码">
        <span slot="prepend">
          <Icon :size="14" type="ios-barcode-outline"></Icon>
        </span>
      </Input>
      <img :src="codeImg" class="code-image" @click="initCodeImg()" />
    </FormItem>
    <FormItem>
      <Button @click="handleSubmit" type="primary" long>登录</Button>
    </FormItem>
  </Form>
</template>
<script>
import urlConfig from '@root/config/url_list'
export default {
  name: 'LoginForm',
  mounted() {
    this.initCodeImg()
  },
  props: {
    userNameRules: {
      type: Array,
      default: () => {
        return [
          { required: true, message: '账号不能为空', trigger: 'blur' }
        ]
      }
    },
    passwordRules: {
      type: Array,
      default: () => {
        return [
          { required: true, message: '密码不能为空', trigger: 'blur' }
        ]
      }
    },
    code: {
      type: Array,
      default: () => {
        return [
          { required: true, message: '请输入验证码', trigger: 'blur' }
        ]
      }
    }
  },
  data () {
    return {
      codeImg: null,
      form: {
        code: null,
        userName: null,
        password: null // 'abc123!@'
      }
    }
  },
  computed: {
    rules () {
      return {
        code: this.code,
        userName: this.userNameRules,
        password: this.passwordRules
      }
    }
  },
  methods: {
    initCodeImg() {
      this.codeImg = urlConfig + 'code.do?t=' + (new Date()).getTime()
    },
    handleSubmit () {
      this.$refs.loginForm.validate((valid) => {
        if (valid) {
          this.$emit('on-success-valid', {
            userName: this.form.userName,
            password: this.form.password,
            code: this.form.code
          })
        }
      })
    }
  }
}
</script>
<style>
.code-image {
  position: absolute;
  /* display: inline-block; */
  right: 3px;
  top: 5px;
  z-index: 1000;
  cursor: pointer;
}
</style>
