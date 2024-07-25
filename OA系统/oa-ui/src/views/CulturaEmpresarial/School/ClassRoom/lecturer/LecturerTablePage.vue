<!-- 课程管理 -->
<script setup lang="ts">
import { computed, onMounted, reactive, ref, nextTick, h, provide } from 'vue'
import { DrawerWrap } from '@/components/DrawerWrapDetails'
import { Search } from '@/components/Search'
import { isAuth } from '@/utils/is'
import { useEmitt } from '@/hooks/web/useEmitt'
import { useAppStore } from '@/store/modules/app'
import { courseShelfType } from './config'
import moment from 'moment'
import { ElMessageBox, ElMessage, ElTag } from 'element-plus'
import { getLecturerListApi } from '@/api/school/lecturer'
import { LecturerDetails } from './lecturerDetails'
import { setAvatarImage } from '@/utils'

defineOptions({
  name: 'LecturerTablePage'
})
const appStore = useAppStore()
const documentClientHeight = computed(() => appStore.getDocumentClientHeight)
useEmitt({
  name: 'window',
  callback: (type: string) => {
    if (type === 'resize') {
      resetTableHeight()
    }
  }
})
onMounted(() => {
  resetTableHeight()
})
const colWidth = ref(320)
const contentHeight = ref<number>(400)
const pageWrap = ref()
const resetTableHeight = () => {
  //页面padding
  let paddingH = 30
  //搜索框加操作栏高度
  nextTick(() => {
    let layoutContentH = 0
    const layoutContent = document.querySelector('.v-layout-content-scrollbar')
    if (layoutContent) {
      layoutContentH = layoutContent.clientHeight
    }
    let topH: number = getSearchWrapperHeight()
    const header = document.querySelectorAll('.lectabel-class .el-drawer__header')
    if (header && header.length) {
      header.forEach((ele: any) => {
        if (ele.clientHeight) {
          topH = topH + ele.clientHeight
        }
      })
    }
    let footer = 0
    if (pageWrap.value) {
      footer = pageWrap.value.clientHeight
      let computedStyle = getComputedStyle(pageWrap.value, null)
      if (computedStyle) {
        footer = footer + parseFloat(computedStyle.getPropertyValue('margin-top'))
      }
    }
    const drawer = document.querySelectorAll('.el-drawer__body')
    if (drawer && drawer.length) {
      drawer.forEach((item: any) => {
        if (item.clientHeight) {
          let computedStyle = getComputedStyle(item, null)
          if (computedStyle) {
            paddingH = parseFloat(computedStyle.getPropertyValue('padding-top')) * 2
          }
        }
      })
    }
    const appcontent = document.getElementById('app-content')
    if (appcontent) {
      let computedStyle = getComputedStyle(appcontent, null)
      if (computedStyle) {
        paddingH = paddingH + parseFloat(computedStyle.getPropertyValue('padding-top'))
      }
    }
    contentHeight.value = layoutContentH - topH - paddingH - footer - 13
    colWidth.value =
      (getSearchWrapperWidth() - 14) / 5 > 0 ? (getSearchWrapperWidth() - 14) / 5 : 320
  })
}

const getSearchWrapperWidth = (): number => {
  let topH = 0
  const searchWrapper = document.querySelector('.searchWrapperThird')
  if (searchWrapper) {
    topH = searchWrapper.clientWidth
  }
  return topH
}
const getSearchWrapperHeight = (): number => {
  //搜索框加操作栏高度
  let topH = 0
  const searchWrapper = document.querySelector('.searchWrapperThird')
  if (searchWrapper) {
    topH = topH + searchWrapper.clientHeight
  }
  return topH
}
const isShow = ref<boolean>(false)
//打开drawer并初始化
const drawerWrap = ref()
const openDrawer = () => {
  lecturerList.value = []
  drawerWrap.value.isShow = true
  reset()
  resetTableHeight()
}

//获取讲师列表
const searchParams = reactive<Recordable>({
  pageNum: 1,
  pageSize: 10,
  status: '0',
  lecturerName: null,
  lecturerPost: null
})
//搜索
const initData = async () => {
  let res = await getLecturerListApi(searchParams)
  if (res) {
    lecturerList.value = res.rows
    totalNumber.value = res.total
  } else {
    lecturerList.value = []
    totalNumber.value = 0
  }
}
//取消
const reset = () => {
  searchParams.pageNum = 1
  searchParams.pageSize = 10
  searchParams.status = '0'
  searchParams.lecturerName = null
  searchParams.lecturerPost = null
  initData()
}
const lecturerList = ref<any[]>([])
const getAvatarPicture = () => {
  return new URL(`@/assets/imgs/classroom/avatar.png`, import.meta.url).href
}

const totalNumber = ref<number>(0)

const handleSizeChange = (value: number) => {
  searchParams.pageSize = value
  searchParams.pageNum = 1
  initData()
}
const handleCurrentChange = (value: number) => {
  searchParams.pageNum = value
  initData()
}

//查看讲师详情
const lecturerDetailsRef = ref<ComponentRef<typeof LecturerDetails>>()
const toLecturerDetails = (item: any) => {
  lecturerDetailsRef.value.openDrawer(item.id)
}

//
const nameOverflow = (name: string, length: number) => {
  let nextName = ''
  if (name && name.length) {
    if (name.length > length) {
      nextName = interceptString(name, length, 0) + '...'
    } else {
      nextName = name
    }
  } else {
    nextName = ''
  }
  return nextName
}
const interceptString = (str: string, length: number, length1: number) => {
  str = str.replace(/["　"|"　"]/g, '') //去半角+全角空格 //str=str.replace(/\s+/g,"");//去半角空格 //str=str.replace(/[\u3000]/g,"")去全角空格 //str=str.replace(/\s/ig,'');去半角空格
  if (str.length > length) {
    if (length1 == 0) {
      length1 = length
    }
    if (str.length >= length1) {
      var str_left: any = str.slice(0, length1)
      var banjiao = 0
      var quanjiao = 0
      var strCode: any
      for (var i = 0; i < str_left.length; i++) {
        strCode = str.charCodeAt(i)
        if (strCode >= 33 && strCode <= 126) {
          banjiao++
        } else {
          quanjiao++
        }
      }
      if (quanjiao + banjiao / 2 > length || quanjiao + banjiao / 2 - length == 0.5) {
        str_left = str_left.slice(0, str_left.length - 1)
        return str_left
      } else if (quanjiao + banjiao / 2 - length != 0) {
        if (length1 + 1 <= str.length) {
          str_left = interceptString(str, length, length1 + 1)
        }
      }
      return str_left
    }
  } else {
    return str
  }
}

defineExpose({
  openDrawer
})
</script>
<template>
  <DrawerWrap title="讲师" :isShow="isShow" ref="drawerWrap" class="lectabel-class">
    <template #content>
      <div class="searchWrapperThird" ref="searchWrapper">
        <el-input
          v-model="searchParams.lecturerName"
          placeholder="请输入姓名查询"
          :maxlength="30"
          class="input-class"
        />
        <el-input
          v-model="searchParams.lecturerPost"
          placeholder="请输入职称查询"
          :maxlength="30"
          class="input-class ml-[12px]"
        />

        <!-- <el-select
          v-model="searchParams.status"
          class="input-class ml-[12px]"
          placeholder="请选择状态查询"
          clearable
        >
          <el-option
            :value="item.value"
            :label="item.label"
            v-for="item in courseShelfType"
            :key="item.value"
          />
        </el-select> -->

        <el-button type="primary" @click="initData" class="ml-[12px]">查询</el-button>
        <el-button plain @click="reset" class="ml-[10px]">重置</el-button>
      </div>
      <div class="classroom-content-wrap" style="overflow-y: 'hidden;margin-top: 13px">
        <div
          class="inside-wrap"
          :style="{
            height: contentHeight + 'px',
            overflow: 'hidden',
            overflowY: 'auto'
          }"
        >
          <div class="ivu-row">
            <div
              class="ivu-col"
              v-for="(item, index) in lecturerList"
              :key="index"
              :style="index > 4 ? { 'margin-top': '10px' } : null"
            >
              <div class="col-box">
                <div class="img-box" @click="toLecturerDetails(item)">
                  <img
                    :src="item.headUrl ? item.headUrl : getAvatarPicture()"
                    alt=""
                    @error="setAvatarImage"
                  />
                  <p class="user-p">{{ item.lecturerName }}</p>
                  <p class="role-p">{{ item.lecturerPost }}</p>
                </div>
                <div class="detail-wrap" @click="toLecturerDetails(item)">
                  <span class="text-line-2"
                    >{{ item.lecturerInfo ? nameOverflow(item.lecturerInfo, 28) : '' }}
                    <span style="color: #00a0e9; cursor: pointer">详情></span></span
                  >
                </div>
              </div>
            </div>
          </div>
          <div class="no-data" v-if="!lecturerList.length">
            <div>
              <img src="@/assets/imgs/project/nodata_icon.png" alt="" />
              <p style="letter-spacing: 1px">亲，没有你想要的数据~</p>
            </div>
          </div>
        </div>
        <div class="page-wrap" ref="pageWrap">
          <el-pagination
            v-model:current-page="searchParams.pageNum"
            v-model:page-size="searchParams.pageSize"
            :page-sizes="[10, 20, 30, 40, 50, 100]"
            background
            layout="total, sizes, prev, pager, next, jumper"
            :total="totalNumber"
            :pager-count="7"
            :hideOnSinglePage="false"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
          />
        </div>
      </div>
    </template>
  </DrawerWrap>
  <!--  讲师详情  -->
  <LecturerDetails ref="lecturerDetailsRef" />
</template>

<style lang="less" scoped>
.input-class {
  width: 196px;
  height: 36px;
  line-height: 36px;
}
:deep(.el-input__wrapper) {
  height: 36px;
  line-height: 36px;
}
:deep(.el-card__body) {
  padding: 0px !important;
}
:deep(.el-card-details) {
  margin-bottom: 0px !important;
}
.search-wrap-class {
  height: 54px;
  background: #fff !important;
  display: flex;
  justify-content: center;
}
.ivu-row {
  margin: 0 !important;
  display: flex;
  flex-flow: row wrap;
  width: 100%;
}

.ivu-col {
  width: 20%;
  height: auto;

  .col-box {
    margin-right: 7px;
    margin-left: 7px;
  }

  &:nth-child(5n + 1) {
    .col-box {
      margin-left: 0 !important;
    }
  }

  &:nth-child(5n + 5) {
    .col-box {
      margin-right: 0 !important;
    }
  }

  .col-box {
    height: 100%;
    overflow: hidden;
    position: relative;
    box-shadow: 0px 3px 4px 0px rgba(31, 31, 31, 0.2);
    border-radius: 4px;
    background-color: #fff;

    &:hover {
      box-shadow: 0px 0px 8px rgb(158, 159, 160);
    }
  }
}

.ivu-col {
  .img-box {
    text-align: center;
    padding: 20px 0 0px 0;

    img {
      height: 100px;
      width: 100px;
      margin: 0 auto;
      border-radius: 50%;
      cursor: pointer;
    }

    .user-p {
      cursor: pointer;
      margin-top: 10px;
      font-size: 16px;
      font-weight: bold;
      color: #333333;
      line-height: 18px;
    }

    .role-p {
      cursor: pointer;
      margin-top: 7px;
      font-size: 14px;
      overflow: hidden;
      white-space: nowrap;
      color: #888888;
      text-overflow: ellipsis;
      padding: 0 15px;
      line-height: 18px;
    }
  }

  .detail-wrap {
    font-size: 14px;
    color: #999999;
    padding: 15px;
  }

  .text-line-2  {
    overflow: hidden;
    text-overflow: ellipsis;
    word-break: break-word;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    display: -webkit-box;
    margin-left: 12px;
    margin-right: 12px;
  }
}

.classroom-content-wrap {
  padding-bottom: 10px;
  overflow: hidden;
  overflow-y: auto;
  .page-wrap {
    margin-top: 10px;
    padding-top: 8px;
    padding-bottom: 8px;
    text-align: center;
    display: flex;
    justify-content: center;
    background: #fff;
  }
  .index-title {
    color: #333333;
    font-size: 16px;

    span {
      height: 18px;
      width: 60px;
      line-height: 18px;
      font-size: 16px;
      color: #333333;
      font-family: Alibaba PuHuiTi R;
      font-weight: bold;
      cursor: pointer;
      vertical-align: middle;
    }
  }
}
.no-data {
  height: 100%;
  display: flex;
  align-items: center;
  color: #444;
}
.no-data {
  div {
    display: grid;
    justify-content: center;
    text-align: center;
    width: 100%;
    img {
      width: 150px;
    }
    p {
      padding-top: 15px;
      font-size: 15px;
    }
  }
}
</style>
