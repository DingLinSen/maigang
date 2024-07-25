import { defineStore } from 'pinia'
import { asyncRouterMap, constantRouterMap } from '@/router'
import {
  generateRoutesFn1,
  generateRoutesFn2,
  flatMultiLevelRoutes,
  filterAsyncRouter
} from '@/utils/routerHelper'
import { store } from '../index'
import { cloneDeep } from 'lodash-es'
import { Layout } from '@/utils/routerHelper'

export interface PermissionState {
  routers: AppRouteRecordRaw[]
  addRouters: AppRouteRecordRaw[]
  isAddRouters: boolean
  menuTabRouters: AppRouteRecordRaw[]
}

export const usePermissionStore = defineStore('permission', {
  state: (): PermissionState => ({
    routers: [],
    addRouters: [],
    isAddRouters: false,
    menuTabRouters: []
  }),
  getters: {
    getRouters(): AppRouteRecordRaw[] {
      return this.routers
    },
    getAddRouters(): AppRouteRecordRaw[] {
      return flatMultiLevelRoutes(cloneDeep(this.addRouters))
    },
    getIsAddRouters(): boolean {
      return this.isAddRouters
    },
    getMenuTabRouters(): AppRouteRecordRaw[] {
      return this.menuTabRouters
    }
  },
  actions: {
    generateRoutes(
      type: 'admin' | 'test' | 'none',
      routers?: AppCustomRouteRecordRaw[] | string[]
    ): Promise<unknown> {
      return new Promise<void>((resolve) => {
        let routerMap: AppRouteRecordRaw[] = []

        if (type === 'admin') {
          console.log('routersaadmmin', routers)
          // 模拟后端过滤菜单
          routerMap = filterAsyncRouter(routers as AppCustomRouteRecordRaw[])

          // routerMap = generateRoutesFn2(routers as AppCustomRouteRecordRaw[])
        } else if (type === 'test') {
          // 模拟前端过滤菜单
          routerMap = generateRoutesFn1(cloneDeep(asyncRouterMap), routers as string[])
        } else {
          // 直接读取静态路由表
          routerMap = cloneDeep(asyncRouterMap)
        }
        // 动态路由，404一定要放到最后面
        this.addRouters = routerMap.concat([
          // {
          //   path: '/user',
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
            path: '/:path(.*)*',
            redirect: '/404',
            name: '404Page',
            meta: {
              hidden: true,
              breadcrumb: false
            }
          }
        ])
        // 渲染菜单的所有路由
        this.routers = cloneDeep(constantRouterMap).concat(routerMap)

        resolve()
      })
    },
    setIsAddRouters(state: boolean): void {
      this.isAddRouters = state
    },
    setMenuTabRouters(routers: AppRouteRecordRaw[]): void {
      this.menuTabRouters = routers
    }
  }
})

export const usePermissionStoreWithOut = () => {
  return usePermissionStore(store)
}
