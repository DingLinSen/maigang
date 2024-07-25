<template>
  <div class="message">
    <div
      style="z-index: 99"
      class="flex z-10 relative items-center bg-[var(--top-header-bg-color)] border-solid border-[var(--top-tool-border-color)] dark:border-[var(--el-border-color)]"
    >
      <Logo
        class="hover-trigger !pr-15px w-[var(--left-menu-max-smal-screen-width)] 2xl:w-[var(--left-menu-max-width)]"
        style="z-index: 22"
      ></Logo>
      <ToolHeader class="flex-1"></ToolHeader>
    </div>
    <div class="message-container">
      <div class="message-list">
        <h3>消息列表</h3>
        <ul>
          <li @click="navClick(item.messageType)" v-for="(item, index) in navData" :key="index"
            ><p
              v-if="item.messageType != 2 || (powerFlag && item.messageType == 2)"
              class="p_list"
              :class="item.messageType == activeFlag ? 'active' : ''"
              >{{ item.name }}
              <b class="bubble" v-show="item.messageNum > 0">{{
                item.messageNum > 99 ? '99+' : item.messageNum
              }}</b>
            </p></li
          >
        </ul>
        <div class="all-read"
          ><span class="cursor-pointer" @click="readClick(null)">全部已读</span></div
        >
        <Table
          v-if="tableObject.tableList.length"
          v-model:pageSize="tableObject.pageSize"
          v-model:currentPage="tableObject.currentPage"
          :border="false"
          :selectionWidth="20"
          :columns="allSchemas.tableColumns"
          :data="tableObject.tableList"
          :loading="tableObject.loading"
          cotentAlign="left"
          headerAlign="left"
          :statisticsList="true"
          :index="true"
          :height="defaultHeight"
          :isShowFilter="false"
          :selection="false"
          :pagination="{
            total: tableObject.total
          }"
          @register="register"
        >
          <template #action="{ row }">
            <div class="read" @click="readClick(row)" v-if="row.isRead == 0"> 已读 </div>
          </template>
        </Table>
        <NoData :heigth="defaultHeight" v-else />
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import ToolHeader from '@/layout/components/ToolHeader.vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Logo } from '@/components/Logo'
import { ref, reactive, h, nextTick, onMounted, watch, computed } from 'vue'
import { Table } from '@/components/Table'
import { useEmitt } from '@/hooks/web/useEmitt'
import { useTable } from '@/hooks/web/useTable'
import { useCache } from '@/hooks/web/useCache'
import { CrudSchema, useCrudSchemas } from '@/hooks/web/useCrudSchemas'
import { getMessageListApi, readApi, readAllApi } from '@/api/message'
import { useToMessageStore } from '@/store/modules/toMessage'
import { useWebSocketStore } from '@/store/modules/webSocket'

const store = useWebSocketStore()
const messageStore = useToMessageStore()
const storeType = messageStore.getToMessageData
const webSocketStoreData: any = computed(() => store.getWebSocketData)
const { wsCache } = useCache()
const powerFlag = ref(false)

const { register, tableObject, methods } = useTable<TableData>({
  getListApi: getMessageListApi,
  response: {
    list: 'rows',
    total: 'total'
  }
})
const { getList, setSearchParams } = methods

const activeFlag = ref(0)
const navClick = (e) => {
  activeFlag.value = e
  let params = {
    messageType: e ? e : null
  }
  setSearchParams(params)
}

const navData = reactive([
  {
    messageType: 0,
    name: '全部消息',
    messageNum: webSocketStoreData.value.length
  },
  {
    messageType: 1,
    name: '审批消息',
    messageNum: webSocketStoreData.value.filter((v) => v.messageType == 1).length
  },
  {
    messageType: 2,
    name: '待办消息',
    messageNum: webSocketStoreData.value.filter((v) => v.messageType == 2).length
  },
  {
    messageType: 3,
    name: '系统消息',
    messageNum: webSocketStoreData.value.filter((v) => v.messageType == 3).length
  }
])

if (storeType) {
  activeFlag.value = storeType
  setSearchParams({ messageType: storeType ? storeType : null })
} else {
  getList()
}
;``
// 存放表格的数据
const crudSchemas = reactive<CrudSchema[]>([
  // {
  //   field: 'id',
  //   label: '序号',
  //   width: '60px'
  // },
  {
    field: 'content',
    label: '消息内容',
    minWidth: '350px',
    formatter: (row: Recordable) => {
      return h('span', row.content ? row.content : '--')
    }
  },
  {
    field: 'createTime',
    label: '接收时间',
    minWidth: '120px',
    formatter: (row: Recordable) => {
      return h('span', row.createTime ? row.createTime : '--')
    }
  },
  {
    field: 'messageType',
    label: '消息类型',
    minWidth: '80px',
    formatter: (row: Recordable) => {
      return h('span', row.messageType ? getElTagLabel(row.messageType) : '--')
    }
  },
  {
    field: 'isRead',
    label: '消息状态',
    minWidth: '80px',
    formatter: (row: Recordable) => {
      return h('span', row.isRead ? (row.isRead == 0 ? '未读' : '已读') : '--')
    }
  },
  {
    field: 'action',
    label: '操作',
    headerAlign: 'center',
    minWidth: '80px'
  }
])
const { allSchemas } = useCrudSchemas(crudSchemas)

// 已读
const readClick = async (row?) => {
  if (row) {
    let res = await readApi({
      messageIds: row.messageId
    })
    if (res) {
      ElMessage.success('操作成功！')
      getList()
    }
  } else {
    ElMessageBox.confirm('是否已读' + getElTagLabel(activeFlag.value) + '？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
      autofocus: false
    }).then(async () => {
      let res = await readAllApi({
        messageType: activeFlag.value ? activeFlag.value : null
      })
      if (res) {
        ElMessage.success('操作成功！')
        getList()
      }
    })
  }
}

const getElTagLabel = (value: Number): string => {
  let label = '--'
  navData.forEach((item: any) => {
    if (Number(value) === Number(item.messageType)) {
      label = item.name
    }
  })
  return label
}
const getOverViewWrapper = (dom: string): number => {
  let topH = 0
  const checkboxWrapper = document.querySelector(dom)
  if (checkboxWrapper) {
    topH = checkboxWrapper.clientHeight
  }
  return topH
}

const getPadding = (dom: string): number => {
  let topH = 0
  const checkboxWrapper = document.querySelector(dom)
  if (checkboxWrapper) {
    topH =
      parseFloat(getComputedStyle(checkboxWrapper).paddingBottom) +
      parseFloat(getComputedStyle(checkboxWrapper).paddingTop) +
      parseFloat(getComputedStyle(checkboxWrapper).marginBottom) +
      parseFloat(getComputedStyle(checkboxWrapper).marginTop)
  }
  return topH
}
const defaultHeight = ref<number>(0)
const resetTableHeight = () => {
  const documentClientHeight: number = getOverViewWrapper('.message-container')
  const h_h3: number = getOverViewWrapper('.message-container h3')
  const h_ul: number = getOverViewWrapper('.message-container ul')
  const h_read: number = getOverViewWrapper('.message-container .all-read')

  const p_container: number = getPadding('.message-container')
  const p_h3: number = getPadding('.message-container h3')
  const p_ul: number = getPadding('.message-container ul')
  const p_read: number = getPadding('.message-container .all-read')

  nextTick(() => {
    defaultHeight.value =
      documentClientHeight - h_h3 - h_ul - h_read - p_container - p_h3 - p_ul - p_read
    // console.log(11111, defaultHeight.value)
    // uploadTablePadding * 4
  })
}
useEmitt({
  name: 'window',
  callback: (type: string) => {
    if (type === 'resize') {
      resetTableHeight()
    }
  }
})

nextTick(() => {
  if (wsCache.get('userInfo')) {
    if (
      wsCache.get('userInfo').roles.some((v) => v.roleKey == 'admin' || v.roleKey == 'manager') ||
      wsCache.get('userInfo').admin
    ) {
      powerFlag.value = true
    } else {
      powerFlag.value = false
    }
  }
})

watch(
  () => messageStore.getToMessageData,
  (value) => {
    activeFlag.value = value
    setSearchParams({ messageType: value ? value : null })
  }
)

watch(
  () => store.getWebSocketData.length,
  (value) => {
    navData[0].messageNum = store.getWebSocketData.length
    navData[1].messageNum = store.getWebSocketData.filter((v) => v.messageType == 1).length
    navData[2].messageNum = store.getWebSocketData.filter((v) => v.messageType == 2).length
    navData[3].messageNum = store.getWebSocketData.filter((v) => v.messageType == 3).length
  },
  {
    immediate: true
  }
)
onMounted(() => {
  resetTableHeight()
})
</script>
<style scoped lang="less">
.message {
  height: 100vh;
  background: #fff;
  .message-container {
    padding: 35px 0;
    width: 100%;
    height: calc(100vh - var(--top-tool-height));
    background: #f4f4f4;
    border-radius: 2px;
  }
  .message-list {
    padding: 0 40px;
    margin: auto;
    width: 1200px;
    height: calc(100vh - var(--top-tool-height) - 70px);
    background: #ffffff;
    border-radius: 2px;
    h3 {
      font-family: Microsoft YaHei;
      font-weight: bold;
      font-size: 14px;
      color: #333333;
      line-height: 0;
      padding: 26px 0;
      border-bottom: 1px solid #f1f2f4;
    }
    ul {
      padding-top: 8px;
      display: flex;
      li {
        p {
          position: relative;
          cursor: pointer;
          margin-right: 23px;
          font-family: Microsoft YaHei;

          font-size: 14px;
          color: #333333;
          line-height: 35px;
          border-bottom: 3px solid #fff;
          // &:last-child {
          // margin-right: 0;
          // }
        }
        .active {
          font-weight: bold;
          border-bottom: 3px solid #00a0e9;
        }
      }
    }
    .all-read {
      // display: none;
      font-family: Microsoft YaHei;
      font-weight: 400;
      font-size: 14px;
      color: #00a0e9;
      // padding: 15px 0;
      line-height: 50px;
    }
    .all-read span:hover {
      font-weight: 400;
      font-size: 14px;
      color: #0db3ff;
      text-decoration-line: underline;
    }
    .all-read span:active {
      font-weight: 400;
      font-size: 14px;
      color: #0092d4;
    }
  }
}
.read {
  cursor: pointer;
  text-align: center;
  font-family: Microsoft YaHei;
  font-weight: 400;
  font-size: 14px;
  color: #00a0e9;
}
:deep(.top_search) {
  visibility: hidden;
}

.bubble {
  padding: 0 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  // width: 14px;
  height: 14px;
  background: #ff5967;
  border-radius: 7px;
  font-family: Microsoft YaHei;
  font-weight: 400;
  font-size: 10px;
  color: #ffffff;
  line-height: 80px;
  position: absolute;
  right: -10px;
  top: 0;
}
.iconBubble {
}

:deep(.el-table__header th) {
  height: 50px;
  background: #f1f2f4;
  font-family: Microsoft YaHei;
  font-weight: 400;
  font-size: 14px;
  color: #444444;
  opacity: 0.8;
}

:deep(.el-table__header td) {
  height: 55px;
  background: #f1f2f4;
  border-bottom: 1px solid #f1f2f4 !important;
  font-family: Microsoft YaHei;
  font-weight: 400;
  font-size: 14px;
  color: #222222;
  line-height: 55px;
}
:deep(.el-checkbox__inner) {
  width: 16px;
  height: 16px;
  background: #ffffff;
  border-radius: 2px;
  border: 1px solid #c3c3c3;
}
:deep(.el-checkbox__inner::after) {
  width: 5px;
  height: 9px;
}
:deep(.el-checkbox__inner::before) {
  width: 14px;
  top: 6px !important;
}
</style>
