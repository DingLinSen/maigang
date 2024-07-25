<template>
  <div :isShowtitle="false" class="statisticsList ml-[15px] w-[57.23vw]">
    <div class="header h-[51px] leading-[51px] pl-[20px] flex justify-between statistics-header">
      <div class="title">统计</div>
      <div class="flex">
        <div>
          <el-date-picker
            v-model="year"
            class="w-[10.21vw]"
            format="YYYY"
            placeholder="请选择年份"
            type="year"
            value-format="YYYY"
            @change="handleDate"
          />
        </div>
        <div>
          <el-select v-model="studyStatus" class="m-2">
            <el-option
              v-for="item in learningType"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </div>
        <div class="pr-[20px]">
          <ElButton :loading="exLoading" class="btn-other exportBtn" plain @click="exportForm()">
            <template #icon>
              <Icon :size="14" icon="svg-icon:exportBut" />
            </template>
            导出
          </ElButton>
        </div>
      </div>
    </div>
    <div class="px-[1.09vw] pt-[17px] overflow-hidden">
      <!--      任务学习    -->
      <TaskLearningTable v-if="studyStatus == 0" :flag="studyStatus" :year="year" />
      <!--      自主学习    -->
      <AutonomousLearningTable v-else-if="studyStatus == 1" :flag="studyStatus" :year="year" />
      <!--      自主培训    -->
      <IndependentTrainingTable v-else-if="studyStatus == 2" :flag="studyStatus" :year="year" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, ref } from 'vue'
import TaskLearningTable from '../Table/taskLearningTable.vue'
import AutonomousLearningTable from '../Table/autonomousLearningTable.vue'
import IndependentTrainingTable from '../Table/independentTrainingTable.vue'
import { ElMessage } from 'element-plus'
import { exportTinfoGoodsListApi } from '@/api/AdministrativeService/inventoryManagement'
import { exportCourseStat } from '@/api/school/statistics'
import moment from 'moment'

const year = ref(moment(new Date()).format('YYYY'))
const studyStatus = ref(0) // 学习类型的值
// 学习类型
const learningType = ref([
  {
    label: '任务学习',
    value: 0
  },
  {
    label: '自主学习',
    value: 1
  },
  {
    label: '自主培训',
    value: 2
  }
])

//导出
const exLoading = ref(false)
const exportForm = async () => {
  // if (tableObject.tableList.length === 0) {
  //   ElMessage.warning('查询无数据, 无需导出数据')
  //   return
  // }
  exLoading.value = true
  await exportCourseStat({
    year: year.value ? year.value : '',
    flag: studyStatus.value ? studyStatus.value : '0'
  })
  exLoading.value = false
}
</script>

<style lang="less" scoped>
.statisticsList {
  flex: 1;
  box-shadow: 0px 3px 4px 0px rgba(31, 31, 31, 0.2);
  background-color: #ffffff;
  border-radius: 2px;
}

.header {
  width: 100%;
  border-bottom: 1px solid #eef0f2;
}

.uncompleted {
  color: #00a0e9;
}

.completed {
  color: #999999;
}

.ywzt_icon {
  vertical-align: bottom;
}
</style>
