<template>
  <aside class="site-sidebar" :class="'site-sidebar--' + sidebarLayoutSkin">
    <!-- <div class="navbar-header">
      <a @click="turnToHome()" class="navbar-brand" :class="{'navbar-brand-collapsed': sidebarFold}">
        <div class="img-box">
          <img src="@/assets/images/logo.png" alt="数字化培训平台" class="brand-icon">
        </div>
        <div class="brand-title" v-if="!sidebarFold">
          <span class="brand-text">数字化培训平台</span>
        </div>
      </a>
    </div> -->
    <div class="site-sidebar__inner">
      <el-menu
        :unique-opened="true"
        :default-active="menuActiveName"
        :collapse="sidebarFold"
        :collapseTransition="false"
        :accordion="true"
        class="site-sidebar__menu">
        <el-menu-item index="home"  @click='clickHome' class="home-menu-item">
          <i class="icon iconfont icon-nav_icon1" style="font-size:15px"></i>
          <span slot="title" @click='clickHome'>&nbsp;首页概览</span>
        </el-menu-item>
        <sub-menu
          v-for="menu in menuList"
          :key="menu.menuId"
          :menu="menu"
          :dynamicMenuRoutes="dynamicMenuRoutes">
        </sub-menu>
      </el-menu>
    </div>
  </aside>
</template>

<script>
import PersonInfo from './person-info.vue'
import SubMenu from './main-sidebar-sub-menu'
// import { isURL } from '@/utils/validate'
export default {
  data () {
    return {
      dynamicMenuRoutes: [],
      allMenueItems: [], // 未进行树状结构
      indexSpan: ''
    }
  },
  components: {
    PersonInfo,
    SubMenu
  },
  computed: {
    documentClientHeight: {
      get () { return this.$store.state.common.documentClientHeight },
      set (val) {
        this.$store.commit('common/updateDocumentClientHeight', val)
      }
    },
    sidebarLayoutSkin: {
      get () { return this.$store.state.common.sidebarLayoutSkin }
    },
    sidebarFold: {
      get () { return this.$store.state.common.sidebarFold }
    },
    // menuList: {
    //   get () { return this.$store.state.common.menuList },
    //   set (val) { this.$store.commit('common/updateMenuList', val) }
    // },
    menuActiveName: {
      get () { return this.$store.state.common.menuActiveName },
      set (val) { this.$store.commit('common/updateMenuActiveName', val) }
    },
    mainTabs: {
      get () { return this.$store.state.common.mainTabs },
      set (val) { this.$store.commit('common/updateMainTabs', val) }
    },
    mainTabsActiveName: {
      get () { return this.$store.state.common.mainTabsActiveName },
      set (val) { this.$store.commit('common/updateMainTabsActiveName', val) }
    }
  },
  watch: {
    $route: 'routeHandle'
  },
  created () {
    // this.menuList = JSON.parse(sessionStorage.getItem('menuList') || '[]')
    var menuList = JSON.parse(sessionStorage.getItem('menuList') || '[]')
    this.menuList = []
    menuList.forEach(item => {
      if(item.isShow !== 'false') {
        this.menuList.push(item)
      }
    })
    this.dynamicMenuRoutes = JSON.parse(sessionStorage.getItem('dynamicMenuRoutes') || '[]')
    this.allMenueItems = JSON.parse(sessionStorage.menuList)
    this.routeHandle(this.$route)
  },
  mounted() {
  },
  methods: {
    clickHome() {
      this.$router.push({ name: 'home' })
    },
    resetClientHeight () { // 重置窗口可视高度
      this.documentClientHeight = document.documentElement['clientHeight'] - 16
      window.onresize = () => {
        this.documentClientHeight = document.documentElement['clientHeight'] - 16
      }
    },
    // 佰福康修改
    routeHandle (route) {
      this.resetClientHeight()
      let menuItem = []
      this.allMenueItems.forEach(item => {
        if(item.menuId === route.meta.parentId) {
          menuItem.push(item)
        }
      })
      var subMenu = {
        menuId: route.meta.menuId,
        title: route.meta.title,
        isDynamic: route.meta.isDynamic,
        isTab: route.meta.isTab,
        iframeUrl: route.meta.iframeUrl,
        parentId: route.meta.parentId,
        icon: route.meta.icon,
        url: route.path
      }
      menuItem.push(subMenu)
      this.menuActiveName = route.meta.menuId + ''
      this.mainTabsActiveName = route.meta.name
      this.mainTabs = menuItem
      if(route.name === 'home') {
        this.menuActiveName = 'home'
        this.mainTabsActiveName = 'home'
      }
      // if (route.meta.isTab) {
      //   // tab选中, 不存在先添加
      //   var tab = this.mainTabs.filter(item => item.name === route.name)[0]
      //   if (!tab) {
      //     if (route.meta.isDynamic) {
      //       route = this.dynamicMenuRoutes.filter(item => item.name === route.name)[0]
      //       if (!route) {
      //         return console.error('未能找到可用标签页!')
      //       }
      //     }
      //     tab = {
      //       menuId: route.meta.menuId || route.name,
      //       name: route.name,
      //       title: route.meta.title,
      //       type: isURL(route.meta.iframeUrl) ? 'iframe' : 'module',
      //       iframeUrl: route.meta.iframeUrl || ''
      //     }
      //     this.mainTabs = this.mainTabs.concat(tab)
      //   }
      //   this.menuActiveName = tab.menuId + ''
      //   this.mainTabsActiveName = tab.name
      // }
    }
  }
}
</script>
<style lang="scss">
@import './side.scss';
</style>
