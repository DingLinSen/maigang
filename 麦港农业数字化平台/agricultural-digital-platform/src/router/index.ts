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
    path: '/platformHome',
    component: () => import('@/views/PlatformHome/PlatformHome.vue'),
    name: 'PlatformHome',
    meta: {
      noTagsView: true,
      hidden: true,
      // title: '概览',
      icon: 'cib:telegram-plane'
    }
  },
  {
    path: '/worldMap',
    component: () => import('@/views/WorldMap/WorldMap.vue'),
    name: 'WorldMap',
    meta: {
      noTagsView: true,
      hidden: true,
      // title: '概览',
      icon: 'cib:telegram-plane'
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
    name: '',
    meta: {
      hidden: false
    },
    children: [
      {
        path: 'home',
        component: () => import('@/views/Home/Home.vue'),
        name: 'Home',
        meta: {
          title: '首页',
          icon: 'cib:telegram-plane'
        }
      }
    ]
  },
  // 系统管理
  {
    path: '/sys',
    component: Layout,
    name: 'Sys',
    meta: { title: '系统管理', icon: 'cib:telegram-plane' },
    children: [
      {
        path: 'dept',
        component: () => import('@/views/Sys/Dept/Dept.vue'),
        name: 'Dept',
        meta: {
          title: '单位管理'
        }
      },
      {
        path: 'user',
        component: () => import('@/views/Sys/User/User.vue'),
        name: 'User',
        meta: {
          title: '用户管理'
        }
      },
      {
        path: 'role',
        component: () => import('@/views/Sys/Role/Role.vue'),
        name: 'Role',
        meta: {
          title: '角色管理'
        }
      },
      // {
      //   path: 'menu',
      //   component: () => import('@/views/Sys/Menu/Menu.vue'),
      //   name: 'Menu',
      //   meta: {
      //     title: '菜单管理'
      //   }
      // },
      // {
      //   path: 'dict',
      //   component: () => import('@/views/Sys/Dict/Dict.vue'),
      //   name: 'Dict',
      //   meta: {
      //     title: '字典管理'
      //   }
      // },
      {
        path: 'log',
        component: () => import('@/views/Sys/Log/LoginInfo/LoginInfo.vue'),
        name: 'Log',
        meta: {
          title: '日志管理'
        }
      }
      // {
      //   path: 'backup',
      //   component: () => import('@/views/Sys/Backup/Backup.vue'),
      //   name: 'Backup',
      //   meta: {
      //     title: '备份管理'
      //   }
      // }
    ]
  },
  // 园区管理
  {
    path: '/parkManagement',
    component: Layout,
    name: 'ParkManagement',
    meta: { title: '园区管理', icon: 'cib:telegram-plane' },
    children: [
      {
        path: 'parkOverview',
        component: () => import('@/views/ParkManagement/ParkOverview/ParkOverview.vue'),
        name: 'ParkOverview',
        meta: {
          title: '园区概览'
        }
      },
      {
        path: 'parkInfo',
        component: () => import('@/views/ParkManagement/ParkInfo/ParkInfo.vue'),
        name: 'ParkInfo',
        meta: {
          title: '园区信息'
        }
      },
      {
        path: 'regionManagement',
        component: () => import('@/views/ParkManagement/RegionManagement/RegionManagement.vue'),
        name: 'RegionManagement',
        meta: {
          title: '区域管理'
        }
      },
      {
        path: 'massifManagement',
        component: () => import('@/views/ParkManagement/MassifManagement/MassifManagement.vue'),
        name: 'MassifManagement',
        meta: {
          title: '地块管理'
        }
      },
      {
        path: 'personnelManagement',
        component: () =>
          import('@/views/ParkManagement/PersonnelManagement/PersonnelManagement.vue'),
        name: 'PersonnelManagement',
        meta: {
          title: '人员管理'
        }
      },
      {
        path: 'contractManagement',
        component: () => import('@/views/ParkManagement/ContractManagement/ContractManagement.vue'),
        name: 'ContractManagement',
        meta: {
          title: '合同管理'
        }
      },
      {
        path: 'supplierManagement',
        component: () => import('@/views/ParkManagement/SupplierManagement/SupplierManagement.vue'),
        name: 'SupplierManagement',
        meta: {
          title: '供应商管理'
        }
      }
    ]
  },
  // 设备管理
  {
    path: '/deviceManagement',
    component: Layout,
    name: 'DeviceManagement',
    meta: { title: '设备管理', icon: 'cib:telegram-plane' },
    children: [
      {
        path: 'deviceOverview',
        component: () => import('@/views/DeviceManagement/DeviceOverview/DeviceOverview.vue'),
        name: 'DeviceOverview',
        meta: {
          title: '设备概览'
        }
      },
      {
        path: 'deviceInfo',
        component: () => import('@/views/DeviceManagement/DeviceInfo/DeviceInfo.vue'),
        name: 'DeviceInfo',
        meta: {
          title: '设备信息'
        }
      }
    ]
  },
  // 生产管理
  {
    path: '/productionManagement',
    component: Layout,
    name: 'ProductionManagement',
    meta: { title: '生产管理', icon: 'cib:telegram-plane' },
    children: [
      {
        path: 'ProductionOverview',
        component: () =>
          import('@/views/ProductionManagement/ProductionOverview/ProductionOverview.vue'),
        name: 'ProductionOverview',
        meta: {
          title: '生产概览'
        }
      },
      {
        path: 'productionPlant',
        component: () => import('@/views/ProductionManagement/ProductionPlant/ProductionPlant.vue'),
        name: 'ProductionPlant',
        meta: {
          title: '生产规划'
        }
      },
      {
        path: 'ProductionTask',
        component: () => import('@/views/ProductionManagement/ProductionTask/ProductionTask.vue'),
        name: 'ProductionTask',
        meta: {
          title: '生产任务'
        }
      },
      {
        path: 'ProductionPlan',
        component: () => import('@/views/ProductionManagement/ProductionPlan/ProductionPlan.vue'),
        name: 'ProductionPlan',
        meta: {
          title: '生产方案'
        }
      }
    ]
  },
  // 仓储管理
  {
    path: '/storageManagement',
    component: Layout,
    name: 'StorageManagement',
    meta: { title: '仓储管理', icon: 'cib:telegram-plane' },
    children: [
      {
        path: 'StorageOverview',
        component: () => import('@/views/StorageManagement/StorageOverview/StorageOverview.vue'),
        name: 'StorageOverview',
        meta: {
          title: '仓储概览'
        }
      },
      {
        path: 'MaterialStorage',
        component: () => import('@/views/StorageManagement/MaterialStorage/MaterialStorage.vue'),
        name: 'MaterialStorage',
        meta: {
          title: '物资入库'
        }
      },
      {
        path: 'MaterialOutbound',
        component: () => import('@/views/StorageManagement/MaterialOutbound/MaterialOutbound.vue'),
        name: 'MaterialOutbound',
        meta: {
          title: '物资出库'
        }
      }
    ]
  },
  // 质量检测
  {
    path: '/inspection',
    component: Layout,
    name: 'Inspection',
    meta: { title: '质量检测', icon: 'cib:telegram-plane' },
    children: [
      {
        path: 'QualityOverview',
        component: () => import('@/views/Inspection/QualityOverview/QualityOverview.vue'),
        name: 'QualityOverview',
        meta: {
          title: '质量概览'
        }
      },
      {
        path: 'TestingRecords',
        component: () => import('@/views/Inspection/TestingRecords/TestingRecords.vue'),
        name: 'TestingRecords',
        meta: {
          title: '检测记录'
        }
      }
    ]
  }
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
