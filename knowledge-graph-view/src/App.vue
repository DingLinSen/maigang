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
import { getQuery } from '@/hooks/event/useScrollTo'
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
import { getUserInfoApi, addCheck, getUserListApi } from '@/api/sys/user'
import DevicePixelRatio from '@/utils/DevicePixelRatio' //引入分辨率适配
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
//口高度的变化
const resetClientHeight = () => {
  appStore.setDocumentClientHeight(document.documentElement['clientHeight'])
  window.onresize = () => {
    appStore.setDocumentClientHeight(document.documentElement['clientHeight'])
    emitter.emit('window', 'resize')
  }
}
const login = async () => {
  console.log(11111, 99999)
  // 获取路由参数中的某一个值
  let code = getQuery('code')

  console.log(code, 1111)
  let token = cookies.get('access_token')
  const refresh_token = cookies.get('refresh_token')
  // 获取地址中的href参数并转化为ASCII格式
  // 获取路由中的（外部路由地址，登录后跳回这个地址）
  let href = encodeURIComponent(window.location.href)
  // 判断token，为true直接进入，为false获取routeQuery.code，
  // code为路径中存在的，或者sso页面跳转时携带到路由上的
  //使用code调取token接口
  console.log(11111, 99999, code, href)
  if (code) {
    let params: any = {
      code: code,
      platform: 'knowledge'
    }
    await getTokenApi(params).then((res) => {
      if (res.data) {
        const data: any = res.data

        cookies.set('access_token', data.accessToken, data.accessTokenExpireTime)
        wsCache.set(appStore.getToken, data.accessToken)
        // token过期时间
        wsCache.set(appStore.getExpires, data.accessTokenExpireTime)
        ElMessage.success('登录成功')
        initWebSocket()
        getOaUserInfoData(data.user.id)
      }
    })
    // 跳转到外部sso地址
  } else {
    if (token || refresh_token) {
      wsCache.set(appStore.getToken, token)
      initWebSocket()
      getUserInfo()
      getAllUserlist()
    } else {
      window.location.href = loginUrl + '?clientId=' + loginClientId + '&redirectUri=' + href
    }
  }
}
const getOaUserInfoData = async (id) => {
  console.log(2222, 99999)
  // 获取用户全部信息
  await getUserInfoApi().then((res) => {
    if (res && res.data) {
      console.log(res, 99999)
      getIsCheckExists(res.data.user)
    }
  })
}
const getIsCheckExists = async (params) => {
  console.log(3333, 99999)
  // 根据当前用户信息验证用户是否可登录
  const res = await addCheck(params)
  getUserInfo()
  getAllUserlist()
}
const getUserInfo = async () => {
  // getCurrentVersionInfo()
  let param = {}
  await getUserListApi(param).then((res) => {
    const user = Object.assign(res.data.user, {
      permissions: res.data.permissions
    })
    let token = cookies.get('access_token')
    wsCache.set(appStore.getToken, token)
    appStore.setUserNickName(user.nickName)
    wsCache.set(appStore.getUserInfo, user)
    setWaterMark('MGdaas', wsCache.get('userInfo').nickName ? wsCache.get('userInfo').nickName : '')

    console.log(wsCache.get('userInfo'), 2333)
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
    // console.log('redirect.value', redirect.value)
    if (redirect.value === '/') {
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
        // console.log(redirect.value, url)
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

//WebSocket
const timer = ref()
const store = useWebSocketStore()
const appMessageData = ref<any>([])
const socket = ref<Socket>()
const PATH_URL = import.meta.env.VITE_WS_BASE_URL
//初始化websocket
const initWebSocket = () => {
  if (wsCache.get('access_token')) {
    if (socket.value) {
      socket.value.close()
    }
    const socketParams = {
      url:
        PATH_URL +
        `/message-center/ws/oa?Authorization=${wsCache.get(
          'access_token'
        )}&application_name=knowledge-graph`,
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

const open2Callback = (res: any) => {
  appMessageData.value = []
}

//消息接收
const message2Callback = (res: any) => {
  let data = JSON.parse(res)
  if (data) {
    if (data.messages && data.messages.length) {
      data.messages.map((item: any) => {
        if (/[{}]/.test(item.content)) {
          let content = JSON.parse(item.content)
          content['historyId'] = item.historyId
          content['isRead'] = data.flag

          if (appMessageData.value.some((v) => v.historyId == content.historyId)) {
            let Indexes = null
            appMessageData.value.some((v, index) => {
              Indexes = index
              return v.historyId == content.historyId
            })
            if (Indexes || Indexes == 0) {
              appMessageData.value[Indexes].isRead = 2
            }
          } else {
            appMessageData.value.unshift(content)
          }
        }
      })
      // console.log(appMessageData.value, '钱')
      appMessageData.value = appMessageData.value.filter((v) => v.isRead == 1)
      // console.log(appMessageData.value, '后')
      store.setwebSocketData(appMessageData.value)
      getUnreadMessageNumber()
    }
  }
}

const closeCallback = (res: any) => {}
const errorCallback = (res: any) => {}

//设置默认的页标
const setNormalPageTitle = () => {
  let pageTitleDom: any = document.getElementById('pageTitle')
  pageTitleDom.innerText =
    '知识图谱系统' + (currentRoute.value.meta.title ? ' - ' + currentRoute.value.meta.title : '')
  let link: any = document.querySelector('link[rel*="icon"]') || document.createElement('link')
  link.type = 'image/x-icon'
  link.rel = 'shortcut icon'
  link.href = getAssetsFile('ico/0.ico')
}
//未读消息数
const unReadNumber = ref<number>(0)

//计算未读消息数
const getUnreadMessageNumber = () => {
  let number = 0
  if (appMessageData.value && appMessageData.value.length) {
    number = appMessageData.value.length
  }
  if (number !== unReadNumber.value) {
    unReadNumber.value = number
    updatePageTitle()
  }
}
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
        '您有' + (unReadNumber.value ? unReadNumber.value : 0) + '条最新消息',
        '知识图谱系统' +
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
      '知识图谱系统' + (currentRoute.value.meta.title ? ' - ' + currentRoute.value.meta.title : '')
    link.href = getAssetsFile('ico/0.ico')
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
          <!-- <Icon class="app_logo_icon" icon="svg-icon:logo" /> -->
          <div class="app-loading-title">{{ appStore.title }}</div>
        </div>
        <div class="app-loading-item">
          <div class="app-loading-outter"></div>
          <div class="app-loading-inner"></div>
        </div>
      </div>
    </div>
    <VersionDailog ref="versionDailogRef" />
  </ConfigGlobal>
</template>
<style lang="less">
@prefix-cls: ~'@{namespace}-app';
.fileIcon {
  width: 1em;
  height: 1em;
  vertical-align: -0.15em;
  fill: currentColor;
  overflow: hidden;
  display: inline-block;
  //margin-right: 8px;
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
  // .app_logo_icon .el-icon {
  //   font-size: 36px !important;
  // }
}
.app-loading .app-loading-logo {
  width: 50px !important;
  height: 50px !important;
  // width: 100px;
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
