<template >
  <container class="full-container" :style="{ height: controlHight + 'px' }">
    <div slot="content" id="info-wrap">
      <div class="infoSelect">
        <div class="time">
          <DatePicker
            v-model="year"
            type="year"
            style="width: 100%"
            :clearable="false"
            placeholder="请选择时间"
            :options="startTimelimit"
            @on-change="yearChange"
          >
          </DatePicker>
        </div>
        <div class="departmentName">
          <Cascader
            v-model="deptIds"
            :data="deptList"
            placeholder="请选择任务单位"
            @on-change="selDept"
            style="width: 100%"
            :clearable="false"
            change-on-select
          ></Cascader>
        </div>
      </div>
      <div class="top">
        <div class="top-left">
          <div class="number">
            <div class="number-title">
              <p>年度培训计划进度</p>
            </div>
            <div class="number-body">
              <div class="people-number">
                <div class="photo"></div>
                <div class="photo-right">
                  <li class="right-number">
                    <span class="left">{{ this.numberLeft }}</span
                    ><span
                      style="
                        margin-right: 3px;
                        margin-left: 3px;
                        color: rgba(153, 153, 153, 1);
                      "
                      >/</span
                    ><span class="right">{{ this.numberRight }}</span>
                  </li>
                  <p>培训总人数</p>
                </div>
              </div>
              <div class="study-time">
                <div class="study-photo"></div>
                <div class="photo-right">
                  <li class="right-number">
                    <span class="left">{{ this.timeLeft }}</span
                    ><span
                      style="
                        margin-right: 3px;
                        margin-left: 3px;
                        color: rgba(153, 153, 153, 1);
                      "
                      >/</span
                    ><span class="right">{{ this.timeRight }}</span>
                  </li>
                  <p>学习时长</p>
                </div>
              </div>
              <div class="qualified">
                <div class="qualified-photo"></div>
                <div class="qualified-right">
                  <span>{{ this.qualifiedPercent }}</span
                  ><span>%</span>
                  <p>合格率</p>
                </div>
              </div>
            </div>
          </div>
          <div style="display: flex">
            <div class="radarChart" id="radarChart">
              <div class="title" id="title">
                <p>年度培训计划进度</p>
              </div>
              <div class="info-radarChart" id="radar">
                <radar
                  :subcontentH="(subcontentH - titleH * 3 - 60) * 0.18"
                  :echartsData="echartsDataOne"
                ></radar>
              </div>
            </div>
            <div class="pieChart">
              <div class="title" id="title" style="display: flex;align-items: center;justify-content: space-between;">
                <p>课目学习时长分析</p>
                <Select v-model="tableValue" multiple style="width:200px" @on-change="changeTag" :max-tag-count="1">
                  <Option v-for="(item, index) in optionList" :value="item.id" :key="index">{{ item.name }}</Option>
                </Select>
              </div>
              <div class="info-pieChart" id="ring">
                <ring
                  :subcontentH="(subcontentH - titleH * 3 - 15) * 0.15"
                  :echartsData="echartsDataTwo"
                ></ring>
              </div>
            </div>
          </div>
        </div>
        <div class="top-right">
          <div class="assessmentRanking">
            <div class="title">
              <p>考核排名</p>
            </div>
            <div class="info-assessmentRanking">
              <barOne
                :subcontentH="(subcontentH - titleH * 3 - 40) * 0.29"
                :echartsData="echartsDataThree"
              ></barOne>
            </div>
          </div>
        </div>
      </div>
      <div class="center">
        <div class="title">
          <p>课目学习质量分析</p>
        </div>
        <div class="info-center">
          <barTwo
            :subcontentH="(subcontentH - titleH * 3 - 40) * 0.19"
            :echartsData="echartsDataFour"
          ></barTwo>
        </div>
      </div>
      <div class="bottom">
        <Tables
          ref="tables"
          v-if="tableColumnPugins != null"
          :height="tableHeight"
          v-model="listData"
          :loading="loading"
          :border="true"
          :treeTable="true"
          :columnControl="true"
          :columns="tableColumnPugins"
        >
          <page-wrapper
            slot="footer"
            :total="totolCount"
            :pageSize="searchParams.limit"
            :pageNo="searchParams.current"
            @page-change="pageChange"
            @page-size-change="pageSizeChange"
          ></page-wrapper>
        </Tables>
      </div>
    </div>
  </container>
</template>
<script>
import radar from './components/radar'
import ring from './components/ring'
import barOne from './components/barOne.vue'
import barTwo from './components/barTwo.vue'
import Container from '../../../../components/container.vue'
import { getBelowDept } from '@/api/tasks/api-modules-tasktrain'
import {
  initAnalysis,
  initAnalysisBylist,
  getLearnTime
} from '@/api/analysis/api-modules-analysis'
import { treeDataTranslate } from '@/utils'
import { OPERATE_LIST } from '@/libs/mixin'
import ColumnPugins from './index-column'
export default {
  mixins: [OPERATE_LIST],
  components: {
    radar,
    ring,
    barOne,
    barTwo,
    Container
  },
  data() {
    return {
      subcontentH: 0,
      controlHight: 0,
      titleH: 0,
      echartsDataOne: [],
      echartsDataTwo: [],
      echartsDataThree: { xData: [], yData: [] },
      echartsDataFour: { xData: [], yData: [], timeData: [] },
      startTimelimit: null, // 计划期限
      dept: [],
      deptList: [],
      year: null,
      deptIds: [],
      deptId: null,
      numberLeft: '',
      numberRight: '',
      timeLeft: '',
      timeRight: '',
      qualifiedPercent: '',
      subjectLearnAnaly: null,
      listData: [],
      searchParams: {
        // 查询参数
        limit: 10, // 每页数量
        current: 1 // 当前页数
      },
      tableHeight: 600,
      tableValue: [],
      optionList: []
    }
  },
  watch: {
    contentH: function () {
      this.$nextTick(() => {
        this.titleH = document.getElementById('title').clientHeight
        this.subcontentH = document.getElementById('info-wrap').clientHeight
      })
    }
  },
  mounted() {
    this.year = new Date()
    this.deptIds = []
    this.$nextTick(() => {
      this.titleH = document.getElementById('title').clientHeight
      this.subcontentH = document.getElementById('info-wrap').clientHeight
    })
    this.$nextTick(() => {
      window.addEventListener('resize', () => {
        // 监听浏览器窗口大小改变
        this.resetClientHeight()
        this.titleH = document.getElementById('title').clientHeight
        this.subcontentH =
          document.getElementById('info-wrap').clientHeight - this.titleH
      })
    })
    this.tableColumnPugins = ColumnPugins(this)
    this.resetClientHeight()
    this.getBelowDept()
  },
  methods: {
    resetClientHeight() {
      this.documentClientHeight = document.documentElement['clientHeight']
      this.controlHight = this.documentClientHeight - 145
    },
    // 获取所有部门
    getBelowDept() {
      getBelowDept()
        .then(res => {
          if (res.data.status) {
            var data = res.data.data
            let deptList = []
            data.forEach(item => {
              deptList.push({
                ...item,
                value: item.deptId,
                label: item.deptName
              })
            })
            this.deptList = treeDataTranslate(deptList, 'deptId')
            this.deptId = this.deptList[0].deptId
            this.deptIds = [this.deptList[0].deptId]
            this.initListData()
            this.tableData()
          } else {
          }
        })
        .catch(() => {
          this.loading = false
        })
    },
    // 初始化数据表格
    initListData() {
      let params = {
        deptId: this.deptId,
        year: this.$moment(this.year).format('YYYY')
      }
      initAnalysis(params)
        .then(res => {
          this.publishModel = false
          if (res.data.status) {
            var data = res.data.data
            this.tableValue = []
            if (data !== null) {
              this.optionList = data.subjectLearnAnalyOptions
              if(this.optionList.length <= 5) {
                this.optionList.forEach(element => {
                  this.tableValue.push(element.id)
                })
                // this.getLearnTime()
              }else{
                for (let i = 0; i < 5; i++) {
                  this.tableValue.push(this.optionList[i].id)
                }
                // this.getLearnTime()
              }
              // 年度培训计划进度
              if (data.trainProgressMap.totalPeople) {
                var numberPeople = data.trainProgressMap.totalPeople
                var peoples = numberPeople.split('/')
                this.numberLeft = peoples[0]
                this.numberRight = peoples[1]
              } else {
                this.numberLeft = 0
                this.numberRight = 0
              }
              if (data.trainProgressMap.learnTime) {
                var studyTime = data.trainProgressMap.learnTime
                var studyTimes = studyTime.split('/')
                this.timeLeft = Math.round(((studyTimes[0] / 3600) * 10) / 10)
                this.timeRight = Math.round(((studyTimes[1] / 3600) * 10) / 10)
              } else {
                this.timeLeft = 0
                this.timeRight = 0
              }
              if (data.trainProgressMap.qualifiedPercent !== null) {
                this.qualifiedPercent = data.trainProgressMap.qualifiedPercent
              } else {
                this.qualifiedPercent = '0'
              }
              // 年度培训计划进度 雷达图
              if (data.trainProgressFlagMap) {
                var radarData = data.trainProgressFlagMap
                if (radarData) {
                  var radarData0 = []
                  var radarData1 = []
                  var learnTime = (
                    Math.round((radarData.lllearnTime / 3600) * 10) /
                    10
                  )
                  radarData0.push(radarData.lllearnTime ? learnTime : 0)
                  radarData0.push(radarData.llPeople ? radarData.llPeople : 0)
                  radarData0.push(radarData.llQuality ? radarData.llQuality : 0)
                  radarData0.push(0)
                  radarData1.push(0)
                  radarData1.push(radarData.sjPeople ? radarData.sjPeople : 0)
                  radarData1.push(radarData.sjQuality ? radarData.sjQuality : 0)
                  radarData1.push(radarData.sjCount ? radarData.sjCount : 0)
                  this.echartsDataOne = []
                  this.echartsDataOne.push(radarData0)
                  this.echartsDataOne.push(radarData1)
                } else {
                  this.echartsDataOne = []
                }
              }
              // 考核排名
              if (data.examineSortList && data.examineSortList.length > 0) {
                data.examineSortList.sort(function (a, b) {
                  return a.avgPoint - b.avgPoint
                })
                var grader = []
                var yData = []
                data.examineSortList.forEach(item => {
                  grader.push(item.avgPoint)
                  yData.push(item.userName)
                })
                this.echartsDataThree = null
                var echartsData = {
                  xData: grader.slice(0, 10),
                  yData: yData.slice(0, 10)
                }
                this.echartsDataThree = echartsData
              } else {
                this.echartsDataThree = null
              }
              // 课目学习质量分析
              if (
                data.subjectLearnQualityList &&
                data.subjectLearnQualityList.length > 0
              ) {
                var subjectLearnQualityList = data.subjectLearnQualityList
                var subjectGrade = []
                var subjectName = []
                var trainTime = []
                subjectLearnQualityList.forEach(item => {
                  subjectGrade.push(item.point)
                  subjectName.push(item.subjectName)
                  trainTime.push(item.totalRealTime / 3600)
                })
                this.echartsDataFour = {
                  xData: subjectName,
                  yData: subjectGrade,
                  timeData: trainTime
                }
              } else {
                this.echartsDataFour = { xData: [], yData: [], timeData: [] }
              }
            } else {
              this.numberLeft = 0
              this.numberRight = 0
              this.timeLeft = 0
              this.timeRight = 0
              this.qualifiedPercent = '0'
              this.echartsDataOne = []
              this.echartsDataTwo = []
              this.echartsDataThree = null
              this.echartsDataFour = { xData: [], yData: [], timeData: [] }
            }
          }
        })
        .catch(() => {})
    },
    tableData() {
      this.loading = true
      let params = {
        deptId: this.deptId,
        year: this.$moment(this.year).format('YYYY')
      }
      initAnalysisBylist(params)
        .then(res => {
          if (res.data.status) {
            this.listData = []
            if(res.data.page !== null) {
              this.totolCount = res.data.page.totalCount
              var data = res.data.page.list
              data.forEach(item => {
                var subjectArray = []
                var totalRealTime = 0
                var point = 0
                var index = 0
                var learnTime = 0
                var totalTime = 0
                if (item.detail && item.detail.length > 0) {
                  item.id = item.userId
                  item.detail.forEach(item1 => {
                    item1.parentId = item.userId
                    item1.level = 2
                    let time = item1.totalRealTime
                      ? (item1.totalRealTime / 3600).toFixed(1)
                      : 0
                    item1.totalRealTime = time
                    totalRealTime = time
                      ? (Number(totalRealTime) + Number(time)).toFixed(1)
                      : totalRealTime
                    subjectArray.push(item1.subjectName)
                    if (item1.point) {
                      index = index + 1
                      point = point + item1.point
                    }
                    var rankArray = item1.yearLearnPercent ? item1.yearLearnPercent.split('/') : []
                    if (rankArray.length > 0) {
                      var rank = rankArray[0] ? Math.round((parseFloat(rankArray[0]) / 3600) * 10) / 10 : 0.0
                      var rank2 = rankArray[1] ? Math.round((parseFloat(rankArray[1]) / 3600) * 10) / 10 : 0.0
                      learnTime = rank ? learnTime + rank : 0
                      totalTime = rank2 ? totalTime + rank2 : 0
                      item1.yearLearnPercent = (rank.toFixed(1) || '0.0') + '/' + (rank2.toFixed(1) || '0.0')
                    }
                  })
                }
                item.children = item.detail ? item.detail : []
                item.point = index === 0 ? 0 : String(Math.round((point / index) * 10) / 10)
                item.totalRealTime =
                  totalRealTime

                item.yearLearnPercent = (learnTime.toFixed(1) || '0.0') + '/' + (totalTime.toFixed(1) || '0.0')
                item.subjectName = subjectArray.join('；')
                item.level = 1
              })
              this.listData = data
              this.$nextTick(() => {
                this.loading = false
              })
            } else {
              this.loading = false
              this.listData = []
            }
          }else{
            this.loading = false
            this.listData = []
          }
        })
        .catch(() => {
          this.loading = false
        })
    },
    // 选择部门
    selDept(value) {
      if (value && value.length > 0) {
        this.deptId = value[value.length - 1]
      } else if (value.length === 0) {
        this.deptId = ''
      } else {
        this.deptId = ''
      }
      this.initListData()
      this.tableData()
    },
    yearChange(value) {
      this.initListData()
      this.tableData()
      // 数组排序
    },
    changeTag(value) {
      if (this.tableValue.length > 5) {
        this.$Message.warning('最多选择5条')
        this.tableValue.pop() // selectValue是select选择器绑定的值，不是选择器change的参数value
      }else{
        this.getLearnTime()
      }
    },
    getLearnTime() {
      var ids = ''
      this.tableValue.forEach(item => {
        ids += item + ','
      })
      let params = {
        deptId: this.deptId,
        year: this.$moment(this.year).format('YYYY'),
        nameList: ids
      }
      getLearnTime(params)
        .then(res => {
          if (res.data.status) {
            let data = res.data.data
            // 课目学习时长分析
            if (data.subjectLearnAnaly) {
              this.echartsDataTwo = []
              this.subjectLearnAnaly = data.subjectLearnAnaly
              this.subjectLearnAnaly = JSON.parse(
                JSON.stringify(data.subjectLearnAnaly)
              )
              Object.keys(this.subjectLearnAnaly).map(item => {
                this.echartsDataTwo.push({
                  name: item,
                  value: this.subjectLearnAnaly[item]
                })
                return true
              })
            } else {
              this.echartsDataTwo = []
            }
          }
        })
        .catch(() => {
          this.loading = false
        })
    }
  }
}
</script>
<style lang="less" scoped>
@import './index.less';
/deep/.ivu-table-body {
  overflow-y: auto !important;
  overflow-x: hidden !important;
}
/deep/.ivu-select-item{
  padding-right: 40px !important;
}
</style>
