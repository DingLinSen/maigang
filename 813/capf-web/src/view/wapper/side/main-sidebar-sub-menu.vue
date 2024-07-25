<template>
  <el-submenu
    v-if="menu.list && menu.list.length >= 1"
    :index="menu.menuId + ''"
    :popper-class="'site-sidebar--' + sidebarLayoutSkin + '-popper'">

    <!-- 第一层级 -->
    <template slot="title">
      <i :class="'icon iconfont icon-' + menu.icon || ''" style="font-size:18px"></i>
      <span>&nbsp;&nbsp;{{ menu.name }}</span>
    </template>

    <sub-menu
      v-for="item in menu.list"
      :key="item.menuId"
      :menu="item"
      :dynamicMenuRoutes="dynamicMenuRoutes">
    </sub-menu>
  </el-submenu>
    <!-- v-show="(!menu.list || menu.list.length < 1) &&  menu.isShow !== 'false' -->
  <el-menu-item v-else :index="menu.menuId + ''" @click="gotoRouteHandle(menu)">
    <i :class="'icon iconfont icon-' + menu.icon || ''" style="font-size:18px"></i>
    <span slot="title" v-if="menu.parentId !== '0'">&nbsp;{{ menu.name }}</span>
    <span slot="title" v-if="menu.parentId === '0'">&nbsp;&nbsp;{{ menu.name }}</span>
  </el-menu-item>
</template>

<script>
import SubMenu from './main-sidebar-sub-menu'
export default {
  name: 'sub-menu',
  props: {
    menu: {
      type: Object,
      required: true
    },
    dynamicMenuRoutes: {
      type: Array,
      required: true
    }
  },
  components: {
    SubMenu
  },
  computed: {
    sidebarLayoutSkin: {
      get () { return this.$store.state.common.sidebarLayoutSkin }
    }
  },
  mounted() {
  },
  methods: {
    // 通过menuId与动态(菜单)路由进行匹配跳转至指定路由
    gotoRouteHandle (menu) {
      var route = this.dynamicMenuRoutes.filter(item => item.meta.menuId === menu.menuId)
      if (route.length >= 1) {
        this.$router.push({ name: route[0].name })
      }
    }
  }
}
</script>
