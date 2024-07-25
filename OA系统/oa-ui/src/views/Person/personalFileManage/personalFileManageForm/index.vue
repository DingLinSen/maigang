<script setup lang="ts">
import { ref, getCurrentInstance, provide } from 'vue'
import { propTypes } from '@/utils/propTypes'
import { DrawerWrap } from '@/components/DrawerWrap'
import Form from './components/Form.vue'

const props = defineProps({
  title: propTypes.string.def('')
})
const isShow = ref<boolean>(false)
const pageTite = ref<string>('')
const drawerWrap = ref<ComponentRef<typeof DrawerWrap>>()

const drawerForm = ref<any>()
const detailsId = ref<string>('')

const status_type = ref()
const status_id = ref()
const reminder_id = ref()
const status_timer = ref()

//打开drawer并初始化
const openDrawer = (flag: string, id: string, reminderId: string) => {
  //重置表单
  detailsId.value = ''
  pageTite.value =
    props.title +
    '-' +
    (flag === 'examine'
      ? '审核'
      : flag === 'edit'
      ? '编辑'
      : flag === 'contract'
      ? '到期提醒修改'
      : '详情')
  drawerWrap.value.isShow = true
  let date = new Date()
  status_timer.value = date.getTime()
  status_type.value = flag
  status_id.value = id
  reminder_id.value = reminderId
}

//关闭drawer
const closeDrawer = () => {
  drawerWrap.value.isShow = false
}
provide('closeDrawer', closeDrawer)

defineExpose({
  isShow,
  openDrawer
})
</script>

<template>
  <DrawerWrap :title="pageTite" :isShow="isShow" ref="drawerWrap" class="personal-manage-drawer">
    <template #content>
      <Form
        ref="drawerForm"
        :type="status_type"
        :id="status_id"
        :reminderId="reminder_id"
        :timer="status_timer"
      />
    </template>
  </DrawerWrap>
</template>

<style lang="less" scoped>
:deep(.el-input-group__append) {
  background-color: white;
  width: 35px;
}
</style>

<style lang="less">
.personal-manage-drawer {
  .el-drawer__body {
    background: #f9f9f9 !important;
    padding-bottom: 0px !important;
  }

  .el-card {
    border: 0px solid #f9f9f9 !important;
    .el-card__body {
      background: #f9f9f9 !important;
      padding: 0px !important;
    }
  }
  /* position: absolute; */
}
</style>
