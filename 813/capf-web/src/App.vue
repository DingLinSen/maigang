<template>
  <div id="app">
    <router-view/>
    <!-- <keep-alive>
    </keep-alive> -->
  </div>
</template>

<script>
export default {
  name: 'App',
  mounted() {
    // 关闭浏览器窗口的时候清空浏览器缓存在localStorage的数据
    window.onbeforeunload = function (e) {
      var storage = window.localStorage
      storage.clear()
    }
  },
  methods: {
  }
}
</script>
<style lang="scss">
@import '~@/assets/scss/element.scss';
@import '~@/assets/scss/iview.scss';
@import '~@/assets/scss/index.scss';
  html,body{
    height: 100%;
  }
  #app{
    width: 100%;
    height: 100%;
    font-family: Microsoft YaHei;
  }
  /deep/body,html{
    font-size: 24px;
  }
</style>
