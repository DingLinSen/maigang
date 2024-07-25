<template>
  <DrawerWrap ref="drawerWrap" :isShow="isShow" title="讲师详情" class="lecClass">
    <template #content>
      <div ref="lecturerInfoRef" class="detail-top-lec">
        <div class="left"
          ><img
            :src="lecturerInfo.headUrl ? lecturerInfo.headUrl : getAvatarPicture()"
            alt=""
            @error="setAvatarImage"
        /></div>
        <div class="right">
          <p
            ><span class="text-xl font-bold">{{ lecturerInfo.lecturerName }}</span>
            <span class="position">{{ lecturerInfo.lecturerPost }}</span></p
          >
          <p class="mt-[5px]"><span class="teacher-name">讲师介绍:</span></p>
          <p class="content-p" style="color: #999999; white-space: pre-wrap">
            {{ lecturerInfo.lecturerInfo }}</p
          ></div
        >
      </div>
      <div class="course_content">
        <div class="course_title text-xl font-medium">课程</div>
        <!-- <div class="mt-[12px] class-room-class" :style="{ height: contentHeight + 'px' }"> -->
        <div class="mt-[12px] class-room-class">
          <div v-if="outsideList.length" class="w-full">
            <div class="ivu-row">
              <div
                v-for="(item, index) in outsideList"
                :key="index"
                :class="index > 4 ? 'mt-[10px]' : ''"
                class="ivu-col"
              >
                <div class="col-box" @click="toVideoDetails(item)">
                  <p class="type-p">
                    <span class="type">外训</span>
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
                  </p>
                  <div class="img-box">
                    <img
                      :src="item.coverUrl ? item.coverUrl : getBannerPicture()"
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
                    <div class="time-box">
                      <p>{{
                        item.createTime ? moment(item.createTime).format('YYYY-MM-DD') : '--'
                      }}</p>
                      <p
                        >时长：{{
                          item.videoTime
                            ? Number(item.videoTime) > 60
                              ? (Number(item.videoTime) / 60).toFixed(1) + ' 分钟'
                              : (Number(item.videoTime) / 1).toFixed(1) + ' 秒'
                            : ''
                        }}</p
                      >
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div v-if="!outsideList.length" class="no-data">
            <div>
              <img alt="" src="@/assets/imgs/project/nodata_icon.png" />
              <p style="letter-spacing: 1px">亲，没有你想要的数据~</p>
            </div>
          </div>
        </div>
      </div>
    </template>
  </DrawerWrap>
  <!--  课程详情  -->
  <CourseDetails ref="courseDetailsRef" />
</template>

<script lang="ts" setup>
import { computed, nextTick, onMounted, ref } from 'vue'
import { DrawerWrap } from '@/components/DrawerWrapDetails'
import { useEmitt } from '@/hooks/web/useEmitt'
import { useAppStore } from '@/store/modules/app'
import { CourseDetails } from '@/views/CulturaEmpresarial/School/ClassRoom/components'
import { getCourseByLecturerApi } from '@/api/school/lecturer'
import moment from 'moment'
import { setAvatarImage, setBannerImage } from '@/utils'

defineOptions({
  name: 'LecturerDetails'
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

const getAvatarPicture = () => {
  return new URL(`@/assets/imgs/classroom/avatar.png`, import.meta.url).href
}
const getBannerPicture = () => {
  return new URL(`../../../../assets/imgs/classroom/fm_default.png`, import.meta.url).href
}
const colWidth = ref(320)
const contentHeight = ref<number>(400)
const lecturerInfoRef = ref()
const resetTableHeight = () => {
  //页面padding
  let paddingH = 60
  //搜索框加操作栏高度
  nextTick(() => {
    let layoutContentH = 0
    const layoutContent = document.querySelector('.v-layout-content-scrollbar')
    if (layoutContent) {
      layoutContentH = layoutContent.clientHeight
    }
    let topHeight = 0
    const header = document.querySelectorAll('.v-content-detail-wrap-header')
    if (header && header.length) {
      header.forEach((ele: any) => {
        topHeight = topHeight + ele.clientHeight
      })
    }
    if (lecturerInfoRef.value) {
      topHeight = topHeight + lecturerInfoRef.value.clientHeight + 20
    }
    contentHeight.value = layoutContentH - topHeight - paddingH - 70
    colWidth.value = lecturerInfoRef.value ? (lecturerInfoRef.value.clientWidth - 14 * 3) / 5 : 320
  })
}

const outsideList = ref<any[]>([])
const lecturerInfo = ref<any>({
  headUrl: '',
  lecturerInfo: '',
  lecturerName: '',
  lecturerPost: ''
})
const isShow = ref(false)
//打开drawer并初始化
const drawerWrap = ref()
const lecturerId = ref('')
const openDrawer = (id: string) => {
  drawerWrap.value.isShow = true
  lecturerId.value = id
  resetTableHeight()
  getLecturerDetails()
}

const courseDetailsRef = ref()

const toVideoDetails = (item: any) => {
  courseDetailsRef.value.openDrawer(item.id, item.assessId)
}

const getLecturerDetails = async () => {
  let res = await getCourseByLecturerApi(lecturerId.value)
  if (res && res.data) {
    lecturerInfo.value = {
      headUrl: res.data.headUrl,
      lecturerInfo: res.data.lecturerInfo,
      lecturerName: res.data.lecturerName,
      lecturerPost: res.data.lecturerPost
    }
    outsideList.value = res.data.courseList ? res.data.courseList : []
  } else {
    lecturerInfo.value = {
      headUrl: '',
      lecturerInfo: '',
      lecturerName: '',
      lecturerPost: ''
    }
    outsideList.value = []
  }
}
defineExpose({
  openDrawer
})
</script>

<style lang="less" scoped>
.teacher-name {
  font-size: 17px;
}
:deep(.el-card__body) {
  padding: 0px !important;
  background: #fff !important;
}

.content-p {
  font-size: 14px;
  line-height: 17px;
  margin-top: 3px;
  white-space: pre-wrap;
  color: #555555;
}

.detail-top-lec {
  display: flex;
  background-color: #fff;
  padding: 30px;

  .left {
    width: 10%;
    text-align: center;

    img {
      max-width: 100%;
      width: 6vw;
      height: 6vw;
      border-radius: 50%;
    }
  }

  .right {
    width: 90%;
    font-size: 18px;

    span {
      // font-weight: bold;
    }

    .post-span {
      background-color: #dceffd;
      padding: 3px 10px;
      border-radius: 5px;
      font-weight: normal;
      font-size: 14px;
      margin-left: 5px;
    }
  }

  .user-p {
    margin-bottom: 5px;
    color: #222222;
    font-size: 18px;
    font-weight: 600;
    cursor: pointer;
    line-height: 28px;

    span {
      display: inline-block;
      font-size: 22px;
      color: #555;
      font-weight: bold;
      margin-right: 5px;
    }
  }
}

.lecturer_header {
  background-color: #ffffff;
  padding: 10px 20px;
}

.position {
  background-color: #00a0e9;
  padding: 2px 10px;
  font-size: 15px;
  color: #ffffff;
  margin-left: 5px;
  border-radius: 4px;
}

.course_content {
  margin-top: 20px;
  padding-left: 10px;
  padding-right: 10px;
  background-color: #ffffff;
  padding-top: 10px;
}

.course_title {
  height: 20px;
  line-height: 20px;
  border-left: 3px solid #00a0e9;
  padding: 0 10px;
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
          color: #333333;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
          line-height: 18px;
          overflow: hidden;
          display: -webkit-box;
          text-overflow: ellipsis;
          word-break: break-word;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
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

.class-room-class {
  padding-top: 10px;
  padding-bottom: 10px;
  overflow: hidden;
  overflow-y: auto;
}

.single-line {
  flex: 1;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
