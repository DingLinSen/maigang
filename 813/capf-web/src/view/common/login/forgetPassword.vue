<template>
  <div class="login-wrapper" :style="{ backgroundImage:'url(' + backgroundImage + ')'}">
    <div class="info-content">
      <div class="login-main">
        <div class="login-title">数字化培训平台
        </div>
        <Form ref="formValidate" :model="foegetForm" :rules="dataRule" style="width:68%;margin-left: 16%" @keyup.enter.native="foegetPassword()" v-if="isStep === '1'">
          <div class="tab-title">找回密码</div>
          <FormItem prop="userName">
            <Input  v-model.trim="foegetForm.userName" placeholder="请输入用户名">
              <Icon type="ios-contact" slot="prefix" size="20" style="padding-top: 2px;"/>
            </Input>
          </FormItem>
          <FormItem prop="email">
            <Input type="email" v-model.trim="foegetForm.email" placeholder="请输入邮箱" >
            <Icon type="ios-mail"  slot="prefix" size="20" style="padding-top: 2px;"/>
            </Input>
          </FormItem>
          <div class="bottom-box">
            <Button @click="foegetPassword()" size="large" type="primary">重置</Button>
            <Button @click="backLogin()" size="large" type="default">返回</Button>
          </div>
        </Form>
        <UpdatePassword style="width:68%;margin-left: 16%" :userId = "userId" v-if="isStep === '2'" :username="username" @emitChild="handleChild"></UpdatePassword>
      </div>
    </div>
    <p class="message">
      版权-XXXX <Divider type="vertical" />  技术支持-山东麦港数据系统有限公司
      </p>
  </div>
</template>

<script>
import { checkEmaiAndUsername } from '@/api/sys/api-modules-user.js'
import UpdatePassword from '@/view/common/login/update-password'
import CryptoJS from 'crypto-js'
export default {
  components: {
    UpdatePassword
  },
  data() {
    return {
      userId: null, // 要重置的用户的id
      username: null, //
      isStep: '1', // 1邮箱用户名，2重置密码
      foegetForm: {
        id: '',
        password: '',
        userName: '',
        email: ''
      },
      dataRule: {
        userName: [
          {
            required: true,
            message: '请输入用户名',
            trigger: 'blur'
          }
        ],
        email: [
          {
            required: true,
            message: '请输入邮箱',
            trigger: 'blur'
          }
        ]
      },
      backgroundImage: require('@/assets/images/login_bg.jpg')
    }
  },
  created() {
    this.foegetForm = {
      userName: '',
      email: ''
    }
  },
  mounted() {
    this.$Spin.hide()
  },
  methods: {
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
    // 解密算法
    decode(message) {
      var keyHex = CryptoJS.enc.Utf8.parse('37092119') // 秘钥必须为：8/16/32位
      // 解密
      var decrypt = CryptoJS.DES.decrypt(message, keyHex, {
        mode: CryptoJS.mode.CBC,
        iv: keyHex,
        padding: CryptoJS.pad.Pkcs7
      }).toString(CryptoJS.enc.Utf8)
      return decrypt
    },
    // 忘记密码
    foegetPassword() {
      let params = {
        username: this.encryptByDES(this.foegetForm.userName),
        email: this.foegetForm.email
      }
      this.$refs['formValidate'].validate(valid => {
        if (valid) {
          checkEmaiAndUsername(params).then(({ data }) => {
            if (data && data.status) {
              this.userId = data.data.userId
              this.username = this.decode(data.data.account)
              this.isStep = '2'
            } else {
            }
          }).catch(() => {
          })
        }
      })
    },
    // 返回登录页面
    backLogin() {
      this.$router.replace({
        name: 'login'
      })
    },
    // 子级取消操作
    handleChild() {
      this.isStep = '1'
    }
  }
}
</script>
<style lang="less">
@import './login.less';
</style>
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
    font-size: 12px;
    width: 49%;
  }
  .ivu-btn-primary{
    border: none;
    color:#fff;
    &:hover{
      font-size: 12px;
      color:#fff;
    }
  }
}
.ivu-btn-default:hover{
  border-color: #3C9A4C !important;
  color: #3C9A4C !important;
}
</style>
