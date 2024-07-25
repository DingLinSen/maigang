<template>
  <div class="isIE-wrap">
    <div>
      <h3>您当前使用的浏览器无法进行系统访问, 请安装推荐浏览器后访问系统</h3>
      <p> 建议使用谷歌浏览器进行访问, <a href="http://10.115.125.149/api/static/49.0.2623.112_chrome_installer.exe">点击下载谷歌浏览器</a></p>
      <!-- <p>建议使用360极速浏览器进行访问, <a href="http://10.115.125.149/api/static/Firefox-full-latest.exe">点击下载360极速浏览器</a></p> -->
    </div>
    <img src="@/assets/images/common/nodata.png" alt="">
  </div>
</template>
<style lang="less" scoped>
.isIE-wrap{
  text-align: center;
  height: 99vh;
  width: 100%;
  padding-top: 5%;
  img{
    height: 20%;
    margin-top: 5%;
  }
  p{
    line-height: 28px;
  }
}
</style>
