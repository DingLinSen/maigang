<template>
  <div
    class="flex h-[22.50vw]"
    :style="personnelHeight ? 'height:' + personnelHeight : ''"
    v-loading="loading"
  >
    <div class="content-left w-[24.22vw] h-full pt-2 pb-2">
      <ul class="overflow-auto h-full">
        <li
          v-for="(item, index) in userDeptListData"
          :key="index"
          class="cursor-pointer"
          :class="item.deptId === selectedFlag ? 'li-active' : ''"
        >
          <div class="flex justify-between items-center h-[40px]" @click="deptClick(item, index)">
            <div class="flex justify-start items-center">
              <!-- <Icon icon="svg-icon:sort_icon" color="#00A0E9" class="mr-[0.52vw] ml-[1.04vw]" /> -->
              <div class="ml-[1.04vw] mr-[0.52vw]">
                <el-checkbox
                  label=""
                  v-model="checkAll[index]"
                  :indeterminate="isIndeterminate[index]"
                  @change="handleCheckAllChange($event, item.deptId, index)"
                />
              </div>
              <h4 class="headImg" v-if="isDeptImg">
                <img src="@/assets/imgs/personalSelect/depart_icon.png" />
              </h4>
              <p class="headText">{{ item.deptName }}</p>
            </div>
            <Icon
              icon="svg-icon:arrow-drop-down-line"
              :class="item.deptId === selectedFlag ? 'drop-down-active' : ''"
              class="mr-[1.77vw] drop-down"
            />
          </div>
          <div v-show="item.deptId === selectedFlag" class="pl-[2.56vw] meuns-content pb-16px">
            <!-- <el-checkbox
                v-model="checkAll"
                :indeterminate="isIndeterminate"
                @change="handleCheckAllChange"
                >全选</el-checkbox
              > -->
            <el-checkbox-group v-model="userData" @change="handleUserDataChange($event, index)">
              <el-checkbox v-for="(item, index) in userListData" :key="index" :label="item.userId">
                {{ item.nickName }}
              </el-checkbox>
            </el-checkbox-group>
          </div>
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
            <span>{{ getUserLabel(item) }}</span>
          </div>
          <img
            class="mr-13px cursor-pointer"
            src="@/assets/imgs/icon/colse_icon.png"
            @click="del(item)"
          />
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, unref, watch } from 'vue'
import { getAllUserListApi, getdeptListApi } from '@/api/user'
import { propTypes } from '@/utils/propTypes'

const props = defineProps({
  modelValue: {
    type: Object,
    default: () => []
  },
  isDeptImg: {
    type: Boolean,
    default: true
  },
  personnelHeight: {
    type: String,
    default: 0
  },
  // 是否允许跨部门
  isTrans: propTypes.bool.def(true)
})

const userListData = ref<any>([])
const userListAllData = ref<any>([])
const userDeptListData = ref<any>([])
const selectedFlag = ref(0)
const userData = ref<any[]>([])
const show = ref<boolean>(false)

const dialogFlag = ref<boolean>(false)

const emit = defineEmits(['update:modelValue'])
const loading = ref(true)

const checkAll = ref<any>([])
const isIndeterminate = ref<any>([])

// 初始化
const init = async () => {
  show.value = true
  let res = await getAllUserListApi({ pageSize: 99999 })
  userListAllData.value = res.data

  let res2 = await getdeptListApi({ pageSize: 99999 })
  userDeptListData.value = res2.data

  loading.value = false
  dialogFlag.value = true

  userData.value = props.modelValue.map((v: any) => v.userId)
  isIndeterminateFun(userData.value)
}

init()

// 全选
const handleCheckAllChange = (val: any, type: any, index) => {
  console.log(val, type, index)
  userListData.value = userListAllData.value.filter((v) => type === v.deptId)
  console.log(userListData.value, 11112312)
  let arr = unref(userListData).map((v) => v.userId)
  let userArr = unref(userData).map((v) => v)
  if (val) {
    userData.value = Array.from(new Set(userArr.concat(arr)))
  } else {
    userData.value = userArr.filter((element) => !arr.includes(element))
  }

  // if (!userListData.value.length && !checkAll.value[index]) {
  //   checkAll.value[index] = true
  // } else if (!userListData.value.length && checkAll.value[index]) {
  //   checkAll.value[index] = false
  // }
  isIndeterminate.value[index] = false
}

const getUserLabel = (value: string): string => {
  let label = ''
  unref(userListAllData).map((item: any) => {
    if (value == item.userId) {
      label = item.nickName
    }
  })
  return label
}

const isInclude = (arr1, arr2) => arr2.every((val) => arr1.includes(val))
// 部门点击
const deptClick = async (dept, index) => {
  if (dept.deptId == selectedFlag.value) {
    selectedFlag.value = 0
    return
  }

  userListData.value = userListAllData.value.filter((v) => dept.deptId === v.deptId)

  selectedFlag.value = dept.deptId
  let arr = unref(userListData).map((v) => v.userId)
  let userArr = unref(userData).map((v) => v)

  if (!userListData.value.length) {
    return
  }

  if (isInclude(userArr, arr)) {
    isIndeterminate.value[index] = false
    checkAll.value[index] = true
  } else {
    let flag = userArr.filter((element) => arr.includes(element))

    if (flag.length) {
      isIndeterminate.value[index] = true
    } else {
      isIndeterminate.value[index] = false
    }
    checkAll.value[index] = false
  }
}

// 员工点击
const handleUserDataChange = (val, index) => {
  if (userListData.value && userListData.value.length > 0) {
    let userArr = unref(userData).map((v) => v)
    let arr = unref(userListData).map((v) => v.userId)
    let arrFlag = arr.filter((element) => !val.includes(element))
    if (arrFlag.length) {
      checkAll.value[index] = false
      let flag = userArr.filter((element) => arr.includes(element))

      if (flag.length) {
        isIndeterminate.value[index] = true
      } else {
        isIndeterminate.value[index] = false
      }
    } else {
      isIndeterminate.value[index] = false
      checkAll.value[index] = true
    }
  }
}

//全删
const allDel = () => {
  userData.value = []
  checkAll.value = new Array(userDeptListData.value.length).fill(false)
  isIndeterminate.value = new Array(userDeptListData.value.length).fill(false)
}

// 删除
const del = (userId) => {
  let arr = [userId]
  let userArr = unref(userData).map((v) => v)
  userData.value = userArr.filter((element) => !arr.includes(element))

  let arrSelect = unref(userListAllData).filter((element) => arr?.includes(element.userId))
  let count: any = []
  userDeptListData.value.forEach((item, index) => {
    arrSelect.forEach((it, ind) => {
      if (it.deptId == item.deptId) {
        if (count.length) {
          const _key = count.some((i) => i == index)
          if (!_key) {
            count.push({ sign: index, deptId: item.deptId })
          }
        } else {
          count.push({ sign: index, deptId: item.deptId })
        }
      }
    })
  })

  count.forEach((ele) => {
    let deptAll = userListAllData.value.filter((v) => ele.deptId === v.deptId)
    let flag = deptAll.filter((element) => userData.value.includes(element.userId))

    if (flag.length == deptAll.length) {
      checkAll.value[ele.sign] = true
      isIndeterminate.value[ele.sign] = false
    } else {
      checkAll.value[ele.sign] = false
      if (flag.length) {
        isIndeterminate.value[ele.sign] = true
      } else {
        isIndeterminate.value[ele.sign] = false
      }
    }
  })
}

// 全选状态回显
const isIndeterminateFun = (data) => {
  let arr = unref(userListAllData).filter((element) => data?.includes(element.userId))
  // 数组第几个
  let count: any = []
  userDeptListData.value.forEach((item, index) => {
    arr.forEach((it, ind) => {
      if (it.deptId == item.deptId) {
        if (count.length) {
          const _key = count.some((i) => i == index)
          if (!_key) {
            count.push({ sign: index, deptId: item.deptId })
          }
        } else {
          count.push({ sign: index, deptId: item.deptId })
        }
      }
    })
  })

  count.forEach((ele) => {
    let deptAll = userListAllData.value.filter((v) => ele.deptId === v.deptId)
    let flag = deptAll.filter((element) => data.includes(element.userId))
    if (flag.length == deptAll.length) {
      checkAll.value[ele.sign] = true
      isIndeterminate.value[ele.sign] = false
    } else {
      checkAll.value[ele.sign] = false
      if (flag.length) {
        isIndeterminate.value[ele.sign] = true
      } else {
        isIndeterminate.value[ele.sign] = false
      }
    }
  })
}

watch(userData, () => {
  let data = {
    userList: unref(userData).map((v) => {
      return {
        userId: v,
        userName: getUserLabel(v)
      }
    })
  }
  emit('update:modelValue', data)
})

defineExpose({
  del,
  allDel
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
  margin: 0 7px;
}

.headText {
  max-width: 18.7vw;
  word-wrap: break-word;
}
</style>
