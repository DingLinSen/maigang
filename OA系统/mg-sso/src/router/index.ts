import { createRouter, createWebHistory, createWebHashHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'
import type { App } from 'vue'
import { Layout, getParentLayout } from '@/utils/routerHelper'
import { useI18n } from '@/hooks/web/useI18n'

const { t } = useI18n()

export const constantRouterMap: AppRouteRecordRaw[] = [
  {
    path: '/',
    component: Layout,
    redirect: '/change',
    name: 'Root',
    meta: {
      hidden: true
    }
  },
  {
    path: '/change',
    component: () => import('@/views/change/index.vue'),
    name: 'Change',
    meta: {
      hidden: true,
      title: '平台跳转页面'
    }
  },
  {
    path: '/redirect',
    component: Layout,
    name: 'Redirect',
    children: [
      {
        path: '/redirect/:path(.*)',
        name: 'Redirect',
        component: () => import('@/views/Redirect/Redirect.vue'),
        meta: {}
      }
    ],
    meta: {
      hidden: true,
      noTagsView: true
    }
  },
  {
    path: '/login',
    component: () => import('@/views/Login/Login.vue'),
    name: 'Login',
    meta: {
      hidden: true,
      title: t('router.login'),
      noTagsView: true
    }
  },
  {
    path: '/404',
    component: () => import('@/views/Error/404.vue'),
    name: 'NoFind',
    meta: {
      hidden: true,
      title: '404',
      noTagsView: true
    }
  }
]

export const asyncRouterMap: AppRouteRecordRaw[] = [
  {
    path: '/',
    component: Layout,
    name: 'Home',
    meta: {
      title: '应用管理',
      icon: 'ant-design:setting-filled'
    },
    children: [
      {
        path: 'ssoManage',
        component: () => import('@/views/Project/ssoManage/index.vue'),
        name: 'ssoManage',
        meta: {
          title: '应用列表',
          icon: ' '
        }
      },
      {
        path: 'appAccess',
        component: () => import('@/views/Project/appAccess/index.vue'),
        name: 'appAccess',
        meta: {
          title: '应用访问关系',
          icon: ' '
        }
      }
    ]
  },
  {
    path: '/log',
    component: Layout,
    name: 'log',
    meta: {
      title: '日志管理',
      icon: 'cib:telegram-plane'
    },
    children: [
      {
        path: 'logInfo',
        component: () => import('@/views/Project/logInfo/index.vue'),
        name: 'logInfo',
        meta: {
          title: '登录日志',
          icon: ' '
        }
      }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(),
  strict: true,
  routes: constantRouterMap as RouteRecordRaw[],
  scrollBehavior: () => ({ left: 0, top: 0 })
})

export const resetRouter = (): void => {
  //用户在退出时会清空所有路由，并保留resetWhiteNameList的路由
  const resetWhiteNameList = ['Redirect', 'Login', 'NoFind', 'Root', 'Change', 'Home']
  router.getRoutes().forEach((route) => {
    const { name } = route
    if (name && !resetWhiteNameList.includes(name as string)) {
      router.hasRoute(name) && router.removeRoute(name)
    }
  })
}

export const setupRouter = (app: App<Element>) => {
  app.use(router)
}

export default router
