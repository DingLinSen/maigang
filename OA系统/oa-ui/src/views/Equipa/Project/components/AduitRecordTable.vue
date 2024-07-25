<!-- 审批记录 -->
<script setup lang="ts">
import { nextTick, ref, watch } from 'vue'
import { Dialog } from '@/components/Dialog'
import { filterType } from '@/utils/project'
import { getAuditListCultivateApi } from '@/api/project/cultivate'

const props = defineProps({
  pid: {
    type: String,
    default: ''
  },
  visible: {
    type: Boolean,
    default: false
  }
})
//弹窗
const auditTableDialog = ref()
const emit = defineEmits(['closed'])
const dialogVisible = ref<boolean>(false)
watch(
  () => props.visible,
  (data: boolean) => {
    if (data) {
      let layoutContentH = 0
      const layoutContent = document.querySelector('.v-layout-content-scrollbar')
      if (layoutContent) {
        layoutContentH = layoutContent.clientHeight
      }
      dialogHeight.value = layoutContentH * 0.7 + 'px'
      getAuditList()
    }
    dialogVisible.value = data
    setTimeout(() => {
      if (auditTableDialog.value) {
        auditTableDialog.value.isFullscreen = false
      }
    }, 200)
  },
  {
    immediate: true
  }
)

const tableData = ref<any>([])
const loading = ref<boolean>(false)
// 培育数据统计
const getAuditList = async () => {
  try {
    tableData.value = []
    dialogVisible.value = true
    loading.value = true
    let param = { pid: props.pid }
    const res = await getAuditListCultivateApi(param).finally(() => {
      loading.value = false
    })
    if (res && res.data) {
      tableData.value = res.data
    }
  } catch (error) {
    // console.log(error)
  }
}

// 弹窗关闭
const closeDialog = () => {
  emit('closed')
  loading.value = false
  document.getElementsByTagName('body')[0].className = ''
  document.getElementsByTagName('body')[0].style.width = '100%'
}

// 过滤内容或备注
const filterContent = (row: any) => {
  let content = ''
  if (row.content) {
    if (row.content === '1' || row.content === '2' || row.content === '2') {
      content = '--'
    } else {
      content = row.content
    }
  } else {
    content = '--'
  }
  return content || '--'
}

const dialogHeight = ref<string>('350px')
const toggleFull = async (isFull: boolean) => {
  await nextTick()
  let layoutContentH = 0
  const layoutContent = document.querySelector('.v-layout')
  if (layoutContent) {
    layoutContentH = layoutContent.clientHeight
  }
  if (isFull) {
    let topH = 0
    const topWrap = document.querySelector('.el-dialog__header')
    if (topWrap) {
      topH = topWrap.clientHeight
    }
    dialogHeight.value = `${layoutContentH - 65 - topH}px`
  } else {
    dialogHeight.value = layoutContentH * 0.7 + 'px'
  }
}
</script>

<template>
  <Dialog
    v-model="dialogVisible"
    ref="auditTableDialog"
    title="审批日志"
    :maxHeight="'auto'"
    @closed="closeDialog"
    width="900px"
    @toggleFull="toggleFull"
  >
    <div v-loading="loading">
      <ElTable :data="tableData" :border="true" style="width: 100%" :height="dialogHeight">
        <ElTableColumn prop="auditDate" label="日期" width="110">
          <template #default="scope">
            <span> {{ scope.row.auditDate || '--' }}</span>
          </template>
        </ElTableColumn>
        <ElTableColumn prop="createByName" label="操作人" width="85" />
        <ElTableColumn prop="type" label="操作类型" width="130">
          <template #default="scope">
            <span> {{ filterType(scope.row.flag, scope.row) || '--' }}</span>
          </template>
        </ElTableColumn>
        <ElTableColumn prop="flag" label="审批状态" show-overflow-tooltip width="85">
          <template #default="scope">
            <span>
              {{
                scope.row.type === '7' && scope.row.flag === '3'
                  ? '--'
                  : !scope.row.status || scope.row.status === '0'
                  ? '申请'
                  : scope.row.status === '1'
                  ? '同意'
                  : scope.row.status === '2'
                  ? '驳回'
                  : '--'
              }}</span
            >
          </template>
        </ElTableColumn>
        <ElTableColumn
          prop="content"
          label="内容"
          show-overflow-tooltip
          min-width="100"
          :tooltip-options="{
            enterable: true,
            placement: 'top',
            showArrow: false,
            hideAfter: 200,
            popperOptions: { strategy: 'fixed' }
          }"
          ><template #default="scope">
            <span> {{ filterContent(scope.row) }}</span>
          </template>
        </ElTableColumn>
        <ElTableColumn
          prop="reason"
          label="备注"
          min-width="150"
          show-overflow-tooltip
          :tooltip-options="{
            enterable: true,
            placement: 'top',
            showArrow: false,
            hideAfter: 200,
            popperOptions: { strategy: 'fixed' }
          }"
          ><template #default="scope">
            <span class="text-els">
              {{
                scope.row.reason
                  ? scope.row.reason
                  : scope.row.remark
                  ? scope.row.remark
                  : scope.row.changeMilestoneReason
                  ? scope.row.changeMilestoneReason
                  : '--'
              }}</span
            >
          </template>
        </ElTableColumn>
      </ElTable>
    </div>
  </Dialog>
</template>

<style lang="less">
.number-wrap {
  word-wrap: break-word; /* 旧版浏览器支持 */
  overflow-wrap: break-word; /* 标准属性 */
  white-space: wrap;
  display: block;
  max-width: 500px;
}
.text-els {
  width: 100%;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
</style>

<style lang="less" scoped>
:deep(.el-popper) {
  word-wrap: break-word; /* 旧版浏览器支持 */
  overflow-wrap: break-word; /* 标准属性 */
  white-space: wrap;
  display: block;
  max-width: 500px;
}
</style>