<template>
  <div ref="menuRef" class="menu-div-class">
    <div
      v-for="(menu, index) in selectedMenuArray"
      :key="menu.name"
      class="order-add-bg-class w-[6.25%]"
      @click="() => clickMenu(menu)"
    >
      <div v-if="index < maxSelectNum - 1">
        <div class="tagImg flex justify-center item-center">
          <img :src="getImgList(menu.name + `.png`)" class="menu-img-class" />
        </div>
        <div class="flex justify-center">
          <p class="order-add-desc-class">{{ menu.name }}</p>
        </div>
      </div>
    </div>
    <div  class="order-add-bg-class w-[6.25%]" @click="setCommonProcesses" >
      <div class="setImg flex justify-center">
        <div class="order-add-class">
          <img class="w-[12px] h-[12px]" src="@/assets/imgs/order/add_icon2.png" />
        </div>
      </div>
      <div class="flex justify-center">
        <p class="order-add-desc-class">添加常用</p>
      </div>
    </div>
  </div>
  <MenuSelectDailog ref="menuSelectDailogRef" @getUserList="getUserList" />
</template>

<script lang="ts" setup>
import { computed, nextTick, onMounted, reactive, ref } from 'vue'
import { useEmitt } from '@/hooks/web/useEmitt'
import { useAppStore } from '@/store/modules/app'
import { MenuSelectDailog } from './index'
import { getMyOftenUseApi } from '@/api/CommonUse'
import { useRouter } from 'vue-router'

const router = useRouter()
const appStore = useAppStore()
//监听窗口高度变化
useEmitt({
  name: 'window',
  callback: (type: string) => {
    if (type === 'resize') {
      resetColWidth()
    }
  }
})



const getUserList = () => {
  getMyOftenUseList()
}
const menuRef = ref()
const colWidth = ref(80)
//常用菜单最大选中数量
const maxSelectNum = ref(16)
onMounted(() => {
  resetColWidth()
  getMyOftenUseList()
})
//计算菜单宽度
const resetColWidth = () => {
  setTimeout(() => {
    colWidth.value = (menuRef.value.clientWidth - 20) / maxSelectNum.value
  }, 500)
}

// 获取本地图片资源
const getImgList = (url) => {
  nextTick()
  return new URL(`../../../assets/homeImgs/${url}`, import.meta.url).href
}
// 获取常用菜单
const getMyOftenUseList = async () => {
  const res = await getMyOftenUseApi()
  selectedMenuArray.value = res.data
}
//选择中的常用菜单
const selectedMenuArray = ref<any>([])
const titleCase = (str) => {
  let newStr = str.slice(0, 1).toUpperCase() + str.slice(1)
  return newStr
}
//常用点击
const clickMenu = (item: any) => {
  if (item.name == '请假申请') {
    router.push({
      name: titleCase(item.path),
      query: item
    })
  } else if (item.name == '出差申请') {
    router.push({
      name: titleCase(item.path),
      query: item
    })
  } else if (item.name == '加班申请') {
    router.push({
      name: titleCase(item.path),
      query: item
    })
  } else if (item.name == '外出申请') {
    router.push({
      name: titleCase(item.path),
      query: item
    })
  } else if (item.name == '物资外借') {
    router.push({
      name: titleCase(item.path),
      query: item
    })
  } else if (item.name == '物品申领') {
    const obj = {
      name: ''
    }
    obj.name = '物品领用'
    router.push({
      name: titleCase(item.path),
      query: obj
    })
  } else if (item.name == '用章申请') {
    router.push({
      name: titleCase(item.path),
      query: item
    })
  } else if (item.name == '采购申请') {
    router.push({
      name: titleCase(item.path),
      query: item
    })
  } else {
    router.push({
      name: titleCase(item.path)
    })
  }
}
//设置常用
const menuSelectDailogRef = ref<ComponentRef<typeof MenuSelectDailog>>()
const setCommonProcesses = () => {
  menuSelectDailogRef.value.openDialog()
}
</script>
<style lang="less" scoped>
.menu-div-class {
  display: flex;
  width: 100%;
  padding-left: 10px;
  padding-right: 10px;
  background: #ffffff;
  box-shadow: 0px 3px 4px 0px rgba(31, 31, 31, 0.2);
  border-radius: 4px;
}

.order-add-bg-class {
  margin-top: 0.9em;
  margin-bottom: 0.6em;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  // margin-top: 1.9vh;
  // margin-bottom: 1.5vh;
  cursor: pointer;
}

.menu-img-class {
  width: 2.71em;
  height: 2.71em;
}
.order-add-class {
  width: 2.71em;
  height: 2.71em;
  background: #edf0f3;
  border-radius: 6px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.order-add-desc-class {
  margin-top: 0.4em;
  align-items: center;
  font-size: 1.07em;
  font-weight: 400;
  font-family: Alibaba PuHuiTi M;
  color: #222222;
}

// @media screen and (max-width: 1536px) {
//   .order-add-desc-class {
//     font-size: 13px;
//   }
//   .menu-div-class {
//     display: flex;
//     align-items: center;
//     width: 100%;
//     padding-left: 10px;
//     background: #ffffff;
//     box-shadow: 0px 3px 4px 0px rgba(31, 31, 31, 0.2);
//     border-radius: 4px;
//     .order-add-bg-class .tagImg img {
//       height: 28px;
//       width: 28px;
//     }
//     .order-add-bg-class .setImg img {
//       height: 16px;
//       width: 16px;
//     }
//     .order-add-class {
//       height: 28px;
//       width: 28px;
//     }
//   }
// }
</style>
