<template>
  <DrawerWrap ref="drawerWrap" :isShow="isShow" title="会议详情">
    <template #content>
      <div class=" bg-[#FFFFFF]">
        <div class="w-800px bg-[#FFFFFF] px-[20px]" style="margin: 0 auto">
          <div class="mb-30px border-b-1 py-20px">
            <p class="text-lg">{{ form.summary }}</p>
          </div>
          <div class="w-700px">
            <el-form :model="form" label-width="120px">
              <el-form-item label="开始时间:">
                <el-input v-model="form.name"/>
              </el-form-item>
              <el-form-item label="结束时间:">
                <el-input v-model="form.name"/>
              </el-form-item>
              <el-form-item label="会议室:">
                <el-input v-model="form.name"/>
              </el-form-item>
              <el-form-item label="组织部门:">
                <el-input v-model="form.name"/>
              </el-form-item>
              <el-form-item label="会议详情:">
                <el-input v-model="form.name"/>
              </el-form-item>
              <el-form-item label="参会人员:">
                <el-input v-model="form.name"/>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="onSubmit">编辑</el-button>
                <el-button type="danger">删除</el-button>
              </el-form-item>
            </el-form>
          </div>
        </div>
      </div>
    </template>
  </DrawerWrap>
</template>

<script lang="ts" setup>
import { DrawerWrap } from '@/components/DrawerWrapDetails'
import { ref, reactive } from 'vue'
import { getDetailMeetingApi } from '@/api/Conference/meetingAppointment/index'

const form = ref({
  name: '',
  region: '',
  date1: '',
  date2: '',
  delivery: false,
  type: [],
  resource: '',
  desc: ''
})
const isShow = ref<boolean>(false)
//打开drawer并初始化
const drawerWrap = ref()
const meetingID = ref()
const openDrawer = (id) => {
  meetingID.value = id
  drawerWrap.value.isShow = true
  getMeetingDetail()
}
//获取详情
const getMeetingDetail = async () => {
  await getDetailMeetingApi(meetingID.value).then(res => {
    form.value = res.data
    console.log(form.value)
  })
}
defineExpose({
  openDrawer
})
</script>

<style lang="less" scoped>
:deep(.el-card__body) {
  padding: 0px !important;
  background: #FFFFFF !important;
}
</style>