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
      },
      {
        path: 'backup',
        component: () => import('@/views/Sys/Backup/Backup.vue'),
        name: 'Backup',
        meta: {
          title: '备份管理'
        }
      }
    ]
  },
  {
    path: '/baseDataManagement',
    component: Layout,
    name: 'BaseDataManagement',
    meta: { title: '基础数据管理', icon: 'cib:telegram-plane' },
    children: [
      {
        path: 'unitInfoManagement',
        component: () =>
          import('@/views/BaseDataManagement/UnitInfoManagement/UnitInfoManagement.vue'),
        name: 'UnitInfoManagement',
        meta: {
          title: '单位信息管理'
        }
      },
      {
        path: 'landManagement',
        component: () => import('@/views/BaseDataManagement/LandManagement/LandManagement.vue'),
        name: 'LandManagement',
        meta: {
          title: '土地资源管理'
        }
      },
      {
        path: 'productionManagement',
        component: () =>
          import('@/views/BaseDataManagement/ProductionManagement/ProductionManagement.vue'),
        name: 'ProductionManagement',
        meta: {
          title: '生产设施管理'
        }
      },
      {
        path: 'agriculturalEquip',
        component: () =>
          import('@/views/BaseDataManagement/AgriculturalEquip/AgriculturalEquip.vue'),
        name: 'AgriculturalEquip',
        meta: {
          title: '农机装备管理'
        }
      },
      {
        path: 'personnelStrength',
        component: () =>
          import('@/views/BaseDataManagement/PersonnelStrength/PersonnelStrength.vue'),
        name: 'PersonnelStrength',
        meta: {
          title: '人员实力管理'
        }
      }
    ]
  },
  {
    path: '/plan',
    component: Layout,
    name: 'Plan',
    meta: { title: '规划计划管理', icon: 'cib:telegram-plane' },
    children: [
      {
        path: 'planTemplate',
        component: () => import('@/views/Plan/PlanTemplate/PlanTemplate.vue'),
        name: 'PlanTemplate',
        meta: {
          title: '规(计)划模板'
        }
      },
      {
        path: 'planPreparation',
        component: () => import('@/views/Plan/PlanPreparation/PlanPreparation.vue'),
        name: 'PlanPreparation',
        meta: {
          title: '规(计)划拟制'
        }
      },
      {
        path: 'planDistribute',
        component: () => import('@/views/Plan/PlanDistribute/PlanDistribute.vue'),
        name: 'PlanDistribute',
        meta: {
          title: '规(计)划分发'
        }
      },
      {
        path: 'planFile',
        component: () => import('@/views/Plan/PlanFile/PlanFile.vue'),
        name: 'PlanFile',
        meta: {
          title: '规(计)划归档'
        }
      },
      {
        path: 'customProcess',
        component: () => import('@/views/Plan/CustomProcess/CustomProcess.vue'),
        name: 'CustomProcess',
        meta: {
          title: '自定义流程'
        }
      }
    ]
  },
  {
    path: '/',
    component: Layout,
    name: '',
    meta: {
      hidden: false
    },
    children: [
      {
        path: 'project',
        component: () => import('@/views/Project/Project.vue'),
        name: 'Project',
        meta: {
          title: '项目实施管理',
          icon: 'cib:telegram-plane'
        }
      }
    ]
  },
  {
    path: '/businessSupervision',
    component: Layout,
    name: 'BusinessSupervision',
    meta: { title: '业务监管', icon: 'cib:telegram-plane' },
    children: [
      {
        path: 'supervisionRule',
        component: () => import('@/views/BusinessSupervision/SupervisionRule/SupervisionRule.vue'),
        name: 'SupervisionRule',
        meta: {
          title: '监管规则设定'
        }
      },
      {
        path: 'supervisionManage',
        component: () =>
          import('@/views/BusinessSupervision/SupervisionManage/SupervisionManage.vue'),
        name: 'SupervisionManage',
        meta: {
          title: '监管专题管理'
        }
      },
      {
        path: 'supervisionWarning',
        component: () =>
          import('@/views/BusinessSupervision/SupervisionWarning/SupervisionWarning.vue'),
        name: 'SupervisionWarning',
        meta: {
          title: '监管预警'
        }
      },
      {
        path: 'supervisionDispose',
        component: () =>
          import('@/views/BusinessSupervision/SupervisionDispose/SupervisionDispose.vue'),
        name: 'SupervisionDispose',
        meta: {
          title: '监管处置'
        }
      },
      {
        path: 'supervisionAnalysis',
        component: () =>
          import('@/views/BusinessSupervision/SupervisionAnalysis/SupervisionAnalysis.vue'),
        name: 'SupervisionAnalysis',
        meta: {
          title: '监管统计分析'
        }
      }
    ]
  },
  {
    path: '/assetManagement',
    component: Layout,
    name: 'AssetManagement',
    meta: { title: '资产管理集成', icon: 'cib:telegram-plane' },
    children: [
      {
        path: 'externalData',
        component: () => import('@/views/AssetManagement/ExternalData/ExternalData.vue'),
        name: 'ExternalData',
        meta: {
          title: '外部数据接入'
        }
      },
      {
        path: 'internalData',
        component: () => import('@/views/AssetManagement/InternalData/InternalData.vue'),
        name: 'InternalData',
        meta: {
          title: '内部数据生成'
        }
      },
      {
        path: 'shareData',
        component: () => import('@/views/AssetManagement/ShareData/ShareData.vue'),
        name: 'ShareData',
        meta: {
          title: '共享数据管理'
        }
      },
      {
        path: 'synchronousLog',
        component: () => import('@/views/AssetManagement/SynchronousLog/SynchronousLog.vue'),
        name: 'SynchronousLog',
        meta: {
          title: '同步日志管理'
        }
      }
    ]
  },
  {
    path: '/situationManagement',
    component: Layout,
    name: 'SituationManagement',
    meta: { title: '综合态势管理', icon: 'cib:telegram-plane' },
    children: [
      {
        path: 'personnelSituation',
        component: () =>
          import('@/views/SituationManagement/PersonnelSituation/PersonnelSituation.vue'),
        name: 'PersonnelSituation',
        meta: {
          title: '人员实力态势'
        }
      },
      {
        path: 'landSituation',
        component: () => import('@/views/SituationManagement/LandSituation/LandSituation.vue'),
        name: 'LandSituation',
        meta: {
          title: '土地资源态势'
        }
      },
      {
        path: 'productionSituation',
        component: () =>
          import('@/views/SituationManagement/ProductionSituation/ProductionSituation.vue'),
        name: 'ProductionSituation',
        meta: {
          title: '生产设施态势'
        }
      },
      {
        path: 'agriculturalSituation',
        component: () =>
          import('@/views/SituationManagement/AgriculturalSituation/AgriculturalSituation.vue'),
        name: 'AgriculturalSituation',
        meta: {
          title: '农机装备态势'
        }
      },
      {
        path: 'cultivationSituation',
        component: () =>
          import('@/views/SituationManagement/CultivationSituation/CultivationSituation.vue'),
        name: 'CultivationSituation',
        meta: {
          title: '种养殖情况态势'
        }
      },
      {
        path: 'guaranteeSituation',
        component: () =>
          import('@/views/SituationManagement/GuaranteeSituation/GuaranteeSituation.vue'),
        name: 'GuaranteeSituation',
        meta: {
          title: '保障能力态势'
        }
      },
      {
        path: 'businessSituation',
        component: () =>
          import('@/views/SituationManagement/BusinessSituation/BusinessSituation.vue'),
        name: 'BusinessSituation',
        meta: {
          title: '业务监管态势'
        }
      }
    ]
  },
  {
    path: '/tools',
    component: Layout,
    name: 'Tools',
    meta: { title: '工具集', icon: 'cib:telegram-plane' },
    children: [
      // {
      //   path: 'flowChart',
      //   component: () => import('@/views/Tools/FlowChart/FlowChart.vue'),
      //   name: 'FlowChart',
      //   meta: {
      //     title: '流程图'
      //   }
      // },
      // {
      //   path: 'formCreate',
      //   component: () => import('@/views/Tools/FormCreate/FormCreate.vue'),
      //   name: 'FormCreate',
      //   meta: {
      //     title: '自定义表单'
      //   }
      // },
      // {
      //   path: 'customChart',
      //   component: () => import('@/views/Tools/CustomChart/CustomChart.vue'),
      //   name: 'CustomChart',
      //   meta: {
      //     title: '自定义图表'
      //   }
      // },

      {
        path: 'count',
        component: () => import('@/views/Tools/Count/Count.vue'),
        name: 'Count',
        meta: {
          title: '屯垦生产需求测算工具'
        }
      },
      {
        path: 'map',
        component: () => import('@/views/Tools/Map/Map.vue'),
        name: 'Map',
        meta: {
          title: '地图资源管理工具'
        }
      },
      {
        path: 'interfaceServices',
        component: () => import('@/views/Tools/InterfaceServices/InterfaceServices.vue'),
        name: 'InterfaceServices',
        meta: {
          title: '数据接口服务配置工具'
        }
      },
      {
        path: 'workFlow',
        component: () => import('@/views/WorkFlow/WorkFlow.vue'),
        name: 'WorkFlow',
        meta: {
          title: '业务规则配置工具'
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
