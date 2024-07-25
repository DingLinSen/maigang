<template>
  <div class="flex h-[22.50vw]" v-loading="loading">
    <div class="content-left w-[24.22vw] h-full pt-2 pb-2">
      <ul class="overflow-auto h-full">
        <li
          v-for="(item, index) in userDeptListData"
          :key="index"
          class="cursor-pointer"
          :class="item.id === selectedFlag ? 'li-active' : ''"
        >
          <div class="flex justify-between items-center h-[40px]" @click="deptClick(item, index)">
            <div class="flex justify-start items-center">
              <!-- <Icon icon="svg-icon:sort_icon" color="#00A0E9" class="mr-[0.52vw] ml-[1.04vw]" /> -->
              <div class="ml-[1.04vw] mr-[0.52vw]">
                <el-checkbox
                  label=""
                  v-model="checkAll[index]"
                  :indeterminate="isIndeterminate[index]"
                  @change="handleCheckAllChange($event, item, null)"
                />
              </div>
              <h4 class="headImg">
                <img src="@/assets/imgs/personalSelect/group_icon.png" />
              </h4>
              <p class="headText">{{ item.name }}</p>
            </div>
            <!-- <Icon
              icon="svg-icon:arrow-drop-down-line"
              :class="item.id === selectedFlag ? 'drop-down-active' : ''"
              class="mr-[1.77vw] drop-down"
            /> -->
          </div>
          <!-- <div v-show="item.id === selectedFlag" class="pl-[2.56vw] meuns-content pb-16px">
            <el-checkbox-group v-model="userData" @change="handleUserDataChange($event, index)">
              <el-checkbox v-for="(item, index) in userListData" :key="index" :label="item.userId">
                {{ item.nickName }}
              </el-checkbox>
            </el-checkbox-group>
          </div> -->
        </li>
      </ul>
    </div>
    <div class="content-right flex-1 h-full border-l-1">
      <div class="h-[2.19vw] mb-[0.26vw] flex justify-between items-center ml-[0.73vw]">
        <span>已选</span>
        <span class="text-sm text-[#00A0E9] mr-[0.52vw] cursor-pointer" @click="allDel()"
          >清空</span
        >
      </div>
      <ul class="h-[19.20vw] overflow-auto">
        <li
          class="bg-[#F4F4F4] h-[2.19vw] rounded flex items-center justify-between mx-[0.31vw] mb-[0.26vw]"
          v-for="(item, index) in userData"
          :key="index"
        >
          <div class="flex items-center">
            <h4 class="headImg leftHeadImg">
              <img src="@/assets/imgs/personalSelect/worker_icon.png" />
            </h4>
            <span class="headText">{{ item.userName }}</span>
          </div>
          <!-- <Icon icon="ion:close-outline" class="mr-10px cursor-pointer" @click="del(item)" /> -->
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, unref, watch } from 'vue'
import { propTypes } from '@/utils/propTypes'
import { getGroupListApi } from '@/api/personal/myGroup'

const props = defineProps({
  modelValue: {
    type: Object,
    default: () => []
  },
  // 是否允许跨群组
  isTrans: propTypes.bool.def(true)
})

const userDeptListData = ref<any>([])
const selectedFlag = ref(0)
const userData = ref<any[]>([])
const show = ref<boolean>(false)
const groupData: any = ref<any[]>([])
const dialogFlag = ref<boolean>(false)

const emit = defineEmits(['update:modelValue'])
const loading = ref(true)

const checkAll = ref<any>([])
const isIndeterminate = ref<any>([])

// 全选
const handleCheckAllChange = (val: any, dept: any, user) => {
  let deptflag = groupData.value.some((v) => v.id == dept.id)
  if (deptflag) {
    groupData.value = groupData.value.filter((element) => ![dept.id].includes(element.id))
    let groupArr = groupData.value.filter((v) => {
      return v.id != dept.id
    })
    let arr: any = []
    if (user) {
      let count = -1
      userDeptListData.value.forEach((v, index) => {
        if (v.id == dept.id) {
          count = index
        }
      })

      if (count > 0) {
        checkAll.value[count] = true
      }
      arr = user
    } else {
      groupArr.forEach((v) => {
        arr = arr.concat(v.users)
      })
    }
    userData.value = qchong(arr)
  } else {
    let pushArr = userDeptListData.value.filter((v) => v.id == dept.id)
    groupData.value = [...groupData.value, ...pushArr]
    let arr: any = []
    if (user) {
      let count = -1
      userDeptListData.value.forEach((v, index) => {
        if (v.id == dept.id) {
          count = index
        }
      })

      if (count > 0) {
        checkAll.value[count] = true
      }

      arr = [...userData.value, ...user]
    } else {
      arr = [...userData.value, ...dept.users]
    }

    userData.value = qchong(arr)
  }
}
// 初始化
const init = async () => {
  show.value = true
  let res2 = await getGroupListApi({ pageSize: 99999 })
  userDeptListData.value = res2.data
  loading.value = false
  dialogFlag.value = true
  props.modelValue.forEach((item) => {
    let arr = userDeptListData.value.filter((v) => item.id === v.id)
    handleCheckAllChange(null, item, arr[0].users)
  })
}

init()

const qchong = (tempArr) => {
  let newArr = []
  for (let i = 0; i < tempArr.length; i++) {
    if (newArr.indexOf(tempArr[i].userId) == -1) {
      newArr.push(tempArr[i].userId)
    } else {
      tempArr.splice(i, 1)
      i--
    }
  }
  return tempArr
}

// 群组点击
const deptClick = async (dept, index) => {
  if (dept.id == selectedFlag.value) {
    selectedFlag.value = 0
    return
  }

  selectedFlag.value = dept.id
}

//全删
const allDel = () => {
  groupData.value = []
  userData.value = []
  checkAll.value = new Array(userDeptListData.value.length).fill(false)
  isIndeterminate.value = new Array(userDeptListData.value.length).fill(false)
}

// 删除
const del = (id) => {
  groupData.value = groupData.value.filter((element) => ![id].includes(element.id))
  let count = -1
  userDeptListData.value.map((v, index) => {
    if (v.id == id) {
      count = index
    }
  })

  if (count > -1) {
    checkAll.value[count] = false
  }

  let groupArr = groupData.value.filter((v) => {
    return v.id != id
  })
  let arr: any = []
  groupArr.forEach((v) => {
    arr = arr.concat(v.users)
  })
  userData.value = qchong(arr)
}

watch([userData, groupData], () => {
  let data = {
    group: unref(groupData),
    userList: unref(userData)
  }
  emit('update:modelValue', data)
})

defineExpose({
  allDel,
  del
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

.headImg {
  width: 26px;
  height: 26px;
  margin-right: 8px;
  img {
    width: 100%;
    height: 100%;
  }
}

.leftHeadImg {
  margin: 0 7px !important;
}

.headText {
  max-width: 18.7vw;
  word-wrap: break-word;
}
</style>
