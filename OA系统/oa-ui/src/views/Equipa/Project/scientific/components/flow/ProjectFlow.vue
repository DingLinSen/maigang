<!-- eslint-disable vue/no-use-v-if-with-v-for -->
<!-- 进度条 -->
<script setup lang="ts">
import { ref, provide, unref, watch, inject, reactive, nextTick, getCurrentInstance } from 'vue'
import { findLastIndex } from '@/utils'

defineOptions({
  name: 'ProjectFlow'
})
// 获取详细信息
const detailsData = inject<any>('detailsData')
const stepsItems = ref<any>([]) // 进度条

// 所有进度条
const allStepsItems = ref([
  {
    id: 1,
    name: '进展/变更',
    isComplete: false,
    isShow: false,
    isNow: false,
    sub: false,
    small: false,
    subInfo: []
  },
  {
    id: 12,
    name: '结题',
    isComplete: false,
    isNow: false,
    isShow: false,
    subInfo: [],
    sub: false,
    small: false
  }
])
//是否显示开始
const isShowStart = ref<boolean>(false)
//科研申请的信息
const startSubInfo = ref<any>([])

// 监听父级数据变化
watch(
  () => detailsData.value,
  (data: any) => {
    stepsItems.value = []
    if (data) {
      let subInfo: any[] = [] // 科研中
      startSubInfo.value = [] // 科研开始审批意见
      let statusSubInfo: any[] = [] //状态变更
      let conclusionSubInfo: any[] = [] //已结题
      // 变更指示指示灯数据
      data.pmProgressList.forEach((item: any) => {
        let info: any = []
        if (item.type === '1') {
          // 进展
          info = [
            {
              title: '时间：',
              content: item.progressDate
            },
            {
              title: '负责人：',
              content: item.createByName
            },
            {
              title: '进展：',
              content: item.content
            }
          ]
        }
        if (item.type === '2') {
          // 变更
          info = [
            {
              title: '时间：',
              content: item.progressDate
            },
            {
              title: '变更人：',
              content: item.createByName
            },
            {
              title: '内容：',
              content: item.content
            }
          ]
        }
        if (item.type === '3') {
          // 指示
          info = [
            {
              title: '时间：',
              content: item.progressDate
            },
            {
              title: '指示人：',
              content: item.createByName
            },
            {
              title: '内容：',
              content: item.content
            }
          ]
        }
        subInfo.push({
          title:
            item.type === '1'
              ? '进展：'
              : item.type === '2'
              ? '变更：'
              : item.type === '3'
              ? '指示：'
              : '',
          info: info
        })
      })
      // 科研开始审批指示灯数据
      data.pmAuditList.forEach((item: any) => {
        // status区分 0是同意，1是驳回
        // flag是 区分1申请 2审核 3 确认)',
        // phase 阶段 1培育 2立项 3实施 4售后 5科研',
        //type 11 科研申请 5 项目状态变更审批 12 结题审批
        let info: any[] = []
        if (item.phase === '5') {
          //科研申请
          if (item.type === '11') {
            if (item.flag === '1') {
              // 科研开始
              info = [
                {
                  title: '时间：',
                  content: item.auditDate || '--'
                },
                {
                  title: '申请人：',
                  content: item.createByName
                },
                {
                  title: '内容：',
                  content: '自研项目申请。'
                }
              ]
            }
            if (item.flag === '2') {
              info = [
                {
                  title: '时间：',
                  content: item.auditDate || '--'
                },
                {
                  title: '审批人：',
                  content: item.createByName
                },
                {
                  title: '内容：',
                  content:
                    item.status && item.status !== ''
                      ? (item.status === '1' ? '同意' : item.status === '2' ? '驳回' : '') +
                        '科研项目申请，建议/理由：' +
                        (item.reason ? item.reason : '--')
                      : '待审批'
                }
              ]
            }
            startSubInfo.value.push({
              title: item.flag === '1' ? '申请：' : item.flag === '2' ? '审批：' : '',
              info: info
            })
          }
          // 项目状态变更审批中
          if (item.type === '5') {
            info = [
              {
                title: '时间：',
                content: item.auditDate
              },
              {
                title: '审批人：',
                content: item.createByName
              },
              {
                title: '内容：',
                content:
                  (item.status === '1' ? '同意了' : item.status === '2' ? '驳回了' : '') +
                  '项目状态变更申请，' +
                  (item.content ? item.content + '，' : '') +
                  '建议/理由：' +
                  (item.reason ? item.reason : '--')
              }
            ]
            statusSubInfo.push({
              title: item.flag === '1' ? '申请：' : item.flag === '2' ? '审批：' : '',
              info: info
            })
          }
          //结题审批
          if (item.type === '12') {
            if (item.flag === '1') {
              // 结题审批
              info = [
                {
                  title: '时间：',
                  content: item.auditDate || '--'
                },
                {
                  title: '申请人：',
                  content: item.createByName
                },
                {
                  title: '内容：',
                  content: item.content
                }
              ]
            }
            if (item.flag === '2') {
              info = [
                {
                  title: '时间：',
                  content: item.auditDate || '--'
                },
                {
                  title: '审批人：',
                  content: item.createByName
                },
                {
                  title: '内容：',
                  content:
                    item.status && item.status !== ''
                      ? (item.status === '1' ? '同意' : item.status === '2' ? '驳回' : '') +
                        '结题申请，建议/理由：' +
                        (item.reason ? item.reason : '--')
                      : '待审批'
                }
              ]
            }
            conclusionSubInfo.push({
              title: item.flag === '1' ? '申请：' : item.flag === '2' ? '审批：' : '',
              info: info
            })
          }
        }
      })
      // 进展中
      stepsItems.value = JSON.parse(JSON.stringify(allStepsItems.value))
      //科研申请中
      if (data.status === '1') {
        stepsItems.value = JSON.parse(JSON.stringify(allStepsItems.value))
        // 科研审批流程序号 auditSort 1 待审批 2 上级负责人审批 3上级负责人驳回 4总经理审批 5总经理驳回
        if (data.auditSort === '1' || !data.auditSort) {
          if (data.principalPersonLeaderName !== '张保国') {
            startSubInfo.value.push({
              title: '审批：',
              info: [
                {
                  title: '时间：',
                  content: '--'
                },
                {
                  title: '审批人：',
                  content: data.principalPersonLeaderName
                },
                {
                  title: '内容：',
                  content: '待审批'
                }
              ]
            })
          }
          startSubInfo.value.push({
            title: '审批：',
            info: [
              {
                title: '时间：',
                content: '--'
              },
              {
                title: '审批人：',
                content: '张保国'
              },
              {
                title: '内容：',
                content: '待审批'
              }
            ]
          })
        }

        if (data.auditSort === '2') {
          startSubInfo.value.push({
            title: '审批：',
            info: [
              {
                title: '时间：',
                content: '--'
              },
              {
                title: '审批人：',
                content: '张保国'
              },
              {
                title: '内容：',
                content: '待审批'
              }
            ]
          })
        }
      }
      //审批中
      if (
        data.status === '2' ||
        data.status === '3' ||
        data.status === '4' ||
        data.status === '5'
      ) {
        stepsItems.value = JSON.parse(JSON.stringify(allStepsItems.value))
        stepsItems.value[0].isNow = true
        stepsItems.value[0].isComplete = true
        stepsItems.value[0].sub = true
      }
      if (subInfo) {
        stepsItems.value[0].subInfo = subInfo
      }
      // 暂停
      if (data.status === '8') {
        let a: any[] = []
        stepsItems.value.forEach((v: any, index: any) => {
          if (index < 1) {
            v.isComplete = true
            a.push(v)
          }
        })

        a.push({
          id: Number(a.length),
          name: '立项暂停',
          isComplete: true,
          isShow: false,
          isNow: false,
          subInfo: statusSubInfo,
          sub: false,
          small: false,
          color: 'rgba(255, 255, 255, 1)'
        })

        stepsItems.value = a
        console.log('stepsItems==>', stepsItems.value)
      }
      //结束终止
      if (data.status === '7') {
        let lastIndex = findLastIndex(
          data.pmAuditList,
          (item: any) => item.flag === '1' && item.phase === '5' && item.type === '5'
        )
        let endList: any[] = []
        let auditList = data.pmAuditList.slice(lastIndex, data.pmAuditList.length)
        auditList.forEach((item: any) => {
          // 培育终止
          let info: any[] = []
          if (item.flag === '1') {
            info = [
              {
                title: '时间：',
                content: item.auditDate || '--'
              },
              {
                title: '负责人：',
                content: item.createByName || '--'
              },
              {
                title: '内容：',
                content: item.reason ? '因' + item.reason + '原因，申请结束终止。' : '--'
              }
            ]
          }
          if (item.flag === '2') {
            info = [
              {
                title: '时间：',
                content: item.createTime
              },
              {
                title: '审批人：',
                content: item.createByName
              },
              {
                title: '内容：',
                content:
                  (item.status === '1' ? '同意' : item.status === '2' ? '驳回' : '') +
                  '结束终止，建议/理由：' +
                  (item.reason ? item.reason : '--')
              }
            ]
          }
          endList.push({
            title: item.flag === '1' ? '申请：' : item.flag === '2' ? '审批：' : '',
            info: info
          })
        })
        stepsItems.value = [
          {
            id: 1,
            name: '进展/变更',
            isComplete: true,
            isShow: false,
            isNow: false,
            sub: false,
            small: false,
            subInfo: subInfo
          },
          {
            id: 2,
            name: '结束终止',
            isComplete: true,
            isShow: false,
            isNow: false,
            sub: false,
            small: false,
            color: 'rgb(255, 255, 255)',
            subInfo: endList
          }
        ]
      }
      //已结题
      if (data.status === '6') {
        stepsItems.value[0].isNow = false
        stepsItems.value[0].isComplete = true
        stepsItems.value[0].sub = true
        stepsItems.value[1].isNow = false
        stepsItems.value[1].isComplete = true
        stepsItems.value[1].sub = true
        stepsItems.value[1].subInfo = conclusionSubInfo
      }
    }
  },
  {
    immediate: true
  }
)
// 鼠标移入
const mouseOver = (item: any, index: number) => {
  for (let i = 0; i < stepsItems.value.length; i++) {
    if (stepsItems.value[i].id === item.id) {
      stepsItems.value[i].isShow = true
    } else {
      stepsItems.value[i].isShow = false
    }
  }
}
// 鼠标移出
const mouseLeave = () => {
  for (let i = 0; i < stepsItems.value.length; i++) {
    stepsItems.value[i].isShow = false
  }
}

//鼠标移入
const mouseOver1 = () => {
  isShowStart.value = true
}
//鼠标移出
const mouseLeave1 = () => {
  isShowStart.value = false
}
</script>
<template>
  <section class="process-bar pt-1 pr-18">
    <div class="step-wrapper" :style="{ marginBottom: '29px' }">
      <div class="step-wrap">
        <div class="step-info" style="width: 1%">
          <div class="relative" style="background: rgba(0, 0, 0, 0)">
            <span class="name"><b>自研开始</b></span>
            <ElTooltip effect="light">
              <span
                class="circle relative"
                style="background: #00a0e9"
                @mouseenter="mouseOver1()"
                @mouseleave="mouseLeave1()"
              >
                <img src="@/assets/imgs/done.png" class="text-white circle-check-mark" />
                <!-- <Icon icon="ion:checkmark-sharp" class="text-white circle-check-mark" /> -->
              </span>
              <template #content>
                <div class="content" v-if="startSubInfo.length">
                  <div
                    class="content-info"
                    v-for="(subItem, subIndex) in startSubInfo"
                    :key="subIndex + 111111"
                  >
                    <div class="left">{{ subItem.title }}</div>
                    <div class="right">
                      <p
                        v-for="(it, i) in subItem.info"
                        :key="i + 1000001"
                        class="word-break"
                        style="line-break: anywhere"
                      >
                        <span>{{ it.title }}</span>
                        {{ it.content }}
                      </p>
                    </div>
                  </div>
                </div>
                <template v-else>
                  <div class="content-info">
                    <p class="no-data">暂无数据</p>
                  </div>
                </template>
              </template>
            </ElTooltip>
          </div>
        </div>
        <template v-for="(item, index) in stepsItems" :key="index">
          <div class="step-info" :style="{ width: '17%' }" v-if="index < 6">
            <div class="line" :style="{ background: item.isComplete ? '#00a0e9' : '#D8DBE7' }">
              <div>
                <span class="sub-step" v-if="item.sub"></span>
                <span
                  class="name"
                  :style="{
                    color: item.isComplete
                      ? item.name == '立项暂停'
                        ? '#FF565C'
                        : item.name == '结束终止'
                        ? '#4E5569'
                        : '#222222'
                      : '#777777'
                  }"
                >
                  <b>{{ item.name }}</b></span
                >
                <span class="space-left-class"> </span>
                <ElTooltip effect="light">
                  <span
                    class="circle relative"
                    v-if="!item.isNow"
                    @mouseenter="mouseOver(item, index)"
                    @mouseleave="mouseLeave()"
                    :style="{
                      background: item.isComplete
                        ? item.color
                          ? item.color
                          : '#00a0e9'
                        : item.color
                        ? item.color
                        : '#D8DBE7'
                    }"
                  >
                  <div v-if="item.isComplete">
                    <img
                      src="@/assets/imgs/suspend.png"
                      class="text-white circle-check-mark"
                      v-if="item.name == '立项暂停'"
                    />
                    <img
                      src="@/assets/imgs/end.png"
                      class="text-white circle-check-mark"
                      v-else-if="item.name == '结束终止'"
                    />
                    <img src="@/assets/imgs/done.png" class="text-white circle-check-mark" v-else />
                  </div>
                    <!-- <Icon
                      icon="carbon:checkmark"
                      class="text-white circle-check-mark"
                      v-if="item.isComplete"
                  /> -->
                  </span>
                  <template #content>
                    <div class="content" v-if="item.subInfo.length">
                      <div
                        class="content-info"
                        v-for="(subItem, subIndex) in item.subInfo"
                        :key="subIndex + 111111"
                      >
                        <div class="left">{{ subItem.title }}</div>
                        <div class="right">
                          <p
                            v-for="(it, i) in subItem.info"
                            :key="i + 1000001"
                            class="word-break"
                            style="line-break: anywhere"
                          >
                            <span>{{ it.title }}</span>
                            {{ it.content }}
                          </p>
                        </div>
                      </div>
                    </div>
                    <template v-else>
                      <div class="content-info">
                        <p class="no-data">暂无数据</p>
                      </div>
                    </template>
                  </template>
                </ElTooltip>
              </div>
              <ElTooltip effect="light">
                <img src="@/assets/imgs/progress.png" class="circle-p" v-if="item.isNow" />
                <!-- <div class="circle-p" v-if="item.isNow">
                  <span class="circle-sub"></span>
                </div> -->
                <template #content>
                  <div class="content" v-if="item.subInfo.length">
                    <div
                      class="content-info"
                      v-for="(subItem, subIndex) in item.subInfo"
                      :key="subIndex + 111111"
                    >
                      <div class="left">{{ subItem.title }}</div>
                      <div class="right">
                        <p
                          v-for="(it, i) in subItem.info"
                          :key="i + 1000001"
                          class="word-break"
                          style="line-break: anywhere"
                        >
                          <span>{{ it.title }}</span>
                          {{ it.content }}
                        </p>
                      </div>
                    </div>
                  </div>
                  <template v-else>
                    <div class="content-info">
                      <p class="no-data">暂无数据</p>
                    </div>
                  </template>
                </template>
              </ElTooltip>
            </div>
          </div>
        </template>
      </div>
      <div class="step-wrap-right">
        <template v-for="(item, index) in stepsItems" :key="index">
          <div class="step-info" v-if="index == 6" style="height: 2vw; margin-top: 1.5vh">
            <div class="line" :style="{ background: item.isComplete ? '#00a0e9' : '#D8DBE7' }">
              <span class="sub-step" v-if="item.sub"></span>
              <span class="name" :style="{ color: item.isComplete ? '#222222' : '#777777' }"
                ><b>{{ item.name }}</b></span
              >
              <span class="space-right-class"></span>
              <span class="space-bottom-left-class"></span>
              <ElTooltip effect="light">
                <span
                  class="circle relative"
                  v-if="!item.isNow"
                  @mouseenter="mouseOver(item, index)"
                  @mouseleave="mouseLeave(item)"
                  :style="{
                    background: item.isComplete
                      ? item.color
                        ? item.color
                        : '#00a0e9'
                      : item.color
                      ? item.color
                      : '#D8DBE7'
                  }"
                >
                  <img
                    src="@/assets/imgs/done.png"
                    class="text-white circle-check-mark"
                    v-if="item.isComplete"
                  />
                  <!-- <Icon
                    icon="carbon:checkmark"
                    class="text-white circle-check-mark"
                    v-if="item.isComplete"
                /> -->
                </span>
                <div
                  class="circle-p"
                  v-if="item.isNow"
                  @mouseenter="mouseOver(item, index)"
                  @mouseleave="mouseLeave(item)"
                >
                  <img src="@/assets/imgs/progress.png" class="circle-p" />
                  <!-- <span class="circle-sub"></span> -->
                </div>

                <template #content>
                  <div class="content" v-if="item.subInfo.length">
                    <div
                      class="content-info"
                      v-for="(subItem, subIndex) in item.subInfo"
                      :key="subIndex + 111111"
                    >
                      <div class="left">{{ subItem.title }}</div>
                      <div class="right">
                        <p v-for="(it, i) in subItem.info" :key="i + 1000001" class="word-break">
                          <span>{{ it.title }}</span>
                          {{ it.content }}
                        </p>
                      </div>
                    </div></div
                  >
                  <template v-else>
                    <div class="content-info">
                      <p class="no-data">暂无数据</p>
                    </div>
                  </template>
                </template>
              </ElTooltip>
            </div>
          </div>
        </template>
      </div>
      <div class="step-wrap-bottom">
        <template v-for="(item, index) in stepsItems" :key="index">
          <div class="step-info" :style="{ width: '19.9%' }" v-if="index > 6">
            <div class="line" :style="{ background: item.isComplete ? '#00a0e9' : '#D8DBE7' }">
              <span class="sub-step" v-if="item.sub"></span>

              <span class="name" :style="{ color: item.isComplete ? '#222222' : '#777777' }">
                <b>{{ item.name }}</b>
              </span>
              <span class="space-bottom-class"></span>
              <ElTooltip effect="light">
                <span
                  class="circle relative"
                  v-if="!item.isNow"
                  @mouseenter="mouseOver(item, index)"
                  @mouseleave="mouseLeave(item)"
                  :style="{
                    background: item.isComplete
                      ? item.color
                        ? item.color
                        : '#00a0e9'
                      : item.color
                      ? item.color
                      : '#D8DBE7'
                  }"
                >
                  <img
                    src="@/assets/imgs/done.png"
                    class="text-white circle-check-mark"
                    v-if="item.isComplete"
                  />
                  <!-- <Icon
                    icon="carbon:checkmark"
                    class="text-white circle-check-mark"
                    v-if="item.isComplete"
                /> -->
                </span>
                <div
                  class="circle-p"
                  v-if="item.isNow"
                  @mouseenter="mouseOver(item, index)"
                  @mouseleave="mouseLeave(item)"
                >
                  <img src="@/assets/imgs/progress.png" class="circle-p" />
                  <!-- <span class="circle-sub"></span> -->
                </div>

                <template #content>
                  <div class="content" v-if="item.subInfo.length">
                    <div
                      class="content-info"
                      v-for="(subItem, subIndex) in item.subInfo"
                      :key="subIndex + 111111"
                    >
                      <div class="left">{{ subItem.title }}</div>
                      <div class="right">
                        <p v-for="(it, i) in subItem.info" :key="i + 1000001" class="word-break">
                          <span>{{ it.title }}</span>
                          {{ it.content }}
                        </p>
                      </div>
                    </div></div
                  >
                  <template v-else>
                    <div class="content-info">
                      <p class="no-data">暂无数据</p>
                    </div>
                  </template>
                </template>
              </ElTooltip>
            </div>
          </div>
        </template>
      </div>
    </div>
  </section>
</template>

<style lang="less" scoped>
.no-data {
  text-align: center;
  padding: 10px 10px;
  width: 100%;
}
.circle-check-mark {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
}
.content {
  background: #ffffff;
  padding: 10px 20px;
  border-radius: 4px;
  // border: 1px solid #00a0e9;
  // box-shadow: 0 2px 4px 0 rgb(0 0 0 / 12%), 0 0 6px 0 rgb(0 0 0 / 4%);
  max-height: 400px;
  overflow: hidden;
  overflow-y: auto;
  z-index: 9999;
  &::before {
  }
  .content-info {
    border-bottom: 1px dashed rgba(217, 221, 231, 0.8);
    width: 250px;
    display: flex;
    margin: 10px 0;
    padding-bottom: 10px;
    .left {
      min-width: 50px;
      font-weight: bold;
    }
    .right {
      text-align: left;
      p {
        padding: 2px 0;
        span {
          display: inline-block;
          min-width: 65px;
        }
      }
    }
    &:last-child {
      border-bottom: none;
      padding-bottom: 0;
    }
  }
}
.content-info {
  border-bottom: 1px dashed rgba(217, 221, 231, 0.8);
  width: 250px;
  display: flex;
  max-height: 400px;
  overflow: hidden;
  overflow-y: auto;
  margin: 10px 0;
  padding-bottom: 10px;
  .left {
    min-width: 50px;
    font-weight: bold;
  }
  .right {
    text-align: left;
    p {
      padding: 2px 0;
      span {
        display: inline-block;
        min-width: 65px;
      }
    }
  }
  &:last-child {
    border-bottom: none;
    padding-bottom: 0;
  }
}
.step-wrapper {
  position: relative;
  // width: 75%;
  margin: 0 3% 0 1%;
  margin-top: 23px;
  text-align: right;
  .step-wrap {
    display: flex;
    align-items: center;
    .sub-step {
      display: inline-block;
      height: 100%;
      width: 50%;
      // background: #00a0e9;
      position: absolute;
      top: 0px;
      left: 0;
    }
    .step-info {
      width: 30%;
      .line {
        height: 2px;
        width: 100%;
        background: #e9edf2;
        position: relative;
        background: firebrick;
      }

      .name {
        position: absolute;
        top: 50%;
        transform: translateY(-50%);
        display: block;
        min-width: 200px;
        text-align: left;
        z-index: 999;
        right: -202px;
        font-weight: 300;

        color: #222222;
        b {
          padding: 0 4px;
          display: inline-block;
          background: #eff1f4;
        }
      }
      .circle {
        display: inline-block;
        background: #999999;
        height: 22px;
        width: 22px;
        border-radius: 50%;
        position: absolute;
        right: -2px;
        top: 50%;
        transform: translateY(-50%);
        z-index: 999;
        cursor: pointer;
        &:hover {
          background: #00a0e9;
        }
      }
      .circle-p {
        position: absolute;

        background: #ffffff;
        // border: 2px solid #00a0e9;
        display: inline-block;
        height: 24px;
        width: 24px;
        border-radius: 50%;
        right: -4px;
        top: 50%;
        transform: translateY(-50%);
        cursor: pointer;
        text-align: center;
        line-height: 20px;
        z-index: 999;
        .circle-sub {
          display: inline-block;
          background: #00a0e9;
          height: 12px;
          width: 12px;
          border-radius: 50%;
          position: relative;
          left: 50%;
          top: 50%;
          transform: translate(-80%, -80%);
        }
      }
      .content {
        position: absolute;
        top: 36px;
        right: -140px;
        background: #ffffff;
        padding: 10px 20px;
        border-radius: 4px;
        border: 1px solid #00a0e9;
        box-shadow: 0 2px 4px 0 rgb(0 0 0 / 12%), 0 0 6px 0 rgb(0 0 0 / 4%);
        max-height: 400px;
        overflow: hidden;
        overflow-y: auto;
        z-index: 9999;
        &::before {
        }
        .content-info {
          border-bottom: 1px dashed rgba(217, 221, 231, 0.8);
          width: 250px;
          display: flex;
          margin: 10px 0;
          padding-bottom: 10px;
          .left {
            min-width: 50px;
            font-weight: bold;
          }
          .right {
            text-align: left;
            p {
              padding: 2px 0;
              span {
                display: inline-block;
                min-width: 65px;
              }
            }
          }
          &:last-child {
            border-bottom: none;
            padding-bottom: 0;
          }
        }
      }
      .triangle {
        position: absolute;
        top: 16px;
        right: -4px;
        width: 0;
        height: 0;
        z-index: 10;
        border-right: 14px solid transparent;
        border-left: 14px solid transparent;
        border-bottom: 20px solid #00a0e9;
      }
      .triangle2 {
        position: absolute;
        top: 19px;
        right: -4px;
        width: 0;
        height: 0;
        z-index: 10;
        border-right: 10px solid transparent;
        border-left: 10px solid transparent;
        border-bottom: 20px solid #ffffff;
      }
    }
  }
  // 右侧进度
  .step-wrap-right {
    // width: 30px;
    // position: absolute;
    // right: -5px;
    display: inline-block;
    margin-right: 8px;
    .step-info {
      margin: 0 auto;
      height: 100%;
      height: 8vw;
      .line {
        height: 100%;
        width: 2px;
        background: #999999;
        margin: 0 auto;
        position: relative;
        .sub-step {
          display: inline-block;
          height: 50%;
          width: 100%;
          // background: #00a0e9;
          position: absolute;
          top: 0px;
        }
        .name {
          position: absolute;
          bottom: -8px;
          left: 18px;
          min-width: 100px;
          font-weight: 300;
          color: #222222;
          z-index: 999;
          display: inline-block;
          text-align: left;
          b {
            padding: 0 4px;
            display: inline-block;
            background: #eff1f4;
          }
          // display: none;
        }
        .circle {
          display: inline-block;
          background: #999999;
          height: 22px;
          width: 22px;
          border-radius: 50%;
          position: absolute;
          right: 50%;
          transform: translateX(50%);
          bottom: -10px;
          z-index: 999;
          cursor: pointer;
          &:hover {
            background: #00a0e9;
          }
        }
        .circle-p {
          position: absolute;
          background: #ffffff;
          // border: 2px solid #00a0e9;
          display: inline-block;
          height: 22px;
          width: 22px;
          border-radius: 50%;
          right: 50%;
          transform: translateX(50%);
          bottom: -10px;
          cursor: pointer;
          text-align: center;
          z-index: 999;
          .circle-sub {
            display: inline-block;
            background: #00a0e9;
            height: 12px;
            width: 12px;
            border-radius: 50%;
            // margin-top: 2px;
          }
        }
        .content {
          position: absolute;
          top: 6px;
          right: 27px;
          background: #ffffff;
          padding: 10px 20px;
          border-radius: 4px;
          border: 1px solid #00a0e9;
          box-shadow: 0 2px 4px 0 rgb(0 0 0 / 12%), 0 0 6px 0 rgb(0 0 0 / 4%);
          max-height: 400px;
          overflow: hidden;
          overflow-y: auto;
          z-index: 9999;
          &::before {
          }
          .content-info {
            border-bottom: 1px dashed rgba(217, 221, 231, 0.8);
            width: 250px;
            display: flex;
            margin: 10px 0;
            padding-bottom: 10px;
            .left {
              min-width: 50px;
              font-weight: bold;
            }
            .right {
              text-align: left;
              p {
                padding: 2px 0;
                span {
                  display: inline-block;
                  min-width: 65px;
                }
              }
            }
            &:last-child {
              border-bottom: none;
              padding-bottom: 0;
            }
          }
        }
        .triangle {
          position: absolute;
          bottom: -5px;
          right: 18px;
          width: 0;
          height: 0;
          z-index: 10;
          border-top: 14px solid transparent;
          border-bottom: 14px solid transparent;
          border-left: 20px solid #00a0e9;
        }
        .triangle2 {
          position: absolute;
          bottom: -5px;
          right: 20px;
          width: 0;
          height: 0;
          z-index: 10;
          border-top: 10px solid transparent;
          border-bottom: 10px solid transparent;
          border-left: 19px solid #ffffff;
        }
      }
    }
  }
  .step-wrap-bottom {
    position: absolute;
    // top: 400px;
    bottom: 5px;
    right: 0;
    width: 100%;
    flex-direction: row-reverse;
    justify-content: flex-end;
    .sub-step {
      display: inline-block;
      height: 100%;
      width: 50%;
      // background: #00a0e9;
      position: absolute;
      top: 0px;
      right: 0;
    }
    .step-info {
      width: 16.6%;
      float: right;
      .line {
        height: 2px;
        width: 100%;
        background: #999999;
        position: relative;
      }
      .name {
        position: absolute;
        top: 50%;
        transform: translateY(-50%);
        display: block;
        min-width: 200px;
        text-align: left;
        font-weight: 300;
        color: #222222;
        left: 10px;
        b {
          padding: 0 4px;
          display: inline-block;
          background: #eff1f4;
        }
      }
      .circle {
        display: inline-block;
        background: #d8dbe7;
        height: 22px;
        width: 22px;
        border-radius: 50%;
        position: absolute;
        left: -12px;
        top: 50%;
        transform: translateY(-50%);
        z-index: 999;
        cursor: pointer;
        &:hover {
          background: #00a0e9;
        }
      }
      .circle-p {
        position: absolute;
        display: flex;
        background: #ffffff;
        // border: 2px solid #00a0e9;
        display: inline-block;
        height: 20px;
        width: 20px;
        border-radius: 50%;
        left: -14px;
        top: 50%;
        transform: translateY(-50%);
        cursor: pointer;
        text-align: center;
        z-index: 999;
        .circle-sub {
          display: inline-block;
          background: #00a0e9;
          height: 12px;
          width: 12px;
          border-radius: 50%;
          // margin-top: 2px;
        }
      }
      .content {
        position: absolute;
        top: 36px;
        left: -110px;
        background: #ffffff;
        padding: 10px 20px;
        border-radius: 4px;
        border: 1px solid #00a0e9;
        box-shadow: 0 2px 4px 0 rgb(0 0 0 / 12%), 0 0 6px 0 rgb(0 0 0 / 4%);
        max-height: 400px;
        overflow: hidden;
        overflow-y: auto;
        z-index: 9999;
        &::before {
        }
        .content-info {
          border-bottom: 1px dashed rgba(217, 221, 231, 0.8);
          width: 250px;
          display: flex;
          margin: 10px 0;
          padding-bottom: 10px;
          .left {
            min-width: 50px;
            font-weight: bold;
          }
          .right {
            text-align: left;
            p {
              padding: 2px 0;
              span {
                display: inline-block;
                min-width: 65px;
              }
            }
          }
          &:last-child {
            border-bottom: none;
            padding-bottom: 0;
          }
        }
      }
      .triangle {
        position: absolute;
        top: 16px;
        left: -19px;
        width: 0;
        height: 0;
        z-index: 10;
        border-right: 14px solid transparent;
        border-left: 14px solid transparent;
        border-bottom: 20px solid #00a0e9;
      }
      .triangle2 {
        position: absolute;
        top: 19px;
        left: -19px;
        width: 0;
        height: 0;
        z-index: 10;
        border-right: 10px solid transparent;
        border-left: 10px solid transparent;
        border-bottom: 20px solid #ffffff;
      }
    }
  }
}
.process-bar-top li {
}
.process-bar-bottom li {
}
.space-left-class {
  display: inline-block;
  background: #eff1f4;
  height: 18px;
  width: 18px;
  position: absolute;
  right: 6px;
  top: 50%;
  transform: translateY(-50%);
  z-index: 999;
}
.space-right-class {
  display: inline-block;
  background: #eff1f4;
  height: 18px;
  width: 18px;
  position: absolute;
  right: 50%;
  transform: translateX(50%);
  bottom: -3px;
  z-index: 999;
}
.space-bottom-class {
  display: inline-block;
  background: #eff1f4;
  height: 18px;
  width: 18px;
  position: absolute;
  z-index: 999;
  left: -15px;
  top: 50%;
  transform: translateY(-50%);
}
.space-bottom-left-class {
  display: inline-block;
  background: #eff1f4;
  height: 18px;
  width: 15px;
  position: absolute;
  z-index: 999;
  right: 50%;
  bottom: -8px;
}
</style>
