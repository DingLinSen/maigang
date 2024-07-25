 <!-- /**
  * @description 用户管理-编辑页面
  * @author yxm
  * @date 2021-10-19
  */ -->
<template>
  <div class="details-container">
    <div class="typemodel" v-if="!isPassword" style="height:100%">
      <div class="details-title">
        <p>{{isPassword ? '重置用户登录密码' : (isSee ? '查看' + routerTitle + '信息' : (!isOperate ? '新增' + routerTitle + '信息' : '编辑' + routerTitle + '信息'))}}</p><Icon type="md-close" @click.stop="handleCancleModel"/>
      </div>
      <div class="details-content">
        <Form :model="formData" ref="formValidate" :rules="formValidate">
          <Row :gutter="32">
            <Col span="12">
              <FormItem label="人员姓名" label-position="top" prop="name">
                <Input
                  type="text"
                  v-model.trim="formData.name"
                  placeholder="请输入人员姓名"
                  ref="name"
                  :maxlength="6"
                  :disabled="isSee"
                />
              </FormItem>
            </Col>
            <Col span="12">
              <FormItem label="所属单位" label-position="top" prop="dept">
                <Cascader :data="deptList" v-model="formData.dept" placeholder="请选择所属单位"
                :props="{ checkStrictly: true }"
                :disabled="isSee || isOperate"  @on-change="selDept" style="width:100%" :clearable="false" change-on-select></Cascader>
              </FormItem>
            </Col>
          </Row>
          <Row :gutter="32" index="">
            <Col span="12">
              <FormItem label="用户名" label-position="top" prop="username">
                <Input
                  type="text"
                  v-model.trim="formData.username"
                  placeholder="请输入用户名"
                  ref="username"
                  :maxlength="20"
                  :disabled="isSee || isOperate"
                />
              </FormItem>
            </Col>
            <Col span="12">
              <FormItem label="用户角色" label-position="top" prop="roleId">
                <Select v-model="formData.roleId" name="select" ref="roleId"  remote :clearable='false' placeholder="请选择用户角色" :disabled="isSee || isOperate">
                  <Option v-for="item in roleList" :value="item.id" :key="item.id" :label="item.roleName"></Option>
                </Select>
              </FormItem>
            </Col>
          </Row>
          <Row :gutter="32">

            <Col span="12">
              <FormItem label="联系电话" label-position="top" prop="mobile">
                <Input
                  type="text"
                  v-model.trim="formData.mobile"
                  placeholder="请输入联系电话"
                  ref="mobile"
                  :maxlength="13"
                  :disabled="isSee"
                />
              </FormItem>
            </Col>

          </Row>
          <Row :gutter="32">
             <Col span="12">
              <FormItem label="指纹信息1" label-position="top" prop="fingerprintOne">
                <Button type="primary" id="EnrollBtnANSI" size="small" @click="beginOperation('enroll', 'ansisdk', false, 1)" v-if="!isSee && (operating === 'Win32' || operating === 'Win64')">录入指纹</Button>
                 <Button type="primary" size="small" @click="beginVerifyCapture(1)" v-if="(operating === 'Linux aarch32' || operating === 'Linux aarch64') && !isSee">录入指纹</Button>
                <div style="margin-top: 34px;">
                  <p class="c-primary" style="margin-left: 10px" >{{formData.fingerprintOne ? '已录入指纹' : '暂无指纹信息'}}</p>
                  <p class="c-primary" style="margin-left: 10px" v-if="fingerStep === 1">{{textResult}}</p>
                </div>
                <div id="image">
                  <canvas id="fingerframe" height="0" width="320"></canvas>
                </div>
                <div id="footer">
                  <p id="result"></p>
                </div>
                <div id="resultLinks">
                  <a id="resultLink" href="" rel="external" media="application/octet-stream">
                  </a>
                </div>
              </FormItem>
            </Col>
            <Col span="12">
              <FormItem label="指纹信息2" label-position="top" prop="fingerprintTwo">
                 <Button type="primary" id="EnrollBtnANSITwo" size="small" @click="beginOperation('enroll', 'ansisdk', false, 2)" v-if="!isSee && (operating === 'Win32' || operating === 'Win64')">录入指纹</Button>
                 <Button type="primary" size="small" @click="beginVerifyCapture(2)" v-if="(operating === 'Linux aarch32' || operating === 'Linux aarch64') && !isSee">录入指纹</Button>
                <div style="margin-top: 34px;">
                  <p class="c-primary" style="margin-left: 10px" >{{formData.fingerprintTwo ? '已录入指纹' : '暂无指纹信息'}}</p>
                  <p class="c-primary" style="margin-left: 10px" v-if="fingerStep === 2">{{textResult}}</p>
                </div>
                <div id="image">
                  <canvas id="fingerframe" height="0" width="320"></canvas>
                </div>
                <div id="footer">
                  <p id="result"></p>
                </div>
                <div id="resultLinks">
                  <a id="resultLink" href="" rel="external" media="application/octet-stream">
                  </a>
                </div>
              </FormItem>
            </Col>
          </Row>
          <Row :gutter="32">
             <Col span="24">
              <FormItem label="人脸信息" label-position="top" prop="faceId">
                <Button type="primary" size="small" v-if="!isSee" @click="getCompetence()">打开摄像头</Button>
                <Button type="primary" size="small" v-if="!isSee && isCamera"  @click="stopNavigator()">关闭摄像头</Button>
                <Button type="primary" size="small" v-if="!isSee && isCamera && isImage" @click="setImage()" >拍照</Button>
                <div class="camera_outer" style="display: flex; margin-top: 34px">
                  <video id="videoCamera" autoplay v-if="showCamera"></video>
                  <img :src="cameraUrl" alt="" style="margin-left: 10px">
                  <canvas style="display:none;" id="canvasCamera" :width="videoWidth" :height="videoHeight" ></canvas>
                  <div style="margin-top:0.1rem">
                  </div>
                </div>
              </FormItem>
            </Col>
          </Row>
          <Row :gutter="32">

          </Row>
        </Form>
        <div class="demo-drawer-footer" style="text-align: center;">
          <Button type="primary" @click="handleValidate"  v-if="!isSee">确认{{ !isOperate ? '新增' : '编辑' }}</Button>
          <Button type="default" class="mar-lft-10" @click.stop="handleCancleModel">取消操作</Button
          >
        </div>
      </div>
    </div>
    <div width="400" v-if="isPassword" style="height:100%">
      <div class="details-title">
        <p>修改登录密码</p><Icon type="md-close" @click.stop="handleCancleModel"/>
      </div>
      <div class="details-content">
        <Form :model="formData" ref="formValidate" :rules="formValidate">
          <Row :gutter="32" style="height:50vh;">
            <Col span="24">
              <FormItem style="width:100%" label="新密码" label-position="top" prop="newpassword">
                <Input type="text" :maxlength="16"  v-model="formData.newpassword" placeholder="请输入新密码" />
              </FormItem>
            </Col>
          </Row>
        </Form>
        <div class="demo-drawer-footer" style="text-align: center;">
          <Button type="primary" @click="handleValidate"  v-if="!isSee">确认{{ !isOperate ? '新增' : '编辑' }}</Button>
          <Button type="default" class="mar-lft-10" @click.stop="handleCancleModel">取消操作</Button
          >
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { operateUserInfo, initUserDetailsById } from '@/api/sys/api-modules-user'
import { initAllDeptList } from '@/api/sys/api-modules-dept'
import { OPERATE_PAGE } from '@/libs/mixin'
import { initAllRoleList } from '@/api/sys/api-modules-role'
import { sortByKey, clearLoginInfo, treeDataTranslate } from '@/utils'
import formDataInfo from './form'
import RulesValidate from './form-validate'
import CryptoJS from 'crypto-js'
import axios from 'axios'
export default {
  mixins: [OPERATE_PAGE],
  data() {
    return {
      showDrawer: false,
      formData: formDataInfo(),
      formValidate: RulesValidate(this),
      deptList: [], // 所属单位
      roleList: [], // 用户角色数组
      isOperateMobile: null, // 编辑时的联系电话
      fpHTTSrvOpEP: 'http://127.0.0.1:15170/fpoperation',
      textResult: null,
      btnEnrollAnsi: null,
      sampleNumList: null,
      fingerFra: null,
      lastInitOp: null,
      resultLink: null,
      btnEnrollAnsiTwo: null, // 第二个指纹信息
      // 摄像头相关
      cameraUrl: null,
      videoWidth: 400,
      videoHeight: 255,
      thisCancas: null,
      thisContext: null,
      thisVideo: null,
      showCamera: false,
      fingerStep: 1, // 第几个指纹
      operating: null,
      hostIpLinux: 'http://127.0.0.1',
      isCamera: false, // 是否有摄像设备
      isImage: false
    }
  },
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
    // 是否可修改密码
    isPassword: {
      default: null,
      type: Boolean
    }
  },
  computed: {
    userId: {
      get() {
        if (this.$store.state.user) {
          return this.$store.state.user.userId
        } else {
          return ''
        }
      }
    }
  },
  watch: {
    showDrawer: function() {
    }
  },
  activated() {
    if(this.lastInitOp) {
      this.cancelOperation()
    }
    this.initFormData()
    this.fingerFrame = null
    if(this.operating === 'Win32' || this.operating === 'Win64') {
      this.textResult = ''
      this.fingerStep = 1
      this.onBodyLoad()
    }else{
      this.cancelCapture()
    }
  },
  mounted() {
    this.operating = navigator.platform
    this.fpHTTSrvOpEP = window.SITE_CONFIG.fpHTTSrvOpEP
    this.hostIpLinux = window.SITE_CONFIG.fpHTTSrvOpEPLinux
    this.isCamera = false
    if(this.operating === 'Win32' || this.operating === 'Win64') {
      this.textResult = ''
      this.fingerStep = 1
      this.onBodyLoad()
    }else{
      this.cancelCapture()
    }
  },
  methods: {
    // 初始化用户角色
    initRoleList() {
      initAllRoleList().then((res) => {
        if(res.status) {
          this.roleList = sortByKey(res.data.data, 'orderNum')
        }
      }).catch(() => {
      })
      initAllDeptList()
        .then(res => {
          if (res.data.status) {
            var data = res.data.data
            // 0正常 1停用
            // let deptList = data.filter(item => item.status === '0')
            let deptList = []
            data.forEach(item => {
              if(item.status === '0') {
                deptList.push({
                  ...item,
                  value: item.deptId,
                  label: item.deptName
                })
              }
            })
            this.deptList = treeDataTranslate(deptList, 'deptId')
          } else {
          }
        })
        .catch(() => {
          this.loading = false
        })
    },
    // 初始化表单
    initFormData() {
      this.textResult = ''
      this.cameraUrl = ''
      this.showCamera = false
      this.isCamera = false
      this.initRoleList()
      this.handleReset() // 重置表单
      let params = {
        id: this.detailsId
      }
      this.$nextTick(() => {
        this.formData = formDataInfo()
        if (this.isOperate) {
          initUserDetailsById(params).then(res => {
            if (res.data.status) {
              var data = res.data.data
              if (data == null) {
                this.handleCancleModel()
                return
              }
              this.formData = data
              this.formData.roleId = (data.userRoleList && data.userRoleList.length) ? data.userRoleList[0].roleId : ''
              let levelDept = []
              this.cameraUrl = data.faceId ? data.faceId : ''
              if(data.levelDept) {
                levelDept = data.levelDept.split(',')
                if(data.deptId) {
                  levelDept.push(data.deptId)
                  if(levelDept.length && levelDept[0] === '0') {
                    levelDept = levelDept.splice(1, levelDept.length - 1)
                    this.formData.dept = levelDept
                  }
                }
              }

              this.isOperateMobile = data.mobile
            } else {
              this.formData = formDataInfo()
            }
          }).catch(() => {
          })
        }else{
        }
      })
    },
    // 提交按钮
    handleSubmit() {
      if (this.isPassword) {
        this.changePassword()
      } else {
        this.saveOperateInfo()
      }
    },
    // 打开抽屉框
    openModel() {
      this.showDrawer = true
      this.initFormData()
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
    // 保存信息  （添加和编辑）
    saveOperateInfo() {
      var roleList = []
      var encryptUsername = this.encryptByDES(this.formData.username)
      if(this.formData.roleId !== null) {
        roleList.push(this.formData.roleId)
      }
      let params = Object.assign(
        { ...this.formData },

        {
          userRoleList: [],
          roleIdList: roleList,
          isOperate: this.isOperate,
          username: encryptUsername
        }
      )
      Object.keys(this.formData).forEach((item, index) => {
        if (!params[item]) {
          if (this.formData[item]) {
            params[item] = ((this.formData[item] || null) + '').trim()
          }
        }
      })
      params.userRoleList.push({
        roleId: this.formData.roleId})
      if(this.isOperate) {
        delete params.username
        this.formData.mobile = this.formData.mobile === this.isOperateMobile ? null : this.formData.mobile
      }
      delete params.password
      if(this.isOperate) {
        delete params.username
      }
      operateUserInfo(params).then(res => {
        this.$Spin.hide()
        if (res.data.status) {
          this.$Message.success('成功保存信息')
          this.handleCancleModel()
          this.$nextTick(() => {
            this.$emit('operateSuccess', params)
          })
        } else {
        }
      }).catch(() => {
      })
    },
    // 修改用户密码
    changePassword() {
      var roleList = []
      if(this.formData.roleId !== null) {
        roleList.push(this.formData.roleId)
      }
      // var encryptUsername = this.encryptByDES(this.formData.username)
      var encryptPassword = this.encryptByDES(this.formData.newpassword)
      let params = {
        id: this.formData.id || undefined,
        // username: encryptUsername,
        password: encryptPassword,
        isOperate: this.isOperate
      }
      var formUserId = this.formData.id // 判断修改的是当请登录的用户,若是当前登陆用户清楚用户信息跳转登录页面
      operateUserInfo(params).then(res => {
        this.$Spin.hide()
        if (res.data.status) {
          this.handleCancleModel()
          this.$Spin.hide()
          this.$Message.success('成功修改登录密码')
          if (this.userId === formUserId) {
            clearLoginInfo()
            sessionStorage.removeItem('store')
            sessionStorage.setItem('menuList', '[]')
            sessionStorage.setItem('permissions', '[]')
            this.$store.dispatch('user/handleLogOut')
            this.$router.options.isAddDynamicMenuRoutes = false
            this.$cookie.set('loginUserInfo', [])
            this.$router.push('/login')
          }
          this.$nextTick(() => {
            this.$emit('operateSuccess', params)
          })
        } else {
          this.$Spin.hide()
        }
      }).catch(() => {
      })
    },
    // 选择部门
    selDept(value) {
      if(value && value.length > 0) {
        this.formData.deptId = value[value.length - 1]
      }else if(value.length === 0) {
        this.formData.deptId = ''
      }else{
        this.formData.deptId = ''
      }
    },
    handleResetSub() {
      if(this.isOperate) {
        var username = this.formData.username
        if (this.$refs['formValidate']) {
          this.$refs['formValidate'].resetFields()
        }
        this.formData.username = username
      }else{
        if (this.$refs['formValidate']) {
          this.$refs['formValidate'].resetFields()
        }
      }
    },
    // ===============拍照==============================
    // 调用权限（打开摄像头功能）
    getCompetence () {
      this.showCamera = true
      setTimeout(() => {
        var _this = this
        this.thisCancas = document.getElementById('canvasCamera')
        this.thisContext = this.thisCancas.getContext('2d')
        this.thisVideo = document.getElementById('videoCamera')
        // 旧版本浏览器可能根本不支持mediaDevices，我们首先设置一个空对象
        if (navigator.mediaDevices === undefined) {
          navigator.mediaDevices = {}
        }
        // 一些浏览器实现了部分mediaDevices，我们不能只分配一个对象
        // 使用getUserMedia，因为它会覆盖现有的属性。
        // 这里，如果缺少getUserMedia属性，就添加它。
        if (navigator.mediaDevices.getUserMedia === undefined) {
          navigator.mediaDevices.getUserMedia = function (constraints) {
            // 首先获取现存的getUserMedia(如果存在)
            var getUserMedia = navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.getUserMedia
            // 有些浏览器不支持，会返回错误信息
            // 保持接口一致
            if (!getUserMedia) {
              _this.isCamera = false
              return Promise.reject(new Error('getUserMedia is not implemented in this browser'))
            }else{
            }
            // 否则，使用Promise将调用包装到旧的navigator.getUserMedia
            return new Promise(function (resolve, reject) {
              getUserMedia.call(navigator, constraints, resolve, reject)
            })
          }
        }
        var constraints = { audio: false, video: { width: this.videoWidth, height: this.videoHeight, transform: 'scaleX(-1)' } }
        navigator.mediaDevices.getUserMedia(constraints).then(function (stream) {
          // 旧的浏览器可能没有srcObject
          if ('srcObject' in _this.thisVideo) {
            _this.thisVideo.srcObject = stream
          } else {
            // 避免在新的浏览器中使用它，因为它正在被弃用。
            _this.thisVideo.src = window.URL.createObjectURL(stream)
          }
          _this.thisVideo.onloadedmetadata = function (_e) {
            _this.thisVideo.play()
            _this.isCamera = true
            _this.isImage = true
          }
        }).catch(_err => {
          if(_err) {
            _this.$Message.error('请检查摄像设备是否连接正常')
          }
        })
      }, 10)
    },
    //  绘制图片（拍照功能）
    setImage () {
      var _this = this
      // 点击，canvas画图
      _this.thisContext.drawImage(_this.thisVideo, 0, 0, _this.videoWidth, _this.videoHeight)
      // 获取图片base64链接
      var image = this.thisCancas.toDataURL('image/png')
      // _this.imgSrc = image
      this.$refs['formValidate'].fields.forEach(function (e) {
        if (e.prop === 'faceId') {
          e.resetField()
        }
      })
      this.$nextTick(() => {
        this.cameraUrl = image
        this.formData.faceId = image
      })
    },
    // base64转文件
    dataURLtoFile (dataurl, filename) {
      var arr = dataurl.split(',')
      var mime = arr[0].match(/:(.*?);/)[1]
      var bstr = atob(arr[1])
      var n = bstr.length
      var u8arr = new Uint8Array(n)
      while (n--) {
        u8arr[n] = bstr.charCodeAt(n)
      }
      return new File([u8arr], filename, { type: mime })
    },
    // 关闭摄像头
    stopNavigator () {
      this.isImage = false
      if(this.thisVideo) {
        this.thisVideo.srcObject.getTracks()[0].stop()
      }
    },
    // ======================录入指纹======================
    // 将数据转换为base64格式
    arrayBufferToBase64(buf) {
      var binary = ''
      var bytes = buf
      var len = bytes.byteLength
      for (var i = 0; i < len; i++) {
        binary += String.fromCharCode(bytes[ i ])
      }
      return window.btoa(binary)
    },

    // 显示字符穿
    submitForm(data) {
      var templateBase64 = this.arrayBufferToBase64(data)
      if(this.fingerStep === 1) {
        this.$refs['formValidate'].fields.forEach(function (e) {
          if (e.prop === 'fingerprintOne') {
            e.resetField()
          }
        })
        this.formData.fingerprintOne = templateBase64
      }else if (this.fingerStep === 2) {
        this.formData.fingerprintTwo = null
        this.$refs['formValidate'].fields.forEach(function (e) {
          if (e.prop === 'fingerprintTwo') {
            e.resetField()
          }
        })
        this.formData.fingerprintTwo = templateBase64
      }
    },

    // 开始录入指纹
    beginOperation(opName, libName, sendSampleNum, step) {
      this.fingerStep = step
      if(step === 1) {
        this.formData.fingerprintOne = null
      }else if (step === 2) {
        this.formData.fingerprintTwo = null
      }
      var _this = this
      var sampleNum = '1'
      if(sendSampleNum) {
        sampleNum = this.sampleNumList.value

        var checkNum = parseInt(sampleNum)

        if(checkNum < 1 || checkNum > 10 || sampleNum === '') {
          this.$Message.error('Invalid number of samples')
          return
        }
      }

      var json = JSON.stringify({
        operation: opName, username: '', usedlib: libName, isoconv: '0', samplenum: sampleNum })
      this.enableControlsForOp(true)
      this.resultLink.innerHTML = ''

      var req = new XMLHttpRequest()
      req.open('POST', this.fpHTTSrvOpEP)
      req.setRequestHeader('Content-type', 'application/json; charset=utf-8')

      req.onload = function() {
        if (req.status === 200) {
          _this.textResult = '开始录入...'
          _this.parseOperationDsc(JSON.parse(req.response))
        } else {
          this.$Message.error('Server response')
          _this.enableControlsForOp(false)
        }
      }
      req.onerror = function() {
        _this.$Message.error('FPHttpServer not available')
        _this.enableControlsForOp(false)
      }
      req.send(json)
    },

    // 开始
    getOperationState(opId) {
      var _this = this
      var url = this.fpHTTSrvOpEP + '/' + opId
      var req = new XMLHttpRequest()
      req.open('GET', url)
      req.onload = function() {
        if (req.status === 200) {
          if(req.readyState === 4) {
            _this.parseOperationDsc(JSON.parse(req.response))
          }
        } else {
          _this.$Message.error('Server response')
          _this.enableControlsForOp(false)
        }
      }
      req.onerror = function() {
        _this.$Message.error('FPHttpServer not available')
        _this.enableControlsForOp(false)
      }
      req.send()
    },

    getOperationImg(opId, frameWidth, frameHeight) {
      var _this = this
      var url = this.fpHTTSrvOpEP + '/' + opId + '/image'
      var req = new XMLHttpRequest()
      req.open('GET', url)
      req.onload = function() {
        if (req.status === 200) {
          _this.drawFingerFrame(new Uint8Array(req.response), opId, frameWidth, frameHeight)
        // submitForm(new Uint8Array(req.response));//指纹图像RAW数据转化为BASE64字符 传送给服务器端保存原始指纹数据,如果保存BMP文件需要加入头文件
        } else {
          _this.enableControlsForOp(false)
        }
      }
      req.onerror = function() {
        _this.enableControlsForOp(false)
      }
      req.send()
      req.responseType = 'arraybuffer'
    },

    // 下载模板
    linkOperationTemplate(opId, operationName) {
      var _this = this
      var target = '/template'
      var url = this.fpHTTSrvOpEP + '/' + opId + target
      var req = new XMLHttpRequest()
      req.open('GET', url)
      req.onload = function() {
        if (req.status === 200) {
          if(req.readyState === 4) {
            _this.submitForm(new Uint8Array(req.response))// 特征码转化为BASE64字符 传送给服务器端比对
          }
        } else {
          _this.$Message.error('Server response')
          // _this.fixError(req.statusText, 'Server response')
          _this.enableControlsForOp(false)
        }
      }
      req.onerror = function() {
        _this.$Message.error('FPHttpServer not available')
        _this.enableControlsForOp(false)
      }
      req.send()
      req.responseType = 'arraybuffer'
    },

    deleteOperation(opId) {
      var url = this.fpHTTSrvOpEP + '/' + opId
      this.deleteVerb(url)
    },

    parseOperationDsc(opDsc) {
      var res = true
      var _this = this
      if(opDsc.state === 'done') {
        _this.enableControlsForOp(false)
        if(opDsc.status === 'success') {
          _this.textResult = ''
          // _this.$Message.success('指纹录入成功')
          _this.linkOperationTemplate(opDsc.id, opDsc.operation)
        }

        if(opDsc.status === 'fail') {
          // _this.$Message.error('指纹录入失败')
          res = false

          if(parseInt(opDsc.errornum) !== -1) {
            _this.deleteOperation(opDsc.id)
          }
        }
      } else if(opDsc.state === 'init') {
        _this.lastInitOp = opDsc.id
        setTimeout(_this.getOperationState, 1000, opDsc.id)
        setTimeout(_this.getOperationImg, 1000, opDsc.id, parseInt(opDsc.devwidth), parseInt(opDsc.devheight))
      } else if(opDsc.state === 'inprogress') {
        if(opDsc.fingercmd === 'puton') {
          _this.textResult = '请按压机器指纹感应区'
        }
        if(opDsc.fingercmd === 'takeoff') {
          _this.textResult = '请将手指移出指纹感应区'
        }

        setTimeout(_this.getOperationState, 1000, opDsc.id)
        setTimeout(_this.getOperationImg, 1000, opDsc.id, parseInt(opDsc.devwidth), parseInt(opDsc.devheight))
      }

      return res
    },

    drawFingerFrame(frameBytes, opId, frameWidth, frameHeight) {
      var _this = this
      var ctx = _this.fingerFrame.getContext('2d')
      var imgData = ctx.createImageData(_this.fingerFrame.width, _this.fingerFrame.height)

      for(var i = 0; i < frameBytes.length; i++) {
        // red
        imgData.data[4 * i] = 255 - frameBytes[i]
        // green
        imgData.data[4 * i + 1] = 255 - frameBytes[i]
        // blue
        imgData.data[4 * i + 2] = 255 - frameBytes[i]
        // alpha
        imgData.data[4 * i + 3] = 255
      }

      ctx.putImageData(imgData, 0, 0, 0, 0, _this.fingerFrame.width, _this.fingerFrame.height)
    },

    deleteVerb(url) {
      var _this = this
      var req = new XMLHttpRequest()
      req.open('DELETE', url)
      req.onload = function() {
        if (req.status === 200) {
        } else {
          _this.$Message.error('指纹录入设备连接失败')
          _this.textResult = ''
        }
      }
      req.onerror = function() {
        _this.$Message.error('FPHttpServer not available')
      }
      req.send()
    },

    put(url) {
      var _this = this
      var req = new XMLHttpRequest()
      req.open('PUT', url)
      req.onload = function() {
        if (req.status !== 200) {
          _this.$Message.error('FPHttpServer not available')
        }
      }
      req.onerror = function() {
        _this.$Message.error('FPHttpServer not available')
      }
      req.send()
    },

    // 控制按钮显示
    enableControls() {
      if(this.fingerStep === 1) {
        this.btnEnrollAnsi.disabled = false
      }else if(this.fingerStep === 2) {
        this.btnEnrollAnsiTwo.disabled = false
      }
    },

    // 控制按钮显示或者隐藏
    enableControlsForOp(opBegin) {
      // if(this.fingerStep === 1) {
      this.btnEnrollAnsi.disabled = opBegin
      // }else if(this.fingerStep === 2) {
      this.btnEnrollAnsiTwo.disabled = opBegin
      // }
    },

    CheckFPHttpSrvConnection() {
      var _this = this
      var req = new XMLHttpRequest()
      req.open('GET', this.fpHTTSrvOpEP)
      req.onload = function() {
        if (req.status === 200) {
          _this.enableControls()
          _this.resultText = '准备就绪，请点击"录入指纹"开始录入。'
        } else {
          _this.$Message.error('Server response')
        }
      }
      req.onerror = function() {
        this.$Message.error('FtrScanHttpServer not available')
        setTimeout(this.CheckFPHttpSrvConnection, 1000)
      }
      req.send()
    },
    // 准备工作
    onBodyLoad() {
      this.btnEnrollAnsi = document.getElementById('EnrollBtnANSI')
      this.btnEnrollAnsiTwo = document.getElementById('EnrollBtnANSITwo')
      this.fingerFrame = document.getElementById('fingerframe')
      this.resultLink = document.getElementById('resultLink')
      this.sampleNumList = document.getElementById('sampleNumList')
      var defImg = new Image()
      defImg.onload = function() {
        var context = this.fingerFrame.getContext('2d')
        context.drawImage(defImg, 0, 0)
      }
      defImg.src = 'defframe.png'

      this.CheckFPHttpSrvConnection()
    },
    // 取消录入
    cancelOperation() {
      var url = this.fpHTTSrvOpEP + '/' + this.lastInitOp + '/cancel'
      var req = new XMLHttpRequest()
      req.open('PUT', url)
      req.onload = function() {
        if (req.status !== 200) {
          // fixError(req.statusText, 'Server response')
        }
      }
      req.onerror = function() {
        // fixError('', 'FPHttpServer not available')
      }
      req.send()
    },
    // ==========================录入指纹linux系统================
    // 取消指纹采集
    cancelCapture() {
      var url = this.hostIpLinux + ':15871/BTbioonline/fingerprint/cancelCapture'
      this.cancelDoHttpGetOperation(url)
    },
    // 取消获取指纹
    cancelDoHttpGetOperation(url) {
      return new Promise((resolve, reject) => {
        axios.get(url, {
          headers: {
            'token': this.$cookie.get('token'),
            'Content-Type': 'json',
            'async': false
          }
        }).then(res => {
        })
      })
    },
    // 获取指纹
    doHttpGetOperation(url) {
      return new Promise((resolve, reject) => {
        axios.get(url, {
          headers: {
            'token': this.$cookie.get('token'),
            'Content-Type': 'json',
            'async': false
          }
        }).then(res => {
          if(res.data.error) {
            this.$Message.error('指纹录入设备连接失败')
            this.textResult = ''
            return
          }else{
            this.textResult = '请按压机器指纹感应区'
          }
          setTimeout(() => {
            this.getTemplate()
          }, 1000)
        }).catch(error => {
          if(error) {
            this.textResult = ''
            this.$Message.error('指纹录入设备连接失败，请检查')
          }
        })
      })
    },
    // 点击按钮开始采集指纹
    beginVerifyCapture(step) {
      this.fingerStep = step
      var url = this.hostIpLinux + ':15871/BTbioonline/fingerprint/beginCapture?type=0'
      this.textResult = '开始录入...'

      this.doHttpGetOperation(url) // 获取指纹信息返回的是base64 图片格式
    },
    // 转换为前后台校验的
    getTemplate() {
      var url = this.hostIpLinux + ':15871/BTbioonline/fingerprint/getTemplate'
      this.doHttpGetOperationTemplate(url).then(res => {

      })
    },
    doHttpGetOperationTemplate(url) {
      return new Promise((resolve, reject) => {
        axios.get(url, {
          headers: {
            'token': this.$cookie.get('token'),
            'Content-Type': 'json',
            //   dataType: 'json',
            'async': false
          }
        }).then(res => {
          this.textResult = ''
          var templateBase64 = res.data.data.jpg_base64
          if(templateBase64) {
            // this.$Message.success('指纹录入成功')
          }else{
            this.$Message.error('指纹录入失败')
            return
          }
          if(this.fingerStep === 1) {
            this.$refs['formValidate'].fields.forEach(function (e) {
              if (e.prop === 'fingerprintOne') {
                e.resetField()
              }
            })
            this.formData.fingerprintOne = templateBase64
          }else if (this.fingerStep === 2) {
            this.formData.fingerprintTwo = null
            this.$refs['formValidate'].fields.forEach(function (e) {
              if (e.prop === 'fingerprintTwo') {
                e.resetField()
              }
            })
            this.formData.fingerprintTwo = templateBase64
          }
          // if(this.fingerStep === 1) {
          //   this.formData.fingerprintOne = base64Data
          //   this.textResult = ''
          // }else if (this.fingerStep === 2) {
          //   this.formData.fingerprintTwo = base64Data
          //   this.textResult =
          // }
        })
      })
    },

    // 将base64转换为blob
    dataURLtoBlob(dataurl) {
      var arr = dataurl.split(',')
      var mime = arr[0].match(/:(.*?);/)[1]
      var bstr = atob(arr[1])
      var n = bstr.length
      var u8arr = new Uint8Array(n)
      while (n--) {
        u8arr[n] = bstr.charCodeAt(n)
      }
      return new Blob([u8arr], { type: mime })
    }
  },
  beforeDestroy() {
    if(this.lastInitOp) {
      this.cancelOperation()
    }

    this.stopNavigator()
  }
}
</script>
<style>
.demo-drawer-footer {
  width: 100%;
  padding: 10px 16px;
  text-align: right;
  background: #fff;
}

</style>
<style lang="less" scoped>
/deep/.ivu-checkbox-group-item{
  min-width: 100px;
  padding-left: 15px;
}
</style>
