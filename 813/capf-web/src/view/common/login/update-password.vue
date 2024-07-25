<template>
  <div>
   <Form ref="formValidate" :model="dataForm" :rules="dataRule" style="width:88%;margin-left: 6%" @keyup.enter.native="foegetPassword()">
      <div class="tab-title">找回密码</div>
      <FormItem prop="password">
        <Input  v-model="dataForm.password" placeholder="请输入新密码"  type="password" :maxlength="16">
          <Icon type="md-lock" slot="prefix" size="20" style="padding-top: 2px;"/>
        </Input>
      </FormItem>
      <br>
      <FormItem prop="confirmPassword">
        <Input  v-model="dataForm.confirmPassword" placeholder="请输入确认密码"  type="password" :maxlength="16">
          <Icon type="md-checkmark-circle" slot="prefix" size="20" style="padding-top: 2px;"/>
        </Input>
      </FormItem>
      <br>
      <div class="bottom-box">
        <Button @click="dataFormSubmit()" size="large" type="primary">保存</Button>
        <Button @click="back()" size="large" type="default">返回</Button>
      </div>
    </Form>
  </div>
</template>

<script>
import { updatePasswordEnterprise } from '@/api/sys/api-modules-user.js'
import CryptoJS from 'crypto-js'
export default {
  data () {
    var validateConfirmPassword = (rule, value, callback) => {
      if (this.dataForm.password !== value) {
        callback(new Error('确认密码与新密码不一致'))
      } else {
        callback()
      }
    }
    return {
      visible: false,
      dataForm: {
        password: null,
        confirmPassword: null
      },
      dataRule: {
        password: [
          { required: true, message: '请输入新密码', trigger: 'blur' },
          {
            trigger: 'blur',
            validator: (rule, value, callback) => {
              var passwordreg = /(?=.*\d)(?=.*[a-zA-Z])(?=.*[^a-zA-Z0-9]).{6,16}/
              if (!passwordreg.test(value)) {
                callback(new Error('密码必须由数字、字母、特殊字符组合,请输入6-16位'))
              }else{
                callback()
              }
            }
          }
        ],
        confirmPassword: [
          { required: true, message: '请输入确认密码', trigger: 'blur' },
          { validator: validateConfirmPassword, trigger: 'blur' }
        ]
      }
    }
  },
  props: {
    userId: {
      type: String,
      default: null
    },
    username: {
      type: String,
      default: null
    }
  },
  computed: {
  },
  methods: {
    // 初始化
    init () {
      this.visible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].resetFields()
      })
    },
    // 返回登录页面
    back() {
      this.$emit('emitChild')
    },
    // 信息加密算法
    encryptByDES(message) {
      var keyHex = CryptoJS.enc.Utf8.parse('37092119')
      var encrypted = CryptoJS.DES.encrypt(message, keyHex, {
        iv: keyHex,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7
      })
      return encrypted.toString()
    },
    // 表单提交
    dataFormSubmit () {
      this.$refs['formValidate'].validate(valid => {
        if (valid) {
          let params = {
            id: this.userId,
            username: this.encryptByDES(this.username),
            password: this.encryptByDES(this.dataForm.password)
          }
          updatePasswordEnterprise(params).then(({ data }) => {
            if (data && data.status) {
              this.$Message.success('成功修改登录密码')
              this.$router.replace({
                name: 'login'
              })
            } else {
            }
          }).catch(() => {
          })
        }
      })
    }
  }
}
</script>
<style lang="less" scoped>
.login-wrapper{
  width: 100%;
  height: 100%;
  background-size: 100% 100%;
}
.bottom-box{
  display: flex;
  justify-content: space-between;
  .ivu-btn{
    width: 49%;
    font-size: 12px;
  }
  .ivu-btn-primary{
    border: none;
    color:#fff;
    &:hover{
      color:#fff;
    }
  }
}
.ivu-btn-default:hover{
  border-color: #3C9A4C !important;
  color: #3C9A4C !important;
}
</style>
