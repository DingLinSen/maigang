import { createRouter, createWebHashHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'
import type { App } from 'vue'
import { Layout } from '@/utils/routerHelper'

export const constantRouterMap: AppRouteRecordRaw[] = [
  {
    path: '/',
    component: Layout,
    redirect: '/home',
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
  // 统一使用sso登录
  // {
  //   path: '/login',
  //   component: () => import('@/views/Login/Login.vue'),
  //   name: 'Login',
  //   meta: {
  //     hidden: true,
  //     title: t('router.login'),
  //     noTagsView: true
  //   }
  // },
  {
    path: '/home',
    component: () => import('@/views/Home/Home.vue'),
    name: 'Home',
    meta: {
      hidden: true,
      title: '首页',
      noTagsView: true
    }
  },
  {
    path: '/Personal',
    component: () => import('@/views/Personal/Personal.vue'),
    name: 'Personal',
    meta: {
      hidden: true,
      title: '个人中心',
      noTagsView: true
    },
    redirect: '/Personal/myUpload',
    children: [
      {
        path: 'myUpload',
        name: 'MyUpload',
        component: () => import('@/views/Personal/MyUpload/MyUpload.vue'),
        meta: {
          title: '我的上传'
        }
      },
      {
        path: 'myDownload',
        name: 'MyDownload',
        component: () => import('@/views/Personal/MyDownload/MyDownload.vue'),
        meta: {
          title: '我的下载'
        }
      },
      {
        path: 'myShare',
        name: 'MyShare',
        component: () => import('@/views/Personal/MyShare/MyShare.vue'),
        meta: {
          title: '我的分享'
        }
      },
      {
        path: 'shareWithMe',
        name: 'ShareWithMe',
        component: () => import('@/views/Personal/ShareWithMe/ShareWithMe.vue'),
        meta: {
          title: '与我共享'
        }
      },
      {
        path: 'myCollection',
        name: 'MyCollection',
        component: () => import('@/views/Personal/MyCollection/MyCollection.vue'),
        meta: {
          title: '我的收藏'
        }
      },
      {
        path: 'myLike',
        name: 'MyLike',
        component: () => import('@/views/Personal/MyLike/MyLike.vue'),
        meta: {
          title: '我的点赞'
        }
      },
      {
        path: 'myBrowse',
        name: 'MyBrowse',
        component: () => import('@/views/Personal/MyBrowse/MyBrowse.vue'),
        meta: {
          title: '我的浏览'
        }
      },
      {
        path: 'myLabel',
        name: 'MyLabel',
        component: () => import('@/views/Personal/MyLabel/MyLabel.vue'),
        meta: {
          title: '我的标签'
        }
      },
      {
        path: 'myGroup',
        name: 'MyGroup',
        component: () => import('@/views/Personal/MyGroup/MyGroup.vue'),
        meta: {
          title: '我的群组'
        }
      },
      {
        path: 'recycleBin',
        name: 'RecycleBin',
        component: () => import('@/views/Personal/RecycleBin/RecycleBin.vue'),
        meta: {
          title: '回收站'
        }
      }
    ]
  },
  {
    path: '/myDetail/:id',
    name: 'MyDetail',
    component: () => import('@/views/Personal/MyDetail/MyDetail.vue'),
    meta: {
      hidden: true
    }
  },
  {
    path: '/myDetail/:id/share/:shareId',
    name: 'shareDetail',
    component: () => import('@/views/Personal/MyDetail/MyDetail.vue'),
    meta: {
      hidden: true
    }
  },
  {
    path: '/myDetail/:id/uuid/:uuid',
    name: 'uuidDetail',
    component: () => import('@/views/Personal/MyDetail/MyDetail.vue'),
    meta: {
      hidden: true
    }
  },
  {
    path: '/Search',
    component: () => import('@/views/Search/Search.vue'),
    name: 'Search',
    meta: {
      hidden: true,
      title: '搜索',
      noTagsView: true
    },
    redirect: '/Search/searchResult',
    children: [
      {
        path: 'searchResult/:keyword',
        name: 'SearchResult',
        component: () => import('@/views/Search/SearchResult/SearchResult.vue'),
        meta: {
          title: '搜索结果'
        }
      }
    ]
  },
  {
    path: '/message',
    name: 'Message',
    component: () => import('@/views/Message/Message.vue'),
    meta: {
      hidden: true,
      title: '消息中心'
    }
  },
  // {
  //   path: '/userProfile',
  //   component: Layout,
  //   name: 'UserProfile',
  //   meta: {
  //     hidden: true,
  //     title: '个人中心',
  //     noTagsView: true
  //   },
  //   children: [
  //     {
  //       path: 'profile',
  //       component: () => import('@/views/User/Profile.vue'),
  //       name: 'Profile',
  //       meta: {
  //         hidden: true,
  //         title: '个人中心',
  //         noCache: true,
  //         noTagsView: false,
  //         icon: 'ep:avatar'
  //       }
  //     }
  //   ]
  // },
  {
    path: '/menu',
    component: () => import('@/views/Sys/Menu/Menu.vue'),
    name: 'Menu',
    meta: {
      hidden: true,
      title: '菜单',
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
export const asyncRouterMap: AppRouteRecordRaw[] = []
const router = createRouter({
  history: createWebHashHistory(),
  strict: true,
  routes: constantRouterMap as RouteRecordRaw[],
  scrollBehavior: () => ({ left: 0, top: 0 })
})
export const resetRouter = (): void => {
  const resetWhiteNameList = [
    'Redirect',
    'Login',
    'NoFind',
    'Root',
    'Profile',
    'MyDetail',
    'Message'
  ]
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
