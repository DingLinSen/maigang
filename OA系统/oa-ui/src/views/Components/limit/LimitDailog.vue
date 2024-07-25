<script lang="ts" setup>
import { ref, watch, nextTick, onMounted } from 'vue'
import { propTypes } from '@/utils/propTypes'
import { useCache } from '@/hooks/web/useCache'
import { getRoleMenuApi } from '@/api/menu'
import { FeedbackForm } from '@/views/FeedbackManage/feedback/components'
import { ChatGptDailog } from './index'
import { useEmitt } from '@/hooks/web/useEmitt'

const { wsCache } = useCache()
const loginUserId = ref<string>(wsCache.get('userInfo').userId) // 登录用户id
const userInfo = ref<any>(wsCache.get('userInfo'))
const props = defineProps({
  limitArray: propTypes.array.def([]),
  routerName: propTypes.string.def(''),
  showLimitButton: propTypes.bool.def(true)
})

const dailogModel = ref<boolean>(true)

watch(
  () => wsCache.get('userInfo'),
  (val: any) => {
    if (val) {
      loginUserId.value = val.userId ? val.userId : ''
      userInfo.value = val
      dailogModel.value = JSON.stringify(userInfo.value.roles).includes('总经理')
    }
  },
  { deep: true, immediate: true }
)

watch(
  () => props.routerName,
  (data: any) => {
    if (data) {
      console.log('prop', data)
      nextTick(() => {
        getRoleMenuData()
      })
    }
  },
  {
    immediate: true
  }
)

// 首字母大写
const titleCase = (str) => {
  let newStr = str.slice(0, 1).toUpperCase() + str.slice(1)
  return newStr
}
const limitArray = ref<any>([])
const titleArray = ref<any>([])
const getRoleMenuData = async () => {
  const res = await getRoleMenuApi(titleCase(props.routerName))
  limitArray.value = []
  titleArray.value = []
  if (res && res.data) {
    titleArray.value.push('see')
    let resData = JSON.stringify(res.data)
    if (resData.indexOf('新增') > -1) {
      titleArray.value.push('add')
    }
    if (resData.indexOf('编辑') > -1) {
      titleArray.value.push('edit')
    }
    if (resData.indexOf('删除') > -1) {
      titleArray.value.push('delete')
    }
    if (resData.indexOf('上传') > -1) {
      titleArray.value.push('upload')
    }
    if (resData.indexOf('导出') > -1) {
      titleArray.value.push('export')
    }
    if (resData.indexOf('下载') > -1) {
      titleArray.value.push('download')
    }
    res.data.forEach((element) => {
      let menu = element.menus
      if (menu.length > 0) {
        let menuStr = JSON.stringify(menu)
        limitArray.value.push({
          roleName: element.roleName,
          see: '1',
          add: menuStr.indexOf('新增') > -1 ? '1' : '',
          edit: menuStr.indexOf('编辑') > -1 ? '1' : '',
          delete: menuStr.indexOf('删除') > -1 ? '1' : '',
          export: menuStr.indexOf('导出') > -1 ? '1' : '',
          download: menuStr.indexOf('下载') > -1 ? '1' : '',
          upload: menuStr.indexOf('上传') > -1 ? '1' : ''
        })
      } else {
        limitArray.value.push({
          roleName: element.roleName,
          see: '1',
          add: '',
          edit: '',
          delete: '',
          export: '',
          download: '',
          upload: ''
        })
      }
    })
  }
}

//领导权限列表是否显示
// const showModel = ref<boolean>(false)

// const showLimit = () => {
//   showModel.value = !showModel.value
// }
//是否是总经理
dailogModel.value = JSON.stringify(userInfo.value.roles).includes('总经理')

//打开新增建议
const feedbackFormSubRef = ref<ComponentRef<typeof FeedbackForm>>()
const openSussessDailog = () => {
  // console.log('openSussessDailog===>')
  feedbackFormSubRef.value.openDrawer('add', '')
}

//
const { emitter } = useEmitt()
const chatGptDailogRef = ref()
const openChatDailog = () => {
  // if (chatGptDailogRef.value) {
  //   chatGptDailogRef.value.openDialog()
  // }
  emitter.emit('chat', 'show')
}

useEmitt({
  name: 'window',
  callback: (type: string) => {
    if (type === 'resize') {
      resetDragDiv()
    }
  }
})

const resetDragDiv = () => {
  setTimeout(() => {
    nextTick()
    let dialogContent: any = document.querySelector('.dialog_content')
    if (dialogContent) {
      dialogContent.style.top = ''
    }
  }, 200)
}

onMounted(()=>{
  emitter.emit('chat', 'guide')
})
</script>

<template>
  <div>
    <div v-dragSwitch="true">
      <div class="dialog_content">
        <div class="dialog_header">
          <div class="chat-button-class mb-[10px]" @click="openChatDailog">
            <img class="chat-img-class" src="@/assets/imgs/home/robot_icon.png" />
          </div>
          <!-- 提建议 -->
          <div class="limit-button-class" @click="openSussessDailog">
            <!-- <div class="feedback-img-class"> </div> -->
            <img class="feedback-img-class" src="@/assets/imgs/home/yjn_icon.png" />
            <!-- <img class="limit-img-class" src="@/assets/imgs/home/yj_icon.png" /> -->
          </div>
          <!-- 领导权限 -->
          <el-popover
            v-if="dailogModel && showLimitButton"
            placement="left"
            :width="'auto'"
            trigger="click"
            :show-arrow="false"
            :offset="15"
          >
            <template #reference>
              <div class="limit-button-class mt-[10px]">
                <img class="limit-img-class" src="@/assets/imgs/home/qxn_icon.png" />
                <!-- <div class="limit-img-class"> </div> -->
                <!-- <img class="limit-img-class" src="@/assets/imgs/home/qxs_icon.png" /> -->
              </div>
            </template>
            <div>
              <el-table
                :border="true"
                :data="limitArray"
                class="article-addform-table"
                maxHeight="560"
              >
                <el-table-column label="角色/权限" prop="roleName" width="188">
                  <template #default="scope">
                    <span class="role-class">{{
                      scope.row.roleName ? scope.row.roleName : '--'
                    }}</span>
                  </template>
                </el-table-column>
                <el-table-column align="center" label="浏览" prop="see" width="56">
                  <template #default="scope">
                    <div class="cell-class">
                      <img
                        v-if="scope.row.see == '1'"
                        class="cell-img"
                        src="@/assets/imgs/home/qx_icon.png"
                    /></div>
                  </template>
                </el-table-column>

                <el-table-column
                  v-if="titleArray.indexOf('add') > -1"
                  align="center"
                  label="新增"
                  prop="add"
                  width="56"
                >
                  <template #default="scope">
                    <div class="cell-class">
                      <img
                        v-if="scope.row.add == '1'"
                        class="cell-img"
                        src="@/assets/imgs/home/qx_icon.png"
                    /></div>
                  </template>
                </el-table-column>

                <el-table-column
                  v-if="titleArray.indexOf('edit') > -1"
                  align="center"
                  label="编辑"
                  prop="edit"
                  width="56"
                >
                  <template #default="scope">
                    <div class="cell-class">
                      <img
                        v-if="scope.row.edit == '1'"
                        class="cell-img"
                        src="@/assets/imgs/home/qx_icon.png"
                    /></div>
                  </template>
                </el-table-column>

                <el-table-column
                  v-if="titleArray.indexOf('delete') > -1"
                  align="center"
                  label="删除"
                  prop="delete"
                  width="56"
                >
                  <template #default="scope">
                    <div class="cell-class">
                      <img
                        v-if="scope.row.delete == '1'"
                        class="cell-img"
                        src="@/assets/imgs/home/qx_icon.png"
                    /></div>
                  </template>
                </el-table-column>

                <el-table-column
                  v-if="titleArray.indexOf('upload') > -1"
                  align="center"
                  label="上传"
                  prop="upload"
                  width="56"
                >
                  <template #default="scope">
                    <div class="cell-class">
                      <img
                        v-if="scope.row.upload == '1'"
                        class="cell-img"
                        src="@/assets/imgs/home/qx_icon.png"
                    /></div>
                  </template>
                </el-table-column>

                <el-table-column
                  v-if="titleArray.indexOf('export') > -1"
                  align="center"
                  label="导出"
                  prop="export"
                  width="56"
                >
                  <template #default="scope">
                    <div class="cell-class">
                      <img
                        v-if="scope.row.export == '1'"
                        class="cell-img"
                        src="@/assets/imgs/home/qx_icon.png"
                    /></div>
                  </template>
                </el-table-column>

                <el-table-column
                  v-if="titleArray.indexOf('download') > -1"
                  align="center"
                  label="下载"
                  prop="download"
                  width="56"
                >
                  <template #default="scope">
                    <div class="cell-class">
                      <img
                        v-if="scope.row.download == '1'"
                        class="cell-img"
                        src="@/assets/imgs/home/qx_icon.png"
                    /></div>
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </el-popover>
        </div>
      </div>
    </div>
  </div>
  <FeedbackForm ref="feedbackFormSubRef" title="意见反馈" />
  <ChatGptDailog ref="chatGptDailogRef" />

</template>

<style lang="less" scoped>

.article-addform-table {
  width: 100%;
  font-size: 14px;
}
:deep(.el-table__header-wrapper th) {
  height: 32px !important;
  background: #f7f8fa !important;
  font-size: 14px;
  font-family: Alibaba PuHuiTi M;
  font-weight: 500 !important;
  color: #000000;
  padding: 0px !important;
}

:deep(.el-table__body td) {
  height: 32px !important;
  padding: 0px !important;
}

.role-class {
  height: 32px;
  width: 188px;
  font-size: 14px;
  font-family: Alibaba PuHuiTi R;
  font-weight: 400;
  color: #000000;
}

.cell-class {
  width: 100%;
  display: flex;
  justify-content: center;
}

.cell-img {
  width: 14px;
  height: 14px;
}

.chat-button-class {
  width: 40px;
  height: 40px;
  background: linear-gradient(90deg, #00a0e9 0%, #7fbe2b 100%);
  box-shadow: 0px 0px 26px 0px rgba(0, 0, 0, 0.2);
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  .chat-img-class {
    width: 18px;
    height: 16px;
    margin-bottom: 2px;
  }
}
.limit-button-class {
  // z-index: 100;
  // position: absolute;
  // right: 45px;
  // bottom: 40px;
  width: 40px;
  height: 40px;
  background: #fbfbfb;
  box-shadow: 0px 0px 26px 0px rgba(0, 0, 0, 0.2);
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  .feedback-img-class {
    width: 18px;
    height: 18px;
    // background: url('@/assets/imgs/home/yjn_icon.png') no-repeat center;
  }
  .limit-img-class {
    width: 18px;
    height: 18px;
    // background: url('@/assets/imgs/home/qxn_icon.png') no-repeat center;
  }
  .chat-img-class {
    width: 18px;
    height: 18px;
  }
}

.limit-button-class:hover {
  .feedback-img-class {
    content: url('@/assets/imgs/home/yjs_icon.png');
  }
  .limit-img-class {
    content: url('@/assets/imgs/home/qxs_icon.png');
  }
  .chat-img-class {
    content: url('@/assets/imgs/home/yjs_icon.png');
  }
}

.limit-wrap-class {
  z-index: 99;
  position: absolute;
  right: 90px;
  bottom: 40px;
  background: #ffffff;
  box-shadow: 0px 0px 26px 0px rgba(0, 0, 0, 0.2);
  border-radius: 4px;
  padding: 11px;
}

.dialog_content {
  position: fixed;
  z-index: 100;
  right: 35px;
  .dialog_header {
    width: 100%;
  }
}
</style>