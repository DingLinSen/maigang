<template>
  <a @click="handleChange"
    type="text"
    :class="['sider-trigger-a', collapsed ? 'collapsed' : '']">
    <i :class="'icon iconfont icon-' + iconName"></i>
  </a>
</template>
<script>
export default {
  name: 'siderTrigger',
  data() {
    return {
      iconName: 'mene_close'
    }
  },
  props: {
    collapsed: Boolean,
    icon: {
      type: String,
      default: 'navicon-round'
    },
    size: {
      type: Number,
      default: 26
    }
  },
  methods: {
    handleChange () {
      this.$emit('on-change', !this.collapsed)
      if(this.collapsed) {
        this.iconName = 'mene_close'
      }else{
        this.iconName = 'mene_open'
      }
    }
  }
}
</script>
<style lang="less">
@import './sider-trigger.less';
</style>
<style lang="less" scoped>
</style>
