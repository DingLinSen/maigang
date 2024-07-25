<!-- 审批记录 -->
<script setup lang="ts">
import { nextTick, ref, watch } from 'vue'
import { Dialog } from '@/components/Dialog'
import { getCustomerDetailApi } from '@/api/customer'

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

const dialogHeight = ref<string>('350px')
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
    const res = await getCustomerDetailApi(props.pid).finally(() => {
      loading.value = false
    })
    if (res && res.data) {
      tableData.value = res.data.audits
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
        <ElTableColumn prop="createTime" label="日期" width="180">
          <template #default="scope">
            <span> {{ scope.row.createTime || '--' }}</span>
          </template>
        </ElTableColumn>
        <ElTableColumn prop="createByName" label="操作人" width="100" />
        <ElTableColumn prop="flag" label="审批状态" show-overflow-tooltip width="100">
          <template #default="scope">
            <span>
              {{
                !scope.row.step
                  ? '新增'
                  : scope.row.step === '已通过'
                  ? '同意'
                  : scope.row.step === '已驳回'
                  ? '驳回'
                  : scope.row.step === '编辑'
                  ? '编辑'
                  : '--'
              }}</span
            >
          </template>
        </ElTableColumn>
        <!-- <ElTableColumn
          prop="content"
          label="内容"
          show-overflow-tooltip
          min-width="100"
          :tooltip-options="{
            enterable: true,
            placement: 'top',
            showArrow: true,
            hideAfter: 200,
            popperOptions: { strategy: 'fixed' }
          }"
          ><template #default="scope">
            <span> {{ scope.row.content }}</span>
          </template>
        </ElTableColumn> -->
        <ElTableColumn prop="reason" label="审核意见" min-width="150"
          ><template #default="scope">
            <p class="dan" :title="scope.row.explain"> {{ scope.row.explain ? scope.row.explain : '--' }}</p>
          </template>
        </ElTableColumn>
      </ElTable>
    </div>
  </Dialog>
</template>

<style lang="less">
.dan {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>