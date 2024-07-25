<template>
  <!-- :style="{ backgroundImage: 'url(' + backgroundImage + ')' }" -->
  <div class="login-wrapper">
    <div class="login-top">
      <p><img src="@/assets/images/common/logo.png" />数字化培训平台</p>
    </div>
    <div class="login-content">
      <div class="content-left">
        <div class="info-content">
          <div class="login-main">
            <div class="login-title">
              <p>欢迎登录数字化培训平台</p>
              <p>简单高效，在线学习，智能测试</p>
            </div>
            <Form
              ref="formValidate"
              :model="loginForm"
              :rules="dataRule"
              style=""
              @keyup.enter.native="userSubmitLogin()"
            >
              <FormItem prop="userName">
                <Input v-model="loginForm.userName" placeholder="请输入用户名">
                  <img
                    src="@/assets/images/user_icon.png"
                    slot="prefix"
                    alt=""
                    style="padding-top: 9px"
                  />
                </Input>
              </FormItem>
              <FormItem prop="password">
                <Input
                  type="password"
                  v-model="loginForm.password"
                  placeholder="请输入密码"
                >
                  <img
                    src="@/assets/images/password_icon.png"
                    slot="prefix"
                    alt=""
                    style="padding-top: 9px"
                  />
                </Input>
              </FormItem>
              <!--            <FormItem prop="captcha">-->
              <!--              <Input-->
              <!--                v-model="loginForm.captcha"-->
              <!--                placeholder="请输入验证码"-->
              <!--                style="width: 64%"-->
              <!--              >-->
              <!--                <img-->
              <!--                  src="@/assets/images/yzm_icon.png"-->
              <!--                  slot="prefix"-->
              <!--                  alt=""-->
              <!--                  style="padding-top: 9px"-->
              <!--                />-->
              <!--              </Input>-->
              <!--              <img-->
              <!--                :src="captchaPath"-->
              <!--                alt="换一换"-->
              <!--                class="code-img"-->
              <!--                @click="initCaptcha()"-->
              <!--              />-->
              <!--            </FormItem>-->
              <!-- <div class="bottom-box">
              <Checkbox v-model="isRemember">
                <span>记住密码</span>
              </Checkbox>
            </div> -->
              <Button
                class="login-btn"
                @click="userSubmitLogin()"
                size="large"
                type="primary"
                >登录</Button
              >
            </Form>
          </div>
        </div>
      </div>
      <div class="content-right">
        <img src="@/assets/images/common/login_pic.png" alt="" />
      </div>
    </div>
    <div class="login-bottom">
      <p>Copyright@{{ nowYear }} 数字化培训平台 V1.0.0</p>
    </div>
    <!--
    <p class="message">
      版权 - XXXX - {{ nowYear }} <Divider type="vertical" /> 技术支持 - XXXX
    </p> -->
  </div>
</template>

<script>
// import axios from 'axios'
import CryptoJS from 'crypto-js'
import { userLogin } from '@/api/api-base.js'
export default {
  data() {
    return {
      loginForm: {
        userName: '',
        password: '',
        captcha: ''
      },
      dataRule: {
        userName: [
          {
            required: true,
            message: '请输入用户名',
            trigger: 'blur'
          }
        ],
        password: [
          {
            required: true,
            message: '请输入密码',
            trigger: 'blur'
          }
        ],
        captcha: [
          {
            required: true,
            message: '请输入验证码',
            trigger: 'blur'
          }
        ]
      },
      captchaPath: '', // 验证码图片
      backgroundImage: require('@/assets/images/login_bg.jpg'),
      isRemember: false, // 是否记住密码
      rememberData: {
        userName: null,
        password: null
      },
      nowYear: ''
    }
  },
  created() {
    this.nowYear = this.$moment(new Date()).format('YYYY')
    this.initCaptcha()
    this.loginForm = {
      userName: '',
      password: '',
      captcha: ''
    }
    this.$cookie.set(this.CONST_VALUE.TOKEN, '')
    this.$cookie.set('loginUserInfo', [])
  },
  mounted() {
    sessionStorage.setItem('testStep', 1)
    sessionStorage.setItem('checkPaparId', null)
    sessionStorage.setItem('controlData', '')
    this.$Spin.hide()
    this.$cookie.set('loginUserInfo', [])
    this.$cookie.set(this.CONST_VALUE.TOKEN, '')
    this.getCookie()
  },
  methods: {
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
    // 设置cookie
    setCookie(username, password, exdays) {
      var exdate = new Date() // 获取时间
      exdate.setTime(exdate.getTime() + 24 * 60 * 60 * 1000 * exdays) // 保存的天数
      // 字符串拼接cookie
      window.document.cookie =
        'userName' + '=' + username + ';path=/;expires=' + exdate.toGMTString()
      window.document.cookie =
        'userPwd' +
        '=' +
        this.encryptByDES(password) +
        ';path=/;expires=' +
        exdate.toGMTString()
      window.document.cookie =
        'isRemember' +
        '=' +
        this.isRemember +
        ';path=/;expires=' +
        exdate.toGMTString()
    },
    getCookie() {
      this.isRemember = false
      var self = this
      if (document.cookie.length > 0) {
        var arr = document.cookie.split('; ') // 这里显示的格式需要切割一下自己可输出看下
        for (var i = 0; i < arr.length; i++) {
          var arr2 = arr[i].split('=') // 再次切割
          // 判断查找相对应的值
          if (arr2[0] === 'userName') {
            this.rememberData.userName = arr2[1] || '' // 保存到保存数据的地方
          } else if (arr2[0] === 'userPwd') {
            this.rememberData.password = arr2[1] || ''
          } else if (arr2[0] === 'isRemember') {
            this.isRemember = arr2[1] === 'true'
          }
        }
        if (this.isRemember) {
          if (this.rememberData.userName) {
            this.loginForm.userName = this.rememberData.userName // 保存到保存数据的地方
            this.loginForm.password = this.decode(this.rememberData.password)
          }
        } else {
          this.rememberData = {
            userName: null,
            password: null
          }
          self.clearCookie()
        }
      }
    },
    userSubmitLogin() {
      const self = this
      // 判断复选框是否被勾选 勾选则调用配置cookie方法
      if (self.isRemember === true) {
        // 传入账号名，密码，和保存天数3个参数
        self.setCookie(this.loginForm.userName, this.loginForm.password, 7)
      } else {
        // 清空Cookie
        self.clearCookie()
      }
      // 登录事件
      var encryptName = this.encryptByDES(this.loginForm.userName)
      var encryptPsw = this.encryptByDES(this.loginForm.password)
      let params = {
        username: encryptName,
        password: encryptPsw,
        validateCode: this.loginForm.captcha
      }
      // isNotAssessToday 今天是否有考核 1考核  0 没有考核  如果有的话
      this.$refs['formValidate'].validate(valid => {
        if (valid) {
          userLogin(params)
            .then(res => {
              if (res.data && res.data.status) {
                let data = res.data
                this.$cookie.set(this.CONST_VALUE.TOKEN, data.data.token)
                this.$Message.success('登录成功')
                // 判断今天是否有考试，如若有考试半个小时内进入考试页面
                let nowDate = new Date().getTime()
                let startTime = new Date(data.data.startTime).getTime()
                // if(data.data.isNotAssessToday && (nowDate > startTime || startTime - nowDate <= 1800000) && data.data.terminalId && data.data.terminalId !== 'null') {
                if (
                  data.data.isNotAssessToday &&
                  (nowDate > startTime || startTime - nowDate <= 1800000)
                ) {
                  this.$router.replace({
                    name: 'test'
                  })
                } else {
                  this.$router.replace({
                    name: 'home'
                  })
                }
                var userLogin = {
                  userId: data.data.id,
                  name: data.data.name,
                  token: data.data.token,
                  lastLoginTime: data.data.lastLoginTime,
                  roleId: data.data.roleIdList.toString(),
                  username: data.data.username,
                  deptId: data.data.deptId,
                  roleName: data.data.roleName,
                  deptName: data.data.deptName,
                  isNotAssessToday: data.data.isNotAssessToday,
                  startTime: data.data.startTime,
                  assId: data.data.assId,
                  terminalId: data.data.terminalId
                }
                this.$cookie.set(
                  this.CONST_VALUE.LOGIN_USER_INFO,
                  JSON.stringify(userLogin)
                )
                sessionStorage.setItem(
                  'roleId',
                  JSON.stringify(data.data.roleIdList.join() || '')
                )
                sessionStorage.setItem(
                  'faceId',
                  JSON.stringify(data.data.faceId || '')
                )
              } else {
                // this.$Message.error(res.data.msg)
                this.initCaptcha()
              }
            })
            .catch(() => {})
        }
      })
    },
    // 清除cookie
    clearCookie: function () {
      this.setCookie('', '', -1) // 修改2值都为空，天数为负1天就好了
    },

    initCaptcha() {
      // 获取验证码
      this.captchaPath =
        window.SITE_CONFIG.baseUrl +
        'validateCode/registValidateCode' +
        '?t=' +
        new Date().getTime()
    },
    // 选择角色权限
    selRoleType() {}
  },
  beforeDestroy() {
    this.setCookie(this.loginForm.userName, this.loginForm.password, 7)
  }
}
</script>
<style lang="less">
@import './login.less';
</style>
<style lang="less" scoped>
.login-wrapper {
  width: 100%;
  height: 100%;
  background-size: 100% 100%;
}
/deep/.pawIpt {
  -webkit-text-security: disc;
  text-security: disc;
}

/deep/.ivu-icon-md-lock {
  -webkit-text-security: none;
  text-security: none;
}
.bottom-box {
  display: flex;
  // justify-content: space-between;
  span,
  a {
    color: black;
    font-size: 12px;
  }
  margin-bottom: 20px;
}
</style>
