<!-- 课程管理 -->
<script setup lang="ts">
import { computed, onMounted, reactive, ref, nextTick, h, provide } from 'vue'
import { DrawerWrap } from '@/components/DrawerWrapDetails'
import { Search } from '@/components/Search'
import { isAuth } from '@/utils/is'
import { useEmitt } from '@/hooks/web/useEmitt'
import { useAppStore } from '@/store/modules/app'
import { courseSecondType, yesOrNo } from './config'
import moment from 'moment'
import { ElMessageBox, ElMessage, ElTag } from 'element-plus'
import { CourseDetails } from '../components'
import { getCourseByTypeApi } from '@/api/school/course'
import { setBannerImage } from '@/utils'

defineOptions({
  name: 'CourseVideoListForm'
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
    const header = document.querySelectorAll('.el-drawer__header')
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
  const searchWrapper = document.querySelector('.searchWrapperSub')
  if (searchWrapper) {
    topH = searchWrapper.clientWidth
  }
  return topH
}
const getSearchWrapperHeight = (): number => {
  //搜索框加操作栏高度
  let topH = 0
  const searchWrapper = document.querySelector('.searchWrapperSub')
  if (searchWrapper) {
    topH = topH + searchWrapper.clientHeight
  }
  return topH
}
const isShow = ref<boolean>(false)
//打开drawer并初始化
const drawerWrap = ref()
const pageTitle = ref('内训')
const pageFlag = ref()
const openDrawer = (type: string) => {
  courseList.value = []
  pageFlag.value = type
  searchParams.type = type
  pageTitle.value = type == '0' ? '内训' : type == '1' ? '外训' : ''
  drawerWrap.value.isShow = true
  getLecturerArray()
  reset()
  resetTableHeight()
}

//获取讲师列表
const lecturerArray = ref<any>([])
const getLecturerArray = () => {}
const searchParams = reactive<Recordable>({
  pageNum: 1,
  pageSize: 10,
  type: null,
  courseName: null,
  secondType: null,
  choicenessStatus: null
})
//搜索
const initData = async () => {
  let res = await getCourseByTypeApi(searchParams)
  if (res) {
    courseList.value = res.rows
    totalNumber.value = res.total
  } else {
    courseList.value = []
    totalNumber.value = 0
  }
}
//取消
const reset = () => {
  searchParams.pageNum = 1
  searchParams.pageSize = 10
  searchParams.courseName = null
  searchParams.secondType = null
  searchParams.choicenessStatus = null
  searchParams.type = pageFlag.value
  initData()
}
const courseList = ref<any[]>([])
const getBannerPicture = () => {
  return new URL(`../../../../../assets/imgs/classroom/fm_default.png`, import.meta.url).href
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
const courseDetailsRef = ref()
//查看视频详情
const toVideoDetails = (item: any) => {
  courseDetailsRef.value.openDrawer(item.id)
}
defineExpose({
  openDrawer
})
</script>
<template>
  <DrawerWrap :title="pageTitle" :isShow="isShow" ref="drawerWrap" class="lession-table">
    <template #content>
      <div class="searchWrapperSub" ref="searchWrapper">
        <el-select
          v-model="searchParams.secondType"
          class="input-class"
          placeholder="选择类别"
          clearable
        >
          <el-option
            :value="item.value"
            :label="item.label"
            v-for="item in courseSecondType"
            :key="item.value"
          />
        </el-select>
        <el-select
          v-model="searchParams.choicenessStatus"
          class="input-class ml-[12px]"
          placeholder="选择精选状态"
          clearable
        >
          <el-option value="1" label="是">是</el-option>
          <el-option value="0" label="否">否</el-option>
        </el-select>
        <el-input
          v-model="searchParams.courseName"
          placeholder="课程名称筛选"
          :maxlength="30"
          class="input-class ml-[12px]"
        />

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
              v-for="(item, index) in courseList"
              :key="index"
              :style="index > 4 ? { 'margin-top': '10px' } : null"
            >
              <div class="col-box" @click="toVideoDetails(item)">
                <p class="type-p">
                  <span class="type">{{ item.type == 0 ? '内训' : '外训' }}</span>
                  <span class="select" v-if="item.choicenessStatus == 1">精选</span>
                  <span class="normal">{{
                    item.secondType === 0
                      ? '管理类'
                      : item.secondType === 1
                      ? '技能类'
                      : item.secondType
                      ? '其他'
                      : '--'
                  }}</span>
                </p>
                <div class="img-box">
                  <img
                    :src="item.coverUrl ? item.coverUrl : getBannerPicture()"
                    alt=""
                    :style="{ height: colWidth * 0.53 + 'px' }"
                    @error="setBannerImage"
                  />
                </div>
                <div class="detail-wrap">
                  <p class="detail-p">
                    <span class="title">{{ item.courseName ? item.courseName : '--' }}</span>
                  </p>
                  <div class="user-p">
                    <span>讲师：</span>
                    <p class="single-line" :title="item.lecturerName">
                      {{ item.lecturerName ? item.lecturerName : '--' }}</p
                    >
                  </div>
                  <div class="time-box">
                    <p>{{
                      item.createTime ? moment(item.createTime).format('YYYY-MM-DD') : '--'
                    }}</p>
                    <p
                      >时长：{{
                        item.videoTime
                          ? item.videoTime > 60
                            ? (item.videoTime / 60).toFixed(1) + ' 分钟'
                            : (item.videoTime / 1).toFixed(1) + ' 秒'
                          : ''
                      }}</p
                    >
                  </div>
                </div>
              </div></div
            >
          </div>
          <div class="no-data" v-if="!courseList.length">
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
  <!--  课程详情  -->
  <CourseDetails ref="courseDetailsRef" />
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

    .type-p {
      position: absolute;
      top: 10px;
      left: 10px;
      font-size: 12px;

      .type {
        display: inline-block;
        background: #0469d8;
        color: #fff;
        padding: 4px 9px 4px 9px;
        border-radius: 4px;
      }

      .select {
        background: #fe5252;
        color: #fff;
        padding: 4px 9px 4px 9px;
        margin-left: 5px;
        border-radius: 4px;
      }

      .normal {
        background-color: #e2b17c;
        color: #fff;
        margin-left: 5px;
        padding: 4px 9px 4px 9px;
        border-radius: 4px;
      }
    }

    .img-box {
      img {
        width: 100%;
        cursor: pointer;
      }
    }

    .detail-wrap {
      color: #999999;
      padding: 15px;
      font-size: 16px;

      span {
        display: inline-block;
      }

      .detail-p {
        .select {
          background: #019eeb;
          color: #fff;
          padding: 5px 8px 4px 8px;
          background-color: #019eeb;
          border-radius: 4px;
        }

        .title {
          min-height: 36px;
          color: #333333;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
          line-height: 18px;
        }
      }

      .time-box {
        margin-top: 10px;
        display: flex;
        color: #999999;
        font-size: 14px;
        justify-content: space-between;
        align-items: center;
      }

      .user-p {
        color: #666666;
        margin: 5px 0;
        font-size: 14px;
        display: flex;
        // background-color: pink;
      }
    }
  }
}
.no-data {
  div {
    text-align: center;
    width: 100%;

    img {
      width: 150px;
    }

    p {
      padding-top: 15px;
      font-size: 20px;
    }
  }
}
.classroom-content-wrap {
  margin-top: 13px;
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

  .teacher-wrap {
    .ivu-col {
      .img-box {
        text-align: center;
        padding: 20px 0 0px 0;

        img {
          height: 100px;
          width: 100px;
          margin: 0 auto;
          border-radius: 50%;
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

.single-line {
  flex: 1;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
