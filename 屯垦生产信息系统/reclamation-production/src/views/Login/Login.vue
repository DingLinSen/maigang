<script setup lang="ts">
import { LoginForm, RegisterForm } from './components'
import { ThemeSwitch } from '@/components/ThemeSwitch'
import { LocaleDropdown } from '@/components/LocaleDropdown'
import { useI18n } from '@/hooks/web/useI18n'
import { underlineToHump } from '@/utils'
import { useAppStore } from '@/store/modules/app'
import { useDesign } from '@/hooks/web/useDesign'
import { ref } from 'vue'
import Socket from '@/socket/index'
import config from '@/socket/config/config'

Socket.getSocketInstance().then((socket) => {
  if (socket) {
    socket.close(config.ERROR_CODE.normal)
  }
})

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
  <div
    :class="prefixCls"
    class="h-[100%] relative <xl:bg-v-dark <sm:px-10px <xl:px-10px <md:px-10px"
  >
    <div class="relative h-full flex mx-auto">
      <!-- <div
        :class="`${prefixCls}__left flex-1 bg-gray-500 bg-opacity-20 relative p-30px <xl:hidden`"
      >
        <div class="flex items-center relative text-white">
          <img src="@/assets/imgs/logo.png" alt="" class="w-48px h-48px mr-10px" />
          <span class="text-20px font-bold">{{ underlineToHump(appStore.getTitle) }}</span>
        </div>
        <div class="flex justify-center items-center h-[calc(100%-60px)]">
          <TransitionGroup
            appear
            tag="div"
            enter-active-class="animate__animated animate__bounceInLeft"
          >
            <img src="@/assets/svgs/login-box-bg.svg" key="1" alt="" class="w-350px" />
            <div class="text-3xl text-white" key="2">{{ t('login.welcome') }}</div>
          </TransitionGroup>
        </div>
      </div> -->
      <div class="h-full flex-1 p-30px <sm:p-10px dark:bg-v-dark relative login-wrapper">
        <!-- <div class="flex justify-between items-center text-white @2xl:justify-end @xl:justify-end">
          <div class="flex items-center @2xl:hidden @xl:hidden">
            <img src="@/assets/imgs/logo.png" alt="" class="w-48px h-48px mr-10px" />
            <span class="text-20px font-bold">{{ underlineToHump(appStore.getTitle) }}</span>
          </div>

          <div class="flex justify-end items-center space-x-10px">
            <ThemeSwitch />
            <LocaleDropdown class="<xl:text-white dark:text-white" />
          </div>
        </div> -->
        <div class="login-container flex items-center m-auto w-[100%]">
          <div class="left-content">
            <div class="title flex items-center">
              <img src="@/assets/imgs/login/logo.png" alt="" />
              <h1>屯垦生产信息系统</h1>
            </div>
          </div>
          <!-- <Transition appear enter-active-class="animate__animated animate__bounceInLeft">
            <div class="left-content">
              <div class="title flex items-center">
                <img src="@/assets/imgs/login/logo.png" alt="" />
                <h1>屯垦生产信息系统</h1>
              </div>
              <div class="img-content">
                <img src="@/assets/imgs/login/login_icon.png" alt="" />
              </div>
            </div>
          </Transition> -->
          <Transition appear enter-active-class="animate__animated animate__bounceInRight">
            <LoginForm
              v-if="isLogin"
              class="login-content p-20px h-auto m-auto <xl:(rounded-3xl light:bg-white)"
              @to-register="toRegister"
            />
            <RegisterForm
              v-else
              class="p-20px h-auto m-auto <xl:(rounded-3xl light:bg-white)"
              @to-login="toLogin"
            />
          </Transition>
        </div>

        <div class="tips">版权所有 & 技术支持</div>
      </div>
    </div>
  </div>
</template>

<style lang="less" scoped>
@prefix-cls: ~'@{namespace}-login';

.@{prefix-cls} {
  &__left {
    &::before {
      position: absolute;
      top: 0;
      left: 0;
      z-index: -1;
      width: 100%;
      height: 100%;
      background-image: url('@/assets/svgs/login-bg.svg');
      background-position: center;
      background-repeat: no-repeat;
      content: '';
    }
  }
}
.login-wrapper {
  position: relative;
  background-image: url('@/assets/imgs/login/login_bg.jpg');
  background-position: center;
  background-repeat: no-repeat;
  .login-container {
    flex-direction: column;
    // height: 88vh;
    // margin-right: 20%;
    // justify-content: center;
  }
}
.left-content {
  margin: 100px 40px 85px 0;
  // margin-top: 150px;
  .title {
    color: #fff;
    margin-left: 40px;
    h1 {
      font-size: 30px;
      font-weight: 500;
      margin-left: 10px;
      font-family: Alibaba PuHuiTi;
    }
  }
  .img-content {
    max-width: 680px;
    width: 40vw;
    margin-top: 80px;
    img {
      width: 100%;
    }
  }
}
.login-content {
  border-radius: 5px;
  // margin-top: 15%;
  background: #fff;
  // margin-left: 80px;
  width: 640px;
  height: 490px;
  padding-top: 50px;
  // margin-right: 10%;
}
.tips {
  left: 45%;
  position: absolute;
  bottom: 27px;
  color: #fff;
  text-align: center;
  font-family: Alibaba PuHuiTi;
  font-size: 12px;
  // width: 70vw;
  // margin: 0 auto;
  // padding-top: 12px;
  // border-top: 1px solid #223353;
}
</style>
