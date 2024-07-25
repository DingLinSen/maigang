/**
 * 路由配置
 * 代码中路由统一使用name属性跳转(不使用path属性)
 */
import Vue from 'vue'
import Router from 'vue-router'
import http from '@/api/httpRequest'
import { isURL } from '@/utils/validate'
import { clearLoginInfo, treeDataTranslate, sortByKey } from '@/utils'
Vue.use(Router)

// 开发环境不使用懒加载, 造成webpack热更新太慢, 生产环境使用懒加载
const _import = require('./import-' + process.env.NODE_ENV)

// 全局路由(无需嵌套上左右整体布局)
const globalRoutes = [
  // { path: '/404', component: _import('common/404'), name: '404', meta: { title: '404未找到' } },
  {
    path: '/401',
    component: _import('common/error-page/401'),
    name: '401',
    meta: { title: '401' }
  },
  {
    path: '/404',
    component: _import('common/error-page/404'),
    name: '404',
    meta: { title: '404' }
  },
  {
    path: '/500',
    component: _import('common/error-page/500'),
    name: '500',
    meta: { title: '500' }
  },
  {
    path: '/login',
    component: _import('common/login/login'),
    name: 'login',
    meta: { title: '登录' }
  },
  {
    path: '/download',
    component: _import('common/isIE'),
    name: 'isIE',
    meta: { title: '浏览器下载' }
  },
  // src\view\modules\online\train\index.vue
  {
    path: '/test',
    component: _import('modules/online/train/index'),
    name: 'test',
    meta: { title: '训练考核' }
  },
  {
    path: '/controlDetails',
    component: _import('modules/online/control/controlDetails'),
    name: 'video',
    meta: { title: '考核控制' }
  }
  // {
  //   path: '/video',
  //   component: _import('modules/learn/subject/operate/video'),
  //   name: 'video',
  //   meta: { title: '视频学习' }
  // }
]

// 主入口路由(需嵌套上左右整体布局)
// 通过meta对象设置路由展示方式
// 1. isTab: 是否通过tab展示内容, true: 是, false: 否
// 2. iframeUrl: 是否通过iframe嵌套展示内容, '以http[s]://开头': 是, '': 否
const mainRoutes = {
  path: '/',
  component: _import('wapper/main'),
  name: 'main',
  redirect: { name: 'home' },
  meta: { title: '主入口整体布局' },
  children: [
    { path: '/home', component: _import('common/home'), name: 'home', meta: { title: '首页概览', isTab: true } }
  ],
  beforeEnter (to, from, next) {
    let token = Vue.cookie.get('token')
    if (!token || !/\S/.test(token)) {
      clearLoginInfo()
      next({ name: 'login' })
    }
    const loginUserInfo = JSON.parse(Vue.cookie.get('loginUserInfo'))
    let nowDate = (new Date()).getTime()
    let startTime = new Date(loginUserInfo.startTime).getTime()
    if(loginUserInfo.isNotAssessToday && (nowDate > startTime || startTime - nowDate <= 1800000) && loginUserInfo.terminalId && loginUserInfo.terminalId !== 'null') {
      next({ name: 'test' })
    }
    next()
  }
}

const router = new Router({
  mode: 'hash', // history
  // scrollBehavior: () => ({ y: 0 }),
  isAddDynamicMenuRoutes: false, // 是否已经动态生成(菜单)路由
  routes: globalRoutes.concat(mainRoutes)
})

const VueRouterPush = Router.prototype.push
Router.prototype.push = function push (to) {
  return VueRouterPush.call(this, to).catch(err => err)
}

router.afterEach(to => {
  window.scrollTo(0, 0)
})

router.beforeEach((to, from, next) => {
  // 添加动态(菜单)路由
  // 1. 已经添加 / 全局路由, 直接访问
  // 2. 获取菜单列表, 添加并保存本地存储
  let token = Vue.cookie.get('token')
  if (!token || !/\S/.test(token)) {
    next()
  }
  if (
    router.options.isAddDynamicMenuRoutes ||
    fnCurrentRoute(to, globalRoutes) === 'global'
  ) {
    next()
  } else {
    if (Vue.cookie.get('token')) {
    } else {
      router.push({ name: 'login' })
    }
    if (Vue.cookie.get('token')) {
      var url = 'system/sysMenu/getMenuData' // 请求接口
      // var url = 'system/sysMenu/getMenuDataMock' // 获取菜单列表的mock
      // var url = 'system/sysMenu/queryMenuByRoleId?id=42537d2aa67dc239d7533bef9866972b'
      http
        .$get({
          url: http.mergeUrl(url)
        })
        .then(({ data }) => {
          if (data && data.status) {
            var dataItems = data.data
            const menuList = treeDataTranslate(
              sortByKey(dataItems, 'orderNum'),
              'menuId'
            )
            fnMenuRoutes(menuList)
            router.options.isAddDynamicMenuRoutes = true
            // 存储用户信息，菜单树和访问权限
            sessionStorage.setItem('menuList', JSON.stringify(menuList || '[]'))
            // 遍历菜单数组获取全部perss权限清单
            let permissionsList = []
            data.data.forEach((item, index) => {
              if (item.perms) {
                permissionsList.push(item.perms)
              }
            })
            sessionStorage.setItem(
              'permissions',
              JSON.stringify(permissionsList || '[]')
            )
            next({ ...to, replace: true })
          } else {
            sessionStorage.setItem('menuList', '[]')
            sessionStorage.setItem('permissions', '[]')
            next()
          }
        })
        .catch(e => {
          // console.log(`%c${e} 请求菜单列表和权限失败，跳转至登录页！`, 'color:blue')
          router.push({ name: 'login' })
        })
    }
  }
})

/**
 * 判断当前路由类型, global: 全局路由, main: 主入口路由
 * @param {*} route 当前路由
 */
function fnCurrentRoute(route, globalRoutes = []) {
  var temp = []
  for (var i = 0; i < globalRoutes.length; i++) {
    if (route.path === globalRoutes[i].path) {
      return 'global'
    } else if (
      globalRoutes[i].children &&
      globalRoutes[i].children.length >= 1
    ) {
      temp = temp.concat(globalRoutes[i].children)
    }
  }
  return temp.length >= 1 ? fnCurrentRoute(route, temp) : 'main'
}

/**
 * 添加动态(菜单)路由
 * @param {*} menuList 菜单列表
 * @param {*} routes 递归创建的动态(菜单)路由
 */
function fnMenuRoutes(menuList = [], routes = []) {
  var temp = []
  for (var i = 0; i < menuList.length; i++) {
    if (menuList[i].list && menuList[i].list.length >= 1) {
      temp = temp.concat(menuList[i].list)
    } else if (menuList[i].url && /\S/.test(menuList[i].url)) {
      menuList[i].url = menuList[i].url.replace(/^\//, '')

      var route = {
        path: menuList[i].url.replace('/', '-'),
        component: null,
        name: menuList[i].url.replace('/', '-'),
        meta: {
          menuId: menuList[i].menuId,
          title: menuList[i].name,
          isDynamic: true,
          isTab: true,
          iframeUrl: '',
          parentId: menuList[i].parentId,
          icon: menuList[i].icon,
          url: menuList[i].url
        }
      }

      // url以http[s]://开头, 通过iframe展示
      if (isURL(menuList[i].url)) {
        route['path'] = `i-${menuList[i].menuId}`
        route['name'] = `i-${menuList[i].menuId}`
        route['meta']['iframeUrl'] = menuList[i].url
      } else {
        try {
          route['component'] =
            _import(`modules/${menuList[i].url}/index`) || null
        } catch (e) {}
      }
      routes.push(route)
    }
  }
  if (temp.length >= 1) {
    fnMenuRoutes(temp, routes)
  } else {
    mainRoutes.name = 'main-dynamic'
    mainRoutes.children = routes
    router.addRoutes([mainRoutes, { path: '*', redirect: { name: '404' } }])
    sessionStorage.setItem(
      'dynamicMenuRoutes',
      JSON.stringify(mainRoutes.children || '[]')
    )
    // console.log('%c!<-------------------- 动态(菜单)路由 s -------------------->', 'color:blue')
    // console.log(mainRoutes.children)
  }
}

export default router
