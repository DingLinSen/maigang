<template>
  <div class="error-page">
    <div class="content-con" style="margin-top: 8vh;">
      <img :src="src" alt="404" >
      <div class="text-con">
        <h4>{{ code }}</h4>
        <h5>{{ desc }}</h5>
      </div>
      <back-btn-group class="back-btn-group" style="margin-top: 2vh;"></back-btn-group>
    </div>
  </div>
</template>

<script>
import './error.less'
import backBtnGroup from './back-btn-group.vue'
export default {
  name: 'error_content',
  components: {
    backBtnGroup
  },
  props: {
    code: String,
    desc: String,
    src: String
  }
}
</script>
<style lang="less" scoped>
  /deep/img{
    margin-top: 5vh;
  }
</style>
