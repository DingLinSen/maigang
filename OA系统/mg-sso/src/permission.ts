import { useCookies } from 'vue3-cookies'
import router from './router'
import { useAppStoreWithOut } from '@/store/modules/app'
import { useCache } from '@/hooks/web/useCache'
import type { RouteRecordRaw } from 'vue-router'
import { useTitle } from '@/hooks/web/useTitle'
import { useNProgress } from '@/hooks/web/useNProgress'
import { usePermissionStoreWithOut } from '@/store/modules/permission'
import { usePageLoading } from '@/hooks/web/usePageLoading'
const permissionStore = usePermissionStoreWithOut()
const appStore = useAppStoreWithOut()
// const { push } = useRouter()
const { cookies } = useCookies()

const { wsCache } = useCache()

const { start, done } = useNProgress()

const { loadStart, loadDone } = usePageLoading()

const whiteList = ['/login'] // 不重定向白名单

router.beforeEach(async (to, from, next) => {
  start()
  loadStart()
  const token = cookies.get('access_token')
  if (token) {
    if (to.path === '/login') {
      next()
    } else {
      if (permissionStore.getIsAddRouters) {
        next()
        return
      }
      // 开发者可根据实际情况进行修改
      const roleRouters = wsCache.get('roleRouters') || []

      // 是否使用动态路由
      if (appStore.getDynamicRouter) {
        await permissionStore.generateRoutes('none', roleRouters as AppCustomRouteRecordRaw[])
      } else {
        await permissionStore.generateRoutes('none')
      }

      permissionStore.getAddRouters.forEach((route) => {
        router.addRoute(route as unknown as RouteRecordRaw) // 动态添加可访问路由表
      })

      const redirectPath = from.query.redirect || to.path

      const redirect = decodeURIComponent(redirectPath as string)
      const nextData = to.path === redirect ? { ...to, replace: true } : { path: redirect }
      permissionStore.setIsAddRouters(true)
      next(nextData)
    }
  } else {
    // cookies.remove('access_token')
    // cookies.remove('Admin-Expires-In')
    wsCache.set(appStore.getUserInfo, null)
    wsCache.clear()
    if (whiteList.indexOf(to.path) !== -1) {
      next()
    } else {
      next(`/login?redirect=${to.path}`) // 否则全部重定向到登录页
    }
  }
})

router.afterEach((to) => {
  useTitle(to?.meta?.title as string)
  done() // 结束Progress
  loadDone()
})
