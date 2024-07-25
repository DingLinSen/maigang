<template>
  <div class="site-wrapper"
    :class="{ 'site-sidebar--fold': sidebarFold }"
    v-loading.fullscreen.lock="loading"
    element-loading-text="数据加载中">

    <template v-if="!loading">
      <main-navbar :collapsed="sidebarFold" @on-coll-change="collChange" />
      <main-sidebar />

      <div class="site-content__wrapper"
        :style="{ 'height': documentClientHeight + 15 + 'px' }">
        <main-content />
      </div>
    </template>
  </div>
</template>

<script>
import MainNavbar from './nav/main-navbar'
import MainSidebar from './side/main-sidebar'
import MainContent from './content/main-content'
export default {
  data () {
    return {
      loading: true
    }
  },
  components: {
    MainNavbar,
    MainSidebar,
    MainContent
  },
  watch: {
    documentClientHeight: function() {
      // this.resetClientHeight()
    }
  },
  computed: {
    documentClientHeight: {
      get () { return this.$store.state.common.documentClientHeight },
      set (val) {
        this.$store.commit('common/updateDocumentClientHeight', val)
      }
    },
    sidebarFold: {
      get () { return this.$store.state.common.sidebarFold },
      set (val) { this.$store.commit('common/updateSidebarFold', val) }
    },
    userId: {
      get () { return this.$store.state.user.userId },
      set (val) { this.$store.commit('user/setUserId', val) }
    },
    roleId: {
      get () { return this.$store.state.user.roleId },
      set (val) { this.$store.commit('user/setRoleId', val) }
    },
    userName: {
      get () { return this.$store.state.user.username },
      set (val) { this.$store.commit('user/setUsername', val) }
    },
    lastLoginTime: {
      get () { return this.$store.state.user.lastLoginTime },
      set (val) { this.$store.commit('user/setLastLoginTime', val) }
    },
    name: {
      get () { return this.$store.state.user.name },
      set (val) { this.$store.commit('user/setName', val) }
    },
    roleName: {
      get () { return this.$store.state.user.roleName },
      set (val) { this.$store.commit('user/setRoleName', val) }
    },
    deptName: {
      get () { return this.$store.state.user.deptName },
      set (val) { this.$store.commit('user/setDeptName', val) }
    },
    isNotAssessToday: {
      get () { return this.$store.state.user.isNotAssessToday },
      set (val) { this.$store.commit('user/setDeptName', val) }
    },
    assId: {
      get () { return this.$store.state.user.assId },
      set (val) { this.$store.commit('user/setAssId', val) }
    }
  },
  created () {
  },
  mounted () {
    this.getUserInfo()
    // this.resetClientHeight()
    window.addEventListener('resize', this.resetClientHeight)
  },
  methods: {
    collChange(state) { // 缩放按钮点击
      this.sidebarFold = state
    },
    resetClientHeight () { // 重置窗口可视高度
      this.documentClientHeight = document.documentElement['clientHeight'] - 16
      window.onresize = () => {
        this.documentClientHeight = document.documentElement['clientHeight'] - 16
      }
    },
    getUserInfo () { // 登录后获取当前管理员信息
      this.loading = false
      const loginUserInfo = JSON.parse(this.$cookie.get(this.CONST_VALUE.LOGIN_USER_INFO))
      this.roleId = loginUserInfo.roleId
      this.userId = loginUserInfo.userId
      this.userName = loginUserInfo.username
      this.lastLoginTime = loginUserInfo.lastLoginTime
      this.name = loginUserInfo.name
      this.roleName = loginUserInfo.roleName
      this.deptName = loginUserInfo.deptName
      this.isNotAssessToday = loginUserInfo.isNotAssessToday
      this.assId = loginUserInfo.assId
    }
  }
}
</script>
