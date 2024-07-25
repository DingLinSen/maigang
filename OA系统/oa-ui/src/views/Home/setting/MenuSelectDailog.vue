<template>
  <el-dialog
    class="setting-dailog-class"
    v-model="dialogVisible"
    title="添加常用"
    width="50%"
    draggable
    :show-close="false"
    @closed="handleClose"
    @open="handleOpen"
  >
    <template #header="{ close }">
      <div class="flex justify-between">
        <slot name="title">
          <span class="w-full news-dialog-title-class">添加常用</span>
        </slot>
        <div class="pl-[5px] pr-[5px] cursor-pointer" @click="close">
          <Icon class="is-hover z-10 mt-5px" icon="svg-icon:close_icon_dialog" :size="14" />
        </div>
      </div>
    </template>
    <ElInput
      v-model="filterText"
      class="mt-[-40px]"
      clearable
      placeholder="搜索"
      @keydown.enter="handleEnter"
    >
      <template #prefix>
        <Icon :size="12" class="mr-5px" icon="svg-icon:search_icon" />
      </template>
    </ElInput>
    <div class="content-div-class" :style="{ height: dialogHeight }">
      <div class="w-[170px] height-max-class">
        <div
          v-for="(item, index) in commonUseOneList"
          :key="index"
          :style="{
            color: index == firstIndex ? '#00A0E9' : '#001A2C',
            background: index == firstIndex ? '#DEEEF9' : '#ffffff'
          }"
          class="w-full first-menu-item-class"
          @click="firstMenuClick(item, index)"
        >
          {{ item.name }}
        </div>
      </div>
      <div class="line-class height-max-class"></div>
      <div class="w-full height-max-class pb-[10px]">
        <div class="third-menu-div-class">
          <div v-for="(item, index) in secondMenuArray" :key="index" class="order-add-bg-class">
            <div class="w-[90px]">
              <div v-if="item.name" class="flex justify-center">
                <img :src="getImgList(item.name + `.png`)" class="w-[38px] h-[38px]" />
              </div>
              <div class="flex justify-center">
                <p class="order-add-desc-class">{{ item.name }}</p>
              </div>
              <div class="flex justify-center">
                <span v-if="item.flag == '0'" class="menu-add-class" @click="addMenu(item)">
                  添加</span
                >
                <span v-else class="menu-exist-class" @click="delMenu(item)">已添加</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </el-dialog>
</template>
<script lang="ts" setup>
import { onMounted, ref, nextTick } from 'vue'
import { getCommonUseListApi, getRemoveOftenUseApi, getSaveOftenUseApi } from '@/api/CommonUse'
import getAssetsFile from '@/utils/pubUseImg'
import { ElMessageBox, ElMessage } from 'element-plus'
import { useCache } from '@/hooks/web/useCache'
import { Icon } from '@/components/Icon'
import { isAuth } from '@/utils/is'
import { log } from 'console'
import { useEmitt } from '@/hooks/web/useEmitt'

const CustomCloseIcon = {
  template: `<img style="width:14px;height:14px;" src="/src/assets/svgs/close_icon_dialog.svg" />`
}

const { wsCache } = useCache()
onMounted(() => {})
const emit = defineEmits(['getUserList'])
// 获取本地图片资源
const getImgList = (url) => {
  nextTick()
  return new URL(`../../../assets/homeImgs/${url}`, import.meta.url).href
}

const dialogVisible = ref(false)
//关闭后重置信息
const handleClose = () => {
  filterText.value = ''
  commonUseOneList.value = []
  commonUseTwoList.value = []
  secondMenuArray.value = []
}
//打开后重置信息
const handleOpen = () => {
  nextTick()
}

//打开
const openDialog = (data: any[]) => {
  dialogVisible.value = true

  getPersonalSettingData()
  getCommonUseList('')
}
const selectedMenuArray = ref<any>([])
const filterText = ref<string>('')
const firstIndex = ref<number>(0)
//搜索
const handleEnter = async () => {
  firstIndex.value = 0
  await getCommonUseListApi({ name: filterText.value }).then((res) => {
    commonUseOneList.value = []
    commonUseTwoList.value = []
    secondMenuArray.value = []
    res.data.forEach((item) => {
      if (item.type == 'C') {
        commonUseOneList.value.push(item)
      }
      if (item.type == 'F') {
        commonUseTwoList.value.push(item)
      }
    })
    //筛选出有子级的菜单
    commonUseOneList.value = commonUseOneList.value.filter((item: any) => {
      let contant = commonUseTwoList.value.findIndex((item0: any) => {
        return item0.parentId == item.id
      })
      return contant > -1
    })
    let itemArray = commonUseOneList.value
    let oneId = itemArray[0].id
    commonUseTwoList.value.forEach((item) => {
      if (item.parentId == oneId) {
        secondMenuArray.value.push(item)
      }
    })
  })
}
const commonUseOneList = ref<any>([])
const commonUseTwoList = ref<any>([])
const getCommonUseList = async (val) => {
  await getCommonUseListApi({ name: val }).then((res) => {
    commonUseOneList.value = []
    commonUseTwoList.value = []
    secondMenuArray.value = []
    selectedMenuArray.value = []
    res.data.forEach((item) => {
      if (item.type == 'C') {
        commonUseOneList.value.push(item)
      }
      if (item.type == 'F') {
        checkOrderMenu(item)
      }
    })
    //筛选出有子级的菜单
    commonUseOneList.value = commonUseOneList.value.filter((item: any) => {
      let contant = commonUseTwoList.value.findIndex((item0: any) => {
        return item0.parentId == item.id
      })
      return contant > -1
    })
    let itemArray = commonUseOneList.value
    let oneId = itemArray[firstIndex.value].id
    commonUseTwoList.value.forEach((item) => {
      if (item.parentId == oneId) {
        secondMenuArray.value.push(item)
      }
    })
  })
}
//一级菜单
const firstMenuArray = ref<any[]>()

const firstMenuClick = (item: any, index: number) => {
  firstIndex.value = index
  let oneId = item.id
  secondMenuArray.value = []
  commonUseTwoList.value.forEach((item) => {
    if (item.parentId == oneId) {
      secondMenuArray.value.push(item)
    }
  })
}

//二级菜单
const secondMenuArray = ref<any[]>([])
//添加菜单
const addMenu = (item: any) => {
  if (selectedMenuArray.value.length > 14) {
    ElMessage.warning('常用菜单设置已达到最大数量，请调整菜单再添加！')
    return
  }
  ElMessageBox.confirm(`确定要添加${item.name}为常用吗?`, '提示', {
    confirmButtonText: '确认',
    cancelButtonText: '取消',
    type: 'warning',
    autofocus: false
  }).then(async () => {
    await getSaveOftenUseApi({
      oftenUseId: item.id,
      userId: wsCache.get('userInfo').userId
    }).then((res) => {
      if (res.data) {
        emit('getUserList')
        item.flag = '1'
        selectedMenuArray.value.push(item)
        ElMessage({
          type: 'success',
          message: '添加成功'
        })
      }
    })
  })
}
//移出菜单
const delMenu = (item) => {
  ElMessageBox.confirm(`确定要移除${item.name}吗?`, '提示', {
    confirmButtonText: '确认',
    cancelButtonText: '取消',
    type: 'warning',
    autofocus: false
  }).then(async () => {
    await getRemoveOftenUseApi({
      oftenUseId: item.id,
      userId: wsCache.get('userInfo').userId
    }).then((res) => {
      if (res.data) {
        emit('getUserList')
        selectedMenuArray.value.splice(selectedMenuArray.value.indexOf(item), 1)
        item.flag = '0'
        ElMessage({
          type: 'success',
          message: '移除成功'
        })
      }
    })
  })
}

//查询个人的菜单数据
const getPersonalSettingData = () => {}

const checkOrderMenu = (item: any) => {
  if (item.path == 'Application') {
    if (
      (item.name == '请假申请' && isAuth('order:application:leave')) ||
      (item.name == '出差申请' && isAuth('order:application:trip')) ||
      (item.name == '加班申请' && isAuth('order:application:overtime')) ||
      (item.name == '外出申请' && isAuth('order:application:out')) ||
      (item.name == '物资外借' && isAuth('order:application:lend')) ||
      (item.name == '物品申领' && isAuth('order:application:use')) ||
      (item.name == '用章申请' && isAuth('order:application:stamp')) ||
      (item.name == '采购申请' && isAuth('order:application:buy')) ||
      (item.name == '调休顺延申请' && isAuth('order:application:postpone')) ||
      (item.name == '加班任务' && isAuth('order:application:task'))
    ) {
      if (item.flag == '1') {
        selectedMenuArray.value.push(item)
      }
      commonUseTwoList.value.push(item)
    }
  } else {
    if (item.flag == '1') {
      selectedMenuArray.value.push(item)
    }
    commonUseTwoList.value.push(item)
  }
}

useEmitt({
  name: 'window',
  callback: (type: string) => {
    if (type === 'resize') {
      resetDailogHeight()
    }
  }
})

const dialogHeight = ref<string>('auto')

const resetDailogHeight = () => {
  nextTick()
  let layoutContentH = 0
  const layoutContent = document.querySelector('.v-layout')
  // const windowHeight = document.documentElement.offsetHeight
  if (layoutContent) {
    layoutContentH = layoutContent.clientHeight
  }
  dialogHeight.value = layoutContentH * 0.56 + 'px'
}

onMounted(() => {
  resetDailogHeight()
})
defineExpose({
  openDialog
})
</script>

<style lang="less" scoped>
.news-dialog-title-class {
  word-break: break-word;
  padding-right: 10px;
  font-size: 18px;
  font-family: Alibaba PuHuiTi M;
  font-weight: 500;
  color: #333333;
}
:deep(.el-input__wrapper) {
  background: #f9f9f9 !important;
}

.@{elNamespace}-dialog__header {
  background: white;
  margin-right: 0 !important;
  border-bottom: 0px solid var(--tags-view-border-color);
}

.white-bg-class {
  background: white !important;
  margin-right: 0 !important;
  border-bottom: 0px solid var(--tags-view-border-color);
}

.content-div-class {
  border: 1px solid #ecebeb;
  display: flex;
}

.height-max-class {
  height: 100%;
  overflow-x: hidden;
  overflow-y: auto;
}

.line-class {
  height: 100%;
  width: 1px;
  background: #ecebeb;
}

.first-menu-item-class {
  height: 44px;
  padding-left: 20px;
  line-height: 44px;
  font-size: 16px;
  font-weight: 400;
  font-family: Alibaba PuHuiTi M;
  cursor: pointer;
}

.sencord-menu-item-class {
  font-size: 15px;
  font-weight: 400;
  padding-left: 20px;
  padding-right: 10px;
  margin-top: 25px;
  color: #001a2c;
  font-family: Alibaba PuHuiTi R;
}

.order-add-bg-class {
  margin-top: 10px;
}

.order-add-desc-class {
  margin-top: 10px;
  align-items: center;
  font-size: 15px;
  font-weight: 400;
  font-family: Alibaba PuHuiTi R;
  color: #222222;
}

.menu-add-class {
  height: 30px;
  width: 60px;
  border: 1px solid #00a0e9;
  border-radius: 2px;
  line-height: 30px;
  text-align: center;
  margin-top: 10px;
  color: #00a0e9;
  font-size: 16px;
  font-family: Alibaba PuHuiTi R;
  font-weight: 400;
  cursor: pointer;
}

.menu-exist-class {
  height: 32px;
  width: 62px;
  line-height: 32px;
  text-align: center;
  margin-top: 10px;
  color: #999999;
  font-size: 16px;
  font-family: Alibaba PuHuiTi R;
  font-weight: 400;
  cursor: pointer;
}

.third-menu-div-class {
  flex-wrap: wrap;
  display: flex;
  width: 100%;
}
</style>
<style lang="less">
.setting-dailog-class {
  border-radius: 4px !important;
  .el-dialog__header {
    position: relative;
    border-radius: 4px;
    background-color: white !important;
    font-size: 16px !important;
    font-family: Alibaba PuHuiTi M;
    border-bottom: 0px solid var(--tags-view-border-color);
  }
}
</style>
