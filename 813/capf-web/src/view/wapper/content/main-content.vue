<template>
  <main
    class="site-content"
    :class="{ 'site-content--tabs': $route.meta.isTab }"
  >
    <div class="bread-wrap" v-if="(this.mainTabs[this.mainTabs.length -1].title && this.mainTabs[this.mainTabs.length -1].title !== '首页概览' && this.mainTabs[this.mainTabs.length -1].title !== '训练考核')">
      <h3>{{this.mainTabs[this.mainTabs.length -1].title ? this.mainTabs[this.mainTabs.length -1].title : ''}}</h3>
      <!-- <BreadcrumbItem to="/home">
        <i class="icon iconfont icon-nav_icon1"></i>
      </BreadcrumbItem> -->
      <span class="now-span">当前位置：</span>
      <Breadcrumb separator=">">
        <BreadcrumbItem
          v-for="(item, index) in mainTabs"
          :key="index"
          :to="item.url"
        >
          {{
            item.name ? item.name : item.title
          }}
        </BreadcrumbItem>
      </Breadcrumb>
    </div>
    <div class="content-wrap">
      <!-- <keep-alive> -->
        <router-view />
      <!-- </keep-alive> -->
    </div>
  </main>
</template>

<script>
import { isURL } from '@/utils/validate'
export default {
  data() {
    return {
      nowRouter: {
        name: ''
      }
    }
  },
  computed: {
    documentClientHeight: {
      get() {
        return this.$store.state.common.documentClientHeight
      }
    },
    menuActiveName: {
      get() {
        return this.$store.state.common.menuActiveName
      },
      set(val) {
        this.$store.commit('common/updateMenuActiveName', val)
      }
    },
    mainTabs: {
      get() {
        return this.$store.state.common.mainTabs
      },
      set(val) {
        this.$store.commit('common/updateMainTabs', val)
      }
    },
    mainTabsActiveName: {
      get() {
        return this.$store.state.common.mainTabsActiveName
      },
      set(val) {
        this.$store.commit('common/updateMainTabsActiveName', val)
      }
    },
    siteContentViewHeight() {
      var height = this.documentClientHeight - 50 - 30 - 2
      if (this.$route.meta.isTab) {
        height -= 40
        return isURL(this.$route.meta.iframeUrl)
          ? { height: height + 'px' }
          : { minHeight: height + 'px' }
      }
      return { minHeight: height + 'px' }
    }
  },
  mounted() {},
  methods: {
    // tabs, 选中tab
    selectedTabHandle(tab) {
      tab = this.mainTabs.filter(item => item.name === tab.name)
      if (tab.length >= 1) {
        this.$router.push({ name: tab[0].name })
      }
    }
  }
}
</script>
<style lang="scss">
@import './content.scss';
</style>
<style lang="less" scoped>

</style>
