<script lang="ts" setup>
import { computed, onMounted, ref, provide, onUnmounted, nextTick, watch } from 'vue'
import { useAppStore } from '@/store/modules/app'
import { ConfigGlobal } from '@/components/ConfigGlobal'
import { isDark } from '@/utils/is'
import { useRouter } from 'vue-router'
import { useDesign } from '@/hooks/web/useDesign'
import { useCache } from '@/hooks/web/useCache'
import { useEmitt } from '@/hooks/web/useEmitt'
import type { RouteRecordRaw } from 'vue-router'
import { getQuery, getRouterPath } from '@/hooks/event/useScrollTo'
import { getUserInfoApi } from '@/api/sys/user'
import { getTokenApi } from '@/api/login'
import { getMenuList } from '@/api/common'
import { useCookies } from 'vue3-cookies'
import { ElMessage } from 'element-plus'
import { usePermissionStore } from '@/store/modules/permission'
import { LimitDailog } from '@/views/Components/limit'
import { useWebSocketStore } from '@/store/modules/webSocket'
import Socket from '@/socket/index'
import { removeWatermark, setWaterMark } from './utils/watermark'
import { VersionDailog } from '@/components/Version'
import { listToTree } from '@/utils/tree'
import getAssetsFile from '@/utils/pubUse'
import { getAllUserListApi } from '@/api/user' // 获取所有用户
import { getAllDeptListApi } from '@/api/sys/dept' // 获取所有部门
import { getNewVersionDetailApi } from '@/api/version' //获取当前最新发布版本
import DevicePixelRatio from '@/utils/DevicePixelRatio' //引入分辨率适配
import { ChatDailog } from '@/components/ChatDailog'
import introJs from 'intro.js'
import { IntroJs, Step, Options } from 'intro.js'
import 'intro.js/introjs.css'
// 设置水印
// onMounted(() => {
//   console.log(wsCache.get('userInfo'))
//   nextTick(() => {
//     console.log(wsCache.get('userInfo'))
//     // setWaterMark('MGdaas', wsCache.get('userInfo').nickName ? wsCache.get('userInfo').nickName : '')
//   })
// })
//
// onUnmounted(() => {
//   removeWatermark()
// })
const bodyScale = () => {
  var devicewidth = document.documentElement.clientWidth //获取当前分辨率下的可是区域宽度
  var scale = devicewidth / 1920 // 分母——设计稿的尺寸
  document.body.style.zoom = scale //放大缩小相应倍数
}
const { getPrefixCls } = useDesign()

const prefixCls = getPrefixCls('app')

const appStore = useAppStore()

const currentSize = computed(() => appStore.getCurrentSize)

const permissionStore = usePermissionStore()

const { currentRoute, addRoute, push, replace } = useRouter()

// sso地址
const loginClientId = import.meta.env.VITE_WS_BASE_CLIENTID
// 跳转时用于判断是哪一个项目
const loginUrl = import.meta.env.VITE_WS_BASE_LOGIN_URL

const greyMode = computed(() => appStore.getGreyMode)

const { wsCache } = useCache()

const { emitter } = useEmitt({
  name: 'version',
  callback: (type: string) => {
    if (type === 'open') {
      versionDailogRef.value.open()
    }
  }
})

const { cookies } = useCookies()

const redirect = ref<string>('')

const store = useWebSocketStore()
const appMessageData = ref<any>([])
const timer = ref()
const socket = ref<Socket>()
const PATH_URL = import.meta.env.VITE_WS_BASE_URL

const closeCallback = (res: any) => {
  // console.log('closeCallback==>', res)
}
const errorCallback = (res: any) => {
  // console.log('errorCallback==>', res)
}

// 监听浏览器窗口高度的变化
const resetClientHeight = () => {
  appStore.setDocumentClientHeight(document.documentElement['clientHeight'])
  window.onresize = () => {
    appStore.setDocumentClientHeight(document.documentElement['clientHeight'])
    emitter.emit('window', 'resize')
  }
}

const login = async () => {
  // 获取路由参数中的某一个值
  let code = getQuery('code')
  let token = cookies.get('access_token')
  const refresh_token = cookies.get('refresh_token')
  // 获取地址中的href参数并转化为ASCII格式
  // 获取路由中的（外部路由地址，登录后跳回这个地址）
  let href = encodeURIComponent(window.location.href)
  // 判断token，为true直接进入，为false获取routeQuery.code，
  // code为路径中存在的，或者sso页面跳转时携带到路由上的
  //使用code调取token接口

  if (token || refresh_token) {
    wsCache.set(appStore.getToken, token)
    initWebSocket()
    getUserInfo()
    getAllUserlist()
  } else {
    if (code) {
      let params: any = {
        code: code
      }
      await getTokenApi(params).then((res) => {
        if (res.data) {
          const data = res.data
          cookies.set('access_token', data.accessToken, data.accessTokenExpireTime)
          wsCache.set(appStore.getToken, data.accessToken)
          // token过期时间
          wsCache.set(appStore.getExpires, data.accessTokenExpireTime)
          ElMessage.success('登录成功')
          getUserInfo()
          getAllUserlist()
          initWebSocket()
        }
      })
      // 跳转到外部sso地址
    } else {
      window.location.href = loginUrl + '?clientId=' + loginClientId + '&redirectUri=' + href
    }
  }
}

const getUserInfo = async () => {
  // getCurrentVersionInfo()
  let param = {}
  await getUserInfoApi(param).then((res) => {
    const user = Object.assign(res.data.user, {
      permissions: res.data.permissions
    })
    let token = cookies.get('access_token')
    wsCache.set(appStore.getToken, token)
    appStore.setUserNickName(user.nickName)
    wsCache.set(appStore.getUserInfo, user)
    setWaterMark('MGdaas', wsCache.get('userInfo').nickName ? wsCache.get('userInfo').nickName : '')
    getMenuDataList()
  })
}

const getMenuDataList = async () => {
  await getMenuList().then((res) => {
    let routers: any[] = []
    routers = routers.concat(res.data)
    routers.forEach((item: any) => {
      if (item.hidden) {
        item.alwaysShow = false
        item.meta.hidden = true
      }
    })
    wsCache.set('roleRouters', routers)
    appStore.setDynamicRouter(true)
    permissionStore
      .generateRoutes('admin', routers)
      .then(() => {})
      .catch(() => {})
    permissionStore.getAddRouters.forEach((route) => {
      addRoute(route as RouteRecordRaw) // 动态添加可访问路由表
    })
    permissionStore.setIsAddRouters(false)
    redirect.value = currentRoute.value.path
    if (redirect.value === '/') {
      let routerPath = getRouterPath()
      if (routerPath) {
        push({ path: routerPath })
      } else {
        push({ path: '/home' })
      }
    } else {
      setTimeout(() => {
        let url = ''
        let routerList: any = permissionStore.getAddRouters[0]

        if (routerList && routerList.children?.length > 0) {
          url = `${routerList.path === '/' ? '' : routerList.path}/${routerList.children[0].path}`

          if (routerList.children.find((s) => s.isDefaultHidden)) {
            let list = routerList.children.find((s) => !s.isDefaultHidden)
            url = `${list.path}`
          }
        } else {
          url = routerList.path
        }

        push({ path: redirect.value || url || '/home' })
        wsCache.set('isTip', true) // isTip用于展示只有登录后才需要展示的内容
      }, 100)
    }
  })
}

onMounted(() => {
  login()
  window.addEventListener('resize', resetClientHeight)
  resetClientHeight()
  // new DevicePixelRatio().init()
  // bodyScale()
})
// 根据浏览器当前主题设置系统主题色
const setDefaultTheme = () => {
  if (wsCache.get('isDark') !== null) {
    appStore.setIsDark(wsCache.get('isDark'))
    return
  }
  const isDarkTheme = isDark()
  appStore.setIsDark(isDarkTheme)
}

//获取所有用户
const getAllUserlist = async () => {
  try {
    const res = await getAllDeptListApi({})
    const { data } = await getAllUserListApi({})
    deptData.value = res.data
    userData.value = data

    getprincipalTree()

    return data
  } catch (error) {
    console.log(error)
  }
}

const deptData = ref<any>([])
const userData = ref<any>([])
const principalOtherTree = ref<any>([])

const getprincipalTree = async () => {
  if (deptData.value.length) {
    deptData.value.forEach((deptItem: any) => {
      userData.value.forEach((userItem: any) => {
        if (deptItem.deptId === userItem.deptId) {
          deptItem.children.push({
            deptId: userItem.userId,
            deptName: userItem.nickName,
            postStr: userItem.postStr
          })
        }
      })
    })

    principalOtherTree.value = listToTree(deptData.value, {
      id: 'deptId',
      children: 'children',
      pid: 'parentId'
    })
  }
}

// getAllUserlist()
// provide('principalOtherTree', principalOtherTree)

provide('principalOtherTree', principalOtherTree)

setDefaultTheme()

const versionDailogRef = ref()

//
const getCurrentVersionInfo = async () => {
  await getNewVersionDetailApi().then((res) => {
    if (res) {
      wsCache.set('version', res.data)
    }
  })
}

//初始化websocket
const initWebSocket = () => {
  if (wsCache.get('access_token')) {
    if (socket.value) {
      socket.value.close()
    }
    const socketParams = {
      url: PATH_URL + `/message-center/ws/oa?Authorization=${wsCache.get('access_token')}`,
      reconnectLimit: 6,
      openCallback: open2Callback,
      messageCallback: message2Callback,
      closeCallback: closeCallback,
      errorCallback: errorCallback
    }
    socket.value = new Socket(socketParams)
  }
  setNormalPageTitle()
}

//设置默认的页标
const setNormalPageTitle = () => {
  let pageTitleDom: any = document.getElementById('pageTitle')
  pageTitleDom.innerText =
    '麦港协同办公系统' +
    (currentRoute.value.meta.title ? ' - ' + currentRoute.value.meta.title : '')
  let link: any = document.querySelector('link[rel*="icon"]') || document.createElement('link')
  link.type = 'image/x-icon'
  link.rel = 'shortcut icon'
  link.href = getAssetsFile('ico/0.ico')
}

const open2Callback = (res: any) => {
  console.log('open2Callback===>websokect连接成功！')
  appMessageData.value = []
  store.setwebSocketData(appMessageData.value)
  unReadNumber.value = 0
}

//消息接收
const message2Callback = (res: any) => {
  let data = JSON.parse(res)
  if (data) {
    //第一次接收所有数据
    if (data.flag == '1') {
      if (data.messages && data.messages.length) {
        if (appMessageData.value.length) {
          data.messages.map((item: any) => {
            if (/[{}]/.test(item.content)) {
              let content = JSON.parse(item.content)
              content['historyId'] = item.historyId
              appMessageData.value.unshift(content)
            }
          })
        } else {
          data.messages.map((item: any) => {
            if (/[{}]/.test(item.content)) {
              let content = JSON.parse(item.content)
              content['historyId'] = item.historyId
              appMessageData.value.push(content)
            }
          })
        }
        console.log('appMessageData==>', appMessageData.value)
        store.setwebSocketData(appMessageData.value)
      }
    } else if (data.flag == '2') {
      console.log('data.messages==>', data.messages)
      //已读的数据剔除
      if (data.messages && data.messages.length) {
        let messageIds: any = []
        data.messages.map((item: any) => {
          messageIds.push(item.historyId)
        })
        appMessageData.value = appMessageData.value.filter(
          (item: any) => !messageIds.includes(item.historyId)
        )
        store.setwebSocketData(appMessageData.value)
      }
    }
    getUnreadMessageNumber()
  }
}

//计算未读消息数
const getUnreadMessageNumber = () => {
  let number = 0
  if (appMessageData.value && appMessageData.value.length) {
    number = appMessageData.value.filter(
      (item: any) => item.flag != 1 && item.type != '周报'
    ).length
  }
  if (number !== unReadNumber.value) {
    unReadNumber.value = number
    updatePageTitle()
  }
}

//未读消息数
const unReadNumber = ref<number>(0)
//更新页标
const updatePageTitle = () => {
  let pageTitleDom: any = document.getElementById('pageTitle')
  let link: any = document.querySelector('link[rel*="icon"]') || document.createElement('link')
  link.type = 'image/x-icon'
  link.rel = 'shortcut icon'
  let publicSrc = [
    'ico/' + (unReadNumber.value < 11 ? unReadNumber.value : 11) + '.ico',
    'ico/0.ico'
  ]
  clearInterval(timer.value)
  timer.value = null
  if (unReadNumber.value) {
    var currentIndex = -1 // 初始化当前索引值为-1（表示还未开始）
    timer.value = setInterval(() => {
      var titles = [
        '您有' + (unReadNumber.value ? unReadNumber.value : 0) + '条未处理的待办事宜',
        '麦港协同办公系统' +
          (currentRoute.value.meta.title ? ' - ' + currentRoute.value.meta.title : '')
      ]
      pageTitleDom.innerText = titles[++currentIndex]
      link.href = getAssetsFile(publicSrc[currentIndex])
      if (currentIndex == 1) {
        currentIndex = -1
      }
    }, 3000)
  } else {
    pageTitleDom.innerText =
      '麦港协同办公系统' +
      (currentRoute.value.meta.title ? ' - ' + currentRoute.value.meta.title : '')
    link.href = getAssetsFile('ico/0.ico')
  }
}

onUnmounted(() => {
  if (timer.value) {
    clearInterval(timer.value)
  }
  if (socket.value) {
    socket.value.close()
  }
})

const showChat = ref<boolean>(false)

const closeChat = () => {
  showChat.value = false
}

useEmitt({
  name: 'chat',
  callback: (type: string) => {
    if (type === 'show') {
      showChat.value = !showChat.value
    } else if (type === 'guide') {
      restChatGuidePosition()
    }
  }
})

const showChatGuide = ref<boolean>(false)
const closeGuide = () => {
  showChatGuide.value = false
  localStorage.setItem('chatGuide', 'true')
}

const top = ref<number>(85)
const restChatGuidePosition = () => {
  if (localStorage.getItem('chatGuide') !== 'true') {
    let chatDiv = document.querySelector('.chat-button-class')
    if (chatDiv) {
      let y = chatDiv.getBoundingClientRect().bottom
      top.value = document.documentElement.offsetHeight - y
    }
    showChatGuide.value = true
  }
}
</script>

<template>
  <ConfigGlobal :size="currentSize">
    <RouterView :class="greyMode ? `${prefixCls}-grey-mode` : ''" />
    <div class="app-loading">
      <div class="app-loading-wrap">
        <div class="app-loading-title">
          <img alt="Logo" class="app-loading-logo" src="/logo.png" />
          <div class="app-loading-title">{{ appStore.title }}</div>
        </div>
        <div class="app-loading-item">
          <div class="app-loading-outter"></div>
          <div class="app-loading-inner"></div>
        </div>
      </div>
    </div>
    <VersionDailog ref="versionDailogRef" />
    <ChatDailog :show="showChat" @close="closeChat" />
    <div class="intro-wrap" v-show="showChatGuide" @click="closeGuide">
      <div class="intro-content">
        <div class="intro-box-wrap" :style="{ bottom: top + 'px' }">
          <div class="intro-box">
            <div class="intro-title">
              <img class="intro-title-img" src="@/assets/imgs/home/hello_icon.png" />
              <span class="ml-[5px]">你好，我是智能小助手~</span>
            </div>
            <div class="intro-message mt-[14px]"> 点我，问题即解，畅通无阻！</div>
            <div class="intro-message">快速响应解答，问题将不再是问题。</div>
            <div class="intro-button" @click="closeGuide">我知道了 </div>
          </div>
        </div>
      </div>
    </div>
  </ConfigGlobal>
</template>

<style lang="less">
.intro-button {
  margin-top: 15px;
  margin-left: 5px;
  width: 74px;
  height: 32px;
  line-height: 32px;
  text-align: center;
  border-radius: 3px;
  border: 1px solid #ffffff;
  font-size: 14px;
  color: white;
  cursor: pointer;
  font-family: Alibaba PuHuiTi S;
}
.intro-message {
  font-size: 14px;
  color: white;
  margin-left: 5px;
  font-family: Alibaba PuHuiTi S;
}
.intro-title-img {
  width: 30px;
  height: 30px;
}
.intro-title {
  width: 100%;
  display: flex;
  justify-items: center;
  align-items: center;
  font-size: 20px;
  color: white;
}
.intro-content {
  position: relative;
  width: 100%;
  height: 100%;
}
.intro-box-wrap {
  position: absolute;
  right: 90px;
  bottom: 0px;
  width: 325px;
  height: 170px;
  background: #000000;
  opacity: 0.9;
  border-radius: 5px;
}
.intro-box {
  padding: 20px 18px;
  opacity: 1;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, #00a0e9 0%, #7fbe2b 100%);
  border-radius: 5px;
}
.intro-box::after {
  content: '';
  position: absolute;
  left: 325px;
  bottom: 16px;
  width: 0px;
  height: 0px;
  border: 8px solid transparent;
  border-left: 8px solid #7fbe2b;
}
.intro-wrap {
  position: absolute;
  background: rgba(0, 0, 0, 0.6);
  top: 0px;
  left: 0px;
  width: 100vw;
  height: 100vh;
  z-index: 2000;
}
@prefix-cls: ~'@{namespace}-app';
.fileIcon {
  width: 1em;
  height: 1em;
  vertical-align: -0.15em;
  fill: currentColor;
  overflow: hidden;
  display: inline-block;
  margin-right: 8px;
}

.uploadFileIcon {
  width: 1em;
  height: 1em;
  vertical-align: -0.15em;
  fill: currentColor;
  overflow: hidden;
  display: inline-block;
}

.size {
  width: 100%;
  height: 100%;
}

html,
body {
  padding: 0 !important;
  margin: 0;
  overflow: hidden;
  font-family: Alibaba PuHuiTi R;
  .size;

  #app {
    .size;
  }
}

.@{prefix-cls}-grey-mode {
  filter: grayscale(100%);
}

.app-loading {
  display: flex;
  width: 100%;
  height: 100%;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  background: #f0f2f5;
}

.app-loading .app-loading-wrap {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
}

.app-loading .app-loading-title {
  margin-bottom: 30px;
  font-size: 20px;
  font-weight: bold;
  text-align: center;
  margin-top: 5px;
  font-family: Alibaba PuHuiTi S;
}

.app-loading .app-loading-logo {
  width: 100px;
  margin: 0 auto 15px auto;
}

.app-loading .app-loading-item {
  position: relative;
  display: inline-block;
  width: 60px;
  height: 60px;
  vertical-align: middle;
  border-radius: 50%;
}

.app-loading .app-loading-outter {
  position: absolute;
  width: 100%;
  height: 100%;
  border: 4px solid #2d8cf0;
  border-bottom: 0;
  border-left-color: transparent;
  border-radius: 50%;
  animation: loader-outter 1s cubic-bezier(0.42, 0.61, 0.58, 0.41) infinite;
}

.app-loading .app-loading-inner {
  position: absolute;
  top: calc(50% - 20px);
  left: calc(50% - 20px);
  width: 40px;
  height: 40px;
  border: 4px solid #87bdff;
  border-right: 0;
  border-top-color: transparent;
  border-radius: 50%;
  animation: loader-inner 1s cubic-bezier(0.42, 0.61, 0.58, 0.41) infinite;
}

@-webkit-keyframes loader-outter {
  0% {
    -webkit-transform: rotate(0deg);
    transform: rotate(0deg);
  }

  100% {
    -webkit-transform: rotate(360deg);
    transform: rotate(360deg);
  }
}

@keyframes loader-outter {
  0% {
    -webkit-transform: rotate(0deg);
    transform: rotate(0deg);
  }

  100% {
    -webkit-transform: rotate(360deg);
    transform: rotate(360deg);
  }
}

@-webkit-keyframes loader-inner {
  0% {
    -webkit-transform: rotate(0deg);
    transform: rotate(0deg);
  }

  100% {
    -webkit-transform: rotate(-360deg);
    transform: rotate(-360deg);
  }
}

@keyframes loader-inner {
  0% {
    -webkit-transform: rotate(0deg);
    transform: rotate(0deg);
  }

  100% {
    -webkit-transform: rotate(-360deg);
    transform: rotate(-360deg);
  }
}
</style>
