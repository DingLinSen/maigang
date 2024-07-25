<!-- 课堂详情 -->
<template>
  <DrawerWrap ref="drawerWrap" :isShow="isShow" title="课程详情" @close-drawer="closeDrawer">
    <template #content>
      <!--      视频    -->
      <div class="video w-full h-[599px] flex justify-between">
        <div class="video-item w-[65%]">
          <video
            id="myVideo"
            ref="videoRef"
            :controls="isControls"
            :src="courseDetailsData.courseUrl"
            class="w-full h-full"
            controlsList="nodownload"
            @pause="handlePause"
            @play="handlePlay"
            @timeupdate="handleTimeUpdate"
          >
            <source :src="courseDetailsData.courseUrl" type="video/mp4" />
          </video>
        </div>
        <div class="video_details ml-[5px] flex-1 pr-[10px] pl-[25px] pt-25px w-[35%] h-full">
          <div class="details_title text-3xl font-bold">
            <p :title="courseDetailsData.courseName" class="ellipsis-3line">{{
              courseDetailsData.courseName
            }}</p>
          </div>
          <div class="lecturer w-full">
            <span>讲师：</span>
            <span :title="courseDetailsData.lecturerName" class="single-line">{{
              courseDetailsData.lecturerName
            }}</span>
            <span class="ml-[20px]"
              >类别：{{
                courseDetailsData.secondType == 0
                  ? '管理类'
                  : courseDetailsData.secondType == 1
                  ? '技能类'
                  : courseDetailsData.secondType == 2
                  ? '其他'
                  : ''
              }}</span
            >
          </div>
          <div class="mark flex justify-between mr-[10px]">
            <div class="points flex items-center">
              <div class="mark_color">
                <span class="text-3xl font-bold mr-[6px]">{{ courseDetailsData.average }}</span
                >分
              </div>
              <div class="flex ml-[6px]">
                <div
                  v-for="item in numInt"
                  :style="{
                    background:
                      item == numInt
                        ? `linear-gradient(to left, #d2d2d2 ${
                            100 - afterTwo
                          }%, #ffc453 ${afterTwo}%)`
                        : ''
                  }"
                  class="star"
                >
                </div>
                <!-- 添加白色背景, 循环背景为白色的小星星 -->
                <div v-for="item in numFFF" v-if="numFFF != 0" class="star fff"></div>
              </div>
            </div>
            <div class="flex">
              <div v-if="courseDetailsData.scoreFlag == 1" class="mark_button" @click="openMark">
                我要评分
              </div>
              <div
                class="downLoad_button"
                @click="
                  downloadFile(
                    courseDetailsData.courseUrl,
                    getFileName(courseDetailsData.courseUrl)
                  )
                "
              >
                下载视频
              </div>
            </div>
          </div>

          <div class="video_text">
            <div class="text_title mt-[18px] mb-[20px]">
              <p>课程大纲：</p>
            </div>
            <div class="text_top">
              <p :title="courseDetailsData.outline" class="ellipsis-11line">
                {{ courseDetailsData.outline }}</p
              >
            </div>
          </div>
          <div class="w-full video_bottom pl-[25px] flex justify-between">
            <div class="flex">
              <div>
                <Icon
                  :style="{ color: courseDetailsData.likeFlag ? `#ffc453` : `#c6c6c6` }"
                  class="mr-5px zan zan-class"
                  icon="svg-icon:zan_icon"
                  @click="doLike"
                />
                <span style="color: #888888">{{ courseDetailsData.likeCount }}</span>
              </div>
              <div class="ml-[20px]">
                <Icon class="mr-5px zan" icon="svg-icon:view_icon" />
                <span style="color: #888888">{{ courseDetailsData.viewCount }}</span>
              </div>
            </div>
            <div class="mr-[27px]" style="color: #888888">
              时长:{{
                courseDetailsData.videoTime
                  ? courseDetailsData.videoTime > 60
                    ? (courseDetailsData.videoTime / 60).toFixed(1) + ' 分钟'
                    : (courseDetailsData.videoTime / 1).toFixed(1) + ' 秒'
                  : ''
              }}
            </div>
          </div>
        </div>
      </div>
      <!--      评论内容   -->
      <div class="review_content w-full h-[202px] mt-[10px] pt-[32px] pl-[24px] pr-[24px]">
        <div class="flex">
          <div>
            <img
              :src="
                courseDetailsData && courseDetailsData.headImg
                  ? courseDetailsData.headImg
                  : getAvatarPicture()
              "
              class="head-img-class"
              @error="setDefaultImage"
            />
            <!-- <Icon class="mr-5px avatar" icon="svg-icon:default_avatar_icon" /> -->
          </div>
          <div class="flex-1 ml-[22px]">
            <el-input v-model="textarea" :rows="4" placeholder="请输入评价内容" type="textarea" />
            <div class="publish" @click="handlePublish"> 发布</div>
          </div>
        </div>
      </div>
      <!--      全部评价    -->
      <div class="total_evaluation">
        <div class="evaluate_title h-[58px] pl-[25px] mb-20px"> 全部评价</div>
        <div
          v-for="item in publishData"
          v-if="publishData.length"
          :key="item"
          class="pl-[25px] flex pb-[25px]"
        >
          <div>
            <img :src="item.headImg ? item.headImg : getAvatarPicture()" class="head-img-class" />
            <!-- <Icon class="mr-5px avatar" icon="svg-icon:default_avatar_icon" /> -->
          </div>
          <div class="ml-[10px]">
            <span class="name" style="color: #333333">{{ item.createUserName }}</span>
            <span class="time ml-[10px]" style="color: #888888">{{ item.createDate }}</span>
            <span
              v-if="item.delFlag == 0"
              class="ml-10px cursor-pointer"
              style="color: #fc5252"
              @click="delReview(item.id)"
              >删除
            </span>
            <div class="evaluate_content" style="color: #555555">{{ item.content }}</div>
          </div>
        </div>
        <NoData v-else />
      </div>
    </template>
  </DrawerWrap>
  <!--    弹出框    -->
  <el-dialog
    v-model="markDialogVisible"
    :show-close="false"
    title="课程评分"
    width="30%"
    @closed="handleClose"
  >
    <template #header="{ close }">
      <div class="flex justify-between">
        <slot name="title">
          <span class="w-full news-dialog-title-class">课程评分</span>
        </slot>
        <div class="pl-[5px] pr-[5px] cursor-pointer" @click="close">
          <Icon :size="14" class="is-hover z-10 mt-5px" icon="svg-icon:close_icon_dialog" />
        </div>
      </div>
    </template>
    <div class="flex items-center justify-center ml-[6px] h-104px mark_details">
      <div v-for="(item, index) in scoreList" :key="index" class="score-p" @click="selStar(item)">
        <Icon
          :class="item.isActive ? 'is-active' : 'start_icon'"
          class="start_icon"
          icon="svg-icon:selected_star_icon"
        />
        <p>{{ item.name }}</p>
      </div>
    </div>
    <template #footer>
      <span class="dialog-footer">
        <el-button type="primary" @click="saveScore"> 提交 </el-button>
      </span>
    </template>
  </el-dialog>
</template>
<script lang="ts" setup>
import { ref } from 'vue'
import { DrawerWrap } from '@/components/DrawerWrapDetails'
import {
  addAssessComment,
  delAssessComment,
  getCourseInfoApi,
  addScore,
  CourseLookTimeApi,
  AddStudyRecordApi
} from '@/api/school/course'
import { ElMessageBox, ElMessage } from 'element-plus'
import NoData from '@/views/Components/NoData.vue'
import { assessLikeApi } from '@/api/school/lecturer'

import { useRouter } from 'vue-router'
import axios from 'axios'
// import { downloadFile } from '@/utils/index'

const router = useRouter()
defineOptions({
  name: 'CourseDetails'
})

const setDefaultImage = async (e: any) => {
  const avatar = await import('@/assets/imgs/avatar.jpg')
  e.target.src = avatar.default
}

const emit = defineEmits(['refresh'])
// 获取文件名称
const getFileName = (name: any) => {
  if (name.lastIndexOf('/') > -1) {
    return name.slice(name.lastIndexOf('/') + 1)
  } else {
    return ''
  }
}
// 下载视频
const downloadFile = (filePath: any, fileName: any) => {
  axios
    .request({
      method: 'GET', //这个不解释了吧
      url: filePath, //路径
      responseType: 'blob' //告诉服务器想到的响应格式
    })
    .then(async (res) => {
      const blob = new Blob([res.data])
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.style.display = 'none'
      a.download = fileName
      a.href = url
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      //释放一个通过 URL.createObjectURL() 方法创建的 URL,防止内存泄漏
      URL.revokeObjectURL(url)
      await AddStudyRecordApi({
        actionType: 1,
        moduleName: '培训课堂',
        targetName: res.data.courseName
      })
    })
}

const getAvatarPicture = () => {
  return new URL(`@/assets/imgs/classroom/default_avatar_icon.png`, import.meta.url).href
}
const markDialogVisible = ref<boolean>(false)
const isShow = ref<boolean>(false)
const textarea = ref('')
const scoreNum = ref() // 后端穿过来的数据  最大是5
const str = ref()
const numInt = ref() // 向上取整数
const temp = ref() // 获取小数点数据
const afterTwo = ref() // 补零避免出现小数点后一位情况, 也可以在接收        后端数据后进行toFixed(2)
const numFFF = ref() // 白色五角星的数量
const scoreList = ref([
  {
    id: 1,
    isActive: false,
    name: '极差'
  },
  {
    id: 2,
    isActive: false,
    name: '较差'
  },
  {
    id: 3,
    isActive: false,
    name: '一般'
  },
  {
    id: 4,
    isActive: false,
    name: '不错'
  },
  {
    id: 5,
    isActive: false,
    name: '较好'
  }
])
const courseDetailsData = ref<any>({})
const createTime = ref()
const isControls = ref(false)
// 查询视频详情
const getCourseInfo = async (flag: string, val: string) => {
  const res = await getCourseInfoApi({
    id: courseDetailsId.value,
    flag: flag,
    assessId: assessId.value ? assessId.value : ''
  })
  courseDetailsData.value = res.data
  publishData.value = res.data.tbAssessCommentDos
  let num = res.data.average
  scoreNum.value = num / 2
  numInt.value = Math.ceil(scoreNum.value)
  numFFF.value = 5 - numInt.value
  str.value = scoreNum.value + ''
  temp.value = str.value.split('.')[1]
  afterTwo.value = temp.value > 10 ? temp.value : temp.value + '0'
  createTime.value = res.data.userViewTime
  setTimeout(() => {
    var video = document.getElementById('myVideo')
    video.currentTime = createTime.value ? createTime.value : 0
    if (courseDetailsData.value.userCourseFlag == 0 && courseDetailsData.value.delay == 0) {
      //任务学习课程且没有延误
      isFastForward.value = true
      handleTimeUpdate()
      isControls.value = true
    } else {
      isFastForward.value = false
    }
    setTimeout(() => {
      // isFirst.value = false
      isControls.value = true
    }, 100)
  }, 100)
  maxTime.value = createTime.value ? createTime.value : 0
}
const publishData = ref([])
// 发布评论
const handlePublish = async () => {
  var revaue = textarea.value.replace(/^\s*|(\s*$)/g, '')
  if (revaue.length <= 0) {
    ElMessage.warning('评价内容不能为空或者空格')
    return
  }
  if (textarea.value.length > 200) {
    ElMessage.warning('评价内容不能超过200字')
    return
  }
  await addAssessComment({
    courseId: courseDetailsId.value,
    content: textarea.value
  }).then(async (res) => {
    // handlePause()
    if (res.message == 'OK') {
      ElMessage.success('评价成功')
      textarea.value = ''
      const res = await getCourseInfoApi({ id: courseDetailsId.value, flag: 0 })
      publishData.value = res.data.tbAssessCommentDos
    }
  })
}
// 删除评论
const delReview = (id) => {
  ElMessageBox.confirm('确定删除该评价吗?', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
    autofocus: false
  }).then(async () => {
    const res = await delAssessComment({
      id: id
    })
    if (res.data) {
      ElMessage.success('删除成功')
      const res = await getCourseInfoApi({ id: courseDetailsId.value, flag: 0 })
      publishData.value = res.data.tbAssessCommentDos
    }
  })
}
// 选择评分
const selStar = (item) => {
  for (let index = 0; index < scoreList.value.length; index++) {
    if (scoreList.value[index].id <= item.id) {
      scoreList.value[index].isActive = true
      score.value = (index + 1) * 2
    } else {
      scoreList.value[index].isActive = false
    }
  }
}
const score = ref()
// 提交评分
const saveScore = async () => {
  if (!score.value) {
    ElMessage.warning('评分不能为空')
    return
  }
  await addScore({
    courseId: courseDetailsId.value,
    score: score.value
  }).then(async (res) => {
    if (res.data == 0) {
      handlePause()
      ElMessage.success('评分成功')
      const res = await getCourseInfoApi({ id: courseDetailsId.value, flag: 0 })
      courseDetailsData.value.average = res.data.average
      let num = res.data.average
      scoreNum.value = num / 2
      numInt.value = Math.ceil(scoreNum.value)
      numFFF.value = 5 - numInt.value
      str.value = scoreNum.value + ''
      temp.value = str.value.split('.')[1]
      afterTwo.value = temp.value > 10 ? temp.value : temp.value + '0'
      markDialogVisible.value = false
    }
  })
}
// 打开评分弹窗
const openMark = () => {
  markDialogVisible.value = true
  scoreList.value = [
    {
      id: 1,
      isActive: false,
      name: '极差'
    },
    {
      id: 2,
      isActive: false,
      name: '较差'
    },
    {
      id: 3,
      isActive: false,
      name: '一般'
    },
    {
      id: 4,
      isActive: false,
      name: '不错'
    },
    {
      id: 5,
      isActive: false,
      name: '较好'
    }
  ]
}
// 关闭评分弹窗
const handleClose = () => {
  scoreList.value = []
}

const isFastForward = ref(false)
const courseDetailsId = ref()
const assessId = ref()
//打开drawer并初始化
const drawerWrap = ref()
const openDrawer = (id: number | string, assess: number | string) => {
  assessId.value = assess
  drawerWrap.value.isShow = true
  courseDetailsId.value = id ? id : ''
  getCourseInfo('1')
  // if (flag) {
  //   isFastForward.value = true
  // } else {
  //   isFastForward.value = false
  // }
}
// 关闭drawer
const closeDrawer = () => {
  var video = document.getElementById('myVideo')
  video.pause()
  handlePause()
  getVideoTime()
  clearInterval(timer)
  isFirst.value = true
  // router.go(0)
  emit('refresh')
}
const currentTime = ref()
const isFirst = ref(true)
const maxTime = ref(0)
// 视频监听
const handleTimeUpdate = () => {
  if (isFastForward.value) {
    // 任务学习禁止快进
    var sym
    var video = document.getElementById('myVideo')
    var timerSub = setInterval(() => {
      var time = video.currentTime
      // time > maxTime.value
      if (time - sym > 1) {
        if (createTime.value) {
          video.currentTime = createTime.value
        } else {
          video.currentTime = sym
        }
      }
      sym = video.currentTime
      if (!drawerWrap.value || !drawerWrap.value.isShow) {
        clearInterval(timerSub)
      }
      // maxTime.value = video.currentTime > maxTime.value ? video.currentTime : maxTime.value
    }, 500)
  } else {
  }
}

var timer = null
const handlePlay = () => {
  timer = setInterval(() => {
    var video = document.getElementById('myVideo')
    currentTime.value = video.currentTime
    getVideoTime()
  }, 10000)
}
// 视频暂停
const handlePause = () => {
  var video = document.getElementById('myVideo')
  currentTime.value = video.currentTime
  getVideoTime()
  clearInterval(timer)
}

//记录视频播放时长
const getVideoTime = async () => {
  if (currentTime.value) {
    await CourseLookTimeApi({
      flag: courseDetailsData.value.userCourseFlag,
      courseId: courseDetailsId.value,
      viewTime: currentTime.value,
      assessId: assessId.value ? assessId.value : ''
    })
  }
}
//点赞
const doLike = async () => {
  let param = { id: courseDetailsId.value }
  let res = await assessLikeApi(param)
  if (res) {
    if (courseDetailsData.value.likeFlag) {
      ElMessage.success('成功取消点赞')
      const res = await getCourseInfoApi({ id: courseDetailsId.value, flag: 0 })
      // courseDetailsData.value.likeFlag = !res.data.likeFlag
      courseDetailsData.value.likeCount = res.data.likeCount
    } else {
      ElMessage.success('点赞成功')
      const res = await getCourseInfoApi({ id: courseDetailsId.value, flag: 0 })
      await AddStudyRecordApi({
        actionType: 2,
        moduleName: '培训课堂',
        targetName: res.data.courseName
      })
      // courseDetailsData.value.likeFlag = !res.data.likeFlag
      courseDetailsData.value.likeCount = res.data.likeCount
    }
    courseDetailsData.value.likeFlag = !courseDetailsData.value.likeFlag
  }
}
defineExpose({
  openDrawer
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

:deep(.el-card__body) {
  padding: 0 !important;
}

:deep(.el-textarea__inner) {
  background: #f9f9f9;
}

:deep(.el-dialog__header) {
  width: 100% !important;
}

.video-item {
  background-color: #ffffff;
  padding: 10px;
}

.video_details {
  position: relative;
  background-color: #ffffff;
}

.details_title {
  color: #222222;
}

.lecturer {
  margin: 17px 0 22px 0;
}

.mark_color {
  // width: 4.5em;
  margin-bottom: 0.5em;
  color: #008de7;
}

.mark_button {
  margin-top: 5px;
  font-size: 14px;
  width: 80px;
  height: 30px;
  line-height: 30px;
  background: #eeeeef;
  border-radius: 18px;
  text-align: center;
  cursor: pointer;
  margin-right: 5px;
}

.downLoad_button {
  font-size: 14px;
  color: #ffffff;
  margin-top: 5px;
  width: 80px;
  height: 30px;
  line-height: 30px;
  background: #008de7;
  border-radius: 18px;
  text-align: center;
  cursor: pointer;
  //margin-left: 5px;
}

.star {
  width: 20px;
  height: 20px;
  margin-right: 3px;
  background: #ffc453;
  // 先画出五角星
  -webkit-clip-path: polygon(
    50% 0%,
    63% 38%,
    100% 38%,
    69% 63%,
    82% 100%,
    50% 75%,
    18% 100%,
    31% 63%,
    0% 38%,
    37% 38%
  );
}

.fff {
  background-color: #d2d2d2;
}

.text_title {
  color: #555555;
}

.video_bottom {
  position: absolute;
  bottom: 20px;
  left: 0;
}

.zan {
  vertical-align: top;
}

.zan-class {
  cursor: pointer;
}

.review_content {
  background-color: #ffffff;
}

.avatar {
  font-size: 60px !important;
}

.publish {
  width: 100px;
  height: 42px;
  line-height: 42px;
  background: #00a0e9;
  border-radius: 4px;
  text-align: center;
  color: #ffffff;
  margin-top: 10px;
  cursor: pointer;
}

.total_evaluation {
  margin-top: 10px;
  background-color: #ffffff;
}

.evaluate_title {
  font-size: 18px;
  color: #222222;
  border-bottom: 1px solid #e5e5e5;
  line-height: 58px;
}

.mark_details {
  background-color: #f9f9f9;
}

.score-p {
  width: 16%;
  text-align: center;

  .start_icon {
    cursor: pointer;
    font-size: 26px !important;
    color: #d2d2d2 !important;
  }

  .is-active {
    color: #ffc453 !important;
  }
}

.evaluate_content {
  width: 550px;
  word-wrap: break-word;
  white-space: pre-line;
}

.head-img-class {
  width: 60px;
  height: 60px;
  margin-right: 5px;
  border-radius: 50%;
}

.ellipsis-3line {
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 3;
}

.single-line {
  flex: 1;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.ellipsis-11line {
  height: 15em;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 10;
}
</style>
