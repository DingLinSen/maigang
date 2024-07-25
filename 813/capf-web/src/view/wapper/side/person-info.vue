<template lang="html">
  <div class="login-user-wrapper">
    <div class="info-wrap">
      <div class="pd-btm">
        <img class="img-circle login-header-img"
          src="~@/assets/images/common/gly.jpg" alt="">
      </div>
      <a class="collapse-a" data-toggle="collapse"
        aria-expanded="false" @click="changeMenuState()">
        <span class="pull-right dropdown-toggle">
          <i class="dropdown-caret"></i>
        </span>
        <p class="sys-desc mg-btm-10">欢迎登录系统平台<Icon type="md-arrow-dropdown" /></p>
        <p class="login-user-name mg-btm-10">{{userName}}</p>
      </a>
    </div>

    <!-- 快捷菜单 -->
    <Divider dashed v-if="this.showPersonMenu"/>
    <div id="quick-menu-nav" class="quick-menu"
      :class='{ "show-menu": showPersonMenu }'>
      <!-- <a class="quick-menu-item">
        <icon-svg name="shouye"></icon-svg> 个人中心
      </a> -->
      <p>
        <a class="quick-menu-item" @click="openEditPWD()">
         <Icon type="ios-key-outline" /> 修改密码
        </a>
      </p>

      <!-- <a class="quick-menu-item">
        <icon-svg name="shouye"></icon-svg> 系统设置
      </a> -->
      <p>
        <a class="quick-menu-item" @click="logout()">
        <Icon type="ios-power" /> 退出系统
      </a>
      </p>
    </div>

    <!-- <Divider dashed v-if="!this.showPersonMenu"/> -->

    <!-- 密码测滑 -->
    <Drawer :mask-closable="true" :mask="true" title="修改密码"
      v-model="showEditPWD"
      width="400"
      :styles="drawerStyles"
      >
      <edit-PWD @closePanle="closePanle"></edit-PWD>
    </Drawer>
  </div>
</template>

<script>
import { clearLoginInfo } from '@/utils'
import { userLogout } from '@/api/api-base'
import EditPWD from '_c/info/editPWD.vue'
export default {
  components: {
    EditPWD
  },
  data() {
    return {
      showPersonMenu: false,
      drawerStyles: {
        top: '65px',
        bottom: '0'
      },
      showEditPWD: false
    }
  },
  computed: {
    userName: {
      get () { return this.$store.state.user.userName }
    }
  },
  methods: {
    openEditPWD() {
      this.showEditPWD = true
    },
    closePanle() {
      this.showEditPWD = false
    },
    changeMenuState() {
      this.showPersonMenu = !this.showPersonMenu
    },
    async logout() {
      userLogout().then(res => {
        if (res.data.status) {
          clearLoginInfo()
          sessionStorage.removeItem('store')
          sessionStorage.setItem('menuList', '[]')
          sessionStorage.setItem('permissions', '[]')
          this.$store.dispatch('user/handleLogOut')
          this.$router.options.isAddDynamicMenuRoutes = false
          this.$cookie.set('loginUserInfo', [])
          this.$router.push('/login')
          this.$Message.success('退出登录成功')
        } else {
          // this.$Message.error('获取信息详情时系统异常')
        }
      }).catch(() => {
      })
    }
  }
}
</script>

<style lang="scss" scoped>
@import './person-info.scss';
</style>
