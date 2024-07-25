<!-- 自主学习 -->
<script lang="ts" setup>
import { computed, nextTick, onMounted, reactive, ref } from 'vue'
import { DrawerWrap } from '@/components/DrawerWrapDetails'
import { useEmitt } from '@/hooks/web/useEmitt'
import { useAppStore } from '@/store/modules/app'
import { isAuth } from '@/utils/is'
import { getTaskAndActiveListApi } from '@/api/school/course'
import { CourseDetails } from '../components'
import { setBannerImage } from '@/utils'

defineOptions({
  name: 'SelfLearnListForm'
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
const colWidth = ref(400)
onMounted(() => {
  resetTableHeight()
})
const contentHeight = ref<number>(0)
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
    const header = document.querySelectorAll('.v-content-detail-wrap-header')
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
    const tableTop = document.querySelector('.classroom-learn-content-wrap')
    if (tableTop) {
      let computedStyle = getComputedStyle(tableTop, null)
      if (computedStyle) {
        paddingH = paddingH + parseFloat(computedStyle.getPropertyValue('margin-top'))
      }
    }
    contentHeight.value = layoutContentH - topH - paddingH - footer
    colWidth.value = ((getSearchWrapperWidth() - 14) / 2) * 0.6
  })
}

const getSearchWrapperHeight = (): number => {
  //搜索框加操作栏高度
  let topH = 0
  const searchWrapper = document.querySelectorAll('.searchWrapperSelf')
  if (searchWrapper && searchWrapper.length) {
    searchWrapper.forEach((ele: any) => {
      topH = topH + ele.clientHeight
    })
  }
  return topH
}

const getSearchWrapperWidth = (): number => {
  let topH = 0
  const searchWrapper = document.querySelector('.searchWrapperSelf')
  if (searchWrapper) {
    topH = searchWrapper.clientWidth
  }
  return topH
}
const isShow = ref<boolean>(false)
//打开drawer并初始化
const drawerWrap = ref()
const openDrawer = () => {
  drawerWrap.value.isShow = true
  resetTableHeight()
  reset()
}

const searchParams = reactive<Recordable>({
  pageNum: 1,
  pageSize: 6,
  flag: '1',
  courseName: null,
  finish: null,
  delay: null
})
const courseDetailsRef = ref()
//查看视频详情
const toVideoDetails = (item: any) => {
  courseDetailsRef.value.openDrawer(item.id, item.assessId)
}
//搜索
const initData = async () => {
  let res = await getTaskAndActiveListApi(searchParams)
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
  searchParams.pageSize = 6
  searchParams.flag = '1'
  searchParams.courseName = null
  searchParams.finish = null
  searchParams.delay = null
  initData()
}
reset()
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

defineExpose({
  openDrawer
})
</script>
<template>
  <DrawerWrap ref="drawerWrap" :isShow="isShow" title="自主学习">
    <template #content>
      <div v-if="isAuth('school:self:query')" ref="searchWrapper" class="searchWrapperSelf">
        <el-input
          v-model="searchParams.courseName"
          :maxlength="30"
          class="input-class"
          @keyup.enter.native="initData"
          placeholder="请输入课程名称查询"
        />
        <!-- <el-select
          v-model="searchParams.doneState"
          class="input-class ml-[12px]"
          clearable
          placeholder="请选择完成状态"
        >
          <el-option label="未完成" value="0"/>
          <el-option label="已完成" value="1"/>
        </el-select>
        <el-select
          v-model="searchParams.delayState"
          class="input-class ml-[12px]"
          clearable
          placeholder="请选择延误状态"
        >
          <el-option value="0" label="正常" />
          <el-option value="1" label="延误" />
        </el-select> -->
        <el-button class="ml-[12px]" type="primary" @click="initData">查询</el-button>
        <el-button class="ml-[10px]" plain @click="reset">重置</el-button>
      </div>
      <div class="classroom-learn-content-wrap">
        <div
          :style="{
            height: contentHeight + 'px',
            overflow: 'hidden',
            overflowY: 'auto'
          }"
          class="inside-wrap"
        >
          <div class="ivu-row">
            <div
              v-for="(item, index) in courseList"
              :key="index"
              :style="index > 4 ? { 'margin-top': '10px' } : null"
              class="ivu-col"
            >
              <div class="col-box" @click="toVideoDetails(item)">
                <p class="type-p">
                  <span v-if="item.type === 0" class="type">内训</span>
                  <span v-if="item.type === 1" class="type" style="background: #0369d8">外训</span>
                  <span v-if="item.choicenessStatus == 1" class="select">精选</span>
                  <span class="normal">{{
                    item.secondType === 0
                      ? '管理类'
                      : item.secondType === 1
                      ? '技能类'
                      : item.secondType
                      ? '其他'
                      : '--'
                  }}</span>
                  <span v-if="item.delay == 1" class="select">延误</span>
                </p>
                <div class="img-box">
                  <img
                    :src="item.coverUrl ? String(item.coverUrl) : getBannerPicture()"
                    :style="{ height: colWidth * 0.53 + 'px' }"
                    alt=""
                    @error="setBannerImage"
                  />
                </div>
                <div class="detail-wrap">
                  <p class="detail-p">
                    <span class="title">{{ item.courseName ? item.courseName : '--' }}</span>
                  </p>
                  <div class="user-p">
                    <span>讲师：</span>
                    <p :title="item.lecturerName" class="single-line">
                      {{ item.lecturerName ? item.lecturerName : '--' }}</p
                    >
                  </div>
                  <p class="progress-p">
                    <el-progress
                      :percentage="item.progress ? item.progress : 0"
                      :show-text="false"
                      :stroke-width="12"
                    />
                  </p>
                  <div class="time-box">
                    <p class="learn-progress"
                      >已学：{{ item.progress ? item.progress + '%' : '0%' }}</p
                    >
                    <!-- <p class="learn-progress"
                      >学习耗时：{{
                        item.viewTime
                          ? item.viewTime > 60
                            ? (item.viewTime / 60).toFixed(1) + ' 分钟'
                            : (item.viewTime / 1).toFixed(1) + ' 秒'
                          : '0 秒'
                      }}</p
                    > -->
                  </div>
                  <div class="deadline-class time-box">
                    <span class="time">{{ item.endDate ? '截止时间：' + item.endDate : '' }}</span>
                    <span
                      v-if="item.userViewStatus == 0 || !item.userViewStatus"
                      class="mr-[30px] learn-btn-class"
                      >继续学习</span
                    >
                    <span v-if="item.userViewStatus == 1" class="mr-[30px] done-btn-class"
                      >已完成</span
                    >
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div v-if="!courseList.length" class="no-data">
            <div>
              <img alt="" src="@/assets/imgs/project/nodata_icon.png" />
              <p style="letter-spacing: 1px">亲，没有你想要的数据~</p>
            </div>
          </div>
        </div>
        <div ref="pageWrap" class="page-wrap">
          <el-pagination
            v-model:current-page="searchParams.pageNum"
            v-model:page-size="searchParams.pageSize"
            :hideOnSinglePage="false"
            :page-sizes="[6, 12, 18]"
            :pager-count="7"
            :total="totalNumber"
            background
            layout="total, sizes, prev, pager, next, jumper"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
          />
        </div>
      </div>
    </template>
  </DrawerWrap>
  <!--  课程详情  -->
  <CourseDetails ref="courseDetailsRef" @refresh="initData" />
</template>

<style lang="less" scoped>
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

.input-class {
  width: 256px;
  height: 36px;
  line-height: 36px;
}

.classroom-learn-content-wrap {
  overflow-y: hidden;
  margin-top: 13px;
  .page-wrap {
    margin-top: 10px;
    padding-top: 8px;
    padding-bottom: 8px;
    text-align: center;
    display: flex;
    justify-content: center;
    background: #fff;
  }

  overflow: hidden;
  overflow-y: auto;
}

.ivu-row {
  margin: 0 !important;
  display: flex;
  flex-flow: row wrap;
  width: 100%;
}

.ivu-col {
  width: 50%;
  height: auto;
  margin-bottom: 15px;

  .col-box {
    margin-right: 7px;
    margin-left: 7px;
  }

  &:nth-child(2n + 1) {
    .col-box {
      margin-left: 0 !important;
    }
  }

  &:nth-child(2n + 2) {
    .col-box {
      margin-right: 0 !important;
    }
  }

  .col-box {
    height: 100%;
    overflow: hidden;
    position: relative;
    background-color: #fff;
    display: flex;
    flex-flow: row wrap;
    border-radius: 4px;
    box-shadow: 0px 3px 4px 0px rgba(31, 31, 31, 0.2);

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
      width: 60%;

      img {
        width: 100%;
        cursor: pointer;
      }
    }

    .detail-wrap {
      width: 40%;
      color: #999999;
      padding: 15px;
      font-size: 16px;
      position: relative;

      span {
        display: inline-block;
      }

      .detail-p {
        .title {
          color: #333333;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
          line-height: 20px;
        }
      }

      .progress-p {
        margin: 10px 0 5px 0;
      }

      .time {
        color: #ff8137;
        font-size: 14px;
      }

      .time-box {
        margin-top: 8px;
        display: flex;
        justify-content: space-between;
        align-items: center;
      }

      .learn-progress {
        font-size: 13px;
        color: #777777;
      }

      .user-p {
        color: #666666;
        margin-top: 10px;
        font-size: 14px;
        display: flex;
      }

      .deadline-class {
        position: absolute;
        bottom: 22px;
        width: 100%;
      }

      .learn-btn-class {
        width: 100px;
        height: 36px;
        background: #00a0e9;
        border-radius: 18px;
        font-size: 15px;
        line-height: 36px;
        text-align: center;
        color: #fff;
        cursor: pointer;
      }

      .done-btn-class {
        width: 100px;
        height: 36px;
        background: #bbbbbb;
        border-radius: 18px;
        font-size: 15px;
        line-height: 36px;
        text-align: center;
        color: #fff;
        cursor: pointer;
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
