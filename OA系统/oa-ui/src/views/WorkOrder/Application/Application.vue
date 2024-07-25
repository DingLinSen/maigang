<!-- 工单申请 -->
<script lang="ts" setup>
import { ContentWrap } from '@/components/ContentWrap'
import { PersonnelSelection } from '@/components/PersonnelSelection'
import { useEmitt } from '@/hooks/web/useEmitt'
import { useAppStore } from '@/store/modules/app'
import { computed, nextTick, onMounted, reactive, ref, watch } from 'vue'
import { ElRow, ElCol, ElButton, ElMessage } from 'element-plus'
import { Segmentation } from '@/components/Segmentation'
import {
  LeaveApplyForm,
  BusinessTripApplyForm,
  OvertimeApplyForm,
  OutApplyForm,
  MaterialLendForm,
  ArticleUseForm,
  StampApplicationForm,
  PurchasingRequisitionForm,
  LeavePostponeForm,
  OvertimeTaskForm
} from '../Form'
import { setUsagesApi, getUsages } from '@/api/order'
import { LimitDailog } from '@/views/Components/limit'
import { useRoute } from 'vue-router'
import { isAuth } from '@/utils/is'
import { useCache } from '@/hooks/web/useCache'
import { getOrderArray } from '../config'

const { wsCache } = useCache()
const deptInfo = ref<string>(wsCache.get('userInfo').dept) // 登录用户部门信息
const isDevelopment = ref<boolean>(JSON.stringify(deptInfo).indexOf('研发中心') > -1) // 是否是研发中心

defineOptions({
  name: 'Application'
})

const route = useRoute()

const appStore = useAppStore()
//监听窗口高度变化
useEmitt({
  name: 'window',
  callback: (type: string) => {
    if (type === 'resize') {
      resetPageHeight()
    }
  }
})
//页面高度
const height = ref('auto' as string)
const width = ref(1000)
//重置页面高度
const resetPageHeight = () => {
  width.value = document.documentElement['clientWidth']
  console.log('width.value===>', width.value)
  //底部高度
  let footerHeight = 0
  const footer = document.querySelector('.v-footer')
  if (footer) {
    footerHeight = footer.clientHeight
  }
  const documentClientHeight = appStore.getDocumentClientHeight
  height.value = documentClientHeight - 150 - footerHeight + 'px'
}

const getAllMenuData = () => {
  orderArray.value = []
  if (isAuth('order:application:leave')) {
    orderArray.value.push({
      name: '请假申请',
      value: 1
    })
  }
  if (isAuth('order:application:trip')) {
    orderArray.value.push({
      name: '出差申请',
      value: 2
    })
  }
  if (isAuth('order:application:overtime')) {
    orderArray.value.push({
      name: '加班申请',
      value: 3
    })
  }
  if (isAuth('order:application:out')) {
    orderArray.value.push({
      name: '外出申请',
      value: 4
    })
  }
  if (isAuth('order:application:lend')) {
    orderArray.value.push({
      name: '物资外借',
      value: 5
    })
  }
  if (isAuth('order:application:use')) {
    orderArray.value.push({
      name: '物品领用',
      value: 6
    })
  }
  if (isAuth('order:application:stamp')) {
    orderArray.value.push({
      name: '用章申请',
      value: 7
    })
  }
  if (isAuth('order:application:buy')) {
    orderArray.value.push({
      name: '采购申请',
      value: 8
    })
  }
}

//设置常用流程
const isSetting = ref<boolean>(false)
//临时选中后的
const selectedMenuTempArray = ref<any[]>([])
const setCommonProcesses = () => {
  isSetting.value = true
  settingLoading.value = false
  nextTick(() => {
    selectedMenuTempArray.value = []
    selectedMenuArray.value.forEach((item: any) => {
      selectedMenuTempArray.value.push(item)
    })
  })
}

//取消设置常用流程
const cancelSetting = () => {
  isSetting.value = false
}
const settingLoading = ref<boolean>(false)
//确定设置常用流程
const sureSetting = async () => {
  // if (selectedMenuTempArray.value.length < 1) {
  //   ElMessage.success('请先选择常用的模块')
  //   return
  // }
  settingLoading.value = true
  let params: any[] = []
  selectedMenuTempArray.value.forEach((item: any) => {
    params.push(item.value)
  })
  let usages = {
    usages: params.join(',')
  }
  const res = await setUsagesApi(usages)
    .catch(() => {})
    .finally(() => {
      settingLoading.value = false
    })
  if (res && res.data) {
    isSetting.value = false
    selectedMenuArray.value = selectedMenuTempArray.value
    ElMessage.success('设置常用流程成功')
  }
}
//请假申请
const leaveApplyFormRef = ref<ComponentRef<typeof LeaveApplyForm>>()
//出差申请
const businessTripApplyFormRef = ref<ComponentRef<typeof BusinessTripApplyForm>>()
//加班申请
const overtimeApplyFormRef = ref<ComponentRef<typeof OvertimeApplyForm>>()
//外出申请
const outApplyFormRef = ref<ComponentRef<typeof OutApplyForm>>()
const materialLendFormRef = ref<ComponentRef<typeof MaterialLendForm>>()
const articleUseFormRef = ref<ComponentRef<typeof ArticleUseForm>>()
const stampApplicationFormRef = ref<ComponentRef<typeof StampApplicationForm>>()
const purchasingRequisitionFormRef = ref<ComponentRef<typeof PurchasingRequisitionForm>>()
//调休顺延申请
const leavePostponeFormRef = ref<ComponentRef<typeof LeavePostponeForm>>()
//加班任务
const overtimeTaskFormRef = ref<ComponentRef<typeof OvertimeTaskForm>>()

//工单目录集合
const orderArray = ref<any[]>([
  {
    name: '请假申请',
    value: '1'
  },
  {
    name: '出差申请',
    value: '2'
  },
  {
    name: '加班申请',
    value: '3'
  },
  {
    name: '外出申请',
    value: '4'
  },
  {
    name: '物资外借',
    value: '5'
  },
  {
    name: '物品领用',
    value: '6'
  },
  {
    name: '用章申请',
    value: '7'
  },
  {
    name: '采购申请',
    value: '8'
  }
])

//研发中心员工添加调休顺延申请
const addLeavePostpone = () => {
  if (isDevelopment.value) {
    orderArray.value.push({
      name: '调休顺延申请',
      value: '9'
    })
  }
}
orderArray.value = getOrderArray()

onMounted(() => {
  resetPageHeight()
  // addLeavePostpone()
  // getAllMenuData()
})

//点击申请
const clickApplication = (item: any, index: number) => {
  if (isSetting.value) {
    let index = getMenuIndex(item)
    if (index > -1) {
      selectedMenuTempArray.value.splice(index, 1)
    } else {
      selectedMenuTempArray.value.push(item)
    }
  } else {
    if (item.name === '请假申请') {
      leaveApplyFormRef.value.openDrawer('', 'add')
    } else if (item.name === '出差申请') {
      businessTripApplyFormRef.value.openDrawer('', 'add')
    } else if (item.name === '加班申请') {
      overtimeApplyFormRef.value.openDrawer('', 'add')
    } else if (item.name === '外出申请') {
      outApplyFormRef.value.openDrawer('', 'add')
    } else if (item.name === '物资外借') {
      materialLendFormRef.value.openDrawer('', 'add')
    } else if (item.name === '物品领用') {
      articleUseFormRef.value.openDrawer('', 'add')
    } else if (item.name === '用章申请') {
      stampApplicationFormRef.value.openDrawer('', 'add')
    } else if (item.name === '采购申请') {
      purchasingRequisitionFormRef.value.openDrawer('', 'add')
    } else if (item.name === '调休顺延申请') {
      leavePostponeFormRef.value.openDrawer('', 'add')
    } else if (item.name === '加班任务') {
      overtimeTaskFormRef.value.openDrawer('', 'add')
    }
  }
}

const getMenuIndex = (menu: any) => {
  let menuIndex = -1
  selectedMenuTempArray.value.forEach((item: any, index: number) => {
    if (item.name == menu.name) {
      menuIndex = index
    }
  })
  return menuIndex
}
const routeData = ref(route.query)
watch(
  () => route.query,
  () => {
    nextTick(() => {
      if (route.query.path == 'Application') {
        clickApplication(routeData.value, 0)
      }
    })
  },
  { immediate: true, deep: true }
)

if (route.query.type) {
  nextTick(() => {
    if (route.query.type == '1') {
      leaveApplyFormRef.value?.openDrawer('', 'add')
    } else if (route.query.type == '2') {
      businessTripApplyFormRef.value?.openDrawer('', 'add')
    } else if (route.query.type == '3') {
      overtimeApplyFormRef.value?.openDrawer('', 'add')
    } else if (route.query.type == '4') {
      outApplyFormRef.value?.openDrawer('', 'add')
    }
  })
}
//选中后的
const selectedMenuArray = ref<any[]>([])

//获取右下角图标
const getMenuIcon = (name: string) => {
  let icon = ''
  if (name === '请假申请') {
    icon = new URL(`../../../assets/imgs/order/qj_icon.png`, import.meta.url).href
  } else if (name === '出差申请') {
    icon = new URL(`../../../assets/imgs/order/cc_icon.png`, import.meta.url).href
  } else if (name === '加班申请') {
    icon = new URL(`../../../assets/imgs/order/jb_icon.png`, import.meta.url).href
  } else if (name === '外出申请') {
    icon = new URL(`../../../assets/imgs/order/wc_icon.png`, import.meta.url).href
  } else if (name === '物资外借') {
    icon = new URL(`../../../assets/imgs/order/wj_icon.png`, import.meta.url).href
  } else if (name === '物品领用') {
    icon = new URL(`../../../assets/imgs/order/ly_icon.png`, import.meta.url).href
  } else if (name === '用章申请') {
    icon = new URL(`../../../assets/imgs/order/yz_icon.png`, import.meta.url).href
  } else if (name === '采购申请') {
    icon = new URL(`../../../assets/imgs/order/cg_icon.png`, import.meta.url).href
  } else if (name === '调休顺延申请') {
    icon = new URL(`../../../assets/imgs/order/post_icon.png`, import.meta.url).href
  } else if (name === '加班任务') {
    icon = new URL(`../../../assets/imgs/order/task_icon.png`, import.meta.url).href
  }
  return icon
}
//判断是否选中
const checkMenuSelect = (name: any) => {
  let select = false
  let index = JSON.stringify(selectedMenuTempArray.value).indexOf(name.name)
  if (index > -1) {
    select = true
  }
  return select
}

//获取常用设置
const getUsagesSetting = async () => {
  const res = await getUsages()
  selectedMenuArray.value = []
  if (res && res.data) {
    res.data.forEach((item: any) => {
      if (item == 1) {
        selectedMenuArray.value.push({
          name: '请假申请',
          value: 1
        })
      }
      if (item == 2) {
        selectedMenuArray.value.push({
          name: '出差申请',
          value: 2
        })
      }
      if (item == 3) {
        selectedMenuArray.value.push({
          name: '加班申请',
          value: 3
        })
      }
      if (item == 4) {
        selectedMenuArray.value.push({
          name: '外出申请',
          value: 4
        })
      }
      if (item == 5) {
        selectedMenuArray.value.push({
          name: '物资外借',
          value: 5
        })
      }
      if (item == 6) {
        selectedMenuArray.value.push({
          name: '物品领用',
          value: 6
        })
      }
      if (item == 7) {
        selectedMenuArray.value.push({
          name: '用章申请',
          value: 7
        })
      }
      if (item == 8) {
        selectedMenuArray.value.push({
          name: '采购申请',
          value: 8
        })
      }
      if (item == 9) {
        selectedMenuArray.value.push({
          name: '调休顺延申请',
          value: 9
        })
      }
      if (item == 10) {
        selectedMenuArray.value.push({
          name: '加班任务',
          value: 10
        })
      }
    })
  } else {
    nextTick(() => {
      selectedMenuArray.value = []
    })
  }
}

getUsagesSetting()
</script>

<template>
  <div :style="{ height: height }">
    <div class="w-full mb-[26px]">
      <div class="flex justify-between content-center mt-[20px] px-[12px]">
        <p class="text-16px font-500 pt-1 segmentation-title">常用流程</p>
      </div>
      <div class="order-menu-bg-class">
        <div
          v-for="(menu, index) in selectedMenuArray"
          :key="menu.name"
          class="order-menu-class"
          @click="() => clickApplication(menu, index)"
        >
          <div>
            <div class="plus-30-bg-class">
              <img src="@/assets/imgs/order/add_icon1.png" />
            </div>
          </div>
          <p class="menu-title-class">{{ menu.name }}</p>
          <p class="menu-desc-class">点击创建</p>
          <img :src="getMenuIcon(menu.name)" class="menu-img-class" />
        </div>

        <div class="order-add-bg-class" @click="setCommonProcesses">
          <div class="order-add-class">
            <img class="plus-img-class" src="@/assets/imgs/order/add_icon2.png" />
          </div>
          <div class="flex justify-center">
            <p class="order-add-desc-class">添加常用</p>
          </div>
        </div>
      </div>
    </div>
    <div class="w-full mb-[26px] pb-[20px]">
      <div class="flex justify-between content-center mt-[20px] px-[12px]">
        <p class="text-16px font-500 pt-1 segmentation-title">OA办公</p>
      </div>
      <div class="order-menu-bg-class">
        <div
          v-for="(menu, index) in orderArray"
          :key="menu.name"
          :class="isSetting && checkMenuSelect(menu) ? 'menu-selected-bg-class' : ''"
          class="order-menu-class"
          @click="() => clickApplication(menu, index)"
        >
          <div class="menu-check-class">
            <div v-show="isSetting && !checkMenuSelect(menu)" class="menu-normal-class"></div>
            <Icon
              :size="width > 1700 ? 18 : 14"
              v-show="isSetting && checkMenuSelect(menu)"
              class="text-white circle-check-mark menu-selected-class"
              icon="carbon:checkmark"
            />
          </div>
          <div>
            <img class="plus-bg-class" src="@/assets/imgs/order/add_icon1.png" />
          </div>
          <p class="menu-title-class">{{ menu.name }}</p>
          <p class="menu-desc-class">点击创建</p>
          <img :src="getMenuIcon(menu.name)" class="menu-img-class" />
        </div>
      </div>
    </div>

    <div v-show="isSetting" class="menu-setting-bg-class">
      <div class="flex">
        <Icon class="add-setting-icon-class" icon="gala:add" />
        <p class="add-setting-num-class"
          >请选择常用的模块，已选择{{ selectedMenuTempArray.length }}个</p
        >
        <span class="add-setting-line-class"></span>
        <el-button :text="true" class="btn-add-setting-class" @click="cancelSetting">
          取消
        </el-button>
        <el-button
          :loading="settingLoading"
          :text="true"
          class="btn-add-setting-class"
          @click="sureSetting"
        >
          确定
        </el-button>
      </div>
    </div>
  </div>
  <LeaveApplyForm ref="leaveApplyFormRef" title="请假申请" />
  <BusinessTripApplyForm ref="businessTripApplyFormRef" title="出差申请" />
  <OvertimeApplyForm ref="overtimeApplyFormRef" title="加班申请" />
  <OutApplyForm ref="outApplyFormRef" title="外出申请" />
  <MaterialLendForm ref="materialLendFormRef" title="物资外借" />
  <StampApplicationForm ref="stampApplicationFormRef" title="用章申请" />
  <ArticleUseForm ref="articleUseFormRef" title="物品领用" />
  <PurchasingRequisitionForm ref="purchasingRequisitionFormRef" title="采购申请" />
  <LeavePostponeForm ref="leavePostponeFormRef" />
  <OvertimeTaskForm ref="overtimeTaskFormRef" />

  <LimitDailog routerName="Application" />
</template>

<style lang="less" scoped>
.segmentation-title {
  font-family: Alibaba PuHuiTi M;
}
.order-menu-bg-class {
  display: flex;
  flex-wrap: wrap;
  padding-left: 12px;
  padding-right: 12px;
  width: 100%;
}

.order-menu-class {
  width: 12.3em;
  height: 13.29em;
  margin-top: 14px;
  margin-right: 18px;
  margin-left: 0px;
  margin-bottom: 0px;
  background-image: url('@/assets/imgs/order/apply_bg.png');
  cursor: pointer;
}

.menu-title-class {
  margin-top: 14px;
  padding-left: 29px;
  width: 100%;
  font-size: 16px;
  font-weight: 400;
  font-family: Alibaba PuHuiTi M;
  color: #333333;
}

.menu-desc-class {
  margin-top: 2px;
  padding-left: 29px;
  width: 100%;
  font-size: 14px;
  font-weight: 400;
  font-family: Alibaba PuHuiTi M;
  color: #888888;
}

.menu-img-class {
  width: 34px;
  height: 34px;
  margin-left: 126px;
  margin-top: 27px;
}

.plus-bg-class {
  width: 22px;
  height: 22px;
  margin-left: 30px;
}

.menu-selected-class {
  width: 22px;
  height: 22px;
  margin-left: 140px;
  background: #00a0e9;
  border-radius: 50%;
}

.menu-normal-class {
  width: 22px;
  height: 22px;
  margin-left: 140px;
  background: #000000;
  border: 2px solid #535353;
  opacity: 0.1;
  border-radius: 50%;
}

.menu-check-class {
  width: 100%;
  height: 22px;
  margin-top: 8px;
}

.menu-selected-bg-class {
  border: 2px solid #00a0e9;
  margin-top: 12px;
  margin-right: 18px;
  margin-left: 0px;
  margin-bottom: -2px;
  box-shadow: 0px 0px 8px 0px rgba(31, 31, 31, 0.08);
  border-radius: 10px;
}

.plus-30-bg-class {
  width: 22px;
  height: 22px;
  margin-top: 30px;
  margin-left: 30px;
}
.plus-img-class {
  width: 20px;
  height: 20px;
}

.order-add-bg-class {
  width: 12.3em;
  height: 13.29em;
  margin-top: 14px;
  margin-right: 18px;
  background: linear-gradient(0deg, #fcfcfc 0%, #ffffff 100%);
  box-shadow: 0px 0px 8px 0px rgba(31, 31, 31, 0.08);
  border-radius: 10px;
  cursor: pointer;
}

.order-add-class {
  width: 52px;
  height: 52px;
  margin-top: 60px;
  margin-left: 66px;
  background: #f5f6f7;
  border-radius: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.order-add-desc-class {
  margin-top: 40px;
  align-items: center;
  font-size: 16px;
  font-weight: 400;
  font-family: Alibaba PuHuiTi M;
  color: #333333;
}

.menu-selected-bg-class {
  border: 2px solid #00a0e9;
  margin-top: 12px;
  margin-right: 18px;
  margin-left: 0px;
  margin-bottom: -2px;
  box-shadow: 0px 0px 8px 0px rgba(31, 31, 31, 0.08);
  border-radius: 10px;
}

.menu-normal-bg-class {
  padding: 2px;
  box-shadow: 0px 0px 8px 0px rgba(31, 31, 31, 0.08);
  border-radius: 10px;
}

.menu-setting-bg-class {
  position: absolute;
  top: 38px;
  width: 450px;
  height: 40px;
  background: #ffffff;
  box-shadow: 0px 0px 39px 1px rgba(31, 31, 31, 0.08);
  border-radius: 20px;
  left: 50%;
  margin-left: -225px;
}

.add-setting-icon-class {
  width: 14px;
  height: 14px;
  margin-left: 24px;
  margin-top: 13px;
}

.add-setting-num-class {
  height: 40px;
  line-height: 40px;
  margin-left: 15px;
  margin-right: 15px;
  font-size: 15px;
  color: #666666;
  font-weight: 400;
  font-family: 'Alibaba PuHuiTi R';
}

.add-setting-line-class {
  width: 1px;
  background: #e5e5e5;
  height: 13px;
  margin-top: 14px;
  margin-right: 24px;
}

.btn-add-setting-class {
  margin-top: 2px;
  margin-left: 0px !important;
  position: relative;

  span {
    font-size: 15px;
    font-family: 'Alibaba PuHuiTi R';
    font-weight: 400;
    color: #666666;
  }
}

// @media screen and (max-width: 1730px) {
//   .order-menu-class {
//     width: 132px;
//     height: 150px;
//     margin-top: 10px;
//     margin-right: 12px;
//     margin-left: 0px;
//     margin-bottom: 0px;
//     background-image: url('@/assets/imgs/order/apply_bg.png');
//     cursor: pointer;
//     border-radius: 5px;
//   }

//   .menu-title-class {
//     margin-top: 12px;
//     padding-left: 16px;
//     width: 100%;
//     font-size: 14px;
//     font-weight: 400;
//     font-family: Alibaba PuHuiTi M;
//     color: #333333;
//   }

//   .menu-desc-class {
//     margin-top: 2px;
//     padding-left: 16px;
//     width: 100%;
//     font-size: 12px;
//     font-weight: 400;
//     font-family: Alibaba PuHuiTi M;
//     color: #888888;
//   }

//   .plus-bg-class {
//     width: 16px;
//     height: 16px;
//     margin-left: 18px;
//   }

//   .menu-selected-class {
//     width: 16px;
//     height: 16px;
//     margin-left: 105px;
//     font-size: 12px !important;
//     background: #00a0e9;
//     border-radius: 50%;
//   }

//   .menu-normal-class {
//     width: 16px;
//     height: 16px;
//     margin-left: 105px;
//     background: #000000;
//     border: 2px solid #535353;
//     opacity: 0.1;
//     border-radius: 50%;
//   }

//   .menu-check-class {
//     width: 100%;
//     height: 16px;
//     margin-top: 6px;
//   }

//   .menu-selected-bg-class {
//     border: 1px solid #00a0e9;
//     margin-top: 9px;
//     margin-right: 12px;
//     margin-left: 0px;
//     margin-bottom: -1px;
//     box-shadow: 0px 0px 8px 0px rgba(31, 31, 31, 0.08);
//     border-radius: 5px;
//   }

//   .menu-normal-bg-class {
//     padding: 2px;
//     box-shadow: 0px 0px 8px 0px rgba(31, 31, 31, 0.08);
//     border-radius: 5px;
//   }

//   .menu-img-class {
//     width: 24px;
//     height: 24px;
//     margin-left: 96px;
//     margin-top: 24px;
//   }

//   .plus-30-bg-class {
//     width: 16px;
//     height: 16px;
//     margin-top: 22px;
//     margin-left: 18px;
//   }

//   .order-add-bg-class {
//     width: 132px;
//     height: 150px;
//     margin-top: 10px;
//     margin-right: 12px;
//     background: linear-gradient(0deg, #fcfcfc 0%, #ffffff 100%);
//     box-shadow: 0px 0px 8px 0px rgba(31, 31, 31, 0.08);
//     border-radius: 5px;
//     cursor: pointer;
//   }

//   .order-add-class {
//     width: 36px;
//     height: 36px;
//     margin-top: 45px;
//     margin-left: 48px;
//     background: #f5f6f7;
//     border-radius: 6px;
//     display: flex;
//     justify-content: center;
//     align-items: center;
//   }

//   .order-add-desc-class {
//     margin-top: 26px;
//     align-items: center;
//     font-size: 14px;
//     font-weight: 400;
//     font-family: Alibaba PuHuiTi M;
//     color: #333333;
//   }

//   .plus-img-class {
//     width: 15px;
//     height: 15px;
//   }

//   .menu-setting-bg-class {
//     position: absolute;
//     top: 30px;
//     width: 410px;
//     height: 36px;
//     background: #ffffff;
//     box-shadow: 0px 0px 39px 1px rgba(31, 31, 31, 0.08);
//     border-radius: 18px;
//     left: 50%;
//     margin-left: -205px;
//   }

//   .add-setting-icon-class {
//     width: 12px;
//     height: 12px;
//     margin-left: 20px;
//     margin-top: 12px;
//   }

//   .add-setting-num-class {
//     height: 36px;
//     line-height: 36px;
//     margin-left: 13px;
//     margin-right: 13px;
//     font-size: 14px;
//     color: #666666;
//     font-weight: 400;
//     font-family: 'Alibaba PuHuiTi R';
//   }

//   .add-setting-line-class {
//     width: 1px;
//     background: #e5e5e5;
//     height: 13px;
//     margin-top: 12px;
//     margin-right: 20px;
//   }

//   .btn-add-setting-class {
//     margin-top: 2px;
//     margin-left: 0px !important;
//     position: relative;

//     span {
//       font-size: 14px;
//       font-family: 'Alibaba PuHuiTi R';
//       font-weight: 400;
//       color: #666666;
//     }
//   }
// }
</style>
