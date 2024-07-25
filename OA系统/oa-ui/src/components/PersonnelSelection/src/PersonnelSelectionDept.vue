<template>
  <ElDialog ref="elDialogFef" v-model="show" :title="'选择人员'" @closed="close()">
    <!-- <div class="personnel-selection" v-if="show">
      <div class="personnel-selection-main" v-loading="loading"> -->
    <!-- <header class="text-#333 text-base py-[1.04vw] px-[0.92vw] flex justify-between items-center">
      <span>选择人员</span>
      <Icon icon="material-symbols:close" class="cursor-pointer" @click="close()" />
    </header> -->
    <section
      class="personnel-selection-content flex h-[22.50vw] mx-[1.67vw] pt--[0.16vw] border-1 h-full"
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
                <p>{{ item.deptName }}</p>
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
                <el-checkbox
                  v-for="(item, index) in userListData"
                  :key="index"
                  :label="item.userId"
                >
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
          <span class="text-sm text-[#ff3939] mr-[0.52vw] cursor-pointer" @click="allDel()"
            >全部删除</span
          >
        </div>
        <ul class="h-[19.20vw] overflow-auto">
          <li
            class="bg-[#F4F4F4] h-[2.19vw] rounded flex items-center justify-between mx-[0.31vw] mb-[0.26vw]"
            v-for="(item, index) in userData"
            :key="index"
          >
            <span class="ml-[0.42vw]">{{ getUserLabel(item) }}</span>
            <Icon icon="ion:close-outline" class="mr-10px cursor-pointer" @click="del(item)" />
          </li>
        </ul>
      </div>
    </section>
    <!-- <div class="pt-[3.18vw] flex justify-end mr-[1.67vw]">
      <div class="btn bg-[#F9F9F9] text-[#191919]] mr-[0.625vw] cursor-pointer" @click="close()"
        >取消</div
      >
      <div class="btn bg-[#00A0E9] text-[#FFF] cursor-pointer" @click="submit()">确定</div>
    </div> -->
    <template #footer>
      <div class="footer">
        <el-button type="primary" :loading="loading" @click="submit()">提交</el-button>
        <el-button class="mr-[1.67vw]" @click="close()">取消</el-button>
      </div>
    </template>
    <!-- </div>
    </div> -->
  </ElDialog>
</template>

<script setup lang="ts">
import { ref, unref, watch } from 'vue'
import { ElDialog } from '@/components/ElDialog'
import { getAllUserListApi, getdeptListApi, userSelectByPmApi } from '@/api/user'
import { useCache } from '@/hooks/web/useCache'

const userListData = ref<any>([])
const userListAllData = ref<any>([])
const userDeptListData = ref<any>([])
const selectedFlag = ref(0)
const userData = ref<any[]>([])
const show = ref<boolean>(false)

const dialogFlag = ref<boolean>(false)

const { wsCache } = useCache()

const init = async () => {
  let res = await getAllUserListApi({ pageSize: 99999 })
  userListAllData.value = res.data
  userDeptListData.value = []
  if (JSON.stringify(wsCache.get('userInfo').dept).indexOf('高管') > -1) {
    let res0 = await userSelectByPmApi({})
    if (res0.data.length) {
      userDeptListData.value.push(res0.data[0].dept)
    }
  } else {
    userDeptListData.value.push(wsCache.get('userInfo').dept)
  }
  loading.value = false
  dialogFlag.value = true
}

init()

const openDialog = (selectUser: any[]) => {
  let tempStateList: boolean[] = []
  checkAll.value.forEach((element: boolean) => {
    tempStateList.push(false)
  })
  selectedFlag.value = 0
  loading.value = false
  checkAll.value = tempStateList
  userData.value = selectUser
  deptClick(userDeptListData.value[0], 0)
  isIndeterminateFun(selectUser)
  show.value = true
}

const emit = defineEmits(['sureClick'])
const loading = ref(true)

const checkAll = ref<any>([])
const isIndeterminate = ref<any>([])

// 全选
const handleCheckAllChange = (val: any, type: any, index) => {
  userListData.value = userListAllData.value.filter((v) => type === v.deptId)
  let arr = unref(userListData).map((v) => v.userId)
  let userArr = unref(userData).map((v) => v)

  if (val) {
    userData.value = Array.from(new Set(userArr.concat(arr)))
  } else {
    userData.value = userArr.filter((element) => !arr.includes(element))
  }
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

// 提交
const submit = () => {
  let arr = unref(userData).map((v) => v)
  show.value = false
  emit('sureClick', arr)
}

// 取消
const close = () => {
  show.value = false
  userData.value = []
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
</style>
