<template lang="html">
  <header id="navbar">
    <div id="navbar-container">
      <div class="navbar-header" :style="{width: collapsed ? '60px' : '235px'}">
        <a @click="turnToHome()" class="navbar-brand" :class="{'navbar-brand-collapsed': isCollapsed}">
         <img src="@/assets/images/logo.png" alt="数字化培训平台" class="brand-icon">
           <div class="brand-title" >
            <span class="brand-text">数字化培训平台</span>
          </div>
        </a>
      </div>

      <div class="navbar-content" :class="{'content-collapsed': isCollapsed}">
        <div class="nav top-info">
          <sider-trigger :collapsed="collapsed" @on-change="handleCollpasedChange"></sider-trigger>
          <p class="userName" >{{name}}，您好<span v-if="lastLoginTime">，上次登录时间 {{lastLoginTime}}</span></p>
        </div>
        <ul class="nav navbar-top-links">
          <!-- <li class="dropdown">
            <a class="aside-toggle user-info-dropdown">
              <img class="img-circle login-header-img"
                src="~@/assets/images/common/gly.jpg" alt="">
              <span>
                <span class="user-name">{{name}}</span>
                <span style="padding: 0px 45px 8px 0px;">
                </span>
              </span>
              <div class="slider-user-info">
                <img class="img-circle dropdown-header-img"
                src="~@/assets/images/common/gly.jpg" alt="">
                <p>{{name}}</p>
                <p @click="openEditPWD()">
                  <Icon type="ios-key-outline" />
                  <span>修改密码</span>
                </p>
                <p @click="logout()">
                  <Icon type="ios-power" />
                  <span>退出系统</span>
                </p>
              </div>
            </a>
          </li> -->
          <div class="sub-box">
            <div class="info-box">
          <img class="userFace" v-if="userFace" :src="userFace" alt="" />
              <img v-else class="img-circle login-header-img" src="~@/assets/images/common/avatar_icon.png" alt="">
                <Dropdown  @on-click="handleDropdown">
                  <a href="javascript:void(0)">
                    {{name}}
                    <Icon type="md-arrow-dropdown" />
                  </a>
                  <DropdownMenu slot="list" >
                      <DropdownItem name="password" style="text-align: center;">修改密码 <Icon type="md-arrow-dropright" style="margin-left:10px;" /></DropdownItem>
                  </DropdownMenu>
              </Dropdown>
            </div>
            <div class="icon-box">
              <i class='icon iconfont icon-out_icon' @click="logout()"></i><span @click="logout()">退出</span>
            </div>
          </div>
        </ul>
      </div>
    </div>

    <Drawer :mask-closable="true" :mask="true" title="修改登录密码"
      v-model="showEditPWD"
      width="400"
      :showEditPWD = "showEditPWD"
      :styles="drawerStyles"
      >
      <edit-PWD @closePanle="closePanle" :showEditPWD='showEditPWD'></edit-PWD>
    </Drawer>
  </header>
</template>

<script>
import { userLogout } from '@/api/api-base'
import EditPWD from '_c/info/editPWD.vue'
import SiderTrigger from './sider-trigger'
import { clearLoginInfo } from '@/utils'
import webSocket from '@/libs/websocket.js'
export default {
  data() {
    return {
      isCollapsed: false, // 是否收缩
      drawerStyles: {
        // 侧滑窗口配置
        top: '65px',
        bottom: '0'
      },
      showEditPWD: false,
      isFullscreen: false,
      showSub: false,
      userFace: null
    }
  },
  components: {
    SiderTrigger,
    EditPWD
  },
  props: {
    collapsed: Boolean
  },
  mounted() {
    let str = sessionStorage.getItem('faceId')
    this.userFace = str.replace(/["']/g, '')
  },
  computed: {
    userId: {
      get() {
        if (this.$store.state.user) {
          return this.$store.state.user.id
        } else {
          return ''
        }
      },
      set(val) {
        this.$store.commit('user/setUserId', val)
      }
    },
    name: {
      get() {
        if (this.$store.state.user) {
          return this.$store.state.user.name
        } else {
          return ''
        }
      }
    },
    lastLoginTime: {
      get() {
        if (this.$store.state.user) {
          return this.$store.state.user.lastLoginTime
        } else {
          return ''
        }
      }
    }
  },
  methods: {
    openEditPWD() {
      this.showEditPWD = true
    },
    closePanle() {
      this.showEditPWD = false
    },
    handleCollpasedChange(state) {
      this.isCollapsed = state
      this.$emit('on-coll-change', state)
    },
    turnToHome() {
      this.$router.push('/home')
    },
    async logout() {
      userLogout()
        .then(res => {
          if (res.data.status) {
            clearLoginInfo()
            sessionStorage.removeItem('store')
            sessionStorage.setItem('menuList', '[]')
            sessionStorage.setItem('permissions', '[]')
            this.$store.dispatch('user/handleLogOut')
            this.$router.options.isAddDynamicMenuRoutes = false
            this.$cookie.set('loginUserInfo', [])
            this.$router.push('/login')
            // 关闭websocket
            webSocket.closeSocket()
            this.$Message.success('退出登录成功')
          } else {
            // this.$Message.error('获取信息详情时系统异常')
          }
        })
        .catch(() => {})
    },
    // 点击下拉框
    handleDropdown(name) {
      switch (name) {
        case 'password':
          this.openEditPWD()
          break
        case 'logout':
          this.logout()
          break
        default:
          break
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@import './nav.scss';
.brand-title {
  line-height: 36px;
}
.ivu-dropdown-item {
  min-width: 10px !important;
}
.ivu-select-dropdown {
  top: 20px;
  margin: 0;
  padding: 0;
}
.ivu-cascader .ivu-select-dropdown {
  top: 65px !important;
}
</style>
<style lang="less" scoped>
.userFace {
  height: 30px;
}
</style>
