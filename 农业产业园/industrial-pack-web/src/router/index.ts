import { createRouter, createWebHashHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'
import type { App } from 'vue'
import { Layout, getParentLayout } from '@/utils/routerHelper'
import { useI18n } from '@/hooks/web/useI18n'

const { t } = useI18n()

export const constantRouterMap: AppRouteRecordRaw[] = [
  {
    path: '/',
    component: Layout,
    redirect: '/login',
    name: 'Root',
    meta: {
      hidden: true
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
  // {
  //   path: '/VideoLargeScreen',
  //   component: () => import('@/views/VideoLargeScreen/VideoLargeScreen.vue'),
  //   name: 'VideoLargeScreen',
  //   meta: {
  //     hidden: true,
  //     title: '大屏',
  //     noTagsView: true
  //   }
  // },
  {
    path: '/user',
    component: Layout,
    name: 'UserProfile',
    meta: {
      hidden: true,
      title: '个人中心',
      noTagsView: true
    },
    children: [
      {
        path: 'profile',
        component: () => import('@/views/User/Profile.vue'),
        name: 'Profile',
        meta: {
          hidden: true,
          title: '个人中心',
          noCache: true,
          noTagsView: false,
          icon: 'ep:avatar'
        }
      }
    ]
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
    meta: {},
    children: [
      {
        path: 'home',
        component: () => import('@/views/Home/Home.vue'),
        name: 'Home',
        meta: {
          title: '概览',
          icon: 'cib:telegram-plane'
        }
      }
    ]
  }
  // {
  //   path: '/sys',
  //   component: Layout,
  //   name: 'Sys',
  //   meta: {},
  //   children: [
  //     {
  //       path: 'sys',
  //       component: () => import('@/views/Home/Home.vue'),
  //       name: 'Sys',
  //       meta: {
  //         title: '系统管理',
  //         icon: 'cib:telegram-plane'
  //       }
  //     }
  //   ]
  // },
]

const router = createRouter({
  history: createWebHashHistory(),
  strict: true,
  routes: constantRouterMap as RouteRecordRaw[],
  scrollBehavior: () => ({ left: 0, top: 0 })
})

export const resetRouter = (): void => {
  const resetWhiteNameList = ['Redirect', 'Login', 'NoFind', 'Root']
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
