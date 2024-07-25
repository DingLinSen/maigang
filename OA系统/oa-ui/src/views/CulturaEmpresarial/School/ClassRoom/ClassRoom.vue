<!-- 培训课堂首页 -->
<script lang="ts" setup>
import { ContentWrap } from '@/components/ContentWrap'
import { useEmitt } from '@/hooks/web/useEmitt'
import { useAppStore } from '@/store/modules/app'
import { computed, nextTick, onMounted, reactive, ref } from 'vue'
import { SelfLearnListForm, TaskLearnListForm, CourseDetails } from './components'
import { isAuth } from '@/utils/is'
import { CourseListForm, CourseVideoListForm } from './course'
import { LecturerListForm, LecturerTablePage } from './lecturer'
import { CourseAssessListForm } from './assess'
import { SelfTrainListForm } from './train'
import { getLecturerListApi, getCourseIndexInfoApi } from '@/api/school/course'
import moment from 'moment'
import { LecturerDetails } from './lecturer/lecturerDetails'
import { LimitDailog } from '@/views/Components/limit'
import { useRouter } from 'vue-router'
import { setAvatarImage, setBannerImage } from '@/utils'

defineOptions({
  name: 'ClassRoom'
})

const router = useRouter()

const refresh = () => {
  // router.go(0)
}

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
const contentHeight = ref('auto' as string)
const colWidth = ref(400)
const selWrap = ref()
const documentClientHeight = computed(() => appStore.getDocumentClientHeight)
//重置页面高度
const resetPageHeight = () => {
  nextTick()
  setTimeout(() => {
    let layoutContentH = 0
    const layoutContent = document.querySelector('.v-layout-content-scrollbar')
    if (layoutContent) {
      layoutContentH = layoutContent.clientHeight
    }
    let topH = 0
    const appcontent = document.getElementById('app-content')
    if (appcontent) {
      let computedStyle = getComputedStyle(appcontent, null)
      if (computedStyle) {
        topH = topH + parseFloat(computedStyle.getPropertyValue('padding-top'))
      }
    }
    const classroomcontent = document.querySelector('.classroom-content-wrap')
    if (classroomcontent) {
      let computedStyle = getComputedStyle(classroomcontent, null)
      if (computedStyle) {
        topH = topH + parseFloat(computedStyle.getPropertyValue('margin-top'))
        console.log('classroomcontent==>',parseFloat(computedStyle.getPropertyValue('margin-top')))
      }
    }
    // const classroomcontent = document.getElementById('classroom-content-wrap')
    let computedStyle = getComputedStyle(selWrap.value, null)
    if (computedStyle) {
      topH = topH + parseFloat(computedStyle.getPropertyValue('margin-top')) + 10
      console.log('selWrap==>',parseFloat(computedStyle.getPropertyValue('margin-top')))
    }
    contentHeight.value = layoutContentH - selWrap.value.clientHeight - topH + 'px'
    colWidth.value = (selWrap.value.clientWidth - 14 * 3) / 5
  }, 200)
}
onMounted(() => {
  resetPageHeight()
  getLecturerArray()
  reset()
})

const lecturerArray = ref<any>([])
const getLecturerArray = async () => {
  try {
    const { data } = await getLecturerListApi()
    lecturerArray.value = []
    data.forEach((element: any) => {
      lecturerArray.value.push({ label: element.lecturerName, value: element.id })
    })
  } catch (error) {}
}

const searchParams = reactive<Recordable>({
  type: '',
  secondType: '',
  lecturerId: ''
})

//搜索
const initData = async () => {
  let param = {
    type: null,
    secondType: null,
    lecturerId: searchParams.lecturerId ? searchParams.lecturerId : null
  }
  if (searchParams.type) {
    param.type = searchParams.type[0] ? searchParams.type[0] : null
    param.secondType = searchParams.type[1]
      ? searchParams.type[1] == '-1'
        ? null
        : searchParams.type[1]
      : null
  } else {
    param.type = null
    param.secondType = null
  }
  let res = await getCourseIndexInfoApi(param)
  nextTick()
  if (res && res.data) {
    insideList.value = res.data.inTbCourseDOS
    outsideList.value = res.data.outTbCourseDOS
    lecturerList.value = res.data.tbLecturerDOS
  } else {
    insideList.value = []
    outsideList.value = []
    lecturerList.value = []
  }
}
//取消
const reset = () => {
  searchParams.type = ''
  searchParams.secondType = ''
  searchParams.lecturerId = ''
  initData()
}
//任务学习
const taskLearnListFormRef = ref<ComponentRef<typeof TaskLearnListForm>>()
const go2TaskLearn = () => {
  taskLearnListFormRef.value.openDrawer()
}
//自主学习
const selfLearnListFormRef = ref<ComponentRef<typeof SelfLearnListForm>>()
const go2SelfLearn = () => {
  selfLearnListFormRef.value.openDrawer()
}
//课程管理
const courseListFormRef = ref<ComponentRef<typeof CourseListForm>>()
const go2CourseManager = () => {
  courseListFormRef.value.openDrawer()
}
//课程考核管理
const assessListFormRef = ref<ComponentRef<typeof CourseAssessListForm>>()
const go2CourseTestManager = () => {
  assessListFormRef.value.openDrawer()
}
//讲师管理
const lecturerListFormRef = ref<ComponentRef<typeof LecturerListForm>>()
const go2LecturerManager = () => {
  lecturerListFormRef.value.openDrawer()
}
const courseVideoListFormRef = ref<ComponentRef<typeof CourseVideoListForm>>()
//内训
const go2InsideListPage = () => {
  courseVideoListFormRef.value.openDrawer('0')
}
//外训
const go2OutsideListPage = () => {
  courseVideoListFormRef.value.openDrawer('1')
}
//讲师
const lecturerTablePageRef = ref<ComponentRef<typeof LecturerTablePage>>()
const go2LecturerListPage = () => {
  lecturerTablePageRef.value.openDrawer()
}
//自主培训
const trainListFormRef = ref<ComponentRef<typeof SelfTrainListForm>>()
const go2AutonomousTraining = () => {
  trainListFormRef.value.openDrawer()
}
//内训视频集合
const insideList = ref<any[]>([])
//外训视频集合
const outsideList = ref<any[]>([])
//讲师集合
const lecturerList = ref<any[]>([])

const getBannerPicture = () => {
  return new URL(`../../../../assets/imgs/classroom/fm_default.png`, import.meta.url).href
}

const getAvatarPicture = () => {
  return new URL(`../../../../assets/imgs/classroom/avatar.png`, import.meta.url).href
}
const courseDetailsRef = ref()
//查看视频详情
const toVideoDetails = (item: any) => {
  courseDetailsRef.value.openDrawer(item.id, item.assessId)
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

const options = [
  {
    value: '0',
    label: '内训',
    children: [
      {
        value: '-1',
        label: '全部'
      },
      {
        value: '0',
        label: '管理类'
      },
      {
        value: '1',
        label: '技能类'
      },
      {
        value: '2',
        label: '其他'
      }
    ]
  },
  {
    value: '1',
    label: '外训',
    children: [
      {
        value: '-1',
        label: '全部'
      },
      {
        value: '0',
        label: '管理类'
      },
      {
        value: '1',
        label: '技能类'
      },
      {
        value: '2',
        label: '其他'
      }
    ]
  }
]
</script>
<template>
  <div :style="{ height: height }" class="classroom-wrap">
    <div ref="selWrap" class="sel-wrap">
      <div v-if="isAuth('schooL:room:query')" class="sel-left">
        <!-- <el-input
          v-model="searchParams.courseName"
          placeholder="标题模糊查询"
          :maxlength="30"
          class="input-class"
        ></el-input> -->
        <el-cascader
          v-model="searchParams.type"
          :options="options"
          class="input-class w-[150px]"
          clearable
          placeholder="选择类别"
        />
        <el-select
          v-model="searchParams.lecturerId"
          class="input-class ml-[10px]"
          clearable
          placeholder="选择讲师"
        >
          <el-option
            v-for="item in lecturerArray"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
        <el-button class="ml-[10px]" type="primary" @click="initData">查询</el-button>
        <el-button class="ml-[8px]" plain @click="reset">重置</el-button>
      </div>
      <div class="sel-right">
        <span
          v-if="isAuth('school:room:task')"
          style="background: #00a0e9; color: #ffffff"
          @click="go2TaskLearn"
        >
          任务学习
        </span>
        <span v-if="isAuth('school:room:self')" @click="go2SelfLearn"> 自主学习 </span>
        <span v-if="isAuth('school:room:train')" @click="go2AutonomousTraining"> 自主培训 </span>
        <span v-if="isAuth('school:room:course')" @click="go2CourseManager"> 课程管理 </span>
        <span v-if="isAuth('school:room:examine')" @click="go2CourseTestManager">
          课程考核管理
        </span>
        <span v-if="isAuth('school:room:lecturer')" @click="go2LecturerManager"> 讲师管理 </span>
      </div>
    </div>
    <div :style="{ height: contentHeight }" class="classroom-content-wrap">
      <div v-if="insideList.length" class="index-title">
        <span class="flex" @click="go2InsideListPage"
          >内训
          <Icon :size="12" class="mt-[1px]" icon="ep:arrow-right-bold" />
        </span>
      </div>
      <div v-if="insideList.length" class="mt-[12px]">
        <div class="ivu-row">
          <div v-for="(item, index) in insideList" :key="index" class="ivu-col">
            <div v-if="index < 5" class="col-box" @click="toVideoDetails(item)">
              <p class="type-p">
                <span class="type">内训</span>
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
                  <p>{{ item.createTime ? moment(item.createTime).format('YYYY-MM-DD') : '--' }}</p>
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
            </div>
          </div>
        </div>
      </div>

      <div v-if="outsideList.length" class="index-title mt-[24px]">
        <span class="flex" @click="go2OutsideListPage"
          >外训
          <Icon :size="12" class="mt-[1px]" icon="ep:arrow-right-bold" />
        </span>
      </div>
      <div v-if="outsideList.length" class="mt-[12px]">
        <div class="ivu-row">
          <div v-for="(item, index) in outsideList" :key="index" class="ivu-col">
            <div v-if="index < 5" class="col-box" @click="toVideoDetails(item)">
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
                  <p>{{ item.createTime ? moment(item.createTime).format('YYYY-MM-DD') : '--' }}</p>
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
            </div>
          </div>
        </div>
      </div>

      <div v-if="lecturerList.length" class="index-title mt-[24px]">
        <span class="flex" @click="go2LecturerListPage"
          >讲师
          <Icon :size="12" class="mt-[1px]" icon="ep:arrow-right-bold" />
        </span>
      </div>

      <div v-if="lecturerList.length" class="teacher-wrap mt-[12px]">
        <div class="ivu-row">
          <div v-for="(item, index) in lecturerList" :key="index" class="ivu-col">
            <div v-if="index < 5" class="col-box">
              <div class="img-box" @click="toLecturerDetails(item)">
                <img
                  :src="item.headUrl ? item.headUrl : getAvatarPicture()"
                  alt=""
                  :style="{ height: colWidth * 0.25 + 'px', width: colWidth * 0.25 + 'px' }"
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
      </div>

      <div v-if="!insideList.length && !outsideList.length && !lecturerList.length" class="no-data">
        <div>
          <img alt="" src="@/assets/imgs/project/nodata_icon.png" />
          <p style="letter-spacing: 1px">亲，没有你想要的数据~</p>
        </div>
      </div>
    </div>
  </div>
  <!--  自主学习  -->
  <SelfLearnListForm ref="selfLearnListFormRef" />
  <!--  任务学习  -->
  <TaskLearnListForm ref="taskLearnListFormRef" />
  <!--  课程详情  -->
  <CourseDetails ref="courseDetailsRef" @refresh="refresh" />
  <!--  课程管理  -->
  <CourseListForm ref="courseListFormRef" />
  <!--  讲师管理  -->
  <LecturerListForm ref="lecturerListFormRef" />
  <LecturerTablePage ref="lecturerTablePageRef" />
  <!--  课程考核管理  -->
  <CourseAssessListForm ref="assessListFormRef" />
  <!--  自主培训管理  -->
  <SelfTrainListForm ref="trainListFormRef" />
  <!--  内训/外训  -->
  <CourseVideoListForm ref="courseVideoListFormRef" />
  <!--  讲师详情  -->
  <LecturerDetails ref="lecturerDetailsRef" />

  <LimitDailog routerName="ClassRoom" />
</template>
<style lang="less" scoped>
.classroom-wrap {
  .sel-wrap {
    display: flex;
    margin-top: 10px;
    align-items: center;
    justify-content: space-between;
    margin-left: 14px;
    margin-right: 9px;
    font-size: 15px;
    overflow: hidden;

    .sel-left {
      display: flex;
      align-items: center;

      span {
        min-width: 55px;
        font-weight: 600;
      }

      .sel-title {
        color: #666666;
      }

      .input-class {
        width: 150px;
        height: 36px;
        line-height: 36px;
      }
    }

    .sel-right {
      span {
        display: inline-block;
        background-color: #ffffff;
        color: #333333;
        height: 36px;
        padding: 0px 0.8em;
        margin: 0 3px;
        line-height: 36px;
        text-align: center;
        cursor: pointer;
        font-size: 0.9em;
        border: 1px solid #e2e2e2;
        border-radius: 18px;
        font-family: Alibaba PuHuiTi R;
        font-weight: 400;
      }
    }
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

  .classroom-content-wrap {
    padding-bottom: 10px;
    margin: 20px 0px 0px 15px;
    overflow: hidden;
    overflow-y: auto;

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

:deep(.el-input__wrapper) {
  height: 36px;
  line-height: 36px;
}

.single-line {
  flex: 1;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
