<script setup lang="ts">
import { LoginForm, RegisterForm } from './components'
import { useI18n } from '@/hooks/web/useI18n'
import { underlineToHump } from '@/utils'
import { useAppStore } from '@/store/modules/app'
import { useDesign } from '@/hooks/web/useDesign'
import { ref, onUnmounted } from 'vue'
import Socket from '@/socket/index'
import config from '@/socket/config/config'

Socket.getSocketInstance().then((socket) => {
  if (socket) {
    socket.close(config.ERROR_CODE.normal)
  }
})
onUnmounted(() => {})

const { getPrefixCls } = useDesign()

const prefixCls = getPrefixCls('login')

const appStore = useAppStore()

const { t } = useI18n()

const isLogin = ref(true)

const toRegister = () => {
  isLogin.value = false
}

const toLogin = () => {
  isLogin.value = true
}
</script>

<template>
  <div :class="prefixCls" class="h-[100%] relative">
    <div class="relative h-full flex mx-auto">
      <div :class="`${prefixCls}__left bg-opacity-20 relative`" style="min-width: 600px">
        <div class="flex items-center relative text-white logo-mg">
          <img src="@/assets/imgs/login/logo.png" alt="" class="logo-mg-img" />
          <span class="logo-mg-text">{{ underlineToHump(appStore.getTitle) }}</span>
        </div>
        <div class="flex justify-center items-center h-[calc(100%-60px)]">
          <TransitionGroup
            appear
            tag="div"
            enter-active-class="animate__animated animate__bounceInLeft"
          />
        </div>
      </div>
      <div class="dark:bg-v-dark relative login-right">
        <Transition appear enter-active-class="animate__animated animate__bounceInRight">
          <div class="h-full flex m-auto w-[100%] right-form">
            <LoginForm v-if="isLogin" class="h-auto form-address" @to-register="toRegister" />
            <div class="Copyright">
              <p>Copyright 山东麦港数据系统有限公司版权所有 鲁ICP备14023479</p>
            </div>
          </div>
        </Transition>
      </div>
    </div>
  </div>
</template>

<style lang="less" scoped>
@prefix-cls: ~'@{namespace}-login';
.@{prefix-cls} {
  &__left {
    position: relative;
    flex: 1;
    background-image: url('@/assets/imgs/login/login_bg.png');
    background-position: left;
    background-repeat: no-repeat;
    background-size: contain;
    .logo-mg {
      width: 58.25rem;
      margin: 0 auto;
      padding: 5.45rem 0 0;
      min-width: 500px;
      .logo-mg-img {
        display: inline-block;
      }
      .logo-mg-text {
        display: inline-block;
        font-size: 29px;
        line-height: 29px;
        font-family: Alibaba PuHuiTi M;
        font-weight: 500;
        color: #222;
        margin-top: -0.33rem;
        margin-left: 1.25rem;
      }
    }
  }
}
.login-right {
  width: 51.25rem;
  min-width: 500px;
}
.right-form {
  width: 25rem;
  position: relative;
  min-width: 400px;
  margin: 0 auto;
  .Copyright {
    width: 100%;
    text-align: center;
    position: absolute;
    bottom: 10.6vh;
    font-size: 0.875rem;
    color: #888;
    line-height: 0.875rem;
    font-weight: 400;
    font-family: Alibaba PuHuiTi R;
    white-space: nowrap;
  }
}
</style>
