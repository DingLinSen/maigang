<template lang="html">
  <Layout id="content-container" :class='{"aside-show": showAside }'>
    <div id="page-head">
      <page-header-crumb show-icon
        @click-tip-btn="clickTipBtn"
        :list="breadCrumbList">
      </page-header-crumb>
    </div>

    <Content>
      <div id="page-content">
        <slot name="content"></slot>
        <!-- <div class="text-center" style="color: #c3c3c3; margin-top: 20px; font-size: 12px;">
          中国铁路济南局集团有限公司工务处 | 麦港数据 © 2016-{{(new Date()).getFullYear()}}
        </div> -->
      </div>

      <slot name="drawer"></slot>
    </Content>
  </Layout>
</template>

<script>
import PageHeaderCrumb from '_c/page-header-crumb/page-header-crumb'
import { mapGetters } from 'vuex'
export default {
  data() {
    return {
      showAside: false,
      tipTitle: null
    }
  },
  mounted() {
    document.addEventListener('click', (e) => {
      var asideContainer = document.getElementById('aside-container')
      // this.$el.contains(e.target)

      if(asideContainer) {
        if (!asideContainer.contains(e.target) &&
          e.target.id !== 'tip-button') {
          this.showAside = false
        }
      }
    })
  },
  components: {
    PageHeaderCrumb
  },
  computed: {
    ...mapGetters({
      // storeTipTitle: 'getTipTitle'
    }),
    breadCrumbList() {
      return this.$store.state.app.breadCrumbList
    }
  },
  watch: {
    // 'storeTipTitle': function() {
    //   if (this.storeTipTitle === null) {
    //     this.showAside = false
    //     this.tipTitle = false
    //   }
    // }
  },
  methods: {
    toggleChangeAsideState() {
      this.showAside = !this.showAside
    },
    clickTipBtn(title) {
      this.tipTitle = title
      this.toggleChangeAsideState()
      this.$store.dispatch('tipBtn', title)
    }
  }
}
</script>

<style lang="less" scoped>
#content-container {
  overflow-x: hidden;
  overflow-y: auto;
    background-color: #E7EBEE !important;
}

#page-head {
  position: absolute;
  top: 10px;
  z-index: 1;
}

#page-content {
  // padding-top: 95px;
}
</style>
