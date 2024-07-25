<template>
  <div id="page-title" class="page-header-crumb" v-if="list.length > 0">
    <h1 class="page-header text-overflow" v-if="list.length > 0">{{ showTitle(list.slice(-1)[0]) }}</h1>
    <Breadcrumb :style="{fontSize: `${fontSize}px`}">
      <BreadcrumbItem v-for="item, index in list" :to="item.to"
        :key="`bread-crumb-${index}`">

        <common-icon v-if="index === list.length - 1" type="" />
        <common-icon v-if="index > 0 && index !== list.length - 1" :type="item.icon || ''" />
        <common-icon v-if="index === 0" type="md-home"/>
        {{ showTitle(item) }}
      </BreadcrumbItem>

      <div class="tip-button" id="tip-button" v-if="list.length > 0 && list.slice(-1)[0].meta.tip" @click="clickTipBtn()">
        <i class="demo-pli-information text-lg icon-fw"></i>{{ showTitle(list.slice(-1)[0]) + '标准' }}
      </div>
      <div class="clear"></div>
    </Breadcrumb>
  </div>
</template>
<script>
import { showTitle } from '_c/common/util'
import CommonIcon from '_c/common-icon'
import './page-header-crumb.less'
export default {
  name: 'page-header-crumb',
  components: {
    CommonIcon
  },
  props: {
    list: {
      type: Array,
      default: () => []
    },
    fontSize: {
      type: Number,
      default: 14
    },
    showIcon: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      // showBack: false,
      // showAnalytics: true
    }
  },
  mounted() {

  },
  watch: {
    '$route': function() {
      // if (this.$router.currentRoute.name.indexOf('-details') > 0) {
      //   this.showBack = true
      // } else {
      //   this.showBack = false
      // }
      //
      // if (this.$router.currentRoute.name.indexOf('-analyse') > 0) {
      //   this.showAnalytics = false
      // } else {
      //   this.showAnalytics = true
      // }
    }
  },
  methods: {
    // goBack() {
    //   this.showBack = !this.showBack
    //   this.$router.push(this.list.slice(-1)[0].meta.backPath)
    // },
    // turnAnalytics() {
    //   this.showAnalytics = false
    //   this.$router.push({
    //     path: this.list.slice(-1)[0].meta.analysePath
    //   })
    // },
    // analyticsGoList() {
    //   this.showAnalytics = true
    //   this.$router.push(this.list.slice(-1)[0].meta.backPath)
    // },
    showTitle (item) {
      return showTitle(item, this)
    },
    isCustomIcon (iconName) {
      return iconName.indexOf('_') === 0
    },
    getCustomIconName (iconName) {
      return iconName.slice(1)
    },
    clickTipBtn() {
      this.$emit('click-tip-btn', this.showTitle(this.list.slice(-1)[0]))
    }
  }
}
</script>
<style media="screen" lang="less" scoped>
@import './page-header-crumb.less';
.tip-button {
  cursor: pointer;
  margin-left: 10px;
}

.ivu-breadcrumb a,
.ivu-breadcrumb {
  color: #fff;
}

.relative-icon {
  position: relative;
  bottom: 0px;
}
</style>
