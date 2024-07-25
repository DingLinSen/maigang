<template>
  <div class="share_Auth">
    <div class="logo">
      <div class="flex items-center cursor-pointer" @click="push({ name: 'Home' })">
        <img
          src="@/assets/imgs/logo.png"
          class="w-[calc(var(--logo-width))] h-[calc(var(--top-tool-smal-screen-height)-34px)] 2xl:h-[calc(var(--logo-height)-34px)] mr-5px"
        />
        <span>知识图谱系统</span>
      </div>
    </div>
    <div class="share_box" v-if="props.withCode || props.isAuth || props.invalid || props.isFile">
      <div class="access-auth" v-if="props.isAuth">
        <div>
          <div class="access-title"><img src="@/assets/imgs/access_auth.png" /></div>
          <p class="access-text">抱歉！您没有访问权限</p>
          <p class="access-call">请与系统管理员联系</p>
          <p class="go-home" @click="push({ name: 'Home' })">
            <Icon icon="svg-icon:return_icon" size="150" />
            返回首页
          </p>
        </div>
      </div>
      <div class="share-invalid" v-else-if="props.invalid || props.isFile">
        <div class="invalid-box">
          <Icon icon="svg-icon:share_invalid" size="150" class="icon_file" />
          <div class="invalid-text" v-if="props.invalid">分享资源已失效</div>
          <div class="invalid-text" v-else-if="props.isFile">访问资源不存在</div>
          <p class="go-home" @click="push({ name: 'Home' })">
            <Icon icon="svg-icon:return_icon" size="150" />
            返回首页
          </p>
        </div>
      </div>
      <div class="share_content" v-else-if="props.withCode">
        <div class="box-title"><img src="@/assets/imgs/logo.png" /></div>
        <p class="title_bottom">{{ shareName }}的分享</p>
        <p class="share-password">请输入分享密码</p>
        <input
          type="text"
          class="password-inp"
          v-model="sharePassword"
          @keydown.enter="handleSure"
        />
        <div class="sure" @click="handleSure">确定</div>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { ref } from 'vue'
import { Icon } from '@/components/Icon'
import { useRouter } from 'vue-router'

const { push } = useRouter()
const props = defineProps({
  withCode: {
    type: Boolean,
    default: false
  },
  isAuth: {
    type: Boolean,
    default: false
  },
  invalid: {
    type: Boolean,
    default: false
  },
  shareName: {
    type: String,
    default: ''
  },
  isFile: {
    type: Boolean,
    default: false
  }
})
console.log('props=>', props.isFile)
const emit = defineEmits(['handleCode'])
const sharePassword = ref<string>('')
const handleSure = () => {
  emit('handleCode', sharePassword.value)
}
</script>
<style scoped lang="less">
.share_Auth {
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  z-index: 999;
  background: url('@/assets/imgs/bg.png') no-repeat;
  background-size: cover;
  font-size: 14px;
}
.logo {
  display: flex;
  align-items: center;
  font-weight: bold;
  font-size: 26px;
  color: #222222;
  margin: 20px 0 0 30px;
}
.share_box {
  width: 630px;
  height: 460px;
  background: #ffffff;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
.icon_file {
  font-size: 149px !important;
}
.invalid-box {
  width: 630px;
  height: 460px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
}
.share_content {
  width: 300px;
  margin: 0 auto;
}
.box-title {
  width: 94px;
  height: 94px;
  background: #eff3fd;
  border-radius: 50%;
  margin: 68px auto 0;
  display: flex;
  align-items: center;
  justify-content: center;
  img {
    width: 49px;
    height: 47px;
  }
}
.access-title {
  width: 220px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: center;
  img {
    width: 149px;
    height: 122px;
  }
}
.title_bottom {
  font-size: 20px;
  text-align: center;
}
.share-password {
  margin-top: 40px;
  color: #444444;
}
.password-inp {
  width: 300px;
  height: 36px;
  background: #f9f9f9;
  border-radius: 4px;
  border: 1px solid #e2e2e2;
  outline: none;
  text-indent: 8px;
}
.sure {
  width: 300px;
  height: 36px;
  background: #00a0e9;
  border-radius: 4px;
  color: #ffffff;
  text-align: center;
  line-height: 36px;
  margin-top: 17px;
  font-weight: bold;
  font-size: 16px;
  cursor: pointer;
}
.access-auth {
  width: 220px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
}
.access-text {
  font-size: 22px;
  color: #444444;
  line-height: 28px;
  margin-top: 10px;
}
.access-call {
  font-size: 14px;
  color: #999999;
  text-align: center;
  margin-top: 10px;
}
.go-home {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 45px;
  color: #00a0e9;
  cursor: pointer;
}
.access-back {
  color: #00a0e9;
  margin-top: 46px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}
.invalid-text {
  font-size: 16px;
  color: #999999;
  margin-top: 8px;
}
</style>