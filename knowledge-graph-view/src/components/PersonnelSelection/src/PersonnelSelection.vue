<template>
  <ElDialog
    class="personClass"
    ref="elDialogFef"
    width="42%"
    v-model="show"
    :title="'选择人员'"
    @closed="close()"
  >
    <ul class="tagNav">
      <li v-if="isUser" @click="navClick(1)" :class="1 == navFlag ? 'active' : ''">选择人员</li>
      <li v-if="isDept" @click="navClick(2)" :class="2 == navFlag ? 'active' : ''">选择部门</li>
      <li v-if="isGroup" @click="navClick(3)" :class="3 == navFlag ? 'active' : ''">选择群组</li>
    </ul>
    <section class="personnel-selection-content mx-[1.67vw] pt--[0.16vw] border-1 h-full mb-20px">
      <Personnel ref="personnelRef" v-if="isUser" v-show="navFlag == 1" v-model="userData" />
      <Department ref="departmentRef" v-if="isDept" v-show="navFlag == 2" v-model="deptData" />
      <Group ref="groupRef" v-if="isGroup" v-show="navFlag == 3" v-model="groupData" />
      <div class="content-all relative">
        <p class="text-sm text-[#00A0E9] mr-[0.52vw] cursor-pointer qingkong" @click="allDel()"
          >清空</p
        >
        <ul class="content-all-person">
          <li v-for="(item, index) in userData.userList" :key="index" @click="navClick(1)">
            <h4>
              <img src="@/assets/imgs/personalSelect/worker_icon.png" />
              <b @click="del(item.userId, 'user')"></b>
            </h4>
            <p :title="item.userName">{{ item.userName }}</p>
          </li>
          <li v-for="(item, index) in deptData.dept" :key="index" @click="navClick(2)">
            <h4>
              <img src="@/assets/imgs/personalSelect/depart_icon.png" />
              <b @click="del(item.deptId, 'dept')"></b>
            </h4>
            <p :title="item.deptName">{{ item.deptName }}</p>
          </li>
          <li v-for="(item, index) in groupData.group" :key="index" @click="navClick(3)">
            <h4>
              <img src="@/assets/imgs/personalSelect/group_icon.png" />
              <b @click="del(item.id, 'group')"></b>
            </h4>
            <p :title="item.name">{{ item.name }}</p>
          </li>
        </ul>
      </div>
    </section>

    <template #footer>
      <div class="footer my-20px">
        <el-button class="footer_btn" type="primary" :loading="loading" @click="submit()"
          >提交</el-button
        >
        <el-button class="footer_btn mr-[1.67vw]" @click="close()">取消</el-button>
      </div>
    </template>
  </ElDialog>
</template>

<script setup lang="ts">
import { ref, unref, nextTick } from 'vue'
import { ElDialog } from '@/components/ElDialog'
import { propTypes } from '@/utils/propTypes'
import Department from './department.vue'
import Personnel from './personnel.vue'
import Group from './group.vue'

const props = defineProps({
  isUser: propTypes.bool.def(true),
  isDept: propTypes.bool.def(true),
  isGroup: propTypes.bool.def(true),
  // 是否允许跨部门
  isTrans: propTypes.bool.def(true)
})

const navFlag = ref(1)
const userData: any = ref<any[]>([])
const deptData: any = ref<any[]>([])
const groupData: any = ref<any[]>([])

const show = ref<boolean>(false)
const personnelRef = ref()
const departmentRef = ref()
const groupRef = ref()
const dialogFlag = ref<boolean>(false)

interface Config {
  userData: string[]
  deptData: string[]
  groupData: string[]
}

const openDialog = (data: Config) => {
  navFlag.value = 1
  userData.value = data.userData ? data.userData : []
  deptData.value = data.deptData ? data.deptData : []
  groupData.value = data.groupData ? data.groupData : []

  if (deptData.value.length && !userData.value.length) {
    navFlag.value = 2
  } else if (groupData.value.length && !deptData.value.length && !userData.value.length) {
    navFlag.value = 3
  }

  show.value = true
}

const navClick = (e) => {
  navFlag.value = e
}

const emit = defineEmits(['sureClick'])
const loading = ref(true)

// 初始化
const init = async () => {
  loading.value = false
  dialogFlag.value = true
}

init()

//全删
const allDel = () => {
  personnelRef.value.allDel()
  departmentRef.value.allDel()
  groupRef.value.allDel()
}

// 删除
const del = (id, type) => {
  if (type == 'user') {
    personnelRef.value.del(id)
  } else if (type == 'dept') {
    departmentRef.value.del(id)
  } else if (type == 'group') {
    groupRef.value.del(id)
  }
}

// 提交
const submit = () => {
  let obj = {
    personalData: unref(userData),
    deptData: unref(deptData),
    groupData: unref(groupData)
  }
  show.value = false
  emit('sureClick', obj)
}

// 取消
const close = () => {
  show.value = false
  userData.value = []
  deptData.value = []
  groupData.value = []
}

defineExpose({
  openDialog
})
</script>

<style lang="less" scoped>
.drop-down {
  font-size: 20px !important;
  color: #000000;
}
.drop-down-active {
  transform: rotate(180deg) !important;
}
.li-active {
  background: #f4f4f4;
}
.personnel-selection {
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  background: rgba(0, 0, 0, 0.3);
  z-index: 9999;

  .personnel-selection-main {
    font-family: 'Alibaba PuHuiTi R';
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    height: 33.23vw;
    width: 40.625vw;
    background: #fff;
  }
  .btn {
    width: 5.21vw;
    height: 2.19vw;
    border: 1px solid #d9d9d9;
    border-radius: 4px;
    text-align: center;
    line-height: 2.19vw;
    font-size: 16px;
  }
}
.meuns-content {
  transition-duration: 0.5s;
}
</style>
<style lang="less">
.personnel-selection {
  .el-checkbox {
    margin-right: 10px !important;
  }
  .el-checkbox__label {
    width: 3.7vw !important;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
}

.personClass .el-dialog__body {
  padding: 10px 0 !important;
}

.personClass .el-dialog__header {
  background: #fff !important;
  border-color: #fff !important;
  > div {
    span + div {
      display: none !important;
    }
  }
}
.tagNav {
  display: flex;
  margin: 0 1.67vw 10px;
  li {
    font-weight: 400;
    font-size: 14px;
    color: #666666;
    cursor: pointer;
    text-align: left;
    padding-bottom: 5px;
    margin: 10px 10px 2px 0;
  }
  .active {
    font-weight: bold;
    font-size: 14px;
    color: #333333;
    border-bottom: 3px solid #00a0e9;
  }
}

.content-all {
  // width: 713px;
  height: 100px;
  border-radius: 0px 0px 4px 4px;
  border-top: 1px solid #e2e2e2;
  // background: #ff0;
  .content-all-person {
    overflow-x: scroll;
    height: 100%;
    display: flex;
    margin: 0 60px 0 20px;
    align-items: center;
    li {
      display: flex;
      width: 52px;
      justify-content: center;
      align-items: center;
      flex-direction: column;
      margin-right: 22px;
      padding-top: 10px;
      h4 {
        position: relative;
        width: 26px;
        height: 26px;
        background: linear-gradient(0deg, #008ee4 0%, #009fff 100%);
        border-radius: 50%;
        img {
          width: 100%;
          height: 100%;
        }
      }

      p {
        font-family: Microsoft YaHei;
        font-weight: 400;
        text-align: center;
        font-size: 14px;
        color: #222222;
        line-height: 34px;
        width: 52px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
    }
    li:hover {
      h4 {
        b {
          cursor: pointer;
          content: '';
          position: absolute;
          display: block;
          width: 12px;
          height: 12px;
          border-radius: 50%;
          right: -6px;
          top: -6px;
          background: url('@/assets/imgs/personalSelect/normal_close_icon.png') no-repeat;
          background-size: 100% 100%;
        }
      }
    }
  }
}
.qingkong {
  position: absolute;
  right: 14px;
  top: 14px;
  z-index: 999;
}

.footer_btn {
  width: 100px;
  height: 42px;
  // background: #f9f9f9;
  border-radius: 4px;
  // border: 1px solid #d9d9d9;
}
</style>
