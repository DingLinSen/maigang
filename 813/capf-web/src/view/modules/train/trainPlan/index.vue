<template>
  <el-tabs v-model="activeName" @tab-click="handleClick">
    <el-tab-pane label="年计划" name="yearPlan">
      <yearPlan v-if="isYearPlan"></yearPlan>
    </el-tab-pane>
    <el-tab-pane label="月计划" name="monthPlan">
      <monthPlan v-if="isMonthPlan"></monthPlan>
    </el-tab-pane>
    <el-tab-pane label="周计划" name="weekPlan">
      <weekPlan v-if="isWeekPlan"></weekPlan>
    </el-tab-pane>
  </el-tabs>
</template>
<script>
import yearPlan from './planyear/index.vue'
import monthPlan from './planmonth/index.vue'
import weekPlan from './planweek/index.vue'
export default {
  components: {
    yearPlan,
    monthPlan,
    weekPlan
  },
  data() {
    return {
      activeName: 'yearPlan',
      isYearPlan: true,
      isMonthPlan: false,
      isWeekPlan: false
    }
  },
  methods: {
    handleClick(tab, event) {
      if (tab.name === 'yearPlan') {
        this.isYearPlan = true
        this.isMonthPlan = false
        this.isWeekPlan = false
      } else if (tab.name === 'monthPlan') {
        this.isYearPlan = false
        this.isMonthPlan = true
        this.isWeekPlan = false
      } else if (tab.name === 'weekPlan') {
        this.isYearPlan = false
        this.isMonthPlan = false
        this.isWeekPlan = true
      }
    }
  }
}
</script>
<style lang="less" scoped>
/deep/ .el-tabs__nav-scroll {
  background-color: #fff;
  padding-left: 10px;
}
/deep/ .el-tabs__header {
  border-top: 2px solid #fff;
}
</style>
