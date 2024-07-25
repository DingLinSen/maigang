<template>
  <Form ref="FormPWD" :model="FormPWD" :rules="ruleCustom" label-position="top">
    <FormItem label="原密码" prop="oldPassword">
      <Input
        type="text"
        v-model="FormPWD.oldPassword"
        class="pawIpt"
        :maxlength="16"
        placeholder="请输入原密码"
      >
        <Icon type="ios-time-outline" slot="prepend" />
      </Input>
    </FormItem>
    <FormItem label="新密码" prop="password" style="margin-b">
      <Input
        type="text"
        v-model="FormPWD.password"
        class="pawIpt"
        :maxlength="16"
        placeholder="请输入新密码"
      >
        <Icon type="ios-lock-outline" slot="prepend" />
      </Input>
    </FormItem>
    <FormItem label="确认密码" prop="passwdCheck">
      <Input
        type="text"
        v-model="FormPWD.passwdCheck"
        class="pawIpt"
        :maxlength="16"
        placeholder="请输入确认密码"
      >
        <Icon type="md-checkmark-circle-outline" slot="prepend" />
      </Input>
    </FormItem>
    <FormItem style="text-align: center"
      ><br />
      <Button type="success" @click="handleSubmit('FormPWD')">确认修改</Button>
      <Button @click="handleReset('FormPWD')" style="margin-left: 8px"
        >重置信息</Button
      >
    </FormItem>
  </Form>
</template>
<script>
import { clearLoginInfo } from '@/utils'
import { changePassword } from '@/api/sys/api-modules-user'
import CryptoJS from 'crypto-js'
export default {
  props: {
    showEditPWD: {
      default: null,
      type: Boolean
    }
  },
  watch: {
    showEditPWD: function () {
      this.handleReset('FormPWD')
    }
  },
  data() {
    const validatePass = (rule, value, callback) => {
      if (value === '' || !value) {
        callback(new Error('请输入新密码'))
      } else if (value) {
        var pattern = /(?=.*\d)(?=.*[a-zA-Z])(?=.*[^a-zA-Z0-9]).{6,16}/
        if (pattern.test(value)) {
          if (value.indexOf(' ') === -1) {
            callback()
          } else {
            callback(new Error('密码不能包含空格'))
          }
        } else {
          callback(new Error('密码必须由数字、字母、特殊字符组合,请输入6-16位'))
        }
      } else if (value === this.FormPWD.oldPassword) {
        callback(new Error('新密码不能原密码相同'))
      } else {
        callback()
      }
    }
    const validatePassCheck = (rule, value, callback) => {
      if (value === '' || !value) {
        callback(new Error('请输入确认密码'))
      } else if (value !== this.FormPWD.password) {
        callback(new Error('两次密码不一致'))
      } else {
        callback()
      }
    }
    return {
      FormPWD: {
        // 表单数据
        oldPassword: null,
        passwdCheck: null,
        password: null
      },

      ruleCustom: {
        oldPassword: [
          { required: true, message: '请输入原密码', trigger: 'blur' }
        ],
        password: [
          { required: true, validator: validatePass, trigger: 'blur' }
        ],
        passwdCheck: [
          { required: true, validator: validatePassCheck, trigger: 'blur' }
        ]
      }
    }
  },
  computed: {
    username: {
      get() {
        if (this.$store.state.user) {
          return this.$store.state.user.username
        } else {
          return ''
        }
      }
    }
  },
  mounted() {},
  methods: {
    openModel() {},
    // 加密函数
    encryptByDES(message) {
      var keyHex = CryptoJS.enc.Utf8.parse('37092119')
      var encrypted = CryptoJS.DES.encrypt(message, keyHex, {
        iv: keyHex,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7
      })
      return encrypted.toString()
    },
    // 提交操作
    handleSubmit(name) {
      this.$refs[name].validate(valid => {
        if (valid) {
          var userName = this.encryptByDES(this.username)
          let params = {
            username: userName,
            oldPassword: this.encryptByDES(this.FormPWD.oldPassword),
            newPassword: this.encryptByDES(this.FormPWD.password)
          }
          changePassword(params)
            .then(res => {
              console.log(res)
              if (res.data.status) {
                clearLoginInfo()
                sessionStorage.removeItem('store')
                sessionStorage.setItem('menuList', '[]')
                sessionStorage.setItem('permissions', '[]')
                this.$store.dispatch('user/handleLogOut')
                sessionStorage.setItem('roleId', '')
                this.$router.options.isAddDynamicMenuRoutes = false
                this.$refs.FormPWD.resetFields()
                this.$router.push('/login')
                this.$Message.success('成功修改登录密码')
              } else {
                this.$Message.error(res.data.msg)
                this.FormPWD.oldPassword = ''
                this.FormPWD.newPassword = ''
              }
            })
            .catch(() => {})
        } else {
          this.$Message.error('请根据提示信息补全提交的内容信息')
        }
      })
    },
    handleReset(name) {
      this.$refs[name].resetFields()
    }
  }
}
</script>
<style scoped></style>
<style lang="less" scoped>
.pawIpt {
  -webkit-text-security: disc;
  text-security: disc;
}
/deep/.ivu-icon {
  -webkit-text-security: none;
  text-security: none;
}
/deep/.ivu-btn:hover {
  color: #29a387;
  border: 1px solid #29a387;
}
/deep/.ivu-btn-success {
  background: #29a387 !important;
  &:hover {
    background: #29a387 !important;
    color: #ffffff;
  }
}
</style>
